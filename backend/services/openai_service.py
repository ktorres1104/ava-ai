"""
OpenAI API service for Whisper, GPT-4o, and TTS
"""
import os
from openai import OpenAI
from typing import List, Dict, Optional
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class OpenAIService:
    """Service to interact with OpenAI API"""
    
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY environment variable not set")
        
        self.client = OpenAI(api_key=api_key)
        self.model = os.getenv("OPENAI_MODEL", "gpt-4o")
        self.mini_model = os.getenv("OPENAI_MINI_MODEL", "gpt-4o-mini")
        self.tts_voice = os.getenv("OPENAI_TTS_VOICE", "alloy")
        self.tts_model = os.getenv("OPENAI_TTS_MODEL", "tts-1-hd")
        self.whisper_model = os.getenv("OPENAI_WHISPER_MODEL", "whisper-1")
    
    async def transcribe_audio(self, audio_file) -> str:
        """
        Transcribe audio file using Whisper
        
        Args:
            audio_file: Audio file object
            
        Returns:
            Transcribed text
        """
        try:
            logger.info("Transcribing audio with Whisper...")
            
            transcript = self.client.audio.transcriptions.create(
                model=self.whisper_model,
                file=audio_file,
                response_format="text"
            )
            
            logger.info(f"Transcription successful: {transcript[:50]}...")
            return transcript
            
        except Exception as e:
            logger.error(f"Transcription error: {str(e)}")
            raise
    
    async def chat_completion(
        self, 
        message: str, 
        conversation_history: Optional[List[Dict]] = None,
        use_mini: bool = False
    ) -> tuple[str, str]:
        """
        Get chat completion from GPT-4o or GPT-4o-mini
        
        Args:
            message: User message
            conversation_history: Previous conversation context
            use_mini: Use GPT-4o-mini for simple queries
            
        Returns:
            Tuple of (response_text, model_used)
        """
        try:
            model = self.mini_model if use_mini else self.model
            logger.info(f"Getting chat completion with {model}...")
            
            # Build messages array
            messages = [
                {
                    "role": "system",
                    "content": """You are Ava, a warm and natural personal AI assistant. 
                    Speak conversationally like a helpful friend. Keep responses SHORT - 
                    2-3 sentences max unless asked for details. Be warm, natural, and authentic.
                    Think of how you'd text a friend, not write an essay."""
                }
            ]
            
            # Add conversation history if provided
            if conversation_history:
                messages.extend(conversation_history)
            
            # Add current message
            messages.append({"role": "user", "content": message})
            
            # Get completion
            response = self.client.chat.completions.create(
                model=model,
                messages=messages,
                temperature=0.8,  # Slightly more natural/creative
                max_tokens=150  # Shorter responses = faster + more natural
            )
            
            response_text = response.choices[0].message.content
            logger.info(f"Chat completion successful with {model}")
            
            return response_text, model
            
        except Exception as e:
            logger.error(f"Chat completion error: {str(e)}")
            raise
    
    async def text_to_speech(self, text: str, voice: Optional[str] = None) -> bytes:
        """
        Convert text to speech using OpenAI TTS
        
        Args:
            text: Text to convert
            voice: Voice to use (default: nova)
            
        Returns:
            Audio bytes
        """
        try:
            voice_to_use = voice or self.tts_voice
            logger.info(f"Converting text to speech with voice: {voice_to_use}")
            
            response = self.client.audio.speech.create(
                model=self.tts_model,
                voice=voice_to_use,
                input=text,
                speed=1.0  # Natural speaking speed
            )
            
            logger.info("TTS conversion successful")
            return response.content
            
        except Exception as e:
            logger.error(f"TTS error: {str(e)}")
            raise
    
    def should_use_mini_model(self, message: str) -> bool:
        """
        Determine if we should use the mini model for simple queries
        
        Args:
            message: User message
            
        Returns:
            True if mini model should be used
        """
        # Simple heuristic: use mini for short, simple questions
        simple_keywords = [
            "what", "when", "who", "where", "how many",
            "tell me", "what's", "whats", "hello", "hi",
            "thanks", "thank you", "yes", "no", "okay"
        ]
        
        message_lower = message.lower()
        is_short = len(message.split()) < 15
        has_simple_keyword = any(keyword in message_lower for keyword in simple_keywords)
        
        return is_short and has_simple_keyword


# Global instance - will be initialized by main.py after loading .env
openai_service: Optional[OpenAIService] = None

def get_openai_service() -> OpenAIService:
    """Get or create the OpenAI service instance"""
    global openai_service
    if openai_service is None:
        openai_service = OpenAIService()
    return openai_service
