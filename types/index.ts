export type Role =
  | "super_admin"
  | "hr_admin"
  | "manager"
  | "employee"
  | "recruiter"
  | "field";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: Role;
  employeeId?: string;
}

export interface Branch {
  id: string;
  name: string;
  city: string;
  country: string;
  address: string;
  lat: number;
  lng: number;
  radiusMeters: number;
  wifi: { ssid: string; bssid: string }[];
  employees: number;
}

export interface Department {
  id: string;
  name: string;
  head: string;
  branchId: string;
  count: number;
}

export interface Employee {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
  role: Role;
  designation: string;
  department: string;
  branchId: string;
  manager: string | null;
  joinedAt: string;
  status: "active" | "on_leave" | "terminated" | "probation";
  employmentType: "full_time" | "part_time" | "contract" | "intern";
  ctcINR: number;
  performanceScore: number;
  productivityScore: number;
  attendanceRate: number;
  burnoutRisk: number;
  attritionRisk: number;
  consistencyScore: number;
  streak: number;
  skills: string[];
  shiftId: string;
  workMode: "office" | "remote" | "hybrid" | "field";
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: "present" | "late" | "absent" | "half_day" | "on_leave" | "weekend" | "holiday";
  source: "geo" | "wifi" | "selfie" | "voice" | "manual";
  branchId: string;
  workHours: number;
  overtimeHours: number;
  selfieConfidence?: number;
  gestureVerified?: boolean;
  flags?: string[];
}

export interface Leave {
  id: string;
  employeeId: string;
  type: "casual" | "sick" | "earned" | "unpaid" | "maternity" | "paternity" | "comp_off";
  from: string;
  to: string;
  days: number;
  halfDay: boolean;
  reason: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  appliedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  aiRiskScore: number;
  aiSuggestions: string[];
  replacementSuggestions: string[];
}

export interface LeaveBalance {
  employeeId: string;
  casual: number;
  sick: number;
  earned: number;
  comp_off: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "backlog" | "todo" | "in_progress" | "review" | "done" | "blocked";
  priority: "low" | "medium" | "high" | "urgent";
  assigneeId: string;
  reporterId: string;
  createdAt: string;
  dueAt: string;
  completedAt?: string;
  tags: string[];
  slaHours: number;
  slaBreached: boolean;
  attachments: number;
  comments: number;
  aiSuggestion?: string;
}

export interface Call {
  id: string;
  employeeId: string;
  customerName: string;
  customerPhone: string;
  startedAt: string;
  durationSec: number;
  outcome: "qualified" | "interested" | "callback" | "not_interested" | "wrong_number";
  sentiment: "positive" | "neutral" | "negative";
  aiScore: number;
  keywords: string[];
  hasObjection: boolean;
  recordingUrl: string;
}

export interface Lead {
  id: string;
  name: string;
  source: string;
  stage: "new" | "contacted" | "qualified" | "demo" | "negotiation" | "won" | "lost";
  ownerId: string;
  valueINR: number;
  createdAt: string;
  lastActivityAt: string;
  hot: boolean;
}

export interface RewardEvent {
  id: string;
  employeeId: string;
  type: "badge" | "coins" | "gift_card" | "bonus";
  title: string;
  description: string;
  points: number;
  valueINR?: number;
  awardedAt: string;
  awardedBy: string;
  icon: string;
}

export interface GiftCard {
  id: string;
  brand: string;
  title: string;
  pointsCost: number;
  valueINR: number;
  image: string;
  available: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: "bronze" | "silver" | "gold" | "platinum";
  unlocked: boolean;
  progress: number;
  target: number;
}

export interface Notification {
  id: string;
  type: "approval" | "alert" | "mention" | "ai_insight" | "reward" | "system";
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  actionLabel?: string;
  actionHref?: string;
  avatar?: string;
}

export interface Meeting {
  id: string;
  title: string;
  startAt: string;
  endAt: string;
  attendees: string[];
  location: string;
  type: "internal" | "client" | "interview" | "1_on_1";
  link?: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: string;
  experienceYears: number;
  stage: "applied" | "screening" | "interview" | "offer" | "hired" | "rejected";
  aiScore: number;
  resumeUrl: string;
  skills: string[];
  noticePeriod: string;
  currentCTC: number;
  expectedCTC: number;
  appliedAt: string;
}

export interface Payslip {
  id: string;
  employeeId: string;
  month: string;
  year: number;
  basic: number;
  hra: number;
  allowances: number;
  incentives: number;
  overtime: number;
  bonus: number;
  pf: number;
  tax: number;
  loan: number;
  net: number;
  status: "paid" | "processing" | "pending";
}

export interface FieldVisit {
  id: string;
  employeeId: string;
  customerName: string;
  customerAddress: string;
  lat: number;
  lng: number;
  arrivedAt: string;
  leftAt: string | null;
  durationMin: number;
  proof: { selfie: boolean; signature: boolean; qr: boolean };
  notes: string;
  outcome: string;
}

export interface AIInsight {
  id: string;
  category: "performance" | "attendance" | "burnout" | "workforce" | "leave" | "comms";
  severity: "info" | "success" | "warning" | "critical";
  title: string;
  body: string;
  suggestion: string;
  affectedIds: string[];
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  author: string;
  authorAvatar: string;
  createdAt: string;
  category: "company" | "policy" | "celebration" | "alert" | "ai";
  reactions: { emoji: string; count: number }[];
}

export interface AuditLog {
  id: string;
  actor: string;
  action: string;
  resource: string;
  at: string;
  ip: string;
  device: string;
}

export interface Shift {
  id: string;
  name: string;
  start: string;
  end: string;
  breakMin: number;
  type: "general" | "early" | "late" | "night";
}
