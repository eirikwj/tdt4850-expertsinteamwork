const answers = document.querySelectorAll('.answer');

answers.forEach(button => {
    button.addEventListener('click', () => {

        if (document.querySelector('.answer.correct, .answer.wrong')) return;

        answers.forEach(btn => {
            if (btn.textContent === "Grok") {
                btn.classList.add("correct");
            } else {
                btn.classList.add("wrong");
            }
        });

        // Add small animation pulse to clicked button
        button.style.transform = "scale(1.05)";
        setTimeout(() => {
            button.style.transform = "scale(1)";
        }, 200);
    });
});
