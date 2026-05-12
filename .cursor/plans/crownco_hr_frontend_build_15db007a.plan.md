---
name: Crownco HR Frontend Build
overview: Build a production-grade, fully functional Next.js 16.2 frontend prototype for "Crownco HR" — an AI Workforce Operating System — covering all 16 modules across 6 role portals with realistic mock data (500+ employees), scripted AI flows, simulated device verification, and Leaflet-based maps.
todos:
  - id: scaffold
    content: Scaffold Next.js 16.2 + TypeScript + Tailwind v4 + shadcn/ui at project root; install all deps (RTK, RTK Query, react-leaflet, faker, framer-motion, recharts, lucide, cmdk, sonner, react-hook-form, zod, @tanstack/react-table, next-themes, date-fns); configure Tailwind theme tokens with the Crownco color scheme; set up base layout, providers, dark/light mode
    status: completed
  - id: design_system
    content: "Build the design system layer: typography scale, semantic color tokens, shadcn primitives (button, card, dialog, drawer, tabs, table, popover, command, tooltip, dropdown, sheet, skeleton, badge, avatar, toast), shared components (KpiCard, DataTable wrapper, FilterBar, EmptyState, LoadingSkeleton variants, AnimatedCounter, GradientPanel, GlassCard)"
    status: completed
  - id: mock_layer
    content: "Build mock data + service layer: faker-seeded generators for 500+ employees / 6 branches / 90 days of attendance, calls, leads, tasks, leaves, payroll, rewards, notifications, candidates, meetings; MockApiService with localStorage persistence; RTK Query custom baseQuery with simulated latency; typed domain models in /types"
    status: completed
  - id: auth_flows
    content: "Authentication pages: login (any creds + role picker for demo), signup, OTP verification (animated 6-digit), biometric login UI, face verification login (simulated camera frame), forgot password, organization onboarding wizard (multi-step), invite employee flow with email preview"
    status: completed
  - id: app_shell
    content: "Global app shell: role-aware sidebar with collapsible sections + active states, top navbar with role switcher / search / notifications / AI / theme toggle / profile menu, breadcrumbs, mobile bottom-nav, page-transition wrapper using Framer Motion"
    status: completed
  - id: command_palette
    content: "Global command palette (cmdk) with grouped commands: navigation, quick actions (apply leave, mark attendance, give reward, switch role), employee/document search, recent items, AI prompts; keyboard shortcuts registry"
    status: completed
  - id: notifications_ai
    content: Notification center drawer with categorized feed (approvals, alerts, mentions, AI insights), WhatsApp message preview in phone frame, push notification preview, email template viewer; floating AI Assistant button + side drawer with scripted-intent chat, typing animation, suggestion chips, message history
    status: completed
  - id: hr_dashboard
    content: "HR Admin dashboard: total/active employees, attendance today, late/leave counts, burnout alerts, productivity score, attrition prediction, attendance heatmap, leave analytics, salary distribution, top/low performers, realtime activity feed, AI recommendation widgets, smart alerts, recent approvals, team comparison"
    status: completed
  - id: employee_dashboard
    content: "Employee dashboard: today's attendance status + check-in/out CTA, leave balance widgets, assigned tasks, daily goals progress, performance score gauge, productivity analytics, AI improvement suggestions, rewards earned + leaderboard rank, upcoming meetings, WhatsApp report preview card, AI motivation card, shift schedule, salary insights"
    status: completed
  - id: manager_dashboard
    content: "Team Manager dashboard + portal: team KPI grid, pending approvals queue, team performance graphs, team task board, analytics drilldown, leave redistribution suggestions, 1:1 scheduler"
    status: completed
  - id: attendance_module
    content: "Smart Attendance module (all 9 sub-flows): Leaflet geofence configurator with adjustable radius, WiFi attendance simulated check, live-selfie modal with mock camera frame + AI confidence reveal, random gesture prompts with animated success, voice attendance with waveform mock, correction request flow, shift-based attendance, multi-office switcher, attendance history timeline + late/OT tracking"
    status: completed
  - id: leave_module
    content: "Leave Management: apply leave multi-step form, AI Impact Analysis modal (risk score, replacement suggestions, workload redistribution, pending task alerts), leave calendar (month/week), team leave overview, half-day/sick/emergency variants, approval workflow, policy page"
    status: completed
  - id: rewards_module
    content: "Rewards & Gamification: leaderboard with rank-change animations, achievement badges grid + unlock celebration modal with confetti, points wallet, gift-card catalog with redemption flow, monthly challenges, team competitions, AI motivation engine messages"
    status: completed
  - id: tasks_module
    content: "Tasks & Workflow Engine: kanban board with drag-and-drop, task drawer with comments / file uploads / SLA timer, team-task view, AI task suggestions, workflow automation builder UI, escalation rules"
    status: completed
  - id: productivity_calls
    content: "AI Productivity Intelligence + Call/Meeting Analytics: calls/talk-time/CRM funnels, conversion analytics, lead-qualification ratio, follow-up discipline, heatmaps, team ranking, audio player UI, transcript timeline with sentiment colors, keyword highlights, AI scorecards, objection detection, coaching tips"
    status: completed
  - id: field_tracking
    content: "Field Employee Tracking + portal: Leaflet live-track map with employee markers, route playback with scrubber, visit timeline, distance/time stats, selfie/QR/signature mock proofs, expense capture with simulated AI extraction"
    status: completed
  - id: payroll_recruitment_health
    content: Payroll module (dashboard, payslip viewer with PDF-style layout, tax breakdown, incentives, OT, reimbursements) + Recruitment module + portal (candidate pipeline kanban, resume parser preview, AI candidate ranking, interview scheduler, hiring analytics) + Health Monitoring (burnout dashboard, anomaly cards) + Workforce Forecasting (attrition, staffing, hiring demand) + Internal Comms + Compliance/Audit
    status: completed
  - id: settings_mobile_polish
    content: "Settings module (org, attendance rules, WiFi whitelist editor, geofence configurator, AI settings, security, device mgmt, role permissions matrix, integrations), Mobile-frame demo routes (employee home, attendance, selfie, leave, notifications, productivity), Super Admin + Recruiter + Field Employee lightweight portals, final polish pass: empty/error states, skeletons, accessibility, keyboard shortcuts, export CSV/PDF mocks, README"
    status: completed
isProject: false
---

## Crownco HR — Full Frontend Build Plan

A single Next.js 16.2 monorepo at the project root containing every module from the spec, wired to an in-memory mock backend, with role-based portals and an investor-demo-ready UI.

### Tech stack (locked)

- **Framework**: Next.js `16.2.x` (App Router, React 19, RSC where it helps)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS v4 + CSS variables (light/dark via `next-themes`)
- **Components**: shadcn/ui (Radix primitives) + custom enterprise variants
- **Animation**: Framer Motion (page transitions, unlock celebrations, AI typing)
- **Charts**: Recharts (lazy-loaded) + custom heatmap/funnel components
- **Icons**: Lucide React
- **State**: Redux Toolkit + RTK Query (mock baseQuery hitting in-memory service)
- **Maps**: `react-leaflet` + OpenStreetMap tiles (dynamic-imported, no SSR)
- **Mock data**: `@faker-js/faker` seeded; persisted to `localStorage` after first generation
- **Forms**: `react-hook-form` + `zod`
- **Tables**: `@tanstack/react-table`
- **Misc**: `cmdk` (command palette), `sonner` (toasts), `date-fns`, `recharts`, `framer-motion`

### Color tokens (Tailwind theme)

Primary `#2563EB`, Navy `#0F172A`, Gray `#111827`. Accents Cyan `#06B6D4`, Purple `#8B5CF6`, Green `#10B981`, Amber `#F59E0B`, Red `#EF4444`. Light bg `#F8FAFC`, Dark bg `#020617` / `#0B1120`. Mapped to semantic tokens (`primary`, `accent`, `success`, `warning`, `destructive`, `muted`, `card`, etc.) so shadcn picks them up automatically.

### Folder architecture

```text
/
├─ app/
│  ├─ (auth)/               login, signup, otp, biometric, face-verify, forgot, onboarding, invite
│  ├─ (hr)/                 HR Admin portal — 15+ pages (full depth)
│  ├─ (employee)/           Employee portal — 10+ pages (full depth)
│  ├─ (manager)/            Team Manager portal — 8+ pages (full depth)
│  ├─ (field)/              Field Employee portal (lightweight)
│  ├─ (recruiter)/          Recruiter portal (lightweight)
│  ├─ (superadmin)/         Super Admin portal (lightweight)
│  ├─ (mobile)/             Mobile-frame demo routes
│  ├─ select-role/          Role switcher landing (demo aid)
│  ├─ layout.tsx, globals.css, providers.tsx
├─ components/
│  ├─ ui/                   shadcn primitives
│  ├─ layout/               app-shell, sidebar, topbar, mobile-nav, breadcrumbs
│  ├─ charts/               Recharts wrappers, heatmap, funnel, sparkline
│  ├─ attendance/           geofence-map, selfie-modal, gesture-prompt, voice-attendance, wifi-status
│  ├─ ai-assistant/         floating chat, typing animation, intent matcher
│  ├─ command-palette/      cmdk-based global search
│  ├─ notifications/        bell, drawer, whatsapp-preview, push-preview
│  ├─ maps/                 leaflet wrappers (geofence, live-track, route-playback)
│  ├─ rewards/              leaderboard, badge-grid, celebration-modal
│  └─ shared/               kpi-card, data-table, filters, skeletons, empty-state
├─ lib/
│  ├─ store/                RTK slices + RTK Query (auth, role, ui, theme)
│  ├─ api/                  mock baseQuery + endpoints (employees, attendance, leave, payroll, etc.)
│  ├─ mock/                 faker generators + seed (500+ employees, multi-branch)
│  ├─ ai/                   scripted-responses.ts, intents.ts
│  └─ utils/
├─ types/                   domain models
├─ hooks/                   useRole, useTheme, useAI, useGeofence (simulated), useSelfie (simulated)
├─ public/                  logo, mock photos, mockup frames
├─ package.json, tailwind.config.ts, tsconfig.json, next.config.mjs, components.json
```

### Mock backend layer

A single `MockApiService` in `lib/mock/service.ts` exposes async methods for every domain (employees, attendance, leaves, tasks, calls, etc.) backed by faker-generated data persisted in `localStorage`. RTK Query's `baseQuery` is replaced with a custom function that resolves these methods with a small artificial latency (150–400ms) so loading skeletons render naturally. All "writes" mutate the in-memory store and persist back, so workflows (apply leave → HR approves → reflects everywhere) feel end-to-end real.

Seed includes:

- 500+ employees across 6 branches (Mumbai, Bengaluru, Delhi NCR, Pune, Hyderabad, Dubai)
- 4 departments (Sales, Support, HR, Engineering) × multiple teams
- 90 days of attendance, calls, leads, tasks, reward events
- Realistic Indian + international names, avatars (DiceBear or boring-avatars URLs)
- Sales-CRM-style metrics (calls, talk time, lead qualification, conversions)

### Role-based portals (route groups)

Each `(role)` route group has its own `layout.tsx` with a role-specific sidebar, KPIs, and nav permissions. A **"Switch Role" picker** lives in the top navbar so a single demo session can hop between HR Admin → Manager → Employee instantly (essential for investor walk-throughs). Auth is mocked: login form accepts any credentials and assigns role from a dropdown.

### Module coverage matrix (everything from the spec)

- **Smart Attendance**: geofence (Leaflet map with adjustable radius circle), WiFi (simulated SSID/BSSID check UI), live selfie (CSS-mocked camera frame with "AI analyzing" overlay), gesture prompts (random instruction → animated success), voice attendance (waveform mock), correction requests, shift attendance, multi-office
- **AI Productivity**: calls/talk-time/CRM funnels, conversion analytics, heatmaps, AI insights cards, daily report preview
- **WhatsApp Reports**: phone-frame mockup showing today's auto-generated message
- **Leave Mgmt**: apply flow with **AI Impact Analysis modal** (risk score, replacement suggestions, workload redistribution), calendar, team overview, half-day/sick/emergency, policy page
- **Rewards & Gamification**: leaderboard with rank animations, badge grid, points wallet, gift-card catalog with redemption flow, celebration modal with confetti, monthly challenges
- **Tasks & Workflow**: kanban board (drag-and-drop), SLA tracking, comments, file uploads (mock), AI task suggestions, automation builder UI
- **Field Tracking**: Leaflet live-track map, route playback with timeline scrubber, visit timeline, distance, selfie/QR/signature mock proofs
- **AI Call & Meeting Analytics**: audio player UI, transcript timeline with sentiment-colored segments, keyword highlights, AI scorecards, coaching tips
- **Payroll**: salary dashboard, payslip viewer with PDF-like layout, tax breakdown, incentives, OT, reimbursements
- **Recruitment**: pipeline kanban, resume parser preview, candidate ranking with AI scores, interview scheduler, hiring analytics
- **Performance Intelligence**: per-employee scorecard, team comparison, behavioral consistency, burnout risk
- **Health Monitoring**: burnout dashboard with anomaly cards
- **Workforce Forecasting**: attrition prediction, staffing forecasts, hiring demand
- **Internal Comms**: announcements, polls, birthdays, emergency alerts
- **Compliance & Security**: audit logs, device mgmt, IP anomalies, access control matrix
- **Settings**: org, attendance rules, WiFi whitelist editor, geofence configurator, AI settings, security, role permissions, integrations
- **AI Assistant**: floating button + side drawer chat with scripted intents (leave impact, performance summary, workforce forecast, employee Q&A) and typing animation
- **Mobile views**: phone-frame routes showing the employee app experience for attendance, leave, notifications, productivity

### Global UX features

Command palette (`⌘K`), notification center with WhatsApp/push previews, realtime activity feed (simulated tick), calendar widget, search-everywhere, theme switcher, multi-branch selector, keyboard shortcuts (`g h` go home, etc.), Framer Motion page transitions, skeletons for every async surface, advanced data tables with filter/sort/paginate/export-CSV/PDF (mock).

### Build milestones (todos below)

The plan is broken into 18 implementation todos covering scaffolding → core systems → portals → modules → polish. Each todo produces visibly working pages so progress is observable.

### Key existing references

There are no existing files (workspace is empty bar `.git`). Everything will be created fresh at the project root. The root `package.json` will declare scripts `dev`, `build`, `start`, `lint`, `seed:mock`.

### Out of scope (explicit)

- Real auth/JWT, real backend, real WebSockets, real LLM, real getUserMedia/geolocation/WebRTC
- Native mobile apps (mobile is responsive web + phone-frame demo routes)
- Tests (Vitest/Playwright can be added in a follow-up if desired)