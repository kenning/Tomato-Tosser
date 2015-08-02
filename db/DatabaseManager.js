var mongo = require('mongodb');
var monk = require('monk');
// var dbConfig = require('./mongolab.config'); 
// var db = monk(dbConfig);

// var questionList = db.get('TestQuestions');

var questionList = require('./questions.js');

var counter = 0;

module.exports = {
  fetchNewQuestion : function() {
  	if(counter === 3) counter = 0;
    // return questionList[counter++];
  return questionList[counter];
  },
  
  //TODO 
  //fetch functions
  //insert functions
    //markQuestionAsDone?
    //markQuestionAsDoneByUser?

  //track game state on database? (no -- at least, not yet)
}
