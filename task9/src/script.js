import { quizzes } from "./data.js";

// State Management
let state = {
  isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
  user: JSON.parse(localStorage.getItem("quizUser")) || null,
  currentQuiz: null,
  currentQuestionIndex: 0,
  score: 0,
  timer: 30,
  timerInterval: null,
  history: JSON.parse(localStorage.getItem("quizHistory")) || [],
};

// DOM Elements
const main = document.querySelector("main");
const homeContent = main.innerHTML;

// View Manager
const views = {
  home: () => {
    main.innerHTML = homeContent;
    initHeroButtons();
    updateActiveNavLink("home-btn");
  },
  register: () => {
    renderTemplate("template-register");
    setupRegisterForm();
  },
  login: () => {
    renderTemplate("template-login");
    setupLoginForm();
  },
  profile: () => {
    if (!state.isLoggedIn) return views.login();
    renderTemplate("template-profile");
    loadProfileData();
    updateActiveNavLink("profile-btn");
  },
  quizzes: () => {
    if (!state.isLoggedIn) {
      alert("Please login first to access quizzes");
      return views.login();
    }
    renderTemplate("page-quizzes");
    setupQuizCards();
    setupCategoryFilters();
    updateActiveNavLink("quizzes-btn");
  },
  quizActive: (quizId) => {
    state.currentQuiz = quizzes.find((q) => q.id === quizId);
    state.currentQuestionIndex = 0;
    state.score = 0;
    renderQuestion();
  },
  quizFinished: () => {
    renderQuizResult();
  },
  review: () => {
    renderAnswerReview();
  }
};

// Helper Functions
function renderTemplate(id) {
  const template = document.getElementById(id);
  if (template) {
    main.innerHTML = "";
    main.appendChild(template.content.cloneNode(true));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function updateNavbar() {
  const loginBtns = document.querySelectorAll("#login-btn, #register-btn");
  const userBtns = document.querySelectorAll("#profile-btn, #logout-btn, .mobile-profile");

  if (state.isLoggedIn) {
    loginBtns.forEach(btn => btn.classList.add("hidden"));
    userBtns.forEach(btn => btn.classList.remove("hidden"));
    userBtns.forEach(btn => {
      if (btn.classList.contains("mobile-profile")) {
         btn.classList.add("block");
      }
    });
  } else {
    loginBtns.forEach(btn => btn.classList.remove("hidden"));
    userBtns.forEach(btn => btn.classList.add("hidden"));
    userBtns.forEach(btn => {
      if (btn.classList.contains("mobile-profile")) {
         btn.classList.remove("block");
      }
    });
  }
}

function updateActiveNavLink(id) {
  const navLinks = document.querySelectorAll(".md\\:flex a");
  navLinks.forEach(link => {
    if (link.id === id) {
      link.classList.add("text-black");
      link.classList.remove("text-gray-500");
    } else {
      link.classList.remove("text-black");
      link.classList.add("text-gray-500");
    }
  });

  const target = id.replace('-btn', '');
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");
  mobileLinks.forEach(link => {
    if (link.dataset.target === target) {
      link.classList.add("text-black");
      link.classList.remove("text-gray-500");
    } else {
      link.classList.remove("text-black");
      link.classList.add("text-gray-500");
    }
  });
}

// Specific View Setup

function initHeroButtons() {
  document.getElementById("get-started-btn")?.addEventListener("click", views.login);
}

function setupRegisterForm() {
  const form = document.getElementById("signup-form");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("full-name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirm-password").value;

    if (password !== confirm) {
      alert("Passwords do not match ❌");
      return;
    }

    state.user = { name, email, password, bio: "" };
    localStorage.setItem("quizUser", JSON.stringify(state.user));
    alert("Registration Successful 🎉");
    views.login();
  });

  document.getElementById("login-link")?.addEventListener("click", (e) => {
    e.preventDefault();
    views.login();
  });
}

function setupLoginForm() {
  const form = document.getElementById("login-form");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    if (!state.user || email !== state.user.email || password !== state.user.password) {
      alert("Invalid Email or Password ❌");
      return;
    }

    state.isLoggedIn = true;
    localStorage.setItem("isLoggedIn", "true");
    updateNavbar();
    alert("Login Successful 🎉");
    views.quizzes();
  });

  document.getElementById("goto-register")?.addEventListener("click", (e) => {
    e.preventDefault();
    views.register();
  });
}

function loadProfileData() {
  if (!state.user) return;
  
  const elements = {
    "profile-name": state.user.name,
    "info-name": state.user.name,
    "info-email": state.user.email
  };

  Object.entries(elements).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  });

  const bioInput = document.getElementById("bio-input");
  if (bioInput) bioInput.value = state.user.bio || "";

  document.getElementById("save-bio")?.addEventListener("click", () => {
    state.user.bio = bioInput.value;
    localStorage.setItem("quizUser", JSON.stringify(state.user));
    alert("Bio Updated ✅");
  });

  renderQuizHistory();
}

function renderQuizHistory() {
  const tableBody = document.getElementById("quiz-history");
  if (!tableBody) return;

  const userHistory = state.history.filter(h => h.user === state.user?.email);
  tableBody.innerHTML = userHistory.map(h => `
    <tr class="border-b border-gray-50 hover:bg-gray-50 transition">
      <td class="p-4">${h.name}</td>
      <td class="p-4 font-medium">${h.score}/10</td>
      <td class="p-4 text-gray-500">${h.date}</td>
    </tr>
  `).join("") || '<tr><td colspan="3" class="p-8 text-center text-gray-400">No quizzes taken yet.</td></tr>';
}

function setupQuizCards() {
  const cards = document.querySelectorAll(".group.cursor-pointer, .flex.items-center.cursor-pointer");
  cards.forEach(card => {
    card.addEventListener("click", () => {
      const title = card.querySelector("h3").textContent;
      const quiz = quizzes.find(q => q.title === title);
      if (quiz) views.quizActive(quiz.id);
    });
  });
}

function setupCategoryFilters() {
  const filters = ["all", "science", "history", "literature", "math"];
  filters.forEach(cat => {
    const btn = document.getElementById(`filter-${cat}`);
    if (btn) {
      btn.onclick = () => {
        // Update UI
        document.querySelectorAll("[id^='filter-']").forEach(b => b.classList.replace("bg-blue-600", "bg-gray-100"));
        document.querySelectorAll("[id^='filter-']").forEach(b => b.classList.replace("text-white", "text-black"));
        btn.classList.replace("bg-gray-100", "bg-blue-600");
        btn.classList.add("text-white");

        // Filter Logic
        const sections = document.querySelectorAll("section");
        const cards = document.querySelectorAll(".group.cursor-pointer, .flex.items-center.cursor-pointer");
        
        cards.forEach(card => {
          const title = card.querySelector("h3").textContent;
          const quiz = quizzes.find(q => q.title === title);
          const matches = cat === "all" || quiz.category === cat || (cat === "math" && quiz.category === "mathematics");
          card.closest(".grid") ? card.style.display = matches ? "" : "none" : card.style.display = matches ? "flex" : "none";
        });
      };
    }
  });
}

// Quiz Engine

function renderQuestion() {
  const q = state.currentQuiz.questions[state.currentQuestionIndex];
  const progress = ((state.currentQuestionIndex + 1) / state.currentQuiz.questions.length) * 100;

  main.innerHTML = `
    <div class="max-w-3xl mx-auto px-6 py-12 animate-fade-in">
      <div class="mb-10">
        <div class="flex justify-between mb-2 text-sm text-gray-400">
          <span class="font-bold uppercase tracking-widest text-[10px]">Current Progress</span>
          <span class="font-bold">Question ${state.currentQuestionIndex + 1} / ${state.currentQuiz.questions.length}</span>
        </div>
        <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
          <div id="progress" class="bg-blue-600 h-full transition-all duration-500" style="width: ${progress}%"></div>
        </div>
      </div>

      <div class="flex justify-center mb-12">
        <div class="bg-white border border-gray-100 px-8 py-4 rounded-2xl shadow-sm flex flex-col items-center">
          <span id="timer" class="text-3xl font-black text-blue-600">30</span>
          <span class="text-[10px] text-gray-400 uppercase tracking-widest font-black mt-1">Seconds</span>
        </div>
      </div>

      <h2 class="text-3xl md:text-4xl font-black text-gray-900 text-center mb-10 leading-tight tracking-tight">
        ${q.question}
      </h2>

      <div class="flex flex-col gap-4 mb-12">
        ${q.options.map((opt, i) => `
          <label class="option-container flex items-center p-6 rounded-2xl border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50/50 cursor-pointer transition-all group relative ${q.userAnswer === i ? 'border-blue-500 bg-blue-50' : ''}">
            <input type="radio" name="quiz-opt" class="hidden" data-index="${i}" ${q.userAnswer === i ? 'checked' : ''}>
            <div class="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center mr-4 group-hover:border-blue-500 transition-colors">
              <div class="dot w-3 h-3 rounded-full bg-blue-600 transition-transform ${q.userAnswer === i ? 'scale-100' : 'scale-0'}"></div>
            </div>
            <span class="text-gray-700 font-bold text-lg">${opt}</span>
          </label>
        `).join("")}
      </div>

      <div class="flex justify-between items-center">
        <button id="prev" class="px-8 py-4 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition disabled:opacity-30 disabled:cursor-not-allowed">
          Back
        </button>
        <button id="next" class="px-10 py-4 bg-blue-600 text-white rounded-xl font-black text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 active:scale-95">
          ${state.currentQuestionIndex === state.currentQuiz.questions.length - 1 ? "Finish Quiz" : "Next Question"}
        </button>
      </div>
    </div>
  `;

  startTimer();
  setupOptionSelection(q);

  document.getElementById("prev").disabled = state.currentQuestionIndex === 0;
  document.getElementById("prev").onclick = () => {
    state.currentQuestionIndex--;
    renderQuestion();
  };
  
  document.getElementById("next").onclick = () => {
    clearInterval(state.timerInterval);
    if (state.currentQuestionIndex < state.currentQuiz.questions.length - 1) {
      state.currentQuestionIndex++;
      renderQuestion();
    } else {
      finishQuiz();
    }
  };
}

function setupOptionSelection(question) {
  document.querySelectorAll(".option-container").forEach(container => {
    container.onclick = () => {
      document.querySelectorAll(".option-container").forEach(c => {
        c.classList.remove("border-blue-500", "bg-blue-50/50");
        c.querySelector(".dot").classList.add("scale-0");
      });
      container.classList.add("border-blue-500", "bg-blue-50/50");
      container.querySelector(".dot").classList.remove("scale-0");
      question.userAnswer = Number(container.querySelector("input").dataset.index);
    };
  });
}

function startTimer() {
  clearInterval(state.timerInterval);
  state.timer = 30;
  const timerEl = document.getElementById("timer");
  
  state.timerInterval = setInterval(() => {
    state.timer--;
    if (timerEl) timerEl.textContent = state.timer < 10 ? "0" + state.timer : state.timer;
    
    if (state.timer <= 0) {
      clearInterval(state.timerInterval);
      document.getElementById("next")?.click();
    }
  }, 1000);
}

function finishQuiz() {
  clearInterval(state.timerInterval);
  state.score = state.currentQuiz.questions.reduce((acc, q) => acc + (q.userAnswer === q.answer ? 1 : 0), 0);

  const entry = {
    user: state.user.email,
    name: state.currentQuiz.title,
    score: state.score,
    date: new Date().toLocaleDateString(),
  };

  state.history.push(entry);
  localStorage.setItem("quizHistory", JSON.stringify(state.history));
  views.quizFinished();
}

function renderQuizResult() {
  main.innerHTML = `
    <div class="max-w-2xl mx-auto py-20 px-6 text-center animate-fade-in">
      <div class="mb-8 flex justify-center">
        <div class="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-4xl shadow-xl shadow-green-100">🎉</div>
      </div>
      <h2 class="text-4xl font-black text-gray-900 mb-4 tracking-tight">Quiz Completed!</h2>
      <p class="text-gray-500 text-xl mb-12">You've successfully finished the <span class="font-bold text-gray-900">${state.currentQuiz.title}</span> challenge.</p>
      
      <div class="bg-gray-50 rounded-[40px] p-12 mb-12 border border-gray-100 shadow-inner">
        <p class="text-gray-400 uppercase tracking-widest text-xs font-black mb-4">Your Final Score</p>
        <div class="text-8xl font-black text-blue-600">${state.score} <span class="text-3xl text-gray-300 font-medium">/ ${state.currentQuiz.questions.length}</span></div>
      </div>

      <div class="flex flex-col sm:flex-row justify-center gap-6">
        <button id="back-to-quizzes" class="px-12 py-5 bg-gray-900 text-white rounded-[24px] font-black text-lg hover:bg-black transition shadow-2xl active:scale-95">
          Take Another Quiz
        </button>
        <button id="review-btn" class="px-12 py-5 bg-white text-gray-900 border-2 border-gray-100 rounded-[24px] font-black text-lg hover:border-blue-500 hover:text-blue-600 transition active:scale-95">
          Review Answers
        </button>
      </div>
    </div>
  `;

  document.getElementById("back-to-quizzes").onclick = views.quizzes;
  document.getElementById("review-btn").onclick = views.review;
}

function renderAnswerReview() {
  main.innerHTML = `
    <div class="max-w-4xl mx-auto px-6 py-12 animate-fade-in">
      <div class="flex items-center justify-between mb-16">
        <h2 class="text-4xl font-black text-gray-900 tracking-tight">Review Answers</h2>
        <button id="back-quizzes-2" class="px-8 py-3 bg-gray-100 rounded-xl text-sm font-bold hover:bg-gray-200 transition flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Quizzes
        </button>
      </div>

      <div class="flex flex-col gap-10">
        ${state.currentQuiz.questions.map((q, i) => {
          const isCorrect = q.userAnswer === q.answer;
          return `
            <div class="bg-white border-2 ${isCorrect ? 'border-green-100' : 'border-red-100'} rounded-[40px] p-10 relative overflow-hidden group transition-all hover:shadow-xl hover:shadow-gray-100">
              <div class="absolute top-0 left-0 w-2 h-full ${isCorrect ? 'bg-green-400' : 'bg-red-400'} opacity-20"></div>
              
              <div class="flex items-start gap-6 mb-8">
                <span class="w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center font-black text-xl ${isCorrect ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}">
                  ${i + 1}
                </span>
                <h3 class="text-2xl font-black text-gray-900 leading-tight pt-1">${q.question}</h3>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="p-6 rounded-3xl bg-gray-50 border border-gray-100">
                  <p class="text-xs text-gray-400 uppercase font-black tracking-widest mb-2">Your Answer</p>
                  <p class="text-xl font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}">${q.userAnswer !== undefined ? q.options[q.userAnswer] : "Skipped"}</p>
                </div>
                <div class="p-6 rounded-3xl bg-green-50 border border-green-100">
                  <p class="text-xs text-green-500 uppercase font-black tracking-widest mb-2">Correct Answer</p>
                  <p class="text-xl font-bold text-green-700">${q.options[q.answer]}</p>
                </div>
              </div>
            </div>
          `;
        }).join("")}
      </div>

      <div class="mt-20 text-center">
        <button id="finish-review" class="px-16 py-6 bg-blue-600 text-white rounded-[32px] font-black text-xl hover:bg-blue-700 transition shadow-2xl shadow-blue-500/40 active:scale-95 uppercase tracking-wide">
          Back to Hub
        </button>
      </div>
    </div>
  `;

  document.getElementById("back-quizzes-2").onclick = views.quizzes;
  document.getElementById("finish-review").onclick = views.quizzes;
}

// Initialization

function init() {
  updateNavbar();
  initHeroButtons();
  
  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  
  mobileMenuBtn?.addEventListener("click", () => {
    mobileMenu?.classList.toggle("hidden");
  });

  document.querySelectorAll(".mobile-nav-link").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      mobileMenu?.classList.add("hidden");
      const target = link.dataset.target;
      if (target === "home") views.home();
      if (target === "quizzes") views.quizzes();
      if (target === "profile") views.profile();
    });
  });
  
  // Nav Event Listeners
  document.getElementById("home-btn")?.addEventListener("click", (e) => { e.preventDefault(); views.home(); });
  document.getElementById("quizzes-btn")?.addEventListener("click", (e) => { e.preventDefault(); views.quizzes(); });
  document.getElementById("profile-btn")?.addEventListener("click", (e) => { e.preventDefault(); views.profile(); });
  document.getElementById("logo-btn")?.addEventListener("click", (e) => { e.preventDefault(); views.home(); });
  
  document.getElementById("login-btn")?.addEventListener("click", views.login);
  document.getElementById("register-btn")?.addEventListener("click", views.register);
  
  document.getElementById("logout-btn")?.addEventListener("click", () => {
    state.isLoggedIn = false;
    localStorage.removeItem("isLoggedIn");
    updateNavbar();
    alert("Logged Out");
    views.home();
  });
}

document.addEventListener("DOMContentLoaded", init);
