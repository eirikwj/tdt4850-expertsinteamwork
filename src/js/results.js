// Dynamically update score
const score = 42; // replace with actual logic
document.getElementById("score-header").textContent = `You got ${score} points`;

// Buttons (currently placeholders)
document.getElementById("retry-btn").addEventListener("click", () => {
  alert("Retry Quiz clicked!");
});
document.getElementById("ainclusion-btn").addEventListener("click", () => {
  alert("AINCLUSION clicked!");
});

// Hero-style dynamic background
const hero = document.getElementById("hero");

const backgrounds = [
  "../images/greedy_person_gemini.jpg",
  "../images/single_parent_gemini.jpg",
  "../images/unhappy_family_gemini.png",
  "../images/paralympics_athlete_gemini.png",
];

let current = 0;

function changeBackground() {
  current++;
  if (current >= backgrounds.length) current = 0;
  hero.style.backgroundImage = `url("${backgrounds[current]}")`;
}

// Set initial background
hero.style.backgroundImage = `url("${backgrounds[0]}")`;

// Change every 5 seconds
setInterval(changeBackground, 5000);
