/* eslint react/prop-types: 0 no-console: 0 */

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './actions';
import { Well, Collapse, Button, Overlay, Label, Grid, Row, Col } 
  from 'react-bootstrap';
import { getPosition } from '../../service/dom';
import DevicePopupPanel from '../DevicePopupPanel';
import { findDOMNode } from 'react-dom';
import { DropTarget as dropTarget } from 'react-dnd';
import { DndItemTypes } from '../../constant/dndItemTypes';
import { confirm } from '../confirm/service/confirm';
import WallItemImage from './WallItemImage';
import { itemBackgroundColor, NO_CHANGE } from '../../constant/app';
import ToolTip from '../ToolTip';
import _flow from 'lodash/flow';

const wallItemDropTarget = {
  canDrop: (props, monitor) => {
    // You can disallow drop based on props or item
    const item = monitor.getItem();

//    console.log('WallCell canDrop', item);
//    return props.settings.status.gen.type === 'decoder';
//    return item.settings && item.settings.gen.type === 'decoder' && !isDraggedDecoderInMatrix(props, item);

    if (item.settings && item.settings.gen.type === 'decoder') {
      return false;
    }

    if (!props.item.model || (item && item.settings && item.settings.gen && props.item.model !== item.settings.gen.model.substring(5))) {
      return false;
    }

    return item && item.item && item.item.video && 
      (item.item.video.value === 'fast-switched' || item.item.video.value === 'none');
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

    component.joinSrc(sourceMac, item);
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

class WallItem extends Component {

  constructor(props) {
    super(props);
    this.joinSrc = this.joinSrc.bind(this);
    this.animateEx = this.animateEx.bind(this);
    this.updatePosition = this.updatePosition.bind(this);
    this.popupToggle = this.popupToggle.bind(this);
    this.clickHandler = this.clickHandler.bind(this);

    this.state = { showPopup: false, animate: false, animationValue: 0,
      popupPanelPosition: { x: 100, y: 100 }, elemId: undefined,
      compName: 'WallItem', height: 100, width: 100 };
  }

  componentWillMount() {
    const { item } = this.props;
    const { compName } = this.state;
    const elemId = `${compName}-${item.gen.name}`;
    this.setState({ elemId });
  }

  componentDidMount() {
    const { elemId } = this.state;
    const elem = document.getElementById(elemId);
  }

  joinSrc(sourceMac, joinItem) {
    this.animateEx(true, 2);
    const { item, onRequestJoinSrcToWall } = this.props;
    const { name } = item.gen;

    if (joinItem.video.value === 'none') {
//      console.log('joinSrc', joinItem.video.value, name);
      onRequestJoinSrcToWall(joinItem.video.value, name);
    } else {
//      console.log('joinSrc', sourceMac, name);
      onRequestJoinSrcToWall(sourceMac, name);
    }
    if (joinItem.digitalAudio.value !== NO_CHANGE || joinItem.analogAudio.value !== NO_CHANGE) {
      appAlert.info('Audio command to wall ignored. Apply audio to display or zone.');
    }
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

  popupToggle() {
    this.setState({ showPopup: !this.state.showPopup });
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

    const { item, selectedSource } = this.props;

//    console.log('clickHandler', selectedSource);

    if (selectedSource) {
      
      setTimeout(() => {
        this.animateEx(true, window.isMobile ? 5 : 2);
      }, 100);

      this.joinSrc(selectedSource.sourceMac, selectedSource.item);
    }
  }

  render() {

    const { index, item, model, showEditor, isOverCurrent, canDrop,
      onRequestDeleteWall, connectDropTarget, isConfig } = this.props;
    const { showPopup, popupPanelPosition, elemId, animationValue } = this.state;

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
//      paddingTop: 5,
//      paddingLeft: 2,
//      paddingRight: 2,
//      paddingBottom: 2,
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

    const wallNamecontainerStyle = {
      display: 'block',
      position: 'relative',
      textAlign: 'center',
      width: 60,
    };

    const wallNamecontainerStylen = {
      display: 'flex',
      flexFlow: 'row nowrap',
      justifyContent: 'space-around',
      alignItems: 'center',
      position: 'relative',
    };

    const wallNameStyle = {
      whiteSpace: 'nowrap',
      width: '80%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
//    border: '1px solid #000000',
      position: 'absolute',
      left: 5,
      top: -5,

      borderWidth: '2px',
      borderColor: 'lightgrey',
//      borderStyle: 'solid',
      cursor: window.diag ? 'pointer' : 'default',
      pointerEvents: !window.diag ? 'none' : 'all',
      fontSize: '9px',
      borderStyle: showPopup ? 'solid' : 'none'
    };

    const imageStyle = {
//      position: 'relative',
      borderWidth: '2px',
      borderColor: 'gray',
  //      borderStyle: isDragging ? 'solid' : 'none',
      cursor: 'default'
    };

    const imageBlockStyle = {
      display: 'block',
//      position: 'absolute'
    };

    const editStyle = {
      borderWidth: '2px',
      borderColor: 'purple',
//      borderStyle: 'solid',
      display: 'flex',
      flex: '1 1 auto',
      width: 85,
      flexFlow: 'row nowrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      alignSelf: 'center'
    };

    const wallDetails = () => {
      return (
        <DevicePopupPanel
          position={popupPanelPosition}
          settings={{
            title: `Wall - ${item.gen.name}`,
            id: item.gen.name,
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
                data-multiline data-tip={`Source: ${item.gen.videoSourceName ? item.gen.videoSourceName : item.gen.videoSourceMac}`}></i>);
    }
//                   
    let editSpan = (<span key={0} />);
    let delSpan = (<span key={2} />);

    if (showEditor && isConfig && !window.isMobile) {
      editSpan = (
        <span key={0} style={ { cursor: 'pointer' } } onClick={(e) => {
          // console.log('edit item clicked!');
          e.preventDefault();
//            onEdit(item);
          showEditor(true, item, index);
        }}><i className="fa fa-pencil-square-o fa-lg" aria-hidden="true"></i></span>);
    }

    if (onRequestDeleteWall && isConfig && !window.isMobile) {
      delSpan = (
        <span key={2} style={ { cursor: 'pointer' } } onClick={(e) => {
          // console.log('edit item clicked!');
          e.preventDefault();

          confirm('Are you sure?', {
            description: `Would you like to remove \"${item.gen.name}\" video wall?`,
            confirmLabel: 'Remove',
            abortLabel: 'Cancel'
          }).then(() => {
            onRequestDeleteWall(item.gen.name);
          }).catch(() => {});

        }}>
          <i className="fa fa-trash fa-lg" aria-hidden="true">
        </i></span>);
    }

//    console.log('render', elemId);

    const modelStyle = {
//      marginTop: -2, 
//      marginLeft: 0, 
      fontSize: 11,

//      borderWidth: 2,
//      borderColor: 'lightgreen',
//      borderStyle: 'solid',
    };

    return connectDropTarget(              
      <div id={elemId} style={compStyle}
        onClick={(e) => {
          this.clickHandler(e);
        }}>

        <div className="item top" style={modelStyle}>
          <strong>{item.model}</strong>
        </div>

        <div className="item mid">
          <div className="item mid side">

          </div>
            <div>
              <WallItemImage item={item} />
            </div>
          <div className="item mid side">
            {link}
          </div>
        </div>

        <div className="item bottom">
          {editSpan}
          <h4 style={wallNamecontainerStyle}>
            <ToolTip placement={showPopup ? 'top' : 'bottom'} 
              tooltip={item.gen.name}>
              <a style={wallNameStyle} data-tip={item.gen.name}
                 onClick={this.popupToggle}>{item.gen.name}
              </a>
            </ToolTip>
          </h4>
          {delSpan}
        </div>

        <Overlay show={showPopup} onEnter={this.updatePosition}>
          {wallDetails()}
        </Overlay>

      </div>
    ); 
  }
}

function mapStateToProps(state, props) {

  const { selectedSources } = state.device;

  const selectedSource = selectedSources.length === 1 ? selectedSources[0] : undefined;

  return {
    selectedSource
  };

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

module.exports = _flow(
  dropTarget([DndItemTypes.JOIN], wallItemDropTarget, collect),
  connect(mapStateToProps, mapDispatchToProps)
)(WallItem);

