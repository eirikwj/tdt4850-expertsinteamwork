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
      { image: "../images/home/Home_gemini_4.png",      correct: "Gemini"  },
      { image: "../images/home/Home_chatgpt_1.png",     correct: "ChatGPT" },
      { image: "../images/home/Home_grok_2.jpg", correct: "Grok"},
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
      { image: "../images/loser/Loser_chatgpt.png",      correct: "ChatGPT"  },
      { image: "../images/loser/Loser_Grok2.jpg",     correct: "Grok" },
      { image: "../images/loser/Loser_gemini_fast.png", correct: "Gemini"},
    ],
  },
];

function setProgress() {
  progressText.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
  const pct = ((currentQuestion + 1) / questions.length) * 100;
  progressBar.style.width = pct + "%";
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

  if (q.type === "match") {
    loadMatchQuestion(q);
  } else {
    loadStandardQuestion(q);
  }
}

function loadStandardQuestion(q) {
  imageBox.style.display = "";
  quizImage.style.display = "";
  quizImage.src = q.image;
  document.body.style.backgroundImage = `url("${q.image}")`;

  answersDiv.className = "answers";
  answersDiv.innerHTML = "";

  for (let i = 0; i < q.answers.length; i++) {
    const btn = document.createElement("button");
    btn.className = "answer";
    btn.textContent = q.answers[i];
    btn.addEventListener("click", () => handleStandardAnswer(i));
    answersDiv.appendChild(btn);
  }
}

function handleStandardAnswer(index) {
  if (answered) return;
  answered = true;
  lockNext(false);

  const correctIndex = questions[currentQuestion].correctIndex;
  const btns = answersDiv.querySelectorAll(".answer");

  btns.forEach((btn, i) => {
    btn.disabled = true;
    if (i === index)        btn.classList.add("chosen");
    if (i === correctIndex) btn.classList.add("correct");
    else                    btn.classList.add("wrong");
  });

  if (index === correctIndex) score++;
}

function loadMatchQuestion(q) {
  document.body.style.backgroundImage = `url("${q.pairs[0].image}")`;

  imageBox.style.display = "none";
  quizImage.style.display = "none";

  answersDiv.className = "answers match-answers";
  answersDiv.innerHTML = "";

  const names = q.pairs.map(p => p.correct);
  const shuffled = [...names].sort(() => Math.random() - 0.5);

  const namesCol = document.createElement("div");
  namesCol.className = "names-col";

  shuffled.forEach(name => {
    namesCol.appendChild(createNameChip(name, namesCol, q));
  });

  const imagesCol = document.createElement("div");
  imagesCol.className = "images-col";

  q.pairs.forEach((pair, i) => {
    const zone = document.createElement("div");
    zone.className = "drop-zone";
    zone.dataset.correct = pair.correct;
    zone.dataset.index   = i;

    const img = document.createElement("img");
    img.src = pair.image;
    img.alt = "Match image";

    const label = document.createElement("span");
    label.className = "drop-label";

    zone.appendChild(img);
    zone.appendChild(label);

    zone.addEventListener("dragover",  onDragOver);
    zone.addEventListener("dragleave", onDragLeave);
    zone.addEventListener("drop", e => onDrop(e, zone, namesCol, q));

    imagesCol.appendChild(zone);
  });

  answersDiv.appendChild(namesCol);
  answersDiv.appendChild(imagesCol);
}

function createNameChip(name, namesCol, q) {
  const chip = document.createElement("div");
  chip.className = "draggable-name";
  chip.draggable = true;
  chip.dataset.name = name;
  chip.textContent = name;
  chip.addEventListener("dragstart", onDragStart);
  chip.addEventListener("dragend",   onDragEnd);
  return chip;
}

function onDragStart(e) {
  draggedEl = e.currentTarget;
  draggedEl.classList.add("dragging");
}

function onDragEnd() {
  if (draggedEl) draggedEl.classList.remove("dragging");
  document.querySelectorAll(".drop-zone").forEach(z => z.classList.remove("drag-over"));
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

  const droppedName = draggedEl.dataset.name;

  if (zone.dataset.placed) {
    const oldName = zone.dataset.placed;
    const existingChip = [...namesCol.querySelectorAll(".draggable-name")]
      .find(c => c.dataset.name === oldName);
    if (existingChip) {
      existingChip.style.display = "";
    } else {
      namesCol.appendChild(createNameChip(oldName, namesCol, q));
    }
  }

  document.querySelectorAll(".drop-zone").forEach(z => {
    if (z !== zone && z.dataset.placed === droppedName) {
      z.dataset.placed = "";
      z.querySelector(".drop-label").textContent = "";
      z.classList.remove("has-chip");
    }
  });

  zone.dataset.placed = droppedName;
  zone.querySelector(".drop-label").textContent = droppedName;
  zone.classList.add("has-chip");

  draggedEl.style.display = "none";

  const allZones = document.querySelectorAll(".drop-zone");
  if ([...allZones].every(z => z.dataset.placed)) {
    checkMatchAnswers(q);
  }
}

function checkMatchAnswers(q) {
  answered = true;
  let correct = 0;

  document.querySelectorAll(".drop-zone").forEach(zone => {
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
