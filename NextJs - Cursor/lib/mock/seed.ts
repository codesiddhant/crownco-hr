import { faker } from "@faker-js/faker";
import type {
  Achievement,
  AIInsight,
  Announcement,
  AttendanceRecord,
  AuditLog,
  Branch,
  Call,
  Candidate,
  Department,
  Employee,
  FieldVisit,
  GiftCard,
  Lead,
  Leave,
  LeaveBalance,
  Meeting,
  Notification,
  Payslip,
  RewardEvent,
  Role,
  Shift,
  Task
} from "@/types";
import { avatarUrl } from "@/lib/utils";

faker.seed(42);

const FIRST_NAMES_IN = [
  "Aarav",
  "Ananya",
  "Arjun",
  "Aditi",
  "Rohan",
  "Priya",
  "Vihaan",
  "Ishita",
  "Karan",
  "Diya",
  "Aryan",
  "Saanvi",
  "Aniket",
  "Kavya",
  "Rahul",
  "Meera",
  "Siddharth",
  "Nisha",
  "Vikram",
  "Pooja",
  "Aditya",
  "Tara",
  "Yash",
  "Riya",
  "Dhruv",
  "Sneha",
  "Manav",
  "Anjali",
  "Kabir",
  "Aisha",
  "Neil",
  "Lakshmi",
  "Harsh",
  "Zoya",
  "Devansh",
  "Avni",
  "Aarush",
  "Trisha",
  "Faisal",
  "Mahika"
];

const LAST_NAMES_IN = [
  "Sharma",
  "Verma",
  "Patel",
  "Reddy",
  "Iyer",
  "Mehta",
  "Kapoor",
  "Singh",
  "Khan",
  "Gupta",
  "Bose",
  "Joshi",
  "Nair",
  "Pillai",
  "Saxena",
  "Kulkarni",
  "Banerjee",
  "Chatterjee",
  "Desai",
  "Shah",
  "Kumar",
  "Agarwal",
  "Malhotra",
  "Bhatt"
];

const FIRST_NAMES_INTL = [
  "Sarah",
  "James",
  "Olivia",
  "Liam",
  "Emma",
  "Noah",
  "Sophia",
  "William",
  "Ava",
  "Ethan",
  "Mason",
  "Mia",
  "Lucas",
  "Amelia",
  "Hassan",
  "Layla",
  "Omar"
];

const LAST_NAMES_INTL = [
  "Williams",
  "Brown",
  "Davis",
  "Miller",
  "Wilson",
  "Anderson",
  "Taylor",
  "Thomas",
  "Moore",
  "Al-Rashid",
  "Hassan",
  "Khoury"
];

function pickName(branchCountry: string): [string, string] {
  if (branchCountry === "UAE") {
    return [
      faker.helpers.arrayElement([...FIRST_NAMES_INTL, ...FIRST_NAMES_IN]),
      faker.helpers.arrayElement([...LAST_NAMES_INTL, ...LAST_NAMES_IN])
    ];
  }
  return [
    faker.helpers.arrayElement(FIRST_NAMES_IN),
    faker.helpers.arrayElement(LAST_NAMES_IN)
  ];
}

const DESIGNATIONS: Record<string, string[]> = {
  Sales: [
    "Sales Executive",
    "Senior Sales Executive",
    "Sales Manager",
    "Regional Sales Head",
    "BDR",
    "Account Executive",
    "Inside Sales Specialist"
  ],
  Support: [
    "Support Associate",
    "Senior Support Engineer",
    "Customer Success Manager",
    "Tech Support Lead",
    "Support Operations"
  ],
  HR: [
    "HR Associate",
    "HR Business Partner",
    "Talent Acquisition Lead",
    "HR Manager",
    "People Operations",
    "L&D Specialist"
  ],
  Engineering: [
    "Software Engineer",
    "Senior Engineer",
    "Engineering Manager",
    "DevOps Engineer",
    "QA Engineer",
    "Frontend Engineer",
    "Backend Engineer"
  ],
  Operations: [
    "Operations Associate",
    "Operations Manager",
    "Field Executive",
    "Site Supervisor",
    "Logistics Coordinator"
  ]
};

const SKILLS_BY_DEPT: Record<string, string[]> = {
  Sales: [
    "Cold Calling",
    "Negotiation",
    "CRM",
    "Pipeline Management",
    "Closing",
    "Lead Qualification",
    "B2B Sales",
    "SaaS Sales"
  ],
  Support: ["Communication", "Troubleshooting", "CRM", "Ticketing", "Empathy", "Product Knowledge"],
  HR: ["Recruitment", "Onboarding", "Compliance", "Payroll", "Employee Engagement", "L&D"],
  Engineering: ["TypeScript", "React", "Node.js", "AWS", "PostgreSQL", "Redis", "Python", "Docker"],
  Operations: ["Logistics", "Field Coordination", "Vendor Mgmt", "Reporting", "Excel"]
};

export interface SeedDataset {
  branches: Branch[];
  departments: Department[];
  employees: Employee[];
  shifts: Shift[];
  attendance: AttendanceRecord[];
  leaves: Leave[];
  leaveBalances: LeaveBalance[];
  tasks: Task[];
  calls: Call[];
  leads: Lead[];
  rewards: RewardEvent[];
  giftCards: GiftCard[];
  achievements: Record<string, Achievement[]>;
  notifications: Notification[];
  meetings: Meeting[];
  candidates: Candidate[];
  payslips: Payslip[];
  fieldVisits: FieldVisit[];
  aiInsights: AIInsight[];
  announcements: Announcement[];
  audit: AuditLog[];
}

function buildBranches(): Branch[] {
  const base = [
    {
      id: "b_mumbai",
      name: "Mumbai HQ",
      city: "Mumbai",
      country: "India",
      address: "BKC, Bandra East, Mumbai 400051",
      lat: 19.0625,
      lng: 72.8645,
      wifi: [
        { ssid: "Crownco-HQ", bssid: "A4:B1:C2:D3:E4:01" },
        { ssid: "Crownco-Guest", bssid: "A4:B1:C2:D3:E4:02" }
      ]
    },
    {
      id: "b_bengaluru",
      name: "Bengaluru Tech Park",
      city: "Bengaluru",
      country: "India",
      address: "Outer Ring Road, Bellandur, Bengaluru 560103",
      lat: 12.9279,
      lng: 77.6271,
      wifi: [{ ssid: "Crownco-BLR", bssid: "A4:B1:C2:D3:E5:11" }]
    },
    {
      id: "b_delhi",
      name: "Delhi NCR Office",
      city: "Gurugram",
      country: "India",
      address: "Cyber City, DLF Phase II, Gurugram 122002",
      lat: 28.4956,
      lng: 77.0892,
      wifi: [{ ssid: "Crownco-DEL", bssid: "A4:B1:C2:D3:E6:21" }]
    },
    {
      id: "b_pune",
      name: "Pune Sales Hub",
      city: "Pune",
      country: "India",
      address: "Hinjewadi Phase I, Pune 411057",
      lat: 18.5908,
      lng: 73.7383,
      wifi: [{ ssid: "Crownco-PUN", bssid: "A4:B1:C2:D3:E7:31" }]
    },
    {
      id: "b_hyderabad",
      name: "Hyderabad Center",
      city: "Hyderabad",
      country: "India",
      address: "HITEC City, Madhapur, Hyderabad 500081",
      lat: 17.4485,
      lng: 78.3908,
      wifi: [{ ssid: "Crownco-HYD", bssid: "A4:B1:C2:D3:E8:41" }]
    },
    {
      id: "b_dubai",
      name: "Dubai Regional",
      city: "Dubai",
      country: "UAE",
      address: "JLT, Cluster H, Dubai",
      lat: 25.0689,
      lng: 55.1404,
      wifi: [{ ssid: "Crownco-DXB", bssid: "A4:B1:C2:D3:E9:51" }]
    }
  ];

  return base.map((b, i) => ({
    ...b,
    radiusMeters: 150 + (i % 3) * 50,
    employees: [180, 110, 95, 65, 55, 30][i]
  }));
}

function buildDepartments(branches: Branch[]): Department[] {
  const names = ["Sales", "Support", "HR", "Engineering", "Operations"];
  const depts: Department[] = [];
  branches.forEach((b) => {
    names.forEach((n) => {
      depts.push({
        id: `dept_${b.id}_${n.toLowerCase()}`,
        name: n,
        head: faker.person.fullName(),
        branchId: b.id,
        count: Math.floor(b.employees / names.length) + faker.number.int({ min: -3, max: 6 })
      });
    });
  });
  return depts;
}

function buildShifts(): Shift[] {
  return [
    { id: "sh_general", name: "General", start: "09:30", end: "18:30", breakMin: 60, type: "general" },
    { id: "sh_early", name: "Early Shift", start: "07:00", end: "16:00", breakMin: 45, type: "early" },
    { id: "sh_late", name: "Late Shift", start: "13:00", end: "22:00", breakMin: 60, type: "late" },
    { id: "sh_night", name: "Night Shift", start: "22:00", end: "07:00", breakMin: 60, type: "night" }
  ];
}

function buildEmployees(branches: Branch[]): Employee[] {
  const employees: Employee[] = [];
  let counter = 1;
  const departments = ["Sales", "Support", "HR", "Engineering", "Operations"];

  branches.forEach((branch) => {
    const target = branch.employees;
    for (let i = 0; i < target; i++) {
      const dept = faker.helpers.arrayElement(departments);
      const [first, last] = pickName(branch.country);
      const id = `emp_${String(counter).padStart(4, "0")}`;
      const code = `CRN${String(counter).padStart(5, "0")}`;
      const fullName = `${first} ${last}`;
      const designation = faker.helpers.arrayElement(DESIGNATIONS[dept]);
      const isManager = /Manager|Head|Lead/.test(designation);
      const isHR = dept === "HR" && /Manager|Head|Partner/.test(designation);
      const isField = dept === "Operations" && /Field|Site/.test(designation);
      const role: Role = isHR
        ? "hr_admin"
        : isManager
          ? "manager"
          : isField
            ? "field"
            : "employee";

      const performanceScore = faker.number.int({ min: 38, max: 98 });
      const productivityScore = faker.number.int({ min: 40, max: 99 });
      const attendanceRate = faker.number.float({ min: 78, max: 100, fractionDigits: 1 });
      const burnoutRisk = faker.number.int({ min: 5, max: 92 });
      const attritionRisk = faker.number.int({ min: 2, max: 85 });
      const consistencyScore = faker.number.int({ min: 40, max: 99 });
      const streak = faker.number.int({ min: 0, max: 45 });

      employees.push({
        id,
        employeeCode: code,
        firstName: first,
        lastName: last,
        fullName,
        email: `${first.toLowerCase()}.${last.toLowerCase()}@crownco.ai`,
        phone: branch.country === "UAE" ? faker.phone.number({ style: "international" }) : `+91 ${faker.string.numeric(10)}`,
        avatar: avatarUrl(`${first}-${last}-${id}`),
        role,
        designation,
        department: dept,
        branchId: branch.id,
        manager: null,
        joinedAt: faker.date
          .between({ from: "2019-01-01", to: "2025-06-30" })
          .toISOString(),
        status: faker.helpers.weightedArrayElement([
          { value: "active", weight: 85 },
          { value: "on_leave", weight: 8 },
          { value: "probation", weight: 5 },
          { value: "terminated", weight: 2 }
        ]),
        employmentType: faker.helpers.weightedArrayElement([
          { value: "full_time", weight: 80 },
          { value: "contract", weight: 10 },
          { value: "intern", weight: 6 },
          { value: "part_time", weight: 4 }
        ]),
        ctcINR: faker.number.int({ min: 350000, max: 4800000 }),
        performanceScore,
        productivityScore,
        attendanceRate,
        burnoutRisk,
        attritionRisk,
        consistencyScore,
        streak,
        skills: faker.helpers.arrayElements(SKILLS_BY_DEPT[dept], { min: 3, max: 6 }),
        shiftId: faker.helpers.weightedArrayElement([
          { value: "sh_general", weight: 80 },
          { value: "sh_early", weight: 8 },
          { value: "sh_late", weight: 8 },
          { value: "sh_night", weight: 4 }
        ]),
        workMode: faker.helpers.weightedArrayElement([
          { value: "office", weight: 50 },
          { value: "hybrid", weight: 30 },
          { value: "remote", weight: 12 },
          { value: "field", weight: 8 }
        ])
      });
      counter++;
    }
  });

  // assign managers within branch+dept
  const byBranchDept = new Map<string, Employee[]>();
  employees.forEach((e) => {
    const key = `${e.branchId}_${e.department}`;
    if (!byBranchDept.has(key)) byBranchDept.set(key, []);
    byBranchDept.get(key)!.push(e);
  });
  employees.forEach((e) => {
    if (e.role === "manager" || e.role === "hr_admin") return;
    const peers = byBranchDept.get(`${e.branchId}_${e.department}`) || [];
    const mgr = peers.find((p) => p.role === "manager");
    e.manager = mgr ? mgr.id : null;
  });

  return employees;
}

function buildAttendance(employees: Employee[]): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const today = new Date();
  for (let d = 0; d < 90; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() - d);
    const dateStr = date.toISOString().slice(0, 10);
    const day = date.getDay();
    const isWeekend = day === 0 || day === 6;

    employees.forEach((emp) => {
      if (emp.status === "terminated") return;

      let status: AttendanceRecord["status"];
      let checkIn: string | null = null;
      let checkOut: string | null = null;
      let workHours = 0;
      let overtimeHours = 0;
      let source: AttendanceRecord["source"] = "geo";
      let selfieConfidence: number | undefined;
      let gestureVerified: boolean | undefined;
      const flags: string[] = [];

      if (isWeekend) {
        status = "weekend";
      } else {
        const roll = faker.number.float({ min: 0, max: 100, fractionDigits: 6 });
        if (roll < emp.attendanceRate - 6) {
          status = "present";
          checkIn = `${faker.number.int({ min: 9, max: 9 })}:${faker.number.int({ min: 0, max: 35 }).toString().padStart(2, "0")}`;
          checkOut = `${faker.number.int({ min: 18, max: 20 })}:${faker.number.int({ min: 0, max: 59 }).toString().padStart(2, "0")}`;
          workHours = 8 + faker.number.float({ min: -0.5, max: 1.5, fractionDigits: 1 });
          overtimeHours = Math.max(0, workHours - 9);
        } else if (roll < emp.attendanceRate) {
          status = "late";
          checkIn = `${faker.number.int({ min: 10, max: 11 })}:${faker.number.int({ min: 0, max: 59 }).toString().padStart(2, "0")}`;
          checkOut = `${faker.number.int({ min: 18, max: 20 })}:${faker.number.int({ min: 0, max: 59 }).toString().padStart(2, "0")}`;
          workHours = 7 + faker.number.float({ min: -1, max: 1, fractionDigits: 1 });
          flags.push("late_arrival");
        } else if (roll < emp.attendanceRate + 5) {
          status = "on_leave";
        } else if (roll < emp.attendanceRate + 8) {
          status = "half_day";
          checkIn = "09:30";
          checkOut = "14:00";
          workHours = 4;
        } else {
          status = "absent";
          flags.push("unmarked");
        }

        source = faker.helpers.weightedArrayElement([
          { value: "geo", weight: 35 },
          { value: "wifi", weight: 30 },
          { value: "selfie", weight: 20 },
          { value: "voice", weight: 8 },
          { value: "manual", weight: 7 }
        ]);
        if (source === "selfie" || source === "voice") {
          selfieConfidence = faker.number.float({ min: 0.86, max: 0.998, fractionDigits: 3 });
          gestureVerified = source === "selfie" ? faker.datatype.boolean({ probability: 0.94 }) : undefined;
        }
      }

      records.push({
        id: `att_${emp.id}_${dateStr}`,
        employeeId: emp.id,
        date: dateStr,
        checkIn,
        checkOut,
        status,
        source,
        branchId: emp.branchId,
        workHours: Number(workHours.toFixed(1)),
        overtimeHours: Number(overtimeHours.toFixed(1)),
        selfieConfidence,
        gestureVerified,
        flags
      });
    });
  }
  return records;
}

function buildLeaves(employees: Employee[]): Leave[] {
  const leaves: Leave[] = [];
  const types: Leave["type"][] = ["casual", "sick", "earned", "comp_off", "unpaid"];

  employees.forEach((emp) => {
    const count = faker.number.int({ min: 0, max: 6 });
    for (let i = 0; i < count; i++) {
      const from = faker.date.between({ from: "2026-01-01", to: "2026-06-30" });
      const days = faker.number.int({ min: 1, max: 5 });
      const to = new Date(from);
      to.setDate(from.getDate() + days - 1);
      const type = faker.helpers.arrayElement(types);
      const status = faker.helpers.weightedArrayElement([
        { value: "approved", weight: 60 },
        { value: "pending", weight: 25 },
        { value: "rejected", weight: 10 },
        { value: "cancelled", weight: 5 }
      ]) as Leave["status"];

      leaves.push({
        id: `lv_${emp.id}_${i}`,
        employeeId: emp.id,
        type,
        from: from.toISOString().slice(0, 10),
        to: to.toISOString().slice(0, 10),
        days,
        halfDay: faker.datatype.boolean({ probability: 0.12 }),
        reason: faker.helpers.arrayElement([
          "Family function",
          "Medical appointment",
          "Personal work",
          "Vacation",
          "Wedding in family",
          "Religious occasion",
          "Not feeling well",
          "Bereavement"
        ]),
        status,
        appliedAt: faker.date.recent({ days: 60 }).toISOString(),
        aiRiskScore: faker.number.int({ min: 5, max: 88 }),
        aiSuggestions: faker.helpers.arrayElements(
          [
            "Reassign 3 pending follow-ups",
            "Notify backup owner for active deals",
            "Defer non-urgent meetings",
            "Auto-respond on email with cover contact",
            "Block calendar for shadow handover"
          ],
          { min: 1, max: 3 }
        ),
        replacementSuggestions: faker.helpers.arrayElements(
          employees
            .filter((p) => p.department === emp.department && p.id !== emp.id)
            .map((p) => p.id),
          { min: 2, max: 4 }
        )
      });
    }
  });
  return leaves;
}

function buildLeaveBalances(employees: Employee[]): LeaveBalance[] {
  return employees.map((e) => ({
    employeeId: e.id,
    casual: faker.number.int({ min: 0, max: 12 }),
    sick: faker.number.int({ min: 0, max: 12 }),
    earned: faker.number.int({ min: 0, max: 22 }),
    comp_off: faker.number.int({ min: 0, max: 5 })
  }));
}

function buildTasks(employees: Employee[]): Task[] {
  const titles = [
    "Follow up with hot lead",
    "Prepare proposal deck",
    "Customer onboarding call",
    "Quarterly review presentation",
    "Update CRM pipeline notes",
    "Send pricing PDF",
    "Demo scheduling with prospect",
    "Renewal negotiation",
    "Discovery call with new account",
    "Handle escalation ticket",
    "Weekly sales report",
    "Coordinate with finance for invoice",
    "Verify KYC documents",
    "Site visit confirmation",
    "Schedule team 1:1s",
    "Plan town hall agenda",
    "Review compliance checklist",
    "Submit expense report",
    "Approve timesheet"
  ];

  const tasks: Task[] = [];
  employees.slice(0, 350).forEach((emp, idx) => {
    const count = faker.number.int({ min: 1, max: 5 });
    for (let i = 0; i < count; i++) {
      const title = faker.helpers.arrayElement(titles);
      const due = faker.date.soon({ days: 14 });
      const status = faker.helpers.weightedArrayElement([
        { value: "todo", weight: 30 },
        { value: "in_progress", weight: 25 },
        { value: "review", weight: 12 },
        { value: "done", weight: 25 },
        { value: "backlog", weight: 5 },
        { value: "blocked", weight: 3 }
      ]) as Task["status"];

      tasks.push({
        id: `tk_${emp.id}_${i}`,
        title,
        description: faker.lorem.paragraph(),
        status,
        priority: faker.helpers.arrayElement(["low", "medium", "high", "urgent"]) as Task["priority"],
        assigneeId: emp.id,
        reporterId: emp.manager || emp.id,
        createdAt: faker.date.recent({ days: 30 }).toISOString(),
        dueAt: due.toISOString(),
        completedAt: status === "done" ? faker.date.recent({ days: 5 }).toISOString() : undefined,
        tags: faker.helpers.arrayElements(
          ["sales", "ops", "hr", "follow-up", "client", "internal", "urgent"],
          { min: 1, max: 3 }
        ),
        slaHours: faker.helpers.arrayElement([4, 8, 24, 48, 72]),
        slaBreached: faker.datatype.boolean({ probability: 0.18 }),
        attachments: faker.number.int({ min: 0, max: 4 }),
        comments: faker.number.int({ min: 0, max: 12 }),
        aiSuggestion:
          idx % 4 === 0
            ? faker.helpers.arrayElement([
                "Auto-draft a follow-up email based on last conversation",
                "Move to high priority — client mentioned competitor",
                "Block 45 min on calendar to focus complete this task",
                "Loop in account manager — risk of churn"
              ])
            : undefined
      });
    }
  });
  return tasks;
}

function buildCalls(employees: Employee[]): Call[] {
  const sales = employees.filter((e) => e.department === "Sales" || e.department === "Support");
  const calls: Call[] = [];
  sales.slice(0, 200).forEach((emp) => {
    const count = faker.number.int({ min: 5, max: 35 });
    for (let i = 0; i < count; i++) {
      const sentiment = faker.helpers.weightedArrayElement([
        { value: "positive", weight: 45 },
        { value: "neutral", weight: 35 },
        { value: "negative", weight: 20 }
      ]) as Call["sentiment"];
      calls.push({
        id: `call_${emp.id}_${i}`,
        employeeId: emp.id,
        customerName: faker.person.fullName(),
        customerPhone: `+91 ${faker.string.numeric(10)}`,
        startedAt: faker.date.recent({ days: 30 }).toISOString(),
        durationSec: faker.number.int({ min: 25, max: 1800 }),
        outcome: faker.helpers.arrayElement([
          "qualified",
          "interested",
          "callback",
          "not_interested",
          "wrong_number"
        ]) as Call["outcome"],
        sentiment,
        aiScore: faker.number.int({ min: 35, max: 98 }),
        keywords: faker.helpers.arrayElements(
          ["pricing", "demo", "competitor", "trial", "discount", "integration", "support", "feature"],
          { min: 2, max: 5 }
        ),
        hasObjection: faker.datatype.boolean({ probability: 0.35 }),
        recordingUrl: "#"
      });
    }
  });
  return calls;
}

function buildLeads(employees: Employee[]): Lead[] {
  const sales = employees.filter((e) => e.department === "Sales");
  const leads: Lead[] = [];
  sales.forEach((emp) => {
    const count = faker.number.int({ min: 5, max: 25 });
    for (let i = 0; i < count; i++) {
      leads.push({
        id: `ld_${emp.id}_${i}`,
        name: faker.company.name(),
        source: faker.helpers.arrayElement([
          "Website",
          "Referral",
          "Cold Call",
          "LinkedIn",
          "Event",
          "Inbound",
          "WhatsApp"
        ]),
        stage: faker.helpers.weightedArrayElement([
          { value: "new", weight: 25 },
          { value: "contacted", weight: 20 },
          { value: "qualified", weight: 18 },
          { value: "demo", weight: 12 },
          { value: "negotiation", weight: 10 },
          { value: "won", weight: 9 },
          { value: "lost", weight: 6 }
        ]) as Lead["stage"],
        ownerId: emp.id,
        valueINR: faker.number.int({ min: 50000, max: 5000000 }),
        createdAt: faker.date.recent({ days: 90 }).toISOString(),
        lastActivityAt: faker.date.recent({ days: 14 }).toISOString(),
        hot: faker.datatype.boolean({ probability: 0.25 })
      });
    }
  });
  return leads;
}

function buildRewards(employees: Employee[]): RewardEvent[] {
  const events: RewardEvent[] = [];
  const top = [...employees].sort((a, b) => b.performanceScore - a.performanceScore).slice(0, 120);
  top.forEach((emp, idx) => {
    const count = faker.number.int({ min: 1, max: 5 });
    for (let i = 0; i < count; i++) {
      const type = faker.helpers.arrayElement(["badge", "coins", "gift_card", "bonus"]) as RewardEvent["type"];
      const points = type === "coins" ? faker.number.int({ min: 50, max: 1000 }) : type === "badge" ? 100 : 0;
      events.push({
        id: `rw_${emp.id}_${i}`,
        employeeId: emp.id,
        type,
        title: faker.helpers.arrayElement([
          "Top Closer of the Week",
          "Perfect Attendance",
          "Customer Champion",
          "Mentor of the Month",
          "Fastest Responder",
          "100 Calls Achiever",
          "Lead Qualification Pro",
          "7-Day Streak"
        ]),
        description: faker.lorem.sentence(),
        points,
        valueINR: type === "gift_card" ? faker.helpers.arrayElement([500, 1000, 2500, 5000]) : type === "bonus" ? faker.number.int({ min: 2000, max: 25000 }) : undefined,
        awardedAt: faker.date.recent({ days: 60 }).toISOString(),
        awardedBy: "Crownco AI",
        icon: faker.helpers.arrayElement(["Trophy", "Award", "Star", "Crown", "Flame", "Zap", "Heart", "Sparkles"])
      });
    }
  });
  return events;
}

function buildGiftCards(): GiftCard[] {
  return [
    { id: "gc_amz_500", brand: "Amazon", title: "Amazon ₹500 Voucher", pointsCost: 500, valueINR: 500, image: "/gift/amazon.svg", available: true },
    { id: "gc_amz_1k", brand: "Amazon", title: "Amazon ₹1,000 Voucher", pointsCost: 950, valueINR: 1000, image: "/gift/amazon.svg", available: true },
    { id: "gc_flip_1k", brand: "Flipkart", title: "Flipkart ₹1,000 Voucher", pointsCost: 950, valueINR: 1000, image: "/gift/flipkart.svg", available: true },
    { id: "gc_swig", brand: "Swiggy", title: "Swiggy Money ₹500", pointsCost: 500, valueINR: 500, image: "/gift/swiggy.svg", available: true },
    { id: "gc_bms", brand: "BookMyShow", title: "BMS ₹500", pointsCost: 500, valueINR: 500, image: "/gift/bms.svg", available: true },
    { id: "gc_uber", brand: "Uber", title: "Uber ₹750", pointsCost: 720, valueINR: 750, image: "/gift/uber.svg", available: true },
    { id: "gc_sb", brand: "Starbucks", title: "Starbucks ₹500", pointsCost: 500, valueINR: 500, image: "/gift/starbucks.svg", available: true },
    { id: "gc_myn", brand: "Myntra", title: "Myntra ₹2,000", pointsCost: 1900, valueINR: 2000, image: "/gift/myntra.svg", available: true },
    { id: "gc_amz_5k", brand: "Amazon", title: "Amazon ₹5,000 Voucher", pointsCost: 4700, valueINR: 5000, image: "/gift/amazon.svg", available: true }
  ];
}

function buildAchievements(employees: Employee[]): Record<string, Achievement[]> {
  const map: Record<string, Achievement[]> = {};
  const catalog = [
    { id: "ach_100_calls", name: "100 Calls Crusader", icon: "Phone", target: 100, tier: "silver" },
    { id: "ach_perfect_attend", name: "Perfect Attendance", icon: "CalendarCheck", target: 30, tier: "gold" },
    { id: "ach_7_streak", name: "7-Day Streak", icon: "Flame", target: 7, tier: "bronze" },
    { id: "ach_best_conv", name: "Best Conversion Week", icon: "TrendingUp", target: 1, tier: "gold" },
    { id: "ach_csat", name: "Highest Customer Rating", icon: "Star", target: 5, tier: "platinum" },
    { id: "ach_mentor", name: "Mentor Badge", icon: "Users", target: 3, tier: "silver" },
    { id: "ach_innovator", name: "Innovator", icon: "Lightbulb", target: 1, tier: "platinum" }
  ];
  employees.forEach((emp) => {
    map[emp.id] = catalog.map((c) => {
      const unlocked = faker.datatype.boolean({ probability: 0.55 });
      const progress = unlocked ? c.target : faker.number.int({ min: 0, max: c.target - 1 });
      return {
        id: c.id,
        name: c.name,
        description: faker.lorem.sentence(),
        icon: c.icon,
        tier: c.tier as Achievement["tier"],
        unlocked,
        progress,
        target: c.target
      };
    });
  });
  return map;
}

function buildNotifications(employees: Employee[]): Notification[] {
  const notes: Notification[] = [];
  for (let i = 0; i < 28; i++) {
    const type = faker.helpers.arrayElement([
      "approval",
      "alert",
      "mention",
      "ai_insight",
      "reward",
      "system"
    ]) as Notification["type"];
    const titles: Record<string, string[]> = {
      approval: [
        "Leave request awaiting approval",
        "Reimbursement claim — review needed",
        "Attendance correction request"
      ],
      alert: [
        "Late arrival flagged in Sales team",
        "Burnout risk detected for 3 employees",
        "WiFi spoofing attempt blocked"
      ],
      mention: ["You were tagged in #sales-pipeline", "Comment on your task: Renewal negotiation"],
      ai_insight: [
        "Productivity dropped 18% in Bengaluru team",
        "AI suggests reassigning 5 hot leads",
        "Best performance window: 11 AM – 2 PM today"
      ],
      reward: ["You earned the 7-Day Streak badge!", "200 coins credited from your manager"],
      system: ["Payroll for May processed", "Quarterly review scheduled for Friday"]
    };
    const emp = faker.helpers.arrayElement(employees);
    notes.push({
      id: `nt_${i}`,
      type,
      title: faker.helpers.arrayElement(titles[type]),
      message: faker.lorem.sentence(),
      createdAt: faker.date.recent({ days: 3 }).toISOString(),
      read: faker.datatype.boolean({ probability: 0.35 }),
      actionLabel:
        type === "approval" ? "Review" : type === "ai_insight" ? "View insight" : undefined,
      actionHref: "#",
      avatar: emp.avatar
    });
  }
  return notes;
}

function buildMeetings(employees: Employee[]): Meeting[] {
  const meetings: Meeting[] = [];
  for (let i = 0; i < 20; i++) {
    const start = faker.date.soon({ days: 7 });
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + faker.helpers.arrayElement([30, 45, 60]));
    meetings.push({
      id: `mt_${i}`,
      title: faker.helpers.arrayElement([
        "Quarterly Business Review",
        "Sales Pipeline Sync",
        "1:1 with Manager",
        "Customer Demo — Acme Corp",
        "Product Roadmap Discussion",
        "All Hands Meeting",
        "Interview — Senior SDR",
        "Vendor Negotiation Call"
      ]),
      startAt: start.toISOString(),
      endAt: end.toISOString(),
      attendees: faker.helpers
        .arrayElements(employees, { min: 2, max: 6 })
        .map((e) => e.id),
      location: faker.helpers.arrayElement(["Conference Room A", "Zoom", "Google Meet", "Mumbai HQ - Boardroom"]),
      type: faker.helpers.arrayElement(["internal", "client", "interview", "1_on_1"]) as Meeting["type"],
      link: "https://meet.crownco.ai/" + faker.string.alphanumeric(8)
    });
  }
  return meetings;
}

function buildCandidates(): Candidate[] {
  const candidates: Candidate[] = [];
  for (let i = 0; i < 48; i++) {
    const name = faker.person.fullName();
    candidates.push({
      id: `cand_${i}`,
      name,
      email: faker.internet.email(),
      phone: `+91 ${faker.string.numeric(10)}`,
      avatar: avatarUrl(name),
      role: faker.helpers.arrayElement([
        "Senior Sales Executive",
        "BDR",
        "Customer Success Manager",
        "Account Executive",
        "Frontend Engineer",
        "HR Business Partner",
        "Site Supervisor"
      ]),
      experienceYears: faker.number.int({ min: 0, max: 14 }),
      stage: faker.helpers.weightedArrayElement([
        { value: "applied", weight: 35 },
        { value: "screening", weight: 22 },
        { value: "interview", weight: 18 },
        { value: "offer", weight: 10 },
        { value: "hired", weight: 8 },
        { value: "rejected", weight: 7 }
      ]) as Candidate["stage"],
      aiScore: faker.number.int({ min: 45, max: 98 }),
      resumeUrl: "#",
      skills: faker.helpers.arrayElements(
        ["Sales", "Negotiation", "CRM", "Cold Calling", "B2B", "SaaS", "React", "TypeScript", "Hindi", "English"],
        { min: 3, max: 6 }
      ),
      noticePeriod: faker.helpers.arrayElement(["Immediate", "15 days", "30 days", "60 days", "90 days"]),
      currentCTC: faker.number.int({ min: 400000, max: 3500000 }),
      expectedCTC: faker.number.int({ min: 600000, max: 5000000 }),
      appliedAt: faker.date.recent({ days: 45 }).toISOString()
    });
  }
  return candidates;
}

function buildPayslips(employees: Employee[]): Payslip[] {
  const months = ["January", "February", "March", "April", "May"];
  const payslips: Payslip[] = [];
  employees.slice(0, 80).forEach((emp) => {
    months.forEach((month, mi) => {
      const monthly = Math.round(emp.ctcINR / 12);
      const basic = Math.round(monthly * 0.5);
      const hra = Math.round(monthly * 0.25);
      const allowances = Math.round(monthly * 0.15);
      const incentives = faker.number.int({ min: 0, max: 18000 });
      const overtime = faker.number.int({ min: 0, max: 6000 });
      const bonus = mi === 2 ? faker.number.int({ min: 0, max: 25000 }) : 0;
      const pf = Math.round(basic * 0.12);
      const tax = Math.round(monthly * 0.1);
      const loan = faker.helpers.maybe(() => faker.number.int({ min: 2000, max: 8000 }), { probability: 0.1 }) ?? 0;
      const net = basic + hra + allowances + incentives + overtime + bonus - pf - tax - loan;
      payslips.push({
        id: `ps_${emp.id}_${month}`,
        employeeId: emp.id,
        month,
        year: 2026,
        basic,
        hra,
        allowances,
        incentives,
        overtime,
        bonus,
        pf,
        tax,
        loan,
        net,
        status: mi === 4 ? "processing" : "paid"
      });
    });
  });
  return payslips;
}

function buildFieldVisits(employees: Employee[]): FieldVisit[] {
  const field = employees.filter((e) => e.workMode === "field");
  const visits: FieldVisit[] = [];
  field.slice(0, 30).forEach((emp) => {
    const count = faker.number.int({ min: 2, max: 6 });
    for (let i = 0; i < count; i++) {
      const arrived = faker.date.recent({ days: 5 });
      const duration = faker.number.int({ min: 15, max: 120 });
      const left = new Date(arrived);
      left.setMinutes(left.getMinutes() + duration);
      visits.push({
        id: `fv_${emp.id}_${i}`,
        employeeId: emp.id,
        customerName: faker.company.name(),
        customerAddress: faker.location.streetAddress() + ", " + faker.location.city(),
        lat: 19.07 + faker.number.float({ min: -0.5, max: 0.5, fractionDigits: 4 }),
        lng: 72.87 + faker.number.float({ min: -0.5, max: 0.5, fractionDigits: 4 }),
        arrivedAt: arrived.toISOString(),
        leftAt: left.toISOString(),
        durationMin: duration,
        proof: {
          selfie: faker.datatype.boolean({ probability: 0.9 }),
          signature: faker.datatype.boolean({ probability: 0.7 }),
          qr: faker.datatype.boolean({ probability: 0.5 })
        },
        notes: faker.lorem.sentence(),
        outcome: faker.helpers.arrayElement([
          "Demo completed",
          "Order placed",
          "Follow-up needed",
          "Site inspection done",
          "Documents collected"
        ])
      });
    }
  });
  return visits;
}

function buildAIInsights(employees: Employee[]): AIInsight[] {
  const insights: AIInsight[] = [];
  const topBurnout = [...employees].sort((a, b) => b.burnoutRisk - a.burnoutRisk).slice(0, 5);
  insights.push({
    id: "ai_burnout_001",
    category: "burnout",
    severity: "critical",
    title: "5 employees showing burnout signs",
    body: `Productivity dropped > 30% over 10 days with elevated call fatigue across ${topBurnout.map((e) => e.firstName).join(", ")}.`,
    suggestion: "Schedule wellness check-ins this week and rebalance pipeline load.",
    affectedIds: topBurnout.map((e) => e.id),
    createdAt: new Date().toISOString()
  });
  insights.push({
    id: "ai_workforce_001",
    category: "workforce",
    severity: "warning",
    title: "Attrition risk in Bengaluru Support team",
    body: "Predictive model flags 4 engineers with high attrition probability (>72%).",
    suggestion: "Initiate stay conversations and review compensation for top quartile.",
    affectedIds: employees
      .filter((e) => e.branchId === "b_bengaluru" && e.department === "Support")
      .slice(0, 4)
      .map((e) => e.id),
    createdAt: new Date().toISOString()
  });
  insights.push({
    id: "ai_perf_001",
    category: "performance",
    severity: "success",
    title: "Sales team conversion up 14% this week",
    body: "Best performance window: 11 AM – 2 PM. Top closer pattern: 4-touch outbound sequence.",
    suggestion: "Codify the 4-touch sequence as the team default in CRM.",
    affectedIds: [],
    createdAt: new Date().toISOString()
  });
  insights.push({
    id: "ai_leave_001",
    category: "leave",
    severity: "info",
    title: "Leave clash next Friday",
    body: "3 senior Sales execs from Mumbai HQ have applied for the same day. Risk score 68/100.",
    suggestion: "Stagger approvals — auto-suggest backup coverage from Pune team.",
    affectedIds: [],
    createdAt: new Date().toISOString()
  });
  insights.push({
    id: "ai_attend_001",
    category: "attendance",
    severity: "warning",
    title: "Repeated WiFi spoofing attempts blocked",
    body: "2 devices attempted to mimic Crownco-HQ BSSID. Both auto-quarantined.",
    suggestion: "Review device binding policy and notify Security.",
    affectedIds: [],
    createdAt: new Date().toISOString()
  });
  return insights;
}

function buildAnnouncements(): Announcement[] {
  return [
    {
      id: "ann_1",
      title: "Welcome to Crownco HR 2.0!",
      body: "We're thrilled to introduce our AI-powered HR platform. Productivity insights, smart attendance, and gamified rewards — all in one place.",
      author: "Ananya Sharma",
      authorAvatar: avatarUrl("Ananya Sharma"),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      category: "company",
      reactions: [
        { emoji: "🎉", count: 124 },
        { emoji: "🚀", count: 87 },
        { emoji: "❤️", count: 56 }
      ]
    },
    {
      id: "ann_2",
      title: "Policy update: Hybrid work guidelines",
      body: "Starting June 1, all hybrid employees must be in office at least 3 days a week. Detailed policy doc attached.",
      author: "HR Operations",
      authorAvatar: avatarUrl("HR Ops"),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      category: "policy",
      reactions: [
        { emoji: "👍", count: 42 },
        { emoji: "💼", count: 18 }
      ]
    },
    {
      id: "ann_3",
      title: "Happy Birthday Rohan Verma! 🎂",
      body: "Wishing our Senior Sales Manager a fantastic year ahead. Drop wishes below.",
      author: "Crownco AI",
      authorAvatar: avatarUrl("Crownco AI"),
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      category: "celebration",
      reactions: [
        { emoji: "🎂", count: 89 },
        { emoji: "🎉", count: 64 }
      ]
    },
    {
      id: "ann_4",
      title: "AI-detected: Best performance window today",
      body: "Team Sales-Mumbai shows highest conversion between 11 AM – 2 PM today. Plan your outreach accordingly.",
      author: "Crownco AI",
      authorAvatar: avatarUrl("AI"),
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      category: "ai",
      reactions: [{ emoji: "🤖", count: 34 }]
    }
  ];
}

function buildAudit(): AuditLog[] {
  const logs: AuditLog[] = [];
  for (let i = 0; i < 40; i++) {
    logs.push({
      id: `audit_${i}`,
      actor: faker.person.fullName(),
      action: faker.helpers.arrayElement([
        "Updated org settings",
        "Approved leave request",
        "Changed role permissions",
        "Logged in from new device",
        "Exported payroll CSV",
        "Modified geofence radius",
        "Added WiFi to whitelist"
      ]),
      resource: faker.helpers.arrayElement(["org/settings", "leave/lv_123", "rbac/roles", "auth", "payroll/2026-04", "attendance/geofence", "attendance/wifi"]),
      at: faker.date.recent({ days: 14 }).toISOString(),
      ip: faker.internet.ip(),
      device: faker.helpers.arrayElement([
        "Chrome / macOS",
        "Safari / iOS",
        "Chrome / Windows",
        "Crownco App / Android",
        "Edge / Windows"
      ])
    });
  }
  return logs;
}

export function buildSeedDataset(): SeedDataset {
  const branches = buildBranches();
  const departments = buildDepartments(branches);
  const shifts = buildShifts();
  const employees = buildEmployees(branches);
  const attendance = buildAttendance(employees);
  const leaves = buildLeaves(employees);
  const leaveBalances = buildLeaveBalances(employees);
  const tasks = buildTasks(employees);
  const calls = buildCalls(employees);
  const leads = buildLeads(employees);
  const rewards = buildRewards(employees);
  const giftCards = buildGiftCards();
  const achievements = buildAchievements(employees);
  const notifications = buildNotifications(employees);
  const meetings = buildMeetings(employees);
  const candidates = buildCandidates();
  const payslips = buildPayslips(employees);
  const fieldVisits = buildFieldVisits(employees);
  const aiInsights = buildAIInsights(employees);
  const announcements = buildAnnouncements();
  const audit = buildAudit();

  return {
    branches,
    departments,
    shifts,
    employees,
    attendance,
    leaves,
    leaveBalances,
    tasks,
    calls,
    leads,
    rewards,
    giftCards,
    achievements,
    notifications,
    meetings,
    candidates,
    payslips,
    fieldVisits,
    aiInsights,
    announcements,
    audit
  };
}
