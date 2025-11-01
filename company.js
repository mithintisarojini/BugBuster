// ==========================
// Company Interview Patterns
// ==========================
const patterns = {
  google: `
    <h3>Google Interview Rounds</h3>
    <ul>
      <li><b>Online Assessment:</b> Coding challenges, time complexity focus</li>
      <li><b>Technical Rounds:</b> DSA, System Design, Problem-solving</li>
      <li><b>HR Round:</b> Behavioral questions, leadership skills</li>
    </ul>
  `,
  amazon: `
    <h3>Amazon Interview Rounds</h3>
    <ul>
      <li><b>OA:</b> Coding + Work Simulation</li>
      <li><b>Technical:</b> DSA, Bar-raiser round</li>
      <li><b>HR:</b> Leadership principles</li>
    </ul>
  `,
  microsoft: `
    <h3>Microsoft Interview Rounds</h3>
    <ul>
      <li><b>OA:</b> Coding test on HackerRank</li>
      <li><b>Technical:</b> Problem-solving, System Design</li>
      <li><b>HR:</b> Culture fit, growth mindset</li>
    </ul>
  `,
  infosys: `
    <h3>Infosys Interview Rounds</h3>
    <ul>
      <li><b>Aptitude Test:</b> Quantitative + Logical</li>
      <li><b>Technical:</b> Core subjects + coding</li>
      <li><b>HR:</b> General questions</li>
    </ul>
  `,
  tcs: `
    <h3>TCS Interview Rounds</h3>
    <ul>
      <li><b>NQT:</b> Aptitude + Coding</li>
      <li><b>Technical:</b> DSA + Basics</li>
      <li><b>HR:</b> General interaction</li>
    </ul>
  `
};

// ==========================
// Company Mock Questions (POOL)
// ==========================
const companyQuestions = {
  google: [
    { q: "Explain Big-O notation with an example.", a: "time complexity measure" },
    { q: "What is the time complexity of QuickSort average case?", a: "O(n log n)" },
    { q: "What is a Trie used for?", a: "string search" },
    { q: "Explain CAP theorem.", a: "consistency availability partition tolerance" },
    { q: "What is dynamic programming?", a: "optimization using overlapping subproblems" },
    { q: "Difference between BFS and DFS?", a: "level order vs depth first" },
    { q: "Explain load balancing.", a: "distributing traffic" },
    { q: "What is memoization?", a: "caching results" },
    { q: "What is polymorphism in OOP?", a: "many forms" },
    { q: "What is Google’s MapReduce?", a: "parallel processing framework" },
    { q: "What is a heap?", a: "priority queue" },
    { q: "Explain distributed systems.", a: "multiple computers working together" }
  ],
  amazon: [
    { q: "What is Amazon's Leadership Principle 'Customer Obsession'?", a: "focus on customer" },
    { q: "Time complexity of Merge Sort?", a: "O(n log n)" },
    { q: "What is HashMap?", a: "key value store" },
    { q: "What is two-pointer technique?", a: "two indices iteration" },
    { q: "What is bar raiser interview?", a: "final amazon interview" },
    { q: "What is greedy algorithm?", a: "local optimum choice" },
    { q: "Explain deadlock.", a: "circular wait" },
    { q: "What is scalability?", a: "handle growth" },
    { q: "Explain Divide and Conquer.", a: "break into subproblems" },
    { q: "What is BFS time complexity?", a: "O(V+E)" },
    { q: "What is caching?", a: "store for fast access" }
  ],
  microsoft: [
    { q: "What is System Design?", a: "high level architecture" },
    { q: "What is a linked list?", a: "sequence of nodes" },
    { q: "Explain virtual memory.", a: "memory abstraction" },
    { q: "What is multithreading?", a: "multiple threads" },
    { q: "Explain garbage collection in Java.", a: "automatic memory management" },
    { q: "What is Azure?", a: "microsoft cloud" },
    { q: "Explain abstraction in OOP.", a: "hide implementation" },
    { q: "What is binary tree?", a: "each node has 2 children" },
    { q: "What is ACID property in DB?", a: "atomicity consistency isolation durability" },
    { q: "What is BFS vs DFS complexity?", a: "both O(V+E)" },
    { q: "What is thread safety?", a: "safe in multi-thread" }
  ],
  infosys: [
    { q: "What is SDLC?", a: "software development life cycle" },
    { q: "What is normalization?", a: "remove redundancy" },
    { q: "Explain inheritance in OOP.", a: "acquire properties" },
    { q: "What is recursion?", a: "function calling itself" },
    { q: "What is agile model?", a: "iterative development" },
    { q: "What is encapsulation?", a: "data hiding" },
    { q: "What is primary key?", a: "unique identifier" },
    { q: "What is function overloading?", a: "same name different params" },
    { q: "What is cloud computing?", a: "on demand resources" },
    { q: "What is object in OOP?", a: "instance of class" },
    { q: "What is constructor?", a: "initialize object" }
  ],
  tcs: [
    { q: "What is TCS NQT?", a: "national qualifier test" },
    { q: "What is DBMS?", a: "database management system" },
    { q: "What is time complexity of Insertion Sort?", a: "O(n^2)" },
    { q: "What is operating system?", a: "manages hardware software" },
    { q: "What is SDLC waterfall model?", a: "sequential model" },
    { q: "What is stack?", a: "LIFO structure" },
    { q: "Expand HTML.", a: "HyperText Markup Language" },
    { q: "What is pointer in C?", a: "stores address" },
    { q: "What is encapsulation?", a: "wrapping data" },
    { q: "What is Java Virtual Machine?", a: "runs java bytecode" },
    { q: "What is compiler?", a: "translates code" }
  ]
};

// ==========================
// Mock Interview Flow
// ==========================
let currentCompany = "google";
let currentIndex = 0;
let userAnswers = [];
let timer;
let timeLeft = 60;
let currentQuestions = []; // randomized set

// Utility: shuffle and pick random N
function getRandomQuestions(pool, n = 10) {
  let shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

// Show company pattern
function showCompanyPattern(company) {
  currentCompany = company;
  currentIndex = 0;
  userAnswers = [];
  document.getElementById("companyPattern").innerHTML = patterns[company];
  document.getElementById("mockSection").classList.add("hidden");
}

// Start mock interview
function startInterview() {
  currentIndex = 0;
  userAnswers = [];
  currentQuestions = getRandomQuestions(companyQuestions[currentCompany], 10);
  document.getElementById("mockSection").classList.remove("hidden");
  loadSingleQuestion(currentCompany, currentIndex);
}

// Start countdown timer
function startTimer() {
  clearInterval(timer);
  timeLeft = 60;
  document.getElementById("timerBox").innerText = `⏳ Time Left: ${timeLeft}s`;

  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timerBox").innerText = `⏳ Time Left: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timer);
      autoMove();
    }
  }, 1000);
}

// Auto move when time runs out
function autoMove() {
  let ans = document.getElementById("ansInput").value.trim();
  userAnswers.push(ans);
  currentIndex++;

  if (currentIndex < currentQuestions.length) {
    loadSingleQuestion(currentCompany, currentIndex);
  } else {
    finishInterview();
  }
}

// Load one question at a time
function loadSingleQuestion(company, index) {
  let container = document.getElementById("questionsContainer");
  let total = currentQuestions.length;

  if (index < total) {
    let q = currentQuestions[index];
    let isLast = index === total - 1;

    container.innerHTML = `
      <div class="question-box">
        <p><b>Q${index + 1} of ${total}:</b> ${q.q}</p>
        <input type="text" id="ansInput" placeholder="Your answer here"/>
        <div id="timerBox" class="timer-box"></div>
      </div>
      <button type="button" class="submit-btn" onclick="${isLast ? "finishInterview()" : "nextQuestion()"}">
        ${isLast ? "Submit" : "Next"}
      </button>
    `;
  }

  // start the timer
  startTimer();

  document.getElementById("mockResult").style.display = "none";
}

function nextQuestion() {
  clearInterval(timer);
  let ans = document.getElementById("ansInput").value.trim();
  userAnswers.push(ans);
  currentIndex++;
  loadSingleQuestion(currentCompany, currentIndex);
}

function finishInterview() {
  clearInterval(timer);
  let ans = document.getElementById("ansInput").value.trim();
  userAnswers.push(ans);
  submitMock();
}

function submitMock() {
  let score = 0;
  let feedback = "";

  currentQuestions.forEach((item, index) => {
    let userAns = (userAnswers[index] || "").toLowerCase();
    let correctAns = item.a.trim().toLowerCase();

    if (userAns === correctAns) {
      score++;
      feedback += `<p>Q${index + 1}: ✅ Correct</p>`;
    } else {
      feedback += `<p>Q${index + 1}: ❌ Wrong (Correct: ${item.a})</p>`;
    }
  });

  let resultBox = document.getElementById("mockResult");
  resultBox.style.display = "block";
  resultBox.innerHTML = `
    <h3>Results for ${currentCompany.toUpperCase()}</h3>
    <p>Your Score: ${score}/${currentQuestions.length}</p>
    ${feedback}
    <button class="apply-btn" onclick="restartInterview()">Restart Interview</button>
  `;

  document.getElementById("questionsContainer").innerHTML = "";
}

function restartInterview() {
  currentIndex = 0;
  userAnswers = [];
  currentQuestions = getRandomQuestions(companyQuestions[currentCompany], 10);
  loadSingleQuestion(currentCompany, currentIndex);
  document.getElementById("mockResult").style.display = "none";
}

// Load Google by default
window.onload = () => {
  showCompanyPattern("google");
};
