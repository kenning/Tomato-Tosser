var React = require('react');

var TitleView = require('./TitleView.jsx');
var ReviewView = require('./ReviewView.jsx');

var socketInterface = require('../ClientSocketManager.js');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      answerStatus: null
    }
  },
  renderCorrectness: function(correct) {
    if(correct) return "Correct!";
    else return "Incorrect!";
  },
  render: function(renderType) {
    if(this.state.answerStatus) {
      console.log(this.props.titles);
      console.log(this.props.correctIndex);
      return (
        <div className="wrong">
          <br/>
          <h3>
            {this.renderCorrectness(this.state.answerStatus === "right")}
          </h3>
          <br/>
          <h3>
            The correct answer was <b>{this.props.titles[this.props.correctIndex-1]}</b>!
          </h3>
          <a href={this.props.url}>
            See all {this.props.titles[this.props.correctIndex-1]} reviews at 
            Rotten Tomatoes®!
          </a>
        </div>
      )
    // } else if(this.state.answerStatus === "right" ) {
    //   return (
    //     <div className="right">
    //       <br/>
    //       <h3>Correct!</h3>
    //       <br/>
    //       <a href={this.props.url}>
    //         See all {this.props.titles[this.props.correctIndex]} reviews at 
    //         Rotten Tomatoes®!
    //       </a>
    //     </div>
    //   )
    } else {
      var that = this;
      return (
        <div>
          <ReviewView review={this.props.review}
                      reviewer={this.props.reviewer} />
          <ul className="small-block-grid-2">
            {this.props.titles.map(function(title, index) {
              if(index === that.props.correctIndex-1) {
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
        </div>
      )
    }
  },
  answerRight: function() {
    console.log('answered right!');
    this.answerRerender(true);
  },
  answerWrong: function() {
    console.log('answered wrong!');
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
    }, 100000);
    this.render();
  },
});
