var React = require('react');

module.exports = React.createClass({
  render: function() {
    return (
      <div className="no-padding">
        <div id="title-wood-frame" className="wood-frame wood">
          <h1>Tomato Tosser</h1>
        </div>
        {this.renderUsersBox()}
      </div>
    )
  },
  renderTeamName: function() {
  	return this.props.onHostTeam ? (<b>Alpha team</b>) : (<b>Bravo team</b>);
  },
  renderUsersBox: function() {
    if(this.props.singleTeamGame || !this.props.gameStart) {
      return (
        <div id="users-box" className="wood-frame light-wood">
          You are: <b>{this.props.username}</b>
        </div>
      )
    } else {
      return (
        <div id="users-box" className="wood-frame light-wood">
          You are: <b>{this.props.username}</b>
          <br/>
          Your team is: {this.renderTeamName()}
        </div>
      )
    }
  }
});
