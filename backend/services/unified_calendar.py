"""
Unified Calendar Service
Merges events from Google Calendar and Yahoo Calendar
"""
from services.google_calendar import GoogleCalendarService
from services.yahoo_calendar import YahooCalendarService
from google.oauth2.credentials import Credentials
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import asyncio
import logging

logger = logging.getLogger(__name__)


class UnifiedCalendarService:
    """Service to manage multiple calendar sources"""
    
    def __init__(self, google_creds: Optional[Credentials] = None, yahoo_creds: Optional[Dict] = None):
        """
        Initialize with credentials for available calendars
        
        Args:
            google_creds: Google OAuth credentials
            yahoo_creds: Yahoo CalDAV credentials dict
        """
        self.google_service = GoogleCalendarService(google_creds) if google_creds else None
        self.yahoo_service = None
        
        if yahoo_creds:
            try:
                self.yahoo_service = YahooCalendarService(
                    email=yahoo_creds['email'],
                    app_password=yahoo_creds['app_password']
                )
            except Exception as e:
                logger.warning(f"Failed to initialize Yahoo service: {e}")
                self.yahoo_service = None
    
    async def list_all_calendars(self) -> List[Dict]:
        """
        List all calendars from all connected sources
        
        Returns:
            List of calendar dictionaries
        """
        all_calendars = []
        
        # Get Google calendars
        if self.google_service:
            try:
                google_calendars = await self.google_service.list_calendars()
                all_calendars.extend(google_calendars)
            except Exception as e:
                logger.error(f"Failed to fetch Google calendars: {e}")
        
        # Add Yahoo calendar
        if self.yahoo_service:
            all_calendars.append({
                'id': 'yahoo_primary',
                'name': 'Yahoo Calendar',
                'source': 'yahoo',
                'color': '#7B0099',
                'access_role': 'owner',
                'is_primary': False
            })
        
        logger.info(f"Found {len(all_calendars)} total calendars")
        return all_calendars
    
    async def list_all_events(
        self,
        calendar_ids: Optional[List[str]] = None,
        time_min: Optional[datetime] = None,
        time_max: Optional[datetime] = None
    ) -> List[Dict]:
        """
        List events from all connected calendars
        
        Args:
            calendar_ids: Specific calendar IDs to fetch (None = all)
            time_min: Start time filter
            time_max: End time filter
        
        Returns:
            Unified and sorted list of events
        """
        all_events = []
        
        # Separate Google and Yahoo calendar IDs
        google_cal_ids = []
        include_yahoo = False
        
        if calendar_ids:
            for cal_id in calendar_ids:
                if cal_id == 'yahoo_primary':
                    include_yahoo = True
                else:
                    google_cal_ids.append(cal_id)
        else:
            # Fetch from all available calendars
            if self.google_service:
                google_calendars = await self.google_service.list_calendars()
                google_cal_ids = [cal['id'] for cal in google_calendars]
            include_yahoo = self.yahoo_service is not None
        
        # Fetch events in parallel
        tasks = []
        
        if google_cal_ids and self.google_service:
            tasks.append(self._fetch_google_events(google_cal_ids, time_min, time_max))
        
        if include_yahoo and self.yahoo_service:
            tasks.append(self._fetch_yahoo_events(time_min, time_max))
        
        if tasks:
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            for result in results:
                if isinstance(result, Exception):
                    logger.error(f"Failed to fetch events: {result}")
                    continue
                if isinstance(result, list):
                    all_events.extend(result)
        
        # Sort by start time
        all_events.sort(key=lambda e: e['start_time'])
        
        logger.info(f"Found {len(all_events)} total events")
        return all_events
    
    async def _fetch_google_events(
        self,
        calendar_ids: List[str],
        time_min: Optional[datetime],
        time_max: Optional[datetime]
    ) -> List[Dict]:
        """Fetch events from Google Calendar"""
        try:
            return await self.google_service.list_events(calendar_ids, time_min, time_max)
        except Exception as e:
            logger.error(f"Failed to fetch Google events: {e}")
            return []
    
    async def _fetch_yahoo_events(
        self,
        time_min: Optional[datetime],
        time_max: Optional[datetime]
    ) -> List[Dict]:
        """Fetch events from Yahoo Calendar"""
        try:
            return await self.yahoo_service.list_events(time_min, time_max)
        except Exception as e:
            logger.error(f"Failed to fetch Yahoo events: {e}")
            return []
    
    async def create_event(
        self,
        calendar_id: str,
        title: str,
        start_time: datetime,
        end_time: datetime,
        location: Optional[str] = None,
        description: Optional[str] = None
    ) -> Dict:
        """
        Create event in specified calendar
        
        Args:
            calendar_id: Target calendar ID
            title: Event title
            start_time: Start datetime
            end_time: End datetime
            location: Optional location
            description: Optional description
        
        Returns:
            Created event dictionary
        """
        try:
            if calendar_id == 'yahoo_primary':
                if not self.yahoo_service:
                    raise Exception("Yahoo Calendar not connected")
                return await self.yahoo_service.create_event(
                    title, start_time, end_time, location, description
                )
            else:
                if not self.google_service:
                    raise Exception("Google Calendar not connected")
                return await self.google_service.create_event(
                    calendar_id, title, start_time, end_time, location, description
                )
        
        except Exception as e:
            logger.error(f"Failed to create event: {e}")
            raise Exception(f"Failed to create event: {str(e)}")
    
    async def delete_event(self, calendar_id: str, event_id: str) -> bool:
        """
        Delete event from specified calendar
        
        Args:
            calendar_id: Calendar ID
            event_id: Event ID to delete
        
        Returns:
            True if successful
        """
        try:
            if calendar_id == 'yahoo_primary':
                if not self.yahoo_service:
                    raise Exception("Yahoo Calendar not connected")
                return await self.yahoo_service.delete_event(event_id)
            else:
                if not self.google_service:
                    raise Exception("Google Calendar not connected")
                return await self.google_service.delete_event(calendar_id, event_id)
        
        except Exception as e:
            logger.error(f"Failed to delete event: {e}")
            raise Exception(f"Failed to delete event: {str(e)}")
