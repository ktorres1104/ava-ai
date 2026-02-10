# 🚀 Start Ava NOW - Quick Checklist

**Everything is built!** Follow these steps to test Ava:

---

## ✅ Pre-Flight Checklist (5 minutes)

### 1. Get Your OpenAI API Key

- [ ] Go to https://platform.openai.com/api-keys
- [ ] Click "Create new secret key"
- [ ] Copy the key (starts with `sk-`)
- [ ] Keep the key safe!

### 2. Configure Backend

```bash
cd /Users/kevintorres/Documents/avaai/backend
echo 'OPENAI_API_KEY=sk-YOUR-ACTUAL-KEY-HERE' > .env
```

**Replace `sk-YOUR-ACTUAL-KEY-HERE` with your real API key!**

### 3. Install Backend Dependencies

```bash
pip install -r requirements.txt
```

---

## 🎬 Launch Sequence

### Terminal 1: Start Backend

```bash
cd /Users/kevintorres/Documents/avaai/backend
python main.py
```

**Wait for:**
```
✅ Backend ready to serve requests!
```

### Terminal 2: Start Mobile App

```bash
cd /Users/kevintorres/Documents/avaai/mobile-app
npm run dev
```

**Wait for:**
```
Ready on http://localhost:3000
```

---

## 🎤 Test Ava!

### Open Browser

Go to: **http://localhost:3000**

You should see:
- ✅ "Ava AI" header with sparkle icon
- ✅ Greeting message from Ava
- ✅ Purple microphone button at bottom

### Test Voice

1. **Click the purple microphone button**
   - Browser will ask for microphone permission
   - Click "Allow"

2. **Speak clearly:**
   - "Hello Ava, how are you today?"

3. **Click the button again to stop**
   - Button turns red while recording

4. **Watch the magic:**
   - Your message appears in blue bubble
   - "Processing..." indicator shows
   - Ava's response appears in gradient bubble
   - "Ava is speaking..." indicator shows
   - **You hear Ava's voice!** 🎉

---

## 🎯 Things to Try

Say these to Ava:

- "Hello Ava!"
- "What's your name?"
- "Tell me about yourself"
- "What can you help me with?"
- "What's the weather like today?"
- "Tell me a joke"

---

## 🚨 If Something Goes Wrong

### Backend won't start

**Error: "ModuleNotFoundError"**
```bash
pip install -r requirements.txt
```

**Error: "OpenAI API key not set"**
- Check `.env` file exists in `/backend` folder
- Make sure it contains: `OPENAI_API_KEY=sk-...`

**Error: "Address already in use"**
```bash
lsof -ti:8000 | xargs kill -9
python main.py
```

### Mobile app issues

**Error: "Failed to fetch"**
- Make sure backend is running first!
- Check http://localhost:8000/health works

**Microphone not working**
- Grant permission when browser asks
- Try Chrome (best support)
- Check System Preferences → Security → Microphone

### No audio playback

- Check your volume is up
- Try different browser
- Check browser console for errors (F12)

---

## 📊 Verify Everything Works

### Check Backend

Open: http://localhost:8000/docs

You should see interactive API documentation!

### Check API Health

```bash
curl http://localhost:8000/health
```

Should return:
```json
{"status":"healthy","message":"All systems operational"}
```

### Check Mobile App

Open: http://localhost:3000

Should load without errors in browser console (F12).

---

## 🎉 Success!

If you can talk to Ava and hear her respond, **YOU DID IT!** 🚀

You built a working voice AI assistant from scratch!

---

## 📹 Next Steps

1. **Record a demo video** - show off your creation!
2. **Test different queries** - see what Ava can do
3. **Share with friends** - get feedback
4. **Add calendar integration** - make Ava even smarter

---

## 📚 Documentation

- **Setup Guide:** `SETUP_GUIDE.md` - Detailed instructions
- **What's Next:** `WHATS_NEXT.md` - Future roadmap
- **Backend Docs:** `backend/README.md` - API documentation
- **Frontend Docs:** `mobile-app/README.md` - Component details

---

## 💪 You Got This!

Everything is ready. Just follow the steps above and you'll be talking to Ava in minutes!

**Let's go! 🚀**

---

*Built: February 10, 2026 - Ava is ready to meet you!*
