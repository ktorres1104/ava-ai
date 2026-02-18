# 📅 Calendar Integration - Implementation Plan

**Goal:** Enable Ava to manage your Google Calendar via voice and text commands

**Examples of what users will be able to do:**
- "Schedule dentist appointment Tuesday at 2pm"
- "What's on my calendar tomorrow?"
- "Move my 3pm meeting to 4pm"
- "Cancel the team standup"

---

## 🎯 Phase 1: Google Calendar OAuth Setup (1-2 hours)

### What We'll Build:
1. **Google Cloud Project setup**
   - Create project in Google Cloud Console
   - Enable Google Calendar API
   - Create OAuth 2.0 credentials
   - Configure consent screen

2. **Backend OAuth flow**
   - OAuth callback route
   - Token storage (encrypted)
   - Token refresh logic
   - Calendar service wrapper

### Files to Create/Modify:
```
backend/
  ├── routes/
  │   ├── calendar.py (NEW)
  │   └── auth.py (NEW)
  ├── services/
  │   ├── google_calendar.py (NEW)
  │   └── oauth_handler.py (NEW)
  ├── models/
  │   └── schemas.py (UPDATE - add calendar models)
  └── requirements.txt (UPDATE - add google packages)
```

---

## 🎯 Phase 2: Calendar API Routes (1 hour)

### Endpoints to Create:
```python
# Authentication
POST /api/auth/google/authorize  # Start OAuth flow
GET  /api/auth/google/callback   # Handle OAuth callback
GET  /api/auth/google/status     # Check if user is connected

# Calendar Operations
GET  /api/calendar/events        # List events
POST /api/calendar/events        # Create event
PUT  /api/calendar/events/{id}   # Update event
DELETE /api/calendar/events/{id} # Delete event
GET  /api/calendar/free-busy     # Check availability
```

---

## 🎯 Phase 3: AI Function Calling (2 hours)

### What We'll Build:
Enable GPT-4o to understand calendar commands and call appropriate functions.

**Example Flow:**
```
User: "Schedule dentist Tuesday at 2pm"
  ↓
GPT-4o: Detects calendar intent
  ↓
Function Call: create_event(
  title="Dentist appointment",
  date="2026-02-20",
  time="14:00"
)
  ↓
Ava: "I've scheduled your dentist appointment for Tuesday at 2pm"
```

### Functions to Implement:
- `list_events(start_date, end_date)`
- `create_event(title, date, time, duration)`
- `update_event(event_id, updates)`
- `delete_event(event_id)`
- `check_availability(date, time)`

---

## 🎯 Phase 4: Natural Language Processing (1 hour)

### What We'll Build:
Parse natural language dates/times:
- "tomorrow at 3pm" → `2026-02-19T15:00:00`
- "next Tuesday" → `2026-02-25T00:00:00`
- "in 2 hours" → `2026-02-18T20:00:00`

### Library to Use:
- `dateparser` - Python library for natural date parsing
- GPT-4o also helps with this!

---

## 🎯 Phase 5: Frontend UI (2 hours)

### Components to Build:
1. **Google Calendar Connect Button**
   - Prompt user to connect calendar
   - Show connection status
   - Disconnect option

2. **Calendar View (Optional for MVP)**
   - Simple list of upcoming events
   - Today's schedule
   - Next 7 days

3. **Event Display in Chat**
   - Show created events as cards
   - Display event details
   - Quick actions (edit, delete)

---

## 🎯 Phase 6: Testing & Edge Cases (1 hour)

### Test Scenarios:
- [ ] Connect Google Calendar
- [ ] Create event with voice
- [ ] Create event with text
- [ ] List today's events
- [ ] Update existing event
- [ ] Delete event
- [ ] Handle conflicts
- [ ] Token refresh
- [ ] Disconnect and reconnect

---

## 📋 Implementation Order

### Session 1: OAuth Setup (Now)
1. Create Google Cloud project
2. Set up OAuth credentials
3. Build backend OAuth flow
4. Test authorization

### Session 2: Calendar API
1. Create calendar routes
2. Implement CRUD operations
3. Test with Postman/curl

### Session 3: AI Integration
1. Add function calling to GPT-4o
2. Wire calendar functions to AI
3. Test voice commands

### Session 4: Frontend & Polish
1. Add calendar UI
2. Test end-to-end
3. Deploy updates

---

## 💰 Cost Impact

**Additional costs:**
- Google Calendar API: **FREE** (up to 1 million requests/day)
- Slightly more GPT-4o tokens for function calling: **~$0.05 extra per conversation**

**Total: Still ~$0.25 per conversation**

---

## 🔒 Security Considerations

1. **Token Storage:**
   - Store OAuth tokens encrypted in database
   - For MVP: Store in Railway environment variables (per user later)

2. **Permissions:**
   - Only request calendar.events scope (not full Google account)
   - Users can revoke access anytime

3. **Rate Limiting:**
   - Implement to prevent API abuse

---

## 🚀 MVP Features (What We'll Build First)

**Must Have:**
- ✅ Connect Google Calendar
- ✅ Create events via voice: "Schedule X at Y time"
- ✅ List today's events: "What's on my calendar?"
- ✅ Basic event details (title, time, duration)

**Nice to Have (Later):**
- Event updates/editing
- Event deletion
- Recurring events
- Calendar view UI
- Multiple calendars
- Reminders

---

## 📝 Prerequisites

Before we start, you need:
1. **Google Account** (you probably have one)
2. **~2-3 hours** for the full implementation
3. **Test calendar** (we'll use your personal calendar, or create a test one)

---

## 🎯 Let's Start!

**Ready to begin?** We'll start with:
1. Setting up Google Cloud project
2. Getting OAuth credentials
3. Building the OAuth flow

This is the foundation everything else builds on.

**Say "let's do it" and I'll guide you through setting up Google Cloud!** 🚀

---

*Estimated total time: 6-8 hours for full implementation*  
*MVP (create + list events): 3-4 hours*
