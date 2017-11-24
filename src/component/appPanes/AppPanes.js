import { Grid, Row, Col } from 'react-bootstrap';
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SplitPane from 'react-split-pane';
import ServerPanel from '../ServerPanel';
import DevicesPanel from '../DevicesPanel';
import Panel from '../Panel';
import WallHome from '../wall/WallHome';
import ZoneHome from '../zone/ZoneHome';
import LogHome from '../log/LogHome';
import SecHome from '../security/SecHome';
import HelpPanel from '../HelpPanel';
import MvHome from '../multiview/MvHome';

import * as actions from '../appMenu/actions';
import {
  TOGGLE_MENU_ITEM,
  MENU_ITEM_SOURCES, 
  MENU_ITEM_DISPLAYS,
  MENU_ITEM_WALLS,
  MENU_ITEM_MULTIVIEW,
  MENU_ITEM_ZONES,
  MENU_ITEM_SERVER,
  MENU_ITEM_LOGS,
  MENU_ITEM_HELP,
  MENU_ITEM_SEC_USERS,
  MENU_ITEM_SEC_ROLES,
  MENU_ITEM_SEC_PERMS
  } from '../appMenu/constants';

class AppPanes extends Component {

  static propTypes = {
    panes: PropTypes.array.isRequired,
    onToggleItem: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.handleOnToggleItem = this.handleOnToggleItem.bind(this);
    this.state = { showBanner: false };
  }

  componentWillMount() {
    setTimeout(() => {
      this.setState({ showBanner: true });
    }, 1000);
  }

  handleOnToggleItem(id) {
    const { onToggleItem } = this.props;
    // console.log('HandleOnToggleItem', id);
    onToggleItem(id);
  }

  render() {

    const { panes, receivePaneWidth } = this.props;
    const { showBanner } = this.state;

    const paneStyle = {
      display: 'flex',
      flex: '1 0 auto',
      flexFlow: 'column nowrap',
       
      height: '100%',
      borderWidth: 2,
      borderColor: 'green',
//      borderStyle: 'solid',

      minWidth: 300,      
//      overflow: 'auto'
    };

    const panesInnerStyle = {
      display: 'flex',
      flex: '1',
      flexFlow: 'column nowrap',
    };

    const panesStyle = {
//      display: 'flex',
//      flex: '1',
//      flexFlow: 'column nowrap',

      position: 'relative',
      order: 2,

      height: '100%',
      borderWidth: 2,
      borderColor: 'lightgreen',
//      borderStyle: 'solid'
    };

    const errorStyle = {
      color: 'white',
//      borderWidth: '2px',
//      borderColor: 'green',
//      borderStyle: 'solid'
    };

    const panelEx = (settings) => {

      switch (settings.id) {
        case MENU_ITEM_SOURCES:
        case MENU_ITEM_DISPLAYS:
          return (<DevicesPanel settings={settings} />);
        case MENU_ITEM_WALLS:
          return (<WallHome settings={settings} />);
        case MENU_ITEM_ZONES:
          return (<ZoneHome settings={settings} />);
        case MENU_ITEM_MULTIVIEW:
          return (<MvHome settings={settings} />);
        case MENU_ITEM_SERVER:
          return (<ServerPanel settings={settings} />);
        case MENU_ITEM_LOGS:
          return (<LogHome settings={settings} />);
        case MENU_ITEM_SEC_USERS:
        case MENU_ITEM_SEC_ROLES:
        case MENU_ITEM_SEC_PERMS:
          return (<SecHome settings={settings} />);
        case MENU_ITEM_HELP:
          return (<HelpPanel settings={settings} />);
        default:
          return (
            <div />
            );  
      }

    };

    const splitPaneStyle = {
      display: 'flex',
      flex: '1 0 auto',
      flexFlow: 'column nowrap',
//      backgroundColor: 'lightblue'
      height: '100%',
    };

    const paneExStyle = {
      display: 'flex',
      flex: '1 0 auto',
      flexFlow: 'column nowrap',
//      backgroundColor: 'green',
      height: '100%',
    };

    const panel = (settings) => {
      return (<div style={paneExStyle}>
        {panelEx(settings)}
      </div>);
    };

    const openPanels = panes.filter((pane) => {
      return pane.isOpen;
    }).map((pane) => {
      pane.onToggleItem = this.handleOnToggleItem;
      return pane;
    });

//    console.log('openPanels', openPanels);

    const width = window.innerWidth;
    const panesDiv = () => {

      switch (openPanels.length) {
        case 0: {
          return (
              <Col sm={4} smOffset={4} style={paneExStyle}>
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <div className="jumbotron" style={ { borderRadius: 10, display: showBanner ? 'block' : 'none' } }>
                  <h2>To begin,</h2>
                  <br />
                  <p>Use menu button in upper left corner to display panels.</p>
                </div>
              </Col>
            );
        }
        case 1: {
          return (
            <div style={paneStyle} className="appFlexCol">
              {panel(openPanels[0])}
            </div>
          );
        }
        case 2: {
          return (
            <SplitPane split="vertical" minSize={160} paneStyle={splitPaneStyle}
              onDragFinished={(size) => {            
//                console.log('onDragFinished', size);
                receivePaneWidth(openPanels[0].id, size);
              }}
              defaultSize={ `${Math.min(localStorage.getItem('splitPos2') || width / 2, width - 10)}px` }
              onChange={ size => localStorage.setItem('splitPos2', size) }>
              {panel(openPanels[0])}
              {panel(openPanels[1])}
            </SplitPane>
          );
        }
        case 3: {
          return (
            <SplitPane split="vertical" minSize={160} paneStyle={splitPaneStyle}
              onDragFinished={(size) => {
//                console.log('onDragFinished', size);
                receivePaneWidth(openPanels[0].id, size);
              }}
              defaultSize={ `${Math.min(localStorage.getItem('splitPos3') || width / 3, width - 10)}px` }
              onChange={ size => localStorage.setItem('splitPos3', size) }>
              {panel(openPanels[0])}
              <SplitPane split="vertical" minSize={160} paneStyle={splitPaneStyle}
                onDragFinished={(size) => {
//                  console.log('onDragFinished', size);
                  receivePaneWidth(openPanels[1].id, size);
                }}
                defaultSize={ `${Math.min(localStorage.getItem('splitPos3-2') || width / 3, width - 170)}px` }
                onChange={ size => localStorage.setItem('splitPos3-2', size) }>
                {panel(openPanels[1])}
                {panel(openPanels[2])}
              </SplitPane>
            </SplitPane>
          );
        }
        case 4: {
          return (
            <SplitPane split="vertical" minSize={160} paneStyle={splitPaneStyle}
              onDragFinished={(size) => {
//                console.log('onDragFinished', size);
                receivePaneWidth(openPanels[0].id, size);
              }}
              defaultSize={ `${Math.min(localStorage.getItem('splitPos4') || width / 4, width - 10)}px` }
              onChange={ size => localStorage.setItem('splitPos4', size) }>
              {panel(openPanels[0])}
              <SplitPane split="vertical" minSize={160} paneStyle={splitPaneStyle}
                onDragFinished={(size) => {
//                  console.log('onDragFinished', size);
                  receivePaneWidth(openPanels[1].id, size);
                }}
                defaultSize={ `${Math.min(localStorage.getItem('splitPos4-2') || width / 4, width - 170)}px` }
                onChange={ size => localStorage.setItem('splitPos4-2', size) }>
                {panel(openPanels[1])}
                 <SplitPane split="vertical" minSize={160} paneStyle={splitPaneStyle}
                  onDragFinished={(size) => {
//                    console.log('onDragFinished', size);
                    receivePaneWidth(openPanels[2].id, size);
                  }}
                   defaultSize={ `${Math.min(localStorage.getItem('splitPos4-3') || width / 4, width - 330)}px` }
                   onChange={ size => localStorage.setItem('splitPos4-3', size) }>
                   {panel(openPanels[2])}
                   {panel(openPanels[3])}
                 </SplitPane>
              </SplitPane>
            </SplitPane>
          );
        }
        case 5: {
          return (
            <SplitPane split="vertical" minSize={160} paneStyle={splitPaneStyle}
              onDragFinished={(size) => {
//                console.log('onDragFinished', size);
                receivePaneWidth(openPanels[0].id, size);
              }}
              defaultSize={ `${Math.min(localStorage.getItem('splitPos5') || width / 5, width - 10)}px` }
              onChange={ size => localStorage.setItem('splitPos5', size) }>
              {panel(openPanels[0])}
              <SplitPane split="vertical" minSize={160} paneStyle={splitPaneStyle}
                onDragFinished={(size) => {
  //                console.log('onDragFinished', size);
                  receivePaneWidth(openPanels[1].id, size);
                }}
                defaultSize={ `${Math.min(localStorage.getItem('splitPos5-2') || width / 5, width - 170)}px` }
                onChange={ size => localStorage.setItem('splitPos5-2', size) }>
                {panel(openPanels[1])}
                <SplitPane split="vertical" minSize={160} paneStyle={splitPaneStyle}
                  onDragFinished={(size) => {
    //                console.log('onDragFinished', size);
                    receivePaneWidth(openPanels[2].id, size);
                  }}
                  defaultSize={ `${Math.min(localStorage.getItem('splitPos5-3') || width / 5, width - 330)}px` }
                  onChange={ size => localStorage.setItem('splitPos5-3', size) }>
                  {panel(openPanels[2])}
                  <SplitPane split="vertical" minSize={160} paneStyle={splitPaneStyle}
                    onDragFinished={(size) => {
      //                console.log('onDragFinished', size);
                      receivePaneWidth(openPanels[3].id, size);
                    }}
                    defaultSize={ `${Math.min(localStorage.getItem('splitPos5-4') || width / 5, width - 490)}px` }
                    onChange={ size => localStorage.setItem('splitPos5-4', size) }>
                    {panel(openPanels[3])}
                    {panel(openPanels[4])}
                  </SplitPane>
                </SplitPane>
              </SplitPane>
            </SplitPane>
          );
        }
        case 6: {
          return (
            <SplitPane split="vertical" minSize={160} paneStyle={splitPaneStyle}
              onDragFinished={(size) => {
//                console.log('onDragFinished', size);
                receivePaneWidth(openPanels[0].id, size);
              }}
              defaultSize={ `${Math.min(localStorage.getItem('splitPos6') || width / 6, width - 10)}px` }
              onChange={ size => localStorage.setItem('splitPos6', size) }>
              {panel(openPanels[0])}
              <SplitPane split="vertical" minSize={160} paneStyle={splitPaneStyle}
                onDragFinished={(size) => {
  //                console.log('onDragFinished', size);
                  receivePaneWidth(openPanels[1].id, size);
                }}
                defaultSize={ `${Math.min(localStorage.getItem('splitPos6-2') || width / 6, width - 170)}px` }
                onChange={ size => localStorage.setItem('splitPos6-2', size) }>
                {panel(openPanels[1])}
                <SplitPane split="vertical" minSize={160} paneStyle={splitPaneStyle}
                  onDragFinished={(size) => {
    //                console.log('onDragFinished', size);
                    receivePaneWidth(openPanels[2].id, size);
                  }}
                  defaultSize={ `${Math.min(localStorage.getItem('splitPos6-3') || width / 6, width - 330)}px` }
                  onChange={ size => localStorage.setItem('splitPos6-3', size) }>
                  {panel(openPanels[2])}
                  <SplitPane split="vertical" minSize={160} paneStyle={splitPaneStyle}
                    onDragFinished={(size) => {
      //                console.log('onDragFinished', size);
                      receivePaneWidth(openPanels[3].id, size);
                    }}
                    defaultSize={ `${Math.min(localStorage.getItem('splitPos6-4') || width / 6, width - 490)}px` }
                    onChange={ size => localStorage.setItem('splitPos6-4', size) }>
                    {panel(openPanels[3])}
                    <SplitPane split="vertical" minSize={160} paneStyle={splitPaneStyle}
                      onDragFinished={(size) => {
        //                console.log('onDragFinished', size);
                        receivePaneWidth(openPanels[4].id, size);
                      }}
                      defaultSize={ `${Math.min(localStorage.getItem('splitPos6-5') || width / 6, width - 650)}px` }
                      onChange={ size => localStorage.setItem('splitPos6-5', size) }>
                      {panel(openPanels[4])}
                      {panel(openPanels[5])}
                    </SplitPane>
                  </SplitPane>
                </SplitPane>
              </SplitPane>
            </SplitPane>
          );
        }
        case 7: {
          return (
            <SplitPane split="vertical" minSize={160} paneStyle={splitPaneStyle}
              onDragFinished={(size) => {
//                console.log('onDragFinished', size);
                receivePaneWidth(openPanels[0].id, size);
              }}
              defaultSize={ `${Math.min(localStorage.getItem('splitPos7') || width / 7, width - 10)}px` }
              onChange={ size => localStorage.setItem('splitPos7', size) }>
              {panel(openPanels[0])}
              <SplitPane split="vertical" minSize={160} paneStyle={splitPaneStyle}
                onDragFinished={(size) => {
  //                console.log('onDragFinished', size);
                  receivePaneWidth(openPanels[1].id, size);
                }}
                defaultSize={ `${Math.min(localStorage.getItem('splitPos7-2') || width / 7, width - 170)}px` }
                onChange={ size => localStorage.setItem('splitPos7-2', size) }>
                {panel(openPanels[1])}
                <SplitPane split="vertical" minSize={160} paneStyle={splitPaneStyle}
                  onDragFinished={(size) => {
    //                console.log('onDragFinished', size);
                    receivePaneWidth(openPanels[2].id, size);
                  }}
                  defaultSize={ `${Math.min(localStorage.getItem('splitPos7-3') || width / 7, width - 330)}px` }
                  onChange={ size => localStorage.setItem('splitPos7-3', size) }>
                  {panel(openPanels[2])}
                  <SplitPane split="vertical" minSize={160} paneStyle={splitPaneStyle}
                    onDragFinished={(size) => {
      //                console.log('onDragFinished', size);
                      receivePaneWidth(openPanels[3].id, size);
                    }}
                    defaultSize={ `${Math.min(localStorage.getItem('splitPos7-4') || width / 7, width - 490)}px` }
                    onChange={ size => localStorage.setItem('splitPos7-4', size) }>
                    {panel(openPanels[3])}
                    <SplitPane split="vertical" minSize={160} paneStyle={splitPaneStyle}
                      onDragFinished={(size) => {
        //                console.log('onDragFinished', size);
                        receivePaneWidth(openPanels[4].id, size);
                      }}
                      defaultSize={ `${Math.min(localStorage.getItem('splitPos7-5') || width / 7, width - 650)}px` }
                      onChange={ size => localStorage.setItem('splitPos7-5', size) }>
                      {panel(openPanels[4])}
                      <SplitPane split="vertical" minSize={160} paneStyle={splitPaneStyle}
                        onDragFinished={(size) => {
          //                console.log('onDragFinished', size);
                          receivePaneWidth(openPanels[5].id, size);
                        }}
                        defaultSize={ `${Math.min(localStorage.getItem('splitPos7-6') || width / 7, width - 810)}px` }
                        onChange={ size => localStorage.setItem('splitPos7-6', size) }>
                        {panel(openPanels[5])}
                        {panel(openPanels[6])}
                      </SplitPane>
                    </SplitPane>
                  </SplitPane>
                </SplitPane>
              </SplitPane>
            </SplitPane>
          );
        }
        default: {
          return (<div style={errorStyle}>Pane count of {openPanels.length} not supported!!!</div>);
        }
      }
    };

    return (
      <div style={panesStyle} className="appFlexCol">
        {panesDiv()}
      </div>
      );
  }
}

function deselect(item, token) {
  
//  console.log('deselect item', item);

  if (token && token.role && token.role.perms && 
      token.role.perms[item.title] && token.role.perms[item.title].Display) {
    return item.isOpen;
  }

  return false;
}

const mapStateToProps = (state) => {

  const { panes } = state.appMenu;
  const { token } = state.auth;

  const panes2 = panes.map((pane) => {
    return { ...pane, isOpen: deselect(pane, token) };    
  });

//  console.log('AppPanes mapStateToProps panes', panes2);

  return {
    panes: panes2
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AppPanes);
