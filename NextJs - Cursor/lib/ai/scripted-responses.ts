export interface AIIntent {
  id: string;
  keywords: string[];
  reply: string;
  followUps?: string[];
}

export const AI_INTENTS: AIIntent[] = [
  {
    id: "burnout",
    keywords: ["burnout", "stressed", "overwork", "fatigue", "tired"],
    reply:
      "I'm tracking 5 employees with rising burnout risk. Top concerns: **Aarush Joshi** (62% risk, productivity ↓ 42% over 10 days) and **Tara Mehta** (58% risk, working overtime 9 days straight).\n\nSuggested actions:\n• Schedule 1:1 wellness check-ins this week\n• Redistribute 30% of their active pipeline\n• Trigger 2-day mandatory cooldown for repeat offenders\n\nShould I draft the check-in invitations?",
    followUps: ["Draft check-in invites", "Show burnout dashboard", "Reassign their pipelines"]
  },
  {
    id: "attrition",
    keywords: ["attrition", "leave company", "resignation", "quit", "leaving"],
    reply:
      "Predictive attrition flags **4 engineers** at Bengaluru Tech Park with >72% probability. Common signals: reduced commit frequency, missed standups, declining engagement score.\n\nRecommendation:\n• Schedule stay conversations within 7 days\n• Review 90th percentile comp for top quartile\n• Auto-enroll in our internal mobility program\n\nWant me to draft the stay-conversation prompts?",
    followUps: ["Draft stay conversation script", "Show attrition risk list", "Compare comp benchmarks"]
  },
  {
    id: "leave_impact",
    keywords: ["leave", "vacation", "off", "time off", "absence"],
    reply:
      "**AI Leave Impact Analysis**\n\nFor a 3-day leave request from a Senior Sales Exec:\n• Active pipeline: ₹42L across 8 deals — 3 are in negotiation\n• Pending follow-ups: 12 (4 hot leads)\n• Team workload: Already 78% utilized\n• Risk score: **68 / 100** — manageable with redistribution\n\nRecommended backups: **Priya Sharma** (skill match 94%), **Karan Verma** (availability 100%).\n\nShall I auto-assign tasks and send handover briefs?",
    followUps: ["Auto-assign backup", "Approve with conditions", "Reject and suggest alt dates"]
  },
  {
    id: "productivity",
    keywords: ["productivity", "performance", "report", "today", "yesterday"],
    reply:
      "**Today's productivity snapshot**\n• Total calls: **2,847** (+12% vs avg)\n• Talk time: **184h 22m**\n• Leads qualified: **312** (ratio 10.9%, team avg 8.4%)\n• Conversion: **6.2%** (best window: 11 AM – 2 PM)\n• Missed follow-ups: **47** ⚠️\n\nTop performer today: **Rohan Verma** (Mumbai Sales) — 89 calls, 14 qualified, 4 closed.\nLow attention: **Sales-Hyderabad** — productivity ↓ 18% — likely needs a manager check-in.",
    followUps: ["Reward top performer", "Notify Hyderabad manager", "Generate daily WhatsApp report"]
  },
  {
    id: "workforce",
    keywords: ["forecast", "hiring", "staffing", "headcount", "plan"],
    reply:
      "**Workforce Forecast — Next 30 days**\n• Predicted attrition: 3.2% (8 employees)\n• Peak workload window: May 20–28 (festive season)\n• Recommended hires: **6 Sales Execs (Mumbai/Pune)**, **2 Support Engineers (Bengaluru)**\n• Internal mobility candidates: 4 identified\n\nBudget impact: ~₹46L annualized. Approve to open requisitions?",
    followUps: ["Open requisitions", "Show shortlist", "Adjust headcount"]
  },
  {
    id: "rewards",
    keywords: ["reward", "gift", "bonus", "appreciation", "recognize"],
    reply:
      "I've identified **8 standout performers** this week eligible for spot recognition:\n• Top closer: **Aaditya Reddy** — ₹12.4L revenue\n• Best CSAT: **Sneha Iyer** — 4.9/5 avg\n• Fastest responder: **Vihaan Singh** — 38s avg\n• Perfect attendance streak: **22 employees** (14 days)\n\nSuggested rewards budget: **₹85,000** across gift cards + points. Should I auto-distribute?",
    followUps: ["Auto-distribute rewards", "Customize selection", "Send appreciation message"]
  },
  {
    id: "calls",
    keywords: ["call", "sales call", "qualified", "conversion"],
    reply:
      "**Call Analytics — Last 7 days**\n• Total calls: **18,432** | Avg duration: **3m 47s**\n• Positive sentiment: 52% | Neutral: 31% | Negative: 17%\n• Top objection: 'Pricing too high' (mentioned in 38% of negative calls)\n• AI coaching tip: Use the 4-touch sequence — teams using it have **+14% conversion**.\n\nWant me to push the 4-touch script as team default in CRM?",
    followUps: ["Update CRM playbook", "Show low-score calls", "Schedule coaching session"]
  },
  {
    id: "attendance",
    keywords: ["attendance", "late", "absent", "checkin"],
    reply:
      "**Today's attendance**\n• Marked present: **438 / 532**\n• Late arrivals: **17** (3 repeat offenders in last 7 days)\n• On approved leave: **52**\n• Unmarked / absent: **25** — pinged via WhatsApp\n• Geofence verified: 81% | WiFi: 12% | Selfie: 7%\n\n2 WiFi spoofing attempts auto-blocked from Mumbai HQ.",
    followUps: ["Show late offenders", "Send absence reminders", "View attendance heatmap"]
  },
  {
    id: "greeting",
    keywords: ["hello", "hi", "hey", "good morning", "good evening"],
    reply:
      "Hi! I'm **Crowny**, your AI HR copilot. I can help with:\n• Workforce analytics & forecasts\n• Leave impact analysis\n• Burnout & attrition risk\n• Productivity reports\n• Smart rewards suggestions\n• Drafting comms & notifications\n\nWhat would you like to explore?",
    followUps: ["Today's productivity report", "Who is at burnout risk?", "Suggest rewards for top performers"]
  }
];

export const DEFAULT_FOLLOW_UPS = [
  "Today's productivity report",
  "Who is at burnout risk?",
  "Forecast attrition for next quarter",
  "Suggest rewards for top performers"
];

export function matchIntent(input: string): AIIntent {
  const q = input.toLowerCase();
  let best: AIIntent | null = null;
  let bestScore = 0;
  for (const intent of AI_INTENTS) {
    const score = intent.keywords.reduce((s, kw) => (q.includes(kw) ? s + kw.length : s), 0);
    if (score > bestScore) {
      best = intent;
      bestScore = score;
    }
  }
  return best ?? AI_INTENTS.find((i) => i.id === "greeting")!;
}
