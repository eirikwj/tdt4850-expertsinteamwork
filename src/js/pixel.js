const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const image = new Image();

// TODO: Make modular
image.src = "http://127.0.0.1:5500/src/images/dog.jpeg";

image.onerror = function () {
  console.log("Image failed to load.");
};

const correctAnswer = "dog";

let pixelSize = 50;
const minPixelSize = 6;

image.onload = function () {
  canvas.width = image.width;
  canvas.height = image.height;
  pixelate();
};

function pixelate() {
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  ctx.drawImage(image, 0, 0, w / pixelSize, h / pixelSize);

  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(canvas, 0, 0, w / pixelSize, h / pixelSize, 0, 0, w, h);
}

function checkGuess() {
  const guess = document.getElementById("guessInput").value.toLowerCase();
  const message = document.getElementById("message");

  if (guess === correctAnswer) {
    message.textContent = "Correct! 🎉";
    pixelSize = 1;
    pixelate();
  } else {
    message.textContent = "Wrong! Try again!";
    if (pixelSize > minPixelSize) {
      pixelSize -= 5;
      pixelate();
    } else {
      message.textContent = "The picture was a dog! Try again";
      pixelSize = 1;
      pixelate();
    }
  }
}
