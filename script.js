// TODO(you): Write the JavaScript necessary to complete the assignment.
function onSelectOption(selectedOption) {
  const targetedQuestion = selectedOption.parentElement.parentElement;
  const listTargetedOption = targetedQuestion.childNodes[5].childNodes;
  for (option of listTargetedOption) {
    if (option == selectedOption) {
      if (option.classList.contains('un-selected')) {
        option.classList.remove('un-selected');
        option.classList.add('selected');
        option.childNodes[1].checked = true;
      }
    } else if (option.nodeName !== '#text' && option.classList.contains('selected')) {
      option.classList.remove('selected');
      option.classList.add('un-selected');
    }
  }
}
