var React = require('react');

var LobbyView = require('./LobbyView.jsx');
var LobbyListView = require('./LobbyListView.jsx');
var UsersView = require('./UsersView.jsx');
var TitleView = require('./TitleView.jsx');
var TimerView = require('./TimerView.jsx');
var ReviewView = require('./ReviewView.jsx');
var GameView = require('./GameView.jsx');
var PreviousReviewView = require('./PreviousReviewView.jsx');

var socketInterface = require('../ClientSocketManager.js');

module.exports = React.createClass({
  getInitialState: function() {
    return  {
      username: "",
      timeData : {},
      scoreData: {},
      gameStart : null,
      lobbies: [],
      lobbyDisplay: false,
      lobbyListDisplay: true,
      singleTeamGame: false,
      singlePlayerGame: false,
      onHostTeam: true,
      gameHasEnded: false,
      answeringTeamIsHost: null,
      answeringTeamIsCorrect: null,
      review: "",
      titles: [],
      correctIndex: null,
      latestUpdateIncrementer: 0
    }
  },
  componentDidMount : function() {
    socketInterface.addNewDataListener(this.updateData);
  },
  updateData: function(data) {
    console.log(data);
    var incrementer = ++this.state.latestUpdateIncrementer;
    var that = this;
    setTimeout(function() {
      if(incrementer && that.state.latestUpdateIncrementer === incrementer) {      
        that.setState({
          answeringTeamIsHost: null,
          answeringTeamIsCorrect: null
        });
      }
    }, 4000);
    this.setState(data);
  },
  displayLobbyList: function(){
    this.setState({
      lobbyListDisplay: true,
      lobbyDisplay: false
    });
  },
  endGame: function() {
    this.setState({gameHasEnded: true});
  },
  teamClass: function() {
    if(this.state.singleTeamGame || this.state.singlePlayerGame) return '';
    if(this.state.onHostTeam) return 'alpha';
    return 'bravo';
  },
  render: function() {
    if (this.state.lobbyListDisplay) {
    //User is in the lobby list view
      return (<LobbyListView lobbies={this.state.lobbies} 
         currentLobby={this.state.currentLobby}
         gameStart={this.state.gameStart}
         singleTeamGame={this.state.singleTeamGame}
         onHostTeam={this.state.onHostTeam}
         username={this.state.username} />)
    } else if (this.state.lobbyDisplay) {
    //User is in the lobby display view
      var yourLobby = null;
      for(var i = 0; i < this.state.lobbies.length; i++) {
        if(!this.state.lobbies[i].userIds) continue;
        if(this.state.lobbies[i].users.indexOf(this.state.username) > -1){
          yourLobby = this.state.lobbies[i];
          break;
        }
      }
      return (<LobbyView lobby={yourLobby} 
         username={this.state.username}
         gameStart={this.state.gameStart}
         singleTeamGame={this.state.singleTeamGame}
         onHostTeam={this.state.onHostTeam}
         displayLobbyList={this.displayLobbyList} />)
    } else {
    //User is in the game view
      if (this.state.gameHasEnded) {
        if(this.state.singleTeamGame) {
          return (
            <div>
              Game over! <br/>
              Your score: {this.state.scoreData.hostTeamScore}
            </div>
          )
        } else {
          if(this.state.onHostTeam) {
            return (
              <div>
                Game over! <br/>
                Your score: {this.state.scoreData.hostTeamScore}<br/>
                Their score: {this.state.scoreData.notHostTeamScore}
              </div>
            )
          } else {
            return (
              <div>
                Game over! <br/>
                Your score: {this.state.scoreData.notHostTeamScore}
                Their score: {this.state.scoreData.hostTeamScore}
              </div>
            )
          }
        }
      } else {
        return (
          <div>
            <UsersView username={this.state.username} 
              gameStart={this.state.gameStart}
              singleTeamGame={this.state.singleTeamGame}
              singlePlayerGame={this.state.singlePlayerGame}
              teamClass={this.teamClass()}
              onHostTeam={this.state.onHostTeam} />
            <TimerView time={this.state.timeData} 
              gameStart={this.state.gameStart} 
              scores={this.state.scoreData} 
              singleTeamGame={this.state.singleTeamGame}
              endGame={this.endGame}
              onHostTeam={this.state.onHostTeam} />
            <GameView review={this.state.review}
              reviewer={this.state.reviewer} 
              correctTitle={this.state.correctTitle}
              titles={this.state.titles}  />
            <PreviousReviewView previousReview={this.state.previousReview}
              previousReviewer={this.state.previousReviewer}
              previousCorrectTitle={this.state.previousCorrectTitle}
              onHostTeam={this.state.onHostTeam}
              answeringTeamIsHost={this.state.answeringTeamIsHost}
              answeringTeamIsCorrect={this.state.answeringTeamIsCorrect}
              singleTeamGame={this.state.singleTeamGame}
              singlePlayerGame={this.state.singlePlayerGame} />
          </div>
        )
      } 
    }
  }
});
