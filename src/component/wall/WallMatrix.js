/* eslint react/prop-types: 0 no-console: 0 */

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './actions';
import { Well, Collapse, Button, Overlay, Label, Grid, Row, Col } 
  from 'react-bootstrap';
import WallMatrixRow from './WallMatrixRow';

class WallMatrix extends Component {

  componentWillMount() {
	}

  render() {

    const { formData } = this.props;

    const compStyle = {
//      overflow: 'auto',
      display: 'flex',
      flex: '1 0 auto',
//      flexBasis: 'fit-content',
      minHeight: 100,
      flexFlow: 'column nowrap',
      paddingBottom: 20
    };

    const rows = [];

    let row = 0;
    
    for (; formData && row < formData.rows; row++) {
      rows.push(
        <WallMatrixRow key={row} row={row} /> 
        );
    }

    let content;

    if (formData && formData.rows > 0 && formData.columns > 0) {
      content = rows;
    } else {
      content = (<div style={{ textAlign: 'center', paddingTop: 40 }}>Please set the values for Rows and Columns below to greater than zero.</div>);
    }

    return (
      <Well style={compStyle}>
        {content}
      </Well>
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

export default connect(mapStateToProps, mapDispatchToProps)(WallMatrix);

