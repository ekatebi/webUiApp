/* eslint react/prop-types: 0 no-console: 0 */

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './actions';
import { Well, Collapse, form, Button, Checkbox, fieldset,
  ButtonToolbar, ControlLabel, FormControl } 
  from 'react-bootstrap';

class WallFormBezel extends Component {

  render() {

    const { formData, formDataChanged, onRequestUpdateWall } = this.props;

//    console.log('WallFormBezel', this.props);

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
      marginTop: 18,
      marginLeft: -60,
//      borderStyle: 'solid'
    };

    const rowStyle = {
      margin: 0,
      marginTop: 7,
      padding: 0
    };

    const bezelStyle = {
      display: formData && formData.model && (formData.model === 'ZyperUHD' || formData.model === 'ZyperHD') ? 'none' : 'block', 
      borderWidth: '2px',
      borderColor: 'blue',
//      borderStyle: 'solid'
      marginLeft: -15,
    };
/* 

formData && !formData.dirty && !formData.name && formData.name.length < 1 
                && formData.rows.length < 1 && formData.columns.length < 1 
*/
              
    return (
      <div style={compStyle}>
        <div className="form-group row" style={rowStyle}>
          <div className="form-group col-sm-4 col-sm-offset-3">
            <Button className="btn-sm" style={{ minWidth: 70, marginLeft: 20 }} 
              disabled={formData && !formData.dirty || 
                formData && !formData.name || 
                formData && !formData.rows || 
                formData && typeof(formData.rows) === 'number' && formData.rows < 1 ||
                formData && !formData.columns || 
                formData && typeof(formData.columns) === 'number' && formData.columns < 1}
              onClick={() => {
                onRequestUpdateWall();
                }}>{formData && formData.index > -1 ? 'Update' : 'Create'}</Button>
          </div>
        </div>
        <div style={ { width: 300 } }>
          <div style={bezelStyle}>
            <div className="form-group row" style={rowStyle}>
              <div className="form-group col-sm-3 col-sm-offset-4">
                <ControlLabel>&zwnj;</ControlLabel>
                <FormControl className="input-sm" style={{ minWidth: 70 }}
                  type="number"
                  value={formData ? formData.bezel.top : 0}
                  autoFocus
                  placeholder=""
                  onChange={(e) => {
                    formDataChanged({ ...formData, bezel: { ...formData.bezel, top: Number(e.target.value) } });
                  }}
                />
              </div>
            </div>
            <div className="form-group row" style={rowStyle}>
              <div className="form-group col-sm-3 col-sm-offset-1" style={{ marginTop: -21 }}>
                <FormControl className="input-sm" style={{ minWidth: 70 }}
                  type="number"
                  value={formData ? formData.bezel.left : 0}
                  autoFocus
                  placeholder=""
                  onChange={(e) => {
                    // console.log('onChange', 'e.target', e.target, 'e.target.value', e.target.value);
    //                this.textChanged('name', e.target.value);
    //                console.log('number:', e.target.value);
                    formDataChanged({ ...formData, bezel: { ...formData.bezel, left: Number(e.target.value) } });
                  }}
                />
              </div>
              <div className="form-group col-sm-3 col-sm-offset-0" style={{ textAlign: 'center' }}>
                <ControlLabel style={{ marginTop: -15 }}>Bezel</ControlLabel>
                <FormControl className="input-sm" style={{ minWidth: 70 }}
                  type="number"
                  value={formData ? formData.bezel.bottom : 0}
                  autoFocus
                  placeholder=""
                  onChange={(e) => {
                    // console.log('onChange', 'e.target', e.target, 'e.target.value', e.target.value);
    //                this.textChanged('name', e.target.value);
    //                console.log('number:', e.target.value);
                    formDataChanged({ ...formData, bezel: { ...formData.bezel, bottom: Number(e.target.value) } });
                  }}
                />
              </div>

              <div className="form-group col-sm-3 col-sm-offset-0" style={{ marginTop: -21 }}>
                <FormControl className="input-sm" style={{ minWidth: 70 }}
                  type="number"
                  value={formData ? formData.bezel.right : 0}
                  autoFocus
                  placeholder=""
                  onChange={(e) => {
                    // console.log('onChange', 'e.target', e.target, 'e.target.value', e.target.value);
    //                this.textChanged('name', e.target.value);
    //                console.log('number:', e.target.value);
                    formDataChanged({ ...formData, bezel: { ...formData.bezel, right: Number(e.target.value) } });
                  }}
                />
              </div>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(WallFormBezel);

