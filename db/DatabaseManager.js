var questions = require('./questions.js');

module.exports = {
  fetchNewQuestion: function() {
    return questions[Math.floor(questions.length*Math.random())];
  }
}