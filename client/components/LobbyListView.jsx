var React = require('react');

var clientSocket = require('../ClientSocketManager.js');
var UsersView = require('./UsersView.jsx');

module.exports = React.createClass({
  render: function() {
    var that = this;
    return (
      <div>
        <UsersView username={this.props.username} 
                   gameStart={this.props.gameStart}
                   singleTeamGame={this.props.singleTeamGame}
                   onHostTeam={this.props.onHostTeam} />
        <br/>
        <div>
          <button onClick={this.startSinglePlayerGame}>
            Play now!
          </button>
        </div>
        {this.props.lobbies.map(function(item){
          if(item.closed) return (<span></span>);
          else return (
            <LobbyEntryView lobby={item} />
          )
        })}
        <button className="button light-wood" onClick={this.makeNewGameLobby}>
          Make new lobby
        </button>
      </div>
    )
  },
  makeNewGameLobby: function() {
    clientSocket.newGameLobby();
  },
  startSinglePlayerGame: function() {
    clientSocket.startSinglePlayerGame();
  },
});



var LobbyEntryView = React.createClass({
  getInitialState: function() {
    return {
      clickHandlersCanRun: false,
      parsedNames: ""
    }
  },
  componentDidMount: function(){
    this.setState({clickHandlersCanRun:true});
  },
  parseNames: function(){
    console.log(this.props);
    if(!this.props.lobby) return "";
    if(this.props.lobby === "Loading!") return "";

    var parsedNames = "";
    for(var i = 0; i < this.props.lobby.users.length; i++){
      parsedNames+= this.props.lobby.users[i];
      if(i !== this.props.lobby.users.length-1){
        parsedNames+= ", ";
      } 
    }
    return parsedNames;
  },
  render: function() {
    return (
      <div>
        <button className='lobby-entry-view' onClick={this.clickHandler}>
          <div>Lobby: {this.props.lobby.gameId}</div>
          <div>Users in this lobby: {this.parseNames()}</div>
        </button>
      </div>
    )
  },

  clickHandler: function() {
    if(!this.state.clickHandlersCanRun) return;
    socketInterface.joinGameLobby(this.props.lobby);
  }
});
