import { Well, Collapse, form, Button, Checkbox, fieldset,
  ButtonToolbar, ControlLabel, FormControl } 
  from 'react-bootstrap';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Panel from '../Panel';
import * as actions from './actions';
import UserForm from './UserForm';
import RoleForm from './RoleForm';

import {
  strongRegex,
  mediumRegex
 } from './constants';

import {
  MENU_ITEM_SEC_USERS,
  MENU_ITEM_SEC_ROLES,
  MENU_ITEM_SEC_PERMS
  } from '../appMenu/constants';

class SecEditor extends Component {

	render() {
		const { secType, settings, onShowEditor, item, onSave, encrypt, pw, pwv } = this.props;

//    console.log('SecEditor, pw', pw);
			
		let form;

		switch (secType) {
			case MENU_ITEM_SEC_USERS:
				form = (<UserForm settings={settings} />);
				break;
			case MENU_ITEM_SEC_ROLES:
				form = (<RoleForm settings={settings} />);
				break;
			default:
				break;
		}

    const paneStyle = {
      display: 'flex',
      flex: '1 1 auto',
      flexFlow: 'column nowrap',
//      height: '100%',
//      width: '100%'
      minWidth: 350
//      borderWidth: '2px',
//      borderColor: 'green',
//      borderStyle: 'solid'

    };

    const contentStyle = {
      display: 'flex',
      flex: '1',
      flexFlow: 'column nowrap',
//      height: '100%',
//      width: '100%'
//      minWidth: 400
      borderWidth: 2,
      borderColor: 'green',
//      borderStyle: 'solid'

    };

    const formStyle = {
      display: 'flex',
      flex: '10',
      borderWidth: 2,
      borderColor: 'lightGreen',
//      borderStyle: 'solid'
    };

    const botStyle = {
      display: 'flex',
//      flex: '1',      
      flexFlow: 'row nowrap',
      justifyContent: 'space-between',
      height: 20,
      marginTop: 5,
      paddingLeft: 30,
      paddingRight: 30,
      height: 30,
//      minWidth: 455
//      width: '100%'
      borderWidth: 2,
      borderColor: 'green',
//      borderStyle: 'solid'

    };

    let title = 'Editor';

    if (item && item.data && item.data.name) {
      title += ` - ${item.data.name}`; 
    }

    let enableSave = false;

    if (secType === MENU_ITEM_SEC_USERS) {
      enableSave = item && item.dirty && item.data && item.data.name && 
      pw === pwv &&
      strongRegex.test(pw);
    } else if (secType === MENU_ITEM_SEC_ROLES) {
      enableSave = item && item.dirty && item.data && item.data.name;      
    }

//    console.log('SecEditor', item);

		return (
       <Panel style={paneStyle} settings={ { id: settings.id, title, onToggleItem: (id) => {
//        console.log('onToggleItem', id);
       	onShowEditor(secType, false);
       } } } >
        <div style={contentStyle}>
          <div style={formStyle}>
            {form}
          </div>
          <div style={botStyle} >
            <Button style={{ width: 75, height: 30 }} bsSize="xsmall"
              onClick={() => {
                onShowEditor(secType, false);
            }} >Cancel</Button>
            <Button style={{ display: !item.data.id || item.data.id > 0 || 
              typeof(item.data.id) === 'string' ? 'block' : 'none', 
              width: 75, height: 30 }} bsSize="xsmall"
              disabled={!enableSave}
              onClick={() => {

//                console.log('item', item);
                
                let data = { ...item.data };

                if (secType === MENU_ITEM_SEC_USERS) {
                  delete data.pwv;
                  if (window.native) {
                    data.pw = actions.decrypt(data.pw);
                  }
                  data.forcePwChange = data.forcePwChange === true ? 1 : 0;
                }

                onSave(secType, data);

            }} >Save</Button>
          </div>
        </div>
       </Panel>
			);	
	}
}

function mapStateToProps(state, props) {

  const { id } = props.settings;
  const { [id]: subState } = state.sec;

  return {
    secType: id,
    item: subState.item,
    pw: subState.pw,
    pwv: subState.pwv,
  };

}

function mapDispatchToProps(dispatch) {
 return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SecEditor);
