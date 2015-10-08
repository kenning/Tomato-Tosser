var React = require('react');

var TitleView = require('./TitleView.jsx');
var ReviewView = require('./ReviewView.jsx');

var socketInterface = require('../ClientSocketManager.js');

module.exports = React.createClass({
  render: function(renderType) {
    var that = this;
    console.log(this.props.titles);
    console.log(this.props.correctTitle);
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
      </div>
    )
  },
  answerRight: function() {
    console.log('answered right!');
    socketInterface.answer(true);
  },
  answerWrong: function() {
    console.log('answered wrong!');
    socketInterface.answer(false);
  },
});
