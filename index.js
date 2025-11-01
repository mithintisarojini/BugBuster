// ---------------- Navigation ----------------
function showSection(sectionId, tabEl) {
  // Hide all sections
  document.querySelectorAll(".content-section").forEach(sec =>
    sec.classList.remove("active")
  );

  // Show selected section
  document.getElementById(sectionId).classList.add("active");

  // Reset active tabs
  document.querySelectorAll(".nav-tab").forEach(tab =>
    tab.classList.remove("active")
  );
  tabEl.classList.add("active");

  // Init charts when opening Dashboard
  if (sectionId === "dashboard") {
    setTimeout(initCharts, 100);
  }

  // Render Peer Groups when opening Peer Groups tab
  if (sectionId === "peer-groups") {
    renderPeerGroups();
  }
}

// ---------------- Roadmap ----------------
function showRoadmap(type) {
  document.querySelectorAll(".roadmap-path").forEach(p =>
    p.classList.remove("active")
  );
  document.getElementById(type + "-roadmap").classList.add("active");
}

// Show example question in input
function setExample(text) {
  document.getElementById("userQuestion").value = text;
}

// Clear chat
function clearChat() {
  document.getElementById("chatContainer").innerHTML = `
    <div class="message ai-message">
      <strong>AI Tutor:</strong> Chat cleared! Ask me a new question.
    </div>`;
}

// Show typing indicator when AI is responding
async function askQuestion() {
  const input = document.getElementById("userQuestion");
  const question = input.value.trim();
  if (!question) return;

  const chatContainer = document.getElementById("chatContainer");
  chatContainer.innerHTML += `
    <div class="message user-message"><strong>You:</strong> ${question}</div>
  `;
  input.value = "";

  // Show typing animation
  document.getElementById("loadingIndicator").style.display = "block";

  try {
    // Call the server endpoint
    const response = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: question }),
    });

    const data = await response.json();
    document.getElementById("loadingIndicator").style.display = "none";
    
    chatContainer.innerHTML += `
      <div class="message ai-message"><strong>AI Tutor:</strong> ${data.reply || "Sorry, I couldn't process that request."}</div>
    `;
    chatContainer.scrollTop = chatContainer.scrollHeight;
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("loadingIndicator").style.display = "none";
    chatContainer.innerHTML += `
      <div class="message ai-message"><strong>AI Tutor:</strong> ⚠️ Error connecting to server. Make sure the server is running on http://localhost:3000</div>
    `;
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
}

function handleEnter(e) {
  if (e.key === "Enter") askQuestion();
}





// ---------------- Charts ----------------
function initCharts() {
  // Progress chart
  const progressCtx = document
    .getElementById("progressChart")
    .getContext("2d");
  new Chart(progressCtx, {
    type: "line",
    data: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      datasets: [
        {
          label: "Progress",
          data: [20, 40, 55, 75],
          borderWidth: 2,
          borderColor: "#6366f1",
          backgroundColor: "rgba(99, 102, 241, 0.2)"
        }
      ]
    },
    options: { responsive: true }
  });

  // Skills chart
  const skillsCtx = document.getElementById("skillsChart").getContext("2d");
  new Chart(skillsCtx, {
    type: "doughnut",
    data: {
      labels: ["DSA", "Web Dev", "AI/ML", "System Design"],
      datasets: [
        {
          data: [35, 25, 20, 20],
          backgroundColor: ["#6366f1", "#22c55e", "#f59e0b", "#ec4899"]
        }
      ]
    },
    options: { responsive: true }
  });
}

// ---------------- Mock Interview ----------------
const interviewQuestions = [
  {
    title: "Technical Question #1",
    text: "Write a function to find the maximum sum of a subarray (Kadane's Algorithm).",
    correct:
      "Initialize max_so_far = arr[0], max_ending_here = arr[0]. Loop through the array: max_ending_here = max(arr[i], max_ending_here + arr[i]); max_so_far = max(max_so_far, max_ending_here). Return max_so_far."
  },
  {
    title: "Technical Question #2",
    text: "Explain the difference between stack and queue with real-world examples.",
    correct:
      "Stack = LIFO (Last In, First Out), e.g., undo feature in editors. Queue = FIFO (First In, First Out), e.g., people standing in a line."
  },
  {
    title: "Technical Question #3",
    text: "How does a HashMap work internally in Java or JavaScript?",
    correct:
      "HashMap uses an array of buckets, applies a hash function to keys, and handles collisions with chaining or open addressing."
  },
  {
    title: "HR Question #1",
    text: "Tell me about a time you faced a big challenge and how you overcame it.",
    correct:
      "A good answer should describe the challenge, the steps taken to solve it, and the positive outcome (STAR method: Situation, Task, Action, Result)."
  },
  {
    title: "HR Question #2",
    text: "Why should we hire you over other candidates?",
    correct:
      "Highlight your unique strengths, skills relevant to the job, enthusiasm, and how you align with the company's goals."
  }
];

let currentQuestionIndex = 0;

function startInterview() {
  currentQuestionIndex = 0;
  document.getElementById("interviewSection").style.display = "block";
  showQuestion(currentQuestionIndex);
}

function showQuestion(index) {
  const q = interviewQuestions[index];
  document.getElementById("questionTitle").innerText = q.title;
  document.getElementById("questionText").innerText = q.text;
  document.getElementById("answerArea").value = "";
  document.getElementById("feedback").style.display = "none";
}

function submitAnswer() {
  const userAnswer = document.getElementById("answerArea").value;
  if (userAnswer.trim() === "") {
    alert("Please enter your answer before submitting!");
    return;
  }
  const q = interviewQuestions[currentQuestionIndex];
  document.getElementById("feedback").style.display = "block";
  document.getElementById("feedbackText").innerHTML = `
    ✅ Your attempt: <br/> ${userAnswer} <br/><br/>
    📌 Correct Answer: <br/> ${q.correct}
  `;
}

function nextQuestion() {
  if (currentQuestionIndex < interviewQuestions.length - 1) {
    currentQuestionIndex++;
    showQuestion(currentQuestionIndex);
  } else {
    alert("🎉 Interview completed! Great job!");
    document.getElementById("interviewSection").style.display = "none";
  }
}

// ---------------- Peer Groups ----------------
const peerGroups = [
  {
    icon: "DS",
    name: "DSA Masters Group",
    members: "24 members • Active daily"
  },
  {
    icon: "WD",
    name: "Web Dev Enthusiasts",
    members: "30 members • Active weekly"
  },
  {
    icon: "AI",
    name: "AI & ML Learners",
    members: "18 members • Daily discussions"
  },
  {
    icon: "SD",
    name: "System Design Geeks",
    members: "15 members • Weekly deep-dives"
  },
  {
    icon: "IN",
    name: "Interview Prep Circle",
    members: "40 members • Mock sessions daily"
  },
  {
    icon: "CP",
    name: "Competitive Programming",
    members: "22 members • Nightly contests"
  },
  {
    icon: "PL",
    name: "Placement Prep Group",
    members: "50 members • Resume + Mock GDs"
  }
];

function renderPeerGroups() {
  const container = document.getElementById("peers");
  if (!container) return;
  container.innerHTML = `
    <h2>👥 Peer Learning Groups</h2>
    <div class="peer-groups">
      ${peerGroups
        .map(
          group => `
        <div class="peer-card">
          <div class="avatar">${group.icon}</div>
          <div>
            <h4>${group.name}</h4>
            <p>${group.members}</p>
          </div>
        </div>
      `
        )
        .join("")}
    </div>
  `;
  function joinGroup(groupName) {
    alert(`✅ You have joined "${groupName}"! 🎉`);
  }
  
}
async function askQuestion() {
  const input = document.getElementById("userQuestion").value;
  if (!input.trim()) return;

  const chat = document.getElementById("chatContainer");
  chat.innerHTML += `<div class="message user-message"><strong>You:</strong> ${input}</div>`;

  document.getElementById("loadingIndicator").style.display = "block";

  try {
    const response = await fetch("http://localhost:3000/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: input }),
    });

    const data = await response.json();
    chat.innerHTML += `<div class="message ai-message"><strong>AI Tutor:</strong> ${data.answer}</div>`;
  } catch (error) {
    chat.innerHTML += `<div class="message ai-message"><strong>AI Tutor:</strong> Error connecting to AI server.</div>`;
  } finally {
    document.getElementById("loadingIndicator").style.display = "none";
  }

  document.getElementById("userQuestion").value = "";
  chat.scrollTop = chat.scrollHeight;
}
