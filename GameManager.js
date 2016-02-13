var db = require('./db/DatabaseManager.js');
var PubGameModel = require('./GameModel.js');
var _ = require('underscore');

//Setup for: only one game at a time
var allUsers = {};

var allLobbiesHash = {};
var visibleLobbies = [];

module.exports = {
  initializeGameManager : function(expressServer) {
    io = require('socket.io')(expressServer);

    io.on('connection', function(userSocket) {

      //////////////////////////////////////////
      /// New user has connected actions 
      //////////////////////////////////////////

      var userId = userSocket.id;

      if(counter === 12) counter = 0;
      allUsers[userId] = {
        name: animals[counter++],
        gameId: null,
        id: userId,
        socket: userSocket
      }
      
      io.emit('newData', { lobbies:visibleLobbies });

      userSocket.emit('newData', { username: allUsers[userId].name });

      //////////////////////////////////////////
      /// Utilities
      //////////////////////////////////////////

      var findLobby = function(callback) {
        var lobbyId = allUsers[userId].gameId;
        for(var i = 0; i < visibleLobbies.length; i++){
          if(lobbyId === visibleLobbies[i].gameId) {
            if(visibleLobbies[i].userIds.indexOf(userId) > -1){
              // They are in this lobby!
              callback(visibleLobbies[i], i);
              break;
            }
            visibleLobbies[i].userIds.push(userId);
            visibleLobbies[i].users.push(allUsers[userId].name);
            callback(visibleLobbies[i], i);
          }
        }
      }

      // Shared code between startSingleTeamGame and
      // startMultipleTeamGame
      var startGame = function(gameModelCommand) {
        findLobby(function(foundLobby) {
          allLobbiesHash[foundLobby.gameId] = foundLobby;
          var newGameModel = new PubGameModel();
          foundLobby.gameModel = newGameModel;
          //Updates everyone's lobby data
          io.emit('newData', {lobbies:visibleLobbies});        
          
          //Removes this game from visibleLobbies (different from closing!)
          // note: i hope uncommenting this didnt break anything else.
          // on 2/13/2016 i removed it because i took the findLobby cb out of
          // the answer function 
          var lobbyIndex = visibleLobbies.indexOf(foundLobby);
          if(lobbyIndex > -1) visibleLobbies.splice(lobbyIndex, 1);
      
          newGameModel[gameModelCommand]( foundLobby, 
                                          function(id, newData) {
            allUsers[id].socket.emit('newData', newData);
          });
	});
      }	

      //////////////////////////////////////////
      /// Lobby actions
      //////////////////////////////////////////

      userSocket.on('newGameLobby', function() {
        var newGameLobby = {
          users: [allUsers[userId].name],
          userIds: [userId],
          gameId: Math.floor(Math.random()*1000000000000000000),
          gameModel: null,
          closed: false
        }
        visibleLobbies.push(newGameLobby);
        allUsers[userId].gameId = newGameLobby.gameId;
        io.emit('newData', {lobbies:visibleLobbies});
        //Puts new lobby creator in their new lobby
        userSocket.emit('newData', {
          lobbies: visibleLobbies,
          lobbyDisplay: true,
          lobbyListDisplay: false
        });
      });

      userSocket.on('joinGameLobby', function(lobby) {
        allUsers[userId].gameId = lobby.gameId;
        findLobby(function(foundLobby){
          //Updates everyone's lobby data
          io.emit('newData', {lobbies:visibleLobbies});
          //Puts lobby joiner in their new lobby
          userSocket.emit('newData', {
            lobbies:visibleLobbies,
            lobbyDisplay: true,
            lobbyListDisplay: false
          });
        });
      });

      userSocket.on('leaveGameLobby', function() {
        findLobby(function(foundLobby) {
          var thisUserIndex = foundLobby.userIds.indexOf(userId);
          foundLobbyusers.splice(thisUserIndex, 1);
          foundLobbyuserIds.splice(thisUserIndex, 1);
          //Updates everyone's lobby data
          io.emit('newData', {lobbies:visibleLobbies});
          //Puts lobby leaver back in the lobby list
          userSocket.emit('newData', {
            lobbies:visibleLobbies,
            lobbyDisplay: false,
            lobbyListDisplay: true
          });
        });
      });

      userSocket.on('removeGameLobby', function() {
        findLobby(function(foundLobby, foundLobbyIndex) {
          _.each(foundLobby.userIds, function(foundLobbyUserId) {
            allUsers[userId].gameId = null;
          });
          visibleLobbies.splice(foundLobbyIndex, 1);
          //Updates everyone's lobby data
          io.emit('newData', {lobbies:visibleLobbies});
          //Puts lobby leaver back in the lobby list
          userSocket.emit('newData', {
            lobbies:visibleLobbies,
            lobbyDisplay: false,
            lobbyListDisplay: true
          });
        });
      });


      userSocket.on('closeGameLobby', function() {
        findLobby(function(foundLobby) {
          foundLobby.closed = true;
          //Updates everyone's lobby data
          io.emit('newData', {lobbies:visibleLobbies});
        });
      });

      userSocket.on('openGameLobby', function() {
        findLobby(function(foundLobby) {
          foundLobby.closed = false;
          //Updates everyone's lobby data
          io.emit('newData', {lobbies:visibleLobbies});
        });
      });

      userSocket.on('startSingleTeamGame', function() {
	startGame('startSingleTeamGame');
      });

      userSocket.on('startMultipleTeamGame', function() {
	startGame('startMultipleTeamGame');
      });

      //////////////////////////////////////////
      /// Single player game setup 
      //////////////////////////////////////////

      userSocket.on('startSinglePlayerGame', function() {
        var newGameLobby = {
          users: [allUsers[userId].name],
          userIds: [userId],
          gameId: Math.floor(Math.random()*1000000000000000000),
          gameModel: null,
          closed: true
        }
        visibleLobbies.push(newGameLobby);
        allUsers[userId].gameId = newGameLobby.gameId;
        var newGameModel = new PubGameModel();
        newGameLobby.gameModel = newGameModel;
        allLobbiesHash[newGameLobby.gameId] = newGameLobby;
        newGameModel.startSinglePlayerGame( newGameLobby, 
                                            function(id, newData) {
          allUsers[id].socket.emit('newData', newData);
        });
      });

      //////////////////////////////////////////
      /// In game actions
      //////////////////////////////////////////

      userSocket.on('answer', function(correct) {
        // note: removed this too
        //findLobby(function(foundLobby) {   
          var relevantGame = allLobbiesHash[allUsers[userId].gameId];
          relevantGame.gameModel.registerAnswer(
          relevantGame, userId, correct.correct, function(id, newData) {
            allUsers[id].socket.emit('newData', newData);
        //  });
        })
      });

      userSocket.on('gameEnd', function(data) {
        var relevantGame = allLobbiesHash[allUsers[userId].gameId];

        //eventually, only emit to people in this room
        relevantGame.endGame(function(winnerData){
        });
      });

    });
  }
};

var counter = 0;
var animals = ["Pig","Giraffe","Monkey","Cow","Hippo","Squirrel",
               "Rat","Bat","Weasel","Wolverine","Turtle","Lion"];
