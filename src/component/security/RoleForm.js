import { Well, Collapse, form, Button, Checkbox, fieldset,
  ButtonToolbar, ControlLabel, FormControl } 
  from 'react-bootstrap';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import * as actions from './actions';
import SecListDropTarget from './SecListDropTarget';

import {
  SEC_TYPE_NAMES,
  getDefaultPerms,
  } from './constants';

import {
  MENU_ITEM_SEC_USERS,
  MENU_ITEM_SEC_ROLES,
  MENU_ITEM_SEC_PERMS
  } from '../appMenu/constants';

class RoleForm extends Component {

  constructor(props) {
    super(props);
    this.handleSelect = this.handleSelect.bind(this);
    this.handlePermChange = this.handlePermChange.bind(this);
  }

	handleSelect(index, last) {
    const { secType, selectTabIndex } = this.props;
    selectTabIndex(secType, index);
  }

  handlePermChange(index, name) {
    const { secType, item, itemChanged } = this.props;

    if (item.id === 1) {
      return;
    }

    const perms = item.perms || getDefaultPerms();
    const perm = perms[index];

    perm[name] = !perm[name];

    if (name === 'Display' && !perm[name]) {
      if (perm.Configure !== undefined) {
        perm.Configure = false;
      }
      if (perm.Admin !== undefined) {        
        perm.Admin = false;
      }
    } else if ((name === 'Configure' || name === 'Admin') && perm[name]) {
    	perm.Display = true;    	
    }
    
    perms[index] = perm;

	  itemChanged(secType, { ...item, perms: [...perms] });
  }

	render() {

		const { secType, item, itemChanged, selectedTabIndex } = this.props;

		const compStyle = {
			display: 'flex',
			flex: '1',
//      borderWidth: 2,
//      borderColor: 'lightgreen',
//      borderStyle: 'solid',
		};

		const tabPanelStyle = {
			display: 'flex',
			flex: '1',
//      borderWidth: 2,
//      borderColor: 'lightgreen',
//      borderStyle: 'solid',
		};

	const genStyle = {
      display: 'block',
      textAlign: 'left',
      flex: '1',
//      width: '100%',
      flexFlow: 'column nowrap',
      justifyContent: 'space-around',
      alignItems: 'flex-start',

      overflow: 'auto',
      
//      borderWidth: 2,
//      borderColor: 'lightgreen',
//      borderStyle: 'solid',
//      marginTop: 20,
//      minWidth: 455,
//			width: '100%'
		};

//    console.log('RoleForm', item);

		return (
			<div style={compStyle}>
				<Tabs
	        onSelect={this.handleSelect}
//  	      selectedIndex={selectedTabIndex}
        >
  	      <TabList>
  	      	<Tab>General</Tab>
						<Tab>Users</Tab>
	          <Tab>Permissions</Tab>
  	      </TabList>
  	      <TabPanel>
  	      	<Well style={genStyle}>
	            <ControlLabel>Role Name</ControlLabel>
	            <FormControl className="input-sm" style={{ width: '100%' }}
	              type="text"
	              value={item.name}
	              autoFocus
	              placeholder=""
                disabled={typeof(item.id) === 'number' && item.id === 1}
	              onChange={(e) => {
	              	itemChanged(secType, { ...item, name: e.target.value });
	              }} />  	      		
  	      	</Well>
        	</TabPanel>
					<TabPanel>
						<Well style={tabPanelStyle}>						
		          <SecListDropTarget users={item.users || []} userIds={item.userIds || []}
                secType={MENU_ITEM_SEC_USERS} 
		            onAdd={(user) => {

//		            	console.log('onAdd', secType, user, item);

                  if (window.native) {
                    const users = item.users ? [...item.users] : [];
                    users.push(user);
                    itemChanged(secType, { ...item, users: [...users] });
                  } else {
                    const userIds = item.userIds ? [...item.userIds] : [];
                    userIds.push(user.id);
                    itemChanged(secType, { ...item, userIds: [...userIds] });                    
                  }

		            }}	
		            onDelete={(userSecType, user) => {                          
		            	if (window.native) {
                    const users = [...item.users];
                    const index = users.findIndex(u => { return u.id === user.id; });
                    users.splice(index, 1);
                    itemChanged(secType, { ...item, users: [...users] });
                  } else {
                    const userIds = [...item.userIds];
                    const index = userIds.findIndex(userId => { return userId === user.id; });
                    userIds.splice(index, 1);
                    itemChanged(secType, { ...item, userIds: [...userIds] });                    
		              }

		            }} />									
						</Well>
        	</TabPanel>
					<TabPanel>
						<Well style={tabPanelStyle}>
		          <SecListDropTarget perms={item.perms} secType={MENU_ITEM_SEC_PERMS} 
		          	handlePermChange={this.handlePermChange} />									
						</Well>
        	</TabPanel>
  	    </Tabs>
			</div>
			);
	}
}

function mapStateToProps(state, props) {

  const { id } = props.settings;
  const { [id]: subState } = state.sec;

  const item = subState.item.data;

  return {
    secType: id,
    item,
    selectedTabIndex: subState.selectedTabIndex
  };

}

function mapDispatchToProps(dispatch) {
 return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RoleForm);
