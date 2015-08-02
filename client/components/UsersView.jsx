var React = require('react');

module.exports = React.createClass({
  render: function() {
    return (
      <div className="no-padding">
        <span className="top-block">
          <h1>Tomato Tosser</h1>
          {this.renderUsersBox()}
        </span>
        <span className="top-block tomato">
          
        </span>
      </div>
    )
  },
  renderTeamName: function() {
  	return this.props.onHostTeam ? (<b>Alpha team</b>) : (<b>Bravo team</b>);
  },
  renderUsersBox: function() {
    if(this.props.singlePlayerGame) return (<span></span>);
    if(this.props.singleTeamGame || !this.props.gameStart) {
      return (
        <div className="top-block">
          You are: <b>{this.props.username}</b>
        </div>
      )
    } 
    return (
      <div className="top-block">
        You are: <b>{this.props.username}</b>
        <br/>
        Your team is: {this.renderTeamName()}
      </div>
    )
  }
});

  // <img src="http://icons.iconarchive.com/icons/robinweatherall/veggers/128/Tomato-icon.png"></img>
