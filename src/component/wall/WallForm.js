/* eslint react/prop-types: 0 no-console: 0 */

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './actions';
import { Well, Collapse, form, Button, Checkbox, fieldset,
  ButtonToolbar, ControlLabel, FormControl } 
  from 'react-bootstrap';
import WallFormBasic from './WallFormBasic';
import WallFormBezel from './WallFormBezel';

class WallForm extends Component {

  componentWillMount() {
	}

  render() {

    const { formData, formDataChanged } = this.props;

    const compStyle = {      
      display: 'block',
      textAlign: 'left',
      flex: '1',
      width: 370,
      flexFlow: 'column nowrap',
      justifyContent: 'space-around',
      alignItems: 'flex-start',
      borderWidth: '2px',
      borderColor: 'green',
//      borderStyle: 'solid',
      marginTop: 5,
    };

    const rowStyle = {
      margin: 0,
      padding: 0
    };

    const bezelStyle = {
      margin: 0,
      padding: 0,
      borderWidth: '2px',
      borderColor: 'blue',
      borderStyle: 'solid'
    };

    return (
      <form style={compStyle}>
        <div className="form-group row" style={rowStyle}>
          <div className="form-group col-sm-5">
            <WallFormBasic />
          </div>
          <div className="form-group col-sm-7">
            <WallFormBezel />
          </div>
        </div>
      </form>
    );	
  }
}

function mapStateToProps(state) {

  const { formData } = state.wall;

  return {
    formData
  };

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(WallForm);

