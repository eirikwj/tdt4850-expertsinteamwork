const questionText = document.getElementById("questionText");
const quizImage = document.getElementById("quizImage");
const progressText = document.getElementById("progress");
const nextBtn = document.getElementById("nextBtn");
const answerButtons = document.querySelectorAll(".answer");

let currentQuestion = 0;
let score = 0;
let answered = false;

const questions = [
  {
    question: "Which LLM generated this greedy character image?",
    image: "../images/greedy_person_gemini.jpg",
    answers: ["Grok", "Meta", "ChatGPT"],
    correctIndex: 0,
  },
  {
    question: "Which LLM generated this unhappy family image?",
    image: "../images/unhappy_family_gemini.png",
    answers: ["Meta", "ChatGPT", "Grok"],
    correctIndex: 1,
  },
  {
    question: "Which LLM generated this single parent image?",
    image: "../images/single_parent_gemini.jpg",
    answers: ["ChatGPT", "Meta", "Grok"],
    correctIndex: 0,
  },
];

function loadQuestion() {
  answered = false;

  const q = questions[currentQuestion];

  questionText.textContent = q.question;
  quizImage.src = q.image;
  progressText.textContent = `${currentQuestion + 1}/${questions.length}`;

  answerButtons.forEach((btn, index) => {
    btn.textContent = q.answers[index];
    btn.classList.remove("correct", "wrong");
    btn.disabled = false;
  });
}

answerButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    if (answered) return;
    answered = true;

    const correctIndex = questions[currentQuestion].correctIndex;

    answerButtons.forEach((btn, i) => {
      btn.disabled = true;

      if (i === correctIndex) {
        btn.classList.add("correct");
      } else {
        btn.classList.add("wrong");
      }
    });

    if (index === correctIndex) {
      score++;
    }
  });
});

nextBtn.addEventListener("click", () => {
  if (!answered) {
    alert("Please select an answer");
    console.log("ewuewuiroi");

    return;
  }

  currentQuestion++;

  if (currentQuestion < questions.length) {
    console.log("test load");

    loadQuestion();
  } else {
    console.log("Restults");

    showResults();
  }
});

function showResults() {
  window.location.href = `/src/pages/results.html?score=${score}&total=${questions.length}`;
}

loadQuestion();
