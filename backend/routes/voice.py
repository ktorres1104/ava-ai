"""
Voice routes for speech-to-text and text-to-speech
"""
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import Response
from models.schemas import TranscriptionResponse, TTSRequest, TTSResponse
from services.openai_service import get_openai_service
import logging
import tempfile
import os

router = APIRouter(prefix="/api/voice", tags=["voice"])
logger = logging.getLogger(__name__)


@router.post("/transcribe", response_model=TranscriptionResponse)
async def transcribe_audio(audio: UploadFile = File(...)):
    """
    Transcribe audio file to text using Whisper
    
    Args:
        audio: Audio file (webm, mp3, wav, etc.)
        
    Returns:
        Transcribed text
    """
    try:
        logger.info(f"Received audio file: {audio.filename}, type: {audio.content_type}")
        
        # Read audio file
        audio_bytes = await audio.read()
        
        # Create temporary file for OpenAI API
        # OpenAI requires a file-like object with a name
        with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as temp_file:
            temp_file.write(audio_bytes)
            temp_file_path = temp_file.name
        
        try:
            # Open the temp file and transcribe
            with open(temp_file_path, "rb") as audio_file:
                transcription = await get_openai_service().transcribe_audio(audio_file)
            
            return TranscriptionResponse(
                text=transcription,
                duration=None  # Could calculate if needed
            )
        
        finally:
            # Clean up temp file
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path)
    
    except Exception as e:
        logger.error(f"Transcription failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")


@router.post("/synthesize")
async def synthesize_speech(request: TTSRequest):
    """
    Convert text to speech using OpenAI TTS
    
    Args:
        request: Text and optional voice parameter
        
    Returns:
        Audio file (MP3)
    """
    try:
        logger.info(f"Synthesizing speech for text: {request.text[:50]}...")
        
        # Get audio bytes from OpenAI
        audio_bytes = await get_openai_service().text_to_speech(
            text=request.text,
            voice=request.voice
        )
        
        # Return audio as response
        return Response(
            content=audio_bytes,
            media_type="audio/mpeg",
            headers={
                "Content-Disposition": "attachment; filename=ava_response.mp3"
            }
        )
    
    except Exception as e:
        logger.error(f"TTS failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"TTS failed: {str(e)}")
