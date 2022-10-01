// TODO(you): Write the JavaScript necessary to complete the assignment.
let introductionSection = document.querySelector('#introduction');
let attempQuizSection = document.querySelector('#attempt-quiz');
let reviewQuizSection = document.querySelector('#review-quiz');
let listQuestion = [];
let attempId = '';
let quizStarted = false;

const onSelectOption = (e) => {
  const selectedOption = e.target;
  const targetedQuestion = selectedOption.parentElement.parentElement;
  const listTargetedOption = targetedQuestion.childNodes[3].childNodes;
  for (option of listTargetedOption) {
    if (option == selectedOption) {
      if (option.classList.contains('un-selected')) {
        option.classList.remove('un-selected');
        option.classList.add('option-selected');
        option.childNodes[0].checked = true;
      }
    } else if (
      option.nodeName !== '#text' &&
      option.classList.contains('option-selected')
    ) {
      option.classList.remove('option-selected');
      option.classList.add('un-selected');
    }
  }
};

const displaySection = (section, display) => {
  const displayNone = 'display-none';
  const displayBlock = 'display-block';
  if (!display) {
    if (!section.classList.contains(displayNone)) {
      section.classList.add(displayNone);
    }
    if (section.classList.contains(displayBlock)) {
      section.classList.remove(displayBlock);
    }
  } else {
    if (section.classList.contains(displayNone)) {
      section.classList.remove(displayNone);
    }
    if (!section.classList.contains(displayBlock)) {
      section.classList.add(displayBlock);
    }
  }
};

// Handle Start Quiz

const onStartQuiz = () => {
  if (!quizStarted) {
    quizStarted = true;
    const body = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch('https://wpr-quiz-api.herokuapp.com/attempts', body)
      .then((response) => response.json())
      .then((data) => {
        attempId = data._id;
        listQuestion = data.questions;
        if (listQuestion.length) {
          displaySection(introductionSection, false);
          displaySection(attempQuizSection, true);
          window.scrollTo(0, 0);
          populateListQuestions(data, 'attempt');
          quizStarted = false;
        }
      })
      .catch(() => {
        quizStarted = false;
      });
  }
};
const btnStartQuiz = document.querySelector('#btn-start');
btnStartQuiz.addEventListener('click', onStartQuiz);

const populateListQuestions = (data, typeListQuestion) => {
  let index = 1;
  attempId = data._id;
  listQuestion = data.questions;
  const listUserSelectedAnswers = data.answers;
  const listCorrectAnswer = data.correctAnswers;
  const { score, scoreText } = data;
  for (let question of data.questions) {
    // Add question index and question text
    const questionContainer = document.createElement('div');
    questionContainer.classList.add('option-list');
    questionContainer.id = question._id;
    questionContainer.innerHTML = `<h3 class="question-index">Question ${index} of 10 </h3>
    <span class="question-text">${question.text}</span>`;
    // Add list answer
    const listAnswers = question.answers;
    const answerContainer = document.createElement('ul');
    answerContainer.classList.add('option-container');
    listAnswers.forEach((answer, indexAnswer) => {
      const answerElement = document.createElement('li');
      answerElement.classList.add('option');
      if (typeListQuestion == 'attempt') {
        answerElement.classList.add('un-selected');
        answerElement.addEventListener('click', onSelectOption);
      } else if (typeListQuestion == 'received') {
        answerElement.classList.add('completed');
        // If the answer is selected by user
        if (
          listUserSelectedAnswers &&
          indexAnswer === listUserSelectedAnswers[question._id]
        ) {
          // Checkk if that answer if true -> add correct-ans class
          if (
            listUserSelectedAnswers[question._id] ===
            listCorrectAnswer[question._id]
          ) {
            answerElement.classList.add('correct-answer');
            // else if that false -> add wrong answer class
          } else {
            answerElement.classList.add('wrong-answer');
          }
        }
        // Other option that user not selected
        else {
          // Check if the option is correct  -> add option correct
          if (indexAnswer === listCorrectAnswer[question._id]) {
            answerElement.classList.add('option-correct');
          }
        }
        answerElement.disabled = true;
      }
      answerElement.innerHTML = `<input type="radio" ${
        typeListQuestion == 'received' ? 'disabled' : ''
      } ${
        listUserSelectedAnswers &&
        typeListQuestion == 'received' &&
        indexAnswer == listUserSelectedAnswers[question._id]
          ? 'checked'
          : ''
      } name="option-${index}"> ${escapeHtml(answer)}`;
      answerContainer.appendChild(answerElement);
    });
    questionContainer.appendChild(answerContainer);
    if (typeListQuestion == 'attempt') {
      attempQuizSection.appendChild(questionContainer);
    } else if (typeListQuestion == 'received') {
      reviewQuizSection.appendChild(questionContainer);
    }
    index++;
  }
  const box = document.createElement('div');
  box.classList.add('boxes');
  if (typeListQuestion == 'attempt') {
    box.id = 'box-submit';
    box.innerHTML = `
      <button id="btn-submit" onclick="onSubmitAnswer()" class="btn btn-green">
        Submit your answers ❯
      </button> `;
    attempQuizSection.appendChild(box);
  } else if (typeListQuestion == 'received') {
    box.id = 'box-result';
    box.innerHTML = `
      <h1>Result:</h1>
      <div class="score">${score}/10</div>
      <div class="percent">${score > 0 ? score : ''}0%</div>
      <p class="quote">${scoreText}</p>
      <button onclick="onTryAgain()" class="btn btn-blue btn-tryagain">Try again</button>
    `;
    reviewQuizSection.appendChild(box);
  }
};

// Handle Submit Answer

const onSubmitAnswer = () => {
  if (confirm('Are you sure want to finish this quiz?')) {
    const listAnswers = getListAnswer();
    const postData = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answers: listAnswers }),
    };
    fetch(
      `https://wpr-quiz-api.herokuapp.com/attempts/${attempId}/submit`,
      postData
    )
      .then((response) => response.json())
      .then((data) => {
        populateListQuestions(data, 'received');
        displaySection(attempQuizSection, false);
        displaySection(reviewQuizSection, true);
        window.scrollTo(0, 0);
      });
  }
};

const getListAnswer = () => {
  const listQuestion = attempQuizSection.querySelectorAll('.option-list');
  const result = {};
  for (question of listQuestion) {
    const questionId = question.id;
    const listOption = question.querySelectorAll("input[type='radio']");
    let selectedIndex = 0;
    listOption.forEach((option, i) => {
      if (option.checked) {
        selectedIndex = i;
        result[questionId] = selectedIndex;
      }
    });
  }
  return result;
};

const onTryAgain = () => {
  attempQuizSection.innerHTML = '';
  reviewQuizSection.innerHTML = '';
  displaySection(reviewQuizSection, false);
  displaySection(introductionSection, true);
  window.scrollTo(0, 0);
};

const escapeHtml = (unsafe) => {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};
