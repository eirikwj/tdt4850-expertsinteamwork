// Get elements
const scoreHeader = document.getElementById("score-header");
const scoreMessage = document.getElementById("score-message");

function runResultsLogic() {
  const params = new URLSearchParams(window.location.search);
  const score = parseInt(params.get("score"));
  const total = parseInt(params.get("total"));

  if (!isNaN(score) && !isNaN(total)) {
    // Calculate percentage
    const percentage = (score / total) * 100;

    // Update the Header
    scoreHeader.textContent = `You got ${score}/${total} points`;

    // Update Message based on percentage
    if (percentage < 30) {
      scoreMessage.textContent =
        "A good start! AI ethics is a deep and complex topic. If you found this quiz interesting, we recommend exploring AINCLUSION to learn more.";
    } else if (percentage < 60) {
      scoreMessage.textContent =
        "Not bad! You're starting to get the hang of inclusive AI. If you found this quiz interesting, we recommend exploring AINCLUSION to learn more.";
    } else if (percentage < 90) {
      scoreMessage.textContent =
        "Great job! You have a solid grasp of responsible AI practices. You seem to be interested inclusive AI - check out AINCLUSION for more insights.";
    } else if (percentage <= 100) {
      scoreMessage.textContent =
        "Outstanding! You're an AI Inclusion champion. Keep leading the way! You seem to be interested inclusive AI - check out AINCLUSION for more insights.";
    } else {
      scoreMessage.textContent =
        "Very clever! Your score exceeds the total possible points. We could use smart people like you in the field of AI ethics! Check out AINCLUSION for more insights.";
    }

    if (percentage >= 90) {
      confetti({
        particleCount: 250,
        spread: 150,
        origin: { y: 0.9 },
      });

      const display = document.getElementById("emoji-display");
      display.textContent = "🥳";
      display.classList.remove("fade-out");

      setTimeout(() => {
        display.classList.add("fade-out");

        setTimeout(() => {
          display.textContent = "";
        }, 500);
      }, 1500);
    }
  } else {
    scoreHeader.textContent = "No score found.";
    scoreMessage.textContent = "Please complete the quiz to see your results.";
  }
}

// Buttons (currently placeholders)
document.getElementById("retry-btn").addEventListener("click", () => {
  window.location.href = "../index.html";
});

document.getElementById("ainclusion-btn").addEventListener("click", () => {
  window.open("https://ainclusion.com/", "_blank", "noopener,noreferrer");
});

// Hero-style dynamic background
const hero = document.getElementById("hero");

const backgrounds = [
  "../images/greedy_person_gemini.jpg",
  "../images/single_parent_gemini.jpg",
  "../images/unhappy_family_gemini.png",
  "../images/paralympics_athlete_gemini.png",
];

const img = new Image();
img.src = backgrounds[0];

img.onload = function () {
  hero.style.backgroundImage = `url("${backgrounds[0]}")`;

  hero.classList.add("loaded");

  runResultsLogic();
};

let current = 0;

function changeBackground() {
  current++;
  if (current >= backgrounds.length) current = 0;
  hero.style.backgroundImage = `url("${backgrounds[current]}")`;
}

// Change every 5 seconds
setInterval(changeBackground, 5000);
