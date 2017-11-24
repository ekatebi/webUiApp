import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Well, Collapse, Button, Overlay, Label, Grid, Row, Col }
  from 'react-bootstrap';
import * as mvActions from './actions';
import * as deviceActions from '../device/actions';
import Panel from '../Panel';
import MvList from './MvList';
import MvEditor from './MvEditor';
import AddItem from '../AddItem';
import {
  MENU_ITEM_MULTIVIEW,
  } from '../appMenu/constants';

class MvHome extends Component {

  componentWillMount() {
    const { mvActions } = this.props;
    const { onRequestList } = mvActions;

    onRequestList();
  }

  render() {

   const { editorShowing, settings, style, list,
    mvActions, loaded, isConfig } = this.props;
   const { showEditor } = mvActions;
   const { id, title, onToggleItem } = settings;

   const compStyle = {
      display: 'flex',
      flex: '1',
      flexFlow: 'column nowrap',
//      overflow: 'auto',

//      borderWidth: 2,
//      borderColor: 'blue',
//      borderStyle: 'solid'
    };

   const listStyle = {
      display: 'flex',
      flex: '1',
      flexFlow: 'column nowrap',
//      overflow: 'auto',

//      marginTop: 15,

      borderWidth: 2,
      borderColor: 'lightgreen',
//      borderStyle: 'solid'
    };

   const editorStyle = {
      display: 'flex',
      flex: '1',
      flexFlow: 'column nowrap',

      borderWidth: 2,
      borderColor: 'lightgreen',
//      borderStyle: 'solid'
    };

    const filterVar = editorShowing ? undefined : { status: false };

    let content;

    if (editorShowing) {
      content = (<MvEditor />);
    } else {
      content = (
        <div style={compStyle}>
          {isConfig && !window.isMobile ? (
          <AddItem tooltip="Add Multiview" onClick={(e) => {
                  showEditor(true);
                  e.stopPropagation();
                 }} />) : (<div />)}
          <div style={listStyle}>
            <MvList isConfig={isConfig} />
          </div>
        </div>); 
    }

    const title2 = `${title} (${list.length})`;

    return (
      <Panel settings={ { id, title: title2, onToggleItem, filter: filterVar } } loaded={loaded}>
        <div style={compStyle}>
          {content}
        </div>
      </Panel>
    );
  }
}

function mapStateToProps(state, props) {

  const { list, error, fetching, editorShowing } = state.multiview;
  const { token } = state.auth;
  const { title } = props.settings;

  const isConfig = token && token.role && token.role.perms && 
      token.role.perms[title] && token.role.perms[title].Configure;

  const filter = state.filter[MENU_ITEM_MULTIVIEW];

  const items = list.filter((item) => {
    if (filter && filter.show && filter.name) {
      return item.gen.name.indexOf(filter.name) > -1;
    }        
    return true;
  });

  return {
    list: items,
    error,
    loaded: !fetching,
    editorShowing,
    isConfig
  };

}

function mapDispatchToProps(dispatch) {
 return {
      mvActions: bindActionCreators(mvActions, dispatch),
      deviceActions: bindActionCreators(deviceActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MvHome);
