import { findDOMNode } from 'react-dom';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { DropTarget as dropTarget } from 'react-dnd';
import { DndItemTypes } from '../../constant/dndItemTypes';
import { Well, Collapse, Button, Overlay, Label, Grid, Row, Col } 
  from 'react-bootstrap';
import { appBackgroundColor } from '../../constant/app';
import * as actions from './actions';
import MvWin from './MvWin';
import MvPoint from './MvPoint';
import _flow from 'lodash/flow';
import {
  MENU_ITEM_MULTIVIEW,
  } from '../appMenu/constants';

const mvGridDropTarget = {
  canDrop: (props, monitor) => {

//    console.log('canDrop', props.canDrop);
    return props.canDrop;
  },

  hover: (props, monitor, component) => {

    const { grid, receiveCanDrop, receiveGridRec, item, gridRec, spareWin } = props;

    const dragItem = monitor.getItem();
    const win = dragItem.winIndex < item.windows.length ? 
      item.windows[dragItem.winIndex] : spareWin;

//    console.log('win', dragItem.winIndex, item.windows.length);
    
    const clientOffset = monitor.getClientOffset();
    let canDrop = false;

    const x = Math.round(clientOffset.x - gridRec.left);
    const y = Math.round(clientOffset.y - gridRec.top);  

    if (dragItem.pointIndex === 0) {

      const winWidth = Math.round(win.sizeX * gridRec.width / 100);
      const winHeight = Math.round(win.sizeY * gridRec.height / 100);

      canDrop = x >= 0 && 
        x + winWidth <= Math.round(gridRec.width) &&
        y >= 0 && 
        y + winHeight <= Math.round(gridRec.height);

      receiveCanDrop(canDrop, clientOffset);

    } else {


      const differenceFromInitialOffset = monitor.getDifferenceFromInitialOffset();

      const winX = Math.round(win.posX * gridRec.width / 100);
      const winY = Math.round(win.posY * gridRec.height / 100);

      canDrop = x >= winX && 
        x <= Math.round(gridRec.width) &&
        y >= winY && 
        y <= Math.round(gridRec.height);

      receiveCanDrop(canDrop,
        clientOffset, differenceFromInitialOffset);
    }

  },

  drop: (props, monitor, component) => {
    const { grid, receiveDropInfo, item,
        gridRec } = props;

    const dragItem = monitor.getItem();

//    console.log('grid drop', gridRec, dragItem);

    const gridStep = 100 / grid.count;

//    console.log('grid drop', gRec, gridRec, dragItem);

    let percentDiff;

    if (dragItem.winIndex < item.windows.length) {

      const differenceFromInitialOffset = monitor.getDifferenceFromInitialOffset();
      

      percentDiff = {
        x: Math.round(((differenceFromInitialOffset.x * 100) / gridRec.width) / gridStep) * gridStep,
        y: Math.round(((differenceFromInitialOffset.y * 100) / gridRec.height) / gridStep) * gridStep
      };
    } else {
      const clientOffset = monitor.getClientOffset();

      percentDiff = {
        x: Math.round((((clientOffset.x - gridRec.left) * 100) / gridRec.width) / gridStep) * gridStep,
        y: Math.round((((clientOffset.y - gridRec.top) * 100) / gridRec.height) / gridStep) * gridStep
      };

    }
    
    receiveDropInfo(dragItem, percentDiff);
  }
};

function collectForDropTarget(connect, monitor) {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDropTarget: connect.dropTarget(),
    // You can ask the monitor about the current drag state:
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType(),
    dragItem: monitor.getItem(),
    initialClientOffset: monitor.getInitialClientOffset(),
    clientOffset: monitor.getClientOffset(),
    differenceFromInitialOffset: monitor.getDifferenceFromInitialOffset()
  };

}

class MvGrid extends Component {

  constructor(props) {
    super(props);
    this.deleteHandler = this.deleteHandler.bind(this);
    this.resizeHandler = this.resizeHandler.bind(this);
    this.state = {};
  }

  componentDidMount() {
    const { gridRec, receiveGridRec } = this.props;

    if (!gridRec && findDOMNode(this)) {
      receiveGridRec(findDOMNode(this).getBoundingClientRect());
//      this.forceUpdate();
    }

  } 

  componentDidUpdate(prevProps, prevState) {

    const { gridRec, receiveGridRec, paneWidth } = this.props;

    if (!gridRec || prevProps.paneWidth !== paneWidth) {
//      console.log('componentDidUpdate', prevProps.paneWidth, paneWidth);
      receiveGridRec(findDOMNode(this).getBoundingClientRect());
//      this.forceUpdate();
    }

  }

  deleteHandler(e, data) {
    console.log('grid deleteHandler', data);    
  }

  resizeHandler() {
    console.log('grid resizeHandler');    
  }

  render() {

    const { dragging, grid, connectDropTarget, item, clientOffset,
    gridRec, paneWidth } = this.props;

//    console.log('MvGrid', paneWidth);

    const compStyle = {
//      overflow: 'auto',
      display: 'flex',
      flex: '1',
      flexFlow: 'column nowrap',
      position: 'relative',
      
      width: '100%'

//      borderWidth: 2,
//      borderColor: 'yellow',
//      borderStyle: 'solid'
    };

    const gridStyle = {
//      overflow: 'auto',
//      marginTop: 20,
//      zIndex: 2,
  //    opacity: dragging ? 0.3 : 1.0,
      position: 'relative',
//      top: 0,
//      left: 0,
      display: 'flex',
      flex: '0 0 auto',
      flexFlow: 'column nowrap',
      justifyContent: 'space-between',
      alignItems: 'space-between',

      width: '100%',
      height: '100%',

//      width: grid.width,
//      height: (grid.width * 9) / 16,

      borderWidth: 2,
      borderColor: appBackgroundColor,
//      borderStyle: 'solid'
    };

    const innerGridStyle = {
      width: '100%',
      height: '100%'
    };

    const linesStyle = {
/*
      marginBottom: 0,
      marginRight: 0
      display: 'flex',
      flex: '0 0 auto',

      width: grid.width,
      height: (grid.width * 9) / 16,

      borderWidth: 2,
      borderColor: 'pink',
      borderStyle: 'solid'
*/
    };

    const rowLinesParentStyle = {
      position: 'absolute',
      top: 0,
      left: 0,

      width: '100%',
      height: '100%',

      opacity: 0.5,
      display: 'flex',
      flex: '1 1 auto',
      flexFlow: 'column nowrap',
      justifyContent: 'space-between'
    };

    const rowLinesStyle = {
      display: 'flex',
      flex: '1',
      flexFlow: 'row nowrap',
      justifyContent: 'flex-start',
      height: `${(100 / grid.count).toString()}%`,
      borderWidth: 1,
      borderColor: 'lightblue',
      borderStyle: 'solid'
    };

    const colLinesParentStyle = {
      position: 'absolute',
      top: 0,
      left: 0,

      opacity: 0.5,
      display: 'flex',
      flex: '1 1 auto',
      flexFlow: 'row nowrap',
      justifyContent: 'space-between',

      width: '100%',
      height: '100%',

//      borderWidth: 1,
//      borderColor: 'lightblue',
//      borderStyle: 'solid'
    };

    const colLinesStyle = {
      textAlign: 'left',
      display: 'flex',
      flex: '1',
      flexFlow: 'column nowrap',
      width: `${(100 / grid.count).toString()}%`,
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: 'lightblue',
      borderStyle: 'solid'
    };

    const percent = 100 / grid.count;

    const rowLinesDiv = [];

    let i = 0;
    for (; i < grid.count;) {
      rowLinesDiv.push(
        <div style={rowLinesStyle} key={i}>
          <span style={{ marginLeft: 3 }}>{i > 0 && grid.withLabels ? i * percent : ''}</span>
          <span style={{ marginLeft: 3 }}>{i === 0 && grid.withLabels ? '%' : ''}</span>
        </div>
        );
        i++;
    }

    const colLinesDiv = [];
    i = 0;
    for (; i < grid.count;) {
      colLinesDiv.push(
        <div style={colLinesStyle} key={i}>
          <span style={{ marginLeft: 3 }}>{i > 0 && grid.withLabels ? i * percent : ''}</span>
        </div>
        );
      i++;
    }

    const linesDiv = (
      <div style={linesStyle}>
        <div style={rowLinesParentStyle}>
          {rowLinesDiv}
        </div>
        <div style={colLinesParentStyle}>
          {colLinesDiv}
        </div>
      </div>
    );

    let winsDiv;
/*    
    let point0Div = (<div />);
    let point1Div = (<div />);

    if (window.mv) {
      point0Div = (<MvPoint pointIndex={0} winIndex={index} key={(index * 3) + 2} />);
      point1Div = (<MvPoint pointIndex={1} winIndex={index} key={(index * 3) + 3} />);
    }
*/
    if (gridRec) {
      winsDiv = item.windows.map((win, index) => {
        return (
          <div key={(index * 3)}>
            <MvWin index={index} key={(index * 3) + 1} />
            {window.mv ? (<MvPoint pointIndex={0} winIndex={index} key={(index * 3) + 2} />) : (<div />)}
            {window.mv ? (<MvPoint pointIndex={1} winIndex={index} key={(index * 3) + 3} />) : (<div />)}
          </div>
          );
      });
    }

    let dragWinDiv;

    if (dragging && dragging.winIndex === item.windows.length) {
//      console.log('dragWinDiv');
      dragWinDiv = (
        <MvWin index={dragging.winIndex} key={(dragging.winIndex * 3) + 1} showDrag={true} />
      );
    }

    return (
      <div style={compStyle}>
        {linesDiv}
        {connectDropTarget(
          <div style={gridStyle}>
            {winsDiv}
            {dragWinDiv}
          </div>)}
      </div>
    );
  }
}

function mapStateToProps(state) {

  const { dragging, grid, editorShowing, item, canDrop, 
    pointRec, gridRec, spareWin } = state.multiview;

  const { menu } = state.appMenu;

  return {
    dragging,
    editorShowing,
    grid,
    item,
    canDrop,
    pointRec,
    gridRec,
    spareWin,
    paneWidth: menu[MENU_ITEM_MULTIVIEW].paneWidth
  };

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

module.exports = _flow(
  dropTarget([DndItemTypes.MULTIVIEW], mvGridDropTarget, collectForDropTarget),
  connect(mapStateToProps, mapDispatchToProps)
)(MvGrid);
