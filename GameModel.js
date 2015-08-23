var db = require('./db/DatabaseManager.js');
var _ = require('underscore');

var TomatoGameModel = function() {
  this.hostTeamExtraTime = 30;
  this.notHostTeamExtraTime = 30;
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

  if(!this.singleTeamGame) {
    for(var i = 0; i < this.userObjects.length; i++) {
      if(i < this.userObjects.length/2) {
        this.hostTeamUserObjects.push(this.userObjects[i]);
      } else {
        this.notHostTeamUserObjects.push(this.userObjects[i]);
      }
    }
  }

  this.currentQuestionData = db.fetchNewQuestion();
  var that = this;
  this.currentQuestionData.review = this.shortenAndCleanReview(this.currentQuestionData.review);
  this.decorateWithGameData(this.currentQuestionData);

  var that = this;

  _.each(this.userObjects, function(userObject) {
    that.currentQuestionData.lobbyDisplay = false;
    that.currentQuestionData.lobbyListDisplay = false;
    that.currentQuestionData.singleTeamGame = that.singleTeamGame;
    that.currentQuestionData.singlePlayerGame = that.singlePlayerGame;

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

  var answererIsOnHostTeam = true;
  if(this.singleTeamGame) {  
    if(correct) {
      this.hostTeamExtraTime += 5;
      this.hostTeamScore++;    
    }
  } else {
    var appropriateTeam;
    that = this;
    if(!!_.find(that.hostTeamUserObjects, 
      function(hostObj) {return hostObj.id === userId})){
      if(correct) {
        this.hostTeamExtraTime += 5;
        this.hostTeamScore++;
      }
    } else {
      if(correct) {
        this.notHostTeamExtraTime += 5;
        this.notHostTeamScore++;
      }
      answererIsOnHostTeam = false;
    }
  }
  var previousQuestionData = this.currentQuestionData;
  this.currentQuestionData = db.fetchNewQuestion();
  this.currentQuestionData.review = this.shortenAndCleanReview(this.currentQuestionData.review);
  this.currentQuestionData.previousReview = previousQuestionData.review;
  this.currentQuestionData.previousReviewer = previousQuestionData.reviewer;
  this.currentQuestionData.previousCorrectTitle = previousQuestionData.correctTitle;
  this.decorateWithGameData(this.currentQuestionData);
  this.currentQuestionData.previousAnswerer = userId;
  var that = this;
  _.each(this.userObjects, function(userObject) {
    callback(userObject.id, that.currentQuestionData);
  });

};

TomatoGameModel.prototype.decorateWithGameData = function(data) {
  data.timeData = {
    hostTeamExtraTime : this.hostTeamExtraTime + this.gameStartTime.getTime()/1000,
    notHostTeamExtraTime : this.notHostTeamExtraTime + this.gameStartTime.getTime()/1000
  };
  data.scoreData = {
    hostTeamScore : this.hostTeamScore,
    notHostTeamScore : this.notHostTeamScore
  };

  if(this.singleTeamGame) {
    data.onHostTeam = true;
  } else {
    var that = this;
    data.onHostTeam = !!_.find(that.hostTeamUserObjects, 
      function(hostObj) {return hostObj.id === data.id});
  }
};

TomatoGameModel.prototype.shortenAndCleanReview = function(data) {
  console.log('shortening!');
  console.log(data);
  var maxLength = 300;
  if(data.length > maxLength) {
    var randomNumber = Math.floor(Math.random()*(data.length-maxLength));
    data = '...' + data.substring(randomNumber, randomNumber + maxLength) + '...';
  }
  console.log(data);
  return data;
}

TomatoGameModel.prototype.endGame = function(callback) {
  var winner = "your team"
  callback(winner+" wins!");
};

module.exports = TomatoGameModel;
