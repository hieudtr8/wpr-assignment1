// TODO(you): Write the JavaScript necessary to complete the assignment.
let introductionSection = document.querySelector('#introduction');
let attempQuizSection = document.querySelector('#attempt-quiz');
let reviewQuizSection = document.querySelector('#review-quiz');

function onSelectOption(e) {
  const selectedOption = e.currentTarget;
  const targetedQuestion = selectedOption.parentElement.parentElement;
  const listTargetedOption = targetedQuestion.childNodes[5].childNodes;
  for (option of listTargetedOption) {
    if (option == selectedOption) {
      if (option.classList.contains('un-selected')) {
        option.classList.remove('un-selected');
        option.classList.add('option-selected');
        option.childNodes[1].checked = true;
      }
    } else if (
      option.nodeName !== '#text' &&
      option.classList.contains('option-selected')
    ) {
      option.classList.remove('option-selected');
      option.classList.add('un-selected');
    }
  }
}
let listOption = attempQuizSection.querySelectorAll('.option');
for(option of listOption){
  option.addEventListener('click', onSelectOption);
}

function displaySection(section, display) {
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
}

function onStartQuiz() {
  displaySection(introductionSection, false);
  displaySection(attempQuizSection, true);
  window.scrollTo(0, 0);
}
const btnStart = document.querySelector('#btn-start');
btnStart.addEventListener('click', onStartQuiz);

function onSubmitAnswer() {
  if (confirm('Are you sure want to finish this quiz?')) {
    displaySection(attempQuizSection, false);
    displaySection(reviewQuizSection, true);
    window.scrollTo(0, 0);
  }
}
const btnSubmit = document.querySelector('#btn-submit');
btnSubmit.addEventListener('click', onSubmitAnswer);

function onTryAgain() {
  displaySection(reviewQuizSection, false);
  displaySection(introductionSection, true);
  window.scrollTo(0, 0);
}
const btnTryAgain = document.querySelector('#btn-try-again');
btnTryAgain.addEventListener('click', onTryAgain);
