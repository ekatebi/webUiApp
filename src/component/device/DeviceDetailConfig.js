/* eslint no-console: 0 */
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { FormGroup, FormControl, Radio, Checkbox,
  MenuItem, ControlLabel, Button, Collapse, Row, Col } from 'react-bootstrap';
import { fetchDevice } from '../../service/apiFetch/device';
import {
  GET,
  SET,
  CONFIG,
  MODE,
  IP,
  RS232,
  VIDEO_PORT,
  ICON_IMAGE_NAME,
  itemBackgroundColor,
  iconsObj,
  decoderIconsObj
} from '../../constant/app';
import Select from 'react-select';
import Loader from 'react-loader';
import { DeviceSettings } from './service/DeviceSettings';

export default class DeviceDetailConfig extends Component {
  static propTypes = {
    settings: PropTypes.object.isRequired
  };

  static defaultProps = {
    settings: {}
  };

  constructor(props) {
    super(props);
    this.isIpValid = this.isIpValid.bind(this);
    this.onModeChanged = this.onModeChanged.bind(this);
    this.onIpModeChanged = this.onIpModeChanged.bind(this);
    this.onIpAddressFocus = this.onIpAddressFocus.bind(this);
    this.onIpAddressChanged = this.onIpAddressChanged.bind(this);
    this.onIpAddressUpdated = this.onIpAddressUpdated.bind(this);
    this.onIpMaskFocus = this.onIpMaskFocus.bind(this);
    this.onIpMaskChanged = this.onIpMaskChanged.bind(this);
    this.onIpMaskUpdated = this.onIpMaskUpdated.bind(this);
    this.onIpGatewayFocus = this.onIpGatewayFocus.bind(this);
    this.onIpGatewayChanged = this.onIpGatewayChanged.bind(this);
    this.onIpGatewayUpdated = this.onIpGatewayUpdated.bind(this);
    this.onRs232BaudrateChanged = this.onRs232BaudrateChanged.bind(this);
    this.onRs232DataBitChanged = this.onRs232DataBitChanged.bind(this);
    this.onRs232StopBitChanged = this.onRs232StopBitChanged.bind(this);
    this.onRs232ParityChanged = this.onRs232ParityChanged.bind(this);
    this.onVideoPreviewChanged = this.onVideoPreviewChanged.bind(this);
    this.onVideoPortChanged = this.onVideoPortChanged.bind(this);
    this.getVideoPreview = this.getVideoPreview.bind(this);
    this.setVideoPreview = this.setVideoPreview.bind(this);
    const { settings } = this.props;
    this.model = settings.config.gen.model;
    const mode = settings.config.gen.mode;

    const ipMode = settings.config.ip.mode;
    this.deviceIpAddress = settings.config.ip.address;
    this.deviceIpMask = settings.config.ip.mask;
    this.deviceIpGateway = settings.config.ip.gateway;

    const baudrate = settings.config.rs232.baudrate;
    const dataBit = settings.config.rs232.dataBit;
    const stopBit = settings.config.rs232.stop_Bit;
    const parity = settings.config.rs232.parity;
    this.mac = settings.config.gen.mac;
    this.deviceSettings = new DeviceSettings(settings);
    const isVideoPreview = this.getVideoPreview(this.mac);
    const videoPort = settings.config.ports['video-port'];
    this.state = {
      gen: { mode },
      ip: {
        ipMode,
        ipAddress: this.deviceIpAddress,
        ipMask: this.deviceIpMask,
        ipGateway: this.deviceIpGateway },
      rs232: { baudrate, dataBit, stopBit, parity },
      isVideoPreview,
      ports: { videoPort },
      error: null,
      showIcons: false,
      loaded: true
    };

    this.spinnerOptions = {
      lines: 11,
      length: 20,
      width: 10,
      radius: 20,
      corners: 1,
      rotate: 0,
      direction: 1,
      color: itemBackgroundColor,
      speed: 1,
      trail: 60,
      shadow: false,
      hwaccel: false,
      zIndex: 2e9,
      top: '60%',
      left: '20%',
      scale: 0.50
    };
  }

  componentWillMount() {
//    const { popupPanelMouseDown } = this.props.settings;
//    this.setState({ showIcons: !popupPanelMouseDown });
  }

  componentWillReceiveProps(nextProps) {
//    const { popupPanelMouseDown } = nextProps.settings;
//    this.setState({ showIcons: !popupPanelMouseDown });
  }

  isIpValid(ipAddress) {
    const ipPattern = /^((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/;
    const isValidTmp = ipPattern.test(ipAddress);
    const isValid = ipPattern.test(ipAddress) ? 'success' : 'error';
    return isValid;
  }

  onModeChanged(evt) {
    // console.log('In DeviceDetailConfig onModeChanged()');
    this.setState({ gen: { mode: evt.currentTarget.value } });
    this.setConfigMode(evt.currentTarget.value);
  }

  onIpModeChanged(ipMode) {
    const ip = { ...this.state.ip, ipMode };
    this.setState({ ip });
    this.setConfigIp(ip);
  }

  onIpAddressFocus(evt) {
    const ip = { ...this.state.ip, ipAddressFocus: true };
    this.setState({ ip });
  }

  onIpAddressChanged(evt) {
    const ipAddress = evt.currentTarget.value;
    const ip = { ...this.state.ip, ipAddress };
    this.setState({ ip });
  }

  onIpAddressUpdated(evt) {
    const ipAddress = evt.currentTarget.value;
    const ip = { ...this.state.ip, ipAddress, ipAddressFocus: false };
    if (ipAddress !== this.deviceIpAddress) {
      this.setState({ ip });
      this.setConfigIp(ip);
    }
  }

  onIpMaskFocus(evt) {
    const ip = { ...this.state.ip, ipMaskFocus: true };
    this.setState({ ip });
  }

  onIpMaskChanged(evt) {
    const ipMask = evt.currentTarget.value;
    const ip = { ...this.state.ip, ipMask };
    this.setState({ ip });
  }

  onIpMaskUpdated(evt) {
    const ipMask = evt.currentTarget.value;
    const ip = { ...this.state.ip, ipMask, ipMaskFocus: false };
    if (ipMask !== this.deviceIpMask) {
      this.setState({ ip });
      this.setConfigIp(ip);
    }
  }

  onIpGatewayFocus(evt) {
    const ip = { ...this.state.ip, ipGatewayFocus: true };
    this.setState({ ip });
  }

  onIpGatewayChanged(evt) {
    const ipGateway = evt.currentTarget.value;
    const ip = { ...this.state.ip, ipGateway };
    this.setState({ ip });
  }

  onIpGatewayUpdated(evt) {
    const ipGateway = evt.currentTarget.value;
    const ip = { ...this.state.ip, ipGateway, ipGatewayFocus: false };
    if (ipGateway !== this.deviceIpGateway) {
      this.setState({ ip });
      this.setConfigIp(ip);
    }
  }

  onRs232BaudrateChanged(baudrate) {
    // console.log('In DeviceDetailConfig onRs232BaudrateChanged()');
    const rs232 = { ...this.state.rs232, baudrate };
    this.setState({ rs232 });
    this.setConfigRs232(rs232);
  }

  onRs232DataBitChanged(evt) {
    // console.log('In DeviceDetailConfig onRs232DataBitChanged()');
    const dataBit = evt.currentTarget.value;
    const rs232 = { ...this.state.rs232, dataBit };
    this.setState({ rs232 });
    this.setConfigRs232(rs232);
  }

  onRs232StopBitChanged(evt) {
    // console.log('In DeviceDetailConfig onRs232StopBitChanged()');
    const stopBit = evt.currentTarget.value;
    const rs232 = { ...this.state.rs232, stopBit };
    this.setState({ rs232 });
    this.setConfigRs232(rs232);
  }

  onRs232ParityChanged(evt) {
    // console.log('In DeviceDetailConfig onRs232ParityChanged()');
    const parity = evt.currentTarget.value;
    const rs232 = { ...this.state.rs232, parity };
    this.setState({ rs232 });
    this.setConfigRs232(rs232);
  }

  onVideoPreviewChanged(evt) {
    const isVideoPreview = evt.currentTarget.checked;
    this.setState({ isVideoPreview });
    this.setVideoPreview(this.mac, isVideoPreview);
  }

  onVideoPortChanged(videoPort) {
    const ports = { videoPort };
    this.setState({ ports });
    this.setVideoPort(videoPort);
  }

  setConfigMode(mode) {
    // console.log('In DeviceDetailConfig setConfigMode() 1');
    const { settings } = this.props;
    const deviceName = settings.config.gen.name;
    fetchDevice(SET, { setType: MODE, deviceName, mode })
    .then(resp => resp.json())
    .catch((err) => {
      appAlert.error(err);
    })
    .then(json => {
      // console.log('In DeviceDetailConfig setConfigMode() 2:', json);
      if (json.responses[0].errors.length === 0) {
        // console.log('In DeviceDetailConfig setConfigMode() 3 success:');
        appAlert.success(`Success in config of ${mode} for device ${deviceName}`);
      } else {
        appAlert.error(`Failed to config ${mode} for device ${deviceName}, ${json.responses[0].errors.join(', ')}`);
        this.getDevice();
      }
    })
    .catch(error => {
      appAlert.error(`Failed to config ${mode} for device ${deviceName}, ${error.toString()}`);
      this.getDevice();
    });
  }

  setConfigIp(ip) {
    const { settings } = this.props;
    const deviceName = settings.config.gen.name;
    fetchDevice(SET, { setType: IP, deviceName, ip })
    .then(resp => resp.json())
    .catch((err) => {
      appAlert.error(err);
    })
    .then(json => {
      // console.log('In DeviceDetailConfig setConfigIp() 2:', json);
      if (json.responses[0].errors.length === 0) {
        // console.log('In DeviceDetailConfig setConfigIp() 3 success:');
        appAlert.success(`Success in config of ip for device ${deviceName}`);
      } else {
        appAlert.error(`Failed to config ip for device ${deviceName}, ${json.responses[0].errors.join(', ')}`);
      }
    })
    .catch(error => {
      appAlert.error(`Failed to config ip for device ${deviceName}, ${error.toString()}`);
    });
  }

  setConfigRs232(rs232) {
    // console.log('In DeviceDetailConfig setConfigRs232() 1');
    const { settings } = this.props;
    const deviceName = settings.config.gen.name;
    fetchDevice(SET, { setType: RS232, deviceName, rs232 })
    .then(resp => resp.json())
    .catch((err) => {
      appAlert.error(err);
    })
    .then(json => {
      // console.log('In DeviceDetailConfig setConfigRs232() 2:', json);
      if (json.responses[0].errors.length === 0) {
        appAlert.success(`Success in config of rs232 for device ${deviceName}`);
      } else {
        appAlert.error(`Failed to config rs232 for device ${deviceName}, ${json.responses[0].errors.join(', ')}`);
        // Also, get information from the device and display it in the GUI.
        this.getDevice();
      }
    })
    .catch(error => {
      appAlert.error(`Failed to config rs232 for device ${deviceName}, ${error.toString()}`);
      this.getDevice();
    });
  }

  getVideoPreview(mac) {
    // Get the stored value of video preview for this MAC address.
    // Returns true or false.
    const videoPreviewDevices = JSON.parse(localStorage.getItem('videoPreviewDevices'));
    let index;
    if (videoPreviewDevices) {
      index = videoPreviewDevices.indexOf(mac);
    } else {
      index = -1;
    }
    const isVideoPreview = (index !== -1);
    return isVideoPreview;
  }

  setVideoPreview(mac, isVideoPreview) {
    // Set the stored value of video preview for this MAC address.
    // Store a list of sources which have video preview.
    let videoPreviewDevices = JSON.parse(localStorage.getItem('videoPreviewDevices'));
    if (!videoPreviewDevices) {
      videoPreviewDevices = [];
    }
    const index = videoPreviewDevices.indexOf(mac);
    if (isVideoPreview) {
      // Add
      if (index === -1) {
        // Since it's not on the list yet, add it.
        videoPreviewDevices.push(mac);
        localStorage.setItem('videoPreviewDevices', JSON.stringify(videoPreviewDevices));
      }
    } else {
      // Remove
      if (index !== -1) {
        // Since it's on the list, remove it.
        videoPreviewDevices.splice(index, 1);
        localStorage.setItem('videoPreviewDevices', JSON.stringify(videoPreviewDevices));
      }
    }
  }

  setVideoPort(videoPort) {
    const { settings } = this.props;
    const deviceName = settings.config.gen.name;
    fetchDevice(SET, { setType: VIDEO_PORT, deviceName, videoPort })
    .then(resp => resp.json())
    .catch((err) => {
      appAlert.error(err);
    })
    .then(json => {
      if (json.responses[0].errors.length === 0) {
        // console.log('In DeviceDetailConfig setVideoPort() 3 success:');
        appAlert.success(`Success in config of video port ${videoPort} for device ${deviceName}`);
      } else {
        appAlert.error(`Failed to config video port ${videoPort} for device ${deviceName}, ${json.responses[0].errors.join(', ')}`);
        this.getDevice();
      }
    })
    .catch(error => {
      appAlert.error(`Failed to config video port ${videoPort} for device ${deviceName}, ${error.toString()}`);
      this.getDevice();
    });
  }

  setIconImageName(mac, iconImageName) {
    const { settings } = this.props;
    const deviceName = settings.config.gen.name;
    this.setState({ loaded: false });
    fetchDevice(SET, { setType: ICON_IMAGE_NAME, mac, iconImageName })
    .then(resp => resp.json())
    .then(json => {
      if (json.responses[0].errors.length === 0) {
        appAlert.success(`Success in setting icon image name for device ${deviceName}`);
      } else {
        appAlert.error(`Failed in setting icon image name for device ${deviceName}, ${json.responses[0].errors.join(', ')}`);
      }
    })
    .catch(error => {
      appAlert.error(`Failed in setting icon image name for device ${deviceName}, ${error.toString()}`);
    })
    .then(() => {
      setTimeout(() => {
        this.setState({ loaded: true });
      }, 1000);
    });
  }

  render() {
    // console.log('In DeviceDetailConfig render()');
    const { settings } = this.props;
    const { gen, ip, rs232, isVideoPreview, ports } = this.state;

    if (!settings || !settings.status || !settings.config) {
      const deviceDetailConfigEmpty = (
        <div></div>
      );
      return deviceDetailConfigEmpty;
    }

    // The gen from the status does not get changed on user input.
    const statusGen = settings.status.gen;

    const labelStyle = {
      textAlign: 'right',
    };

    const spaceBelowStyle = {
      margin: '0px 0px 15px',
    };

    const ir = settings.config.ir;
    const usb = settings.config.usb;
    const source = settings.config.source;
    const display = settings.config.display;
    const device = settings.config.gen.type === 'encoder' ? source : display; 
    const deviceIconsObj = settings.config.gen.type === 'encoder' ? iconsObj : decoderIconsObj;
    const genericDevice = settings.config.gen.type === 'encoder' ? 'GenericVideoSource' : 'GenericDisplay';
    const audioConnections = settings.config.audioConnections;
    const audioOutSourceType = settings.config.audioOutSourceType;
    const usbDownlinks = settings.config.usbDownlinks;

    let videoPorts = ['hdmi'];
    if (settings && settings.capabilities && settings.capabilities['video-port']) {
      videoPorts = settings.capabilities['video-port'].values.split(':');
    }

    // Example of videoPortOptions:
    // [
    //   { value: 'hdmi', label: 'hdmi' },
    //   { value: 'hdsdi', label: 'hdsdi' },
    // ]
    const videoPortOptions = videoPorts.map((videoPort) => {
      return (
        { value: videoPort, label: videoPort }
      );
    });

    const IpModes = {
      Zyper4K: 
        [
          { value: 'dhcp', label: 'DHCP' },
          { value: 'static', label: 'Static' },
        ],
      ZyperUHD: 
        [
          { value: 'link-local', label: 'Link Local' },
          { value: 'dhcp', label: 'DHCP' },
          { value: 'static', label: 'Static' },
        ],
      ZyperHD: 
        [
          { value: 'link-local', label: 'Link Local' },
          { value: 'dhcp', label: 'DHCP' },
        ],
    };
    const Baudrates = [
      { value: '9600', label: '9600' },
      { value: '19200', label: '19200' },
      { value: '38400', label: '38400' },
      { value: '57600', label: '57600' },
      { value: '115200', label: '115200' }
    ];

    const isDecoder = (settings.config.gen.type === 'decoder');
    const isEncoder = (settings.config.gen.type === 'encoder');

    // Video port can be displayed as read only or a drop down list.
    // Only allow choosing video port if capabilities has more than one to choose from.
    // Only show the section for decoders.
    let videoPortStyle = { display: 'none' };
    if (isEncoder) {
      if (videoPorts.length > 1) {
        videoPortStyle = {
          display: '',
          margin: '0px 0px 15px',
        };
      } else {
        videoPortStyle = { display: 'none ' };
      }
    }

    // IP address, mask and gateway can be displayed as read only or able to be edited.
    let editIpStyle;
    let readOnlyIpStyle;
    if (ip.ipMode === 'static') {
      editIpStyle = { display: '' };
      readOnlyIpStyle = { display: 'none' };
    } else {
      editIpStyle = { display: 'none ' };
      readOnlyIpStyle = { display: '' };
    }

    let ipAddressFeedbackStyle;
    if (ip.ipAddressFocus) {
      ipAddressFeedbackStyle = { display: '' };
    } else {
      ipAddressFeedbackStyle = { display: 'none' };
    }

    let ipMaskFeedbackStyle;
    if (ip.ipMaskFocus) {
      ipMaskFeedbackStyle = { display: '' };
    } else {
      ipMaskFeedbackStyle = { display: 'none' };
    }

    let ipGatewayFeedbackStyle;
    if (ip.ipGatewayFocus) {
      ipGatewayFeedbackStyle = { display: '' };
    } else {
      ipGatewayFeedbackStyle = { display: 'none' };
    }

//    let selIcon = (<div />);

    const iconNames = Object.keys(settings.config.gen.type === 'encoder' ? iconsObj : decoderIconsObj);
    const iconPaths = iconNames.map(key => {
      return settings.config.gen.type === 'encoder' ? iconsObj[key] : decoderIconsObj[key];
    });

      const caretStyle = {
        margin: '0px 7px 0px 215px',
      };

      const iconsCaret = this.state.showIcons ? 'fa fa-lg fa-caret-down' : 'fa fa-lg fa-caret-right';

      const iconsStyle = {
        display: 'flex',
        flex: '1',
        flexFlow: 'column nowrap',
        margin: 10,
        marginLeft: 0,
        width: 200,
        height: 440,
        overflow: 'auto',
//        borderStyle: 'solid',
//        borderWidth: 2,
//        borderColor: 'yellow'
      };

      const iconWidth = 40;
      const iconHeight = 40;

      const iconStyle = (selected) => {
        return {
            display: 'block',
            borderStyle: 'solid',
            borderWidth: selected ? 3 : 2,
            borderRadius: 5,
            borderColor: selected ? 'blue' : 'lightblue',
//            width: iconWidth,
//            height: iconHeight,
            float: 'left',
            margin: 3,
            cursor: selected ? 'default' : 'pointer',
            pointerEvents: selected ? 'none' : 'all'
          };
      };

      const imageStyle = (selected) => {
        return {
          borderWidth: '2px',
          borderColor: 'gray',
          // borderStyle: isDragging ? 'solid' : 'none',
          cursor: selected ? 'default' : 'pointer',
          margin: 1,
          
          objectFit: 'contain', 
        };
      };

      const showStyle = { display: 'block' };
      const hideStyle = { display: 'none' };

      const icons = iconPaths.map((path, index) => {

        const selected = iconNames[index] === (settings.config.gen.type === 'encoder' ?
          source.iconImageName : display.iconImageName);

        return (
          <Row style={iconStyle(selected)} key={index}
            onClick={() => {
              this.setIconImageName(settings.config.gen.mac, iconNames[index]);
            }}>
            <Col sm={3}>
              <img src={path} alt={iconNames[index]}
                height={iconHeight - 10} width={iconWidth - 10}
                className="nonDraggableImage"
                style={imageStyle(selected)}
              />
              </Col>
            <Col sm={9} style={ { marginTop: 7, paddingRight: 5, textAlign: 'right' } }>{iconNames[index]}</Col>
          </Row>
        );
      });


    const iconsButtonStyle = {
      display: 'flex',
//      flex: '0 0 auto',
      flex: '1',
      flexFlow: 'row nowrap',
      justifyContent: 'space-between',
//      justifyContent: 'center',
      alignItems: 'center',
//      width: 200,
//      height: 40,
      borderWidth: 2,
      borderColor: 'blue',
//      borderStyle: 'solid'
    };

//           style={imageStyle(selected)}
    let devIconImageName = device.iconImageName;

    if (devIconImageName === genericDevice) {
      if (settings.config.gen.type === 'encoder') {
        devIconImageName = 'SatelliteReceiver';
      } else {
        devIconImageName = 'FlatPanelDisplay';
      }
    }

    const iconImageStyle = {
      display: 'flex',
//      flex: '1',
      flex: '0 0 auto',
      justifyContent: 'center',
      alignItems: 'center',
      width: 80,
      height: 30,

//      padding: 2,
      borderWidth: 1,
      borderColor: 'red',
//      borderStyle: 'solid'
    };

    const iconsButtonImage = (
      <div style={iconsButtonStyle}>
        <div><span>Icons</span></div>
        <div style={iconImageStyle}>
          <img src={deviceIconsObj[devIconImageName]} alt={devIconImageName}
            height={iconHeight - 10} width={iconWidth - 10}
            className="nonDraggableImage"
            style={{ height: '125%', width: '125%', objectFit: 'contain', padding: 5 }}
          />
        </div>
        <div><span>{devIconImageName}</span></div>
        <div><span><i className={iconsCaret}></i></span></div>
      </div>
      );

    const selIcon = (
        <div className="col-sm-12">
          <Button onClick={(e) => {
            this.setState({ showIcons: !this.state.showIcons });
            e.stopPropagation();
          }}>{iconsButtonImage}
          </Button>
          <Collapse in={this.state.showIcons}>
            <div>
              <div style={iconsStyle}>
                {icons}
              </div>
            </div>
          </Collapse>
        </div>);

    const deviceProcessed = (
      <div style={{ minWidth: 300, paddingRight: 15 }}>
        <div className="row">
          <div className="col-sm-4" style={labelStyle}>IP Mode:</div>
          <div className="col-sm-8">
            <div>
              <Select
                name="ipMode"
                value={ip.ipMode}
                searchable={false}
                clearable={false}
                options={IpModes[this.model]}
                onChange={(selection) => {this.onIpModeChanged(selection.value);}}
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-4" style={labelStyle}>IP Address:</div>
          <div className="col-sm-8">
            <div>
              <span style={ editIpStyle }>
                <FormGroup
                  controlId="ipAddress"
                  validationState={this.isIpValid(ip.ipAddress)}
                >
                  <FormControl
                    type="text"
                    value={ip.ipAddress}
                    onFocus={this.onIpAddressFocus}
                    onChange={this.onIpAddressChanged}
                    onBlur={this.onIpAddressUpdated}
                  />
                  <FormControl.Feedback style={ ipAddressFeedbackStyle } />
                </FormGroup>
              </span>
              <span style={ readOnlyIpStyle }>
                {ip.ipAddress}
              </span>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-4" style={labelStyle}>IP Mask:</div>
          <div className="col-sm-8">
            <div>
              <span style={ editIpStyle }>
                <FormGroup
                  controlId="ipMask"
                  validationState={this.isIpValid(ip.ipMask)}
                >
                  <FormControl
                    type="text"
                    value={ip.ipMask}
                    onFocus={this.onIpMaskFocus}
                    onChange={this.onIpMaskChanged}
                    onBlur={this.onIpMaskUpdated}
                  />
                  <FormControl.Feedback style={ ipMaskFeedbackStyle } />
                </FormGroup>
              </span>
              <span style={ readOnlyIpStyle }>
                {ip.ipMask}
              </span>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-4" style={labelStyle}>IP Gateway:</div>
          <div className="col-sm-8">
            <div>
              <span style={ editIpStyle }>
                <FormGroup
                  controlId="ipGateway"
                  validationState={this.isIpValid(ip.ipGateway)}
                >
                  <FormControl
                    type="text"
                    value={ip.ipGateway}
                    onFocus={this.onIpGatewayFocus}
                    onChange={this.onIpGatewayChanged}
                    onBlur={this.onIpGatewayUpdated}
                  />
                  <FormControl.Feedback style={ ipGatewayFeedbackStyle } />
                </FormGroup>
              </span>
              <span style={ readOnlyIpStyle }>
                {ip.ipGateway}
              </span>
            </div>
          </div>
        </div>

        <hr />

        <div className="row" style={spaceBelowStyle}>
          <div className="col-sm-4" style={labelStyle}>Baudrate:</div>
          <div className="col-sm-8">
            <div>
              <Select
                name="baudrate"
                value={rs232.baudrate}
                searchable={false}
                clearable={false}
                options={Baudrates}
                onChange={(selection) => {this.onRs232BaudrateChanged(selection.value);}}
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-4" style={labelStyle}>Data Bit:</div>
          <div className="col-sm-8">
            <div>
              <FormGroup controlId="databit">
                <Radio inline
                  value="7"
                  checked={rs232.dataBit === '7'}
                  onChange={this.onRs232DataBitChanged}>
                7
                </Radio>
                <Radio inline
                  value="8"
                  checked={rs232.dataBit === '8'}
                  onChange={this.onRs232DataBitChanged}>
                8
                </Radio>
              </FormGroup>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-4" style={labelStyle}>Stop Bit:</div>
          <div className="col-sm-8">
            <div>
              <FormGroup controlId="stopbit">
                <Radio inline
                  value="1"
                  checked={rs232.stopBit === '1'}
                  onChange={this.onRs232StopBitChanged}>
                  1
                </Radio>
                <Radio inline
                  value="2"
                  checked={rs232.stopBit === '2'}
                  onChange={this.onRs232StopBitChanged}>
                2
                </Radio>
              </FormGroup>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-4" style={labelStyle}>Parity:</div>
          <div className="col-sm-8">
            <div>
              <FormGroup controlId="parity">
                <Radio inline
                  value="even"
                  checked={rs232.parity === 'even'}
                  onChange={this.onRs232ParityChanged}>
                  Even
                </Radio>
                <Radio inline
                  value="odd"
                  checked={rs232.parity === 'odd'}
                  onChange={this.onRs232ParityChanged}>
                  Odd
                </Radio>
                <Radio inline
                  value="none"
                  checked={rs232.parity === 'none'}
                  onChange={this.onRs232ParityChanged}>
                  None
                </Radio>
              </FormGroup>
            </div>
          </div>
        </div>

        <hr />

        <div className="row" style={this.deviceSettings.isModel('ZyperUHD', 'ZyperHD') ? showStyle : hideStyle}>
          <div className="col-sm-3" style={labelStyle}></div>
          <div className="col-sm-9">
            <div>
              <FormGroup controlId="parity">
                <Checkbox inline
                  checked={isVideoPreview}
                  onChange={this.onVideoPreviewChanged}>
                  Video Preview
                </Checkbox>
              </FormGroup>
            </div>
          </div>
        </div>
        <hr style={this.deviceSettings.isModel('ZyperUHD', 'ZyperHD') ? showStyle : hideStyle} />

        <div className="row" style={videoPortStyle}>
          <div className="col-sm-4" style={labelStyle}>Video Port:</div>
          <div className="col-sm-8">
            <div>
              <Select
                name="videoPort"
                value={ports.videoPort}
                searchable={false}
                clearable={false}
                options={videoPortOptions}
                onChange={(selection) => {this.onVideoPortChanged(selection.value);}}
              />
            </div>
          </div>
        </div>

        {selIcon}
      </div>
    );
    return deviceProcessed;
  }
}
