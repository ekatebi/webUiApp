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
import LogItem from './LogItem';

class LogList extends Component {

  render() {

    const { list, filter, totalCount } = this.props;

    const compStyle = {
      flex: '1',
      flexFlow: 'column nowrap',

      borderWidth: 2,
      borderColor: 'yellow',
//      borderStyle: 'solid',
      overflow: 'auto',

      paddingRight: 5
    };


    const logs = list
      .filter((log) => {
        if (filter && filter.show && filter.name) {
          return log.msg.toLowerCase().indexOf(filter.name.toLowerCase()) > -1 ||
            (new Date(log.timeInMs).toLocaleString().toLowerCase().indexOf(filter.name.toLowerCase()) > -1) ||
            log.type.indexOf(filter.name.toLowerCase()) > -1
          ;
        }
        return true;
      })
      .map((log, index) => {
        return (
            <LogItem log={log} key={index} highlight={index < totalCount} />
          );
      });

    return (
      <div style={compStyle}>
        {logs}
      </div>
    );
  }
}

function mapStateToProps(state) {

  const { list, previousTotalCount, errorCount, successCount, infoCount } = state.log;
  const count = errorCount + successCount + infoCount;
  const totalCount = count > 0 ? count : previousTotalCount;

  return {
    list,
    filter: state.filter[MENU_ITEM_LOGS],
    totalCount
  };
}

function mapDispatchToProps(dispatch) {
 return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LogList);
