'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, Loader2 } from 'lucide-react';
import { AudioRecorder } from '@/lib/audio';
import { transcribeAudio } from '@/lib/api';

interface VoiceRecorderProps {
  onTranscription: (text: string) => void;
  disabled?: boolean;
}

export default function VoiceRecorder({ onTranscription, disabled }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recorderRef = useRef<AudioRecorder | null>(null);

  useEffect(() => {
    // Initialize recorder on mount
    recorderRef.current = new AudioRecorder();
    
    return () => {
      // Cleanup on unmount
      recorderRef.current?.cleanup();
    };
  }, []);

  const stopRecording = async () => {
    if (!recorderRef.current) return;

    try {
      setIsRecording(false);
      setIsProcessing(true);

      // Stop recording and get audio blob
      const audioBlob = await recorderRef.current.stop();

      // Transcribe audio
      const transcription = await transcribeAudio(audioBlob);
      
      // Pass transcription to parent
      onTranscription(transcription);
      
    } catch (err) {
      setError('Failed to process audio. Please try again.');
      console.error('Processing error:', err);
    } finally {
      setIsProcessing(false);
      recorderRef.current?.cleanup();
    }
  };

  const startRecording = async () => {
    setError(null);
    
    try {
      if (!recorderRef.current) {
        recorderRef.current = new AudioRecorder();
      }

      await recorderRef.current.initialize();
      
      // Start recording with auto-stop on silence
      recorderRef.current.start(() => {
        // This callback fires when silence is detected
        stopRecording();
      });
      
      setIsRecording(true);
    } catch (err) {
      setError('Failed to access microphone. Please grant permission and try again.');
      console.error('Recording error:', err);
    }
  };

  const handleButtonClick = () => {
    if (isRecording) {
      // Manual stop if user clicks while recording
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Microphone Button */}
      <button
        onClick={handleButtonClick}
        disabled={disabled || isProcessing}
        className={`
          relative w-20 h-20 rounded-full flex items-center justify-center
          transition-all duration-300 shadow-lg
          ${isRecording 
            ? 'bg-gradient-to-br from-red-500 to-red-600 animate-pulse' 
            : 'bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600'
          }
          ${(disabled || isProcessing) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-110'}
        `}
      >
        {isProcessing ? (
          <Loader2 className="w-10 h-10 text-white animate-spin" />
        ) : isRecording ? (
          <Mic className="w-10 h-10 text-white animate-pulse" />
        ) : (
          <Mic className="w-10 h-10 text-white" />
        )}
      </button>

      {/* Status Text */}
      <div className="text-center">
        {isProcessing ? (
          <p className="text-sm text-gray-600 animate-pulse">
            Processing your voice...
          </p>
        ) : isRecording ? (
          <div className="space-y-1">
            <p className="text-sm text-red-600 font-medium animate-pulse">
              Listening... Speak now
            </p>
            <p className="text-xs text-gray-500">
              (Auto-stops when you finish)
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-600">
            Tap to talk to Ava
          </p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}
