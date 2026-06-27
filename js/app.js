// Crownco HR — Shared App JS
const STORE_KEY = 'crownco_state_v1';
const defaultState = {
  theme: 'light',
  role: 'hr',
  roleName: 'HR Admin',
  user: { name: 'Aarav Sharma', role: 'HR Admin', email: 'aarav@crownco.ai', avatar: 'AS' },
  branch: 'Mumbai HQ',
  notifications: 7
};
function loadState(){
  try { return { ...defaultState, ...JSON.parse(localStorage.getItem(STORE_KEY)||'{}') }; }
  catch(e){ return defaultState; }
}
function saveState(s){ localStorage.setItem(STORE_KEY, JSON.stringify(s)); }
let state = loadState();
function setTheme(t){ state.theme=t; saveState(state); document.documentElement.setAttribute('data-theme', t); }
setTheme(state.theme);

function toast(msg, type='info'){
  let t = document.createElement('div');
  t.style.cssText=`position:fixed;bottom:90px;left:50%;transform:translateX(-50%);background:var(--bg-2);border:1px solid var(--line);padding:11px 18px;border-radius:12px;box-shadow:var(--shadow-lg);z-index:200;font-size:13px;font-weight:600;color:var(--ink);display:flex;align-items:center;gap:8px;animation:pop .25s`;
  let icon = type==='success'?'<i class="fa-solid fa-circle-check" style="color:var(--green)"></i>':type==='error'?'<i class="fa-solid fa-circle-xmark" style="color:var(--red)"></i>':'<i class="fa-solid fa-circle-info" style="color:var(--brand)"></i>';
  t.innerHTML = icon + msg;
  document.body.appendChild(t);
  setTimeout(()=>{ t.style.opacity='0'; t.style.transition='opacity .3s'; setTimeout(()=>t.remove(),300); }, 2400);
}

// Sidebar component — role-aware
function renderSidebar(active='dashboard'){
  const isHR = state.role === 'hr';
  const isField = state.role === 'field';

  const hrItems = [
    { group:'COMMAND CENTER', items:[
      { id:'dashboard', label:'HR Dashboard', icon:'fa-gauge-high', href:'dashboard.html' },
    ]},
    { group:'WORKFORCE OPS', items:[
      { id:'attendance', label:'Smart Attendance', icon:'fa-fingerprint', href:'attendance.html' },
      { id:'productivity', label:'AI Productivity', icon:'fa-brain', href:'productivity.html' },
      { id:'calls', label:'Call Analytics', icon:'fa-phone', href:'calls.html' },
      { id:'tasks', label:'Tasks & Workflow', icon:'fa-list-check', href:'tasks.html' },
      { id:'field', label:'Field Tracking', icon:'fa-map-location-dot', href:'field.html' },
    ]},
    { group:'PEOPLE MGMT', items:[
      { id:'people', label:'People Directory', icon:'fa-users', href:'people.html' },
      { id:'leave', label:'Leave Approvals', icon:'fa-plane-departure', href:'leave.html', badge:4 },
      { id:'payroll', label:'Payroll', icon:'fa-money-bill-trend-up', href:'payroll.html' },
      { id:'recruit', label:'Recruitment', icon:'fa-user-plus', href:'recruit.html' },
      { id:'rewards', label:'Rewards & Gamify', icon:'fa-trophy', href:'rewards.html' },
    ]},
    { group:'SYSTEM', items:[
      { id:'notifications', label:'Notifications', icon:'fa-bell', href:'notifications.html', badge:7 },
      { id:'settings', label:'Settings', icon:'fa-gear', href:'settings.html' },
      { id:'mobile', label:'Mobile App', icon:'fa-mobile-screen', href:'mobile.html' },
    ]}
  ];

  const empItems = [
    { group:'MY WORKSPACE', items:[
      { id:'my-day', label:'My Day', icon:'fa-sun', href:'my-day.html' },
      { id:'my-attendance', label:'Check In / Out', icon:'fa-fingerprint', href:'my-attendance.html' },
      { id:'my-tasks', label:'My Tasks', icon:'fa-list-check', href:'my-tasks.html' },
      { id:'my-performance', label:'My Performance', icon:'fa-chart-line', href:'my-performance.html' },
    ]},
    { group:'TIME & PAY', items:[
      { id:'my-leave', label:'My Leave', icon:'fa-plane-departure', href:'my-leave.html' },
      { id:'my-payslip', label:'My Payslip', icon:'fa-money-bill', href:'my-payslip.html' },
    ]},
    { group:'GROWTH', items:[
      { id:'my-rewards', label:'Rewards & Badges', icon:'fa-trophy', href:'my-rewards.html' },
      { id:'leaderboard', label:'Team Leaderboard', icon:'fa-ranking-star', href:'my-leaderboard.html' },
    ]}
  ];

  const fieldItems = [
    { group:'FIELD WORKSPACE', items:[
      { id:'my-day', label:'My Day', icon:'fa-sun', href:'my-day.html' },
      { id:'my-attendance', label:'Selfie Check-In', icon:'fa-face-smile', href:'my-attendance.html' },
      { id:'my-visits', label:'Today\u2019s Visits', icon:'fa-map-location-dot', href:'my-visits.html' },
      { id:'my-tasks', label:'My Tasks', icon:'fa-list-check', href:'my-tasks.html' },
    ]},
    { group:'PERFORMANCE', items:[
      { id:'my-performance', label:'My Performance', icon:'fa-chart-line', href:'my-performance.html' },
      { id:'my-rewards', label:'Rewards', icon:'fa-trophy', href:'my-rewards.html' },
    ]},
    { group:'TIME & PAY', items:[
      { id:'my-leave', label:'My Leave', icon:'fa-plane-departure', href:'my-leave.html' },
      { id:'my-payslip', label:'My Payslip', icon:'fa-money-bill', href:'my-payslip.html' },
    ]}
  ];

  const items = isHR ? hrItems : isField ? fieldItems : empItems;
  const logoGrad = isHR ? 'var(--grad)' : isField ? 'linear-gradient(135deg,#06B6D4,#0EA5E9)' : 'linear-gradient(135deg,#8B5CF6,#A855F7)';
  const accent = isHR ? 'HR · AI WorkOS' : isField ? 'Field Workspace' : 'My Workspace';
  const home = isHR ? 'dashboard.html' : 'my-day.html';
  const branchSub = isHR ? '12 branches · 547 employees' : isField ? 'Field Officer · Mumbai West' : `${state.user.role||'Employee'} · ${state.branch}`;
  let html = `
    <a href="${home}" class="brand">
      <div class="brand-logo" style="background:${logoGrad}">C</div>
      <div>
        <div class="brand-name">Crownco</div>
        <div class="brand-tag">${accent}</div>
      </div>
    </a>
    <div style="background:var(--bg-3);border-radius:10px;padding:9px 11px;display:flex;align-items:center;gap:9px;margin-bottom:6px;cursor:pointer;border:1px solid var(--line)">
      <i class="fa-solid ${isHR?'fa-building':'fa-id-badge'}" style="color:var(--brand);font-size:13px"></i>
      <div style="flex:1;min-width:0">
        <div style="font-size:12.5px;font-weight:700">${isHR?state.branch:state.user.name}</div>
        <div style="font-size:10.5px;color:var(--ink-3)">${branchSub}</div>
      </div>
      <i class="fa-solid fa-angles-up-down" style="font-size:10px;color:var(--ink-3)"></i>
    </div>
  `;
  items.forEach(g=>{
    html += `<div class="nav-group"><div class="nav-label">${g.group}</div>`;
    g.items.forEach(it=>{
      html += `<a href="${it.href}" class="nav-item ${active===it.id?'active':''}"><i class="fa-solid ${it.icon}"></i><span>${it.label}</span>${it.badge?`<span class="badge">${it.badge}</span>`:''}</a>`;
    });
    html += `</div>`;
  });
  const aiBlurb = isHR ? 'Ask about workforce — leaves, productivity, attrition.' : 'Ask about your leave balance, performance tips, payslip.';
  html += `
    <div style="margin-top:20px;padding:14px;background:linear-gradient(135deg,rgba(37,99,235,.08),rgba(139,92,246,.08));border:1px solid rgba(139,92,246,.2);border-radius:14px">
      <div class="ai-badge"><i class="fa-solid fa-sparkles"></i> AI Copilot</div>
      <div style="font-size:12.5px;font-weight:600;margin-top:8px;line-height:1.4">${aiBlurb}</div>
      <button onclick="openAI()" class="btn btn-grad btn-sm" style="margin-top:10px;width:100%;justify-content:center"><i class="fa-solid fa-wand-magic-sparkles"></i> Open Crownco AI</button>
    </div>
    <div style="margin-top:14px;padding:10px 12px;background:var(--bg-3);border-radius:10px;display:flex;align-items:center;gap:9px;font-size:12px;cursor:pointer" onclick="switchRole()">
      <i class="fa-solid fa-right-left" style="color:var(--ink-3)"></i>
      <div style="flex:1"><div style="font-weight:700;font-size:12px">Switch role</div><div style="font-size:10.5px;color:var(--ink-3)">Currently: ${state.roleName||'HR Admin'}</div></div>
    </div>
    <a href="index.html" onclick="localStorage.removeItem('crownco_state_v1')" style="margin-top:8px;padding:10px 12px;border-radius:10px;display:flex;align-items:center;gap:9px;font-size:12.5px;color:var(--ink-3);font-weight:600"><i class="fa-solid fa-right-from-bracket"></i> Sign out</a>
  `;
  return html;
}
function switchRole(){
  localStorage.removeItem('crownco_state_v1');
  window.location.href = 'index.html';
}

function renderTopbar(){
  const isHR = state.role === 'hr';
  const placeholder = isHR ? 'Search employees, leaves, calls, tasks…' : 'Search my tasks, leaves, payslip…';
  const tip = isHR ? 'Try: top performers this week' : 'Try: my leave balance';
  const roleChipColor = isHR ? 'blue' : state.role==='field' ? 'cyan' : 'purple';
  return `
    <button class="icon-btn" onclick="document.querySelector('.sidebar').classList.toggle('open')" style="display:none" id="menu-btn"><i class="fa-solid fa-bars"></i></button>
    <div class="search">
      <i class="fa-solid fa-magnifying-glass"></i>
      <input placeholder="${placeholder}" onfocus="this.placeholder='${tip}'" onblur="this.placeholder='${placeholder}'">
      <kbd>⌘ K</kbd>
    </div>
    <div class="top-actions">
      <span class="chip ${roleChipColor}" style="font-size:11px"><i class="fa-solid fa-${isHR?'user-tie':state.role==='field'?'map-location-dot':'user'}"></i> ${state.roleName||'HR Admin'}</span>
      <button class="icon-btn" title="Theme" onclick="toggleTheme()"><i class="fa-solid fa-${state.theme==='dark'?'sun':'moon'}"></i></button>
      ${isHR?'<button class="icon-btn" title="Activity"><i class="fa-solid fa-wave-square"></i></button>':''}
      <a href="${isHR?'notifications.html':'my-day.html'}" class="icon-btn" title="Notifications"><i class="fa-solid fa-bell"></i><span class="dot"></span></a>
      <button class="icon-btn" title="Help"><i class="fa-solid fa-circle-question"></i></button>
      <div style="display:flex;align-items:center;gap:9px;padding:5px 12px 5px 5px;background:var(--bg);border:1px solid var(--line);border-radius:99px;cursor:pointer">
        <div class="avatar sm">${state.user.avatar}</div>
        <div style="line-height:1.15">
          <div style="font-size:12.5px;font-weight:700">${state.user.name}</div>
          <div style="font-size:10.5px;color:var(--ink-3)">${state.user.role}</div>
        </div>
      </div>
    </div>
  `;
}

function toggleTheme(){ setTheme(state.theme==='dark'?'light':'dark'); location.reload(); }

// AI Floating Assistant
function renderAI(){
  return `
    <div class="fab" onclick="openAI()" title="Crownco AI"><i class="fa-solid fa-wand-magic-sparkles"></i></div>
    <div class="ai-panel" id="ai-panel">
      <div class="ai-panel-head">
        <div style="width:32px;height:32px;border-radius:9px;background:rgba(255,255,255,.2);display:grid;place-items:center"><i class="fa-solid fa-sparkles"></i></div>
        <div style="flex:1">
          <div style="font-weight:700;font-size:14px">Crownco AI</div>
          <div style="font-size:11px;opacity:.85">Workforce Copilot · Online</div>
        </div>
        <button onclick="openAI(false)" style="color:#fff;font-size:16px"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="ai-panel-body" id="ai-body">
        <div class="ai-msg bot">👋 Hi <b>${state.user.name}</b> — I can analyze attendance, predict attrition, suggest leave coverage, summarize calls, or generate WhatsApp reports. What's on your mind?</div>
        <div class="ai-chips">
          <button onclick="aiPrompt('Who are my top performers this week?')">🏆 Top performers</button>
          <button onclick="aiPrompt('Predict attrition risk')">📉 Attrition risk</button>
          <button onclick="aiPrompt('Summarize today attendance')">🕒 Today attendance</button>
          <button onclick="aiPrompt('Suggest leave coverage for Priya')">🤝 Leave coverage</button>
          <button onclick="aiPrompt('Generate productivity report')">📊 Productivity report</button>
        </div>
      </div>
      <div class="ai-panel-foot">
        <input id="ai-input" placeholder="Ask Crownco AI…" onkeydown="if(event.key==='Enter')aiSend()">
        <button class="btn btn-primary btn-sm" onclick="aiSend()"><i class="fa-solid fa-paper-plane"></i></button>
      </div>
    </div>
  `;
}
function openAI(open=true){
  const p = document.getElementById('ai-panel');
  if(!p) return;
  if(open===false) p.classList.remove('open');
  else p.classList.toggle('open');
}
function aiPrompt(q){ document.getElementById('ai-input').value=q; aiSend(); }
function aiSend(){
  const inp = document.getElementById('ai-input'); const body = document.getElementById('ai-body');
  const q = inp.value.trim(); if(!q) return;
  body.insertAdjacentHTML('beforeend', `<div class="ai-msg me">${q}</div>`);
  inp.value='';
  const typing = document.createElement('div');
  typing.className='ai-msg bot'; typing.innerHTML=`<i class="fa-solid fa-circle-notch fa-spin"></i> Analyzing your workforce data…`;
  body.appendChild(typing); body.scrollTop=body.scrollHeight;
  setTimeout(()=>{
    typing.innerHTML = aiAnswer(q);
    body.scrollTop=body.scrollHeight;
  }, 900);
}
function aiAnswer(q){
  q = q.toLowerCase();
  if(q.includes('top performer')) return `🏆 <b>Top 3 performers this week</b><br>1. <b>Priya Mehta</b> — 47 calls, ₹2.4L closed, 92 productivity<br>2. <b>Karan Singh</b> — 41 calls, ₹1.8L closed, 88 productivity<br>3. <b>Neha Iyer</b> — 38 calls, ₹1.5L closed, 86 productivity<br><br><span class="ai-badge">SUGGEST</span> Send appreciation + ₹2,000 Amazon gift cards.`;
  if(q.includes('attrition')) return `📉 <b>Attrition risk forecast (next 90 days)</b><br>• High risk: 12 employees (2.2%)<br>• Medium risk: 38 employees (6.9%)<br>• Key drivers: salary gap, low engagement, overtime fatigue<br><br><b>Top at-risk:</b> Rohan K., Sneha P., Vikram R. — flagged based on productivity decline + leave patterns.`;
  if(q.includes('attendance')) return `🕒 <b>Today's Attendance Snapshot</b><br>• Present: <b>491 / 547</b> (89.8%)<br>• Late: <b>23</b> | On leave: <b>33</b><br>• Geo-fence check-ins: 342 · WiFi: 118 · Selfie: 31<br>• 3 anomalies flagged (possible spoofing)`;
  if(q.includes('leave') || q.includes('coverage')) return `🤝 <b>Leave Coverage Plan — Priya Mehta (Aug 14–18)</b><br>• Operational risk: <span style="color:var(--amber);font-weight:700">MEDIUM (62%)</span><br>• Suggested backups:<br>&nbsp;&nbsp;◦ Karan S. — 94% skill match (sales)<br>&nbsp;&nbsp;◦ Neha I. — 88% match, has client context<br>• Redistribute 7 hot leads to backup pool<br>• Auto-defer 3 non-urgent follow-ups`;
  if(q.includes('productivity') || q.includes('report')) return `📊 <b>Productivity Report — Today</b><br>• Avg productivity score: <b>78.4</b> (▲ 3.2 WoW)<br>• Best window: <b>11 AM – 2 PM</b><br>• Calls: 4,212 · Talk time: 218h · Qualified: 1,108<br>• Burnout watch: 7 employees showing fatigue signals<br><br><span class="ai-badge">ACTION</span> Reassign 2 SDRs from 6PM shift.`;
  return `I analyzed your query. Based on current workforce data, here are <b>3 recommendations</b>:<br>1. Review the team-wise productivity heatmap.<br>2. Approve pending leaves with low operational risk first.<br>3. Trigger gift-card rewards for the top 5% performers this week.`;
}

// Mock data generators
const FIRST=["Aarav","Priya","Karan","Neha","Rohan","Sneha","Vikram","Ananya","Rahul","Isha","Aditya","Riya","Arjun","Pooja","Kabir","Meera","Sahil","Tanvi","Yash","Diya","Aditi","Manish","Ishaan","Aisha","Vivaan","Anaya"];
const LAST=["Sharma","Mehta","Singh","Iyer","Patel","Verma","Kapoor","Gupta","Reddy","Khan","Joshi","Nair","Bose","Rao","Chopra","Sinha"];
const DEPTS=["Sales","Support","HR","Engineering","Marketing","Operations","Finance","Field"];
const ROLES=["Sales Executive","Senior SDR","Account Manager","Team Lead","HR Manager","Support Agent","Field Officer","Engineer","Recruiter"];
const BRANCHES=["Mumbai HQ","Delhi","Bangalore","Pune","Hyderabad","Chennai","Kolkata","Ahmedabad"];
function rand(a,b){return Math.floor(Math.random()*(b-a+1))+a}
function pick(a){return a[rand(0,a.length-1)]}
function initials(n){return n.split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase()}

function genEmployees(n=24){
  const list=[];
  for(let i=0;i<n;i++){
    const name = `${pick(FIRST)} ${pick(LAST)}`;
    list.push({
      id: 1000+i,
      name, initials:initials(name),
      role: pick(ROLES),
      dept: pick(DEPTS),
      branch: pick(BRANCHES),
      status: pick(['Present','Present','Present','Present','Late','On Leave','Remote']),
      productivity: rand(55,98),
      attendance: rand(82,99),
      calls: rand(8,55),
      talkTime: rand(45,310),
      leads: rand(2,14),
      salary: rand(35,180)*1000,
      email: `${name.toLowerCase().split(' ').join('.')}@crownco.ai`,
      joined: `${rand(2018,2024)}-${String(rand(1,12)).padStart(2,'0')}-${String(rand(1,28)).padStart(2,'0')}`,
      burnout: rand(5,75),
      mood: pick(['😊','😀','😐','😔','🔥','😴']),
    });
  }
  return list;
}
window.MOCK_EMPLOYEES = genEmployees(28);

// Charts helpers
const CHART_COLORS = ['#2563EB','#8B5CF6','#06B6D4','#10B981','#F59E0B','#EF4444','#0EA5E9','#A855F7'];
function chartTheme(){
  const dark = state.theme==='dark';
  return {
    grid: dark?'#1E293B':'#E2E8F0',
    text: dark?'#94A3B8':'#64748B',
    bg: dark?'#0B1120':'#FFFFFF'
  };
}

// Route guard — Employees/Field cannot access HR-only pages
const HR_ONLY = ['dashboard','attendance','productivity','calls','tasks','field','people','leave','payroll','recruit','rewards','notifications','settings','mobile'];
const EMP_ONLY = ['my-day','my-attendance','my-tasks','my-performance','my-leave','my-payslip','my-rewards','my-leaderboard','my-visits'];

function bootPage(activeNav){
  // Auto-set role based on page being opened (so direct previews work)
  if(EMP_ONLY.includes(activeNav) && state.role==='hr' && !localStorage.getItem('crownco_role_locked')){
    state.role = 'employee';
    state.roleName = 'Employee';
    state.user = { name:'Priya Mehta', role:'Senior SDR', email:'priya@crownco.ai', avatar:'PM' };
    saveState(state);
  }
  if(HR_ONLY.includes(activeNav) && state.role!=='hr' && !localStorage.getItem('crownco_role_locked')){
    state.role = 'hr';
    state.roleName = 'HR Admin';
    state.user = { name:'Aarav Sharma', role:'HR Admin', email:'aarav@crownco.ai', avatar:'AS' };
    saveState(state);
  }
  document.body.insertAdjacentHTML('afterbegin', `<div class="app"><aside class="sidebar">${renderSidebar(activeNav)}</aside><div class="main"><div class="topbar">${renderTopbar()}</div><div class="content" id="content"></div></div></div>${renderAI()}`);
}
