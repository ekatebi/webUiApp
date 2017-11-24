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
import Popover from 'react-popover';
import EpgProg from './EpgProg';

class EpgHome extends Component {

  static defaultProps = {
    chansOnly: false,
    showOnlyChanId: undefined,
    selectedChanId: undefined,
    onSelectChan: undefined
  };

  constructor(props) {
    super(props);
    this.refreshTime = this.refreshTime.bind(this);
    this.refreshScrollPos = this.refreshScrollPos.bind(this);
    this.cellHeight = 60;
    this.cellWidth = 6;
    this.gridElem = undefined;
    this.chanElem = undefined;
    this.timeCellsElem = undefined;
    this.state = { 
      time: moment.utc(), 
      timeAdjusted: moment.utc(),
      scrollTop: 0,
      scrollLeft: 0,
      progId: {}
      };
	}

  componentWillMount() {
//    console.log('EpgHome mount');
    this.refreshTime();

    if (window.epgScrollPx) {
      this.refreshScrollPos(window.epgScrollPx, window.epgScrollMs);
    }      
  }

  componentDidMount() {

    const { epgActions } = this.props;

    this.gridElem = document.getElementById('grid');
    this.chanElem = document.getElementById('chan');
    this.timeCellsElem = document.getElementById('timeCells');

  }

  shouldComponentUpdate(nextProps, nextState) {

    if (this.state.scrollTop !== nextState.scrollTop ||
      this.state.scrollLeft !== nextState.scrollLeft) {

      this.setState({ progId: {} });                                                                
    }

    return true;
  }  

  refreshTime(firstTime = false) {
    const { epgActions } = this.props;

//    console.log('refreshTime');    

    const time = moment.utc();

    const minutes = time.clone().minutes() % 15;
    let seconds = time.clone().seconds() % 60;

    const timeAdjusted = time.clone().subtract(minutes, 'minutes').subtract(seconds, 'seconds');

    this.setState({ time, timeAdjusted });

    seconds -= seconds > 30 ? 30 : 0;  

//    console.log('refresh', (60 - seconds), time.format(), timeAdjusted.format());

    setTimeout(() => {
      this.refreshTime();
    }, (60 - seconds) * 1000); 

    if (firstTime) {
      epgActions.onRequestEpg(timeAdjusted.clone());
    } else if (minutes === 0) {
      epgActions.onRequestRefreshEpg(timeAdjusted.clone());
    }
  }

  refreshScrollPos(pixels, ms = 100) {

    setTimeout(() => {
      this.refreshScrollPos(pixels, ms);
    }, ms);

    if (this.gridElem && this.chanElem) {

//      console.log(this.gridElem.scrollTop);

      this.gridElem.scrollTop += pixels;

      if (this.state.scrollTop === this.gridElem.scrollTop) {
        this.gridElem.scrollTop = 0;
      }

      this.setState({ scrollTop: this.gridElem.scrollTop });
      this.chanElem.scrollTop = this.gridElem.scrollTop;
    }

  }

	render() {
  	const { epgActions, epgIconData, epgProgramData, epgTimeSlots, 
      chansOnly, selectedChanId, onSelectChan, showOnlyChanId } = this.props;

  	const gridStyle = {
  		display: 'flex',
  		flex: '1',
  		flexFlow: 'column nowrap',
  		justifyContent: 'flex-start',

  		overflow: 'scroll',
      scrollBehavior: 'smooth',

      borderWidth: 3,
      borderColor: 'blue',
//      borderStyle: 'solid'
  	};

    const chanSideStyle = {
      display: 'flex',
      flex: '0 0 auto',
      flexFlow: 'column nowrap',
      justifyContent: 'flex-start',

      width: chansOnly ? this.cellHeight * 2 * 1.11 : this.cellHeight * 2,
//      marginBottom: 15,

      overflowX: chansOnly ? 'hidden' : 'scroll',
      overflowY: chansOnly ? 'auto' : 'hidden',
      scrollBehavior: 'smooth',

      borderWidth: 3,
      borderColor: 'blue',
//      borderStyle: 'solid'
    };

    const gridOuterStyle = {
      display: 'flex',
      flex: '1',
      flexFlow: 'column nowrap',
      justifyContent: 'flex-start',

      width: '100%',
      height: '100%',

      borderWidth: 3,
      borderColor: 'red',
//      borderStyle: 'solid'
    };

    const gridInnerStyle = {
      display: 'flex',
      flex: '1',
      flexFlow: 'row nowrap',
      justifyContent: 'flex-start',

      width: '100%',
      height: '100%',

      borderWidth: 3,
      borderColor: 'blue',
//      borderStyle: 'solid'
    };

  	const rowStyle = {
  		display: 'flex',
  		flex: '1 0 auto',
  		flexFlow: 'row nowrap',
  		justifyContent: 'flex-start',
  		alignItems: 'center',
  		height: this.cellHeight,

//			padding: 3,

      borderWidth: 2,
      borderColor: 'pink',
//      borderStyle: 'solid'
  	};

    const timeRowStyle = {
      display: 'flex',
      flex: '0 1 auto',
      flexFlow: 'row nowrap',
      justifyContent: 'flex-start',
      alignItems: 'center',
      height: this.cellHeight * 0.5,

//      padding: 3,

      borderWidth: 1,
      borderColor: 'yellow',
//      borderStyle: 'solid'
    };

    const timeCellsStyle = {
      display: 'flex',
      flex: '0 1 auto',
      flexFlow: 'row nowrap',
      justifyContent: 'flex-start',
      alignItems: 'center',
      height: this.cellHeight * 0.5,

      overflowY: 'scroll',
      overflowX: 'hidden',
      scrollBehavior: 'smooth',

      borderWidth: 1,
      borderColor: 'lightgreen',
//      borderStyle: 'solid'
    };

  	const cellStyle = (program, index) => {
      const { duration, start, stop } = program; 

  		return {
	  		display: 'flex',
	  		flex: '0 0 auto',
	  		flexFlow: 'row nowrap',
	  		justifyContent: 'space-between',
	  		alignItems: 'center',
	  		height: this.cellHeight,
	
	  		width: this.cellWidth * duration.display,

	  		backgroundColor: appLightBackgroundColor,

	      borderWidth: 1,
	      borderColor: 'white',
	      borderStyle: 'solid'
  		};
  	};

  	const timeCellStyle = (index) => {

      const minutes = 60 - (this.state.timeAdjusted.minutes() % 60);
      
  		return {
	  		display: 'flex',
	  		flex: '0 0 auto',
	  		flexFlow: 'column nowrap',
	  		justifyContent: 'center',
	  		alignItems: 'center',
	  		height: this.cellHeight * 0.5,
	
	  		width: index > 0 ? this.cellWidth * 60 : this.cellWidth * minutes,

	  		backgroundColor: appMidBackgroundColor,

	      borderWidth: 1,
	      borderColor: 'white',
	      borderStyle: 'solid'
  		};
  	};

  	const textStyle = (duration, progId) => {

      return {

    		display: duration ? 'inline' : 'flex',
    		flex: '1 0 auto',
    		flexFlow: 'row nowrap',
    		justifyContent: duration ? 'flex-start' : 'center',
    		alignItems: 'center',

        width: duration ? `${this.cellWidth * duration.display * 0.8}px` : '80%',
        height: `${this.cellHeight * 0.5}px`,

  //  		maxWidth: this.cellWidth * 0.8,
  //  		maxHeight: this.cellHeight,

    		padding: 5,

        textAlign: 'center',
        whiteSpace: 'nowrap',
   			overflow: 'hidden',
   			textOverflow: 'ellipsis',
//        float: 'left',

        cursor: progId && this.state.progId[progId] ? 'progress' : 'pointer',

  	    borderWidth: 2,
  	    borderColor: 'pink',
//  	    borderStyle: duration ? 'solid' : 'none'
      };
    };

    const chanStyle = (selected) => {
      return {
        display: 'flex',
        flex: '0 0 auto',
        justifyContent: 'center',
        alignItems: 'center',
        width: this.cellHeight * 2,
        height: this.cellHeight,

        backgroundColor: chansOnly && selected ? appMidBackgroundColor : appLightBackgroundColor,

        cursor: chansOnly ? 'pointer' : 'default',
  //      padding: 2,
        borderWidth: 1,
        borderColor: 'white',
        borderStyle: 'solid'
      };
    };

    const chanInfoStyle = {
      display: 'flex',
      flex: '0 0 auto',
      flexFlow: 'column nowrap',
      justifyContent: 'center',
      alignItems: 'center',
      width: this.cellHeight,
      height: this.cellHeight,

      fontSize: 10,
      padding: 5,
      borderWidth: 2,
      borderColor: 'red',
//      borderStyle: 'solid'
    };

    const imageStyle = {
      display: 'flex',
      flex: '0 0 auto',
      justifyContent: 'center',
      alignItems: 'center',
      width: this.cellHeight,
      height: this.cellHeight,

//      padding: 2,
      borderWidth: 2,
      borderColor: 'red',
//      borderStyle: 'solid'
    };

    const timeImageStyle = {
      display: 'flex',
      flex: '0 0 auto',
      flexFlow: 'row nowrap',
      justifyContent: 'center',
      alignItems: 'center',
      width: this.cellHeight * 2,
      height: this.cellHeight * 0.5,

      backgroundColor: appMidBackgroundColor,

      borderWidth: 1,
      borderColor: 'white',
      borderStyle: 'solid'
    };

    const today = moment(this.state.time.toDate());

    const timeCells = epgTimeSlots.map((epgTimeSlot, epgTimeSlotIndex) => {
      const localTime = moment(moment.utc(epgTimeSlot, TIME_FORMAT).toDate());
      const isToday = localTime.isSame(today, 'day');
      const hourFormat = epgTimeSlotIndex > 0 ? 'h a' : 'h:mm a';
      const timeFormat = isToday ? hourFormat : 'h a dddd';
      return (
          <span style={timeCellStyle(epgTimeSlotIndex)} key={epgTimeSlotIndex}>
            <span style={textStyle()}>
              {epgTimeSlotIndex > 0 ? localTime.format(timeFormat) : today.format(timeFormat)}
            </span>
          </span>
        );
    });

    const timeRow = (
      <div style={timeRowStyle}>
        <div style={timeImageStyle}><span>{moment(this.state.time.toDate()).format('MMMM Do')}</span></div>
        <div style={timeCellsStyle} id={'timeCells'}>
          {timeCells}
        </div>
      </div>
      );

    const imageDivs = [];

  	const rows = Object.keys(epgProgramData).map((chanKey, chanIndex) => {
  		const programs = epgProgramData[chanKey];
  		const chan = epgIconData[chanKey];

  		const programsDiv = programs.map((program, progIndex) => {
  			return (
    				<div key={progIndex} style={cellStyle(program, progIndex)}>
              {program.duration.display < program.duration.actual ?
                (<span><i className="fa fa-chevron-left" aria-hidden="true"></i></span>) : 
                (<span style={{ width: 10 }} />)}
                <Popover
                  key={progIndex} 
                  isOpen={this.state.progId[program.id]} 
                  body={(<EpgProg prog={program} onExit={(e) => {
//                    console.log('onExit');
                    this.setState({ progId: { ...this.state.progId, [program.id]: !this.state.progId[program.id] } });                                                                
                  }} />)}>
          					<span style={textStyle(program.duration, program.id)} 
                    onClick={(e) => {
                      this.setState({ progId: { ...this.state.progId, [program.id]: !this.state.progId[program.id] } });                                                                
                      console.log(program.title, program.subTitle, program.duration.display, program.duration.actual);
                      console.log(moment(moment.utc(program.start, TIME_FORMAT).toDate()).format('MM/DD/YYYY h:mm A'));
                      console.log(moment(moment.utc(program.stop, TIME_FORMAT).toDate()).format('MM/DD/YYYY h:mm A'));
                      console.dir(program.raw);
                    }}>
                      {program.subTitle ? `${program.title} - ${program.subTitle}` : program.title}
                    </span>
                </Popover>
              <span style={{ width: 10 }} />
    				</div>
  				);
  		});

//  className="devModel"
      if (chan && (!showOnlyChanId || showOnlyChanId === chanKey)) {

        imageDivs.push(

          <ToolTip placement="right" 
            tooltip={chansOnly ? undefined : chan.longName} key={imageDivs.length}>
            <div style={chanStyle(selectedChanId === chanKey)} onClick={(e) => {
              console.log(chanKey, chan);
              if (chansOnly && onSelectChan) {
                onSelectChan(chanKey);
              }
              e.stopPropagation();
            }}>
              <div style={imageStyle}> 
                <img src={chan.icon} alt={chan.shortName} 
                  style={{ height: '100%', width: '100%', objectFit: 'contain', padding: 5 }}
                  className="nonDraggableImage"
                />
              </div>
              <div style={chanInfoStyle}>
                  <div style={chanInfoStyle}>
                    <strong>{chan.shortName}</strong>
                    <strong>{chan.channel}</strong>
                  </div>
              </div>
            </div>
          </ToolTip>

          );
      }

  		return (
  			<div key={chanIndex} style={rowStyle}>
	  			{programsDiv}
	  		</div>
  			);
  	});

  	return (
      <div style={gridOuterStyle}>
        {!chansOnly ? (timeRow) : (<div />)}
        <div style={gridInnerStyle}>
          <div style={chanSideStyle} id={'chan'}>
            {imageDivs}
          </div>
          {!chansOnly ? (<div style={gridStyle} id={'grid'} onScroll={(e) => {
            this.timeCellsElem.scrollLeft = this.gridElem.scrollLeft;
            this.chanElem.scrollTop = this.gridElem.scrollTop;
            this.setState({ scrollTop: this.gridElem.scrollTop });
            this.setState({ scrollLeft: this.gridElem.scrollLeft });
          }}>
      			{rows}
          </div>) : (<div />)}
        </div>
      </div>
  		);
	}
}

function mapStateToProps(state, props) {
	
  const { epgIconData, fetching } = state.epgp;
  const { epgProgramData, epgTimeSlots } = state.epg;

	return {
		epgIconData,
		epgProgramData,
    epgTimeSlots,
    fetching
	};
}

function mapDispatchToProps(dispatch) {
 return {
      epgActions: bindActionCreators(epgActionsEx, dispatch),
    };
}

module.exports = _flow(
  connect(mapStateToProps, mapDispatchToProps)
)(EpgHome);
