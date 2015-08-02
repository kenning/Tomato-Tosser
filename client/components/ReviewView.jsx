var React = require('react');

module.exports = React.createClass({
  render: function() {
    return (
      <h2>
        <blockquote>
        {this.props.review}
        <cite>{this.props.reviewer}</cite>
        </blockquote>
      </h2>
    )
  }
});
