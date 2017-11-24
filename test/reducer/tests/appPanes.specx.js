import expect from 'expect';
import { appPanes as reducer } from '../../../src/reducer/appPanes';
import { addPane, removePane } from '../../../src/action/appPanes';
import { ADD_PANE, REMOVE_PANE,
 SOURCES_PANE, DISPLAYS_PANE, ZONES_PANE } from '../../../src/constant/appPanes';

describe('Reducers', () => {

  describe('appPanes', () => {

    it('should handle initial state', () => {
      const initState = { sources: false, displays: false, zones: false };
      const state = reducer(undefined, {});
      expect(state).toEqual(initState);
    });

    it('should handle ADD_PANE SOURCES_PANE action type', () => {
      const state = { sources: false, displays: false, zones: false };
      const actual = reducer(state, addPane(SOURCES_PANE));
      const exp = Object.assign({}, state, { sources: true });
      expect(actual).toEqual(exp);
    });

    it('should handle REMOVE_PANE SOURCES_PANE action type', () => {
      const state = { sources: true, displays: false, zones: false };
      const actual = reducer(state, removePane(SOURCES_PANE));
      const exp = Object.assign({}, state, { sources: false });
      expect(actual).toEqual(exp);
    });
    
    it('should handle ADD_PANE DISPLAYS_PANE action type', () => {
      const state = { sources: true, displays: false, zones: false };
      const actual = reducer(state, addPane(DISPLAYS_PANE));
      const exp = Object.assign({}, state, { displays: true });
      expect(actual).toEqual(exp);
    });

    it('should handle REMOVE_PANE DISPLAYS_PANE action type', () => {
      const state = { sources: true, displays: true, zones: false };
      const actual = reducer(state, removePane(DISPLAYS_PANE));
      const exp = Object.assign({}, state, { displays: false });
      expect(actual).toEqual(exp);
    });

    it('should handle ADD_PANE ZONES_PANE action type', () => {
      const state = { sources: true, displays: true, zones: false };
      const actual = reducer(state, addPane(ZONES_PANE));
      const exp = Object.assign({}, state, { zones: true });
      expect(actual).toEqual(exp);
    });

    it('should handle REMOVE_PANE ZONES_PANE action type', () => {
      const state = { sources: true, displays: true, zones: true };
      const actual = reducer(state, removePane(ZONES_PANE));
      const exp = Object.assign({}, state, { zones: false });
      expect(actual).toEqual(exp);
    });

  });
});
