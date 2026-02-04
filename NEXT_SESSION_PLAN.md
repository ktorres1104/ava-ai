# 🚀 Next Session: Building Ava's Voice Functionality

**Date Created:** February 4, 2026  
**Status:** Ready to start building mobile app with voice  
**Landing Page:** ✅ Complete and running at http://localhost:3005

---

## 📋 Session Summary (What We Accomplished Today)

### ✅ Completed:
1. **Landing page fully redesigned and working**
   - Fixed parsing errors (Tailwind v4 → v3.4.17)
   - Replaced emojis with Lucide React icons
   - Implemented glassmorphism, gradients, modern design
   - Improved color contrast and visual hierarchy
   - Running successfully at `http://localhost:3005`

2. **Made key decisions for Ava mobile app:**
   - LLM Strategy: OpenAI GPT-4o (primary) + GPT-4o-mini (simple tasks)
   - Voice Architecture: **Option B** (Separate STT + LLM + TTS)
   - Ready to start building the mobile app

---

## 🎯 Next Steps: Building Ava Mobile App with Voice

### **Immediate Goal (Tomorrow's Session):**
Build a working voice chat prototype where you can talk to Ava and she responds with voice.

**Timeline:** 4-6 hours for basic working prototype

---

## 🏗️ Technical Architecture Decisions

### **Voice Stack (Option B - Confirmed):**

```yaml
Speech-to-Text: OpenAI Whisper API
  - Cost: $0.006 per minute
  - Best accuracy for mobile
  - Handles accents and background noise

LLM: OpenAI GPT-4o + GPT-4o-mini
  - GPT-4o: Complex reasoning, calendar operations
  - GPT-4o-mini: Simple queries (10x cheaper)
  - Smart routing based on query complexity

Text-to-Speech: OpenAI TTS API
  - Voice: "nova" (warm, professional female voice)
  - Cost: $0.015 per 1K characters
  - Most natural-sounding option

Cost per 3-minute conversation: ~$0.20
```

### **Why Option B (Not OpenAI Realtime API):**
- ✅ More cost control
- ✅ Easier debugging and monitoring
- ✅ Can cache responses
- ✅ Works on all mobile browsers
- ✅ Can switch models easily
- 💰 ~5x cheaper than Realtime API

---

## 📂 Project Structure to Create

```
/Users/kevintorres/Documents/avaai/
├── landing/              ✅ DONE (marketing website)
├── mobile-app/           🔨 CREATE NEXT (Ava PWA)
│   ├── app/
│   │   ├── page.tsx     (main chat UI)
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── VoiceRecorder.tsx    (audio capture)
│   │   ├── AudioPlayer.tsx      (play TTS response)
│   │   ├── ChatMessage.tsx      (message bubbles)
│   │   └── ConversationHistory.tsx
│   ├── lib/
│   │   ├── api.ts       (backend API calls)
│   │   └── audio.ts     (audio utilities)
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.js
│
└── backend/              🔨 CREATE NEXT (FastAPI)
    ├── main.py          (FastAPI app setup)
    ├── routes/
    │   ├── voice.py     (STT, TTS endpoints)
    │   └── ai.py        (GPT-4o chat endpoint)
    ├── services/
    │   ├── openai_service.py  (OpenAI API wrapper)
    │   └── conversation.py    (conversation management)
    ├── models/
    │   └── schemas.py   (Pydantic models)
    ├── requirements.txt
    └── .env.example
```

---

## 🔧 Implementation Steps (Tomorrow's Session)

### **Step 1: Backend Setup (90 minutes)**

#### Create FastAPI Server:
```bash
cd /Users/kevintorres/Documents/avaai
mkdir backend
cd backend
```

#### requirements.txt:
```
fastapi==0.109.0
uvicorn[standard]==0.27.0
openai==1.12.0
python-multipart==0.0.6
pydantic==2.6.0
python-dotenv==1.0.0
python-jose[cryptography]==3.3.0
```

#### Key Files to Create:

**backend/main.py:**
- FastAPI app initialization
- CORS middleware (allow mobile app origin)
- Health check endpoint
- Mount voice and AI routes

**backend/routes/voice.py:**
- `POST /api/transcribe` - Upload audio → Whisper → text
- `POST /api/synthesize` - Text → TTS → audio file

**backend/routes/ai.py:**
- `POST /api/chat` - Text → GPT-4o → response text

**backend/services/openai_service.py:**
- Wrapper functions for OpenAI API
- Error handling and retries
- Cost tracking

#### Environment Variables (.env):
```
OPENAI_API_KEY=sk-...your-key...
OPENAI_MODEL=gpt-4o
OPENAI_TTS_VOICE=nova
OPENAI_TTS_MODEL=tts-1
OPENAI_WHISPER_MODEL=whisper-1
```

---

### **Step 2: Mobile App Setup (60 minutes)**

#### Create Next.js PWA:
```bash
cd /Users/kevintorres/Documents/avaai
npx create-next-app@latest mobile-app --typescript --tailwind --app
```

#### Install Dependencies:
```bash
npm install lucide-react
npm install @tanstack/react-query
npm install zustand
```

#### Key Components to Build:

**mobile-app/components/VoiceRecorder.tsx:**
```typescript
// Core functionality:
- MediaRecorder API to capture audio
- Record button (tap to start/stop)
- Audio level visualization
- Upload audio blob to backend /api/transcribe
- Display transcribed text
```

**mobile-app/components/AudioPlayer.tsx:**
```typescript
// Core functionality:
- Receive audio URL from backend
- Auto-play TTS response
- Show "Ava is speaking..." indicator
- Stop button for interruption
```

**mobile-app/components/ChatMessage.tsx:**
```typescript
// Message bubble component:
- User messages (right-aligned, blue)
- Ava messages (left-aligned, purple gradient)
- Timestamp
- Audio playback control
```

**mobile-app/app/page.tsx:**
```typescript
// Main chat UI:
- Conversation history
- VoiceRecorder at bottom
- "Tap to talk to Ava" button
- Loading states
- Error handling
```

---

### **Step 3: Wire Everything Together (60 minutes)**

#### Flow:
```
1. User taps microphone button
2. Browser requests mic permission
3. Start recording audio
4. User taps stop (or auto-stop after 30s)
5. Send audio blob to backend /api/transcribe
6. Backend: audio → Whisper → text
7. Send text to /api/chat
8. Backend: text → GPT-4o → response text
9. Send response to /api/synthesize
10. Backend: text → TTS → audio file URL
11. Frontend: Auto-play audio response
12. Display conversation in chat history
```

---

## 🎨 UI/UX Design Notes

### **Color Scheme (Consistent with Landing Page):**
- Primary: Purple gradient (`from-purple-600 to-purple-700`)
- Secondary: Teal accent (`teal-500`)
- Ava's messages: Gradient background
- User messages: Solid blue (`blue-500`)

### **Key UI Elements:**
- **Microphone button:** Large, center-bottom, gradient background
- **Recording state:** Pulsing animation + "Listening..." text
- **Thinking state:** Spinner + "Ava is thinking..."
- **Speaking state:** Sound wave animation + "Ava is speaking..."

### **Mobile-First Considerations:**
- Large touch targets (min 48px)
- Bottom-centered controls (thumb-friendly)
- Auto-scroll to latest message
- Prevent text zoom on input focus
- Handle portrait/landscape orientation

---

## 🔐 Security & Configuration

### **Backend CORS Setup:**
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### **OpenAI API Key:**
- Need to set up environment variable
- Store in `.env` file (gitignored)
- Never commit to git

---

## 📝 Development Phases

### **Phase 1: MVP Voice Chat (Tomorrow - 4-6 hours)**
✅ Backend with Whisper + GPT-4o + TTS  
✅ Frontend voice recorder  
✅ Basic conversation flow  
✅ Can talk to Ava and get voice responses  

**Deliverable:** Working voice chat (no calendar yet)

---

### **Phase 2: Polish UX (Day 2 - 4-6 hours)**
✅ Loading states and animations  
✅ Conversation history  
✅ Error handling  
✅ Audio improvements  

**Deliverable:** Smooth, polished experience

---

### **Phase 3: Calendar Integration (Week 2 - 8-12 hours)**
✅ Google Calendar OAuth  
✅ Read/create/update events  
✅ AI function calling  
✅ "Add dentist Tuesday 2pm" works  

**Deliverable:** Ava can manage calendar via voice

---

## 💰 Cost Estimates

### **Development Costs:**
- OpenAI API testing: ~$5-10 during development
- Domain (tryava.com): ~$12/year (if not purchased yet)
- Hosting: Free (Vercel + Railway free tiers)

### **Per-User Operating Costs (at scale):**
- Voice conversation (3 min): $0.20
- 100 conversations/month: $20 in AI costs
- Need to charge $19-29/month for profitability

---

## 🎯 Success Criteria (End of Tomorrow's Session)

### **Must Have:**
- [ ] Backend running with all three endpoints working
- [ ] Can record audio on mobile browser
- [ ] Can send audio to backend and get transcription
- [ ] Can send text to GPT-4o and get response
- [ ] Can convert response to speech and play it
- [ ] Full conversation loop works end-to-end

### **Nice to Have:**
- [ ] Conversation history displayed
- [ ] Loading animations
- [ ] Error messages
- [ ] Mobile-optimized UI

---

## 📚 Reference Documentation

### **OpenAI API Docs:**
- Whisper: https://platform.openai.com/docs/guides/speech-to-text
- Chat Completions: https://platform.openai.com/docs/guides/chat-completions
- TTS: https://platform.openai.com/docs/guides/text-to-speech

### **MediaRecorder API:**
- MDN: https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder

### **FastAPI:**
- Docs: https://fastapi.tiangolo.com/
- File uploads: https://fastapi.tiangolo.com/tutorial/request-files/

---

## 🚨 Potential Blockers & Solutions

### **1. Microphone Permissions on Mobile**
**Problem:** Browsers require HTTPS for mic access  
**Solution:** Use `ngrok` or `localtunnel` for HTTPS in development

### **2. Audio Format Compatibility**
**Problem:** Different browsers output different audio formats  
**Solution:** Use WebM (Chrome) or convert to MP3 before sending

### **3. OpenAI API Rate Limits**
**Problem:** May hit rate limits during testing  
**Solution:** Implement exponential backoff, cache responses

### **4. Large Audio Files**
**Problem:** Long recordings = large uploads  
**Solution:** Limit recordings to 30s, compress audio before upload

---

## 🔄 Context for Next Session

### **When We Resume:**
1. Verify landing page still running: `cd /Users/kevintorres/Documents/avaai/landing && npm run dev`
2. Create `backend/` directory
3. Create `mobile-app/` directory
4. Start with backend setup (FastAPI + OpenAI)
5. Build frontend voice recorder
6. Wire everything together
7. Test end-to-end conversation flow

### **Current Project State:**
- ✅ Landing page: Complete and running
- ✅ Documentation: Complete (PROJECT_OVERVIEW.md, README.md, etc.)
- ✅ Architecture decisions: Made
- ⏳ Mobile app: Not started
- ⏳ Backend: Not started

### **What You Need Before Starting:**
- OpenAI API key (get from https://platform.openai.com/api-keys)
- 4-6 hours of focused time
- Microphone-enabled device for testing

---

## 💬 Key Decisions Made

1. **Voice Architecture:** Option B (Whisper + GPT-4o + TTS)
2. **LLM:** OpenAI GPT-4o (primary) + GPT-4o-mini (simple tasks)
3. **TTS Voice:** "nova" (female, warm, professional)
4. **Development Approach:** Voice-only chat first, calendar later
5. **Timeline:** 4-6 hours for working prototype

---

## 📞 Quick Start Command (Tomorrow)

```bash
# Terminal 1: Start landing page (already done)
cd /Users/kevintorres/Documents/avaai/landing
npm run dev

# Terminal 2: Create and start backend
cd /Users/kevintorres/Documents/avaai
mkdir backend
cd backend
# ... set up FastAPI ...
uvicorn main:app --reload --port 8000

# Terminal 3: Create and start mobile app
cd /Users/kevintorres/Documents/avaai
npx create-next-app@latest mobile-app --typescript --tailwind --app
cd mobile-app
npm run dev
```

---

## ✅ Ready to Build

Everything is documented. When you come back tomorrow, just:

1. Open this file: `NEXT_SESSION_PLAN.md`
2. Say "Let's build Ava's voice functionality - start with backend"
3. I'll create the backend structure and get you coding!

**See you tomorrow! 🚀**

---

*Last updated: Feb 4, 2026 - Ready to start building*
