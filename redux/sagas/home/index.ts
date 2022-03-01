import {all} from 'redux-saga/effects';
import latestCollectionSaga from './latest_collection';
import popularPublisherSaga from './popular_publishers';

export const homeSagas = function* root() {
  yield all([
    latestCollectionSaga(),
    popularPublisherSaga()
  ]);
};
