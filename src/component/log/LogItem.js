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
import { itemBackgroundColor, appBackgroundColor } from '../../constant/app';

class LogItem extends Component {

  render() {

    const { log, highlight } = this.props;

    const compStyle = (color) => {
      return {
        display: 'flex',
        flex: '1',
        flexFlow: 'row nowrap',
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: appBackgroundColor,
        fontSize: 14,
        color,
        marginLeft: 1,
        marginTop: 4,
        textAlign: 'left',
        backgroundColor: highlight ? '#EADAF3' : itemBackgroundColor,
        borderRadius: 8,
        maxWidth: 430,
        minHeight: 55
      };
    };

    const colIconStyle = {
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'auto',
      paddingTop: 7,
      paddingBottom: 7
    };

    const colStyle = {
      fontSize: 12,
      alignItems: 'flex-start',
      justifyContent: 'center',
      overflow: 'auto',
      paddingTop: 7,
      paddingBottom: 7
    };

    const dateStyle = {
      fontSize: 12,
      alignItems: 'flex-start',
      justifyContent: 'center',
      overflow: 'auto',
      paddingTop: 7,
      paddingBottom: 7
    };

    let color;
    let sym;
    if (log.type === 'error') {
      sym = 'times';
      color = 'red';
    } else if (log.type === 'success') {
      sym = 'check';
      color = 'green';
    } else if (log.type === 'info') {
      sym = 'info';
      color = 'blue';
    }

    const date = new Date(log.timeInMs);

//    console.log('log.msg', log.msg);

    return (
      <Row style={compStyle(color)}>
        <Col xs={1} xsOffset={0} style={colIconStyle}><span><i className={`fa fa-lg fa-${sym}-circle`} /></span></Col>
        <Col xs={8} xsOffset={0} style={colStyle}>{typeof(log.msg) === 'object' ? log.msg.toString() : log.msg}</Col>
        <Col xs={3} xsOffset={0} style={dateStyle}>{date.toLocaleString()}</Col>
      </Row>
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

export default connect(mapStateToProps, mapDispatchToProps)(LogItem);
