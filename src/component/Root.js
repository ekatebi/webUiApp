import React, { Component, PropTypes } from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext as dragDropContext } from 'react-dnd';
import MediaQuery from 'react-responsive';

import classNames from 'classnames';
import Themes from './Themes';
import { appName, 
  backEndHost,
  secDbNative,
  secDbNatives
 } from '../constant/app';

class Root extends Component {

  static propTypes = {
    children: PropTypes.element
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    const { query } = this.props.location;

    window.help = typeof(query.help) === 'object' || query.help === 'true';

    window.diag = typeof(query.diag) === 'object' || query.diag === 'true';

    window.mdiag = typeof(query.mdiag) === 'object' || query.mdiag === 'true';

//    window.desktop = typeof(query.desktop) === 'object' || query.desktop === 'true';
    window.desktop = query.desktop;

    window.mobile = query.mobile;

//    window.sec = typeof(query.sec) === 'object' || query.sec === 'true';
    window.sec = true;

    window.spw = typeof(query.spw) === 'object' || query.spw === 'true';

//    window.native = typeof(query.native) === 'object' || query.native === 'true';

    window.native = true;


    if (query.native === 'false') {
      window.native = false;
    }

    // window.sec = true;

    // advanced editing of mv
    // window.mv = typeof(query.mv) === 'object' || query.mv === 'true';

    window.mv = true;

    // zone treeview
    window.zt = typeof(query.zt) === 'object' || query.zt === 'true';

    window.virtual = typeof(query.virtual) === 'object' || query.virtual === 'true';

    if (typeof(query.max) === 'string') {
      window.maxLength = Number(query.max);
    }

   if (typeof(query.fld) === 'string') {
      window.fetchLongDelay = Number(query.fld) * 1000;
    }

    // display browser device info
    window.dev = typeof(query.dev) === 'object' || query.dev === 'true';

    if (window.dev) {
      localStorage.clear();
      sessionStorage.clear();
    }

    // epg

    window.epg = typeof(query.epg) === 'object' || query.epg === 'true';

//    window.player = typeof(query.player) === 'object' || query.player === 'true';
    

    if (typeof(query.player) === 'object') {
      window.player = true;
    } else if (typeof(query.player) === 'string') {
      window.player = query.player;
    }

//    console.log('player', typeof(window.player), window.player);

    if (typeof(query.epgscrollpx) === 'object') {
      window.epgScrollpx = 1; // default 1 pixel
    } else if (typeof(query.epgscrollpx) === 'string') {
      window.epgScrollPx = Number(query.epgscrollpx);
    }

    if (typeof(query.epgscrollms) === 'object') {
      window.epgscrollms = 0.3; // default 0.3 ms
    } else if (typeof(query.epgscrollms) === 'string') {
      window.epgScrollMs = Number(query.epgscrollms);
    }

    if (typeof(query.epgchans) === 'string') {
      window.epgChans = Number(query.epgchans);
    }

    if (window.diag) {
      console.log('NODE_ENV', NODE_ENV);
      console.log('SEC_PORT', SEC_PORT);
      console.log('secDbNative', secDbNative);
      console.log('secDbNatives', secDbNatives);
      console.log('BACKEND_IP', BACKEND_IP);
      console.log('backEndHost', backEndHost);
      console.log('host', window.location.hostname);
    }
  }

  render() {

    const hideStyle = {
      display: 'none'
    };

    const rootStyle = {
//      display: 'flex',
//      flex: '1 0 auto',
//      flexFlow: 'column nowrap',

      overflow: 'auto',
      minHeight: '100vh',

//      borderWidth: '2px',
//      borderColor: 'yellow',
//      borderStyle: 'solid',
//      padding: 2

    };

    const devStyle = window.dev ? {
      display: 'flex',
      flex: '1 0 auto',
      flexFlow: 'column nowrap',
      alignItems: 'center',
      adjustContent: 'center',
      borderWidth: 2,
      borderColor: 'yellow',
//      borderStyle: 'solid',
    } : undefined;

    let content;

    if (window.dev) {
      content = (
        <div style={devStyle}>
          <div>device info:</div>
          <MediaQuery minDeviceWidth={1500} values={{ deviceWidth: 1600 }}>
            <div>desktop or laptop (minDeviceWidth: 1500)</div>
            <MediaQuery minDeviceWidth={1824}>
              <div>large screen (minDeviceWidth: 1824)</div>
            </MediaQuery>
            <MediaQuery maxWidth={1199}>
              <div>sized like a tablet or mobile phone though (maxWidth: 1199)</div>
            </MediaQuery>
          </MediaQuery>
          <MediaQuery maxDeviceWidth={1199}>
            <div>tablet or mobile phone (maxDeviceWidth: 1199)</div>
          </MediaQuery>
          <MediaQuery orientation="portrait">
            <div>portrait</div>
          </MediaQuery>
          <MediaQuery orientation="landscape">
            <div>landscape</div>
          </MediaQuery>
          <MediaQuery minResolution="2dppx">
            <div>resolution: retina (minResolution: 2dppx)</div>
          </MediaQuery>
        </div>);
    } else if (window.help) {
      content = (
        <div style={{ ...devStyle, paddingTop: 30, paddingLeft: 30 }}>
          <div>{`${appName} url query string options:`}</div>
          <div style={{ ...devStyle, paddingTop: 10 }}>
            (use "?" before first and "&" before each subsequent option)
          </div>
          <div style={{ ...devStyle, paddingTop: 10, paddingLeft: 30 }}>
            <div>desktop (boolean/no value) --- force desktop behavior (mobile/desktop)</div>
            <div>dev (boolean/no value) --- browser device info</div>
            <div>diag (boolean/no value) --- device raw info</div>
            <div>epg (boolean/no value) --- electronic program guide</div>
            <div>epgchans (number) --- number of tv channel to display</div>
            <div>epgscroll (default 1) --- number of pixels to advance in epg auto scroll</div>
            <div>epgscrollms (default 0.3) --- time interval between advances in epg auto scroll</div>
            <div>fld (number of seconds) --- fetch long delay after the last one</div>
            <div>max (number) --- maximum device count per page</div>
            <div>mdiag (boolean/no value) --- mobile diag</div>
            <div>mobile (boolean/no value) --- force mobile behavior (mobile/desktop)</div>
            {/*  <div>mv (boolean/no value) --- multiview advanced editing</div> */}
            <div>epg (boolean/no value) --- electronic program guide</div>
            <div>epgchans (number) --- number of tv channel to display</div>
            <div>epgscroll (default 1) --- number of pixels to advance in epg auto scroll</div>
            <div>epgscrollms (default 0.3) --- time interval between advances in epg auto scroll</div>
            <div>spw (boolean/no value) --- enforce strong password creation</div>
            {/* <div>sec (boolean/no value) --- display, in app menu, users and roles</div>
            <div>native (boolean/no value) --- user native API for security</div> */}
            <div>virtual (boolean/no value) --- include virtual devices</div>
            {/* <div>zt (boolean/no value) --- zone treeview</div> */}
            <div>help (boolean/no value) --- display url query string options</div>
          </div>
        </div>
        );
    } else {
      content = (
        <div style={rootStyle}>
          {this.props.children}
        </div>
      );
    }

    return (
      <div style={rootStyle} className="appMain">
        <MediaQuery maxDeviceWidth={1199}>
          {(matches) => {
//          window.isMobile = 'ontouchstart' in window || navigator.maxTouchPoints;
            if (typeof(window.desktop) === 'object' || window.desktop === 'true' || window.isDesktop === true) {
              window.isDesktop = true;
              window.isMobile = false;
            } else if (typeof(window.mobile) === 'object' || window.mobile === 'true' || window.isMobile === true) {
              window.isDesktop = false;
              window.isMobile = true;
            } else if (matches) {
              window.isDesktop = false;
              window.isMobile = true;
            } else {
              window.isDesktop = true;
              window.isMobile = false;
            }

            if (window.mdiag) {
              alert(`desktop: ${window.isDesktop}, mobile: ${window.isMobile}, (matches maxDeviceWidth={1199}), width: ${window.screen.width}`);
            }

            return null;
          }}
        </MediaQuery>
        <div style={hideStyle}>
          <Themes eventKey={2} />
        </div>
        {content}
      </div>
    );
  }
}

module.exports = dragDropContext(HTML5Backend)(Root);
