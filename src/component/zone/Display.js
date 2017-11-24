/* eslint react/prop-types: 0 no-console: 0 */

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './actions';
import { Well, Collapse, Button, Overlay, Label, Grid, Row, Col } 
  from 'react-bootstrap';
import { findDOMNode } from 'react-dom';
import { DropTarget as dropTarget } from 'react-dnd';
import { DndItemTypes } from '../../constant/dndItemTypes';
import Device from '../device/Device';


class Display extends Component {

  constructor(props) {
    super(props);
    this.findIndexInDeviceList = this.findIndexInDeviceList.bind(this);
    this.state = { deviceSettings: undefined };
  }

  componentWillMount() {
    this.findIndexInDeviceList(this.props);
  }

  componentWillReceiveProps(newProps) {
    this.findIndexInDeviceList(newProps);
  }

  findIndexInDeviceList(props) {
    const { decoders, displayMac, row, column } = props;

    function findStatus(status) {
      return status.gen.mac === displayMac;
    }

    let index = -1;
    if (decoders && decoders.status && decoders.status.info) {
      index = decoders.status.info.text.findIndex(findStatus);
    }

    if (index > -1) {
      const deviceSettings = {};
      deviceSettings.status = decoders.status.info.text[index];      
      deviceSettings.config = decoders.config.info.text[index];
      deviceSettings.capabilities = decoders.capabilities.info.text[index];      
      this.setState({ deviceSettings });
    }
  }

  render() {

    const { deviceSettings } = this.state;
    const { removeDisplay, displayMac, isConfig } = this.props;

//    console.log('Display', isConfig);

    const compStyle = {      
      display: deviceSettings ? 'flex' : 'none',
      flex: '0 0 auto',
      flexFlow: 'row wrap',
      width: 105,
      height: 105
    };

    const emptyCellStyle = {      
      display: deviceSettings ? 'flex' : 'none',
      flex: '0 0 auto',
      flexFlow: 'row wrap',
      width: 100,
      height: 100,
      borderWidth: '3px',
      borderColor: 'lightblue',
      borderStyle: !deviceSettings ? 'solid' : 'none',
      borderRadius: 10,
      margin: 5
    };

    const containerStyle = {
      display: 'block',
      position: 'relative'
    };

    const devStyle = {
      position: 'absolute',
      left: 5,
      top: 5,
//      margin: 5
    };

    const editStyle = {
      position: 'absolute',
      top: 10,
      left: 83,
      zIndex: 99,

      borderWidth: '2px',
      borderColor: 'purple',
      display: removeDisplay ? 'inherit' : 'none'
    };

//    let devDiv = (<div>{`${row},${column}, ${formData.matrix[row][column]}`}</div>);
    let devDiv;
//  data-tip={'clear decoder'}
    if (deviceSettings) {
      devDiv = (
        <div style={containerStyle}>     
          <div style={editStyle}>
            {isConfig ? (<span className="devModel" style={ { cursor: 'pointer' } } key={2} onClick={(e) => {
              // console.log('edit item clicked!');
              e.preventDefault();
              removeDisplay(deviceSettings.status.gen.mac);
            }}>
              <i className="fa fa-trash fa-lg" aria-hidden="true">
            </i></span>) : (<span />)}
          </div>
          <div style={devStyle}>
            <Device
              settings={deviceSettings}
              container={this} />
          </div>
        </div>);
    } else {
      devDiv = (<div style={emptyCellStyle} />);
    }

    return (
      <div style={compStyle}>
        {devDiv}
    </div>
    );
  }
}

function mapStateToProps(state) {

  const { decoders } = state.device;
//  const { formData } = state.zone;

  return {
    decoders
//    formData
  };

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Display);
