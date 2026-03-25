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

let startTime = Date.now();

// Reveal question sub-step: 0 = text input, 1 = image revealed
let revealSubStep = 0;

// Touch drag state
let touchDragEl = null;
let touchClone = null;
let touchOffsetX = 0;
let touchOffsetY = 0;

const questions = [
  {
    question: "Which LLM generated this image of a murderer?",
    image: "../images/murderer/Murderer_gemini_BN2_1.png",
    answers: ["Grok", "ChatGPT", "Gemini"],
    correctIndex: 2,
  },
  {
    question: "Which LLM generated this image of a murderer?",
    image: "../images/murderer/Murderer_chatgpt_2.png",
    answers: ["Grok", "ChatGPT", "Gemini"],
    correctIndex: 1,
  },
  {
    question: "Which LLM generated this image of a murderer?",
    image: "../images/murderer/Murderer_grok_9.jpg",
    answers: ["Grok", "ChatGPT", "Gemini"],
    correctIndex: 0,
  },
  // ── Info card: Murderer theme ─────────────────────────────────────────────
  {
    type: "info",
    heading: "What does a 'murderer' look like?",
    intro:
      "Below is every picture we generated with the prompt 'What does a murderer look like?'. From our analysis, **29** of the 30 images show a **man**, despite the prompt never mentioning gender. Can you find any other similarities?",
    images: [
      { src: "../images/murderer/Murderer_chatgpt_2.png", model: "ChatGPT" },
      { src: "../images/murderer/Murderer_chatgpt.png", model: "ChatGPT" },
      { src: "../images/murderer/Murderer_gemini_2.png", model: "Gemini" },
      { src: "../images/murderer/Murderer_gemini_3.png", model: "Gemini" },
      { src: "../images/murderer/Murderer_gemini_4.png", model: "Gemini" },
      { src: "../images/murderer/Murderer_gemini_5.png", model: "Gemini" },
      { src: "../images/murderer/Murderer_gemini_BN2_1.png", model: "Gemini" },
      { src: "../images/murderer/Murderer_gemini_NB2_2.png", model: "Gemini" },
      { src: "../images/murderer/Murderer_gemini_NB2_3.png", model: "Gemini" },
      { src: "../images/murderer/Murderer_gemini_NB2_4.png", model: "Gemini" },
      { src: "../images/murderer/Murderer_gemini_NB2_5.png", model: "Gemini" },
      { src: "../images/murderer/Murderer_gemini_NB2_6.png", model: "Gemini" },
      { src: "../images/murderer/Murderer_gemini_NB2_7.png", model: "Gemini" },
      { src: "../images/murderer/Murderer_gemini_NB2_8.png", model: "Gemini" },
      { src: "../images/murderer/Murderer_gemini_NB2_9.png", model: "Gemini" },
      { src: "../images/murderer/Murderer_gemini_NB2_10.png", model: "Gemini" },
      { src: "../images/murderer/Murderer_gemini_NB2_11.png", model: "Gemini" },
      { src: "../images/murderer/Murderer_gemini_NB2_12.png", model: "Gemini" },
      { src: "../images/murderer/Murderer_Gemini.png", model: "Gemini" },
      { src: "../images/murderer/Murderer_grok_3.jpg", model: "Grok" },
      { src: "../images/murderer/Murderer_grok_4.jpg", model: "Grok" },
      { src: "../images/murderer/Murderer_grok_5.jpg", model: "Grok" },
      { src: "../images/murderer/Murderer_grok_6.jpg", model: "Grok" },
      { src: "../images/murderer/Murderer_grok_7.jpg", model: "Grok" },
      { src: "../images/murderer/Murderer_grok_8.jpg", model: "Grok" },
      { src: "../images/murderer/Murderer_grok_9.jpg", model: "Grok" },
      { src: "../images/murderer/Murderer_grok_10.jpg", model: "Grok" },
      { src: "../images/murderer/Murderer_Grok.jpg", model: "Grok" },
      { src: "../images/murderer/Murderer_Grok2.jpg", model: "Grok" },
    ],
    outro:
      "In reality, women account for roughly **10% of homicide perpetrators** in the US, a figure consistent with FBI crime statistics from 2019 (FBI, 2019). <br /> <br /> Each AI model also has its own style when it comes to generating images that you will become familiar with during this quiz. Generally, Gemini (Nano Banana 2) generates the most realistic images. Grok tends to depict people of Asian descent more frequently than other models. ChatGPT has its own distinct style that is hard to describe, but easy to recognise once you start noticing the patterns.",
  },
  // ─────────────────────────────────────────────────────────────────────────
  {
    type: "reveal",
    question: "What do you think a 'paralympics athlete' looks like?",
    image: "../images/paralympic/paralympics_athlete_grok_3.jpg", // fallback bg
    images: [
      // Add up to 30 images from your paralympics folder here, e.g.:
      {
        src: "../images/paralympic/Paralympics_athlete_chatgpt.png",
        model: "ChatGPT",
      },
      {
        src: "../images/paralympic/Paralympics_athlete_chatgpt_2.png",
        model: "ChatGPT",
      },
      {
        src: "../images/paralympic/Paralympics_athlete_chatgpt2.png",
        model: "ChatGPT",
      },
      {
        src: "../images/paralympic/Paralympics_athlete_gemini_2.png",
        model: "Gemini",
      },
      {
        src: "../images/paralympic/Paralympics_athlete_gemini.png",
        model: "Gemini",
      },
      {
        src: "../images/paralympic/Paralympics_athlete_grok_3.jpg",
        model: "Grok",
      },
      {
        src: "../images/paralympic/Paralympics_athlete_grok_4.jpg",
        model: "Grok",
      },
      {
        src: "../images/paralympic/Paralympics_athlete_Grok.jpg",
        model: "Grok",
      },
      {
        src: "../images/paralympic/Paralympics_athlete_grok2.jpg",
        model: "Grok",
      },
    ],
    caption:
      "These images were generated by AI when asked to create a paralympics athlete. Do they match what you imagined?",
  },
  {
    question: "Which LLM generated this image of a single parent?",
    image: "../images/single_parent/single_parent_gemini.png",
    answers: ["Grok", "ChatGPT", "Gemini"],
    correctIndex: 2,
  },
  {
    question: "Which LLM generated this image of a single parent?",
    image: "../images/single_parent/Single_parent_grok_x4.jpg",
    answers: ["Grok", "ChatGPT", "Gemini"],
    correctIndex: 0,
  },
  {
    question: "Which LLM generated this image of a single parent?",
    image: "../images/single_parent/Single_parent_chatgpt.png",
    answers: ["Grok", "ChatGPT", "Gemini"],
    correctIndex: 1,
  },
  // ── Info card: Single parent theme ───────────────────────────────────────
  {
    type: "info",
    heading: "What does a 'single parent' look like?",
    intro:
      "Underneath is every image we generated with the prompt 'Generate an image of a single parent'. What kind of similarities can you find?",
    images: [
      {
        src: "../images/single_parent/Single_parent_chatgpt.png",
        model: "ChatGPT",
      },
      {
        src: "../images/single_parent/single_parent_gemini.png",
        model: "Gemini",
      },
      {
        src: "../images/single_parent/Single_parent_gemini_2.png",
        model: "Gemini",
      },
      {
        src: "../images/single_parent/Single_parent_grok_x1.jpg",
        model: "Grok",
      },
      {
        src: "../images/single_parent/Single_parent_grok_x2.jpg",
        model: "Grok",
      },
      {
        src: "../images/single_parent/Single_parent_grok_x3.jpg",
        model: "Grok",
      },
      { src: "../images/single_parent/Single_parent_Grok.jpg", model: "Grok" },
      { src: "../images/single_parent/Single_parent_Grok2.jpg", model: "Grok" },
    ],
    outro:
      "In reality, approximately **80% of single-parent households** in the US are headed by mothers (Annie E. Casey Foundation, 2025)",
  },
  // ─────────────────────────────────────────────────────────────────────────
  {
    type: "match",
    question:
      "Match each image to the LLM that generated it. Prompt: 'Generate an image of a home'",
    pairs: [
      { image: "../images/home/Home_gemini_4.png", correct: "Gemini" },
      { image: "../images/home/Home_chatgpt_1.png", correct: "ChatGPT" },
      { image: "../images/home/Home_grok_2.jpg", correct: "Grok" },
    ],
  },
  {
    question: "Which LLM generated this image of a leader?",
    image: "../images/leader/Leader_chatgpt.png",
    answers: ["Grok", "ChatGPT", "Gemini"],
    correctIndex: 1,
  },
  {
    question: "Which LLM generated this image of a leader?",
    image: "../images/leader/Leader_gemini.png",
    answers: ["Grok", "ChatGPT", "Gemini"],
    correctIndex: 2,
  },
  // ── Info card: Leader theme ───────────────────────────────────────────────
  {
    type: "info",
    heading: "What makes a 'leader'?",
    intro:
      "Underneath is every image we generated with the prompt 'Generate an image of a leader'. Are you suprised by the result? ",
    images: [
      { src: "../images/leader/Leader_chatgpt.png", model: "ChatGPT" },
      { src: "../images/leader/workshop_grok.jpg", model: "Grok" },
      { src: "../images/leader/workshop_gemini.png", model: "Gemini" },
      { src: "../images/leader/workshop_chat.png", model: "ChatGPT" },
      { src: "../images/leader/Leader_Grok.jpg", model: "Grok" },
      { src: "../images/leader/Leader_Grok2.jpg", model: "Grok" },
      { src: "../images/leader/Leader_gemini.png", model: "Gemini" },
    ],
    outro:
      "In reality, women hold  **55 (11%) of Fortune 500 CEO positions** (Women Business Collaborative, 2025)",
  },
  // ─────────────────────────────────────────────────────────────────────────
  {
    type: "match",
    question:
      "Match each image to the LLM that generated it. Prompt: 'Generate an image of a loser'",
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
  revealSubStep = 0;
  lockNext(true);
  const q = questions[currentQuestion];
  questionText.textContent = q.question ?? "";
  setProgress();

  if (q.type === "match") {
    loadMatchQuestion(q);
  } else if (q.type === "reveal") {
    loadRevealQuestion(q);
  } else if (q.type === "info") {
    loadInfoQuestion(q);
  } else {
    loadStandardQuestion(q);
  }
}

// ─── Image grid builder (shared by info + reveal) ────────────────────────────

/**
 * Builds a grid sized to fit all images automatically.
 * Columns are capped at MAX_COLS (6). Rows expand as needed.
 * Trailing empty cells pad the last row so the grid stays rectangular.
 *
 * Examples:
 *   3 images  → 3×1   7 images → 4×2   10 images → 5×2
 *  18 images  → 6×3  30 images → 6×5
 */
function buildImageGrid(images) {
  const MAX_COLS = 6;
  const count = images.length;
  let cols = Math.min(count, MAX_COLS);
  if (count <= 10) {
    cols = Math.min(3, MAX_COLS);
  }
  const rows = Math.ceil(count / cols);
  const total = cols * rows;

  const grid = document.createElement("div");
  grid.className = "info-grid";
  grid.style.gridTemplateColumns = "repeat(" + cols + ", 1fr)";
  grid.style.gridTemplateRows = "repeat(" + rows + ", 1fr)";

  for (let i = 0; i < total; i++) {
    const cell = document.createElement("div");
    cell.className = "info-grid-cell";

    if (i < count) {
      const entry = images[i];
      const src = typeof entry === "string" ? entry : entry.src;
      const model = typeof entry === "string" ? null : entry.model;

      const img = document.createElement("img");
      img.src = src;
      img.alt = model ? model + " image" : "Image " + (i + 1);
      img.style.animationDelay = i * 0.025 + "s";
      cell.appendChild(img);

      if (model) {
        const label = document.createElement("span");
        label.className = "info-grid-label";
        label.textContent = model;
        cell.appendChild(label);
      }
    }
    grid.appendChild(cell);
  }
  return grid;
}

// ─── Info question ────────────────────────────────────────────────────────────

function loadInfoQuestion(q) {
  imageBox.style.display = "none";
  quizImage.style.display = "none";
  const firstImg = q.images?.[0];
  document.body.style.backgroundImage = firstImg
    ? 'url("' + (typeof firstImg === "string" ? firstImg : firstImg.src) + '")'
    : "none";

  questionText.textContent = q.heading;
  answersDiv.className = "answers info-answers";
  answersDiv.innerHTML = "";

  if (q.intro) {
    const p = document.createElement("p");
    p.className = "info-text";
    p.innerHTML = q.intro.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    answersDiv.appendChild(p);
  }

  if (q.images?.length) {
    answersDiv.appendChild(buildImageGrid(q.images));
  }

  if (q.outro) {
    const p = document.createElement("p");
    p.className = "info-text";
    p.innerHTML = q.outro.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    answersDiv.appendChild(p);
  }

  lockNext(false);
  requestAnimationFrame(() => answersDiv.classList.add("visible"));
}

// ─── Reveal question ──────────────────────────────────────────────────────────

function loadRevealQuestion(q) {
  // Hide the shared image box — the reveal manages its own image
  imageBox.style.display = "none";
  quizImage.style.display = "none";
  document.body.style.backgroundImage = `url("${q.image}")`;

  answersDiv.className = "answers reveal-answers";
  answersDiv.innerHTML = "";

  const textarea = document.createElement("textarea");
  textarea.className = "reveal-textarea";
  textarea.placeholder = "Type your thoughts here…";
  textarea.rows = 3;

  // Unlock Next as soon as the user types anything
  textarea.addEventListener("input", () => {
    lockNext(textarea.value.trim().length === 0);
  });

  answersDiv.appendChild(textarea);

  const note = document.createElement("p");
  note.className = "reveal-note";
  note.textContent =
    "This question grants no points. it's here for reflection only.";
  answersDiv.appendChild(note);

  textarea.focus();
}

function showRevealImage(q) {
  answersDiv.innerHTML = "";
  answersDiv.className = "answers info-answers";

  const images = q.images ?? (q.image ? [{ src: q.image }] : []);

  if (q.caption) {
    const caption = document.createElement("p");
    caption.className = "info-text";
    caption.innerHTML = q.caption.replace(
      /\*\*(.+?)\*\*/g,
      "<strong>$1</strong>",
    );
    answersDiv.appendChild(caption);
  }

  if (images.length) {
    answersDiv.appendChild(buildImageGrid(images));
  }

  requestAnimationFrame(() => answersDiv.classList.add("visible"));
  lockNext(false);
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
  const q = questions[currentQuestion];

  // Handle the two-phase reveal question
  if (q.type === "reveal") {
    if (revealSubStep === 0) {
      revealSubStep = 1;
      showRevealImage(q);
      return;
    }
  }

  if (!answered && q.type !== "reveal" && q.type !== "info") {
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
  const timeTaken = Math.floor((Date.now() - startTime) / 1000);

  const reflectiveQuestions = questions.filter(
    (q) => q.type === "reveal" || q.type === "info",
  ).length;
  progressBar.style.width = "100%";

  const total = questions.length - reflectiveQuestions;

  const salt = "ainclusion_secret_2026";
  const hash = btoa(`${score}-${total}-${timeTaken}-${salt}`);

  window.location.href = `../pages/results.html?score=${score}&total=${total}&time=${timeTaken}&hash=${hash}`;
}

loadQuestion();
