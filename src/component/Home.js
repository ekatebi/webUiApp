import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { DropTarget as dropTarget } from 'react-dnd';
import _flow from 'lodash/flow';
import classNames from 'classnames';
// import Themes from './Themes';
import AlertContainer from './log/AlertContainer';
import AppMenu from './appMenu/AppMenu';
import AppPanes from './appPanes/AppPanes';
import { DndItemTypes } from '../constant/dndItemTypes';
import { getPosition } from '../service/dom';
import Auth from './auth/Auth';
import { StorageTypes } from '../constant/storageTypes';
import { ObjectStorage } from '../service/storage';
import { appName, appBackgroundColor } from '../constant/app';
import LogScoreboard from './log/LogScoreboard';
import AppUser from './auth/AppUser';

// const token = new ObjectStorage(sessionStorage, StorageTypes.AuthState);

const dropTargetHandler = {
  canDrop: (props, monitor) => {
    // You can disallow drop based on props or item
    const item = monitor.getItem();
    return true;
  },

  hover: (props, monitor, component) => {
    // This is fired very often and lets you perform side effects
    // in response to the hover. You can't handle enter and leave
    // hereif you need them, put monitor.isOver() into collect() so you
    // can just use componentWillReceiveProps() to handle enter/leave.

    // You can access the coordinates if you need them
    const clientOffset = monitor.getClientOffset();
//    const componentRect = findDOMNode(component).getBoundingClientRect();

    // You can check whether we're over a nested drop target
    const isJustOverThisOne = monitor.isOver({ shallow: true });

    // You will receive hover() even for items for which canDrop() is false
    const canDrop = monitor.canDrop();
  },

  drop: (props, monitor, component) => {

    if (monitor.didDrop()) {
      // If you want, you can check whether some nested
      // target already handled drop
      return;
    }

    const delta = monitor.getDifferenceFromInitialOffset();
    const initial = monitor.getInitialClientOffset();
    // const initial = monitor.getClientOffset();

    // Obtain the dragged item
    const item = monitor.getItem();

    const { elemId, mouseX, mouseY } = item;

    const left = Math.round((initial.x + delta.x) - mouseX);
    const top = Math.round((initial.y + delta.y) - mouseY);

    // const left = Math.round(initial.x + delta.x);
    // const top = Math.round(initial.y + delta.y);

    // console.log('drop at', left, top, 'from', initial.x, initial.y,
    // 'pointer', mouseX, mouseY);

    component.moveStatusPanel(elemId, left, top);
    // component.moveStatusPanel(elemId, pointer.x, pointer.y);
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
    itemType: monitor.getItemType()
//    mousePosition: getClientOffset()
  };
}

class Home extends Component {

  static propTypes = {
  };

  constructor(props) {
    super(props);
    this.moveStatusPanel = this.moveStatusPanel.bind(this);
    this.state = { displayAuth: false, displayAppPanes: false };
    this.alertOptions = {
      offset: 14,
      position: 'bottom left',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    };
  }

  moveStatusPanel(elemId, left, top) {
    // console.log('moveStatusPanel', left, top);
    // elem.style.position = 'absolute';
    // elem.style.position = 'relative';
    const elem = document.getElementById(elemId);
    elem.style.left = `${left}px`;
    elem.style.top = `${top}px`;
    // elem.style.zIndex = '10';
  }

  componentWillMount() {

    setTimeout(() => {
      this.setState({ displayAuth: true });
        }, 300);

    setTimeout(() => {
      this.setState({ displayAppPanes: true });
        }, 600);
  }
  
  render() {

    const { connectDropTarget, itemType, canDrop, token, pwChange } = this.props;
    const { displayAuth, displayAppPanes } = this.state;
  
    if (displayAuth && (!token || !token.role || token.forcePwChange === 1 || (token && token.role && pwChange))) {  
      return (<Auth />);
    }

    const outerStyle = {
//      display: 'flex',
//      flex: '1 0 auto',
//      flexFlow: 'column nowrap',


//      minHeight: '70%',
//      paddingTop: '3em 2em',
      textAlign: 'center',
      background: appBackgroundColor,
      overflow: 'hidden',
      minHeight: '100vh',
      WebkitUserSelect: 'none'
      
//      borderWidth: '2px',
//      borderColor: 'red',
//      borderStyle: 'solid',
//      padding: 2

    };

    const titleStyle = {
      display: 'block',
//      display: 'flex',
//      flex: '1',
//      flexFlow: 'row wrap',
//      alignSelf: 'flex-start',
//      margin: 'auto'
    };

    const menuStyle = {
      display: 'block',
//      flex: '1',
//      flexShrink: '0',
//      flexFlow: 'row wrap',
//      alignSelf: 'flex-start'
    };

    const titleTextStyle = {
      display: 'none',
//      display: 'flex',
//    flex: '1',
      flexFlow: 'row wrap',
      alignSelf: 'center' 
    };

    const mainStyle = {
//      display: 'flex',
//      flex: '1 0 auto',
//      flexFlow: 'column nowrap',

//      alignItems: 'stretch',
//      height: '500px',
//      background: '#e4bad2'
      overflow: 'hidden',
      height: '100vh',

      borderWidth: '2px',
      borderColor: 'green',
//      borderStyle: 'solid',
//      padding: 2

    };

    const gapStyle = {
//      minHeight: '1em',      
    };

    const headerStyle = {
      background: 'white',
      order: '1',
      display: 'inline',
      height: 60,
      // height: '7vh',
    };

    const footerStyle = {
//      alignSelf: 'flex-end',
      order: '3',
      background: appBackgroundColor,
//      maxHeight: '30px',
//      minHeight: '30px',
//      height: '5vh',
      minHeight: 50,

      borderWidth: '2px',
      borderColor: 'yellow',
//      borderStyle: 'solid',
      zIndex: 200
    };
//           <footer style={footerStyle}>footer</footer>
    const sectionStyle = {
//      display: 'flex',
//      flex: '1 0 auto',
//      flexFlow: 'column nowrap',
      order: '2',

      borderWidth: 2,
      borderColor: 'red',
//      borderStyle: 'solid',

      marginTop: 10,
//      overflowX: 'scroll',
      position: 'relative'
    };


    const titleImagesStyle = {
      display: 'flex',
      flex: '1',
      flexFlow: 'row nowrap',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginLeft: 100,
      borderWidth: 2,
      borderColor: 'blue',
//      borderStyle: 'solid',
    };

    const titleImagesStyle2 = {
      display: 'flex',
      flex: '0 0 auto',
      flexFlow: 'row nowrap',
//      alignItems: 'flex-end',
      justifyContent: 'flex-end',
//      marginLeft: 100,
      borderWidth: 2,
      borderColor: 'red',
//      borderStyle: 'solid',
    };

    const logoImagePath = 'src/images/ZvLogo.png';

    const logoImageStyle = {
      borderWidth: '2px',
      borderColor: 'gray',
      marginTop: 7
    };

    const appImagePath = 'src/images/MaestroZLogoBlack.png';
    
    const appImageStyle = {
      borderWidth: '2px',
      borderColor: 'gray',
      marginTop: 8,
      marginRight: 30,
    };

    return connectDropTarget(
      <div id="outer-container" style={outerStyle} className="appMain">
        <AlertContainer ref={(a) => { global.appAlert = a ? a.getWrappedInstance() : a; } } { ...this.alertOptions } />
        <div style={titleStyle}>
          <div style={menuStyle}>
            <AppMenu />
          </div>
        </div>
        <div style={gapStyle}> </div>
        <main id="page-wrap" style={mainStyle} className="appMain">
          <header style={headerStyle}>
            <div style={titleImagesStyle}>
              <img src={logoImagePath} alt={'ZV Logo'}
                  height={50} width={55}
                  className="nonDraggableImage" 
                  style={logoImageStyle} />
              <div style={titleImagesStyle2}>
                <div style={{ marginTop: 30, marginRight: -50 }}>
                  <LogScoreboard />
                </div>

                <img src={appImagePath} alt={'MaestroZ Logo'}
                    height={50} width={210}
                    className="nonDraggableImage" 
                    style={appImageStyle} />
                <AppUser />
              </div>
            </div>
          </header>
          <section style={sectionStyle} className="appFlexCol">
            {displayAppPanes && token && token.role ? (<AppPanes />) : (<div />)}
          </section>
          <footer style={footerStyle} /> 
        </main>          
      </div> 
    );
  }
}

function mapStateToProps(state) {
  const { token, pwChange } = state.auth;

  return {
    token,
    pwChange
  };
}

module.exports = _flow(
  dropTarget(DndItemTypes.DEVICE_POPUP_PANEL, dropTargetHandler, collect),
  connect(mapStateToProps)
)(Home);
