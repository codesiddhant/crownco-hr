# Crownco HR — AI Workforce Operating System (Frontend)

A production-grade, fully functional Next.js 16.2 frontend prototype for **Crownco HR** — an AI-powered HRMS built for high-performance sales, CRM, field-force and operations teams.

> This is an investor-demo / MVP frontend. Backend interactions are simulated with an in-memory mock service persisted to `localStorage`. AI flows, device APIs, and tracking are scripted/mocked.

## Stack

- **Framework:** Next.js 16.2.x (App Router, React 19)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v3.4 + CSS variables (light/dark via `next-themes`)
- **Components:** shadcn/ui (Radix primitives) + custom enterprise variants
- **Animation:** Framer Motion
- **Charts:** Recharts + custom heatmap/funnel
- **State:** Redux Toolkit (auth, UI, data slices)
- **Maps:** `react-leaflet` + OpenStreetMap (no API key needed)
- **Mock data:** `@faker-js/faker` (500+ employees seeded, persisted to localStorage)
- **Forms:** `react-hook-form` + `zod`
- **Tables:** `@tanstack/react-table`
- **Misc:** `cmdk`, `sonner`, `date-fns`, `canvas-confetti`

## Quickstart

```bash
npm install
npm run dev
# Open http://localhost:3000
```

Available scripts:

- `npm run dev` — start dev server (Turbopack)
- `npm run build` — production build
- `npm run start` — start prod server
- `npm run lint` — ESLint

## Quick demo flow

1. Open **http://localhost:3000** — landing page.
2. Hit **"Open demo"** to see the role picker.
3. Pick any role (HR Admin, Manager, Employee, Field, Recruiter, Super Admin).
4. Use the top navbar **role-switcher** to hop between portals instantly.
5. Press **⌘K** for command palette, **⌘⇧A** for AI assistant.

## Routes

- `/` — Marketing landing
- `/select-role` — Role picker (demo aid)
- `/login`, `/signup`, `/otp`, `/face-verify`, `/biometric`, `/forgot-password`, `/onboarding`, `/invite`
- `/hr/*` — HR Admin portal (dashboard, employees, attendance, leave, tasks, calls, rewards, payroll, recruitment, performance, health, forecasting, communication, compliance, settings)
- `/employee/*` — Employee portal (dashboard, attendance, leave, tasks, rewards, performance, payslips, learning)
- `/manager/*` — Team Manager portal (dashboard, team, approvals, tasks, analytics, performance)
- `/field/*` — Field Employee portal (dashboard, visits, route playback, expenses)
- `/recruiter/*` — Recruiter portal (pipeline, interviews, analytics)
- `/superadmin/*` — Super Admin portal (organizations, branches, billing, audit)
- `/mobile` — Mobile app preview (5 screens in phone frame)

## Modules covered

- Smart Attendance (geofence, WiFi, live selfie + gesture, voice, corrections, shift rules)
- AI Productivity Intelligence (call/CRM funnels, conversion, heatmaps, team ranking)
- WhatsApp daily reports (preview)
- Leave Management (apply flow + AI Impact Analysis modal with risk score, replacements, handover plan)
- Rewards & Gamification (leaderboard, badges with celebration confetti, gift-card redemption, monthly challenges, AI motivation engine)
- Tasks & Workflow Engine (drag-and-drop kanban, task drawer, comments, SLA timer, AI suggestions, automations)
- Field Employee Tracking (Leaflet live-track, route playback with scrubber, visit timeline, selfie/QR/signature mock proofs, AI expense extraction)
- AI Call & Meeting Analytics (audio player UI, sentiment-colored transcripts, keyword highlights, AI scorecards, coaching tips)
- Payroll (dashboard, payslip viewer with PDF-style layout, tax breakdown, incentives, OT, reimbursements)
- Recruitment (candidate pipeline kanban, resume parser preview, AI candidate ranking, interview scheduler, hiring analytics)
- Performance Intelligence + Health Monitoring + Workforce Forecasting
- Internal Comms (announcements, birthdays, polls)
- Compliance & Security (audit logs, device mgmt, role permissions matrix)
- Settings (org, attendance rules, WiFi whitelist, geofence configurator, AI settings, security, integrations)

## Folder structure

```
/
├─ app/                # Next.js App Router routes per role
├─ components/         # ui/, layout/, charts/, attendance/, maps/, tasks/, rewards/, ai-assistant/, shared/
├─ lib/                # store/, mock/, ai/, utils
├─ types/              # domain models
├─ hooks/              # useDataset, useMounted
├─ public/             # logos, screenshots
```

## Mock backend

A single `MockApiService` in `lib/mock/service.ts` exposes the in-memory dataset (employees, attendance, leaves, calls, tasks, etc.) persisted to `localStorage`. All writes mutate that dataset, so workflows like "apply leave → HR approves → reflects everywhere" feel end-to-end real.

To reset the dataset (after schema changes), bump the `STORAGE_KEY` in `lib/mock/service.ts` or clear localStorage.

## Notes

- Map tiles come from OpenStreetMap (no key required).
- All AI flows are **scripted/canned** responses for demo purposes.
- Camera/microphone/geolocation are **simulated** (no real device access).
- This is a frontend-only prototype — no real backend, auth, or LLM integration.
