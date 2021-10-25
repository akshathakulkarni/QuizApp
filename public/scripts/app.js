// Client facing scripts here

const addQuestion = () => {
  $addQuestion = `<section id='next-question'>
  <form method="POST",  action='/api/newQuiz'>
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
</section>`
return $addQuestion;
}


$(document).ready(function() {

  $(function() {
    const $button = $('#add-question');
    $button.on('click', function () {
    console.log('Button clicked, performing ajax call...');
    $('#new-question').append(addQuestion());
     });
  });

  $('.new-quiz').submit(function(event) {
    event.preventDefault();
    console.log("Inside submit handler")
    const serialisedData = $('form').serialize();
    console.log('Data = ', serialisedData)
  });

});
