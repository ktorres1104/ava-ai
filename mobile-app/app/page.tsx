'use client';

import { useState, useRef, useEffect } from 'react';
import VoiceRecorder from '@/components/VoiceRecorder';
import AudioPlayer from '@/components/AudioPlayer';
import ChatMessage from '@/components/ChatMessage';
import { sendChatMessage, synthesizeSpeech, type ChatMessage as ChatMessageType } from '@/lib/api';
import { Sparkles, AlertCircle } from 'lucide-react';

export default function Home() {
  const [messages, setMessages] = useState<Array<ChatMessageType & { timestamp: Date }>>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send initial greeting
  useEffect(() => {
    const greeting = {
      role: 'assistant' as const,
      content: "Hi! I'm Ava, your personal AI assistant. How can I help you today?",
      timestamp: new Date(),
    };
    setMessages([greeting]);
  }, []);

  const handleTranscription = async (transcribedText: string) => {
    setError(null);
    setIsProcessing(true);

    try {
      // Add user message to chat
      const userMessage: ChatMessageType & { timestamp: Date } = {
        role: 'user',
        content: transcribedText,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);

      // Get AI response
      const conversationHistory = messages.map(({ role, content }) => ({ role, content }));
      const response = await sendChatMessage(transcribedText, conversationHistory);

      // Add assistant message to chat
      const assistantMessage: ChatMessageType & { timestamp: Date } = {
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Convert response to speech
      const audioUrl = await synthesizeSpeech(response.response);
      setAudioUrl(audioUrl);

    } catch (err) {
      console.error('Error processing message:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePlaybackEnd = () => {
    setAudioUrl(null);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-xl border-b border-purple-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-teal-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Ava AI</h1>
            <p className="text-xs text-gray-500">Your Personal Assistant</p>
          </div>
        </div>
      </header>

      {/* Messages Container */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              role={message.role}
              content={message.content}
              timestamp={message.timestamp}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Audio Playback Indicator */}
      {audioUrl && (
        <div className="px-4 pb-2">
          <div className="max-w-4xl mx-auto">
            <AudioPlayer audioUrl={audioUrl} onPlaybackEnd={handlePlaybackEnd} />
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="px-4 pb-2">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-600">{error}</span>
            </div>
          </div>
        </div>
      )}

      {/* Voice Recorder */}
      <footer className="bg-white/70 backdrop-blur-xl border-t border-purple-100 py-6">
        <div className="max-w-4xl mx-auto px-4">
          <VoiceRecorder
            onTranscription={handleTranscription}
            disabled={isProcessing || !!audioUrl}
          />
        </div>
      </footer>
    </div>
  );
}
