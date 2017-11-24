/* eslint react/prop-types: 0 no-console: 0 */

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as wallActions from './actions';
import * as deviceActions from '../device/actions';
import { Well, Collapse, Button, Overlay, Label, Grid, Row, Col }
  from 'react-bootstrap';
import Panel from '../Panel';
import WallList from './WallList';
import WallEditor from './WallEditor';
import AddItem from '../AddItem';
import {
  MENU_ITEM_WALLS
} from '../appMenu/constants';

class WallHome extends Component {

  componentWillMount() {
//    console.log('WallHome componentWillMount');
    const { wallActions } = this.props;
    const { onRequestListEx } = wallActions;

    onRequestListEx();
  }
  
  render() {

   const { editorShowing, settings, style, wallActions, list,
    loaded, isConfig } = this.props;
   const { showEditor } = wallActions;
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
      content = (<WallEditor />);
    } else {
      content = (
        <div style={compStyle}>
          {isConfig && !window.isMobile ? (<AddItem tooltip="Add Wall" onClick={(e) => {
                  showEditor(true);
                  e.stopPropagation();
                 }} />) : (<div />)}         
          <div style={listStyle}>
            <WallList isConfig={isConfig} />
          </div>
        </div>); 
    }

    const title2 = `${title} (${list.length})`;

    return (
      <Panel settings={ { id, title: title2, onToggleItem, filter: filterVar } } loaded={loaded}>
        {content}
      </Panel>
    );
  }
}

function mapStateToProps(state, props) {

  const { list, error, spinner, editorShowing } = state.wall;
  const { token } = state.auth;
  const { title } = props.settings;

  const isConfig = token && token.role && token.role.perms && 
      token.role.perms[title] && token.role.perms[title].Configure;

  const filter = state.filter[MENU_ITEM_WALLS];

  const items = list.filter((item) => {
    if (filter && filter.show && filter.name) {
      return item.gen.name.indexOf(filter.name) > -1;
    }        
    return true;
  });

  return {
    list: items,
    error,
    loaded: !spinner,
//    loaded: true,
    editorShowing,
    isConfig
  };

}

function mapDispatchToProps(dispatch) {
 return {
      wallActions: bindActionCreators(wallActions, dispatch),
      deviceActions: bindActionCreators(deviceActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(WallHome);
