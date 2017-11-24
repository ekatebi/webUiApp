import expect from 'expect';
import hashMount from '../../src/reducer/hashMount';
import { UPDATE_LOCATION } from 'react-router-redux';

describe('Reducers', () => {

  describe('hashMount', () => {

    const initState = () => ({
      path: 'context.html',
      current: {
        navLinks: []
      },
      hash: {
        'context.html': {
          navLinks: []
        }
      }
    });

    function reducer(state = { someKey: 'some value' }, action) {
      if (action.type === 'add') {
        const someKey = action.someKey;
        return { ...state, someKey };
      }
      return state;
    }

    it('should handle initial state', () => {
      const mounted = hashMount(reducer);
      const state = mounted(initState(), {});
      // console.log(JSON.stringify(state, 0, 3));
      expect(state).toEqual(initState());
    });

    it('should handle undefined type', () => {
      const mounted = hashMount(reducer);
      const state = mounted(initState(), {});
      expect(state).toEqual(initState());
    });

    it('should handle RECEIVE_DATA type', () => {
      const mounted = hashMount(reducer);
      const state = mounted(initState(), { type: 'add', someKey: 'another value' });
      expect(state.current.someKey).toEqual('another value');
    });

    it('should handle UPDATE_LOCATION type', () => {
      const mounted = hashMount(reducer, 2);
      const payload = { pathname: '/some/126/path' };
      const state = mounted(undefined, { type: UPDATE_LOCATION, payload });
      // console.log(JSON.stringify(state, 0, 3));
      const value = { someKey: 'some other value' };
      expect(state.path).toEqual('some/126');
      const state2 = mounted(state, { type: 'add', ...value });
      expect(state2.current.someKey).toEqual('some other value');
      // console.log(JSON.stringify(state2, 0, 3));
      expect(state2.hash).toEqual({ 'some/126': value });
    });

  });
});
