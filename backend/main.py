"""
Ava AI Backend - FastAPI Application
Main entry point for the API server
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import voice, ai
from models.schemas import HealthResponse
import os
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Ava AI Backend",
    description="Voice-enabled personal AI assistant API",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        frontend_url,
        "https://ava-ai-fawn.vercel.app",
        "https://*.vercel.app",
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:3003",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(voice.router)
app.include_router(ai.router)


@app.get("/", response_model=HealthResponse)
async def root():
    """Root endpoint - health check"""
    return HealthResponse(
        status="healthy",
        message="Ava AI Backend is running! 🎤✨"
    )


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        message="All systems operational"
    )


@app.on_event("startup")
async def startup_event():
    """Startup event handler"""
    logger.info("🚀 Ava AI Backend starting up...")
    logger.info(f"📍 Environment: {os.getenv('ENVIRONMENT', 'development')}")
    logger.info(f"🤖 OpenAI Model: {os.getenv('OPENAI_MODEL', 'gpt-4o')}")
    logger.info(f"🎤 TTS Voice: {os.getenv('OPENAI_TTS_VOICE', 'nova')}")
    logger.info("✅ Backend ready to serve requests!")


@app.on_event("shutdown")
async def shutdown_event():
    """Shutdown event handler"""
    logger.info("👋 Ava AI Backend shutting down...")


if __name__ == "__main__":
    import uvicorn
    
    host = os.getenv("BACKEND_HOST", "0.0.0.0")
    port = int(os.getenv("BACKEND_PORT", 8000))
    
    logger.info(f"Starting server on {host}:{port}")
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=True,
        log_level="info"
    )
