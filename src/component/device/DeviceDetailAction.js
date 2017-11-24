/* eslint react/prop-types: 0 no-console: 0 */

import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './actions';
import { Button, Well, ControlLabel } from 'react-bootstrap';
import { fetchDevice, fetchUpdateDevice } from '../../service/apiFetch/device';
import {
  GET,
  SET,
  ACTION,
  CONFIG,
  MODE,
  IP,
  RS232,
  REBOOT,
  RESTORE,
  DELETE
} from '../../constant/app';
import { confirm } from '../confirm/service/confirm';
import Dropzone from 'react-dropzone';
import { DeviceSettings } from './service/DeviceSettings';

class DeviceDetailAction extends Component {
  static propTypes = {
    settings: PropTypes.object.isRequired
  };

  static defaultProps = {
    settings: {}
  };

  constructor(props) {
    super(props);
    this.actionReboot = this.actionReboot.bind(this);
    this.actionRestore = this.actionRestore.bind(this);
    this.actionDelete = this.actionDelete.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onUpdateDevice = this.onUpdateDevice.bind(this);
    this.state = {};
    const { settings } = this.props;
    const deviceName = settings.config.gen.name;
    const mode = settings.config.gen.mode;
  }

  actionReboot() {
    // console.log('In DeviceDetailAction setConfigMode() 1');
    const { settings } = this.props;
    const deviceName = settings.config.gen.name;
    fetchDevice(ACTION, { actionType: REBOOT, deviceName })
    .then(resp => resp.json())
    .catch((err) => {
      appAlert.error(err);
    })
    .then(json => {
      if (json.responses[0].errors.length === 0) {
        appAlert.success(`Success in reboot of device ${deviceName}`);
      } else {
        appAlert.error(`Failed to reboot device ${deviceName}, ${json.responses[0].errors.join(', ')}`);
      }
    })
    .catch(error => {
      appAlert.error(`Failed to reboot device ${deviceName}, ${error.toString()}`);
    });
  }

  actionRestore() {
    // console.log('In DeviceDetailAction actionRestore() 1');
    const { settings } = this.props;
    const deviceName = settings.config.gen.name;
    fetchDevice(ACTION, { actionType: RESTORE, deviceName })
    .then(resp => resp.json())
    .catch((err) => {
      appAlert.error(err);
    })
    .then(json => {
      // console.log('In DeviceDetailAction actionRestore() 2:', json);
      if (json.responses[0].errors.length === 0) {
        appAlert.success(`Success in setting device ${deviceName} to factory defaults`);
      } else {
        appAlert.error(`Failed to set factory defaults on device ${deviceName}, ${json.responses[0].errors.join(', ')}`);
      }
    })
    .catch(error => {
      appAlert.error(`Failed to set factory defaults on device ${deviceName}, ${error.toString()}`);
    });
  }

  actionDelete() {
    // console.log('In DeviceDetailAction actionDelete() 1');
    const { settings } = this.props;
    const deviceName = settings.config.gen.name;
    fetchDevice(ACTION, { actionType: DELETE, deviceName })
    .then(resp => resp.json())
    .catch((err) => {
      appAlert.error(err);
    })
    .then(json => {
      // console.log('In DeviceDetailAction actionDelete() 2:', json);
      if (json.responses[0].errors.length === 0) {
        // console.log('In DeviceDetailAction actionDelete() 3 success:');
        appAlert.success(`Success in delete of device ${deviceName}`);
      } else {
        appAlert.error(`Failed to delete device ${deviceName}, ${json.responses[0].errors.join(', ')}`);
      }
    })
    .catch(error => {
      appAlert.error(`Failed to delete device ${deviceName}, ${error.toString()}`);
    });

    const { onRemoveDevice } = this.props;
    onRemoveDevice();
  }

  onDrop(acceptedFiles) {
    this.setState({
      files: acceptedFiles
    });
  }

  onUpdateDevice() {
    const { settings } = this.props;
    const deviceName = settings.config.gen.name;
    this.state.files.forEach((file) => {
      appAlert.success(`Update device ${deviceName} with ${file.name}`);
      appAlert.info('Device file transfer started.');
      fetchUpdateDevice(deviceName, file)
      .then(() => {
        appAlert.info('Device file transfer completed.');
        appAlert.info('Device will update firmware and reboot now.');
        // TODO - add a loop to monitor and report device progress and completion.
      })
      .catch(error => {
        appAlert.error(`Failed to update device ${deviceName}, ${error.toString()}`);
      });
    });
  }

  render() {
    // console.log('In DeviceDetailAction render()');
    const { settings, isAdmin, isConfig } = this.props;

    if (!settings || !settings.status) {
      const deviceDetailActionEmpty = (
        <div></div>
      );
      return deviceDetailActionEmpty;
    }

    // The gen from the status does not get changed on user input.
    const statusGen = settings.status.gen;

    const deviceSettings = new DeviceSettings(settings);

    const firmwareUpdate = settings.status.firmwareUpdate;

    const actionStyle = {
      textAlign: 'center',
      margin: '7px 0px',
    };

    const showStyle = {
      display: 'block',
      textAlign: 'center',
      margin: '7px 0px',
    };
    const hideStyle = {
      display: 'none',
      textAlign: 'center',
      margin: '7px 0px',
    };

    const dropzoneStyle = {
      width: '200px',
      height: '200px',
      borderWidth: '2px',
      borderColor: 'gray',
      borderStyle: 'dashed',
      borderRadius: '5px',
      margin: 'auto',
    };

    const updateStyle = {
      textAlign: 'center',
      margin: '20px 0px 0px 0px',
    };

    const labelStyle = {
      textAlign: 'right',
    };

    const valueStyle = {
      textAlign: 'left',
    };

    const name = settings.config.gen.name;

    let progress = (
      <div></div>
    );
    if (firmwareUpdate.loadingFile !== 'none') {
      progress = (
        <div>
          <div className="row">
            <div className="col-sm-3" style={labelStyle}>Status:</div>
            <div className="col-sm-9" style={valueStyle}>{firmwareUpdate.status}</div>
          </div>

          <div className="row">
            <div className="col-sm-3" style={labelStyle}>File:</div>
            <div className="col-sm-9" style={valueStyle}>{firmwareUpdate.loadingFile}</div>
          </div>

          <div className="row">
            <div className="col-sm-3" style={labelStyle}>Percent:</div>
            <div className="col-sm-9" style={valueStyle}>{firmwareUpdate.percentComplete}</div>
          </div>
        </div>
      );
    }

    const deviceProcessed = (
      <div style={{ minWidth: 10 }}>
        <div className="row">
          <div className="col-sm-12" style={actionStyle}>
            <div>
              {isConfig ? (<Button onClick= {(e) => {
                e.preventDefault();
                confirm('Are you sure?', {
                  description: `Would you like to reboot device ${name}?`,
                  confirmLabel: 'Reboot',
                  abortLabel: 'Cancel'
                }).then(() => {
                  this.actionReboot();
                }).catch((evt) => {
                  // Do nothing on cancel.
                });
              }}>Reboot
              </Button>) : (<div />)}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-12" style={deviceSettings.supportsFactoryDefaults() ? showStyle : hideStyle}>
            <div>
              {isAdmin ? (<Button onClick= {(e) => {
                e.preventDefault();
                confirm('Are you sure?', {
                  description: `Would you like to set factory defaults on device ${name}?`,
                  confirmLabel: 'Factory Defaults',
                  abortLabel: 'Cancel'
                }).then(() => {
                  this.actionRestore();
                }).catch((evt) => {
                  // Do nothing on cancel.
                });
              }}>Factory Defaults
              </Button>) : (<div />)}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-12" style={actionStyle}>
            <div>
              {isAdmin ? (<Button onClick= {(e) => {
                e.preventDefault();
                confirm('Are you sure?', {
                  description: `Would you like to delete device ${name}?`,
                  confirmLabel: 'Delete',
                  abortLabel: 'Cancel'
                }).then(() => {
                  this.actionDelete();
                }).catch((evt) => {
                  // Do nothing on cancel.
                });
              }}>Delete
              </Button>) : (<div />)}
            </div>
          </div>
        </div>

        {isAdmin ? (<div style={updateStyle}>
          <ControlLabel>Update Device Firmware</ControlLabel>
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
                    description: `Would you like to update the device ${name} with ${this.state.files.map((file) => file.name)}?`,
                    confirmLabel: 'Update',
                    abortLabel: 'Cancel'
                  }).then(() => {
                    this.onUpdateDevice();
                  }).catch((evt) => {
//                    console.log('cancel update device');
                  });
                }}>Update Device
              </Button>
              <br />

            </div>

            {progress}

          </Well>
        </div>) : (<div />)}

      </div>
    );
    return deviceProcessed;
  }
}

// Merge the Redux store values returned by this function into this component's props.
// This is run when part of the Redux store updates and this component receives new props.
function mapStateToProps(state) {
  return {};
}

// Merge the Redux actions into this component's props.
function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

// Connect this component to the Redux store.
export default connect(mapStateToProps, mapDispatchToProps)(DeviceDetailAction);
