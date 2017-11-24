/* eslint react/prop-types: 0 no-console: 0 */

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './actions';
import {
  MENU_ITEM_LOGS
} from '../appMenu/constants';

class LogSettings extends Component {

  render() {
    return (
      <div>LogSettings</div> 
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

export default connect(mapStateToProps, mapDispatchToProps)(LogSettings);
