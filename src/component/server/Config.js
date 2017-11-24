/* eslint no-console: 0 */

import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Button, Radio, Overlay, Label, Grid, Row, Col,
  Form, fieldset, Well, ControlLabel, FormControl } from 'react-bootstrap';
import Panel from '../Panel';
import { fetchServer, fetchUpdateServer } from '../../service/apiFetch/server';
import Dropzone from 'react-dropzone';
import {
  GET,
  SET,
  ACTION,
  CONFIG,
  REDUNDANCY,
  EDID,
  IGMP,
  LICENSE,
  PREFERRED,
  RESTART,
  REBOOT,
  SHUTDOWN,
  TROUBLE,
  SWITCHOVER,
  backEndHost
} from '../../constant/app';
import { confirm } from '../confirm/service/confirm';
import { getHeartbeat } from './Heartbeat';

export default class Config extends Component {

  static propTypes = {
  };

  constructor(props) {
    super(props);
    this.getStatus = this.getStatus.bind(this);
    this.getConfig = this.getConfig.bind(this);
    this.getRedundancy = this.getRedundancy.bind(this);
    this.setConfigEdid = this.setConfigEdid.bind(this);
    this.setConfigIgmp = this.setConfigIgmp.bind(this);
    this.setConfigAction = this.setConfigAction.bind(this);
    this.setLicense = this.setLicense.bind(this);
    this.setPreferredMasterSlave = this.setPreferredMasterSlave.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onSoftwareUpdated = this.onSoftwareUpdated.bind(this);
    this.onLicenseChanged = this.onLicenseChanged.bind(this);
    this.onLicenseUpdated = this.onLicenseUpdated.bind(this);
    this.state = { status: null, config: null, error: null };
  }

  componentWillMount() {
    // console.log('In Config componentWillMount()');
    this.getStatus();
    this.getConfig();
    this.getRedundancy();
  }

  getStatus() {
    // TODO Use GET_STATUS here instead of hardcoded string. Set it up somewhere else.
    fetchServer(GET, { getType: 'status' })
    .then(resp => resp.json())
    .catch((error) => {
      appAlert.error('Server Config - Unable to contact server', error);
    })
    .then(json => {
      if (!json) {
        appAlert.error('Server Config - Unable to parse server status information');
      } else {
        if (json.responses[0].errors.length === 0) {
          this.setState({ status: json.responses[0].text });
        } else {
          appAlert.error(`Config - Failed to get server status info, ${json.responses[0].errors.join(', ')}`);
        }
      }
    })
    .catch(error => {
      appAlert.error('Server Config - Failed to get server status information', error);
    });
  }

  getConfig() {
    fetchServer(GET, { getType: CONFIG })
    .then(resp => resp.json())
    .catch((error) => {
      appAlert.error('Unable to contact server', error);
    })
    .then(json => {
      if (json.responses[0].errors.length === 0) {
        this.setState({ config: json.responses[0].text });
      } else {
        appAlert.error(`Failed to get server config info, ${json.responses[0].errors.join(', ')}`);
      }
    })
    .catch(error => {
      appAlert.error('Failed to get server config information', error);
    });
  }

  getRedundancy() {
    fetchServer(GET, { getType: REDUNDANCY })
    .then(resp => resp.json())
    .catch((error) => {
      appAlert.error('Unable to contact server', error);
    })
    .then(json => {
      if (json.responses[0].errors.length === 0) {
        this.setState({ redundancy: json.responses[0].text });
      } else {
        appAlert.error(`Failed to get server redundancy info, ${json.responses[0].errors.join(', ')}`);
      }
    })
    .catch(error => {
      appAlert.error('Failed to get server redundancy information', error);
    });
  }

  setConfigEdid(edid) {
    // console.log('In Config setConfigEdid() 1');
    fetchServer(SET, { setType: EDID, edid })
    .then(resp => resp.json())
    .catch((err) => {
      appAlert.error(err);
    })
    .then(json => {
      if (json.responses[0].errors.length === 0) {
        appAlert.success(`EDID mode set to ${edid}`);
        this.getConfig();
      } else {
        appAlert.error(`Failed to set EDID mode, ${json.responses[0].errors.join(', ')}`);
        // Also, get information from the device and display it in the GUI.
        this.getConfig();
      }
    })
    .catch(error => {
      appAlert.error('Failed to set EDID mode.', error);
      // Also, get information from the device and display it in the GUI.
      this.getConfig();
    });
  }

  setConfigIgmp(igmp) {
    // console.log('In Config setConfigIgmp() 1');
    fetchServer(SET, { setType: IGMP, igmp })
    .then(resp => resp.json())
    .catch((err) => {
      appAlert.error(err);
    })
    .then(json => {
      if (json.responses[0].errors.length === 0) {
        appAlert.success(`IGMP Querier Mode set to ${igmp}`);
        this.getConfig();
      } else {
        appAlert.error(`Failed to set IGMP Querier Mode, ${json.responses[0].errors.join(', ')}`);
        // Also, get information from the device and display it in the GUI.
        this.getConfig();
      }
    })
    .catch(error => {
      appAlert.error('Failed to set IGMP Querier Mode', error);
      // Also, get information from the device and display it in the GUI.
      this.getConfig();
    });
  }

  setConfigAction(action) {
    const fullMessage = {
      [RESTART]: {
        success: 'Successfully sent command to Restart server.',
        error: 'Failed to send command to Restart server.'
      },
      [REBOOT]: {
        success: 'Successfully sent command to Reboot server.',
        error: 'Failed to send command to Reboot server.'
      },
      [SHUTDOWN]: {
        success: 'Successfully sent command to Shutdown server.',
        error: 'Failed to send command to Shutdown server.'
      },
      [TROUBLE]: {
        success: 'Successfully sent command to create Trouble Report.',
        error: 'Failed to send command to create Trouble Report.'
      },
      [SWITCHOVER]: {
        success: 'Successfully sent command to switchover to redundant server.',
        error: 'Failed to send command to switchover to redundant server.'
      },
    };

    // console.log('In Config setConfigAction() 1');
    fetchServer(ACTION, { action })
    .then(resp => resp.json())
    .catch((error) => {
      appAlert.error('Failed to contact server.', error);
    })
    .then(json => {
      // console.log('In Config setConfigAction() 2:', json);
      if (json.responses[0].errors.length === 0) {
        // console.log('In Config setConfigAction() 3 success:');
        appAlert.success(fullMessage[action].success);
      } else {
        appAlert.error(`${fullMessage[action].error}, ${json.responses[0].errors.join(', ')}`);
        // Also, get information from the device and display it in the GUI.
        this.getConfig();
        this.getRedundancy();
      }
    })
    .catch(error => {
      appAlert.error(fullMessage[action].error, error);
      // Also, get information from the device and display it in the GUI.
      this.getConfig();
      this.getRedundancy();
    });
  }

  setLicense(license) {
    fetchServer(SET, { setType: LICENSE, license })
    .then(resp => resp.json())
    .catch((err) => {
      appAlert.error(err);
    })
    .then(json => {
      if (json.responses[0].errors.length === 0) {
        appAlert.success(`License set to ${license}`);
        this.getStatus();
      } else {
        appAlert.error(`Failed to set license, ${json.responses[0].errors.join(', ')}`);
        // Also, get information from the device and display it in the GUI.
        this.getStatus();
      }
    })
    .catch(error => {
      appAlert.error('Failed to set licesne.', error);
      // Also, get information from the device and display it in the GUI.
      this.getStatus();
    });
  }

  setPreferredMasterSlave(preferred) {
    // console.log('In Config setPreferredMasterSlave() 1');
    fetchServer(SET, { setType: PREFERRED, preferred })
    .then(resp => resp.json())
    .catch((err) => {
      appAlert.error(err);
    })
    .then(json => {
      if (json.responses[0].errors.length === 0) {
        appAlert.success(`Preferred mode set to ${preferred}`);
        this.getRedundancy();
      } else {
        appAlert.error(`Failed to set preferred mode, ${json.responses[0].errors.join(', ')}`);
        // Also, get information from the device and display it in the GUI.
        this.getRedundancy();
      }
    })
    .catch(error => {
      appAlert.error('Failed to set preferred mode.', error);
      // Also, get information from the device and display it in the GUI.
      this.getRedundancy();
    });
  }

  onDrop(acceptedFiles) {
    this.setState({
      files: acceptedFiles
    });
  }

  onSoftwareUpdated() {
    this.state.files.forEach((file) => {
      appAlert.success(`Update server software ${file.name}`);
      appAlert.info('File transfer started.');
      fetchUpdateServer(file)
      .then(() => {
        // This starts when the file has been completely sent to the MP.
        appAlert.info('File transfer completed.');
        appAlert.info('Server will reboot now');
        // Sometimes the server goes down and up so quickly,
        // that the long polling loop does not detect that the
        // server has gone down and up.
        // This insures that the browser is refreshed after
        // a server software update.
        setTimeout(() => {
          getHeartbeat();
        }, 10000);
      });

    });
  }

  onLicenseChanged(evt) {
    // In the API, the string containing the license is status.license.license.
    // Yes. It's a little unusual that license is an element of license.
    const license = { ...this.state.status.license, license: evt.currentTarget.value };
    const status = { ...this.state.status, license };
    this.setState({ status });
  }

  onLicenseUpdated() {
    this.setLicense(this.state.status.license.license);
  }

  render() {
    // console.log('In Config render()');
    const { isConfig, isAdmin } = this.props;
    const { status, config, redundancy } = this.state;

    // Show or hide configuration options based on the presence of a redundant server.
    let hasRedundantServer = redundancy && redundancy.serverList && (redundancy.serverList.length > 1);
    // flurb - set to true temporarily
    // flurb - or at least true if there is redundancy information.
    // console.log('flurb redundancy', redundancy);
    hasRedundantServer = redundancy;

    // console.log('In Config serverConfig()', config.gen);
    // TODO - move hardcoded values to constants.
    if (!config) {
      return (<div>No server config data available at this time</div>);
    }
    if (!status) {
      return (<div>No server status data available at this time</div>);
    }

    const dropzoneStyle = {
      width: '200px',
      height: '200px',
      borderWidth: '2px',
      borderColor: 'gray',
      borderStyle: 'dashed',
      borderRadius: '5px',
      margin: 'auto',
    };

    const staticStyle = {
      textAlign: 'left',
    };

    return (
      <Form horizontal>
        <div style={ { width: 320 } }>
          {isConfig ?
            (<div>
              <h4>Config</h4>
              <Well>
                <ControlLabel>EDID Mode</ControlLabel>
                <Well>
                  <Radio
                    value="enabled"
                    checked={config.gen.autoEdidMode === 'enabled'}
                    onChange= {(e) => {
                      e.preventDefault();
                      confirm('Are you sure?', {
                        description: 'Would you like to enable EDID mode?',
                        confirmLabel: 'Enable EDID',
                        abortLabel: 'Cancel'
                      }).then(() => {
                        this.setConfigEdid('enabled');
                      }).catch((evt) => {
        //                  console.log('cancel restart');
                      });
                    }}
                  >Enabled</Radio>
                  <Radio
                    value="disabled"
                    checked={config.gen.autoEdidMode === 'disabled'}
                    onChange= {(e) => {
                      e.preventDefault();
                      confirm('Are you sure?', {
                        description: 'Would you like to disable EDID mode?',
                        confirmLabel: 'Disable EDID',
                        abortLabel: 'Cancel'
                      }).then(() => {
                        this.setConfigEdid('disabled');
                      }).catch((evt) => {
        //                  console.log('cancel restart');
                      });
                    }}
                  >Disabled</Radio>
                </Well>

                <Button style={ { width: 160 } }
                  onClick= {(e) => {
                    e.preventDefault();
                    confirm('Are you sure?', {
                      description: 'Would you like to restart the server?',
                      confirmLabel: 'Restart',
                      abortLabel: 'Cancel'
                    }).then(() => {
                      this.setConfigAction('restart');
                    }).catch((evt) => {
    //                    console.log('cancel restart');
                    });
                  }}>Restart
                </Button>

                <br />
                <br />
                <Button style={ { width: 160 } }
                  onClick= {(e) => {
                    e.preventDefault();
                    confirm('Are you sure?', {
                      description: 'Would you like to reboot the server?',
                      confirmLabel: 'Reboot',
                      abortLabel: 'Cancel'
                    }).then(() => {
                      this.setConfigAction('reboot');
                    }).catch((evt) => {
    //                  console.log('cancel reboot');
                    });
                  }}>Reboot
                </Button>

                <br />
                <br />
                <Button style={ { width: 160 } }
                  onClick= {(e) => {
                    e.preventDefault();
                    confirm('Are you sure?', {
                      description: 'Would you like to shut down the server?',
                      confirmLabel: 'Shutdown',
                      abortLabel: 'Cancel'
                    }).then(() => {
                      this.setConfigAction('shutdown');
                    }).catch((evt) => {
    //                  console.log('cancel shutdown');
                    });
                  }}>Shut Down
                </Button>

                <br />
                <br />
                <Button style={ { width: 160 } }
                  onClick= {(e) => {
                    e.preventDefault();
                    confirm('Are you sure?', {
                      description: 'Would you like to create and download trouble report?',
                      confirmLabel: 'Create and Download',
                      abortLabel: 'Cancel'
                    }).then(() => {
                      this.setConfigAction('trouble');
                    }).then(() => {
                      // Wait and then download the trouble report to the user's PC.
                      setTimeout(() => {
                        window.location.assign(`ftp://${backEndHost}/files/trouble_report.tgz`);
                      }, 5000);
                    }).catch((evt) => {
    //                  console.log('cancel trouble report');
                    });
                  }}>Trouble Report
                </Button>

              </Well>
            </div>) : (<div />)}
          {isAdmin ?
            (
              <div>
                <div>
                  <ControlLabel>License</ControlLabel>
                  <Well>

                    <Row>
                      <Col xs={5}>
                        <ControlLabel>Product ID:</ControlLabel>
                      </Col>
                      <Col xs={7}>
                        <FormControl.Static style={staticStyle}>{status.license.productID || 'None'}</FormControl.Static>
                      </Col>
                    </Row>

                    <Row>
                      <Col xs={5}>
                        <ControlLabel>License:</ControlLabel>
                      </Col>
                      <Col xs={7}>
                        <FormControl
                          type="text"
                          onChange={this.onLicenseChanged}
                          value={status.license.license}
                        />
                      </Col>
                    </Row>

                    <Row>
                      <Col xs={5}>
                        <ControlLabel>Limit:</ControlLabel>
                      </Col>
                      <Col xs={7}>
                        <FormControl.Static style={staticStyle}>{status.license.limit || 'None'}</FormControl.Static>
                      </Col>
                    </Row>

                    <Row>
                      <Col xs={5}>
                        <ControlLabel>Devices Exceeded:</ControlLabel>
                      </Col>
                      <Col xs={7}>
                        <FormControl.Static style={staticStyle}>{status.license.devicesExceeded || 'None'}</FormControl.Static>
                      </Col>
                    </Row>

                    <Button style={ { width: 160 } }
                      onClick= {(e) => {
                        e.preventDefault();
                        confirm('Are you sure?', {
                          description: 'Would you like to update license to',
                          descriptionMore: `${this.state.status.license.license}?`,
                          confirmLabel: 'Update',
                          abortLabel: 'Cancel'
                        }).then(() => {
                          this.onLicenseUpdated();
                        }).catch((evt) => {
                          // console.log('cancel update server');
                        });
                      }}>Update License
                    </Button>

                  </Well>
                </div>

                <div>
                  <ControlLabel>Update Server Software</ControlLabel>
                  <Well>
                    <div>
                      <Dropzone multiple={false} onDrop={this.onDrop} style={dropzoneStyle}>
                        <div><br />Drop file here,<br />
                        or click here to select file.</div>
                      </Dropzone>
                      {this.state.files && this.state.files.length > 0 ?
                        <div>
                          <br />
                          Selected file
                          <div>
                            {this.state.files.map((file) => file.name)}
                          </div>
                        </div> :
                        <div>
                          <br />
                        </div>
                      }
                      <br />
                      <Button style={ { width: 160 } }
                        onClick= {(e) => {
                          e.preventDefault();
                          confirm('Are you sure?', {
                            description: `Would you like to update the server software ${this.state.files.map((file) => file.name)}?`,
                            descriptionMore: 'Please note that updating will reboot the server.',
                            confirmLabel: 'Update',
                            abortLabel: 'Cancel'
                          }).then(() => {
                            this.onSoftwareUpdated();
                          }).catch((evt) => {
                            // console.log('cancel update server');
                          });
                        }}>Update Server
                      </Button>
                      <br />
                    </div>
                  </Well>
                </div>

                {hasRedundantServer ?
                  (<div>
                    <ControlLabel>Redundancy</ControlLabel>
                    <Well>

                      <Row>
                        <Col xs={5}>
                          <ControlLabel>Virtual IP:</ControlLabel>
                        </Col>
                        <Col xs={7}>
                          <FormControl.Static style={staticStyle}>{redundancy.virtualIp ? redundancy.virtualIp.address : 'None'}</FormControl.Static>
                        </Col>
                      </Row>

                      <Row>
                        <Col xs={5}>
                          <ControlLabel>IP:</ControlLabel>
                        </Col>
                        <Col xs={7}>
                          <FormControl.Static style={staticStyle}>{redundancy.gen.ip}</FormControl.Static>
                        </Col>
                      </Row>

                      <Row>
                        <Col xs={5}>
                          <ControlLabel>State:</ControlLabel>
                        </Col>
                        <Col xs={7}>
                          <FormControl.Static style={staticStyle}>{redundancy.status.state || 'None'}</FormControl.Static>
                        </Col>
                      </Row>

                      <br />

                      <Button style={ { width: 160 } }
                        onClick= {(e) => {
                          e.preventDefault();
                          confirm('Are you sure?', {
                            description: 'Would you like to switchover to the redundant server?',
                            confirmLabel: 'Switchover server',
                            abortLabel: 'Cancel'
                          }).then(() => {
                            this.setConfigAction('switchover');
                          }).catch((evt) => {
//                        console.log('cancel switchover server');
                          });
                        }}>Switchover
                      </Button>

                      <br />

                      <ControlLabel>Preferred</ControlLabel>
                      <Well>
                        <Radio
                          value="master"
                          checked={redundancy.config.preferredMaster === 'true'}
                          onChange= {(e) => {
                            e.preventDefault();
                            confirm('Are you sure?', {
                              description: 'Would you like to make this server the preferred master?',
                              confirmLabel: 'Preferred Master',
                              abortLabel: 'Cancel'
                            }).then(() => {
                              this.setPreferredMasterSlave('master');
                            }).catch((evt) => {
//                            console.log('cancel restart');
                            });
                          }}
                        >Master</Radio>
                        <Radio
                          value="slave"
                          checked={redundancy.config.preferredSlave === 'true'}
                          onChange= {(e) => {
                            e.preventDefault();
                            confirm('Are you sure?', {
                              description: 'Would you like to make this server the preferred slave?',
                              confirmLabel: 'Preferred Slave',
                              abortLabel: 'Cancel'
                            }).then(() => {
                              this.setPreferredMasterSlave('slave');
                            }).catch((evt) => {
//                            console.log('cancel restart');
                            });
                          }}
                        >Slave</Radio>
                      </Well>



                    </Well>
                  </div>
                ) : (<div />)}


              </div>
            ) : (<div />)}
        </div>
      </Form>
    );
  }
}
