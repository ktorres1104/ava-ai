# 🚀 Ava AI - Production Deployment Guide

**Date:** February 16, 2026  
**Status:** Ready to Deploy

---

## ✅ What's Been Prepared

- ✅ Conversation persistence added (localStorage)
- ✅ Clear conversation button
- ✅ Backend production configs (Procfile, runtime.txt)
- ✅ Git ignore files
- ✅ Smart text/voice response modes
- ✅ HD voice quality (alloy)

---

## 📋 Pre-Deployment Checklist

### Backend Requirements:
- ✅ FastAPI application ready
- ✅ OpenAI API key
- ✅ requirements.txt
- ✅ Procfile for deployment
- ✅ CORS configured

### Frontend Requirements:
- ✅ Next.js app ready
- ✅ Environment variable support
- ✅ Mobile-responsive
- ✅ Voice + text input

---

## 🎯 Deployment Steps

### **Step 1: Deploy Backend to Railway (15 minutes)**

#### 1.1 Create Railway Account
```bash
# Go to https://railway.app
# Sign up with GitHub (free tier available)
```

#### 1.2 Deploy Backend
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose `/backend` directory
4. Railway will auto-detect Python/FastAPI

#### 1.3 Configure Environment Variables
In Railway dashboard, add these variables:
```bash
OPENAI_API_KEY=sk-your-actual-key-here
OPENAI_MODEL=gpt-4o
OPENAI_MINI_MODEL=gpt-4o-mini
OPENAI_TTS_VOICE=alloy
OPENAI_TTS_MODEL=tts-1-hd
OPENAI_WHISPER_MODEL=whisper-1
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
ENVIRONMENT=production
```

#### 1.4 Get Your Backend URL
- Railway will provide a URL like: `https://ava-backend-production.up.railway.app`
- **Copy this URL** - you'll need it for the frontend

#### 1.5 Test Backend
```bash
curl https://your-backend-url.railway.app/health
# Should return: {"status":"healthy","message":"All systems operational"}
```

---

### **Step 2: Deploy Mobile App to Vercel (10 minutes)**

#### 2.1 Create Vercel Account
```bash
# Go to https://vercel.com
# Sign up with GitHub (free tier available)
```

#### 2.2 Deploy Mobile App
1. Click "Add New Project"
2. Import your GitHub repository
3. Select `/mobile-app` directory as root
4. Vercel will auto-detect Next.js

#### 2.3 Configure Environment Variables
In Vercel dashboard → Settings → Environment Variables:
```bash
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
```
**IMPORTANT**: Replace with your actual Railway backend URL from Step 1.4

#### 2.4 Deploy
- Click "Deploy"
- Wait 2-3 minutes for build
- You'll get a URL like: `https://ava-mobile.vercel.app`

---

### **Step 3: Deploy Landing Page to Vercel (10 minutes)**

#### 3.1 Deploy Landing Page (Optional but Recommended)
1. In Vercel, click "Add New Project"
2. Import same GitHub repository
3. Select `/landing` directory as root
4. No environment variables needed
5. Deploy

You'll get a URL like: `https://ava-landing.vercel.app`

---

## 🔧 Post-Deployment Configuration

### Update CORS in Backend

If you get CORS errors, update your backend main.py:

```python
# Add your Vercel URL to CORS origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://ava-mobile.vercel.app",  # Add your actual Vercel URL
        "https://*.vercel.app",           # Allow all Vercel preview deployments
        "http://localhost:3000",           # Keep for local dev
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Push this change and Railway will auto-redeploy.

---

## 📱 Testing Your Production Deployment

### 1. Test Backend API
```bash
# Health check
curl https://your-backend.railway.app/health

# API docs
open https://your-backend.railway.app/docs
```

### 2. Test Mobile App
```bash
# Open your Vercel URL
open https://ava-mobile.vercel.app

# Test on mobile:
# - Open on your phone's browser
# - Allow microphone access
# - Try voice input
# - Try text input
# - Check conversation persists on refresh
```

### 3. Test Features
- [ ] Voice input works (requires HTTPS ✅)
- [ ] Text input works
- [ ] Voice responses play for spoken input
- [ ] Text-only responses for typed input
- [ ] Conversation history persists on refresh
- [ ] Clear conversation button works
- [ ] Mobile layout looks good
- [ ] No console errors

---

## 🚨 Troubleshooting

### Backend Won't Start
**Check Railway logs:**
- Go to Railway dashboard → Deployments → View logs
- Common issues:
  - Missing OPENAI_API_KEY
  - Python version mismatch
  - Missing dependencies

**Fix:**
```bash
# Make sure runtime.txt exists with: python-3.11.0
# Make sure all env vars are set in Railway dashboard
```

### Frontend Can't Connect to Backend
**Check:**
1. Backend is running (visit /health endpoint)
2. NEXT_PUBLIC_API_URL is correct in Vercel
3. CORS is configured with Vercel URL
4. No typos in URLs (https://, trailing slashes, etc.)

### Microphone Doesn't Work
**Requirements:**
- ✅ HTTPS (Vercel provides this automatically)
- ✅ User must grant permission
- ✅ Works on modern browsers (Chrome, Safari, Edge)

**If still not working:**
- Check browser console for errors
- Test on different browser
- Try on mobile vs desktop

### Voice Quality Issues
**Check backend logs:**
- Is TTS model set to "tts-1-hd"?
- Is voice set to "alloy"?
- Are responses completing successfully?

---

## 💰 Cost Tracking

### Railway (Backend)
- **Free tier**: $5 credit/month
- **Estimated usage**: ~$3-5/month (with light traffic)
- **Upgrade if needed**: $5/month

### Vercel (Frontend)
- **Free tier**: 100GB bandwidth
- **Estimated usage**: Well within free tier
- **No credit card required**

### OpenAI API
- **Costs per user session**:
  - Voice conversation: ~$0.20 per 3 minutes
  - Text conversation: ~$0.10 per 10 messages
- **Monitor usage**: https://platform.openai.com/usage

---

## 🔐 Security Best Practices

### ✅ Already Implemented:
- Environment variables (not in code)
- HTTPS enabled (Vercel/Railway default)
- CORS protection
- Input validation (Pydantic)

### 🔜 TODO for Production:
- [ ] Rate limiting (prevent abuse)
- [ ] User authentication
- [ ] Cost monitoring per user
- [ ] Error tracking (Sentry)
- [ ] Analytics (Vercel Analytics)

---

## 📊 Monitoring

### Railway Dashboard
- Monitor backend health
- View logs in real-time
- Track CPU/Memory usage
- See deploy history

### Vercel Dashboard
- View deployment status
- Monitor page performance
- Check bandwidth usage
- See visitor analytics

### OpenAI Dashboard
- Track API usage
- Monitor costs
- View rate limits
- Check error rates

---

## 🔄 Continuous Deployment

### Auto-Deploy Setup

**Railway (Backend):**
- ✅ Connected to GitHub
- ✅ Auto-deploys on push to main
- ⚙️ Watches `/backend` directory

**Vercel (Frontend):**
- ✅ Connected to GitHub
- ✅ Auto-deploys on push to main
- ⚙️ Watches `/mobile-app` directory
- 🔍 Preview deployments for PRs

### Deployment Workflow:
```bash
# Make changes locally
git add .
git commit -m "Improve voice quality"
git push origin main

# Auto-deploys:
# - Railway rebuilds backend (~2 min)
# - Vercel rebuilds frontend (~1 min)
# - Test at production URLs
```

---

## 📝 Custom Domain (Optional)

### Add Custom Domain to Vercel
1. Buy domain (e.g., tryava.com)
2. In Vercel → Settings → Domains
3. Add domain
4. Update DNS records (Vercel provides instructions)
5. SSL certificate auto-issued

### Add Custom Domain to Railway
1. In Railway → Settings → Domains
2. Add custom domain
3. Update DNS records
4. SSL certificate auto-issued

---

## 🎯 Next Steps After Deployment

### Immediate (Today):
1. ✅ Deploy backend to Railway
2. ✅ Deploy frontend to Vercel
3. ✅ Test on real mobile devices
4. ✅ Share with 5-10 friends for feedback

### This Week:
5. [ ] Monitor usage and costs
6. [ ] Collect user feedback
7. [ ] Fix any bugs that come up
8. [ ] Add analytics

### Next Week:
9. [ ] Add rate limiting
10. [ ] Improve error handling
11. [ ] Start calendar integration
12. [ ] Plan user authentication

---

## 🆘 Support Resources

### Documentation:
- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- FastAPI Docs: https://fastapi.tiangolo.com
- Next.js Docs: https://nextjs.org/docs

### Community:
- Railway Discord: https://discord.gg/railway
- Vercel Discord: https://discord.gg/vercel

---

## ✅ Deployment Checklist

Copy this checklist and check off as you go:

### Backend (Railway):
- [ ] Created Railway account
- [ ] Connected GitHub repository
- [ ] Selected /backend directory
- [ ] Added all environment variables
- [ ] Deployment successful
- [ ] /health endpoint returns 200
- [ ] /docs page loads
- [ ] Copied backend URL

### Frontend (Vercel):
- [ ] Created Vercel account
- [ ] Connected GitHub repository
- [ ] Selected /mobile-app directory
- [ ] Added NEXT_PUBLIC_API_URL
- [ ] Deployment successful
- [ ] App loads in browser
- [ ] Can type messages
- [ ] Can record voice (on HTTPS)
- [ ] Backend connection works

### Testing:
- [ ] Tested on desktop
- [ ] Tested on mobile
- [ ] Voice input works
- [ ] Text input works
- [ ] Conversation persists
- [ ] Clear button works
- [ ] No console errors
- [ ] Performance is good

### Sharing:
- [ ] Shared with 3+ friends
- [ ] Collected feedback
- [ ] Noted any issues
- [ ] Planned improvements

---

**🎉 Once deployed, you'll have Ava live and accessible from anywhere!**

**Your URLs will be:**
- Backend API: `https://[your-project].railway.app`
- Mobile App: `https://[your-project].vercel.app`
- Landing Page: `https://[your-project].vercel.app`

---

*Created: February 16, 2026*  
*Ready to deploy - follow the steps above!*
