"""
AI routes for chat completion with GPT-4o
"""
from fastapi import APIRouter, HTTPException
from models.schemas import ChatRequest, ChatResponse
from services.openai_service import get_openai_service
from services.unified_calendar import UnifiedCalendarService
from routes.auth import get_google_credentials, get_yahoo_credentials
from datetime import datetime, timedelta
from typing import Dict
import dateparser
import json
import logging

router = APIRouter(prefix="/api/ai", tags=["ai"])
logger = logging.getLogger(__name__)


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, user_id: str = "default"):
    """
    Get chat completion from GPT-4o or GPT-4o-mini with calendar function calling
    
    Args:
        request: User message and conversation history
        user_id: User identifier for calendar access
        
    Returns:
        AI response text and model used
    """
    try:
        logger.info(f"Processing chat request: {request.message[:50]}...")
        
        # Determine which model to use
        service = get_openai_service()
        use_mini = service.should_use_mini_model(request.message)
        
        # Get chat completion (with function calling)
        response_text, model_used, tool_call = await service.chat_completion(
            message=request.message,
            conversation_history=request.conversation_history,
            use_mini=use_mini
        )
        
        # Handle function calls
        if tool_call:
            function_name = tool_call.function.name
            function_args = json.loads(tool_call.function.arguments)
            
            logger.info(f"Function call requested: {function_name}")
            
            try:
                # Execute calendar function
                result = await execute_calendar_function(
                    function_name, 
                    function_args, 
                    user_id
                )
                
                # Return natural language response about what was done
                response_text = result.get('message', 'Done!')
                
            except Exception as e:
                logger.error(f"Function execution failed: {e}")
                response_text = f"Sorry, I couldn't complete that calendar action: {str(e)}"
        
        return ChatResponse(
            response=response_text,
            model_used=model_used
        )
    
    except Exception as e:
        logger.error(f"Chat completion failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")


async def execute_calendar_function(function_name: str, args: Dict, user_id: str) -> Dict:
    """
    Execute calendar function called by AI
    
    Args:
        function_name: Name of function to execute
        args: Function arguments
        user_id: User identifier
    
    Returns:
        Result dictionary with message and data
    """
    try:
        google_creds = get_google_credentials(user_id)
        yahoo_creds = get_yahoo_credentials(user_id)
        
        if not google_creds and not yahoo_creds:
            raise Exception("No calendars connected. Please connect Google or Yahoo Calendar first.")
        
        unified_service = UnifiedCalendarService(google_creds, yahoo_creds)
        
        if function_name == "create_calendar_event":
            # Parse start time
            start_time = dateparser.parse(args['start_time'])
            if not start_time:
                raise Exception(f"Could not parse time: {args['start_time']}")
            
            # Calculate end time
            duration = args.get('duration_minutes', 60)
            end_time = start_time + timedelta(minutes=duration)
            
            # Determine which calendar to use
            calendar_choice = args.get('calendar', 'google').lower()
            
            if calendar_choice == 'yahoo' and yahoo_creds:
                calendar_id = 'yahoo_primary'
            elif google_creds:
                # Use primary Google calendar
                calendars = await unified_service.google_service.list_calendars()
                primary = next((c for c in calendars if c.get('is_primary')), calendars[0])
                calendar_id = primary['id']
            else:
                raise Exception("Requested calendar not connected")
            
            # Create event
            event = await unified_service.create_event(
                calendar_id=calendar_id,
                title=args['title'],
                start_time=start_time,
                end_time=end_time,
                location=args.get('location')
            )
            
            return {
                'message': f"Done! I've scheduled '{args['title']}' for {start_time.strftime('%A, %B %d at %I:%M %p')}.",
                'event': event
            }
        
        elif function_name == "list_calendar_events":
            # Parse time range
            time_range = args['time_range'].lower()
            
            now = datetime.now()
            if 'today' in time_range:
                time_min = now.replace(hour=0, minute=0, second=0)
                time_max = now.replace(hour=23, minute=59, second=59)
            elif 'tomorrow' in time_range:
                tomorrow = now + timedelta(days=1)
                time_min = tomorrow.replace(hour=0, minute=0, second=0)
                time_max = tomorrow.replace(hour=23, minute=59, second=59)
            elif 'week' in time_range:
                time_min = now
                time_max = now + timedelta(days=7)
            else:
                # Default to next 7 days
                time_min = now
                time_max = now + timedelta(days=7)
            
            # Get events
            events = await unified_service.list_all_events(None, time_min, time_max)
            
            if not events:
                return {'message': f"You don't have any events {time_range}."}
            
            # Format response
            event_list = "\n".join([
                f"- {e['title']} on {datetime.fromisoformat(e['start_time'].replace('Z', '')).strftime('%A %I:%M %p')}"
                for e in events[:10]  # Limit to 10 events
            ])
            
            return {
                'message': f"Here's what's on your calendar {time_range}:\n{event_list}",
                'events': events
            }
        
        elif function_name == "delete_calendar_event":
            # Find event by title
            events = await unified_service.list_all_events()
            
            event_title = args['event_title'].lower()
            matching_event = next(
                (e for e in events if event_title in e['title'].lower()),
                None
            )
            
            if not matching_event:
                return {'message': f"I couldn't find an event called '{args['event_title']}' on your calendar."}
            
            # Delete event
            await unified_service.delete_event(
                matching_event['calendar_id'],
                matching_event['id']
            )
            
            return {
                'message': f"Done! I've cancelled '{matching_event['title']}'.",
                'event': matching_event
            }
        
        else:
            raise Exception(f"Unknown function: {function_name}")
    
    except Exception as e:
        logger.error(f"Calendar function execution failed: {e}")
        raise Exception(str(e))
