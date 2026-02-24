'use client';

import { useState, useEffect } from 'react';
import { CalendarEvent } from '@/lib/api';
import { 
  fetchCalendarEvents, 
  groupEventsByDate, 
  getTodayEvents,
  clearCalendarCache 
} from '@/lib/calendar';
import EventCard from './EventCard';
import { ChevronDown, ChevronUp, RefreshCw, Calendar } from 'lucide-react';

interface CalendarPanelProps {
  onEventsLoaded?: (events: CalendarEvent[]) => void;
}

export default function CalendarPanel({ onEventsLoaded }: CalendarPanelProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();
    
    // Refresh on window focus (if cache expired)
    const handleFocus = () => {
      loadEvents();
    };
    window.addEventListener('focus', handleFocus);
    
    // Background polling every 30 minutes
    const pollInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        loadEvents();
      }
    }, 30 * 60 * 1000);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(pollInterval);
    };
  }, []);

  const loadEvents = async (forceRefresh: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const fetchedEvents = await fetchCalendarEvents(forceRefresh);
      setEvents(fetchedEvents);
      onEventsLoaded?.(fetchedEvents);
    } catch (error: any) {
      console.error('Failed to load events:', error);
      // Don't show error if no calendars connected (expected state)
      if (error?.message?.includes('No calendars connected')) {
        setEvents([]);
      } else {
        setError('Failed to load calendar');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    clearCalendarCache();
    loadEvents(true);
  };

  const todayEvents = getTodayEvents(events);
  const upcomingEvents = events.slice(0, 20); // Limit to 20 events
  const groupedEvents = groupEventsByDate(upcomingEvents);

  return (
    <div className="w-full bg-gradient-to-r from-purple-50 to-teal-50 border-b border-purple-100">
      {/* Header - Always Visible */}
      <div className="w-full px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-3 hover:bg-white/50 rounded-lg px-3 py-2 transition-colors flex-1"
        >
          <Calendar className="w-5 h-5 text-purple-600" />
          <span className="text-gray-900 font-medium">
            Today {todayEvents.length > 0 && `(${todayEvents.length})`}
          </span>
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-gray-600 ml-auto" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600 ml-auto" />
          )}
        </button>
        
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="p-2 hover:bg-white/70 rounded-lg transition-colors disabled:opacity-50 ml-2"
        >
          <RefreshCw className={`w-4 h-4 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="px-4 pb-4 max-h-[60vh] overflow-y-auto bg-white/80">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {loading && events.length === 0 ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-purple-100 rounded-lg h-20 animate-pulse" />
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 text-sm">No upcoming events</p>
              <p className="text-gray-400 text-xs mt-1">
                Connect a calendar to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {Array.from(groupedEvents.entries()).map(([date, dateEvents]) => (
                <div key={date}>
                  <h4 className="text-gray-700 font-medium text-sm mb-2 sticky top-0 bg-white/90 py-1">
                    {date}
                  </h4>
                  {dateEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onDelete={() => loadEvents(true)}
                      compact
                    />
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
