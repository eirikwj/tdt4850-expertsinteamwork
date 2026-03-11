const hero = document.getElementById("hero");

const backgrounds = [
  "images/greedy_person_gemini.jpg",
  "images/single_parent_gemini.jpg",
  "images/unhappy_family_gemini.png",
  "images/paralympics_athlete_gemini.png",
];

let current = 0;

function changeBackground() {
  current++;
  if (current >= backgrounds.length) current = 0;
  hero.style.backgroundImage = `url("${backgrounds[current]}")`;
}

hero.style.backgroundImage = `url("${backgrounds[0]}")`;
hero.classList.add("loaded");

setInterval(changeBackground, 5000);
