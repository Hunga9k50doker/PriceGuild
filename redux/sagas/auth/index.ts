import {all} from 'redux-saga/effects';
import logoutSaga from './logout';
import loginSaga from './login';
import registerSaga from './register';

export const authSagas = function* root() {
  yield all([
    loginSaga(),
    registerSaga(),
    logoutSaga(),
  ]);
};
