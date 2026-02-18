# 🚀 Deploy Ava Now - Quick Start

**Everything is ready!** Follow these steps to get Ava live in 30 minutes.

---

## ✅ What's Done

- ✅ Code pushed to GitHub
- ✅ Conversation persistence added
- ✅ Backend production configs ready
- ✅ All improvements committed
- ✅ API key security fixed

**Your GitHub Repo:** https://github.com/ktorres1104/ava-ai

---

## 🎯 Deployment Steps (30 minutes)

### **Step 1: Deploy Backend to Railway (15 min)**

#### 1. Create Railway Account
- Go to: https://railway.app
- Click "Login" → "Login with GitHub"
- Authorize Railway to access your GitHub

#### 2. Create New Project
- Click "New Project"
- Select "Deploy from GitHub repo"
- Choose `ktorres1104/ava-ai`
- Railway will scan your repo

#### 3. Configure Root Directory
- Railway might ask which directory to deploy
- Select `/backend` or configure it manually:
  - Settings → Service Settings
  - Root Directory: `/backend`
  - Start Command: Leave blank (uses Procfile)

#### 4. Add Environment Variables
In Railway dashboard → Variables tab, add:

```
OPENAI_API_KEY=<your-actual-key>
OPENAI_MODEL=gpt-4o
OPENAI_MINI_MODEL=gpt-4o-mini
OPENAI_TTS_VOICE=alloy
OPENAI_TTS_MODEL=tts-1-hd
OPENAI_WHISPER_MODEL=whisper-1
ENVIRONMENT=production
```

**IMPORTANT:** Use your actual OpenAI API key!

#### 5. Deploy & Get URL
- Click "Deploy"
- Wait 2-3 minutes
- Go to Settings → Domains
- Copy your Railway URL (e.g., `ava-backend-production.up.railway.app`)
- Test it: Visit `https://your-url.railway.app/health`

✅ **Backend deployed!** Copy your Railway URL - you'll need it next.

---

### **Step 2: Deploy Mobile App to Vercel (10 min)**

#### 1. Create Vercel Account
- Go to: https://vercel.com
- Click "Sign Up" → "Continue with GitHub"
- Authorize Vercel

#### 2. Import Project
- Click "Add New..." → "Project"
- Import `ktorres1104/ava-ai`
- Vercel will detect it's a monorepo

#### 3. Configure Mobile App
- Framework Preset: Next.js
- Root Directory: `mobile-app`
- Build Command: `npm run build`
- Output Directory: `.next`

#### 4. Add Environment Variable
Before deploying, add this:
- Key: `NEXT_PUBLIC_API_URL`
- Value: `https://your-railway-url.railway.app` (from Step 1)

**IMPORTANT:** Use your actual Railway URL!

#### 5. Deploy
- Click "Deploy"
- Wait 2-3 minutes
- You'll get a URL like: `ava-mobile.vercel.app`

✅ **Mobile app deployed!**

---

### **Step 3: Update Backend CORS (5 min)**

#### Why?
Your frontend needs permission to call your backend.

#### How:
1. Note your Vercel URL (e.g., `https://ava-mobile.vercel.app`)
2. Update `/backend/main.py` locally:

```python
# Around line 35, update allow_origins:
allow_origins=[
    "https://ava-mobile.vercel.app",     # Your actual Vercel URL
    "https://*.vercel.app",               # All Vercel preview URLs
    "http://localhost:3000",              # Local development
],
```

3. Commit and push:
```bash
cd /Users/kevintorres/Documents/avaai
git add backend/main.py
git commit -m "Add Vercel URL to CORS"
git push origin main
```

4. Railway will auto-redeploy (wait 2 min)

✅ **CORS configured!**

---

## 🧪 Test Your Deployment

### 1. Test Backend
```bash
# Health check
curl https://your-railway-url.railway.app/health

# Should return:
# {"status":"healthy","message":"All systems operational"}
```

### 2. Test Frontend
- Open your Vercel URL in browser
- Type a message → Should get text response
- Try voice (if on mobile/HTTPS) → Should get voice response
- Refresh page → Conversation should persist
- Click trash icon → Should clear conversation

### 3. Test on Mobile
- Open Vercel URL on your phone
- Allow microphone access
- Try talking to Ava
- Should hear voice responses!

---

## 🎉 You're Live!

**Your Production URLs:**
- Backend API: `https://[your-project].railway.app`
- Mobile App: `https://[your-project].vercel.app`
- API Docs: `https://[your-project].railway.app/docs`

---

## 📱 Share with Friends

Now that you're live, get feedback:

1. **Share your Vercel URL** with 5-10 friends
2. **Ask them to test:**
   - Voice input
   - Text input
   - Mobile experience
   - Overall UX

3. **Collect feedback:**
   - What works well?
   - What's confusing?
   - What features do they want?
   - Would they pay for this?

---

## 💰 Monitor Costs

### Railway Dashboard
- Check deployment logs
- Monitor uptime
- Track resource usage

### Vercel Dashboard
- View deployment status
- Check bandwidth usage
- See visitor count

### OpenAI Dashboard
- Go to: https://platform.openai.com/usage
- Monitor API costs
- Set spending limits

---

## 🚨 Common Issues

### Issue: "Failed to fetch" on frontend
**Fix:** Check CORS is configured with your Vercel URL

### Issue: Microphone doesn't work
**Cause:** Needs HTTPS (Vercel provides this automatically)
**Check:** Browser permissions, modern browser required

### Issue: Backend won't start on Railway
**Check:**
- All environment variables are set
- OPENAI_API_KEY is correct
- Check Railway logs for errors

### Issue: Voice sounds robotic
**Check:** 
- `OPENAI_TTS_MODEL=tts-1-hd` (not tts-1)
- `OPENAI_TTS_VOICE=alloy`

---

## 🔄 Deploy Landing Page (Optional)

Want a marketing site?

1. In Vercel → Add New Project
2. Import `ktorres1104/ava-ai`
3. Root Directory: `landing`
4. Deploy
5. You'll get: `https://ava-landing.vercel.app`

---

## 📊 What's Next?

After deployment and testing:

### Option A: Get User Feedback (Recommended)
- Share with 10+ people
- Collect feedback
- Note bugs and feature requests
- Iterate based on feedback

### Option B: Add Calendar Integration
- Start building the killer feature
- Google Calendar OAuth
- Voice commands for calendar
- "Add meeting Tuesday 2pm"

### Option C: Add Authentication
- User sign up/login
- Save conversations per user
- Personal settings

---

## 🎯 Success Checklist

- [ ] Backend deployed to Railway
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] CORS updated
- [ ] Tested text input
- [ ] Tested voice input (on mobile)
- [ ] Conversation persists on refresh
- [ ] Shared with 5+ friends
- [ ] Collected feedback
- [ ] Monitoring costs

---

**🚀 Ready to deploy? Start with Step 1!**

**Need help?** Check the full guide: `DEPLOYMENT_GUIDE.md`

---

*Created: February 16, 2026*  
*Your code is ready - let's get it live!*
