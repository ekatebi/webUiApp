import {
  TOGGLE_MENU_ITEM,
  RESET_MENU_ITEMS,
  RECEIVE_PANE_WIDTH,
  MENU_ITEM_SOURCES,
  MENU_ITEM_DISPLAYS,
  MENU_ITEM_WALLS,
  MENU_ITEM_ZONES,
  MENU_ITEM_SERVER,
  MENU_ITEM_HELP,
  MENU_ITEM_LOGS,
  MENU_ITEM_MULTIVIEW,
  MENU_ITEM_SEC_USERS,
  MENU_ITEM_SEC_ROLES,
  MENU_ITEM_SEC_PERMS,
  menuItems
} from './constants';

const initState = {
  panes: [],
  menu: menuItems,
  maxSelectedCount: 7
};

const updatePanes = (state, id) => {

  let panes = [...state.panes];
  const menu = { ...state.menu };

  if (!panes.length) {
    panes = Object.keys(menu)
      .map((key, index) => {
        return { ...menu[key], id: key, isOpen: false, index };
      });

    Object.keys(menu)
      .forEach((key, index) => {
        menu[key].id = key;
        menu[key].index = index;
        menu[key].isSelected = false;
        menu[key].paneWidth = -1;
      });
  }

  if (id) {
    panes.forEach((pane) => {
      if (pane.id === id) {
        pane.isOpen = !pane.isOpen;
      }
    });

    menu[id].isSelected = !menu[id].isSelected;
  }
  
  return { ...state, panes: [...panes], menu: { ...menu } };
};

export default (state = initState, action) => {
  switch (action.type) {
    case TOGGLE_MENU_ITEM:
      return updatePanes(state, action.name);
    case RECEIVE_PANE_WIDTH:
//      console.log('RECEIVE_PANE_WIDTH', action.name, action.width);
      return { ...state, menu: { ...state.menu, 
        [action.name]: { ...state.menu[action.name], paneWidth: action.width } } };
    case RESET_MENU_ITEMS:
      return updatePanes(initState);
    default:
      return state;
  }
};
