'use client';

import { useState, useRef, useEffect } from 'react';
import VoiceRecorder from '@/components/VoiceRecorder';
import AudioPlayer from '@/components/AudioPlayer';
import ChatMessage from '@/components/ChatMessage';
import { sendChatMessage, synthesizeSpeech, type ChatMessage as ChatMessageType } from '@/lib/api';
import { Sparkles, AlertCircle, Send, Keyboard, Mic, Trash2 } from 'lucide-react';

export default function Home() {
  const [messages, setMessages] = useState<Array<ChatMessageType & { timestamp: Date }>>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load conversation history from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('ava-conversation');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        const messagesWithDates = parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(messagesWithDates);
      } catch (e) {
        console.error('Failed to load conversation history:', e);
        // Show default greeting if loading fails
        const greeting = {
          role: 'assistant' as const,
          content: "Hi! I'm Ava, your personal AI assistant. How can I help you today?",
          timestamp: new Date(),
        };
        setMessages([greeting]);
      }
    } else {
      // First time - show greeting
      const greeting = {
        role: 'assistant' as const,
        content: "Hi! I'm Ava, your personal AI assistant. How can I help you today?",
        timestamp: new Date(),
      };
      setMessages([greeting]);
    }
  }, []);

  // Save conversation history to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('ava-conversation', JSON.stringify(messages));
    }
  }, [messages]);

  const handleTranscription = async (transcribedText: string, useVoiceResponse: boolean = true) => {
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

      // Convert response to speech ONLY if user used voice input
      if (useVoiceResponse) {
        const audioUrl = await synthesizeSpeech(response.response);
        setAudioUrl(audioUrl);
      }

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

  const handleTextSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const message = textInput.trim();
    if (!message || isProcessing) return;

    // Clear input immediately
    setTextInput('');
    
    // Process the message WITHOUT voice response (text only)
    await handleTranscription(message, false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTextSubmit();
    }
  };

  const handleClearConversation = () => {
    if (confirm('Clear all conversation history?')) {
      const greeting = {
        role: 'assistant' as const,
        content: "Hi! I'm Ava, your personal AI assistant. How can I help you today?",
        timestamp: new Date(),
      };
      setMessages([greeting]);
      localStorage.removeItem('ava-conversation');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-xl border-b border-purple-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-teal-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">Ava AI</h1>
            <p className="text-xs text-gray-500">Your Personal Assistant</p>
          </div>
          <button
            onClick={handleClearConversation}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
            title="Clear conversation"
          >
            <Trash2 className="w-5 h-5" />
          </button>
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

      {/* Input Area - Voice or Text */}
      <footer className="bg-white/70 backdrop-blur-xl border-t border-purple-100 py-4">
        <div className="max-w-4xl mx-auto px-4">
          {/* Mode Toggle */}
          <div className="flex justify-center gap-2 mb-3">
            <button
              onClick={() => setInputMode('voice')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                inputMode === 'voice'
                  ? 'bg-gradient-to-r from-purple-600 to-teal-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Mic className="w-4 h-4" />
              Voice
            </button>
            <button
              onClick={() => {
                setInputMode('text');
                setTimeout(() => textInputRef.current?.focus(), 100);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                inputMode === 'text'
                  ? 'bg-gradient-to-r from-purple-600 to-teal-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Keyboard className="w-4 h-4" />
              Type
            </button>
          </div>

          {/* Voice Input */}
          {inputMode === 'voice' && (
            <VoiceRecorder
              onTranscription={(text) => handleTranscription(text, true)}
              disabled={isProcessing || !!audioUrl}
            />
          )}

          {/* Text Input */}
          {inputMode === 'text' && (
            <form onSubmit={handleTextSubmit} className="flex gap-2">
              <input
                ref={textInputRef}
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message to Ava..."
                disabled={isProcessing || !!audioUrl}
                className="flex-1 px-4 py-3 rounded-full border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900 placeholder-gray-400"
              />
              <button
                type="submit"
                disabled={!textInput.trim() || isProcessing || !!audioUrl}
                className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-teal-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </form>
          )}
        </div>
      </footer>
    </div>
  );
}
