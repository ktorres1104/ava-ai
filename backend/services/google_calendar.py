"""
Google Calendar Service
Handles Google Calendar API interactions
"""
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Tuple
import logging

logger = logging.getLogger(__name__)


class GoogleCalendarService:
    """Service for interacting with Google Calendar API"""
    
    def __init__(self, credentials: Credentials):
        """Initialize with OAuth credentials"""
        self.credentials = credentials
        self.service = build('calendar', 'v3', credentials=credentials)
    
    async def list_calendars(self) -> List[Dict]:
        """
        List all calendars user has access to (including shared)
        
        Returns:
            List of calendar dictionaries with id, name, color, access_role
        """
        try:
            calendar_list = self.service.calendarList().list().execute()
            calendars = []
            
            for calendar in calendar_list.get('items', []):
                calendars.append({
                    'id': calendar['id'],
                    'name': calendar.get('summary', 'Unnamed Calendar'),
                    'source': 'google',
                    'color': self._get_color_hex(calendar.get('backgroundColor', '#4285F4')),
                    'access_role': calendar.get('accessRole', 'reader'),
                    'is_primary': calendar.get('primary', False)
                })
            
            logger.info(f"Found {len(calendars)} Google calendars")
            return calendars
        
        except HttpError as e:
            logger.error(f"Failed to list calendars: {e}")
            raise Exception(f"Failed to fetch calendars: {str(e)}")
    
    async def list_events(
        self, 
        calendar_ids: List[str],
        time_min: Optional[datetime] = None,
        time_max: Optional[datetime] = None
    ) -> List[Dict]:
        """
        List events from specified calendars
        
        Args:
            calendar_ids: List of calendar IDs to fetch from
            time_min: Start time filter (defaults to now)
            time_max: End time filter (defaults to 30 days from now)
        
        Returns:
            List of event dictionaries
        """
        try:
            if time_min is None:
                time_min = datetime.utcnow()
            if time_max is None:
                time_max = datetime.utcnow() + timedelta(days=30)
            
            all_events = []
            
            for calendar_id in calendar_ids:
                try:
                    events_result = self.service.events().list(
                        calendarId=calendar_id,
                        timeMin=time_min.isoformat() + 'Z',
                        timeMax=time_max.isoformat() + 'Z',
                        singleEvents=True,
                        orderBy='startTime'
                    ).execute()
                    
                    events = events_result.get('items', [])
                    
                    for event in events:
                        all_events.append(self._format_event(event, calendar_id))
                    
                except HttpError as e:
                    logger.warning(f"Failed to fetch events from calendar {calendar_id}: {e}")
                    continue
            
            logger.info(f"Found {len(all_events)} events across {len(calendar_ids)} calendars")
            return all_events
        
        except Exception as e:
            logger.error(f"Failed to list events: {e}")
            raise Exception(f"Failed to fetch events: {str(e)}")
    
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
        Create a new calendar event
        
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
            event_body = {
                'summary': title,
                'start': {
                    'dateTime': start_time.isoformat(),
                    'timeZone': 'UTC',
                },
                'end': {
                    'dateTime': end_time.isoformat(),
                    'timeZone': 'UTC',
                }
            }
            
            if location:
                event_body['location'] = location
            if description:
                event_body['description'] = description
            
            event = self.service.events().insert(
                calendarId=calendar_id,
                body=event_body
            ).execute()
            
            logger.info(f"Created event: {title} in calendar {calendar_id}")
            return self._format_event(event, calendar_id)
        
        except HttpError as e:
            logger.error(f"Failed to create event: {e}")
            raise Exception(f"Failed to create event: {str(e)}")
    
    async def update_event(
        self,
        calendar_id: str,
        event_id: str,
        title: Optional[str] = None,
        start_time: Optional[datetime] = None,
        end_time: Optional[datetime] = None,
        location: Optional[str] = None,
        description: Optional[str] = None
    ) -> Dict:
        """
        Update an existing calendar event
        
        Args:
            calendar_id: Calendar ID
            event_id: Event ID to update
            title: New title (optional)
            start_time: New start time (optional)
            end_time: New end time (optional)
            location: New location (optional)
            description: New description (optional)
        
        Returns:
            Updated event dictionary
        """
        try:
            event = self.service.events().get(
                calendarId=calendar_id,
                eventId=event_id
            ).execute()
            
            if title:
                event['summary'] = title
            if start_time:
                event['start']['dateTime'] = start_time.isoformat()
            if end_time:
                event['end']['dateTime'] = end_time.isoformat()
            if location:
                event['location'] = location
            if description:
                event['description'] = description
            
            updated_event = self.service.events().update(
                calendarId=calendar_id,
                eventId=event_id,
                body=event
            ).execute()
            
            logger.info(f"Updated event: {event_id}")
            return self._format_event(updated_event, calendar_id)
        
        except HttpError as e:
            logger.error(f"Failed to update event: {e}")
            raise Exception(f"Failed to update event: {str(e)}")
    
    async def delete_event(self, calendar_id: str, event_id: str) -> bool:
        """
        Delete a calendar event
        
        Args:
            calendar_id: Calendar ID
            event_id: Event ID to delete
        
        Returns:
            True if successful
        """
        try:
            self.service.events().delete(
                calendarId=calendar_id,
                eventId=event_id
            ).execute()
            
            logger.info(f"Deleted event: {event_id}")
            return True
        
        except HttpError as e:
            logger.error(f"Failed to delete event: {e}")
            raise Exception(f"Failed to delete event: {str(e)}")
    
    def _format_event(self, event: Dict, calendar_id: str) -> Dict:
        """Format Google Calendar event to our standard format"""
        start = event['start'].get('dateTime', event['start'].get('date'))
        end = event['end'].get('dateTime', event['end'].get('date'))
        
        return {
            'id': event['id'],
            'title': event.get('summary', 'Untitled Event'),
            'start_time': start,
            'end_time': end,
            'calendar_id': calendar_id,
            'calendar_name': event.get('organizer', {}).get('displayName', 'Google Calendar'),
            'source': 'google',
            'color': '#4285F4',
            'location': event.get('location'),
            'description': event.get('description'),
            'attendees': [
                attendee.get('email') 
                for attendee in event.get('attendees', [])
            ]
        }
    
    def _get_color_hex(self, color: str) -> str:
        """Convert Google Calendar color to hex"""
        if color.startswith('#'):
            return color
        return '#4285F4'  # Default Google blue
