'use client';

import { useEffect, useRef } from 'react';
import { Volume2 } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string | null;
  onPlaybackEnd?: () => void;
}

export default function AudioPlayer({ audioUrl, onPlaybackEnd }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioUrl) return;

    // Play audio when URL changes
    const playAudio = async () => {
      if (audioRef.current) {
        try {
          await audioRef.current.play();
        } catch (error) {
          console.error('Failed to play audio:', error);
        }
      }
    };

    playAudio();

    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [audioUrl]);

  const handleEnded = () => {
    if (onPlaybackEnd) {
      onPlaybackEnd();
    }
  };

  if (!audioUrl) return null;

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-lg border border-purple-200">
      <Volume2 className="w-4 h-4 text-purple-600 animate-pulse" />
      <span className="text-sm text-purple-600 font-medium">Ava is speaking...</span>
      <audio
        ref={audioRef}
        src={audioUrl}
        onEnded={handleEnded}
        className="hidden"
      />
    </div>
  );
}
