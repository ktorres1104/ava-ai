# 🚀 Ava Deployment Cheat Sheet

**Browser tabs opened for you:**
- ✅ Vercel: Deploy mobile app
- ✅ Railway: Deploy backend  
- ✅ GitHub: Your repository

---

## 📋 Step 1: Deploy Backend to Railway (15 min)

### In the Railway tab:

1. **Sign up/Login**
   - Click "Login with GitHub"
   - Authorize Railway

2. **Create New Project**
   - Click "Deploy from GitHub repo"
   - Search for: `ktorres1104/ava-ai`
   - Select it

3. **Configure Service**
   - Click on the service that was created
   - Go to "Settings"
   - Find "Root Directory" → Set to: `/backend`
   - Save

4. **Add Environment Variables**
   - Go to "Variables" tab
   - Click "Add Variable" for each:

```bash
OPENAI_API_KEY=<paste-your-key-here>
OPENAI_MODEL=gpt-4o
OPENAI_MINI_MODEL=gpt-4o-mini
OPENAI_TTS_VOICE=alloy
OPENAI_TTS_MODEL=tts-1-hd
OPENAI_WHISPER_MODEL=whisper-1
ENVIRONMENT=production
```

5. **Deploy**
   - Railway will auto-deploy
   - Wait 2-3 minutes
   - Go to "Settings" → "Domains"
   - Copy your URL (like: `ava-backend-production.up.railway.app`)
   
6. **Test Backend**
   - Visit: `https://YOUR-RAILWAY-URL/health`
   - Should see: `{"status":"healthy","message":"All systems operational"}`

✅ **SAVE YOUR RAILWAY URL - YOU'LL NEED IT FOR VERCEL!**

Example: `https://ava-backend-production.up.railway.app`

---

## 📱 Step 2: Deploy Mobile App to Vercel (10 min)

### In the Vercel tab:

1. **Sign up/Login**
   - Click "Continue with GitHub"
   - Authorize Vercel

2. **Import Project**
   - Click "Add New..." → "Project"
   - Find: `ktorres1104/ava-ai`
   - Click "Import"

3. **Configure Build Settings**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: Click "Edit" → Type: `mobile-app`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

4. **Add Environment Variable** ⚠️ IMPORTANT
   - Click "Environment Variables"
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: `https://YOUR-RAILWAY-URL` (from Step 1)
   - Example: `https://ava-backend-production.up.railway.app`
   - Click "Add"

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - You'll get a URL like: `ava-mobile.vercel.app`

6. **Test Frontend**
   - Click "Visit" or open your Vercel URL
   - Try typing a message
   - Should work!

---

## 🔧 Step 3: Update Backend CORS (5 min)

Your frontend needs permission to call your backend.

### Copy this info:
- Your Vercel URL: `https://[your-project].vercel.app`
- Your Railway URL: `https://[your-project].railway.app`

### I'll update the code for you - just give me your Vercel URL!

---

## ✅ Quick Checklist

**Backend (Railway):**
- [ ] Logged in with GitHub
- [ ] Deployed from `ktorres1104/ava-ai`
- [ ] Set root directory to `/backend`
- [ ] Added all 7 environment variables
- [ ] Copied Railway URL
- [ ] Tested /health endpoint

**Frontend (Vercel):**
- [ ] Logged in with GitHub
- [ ] Imported `ktorres1104/ava-ai`
- [ ] Set root directory to `mobile-app`
- [ ] Added `NEXT_PUBLIC_API_URL` with Railway URL
- [ ] Deployed successfully
- [ ] Copied Vercel URL
- [ ] Tested the app

---

## 🆘 Common Issues

### Backend won't start:
- Check all environment variables are set
- Make sure OPENAI_API_KEY is correct
- Check Railway logs for errors

### Frontend can't connect:
- Make sure `NEXT_PUBLIC_API_URL` points to Railway URL
- Must include `https://`
- No trailing slash
- CORS will be fixed in Step 3

### Microphone doesn't work:
- Only works on HTTPS (Vercel provides this)
- Browser must grant permission
- Check browser console for errors

---

## 💰 Your Production URLs

After deployment, save these:

- **Backend API**: `https://[your-railway-project].railway.app`
- **API Docs**: `https://[your-railway-project].railway.app/docs`
- **Mobile App**: `https://[your-vercel-project].vercel.app`

---

## 🎉 After Deployment

1. Share your Vercel URL with friends
2. Test voice on mobile (requires HTTPS ✅)
3. Tell me both URLs so I can update CORS
4. Celebrate! 🎉

---

**🚀 You can do this! Each platform takes 10-15 minutes.**

**Need help?** Just let me know which step you're on!
