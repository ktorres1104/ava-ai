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


# Calendar Models

class CalendarSource(BaseModel):
    """Calendar source information"""
    id: str
    name: str
    source: str  # 'google' or 'yahoo'
    color: str
    access_role: Optional[str] = None
    is_primary: bool = False


class CalendarEvent(BaseModel):
    """Calendar event model"""
    id: str
    title: str
    start_time: str  # ISO format
    end_time: str  # ISO format
    calendar_id: str
    calendar_name: str
    source: str  # 'google' or 'yahoo'
    color: str
    location: Optional[str] = None
    description: Optional[str] = None
    attendees: Optional[List[str]] = []


class CreateEventRequest(BaseModel):
    """Request to create a calendar event"""
    title: str
    start_time: str  # ISO format or natural language
    end_time: Optional[str] = None
    duration_minutes: Optional[int] = 60
    calendar_id: str  # Which calendar to add to
    location: Optional[str] = None
    description: Optional[str] = None


class UpdateEventRequest(BaseModel):
    """Request to update a calendar event"""
    title: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None


class EventsQueryRequest(BaseModel):
    """Request to query calendar events"""
    start_date: Optional[str] = None  # ISO format
    end_date: Optional[str] = None  # ISO format
    calendar_ids: Optional[List[str]] = None


class GoogleAuthResponse(BaseModel):
    """Response for Google OAuth authorization"""
    auth_url: str


class AuthStatusResponse(BaseModel):
    """Response for authentication status"""
    connected: bool
    email: Optional[str] = None
    calendars_count: Optional[int] = None


class YahooConnectRequest(BaseModel):
    """Request to connect Yahoo Calendar"""
    email: str
    app_password: str
