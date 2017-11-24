import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _flow from 'lodash/flow';
import { Button } from 'react-bootstrap';
import moment from 'moment';
import { TIME_FORMAT } from './constants';
import ToolTip from '../ToolTip';
import * as epgActionsEx from './actions';
import { appLightBackgroundColor, appMidBackgroundColor } from '../../constant/app';
import EpgHome from './EpgHome';
// import video from 'video.js';
import ReactPlayer from 'react-player';
import SplitPane from 'react-split-pane';

// const urlEx = 'https://www.youtube.com/watch?v=ysz5S6PUM-U';
const urlEx = 'https://www.youtube.com/watch?v=vh1ACZd8ZFM'; // cnn live

export default class PlayerHome extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedChanId: undefined,
      showOnlyChanId: undefined
    };
	}

	render() {

  	const compStyle = {
  		display: 'flex',
  		flex: '1',
  		flexFlow: 'column nowrap',
  		justifyContent: 'flex-start',

  		overflow: 'hidden',

      borderWidth: 2,
      borderColor: 'blue',
//      borderStyle: 'solid'
  	};

  	const upperStyle = {
  		display: 'flex',
  		flex: '0 0 auto',
  		flexFlow: 'row nowrap',
  		justifyContent: 'flex-start',

  		overflow: 'hidden',
  		height: 360,

      borderWidth: 2,
      borderColor: 'yellow',
//      borderStyle: 'solid'
  	};

  	const lowerStyle = {
  		display: 'flex',
  		flex: '3',
  		flexFlow: 'row nowrap',
  		justifyContent: 'flex-start',

  		overflow: 'hidden',
      paddingTop: 5,

      borderWidth: 2,
      borderColor: 'yellow',
//      borderStyle: 'solid'
  	};

  	const sideStyle = {
  		display: 'flex',
  		flex: '1',
  		flexFlow: 'row nowrap',
  		justifyContent: 'flex-start',

  		overflow: 'hidden',

      borderWidth: 2,
      borderColor: 'pink',
//      borderStyle: 'solid'
  	};

  	const centerStyle = {
  		display: 'flex',
  		flex: '0 0 auto',
  		flexFlow: 'row nowrap',
  		justifyContent: 'center',
  		alignItems: 'center',

  		overflow: 'hidden',
  		width: 640,

      borderWidth: 2,
      borderColor: 'lightgreen',
//      borderStyle: 'solid'
  	};

    const url = typeof(window.player) === 'string' ? window.player : urlEx;

    console.log('player url', url);

  	return (
  		<div style={compStyle}>
  			<div style={upperStyle}>
  				<div style={sideStyle} />
  				<div style={centerStyle}>
	  				<ReactPlayer url={url} 
	  					playing={true} 
	  					controls={true} />
  				</div>
  				<div style={sideStyle} />
  			</div>

  			<div style={lowerStyle}>
  				<EpgHome chansOnly={false} 
            selectedChanId={this.state.selectedChanId}
            showOnlyChanId={this.state.showOnlyChanId} 
            onSelectChan={(chanId) => {
            this.setState({ selectedChanId: chanId === this.state.selectedChanId ? undefined : chanId });
            this.setState({ showOnlyChanId: chanId === this.state.showOnlyChanId ? undefined : chanId });            
          }} />
  			</div>
  		</div>
  		);

	}
}
