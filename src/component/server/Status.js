/* eslint no-console: 0 */

import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Button, Overlay, Label, Grid, Row, Col, Well,
  Form, ControlLabel, FormControl, fieldset } from 'react-bootstrap';
import { fetchServer } from '../../service/apiFetch/server';
import { GET } from '../../constant/app'; 
export default class Status extends Component {

  static propTypes = {
  };

  constructor(props) {
    super(props);
    this.getStatus = this.getStatus.bind(this);
    this.state = { status: null, error: null };
  }

  componentWillMount() {
    // console.log('In Status componentWillMount()');
    this.getStatus();
  }

  getStatus() {
    // console.log('In Status getStatus() 1');
    fetchServer(GET, { getType: 'status' })
    .then(resp => resp.json())
    .catch((error) => {
      appAlert.error('Unable to get server status.', { error });    
    })
    .then(json => {
      // console.log('In Status getStatus() 2:', json);
      if (json.status === 'Success') {
        // console.log('**********************************************************************');
        // console.log('In Status getStatus() 3 setState():', json);
        // console.log('**********************************************************************');
        const status = json.responses[0].text;
        this.setState({ status });
        if (status && status.license.devicesExceeded !== '0') {
          appAlert.error(`Number of up devices, ${status.license.devicesUp}, exceeds the limit by ${status.license.devicesExceeded}. See Server panel, License section.`);
        }
      } else {
        appAlert.error('Unable to get server status', { error: json.status });
      }
    })
    .catch(error => {
      appAlert.error('Unable to get server status', { error });
    });
  }

  render() {
    // console.log('In Status render()');
    const { status } = this.state;

    const legendStyle = {
      padding: '0.2em 0.5em',
      border: '1px solid green',
      color: 'green',
      fontSize: '90%',
      textAlign: 'right'
      };

    const labelStyle = {
      textAlign: 'right',
      marginBottom: '0px',
      paddingTop: '9px',
    };

    const staticStyle = {
      textAlign: 'left',
    };

    const displayValue = status && status.license.devicesExceeded === '0' ? 'none' : 'block';
    const licenseErrorStyle = {
      border: '5px solid red',
      display: displayValue,
    };

    const serverStatus = () => {
      // console.log('In Status serverStatus()');
      if (status === undefined || status === null) {
        const serverStatusEmpty = (
          <div></div>
        );
        return serverStatusEmpty;
      }

      const serverStatusProcessed = (
        <div style={ { width: 320 } }>
          <div style={licenseErrorStyle}>
            Error: Number of devices exceeds the limit by {status.license.devicesExceeded}. See License section below.
          </div>
          <h4>Status</h4>
          <Well>
            <Row>
              <Col xs={5}>
                <ControlLabel style={labelStyle}>Host Name:</ControlLabel>
              </Col>
              <Col xs={7}>
                <FormControl.Static style={staticStyle}>{status.gen.hostname || 'none'}</FormControl.Static>
              </Col>
            </Row>
            <Row>
              <Col xs={5}>
                <ControlLabel style={labelStyle}>IP:</ControlLabel>
              </Col>
              <Col xs={7}>
                <FormControl.Static style={staticStyle}>{status.gen.ip}</FormControl.Static>
              </Col>
            </Row>
            <Row>
              <Col xs={5}>
                <ControlLabel style={labelStyle}>MAC:</ControlLabel>
              </Col>
              <Col xs={7}>
                <FormControl.Static style={staticStyle}>{status.gen.macAddress}</FormControl.Static>
              </Col>
            </Row>
            <Row>
              <Col xs={5}>
                <ControlLabel style={labelStyle}>Version:</ControlLabel>
              </Col>
              <Col xs={7}>
                <FormControl.Static style={staticStyle}>{status.gen.version}</FormControl.Static>
              </Col>
            </Row>
            <Row>
              <Col xs={5}>
                <ControlLabel style={labelStyle}>Serial Number:</ControlLabel>
              </Col>
              <Col xs={7}>
                <FormControl.Static style={staticStyle}>{status.gen.serialNumber}</FormControl.Static>
              </Col>
            </Row>
            <Row>
              <Col xs={5}>
                <ControlLabel style={labelStyle}>Uptime:</ControlLabel>
              </Col>
              <Col xs={7}>
                <FormControl.Static style={staticStyle}>{status.gen.uptime}</FormControl.Static>
              </Col>
            </Row>
            <Row>
              <Col xs={5}>
                <ControlLabel style={labelStyle}>Free Memory:</ControlLabel>
              </Col>
              <Col xs={7}>
                <FormControl.Static style={staticStyle}>{status.gen.freeMem}</FormControl.Static>
              </Col>
            </Row>
          </Well>
        </div>
      );

      return serverStatusProcessed;
    };

    return (
      <Form horizontal>
        {serverStatus()}
      </Form>
    );
  }
}
