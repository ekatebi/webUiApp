// import { findDOMNode } from 'react-dom';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { DropTarget as dropTarget } from 'react-dnd';
import { DndItemTypes } from '../../constant/dndItemTypes';
import { Well, Collapse, Button, Overlay, Label, Grid, Row, Col } 
  from 'react-bootstrap';
// import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import * as actions from './actions';
import Device from '../device/Device';
import { confirm } from '../confirm/service/confirm';
import _flow from 'lodash/flow';
import ToolTip from '../ToolTip';

const mvEncoderDropTarget = {
  canDrop: (props, monitor) => {

    // You can disallow drop based on props or item
    const item = monitor.getItem();

//    console.log('mvWinDropTarget canDrop', item);
//    return props.settings.status.gen.type === 'decoder';
    return item.settings && item.settings.gen.type === 'encoder' &&
      item.capabilities && item.capabilities['send-multicasts'] && 
      item.capabilities['send-multicasts'].values === 'settable';
//    && (!props.formDataEx.model || item.settings.gen.model === props.formDataEx.model);
  },

  drop: (props, monitor, component) => {
    const srcName = monitor.getItem().config.gen.name;
    const srcModel = monitor.getItem().status.gen.model;
    console.log('MvWin drop', srcName, srcModel);
  }
};

function collectForDropTarget(connect, monitor) {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDropTarget: connect.dropTarget(),
    // You can ask the monitor about the current drag state:
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType(),
    dragItem: monitor.getItem(),
    initialClientOffset: monitor.getInitialClientOffset(),
    clientOffset: monitor.getClientOffset(),
    differenceFromInitialOffset: monitor.getDifferenceFromInitialOffset()
  };

}

class MvEncoder extends Component {

  constructor(props) {
    super(props);
    this.findIndexInDeviceList = this.findIndexInDeviceList.bind(this);
    this.clearEncoder = this.clearEncoder.bind(this);
    this.state = { deviceSettings: undefined };
  }

  componentWillMount() {
    this.findIndexInDeviceList(this.props);
  }

  componentWillReceiveProps(newProps) {
    this.findIndexInDeviceList(newProps);
  }

  findIndexInDeviceList(props) {
    const { encoders, encoderName } = props;

    function findConfig(config) {
      return encoderName && encoderName !== 'none' && config.gen.name === encoderName;
    }

    let index = -1;

    if (encoders && encoders.config && encoders.config.info) {
      index = encoders.config.info.text.findIndex(findConfig);
    }

    if (index > -1) {
      const deviceSettings = {};
      deviceSettings.status = encoders.status.info.text[index];      
      deviceSettings.config = encoders.config.info.text[index];
      deviceSettings.capabilities = encoders.capabilities.info.text[index];      
      this.setState({ deviceSettings });
    } else {
      this.setState({ deviceSettings: undefined });      
    }
  }

  clearEncoder() {
    const { item, itemChanged, winIndex } = this.props;

//    const srcName = monitor.getItem().config.gen.name;
//    const srcModel = monitor.getItem().status.gen.model;
//    console.log('MvWin drop', winIndex, srcName, srcModel);

    const wins = [...item.windows];
    const win = { ...wins[winIndex] };
    win['encoder-name'] = 'none';
    wins[winIndex] = win;

    itemChanged({ ...item, windows: [...wins] });
  }

  render() {

    const { dragging, win, winIndex, dragItem, item, connectDropTarget,
      winInUse, encoderName } = this.props;
    const { deviceSettings } = this.state;
/*
    if (winInUse) {
      console.log('deviceSettings', deviceSettings);
    }
*/
    const compStyle = {      
      display: 'flex',
      flex: '0 0 auto',
      flexFlow: 'row wrap',
      width: 105,
      height: 105,
//      pointerEvents: 'none'
    };

    const emptyCellStyle = {      
      display: 'flex',
      flex: '0 0 auto',
      flexFlow: 'row wrap',
      width: 100,
      height: 100,
      borderWidth: '3px',
      borderColor: 'lightblue',
      borderStyle: !deviceSettings ? 'solid' : 'none',
//      backgroundColor: isOverCurrent && canDrop ? 'lightblue' : '',
//      backgroundColor: lightblue,
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
//      borderStyle: 'solid',
//      display: 'flex',
//      flex: '1 1 auto',
//      minWidth: 85,
//      flexFlow: 'row nowrap',
//      justifyContent: 'space-between',
//      alignItems: 'flex-end',
//      alignSelf: 'center',
    };

    let devDiv;
//  data-tip={'clear decoder'}
    if (deviceSettings) {
      devDiv = (
        <div style={containerStyle}>     
          <div style={editStyle}>
            <span key={2}>
              <ToolTip placement={'top'} tooltip={'click to remove source from window'}>
                  <i className="fa fa-trash fa-lg" aria-hidden="true" id={'encoderTrashDiv'}></i>
              </ToolTip>
            </span>
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
      <div style={compStyle} id={'devDiv'}>
        {devDiv}
      </div>
    );

  }
}

function mapStateToProps(state, props) {

  const { item } = state.multiview;
  const { encoders } = state.device;

  const { winIndex } = props;

  return {
    item,
    encoders,
    winInUse: item && item.windows && winIndex < item.windows.length, 
    winIndex,
    encoderName: item && item.windows && winIndex < item.windows.length ? 
      item.windows[winIndex]['encoder-name'] : ''
  };

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

module.exports = _flow(
//  dropTarget([DndItemTypes.JOIN], mvEncoderDropTarget, collectForDropTarget),
  connect(mapStateToProps, mapDispatchToProps)
)(MvEncoder);
