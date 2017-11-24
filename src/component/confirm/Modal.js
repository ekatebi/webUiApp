/* eslint react/prop-types: 0 no-console: 0 */

import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { Button, Overlay, Label, Grid, Row, Col } from 'react-bootstrap';

class Modal extends Component {

  static propTypes = {
//    children: PropTypes.element
  };

  static defaultProps = {
  };

  constructor(props) {
    super(props);
    this.displayName = 'Modal';
    this.backdrop = this.backdrop.bind(this);
  }

  backdrop() {
    return (<div className="modal-backdrop in" />);
  }

  modal() {
    const style = { display: 'block' };
    return (
      <div
        className="modal in"
        tabIndex="-1"
        role="dialog"
        aria-hidden="false"
        ref="modal"
        style={style}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.backdrop()}
        {this.modal()}
      </div>
    );
  }
}

export default Modal;
