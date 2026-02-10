# 🚀 Ava AI Setup Guide

Complete guide to get Ava running on your machine.

## ⚡ Quick Setup (5 minutes)

### Prerequisites

- ✅ Node.js 18+ installed
- ✅ Python 3.11+ installed
- ✅ OpenAI API key

### Step 1: Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the key (starts with `sk-`)
4. Keep it safe!

### Step 2: Setup Backend

```bash
# Navigate to backend
cd /Users/kevintorres/Documents/avaai/backend

# Install Python dependencies
pip install -r requirements.txt

# Create .env file
touch .env

# Add your API key to .env (use nano, vim, or any editor)
echo "OPENAI_API_KEY=sk-your-actual-key-here" > .env
```

### Step 3: Setup Mobile App

```bash
# Navigate to mobile app
cd /Users/kevintorres/Documents/avaai/mobile-app

# Dependencies already installed, but if needed:
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
```

### Step 4: Start Everything

**Terminal 1 - Backend:**
```bash
cd /Users/kevintorres/Documents/avaai/backend
python main.py
```

Wait for: `✅ Backend ready to serve requests!`

**Terminal 2 - Mobile App:**
```bash
cd /Users/kevintorres/Documents/avaai/mobile-app
npm run dev
```

Wait for: `Ready on http://localhost:3000`

**Terminal 3 - Landing Page (optional):**
```bash
cd /Users/kevintorres/Documents/avaai/landing
npm run dev
```

### Step 5: Test Ava!

1. Open **http://localhost:3000** in Chrome
2. Click the purple microphone button
3. Allow microphone access
4. Say "Hello Ava!"
5. Tap the button again to stop
6. Watch the magic happen! ✨

---

## 📋 Detailed Setup

### Backend Setup (Python/FastAPI)

#### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

If you get errors, try:
```bash
python3 -m pip install -r requirements.txt
```

#### 2. Configure Environment

Edit `.env` file with these values:

```bash
# Required
OPENAI_API_KEY=sk-your-actual-key-here

# Optional (defaults shown)
OPENAI_MODEL=gpt-4o
OPENAI_MINI_MODEL=gpt-4o-mini
OPENAI_TTS_VOICE=nova
OPENAI_TTS_MODEL=tts-1
OPENAI_WHISPER_MODEL=whisper-1
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
FRONTEND_URL=http://localhost:3000
ENVIRONMENT=development
```

#### 3. Start Backend

```bash
python main.py
```

Or with uvicorn:
```bash
uvicorn main:app --reload --port 8000
```

#### 4. Verify Backend

Open http://localhost:8000/docs - you should see API documentation!

Test health:
```bash
curl http://localhost:8000/health
```

Should return:
```json
{"status":"healthy","message":"All systems operational"}
```

---

### Mobile App Setup (Next.js)

#### 1. Install Dependencies

```bash
cd mobile-app
npm install
```

If you get peer dependency warnings:
```bash
npm install --legacy-peer-deps
```

#### 2. Configure Environment

Create `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

For network testing (access from phone):
```bash
NEXT_PUBLIC_API_URL=http://YOUR_LOCAL_IP:8000
```

Find your IP:
```bash
# Mac/Linux
ifconfig | grep "inet "

# Windows
ipconfig
```

#### 3. Start Mobile App

```bash
npm run dev
```

App starts at http://localhost:3000

#### 4. Verify Mobile App

- ✅ Page loads without errors
- ✅ "Ava AI" header visible
- ✅ Purple microphone button at bottom
- ✅ Initial greeting from Ava

---

## 🧪 Testing

### Test Backend Endpoints

#### 1. Health Check
```bash
curl http://localhost:8000/health
```

#### 2. Chat Endpoint
```bash
curl -X POST http://localhost:8000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello!",
    "conversation_history": []
  }'
```

#### 3. Whisper Transcription
```bash
# Requires audio file
curl -X POST http://localhost:8000/api/voice/transcribe \
  -F "audio=@test.webm"
```

#### 4. TTS Synthesis
```bash
curl -X POST http://localhost:8000/api/voice/synthesize \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello from Ava!", "voice": "nova"}' \
  --output response.mp3
```

### Test Mobile App

1. **Voice Recording:**
   - Click mic button → should ask for permissions
   - Speak → button should show red/pulsing
   - Click again → should process

2. **Transcription:**
   - Your words should appear as a blue message bubble
   - Should see "Processing..." indicator

3. **AI Response:**
   - Ava's response should appear in gradient bubble
   - Should see "Ava is speaking..." indicator

4. **Audio Playback:**
   - Should hear Ava's voice automatically
   - Voice should be clear and natural

---

## 🚨 Troubleshooting

### Backend Issues

#### "ModuleNotFoundError: No module named 'fastapi'"
```bash
pip install -r requirements.txt
```

#### "OpenAI API key not set"
- Check `.env` file exists in `/backend` folder
- Verify `OPENAI_API_KEY=sk-...` is set correctly
- No spaces around `=`

#### "Address already in use"
Port 8000 is taken. Kill the process:
```bash
lsof -ti:8000 | xargs kill -9
```

Or use different port:
```bash
BACKEND_PORT=8001 python main.py
```

### Mobile App Issues

#### "Failed to fetch"
- Backend not running → start backend first
- Wrong API URL → check `.env.local`
- CORS error → backend CORS should allow localhost:3000

#### "Microphone not accessible"
- Grant permissions in browser settings
- Use HTTPS in production (HTTP works on localhost)
- iOS Safari requires user gesture to start recording

#### Port 3000 already in use
```bash
lsof -ti:3000 | xargs kill -9
```

Or specify different port:
```bash
npm run dev -- -p 3001
```

Update `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Voice Recording Issues

#### Recording not starting
- Check browser console for errors
- Try different browser (Chrome recommended)
- Check microphone is not used by other app

#### Audio not transcribing
- Check backend logs for errors
- Verify OpenAI API key is valid
- Test backend transcribe endpoint directly

#### Ava not speaking
- Check audio playback in browser
- Verify TTS endpoint returns audio
- Check browser console for playback errors

---

## 📱 Mobile Device Testing

### Test on iPhone

1. **Find your computer's IP:**
   ```bash
   ifconfig | grep "inet "
   # Example: 192.168.1.100
   ```

2. **Update mobile app .env.local:**
   ```bash
   NEXT_PUBLIC_API_URL=http://192.168.1.100:8000
   ```

3. **Restart mobile app:**
   ```bash
   npm run dev
   ```

4. **On iPhone (same WiFi):**
   - Open Safari
   - Go to `http://192.168.1.100:3000`
   - Grant mic permissions
   - Test!

### Test on Android

Same steps but use Chrome browser.

---

## 🔐 Security Notes

### Development

- `.env` files are gitignored (never commit API keys!)
- Backend allows localhost CORS only
- No authentication (add in production)

### Production Checklist

- [ ] Use HTTPS (required for microphone)
- [ ] Add user authentication
- [ ] Implement rate limiting
- [ ] Use environment variables securely
- [ ] Add API key rotation
- [ ] Monitor costs per user
- [ ] Set up error tracking

---

## 💰 Cost Monitoring

### Current Costs Per Conversation

```
3-minute conversation:
- Whisper STT:     $0.018   (3 min × $0.006/min)
- GPT-4o:          $0.150   (~5K tokens)
- TTS:             $0.030   (~2K chars)
Total:             ~$0.20
```

### Monthly Estimates

```
Light user (30 conversations/month):   $6
Regular user (100 conversations/mo):   $20
Heavy user (300 conversations/mo):     $60
```

### Monitor Usage

Check OpenAI dashboard:
https://platform.openai.com/usage

---

## 📊 System Status

Check everything is running:

```bash
# Backend
curl http://localhost:8000/health

# Mobile app
curl http://localhost:3000

# Landing page
curl http://localhost:3005
```

---

## 🎯 Next Steps

Once everything works:

1. ✅ Talk to Ava and have a conversation
2. ✅ Test different queries
3. ✅ Try on mobile device
4. 🔨 Add calendar integration
5. 🔨 Add user authentication
6. 🔨 Deploy to production

---

## 📞 Quick Reference

### Start Everything

```bash
# Terminal 1
cd /Users/kevintorres/Documents/avaai/backend && python main.py

# Terminal 2
cd /Users/kevintorres/Documents/avaai/mobile-app && npm run dev

# Terminal 3 (optional)
cd /Users/kevintorres/Documents/avaai/landing && npm run dev
```

### URLs

- Backend API: http://localhost:8000
- Backend Docs: http://localhost:8000/docs
- Mobile App: http://localhost:3000
- Landing Page: http://localhost:3005

### Ports

- 8000: Backend (FastAPI)
- 3000: Mobile App (Next.js)
- 3005: Landing Page (Next.js)

---

**Need help?** Check the READMEs in each folder or review `NEXT_SESSION_PLAN.md`!
