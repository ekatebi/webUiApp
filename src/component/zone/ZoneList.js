import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Well, Collapse, Button, Overlay, Label, Grid, Row, Col }
  from 'react-bootstrap';
import { findDOMNode } from 'react-dom';
import { DropTarget as dropTarget } from 'react-dnd';
import { DndItemTypes } from '../../constant/dndItemTypes';
import * as actions from './actions';
import { getNodeId } from './constants';
import ZoneItem from './ZoneItem';
import Display from './Display';
import Wall from './Wall';
import { confirm } from '../confirm/service/confirm';
import {
  MENU_ITEM_ZONES
} from '../appMenu/constants';

const zoneListDropTarget = {
  canDrop: (props, monitor) => {
    // You can disallow drop based on props or item
    const item = monitor.getItem();

//    console.log('WallCell canDrop', item);
//    return props.settings.status.gen.type === 'decoder';
    return item.settings && item.settings.gen.type === 'decoder';
  },

  hover: (props, monitor, component) => {
//    console.log('WallCell hover', props.row, props.column, props);
    // This is fired very often and lets you perform side effects
    // in response to the hover. You can't handle enter and leave
    // hereif you need them, put monitor.isOver() into collect() so you
    // can just use componentWillReceiveProps() to handle enter/leave.

    // You can access the coordinates if you need them
    const clientOffset = monitor.getClientOffset();
    // const componentRect = findDOMNode(component).getBoundingClientRect();

    // You can check whether we're over a nested drop target
    const isJustOverThisOne = monitor.isOver({ shallow: true });

    // You will receive hover() even for items for which canDrop() is false
    const canDrop = monitor.canDrop();
  },

  drop: (props, monitor, component) => {
//    console.log('WallCell drop', props, monitor.getItem());
    // const { outputType, settings } = monitor.getItem();

    if (monitor.didDrop()) {
      // If you want, you can check whether some nested
      // target already handled drop
      return;
    }

    const displayMac = monitor.getItem().settings.gen.mac;
  }
};

function collect(connect, monitor) {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDropTarget: connect.dropTarget(),
    // You can ask the monitor about the current drag state:
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType(),
    draggedItem: monitor.getItem()
//    mousePosition: getClientOffset()
  };
}

class ZoneList extends Component {

  constructor(props) {
    super(props);
    this.removeDisplay = this.removeDisplay.bind(this);
    this.removeWall = this.removeWall.bind(this);
  }

  removeDisplay(displayMac) {

    const { zone, onRemoveItemFromZone } = this.props;

    confirm('Are you sure?', {
      description: `Would you like to remove display, ${displayMac}, from zone, ${zone.name}?`,
      confirmLabel: 'Delete',
      abortLabel: 'Cancel'
    }).then(() => {
      onRemoveItemFromZone(displayMac, undefined, zone.id);
    }).catch(() => {});

  }

  removeWall(wallName) {
//    console.log('removeWall', wallName);
    const { zone, onRemoveItemFromZone } = this.props;
    confirm('Are you sure?', {
      description: `Would you like to remove wall, ${wallName}, from zone, ${zone.name}?`,
      confirmLabel: 'Delete',
      abortLabel: 'Cancel'
    }).then(() => {
      onRemoveItemFromZone(undefined, wallName, zone.id);
    }).catch(() => {});
  }

  render() {

    const { list, error, onRequestList, showEditor, onJoinSrc,
      onRequestRemove, connectDropTarget, zone, filter, 
      activePage, itemsCountPerPage, isConfig } = this.props;

//    console.log('zoneList list', zone, JSON.stringify(list, 0, 2));

    const preStyle = {
      textAlign: 'left',
      overflow: 'hidden'
    };

    const compStyle = {
      display: 'flex',
      flex: '1',
      flexFlow: 'row wrap',
      alignContent: 'flex-start',

      borderWidth: 2,
      borderColor: 'green',
//      borderStyle: 'solid',

      overflow: 'auto',
    };
    
    let indx = 0;
    // subzones
    let items = list.filter((zone) => {
      if (filter && filter.show && filter.name) {
        return zone.name.indexOf(filter.name) > -1;
      }
      return true;
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
    })
    .map((zone, index) => {
      return (<ZoneItem item={zone} index={indx} key={indx++} isConfig={isConfig} />);
    });

    let displays = (<div />);
    let walls = (<div />);
    
    if (zone) {
      if (zone.display_macs) {
        displays = zone.display_macs.split(',').map((displayMac, index) => {
          return (
            <Display key={indx++} displayMac={displayMac} 
              removeDisplay={this.removeDisplay} isConfig={isConfig} />
            );
        });
      }
      
      if (zone.wall_names) {
        walls = zone.wall_names.split(',').map((wallName, index) => {
          return (
            <Wall key={indx++} wallName={wallName} removeWall={this.removeWall} 
              isConfig={isConfig} />
            );
        });
      }
    }

    return (
      <div style={compStyle}>
        {items}
      </div>
    );

  }
}

function mapStateToProps(state) {

  const { selected, error, fetching, editorShowing,
    activePage, itemsCountPerPage, list } = state.zone;

/*
  const parentIdKey = 'parent_zone_id';

  const list = Object.keys(listObject).filter((key) => {
    return selected && selected.id ? listObject[key][parentIdKey] === selected.id 
      : !listObject[key][parentIdKey];
  }).map((key) => {
    return listObject[key];
  });
*/
  return {
    list,
    error,
    fetching,
    editorShowing,
    zone: selected,
    filter: state.filter[MENU_ITEM_ZONES],
    activePage,
    itemsCountPerPage
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ZoneList);
