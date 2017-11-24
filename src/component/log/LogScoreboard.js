/* eslint react/prop-types: 0 no-console: 0 */

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './actions';
import { Well, Collapse, Button, Overlay, Label, Grid, Row, Col }
  from 'react-bootstrap';
import {
  MENU_ITEM_LOGS
} from '../appMenu/constants';

class LogScoreboard extends Component {

  render() {

    const { errorCount, successCount, infoCount, onResetScoreboard } = this.props;

    const compStyle = {
        display: 'flex',
        flex: '1',
        flexFlow: 'row nowrap',
//        borderStyle: 'solid',
        borderWidth: '2px',
        borderColor: 'purple',
        fontSize: 14,
//        color,
        marginTop: 5,
        textAlign: 'left',
//        backgroundColor: key % 2 ? itemBackgroundColor : 'none'
//        backgroundColor: itemBackgroundColor,
//        borderRadius: 10,
        width: 250,
        cursor: 'pointer'
    };

    return (
      <Row style={compStyle}           
          onClick={() => {
            onResetScoreboard();
          }}>
        <Col xs={errorCount < 100 ? 1 : 2} xsOffset={0} style={{ display: errorCount > 0 ? 'inherit' : 'none' }}>
          <span><i className="fa fa-lg fa-times-circle" 
            style={{ color: 'red', display: errorCount > 0 ? 'inherit' : 'none' }}>
          &nbsp;{errorCount}</i></span></Col>
        <Col xs={successCount < 100 ? 1 : 2} xsOffset={1} style={{ display: successCount > 0 ? 'inherit' : 'none' }}>
          <span><i className="fa fa-lg fa-check-circle" 
            style={{ color: 'green', display: successCount > 0 ? 'inherit' : 'none' }}>
          &nbsp;{successCount}</i></span></Col>
        <Col xs={infoCount < 100 ? 1 : 2} xsOffset={1} style={{ display: infoCount > 0 ? 'inherit' : 'none' }}>
          <span><i className="fa fa-lg fa-info-circle" 
            style={{ color: 'blue', display: infoCount > 0 ? 'inherit' : 'none' }}>
          &nbsp;{infoCount}</i></span></Col>
      </Row> 
    );

  }
}

function mapStateToProps(state) {
  const { errorCount, successCount, infoCount } = state.log;
  return {
    errorCount,
    successCount,
    infoCount
  };
}

function mapDispatchToProps(dispatch) {
 return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LogScoreboard);

