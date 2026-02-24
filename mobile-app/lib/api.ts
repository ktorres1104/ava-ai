/**
 * API utility functions for communicating with Ava backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  response: string;
  model_used: string;
}

export interface TranscriptionResponse {
  text: string;
  duration?: number;
}

/**
 * Transcribe audio file to text using Whisper
 */
export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'recording.webm');

  const response = await fetch(`${API_BASE_URL}/api/voice/transcribe`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Transcription failed: ${response.statusText}`);
  }

  const data: TranscriptionResponse = await response.json();
  return data.text;
}

/**
 * Send chat message to AI and get response
 */
export async function sendChatMessage(
  message: string,
  conversationHistory: ChatMessage[] = []
): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      conversation_history: conversationHistory,
    }),
  });

  if (!response.ok) {
    throw new Error(`Chat failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Convert text to speech and get audio URL
 */
export async function synthesizeSpeech(text: string, voice: string = 'nova'): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/voice/synthesize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, voice }),
  });

  if (!response.ok) {
    throw new Error(`TTS failed: ${response.statusText}`);
  }

  // Return blob URL for audio playback
  const audioBlob = await response.blob();
  return URL.createObjectURL(audioBlob);
}

/**
 * Check backend health
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}

// Calendar Types
export interface CalendarSource {
  id: string;
  name: string;
  source: 'google' | 'yahoo';
  color: string;
  access_role?: string;
  is_primary: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  calendar_id: string;
  calendar_name: string;
  source: 'google' | 'yahoo';
  color: string;
  location?: string;
  description?: string;
  attendees?: string[];
}

export interface AuthStatus {
  connected: boolean;
  email?: string;
  calendars_count?: number;
}

/**
 * Start Google OAuth flow
 */
export async function startGoogleAuth(userId: string = 'default'): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/auth/google/authorize?user_id=${userId}`);
  
  if (!response.ok) {
    throw new Error('Failed to start Google OAuth');
  }
  
  const data = await response.json();
  return data.auth_url;
}

/**
 * Check Google Calendar connection status
 */
export async function checkGoogleStatus(userId: string = 'default'): Promise<AuthStatus> {
  const response = await fetch(`${API_BASE_URL}/api/auth/google/status?user_id=${userId}`);
  
  if (!response.ok) {
    throw new Error('Failed to check Google status');
  }
  
  return response.json();
}

/**
 * Disconnect Google Calendar
 */
export async function disconnectGoogle(userId: string = 'default'): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/auth/google/disconnect?user_id=${userId}`, {
    method: 'POST',
  });
  
  if (!response.ok) {
    throw new Error('Failed to disconnect Google');
  }
}

/**
 * Connect Yahoo Calendar
 */
export async function connectYahoo(email: string, appPassword: string, userId: string = 'default'): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/auth/yahoo/connect?user_id=${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, app_password: appPassword }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to connect Yahoo Calendar');
  }
}

/**
 * Check Yahoo Calendar connection status
 */
export async function checkYahooStatus(userId: string = 'default'): Promise<AuthStatus> {
  const response = await fetch(`${API_BASE_URL}/api/auth/yahoo/status?user_id=${userId}`);
  
  if (!response.ok) {
    throw new Error('Failed to check Yahoo status');
  }
  
  return response.json();
}

/**
 * List all connected calendars
 */
export async function listCalendars(userId: string = 'default'): Promise<CalendarSource[]> {
  const response = await fetch(`${API_BASE_URL}/api/calendar/calendars?user_id=${userId}`);
  
  if (!response.ok) {
    throw new Error('Failed to list calendars');
  }
  
  return response.json();
}

/**
 * List calendar events
 */
export async function listEvents(
  userId: string = 'default',
  startDate?: string,
  endDate?: string,
  calendarIds?: string[]
): Promise<CalendarEvent[]> {
  const params = new URLSearchParams({ user_id: userId });
  
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);
  if (calendarIds) params.append('calendar_ids', calendarIds.join(','));
  
  const response = await fetch(`${API_BASE_URL}/api/calendar/events?${params}`);
  
  if (!response.ok) {
    // 401 means no calendars connected - this is expected, return empty array
    if (response.status === 401) {
      return [];
    }
    throw new Error('Failed to list events');
  }
  
  return response.json();
}

/**
 * Create a calendar event
 */
export async function createEvent(
  title: string,
  startTime: string,
  calendarId: string,
  durationMinutes: number = 60,
  location?: string,
  userId: string = 'default'
): Promise<CalendarEvent> {
  const response = await fetch(`${API_BASE_URL}/api/calendar/events?user_id=${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      start_time: startTime,
      duration_minutes: durationMinutes,
      calendar_id: calendarId,
      location,
    }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create event');
  }
  
  return response.json();
}

/**
 * Delete a calendar event
 */
export async function deleteEvent(
  calendarId: string,
  eventId: string,
  userId: string = 'default'
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/api/calendar/events/${calendarId}/${eventId}?user_id=${userId}`,
    { method: 'DELETE' }
  );
  
  if (!response.ok) {
    throw new Error('Failed to delete event');
  }
}
