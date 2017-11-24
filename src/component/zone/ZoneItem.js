/* eslint react/prop-types: 0 no-console: 0 */

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as zoneActions from './actions';
import { Well, Collapse, Button, Overlay, Label, Grid, Row, Col } 
  from 'react-bootstrap';
import { getPosition } from '../../service/dom';
import DevicePopupPanel from '../DevicePopupPanel';
import { findDOMNode } from 'react-dom';
import { DropTarget as dropTarget } from 'react-dnd';
import { DndItemTypes } from '../../constant/dndItemTypes';
import { confirm } from '../confirm/service/confirm';
import { fetchDeepDisplaysAndWallsOfZone } from './fetch';
import { itemBackgroundColor } from '../../constant/app';
import ToolTip from '../ToolTip';
import _flow from 'lodash/flow';

const zoneItemDropTarget = {
  canDrop: (props, monitor) => {
    // You can disallow drop based on props or item
    const item = monitor.getItem();

    return (item.settings && item.settings.gen.type === 'encoder' ||  
      item.item && item.item.video && item.item.video.value !== 'videoWall');
  },

  hover: (props, monitor, component) => {
//    console.log('WallCell hover', props.row, props.column, props);
    // This is fired very often and lets you perform side effects
    // in response to the hover. You can't handle enter and leave
    // hereif you need them, put monitor.isOver() into collect() so you
    // can just use componentWillReceiveProps() to handle enter/leave.

    // You can access the coordinates if you need them
    const clientOffset = monitor.getClientOffset();
    // const componentRect = findDOMNode(component).getBoundingClientRect();

    // You can check whether we're over a nested drop target
    const isJustOverThisOne = monitor.isOver({ shallow: true });

    // You will receive hover() even for items for which canDrop() is false
    const canDrop = monitor.canDrop();

  },

  drop: (props, monitor, component) => {
//    console.log('WallItem drop', monitor.getItem());
    // const { outputType, settings } = monitor.getItem();

    if (monitor.didDrop()) {
      // If you want, you can check whether some nested
      // target already handled drop
      return;
    }

    const { sourceMac, item } = monitor.getItem();

    component.animateEx(true, 2);
    props.onJoinSrc(monitor.getItem(), props.item);
  }
};

function collect(connect, monitor) {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDropTarget: connect.dropTarget(),
    // You can ask the monitor about the current drag state:
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType(),
    draggedItem: monitor.getItem()
//    mousePosition: getClientOffset()
  };
}

class ZoneItem extends Component {

  constructor(props) {
    super(props);
    this.animateEx = this.animateEx.bind(this);
    this.updatePosition = this.updatePosition.bind(this);
    this.popupToggle = this.popupToggle.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.state = { showPopup: false, animate: false, animationValue: 0,
      popupPanelPosition: { x: 100, y: 100 }, elemId: undefined, imageId: undefined,
      compName: 'ZoneItem', height: 100, width: 100 };
  }

  componentWillMount() {
    const { item } = this.props;
    const { compName } = this.state;
    const elemId = `${compName}-${item.name}`;
    const imageId = `${elemId}-image`;
    this.setState({ elemId, imageId });
  }

  componentDidMount() {
    const { elemId } = this.state;
    const elem = document.getElementById(elemId);
  }

  updatePosition() {
    const { elemId, height, width } = this.state;
    const elem = document.getElementById(elemId);
    const position = getPosition(elem);
    position.y += height + 5;
    // position.x += width / 2;

    const { x, y } = this.state.popupPanelPosition;

    if (x !== position.x || y !== position.y) {
      this.setState({ popupPanelPosition: position });
    }
  }

  popupToggle(e) {
    if (window.diag) {
      this.setState({ showPopup: !this.state.showPopup });
    } else {
      this.clickHandler(e);
    }
  }

  animateEx(on, val) {
    const { animate, animationValue } = this.state;
    const newVal = animationValue - 1;

    if (on) {
      this.setState({ animate: true, animationValue: val });
      this.animateEx(false, val);
    } else {
      if (animationValue > 0) {
        setTimeout(() => {
          this.setState({ animate: false, animationValue: newVal });
          this.animateEx(false, newVal);
        }, 400);
      }
    }
  }

  clickHandler(e) {

    const { item, onRequestList, selectedSource, onJoinSrc, 
      onSelectZone, onReceiveUncollapsed } = this.props;
    const { elemId, imageId } = this.state;

    if ((e.target.id === imageId || e.target.className === 'zoneName') && !selectedSource) {
      onRequestList(item);
      onSelectZone(item);
      onReceiveUncollapsed(item, true);
      e.preventDefault();
    } else if (selectedSource) {
      
      setTimeout(() => {
        this.animateEx(true, window.isMobile ? 5 : 2);
      }, 100);

      onJoinSrc({ ...selectedSource }, item);
    }
  }

  render() {

    const { index, item, showEditor, onRequestList, onRequestRemove, isOverCurrent, canDrop,
      connectDropTarget, isConfig, onSelectZone, onReceiveUncollapsed } = this.props;
    const { showPopup, popupPanelPosition, elemId, imageId, animationValue } = this.state;

    let borderWidth = 3;

    if (animationValue > 0) {
      if (animationValue === 2) {
        borderWidth *= 2;
      } else {
        borderWidth *= 3;
      }
    }

    let backgroundColor = itemBackgroundColor;

    if (isOverCurrent) {
      backgroundColor = canDrop ? 'lightGreen' : 'pink';
    }

    const compStyle = {
      margin: 2,
/*
      paddingTop: 5,
      paddingLeft: 2,
      paddingRight: 2,
      paddingBottom: 2,
*/
      borderColor: 'lightblue',
      borderStyle: 'solid',
      borderWidth,
      borderRadius: 10,
      opacity: showPopup ? '0.5' : '1',

      display: 'flex',
      flex: '0 1 auto',
      flexFlow: 'column nowrap',
      justifyContent: 'space-between',
  //    alignItems: 'flex-end',
  //    minWidth: 100,
  //    minHeight: 100,
      alignItems: 'center',
      width: 100,
      height: 100,
      backgroundColor
    };

    const preStyle = {
      textAlign: 'left',
      overflow: 'hidden'
    };

    const namecontainerStyle = {
      display: 'block',
      position: 'relative',
      width: 60,
    };

    const nameStyle = {
      whiteSpace: 'nowrap',
      width: '80%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
//    border: '1px solid #000000',
      position: 'absolute',
      left: 5,
      top: -4,

      cursor: 'pointer',
//      cursor: window.diag ? 'pointer' : 'default',
//      pointerEvents: !window.diag ? 'none' : 'all',
      fontSize: '9px',

      borderWidth: '2px',
      borderColor: 'lightgrey',
      borderStyle: 'none'
    };

    const imageStyle = {
//      position: 'relative',
      borderWidth: 2,
      borderColor: 'lightgrey',
//      borderStyle: 'solid',
  //      borderStyle: isDragging ? 'solid' : 'none',
      cursor: 'pointer',
//      marginLeft: -4,
//      marginTop: 5
    };

    const imageBlockStyle = {
      display: 'block',
//      position: 'absolute'
    };

    const imagePath = 'src/images/Zone.png';

    const editStyle = {
      borderWidth: '2px',
      borderColor: 'purple',
//      borderStyle: 'solid',
      display: 'flex',
      flex: '1 1 auto',
      width: 85,
      marginTop: 5,
      flexFlow: 'row nowrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      alignSelf: 'center'
    };

    const details = () => {
      return (
        <DevicePopupPanel
          position={popupPanelPosition}
          settings={{
            title: `Zone - ${item.name}`,
            id: item.name,
            onToggleItem: this.popupToggle }}>
         `<pre style={preStyle}>
            {JSON.stringify(item, 0, 2)}
          </pre>
        </DevicePopupPanel>
      );
    };

    let link = (<div />);

    if (item && item.gen && item.gen.videoSourceMac && 
      item.gen.videoSourceMac !== 'none' && 
      item.gen.videoSourceMac !== '00:00:00:00:00:00') {

      link = (<i className="fa fa-link fa-lg" aria-hidden="true"
                data-multiline data-tip={`Source: ${item.gen.videoSourceMac}`}></i>);
    }

    return (
      <div id={elemId} style={compStyle}

        onClick={(e) => {
          this.clickHandler(e);
        }}>
        <div className="item top" />
        <div className="item mid">
          <div className="item mid side" />
          {connectDropTarget(
            <img src={imagePath} alt={'zone'}
              height={60} width={60}
              className="nonDraggableImage" 
              style={imageStyle}
              id={imageId}
            />)}
          <div className="item mid side">
            {link}
          </div>
        </div>
        <div className="item bottom">
          {isConfig && !window.isMobile ? (
            <span key={0} style={ { cursor: 'pointer' } } onClick={(e) => {
              // console.log('edit item clicked!');
              onSelectZone(item);
              onReceiveUncollapsed(item, true);
              showEditor(true, item);
              e.preventDefault();
            }}><i className="fa fa-pencil-square-o fa-lg" aria-hidden="true"></i></span>) : (<span />)}

          <h4 style={namecontainerStyle}>
            <ToolTip placement="bottom" tooltip={item.name}>
              <a style={nameStyle} onClick={(e) => {this.popupToggle(e);}}><strong className="zoneName">{item.name}</strong></a>
            </ToolTip>
          </h4>

          {isConfig && !window.isMobile ? (<span key={2} style={ { cursor: 'pointer' } } onClick={(e) => {
            // console.log('edit item clicked!');
            e.preventDefault();

            confirm('Are you sure?', {
              description: `Would you like to delete zone \"${item.name}\"?`,
              confirmLabel: 'Delete',
              abortLabel: 'Cancel'
            }).then(() => {              
              onRequestRemove(item.id, item.name);
            }).catch(() => {});

          }}>
            <i className="fa fa-trash fa-lg" aria-hidden="true">
          </i></span>) : (<span />)}
        </div>
        {/*
        <div style={imageBlockStyle}>
          <Row>
            <Col xs={4} xsOffset={1} style={{ marginLeft: 13 }}>
              {connectDropTarget(
                <img src={imagePath} alt={'zone'}
                  height={60} width={60}
                  className="nonDraggableImage" 
                  style={imageStyle}
                  id={imageId}
                />)}
            </Col>
            <Col xs={3} xsOffset={8} style={{ marginTop: -57 }}>
              {link}
            </Col>
          </Row>
        </div>

        <div style={editStyle}>
          {isConfig && !window.isMobile ? (
            <span key={0} style={ { cursor: 'pointer' } } onClick={(e) => {
              // console.log('edit item clicked!');
              onSelectZone(item);
              onReceiveUncollapsed(item, true);
              showEditor(true, item);
              e.preventDefault();
            }}><i className="fa fa-pencil-square-o fa-lg" aria-hidden="true"></i></span>) : (<span />)}

          <h4 style={namecontainerStyle}>
            <ToolTip placement="bottom"
              tooltip={item.name}>
            <a style={nameStyle}
               onClick={(e) => this.popupToggle(e)}}><strong>{item.name}</strong>
            </a>
            </ToolTip>
          </h4>
          {isConfig && !window.isMobile ? (<span key={2} style={ { cursor: 'pointer' } } onClick={(e) => {
            // console.log('edit item clicked!');
            e.preventDefault();

            confirm('Are you sure?', {
              description: `Would you like to delete zone \"${item.name}\"?`,
              confirmLabel: 'Delete',
              abortLabel: 'Cancel'
            }).then(() => {              
              onRequestRemove(item.id, item.name);
            }).catch(() => {});

          }}>
            <i className="fa fa-trash fa-lg" aria-hidden="true">
          </i></span>) : (<span />)}
        </div>
        */}
      <Overlay show={showPopup} onEnter={this.updatePosition}>
        {details()}
      </Overlay>

      </div>
    ); 
  }
}

function mapStateToProps(state) {

  const { selectedSources } = state.device;

  const selectedSource = selectedSources.length === 1 ? selectedSources[0] : undefined;

  return {
    selectedSource
  };

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(zoneActions, dispatch);
}

module.exports = _flow(
  dropTarget([DndItemTypes.JOIN], zoneItemDropTarget, collect),
  connect(mapStateToProps, mapDispatchToProps)
)(ZoneItem);
