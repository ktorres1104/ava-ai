# Ava AI - Landing Page

The marketing website for Ava AI personal assistant.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
# Visit http://localhost:3000
```

## 📁 Project Structure

```
landing/
├── app/
│   ├── page.tsx           # Homepage
│   ├── about/page.tsx     # About page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── public/                # Static assets
└── package.json          # Dependencies
```

## 🎨 Pages Built

- **Homepage (/)** - Complete landing page with:
  - Hero section with waitlist CTA
  - Problem statement (calendar chaos)
  - Solution showcase (Ava features)
  - Feature cards (6 key features)
  - Social proof (testimonials)
  - Founder story
  - Pricing section (3 tiers)
  - Waitlist signup form
  - Footer

- **About (/about)** - Mission, values, founder story
- **How It Works** (coming soon)
- **Pricing** (coming soon)

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Hosting:** Vercel (when deployed)

## 📝 To-Do

### Immediate (Phase 0)
- [ ] Add email capture functionality (ConvertKit/Resend integration)
- [ ] Replace placeholder mockup with actual design
- [ ] Add "How It Works" page
- [ ] Add standalone "Pricing" page
- [ ] Update founder photo placeholder
- [ ] Connect domain (tryava.com)
- [ ] Deploy to Vercel

### Soon
- [ ] Add demo video
- [ ] Create blog section
- [ ] Add analytics (Vercel Analytics)
- [ ] SEO optimization
- [ ] Add testimonials (real ones after beta)
- [ ] Mobile optimization testing

## 🚀 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

Or connect GitHub repo to Vercel for automatic deployments.

### Custom Domain Setup

1. Purchase domain (tryava.com)
2. In Vercel dashboard: Settings → Domains
3. Add domain and follow DNS instructions
4. Wait for DNS propagation (~24 hours)

## 🎯 Phase 0 Goals

- [x] Build landing page
- [ ] Collect 100+ email signups
- [ ] Run small ad test ($200)
- [ ] Validate demand before building app

## 💡 Content Updates

Key sections to customize:
- Founder name (currently placeholder)
- Founder photo
- Testimonials (add real ones after beta)
- Signup count (update as it grows)
- Demo video/screenshots

## 🔗 Links

- **Live Site:** http://localhost:3002 (dev)
- **Production:** https://tryava.com (when deployed)
- **GitHub:** TBD
- **Analytics:** TBD

---

**Status:** ✅ Phase 0 - Landing page complete, ready for deployment
