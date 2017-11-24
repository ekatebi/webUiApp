import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import { Well, Collapse, form, Button, Checkbox, fieldset,
  ButtonToolbar, ControlLabel, FormControl } 
  from 'react-bootstrap';
import * as actions from './actions';
import { getPosition } from '../../service/dom';
import { DragSource as dragSource } from 'react-dnd';
import { DndItemTypes } from '../../constant/dndItemTypes';
import { DeviceJoinConfigTypes } from './deviceJoinConfigTypes';
import { VideoTypes, DigitalAudioTypes, AnalogAudioTypes, 
  Rs232Types, IrTypes, UsbTypes, ControlTypes } 
  from './connectionTypes';
import { CONNECTION_VERSION } from './constants';
import Select from 'react-select';
import SelectDigitalAudio from './SelectDigitalAudio';
import { confirm } from '../confirm/service/confirm';

class ConnectionForm extends Component {

  static propTypes = {
    settings: PropTypes.object.isRequired,
    configType: PropTypes.object,
    showName: PropTypes.bool,
    size: PropTypes.object,
    onClose: PropTypes.func,
    item: PropTypes.object
  };

  static defaultProps = {
    settings: {},
    configType: DeviceJoinConfigTypes.VIDEO,
    showName: true,
    size: { width: 60, height: 80 }
  };

  constructor(props) {
    super(props);
    this.updatePosition = this.updatePosition.bind(this);
    this.devicePopupToggle = this.devicePopupToggle.bind(this);
    this.selectChanged = this.selectChanged.bind(this);
    this.textChanged = this.textChanged.bind(this);
    this.boolChanged = this.boolChanged.bind(this);
    this.initFormData = this.initFormData.bind(this);
    this.close = this.close.bind(this);
    this.state = { dirty: false, toggleItemChange: false, name: '' };
    this.elemId = '';
    this.popupPanelPosition = {};
    this.width = '42px';
    this.height = '42px';
    this.defaultItem = {
      video: VideoTypes[0], 
      digitalAudio: DigitalAudioTypes[0],
      analogAudio: AnalogAudioTypes[0], 
      rs232: Rs232Types[0], 
      ir: IrTypes[0], 
      usb: UsbTypes[0],
      name: { label: 'Name', value: '' },
      index: -1,
      defaultConnection: false,
    };
  }

  componentWillMount() {
    this.initFormData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { isClosing } = this.state;
    if (!isClosing) {
      this.initFormData(nextProps);
    }
  }

  initFormData(props) {
    const { defaultItem } = this;
    const { connectionData, connectionFormDataChanged, settings } = props;
    const { model } = settings.gen;
    let { formData } = connectionData;

    if (!formData) {
      formData = { ...defaultItem };
      connectionFormDataChanged(model, formData);
    }

    if (!this.state.name) {
      this.setState({ name: formData.name.value });
    }
  }

  updatePosition() {
    this.popupPanelPosition = getPosition(this.elem);
    this.popupPanelPosition.y += this.height;
    this.popupPanelPosition.x += this.width / 2;
  }

  devicePopupToggle() {
    this.setState({ showPopup: !this.state.showPopup });
  }

  selectChanged(type, sel) {
    const { connectionData, connectionFormDataChanged, settings } = this.props;
    const { model } = settings.gen;
    const { formData } = connectionData;

    this.setState({ dirty: true });
    const newFormData = { ...formData, [type]: sel, dirty: true };
    connectionFormDataChanged(model, newFormData);
  }

  textChanged(type, text) {
    this.setState({ name: text, dirty: true });
  }

  boolChanged(name, value) {
    const { connectionData, connectionFormDataChanged, settings } = this.props;
    const { model } = settings.gen;
    const { formData } = connectionData;
    this.setState({ dirty: true });
    const newFormData = { ...formData, [name]: !formData[name], dirty: true };
    connectionFormDataChanged(model, newFormData); 
  }

  close(name) {
    const { onClose } = this.props;
    onClose(name);
    this.setState({ name: '', dirty: false });
  }

  render() {

    const {
      settings, configType, showName, size, connectionData,
      connectionFormDataChanged
    } = this.props;

    const { model } = settings.gen;
    const item = connectionData.formData;
    const { list } = connectionData[model];
    const { dirty, name } = this.state;

    const { video, digitalAudio, analogAudio, 
      rs232, ir, usb,
      index, defaultConnection } = item || this.defaultItem;


    const compStyle = {

      borderWidth: '2px',
      borderColor: 'lightgreen',
//      borderStyle: 'solid',

      display: 'flex',
      flex: '1 0 auto',
      width: 400,
      flexFlow: 'column nowrap',
      justifyContent: 'space-around',
      alignItems: 'flex-start'
    };

    const style = {

      borderWidth: '2px',
      borderColor: 'pink',
//      borderStyle: 'solid',
      width: 400,
    };

    const rowStyle = {
      margin: 0,
      padding: 0
    };

    const closeStyle = {
      margin: 0,
      padding: 0,
      justifyContent: 'flex-end',
    };

    function noVideoWall(videoType) {
      return videoType.value !== 'videoWall';
    }
    
    const VideoTypesEx = VideoTypes.filter(noVideoWall);

    return (
      <div style={compStyle}>
        <form style={style}>
          <div className="form-group row" style={rowStyle}>
            <div className="form-group col-sm-6">
              <ControlLabel>Video</ControlLabel>
              <Select
                name="video"
                value={video}       
                searchable={false}              
                clearable={false}
                options={VideoTypesEx}
                onChange={(sel) => {this.selectChanged('video', sel);}}
                />
            </div>
            <div className="form-group col-sm-6">
              <ControlLabel>RS232</ControlLabel>
              <Select
                name="rs232"
                value={rs232}
                searchable={false}              
                clearable={false}
                options={Rs232Types}
                onChange={(sel) => {this.selectChanged('rs232', sel);}}
                />
            </div>
          </div>  
          <div className="form-group row" style={rowStyle}>
            <div className="form-group col-sm-6">
              <ControlLabel>Digital Audio</ControlLabel>

              <SelectDigitalAudio settings={settings} 
                connectionData={connectionData} 
                connectionFormDataChanged={connectionFormDataChanged}
                />

            </div>
            <div className="form-group col-sm-6">
              <ControlLabel>Infrared</ControlLabel>
              <Select
                name="ir"
                value={ir}
                searchable={false}              
                clearable={false}
                options={IrTypes}
                onChange={(sel) => {this.selectChanged('ir', sel);}}
                />
            </div>
          </div>
          <div className="form-group row" style={rowStyle}>
            <div className="form-group col-sm-6">
              <ControlLabel>Analog Audio</ControlLabel>
              <Select
                name="analogAudio"
                value={analogAudio}
                searchable={false}              
                clearable={false}
                options={AnalogAudioTypes}
                onChange={(sel) => {this.selectChanged('analogAudio', sel);}}
                />
            </div>
            <div className="form-group col-sm-6">
              <ControlLabel>USB</ControlLabel>
              <Select
                name="usb"
                value={usb}
                searchable={false}              
                clearable={false}
                options={UsbTypes}
                onChange={(sel) => {this.selectChanged('usb', sel);}}
                />
            </div>            
          </div>
          <div className="form-group row" style={rowStyle}>
            <div className="form-group col-sm-6">
              <ControlLabel>Name</ControlLabel>
              <FormControl
                type="text"
                value={name}
                autoFocus
                placeholder="Enter connection name"
                onBlur={() => {
                  connectionFormDataChanged(model, { ...item, name: { ...item.name, value: name }, dirty: true }); 
                }}
                onChange={(e) => {
                  // console.log('onChange', 'e.target', e.target, 'e.target.value', e.target.value);
                  this.textChanged('name', e.target.value);
                }}
              />
            </div>
            <div className="form-group col-sm-6">
              <ControlLabel>&zwnj;</ControlLabel>
              <Checkbox checked={defaultConnection}
                onChange={(e) => {
                  // console.log('onChange', 'e.target', e.target, 'e.target.value', e.target.value);
                  this.boolChanged('defaultConnection', e.target.value);
                }}>
                Default Join Connection
              </Checkbox>
            </div>
          </div>
          <div className="form-group row" style={closeStyle}>
            <div className="form-group col-sm-3">
              <Button onClick={() => {
                if (!dirty) {
                  this.close();
                } else if (name && name.length > 0) {
                  // Check for unique name within the list of configurations for this model.
                  if (list.findIndex((conn, index) => {
                    return (index !== item.index) && (conn.name.value === name);
                  }) === -1) {
                    this.close(name);
                  } else {
                    confirm('Are you sure?', {
                      description: 'Connection name already exists. You can cancel and change the name or discard your changes.',
                      confirmLabel: 'Discard',
                      abortLabel: 'Cancel'
                    }).then(() => {
                      this.close();
                    }).catch(() => {});
                  }
                } else {
                  confirm('Are you sure?', {
                    description: 'Connection has no name and will get discarded. You can cancel and add name.',
                    confirmLabel: 'Discard',
                    abortLabel: 'Cancel'
                  }).then(() => {
                    this.close(name);
                  }).catch(() => {});
                }
              }}>Close</Button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { connectionData: state.joinConfigVersions[CONNECTION_VERSION].models };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectionForm);
