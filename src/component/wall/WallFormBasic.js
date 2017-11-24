/* eslint react/prop-types: 0 no-console: 0 */

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './actions';
import { Well, Collapse, form, Button, Checkbox, fieldset,
  ButtonToolbar, ControlLabel, FormControl } 
  from 'react-bootstrap';

class WallFormBasic extends Component {

  componentWillMount() {
	}

  render() {

    const { formData, formDataChanged } = this.props;

    const compStyle = {      
      display: 'block',
      textAlign: 'left',
      flex: '1',
//      width: 400,
      flexFlow: 'column nowrap',
      justifyContent: 'space-around',
      alignItems: 'flex-start',
      borderWidth: '2px',
      borderColor: 'green',
//      marginTop: 20,
//      borderStyle: 'solid'
    };

    const rowStyle = {
      margin: 0,
      padding: 0
    };

    return (
      <div style={compStyle}>
        <div className="form-group row" style={rowStyle}>

          <div className="form-group col-sm-8">
            <ControlLabel>Name</ControlLabel>
            <FormControl className="input-sm" style={{ minWidth: 150 }}
              type="text"
              value={formData ? formData.name : ''}
              autoFocus
              placeholder="Wall Name"
              disabled={formData && formData.index > -1}
              onChange={(e) => {
                formDataChanged({ ...formData, name: e.target.value });
              }} />
          </div>
        </div>
        <div className="form-group row" style={rowStyle}>
          <div className="form-group col-sm-6">
            <ControlLabel>Rows</ControlLabel>
            <FormControl className="input-sm" style={{ minWidth: 70 }}
              type="number"
              min={0}
              max={5}
              value={formData ? formData.rows : 0}
              autoFocus
              placeholder=""
              onChange={(e) => {
                formDataChanged({ ...formData, rows: Number(e.target.value) });
              }} />
          </div>
        </div>
        <div className="form-group row" style={rowStyle}>
          <div className="form-group col-sm-6">
            <ControlLabel>Columns</ControlLabel>
            <FormControl className="input-sm" style={{ minWidth: 70 }}
              type="number"
              min={0}
              max={5}
              value={formData ? formData.columns : 0}
              autoFocus
              placeholder=""
              onChange={(e) => {
                formDataChanged({ ...formData, columns: Number(e.target.value) });
              }} />
          </div>

        </div>
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(WallFormBasic);

