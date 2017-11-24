import {  
	REQUEST_LIST,
	RECEIVE_LIST,
	RECEIVE_MODEL,
	RECEIVE_ERROR,
  RECEIVE_DRAGGING,
  RECEIVE_DRAG_INFO,
  RECEIVE_DROP_INFO,
  RECEIVE_CAN_DROP,
  RECEIVE_GRID_REC,
  RECEIVE_POINT_REC,
  RECEIVE_REMOVE_WIN,
	ITEM_CHANGED,
	SHOW_EDITOR,
  X_RAY_VISION,
  REQUEST_SAVE_ITEM,
  REQUEST_REMOVE_ITEM,
  LOAD_PATTERN,
  TOGGLE_ASPECT_RATIO,
  ENABLE_SAVE_AS,
  ENABLE_RENAME,
  SELECT_MULTIVIEW
} from './constants';

import { 
  patternNone,
  pattern2X2,
  pattern3X3,
  patternLtl,
  patternLtr,
  patternLbl,
  patternLbr
} from './patterns';

// mv state
const initState = {
//  patterns: ['2x2', '3x3', 'L-TL', 'L-TR', 'L-BL', 'L-BR'],
  spareWin: {
        posX: 0,
        posY: 0,
        sizeX: 20,
        sizeY: 20
  },
  maxWins: 9,
  list: [],
  model: {},
  fetching: false,
  editorShowing: false,
  item: {
      gen: {
        name: ''
      },
      windows: []
  },
  dragging: undefined,
  canDrop: false,
  clientOffset: undefined,
  gridRec: undefined,
  pointRec: undefined,
  grid: {
    width: 600,
    count: 20,
    withLabels: true,
    pointLabels: false
  },
  xRayVision: false,
  aspectRatio: true,
  saveAs: false,
  rename: undefined,
  selectedMultiview: undefined
};

const bubbleSort = (a) => {
  let swapped;
  do {
      swapped = false;
      for (let i = 0; i < a.length - 1; i++) {
          if ((a[i].sizeX * a[i].sizeY) < (a[i + 1].sizeX * a[i + 1].sizeY)) {
              const temp = a[i];
              a[i] = a[i + 1];
              a[i + 1] = temp;
              swapped = true;
          }
      }
  } while (swapped);

  return a;
};

export default (state = initState, action) => {

  switch (action.type) {
    case REQUEST_LIST:
      return { ...state, fetching: true, list: [], model: {} };
    case RECEIVE_LIST:
      return { ...state, fetching: false, list: action.list, model: {} };
    case RECEIVE_MODEL:
        return { ...state, model: { ...state.model, [action.mvName]: action.model } };
    case RECEIVE_ERROR:
      return { ...state, fetching: false, error: action.error, list: [], model: {} };
    case RECEIVE_DRAGGING:
      return { ...state, dragging: action.dragging };
    case RECEIVE_DROP_INFO:
    { 
//      console.log('RECEIVE_DROP_INFO before', action.percentDiff, state.item.windows[action.dragItem.winIndex]);
      const wins = [...state.item.windows];

      if (action.dragItem.winIndex < wins.length) {

        const win = { ...wins[action.dragItem.winIndex] };

        if (action.dragItem.pointIndex === 0) {
          win.posX += action.percentDiff.x; 
          win.posY += action.percentDiff.y;
        } else {
          if (state.aspectRatio) {
            if (action.percentDiff.x < action.percentDiff.y) {
              win.sizeX += action.percentDiff.x; 
              win.sizeY = win.sizeX;
            } else {
              win.sizeY += action.percentDiff.y;
              win.sizeX = win.sizeY; 
            }
          } else {
            win.sizeX += action.percentDiff.x; 
            win.sizeY += action.percentDiff.y;
          }
        }

        wins.splice(action.dragItem.winIndex, 1);
        wins.push(win);
//        wins[action.dragItem.winIndex] = win;

      } else {
        wins.push({ ...state.spareWin, posX: action.percentDiff.x, posY: action.percentDiff.y });        
      }
//      console.log('RECEIVE_DROP_INFO after', wins[action.dragItem.winIndex]);
      
      const sortedWins = bubbleSort([...wins]);

      return { ...state, clientOffset: undefined,
        item: { ...state.item, windows: [...sortedWins], dirty: true } };
    }

    case RECEIVE_GRID_REC:
//      console.log('RECEIVE_GRID_REC', state.gridRec, action.gridRec);
      return { ...state, gridRec: action.gridRec };

    case RECEIVE_POINT_REC:
//      console.log('RECEIVE_POINT_REC', state.pointRec, action.pointRec);
      return { ...state, pointRec: action.pointRec };
//      return state;
      
    case RECEIVE_CAN_DROP:
//      console.log('RECEIVE_CAN_DROP', state.canDrop, action.canDrop);
      return { ...state, canDrop: action.canDrop, 
        clientOffset: action.clientOffset, 
        differenceFromInitialOffset: action.differenceFromInitialOffset };

    case REQUEST_SAVE_ITEM:
      { 
        const { item, list } = state;
        const newList = [...list];

        if (item.index > -1) {
          const index = item.index;
          delete item.index;
          delete item.dirty;
          newList[index] = item;
        } else {
          newList.push(item);
        }

        return { ...state, list: [...newList] };
      }
    case RECEIVE_REMOVE_WIN:
      {
        const wins = [...state.item.windows];
        wins.splice(action.winIndex, 1);
//      console.log('RECEIVE_CAN_DROP', state.canDrop, action.canDrop);
        return { ...state, item: { ...state.item, windows: [...wins], dirty: true } };
      }
    case REQUEST_REMOVE_ITEM:
      {
        const newList = [...state.list];
        newList.splice(action.index, 1);
//      console.log('RECEIVE_CAN_DROP', state.canDrop, action.canDrop);
        return { ...state, list: [...newList] };
      }
    case LOAD_PATTERN:
      {
        switch (action.pattern) {
          case 'None':
            {
              return { ...state, item: { ...state.item, windows: [], dirty: true } };              
            }
          case '2x2':
            {
              const wins = [];

              pattern2X2.forEach((item) => {
                wins.push({ ...item });
              });

              return { ...state, item: { ...state.item, windows: [...wins], dirty: true } };
            }
          case '3x3':
            {
              const wins = [];

              pattern3X3.forEach((item) => {
                wins.push({ ...item });
              });

              return { ...state, item: { ...state.item, windows: [...wins], dirty: true } };
            }
          case 'L-TL':
            {
              const wins = [];

              patternLtl.forEach((item) => {
                wins.push({ ...item });
              });

              return { ...state, item: { ...state.item, windows: [...wins], dirty: true } };
            }
          case 'L-TR':
            {
              const wins = [];

              patternLtr.forEach((item) => {
                wins.push({ ...item });
              });

              return { ...state, item: { ...state.item, windows: [...wins], dirty: true } };
            }
          case 'L-BL':
            {
              const wins = [];

              patternLbl.forEach((item) => {
                wins.push({ ...item });
              });

              return { ...state, item: { ...state.item, windows: [...wins], dirty: true } };
            }
          case 'L-BR':
            {
              const wins = [];

              patternLbr.forEach((item) => {
                wins.push({ ...item });
              });

              return { ...state, item: { ...state.item, windows: [...wins], dirty: true } };
            }
          default:
            {
              return state;
            }
        } 
      }
    case SHOW_EDITOR:
      return { ...state, editorShowing: action.show, item: action.item, 
        gridRec: undefined, pointRec: undefined, 
        saveAs: false, rename: undefined };
    case ITEM_CHANGED:
      return { ...state, item: { ...action.item, 
        dirty: action.allowDirty ? true : state.item.dirty } };
    case X_RAY_VISION:
      return { ...state, xRayVision: action.xRayVision };    
    case TOGGLE_ASPECT_RATIO:
      return { ...state, aspectRatio: !state.aspectRatio };
    case ENABLE_SAVE_AS:
      return { ...state, saveAs: true, item: { ...state.item, index: -1 } };
    case ENABLE_RENAME:
      return { ...state, rename: action.rename, item: { ...state.item, index: -1 } };
    case SELECT_MULTIVIEW:
      return { ...state, selectedMultiview: action.multiview };
    default:
      return state;
  }

};
