var React = require('react');
var clientSocket = require('../ClientSocketManager.js');
var UsersView = require('./UsersView.jsx');

module.exports = React.createClass({
  render: function() {
    return (
      <div id="lobby-view">
        <UsersView username={this.props.username} 
           gameStart={this.props.gameStart}
           singleTeamGame={this.props.singleTeamGame}
           onHostTeam={this.props.onHostTeam} />
        <div>
          {this.renderUsersIfTheyExist()}
        </div>
        <div id="lobby-buttons">
          {this.renderSingleTeamButton()}
          {this.renderMultipleTeamButton()}
        </div>
        <button onClick={this.openGameLobby}>
          Open lobby
        </button>
        <div>
          <button onClick={this.removeGameLobby}>
            Remove this lobby
          </button>
        </div>
        <div>
          <button onClick={this.props.leaveLobby}>
            Go back
          </button>
        </div>
      </div>
    )
  },
  renderUsersIfTheyExist: function() {
    if(!this.props || !this.props.lobby) {
      return (<div></div>)
    } else {
      return(this.props.lobby.users.map(function(user, index){
          return(<div>Player {index+1}: {user}</div>)
      }))
    }
  },
  renderSingleTeamButton: function() {
    if (this.props.lobby.users.length > 1) {
      return(
        <button onClick={this.startSingleTeamGame}>
         Start cooperative game!
        </button>
      ) 
    } else {
      return(
        <button className="disabled">
         Start cooperative game!
        </button>
      )
    }
  },
  renderMultipleTeamButton: function() {
    if(this.props.lobby.users.length > 3 && 
        this.props.lobby.users.length%2 === 0) {
      return (
        <button onClick={this.startMultipleTeamGame}>
          Start team game!
        </button>
      )
    } else {
      return (
        <button className="disabled">
          Start team game!
        </button>
      )
    }
  },
  startSingleTeamGame: function() {
    clientSocket.startSingleTeamGame();
  },
  startMultipleTeamGame: function() {
    clientSocket.startMultipleTeamGame();
  },
  openGameLobby: function() {
    clientSocket.openGameLobby();
  },
  closeGameLobby: function() {
    clientSocket.closeGameLobby();
  },
  removeGameLobby: function() {
    clientSocket.removeGameLobby();
  }
});
