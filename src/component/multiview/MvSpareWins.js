import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { DropTarget as dropTarget } from 'react-dnd';
import { Well, Collapse, Button, Overlay, Label, Grid, Row, Col }
  from 'react-bootstrap';
import _flow from 'lodash/flow';
import { DndItemTypes } from '../../constant/dndItemTypes';
import * as actions from './actions';
import MvWin from './MvWin';
import MvPoint from './MvPoint';

const mvSpareWinsDropTarget = {
  canDrop: (props, monitor) => {
  	const { item } = props;
    const dragItem = monitor.getItem();

		return dragItem.winIndex < item.windows.length;
  },

  drop: (props, monitor, component) => {
    const { receiveRemoveWin } = props;
    const dragItem = monitor.getItem();

    receiveRemoveWin(dragItem.winIndex);
    
    if (monitor.didDrop()) {
      // If you want, you can check whether some nested
      // target already handled drop
    }
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
//    mousePosition: monitor.getClientOffset()
    initialClientOffset: monitor.getInitialClientOffset(),
    clientOffset: monitor.getClientOffset(),
    differenceFromInitialOffset: monitor.getDifferenceFromInitialOffset()
  };

}

class MvSpareWins extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {

    if (!window.mv) {
      return (<div />);
    }

    const { item, maxWins, canDrop, isOver, connectDropTarget } = this.props;

    const compStyle = {
      marginLeft: 10,
      display: 'flex',
      flex: '1 0 auto',
      flexFlow: 'row nowrap',
      justifyContent: 'flex-start',
			alignItems: 'center',
//  		alignContent: 'center',

      borderWidth: 2,
      borderColor: 'lightBlue',
//	    borderStyle: isOver && canDrop ? 'solid' : 'none',

			backgroundColor: isOver && canDrop ? 'lightBlue' : 'white'
    };

    const resStyle = (bFirst) => {
//      zIndex: 2,
//      position: 'relative',
      return {
        display: bFirst ? 'flex' : 'none',
        flex: '0 0 auto',
        flexFlow: 'row nowrap',

        borderWidth: 2,
        borderColor: 'pink',
  //      borderStyle: 'solid'
      };
    };

    const gridRec = {
      width: 0,
      height: 0
    };

    const winsDiv = [];

    for (let index = item.windows.length; index < maxWins; index++) {
      winsDiv.push(
        <div style={resStyle(index === item.windows.length)} key={(index * 3)}>
          <div key={(index * 3) + 4}>&nbsp;</div>          
            <MvWin index={index} key={(index * 3) + 1} />
            <MvPoint pointIndex={0} winIndex={index} key={(index * 3) + 2} 
              tooltip={index === item.windows.length ? 'drag to grid to create window' : undefined} />
            <MvPoint pointIndex={1} winIndex={index} key={(index * 3) + 3} />
        </div>
        );
    }

    return connectDropTarget(
    		<div style={compStyle}><strong>Unused Windows ({maxWins - item.windows.length}):</strong>
    			{winsDiv}
    		</div>
    	);
	}
}

function mapStateToProps(state) {

  const { dragging, grid, editorShowing, item, canDrop, gridRec, maxWins } = state.multiview;

  return {
		maxWins,
    dragging,
    editorShowing,
    grid,
    item,
    canDrop,
    gridRec
  };

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

module.exports = _flow(
  dropTarget([DndItemTypes.MULTIVIEW], mvSpareWinsDropTarget, collectForDropTarget),
  connect(mapStateToProps, mapDispatchToProps)
)(MvSpareWins);
