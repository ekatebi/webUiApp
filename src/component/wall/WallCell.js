/* eslint react/prop-types: 0 no-console: 0 */

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './actions';
import { Well, Collapse, Button, Overlay, Label, Grid, Row, Col } 
  from 'react-bootstrap';
import { findDOMNode } from 'react-dom';
import { DropTarget as dropTarget } from 'react-dnd';
import { DndItemTypes } from '../../constant/dndItemTypes';
import Device from '../device/Device';
import { confirm } from '../confirm/service/confirm';

const isDraggedDecoderInMatrix = (props, draggedItem) => {
  const { formDataEx, row, column } = props;

  const displayName = draggedItem.config.gen.name;

  function findDecoderName(name) {
    return displayName === name;
  }

  let index = -1;

  for (let row = 0; row < formDataEx.matrix.length; row++) {

    index = formDataEx.matrix[row].findIndex(findDecoderName);

    if (index > -1) {
      break;
    }
  }

  return index > -1;
};

const wallCellDropTarget = {
  canDrop: (props, monitor) => {
    // You can disallow drop based on props or item
    const item = monitor.getItem();

//    console.log('WallCell canDrop', item);
//    return props.settings.status.gen.type === 'decoder';
    return item.settings && item.settings.gen.type === 'decoder' 
    && !isDraggedDecoderInMatrix(props, item)
    && (!props.formDataEx.model || item.settings.gen.model === props.formDataEx.model);
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
//    console.log('WallCell drop', props, monitor.getItem());
    // const { outputType, settings } = monitor.getItem();

    if (monitor.didDrop()) {
      // If you want, you can check whether some nested
      // target already handled drop
      return;
    }

    const displayName = monitor.getItem().config.gen.name;
    const displayModel = monitor.getItem().config.gen.model;

    const { formDataEx, formDataChangedEx, row, column } = props;

    if (!formDataEx.model) {
      formDataEx.model = displayModel;
    }

//    console.log('formDataEx.matrix', formDataEx.matrix);

    const newMatrix = formDataEx.matrix.map((rowItem, rowIndex) => {
      if (row === rowIndex) {

        const matrixRow = rowItem.map((colItem, colIndex) => {
          if (column === colIndex) {
            return displayName;
          }

          return colItem;
        });

        return matrixRow;
      }

      return rowItem;    
    });

//    console.log('newMatrix', newMatrix);

    let bezel = formDataEx.bezel;
    // ZyperUHD and ZyperHD are not allowed to have a bezel.
    if (formDataEx.model === 'ZyperUHD' || formDataEx.model === 'ZyperHD') {
      bezel = { top: 0, right: 0, bottom: 0, left: 0 };
    }
    
    formDataChangedEx({ ...formDataEx, matrix: newMatrix, bezel });
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

class WallCell extends Component {

  constructor(props) {
    super(props);
    this.findIndexInDeviceList = this.findIndexInDeviceList.bind(this);
    this.isDraggedItemAlreadyInMatrix = this.isDraggedItemAlreadyInMatrix.bind(this);
    this.clearDecoder = this.clearDecoder.bind(this);
    this.state = { deviceSettings: undefined, isAlreadyInMatrix: false };
  }

  componentWillMount() {
    this.findIndexInDeviceList(this.props);
  }

  componentWillReceiveProps(newProps) {
    this.findIndexInDeviceList(newProps);
    const { isOverCurrent } = newProps;
    if (isOverCurrent) { 
      this.isDraggedItemAlreadyInMatrix(newProps); 
    }
  }

  findIndexInDeviceList(props) {
    const { decoders, formData, formDataChanged, row, column } = props;

    function findConfig(config) {
      return formData.matrix[row] && formData.matrix[row][column] &&
        config.gen.name === formData.matrix[row][column];
    }

    let index = -1;
    if (decoders && decoders.config && decoders.config.info) {
      index = decoders.config.info.text.findIndex(findConfig);
    }

    if (index > -1) {
      const deviceSettings = {};
      deviceSettings.status = decoders.status.info.text[index];      
      deviceSettings.config = decoders.config.info.text[index];
      deviceSettings.capabilities = decoders.capabilities.info.text[index];      
      this.setState({ deviceSettings });

      if (!formData.model) {
        formDataChanged({ ...formData, model: deviceSettings.status.gen.model }, false);
      }
    }
  }

  isDraggedItemAlreadyInMatrix(props) {
    const { draggedItem, formData, row, column } = props;

    const displayName = draggedItem.config.gen.name;

    function findDecoderName(name) {
      return displayName === name;
    }

    let index = -1;

    for (let row = 0; row < formData.matrix.length; row++) {

      index = formData.matrix[row].findIndex(findDecoderName);

//      console.log('isDraggedItemAlreadyInMatrix', index, displayName, row, column);

      if (index > -1) {
        break;
      }
    }

    this.setState({ isAlreadyInMatrix: index > -1 });
  }

  clearDecoder() {

    this.setState({ deviceSettings: undefined });

    const { formData, formDataChanged, row, column } = this.props;

    const newMatrix = formData.matrix.map((rowItem, rowIndex) => {
      if (row === rowIndex) {

        const matrixRow = rowItem.map((colItem, colIndex) => {
          if (column === colIndex) {
            return 'none';
          }

          return colItem;
        });

        return matrixRow;
      }

      return rowItem;    
    });

    formDataChanged({ ...formData, matrix: newMatrix });

  }

  render() {

    const { formDataEx, row, column, isOverCurrent, canDrop, connectDropTarget, draggedItem } = this.props;
    const { deviceSettings, isAlreadyInMatrix } = this.state;

//    console.log('WallCell isAlreadyInMatrix', isAlreadyInMatrix);

    const compStyle = {      
      display: 'flex',
      flex: '0 0 auto',
      flexFlow: 'row wrap',
      width: 105,
      height: 105,
    };

    let backgroundColor = '';

    if (isOverCurrent && draggedItem.settings && draggedItem.settings.gen.type === 'decoder') {
      backgroundColor = isAlreadyInMatrix || 
        (formDataEx.model && formDataEx.model !== draggedItem.settings.gen.model) ? 
          'pink' : 'lightblue';
    }

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
      backgroundColor,
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

//    let devDiv = (<div>{`${row},${column}, ${formData.matrix[row][column]}`}</div>);
    let devDiv;
//  data-tip={'clear decoder'}
    if (deviceSettings) {
      devDiv = (
        <div style={containerStyle}>     
          <div style={editStyle}>
            <span key={2} onClick={(e) => {
              // console.log('edit item clicked!');
              e.preventDefault();
             
              confirm('Are you sure?', {
                description: `Would you like to remove display, \"${deviceSettings.config.gen.name}\" from video wall?`,
                confirmLabel: 'Remove',
                abortLabel: 'Cancel'
              }).then(() => {
               this.clearDecoder();
              }).catch(() => {});

            }}>
              <i className="fa fa-trash fa-lg" aria-hidden="true">
            </i></span>
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
// {`${row},${column}`}
    return connectDropTarget(
      <div style={compStyle}>
        {devDiv}
    </div>
    );
  }
}

function mapStateToProps(state) {

  const { decoders } = state.device;
  const { formData } = state.wall;

  return {
    decoders,
    formData
  };

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

module.exports = dropTarget([DndItemTypes.JOIN],
  wallCellDropTarget, collect)(connect(mapStateToProps, mapDispatchToProps)(WallCell));
