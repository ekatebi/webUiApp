import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
// import { findDOMNode } from 'react-dom';
import { Button, Overlay, Label, Grid, Row, Col, Radio } from 'react-bootstrap';
import { getPosition } from '../../service/dom';
import { DragSource as dragSource } from 'react-dnd';
import { DndItemTypes } from '../../constant/dndItemTypes';
// import { DeviceJoinConfigTypes } from '../../constant/deviceJoinConfigTypes';
import DeviceJoinConfig from '../device/DeviceJoinConfig';
// import InlineConfirmButton from 'react-inline-confirm';
import classNames from 'classnames';
import { confirm } from '../confirm/service/confirm';
import { itemBackgroundColor } from '../../constant/app';
import ToolTip from '../ToolTip';

const dndSource = {

  beginDrag: (props, monitor, component) => {
    // console.log('beginDrag', props, component);

    const { sourceMac, item, model } = component.props;

    return { sourceMac, item, model };
  },

  endDrag: (props, monitor, component) => {
    const { sourceMac, item, model } = component.props;

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
    const { sourceMac } = props;

    return sourceMac !== undefined;
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
    canDrag: monitor.canDrag()
  };
}

class ConnectionItem extends Component {

  static propTypes = {
    sourceMac: PropTypes.string,
    item: PropTypes.object.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
  };

  static defaultProps = {
    item: {},
  };

  constructor(props) {
    super(props);
    this.updatePosition = this.updatePosition.bind(this);
    this.devicePopupToggle = this.devicePopupToggle.bind(this);
    this.getDeviceType = this.getDeviceType.bind(this);
    this.state = { popupPanelPosition: { x: 100, y: 100 } };
    this.compName = 'ConnectionItem';
    this.elemId = '';
//    this.popupPanelPosition = { x: 100, y: 100 };
    this.width = 100;
    this.height = 100;
    this.deviceSettings = props.settings;
  }

  getDeviceType() {
    const { settings } = this.props;
    switch (settings.status.gen.type) {
      case 'encoder':
        return 'Source';
      case 'decoder':
        return 'Display';
      default:
        return settings.status.gen.type;
    }
  }

  updatePosition() {
    const position = getPosition(this.elem);
    position.y += this.height + 5;
    // position.x += this.width / 2;

    const { x, y } = this.state.popupPanelPosition;

    if (x !== position.x || y !== position.y) {
      this.setState({ popupPanelPosition: position });

      // console.log('updatePosition', position);
    }
  }

  devicePopupToggle() {
    this.setState({ showDevicePopup: !this.state.showDevicePopup });
  }

  render() {

    const {
      settings, configType, showName, size, defaultConnectionChanged,
      connectDragSource, connectDragPreview, isDragging, canDrag,
      onDelete, onEdit, item, model
    } = this.props;

    const { video, digitalAudio, analogAudio,
      rs232, ir, usb,
      name, index, defaultConnection } = item;

    const paramStyle = {
      display: 'flex',
      flex: '1',
      flexFlow: 'row nowrap',
      cursor: 'pointer',
      justifyContent: 'space-between'
    };

    const handleStyle = {
      display: 'flex',
      flex: '0 0 auto',
      flexFlow: 'column nowrap',
      cursor: canDrag ? 'move' : 'default',
      alignItems: 'center'
    };

    const selectableStyle = {
      cursor: 'pointer',
    };

    const paramDiv = (param, type) => {

      let shortName;

      switch (type) {
        case 'Video':
          shortName = '(V)';
          break;
        case 'Digital Audio':
          shortName = '(DA)';
          break;
        case 'Analog Audio':
          shortName = '(AA)';
          break;
        default:
          shortName = '';
      }

      const style = {
        textDecoration: param.value === 'none' ? 'line-through' : 'none',
        borderWidth: '2px',
        borderColor: 'red',
        // borderStyle: 'solid',

        display: param.value === 'noChange' ? 'none' : 'flex',
        flex: '0 1 auto',
        flexFlow: 'row nowrap',
//        cursor: 'pointer',
        alignItems: 'center'
      };

      let label = `${param.label} ${shortName}`;

      if (param.value === 'none' ||
          type === 'USB' ||
          type === 'RS232' ||
          type === 'Infrared') {
        label = type;
      }

      return (
          <div style={style}><span className="fa">{label}</span></div>
        );
    };

    const itemDiv = (item) => {

      const style = {
        borderColor: 'lightblue',
//        borderStyle: this.state.item === item ? 'solid' : 'none',
        borderWidth: '3px',
        borderRadius: 10,

//        width: 200, // size.width,
//        height: 200, // size.height,

//        display: 'block',
        display: 'flex',
        flex: '0 1 auto',
        flexFlow: 'column nowrap',
        alignItems: 'center'
      };

      return (
        <div style={style}>
          {paramDiv(item.video, 'Video')}
          {paramDiv(item.digitalAudio, 'Digital Audio')}
          {paramDiv(item.analogAudio, 'Analog Audio')}
          {paramDiv(item.rs232, 'RS232')}
          {paramDiv(item.ir, 'Infrared')}
          {paramDiv(item.usb, 'USB')}
        </div>
        );
    };

    const compStyle = {
      margin: 3,
      paddingTop: 5,
      paddingLeft: 2,
      paddingRight: 2,
      paddingBottom: 2,
      borderColor: 'lightblue',
      borderStyle: 'solid',
      borderWidth: '3px',
      borderRadius: 10,
      opacity: isDragging ? '0.5' : '1',
      display: 'flex',
      flex: '0 1 auto',
      flexFlow: 'column nowrap',
      justifyContent: 'space-between',
/*
      minWidth: 100,
      minHeight: 100,
      maxWidth: 130,
      maxHeight: 130
*/      
      width: 115,
      height: 115
    };

    if (defaultConnection) {
      compStyle.backgroundColor = itemBackgroundColor;
    }

    const editStyle = {
      borderWidth: '2px',
      borderColor: 'blue',
//        borderStyle: 'solid',

      display: 'flex',
      flex: '0 1 auto',
      flexFlow: 'row nowrap',
      justifyContent: item.readOnly ? 'space-around' : 'space-between',
      alignItems: 'flex-end',
//        alignSelf: 'flex-end'
    };

    const titleStyle = {
      borderWidth: '2px',
      borderColor: 'blue',
//        borderStyle: 'solid',

      display: 'flex',
      flex: '0 1 auto',
      flexFlow: 'row nowrap',
      justifyContent: 'space-between',
      alignItems: 'center'
//        alignSelf: 'flex-end'
    };

    const nameStyle = {
      paddingLeft: 3,
      paddingRight: 3,
      display: 'flex',
      flex: '1 1 auto',
      flexFlow: 'column nowrap',
//      justifyContent: 'space-around',
      alignItems: 'center'
    };

//    const textValues = ['', 'Are you sure?', 'Deleting...'];

    const btnClass = classNames({ hidden: item.readOnly });

    return connectDragSource(
      <div style={compStyle}>
        <div style={titleStyle}>
          <span style={handleStyle} key={0}>
            {connectDragPreview(<i className="fa  fa-bolt fa-2x" aria-hidden="true"></i>)}
          </span>
          <span style={nameStyle} key={1}>
            <i className="fa">{name.value}</i>
          </span>
        </div>

        {itemDiv(item)}

        <div style={editStyle}>
          <span style={selectableStyle} key={0} className={btnClass} onClick={(e) => {
            e.preventDefault();
            onEdit(item);
          }}>
            <i className="fa fa-pencil-square-o fa-lg" aria-hidden="true"></i>
          </span>
          <ToolTip placement="bottom" tooltip={ defaultConnection ? 'Default Connection' : undefined }>
            <span style={selectableStyle} key={1}
              onClick={(e) => {
                if (defaultConnection) {
                  defaultConnectionChanged(model, -1);
                } else {
                  defaultConnectionChanged(model, item.index);
                }
                e.stopPropagation();
            }}>
              <i className={`fa ${defaultConnection ? 'fa-dot-circle-o' : 'fa-circle-o'} fa-lg`} aria-hidden="true"></i>
            </span>
          </ToolTip>
          <span style={selectableStyle} key={2} className={btnClass} onClick={(e) => {
            e.preventDefault();
            confirm('Are you sure?', {
              description: `Would you like to remove \"${name.value}\" connection type?`,
              confirmLabel: 'Remove',
              abortLabel: 'Cancel'
            }).then(() => {
              onDelete(item);
            }).catch(() => {});
          }}>
            <i className="fa fa-trash fa-lg" aria-hidden="true"></i>
          </span>

        </div>
      </div>
    );
  }
}

module.exports = dragSource(DndItemTypes.JOIN,
  dndSource, collect)(ConnectionItem);
