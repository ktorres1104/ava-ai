"""
OpenAI API service for Whisper, GPT-4o, and TTS
"""
import os
from openai import OpenAI
from typing import List, Dict, Optional, Tuple, Any
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
    
    def get_calendar_functions(self) -> List[Dict]:
        """Define calendar function definitions for GPT-4o"""
        return [
            {
                "type": "function",
                "function": {
                    "name": "create_calendar_event",
                    "description": "Create a new calendar event. Use this when user asks to schedule, add, or create an appointment/meeting/event.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "title": {
                                "type": "string",
                                "description": "Event title or name"
                            },
                            "start_time": {
                                "type": "string",
                                "description": "Start time in natural language (e.g., 'tomorrow at 2pm', 'next Tuesday 9am')"
                            },
                            "duration_minutes": {
                                "type": "integer",
                                "description": "Event duration in minutes (default: 60)"
                            },
                            "calendar": {
                                "type": "string",
                                "enum": ["google", "yahoo"],
                                "description": "Which calendar to use (default: google)"
                            },
                            "location": {
                                "type": "string",
                                "description": "Event location (optional)"
                            }
                        },
                        "required": ["title", "start_time"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "list_calendar_events",
                    "description": "Get upcoming calendar events. Use this when user asks what's on their calendar, schedule, or agenda.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "time_range": {
                                "type": "string",
                                "description": "Time range in natural language (e.g., 'today', 'tomorrow', 'this week', 'next week')"
                            }
                        },
                        "required": ["time_range"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "delete_calendar_event",
                    "description": "Delete or cancel a calendar event. Use this when user asks to cancel, remove, or delete an event.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "event_title": {
                                "type": "string",
                                "description": "Title of the event to delete"
                            }
                        },
                        "required": ["event_title"]
                    }
                }
            }
        ]
    
    async def chat_completion(
        self, 
        message: str, 
        conversation_history: Optional[List[Dict]] = None,
        use_mini: bool = False,
        enable_functions: bool = True
    ) -> Tuple[Optional[str], str, Optional[Any]]:
        """
        Get chat completion from GPT-4o or GPT-4o-mini
        
        Args:
            message: User message
            conversation_history: Previous conversation context
            use_mini: Use GPT-4o-mini for simple queries
            enable_functions: Enable calendar function calling
            
        Returns:
            Tuple of (response_text, model_used, tool_call)
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
            
            # Prepare request params
            request_params = {
                "model": model,
                "messages": messages,
                "temperature": 0.8,
                "max_tokens": 150
            }
            
            # Add function calling if enabled and not using mini model
            if enable_functions and not use_mini:
                request_params["tools"] = self.get_calendar_functions()
                request_params["tool_choice"] = "auto"
            
            # Get completion
            response = self.client.chat.completions.create(**request_params)
            
            message_obj = response.choices[0].message
            
            # Check if model wants to call a function
            if hasattr(message_obj, 'tool_calls') and message_obj.tool_calls:
                # Return function call info
                tool_call = message_obj.tool_calls[0]
                return None, model, tool_call  # Will be handled in route
            
            response_text = message_obj.content
            logger.info(f"Chat completion successful with {model}")
            
            return response_text, model, None
            
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
