/* eslint react/prop-types: 0 no-console: 0 */

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './actions';
import ReactDOM from 'react-dom';
import { Button, Overlay, Label, Grid, Row, Col } from 'react-bootstrap';
import { getPosition } from '../../service/dom';
import { DragSource as dragSource } from 'react-dnd';
import { DndItemTypes } from '../../constant/dndItemTypes';
import _flow from 'lodash/flow';
import { iconsObj, decoderIconsObj } from '../../constant/app';

const dndSource = {

  beginDrag: (props, monitor, component) => {
    const { item } = props;
    return { item };
  },

  endDrag: (props, monitor, component) => {
    const { item } = component.props;

    if (!monitor.didDrop()) {
      // You can check whether the drop was successful
      // or if the drag ended but nobody handled the drop
//      console.log('endDrag not dropped');
      return;
    }

    // When dropped on a compatible target, do something.
    // Read the original dragged item from getItem():
    const item2 = monitor.getItem();

    // You may also read the drop result from the drop target
    // that handled the drop, if it returned an object from
    // its drop() method.
    const dropResult = monitor.getDropResult();

//    console.log('endDrag dropped', item2, dropResult);

        // This is a good place to call some Flux action
//        CardActions.moveCardToList(item.id, dropResult.listId);  
  },

  canDrag: (props) => {
    return true;
  }

};

const collect = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
    canDrag: monitor.canDrag()
  };
};

class WallItemImage extends Component {

  static propTypes = {
    item: PropTypes.object.isRequired,
    // configType: PropTypes.object,
    showName: PropTypes.bool,
    size: PropTypes.object
  };

  static defaultProps = {
    item: {},
    // configType: DeviceJoinConfigTypes.VIDEO,
    showName: true,
    size: { width: 60, height: 80 }
  };

  constructor(props) {
    super(props);
    this.updatePosition = this.updatePosition.bind(this);
    this.devicePopupToggle = this.devicePopupToggle.bind(this);
    this.state = { showPopup: false, showJoinConfigPanel: false };
    this.compName = 'WallItemImage';
    this.elemId = '';
    this.popupPanelPosition = {};
  }

  componentWillMount() {
    const { item, configType } = this.props;
    this.elemId = `${this.compName}-${item.name}`;
  }

  componentDidMount() {
    this.elem = document.getElementById(this.elemId);
    this.updatePosition();
  }

  componentDidUpdate(prevProps, prevState) {
    this.updatePosition();
  }

  updatePosition() {
    const { imageWidth, imageHeight } = this.props;
    this.popupPanelPosition = getPosition(this.elem);
    this.popupPanelPosition.y += imageHeight;
    this.popupPanelPosition.x += imageWidth / 2;
  }

  devicePopupToggle() {
    this.setState({ showPopup: !this.state.showPopup });
  }

  render() {

    const {
      item, configType, showName, size, iconImagePath, imageWidth, imageHeight,
      connectDragSource, connectDragPreview, isDragging, canDrag
    } = this.props;

    const { showPopup, showJoinConfigPanel } = this.state;

    const compStyle = {
      borderWidth: '2px',
      borderColor: 'blue',
      // borderStyle: showName ? 'solid' : 'none',
      opacity: isDragging ? '0.5' : '1',

//      width: this.width,
//      height: this.height,

//      marginRight: 3,
//      marginLeft: 3,

      display: 'flex',
      flex: '0, 1, auto',
      flexFlow: 'column nowrap'
    };

    const imageStyle = {
      borderWidth: '2px',
      borderColor: 'gray',
      // borderStyle: isDragging ? 'solid' : 'none',
      cursor: canDrag ? 'move' : 'default',
//      marginTop: window.isMobile ? 0 : 5,
//      marginLeft: window.isMobile ? 0 : 5
    };

    return connectDragSource(
        <div style={compStyle}>
          {connectDragPreview(
          <img src={iconImagePath} alt={'wall'}
            height={imageHeight} width={imageWidth}
            className="nonDraggableImage"
            style={imageStyle}
            />)}
        </div>);
  }
}

function mapStateToProps(state, props) {

  const { item } = props;
  const { encoders } = state.device;

  let iconImagePath = 'src/images/VideoWall.png';
  
  if (item && item.gen && item.gen.videoSourceName) {

      const srcConfig = encoders.config.info.text.find((srcCfg) => {
          return srcCfg.gen.name === item.gen.videoSourceName;
        });

      if (srcConfig && srcConfig.source && srcConfig.source.iconImageName) {
        // If the source is defined, use it.
        if (iconsObj[srcConfig.source.iconImageName]) {
          iconImagePath = iconsObj[srcConfig.source.iconImageName];
        }
      }
    }

  return {
    iconImagePath,
//    imageWidth: window.isMobile ? 52 : 42,
//    imageHeight: window.isMobile ? 52 : 42
    imageWidth: 42,
    imageHeight: 42
  };

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

module.exports = _flow(
  dragSource(DndItemTypes.JOIN, dndSource, collect),
  connect(mapStateToProps, mapDispatchToProps)
)(WallItemImage);

