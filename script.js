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
  const listTargetedOption = targetedQuestion.childNodes[2].childNodes;
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
    const questionIndex = document.createElement('h3');
    questionIndex.classList.add('question-index');
    questionIndex.textContent = `Question ${index} of 10`;
    const questionText = document.createElement('span');
    questionText.classList.add('question-text');
    questionText.textContent = question.text;
    questionContainer.appendChild(questionIndex);
    questionContainer.appendChild(questionText);
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
      }
      const optionInput = document.createElement('input');
      optionInput.type = 'radio';
      typeListQuestion == 'received' ? (optionInput.disabled = true) : '';
      listUserSelectedAnswers &&
      typeListQuestion == 'received' &&
      indexAnswer == listUserSelectedAnswers[question._id]
        ? (optionInput.checked = true)
        : '';
      optionInput.name = `option-${index}`;
      const optionText = document.createElement('span');
      optionText.textContent = answer;
      answerElement.appendChild(optionInput);
      answerElement.appendChild(optionText);
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
    const btnSubmit = document.createElement('button');
    btnSubmit.id = 'btn-submit';
    btnSubmit.classList.add('btn');
    btnSubmit.classList.add('btn-green');
    btnSubmit.addEventListener('click', onSubmitAnswer);
    btnSubmit.textContent = 'Submit your answers ❯';
    box.appendChild(btnSubmit);
    attempQuizSection.appendChild(box);
  } else if (typeListQuestion == 'received') {
    box.id = 'box-result';
    const boxHeading = document.createElement('h1');
    boxHeading.textContent = 'Result:';
    const scoreDiv = document.createElement('div');
    scoreDiv.classList.add('score');
    scoreDiv.textContent = `${score}/10`;
    const percentDiv = document.createElement('div');
    percentDiv.classList.add('percent');
    percentDiv.textContent = `${score > 0 ? score : ''}0%`;
    const quotePara = document.createElement('p');
    quotePara.classList.add('quote');
    quotePara.textContent = scoreText;
    const btnTryAgain = document.createElement('button');
    btnTryAgain.id = 'btn-try-again';
    btnTryAgain.classList.add('btn');
    btnTryAgain.classList.add('btn-blue');
    btnTryAgain.classList.add('btn-tryagain');
    btnTryAgain.addEventListener('click', onTryAgain);
    btnTryAgain.textContent = 'Try again';
    box.appendChild(boxHeading);
    box.appendChild(scoreDiv);
    box.appendChild(percentDiv);
    box.appendChild(quotePara);
    box.appendChild(btnTryAgain);
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