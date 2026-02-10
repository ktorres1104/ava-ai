"""
AI routes for chat completion with GPT-4o
"""
from fastapi import APIRouter, HTTPException
from models.schemas import ChatRequest, ChatResponse
from services.openai_service import get_openai_service
import logging

router = APIRouter(prefix="/api/ai", tags=["ai"])
logger = logging.getLogger(__name__)


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Get chat completion from GPT-4o or GPT-4o-mini
    
    Args:
        request: User message and conversation history
        
    Returns:
        AI response text and model used
    """
    try:
        logger.info(f"Processing chat request: {request.message[:50]}...")
        
        # Determine which model to use
        service = get_openai_service()
        use_mini = service.should_use_mini_model(request.message)
        
        # Get chat completion
        response_text, model_used = await service.chat_completion(
            message=request.message,
            conversation_history=request.conversation_history,
            use_mini=use_mini
        )
        
        return ChatResponse(
            response=response_text,
            model_used=model_used
        )
    
    except Exception as e:
        logger.error(f"Chat completion failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")
