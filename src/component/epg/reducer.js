import { NOOP, REQUEST_EPG, RECEIVE_EPG, RECEIVE_EPG_TIME_SLOTS,
  RECEIVE_EPG_ICON_DATA, RECEIVE_EPG_PROGRAM_DATA } from './constants';

const epgInitState = {
/*  
  fetching: false,
  epgData: {},
  epgIconData: {},
*/
  epgMaxTimeSlots: 24,
  epgProgramData: {},
  epgTimeSlots: []
};

// export default (state = initState, action) => {
const epg = (state = epgInitState, action) => {
  switch (action.type) {
/*    
    case REQUEST_EPG:
//      console.log('REQUEST_EPG');
      return { ...state, fetching: true };
    case RECEIVE_EPG:
//      console.log('RECEIVE_EPG');
      return { ...state, epgData: { ...action.epgData } };
    case RECEIVE_EPG_ICON_DATA:
//      console.log('RECEIVE_EPG_ICON_DATA');
      return { ...state, fetching: false, epgIconData: { ...action.epgIconData } };
*/
    case RECEIVE_EPG_PROGRAM_DATA:
//      console.log('RECEIVE_EPG_PROGRAM_DATA');
      return { ...state, epgProgramData: { ...action.epgProgramData } };
    case RECEIVE_EPG_TIME_SLOTS:
//      console.log('RECEIVE_EPG_TIME_SLOTS');
      return { ...state, epgTimeSlots: [...action.epgTimeSlots] };
    default:
      return state;
  }

};

const epgpInitState = {
  fetching: false,
  epgData: {},
  epgIconData: {},
/*  
  epgMaxTimeSlots: 24,
  epgProgramData: {},
  epgTimeSlots: []
*/
};

// export default (state = initState, action) => {
const epgp = (state = epgpInitState, action) => {
  switch (action.type) {
    case REQUEST_EPG:
//      console.log('REQUEST_EPG');
      return { ...state, fetching: true };
    case RECEIVE_EPG:
//      console.log('RECEIVE_EPG');
      return { ...state, epgData: { ...action.epgData } };
    case RECEIVE_EPG_ICON_DATA:
//      console.log('RECEIVE_EPG_ICON_DATA');
      return { ...state, fetching: false, epgIconData: { ...action.epgIconData } };
/*      
    case RECEIVE_EPG_PROGRAM_DATA:
//      console.log('RECEIVE_EPG_PROGRAM_DATA');
      return { ...state, epgProgramData: { ...action.epgProgramData } };
    case RECEIVE_EPG_TIME_SLOTS:
//      console.log('RECEIVE_EPG_TIME_SLOTS');
      return { ...state, epgTimeSlots: [...action.epgTimeSlots] };
*/
    default:
      return state;
  }

};

module.exports = {
  epg,
  epgp
};
