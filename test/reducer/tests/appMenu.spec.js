import expect from 'expect';
import reducer from '../../../src/reducer/appMenu';
import { toggleItem } from '../../../src/action/appMenu';
import {
  TOGGLE_MENU_ITEM,
  MENU_ITEM_SOURCES,
  MENU_ITEM_DISPLAYS,
  MENU_ITEM_ZONES,
  MENU_ITEM_SERVER
} from '../../../src/constant/appMenu';

describe('Reducers', () => {

  describe('appMenu', () => {

    it('should handle initial state', () => {
      const initState = { sources: false, displays: false, zones: false, server: false };
      const state = reducer(undefined, {});
      expect(state).toEqual(initState);
    });

    it('should handle toggleItem MENU_ITEM_SOURCES (from false to true) action type', () => {
      const state = { sources: false, displays: false, zones: false, server: false };
      const actual = reducer(state, toggleItem(MENU_ITEM_SOURCES));
      const exp = Object.assign({}, state, { sources: true });
      expect(actual).toEqual(exp);
    });

    it('should handle toggleItem MENU_ITEM_SOURCES (from true to false) action type', () => {
      const state = { sources: true, displays: false, zones: false, server: false };
      const actual = reducer(state, toggleItem(MENU_ITEM_SOURCES));
      const exp = Object.assign({}, state, { sources: false });
      expect(actual).toEqual(exp);
    });
    
    it('should handle toggleItem MENU_ITEM_DISPLAYS (from false to true) action type', () => {
      const state = { sources: false, displays: false, zones: false, server: false };
      const actual = reducer(state, toggleItem(MENU_ITEM_DISPLAYS));
      const exp = Object.assign({}, state, { displays: true });
      expect(actual).toEqual(exp);
    });

    it('should handle toggleItem MENU_ITEM_DISPLAYS (from true to false) action type', () => {
      const state = { sources: false, displays: true, zones: false, server: false };
      const actual = reducer(state, toggleItem(MENU_ITEM_DISPLAYS));
      const exp = Object.assign({}, state, { displays: false });
      expect(actual).toEqual(exp);
    });

    it('should handle toggleItem MENU_ITEM_ZONES (from false to true) action type', () => {
      const state = { sources: false, displays: false, zones: false, server: false };
      const actual = reducer(state, toggleItem(MENU_ITEM_ZONES));
      const exp = Object.assign({}, state, { zones: true });
      expect(actual).toEqual(exp);
    });

    it('should handle toggleItem MENU_ITEM_ZONES (from true to false) action type', () => {
      const state = { sources: false, displays: false, zones: true, server: false };
      const actual = reducer(state, toggleItem(MENU_ITEM_ZONES));
      const exp = Object.assign({}, state, { zones: false });
      expect(actual).toEqual(exp);
    });

    it('should handle toggleItem MENU_ITEM_SERVER (from false to true) action type', () => {
      const state = { sources: false, displays: false, zones: false, server: false };
      const actual = reducer(state, toggleItem(MENU_ITEM_SERVER));
      const exp = Object.assign({}, state, { server: true });
      expect(actual).toEqual(exp);
    });

    it('should handle toggleItem MENU_ITEM_SERVER (from true to false) action type', () => {
      const state = { sources: false, displays: false, zones: false, server: true };
      const actual = reducer(state, toggleItem(MENU_ITEM_SERVER));
      const exp = Object.assign({}, state, { server: false });
      expect(actual).toEqual(exp);
    });

    it('should handle REMOVE_PANE SOURCES_PANE action type', () => {
      const state = { sources: true, displays: true, zones: true, server: true };
      const actual = reducer(state, toggleItem(MENU_ITEM_SOURCES));
      const exp = Object.assign({}, state, { sources: false });
      expect(actual).toEqual(exp);
    });

    it('should handle REMOVE_PANE DISPLAYS_PANE action type', () => {
      const state = { sources: true, displays: true, zones: true, server: true };
      const actual = reducer(state, toggleItem(MENU_ITEM_DISPLAYS));
      const exp = Object.assign({}, state, { displays: false });
      expect(actual).toEqual(exp);
    });

    it('should handle REMOVE_PANE ZONES_PANE action type', () => {
      const state = { sources: true, displays: true, zones: true, server: true };
      const actual = reducer(state, toggleItem(MENU_ITEM_ZONES));
      const exp = Object.assign({}, state, { zones: false });
      expect(actual).toEqual(exp);
    });

    it('should handle REMOVE_PANE SERVER_PANE action type', () => {
      const state = { sources: true, displays: true, zones: true, server: true };
      const actual = reducer(state, toggleItem(MENU_ITEM_SERVER));
      const exp = Object.assign({}, state, { server: false });
      expect(actual).toEqual(exp);
    });

  });
});
