/**
 * Calendar caching and refresh utilities
 */
import { CalendarEvent, listEvents } from './api';

const CACHE_KEY = 'ava_calendar_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

interface CalendarCache {
  events: CalendarEvent[];
  timestamp: number;
  userId: string;
}

/**
 * Get cached calendar events
 */
export function getCachedEvents(): CalendarEvent[] | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const cache: CalendarCache = JSON.parse(cached);
    const now = Date.now();
    
    // Check if cache is still valid (< 5 minutes old)
    if (now - cache.timestamp < CACHE_DURATION) {
      return cache.events;
    }
    
    // Cache expired
    return null;
  } catch (error) {
    console.error('Failed to read calendar cache:', error);
    return null;
  }
}

/**
 * Save events to cache
 */
export function setCachedEvents(events: CalendarEvent[], userId: string = 'default'): void {
  try {
    const cache: CalendarCache = {
      events,
      timestamp: Date.now(),
      userId,
    };
    
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error('Failed to cache calendar events:', error);
  }
}

/**
 * Clear calendar cache
 */
export function clearCalendarCache(): void {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (error) {
    console.error('Failed to clear calendar cache:', error);
  }
}

/**
 * Get cache age in milliseconds
 */
export function getCacheAge(): number | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const cache: CalendarCache = JSON.parse(cached);
    return Date.now() - cache.timestamp;
  } catch {
    return null;
  }
}

/**
 * Check if cache is expired
 */
export function isCacheExpired(): boolean {
  const age = getCacheAge();
  return age === null || age >= CACHE_DURATION;
}

/**
 * Fetch calendar events with smart caching
 */
export async function fetchCalendarEvents(
  forceRefresh: boolean = false,
  userId: string = 'default',
  startDate?: string,
  endDate?: string
): Promise<CalendarEvent[]> {
  // Try cache first if not forcing refresh
  if (!forceRefresh) {
    const cached = getCachedEvents();
    if (cached) {
      console.log('Using cached calendar events');
      return cached;
    }
  }
  
  console.log('Fetching fresh calendar events...');
  
  try {
    // Fetch from API
    const events = await listEvents(userId, startDate, endDate);
    
    // Cache the results
    setCachedEvents(events, userId);
    
    return events;
  } catch (error: any) {
    console.error('Failed to fetch calendar events:', error);
    
    // Fallback to cache if available
    const cached = getCachedEvents();
    if (cached) {
      console.warn('Using stale cache due to fetch error');
      return cached;
    }
    
    // Return empty array instead of throwing (prevents UI errors)
    console.log('Returning empty events array');
    return [];
  }
}

/**
 * Format date for display
 */
export function formatEventDate(isoDate: string): string {
  try {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return isoDate;
  }
}

/**
 * Format time for display
 */
export function formatEventTime(isoDate: string): string {
  try {
    const date = new Date(isoDate);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return isoDate;
  }
}

/**
 * Group events by date
 */
export function groupEventsByDate(events: CalendarEvent[]): Map<string, CalendarEvent[]> {
  const grouped = new Map<string, CalendarEvent[]>();
  
  events.forEach(event => {
    const dateKey = formatEventDate(event.start_time);
    const existing = grouped.get(dateKey) || [];
    grouped.set(dateKey, [...existing, event]);
  });
  
  return grouped;
}

/**
 * Get today's events
 */
export function getTodayEvents(events: CalendarEvent[]): CalendarEvent[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return events.filter(event => {
    const eventDate = new Date(event.start_time);
    return eventDate >= today && eventDate < tomorrow;
  });
}

/**
 * Get this week's events
 */
export function getWeekEvents(events: CalendarEvent[]): CalendarEvent[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  return events.filter(event => {
    const eventDate = new Date(event.start_time);
    return eventDate >= today && eventDate < nextWeek;
  });
}