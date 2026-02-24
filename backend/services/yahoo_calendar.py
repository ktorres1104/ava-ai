"""
Yahoo Calendar Service via CalDAV
Handles Yahoo Calendar interactions through CalDAV protocol
"""
import caldav
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import logging

logger = logging.getLogger(__name__)


class YahooCalendarService:
    """Service for interacting with Yahoo Calendar via CalDAV"""
    
    def __init__(self, email: str, app_password: str):
        """
        Initialize with Yahoo credentials
        
        Args:
            email: Yahoo email address
            app_password: Yahoo app-specific password
        """
        self.email = email
        self.app_password = app_password
        self.caldav_url = "https://caldav.calendar.yahoo.com"
        self.client = None
        self.calendar = None
        
        try:
            # Connect to Yahoo CalDAV
            self.client = caldav.DAVClient(
                url=self.caldav_url,
                username=email,
                password=app_password
            )
            
            # Get principal and default calendar
            principal = self.client.principal()
            calendars = principal.calendars()
            
            if calendars:
                self.calendar = calendars[0]
                logger.info(f"Connected to Yahoo Calendar for {email}")
            else:
                raise Exception("No calendars found in Yahoo account")
        
        except Exception as e:
            logger.error(f"Failed to connect to Yahoo Calendar: {e}")
            raise Exception(f"Yahoo Calendar connection failed: {str(e)}")
    
    async def list_events(
        self,
        time_min: Optional[datetime] = None,
        time_max: Optional[datetime] = None
    ) -> List[Dict]:
        """
        List events from Yahoo Calendar
        
        Args:
            time_min: Start time filter (defaults to now)
            time_max: End time filter (defaults to 30 days from now)
        
        Returns:
            List of event dictionaries in standard format
        """
        try:
            if not self.calendar:
                raise Exception("Calendar not connected")
            
            if time_min is None:
                time_min = datetime.utcnow()
            if time_max is None:
                time_max = datetime.utcnow() + timedelta(days=30)
            
            # Fetch events from Yahoo Calendar
            events = self.calendar.date_search(
                start=time_min,
                end=time_max,
                expand=True
            )
            
            formatted_events = []
            for event in events:
                try:
                    formatted_event = self._format_event(event)
                    if formatted_event:
                        formatted_events.append(formatted_event)
                except Exception as e:
                    logger.warning(f"Failed to format Yahoo event: {e}")
                    continue
            
            logger.info(f"Found {len(formatted_events)} Yahoo calendar events")
            return formatted_events
        
        except Exception as e:
            logger.error(f"Failed to list Yahoo events: {e}")
            raise Exception(f"Failed to fetch Yahoo events: {str(e)}")
    
    async def create_event(
        self,
        title: str,
        start_time: datetime,
        end_time: datetime,
        location: Optional[str] = None,
        description: Optional[str] = None
    ) -> Dict:
        """
        Create a new event in Yahoo Calendar
        
        Args:
            title: Event title
            start_time: Start datetime
            end_time: End datetime
            location: Optional location
            description: Optional description
        
        Returns:
            Created event dictionary
        """
        try:
            if not self.calendar:
                raise Exception("Calendar not connected")
            
            # Build iCalendar event
            event_data = f"""BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Ava AI//Calendar//EN
BEGIN:VEVENT
SUMMARY:{title}
DTSTART:{start_time.strftime('%Y%m%dT%H%M%SZ')}
DTEND:{end_time.strftime('%Y%m%dT%H%M%SZ')}
"""
            
            if location:
                event_data += f"LOCATION:{location}\n"
            if description:
                event_data += f"DESCRIPTION:{description}\n"
            
            event_data += "END:VEVENT\nEND:VCALENDAR"
            
            # Create event in Yahoo Calendar
            event = self.calendar.save_event(event_data)
            
            logger.info(f"Created Yahoo event: {title}")
            
            return {
                'id': str(event.id),
                'title': title,
                'start_time': start_time.isoformat(),
                'end_time': end_time.isoformat(),
                'calendar_id': 'yahoo_primary',
                'calendar_name': 'Yahoo Calendar',
                'source': 'yahoo',
                'color': '#7B0099',
                'location': location,
                'description': description,
                'attendees': []
            }
        
        except Exception as e:
            logger.error(f"Failed to create Yahoo event: {e}")
            raise Exception(f"Failed to create Yahoo event: {str(e)}")
    
    async def delete_event(self, event_id: str) -> bool:
        """
        Delete event from Yahoo Calendar
        
        Args:
            event_id: Event ID to delete
        
        Returns:
            True if successful
        """
        try:
            if not self.calendar:
                raise Exception("Calendar not connected")
            
            # Find and delete event
            event = self.calendar.event_by_url(event_id)
            event.delete()
            
            logger.info(f"Deleted Yahoo event: {event_id}")
            return True
        
        except Exception as e:
            logger.error(f"Failed to delete Yahoo event: {e}")
            raise Exception(f"Failed to delete Yahoo event: {str(e)}")
    
    def _format_event(self, event) -> Optional[Dict]:
        """Format Yahoo CalDAV event to our standard format"""
        try:
            vevent = event.vobject_instance.vevent
            
            title = str(vevent.summary.value) if hasattr(vevent, 'summary') else 'Untitled Event'
            start = vevent.dtstart.value
            end = vevent.dtend.value if hasattr(vevent, 'dtend') else start + timedelta(hours=1)
            
            # Convert to datetime if date only
            if isinstance(start, datetime):
                start_time = start.isoformat()
            else:
                start_time = datetime.combine(start, datetime.min.time()).isoformat()
            
            if isinstance(end, datetime):
                end_time = end.isoformat()
            else:
                end_time = datetime.combine(end, datetime.min.time()).isoformat()
            
            return {
                'id': str(event.url),
                'title': title,
                'start_time': start_time,
                'end_time': end_time,
                'calendar_id': 'yahoo_primary',
                'calendar_name': 'Yahoo Calendar',
                'source': 'yahoo',
                'color': '#7B0099',
                'location': str(vevent.location.value) if hasattr(vevent, 'location') else None,
                'description': str(vevent.description.value) if hasattr(vevent, 'description') else None,
                'attendees': []
            }
        
        except Exception as e:
            logger.warning(f"Failed to parse Yahoo event: {e}")
            return None
