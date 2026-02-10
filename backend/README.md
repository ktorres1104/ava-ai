# Ava AI Backend

FastAPI backend for Ava AI voice assistant.

## Features

- 🎤 **Speech-to-Text** - Whisper API integration
- 🤖 **AI Chat** - GPT-4o and GPT-4o-mini with smart routing
- 🔊 **Text-to-Speech** - OpenAI TTS with "nova" voice
- 📝 **Auto Documentation** - OpenAPI/Swagger at `/docs`

## Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment

Create a `.env` file (copy from `env.example`):

```bash
cp env.example .env
```

Edit `.env` and add your OpenAI API key:

```
OPENAI_API_KEY=sk-your-actual-api-key-here
```

### 3. Run Server

```bash
python main.py
```

Or with uvicorn:

```bash
uvicorn main:app --reload --port 8000
```

Server will start at: **http://localhost:8000**

## API Endpoints

### Health Check
- `GET /` - Root endpoint
- `GET /health` - Health check

### Voice
- `POST /api/voice/transcribe` - Upload audio → get text
- `POST /api/voice/synthesize` - Send text → get audio

### AI Chat
- `POST /api/ai/chat` - Send message → get AI response

## Documentation

Interactive API docs available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Project Structure

```
backend/
├── main.py                 # FastAPI application
├── requirements.txt        # Python dependencies
├── env.example            # Environment variables template
├── models/
│   └── schemas.py         # Pydantic models
├── routes/
│   ├── voice.py           # Voice endpoints (STT, TTS)
│   └── ai.py              # AI chat endpoints
└── services/
    └── openai_service.py  # OpenAI API wrapper
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENAI_API_KEY` | Your OpenAI API key | Required |
| `OPENAI_MODEL` | GPT model for complex tasks | `gpt-4o` |
| `OPENAI_MINI_MODEL` | GPT model for simple tasks | `gpt-4o-mini` |
| `OPENAI_TTS_VOICE` | TTS voice name | `nova` |
| `OPENAI_TTS_MODEL` | TTS model | `tts-1` |
| `OPENAI_WHISPER_MODEL` | Whisper model | `whisper-1` |
| `BACKEND_HOST` | Server host | `0.0.0.0` |
| `BACKEND_PORT` | Server port | `8000` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |

## Testing

Test the API with curl:

```bash
# Health check
curl http://localhost:8000/health

# Chat completion
curl -X POST http://localhost:8000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello Ava!"}'
```

## Cost Management

- Simple queries use GPT-4o-mini (10x cheaper)
- Complex queries use GPT-4o
- Smart model selection based on query complexity

## Development

Run with auto-reload:

```bash
uvicorn main:app --reload --port 8000
```

View logs in real-time with colored output.
