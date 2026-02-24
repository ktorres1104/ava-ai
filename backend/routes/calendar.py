"""
Calendar routes for CRUD operations
"""
from fastapi import APIRouter, HTTPException
from models.schemas import (
    CalendarSource, CalendarEvent, CreateEventRequest,
    UpdateEventRequest, EventsQueryRequest
)
from services.unified_calendar import UnifiedCalendarService
from routes.auth import get_google_credentials, get_yahoo_credentials
from datetime import datetime, timedelta
from typing import List, Optional
import dateparser
import logging

router = APIRouter(prefix="/api/calendar", tags=["calendar"])
logger = logging.getLogger(__name__)


def get_unified_service(user_id: str = "default") -> UnifiedCalendarService:
    """Get unified calendar service for user"""
    google_creds = get_google_credentials(user_id)
    yahoo_creds = get_yahoo_credentials(user_id)
    
    if not google_creds and not yahoo_creds:
        raise HTTPException(status_code=401, detail="No calendars connected")
    
    return UnifiedCalendarService(google_creds, yahoo_creds)


@router.get("/calendars", response_model=List[CalendarSource])
async def list_calendars(user_id: str = "default"):
    """
    List all available calendars from connected sources
    
    Args:
        user_id: User identifier
    
    Returns:
        List of calendars with source information
    """
    try:
        service = get_unified_service(user_id)
        calendars = await service.list_all_calendars()
        return calendars
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to list calendars: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to list calendars: {str(e)}")


@router.get("/events", response_model=List[CalendarEvent])
async def list_events(
    user_id: str = "default",
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    calendar_ids: Optional[str] = None
):
    """
    List events from connected calendars
    
    Args:
        user_id: User identifier
        start_date: Start date filter (ISO or natural language)
        end_date: End date filter (ISO or natural language)
        calendar_ids: Comma-separated calendar IDs (optional)
    
    Returns:
        List of events sorted by start time
    """
    try:
        service = get_unified_service(user_id)
        
        # Parse dates
        time_min = None
        time_max = None
        
        if start_date:
            time_min = dateparser.parse(start_date)
            if not time_min:
                time_min = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
        
        if end_date:
            time_max = dateparser.parse(end_date)
            if not time_max:
                time_max = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
        
        # Parse calendar IDs
        cal_id_list = None
        if calendar_ids:
            cal_id_list = calendar_ids.split(',')
        
        # Fetch events
        events = await service.list_all_events(cal_id_list, time_min, time_max)
        return events
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to list events: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to list events: {str(e)}")


@router.post("/events", response_model=CalendarEvent)
async def create_event(request: CreateEventRequest, user_id: str = "default"):
    """
    Create a new calendar event
    
    Args:
        request: Event creation details
        user_id: User identifier
    
    Returns:
        Created event
    """
    try:
        service = get_unified_service(user_id)
        
        # Parse start time (natural language or ISO)
        start_time = dateparser.parse(request.start_time)
        if not start_time:
            try:
                start_time = datetime.fromisoformat(request.start_time.replace('Z', '+00:00'))
            except:
                raise HTTPException(status_code=400, detail="Invalid start_time format")
        
        # Parse or calculate end time
        if request.end_time:
            end_time = dateparser.parse(request.end_time)
            if not end_time:
                try:
                    end_time = datetime.fromisoformat(request.end_time.replace('Z', '+00:00'))
                except:
                    raise HTTPException(status_code=400, detail="Invalid end_time format")
        else:
            # Use duration
            end_time = start_time + timedelta(minutes=request.duration_minutes)
        
        # Create event
        event = await service.create_event(
            calendar_id=request.calendar_id,
            title=request.title,
            start_time=start_time,
            end_time=end_time,
            location=request.location,
            description=request.description
        )
        
        logger.info(f"Created event: {request.title}")
        return event
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to create event: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to create event: {str(e)}")


@router.put("/events/{calendar_id}/{event_id}", response_model=CalendarEvent)
async def update_event(
    calendar_id: str,
    event_id: str,
    request: UpdateEventRequest,
    user_id: str = "default"
):
    """
    Update an existing calendar event
    
    Args:
        calendar_id: Calendar ID
        event_id: Event ID to update
        request: Update details
        user_id: User identifier
    
    Returns:
        Updated event
    """
    try:
        google_creds = get_google_credentials(user_id)
        
        if not google_creds:
            raise HTTPException(status_code=401, detail="Google Calendar not connected")
        
        service = GoogleCalendarService(google_creds)
        
        # Parse times if provided
        start_time = None
        end_time = None
        
        if request.start_time:
            start_time = dateparser.parse(request.start_time)
            if not start_time:
                start_time = datetime.fromisoformat(request.start_time.replace('Z', '+00:00'))
        
        if request.end_time:
            end_time = dateparser.parse(request.end_time)
            if not end_time:
                end_time = datetime.fromisoformat(request.end_time.replace('Z', '+00:00'))
        
        # Update event
        event = await service.update_event(
            calendar_id=calendar_id,
            event_id=event_id,
            title=request.title,
            start_time=start_time,
            end_time=end_time,
            location=request.location,
            description=request.description
        )
        
        logger.info(f"Updated event: {event_id}")
        return event
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update event: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to update event: {str(e)}")


@router.delete("/events/{calendar_id}/{event_id}")
async def delete_event(calendar_id: str, event_id: str, user_id: str = "default"):
    """
    Delete a calendar event
    
    Args:
        calendar_id: Calendar ID
        event_id: Event ID to delete
        user_id: User identifier
    
    Returns:
        Success message
    """
    try:
        service = get_unified_service(user_id)
        
        success = await service.delete_event(calendar_id, event_id)
        
        if success:
            logger.info(f"Deleted event: {event_id}")
            return {"success": True, "message": "Event deleted successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to delete event")
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete event: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to delete event: {str(e)}")
