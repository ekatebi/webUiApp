/* eslint no-console: 0 */

import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { FormGroup, FormControl } from 'react-bootstrap';
import { fetchDevice } from '../../service/apiFetch/device';
import { capitalize } from './service/Format';
import {
  SET,
  NAME,
  MANUFACTURER,
  MODEL,
  SERIAL_NUMBER,
  LOCATION
} from '../../constant/app';
import Select from 'react-select';

export default class DeviceDetailId extends Component {
  static propTypes = {
    settings: PropTypes.object.isRequired
  };

  static defaultProps = {
    settings: {}
  };

  constructor(props) {
    super(props);
    this.isIdValid = this.isIdValid.bind(this);
    this.isIdNone = this.isIdNone.bind(this);
    this.isNameDuplicate = this.isNameDuplicate.bind(this);
    this.isNameValid = this.isNameValid.bind(this);
    this.onNameFocus = this.onNameFocus.bind(this);
    this.onNameChanged = this.onNameChanged.bind(this);
    this.onNameUpdated = this.onNameUpdated.bind(this);
    this.onManufacturerFocus = this.onManufacturerFocus.bind(this);
    this.onManufacturerChanged = this.onManufacturerChanged.bind(this);
    this.onManufacturerUpdated = this.onManufacturerUpdated.bind(this);
    this.onModelFocus = this.onModelFocus.bind(this);
    this.onModelChanged = this.onModelChanged.bind(this);
    this.onModelUpdated = this.onModelUpdated.bind(this);
    this.onSerialNumberFocus = this.onSerialNumberFocus.bind(this);
    this.onSerialNumberChanged = this.onSerialNumberChanged.bind(this);
    this.onSerialNumberUpdated = this.onSerialNumberUpdated.bind(this);
    this.onLocationFocus = this.onLocationFocus.bind(this);
    this.onLocationChanged = this.onLocationChanged.bind(this);
    this.onLocationUpdated = this.onLocationUpdated.bind(this);
    const { settings } = this.props;
    this.configGen = settings.config.gen;
    this.isEncoder = (this.configGen.type === 'encoder');
    this.mac = (this.configGen.mac);
    const source = settings.config.source;
    const display = settings.config.display;
    this.deviceName = this.configGen.name;
    this.deviceManufacturer = this.isEncoder ? source.manufacturer : display.manufacturer;
    this.deviceModel = this.isEncoder ? source.model : display.model;
    this.deviceSerialNumber = this.isEncoder ? source.serialNumber : display.serialNumber;
    this.deviceLocation = this.isEncoder ? source.location : display.location;
    this.state = {
      ids: {
        name: this.deviceName,
        manufacturer: this.deviceManufacturer,
        model: this.deviceModel,
        serialNumber: this.deviceSerialNumber,
        location: this.deviceLocation },
      focus: {},
      error: null
    };
  }

  isIdValid(id) {
    // Limit to non-space, printable ASCII characters.
    const idPattern = /^[\x21-\x7E]+$/;
    return idPattern.test(id);
  }

  isIdNone(id) {
    const idPattern = /^none$/i;
    return idPattern.test(id);
  }

  isNameDuplicate(name) {
    // Check to see if this name is already on the list, with a different MAC address.

    let list;

    if (this.props.settings.allDevices && this.props.settings.allDevices.config) {
      list = this.props.settings.allDevices.config.info.text;
    } else if (this.props.settings.allDevices && this.props.settings.allDevices.status) {
      list = this.props.settings.allDevices.status.info.text;
    }

    let deviceIndex = -1;

    if (list) {
      deviceIndex = list.findIndex((dev) => {
        return dev.gen.name.toLowerCase() === name.toLowerCase() &&
        dev.gen.mac !== this.mac;
      });
    }

    if (deviceIndex > -1) {
      return true;
    }

    return false;
  }

  isNameValid(name) {
    // Limit to non-space, printable ASCII characters.
    return this.isIdValid(name) && !this.isIdNone(name) && !this.isNameDuplicate(name);
  }

  onNameFocus(evt) {
    const focus = { ...this.state.focus, nameFocus: true };
    this.setState({ focus });
  }

  onNameChanged(evt) {
    const name = evt.currentTarget.value;
    const ids = { ...this.state.ids, name };
    this.setState({ ids });
  }

  onNameUpdated(evt) {
    const focus = { ...this.state.focus, nameFocus: false };
    this.setState({ focus });
    const { settings } = this.props;
    const mac = settings.config.gen.mac;
    const name = this.state.ids.name;
    // Set the name on the device.
    if (name !== this.deviceName) {
      if (this.isNameValid(name)) {
        this.setName(mac, name);
        this.deviceName = name;
      }
    }
  }

  onManufacturerFocus(evt) {
    const focus = { ...this.state.focus, manufacturerFocus: true };
    this.setState({ focus });
  }

  onManufacturerChanged(evt) {
    const manufacturer = evt.currentTarget.value;
    const ids = { ...this.state.ids, manufacturer };
    this.setState({ ids });
  }

  onManufacturerUpdated(evt) {
    const focus = { ...this.state.focus, manufacturerFocus: false };
    this.setState({ focus });
    const { settings } = this.props;
    const mac = settings.config.gen.mac;
    const manufacturer = this.state.ids.manufacturer;
    // Set the manufacturer on the device.
    if (manufacturer !== this.deviceManufacturer) {
      this.setManufacturer(mac, manufacturer);
      this.deviceManufacturer = manufacturer;
    }
  }

  onModelFocus(evt) {
    const focus = { ...this.state.focus, modelFocus: true };
    this.setState({ focus });
  }

  onModelChanged(evt) {
    const model = evt.currentTarget.value;
    const ids = { ...this.state.ids, model };
    this.setState({ ids });
  }

  onModelUpdated(evt) {
    const focus = { ...this.state.focus, modelFocus: false };
    this.setState({ focus });
    const { settings } = this.props;
    const mac = settings.config.gen.mac;
    const model = this.state.ids.model;
    // Set the model on the device.
    if (model !== this.deviceModel) {
      this.setModel(mac, model);
      this.deviceModel = model;
    }
  }

  onSerialNumberFocus(evt) {
    const focus = { ...this.state.focus, serialNumberFocus: true };
    this.setState({ focus });
  }

  onSerialNumberChanged(evt) {
    const serialNumber = evt.currentTarget.value;
    const ids = { ...this.state.ids, serialNumber };
    this.setState({ ids });
  }

  onSerialNumberUpdated(evt) {
    const focus = { ...this.state.focus, serialNumberFocus: false };
    this.setState({ focus });
    const { settings } = this.props;
    const mac = settings.config.gen.mac;
    const serialNumber = this.state.ids.serialNumber;
    // Set the serialNumber on the device.
    if (serialNumber !== this.deviceSerialNumber) {
      this.setSerialNumber(mac, serialNumber);
      this.deviceSerialNumber = serialNumber;
    }
  }

  onLocationFocus(evt) {
    const focus = { ...this.state.focus, locationFocus: true };
    this.setState({ focus });
  }

  onLocationChanged(evt) {
    const location = evt.currentTarget.value;
    const ids = { ...this.state.ids, location };
    this.setState({ ids });
  }

  onLocationUpdated(evt) {
    const focus = { ...this.state.focus, locationFocus: false };
    this.setState({ focus });
    const { settings } = this.props;
    const mac = settings.config.gen.mac;
    const location = this.state.ids.location;
    // Set the location on the device.
    if (location !== this.deviceLocation) {
      this.setLocation(mac, location);
      this.deviceLocation = location;
    }
  }

  setName(mac, name) {
    fetchDevice(SET, { setType: NAME, mac, name })
    .then(resp => resp.json())
    .catch((err) => {
      appAlert.error(err);    
    })
    .then(json => {
      if (json.responses[0].errors.length === 0) {
        appAlert.success(`Success in set name of ${name} for device with mac address of ${mac}`);
      } else {
        appAlert.error(`Failed to set name of ${name} for device with mac address of ${mac}, ${json.responses[0].errors.join(', ')}`,
          { time: 0 });
      }
    })
    .catch(error => {
      appAlert.error(`Failed to set name of ${name} for device with mac address of ${mac}, ${error.toString()}`,
        { time: 0 });
    });
  }

  setManufacturer(mac, manufacturer) {
    fetchDevice(SET, { setType: MANUFACTURER, mac, manufacturer })
    .then(resp => resp.json())
    .catch((err) => {
      appAlert.error(err);    
    })
    .then(json => {
      if (json.responses[0].errors.length === 0) {
        appAlert.success(`Success in set manufacturer of ${manufacturer} for device with mac address of ${mac}`);
      } else {
        appAlert.error(`Failed to set manufacturer of ${manufacturer} for device with mac address of ${mac}, ${json.responses[0].errors.join(', ')}`,
          { time: 0 });
      }
    })
    .catch(error => {
      appAlert.error(`Failed to set manufacturer of ${manufacturer} for device with mac address of ${mac}, ${error.toString()}`);
    });
  }

  setModel(mac, model) {
    fetchDevice(SET, { setType: MODEL, mac, model })
    .then(resp => resp.json())
    .catch((err) => {
      appAlert.error(err);    
    })
    .then(json => {
      if (json.responses[0].errors.length === 0) {
        appAlert.success(`Success in set model of ${model} for device with mac address of ${mac}`);
      } else {
        appAlert.error(`Failed to set model of ${model} for device with mac address of ${mac}, ${json.responses[0].errors.join(', ')}`,
          { time: 0 });
      }
    })
    .catch(error => {
        appAlert.error(`Failed to set model of ${model} for device with mac address of ${mac}, ${error.toString()}`,
          { time: 0 });
    });
  }

  setSerialNumber(mac, serialNumber) {
    fetchDevice(SET, { setType: SERIAL_NUMBER, mac, serialNumber })
    .then(resp => resp.json())
    .catch((err) => {
      appAlert.error(err);    
    })
    .then(json => {
      if (json.responses[0].errors.length === 0) {
        appAlert.success(`Success in set serialNumber of ${serialNumber} for device with mac address of ${mac}`);
      } else {
        appAlert.error(`Failed to set serialNumber of ${serialNumber} for device with mac address of ${mac}, ${json.responses[0].errors.join(', ')}`,
          { time: 0 });
      }
    })
    .catch(error => {
      appAlert.error(`Failed to set serialNumber of ${serialNumber} for device with mac address of ${mac}, ${error.toString()}`,
        { time: 0 });
    });
  }

  setLocation(mac, location) {
    fetchDevice(SET, { setType: LOCATION, mac, location })
    .then(resp => resp.json())
    .then(json => {
      if (json.responses[0].errors.length === 0) {
        appAlert.success(`Success in set location of ${location} for device with mac address of ${mac}`);
      } else {
        appAlert.error(`Failed to set location of ${location} for device with mac address of ${mac}, ${json.responses[0].errors.join(', ')}`,
          { time: 0 });
      }
    })
    .catch(error => {
        appAlert.error(`Failed to set location of ${location} for device with mac address of ${mac}, ${error.toString()}`,
          { time: 0 });
    });
  }

  render() {
    const { settings } = this.props;
    const { ids, focus } = this.state;

    if (this.configGen === undefined || this.configGen === null) {
      const deviceDetailIdEmpty = (
        <div></div>
      );
      return deviceDetailIdEmpty;
    }

    const labelStyle = {
      textAlign: 'right',
    };

    const spaceBelowStyle = {
      margin: '0px 0px 15px',
    };

    let nameFeedbackStyle;
    if (focus.nameFocus) {
      nameFeedbackStyle = { display: '' };
    } else {
      nameFeedbackStyle = { display: 'none' };
    }

    let manufacturerFeedbackStyle;
    if (focus.manufacturerFocus) {
      manufacturerFeedbackStyle = { display: '' };
    } else {
      manufacturerFeedbackStyle = { display: 'none' };
    }

    let modelFeedbackStyle;
    if (focus.modelFocus) {
      modelFeedbackStyle = { display: '' };
    } else {
      modelFeedbackStyle = { display: 'none' };
    }

    let serialNumberFeedbackStyle;
    if (focus.serialNumberFocus) {
      serialNumberFeedbackStyle = { display: '' };
    } else {
      serialNumberFeedbackStyle = { display: 'none' };
    }

    let locationFeedbackStyle;
    if (focus.locationFocus) {
      locationFeedbackStyle = { display: '' };
    } else {
      locationFeedbackStyle = { display: 'none' };
    }

    const deviceProcessed = (
      <div style={{ minWidth: 330 }}>

        <div className="row">
          <div className="col-sm-4" style={labelStyle}>Name:</div>
          <div className="col-sm-8">
            <div>
              <span>
                <FormGroup
                  controlId="name"
                  validationState={this.isNameValid(this.state.ids.name) ? 'success' : 'error'}
                >
                  <FormControl
                    type="text"
                    disabled={!settings.isConfig}
                    value={this.state.ids.name}
                    onFocus={this.onNameFocus}
                    onChange={this.onNameChanged}
                    onBlur={this.onNameUpdated}
                  />
                  <FormControl.Feedback style={ nameFeedbackStyle } />
                </FormGroup>
              </span>
            </div>
          </div>
        </div>

        <div className="row" style={spaceBelowStyle}>
          <div className="col-sm-4" style={labelStyle}>MAC:</div>
          <div className="col-sm-8">{this.configGen.mac}</div>
        </div>
        <div className="row" style={spaceBelowStyle}>
          <div className="col-sm-4" style={labelStyle}>Type:</div>
          <div className="col-sm-8">{capitalize(this.configGen.type)}</div>
        </div>

        <div className="row">
          <div className="col-sm-4" style={labelStyle}>Manufacturer:</div>
          <div className="col-sm-8">
            <div>
              <span>
                <FormGroup
                  controlId="manufacturer"
                  validationState={this.isIdValid(this.state.ids.manufacturer) ? 'success' : 'error'}
                >
                  <FormControl
                    type="text"
                    disabled={!settings.isConfig}
                    value={this.state.ids.manufacturer}
                    onFocus={this.onManufacturerFocus}
                    onChange={this.onManufacturerChanged}
                    onBlur={this.onManufacturerUpdated}
                  />
                  <FormControl.Feedback style={ manufacturerFeedbackStyle } />
                </FormGroup>
              </span>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-4" style={labelStyle}>Model:</div>
          <div className="col-sm-8">
            <div>
              <span>
                <FormGroup
                  controlId="model"
                  validationState={this.isIdValid(this.state.ids.model) ? 'success' : 'error'}
                >
                  <FormControl
                    type="text"
                    disabled={!settings.isConfig}
                    value={this.state.ids.model}
                    onFocus={this.onModelFocus}
                    onChange={this.onModelChanged}
                    onBlur={this.onModelUpdated}
                  />
                  <FormControl.Feedback style={ modelFeedbackStyle } />
                </FormGroup>
              </span>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-4" style={labelStyle}>Serial Number:</div>
          <div className="col-sm-8">
            <div>
              <span>
                <FormGroup
                  controlId="serialNumber"
                  validationState={this.isIdValid(this.state.ids.serialNumber) ? 'success' : 'error'}
                >
                  <FormControl
                    type="text"
                    disabled={!settings.isConfig}
                    value={this.state.ids.serialNumber}
                    onFocus={this.onSerialNumberFocus}
                    onChange={this.onSerialNumberChanged}
                    onBlur={this.onSerialNumberUpdated}
                  />
                  <FormControl.Feedback style={ serialNumberFeedbackStyle } />
                </FormGroup>
              </span>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-4" style={labelStyle}>Location:</div>
          <div className="col-sm-8">
            <div>
              <span>
                <FormGroup
                  controlId="location"
                  validationState={this.isIdValid(this.state.ids.location) ? 'success' : 'error'}
                >
                  <FormControl
                    type="text"
                    disabled={!settings.isConfig}
                    value={this.state.ids.location}
                    onFocus={this.onLocationFocus}
                    onChange={this.onLocationChanged}
                    onBlur={this.onLocationUpdated}
                  />
                  <FormControl.Feedback style={ locationFeedbackStyle } />
                </FormGroup>
              </span>
            </div>
          </div>
        </div>

      </div>
    );
    return deviceProcessed;
  }
}
