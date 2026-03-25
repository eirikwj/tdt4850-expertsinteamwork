// Get elements
const scoreHeader = document.getElementById("score-header");
const scoreMessage = document.getElementById("score-message");

async function runResultsLogic() {
  const params = new URLSearchParams(window.location.search);
  const score = parseInt(params.get("score"));
  const total = parseInt(params.get("total"));
  const timeTaken = parseInt(params.get("time")) || 0;
  const hash = params.get("hash");

  const salt = "ainclusion_secret_2026";
  const expectedHash = btoa(`${score}-${total}-${timeTaken}-${salt}`);

  if (!isNaN(score) && !isNaN(total) && hash === expectedHash) {
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

    setTimeout(async () => {
      const username = prompt("Enter your name to go on the scoreboard!");
      if (username && username.trim() !== "") {
        await saveScore(username.trim(), score, timeTaken);
        console.log("Score saved for", username.trim());
      }
    }, 500);

  } else {
    scoreHeader.textContent = "Invalid score found.";
    scoreMessage.textContent = "It looks like the URL was modified. Please complete the quiz properly to see your results and get on the scoreboard!";
  }
}

// Buttons (currently placeholders)
document.getElementById("retry-btn").addEventListener("click", () => {
  window.location.href = "../index.html";
});

document.getElementById("ainclusion-btn").addEventListener("click", () => {
  window.open("https://ainclusion.com/", "_blank", "noopener,noreferrer");
});

document.getElementById("leaderboard-btn").addEventListener("click", () => {
  showTop10();
});

document.getElementById("close-leaderboard").addEventListener("click", () => {
  document.getElementById("leaderboard-modal").style.display = "none";
});

// Close modal when clicking outside of it
window.addEventListener("click", (event) => {
  const modal = document.getElementById("leaderboard-modal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
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

const { createClient } = supabase;

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("Supabase URL:", supabaseUrl);

const _supabase = createClient(supabaseUrl, supabaseKey);

// A "setter" function to save a new score
export async function saveScore(username, score, timeTaken) {
    const { data, error } = await _supabase
        .from('leaderboards')
        .insert([
            { 
                username: username, 
                score: score, 
                time_taken: timeTaken 
            }
        ])
        .select(); // .select() here returns the newly created row

    if (error) {
        console.error('Error saving score:', error);
        return null;
    }

    console.log('Score saved successfully:', data);
    return data;
}

export async function showTop10() {
    const list = document.getElementById("leaderboard-list");
    const modal = document.getElementById("leaderboard-modal");

    modal.style.display = "flex";
    list.innerHTML = "<li><span>Loading scores...</span></li>";

    const { data, error } = await _supabase
        .from('leaderboards')
        .select('*')
        .order('score', { ascending: false })
        .order('time_taken', { ascending: true })
        .limit(10);

    if (error) {
        console.error('Error fetching leaderboard:', error);
        list.innerHTML = "<li><span>Error loading leaderboard.</span></li>";
        return;
    }

    list.innerHTML = "";
    if (data.length === 0) {
        list.innerHTML = "<li><span>No scores yet! Be the first!</span></li>";
        return;
    }

    data.forEach((entry, index) => {
        const li = document.createElement("li");
        
        const nameSpan = document.createElement("span");
        nameSpan.textContent = `${index + 1}. ${entry.username}`;
        
        const scoreSpan = document.createElement("span");
        scoreSpan.textContent = `${entry.score} pts (${entry.time_taken}s)`;

        li.appendChild(nameSpan);
        li.appendChild(scoreSpan);
        list.appendChild(li);
    });
}

