// import { findDOMNode } from 'react-dom';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { DropTarget as dropTarget } from 'react-dnd';
import { DndItemTypes } from '../../constant/dndItemTypes';
import { Well, Collapse, Button, Overlay, Label, Grid, Row, Col } 
  from 'react-bootstrap';
// import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
// import { Rectangle, Line } from 'react-shapes';
import * as actions from './actions';
import MvPoint from './MvPoint';
import MvEncoder from './MvEncoder';
import _flow from 'lodash/flow';
import { confirm } from '../confirm/service/confirm';
import ToolTip from '../ToolTip';

const mvWinDropTarget = {
  canDrop: (props, monitor) => {

    // You can disallow drop based on props or item
    const item = monitor.getItem();

//    console.log('mvWinDropTarget canDrop', item);
//    return props.settings.status.gen.type === 'decoder';
    // return item.settings && item.status.gen.type === 'encoder';

    return item.settings && item.status.gen.type === 'encoder' &&
      item.capabilities && item.capabilities['join-video'] && 
      item.capabilities['join-video'].values &&
      item.capabilities['join-video'].values.indexOf('multiview') >= 0;
  },

  drop: (props, monitor, component) => {
    const { item, itemChanged, winIndex } = props;

    const srcName = monitor.getItem().config.gen.name;
//    const srcModel = monitor.getItem().status.gen.model;
//    console.log('MvWin drop', winIndex, srcName, srcModel);

    const wins = [...item.windows];
    const win = { ...wins[winIndex] };
    win['encoder-name'] = srcName;
    wins[winIndex] = win;

    itemChanged({ ...item, windows: [...wins] });
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
//    initialClientOffset: monitor.getInitialClientOffset(),
//    clientOffset: monitor.getClientOffset(),
//    differenceFromInitialOffset: monitor.getDifferenceFromInitialOffset()
  };

}

class MvWin extends Component {

  constructor(props) {
    super(props);
    this.deleteHandler = this.deleteHandler.bind(this);
    this.getPointDragShape = this.getPointDragShape.bind(this);
    this.updateWinOrder = this.updateWinOrder.bind(this);
    this.clearEncoder = this.clearEncoder.bind(this);
    this.findIndexInDeviceList = this.findIndexInDeviceList.bind(this);
    this.state = { mouseDownInterval: undefined, deviceSettings: undefined };
  }

  componentWillMount() {
    this.findIndexInDeviceList(this.props);
  }

  componentWillReceiveProps(newProps) {
    this.findIndexInDeviceList(newProps);
  }

  deleteHandler(e, data) {
    const { winIndex } = this.props;
    console.log('deleteHandler', winIndex);    
  }

  getPointDragShape() {
  
    const { dragging, grid, item, gridRec, winIndex, aspectRatio,
      clientOffset, differenceFromInitialOffset, win, canDropPoint } = this.props;

      const backgroundColor = canDropPoint ? 'grey' : 'pink';
      const borderStyle = 'solid';

      if (dragging.pointIndex === 0) { 
        return {
  //        opacity: 0.3,
//            position: 'fixed',
            position: 'absolute',
            display: 'flex',
//            flexFlow: 'column nowrap',
//            left: 0,
//            top: 0,
//            left: clientOffsetX,
//            top: clientOffsetY,
            left: Math.round(clientOffset.x - gridRec.left),
            top: Math.round(clientOffset.y - gridRec.top),
            width: Math.round((win.sizeX * gridRec.width) / 100),
            height: Math.round((win.sizeY * gridRec.height) / 100),
            backgroundColor,
            borderStyle
          };
      }

      const width = Math.round(((win.sizeX * gridRec.width) / 100) + differenceFromInitialOffset.x);
      const height = Math.round(((win.sizeY * gridRec.height) / 100) + differenceFromInitialOffset.y);

      if (!aspectRatio) {
        return {
          display: 'flex',
          // position: 'static',
          width,
          height,
          backgroundColor,
          borderStyle
        };
      }

      const widthPercent = width * 100 / gridRec.width;
      const heightPercent = height * 100 / gridRec.height;

      if (widthPercent < heightPercent) {
        return {
          display: 'flex',
          // position: 'static',
          width: `${widthPercent}%`,
          height: `${widthPercent}%`,
          backgroundColor,
          borderStyle
        };
      }

      return {
        display: 'flex',
        // position: 'static',
        width: `${heightPercent}%`,
        height: `${heightPercent}%`,
        backgroundColor,
        borderStyle
      };
          
  }

  updateWinOrder() {

    const { item, winIndex, itemChanged } = this.props;

    const wins = [...item.windows];
    const win = { ...wins[winIndex] };

    if (winIndex === wins.length - 1) {
      wins.splice(winIndex, 1);
      wins.unshift(win);
    } else {
      wins.splice(winIndex, 1);
      wins.push(win);
    }              

    itemChanged({ ...item, windows: [...wins] }, false);
  }

  findIndexInDeviceList(props) {
    const { encoders, encoderName } = props;
//    deviceSettings.status = decoders.status.info.text[i].gen.name;

    function findStatus(status) {
      return encoderName && encoderName !== 'none' && status.gen.name === encoderName;
    }

    let index = -1;

    if (encoders && encoders.status && encoders.status.info) {
      index = encoders.status.info.text.findIndex(findStatus);
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

    const wins = [...item.windows];
    const win = { ...wins[winIndex] };
    win['encoder-name'] = 'none';
    wins[winIndex] = win;

    itemChanged({ ...item, windows: [...wins] });
    this.setState({ deviceSettings: undefined });      

  }

  render() {

    const { dragging, win, winIndex, dragItem, itemChanged, isLarge, gridRec, showDrag,
      item, connectDropTarget, isEncoderName, canDrop, receiveDragging, isOver,
      clientOffset, isOverCurrent, xRayVision, receiveXrayVision, selectedSource } = this.props;
    const { mouseDownInterval, deviceSettings } = this.state;

    let backgroundColor = 'grey';

    if (isOverCurrent === true && canDrop === true) {
      backgroundColor = 'lightGreen';
    } else if (isOverCurrent === true && canDrop === false) {
      backgroundColor = 'pink';
    } else if (dragging && dragging.winIndex === winIndex) {
      backgroundColor = 'black';
    }

    let opacity = 1.0;

    if (dragging) {
      opacity = 0.7;
      if (dragging.winIndex === winIndex) {
        opacity = 0.3;
      }
    } else if (xRayVision && window.mv) {
      opacity = 0.5;
    }

    let winStyle = {
      display: winIndex < item.windows.length ? 'flex' : 'none',
      flexFlow: 'column nowrap',
      justifyContent: 'space-between',
      alignItems: 'center',

      position: winIndex < item.windows.length ? 'absolute' : 'static',

      opacity,
      left: `${win.posX.toString()}%`,
      top: `${win.posY.toString()}%`,
      width: `${win.sizeX.toString()}%`,
      height: `${win.sizeY.toString()}%`,
      backgroundColor,

      borderWidth: 2,
      borderColor: 'lightGreen',
      borderStyle: winIndex < item.windows.length ? 'solid' : 'none'
    };

    let dragDiv;

    if (dragging && dragging.winIndex === winIndex 
      && (winIndex < item.windows.length || showDrag) 
      && clientOffset && gridRec) {
      const dragStyle = { ...winStyle, ...this.getPointDragShape() };
      dragDiv =
        (<div style={dragStyle} />);
    }

    let audioDiv;
    let trashDiv = (<div />);
    let encoderDiv;
    let picInPicDiv;
    let topDiv;
    let labelDiv;

    if (isLarge) {

      const trashStyle = {
        display: 'flex',
        flex: '0 0 auto',
        flexFlow: 'row nowrap',
        alignSelf: 'flex-end',
      };

      const encoderStyle = {
        overflowX: 'hidden',
        overflowY: 'auto',
        display: isEncoderName ? 'flex' : 'none',
//        width: 130,
        height: 115,
//        flex: '0 1 auto',
//        flexFlow: 'column nowrap',
        margin: 'auto',

        borderWidth: 2,
        borderColor: 'lightGreen',
//        borderStyle: 'solid'
      };

      const labelStyle = {
        display: 'flex',
        flexFlow: isEncoderName ? 'row nowrap' : 'column nowrap',
        alignItems: 'center',
        alignSelf: 'center',
        fontSize: 'small',
      };

      const audioStyle = {
        display: 'flex',
        flex: '0 0 auto',
        flexFlow: 'row nowrap',
//        marginTop: 10
      };

      audioDiv = win.audioSource === true ? (<div style={audioStyle}>
            <span>
              <ToolTip placement={'top'} tooltip={'click to clear as audio source'}>
                <i className="fa fa-volume-up fa-lg" style={{ cursor: 'pointer', opacity: 1.0 }}
                  aria-hidden="true" id={'audioDiv'}></i>
              </ToolTip>
            </span>
          </div>) :
          (<div style={audioStyle}>
            <span>
              <ToolTip placement={'top'} tooltip={'click to set as audio source'}>
                <i className="fa fa-volume-off" style={{ cursor: 'pointer', opacity: 1.0 }} 
                  aria-hidden="true" id={'audioDiv'}></i>
              </ToolTip>
            </span>
          </div>);

      if (window.mv) {
        trashDiv = (<div style={trashStyle}>
              <span>
                <ToolTip placement={'top'} tooltip={'click to remove window from multiview'}>
                  <i className="fa fa-trash fa-lg" aria-hidden="true" id={'trashDiv'}></i>
                </ToolTip>
              </span>
            </div>);
      }
      
      encoderDiv =
          (<div style={encoderStyle}>
            <MvEncoder winIndex={winIndex} id={'encoderDiv'} />
          </div>);

      if (isEncoderName) {
        labelDiv =
          (<div style={labelStyle}>
            <div><span>{`${win.posX}, ${win.posY}`}</span></div>,&nbsp;
            <div><span>{`${win.sizeX} x ${win.sizeY}`}</span></div>
          </div>
          );
      } else {
        labelDiv =
          (<div style={labelStyle}>
            <div><span>{`${win.posX}, ${win.posY}`}</span></div>
            <div><span>{`${win.sizeX} x ${win.sizeY}`}</span></div>
          </div>
          );        
      }

      const PicInPicStyle = {
        display: isLarge ? 'flex' : 'none',
        flex: '0 0 auto',
        flexFlow: 'row nowrap',
        alignSelf: 'flex-start',
        justifyContent: 'center',
        alignItems: 'center',
        width: '15%',
        height: '15%',
        borderWidth: 2,
        borderColor: 'lightBlue',
        borderStyle: 'solid',
        fontSize: 'x-small',
        backgroundColor: typeof(win.layer) === 'undefined' || 
          (typeof(win.layer) === 'number' && win.layer === 1) ? 'grey' : 'lightBlue'
      };

      picInPicDiv = (<div style={PicInPicStyle} id={'picInPicDiv'}>
        {winIndex + 1}
      </div>
      );

      const topStyle = {
        display: isLarge ? 'flex' : 'none',
        flex: '0 0 auto',
        flexFlow: 'row nowrap',
        width: '100%',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        borderWidth: 2,
        borderColor: 'lightgreen',
//        borderStyle: 'solid',
      };

      topDiv = (<div style={topStyle}>
        <div style={{ width: 10 }} />
        {audioDiv}
        {trashDiv}
      </div>);

    }

    return connectDropTarget(
        <div>
        {dragDiv}
        <div style={winStyle} 
          onMouseDown={(e) => {
//            receiveDragging();
//            console.log('onMouseDown', e.target);

            if (!mouseDownInterval && !dragging && e.target.getAttribute('class') !== 'nonDraggableImage' &&
              e.target.id !== 'encoderDiv') {
              const interval = window.setInterval(() => {

                if (!xRayVision) {
                  receiveXrayVision(!xRayVision);
                }
              }, 200);
              this.setState({ mouseDownInterval: interval });              
            }
            e.preventDefault(); 
          } }
           onMouseUp={(e) => {
//            console.log('onMouseUp', e.target.id);
            if (mouseDownInterval) {
              window.clearInterval(mouseDownInterval);
              this.setState({ mouseDownInterval: undefined });
              if (xRayVision) {
                receiveXrayVision(!xRayVision);
              } else if (e.target.id === 'trashDiv') {
                confirm('Are you sure?', {
                  description: `Would you like to remove multiview window \"${winIndex}\"?`,
                  confirmLabel: 'Remove',
                  abortLabel: 'Cancel'
                }).then(() => {
                  const wins = [...item.windows];
                  wins.splice(winIndex, 1);
                  itemChanged({ ...item, windows: [...wins] });               
                }).catch(() => {});
              } else if (e.target.id === 'picInPicDiv') {
                const wins = [...item.windows];
/*                
                const layer = wins[winIndex].layer;
                wins.forEach((win, index) => {
                  if (winIndex !== index || win.layer > 1) {
                    win.layer = 1;
                  } else {
                    win.layer = 2;
                  }
                });
*/
                if (wins[winIndex].layer > 1) {
                  wins[winIndex].layer = 1;
                } else {
                  wins[winIndex].layer = 2;
                }

                itemChanged({ ...item, windows: [...wins] });
              } else if (e.target.id === 'encoderTrashDiv') {                
//               console.log('onMouseUp encoderTrashDiv', e.target.id);
                confirm('Are you sure?', {
                  description: `Would you like to remove source, \"${deviceSettings.config.gen.name}\" from multiview window?`,
                  confirmLabel: 'Remove',
                  abortLabel: 'Cancel'
                }).then(() => {
                 this.clearEncoder();
                }).catch(() => {});
              } else if (e.target.id === 'audioDiv') {
                const wins = [...item.windows];
                wins.forEach((win, index) => {
                  if (winIndex !== index || win.audioSource === true) {
                    win.audioSource = false;
                  } else {
                    win.audioSource = true;
                  }
                });
                itemChanged({ ...item, windows: [...wins] });
              } else {
                if (selectedSource) {

                  if (selectedSource.settings && selectedSource.status.gen.type === 'encoder' &&
                    selectedSource.capabilities && selectedSource.capabilities['join-video'] && 
                    selectedSource.capabilities['join-video'].values &&
                    selectedSource.capabilities['join-video'].values.indexOf('multiview') >= 0) {


                      const srcName = selectedSource.status.gen.name;

                      const wins = [...item.windows];
                      const win = { ...wins[winIndex] };
                      win['encoder-name'] = srcName;
                      wins[winIndex] = win;

                      itemChanged({ ...item, windows: [...wins] });
                  }
                } else {
                  this.updateWinOrder();                
                }
              }
            }
            e.preventDefault();
          } }
         >
          {topDiv}
          {encoderDiv}
          {labelDiv}
          {picInPicDiv}
        </div>
      </div>
    );

  }
}

function mapStateToProps(state, props) {

  const { dragging, grid, editorShowing, item, canDrop, spareWin, gridRec, aspectRatio,
    clientOffset, differenceFromInitialOffset, xRayVision } = state.multiview;
  const { encoders, selectedSource } = state.device;
  const { index } = props;

  return {
    selectedSource,
    aspectRatio,
    differenceFromInitialOffset,
    clientOffset,
    gridRec,
    item,
    dragging,
    editorShowing,
    xRayVision,
    grid,
    encoders,
    canDropPoint: canDrop,
    encoderName: item && item.windows && index < item.windows.length ? 
      item.windows[index]['encoder-name'] : '',
    isEncoderName: item && item.windows && index < item.windows.length &&
      item.windows[index]['encoder-name'] &&
      item.windows[index]['encoder-name'] !== 'none',
    winIndex: index,
    win: index < item.windows.length ? item.windows[index] : spareWin,
    isLarge: item && item.windows[index] && item.windows[index].sizeX > 10 && item.windows[index].sizeY > 10 
  };

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

module.exports = _flow(
  dropTarget([DndItemTypes.JOIN], mvWinDropTarget, collectForDropTarget),
  connect(mapStateToProps, mapDispatchToProps)
)(MvWin);
