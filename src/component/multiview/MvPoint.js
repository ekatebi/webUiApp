import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import { Well, Collapse, Button, Overlay, Label, Grid, Row, Col } 
  from 'react-bootstrap';
import { DragSource as dragSource } from 'react-dnd';
import { DndItemTypes } from '../../constant/dndItemTypes';
import * as actions from './actions';
import MvWin from './MvWin';
import _flow from 'lodash/flow';
import ToolTip from '../ToolTip';

const mvPointDragSource = {

  beginDrag: (props, monitor, component) => {
    const { winIndex, pointIndex, receiveDragging, gridRec } = props;
    receiveDragging({ winIndex, pointIndex });
    return { winIndex, pointIndex };
  },

  endDrag: (props, monitor, component) => {
    const { receiveDragging } = props;
    receiveDragging();
  }
};

function collectForDragSource(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
  };
}

class MvPoint extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { pointIndex, winIndex, pointRec, gridRec, receivePointRec, item } = this.props;
    if (gridRec && !pointRec && winIndex < item.windows.length && pointIndex === 0) {
      receivePointRec(findDOMNode(this).getBoundingClientRect());
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { pointIndex, winIndex, pointRec, gridRec, receivePointRec, item } = this.props;
    if (gridRec && !pointRec && winIndex < item.windows.length && pointIndex === 0) {
      receivePointRec(findDOMNode(this).getBoundingClientRect());
    }
  }

  render() {
    const { item, connectDragSource, tooltip,
    dragging, win, pointIndex, winIndex, isOver, canDrop, grid,
    gridRec, pointRec } = this.props;

    const pointStyleRaw = {
      marginLeft: 3,
      marginTop: 1,

      cursor: pointIndex === 0 ? 'move' : 'nw-resize',
//      zIndex: 3,
      position: winIndex < item.windows.length ? 'absolute' : 'static',
//      position: 'absolute',
      opacity: 1.0,
//      display: 'flex',
      display: winIndex < item.windows.length || pointIndex < 1 ? 'flex' : 'none',
      flex: '0 0 auto',
      justifyContent: 'center',

      color: 'black',
//      borderWidth: 2,
//      borderColor: 'lightgreen',
//      borderStyle: 'solid'
    };

    let pointStyle;
    let pointDiv;

    if (pointIndex === 0) { 
      const pointAStyle = {
        left: `${win.posX.toString()}%`,
        top: `${win.posY.toString()}%`
      };
      pointStyle = { ...pointStyleRaw, ...pointAStyle };      
      pointDiv = tooltip ? 
        (<ToolTip placement={'top'} tooltip={tooltip}>
        <i className="fa fa-arrows" aria-hidden="true"></i>
        </ToolTip>)
        : (<i className="fa fa-arrows" aria-hidden="true"></i>);
    } else if (pointIndex === 1) {

      let pointBStyle;

      if (pointRec && gridRec) {
        pointBStyle = {
         left: `${(win.posX + win.sizeX - 
          ((pointRec.width + 2) * 100 / gridRec.width)).toString()}%`,
          top: `${(win.posY + win.sizeY - 
            ((pointRec.height) * 100 / gridRec.height)).toString()}%`
        };
      }

      pointStyle = { ...pointStyleRaw, ...pointBStyle };
      pointDiv = (<i className="fa fa-expand fa-flip-horizontal"></i>);
    }

    return connectDragSource(
      <div style={pointStyle}>          
        <span>
          {pointDiv}
        </span>
      </div>);
  }
}

function mapStateToProps(state, props) {

  const { list, error, fetching, editorShowing, 
    dragging, grid, item, spareWin, pointRec, gridRec } = state.multiview;
  const { winIndex, pointIndex } = props;

  return {
    item,
    list,
    grid,
    pointRec,
    gridRec,
    error,
    loaded: !fetching,
    editorShowing,
    dragging,
    win: winIndex < item.windows.length ? item.windows[winIndex] : spareWin
  };

}

function mapDispatchToProps(dispatch) {
 return bindActionCreators(actions, dispatch);
}

module.exports = _flow(
	dragSource(DndItemTypes.MULTIVIEW, mvPointDragSource, collectForDragSource),
  connect(mapStateToProps, mapDispatchToProps)
)(MvPoint);
