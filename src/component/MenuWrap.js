import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
// import BurgerMenu from 'react-burger-menu';
import classNames from 'classnames';

export default class MenuWrap extends Component {

  static propTypes = {
//    hidden: PropTypes.bool.isRequired,
    children: PropTypes.object.isRequired,
    wait: PropTypes.number.isRequired,
    side: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = { hidden: false };
  }

  componentWillReceiveProps(nextProps) {
    const sideChanged = this.props.children.props.right !== nextProps.children.props.right;

    if (sideChanged) {
      this.setState({ hidden: true });

      setTimeout(() => {
        this.show();
      }, this.props.wait);
    }
  }

  show() {
    this.setState({ hidden: false });
  }

  render() {
    let style;

    if (this.state.hidden) {
      style = { display: 'none' };
    }

    return (
      <div style={ style } className={ this.props.side }>
        { this.props.children }
      </div>
    );
  }
}
