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
          {this.renderButtons()}
        </div>
        <div>
          <button className="button light-wood" onClick={this.removeGameLobby}>
            Remove this lobby
          </button>
        </div>
        <div>
          <button className="button light-wood" onClick={this.props.displayLobbyList}>
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
  renderButtons: function() {
    if(!this.props || !this.props.lobby) {
      return (<div></div>)
    } else if(this.props.lobby.closed) {
      if(this.props.lobby.users.length > 3 && this.props.lobby.users.length%2 === 0) {
        return(
          <div className="no-padding">
            <button className="button light-wood" onClick={this.startSingleTeamGame}>
             Start cooperative game!
            </button>
            <br/>
            <button className="button light-wood" onClick={this.startMultipleTeamGame}>
             Start team game!
            </button>
            <br/>
            <button className="button light-wood" onClick={this.openGameLobby}>
              Open lobby
            </button>
          </div>
        )
      } else if(this.props.lobby.users.length > 1) {      
        return(
          <div className="no-padding">
            <button className="button light-wood" onClick={this.startSingleTeamGame}>
             Start cooperative game!
            </button>
            <br/>
            <button className="button light-wood" onClick={this.openGameLobby}>
              Open lobby
            </button>
          </div>
          )
      }
    } else {
      return(
        <div className="no-padding"> 
          <button className="button light-wood" onClick={this.closeGameLobby}>
            Close lobby
          </button>
        </div>
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
