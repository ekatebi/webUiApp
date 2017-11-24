import {
  SHOW_FILTER,
  FILTER_CHANGED,
  SET_SORT_ORDER,
  EDIT_SORT_ORDER
} from './constants';

export function showFilter(id, show) { // toggle between show and hide if show arg is undefined
  return {
    type: SHOW_FILTER,
    id,
    show
  };
}

export function filterChanged(id, name, value) {
  return {
    type: FILTER_CHANGED,
    id,
    name,
    value
  };
}

export function editSortOrder(devType, mac) {
  return {
    type: EDIT_SORT_ORDER,
    devType,
    mac
  };
}

export function onEditSortOrder(devType, mac) {
  return (dispatch, getState) => {
    dispatch(editSortOrder(devType));
    dispatch(editSortOrder(devType, mac));
  };
}

export function setSortOrder(devType, sortOrder) {
  return {
    type: SET_SORT_ORDER,
    devType,
    sortOrder
  };
}

export function onSetSortOrder(devType, mac, indexOrMac) {
  return (dispatch, getState) => {

    let devConfigs;

    if (devType === 'encoder') {
      const { encoders } = getState().device;
      // Copy the array, so it does not get sorted in place.
      devConfigs = encoders.config.info.text.slice();
    } else if (devType === 'decoder') {
      const { decoders } = getState().device;
      // Copy the array, so it does not get sorted in place.
      devConfigs = decoders.config.info.text.slice();
    }

    let sortOrder = {};

    if (getState().filter.sortOrder[devType] && (indexOrMac !== undefined || indexOrMac === -1)) {
      sortOrder = { ...getState().filter.sortOrder[devType] };
    }

    if (Object.keys(sortOrder).length === 0) {
      devConfigs
        .sort((a, b) => {
          if (!a || !a.gen || !b || !b.gen) {
            return -1;
          }

          const nameA = a.gen.name.toUpperCase(); // ignore upper and lowercase
          const nameB = b.gen.name.toUpperCase(); // ignore upper and lowercase

          if (nameA < nameB) {
            return -1;
          }

          if (nameA > nameB) {
            return 1;
          }

          // names must be equal
          return 0;
        })
        .forEach((devConfig, indx) => {
          sortOrder[devConfig.gen.mac] = indx;
        });
    } else if (Object.keys(sortOrder).length < devConfigs.length) {
      const len = Object.keys(sortOrder).length;
      devConfigs.forEach((devConfig, indx) => {
        if (sortOrder[devConfig.gen.mac] === undefined) {
          sortOrder[devConfig.gen.mac] = len + indx;
        }
      });
    }

//    console.log('onSetSortOrder', devType, mac, indexOrMac);

    let index = indexOrMac;

    if (typeof(indexOrMac) === 'number') {
      index = indexOrMac;
    } else if (typeof(indexOrMac) === 'string') {
      index = Number(sortOrder[indexOrMac]);
    }

//    console.log('sortOrder before', JSON.stringify(sortOrder, 0, 2));

    const oldIndex = Number(sortOrder[mac]);

//    console.log('onSetSortOrder oldIndex', oldIndex, index);

    if (index !== oldIndex) {

      delete sortOrder[mac];

      Object.keys(sortOrder)
        .forEach((mac2) => {

          if (index < oldIndex &&
            Number(sortOrder[mac2]) >= index && Number(sortOrder[mac2]) < oldIndex) {
            sortOrder[mac2] = Number(sortOrder[mac2]) + 1;
          } else if (index > oldIndex &&
            Number(sortOrder[mac2]) <= index && Number(sortOrder[mac2]) > oldIndex) {
            sortOrder[mac2] = Number(sortOrder[mac2]) - 1;
          }

        });

      sortOrder[mac] = index;
    }

//    console.log('sortOrder after', JSON.stringify(sortOrder, 0, 2));

    dispatch(setSortOrder(devType, sortOrder));
  };
}
