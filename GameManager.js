var db = require('./db/DatabaseManager.js');
var PubGameModel = require('./GameModel.js');
var _ = require('underscore');

//Setup for: only one game at a time
var allUsers = {};
var allGames = {};
var allLobbyGames = [];

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
      
      io.emit('newData', { lobbies:allLobbyGames });

      userSocket.emit('newData', { username: allUsers[userId].name });

      //////////////////////////////////////////
      /// Lobby actions
      //////////////////////////////////////////

      var findLobby = function(callback) {
        var lobbyId = allUsers[userId].gameId;
        for(var i = 0; i < allLobbyGames.length; i++){
          if(lobbyId === allLobbyGames[i].gameId) {
            if(allLobbyGames[i].userIds.indexOf(userId) > -1){
              // They are in this lobby!
              callback(allLobbyGames[i], i);
              break;
            }
            allLobbyGames[i].userIds.push(userId);
            allLobbyGames[i].users.push(allUsers[userId].name);
            callback(allLobbyGames[i], i);
          }
        }
      }

      userSocket.on('newGameLobby', function() {
        console.log('newGameLobby');
        var newGameLobby = {
          users: [allUsers[userId].name],
          userIds: [userId],
          gameId: Math.floor(Math.random()*1000000000000000000),
          gameModel: null,
          closed: false
        }
        allLobbyGames.push(newGameLobby);
        allUsers[userId].gameId = newGameLobby.gameId;
        //Emits new lobby data to everyone
        io.emit('newData', {lobbies:allLobbyGames});
        //Puts new lobby creator in their new lobby
        userSocket.emit('newData', {
          lobbies: allLobbyGames,
          lobbyDisplay: true,
          lobbyListDisplay: false
        });
      });

      userSocket.on('joinGameLobby', function(lobby) {
        allUsers[userId].gameId = lobby.gameId;
        findLobby(function(foundLobby){
          //Updates everyone's lobby data
          io.emit('newData', {lobbies:allLobbyGames});
          //Puts lobby joiner in their new lobby
          userSocket.emit('newData', {
            lobbies:allLobbyGames,
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
          io.emit('newData', {lobbies:allLobbyGames});
          //Puts lobby leaver back in the lobby list
          userSocket.emit('newData', {
            lobbies:allLobbyGames,
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
          allLobbyGames.splice(foundLobbyIndex, 1);
          //Updates everyone's lobby data
          io.emit('newData', {lobbies:allLobbyGames});
          //Puts lobby leaver back in the lobby list
          userSocket.emit('newData', {
            lobbies:allLobbyGames,
            lobbyDisplay: false,
            lobbyListDisplay: true
          });
        });
      });


      userSocket.on('closeGameLobby', function() {
        findLobby(function(foundLobby) {
          foundLobby.closed = true;
          //Updates everyone's lobby data
          io.emit('newData', {lobbies:allLobbyGames});
        });
      });

      userSocket.on('openGameLobby', function() {
        findLobby(function(foundLobby) {
          foundLobby.closed = false;
          //Updates everyone's lobby data
          io.emit('newData', {lobbies:allLobbyGames});
        });
      });

      userSocket.on('startSinglePlayerGame', function() {
        console.log('startSinglePlayerGame');
        var newGameLobby = {
          users: [allUsers[userId].name],
          userIds: [userId],
          gameId: Math.floor(Math.random()*1000000000000000000),
          gameModel: null,
          closed: true
        }
        allLobbyGames.push(newGameLobby);
        allUsers[userId].gameId = newGameLobby.gameId;
        var newGameModel = new PubGameModel();
        newGameLobby.gameModel = newGameModel;
        newGameModel.startSinglePlayerGame(newGameLobby, function(id, newData) {
          // newData.lobbyDisplay = false;
          // newData.lobbyListDisplay = false;
          allUsers[id].socket.emit('newData', newData);
        });
      });

      userSocket.on('startSingleTeamGame', function() {
        findLobby(function(foundLobby) {
          allGames[foundLobby.gameId] = foundLobby;
          var newGameModel = new PubGameModel();
          foundLobby.gameModel = newGameModel;
          //Updates everyone's lobby data
          io.emit('newData', {lobbies:allLobbyGames});        
          //Removes this game from the lobby list (different from closing!)
          var lobbyIndex = allLobbyGames.indexOf(foundLobby);
          // if(lobbyIndex > -1) allLobbyGames.splice(lobbyIndex, 1);
          newGameModel.startSingleTeamGame(foundLobby, function(id, newData) {
            allUsers[id].socket.emit('newData', newData);
          });
        });
      });

      userSocket.on('startMultipleTeamGame', function() {
        findLobby(function(foundLobby) {
          allGames[foundLobby.gameId] = foundLobby;
          var newGameModel = new PubGameModel();
          foundLobby.gameModel = newGameModel;
          //Updates everyone's lobby data
          io.emit('newData', {lobbies:allLobbyGames});        
          //Removes this game from the lobby list (different from closing!)
          var lobbyIndex = allLobbyGames.indexOf(foundLobby);
          // if(lobbyIndex > -1) allLobbyGames.splice(lobbyIndex, 1);
          newGameModel.startMultipleTeamGame(foundLobby, function(id, newData) {
            allUsers[id].socket.emit('newData', newData);
          });
        });
      });

      //////////////////////////////////////////
      /// In game actions
      //////////////////////////////////////////

      userSocket.on('answer', function(correct) {
        findLobby(function(foundLobby) {   
          var relevantGame = allGames[allUsers[userId].gameId];
          relevantGame.gameModel.registerAnswer(
            foundLobby, userId, correct.correct, function(id, newData) {
              allUsers[id].socket.emit('newData', newData);
            }
          );
        })
      });

      userSocket.on('gameEnd', function(data) {
        var relevantGame = allGames[allUsers[userId].gameId];

        //eventually, only emit to people in this room
        relevantGame.endGame(function(winnerData){
        });
      });

      //////////////////////////////////////////

    });
  }
};

var counter = 0;
var animals = ["Pig","Giraffe","Monkey","Cow","Hippo","Squirrel",
               "Rat","Bat","Weasel","Wolverine","Turtle","Lion"];