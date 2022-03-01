import {all} from 'redux-saga/effects';
import pgAppdata1st from './pg_app_data_1st';

export const filterSagas = function* root() {
  yield all([
    pgAppdata1st(),
  ]);
};
