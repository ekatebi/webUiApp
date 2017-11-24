import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { Button, Overlay, Label, Grid, Row, Col } from 'react-bootstrap';
import Modal from './Modal';

class Confirm extends Component {
  static propTypes = {
    // abortLabel is optional. If it is not supplied, only show the confirm button.
    abortLabel: PropTypes.string,
    confirmLabel: PropTypes.string.isRequired,
    description: PropTypes.string,
    message: PropTypes.string,
    resolve: PropTypes.func.isRequired,
    reject: PropTypes.func.isRequired
  };

  static defaultProps = {
    confirmLabel: 'OK',
//    abortLabel: 'Cancel',
    description: undefined,
    message: undefined
  };

  constructor(props) {
    super(props);
    this.displayName = 'Confirm';
    this.abort = this.abort.bind(this);
    this.confirm = this.confirm.bind(this);
  }

  componentDidMount() {
    return findDOMNode(this.refs.confirm).focus();
  }

  abort() {
    const { reject } = this.props; 
    reject();
  }

  confirm() {
    const { resolve } = this.props; 
    resolve();
  }

  render() {
    const { description, descriptionMore, message, abortLabel, confirmLabel } = this.props;

    let modalBody;
    if (description) {
      if (descriptionMore) {
        modalBody = (
          <div className="modal-body">
            {description}
            <br />
            <br />
            {descriptionMore}
          </div>
        );
      } else {
        modalBody = (
          <div className="modal-body">
            {this.props.description}
          </div>
        );
      }
    }

    let abortButton = null;
    if (abortLabel) {
      abortButton = (
        <button
          role="abort"
          type="button"
          className="btn btn-default"
          onClick={this.abort}
        >
          {abortLabel}
        </button>
      );
    }

    return (
      <Modal>
        <div className="modal-header">
          <h4 className="modal-title">
            {message}
          </h4>
        </div>
        {modalBody}
        <div className="modal-footer">
          <div className="text-right">
            {abortButton}
            {' '}
            <button
              role="confirm"
              type="button"
              className="btn btn-primary"
              ref="confirm"
              onClick={this.confirm}
            >
            {confirmLabel}
            </button>
          </div>
        </div>
      </Modal>);
  }
}

export default Confirm;
