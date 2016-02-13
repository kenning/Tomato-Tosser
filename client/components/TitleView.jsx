var React = require('react');

var socketInterface = require('../ClientSocketManager.js');

module.exports = React.createClass({
  render: function() {
    return (
      <li>
        <button className="hvr-rectangle-in title-button" 
                onClick={this.props.registerAnswer}>
          <h3>
            {this.props.title}
          </h3>
        </button>
      </li>
    )
  }
});


