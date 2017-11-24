import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import * as actions from './actions';
import { Well, Collapse, Button, Overlay, Label, Grid, Row, Col }
  from 'react-bootstrap';
import LogList from './LogList';
// import LogSettings from './LogSettings';
import Panel from '../Panel';

import {
  MENU_ITEM_LOGS
} from '../appMenu/constants';

class LogHome extends Component {

  componentWillMount() {
    const { onRequestStorage } = this.props;
    onRequestStorage();
  }

  render() {

    const { showSettings, settings, loaded, style, filter, onClearLogs, list } = this.props;
    const { id, title, onToggleItem } = settings;
    const filterVar = showSettings ? undefined : { status: false, filterFor: 'filter for message, date and type (error, success, info)' };


    const compStyle = {
      display: 'flex',
//      flexGrow: 1,
      flex: '1',
//      flexFlow: 'column nowrap',
      // alignItems: 'center'

      borderWidth: '2px',
      borderColor: 'blue',
//      borderStyle: 'solid',

      minWidth: 455,

      paddingRight: 2,

      MozUserSelect: 'text',
      WebkitUserSelect: 'text',
      msUserSelect: 'text',
    };

    const clearLogsMenu = (<MenuItem onClick={(e) => {
        onClearLogs();
        e.stopPropagation();
      }}>
        <span><i className="fa fa-trash" aria-hidden="true"></i>&nbsp;&nbsp;Clear Logs</span>
      </MenuItem>);

    const contextMenu = (
      <div>
        <ContextMenu id={'contextMenu'}>
          {clearLogsMenu}
        </ContextMenu>
      </div>);

    const logList = (
        <div style={compStyle}>
          <LogList />
        </div>
      );

    const content = list.length > 0 ?
      (<div style={compStyle}>
        <ContextMenuTrigger id={'contextMenu'} holdToDisplay={1000}>
          {logList}
          {contextMenu}
        </ContextMenuTrigger>
      </div>) :
      logList;

    return (
      <Panel settings={ { id, title, onToggleItem, filter: filterVar } } loaded={loaded} style={style}>
        {content}
      </Panel>
    );
  }
}

function mapStateToProps(state) {
  const { list, spinner, showSettings } = state.log;
  return {
    showSettings,
    loaded: !spinner,
    list,
    filter: state.filter[MENU_ITEM_LOGS]
  };
}

function mapDispatchToProps(dispatch) {
 return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LogHome);
