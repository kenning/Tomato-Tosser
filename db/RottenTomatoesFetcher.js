var questionList = require('./questions.js');
var apiKey = require('./apiKey.config');
var rotten = require('rotten-tomatoes-api')(apiKey);

var filmName = 'American Sniper';

rotten.movieReviews({
  'page_limit': 1,
  'q': filmName,
  'page_limit': 1
}, function(err, data) {
  if(err) {
    console.log('error');
    console.log(err);
  } else {
    console.log(data);
  }
})
