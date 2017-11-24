import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Well, Collapse, Button, Overlay, Label, Grid, Row, Col }
  from 'react-bootstrap';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import * as actions from './actions';
import ZoneTreeNodeEx from './container/ZoneTreeNode';

class ZoneTreeview extends Component {

  constructor(props) {
    super(props);
    this.state = { nodeId: 'zonesTreeview' };
  }

	render() {

    const { list, lists, listObject, showEditor, selected, uncollapsed, onCollapsAll, editorShowing,
      onSelectZone, onRequestList, onRequestRemove, onReceiveUncollapsed } = this.props;

//    const nodeId = 'zonesTreeview';

      const { nodeId } = this.state;

//    console.log('ZoneTreeview listObject', JSON.stringify(listObject, 0, 2));
		
    /*
		data =
		{
	    "id": 4,
	    "name": "z1",
	    "parent_zone_id": null,
	    "wall_names": null,
	    "display_macs": null
  	}
  	*/

   const compStyle = {
      display: 'flex',
      flex: '1',
      flexFlow: 'column nowrap',
      overflow: 'auto',
      borderWidth: 2,
      borderColor: 'pink',
//      borderStyle: 'solid'
    };

   const contentStyle = {
      display: 'flex',
      flex: '1',
      flexFlow: 'column nowrap',
//      overflow: 'auto',
      borderWidth: 2,
      borderColor: 'lightgreen',
//      borderStyle: 'solid'
    };

    const noZoneMenu = (<MenuItem>
      <span><i className="fa fa-stop-circle-o" aria-hidden="true"></i>&nbsp;Disabled in Edit mode</span>
    </MenuItem>);

    const addZoneMenu = (<MenuItem onClick={(e) => {
      onSelectZone();
      showEditor(true);
      e.stopPropagation();
    }}>
      <span><i className="fa fa-plus" aria-hidden="true"></i>&nbsp;&nbsp;Add Zone</span>
    </MenuItem>);

    const collapsAllZoneMenu = (<MenuItem onClick={(e) => {
//      onSelectZone();
      onCollapsAll();
      e.stopPropagation();
    }}>
      <span><i className="fa fa-reorder" aria-hidden="true"></i>&nbsp;&nbsp;Collapse All</span>
    </MenuItem>);

    const contextMenu = (
      <div>{editorShowing ? 
        (<ContextMenu id={nodeId}>
          {noZoneMenu}
        </ContextMenu>)
       : 
        (<ContextMenu id={nodeId}>
          {addZoneMenu}
          {collapsAllZoneMenu}
        </ContextMenu>)}
      </div>);

    const zoneNodes = list
      .map((data, index) => {
        return (<ZoneTreeNodeEx key={index} data={data} />);
      });

    const content = (
      <div className="treeviewContainer" style={contentStyle}
        onClick={(e) => {
          onSelectZone();
          e.stopPropagation();
        }}>
        {zoneNodes}
      </div>
      );

    return (
      <div style={compStyle}>
        <ContextMenuTrigger id={nodeId} holdToDisplay={1000}>
          {content}
          {contextMenu}
        </ContextMenuTrigger>
      </div>);
	}

}

function mapStateToProps(state, props) {
  const { listObject, selected, uncollapsed, editorShowing } = state.zone;
  
  const parentKey = 'parent_zone_id';

  const list = Object.keys(listObject).filter((key) => {
      return !listObject[key][parentKey];
    }).map((key) => {
      return listObject[key];
    })
    .sort((a, b) => {
      const nameA = a.name.toUpperCase(); // ignore upper and lowercase
      const nameB = b.name.toUpperCase(); // ignore upper and lowercase
      
      if (nameA < nameB) {
        return -1;
      }
      
      if (nameA > nameB) {
        return 1;
      }

      // names must be equal
      return 0;
    });

  return {
    editorShowing,
    selected,
    listObject,
    uncollapsed,
    list
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ZoneTreeview);
