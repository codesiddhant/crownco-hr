# Changelog

## [12-05-2026 10:40] — Crownco HR frontend build complete

**What changed:** Built end-to-end Next.js 16.2 frontend for the Crownco HR AI Workforce Operating System. Delivered 6 role-based portals (HR Admin, Manager, Employee, Field, Recruiter, Super Admin) covering all 18 modules: smart attendance (geofence/WiFi/selfie/voice), leave with AI Impact Analysis, rewards/gamification with celebration confetti, kanban tasks with SLA + AI suggestions, call analytics with sentiment-colored transcripts + coaching, field tracking with route playback, payroll + payslip viewer, recruitment pipeline with AI ranking, health monitoring, workforce forecasting, internal comms, compliance/audit, settings, and a mobile-frame demo. All flows wired to a 500+ employee faker-seeded mock service persisted to localStorage. Includes command palette (⌘K), AI assistant drawer (⌘⇧A), notification center with WhatsApp preview, dark/light mode, page transitions, and responsive layouts.

**Files touched:** 95+ files across `app/`, `components/`, `lib/`, `hooks/`, `types/` including all 6 role portals, 14 shared/charts/maps components, mock data layer, Redux slices, README, and CHANGELOG.

**API endpoints used:** N/A — all data via in-memory `MockApiService` (`lib/mock/service.ts`) with localStorage persistence.

**Breaking change:** NO

**Branch:** main

---
