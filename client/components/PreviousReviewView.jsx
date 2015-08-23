var React = require('react');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      review: null,
      reviewer: null,
      correctTitle: null,
      answerStatus: null
    }
  },
  renderCorrectness: function(correct) {
    if(correct) return "Correct!";
    else return "Incorrect!";
  },
  render: function(renderType) {
    if(this.props.answerStatus) {
      return (
        <div className="wrong">
          <h3>
            {this.renderCorrectness(this.props.answerStatus === "right")}
          </h3>
          <br/>
          <h3>
            The correct answer was <b>{this.props.correctTitle}</b>!
          </h3>
          <h3>{this.props.review}</h3>
          <cite>{this.props.reviewer}</cite>
        </div>
      )
    }
    return (<div></div>);
  },
});
