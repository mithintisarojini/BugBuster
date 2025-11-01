// Lightweight state and helpers
const state = {
  roadmap: [],
  role: localStorage.getItem('role') || 'dsa',
  history: JSON.parse(localStorage.getItem('tutorHistory') || '[]'),
  interview: { mode: 'technical', index: 0, score: 0, asked: [] },
  skills: JSON.parse(localStorage.getItem('skills') || '{"DSA":40,"Web":30,"ML":20,"CSFund":35}')
};

const el = (id) => document.getElementById(id);
const show = (e) => e.classList.remove('hidden');
const hide = (e) => e.classList.add('hidden');

// Tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
    el(`tab-${btn.dataset.tab}`).classList.remove('hidden');
    if (btn.dataset.tab === 'dashboard') renderDashboard();
  });
});

// OpenAI Key persistence
const savedKey = localStorage.getItem('openaiKey') || '';
el('openaiKey').value = savedKey ? '••••••••••••••••' : '';
el('saveKeyBtn').addEventListener('click', () => {
  const raw = prompt('Paste your OpenAI API key (will be saved locally):');
  if (raw) localStorage.setItem('openaiKey', raw.trim());
  alert('Saved locally. You can now use AI Tutor.');
});

// Roadmaps
el('roleSelect').value = state.role;
el('generateRoadmapBtn').addEventListener('click', async () => {
  state.role = el('roleSelect').value;
  localStorage.setItem('role', state.role);
  const data = await fetch('data/roadmaps.json').then(r => r.json()).catch(() => null);
  const items = data && data[state.role] ? data[state.role] : defaultRoadmap(state.role);
  state.roadmap = items;
  renderRoadmap();
});

function defaultRoadmap(role) {
  const base = [
    { title: 'Foundations', desc: 'Prerequisites and basics', xp: 10 },
    { title: 'Core Topics', desc: 'Master the essentials', xp: 20 },
    { title: 'Projects', desc: 'Build 2-3 portfolio projects', xp: 25 },
    { title: 'Interview Prep', desc: 'Timed practice and reviews', xp: 15 },
    { title: 'Mock Interviews', desc: 'Iterate with feedback', xp: 10 },
  ];
  return base.map((b, i) => ({ ...b, id: `${role}-${i}`, done: false }));
}

function renderRoadmap() {
  const container = el('roadmapContainer');
  container.innerHTML = '';
  state.roadmap.forEach(step => {
    const card = document.createElement('div');
    card.className = 'card';
    const id = `chk-${step.id}`;
    card.innerHTML = `
      <div class="row" style="justify-content:space-between">
        <span class="badge">Milestone</span>
        <span>${step.xp} XP</span>
      </div>
      <h3 style="margin:6px 0 6px 0">${step.title}</h3>
      <div style="color:#9fb2c8">${step.desc}</div>
      <div class="row" style="margin-top:10px">
        <input type="checkbox" id="${id}" ${step.done ? 'checked' : ''} />
        <label for="${id}">Mark complete</label>
      </div>
    `;
    container.appendChild(card);
    card.querySelector(`#${CSS.escape(id)}`).addEventListener('change', (e) => {
      step.done = e.target.checked;
      persistRoadmap();
      bumpSkills(step);
    });
  });
  persistRoadmap();
}

function bumpSkills(step) {
  // naive: XP contributes to relevant buckets based on role
  const role = state.role;
  const k = role === 'dsa' ? 'DSA' : role === 'web' ? 'Web' : role === 'ml' ? 'ML' : 'CSFund';
  state.skills[k] = Math.min(100, (state.skills[k] || 0) + Math.round(step.xp * 0.6));
  localStorage.setItem('skills', JSON.stringify(state.skills));
}

function persistRoadmap() {
  localStorage.setItem(`roadmap_${state.role}`, JSON.stringify(state.roadmap));
}

// Load roadmap if present on startup
(function initRoadmap() {
  const saved = localStorage.getItem(`roadmap_${state.role}`);
  state.roadmap = saved ? JSON.parse(saved) : defaultRoadmap(state.role);
  renderRoadmap();
})();

// Tutor
const tutorHistoryEl = el('tutorHistory');
function renderTutorHistory() {
  tutorHistoryEl.innerHTML = '';
  state.history.forEach(m => {
    const d = document.createElement('div');
    d.className = `msg ${m.role === 'user' ? 'user' : 'bot'}`;
    d.textContent = m.content;
    tutorHistoryEl.appendChild(d);
  });
  tutorHistoryEl.scrollTop = tutorHistoryEl.scrollHeight;
}
renderTutorHistory();

el('askTutorBtn').addEventListener('click', async () => {
  const q = el('tutorQuestion').value.trim();
  if (!q) return;
  el('tutorQuestion').value = '';
  state.history.push({ role: 'user', content: q });
  renderTutorHistory();

  const key = localStorage.getItem('openaiKey');
  let answer = '';
  if (key) {
    try {
      answer = await askOpenAI(q, key);
    } catch (e) {
      answer = fallbackAnswer(q) + ' (AI fallback due to error)';
    }
  } else {
    answer = fallbackAnswer(q);
  }
  state.history.push({ role: 'assistant', content: answer });
  localStorage.setItem('tutorHistory', JSON.stringify(state.history));
  renderTutorHistory();
});

async function askOpenAI(prompt, key) {
  // Using OpenAI Responses API (clientless fetch). Adjust model if needed.
  const res = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      input: `Act as an expert tutor. Be concise, step-by-step. Question: ${prompt}`
    })
  });
  if (!res.ok) throw new Error('OpenAI error');
  const data = await res.json();
  // The Responses API returns output_text convenience field in newer versions; fallback to choices
  const text = data.output_text || data.choices?.[0]?.message?.content || JSON.stringify(data).slice(0, 600);
  return text;
}

function fallbackAnswer(q) {
  // very simple heuristics
  const lower = q.toLowerCase();
  if (lower.includes('dsa') || lower.includes('two pointers')) return 'Think about left/right indices and how to move them based on invariant. Start with a sorted array example.';
  if (lower.includes('big o') || lower.includes('complexity')) return 'Identify dominant operations, count loops/nesting, and drop constants. Aim for O(n log n) or better if possible.';
  if (lower.includes('ml') || lower.includes('model')) return 'Clarify objective, dataset size, features, and evaluation metric. Start with a baseline and iterate.';
  if (lower.includes('web') || lower.includes('react')) return 'Break UI into components, manage state close to where it changes, and keep effects minimal and predictable.';
  return 'Clarify your goal, constraints, and examples. Try a small step, test, then iterate.';
}

// Interview
const bank = {
  technical: [
    { q: 'Explain the difference between an array and a linked list.', kw: ['random access', 'insertion', 'contiguous', 'pointer'] },
    { q: 'What is a closure in JavaScript?', kw: ['lexical scope', 'inner function', 'environment', 'reference'] },
    { q: 'Describe normalization in databases.', kw: ['redundancy', 'anomaly', '1NF', '3NF'] },
  ],
  hr: [
    { q: 'Tell me about a time you overcame a challenge.', kw: ['situation', 'task', 'action', 'result'] },
    { q: 'Why this role and our company?', kw: ['motivation', 'fit', 'values', 'impact'] },
    { q: 'Describe a failure and what you learned.', kw: ['lesson', 'improvement', 'ownership'] },
  ]
};

el('startInterviewBtn').addEventListener('click', () => {
  state.interview.mode = el('interviewMode').value;
  state.interview.index = 0;
  state.interview.score = 0;
  state.interview.asked = [...bank[state.interview.mode]];
  show(el('interviewArea'));
  hide(el('interviewResult'));
  serveQuestion();
});

el('nextQuestionBtn').addEventListener('click', () => {
  scoreCurrent();
  serveQuestion();
});

el('finishInterviewBtn').addEventListener('click', () => {
  scoreCurrent();
  finishInterview();
});

function serveQuestion() {
  if (state.interview.index >= state.interview.asked.length) return finishInterview();
  const item = state.interview.asked[state.interview.index];
  el('questionText').textContent = `Q${state.interview.index + 1}. ${item.q}`;
  el('answerInput').value = '';
}

function scoreCurrent() {
  const item = state.interview.asked[state.interview.index];
  const ans = el('answerInput').value.toLowerCase();
  let gained = 0;
  item.kw.forEach(k => { if (ans.includes(k)) gained += 1; });
  state.interview.score += Math.min(5, gained);
  state.interview.index += 1;
}

function finishInterview() {
  hide(el('interviewArea'));
  const totalQs = state.interview.asked.length;
  const maxScore = totalQs * 5;
  const pct = Math.round((state.interview.score / maxScore) * 100);
  const res = el('interviewResult');
  res.innerHTML = `
    <div class="row" style="justify-content:space-between">
      <div>Mode: <span class="badge">${state.interview.mode.toUpperCase()}</span></div>
      <div>Score: <strong>${state.interview.score}/${maxScore}</strong> (${pct}%)</div>
    </div>
    <div style="margin-top:8px">Feedback: ${pct >= 70 ? 'Good grasp—practice timing and clarity.' : 'Focus on key concepts and structure (use STAR/points).'}
    </div>
  `;
  show(res);
  // nudge dashboard
  state.skills.CSFund = Math.min(100, (state.skills.CSFund || 0) + Math.round(pct / 10));
  localStorage.setItem('skills', JSON.stringify(state.skills));
}

// Dashboard
let skillChart;
function renderDashboard() {
  const ctx = document.getElementById('skillChart');
  const data = {
    labels: Object.keys(state.skills),
    datasets: [{
      label: 'Mastery %',
      data: Object.values(state.skills),
      backgroundColor: ['#5b9fff55','#77e0c255','#a07bff55','#ffad7b55'],
      borderColor: ['#5b9fff','#77e0c2','#a07bff','#ffad7b'],
      borderWidth: 1
    }]
  };
  if (skillChart) { skillChart.destroy(); }
  skillChart = new Chart(ctx, { type: 'radar', data, options: { scales: { r: { angleLines: { color: '#1c2635' }, grid: { color: '#1c2635' }, pointLabels: { color: '#cfe0f2' } } } } });

  const readiness = Math.round((Object.values(state.skills).reduce((a,b)=>a+b,0) / (Object.values(state.skills).length*100)) * 100);
  el('readinessText').textContent = `${readiness}%`;
  const nb = el('nbaList');
  nb.innerHTML = '';
  const weakest = Object.entries(state.skills).sort((a,b)=>a[1]-b[1]).slice(0,2).map(x=>x[0]);
  weakest.forEach(name => {
    const li = document.createElement('li');
    li.innerHTML = `<input type="checkbox"> <span>Spend 30 mins on ${name} drills today</span>`;
    nb.appendChild(li);
  });
}

// Peers
el('matchPeersBtn').addEventListener('click', () => {
  const role = el('peerRole').value;
  const all = mockPeers().filter(p => p.role === role);
  const top = all.slice(0, 3);
  const wrap = el('peerResults');
  wrap.innerHTML = '';
  top.forEach(p => {
    const d = document.createElement('div');
    d.className = 'card';
    d.innerHTML = `<div class="row" style="justify-content:space-between"><strong>${p.name}</strong><span class="badge">${p.role.toUpperCase()}</span></div>
      <div style="color:#9fb2c8;margin-top:6px">Overlap: ${p.overlap}% • Pace: ${p.pace}</div>
      <div class="row" style="margin-top:8px"><button class="btn secondary">Connect</button></div>`;
    wrap.appendChild(d);
  });
});

function mockPeers() {
  return [
    { name: 'Aisha', role: 'ml', overlap: 82, pace: '3h/day' },
    { name: 'Vikram', role: 'web', overlap: 76, pace: '2h/day' },
    { name: 'Neha', role: 'dsa', overlap: 65, pace: '1h/day' },
    { name: 'Arjun', role: 'android', overlap: 71, pace: '2h/day' },
    { name: 'Zoya', role: 'web', overlap: 69, pace: 'Weekend sprints' },
    { name: 'Kabir', role: 'dsa', overlap: 73, pace: '3h/day' },
  ];
}


