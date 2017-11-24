/* eslint react/prop-types: 0 no-console: 0 */

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './actions';
import {
  MENU_ITEM_LOGS
} from '../appMenu/constants';

class AlertContainer extends Component {

  constructor(props) {
    super(props);
    this.error = this.error.bind(this);
    this.success = this.success.bind(this);
    this.info = this.info.bind(this);
    this.show = this.show.bind(this);
  }

  error(msg, options = {}) {
    options.type = 'error';
    // Do not display {} at the end of an error message if an empty object was passed in.
    if (options.error && Object.keys(options.error).length !== 0) {
      this.show(`${msg} ${JSON.stringify(options.error)}`, options);
    } else {
      this.show(msg, options);
    }
  }
  
  success(msg, options = {}) {
    options.type = 'success';
    this.show(msg, options);
  }
  
  info(msg, options = {}) {
    options.type = 'info';
    this.show(msg, options);
  }
  
  show(msg, options) {
//    console.log('show', options.type, msg);
    const { onAddLog } = this.props; 
    onAddLog({ msg, type: options.type });
  }

  render() {
    return (
      <div /> 
      );
  }
}

function mapStateToProps(state) {
  const { list } = state.log;
  return {
    list,
    filter: state.filter[MENU_ITEM_LOGS]
  };
}

function mapDispatchToProps(dispatch) {
 return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(AlertContainer);
// export default AlertContainer;
