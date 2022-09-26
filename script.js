// TODO(you): Write the JavaScript necessary to complete the assignment.
const onSelectOption = (selectedOption) => {
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

let introductionSection = document.getElementById('introduction');
let attempQuizSection = document.getElementById('attempt-quiz');
let reviewQuizSection = document.getElementById('review-quiz');

const onStartQuiz = () => {
  displaySection(introductionSection, false);
  displaySection(attempQuizSection, true);
  window.scrollTo(0, 0);
};

const onSubmitAnswer = () => {
  if (confirm('Are you sure want to finish this quiz?')) {
    displaySection(attempQuizSection, false);
    displaySection(reviewQuizSection, true);
    window.scrollTo(0, 0);
  }
};

const onTryAgain = () => {
  displaySection(reviewQuizSection, false);
  displaySection(introductionSection, true);
  window.scrollTo(0, 0);
};
