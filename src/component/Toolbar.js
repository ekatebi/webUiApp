import React, { Component, PropTypes } from 'react';

class Toolbar extends Component {

  static propTypes = {
    onFirst: PropTypes.func.isRequired,
    onSecond: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
  };

  render() {

    const { text, onFirst, onSecond } = this.props; 

    return (
      <div className="toolbar">
        <a href="#" onClick={
            (evt) => {
              evt.preventDefault();
              onFirst();
              onSecond();
            }
        }>{ text }</a>
      </div>
    );
  }
}

export default Toolbar;
