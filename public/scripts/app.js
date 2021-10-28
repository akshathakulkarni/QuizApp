// Client facing scripts here

const addQuestion = (count) => {
  $addQuestion = `
    <section class='next-question' data-count='${count}'>
  <div class="input-group query">
  <div class="input-group-prepend">
    <span class="input-group-text" id="query-prompt">Question</span>
  </div>
  <input type="text" name="query" class="form-control" aria-describedby="query-prompt">
</div>
<div class="input-group correct">
  <div class="input-group-prepend">
    <span class="input-group-text" id="correct-prompt">Correct answer</span>
  </div>
  <input type="text" name="correct" class="form-control" aria-describedby="correct-prompt">
</div>
<div class="input-group wrong">
  <div class="input-group-prepend">
    <span class="input-group-text" id="wrong1-prompt">Wrong answer #1</span>
  </div>
  <input type="text" name="wrong1" class="form-control" aria-describedby="wrong1-prompt">
</div>
<div class="input-group wrong">
  <div class="input-group-prepend">
    <span class="input-group-text" id="wrong2-prompt">Wrong answer #2</span>
  </div>
  <input type="text" name="wrong2" class="form-control" aria-describedby="wrong2-prompt">
</div>
<div class="input-group wrong">
  <div class="input-group-prepend">
    <span class="input-group-text" id="wrong3-prompt">Wrong answer #3</span>
  </div>
  <input type="text" name="wrong3" class="form-control" aria-describedby="wrong3-prompt">
</div>
<br>
<br>

</section>
`
return $addQuestion;
}

const errorCheck = function(event) {
  $error = $('#error');
  $inputText = $('.form-control');
  console.log('inputText = ', $inputText.length);
  let errorFlag = false;

  //For a valid input no error should be displayed.
  $error.text("");

  //check if input content is empty
  for (let $input in $inputText) {
   console.log('input text = ', $inputText[$input].value);
    if($inputText[$input].value === '' || $inputText[$input].value === null)
    {
      $error.css("background-color", "#FFDB58");
      $error.text("!!!Empty input! Please enter all questions and answers.");
      $error.slideDown();
      errorFlag = true;
    }
  }
  console.log('errorFlag = ', errorFlag);
  return errorFlag;
}

$(document).ready(function() {

  $(function() {
    const $button = $('#add-question');
    let count = 0;
    $button.on('click', function () {
      count++;
      console.log('Button clicked, performing ajax call...', count);
      $('#question').append(addQuestion(count));
     });
  });

  $('#quiz-form').submit(function(event) {
    if(errorCheck(event)) {
      event.preventDefault();
    }
   });
});
