var db = require('./db/DatabaseManager.js');
var _ = require('underscore');

var TomatoGameModel = function() {
  this.hostTeamExtraTime = 300000;
  this.notHostTeamExtraTime = 300000;
  this.hostTeamScore = 0;
  this.notHostTeamScore = 0;
  this.gameStarted = false;
  this.singleTeamGame = true;
  this.singlePlayerGame = true;
  this.gameStartTime = new Date();

  this.currentQuestionData = null;

  this.userIds = [];

  this.userObjects = [];

  this.hostTeamUserObjects = [];
  this.notHostTeamUserObjects = [];
  //in game user info: tracks question id, hint ids
}

TomatoGameModel.prototype.startGame = function(lobbyData, singleTeam, singlePlayer, callback) {

  var that = this;

  that.userIds = lobbyData.userIds;
  lobbyData.usersInfo = that.userIds;
  that.singleTeamGame = singleTeam;
  that.singlePlayerGame = singlePlayer;
  that.gameStarted = true;
  
  _.each(that.userIds, function(id) {
    that.userObjects.push({
      id: id, 
      username: lobbyData.users[lobbyData.userIds.indexOf(id)]
    });
  });

  for(var i = 0; i < this.userObjects.length; i++) {
    if(!this.singleTeamGame) {
      if(i < this.userObjects.length/2) {
        this.hostTeamUserObjects.push(this.userObjects[i]);
      } else {
        this.notHostTeamUserObjects.push(this.userObjects[i]);
      }
    } else {
      this.hostTeamUserObjects.push(this.userObjects[i]);
    }
  }

  this.currentQuestionData = db.fetchNewQuestion();
  var that = this;
  this.shortenAndCleanReview();

  this.currentQuestionData.lobbyDisplay = false;
  this.currentQuestionData.lobbyListDisplay = false;
  this.currentQuestionData.singleTeamGame = this.singleTeamGame;
  this.currentQuestionData.singlePlayerGame = this.singlePlayerGame;
  this.currentQuestionData.gameStart = true;

  var that = this;

  _.each(this.userObjects, function(userObject) {
    that.decorateWithGameData(userObject.id)
    callback(userObject.id, that.currentQuestionData);
  });
}

TomatoGameModel.prototype.startSinglePlayerGame = function(lobbyData, callback) {
  this.startGame(lobbyData, true, true, callback);
}

TomatoGameModel.prototype.startSingleTeamGame = function(lobbyData, callback) {
  this.startGame(lobbyData, true, false, callback);
}

TomatoGameModel.prototype.startMultipleTeamGame = function(lobbyData, callback) {
  this.startGame(lobbyData, false, false, callback);
};



TomatoGameModel.prototype.registerAnswer = function(lobbyData, userId, correct, callback) {
  var that = this;

  var answererIsOnHostTeam = true;
  if(this.singleTeamGame) {  
    if(correct) {
      this.hostTeamExtraTime += 5;
      this.hostTeamScore++;    
    } else {
      this.hostTeamExtraTime -= 5;      
    }
  } else {
    var appropriateTeam;
    if(!!_.find(that.hostTeamUserObjects, 
      function(hostObj) {return hostObj.id === userId})){
      if(correct) {
        this.hostTeamExtraTime += 5;
        this.hostTeamScore++;
      } else {
        this.hostTeamExtraTime -= 5;
      }
    } else {
      if(correct) {
        this.notHostTeamExtraTime += 5;
        this.notHostTeamScore++;
      } else {
        this.hostTeamExtraTime -= 5;
      }
      answererIsOnHostTeam = false;
    }
  }
  this.fetchQuestionAndDecorateWithPreviousQuestionData();
  
  this.shortenAndCleanReview();
  // this.currentQuestionData.previousAnswerer = userId;
  this.currentQuestionData.answeringTeamIsCorrect = correct;
  this.currentQuestionData.answeringTeamIsHost = !!_.find(that.hostTeamUserObjects, 
    function(hostObj) {return hostObj.id === userId});

  var that = this;
  _.each(this.userObjects, function(userObject) {
    that.decorateWithGameData(userObject.id);
    callback(userObject.id, that.currentQuestionData);
  });
};

TomatoGameModel.prototype.decorateWithGameData = function(userId) {
  this.currentQuestionData.timeData = {
    hostTeamExtraTime : this.hostTeamExtraTime + this.gameStartTime.getTime()/1000,
    notHostTeamExtraTime : this.notHostTeamExtraTime + this.gameStartTime.getTime()/1000
  };
  this.currentQuestionData.scoreData = {
    hostTeamScore : this.hostTeamScore,
    notHostTeamScore : this.notHostTeamScore
  };

  if(this.singleTeamGame) {
    this.currentQuestionData.onHostTeam = true;
  } else {
    var that = this;
    this.currentQuestionData.onHostTeam = !!_.find(that.hostTeamUserObjects, 
      function(hostObj) {return hostObj.id === userId});
  }
};

TomatoGameModel.prototype.fetchQuestionAndDecorateWithPreviousQuestionData = function() {
  var lastReview = this.currentQuestionData.review;
  var lastReviewer = this.currentQuestionData.reviewer;
  var lastTitle = this.currentQuestionData.correctTitle;

  this.currentQuestionData = db.fetchNewQuestion();

  this.currentQuestionData.previousReview = lastReview;
  this.currentQuestionData.previousReviewer = lastReviewer;
  this.currentQuestionData.previousCorrectTitle = lastTitle;
}

TomatoGameModel.prototype.shortenAndCleanReview = function() {
  var maxLength = 300;
  if(this.currentQuestionData.review.length > maxLength) {
    var randomNumber = Math.floor(Math.random()*(this.currentQuestionData.review.length-maxLength));
    this.currentQuestionData.review = '...' + this.currentQuestionData.review.substring(randomNumber, randomNumber + maxLength) + '...';
  }
  return this.currentQuestionData.review;
}

TomatoGameModel.prototype.endGame = function(callback) {
  var winner = "your team"
  callback(winner+" wins!");
};

module.exports = TomatoGameModel;
