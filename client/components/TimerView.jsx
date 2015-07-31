var React = require('react');

module.exports = React.createClass({
  getInitialState: function() {
    setInterval(this.refreshTime, 250);
    return {
      yourSecondsLeft : 0,
      yourScore : 0,
      enemySecondsLeft : 0,
      enemyScore : 0,
      time: {
        hostTeamExtraTime: 30,
        notHostTeamExtraTime: 30
      }
    };
  },
  refreshTime: function() {
    if(this.props.gameHasEnded) return;
    var now = new Date();
    if(this.props.singleTeamGame) {    
      this.setState({
        yourSecondsLeft : Math.floor(((this.props.gameStart - now.getTime())/1000) + this.props.time.hostTeamExtraTime),
        enemySecondsLeft : 0,
        yourScore: this.props.scores.hostTeamScore,
        enemyScore: this.props.scores.notHostTeamScore
      })
      if(this.state.yourSecondsLeft < 1) {
        this.props.endGame();
      }
    } else {
      if(this.props.onHostTeam) {
        this.setState({
          yourSecondsLeft : Math.floor(((this.props.gameStart - now.getTime())/1000) + this.props.time.hostTeamExtraTime),
          enemySecondsLeft : Math.floor(((this.props.gameStart - now.getTime())/1000) + this.props.time.notHostTeamExtraTime),
          yourScore: this.props.scores.hostTeamScore,
          enemyScore: this.props.scores.notHostTeamScore
        });
      } else {
        this.setState({
          yourSecondsLeft : Math.floor(((this.props.gameStart - now.getTime())/1000) + this.props.time.notHostTeamExtraTime),
          enemySecondsLeft : Math.floor(((this.props.gameStart - now.getTime())/1000) + this.props.time.hostTeamExtraTime),
          yourScore: this.props.scores.notHostTeamScore,
          enemyScore: this.props.scores.hostTeamScore
        });
      }
      if(this.state.yourSecondsLeft < 1 || this.state.enemySecondsLeft < 1) {
        this.props.endGame();
      }
    }
  },
  render: function() {
    if(this.props.singleTeamGame) {
      return (
        <div className="timer-view">
          <div className={this.renderWarnings() + " timer-view-quarter"}>
            <div>
              Your time: {this.state.yourSecondsLeft}
            </div>
          </div> 
          <div className={this.renderTeam() + " timer-view-quarter"}>
            <div>
              Your team score: {this.state.yourScore}   
            </div>
          </div> 
        </div>
      )
    } else {
      return (
        <div className="timer-view">
          <div className={this.renderWarnings() + " timer-view-quarter"}>
            <div>
              Your time: {this.state.yourSecondsLeft}
            </div>
          </div> 
          <div className={this.renderTeam() + " timer-view-quarter"}>
            <div>
              Your team score: {this.state.yourScore}   
            </div>
          </div> 
          <div className={this.renderWarnings(true) + " timer-view-quarter"}>
            <div>
              Their time: {this.state.enemySecondsLeft}  
            </div>
          </div> 
          <div className={this.renderTeam(true) + " timer-view-quarter"}>
            <div>
              Their team score: {this.state.enemyScore}
            </div>
          </div>
        </div>
      )
    }
  },
  renderTeam: function(renderEnemyTeamColor) {
    if(this.props.singleTeamGame) {
      return "timer-normal";
    } else if(this.props.onHostTeam) {
      if(renderEnemyTeamColor) {
        return "timer-bravo";
      } else {
        return "timer-alpha";
      }
    } else {
      if(renderEnemyTeamColor) {
        return "timer-alpha";
      } else {
        return "timer-bravo";
      }
    }
  },
  renderWarnings: function(notOnHostTeam) {
    var relevantSecondsLeft = 
      (notOnHostTeam) ? this.state.enemySecondsLeft : this.state.yourSecondsLeft;
    if(relevantSecondsLeft < 6) {
      return "timer-danger";
    } else if (relevantSecondsLeft < 11) {
      return "timer-warning";
    } else {
      return "timer-normal";
    }
  }
});
