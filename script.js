let cl = console.log;

// === DOM Elements ===

const startingScreen = document.getElementById("starting-screen");
const startBtn = document.getElementById("start-quiz-btn");
const mainApp = document.getElementById("app");
const quizCard = document.getElementById("quiz-card");
const questionContainer = document.getElementById("question");
const submitbtn = document.getElementById("submit-btn");
const userChoices = document.querySelectorAll(".radio-btn");
const userChoiceBtns = document.querySelectorAll(".choice-btn");
const progressBar = document.getElementById("progress-bar");
const endResultsScreen = document.getElementById("end-results-screen");
const finalScoreContainer = document.getElementById("final-rating");
const feedbackContainer = document.getElementById("feedback");

// Button function to start quiz

startBtn.addEventListener("click", () => {
  startingScreen.style.display = "none";
  mainApp.style.display = "flex";
  getQuestion();
});

// === Setting Variables ===
let questionIndex = 0;
let scoreArray = [];
let score = "";

// button and "enter" key event listner to progress quiz

submitbtn.addEventListener("click", () => {
  getQuestion();
  updateProgressBar();
});

userChoiceBtns.forEach((btn) => {
  btn.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      getQuestion();
      updateProgressBar();
    }
  });
});

// function to get question amount
let questionAmount = 0;
function getQuestionAmount() {
  fetch("questions.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      questionAmount = data.length;
      cl(questionAmount);
    })
    .catch((error) => {
      console.error("Error fetching the JSON file:", error);
    });
}
getQuestionAmount();

// === Function for progress bar
function updateProgressBar() {
  const progress = (questionIndex / questionAmount) * 100;
  progressBar.style.width = `${progress}%`;
}

// === function to get question and update score ===
function getQuestion() {
  if (questionIndex < questionAmount) {
    fetch("questions.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        userChoices.forEach((choice) => {
          if (choice.checked) {
            let stringToRemove = "choice-";
            let index = choice.id.replace(stringToRemove, "");
            index = Number(index) - 1;
            scoreArray.push(data[questionIndex - 1].options[index].score);
            choice.checked = false;
          }
        });

        questionContainer.innerHTML = data[questionIndex].question;

        for (let i = 0; i < 4; i++) {
          document.getElementById(`choice-${i + 1}-box`).innerHTML =
            data[questionIndex].options[i].answer;
        }

        questionIndex++;
        calculateScore(scoreArray);
      })
      .catch((error) => {
        console.error("Error fetching the JSON file:", error);
      });
  } else if (questionIndex >= questionAmount) {
    showResultsPage();
    calculateScore(scoreArray);
  }
}

// === Function to calculate score ===

function calculateScore() {
  if (scoreArray.length === 0) return cl(`The score is 0`);
  const sum = scoreArray.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );
  score = (sum / scoreArray.length).toFixed(1);
  return cl(`The score is ${score}`);
}

// === Function to show end results page ===

function showResultsPage() {
  cl(score);

  mainApp.style.display = "none";
  endResultsScreen.style.display = "block";
  finalScoreContainer.innerHTML = score;

  if (Number(score) < 5) {
    finalScoreContainer.style.color = "red";
  } else if (Number(score) >= 5 && Number(score) < 8) {
    finalScoreContainer.style.color = "yellow";
  } else if (Number(score) >= 8) {
    finalScoreContainer.style.color = "#32cd32";
  }

  fetch("feedback.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      let i = Math.round(score);
      feedbackContainer.innerHTML = data[i];
    })
    .catch((error) => {
      console.error("Error fetching the JSON file:", error);
    });
}
