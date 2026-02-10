"""
Pydantic models for request/response validation
"""
from pydantic import BaseModel
from typing import Optional, List


class TranscriptionRequest(BaseModel):
    """Request model for audio transcription"""
    pass  # File will be handled separately


class TranscriptionResponse(BaseModel):
    """Response model for audio transcription"""
    text: str
    duration: Optional[float] = None


class ChatRequest(BaseModel):
    """Request model for chat completion"""
    message: str
    conversation_history: Optional[List[dict]] = []


class ChatResponse(BaseModel):
    """Response model for chat completion"""
    response: str
    model_used: str


class TTSRequest(BaseModel):
    """Request model for text-to-speech"""
    text: str
    voice: Optional[str] = "nova"


class TTSResponse(BaseModel):
    """Response model for text-to-speech"""
    audio_url: str
    text: str


class HealthResponse(BaseModel):
    """Response model for health check"""
    status: str
    message: str
