import {atom} from 'recoil';

export const userState = atom({
  key: 'userState',
  default: [],
});
export const refreshState = atom({
  key: 'refreshState',
  default: false,
});

export const storeState = atom({
  key: 'storeState',
  default: [],
});

export const storeIdState = atom({
  key: 'storeIdState',
  default: null,
});

export const loginState = atom({
  key: 'loginState',
  default: null,
});

export const addStoreState = atom({
  key: 'addStoreState',
  default: null,
});

export const tokenState = atom({
  key: 'tokenState',
  default: null,
});
