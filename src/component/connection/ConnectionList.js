import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import { Well, Collapse, Button, Overlay, Label, Grid, Row, Col }
  from 'react-bootstrap';
import * as actions from './actions';
import { getPosition } from '../../service/dom';
import ConnectionForm from './ConnectionForm';
import ConnectionItem from './ConnectionItem';
import { CONNECTION_VERSION } from './constants';
import { confirm } from '../confirm/service/confirm';
import AddItem from '../AddItem';
import ToolTip from '../ToolTip';

// import ConnectionItem from '../../container/ConnectionItem';
import { VideoTypes, DigitalAudioTypes, AnalogAudioTypes,
  Rs232Types, IrTypes, UsbTypes, ControlTypes }
  from './connectionTypes';

class ConnectionList extends Component {

  static propTypes = {
    settings: PropTypes.object.isRequired,
    configType: PropTypes.object,
    showName: PropTypes.bool,
    size: PropTypes.object,
    defaultConnectionChanged: PropTypes.func.isRequired,
    connectionData: PropTypes.object.isRequired
  };

  static defaultProps = {
    settings: {},
    showName: true,
    size: { width: 60, height: 60 }
  };

  constructor(props) {
    super(props);
    this.updatePosition = this.updatePosition.bind(this);
    this.getImagePath = this.getImagePath.bind(this);
    this.save = this.save.bind(this);
    this.edit = this.edit.bind(this);
    this.del = this.del.bind(this);
    this.formClose = this.formClose.bind(this);
    this.state = { showForm: false };
    this.compName = 'ConnectionList';
    this.elemId = '';
    this.popupPanelPosition = {};
    this.width = '42px';
    this.height = '42px';
  }

  componentDidUpdate(prevProps, prevState) {
    this.updatePosition();
  }

  componentWillUnmount() {
//    console.log('componentWillUnmount connectionList');
    this.formClose();
  }

  getImagePath() {
    const { settings, configType } = this.props;

    switch (settings.gen.type) {
      case 'encoder':
        return 'src/images/sat.jpg';
      case 'decoder':
        return 'src/images/Computer-monitor.jpg';
      default:
        return 'src/images/sat.jpg';
    }
  }

  updatePosition() {
    this.popupPanelPosition = getPosition(this.elem);
    this.popupPanelPosition.y += this.height;
    this.popupPanelPosition.x += this.width / 2;
  }

  edit(item) {
    const { connectionData, connectionFormDataChanged, settings } = this.props;
    const { model } = settings.gen;
    connectionFormDataChanged(model, item);
    item.defaultConnection = item.index === connectionData[model].defaultIndex;
    this.setState({ showForm: true });
  }

  save(item, noDefaultConnection = false) {
    const { connectionData, defaultConnectionChanged,
      connectionListChanged, settings, onSave } = this.props;
    const { model } = settings.gen;
    const { list, defaultIndex } = connectionData[model];

    delete item.dirty;

    if (item.index < 0) { // add item
      item.index = list.length;
      list.push(item);
    } else { // replace item
      list[item.index] = item;
    }

    connectionListChanged(model, list);

    if (noDefaultConnection) {
      return;
    }

    if (item.defaultConnection) {
      if (item.index !== defaultIndex) { // changed!
        defaultConnectionChanged(model, item.index);
      }
    } else if (item.index === defaultIndex) {
      defaultConnectionChanged(model, -1);
    }

    onSave();
  }

  del(item) {

    const { connectionData, defaultConnectionChanged,
      connectionListChanged, settings, onSave } = this.props;
    const { model } = settings.gen;
    const { list, defaultIndex } = connectionData[model];

    if (item.index === defaultIndex) {
      defaultConnectionChanged(model, -1);
    }

    list.splice(item.index, 1);
    this.setState({ showForm: false });
    connectionListChanged(model, list);
    onSave();
  }

  formClose(name) {
    const { connectionData, settings } = this.props;
    const { formData } = connectionData;
    if (name) {
      formData.name.value = name;
      this.setState({ showForm: false, item: undefined });
      if (formData && formData.dirty) {
        this.save(formData);
      }
    } else {
      this.setState({ showForm: false, item: undefined });
    }
  }

  render() {

    const {
      settings, configType, showName, size,
      connectDragSource, connectDragPreview, isDragging, canDrag,
      connectionData, onDefaultConnectionChanged, onRestoreFactoryDefaults
    } = this.props;

    const model = settings.gen.model;

    const { list, defaultIndex } = connectionData[model];

    const { showForm } = this.state;

    const compStyle = {
      display: 'flex',
      flex: '1',
      flexFlow: 'row wrap',
      maxWidth: 510,
      maxHeight: 460,

      borderWidth: '2px',
      borderColor: 'red',
//      borderStyle: 'solid'
    };

    const itemsDiv = list.map((item, index) => {
      const data = { ...item, index, defaultConnection: index === defaultIndex };
      return (
        <ConnectionItem key={index} sourceMac={settings.gen.mac} item={data}
          model={model} settings={settings} onEdit={this.edit} onDelete={this.del}
          defaultConnectionChanged={onDefaultConnectionChanged}
        />
      );
    });

    const listStyle = {
      display: 'flex',
      flex: '1',
      flexFlow: 'column nowrap',
      width: '100%',
      borderWidth: '2px',
      borderColor: 'lightgreen',
//      borderStyle: 'solid'
    };

    const itemsStyle = {
      borderWidth: '2px',
      borderColor: 'yellow',
      display: 'flex',
      flex: '1',
      flexFlow: 'row wrap',
      overflow: 'auto',
      width: '100%',
      maxHeight: 250,
      borderWidth: '2px',
      borderColor: 'lightgreen',
//      borderStyle: 'solid'
    };

    const floatingTipStyle = {
      display: 'flex',
      flex: '1 1 auto',
      flexFlow: 'row nowrap',
      width: '100%',
      justifyContent: 'space-between',
      alignContent: 'center',
      zIndex: 100,
      borderWidth: '2px',
      borderColor: 'yellow',
//      borderStyle: 'solid'
    };

  const innerStyle = {
      width: '100%',
      borderWidth: '2px',
      borderColor: 'green',
//      borderStyle: 'solid'
    };

    return (
      <div style={compStyle}>
        <div style={innerStyle}>
          <Collapse in={!showForm}>
            <div>
              <div style={listStyle}>
                <div style={floatingTipStyle}>
                  <AddItem tooltip="Add Connection" onClick={(e) => {
                      const { connectionFormDataChanged } = this.props;
                      connectionFormDataChanged(model, undefined);
                      this.setState({ showForm: !showForm });
                      e.stopPropagation();
                   }} />
                  <div>
                    <ToolTip placement="left" tooltip="Restore connection factory defaults">
                        <span style={{ cursor: 'pointer' }} onClick={(e) => {
                          confirm('Are you sure?', {
                            description: 'For all users, remove existing connection settings and restore factory defaults?',
                            confirmLabel: 'Yes',
                            abortLabel: 'No'
                          }).then(() => {
                            onRestoreFactoryDefaults();
                        }).catch(() => {});
                        e.stopPropagation();
                        }}><i className="fa fa-undo fa-lg" aria-hidden="true"></i></span>
                    </ToolTip>
                  </div>
                </div>
                <div style={itemsStyle}>
                  {itemsDiv}
                </div>
              </div>
            </div>
          </Collapse>

          <Collapse in={showForm}>
            <div>
              <ConnectionForm settings={settings} onClose={this.formClose} />
            </div>
          </Collapse>

        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ConnectionList);
