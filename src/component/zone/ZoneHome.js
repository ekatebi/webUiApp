/* eslint react/prop-types: 0 no-console: 0 */

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Well, Collapse, Button, Overlay, Label, Grid, Row, Col }
  from 'react-bootstrap';
import SplitPane from 'react-split-pane';
import * as actions from './actions';
import Panel from '../Panel';
import ZoneList from './ZoneList';
import ZoneForm from './ZoneForm';
import AddItem from '../AddItem';
import ZoneTreeview from './ZoneTreeview';
import { PAGINATION } from '../../constant/app';
import { parentIdKey } from './constants';
import {
  MENU_ITEM_ZONES
} from '../appMenu/constants';

class ZoneHome extends Component {

  componentWillMount() {
    const { onRequestListEx } = this.props;
    onRequestListEx();
  }

  render() {

    const { breadcrumb, editorShowing, showEditor, settings, style, isConfig, onSelectZone,
      onRequestList, loaded, activePageChanged, activePage, itemsCountPerPage,
      onReceiveUncollapsed, uncollapsed, list, filter } = this.props;
    const { id, title, onToggleItem } = settings;

//    console.log('ZoneHome', uncollapsed);

   const compStyle = {
      display: 'flex',
      flex: '1',
      flexFlow: 'column nowrap',
//      overflow: 'auto',

//      hight: '100%',
      borderWidth: 1,
      borderColor: 'red',
//    borderStyle: 'solid'
    };

   const breadcrumbStyle = {
      display: 'flex',
      flex: '0 0 auto',
      flexFlow: 'row wrap',
      justifyContent: 'flex-start',
//      alignItems: 'center',

      borderWidth: 2,
      borderColor: 'red',
//      borderStyle: 'solid',
    };

   const listStyle = {
      display: 'flex',
      flex: '1',
      flexFlow: 'column nowrap',
      borderWidth: 2,
      borderColor: 'lightgreen',
//      borderStyle: 'solid'
    };

   const formStyle = {
      display: 'flex',
      flex: '1',
      flexFlow: 'column nowrap',
//      borderWidth: 2,
//      borderColor: 'pink',
//      borderStyle: 'solid',
    };

    let breadcrumbDiv = [];

    if (breadcrumb.length > 0) {

      breadcrumbDiv.push(       
          (<button type="button" className="btn btn-link" key={0}
            onClick={(e) => {
              onRequestList();
              onSelectZone();
              e.stopPropagation();
            }}
          >{'Zones'}</button>)
        );

      const breadcrumbDivEx = breadcrumb.map((zone, index) => {
        return (<button className="btn btn-link" key={index + 1} 
            style={{ marginLeft: 0, marginRight: index === breadcrumb.length - 1 ? 3 : 0 }} 
            disabled={index === breadcrumb.length - 1}
            onClick={() => {
              onRequestList(zone);
              onSelectZone(zone);
              onReceiveUncollapsed(zone, true);
            }} 
          >{zone.name}</button>
          );
        });

      breadcrumbDiv = [...breadcrumbDiv, ...breadcrumbDivEx];

    } else {
      breadcrumbDiv.push(
        (<div key={0} />)
        );
    }

    const filterVar = editorShowing ? undefined : { status: false };

    let content;

    if (editorShowing) {
      content = (
          <ZoneForm isConfig={isConfig} />
        );
    } else {
      content = (
        <div style={compStyle}>
          <div style={breadcrumbStyle}>
            {breadcrumbDiv}
          </div>
          {isConfig && !window.isMobile ? (<AddItem tooltip="Add Zone" onClick={(e) => {
            showEditor(true);
            e.stopPropagation();
             }} />) : (<div />)}
          <div style={listStyle}>
            <ZoneList isConfig={isConfig} />
          </div>              
        </div>
      );
    }

      const width = 200;
        content = (
          <div style={{ ...compStyle, position: 'relative', borderStyle: 'none' }}>
            <SplitPane 
              split="vertical" minSize={160} paneStyle={{ ...compStyle, marginTop: 0 }}
              defaultSize={ `${Math.min(localStorage.getItem('zoneTreeview') || width)}px` }
              onChange={ size => localStorage.setItem('zoneTreeview', size) }>
              <div style={{ ...compStyle, marginTop: 0, padding: 8 }}>
                <ZoneTreeview />
              </div>
              <div style={{ ...compStyle, marginLeft: 0, marginTop: 0, padding: 8 }}>
                {content}
              </div>
            </SplitPane>
          </div>
      );

    const title2 = `${title} (${list.length})`;

    return (
      <Panel settings={ { id, title: title2, onToggleItem,
        filter: filterVar,
        } }
        loaded={loaded} padding={ filter && filter.show ? 8 : 0 }>
        {content}
      </Panel>
    );
  }
}

function mapStateToProps(state, props) {

  const { error, fetching, editorShowing, spinner, list, 
    listObject, selected, breadcrumb, uncollapsed } = state.zone;
  const { token } = state.auth;

  const title = 'Zones';

  const isConfig = token && token.role && token.role.perms && 
      token.role.perms[title] && token.role.perms[title].Configure;

  const filter = state.filter[MENU_ITEM_ZONES];

  const items = list.filter((zone) => {
      if (filter && filter.show && filter.name) {
        return zone.name.indexOf(filter.name) > -1;
      }
      return true;
    });

  return {
    list: items,
    uncollapsed,
    listObject,
    breadcrumb,
    error,
    loaded: !spinner,
    editorShowing,
    isConfig,
    filter
  };

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ZoneHome);
