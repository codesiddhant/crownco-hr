# 👑 Crownco HR — AI Workforce Operating System

A production-grade, enterprise-polish frontend prototype for **Crownco HR**, an AI-powered HRMS + Workforce Intelligence platform built for high-performance sales, CRM, field-force, and operations teams.

> Designed to feel like a fusion of **Rippling × Linear × Stripe Dashboard × Notion × HubSpot** with deep AI integration (Whisper, vLLM, self-hosted LLMs).

---

## 🔐 Role-Based Login (NEW)

Login flow now starts with a **2-step role picker**:

**Step 1 — Pick your role:**
- 👔 **HR Admin / Manager** (Full Access — blue accent)
- 👤 **Employee** (Personal Workspace — purple accent)
- 🗺 **Field Employee** (On-the-go — cyan accent)

**Step 2 — Credentials** (SSO / email / face / OTP) → routed to the correct workspace.

Each role gets a **completely separate UI, sidebar, navigation, color accent, and module set**. The route guard in `js/app.js` prevents Employees from accessing HR-only pages and vice versa.

---

## 🎯 Vision

Most HR systems just *store data*. **Crownco HR** does much more:

- Understands employee behavior
- Measures productivity automatically  
- Reduces fake attendance with multi-layered verification
- Helps HR make AI-assisted decisions
- Automates daily WhatsApp reports
- Creates a gamified employee ecosystem

---

## ✅ Implemented Features (Frontend Prototype)

### Authentication & Onboarding
- **`index.html`** — Login (Google/Microsoft SSO), face-verification login modal with liveness + gesture, OTP modal
- Enterprise-grade split-screen design with brand gradient

### HR Admin Dashboard — `dashboard.html`
- 6 live KPIs (Employees, Present, Late, On Leave, Productivity, Burnout)
- Workforce trend chart (productivity + attendance + conversion · 14 days)
- AI Insights card with 3 priority actions (critical, burnout, reward)
- Attendance method donut (Geo / WiFi / Selfie)
- Attrition risk forecast (90-day)
- Salary distribution by department
- 24×7 attendance heatmap
- Top performers leaderboard (gold/silver/bronze)
- Realtime employee activity feed
- Recent approvals table with AI risk score
- Team comparison radar chart

### Employee Workspace — `employee.html`
- Live check-in status card (WiFi-fence)
- Today's goals with progress bars
- AI Motivation card
- Leave balance (Casual/Sick/Earned)
- Performance chart (calls + qualified + conversion)
- Assigned tasks list
- 📲 **WhatsApp Report Preview** (live mock of tonight's auto-sent message)
- Performance score widget (#1 / 547)
- Achievement badges grid
- Upcoming meetings, salary insights

### Smart Attendance — `attendance.html`
- KPI strip (Total, Geo, WiFi, Selfie, Late, Fraud)
- 🌐 **Live Geo-Fence Map** with multiple pins, radius visualization, fence rings, employee status
- 📶 **WiFi Whitelist** (SSID + BSSID), anti-spoof defenses
- Today's attendance timeline table with AI confidence bars, method icons, status chips
- **Live Check-In Modal** with 3-step verification:
  - Location check ✓
  - Selfie capture with scanline + liveness chips
  - Gesture challenge (blink + head turn)
  - Animated AI confidence score
- Correction request flow

### AI Productivity Intelligence — `productivity.html`
- 6 KPIs (Calls, Talk-time, Qualified, Conversion, Missed F/U, Score)
- Workforce-wide AI Insight banner
- **Conversion funnel** (Calls → Connect → Qualify → Demo → Close)
- Team ranking leaderboard
- Calls vs Conversions 14-day chart
- Productivity-by-hour curve (peak window detection)
- Individual performance matrix table with AI verdict (Star / On track / Coach / At risk)

### Leave Management — `leave.html`
- KPI strip
- Pending requests with AI risk scoring
- **AI Impact Analysis card** (operational risk, suggested backups with skill-match %, redistribution recommendations)
- Team leave calendar
- Apply leave modal with real-time AI preview
- Leave policy summary

### Rewards & Gamification — `rewards.html`
- Monthly challenge banner ("Iron Closer")
- Master leaderboard with crowns/medals & coin balances
- Gift card catalog (Amazon, Flipkart, Swiggy, Myntra, BookMyShow, Croma)
- Achievement badges grid
- AI Motivation Engine
- Send Reward modal with AI-suggested recipients

### Tasks & Workflow — `tasks.html`
- 4-column **Kanban board** (Backlog / In Progress / Review / Done)
- Priority chips, SLA indicators, assignee avatars, comment counts
- AI Workflow Automation suggestions (auto-assign, escalate, re-route)

### Call & Meeting Analytics — `calls.html`
- Recent calls list with score + sentiment
- Selected call player with waveform visualization
- Sentiment / Talk-ratio / Energy / Objection metrics
- **AI transcript timeline** with highlighted positives (yellow) and objections (red)
- AI Coach recommendations card
- Communication quality bar chart

### Field Employee Tracking — `field.html`
- **Live map** with SVG routes, multiple pins, live indicator
- Today's visit timeline (start → clients → wrap-up)
- Active field force list (with live pulse)
- Visit verification methods (Selfie / QR / e-Sign / GPS Lock)

### People Directory — `people.html`
- Advanced search + filters (dept, branch, status)
- 24-row paginated table
- Productivity bars, burnout chips, mood emojis
- Bulk actions, export

### Payroll — `payroll.html`
- 4 KPIs (Payout, Incentives, OT, Reimbursements)
- Payroll summary table (auto-linked to attendance + performance)
- Cost distribution donut
- **Sample payslip** with full breakdown (Base + Incentive + OT + Bonus − Deductions)
- Reimbursement claims with AI-verified chips

### AI Recruitment — `recruit.html`
- 4 KPIs
- 4-column **Recruitment Kanban** (Applied → Screening → Interview → Offer)
- AI ranking score, skill tags, voice interview scores
- AI Hiring Insights (best fit, time-to-hire, voice analysis)

### Notifications — `notifications.html`
- Tabbed center (All / Unread / Mentions / Alerts / Approvals)
- 📲 **WhatsApp template editor** with live preview (Mustache-style variables)
- Email template library
- Push channel toggles (In-app / Email / WhatsApp / Push / SMS / Slack)

### Settings — `settings.html`
- 12-section settings nav (Org / Branches / Attendance / WiFi / Geo / AI / Security / Devices / Roles / Integrations / Billing / Audit)
- Attendance rules editor
- Geo-fence office table
- **AI Settings panel** (toggle every AI feature)
- Integrations grid (CRM, WhatsApp, Slack, Calendar, Teams, Razorpay, Twilio, Zapier, BambooHR)

### Mobile App Preview — `mobile.html`
- 4 phone mockups (iPhone-style):
  - 📊 Employee dashboard
  - 🤳 Selfie + Gesture check-in (dark mode)
  - 🏖 Leave application with AI impact
  - 💬 WhatsApp daily report (full chat UI)

### Global Components (every page)
- **Sidebar** with branch picker, grouped nav, AI Copilot card
- **Topbar** with command-palette search (⌘K), theme toggle (light/dark), notifications dot, profile
- **Floating AI Assistant** (bottom-right) — fully functional chat with 5 quick prompts:
  - Top performers
  - Attrition risk
  - Today attendance
  - Leave coverage
  - Productivity report
- **Toast notifications**, modals with backdrop blur, glassmorphism cards
- **Light + Dark mode** (persisted in localStorage)
- Responsive (1024 / 640 breakpoints)
- Framer-Motion-style fadeUp/pop/scan animations

---

## 🎨 Design System

- **Primary**: #2563EB (Blue), #0F172A (Navy), #111827 (Gray)
- **Accents**: #06B6D4 (Cyan), #8B5CF6 (Purple), #10B981 (Green), #F59E0B (Amber), #EF4444 (Red)
- **Backgrounds**: #F8FAFC (light), #020617 / #0B1120 (dark)
- **Type**: Inter (300–800)
- Rounded 2xl cards, soft shadows, premium gradients
- Apple + Stripe inspired clean spacing
- All charts via **Chart.js**
- Icons via **Font Awesome 6**

---

## 🗺 Functional URIs / Routes

### 🔓 Public
| Path | Module |
|---|---|
| `/index.html` | **Role-based Login** (HR / Employee / Field) + Face Verification + OTP |

### 👔 HR Admin Workspace (blue accent — full access)
| Path | Module |
|---|---|
| `/dashboard.html` | HR Command-Center Dashboard |
| `/attendance.html` | Smart Attendance (Geo + WiFi + Selfie + Gesture) |
| `/productivity.html` | AI Productivity Intelligence |
| `/calls.html` | Call & Meeting Analytics |
| `/tasks.html` | Tasks Kanban + Workflow |
| `/field.html` | Field Employee Tracking |
| `/people.html` | People Directory |
| `/leave.html` | Leave Approvals + AI Impact |
| `/payroll.html` | Smart Payroll |
| `/recruit.html` | AI Recruitment Kanban |
| `/rewards.html` | Rewards & Gamification |
| `/notifications.html` | Notification Center |
| `/settings.html` | Org / Attendance / AI / Integrations |
| `/mobile.html` | Mobile App Preview |

### 👤 Employee Workspace (purple accent — personal view)
| Path | Module |
|---|---|
| `/my-day.html` | My Day — greeting, goals, AI motivation, WhatsApp preview |
| `/my-attendance.html` | Check In/Out — WiFi/Geo/Selfie methods + history |
| `/my-tasks.html` | My Tasks (Kanban) + AI personal suggestions |
| `/my-performance.html` | My Performance — score, radar, AI coach, my calls |
| `/my-leave.html` | My Leave — balance, calendar, holidays, apply |
| `/my-payslip.html` | My Payslip — earnings, deductions, history |
| `/my-rewards.html` | My Rewards — coin wallet, badges, monthly challenge |
| `/my-leaderboard.html` | Team Leaderboard — podium + ranking |

### 🗺 Field Employee Workspace (cyan accent)
- All `/my-*` pages **plus** `/my-visits.html` — Today's field route, visit timeline, verification methods.

---

## 🎭 Visual Differentiation Per Role

| | HR Admin | Employee | Field |
|---|---|---|---|
| Sidebar logo gradient | Blue → Purple → Cyan | Purple → Pink | Cyan → Sky |
| Topbar role chip | 🟦 HR Admin | 🟣 Employee | 🟢 Field Employee |
| Nav groups | Command Center · Workforce Ops · People Mgmt · System | My Workspace · Time & Pay · Growth | Field Workspace · Performance · Time & Pay |
| Hero cards | Data-dense KPI grids, charts | Personal scorecards, gradients | Live map, route timeline |
| AI Copilot prompts | "Top performers", "Attrition", "Leave coverage" | "My leave balance", "Performance tips" | Same as employee |

---

## 📦 Data Models (Mock)

Mock data generated client-side in `js/app.js`:

- `MOCK_EMPLOYEES` — 28 employees with name, role, dept, branch, productivity (55–98), attendance %, calls, talkTime, leads qualified, salary, burnout %, mood emoji
- Pulled from realistic Indian-context name pool (First/Last), 8 departments, 9 roles, 8 branches

All KPIs, charts, leaderboards, and tables generate procedurally from these pools — no two reloads look identical for randomized sections.

---

## 🔮 Features Suggested But Not Yet Built

These were captured in the spec & can be added as next-phase modules:

1. **AI Voice Attendance** ("Mark attendance" voiceprint match) — UI scaffolded in Settings, full flow pending
2. **Smart Mood Detection** dashboard (voice tone + chat patterns)
3. **AI Learning Recommendations** (training video catalog)
4. **AI Sales Coach** (live in-call suggestion overlay)
5. **Dynamic Shift Scheduling** auto-generator UI
6. **Smart Expense Management** OCR upload flow
7. **Offline Attendance Mode** sync indicator
8. **AI Workforce Forecasting** dedicated forecast page (currently embedded in dashboard)
9. **Internal Communication Hub** (announcements, polls, birthday automation)
10. **Compliance & Audit Logs** detailed page (placeholder in Settings)
11. **Multi-company switcher** UI (current scaffolds branch switcher only)
12. **Super Admin / Recruiter** role-specific dashboards (HR Admin & Employee fully done)

---

## 🚀 Recommended Next Development Steps

1. **Migrate to Next.js 15 + ShadCN UI + TypeScript** (this prototype proves the UX; promote to production stack)
2. **Connect to real Crownco CRM/telephony APIs** (replace mock with React Query)
3. **Add real-time websocket** for live activity feed + map pins
4. **Implement Whisper + vLLM** call transcription via self-hosted endpoint
5. **Build mobile app** in **React Native / Flutter** using same component design language
6. **Add E2E tests** (Playwright) for attendance verification flows
7. **Onboarding wizard** for first-time org setup (branches, WiFi, geo)
8. **Role-based access control** middleware
9. **PDF/CSV exporters** with server-side generation
10. **WhatsApp Business API** integration for actual report delivery

---

## 🏢 Branding & Stats Featured

- **Company**: Crownco Technologies Pvt Ltd
- **Demo dataset**: 547 employees · 12 branches · Mumbai HQ
- **AI Infrastructure**: Whisper v3 · vLLM · GPU inference · self-hosted
- **Compliance**: GDPR · SOC2 · audit-logged

---

## 🌍 Ideal Industries

Real Estate · Sales Teams · Call Centers · Insurance · Field Workforce · Construction · Logistics · Recruitment · Customer Support

---

> 👉 **Open `index.html` to begin the demo.** Click "Sign in to Crownco" or try the face-verification button to enter the workspace.
