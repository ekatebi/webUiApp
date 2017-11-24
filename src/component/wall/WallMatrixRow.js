/* eslint react/prop-types: 0 no-console: 0 */

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './actions';
import { Well, Collapse, Button, Overlay, Label, Grid, Row, Col } 
  from 'react-bootstrap';
import WallCell from './WallCell';

class WallMatrixRow extends Component {

  componentWillMount() {
	}

  render() {

    const { formData, row, formDataChanged } = this.props;

    const compStyle = {      
      display: 'flex',
      flex: '0 0 auto',
      flexFlow: 'row nowrap',
      height: 100,
      margin: 3,
      borderWidth: '2px',
      borderColor: 'yellow',
//      borderStyle: 'solid'
    };

    const columns = [];

    let i = 0;
    
    for (; i < formData.columns; i++) {
      columns.push(
        <WallCell key={i} row={row} column={i} formDataChangedEx={formDataChanged} formDataEx={formData} />
        );
    }

    return (
      <div style={compStyle}>
        {columns}
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

export default connect(mapStateToProps, mapDispatchToProps)(WallMatrixRow);

