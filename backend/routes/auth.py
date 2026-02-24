"""
Authentication routes for calendar OAuth
"""
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import RedirectResponse
from google_auth_oauthlib.flow import Flow
from google.oauth2.credentials import Credentials
from models.schemas import GoogleAuthResponse, AuthStatusResponse, YahooConnectRequest
import os
import logging
from typing import Dict, Optional

router = APIRouter(prefix="/api/auth", tags=["auth"])
logger = logging.getLogger(__name__)

# In-memory credential storage (temporary - will upgrade to DB with user auth)
credentials_store: Dict[str, Dict] = {}

# Google Calendar OAuth scopes
SCOPES = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events'
]


def get_google_flow(redirect_uri: str = None):
    """Create Google OAuth flow"""
    if redirect_uri is None:
        redirect_uri = os.getenv('GOOGLE_REDIRECT_URI', 'http://localhost:8000/api/auth/google/callback')
    
    client_config = {
        "web": {
            "client_id": os.getenv('GOOGLE_CLIENT_ID'),
            "client_secret": os.getenv('GOOGLE_CLIENT_SECRET'),
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "redirect_uris": [redirect_uri]
        }
    }
    
    flow = Flow.from_client_config(
        client_config,
        scopes=SCOPES,
        redirect_uri=redirect_uri
    )
    
    return flow


@router.get("/google/authorize")
async def google_authorize(user_id: str = "default"):
    """
    Start Google OAuth flow
    
    Args:
        user_id: User identifier (default for now, will use real auth later)
    
    Returns:
        Authorization URL for user to visit
    """
    try:
        flow = get_google_flow()
        
        authorization_url, state = flow.authorization_url(
            access_type='offline',
            include_granted_scopes='true',
            prompt='consent'
        )
        
        # Store state for verification in callback
        credentials_store[f"{user_id}_state"] = state
        
        logger.info(f"Generated OAuth URL for user: {user_id}")
        return GoogleAuthResponse(auth_url=authorization_url)
    
    except Exception as e:
        logger.error(f"Failed to generate auth URL: {e}")
        raise HTTPException(status_code=500, detail=f"OAuth setup failed: {str(e)}")


@router.get("/google/callback")
async def google_callback(request: Request, code: str, state: str, user_id: str = "default"):
    """
    Handle Google OAuth callback
    
    Args:
        code: Authorization code from Google
        state: State parameter for verification
        user_id: User identifier
    
    Returns:
        Success message and redirect
    """
    try:
        # Verify state (security check)
        stored_state = credentials_store.get(f"{user_id}_state")
        if not stored_state or stored_state != state:
            raise HTTPException(status_code=400, detail="Invalid state parameter")
        
        # Exchange code for credentials
        flow = get_google_flow()
        flow.fetch_token(code=code)
        
        credentials = flow.credentials
        
        # Store credentials
        credentials_store[f"{user_id}_google"] = {
            'token': credentials.token,
            'refresh_token': credentials.refresh_token,
            'token_uri': credentials.token_uri,
            'client_id': credentials.client_id,
            'client_secret': credentials.client_secret,
            'scopes': credentials.scopes
        }
        
        # Clean up state
        credentials_store.pop(f"{user_id}_state", None)
        
        logger.info(f"Google Calendar connected for user: {user_id}")
        
        # Redirect to frontend
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
        return RedirectResponse(url=f"{frontend_url}?google_connected=true")
    
    except Exception as e:
        logger.error(f"OAuth callback failed: {e}")
        raise HTTPException(status_code=500, detail=f"OAuth callback failed: {str(e)}")


@router.get("/google/status")
async def google_status(user_id: str = "default"):
    """
    Check Google Calendar connection status
    
    Args:
        user_id: User identifier
    
    Returns:
        Connection status and user info
    """
    try:
        creds_data = credentials_store.get(f"{user_id}_google")
        
        if not creds_data:
            return AuthStatusResponse(connected=False)
        
        # Check if credentials are valid
        credentials = Credentials(
            token=creds_data['token'],
            refresh_token=creds_data.get('refresh_token'),
            token_uri=creds_data['token_uri'],
            client_id=creds_data['client_id'],
            client_secret=creds_data['client_secret'],
            scopes=creds_data['scopes']
        )
        
        if credentials.expired and credentials.refresh_token:
            credentials.refresh(Request())
            # Update stored credentials
            credentials_store[f"{user_id}_google"]['token'] = credentials.token
        
        return AuthStatusResponse(
            connected=True,
            email=creds_data.get('email'),
            calendars_count=None
        )
    
    except Exception as e:
        logger.error(f"Failed to check Google status: {e}")
        return AuthStatusResponse(connected=False)


@router.post("/google/disconnect")
async def google_disconnect(user_id: str = "default"):
    """
    Disconnect Google Calendar
    
    Args:
        user_id: User identifier
    
    Returns:
        Success message
    """
    try:
        credentials_store.pop(f"{user_id}_google", None)
        logger.info(f"Google Calendar disconnected for user: {user_id}")
        return {"success": True, "message": "Google Calendar disconnected"}
    
    except Exception as e:
        logger.error(f"Failed to disconnect: {e}")
        raise HTTPException(status_code=500, detail=f"Disconnect failed: {str(e)}")


@router.post("/yahoo/connect")
async def yahoo_connect(request: YahooConnectRequest, user_id: str = "default"):
    """
    Connect Yahoo Calendar via CalDAV
    
    Args:
        request: Yahoo email and app password
        user_id: User identifier
    
    Returns:
        Success message
    """
    try:
        # Store Yahoo credentials (encrypted in production)
        credentials_store[f"{user_id}_yahoo"] = {
            'email': request.email,
            'app_password': request.app_password
        }
        
        logger.info(f"Yahoo Calendar connected for user: {user_id}")
        return {"success": True, "message": "Yahoo Calendar connected"}
    
    except Exception as e:
        logger.error(f"Failed to connect Yahoo: {e}")
        raise HTTPException(status_code=500, detail=f"Yahoo connection failed: {str(e)}")


@router.get("/yahoo/status")
async def yahoo_status(user_id: str = "default"):
    """
    Check Yahoo Calendar connection status
    
    Args:
        user_id: User identifier
    
    Returns:
        Connection status
    """
    creds_data = credentials_store.get(f"{user_id}_yahoo")
    
    if not creds_data:
        return AuthStatusResponse(connected=False)
    
    return AuthStatusResponse(
        connected=True,
        email=creds_data.get('email')
    )


@router.post("/yahoo/disconnect")
async def yahoo_disconnect(user_id: str = "default"):
    """
    Disconnect Yahoo Calendar
    
    Args:
        user_id: User identifier
    
    Returns:
        Success message
    """
    try:
        credentials_store.pop(f"{user_id}_yahoo", None)
        logger.info(f"Yahoo Calendar disconnected for user: {user_id}")
        return {"success": True, "message": "Yahoo Calendar disconnected"}
    
    except Exception as e:
        logger.error(f"Failed to disconnect: {e}")
        raise HTTPException(status_code=500, detail=f"Disconnect failed: {str(e)}")


def get_google_credentials(user_id: str = "default") -> Optional[Credentials]:
    """Helper function to get Google credentials for a user"""
    creds_data = credentials_store.get(f"{user_id}_google")
    
    if not creds_data:
        return None
    
    return Credentials(
        token=creds_data['token'],
        refresh_token=creds_data.get('refresh_token'),
        token_uri=creds_data['token_uri'],
        client_id=creds_data['client_id'],
        client_secret=creds_data['client_secret'],
        scopes=creds_data['scopes']
    )


def get_yahoo_credentials(user_id: str = "default") -> Optional[Dict]:
    """Helper function to get Yahoo credentials for a user"""
    return credentials_store.get(f"{user_id}_yahoo")
