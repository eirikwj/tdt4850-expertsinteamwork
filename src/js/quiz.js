const progressBar = document.getElementById("progressBar");
const questionText = document.getElementById("questionText");
const quizImage = document.getElementById("quizImage");
const progressText = document.getElementById("progressText");
const nextBtn = document.getElementById("nextBtn");
const answersDiv = document.querySelector(".answers");
const contentDiv = document.querySelector(".content");
const imageBox = document.querySelector(".image-box");

let currentQuestion = 0;
let score = 0;
let answered = false;
let draggedEl = null;

// Touch drag state
let touchDragEl = null;
let touchClone = null;
let touchOffsetX = 0;
let touchOffsetY = 0;

const questions = [
  {
    question: "Which LLM generated this image of a murderer?",
    image: "../images/murderer/Murderer_gemini_BN2_1.png",
    answers: ["Grok", "Meta", "ChatGPT", "Gemini"],
    correctIndex: 3,
  },
  {
    question: "Which LLM generated this image of a murderer?",
    image: "../images/murderer/Murderer_chatgpt_2.png",
    answers: ["Grok", "Meta", "ChatGPT", "Gemini"],
    correctIndex: 2,
  },
  {
    question: "Which LLM generated this image of a murderer?",
    image: "../images/murderer/Murderer_grok_9.jpg",
    answers: ["Grok", "Meta", "ChatGPT", "Gemini"],
    correctIndex: 0,
  },
  {
    question: "Which LLM generated this image of a single parent?",
    image: "../images/single_parent/single_parent_gemini.png",
    answers: ["Grok", "Meta", "ChatGPT", "Gemini"],
    correctIndex: 3,
  },
  {
    question: "Which LLM generated this image of a single parent?",
    image: "../images/single_parent/Single_parent_chatgpt.png",
    answers: ["Grok", "Meta", "ChatGPT", "Gemini"],
    correctIndex: 2,
  },
  {
    question: "Which LLM generated this image of a single parent?",
    image: "../images/single_parent/single_parent_grok_x4.jpg",
    answers: ["Grok", "Meta", "ChatGPT", "Gemini"],
    correctIndex: 0,
  },
  {
    type: "match",
    question: "Match each image to the LLM that generated it",
    pairs: [
      { image: "../images/home/Home_gemini_4.png", correct: "Gemini" },
      { image: "../images/home/Home_chatgpt_1.png", correct: "ChatGPT" },
      { image: "../images/home/Home_grok_2.jpg", correct: "Grok" },
    ],
  },
  {
    question: "Which LLM generated this image of a slave auction?",
    image: "../images/slavery/slave_grok.jpg",
    answers: ["Grok", "Meta", "ChatGPT", "Gemini"],
    correctIndex: 0,
  },
  {
    question: "Which LLM generated this image of a slave auction?",
    image: "../images/slavery/slave_chatgpt.png",
    answers: ["Grok", "Meta", "ChatGPT", "Gemini"],
    correctIndex: 2,
  },
  {
    type: "match",
    question: "Match each image to the LLM that generated it",
    pairs: [
      { image: "../images/loser/Loser_chatgpt.png", correct: "ChatGPT" },
      { image: "../images/loser/Loser_Grok2.jpg", correct: "Grok" },
      { image: "../images/loser/Loser_gemini_fast.png", correct: "Gemini" },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function setProgress() {
  progressText.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
  progressBar.style.width =
    ((currentQuestion + 1) / questions.length) * 100 + "%";
}

function lockNext(locked) {
  nextBtn.disabled = locked;
  nextBtn.classList.toggle("unclickable", locked);
}

function loadQuestion() {
  answered = false;
  lockNext(true);
  const q = questions[currentQuestion];
  questionText.textContent = q.question;
  setProgress();
  q.type === "match" ? loadMatchQuestion(q) : loadStandardQuestion(q);
}

// ─── Standard question ────────────────────────────────────────────────────────

function loadStandardQuestion(q) {
  imageBox.style.display = "";
  quizImage.style.display = "";
  quizImage.src = q.image;
  document.body.style.backgroundImage = `url("${q.image}")`;

  answersDiv.className = "answers";
  answersDiv.innerHTML = "";

  q.answers.forEach((text, i) => {
    const btn = document.createElement("button");
    btn.className = "answer";
    btn.textContent = text;
    btn.addEventListener("click", () => handleStandardAnswer(i));
    answersDiv.appendChild(btn);
  });
}

function handleStandardAnswer(index) {
  if (answered) return;
  answered = true;
  lockNext(false);

  const correctIndex = questions[currentQuestion].correctIndex;
  answersDiv.querySelectorAll(".answer").forEach((btn, i) => {
    btn.disabled = true;
    if (i === index) btn.classList.add("chosen");
    if (i === correctIndex) btn.classList.add("correct");
    else btn.classList.add("wrong");
  });

  if (index === correctIndex) score++;
}

// ─── Match question ───────────────────────────────────────────────────────────

function loadMatchQuestion(q) {
  document.body.style.backgroundImage = `url("${q.pairs[0].image}")`;
  imageBox.style.display = "none";
  quizImage.style.display = "none";

  answersDiv.className = "answers match-answers";
  answersDiv.innerHTML = "";

  const shuffled = [...q.pairs.map((p) => p.correct)].sort(
    () => Math.random() - 0.5,
  );

  const namesCol = document.createElement("div");
  namesCol.className = "names-col";
  shuffled.forEach((name) =>
    namesCol.appendChild(createNameChip(name, namesCol, q)),
  );

  const imagesCol = document.createElement("div");
  imagesCol.className = "images-col";

  q.pairs.forEach((pair, i) => {
    const zone = document.createElement("div");
    zone.className = "drop-zone";
    zone.dataset.correct = pair.correct;
    zone.dataset.index = i;

    const img = document.createElement("img");
    img.src = pair.image;
    img.alt = "Match image";

    const label = document.createElement("span");
    label.className = "drop-label";

    zone.appendChild(img);
    zone.appendChild(label);

    zone.addEventListener("dragover", onDragOver);
    zone.addEventListener("dragleave", onDragLeave);
    zone.addEventListener("drop", (e) => onDrop(e, zone, namesCol, q));

    imagesCol.appendChild(zone);
  });

  answersDiv.appendChild(imagesCol);
  answersDiv.appendChild(namesCol);
}

function createNameChip(name, namesCol, q) {
  const chip = document.createElement("div");
  chip.className = "draggable-name";
  chip.draggable = true;
  chip.dataset.name = name;
  chip.textContent = name;

  // Desktop drag
  chip.addEventListener("dragstart", onDragStart);
  chip.addEventListener("dragend", onDragEnd);

  // Touch drag
  chip.addEventListener(
    "touchstart",
    (e) => onTouchStart(e, chip, namesCol, q),
    { passive: false },
  );
  chip.addEventListener("touchmove", onTouchMove, { passive: false });
  chip.addEventListener("touchend", (e) => onTouchEnd(e, namesCol, q));

  return chip;
}

// ─── Desktop drag-and-drop ────────────────────────────────────────────────────

function onDragStart(e) {
  draggedEl = e.currentTarget;
  draggedEl.classList.add("dragging");
}

function onDragEnd() {
  if (draggedEl) draggedEl.classList.remove("dragging");
  document
    .querySelectorAll(".drop-zone")
    .forEach((z) => z.classList.remove("drag-over"));
  draggedEl = null;
}

function onDragOver(e) {
  e.preventDefault();
  e.currentTarget.classList.add("drag-over");
}

function onDragLeave(e) {
  e.currentTarget.classList.remove("drag-over");
}

function onDrop(e, zone, namesCol, q) {
  e.preventDefault();
  zone.classList.remove("drag-over");
  if (!draggedEl) return;
  placeChip(draggedEl, zone, namesCol, q);
}

// ─── Touch drag-and-drop ──────────────────────────────────────────────────────

function onTouchStart(e, chip, namesCol, q) {
  if (answered) return;
  e.preventDefault();

  touchDragEl = chip;
  chip.classList.add("dragging");

  const touch = e.touches[0];
  const rect = chip.getBoundingClientRect();
  touchOffsetX = touch.clientX - rect.left;
  touchOffsetY = touch.clientY - rect.top;

  // Floating clone that follows the finger
  touchClone = chip.cloneNode(true);
  touchClone.style.cssText = `
    position: fixed;
    z-index: 9999;
    pointer-events: none;
    width: ${rect.width}px;
    left: ${touch.clientX - touchOffsetX}px;
    top: ${touch.clientY - touchOffsetY}px;
    margin: 0;
    opacity: 0.9;
    transform: scale(1.08);
    background: rgba(255,255,255,0.28);
    border: 1px solid rgba(255,255,255,0.5);
    border-radius: 14px;
    padding: 14px 20px;
    color: white;
    font-weight: 500;
    font-size: 16px;
    text-align: center;
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
  `;
  document.body.appendChild(touchClone);
}

function onTouchMove(e) {
  if (!touchClone) return;
  e.preventDefault();

  const touch = e.touches[0];
  touchClone.style.left = touch.clientX - touchOffsetX + "px";
  touchClone.style.top = touch.clientY - touchOffsetY + "px";

  // Highlight drop zone under finger
  document
    .querySelectorAll(".drop-zone")
    .forEach((z) => z.classList.remove("drag-over"));
  const zoneUnder = getZoneAtPoint(touch.clientX, touch.clientY);
  if (zoneUnder) zoneUnder.classList.add("drag-over");
}

function onTouchEnd(e, namesCol, q) {
  if (!touchDragEl) return;

  const touch = e.changedTouches[0];
  const zoneUnder = getZoneAtPoint(touch.clientX, touch.clientY);

  if (touchClone) {
    touchClone.remove();
    touchClone = null;
  }
  document
    .querySelectorAll(".drop-zone")
    .forEach((z) => z.classList.remove("drag-over"));
  touchDragEl.classList.remove("dragging");

  if (zoneUnder) {
    placeChip(touchDragEl, zoneUnder, namesCol, q);
  }

  touchDragEl = null;
}

function getZoneAtPoint(x, y) {
  for (const zone of document.querySelectorAll(".drop-zone")) {
    const r = zone.getBoundingClientRect();
    if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return zone;
  }
  return null;
}

// ─── Shared placement logic ───────────────────────────────────────────────────

function placeChip(chip, zone, namesCol, q) {
  const droppedName = chip.dataset.name;

  if (zone.dataset.placed) {
    const oldName = zone.dataset.placed;
    const existing = [...namesCol.querySelectorAll(".draggable-name")].find(
      (c) => c.dataset.name === oldName,
    );
    if (existing) {
      existing.style.display = "";
    } else {
      namesCol.appendChild(createNameChip(oldName, namesCol, q));
    }
  }

  document.querySelectorAll(".drop-zone").forEach((z) => {
    if (z !== zone && z.dataset.placed === droppedName) {
      z.dataset.placed = "";
      z.querySelector(".drop-label").textContent = "";
      z.classList.remove("has-chip");
    }
  });

  zone.dataset.placed = droppedName;
  zone.querySelector(".drop-label").textContent = droppedName;
  zone.classList.add("has-chip");
  chip.style.display = "none";

  if (
    [...document.querySelectorAll(".drop-zone")].every((z) => z.dataset.placed)
  ) {
    checkMatchAnswers(q);
  }
}

function checkMatchAnswers(q) {
  answered = true;
  let correct = 0;

  document.querySelectorAll(".drop-zone").forEach((zone) => {
    if (zone.dataset.placed === zone.dataset.correct) {
      zone.classList.add("correct");
      correct++;
    } else {
      zone.classList.add("wrong");
    }
  });

  if (correct === q.pairs.length) score++;
  lockNext(false);
}

// ─── Navigation ───────────────────────────────────────────────────────────────

nextBtn.addEventListener("click", () => {
  if (!answered) {
    alert("Please select an answer");
    return;
  }
  currentQuestion++;
  if (currentQuestion < questions.length) {
    imageBox.style.display = "";
    loadQuestion();
  } else {
    showResults();
  }
});

function showResults() {
  progressBar.style.width = "100%";
  window.location.href = `/src/pages/results.html?score=${score}&total=${questions.length}`;
}

loadQuestion();
