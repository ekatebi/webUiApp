import { combineReducers } from 'redux';
// import { routeReducer as routing } from 'react-router-redux';
import auth from '../component/auth/reducer';
import appMenu from '../component/appMenu/reducer';
import joinConfigVersions from '../component/connection/reducer';
import wall from '../component/wall/reducer';
import multiview from '../component/multiview/reducer';
import zone from '../component/zone/reducer';
import filter from '../component/filter/reducer';
import device from '../component/device/reducer';
import log from '../component/log/reducer';
import sec from '../component/security/reducer';
import { epg, epgp } from '../component/epg/reducer';

const rootReducer = combineReducers({
//  routing,
  appMenu,
  joinConfigVersions,
  wall,
  multiview,
  zone,
  filter,
  device,
  log,
  auth,
  sec,
  epgp,
  epg
});

export default rootReducer;
