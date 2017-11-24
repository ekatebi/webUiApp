import { SPIN_UP, SPIN_DOWN, SPIN_RESET_WARNING, SPIN_RESET_ERROR }
  from '../constant/spinner';
import fetchMock from 'fetch-mock';

export function spinUp(args) {
  return {
    type: SPIN_UP,
    ...args,
  };
}

export function spinDown(args) {
  return {
    type: SPIN_DOWN,
    ...args,
  };
}

export function onSpinResetWarning() {
  fetchMock.reset();
  return {
    type: SPIN_RESET_WARNING,
  };
}

export function onSpinResetError() {
  return {
    type: SPIN_RESET_ERROR,
  };
}
