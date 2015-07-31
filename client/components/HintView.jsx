var React = require('react');

module.exports = React.createClass({
  render: function() {
    return (
      <div className="hint-view no-padding">
        <div className="wood-frame light-wood full">
          This hint is for: <b>{this.props.hintUser}</b>
          <h2>
          	{this.props.hint}
          </h2>
        </div>
      </div>
    )
  }
});
