/* eslint react/prop-types: 0 no-console: 0 */

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './actions';
import { Well, Collapse, Button, Overlay, Label, Grid, Row, Col }
  from 'react-bootstrap';
import ZoneItem from './ZoneItem';
// import { findDOMNode } from 'react-dom';
import { DropTarget as dropTarget } from 'react-dnd';
import { DndItemTypes } from '../../constant/dndItemTypes';
import Display from './Display';
import Wall from './Wall';

const isDraggedDecoderInFormData = (props, draggedItem) => {
  const { formData, deepZoneItem } = props;

  let index = -1;


  function findDecoderMac(mac) {
    return draggedItem.settings.gen.mac === mac;
  }

  function findWallName(name) {
    return draggedItem.item.gen.name === name;
  }

  if (draggedItem.settings) { // display
    index = formData.displays.findIndex(findDecoderMac);
    if (index < 0 && deepZoneItem) {
      index = deepZoneItem.displayMacs.findIndex(findDecoderMac);
    }
  } else if (draggedItem.item) { // wall
    index = formData.walls.findIndex(findWallName);
    if (index < 0 && deepZoneItem) {
      index = deepZoneItem.wallNames.findIndex(findWallName);
    }
  }

  return index > -1;
};

const zoneEditListDropTarget = {
  canDrop: (props, monitor) => {
    // You can disallow drop based on props or item
    const item = monitor.getItem();

//    console.log('WallCell canDrop', item);
//    return props.settings.status.gen.type === 'decoder';
    return ((item.settings && item.settings.gen.type === 'decoder') || (item.item && item.item.gen && item.item.gen.name)) && 
    !isDraggedDecoderInFormData(props, item);
  },

  hover: (props, monitor, component) => {
//    console.log('WallCell hover', props.row, props.column, props);
    // This is fired very often and lets you perform side effects
    // in response to the hover. You can't handle enter and leave
    // hereif you need them, put monitor.isOver() into collect() so you
    // can just use componentWillReceiveProps() to handle enter/leave.

    // You can access the coordinates if you need them
    const clientOffset = monitor.getClientOffset();
//    const componentRect = findDOMNode(component).getBoundingClientRect();

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

    const dragItem = monitor.getItem();
    let displayMac;
    let wallName;

    if (dragItem.settings) {

      displayMac = dragItem.settings.gen.mac;

    } else if (dragItem.item) {
      wallName = dragItem.item.gen.name;
    }
//    console.log('ZoneEditList drop', displayMac, wallName);

    props.addItem(displayMac, wallName);
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

class ZoneEditList extends Component {

    constructor(props) {
    super(props);
    this.removeDisplay = this.removeDisplay.bind(this);
    this.removeWall = this.removeWall.bind(this);
  }

  removeDisplay(displayMac) {

    const { formData, formDataChanged } = this.props;

    function findDisplayMac(arrayDisplayMac) {
      return arrayDisplayMac === displayMac;
    }

    const index = formData.displays.findIndex(findDisplayMac);

//    console.log('removeDisplay', index);

    if (index > -1) {
      formData.displays.splice(index, 1);
      formDataChanged({ ...formData, displays: formData.displays });
    }
  }

  removeWall(wallName) {
    const { formData, formDataChanged } = this.props;

    function findWallName(arrayWallName) {
      return arrayWallName === wallName;
    }

    const index = formData.walls.findIndex(findWallName);

    if (index > -1) {
      formData.walls.splice(index, 1);
      formDataChanged({ ...formData, walls: formData.walls });
    }
  }

  render() {

    const { breadcrumb, list, error, onRequestList, showEditor, onRequestRemove, 
      connectDropTarget, formData, isConfig } = this.props;

//    console.log('ZoneEditList', formData);

    const preStyle = {
      textAlign: 'left',
      overflow: 'hidden'
    };

    const compStyle = {
      display: 'flex',
      flex: '1',
      flexFlow: 'row wrap',
      alignContent: 'flex-start',

      overflow: 'auto',

//      borderWidth: 2,
//      borderColor: 'lightblue',
//      borderStyle: 'solid',

//      height: 460,
//      width: '100%'
    };

    const hintStyle = {
      color: '#999999',
      fontSize: '12px',
      marginTop: 15,
      marginLeft: 10
    };

    // zones
    let indx = 0;

    let items = [];
/*
     = list.map((zone, index) => {
      return (
        <ZoneItem item={zone} index={indx} key={indx++} 
          onRequestList={onRequestList}
          onRequestRemove={onRequestRemove}
          />
        );
    });
*/
    if (formData && formData.displays) {
      items = items.concat(formData.displays.map((displayMac, index) => {
        return (
          <Display key={indx++} displayMac={displayMac} 
            removeDisplay={this.removeDisplay} isConfig={isConfig} />
          );
      }));
    }

    if (formData && formData.walls) {
      items = items.concat(formData.walls.map((wallName, index) => {
        return (
          <Wall key={indx++} wallName={wallName} removeWall={this.removeWall} 
            isConfig={isConfig} />
          );
      }));
    }

    if (formData && formData.displays.length === 0 && formData.walls.length === 0) {
      const dropHint = (
        <div key={indx++} style={hintStyle}>Drop Displays And Walls Here</div>
        );

      items.push(dropHint);      
    }

    return connectDropTarget(
      <div style={compStyle}>
        {items}
      </div>
    );

  }
}

function mapStateToProps(state) {

  const { breadcrumb, selected, list,
    error, fetching, editorShowing, formData } = state.zone;

  return {
    breadcrumb,
    list,
    error,
    fetching,
    editorShowing,
    formData,
    zone: selected
  };

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

module.exports = dropTarget([DndItemTypes.JOIN],
  zoneEditListDropTarget, collect)(connect(mapStateToProps, mapDispatchToProps)(ZoneEditList));

