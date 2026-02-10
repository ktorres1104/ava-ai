# Ava AI Mobile App

Voice-enabled mobile PWA for Ava AI personal assistant.

## Features

- 🎤 **Voice Input** - MediaRecorder API for audio capture
- 🔊 **Voice Output** - Natural TTS responses from Ava
- 💬 **Chat History** - Full conversation context
- 📱 **Mobile-First** - Optimized for touch and mobile screens
- 🎨 **Modern UI** - Glassmorphism and gradient design

## Quick Start

### 1. Install Dependencies

```bash
cd mobile-app
npm install
```

### 2. Configure Environment

Create `.env.local` file:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Run Development Server

```bash
npm run dev
```

App will start at: **http://localhost:3000**

## Usage

1. **Start the backend first** (see `/backend/README.md`)
2. Open the mobile app in your browser
3. Tap the microphone button
4. Speak your message
5. Ava will respond with voice!

## Browser Requirements

- Modern browser with MediaRecorder API support
- Microphone access
- HTTPS (required for production)

### Supported Browsers

✅ Chrome/Edge (Desktop & Mobile)  
✅ Safari (iOS 14.3+)  
✅ Firefox  
❌ IE 11

## Project Structure

```
mobile-app/
├── app/
│   ├── page.tsx           # Main chat UI
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   ├── VoiceRecorder.tsx  # Audio recording
│   ├── AudioPlayer.tsx    # TTS playback
│   └── ChatMessage.tsx    # Message bubble
├── lib/
│   ├── api.ts            # Backend API calls
│   └── audio.ts          # Audio utilities
└── package.json
```

## Development

### Run with Custom Port

```bash
npm run dev -- -p 3001
```

### Build for Production

```bash
npm run build
npm start
```

### Type Checking

```bash
npm run lint
```

## Testing Voice

To test voice functionality:

1. Ensure backend is running at `http://localhost:8000`
2. Grant microphone permissions when prompted
3. Tap microphone button (purple gradient)
4. Speak clearly
5. Tap again to stop recording
6. Watch transcription appear
7. Listen to Ava's response

## Mobile Testing

### iOS

1. Open Safari on iPhone
2. Navigate to `http://localhost:3000` (or your network IP)
3. Tap Share → Add to Home Screen
4. Launch as PWA

### Android

1. Open Chrome on Android
2. Navigate to app URL
3. Tap menu → Add to Home Screen
4. Launch as PWA

## Troubleshooting

### Microphone not working

- Check browser permissions
- Use HTTPS in production
- iOS requires user gesture to start recording

### Backend connection fails

- Verify backend is running: `curl http://localhost:8000/health`
- Check CORS settings in backend
- Verify API URL in `.env.local`

### Audio playback issues

- Check browser supports MP3 playback
- Verify TTS endpoint returns audio
- Check console for errors

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8000` |

## PWA Features (Coming Soon)

- [ ] Offline support
- [ ] Push notifications
- [ ] Install prompt
- [ ] Background sync

## Performance

- Lazy load components
- Optimize audio compression
- Cache API responses
- Minimize bundle size

## Security

- Never expose API keys in frontend
- Use HTTPS in production
- Validate user input
- Sanitize AI responses

## Next Steps

1. ✅ Voice chat working
2. 🔨 Add calendar integration
3. 🔨 Add conversation memory
4. 🔨 Add user authentication
5. 🔨 Deploy to production
