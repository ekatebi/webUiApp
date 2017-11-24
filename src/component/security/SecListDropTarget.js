import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DropTarget as dropTarget } from 'react-dnd';
import { DndItemTypes } from '../../constant/dndItemTypes';
import _flow from 'lodash/flow';
import SecItem from './SecItem';
import {
  MENU_ITEM_SEC_USERS,
  MENU_ITEM_SEC_ROLES,
  MENU_ITEM_SEC_PERMS
  } from '../appMenu/constants';

const secListDropTarget = {
  canDrop: (props, monitor) => {


    const dragItem = monitor.getItem();

//    console.log('canDrop', props.secType, dragItem);

    if (props.secType !== dragItem.secType) {
      return false;
    }

    const index = props.list.findIndex((item) => {
      return item.id === dragItem.id;
    });

    if (index > -1) {
      return false;
    }

    return true;
  },

  hover: (props, monitor, component) => {

  },

  drop: (props, monitor, component) => {

    const { onAdd, secType } = props;
    const dragItem = monitor.getItem();

//    console.log('drop', secType, dragItem);
    onAdd(dragItem);
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

class SecListDropTarget extends Component {


  render() {

    const { list, secType, onDelete, showEditor, connectDropTarget, handlePermChange } = this.props;

    const compStyle = {
      display: 'flex',
      flex: '1 1 auto',
      flexFlow: 'column nowrap',

      borderWidth: 2,
      borderColor: 'red',
//      borderStyle: 'solid',

      width: '100%',

      minWidth: 300,
      overflowY: 'auto',
      overflowX: 'hidden',

      padding: 5,
      margin: 5

    };

    const items = list
      .map((item, index) => {
        return (
          <SecItem item={{ ...item, secType, index }} key={index} 
            onDelete={onDelete} showEditor={showEditor} handlePermChange={handlePermChange} />
          );
      });

    return connectDropTarget(
    		<div style={compStyle} >
          {items}
    		</div>
    	);

	}

}

function mapStateToProps(state, props) {

  const { [MENU_ITEM_SEC_USERS]: usersState } = state.sec;
  const { users, userIds, secType, perms } = props;

  let list = [];
  
  if (secType === MENU_ITEM_SEC_USERS) {
        
    if (window.native) {
      list = [...users];
    } else {
      userIds.forEach((userId) => {
      const user = usersState.list.find((u) => {
          return userId === u.id;
        });

        if (user) {
          list.push(user);
        }
      });
    }
  } else if (secType === MENU_ITEM_SEC_PERMS) {
    list = [...perms];
  }

  return {
    list
  };
}

module.exports = _flow(
  dropTarget([DndItemTypes.SECITEM], secListDropTarget, collectForDropTarget),
  connect(mapStateToProps)
)(SecListDropTarget);
