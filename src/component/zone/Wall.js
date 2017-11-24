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
import WallItem from '../wall/WallItem';

class Wall extends Component {

  constructor(props) {
    super(props);
    this.findInWallList = this.findInWallList.bind(this);
    this.state = { wallSettings: undefined };
  }

  componentWillMount() {
    this.findInWallList(this.props);
  }

  componentWillReceiveProps(newProps) {
    this.findInWallList(newProps);
  }

  findInWallList(props) {
    const { wallList, wallName } = props;

    function findWall(item) {
      return item.gen.name === wallName;
    }

    this.setState({ wallSettings: wallList.find(findWall) });
  }

  render() {

    const { wallSettings } = this.state;
    const { removeWall, wallName, isConfig } = this.props;

//    console.log('Wall', wallSettings);

    const compStyle = {      
      display: 'flex',
      flex: '0 0 auto',
      flexFlow: 'row wrap',
      width: 105,
      height: 105
    };

    const emptyCellStyle = {      
      display: 'flex',
      flex: '0 0 auto',
      flexFlow: 'row wrap',
      width: 100,
      height: 100,
      borderWidth: '3px',
      borderColor: 'lightblue',
      borderStyle: !wallSettings ? 'solid' : 'none',
//      backgroundColor: 'lightblue',
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
      display: removeWall ? 'inherit' : 'none'
    };

//    let devDiv = (<div>{`${row},${column}, ${formData.matrix[row][column]}`}</div>);
    let devDiv;
//  data-tip={'clear decoder'}
    if (wallSettings) {
      devDiv = (
        <div style={containerStyle}>     
          <div style={editStyle}>
            {isConfig ? (<span className="devModel" style={ { cursor: 'pointer' } } key={2} onClick={(e) => {
              e.preventDefault();
              removeWall(wallName);
            }}>
              <i className="fa fa-trash fa-lg" aria-hidden="true">
            </i></span>) : (<span />)}
          </div>
          <div style={devStyle}>
            <WallItem item={wallSettings} />
          </div>
        </div>);
    } else {
      devDiv = (<div style={emptyCellStyle} />);
    }

    return (
      <div style={compStyle}>
        {devDiv}
    </div>
    );
  }
}

function mapStateToProps(state) {

  return {
    wallList: state.wall.list,
  };

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Wall);
