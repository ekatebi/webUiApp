import xml2js from 'xml2js';
import moment from 'moment';

import { NOOP, REQUEST_EPG, RECEIVE_EPG, RECEIVE_EPG_TIME_SLOTS, TIME_FORMAT,
  RECEIVE_EPG_ICON_DATA, RECEIVE_EPG_PROGRAM_DATA } from './constants';
import { request } from './fetch';

// const xmltv = 'src/images/epg/xmltv2634.xml';
const xmltv = 'src/images/epg/xmltv-2580.xml';
const xmltvDemo = 'src/images/epg/xmltv-2580.xml';

function requestEpg() {
//	console.log('requestEpg');
	return {
		type: REQUEST_EPG
	};
}

function receiveEpg(epgData) {
	return {
		type: RECEIVE_EPG,
		epgData
	};
}

function receiveEpgIconData(epgIconData) {
	return {
		type: RECEIVE_EPG_ICON_DATA,
		epgIconData
	};
}

function receiveEpgProgramData(epgProgramData) {
//	console.log('receiveEpgProgramData');
	return {
		type: RECEIVE_EPG_PROGRAM_DATA,
		epgProgramData
	};
}

function receiveEpgTimeSlots(epgTimeSlots) {
	return {
		type: RECEIVE_EPG_TIME_SLOTS,
		epgTimeSlots
	};
}

export function onRequestEpgIconData() {
  return (dispatch, getState) => {

    const { epgData } = getState().epgp;

		const epgIconData = epgData.tv.channel.reduce((acc, cur, i) => {
//		console.log('epgData.tv.channel', i, cur);

			if (!window.epgChans || i < window.epgChans) {
	      acc[cur.$.id] = { 
	      	icon: cur.icon && cur.icon[0] && cur.icon[0].$ && cur.icon[0].$.src ? cur.icon[0].$.src : undefined, 
	      	longName: cur['display-name'][0], 
	      	shortName: cur['display-name'][1], 
	      	channel: cur['display-name'][2] };
			}

      return acc;
    }, {});


//  	console.log('onRequestEpgIconData', epgIconData);

		dispatch(receiveEpgIconData(epgIconData));
	};
}

function isInRange(firstTimeSLot, lastTimeSLot, start, stop) {
	return (start.isBefore(lastTimeSLot, 'minute') && stop.isAfter(firstTimeSLot, 'minute')); // straddle first time slot
}

function timeDuration(firstTimeSlot, lastTimeSlot, startEx, stopEx) {

	let start = startEx.clone();
	let stop = stopEx.clone();

//	const actual = Math.round(moment.duration(stop.diff(start)).asHours() * 10) / 10;
	const actual = Math.round(moment.duration(stop.diff(start)).asMinutes());

	let display = actual;

	if (start.isBefore(firstTimeSlot)) {
		start = firstTimeSlot.clone();
//		display = Math.round(moment.duration(stop.diff(start)).asHours() * 10) / 10;
		display = Math.round(moment.duration(stop.diff(start)).asMinutes());
	}

	return {
		actual,
		display
	};
}

function onReceiveTimeSlots(time) {
//	console.log('onReceiveTimeSlots', time.format());
  return (dispatch, getState) => {

    const { epgMaxTimeSlots: maxTimeSlotsEx } = getState().epg;

    let maxTimeSlots = maxTimeSlotsEx;

    if (window.epgScrollPx) {
    	maxTimeSlots = (maxTimeSlotsEx / 3);
    }

  	const timeSlots = [];

//  	let time = moment.utc();

		const minutes = time.minutes() % 60;
		const seconds = time.seconds() % 60;

		time.subtract(minutes, 'minutes');
		time.subtract(seconds, 'seconds');
	  	
  	for (let i = 0; i < maxTimeSlots; i++) {
		  timeSlots.push(time.clone());
		  time = time.clone();
		  time.add(1, 'hours');
    }

//  	console.log('onReceiveTimeSlots', timeSlots);

  	dispatch(receiveEpgTimeSlots(timeSlots));
  };
}

function daysAgoFromNow(time) {
	const begin = moment.utc(time, TIME_FORMAT);

	const end = moment.utc();

	const beginDay = begin.day();
	const endDay = end.day();

	const offset = endDay < beginDay ? (7 + endDay - beginDay) : (endDay - beginDay);

//	console.log('days', begin.day(), end.day(), offset);

	const duration = moment.duration(end.diff(begin));
	return Math.floor(duration.asDays() - offset);
}

function addDays(time, days) {

	if (days > 0) {
		return moment.utc(time, TIME_FORMAT).add(days, 'days'); // .format(TIME_FORMAT);	
	}

	return moment.utc(time, TIME_FORMAT);
}

export function onRequestEpgProgramData(time) {
//	console.log('onRequestEpgProgramData', time.format());
  return (dispatch, getState) => {

    const { epgData, epgIconData } = getState().epgp;
    const { epgTimeSlots, epgMaxTimeSlots: maxTimeSlotsEx } = getState().epg;

    let epgMaxTimeSlots = maxTimeSlotsEx;

    if (window.epgScrollPx) {
    	epgMaxTimeSlots = (maxTimeSlotsEx / 3);
    }

		let days = 0;

		if (xmltv === xmltvDemo) {
			days = daysAgoFromNow(epgData.tv.programme[0].$.start);
			console.log('days', days);
		}

		const firstTimeSlot = time.clone();
		const lastTimeSlot = epgTimeSlots[epgMaxTimeSlots - 3];

		const epgProgramData = epgData.tv.programme.reduce((acc, cur, i) => {

			if (epgIconData[cur.$.channel]) { // if chan in list

				if (!acc[cur.$.channel]) {
					acc[cur.$.channel] = [];
				}

				const start = addDays(cur.$.start, days);
	//			console.log('start', start.day());

				const stop = addDays(cur.$.stop, days);
	//			console.log('stop', stop.day());

				if (isInRange(firstTimeSlot.clone(), lastTimeSlot, start, stop)) {

					const subTitle = cur['sub-title'] && cur['sub-title'][0] && cur['sub-title'][0]._ ? cur['sub-title'][0]._ : '';
						      
		      acc[cur.$.channel].push(
		      	{ title: cur.title[0]._, subTitle, start: start.format(), stop: stop.format(),
		      	duration: timeDuration(firstTimeSlot.clone(), lastTimeSlot, start, stop),
		      	desc: cur.desc && cur.desc[0] && cur.desc[0]._ ? cur.desc[0]._ : undefined,
		      	category: cur.category && cur.category[0] && cur.category[0]._ ? cur.category[0]._ : undefined,
		      	icon: cur.icon && cur.icon[0] && cur.icon[0].$ && cur.icon[0].$.src ? cur.icon[0].$.src : undefined,
		      	rating: cur.rating && cur.rating[0] && cur.rating[0].value && cur.rating[0].value[0] ? 
		      		cur.rating[0].value[0] : 'NR', 
		      	credits: { ...cur.credits },
		      	id: `${cur.$.channel}-${start.format()}`,
		      	raw: { ...cur } });
				}

			}
/*
			 else {
				console.log('not found', cur.$.channel);				
			}
*/
      return acc;
    }, {});

//  	console.log('onRequestEpgProgramData', epgProgramData);

		dispatch(receiveEpgProgramData(epgProgramData));
	};
}

export function onRequestRefreshEpg(time) {
//	console.log('onRequestRefreshEpg', time.format());
  return (dispatch, getState) => { 	
		dispatch(onReceiveTimeSlots(time.clone()));
  	dispatch(onRequestEpgProgramData(time.clone()));
  };
}

export function onRequestEpg(timeEx) {
//	console.log('onRequestEpg', time.format());
  return (dispatch, getState) => {
    dispatch(requestEpg());

    let timeAdjusted;

    if (timeEx) {
    	timeAdjusted = timeEx.clone();
    } else {
	    const time = moment.utc();

	    const minutes = time.clone().minutes() % 15;
	    let seconds = time.clone().seconds() % 60;

	    timeAdjusted = time.clone().subtract(minutes, 'minutes').subtract(seconds, 'seconds');
		}

		request({ url: xmltv }, false)	
	    .then(data => {
				const parser = new xml2js.Parser();
				parser.parseString(data, (err, result) => {
        	console.dir(result);
 
        	dispatch(receiveEpg(result));

        	dispatch(onRequestEpgIconData());
        	dispatch(onRequestRefreshEpg(timeAdjusted.clone()));
    		});

	    })
	    .catch(error => {
	        console.log(error);
	    });
  };
}


