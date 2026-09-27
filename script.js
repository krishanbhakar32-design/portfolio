// ============================================
// RENDER: STACK CHIPS
// ============================================
const stackGrid = document.getElementById("stackGrid");
STACK.forEach(item => {
  const chip = document.createElement("div");
  chip.className = "stack-chip";
  chip.innerHTML = `<span class="dot"></span>${item}`;
  stackGrid.appendChild(chip);
});

// ============================================
// RENDER: PROJECTS + FILTERS
// ============================================
const projectsGrid = document.getElementById("projectsGrid");
const filterBar = document.getElementById("filterBar");

const categories = ["All", ...new Set(PROJECTS.map(p => p.category))];

function renderFilters(active) {
  filterBar.innerHTML = "";
  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "filter-btn" + (cat === active ? " active" : "");
    btn.textContent = cat;
    btn.addEventListener("click", () => {
      renderFilters(cat);
      renderProjects(cat);
    });
    filterBar.appendChild(btn);
  });
}

function renderProjects(filter) {
  projectsGrid.innerHTML = "";
  const list = filter === "All" ? PROJECTS : PROJECTS.filter(p => p.category === filter);
  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "project-card";
    card.innerHTML = `
      <div class="project-thumb">
        <img src="${p.image}" alt="${p.title}" onerror="this.parentElement.innerHTML='<div style=\\'display:flex;align-items:center;justify-content:center;height:100%;color:#9aa1ab;font-size:0.8rem;text-align:center;padding:16px\\'>Thumbnail:<br>${p.image}</div>'">
      </div>
      <div class="project-body">
        <div class="project-tags">${p.tags.map(t => `<span>${t}</span>`).join("")}</div>
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <div class="project-links">
          <a href="${p.demoUrl}" target="_blank" rel="noopener">Live demo</a>
          <a href="${p.codeUrl}" target="_blank" rel="noopener">Source code</a>
        </div>
      </div>
    `;
    projectsGrid.appendChild(card);
  });
}

renderFilters("All");
renderProjects("All");

// ============================================
// MOBILE NAV TOGGLE
// ============================================
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
navToggle.addEventListener("click", () => {
  const isOpen = navLinks.style.display === "flex";
  navLinks.style.display = isOpen ? "none" : "flex";
  navLinks.style.flexDirection = "column";
  navLinks.style.position = "absolute";
  navLinks.style.top = "68px";
  navLinks.style.left = "0";
  navLinks.style.right = "0";
  navLinks.style.background = "var(--paper)";
  navLinks.style.padding = "20px 28px";
  navLinks.style.borderBottom = "1px solid var(--line)";
  navLinks.style.gap = "18px";
});
navLinks.querySelectorAll("a").forEach(a => {
  a.addEventListener("click", () => {
    if (window.innerWidth <= 860) navLinks.style.display = "none";
  });
});

// ============================================
// CONTACT FORM (EmailJS placeholder)
// ============================================
// To make this live: sign up free at emailjs.com, then:
// 1. Add: <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script> to index.html
// 2. Uncomment the emailjs lines below and add your own IDs.
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

contactForm.addEventListener("submit", function (e) {
  e.preventDefault();
  formStatus.textContent = "Sending...";
  formStatus.className = "form-status";

  // emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', this, 'YOUR_PUBLIC_KEY')
  //   .then(() => {
  //     formStatus.textContent = "Message sent — I'll reply within a day.";
  //     formStatus.className = "form-status success";
  //     contactForm.reset();
  //   })
  //   .catch(() => {
  //     formStatus.textContent = "Something went wrong. Please email me directly.";
  //     formStatus.className = "form-status error";
  //   });

  // Placeholder behavior until EmailJS is wired up:
  setTimeout(() => {
    formStatus.textContent = "Form UI ready — connect EmailJS in script.js to go live.";
    formStatus.className = "form-status success";
  }, 500);
});

// ============================================
// CHAT WIDGET (rule-based FAQ assistant)
// ============================================
const chatToggle = document.getElementById("chatToggle");
const chatWindow = document.getElementById("chatWindow");
const chatBody = document.getElementById("chatBody");
const chatQuick = document.getElementById("chatQuick");
const chatInput = document.getElementById("chatInput");
const chatSend = document.getElementById("chatSend");

let chatOpened = false;

chatToggle.addEventListener("click", () => {
  chatWindow.classList.toggle("open");
  if (!chatOpened) {
    addBotMessage("Hey! I can answer quick questions about my work, process, or pricing. Try one below, or type your own.");
    renderQuickReplies();
    chatOpened = true;
  }
});

function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.className = `chat-msg ${sender}`;
  msg.textContent = text;
  chatBody.appendChild(msg);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function addBotMessage(text) {
  addMessage(text, "bot");
}

function renderQuickReplies() {
  chatQuick.innerHTML = "";
  FAQ.slice(0, 4).forEach(item => {
    const btn = document.createElement("button");
    btn.textContent = item.question;
    btn.addEventListener("click", () => {
      addMessage(item.question, "user");
      setTimeout(() => addBotMessage(item.answer), 300);
    });
    chatQuick.appendChild(btn);
  });
}

function findAnswer(text) {
  const lower = text.toLowerCase();
  for (const item of FAQ) {
    if (item.keywords.some(k => lower.includes(k))) {
      return item.answer;
    }
  }
  return "Good question — I don't have an auto-answer for that yet. Please use the contact form below and I'll get back to you personally within a day.";
}

function handleUserInput() {
  const text = chatInput.value.trim();
  if (!text) return;
  addMessage(text, "user");
  chatInput.value = "";
  setTimeout(() => addBotMessage(findAnswer(text)), 300);
}

chatSend.addEventListener("click", handleUserInput);
chatInput.addEventListener("keypress", e => {
  if (e.key === "Enter") handleUserInput();
});
