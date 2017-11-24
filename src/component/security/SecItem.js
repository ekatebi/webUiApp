import { Well, Collapse, Button, Overlay, Label, Grid, Row, Col }
  from 'react-bootstrap';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DragSource as dragSource } from 'react-dnd';
import { DndItemTypes } from '../../constant/dndItemTypes';
import _flow from 'lodash/flow';
import { confirm } from '../confirm/service/confirm';
import ToolTip from '../ToolTip';

import {
  MENU_ITEM_SEC_USERS,
  MENU_ITEM_SEC_ROLES,
  MENU_ITEM_SEC_PERMS
  } from '../appMenu/constants';

import {
  SEC_TYPE_NAMES,
  capitalize
  } from './constants';

const secItemDragSource = {

  beginDrag: (props, monitor, component) => {
    const { item } = props;
    return { ...item };
  },

  endDrag: (props, monitor, component) => {
    const { item } = props;
  },

  canDrag: (props) => {
    const { item } = props;
    return props.item.secType === MENU_ITEM_SEC_USERS && 
      (!window.native || window.native && item.id > 1);
  }

};

function collectForDragSource(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    canDrag: monitor.canDrag()
  };
}

class SecItem extends Component {

	render() {

		const { settings, item, onSave, onDelete, onShowEditor, canDrag,
      connectDragSource, handlePermChange, roleNames } = this.props;

    const outline = 'none';
    let backgroundColor;
    let permsSymbol = 'lock';

    if (item.secType === MENU_ITEM_SEC_PERMS) {
      if (item.Display === false &&
          (item.Configure === false || item.Configure === undefined) &&
          (item.Admin === false || item.Admin === undefined)) {
        backgroundColor = 'lightpink';
        permsSymbol = 'lock';
      } else if (item.Display === true && 
          (item.Configure === true || item.Configure === undefined) &&
          (item.Admin === true || item.Admin === undefined)) {
        backgroundColor = 'lightgreen';
        permsSymbol = 'unlock fa-flip-horizontal';
      } else if (item.Display === true && 
          ((item.Configure === false || item.Configure === undefined) &&
          (item.Admin === true || item.Admin === undefined)) ||
          ((item.Configure === true || item.Configure === undefined) &&
          (item.Admin === false || item.Admin === undefined))) {

        backgroundColor = '#F0E68C'; // light yellow
        permsSymbol = 'unlock-alt';
      } else if (item.Display === true &&
          (item.Configure === false || item.Configure === undefined) &&
          (item.Admin === false || item.Admin === undefined)) {
        backgroundColor = '#f2b174'; // orange
        permsSymbol = 'unlock-alt';
      }
    }

    const compStyle = (color) => {

      return {
        display: 'flex',
        flex: '0 1 auto',
        flexFlow: 'row nowrap',

        alignItems: 'center',
        justifyContent: 'space-between',

        borderStyle: 'solid',
        borderWidth: 2,
//        borderColor: appBackgroundColor,
        fontSize: 14,
        color,
        margin: 2,
//        marginLeft: 1,
//        marginBottom: 4,
        textAlign: 'left',
  //      backgroundColor: highlight ? '#EADAF3' : itemBackgroundColor,
        borderRadius: 8,
        backgroundColor,

        padding: 10,

        width: '100%',
        maxHeight: 35,
        minHeight: 35
      };
    };

    const colIconStyle = {
      display: 'flex',
      flex: '0 0 auto',

      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'auto',
      cursor: canDrag ? 'move' : 'default',
//      paddingTop: 7,
//      paddingBottom: 7
      width: 30,

      borderWidth: 2,
      borderColor: 'lightblue',
//      borderStyle: 'solid'
    };

    const nameStyle = {
      display: 'flex',
      flex: '1 1 auto',
      flexFlow: 'row nowrap',
      alignItems: 'center',
      alignContent: 'center',
      justifyContent: 'space-between',
      overflow: 'auto',
//      paddingTop: 7,
//      paddingBottom: 7,
      minWidth: 50,
      maxWidth: 100,
      borderWidth: 2,
      borderColor: 'lightblue',
//      borderStyle: 'solid'

    };

    const permsStyle = {
      display: 'flex',
      flex: '1 1 auto',
      flexFlow: 'row nowrap',
      alignItems: 'center',
      alignContent: 'center',
      justifyContent: 'space-between',
      overflow: 'auto',
      maxHeight: '80%',
//      paddingTop: 7,
//      paddingBottom: 7,
//      minWidth: 200,
//      maxWidth: 200,
      borderWidth: 2,
      borderColor: 'lightblue',
//      borderStyle: 'solid'      
    };

    const colStyle = {
      alignItems: 'flex-start',
      justifyContent: 'center',
      overflow: 'auto',
//      paddingTop: 7,
//      paddingBottom: 7
    };

    let color;
    let sym;
    let secTypeName;
    let nameColWidth = 3;

    switch (item.secType) {
    	case MENU_ITEM_SEC_USERS:
        secTypeName = capitalize(SEC_TYPE_NAMES.user);
	      sym = 'user';
  	    color = 'blue';
  	    break;
    	case MENU_ITEM_SEC_ROLES:
        secTypeName = capitalize(SEC_TYPE_NAMES.role);
	      sym = 'users';
  	    color = 'green';
//        nameColWidth = 5;
  	    break;
  	  default:
        secTypeName = capitalize(SEC_TYPE_NAMES.perm);
	      sym = permsSymbol;
  	    color = 'brown';
  	  	break;
  	 }

     const permStyle = (val) => {
      return {
        textDecoration: val ? 'none' : 'line-through',
        color: val ? 'green' : 'red'
        };
     };


    let contentOffset = 5;
/*
    let content = (<Col xs={nameColWidth} xsOffset={0} style={nameStyle}>
      <span><strong>{item.name}</strong></span>
    </Col>);
*/
    let content;
/*
     = (<div style={nameStyle}>
      <span><strong>{item.name}</strong></span>
    </div>);
*/
    if (item.secType === MENU_ITEM_SEC_USERS) {

      const roleNamesStyle = { 
        display: 'flex',
        flex: '3 1 auto',        
        flexFlow: ' row nowrap',
        height: '90%',
        maxWidth: 300,
        minWidth: 150,

        fontStyle: 'italic', 
        overflow: 'hidden', 
        textOverflow: 'ellipsis',
//        position: 'absolute',

        whiteSpace: 'nowrap',

        borderWidth: 2,
        borderColor: 'lightgreen',
//        borderStyle: 'solid'
      };

      contentOffset = 2;
      let roleNamesDiv;

      if (Array.isArray(roleNames) && roleNames.length > 0) { 
        roleNamesDiv = roleNames.map((roleName, index) => {
          if (index > 0) {
            return (<span key={index}>, {roleName}</span>);
          }
          
          return (<span key={index}>{roleNames.length > 1 ? 'roles' : 'role'}: {roleName}</span>);          
        }); 
      } else if (onShowEditor) {
        roleNamesDiv = (<span>{'role: none'}</span>);
      }
      
      content = (
        <span style={roleNamesStyle}>
          {roleNamesDiv}
        </span>);
    } else if (item.secType === MENU_ITEM_SEC_PERMS) {

      const permBtnStyle = {     
        backgroundColor, 
        outline,
//        pointerEvents: typeof(item.role_id) === 'string' || item.role_id > 1 ? 'inherit' : 'none', 
        cursor: item.role_id === 1 ? 'not-allowed' : 'pointer'
      };

      contentOffset = 0;
//         <span><strong>{item.name}</strong></span>

      content =
      (<div style={permsStyle}>
        {item.Display !== undefined ? (<Button bsSize="small"
          bsStyle="link" 
          style={permBtnStyle}
          onClick={(e) => {
            handlePermChange(item.index, 'Display');
          }}>
            <span style={permStyle(item.Display)}>View</span>
          </Button>) : (<div />)}
        {item.Configure !== undefined ? (<Button bsSize="small"
          bsStyle="link" 
          style={permBtnStyle}
          onClick={(e) => {
            handlePermChange(item.index, 'Configure');
          }}>
          <span style={permStyle(item.Configure)}>Configure</span>
          </Button>) : (<div />)}
        {item.Admin !== undefined ? (<Button bsSize="small"
          bsStyle="link" 
          style={permBtnStyle}
          onClick={(e) => {
            handlePermChange(item.index, 'Admin');
          }}>
          <span style={permStyle(item.Admin)}>Admin</span>
          </Button>) : (<div />)}
      </div>);
    }

    const editStyle = {
      display: item.secType !== MENU_ITEM_SEC_PERMS ? 'flex' : 'none',
      flex: '0 0 auto',        
      flexFlow: ' row nowrap',
      justifyContent: 'space-between',

      height: '90%',
      width: 70,

      borderWidth: 2,
      borderColor: 'pink',
//      borderStyle: 'solid'
    };

		return (
      <div style={compStyle(color)}>
        <div style={colIconStyle}>
          {connectDragSource(<span><i className={`fa fa-${sym} fa-lg`} aria-hidden="true" /></span>)}
        </div>
        <div style={nameStyle}>
          <span><strong>{item.name}</strong></span>
        </div>
        {content}
        <div style={editStyle}>
          <div style={colStyle}>
            <span key={0} style={ { 
              // color: typeof(item.id) === 'string' || item.id > 1 ? 'inherit' : 'red', 
              // pointerEvents: typeof(item.id) === 'string' || item.id > 1 ? 'inherit' : 'none', 
              // cursor: typeof(item.id) === 'string' || item.id > 1 ? 'pointer' : 'not-allowed', 
              cursor: 'pointer',
              display: onShowEditor ? 'inherit' : 'none' } } onClick={(e) => {
  //            console.log('edit item clicked!', item);
              e.preventDefault();
              onShowEditor(item.secType, true, item);
            }}><i className="fa fa-pencil-square-o fa-lg" aria-hidden="true"></i></span>
          </div>
          {item.secType !== MENU_ITEM_SEC_PERMS ?
          (<div style={colStyle}>
            <span style={{ 
              // display: typeof(item.id) === 'string' || item.id > 1 ? 'inherit' : 'none', 
              color: typeof(item.id) === 'string' || item.id > 1 ? 'inherit' : 'red', 
              pointerEvents: typeof(item.id) === 'string' || item.id > 1 ? 'inherit' : 'none', 
              cursor: typeof(item.id) === 'string' || item.id > 1 ? 'pointer' : 'not-allowed', 
              display: onDelete && typeof(item.id) === 'string' || item.id > 1 ? 'inherit' : 'none' }} key={2} 
              onClick={(e) => {
                // console.log('edit item clicked!');
                e.preventDefault();
               
                confirm('Are you sure?', {
                  description: `Would you like to delete ${secTypeName}, \"${item.name}\"?`,
                  confirmLabel: 'Delete',
                  abortLabel: 'Cancel'
                }).then(() => {
                  onDelete(item.secType, item);
                });

              }}>
              <i className="fa fa-trash fa-lg" aria-hidden="true">
            </i></span>
          </div>) : undefined}
        </div>        
      </div>

      /*
      <Row style={compStyle(color)}>
        <Col xs={2} xsOffset={0} style={colIconStyle}>
          {connectDragSource(<span><i className={`fa fa-${sym} fa-lg`} aria-hidden="true" /></span>)}
        </Col>
        {content}
				<Col xs={1} xsOffset={contentOffset} style={colStyle}>
	        <span key={0} style={ { cursor: 'pointer', display: onShowEditor ? 'inherit' : 'none' } } onClick={(e) => {
//	          console.log('edit item clicked!', item);
	          e.preventDefault();
	          onShowEditor(item.secType, true, item);
	        }}><i className="fa fa-pencil-square-o fa-lg" aria-hidden="true"></i></span>
				</Col>
        {item.secType !== MENU_ITEM_SEC_PERMS ?
        (<Col xs={1} xsOffset={0} style={colStyle}>
          <span style={{ cursor: 'pointer', display: onDelete ? 'inherit' : 'none' }} key={2} onClick={(e) => {
            // console.log('edit item clicked!');
            e.preventDefault();
           
            confirm('Are you sure?', {
              description: `Would you like to delete ${secTypeName}, \"${item.name}\"?`,
              confirmLabel: 'Delete',
              abortLabel: 'Cancel'
            }).then(() => {
            	onDelete(item.secType, item);
            });

          }}>
            <i className="fa fa-trash fa-lg" aria-hidden="true">
          </i></span>
        </Col>) : undefined}
      </Row> 
      */
			);
	}

}

function mapStateToProps(state, props) {

  const { item, onShowEditor } = props;

  if (item.secType === MENU_ITEM_SEC_USERS && onShowEditor) {
    let roleNames = [];

    if (window.native) {
      roleNames = item.roles.map((role) => {
        return role.name;
      });
    } else {
      const { [MENU_ITEM_SEC_ROLES]: rolesState } = state.sec;
      const rolesList = rolesState.list || [];

      rolesList.forEach((role) => {

        let index = -1;

        if (role.userIds) {
          index = role.userIds.findIndex((userId) => {
            return userId === item.id;
          });
        }

        if (index > -1) {
          roleNames.push(role.name);
        }

      });
    }

    return {
      roleNames
    };
  }

  return {
  };
}

module.exports = _flow(
  dragSource(DndItemTypes.SECITEM, secItemDragSource, collectForDragSource),
  connect(mapStateToProps)
)(SecItem);
