var React = require('react');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      review: null,
      reviewer: null,
      correctTitle: null
    }
  },
  renderCorrectness: function() {
    var returnString = '';
    if(this.props.singlePlayerGame) {
      if(this.props.answeringTeamIsCorrect) {
        returnString += "You answered correctly! + 5 seconds!";
      } else {
        returnString += "You answered incorrectly! - 5 seconds!";
      }
    } else {
      if(this.props.onHostTeam === this.props.answeringTeamIsHost) {
        returnString += "Your team answered ";
      } else {
        returnString += "The other team answered ";
      }
      if(this.props.answeringTeamIsCorrect) {
        returnString += "correctly! + 5 seconds!";
      } else {
        returnString += "incorrectly! - 5 seconds!";
      }
    }
    return returnString;
  },
  render: function(renderType) {
    if(this.props.answeringTeamIsHost !== null) {
      return (
        <div className="wrong">
          <h3>
            {this.renderCorrectness()}
          </h3>
          <br/>
          <h3>
            The correct answer was <b>{this.props.previousCorrectTitle}</b>!
          </h3>
          <h4 className="italic">
            <blockquote>
              {this.props.previousReview}
            </blockquote>
            <cite>{this.props.previousReviewer}</cite>
          </h4>
        </div>
      )
    }
    return (<div></div>);
  },
});
