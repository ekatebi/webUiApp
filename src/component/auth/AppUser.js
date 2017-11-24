/* eslint react/prop-types: 0 no-console: 0 */

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _flow from 'lodash/flow';
import { Button, FormGroup, FormControl, ControlLabel, Modal, NavDropdown, MenuItem, 
	Popover, OverlayTrigger }
  from 'react-bootstrap';
import Loader from 'react-loader';
// import { browserHistory, Router, Route, Link, withRouter } from 'react-router';
import classNames from 'classnames';
import { appName } from '../../constant/app';
import * as authActions from './actions';
import * as secActions from '../security/actions';
import ToolTip from '../ToolTip';

import {
  MENU_ITEM_SEC_USERS,
  MENU_ITEM_SEC_ROLES
  } from '../appMenu/constants';

class AppUser extends Component { 
  constructor(props) {
    super(props);
    this.state = { toggle: true };
  }

  render() {
  	const { token, authActions } = this.props;

    const compStyle = {
      display: 'flex',
      flex: '0 0 auto',
      flexFlow: 'row nowrap',
      alignSelf: 'flex-end',
      justifyContent: 'center',
      marginRight: 15,

    };

    const popoverStyle = {
      display: 'flex',
      flex: '0 0 auto',
      flexFlow: 'column nowrap',

//      alignSelf: 'flex-end',
      justifyContent: 'space-around',
//      alignContent: 'center',

      borderWidth: 2,
      borderColor: 'lightgreen',
//      borderStyle: 'solid'
    };

	const popoverBottom = (
	  <Popover id="popover-positioned-bottom">
      <div style={popoverStyle}>
        <ToolTip placement="left" tooltip={ 'Logged-in user\'s role' }>
    	  	<div style={{ display: 'flex', flex: '0 0 auto', alignSelf: 'center' }}>
            {token && token.role ? `${token.role.name}` : 'none'}
          </div>
        </ToolTip>
  	    <Button className="btn btn-link" style={{ outline: 'none', borderRadius: 10 }}
  	      	onClick={(e) => {
  	      		authActions.onSignOut();
  	      		e.preventDefault();
  	      	}}>Sign Out</Button>
      </div>
	  </Popover>
	);

	return (
		<div style={compStyle}>
	    <OverlayTrigger trigger="click" placement="bottom" overlay={popoverBottom} rootClose >
  	      <Button className="btn btn-link" style={{ outline: 'none', borderRadius: 10 }}>
            <ToolTip placement="left" tooltip={ 'Logged-in user' }>
              <span>{ token && token.name ? token.name : 'none' }</span>
            </ToolTip>
          </Button>
	    </OverlayTrigger>
	  </div>
	);

  }
}

function mapStateToProps(state) {
  const { fetching, showModal, error, token } = state.auth;

  return {
    fetching,
    showModal,
    token,
    error,
  };
}

function mapDispatchToProps(dispatch) {
 return {
      authActions: bindActionCreators(authActions, dispatch),
      secActions: bindActionCreators(secActions, dispatch)
    };
}

module.exports = _flow(
  connect(mapStateToProps, mapDispatchToProps)
)(AppUser);
