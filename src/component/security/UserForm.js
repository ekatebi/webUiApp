import { Well, Collapse, form, Button, Checkbox, fieldset,
  ButtonToolbar, ControlLabel, FormControl } 
  from 'react-bootstrap';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './actions';
import {
	passwordRules,
	strongRegex,
	mediumRegex
 } from './constants';

class UserForm extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
		const { secType, item, decrypt } = this.props;
//		this.setState({ pw: decrypt(item.pw), pwv: decrypt(item.pwv) });
  }

  componentWillReceiveProps(newProps) {
		const { secType, item, decrypt } = this.props;
		
		if (newProps.item.pw !== this.props.item.pw) {
//			this.setState({ pw: decrypt(item.pw) });
		}

		if (newProps.item.pwv !== this.props.item.pwv) {
//			this.setState({ pwv: decrypt(item.pwv) });
		}
  }

	render() {

		const { secType, item, itemChanged, decrypt, encrypt, 
			onPwChanged, onPwvChanged, pw, pwv } = this.props;

//		console.log('UserForm', item);

		const compStyle = {
      display: 'block',
      textAlign: 'left',
      flex: '1',
//      width: '100%',
      flexFlow: 'column nowrap',
      justifyContent: 'space-around',
      alignItems: 'flex-start',

      overflow: 'auto',
      
      borderWidth: 2,
      borderColor: 'lightgreen',
//      borderStyle: 'solid',
//      marginTop: 20,
//      minWidth: 455,
//			width: '100%'
		};

    const rowStyle = {
      margin: 0,
      padding: 0
    };

/*
    if (window.diag) {
	  	console.log(strongRegex.test(pw), pw.length, pw);
	 	}
*/
    const pwStyle = { 
    	width: '100%', 
    	backgroundColor: pw && strongRegex.test(pw) ? 'lightgreen' : 'pink'
    };

    const pwVerifyStyle = { 
    	width: '100%', 
    	backgroundColor: pw === pwv && strongRegex.test(pwv) ? 'lightgreen' : 'pink'
    };
            
		return (
				<div style={compStyle} >

	        <div className="form-group row" style={rowStyle}>
	          <div className="form-group col-sm-12">
	            <ControlLabel>Full Name</ControlLabel>
	            <FormControl className="input-sm" style={{ width: '100%' }}
	              type="text"
	              value={item.name}
	              autoFocus
	              placeholder=""
	              disabled={typeof(item.id) === 'number' && item.id === 1}
	              onChange={(e) => {
	              	itemChanged(secType, { ...item, name: e.target.value });
	              }} />
	          </div>
	        </div>
	        <div className="form-group row" style={rowStyle}>
	          <div className="form-group col-sm-12">
	            <ControlLabel>User ID</ControlLabel>
	            <FormControl className="input-sm" style={{ width: '100%' }}
	              type="text"
	              value={item.userId}
	              autoFocus
	              placeholder=""
	              disabled={typeof(item.id) === 'number' && item.id === 1}
	              onChange={(e) => {
	              	itemChanged(secType, { ...item, userId: e.target.value });
	              }} />
	          </div>
	        </div>
	        <div className="form-group row" style={rowStyle}>
	          <div className="form-group col-sm-12">
	            <ControlLabel>Password
	            	<span style={{ marginLeft: 10, fontSize: 9, fontStyle: 'italic' }}>              
	            		{passwordRules}
	            	</span>
	            </ControlLabel>
	            <FormControl className="input-sm" style={pwStyle}
	              type="password"
	              value={pw || ''}
	              autoFocus
	              placeholder=""
//                disabled={typeof(item.id) === 'number' && item.id === 1}
	              onChange={(e) => {
		              onPwChanged(secType, item, e.target.value);
	              }} />
	          </div>
	        </div>

	        <div className="form-group row" style={rowStyle}>
	          <div className="form-group col-sm-12">
	            <ControlLabel>Password Verification</ControlLabel>
	            <FormControl className="input-sm" style={pwVerifyStyle}
	              type="password"
	              value={pwv || ''}
	              autoFocus
	              placeholder=""
//                disabled={typeof(item.id) === 'number' && item.id === 1}
	              onChange={(e) => {
		              onPwvChanged(secType, item, e.target.value);
	              }} />
	          </div>
            <Checkbox className="input-sm" 
            	checked={item.forcePwChange === undefined ? false : item.forcePwChange}
//              disabled={typeof(item.id) === 'number' && item.id === 1}
              onChange={(e) => {
	              itemChanged(secType, { ...item, 
	              	forcePwChange: item.forcePwChange === undefined ? true : !item.forcePwChange });
              }}>
              Force password change on next sign in
            </Checkbox>
	        </div>	        
				</div>
			);
	}

}

function mapStateToProps(state, props) {

//  console.log('mapStateToProps', props);

  const { id } = props.settings;
  const { [id]: subState } = state.sec;

//  console.log('subState', subState);

  return {
    secType: id,
    item: subState.item.data,
    pw: subState.pw || '',
    pwv: subState.pwv || ''
  };

}

function mapDispatchToProps(dispatch) {
 return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UserForm);
