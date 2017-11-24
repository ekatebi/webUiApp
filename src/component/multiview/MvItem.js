import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';
import { DropTarget as dropTarget } from 'react-dnd';
import { Well, Collapse, Button, Overlay, Label, Grid, Row, Col } 
  from 'react-bootstrap';
import * as actions from './actions';
import { getPosition } from '../../service/dom';
import DevicePopupPanel from '../DevicePopupPanel';
import { DndItemTypes } from '../../constant/dndItemTypes';
import { confirm } from '../confirm/service/confirm';
import MvItemImage from './MvItemImage';
import { itemBackgroundColor } from '../../constant/app';
import _flow from 'lodash/flow';
import ToolTip from '../ToolTip';

class MvItem extends Component {

  constructor(props) {
    super(props);
//    this.joinSrc = this.joinSrc.bind(this);
    this.animateEx = this.animateEx.bind(this);
    this.updatePosition = this.updatePosition.bind(this);
    this.popupToggle = this.popupToggle.bind(this);
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

  render() {

    const { index, item, model, showEditor, onRequestDeleteItem, isConfig,
      connectDropTarget, onSelectMultiview, selectedMultiview } = this.props;
    const { showPopup, popupPanelPosition, elemId, animationValue } = this.state;

    let borderWidth = 3;

    if (animationValue > 0) {
      if (animationValue === 2) {
        borderWidth *= 2;
      } else {
        borderWidth *= 3;
      }
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
      backgroundColor: selectedMultiview && selectedMultiview.gen.name === item.gen.name ? 
        'grey' : itemBackgroundColor
    };

    const preStyle = {
      textAlign: 'left',
      overflow: 'auto',
      maxHeight: 300
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

    const mvNameStyle = {
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

      display: 'flex',
      flex: '1',
      flexFlow: 'row nowrap',
      justifyContent: 'center',
//      alignItems: 'center',
      margin: 'auto',

//      position: 'relative',
      marginLeft: -2,

      borderWidth: 2,
      borderColor: 'green',
//      borderStyle: 'solid',
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

    const mvDetails = () => {
      return (
        <DevicePopupPanel
          position={popupPanelPosition}
          settings={{
            title: `Multiview - ${item.gen.name}`,
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

      link = (<i className="fa fa-link fa-lg" aria-hidden="true" style={ { marginLeft: 3, marginTop: -3 } }
                data-multiline data-tip={`Source: ${item.gen.videoSourceName ? item.gen.videoSourceName : item.gen.videoSourceMac}`}></i>);
    }
//                   
    let editSpan = (<span key={0} />);
    let delSpan = (<span key={2} />);

    if (showEditor && isConfig && !window.isMobile) {
      editSpan = (
        <span key={0} style={ { cursor: 'pointer' } } onClick={(e) => {
          e.preventDefault();
          showEditor(true, item, index);
        }}><i className="fa fa-pencil-square-o fa-lg" aria-hidden="true"></i></span>);
    }

    if (onRequestDeleteItem && isConfig && !window.isMobile) {
      delSpan = (
        <span key={2} style={ { cursor: 'pointer' } } onClick={(e) => {
          e.preventDefault();

          confirm('Are you sure?', {
            description: `Would you like to remove \"${item.gen.name}\" multiview?`,
            confirmLabel: 'Remove',
            abortLabel: 'Cancel'
          }).then(() => {
            onRequestDeleteItem(item.gen.name);
          });

        }}>
          <i className="fa fa-trash fa-lg" aria-hidden="true">
        </i></span>);
    }

    const modelStyle = {
//      marginTop: -2, 
//      marginLeft: 0, 
      fontSize: 11,

//      borderWidth: 2,
//      borderColor: 'lightgreen',
//      borderStyle: 'solid',
    };

    return (
      <div id={elemId} style={compStyle}
          onClick={(e) => {
            if (selectedMultiview && selectedMultiview.gen.name === item.gen.name) {
              onSelectMultiview();
            } else {
              onSelectMultiview(item);
            }
            e.stopPropagation();
          }}>
        <div className="item top" style={modelStyle}>
          <strong>{item.model}</strong>
        </div>
        <div className="item mid">
          <div className="item mid side" />
          <MvItemImage item={item} />
          <div className="item mid side">
            {link}
          </div>
        </div>
        <div className="item bottom">
          {editSpan}
          <h4 style={wallNamecontainerStyle}>
            <ToolTip placement={showPopup ? 'top' : 'bottom'} 
              tooltip={item.gen.name}>
              <a style={mvNameStyle}
                onClick={(e) => {
                  this.popupToggle();
                  e.stopPropagation();
                } }>{item.gen.name}
              </a>
            </ToolTip>
          </h4>
          {delSpan}
        </div>

        {/*
        <div style={imageBlockStyle}>
          <Row>
            <Col sm={1} smOffset={0}>
              <div style={{ marginTop: -3, marginLeft: 1, fontSize: 12 }}>{item.model}</div>
            </Col>
            <Col sm={4} smOffset={0} style={{ marginLeft: 5, marginTop: 10 }}>              
              <div style={imageStyle}>
                <MvItemImage item={item} />
              </div>
            </Col>
            <Col xs={3} xsOffset={8} style={{ marginTop: -40 }}>
              {link}
            </Col>
          </Row>
        </div>
        <Row>
          <div style={editStyle}>
            {editSpan}
            <h4 style={wallNamecontainerStyle}>
              <ToolTip placement={showPopup ? 'top' : 'bottom'} 
                tooltip={item.gen.name}>
                <a style={mvNameStyle}
                  onClick={(e) => {
                    this.popupToggle();
                    e.stopPropagation();
                  } }>{item.gen.name}
                </a>
              </ToolTip>
            </h4>
            {delSpan}
          </div>        
        </Row>

      */}
      <Overlay show={showPopup} onEnter={this.updatePosition}>
        {mvDetails()}
      </Overlay>

      </div>
    ); 
  }
}

function mapStateToProps(state) {

  const { dragging, grid, editorShowing, canDrop, gridRec, selectedMultiview } = state.multiview;

  return {
    selectedMultiview,
    dragging,
    editorShowing,
    grid,
    canDrop,
    gridRec
  };

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

module.exports = _flow(
//  dropTarget([DndItemTypes.MULTIVIEW], mvGridDropTarget, collectForDropTarget),
  connect(mapStateToProps, mapDispatchToProps)
)(MvItem);
