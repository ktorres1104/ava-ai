'use client';

import { CalendarEvent, deleteEvent } from '@/lib/api';
import { formatEventDate, formatEventTime } from '@/lib/calendar';
import { useState } from 'react';
import { Trash2, MapPin, Clock } from 'lucide-react';

interface EventCardProps {
  event: CalendarEvent;
  onDelete?: () => void;
  compact?: boolean;
}

export default function EventCard({ event, onDelete, compact = false }: EventCardProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete "${event.title}"?`)) return;

    try {
      setDeleting(true);
      await deleteEvent(event.calendar_id, event.id);
      onDelete?.();
    } catch (error) {
      console.error('Failed to delete event:', error);
      alert('Failed to delete event');
    } finally {
      setDeleting(false);
    }
  };

  const borderColor = event.source === 'google' ? 'border-l-blue-500' : 'border-l-purple-600';
  const bgColor = event.source === 'google' ? 'bg-blue-50' : 'bg-purple-50';
  const badgeColor = event.source === 'google' ? 'bg-blue-500' : 'bg-purple-600';

  if (compact) {
    return (
      <div className={`${bgColor} ${borderColor} border-l-4 rounded-lg p-3 mb-2`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-gray-900 font-medium text-sm truncate">{event.title}</h4>
              <span className={`${badgeColor} text-white text-xs px-2 py-0.5 rounded-full shrink-0`}>
                {event.source === 'google' ? 'Google' : 'Yahoo'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Clock className="w-3 h-3" />
              <span>{formatEventTime(event.start_time)}</span>
            </div>
          </div>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-red-500 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${bgColor} ${borderColor} border-l-6 rounded-2xl p-4 mb-3 shadow-sm`}>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-gray-900 font-semibold text-lg mb-2">{event.title}</h3>
            <div className="flex items-center gap-2">
              <span className={`${badgeColor} text-white text-xs font-medium px-3 py-1 rounded-full`}>
                {event.source === 'google' ? '🔵 Google' : '🟣 Yahoo'}
              </span>
              <span className="text-gray-600 text-xs">{event.calendar_name}</span>
            </div>
          </div>
        </div>

        {/* Time */}
        <div className="flex items-center gap-2 text-gray-700">
          <Clock className="w-4 h-4" />
          <span className="text-sm">
            {formatEventDate(event.start_time)} • {formatEventTime(event.start_time)} - {formatEventTime(event.end_time)}
          </span>
        </div>

        {/* Location */}
        {event.location && (
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{event.location}</span>
          </div>
        )}

        {/* Description */}
        {event.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2 px-4 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 min-h-[44px]"
          >
            <Trash2 className="w-4 h-4" />
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
