import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Tooltip, OverlayTrigger, MenuItem, DropdownButton }
  from 'react-bootstrap';
import _flow from 'lodash/flow';
import * as actions from './actions';
import MvWin from './MvWin';
import MvPoint from './MvPoint';
import { confirm } from '../confirm/service/confirm';
import {
  patterns,
} from './patterns';

class MvPatterns extends Component {

  constructor(props) {
    super(props);
    this.clickHandler = this.clickHandler.bind(this);
    this.selectChanged = this.selectChanged.bind(this);
    this.state = {};
  }

  clickHandler(index) {
    const { loadPattern, item } = this.props;

    if (item.windows.length > 0) {
      confirm('Are you sure?', {
        description: `Would you like to discard the existing windows and load pattern \
        ${patterns[index].name}?`,
        confirmLabel: 'Discard',
        abortLabel: 'Cancel'
      }).then(() => {
        loadPattern(patterns[index].name);
      }).catch(() => {});
    } else {
      loadPattern(patterns[index].name);                
    }
  }

  selectChanged(sel) {
//    console.log('sel', sel);
    
    const { loadPattern, item } = this.props;

    if (item.windows.length > 0) {
      confirm('Are you sure?', {
        description: `Would you like to discard the existing windows and load pattern \
        \"${sel.label}\"?`,
        confirmLabel: 'Discard',
        abortLabel: 'Cancel'
      }).then(() => {
        loadPattern(sel.value);
      }).catch(() => {});
    } else {
      loadPattern(sel.value);                
    }

  }


  render() {

    const { loadPattern } = this.props;

    const compStyle = {
      display: 'flex',
      flex: '1',
      flexFlow: 'row nowrap',
      justifyContent: 'flex-end',
//			alignItems: 'center',
      marginLeft: 10,
      width: 250,
//      overflow: 'auto',

      borderWidth: 2,
      borderColor: 'lightGreen',
//      borderStyle: 'solid'      
    };

    const itemStyle = {
      cursor: 'pointer'
    };

  const patternItems = patterns.map((pat, index) => {
    return (<MenuItem key={index} eventKey={index} onClick={(e) => {
      this.clickHandler(index);
    }}>{pat.desc}</MenuItem>);    
  });

  const patternsDiv = (
    <DropdownButton title="Patterns" id="patterns-dropdown" dropup pullRight bsSize="small">
      {patternItems}
    </DropdownButton>);

    return (
  		<div style={compStyle}>
  			{patternsDiv}
  		</div>);
	}
}

function mapStateToProps(state) {

  const { item } = state.multiview;

  return {
    item
  };

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

module.exports = _flow(
  connect(mapStateToProps, mapDispatchToProps)
)(MvPatterns);
