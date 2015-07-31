var React = require('react');
var AnswerEntryView = require('./AnswerEntryView.jsx');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      answerStatus: null
    }
  },
  answerRerender: function(answeredCorrect) {
    if(answeredCorrect) {
      this.setState({
          answerStatus: "right"
        }
      );
    } else {
      this.setState({
          answerStatus: "wrong"
        }
      );
    } 
    var that = this;
    setTimeout(function() {
      that.setState({answerStatus: null});
    }, 1000);
    this.render();
  },
  renderTeamClass: function() {
    if(this.props.singleTeamGame) {
      return "";
    } else {
      if(this.props.onHostTeam) return "alpha";
      else return "bravo";
    }
  },
  render: function(renderType) {
    if(this.state.answerStatus === "wrong" ) {
      return (
        <div className="wrong">
          <br/>
          <h2>WRONG</h2>
          <br/>
        </div>
      )
    } else if(this.state.answerStatus === "right" ) {
      return (
        <div className="right">
          <br/>
          <h2>RIGHT</h2>
          <br/>
        </div>
      )
    } else {
      var correctIndex = this.props.correctIndex;
      var answerRerender = this.answerRerender;
      var questionId = this.props.questionId;
      return (
        <div id="question-view" className={this.renderTeamClass() + " wood-frame light-wood"}>
          <h2>
            {this.props.question}
          </h2>
          <div>
            {this.props.answers.map(function(entry, index) {
              return (
                <AnswerEntryView answer={entry} 
                                 index={index} 
                                 correct={index===correctIndex}
                                 answerHandler={answerRerender}
                                 questionId={questionId} /> 
              )}    
            )}
          </div>
        </div>
      )
    }
  }
});