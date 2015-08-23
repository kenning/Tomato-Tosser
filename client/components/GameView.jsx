var React = require('react');

var TitleView = require('./TitleView.jsx');
var ReviewView = require('./ReviewView.jsx');
var PreviousReviewView = require('./PreviousReviewView.jsx');

var socketInterface = require('../ClientSocketManager.js');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      answerStatus: null
    }
  },
  render: function(renderType) {
    var that = this;
    return (
      <div>
        <ReviewView review={this.props.review}
                    reviewer={this.props.reviewer} />
        <ul className="small-block-grid-2">
          {this.props.titles.map(function(title, index) {
            if(title === that.props.correctTitle) {
              return (
                <TitleView title={title}
                           registerAnswer={that.answerRight} />
              )
            } else {
              return (
                <TitleView title={title}
                           registerAnswer={that.answerWrong} />
              )
            }
          })}
        </ul>
        <PreviousReviewView answerStatus={this.state.answerStatus}
                            review={this.props.previousReview}
                            reviewer={this.props.previousReviewer}
                            correctTitle={this.props.previousCorrectTitle} />
      </div>
    )
  },
  answerRight: function() {
    console.log('answered right!');
    socketInterface.answer({correct:true});
    this.answerRerender(true);
  },
  answerWrong: function() {
    console.log('answered wrong!');
    socketInterface.answer({correct:false});
    this.answerRerender(false);
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
    }, 4000);
    this.render();
  },
});
