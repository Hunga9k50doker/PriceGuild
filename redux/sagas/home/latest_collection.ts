import {
  CollectionApi,
  CollectionResponse,
  CollectionType,
} from "api/collection";
import { Collection } from "model/portfolio/collection";
import { takeLatest, call, put } from "redux-saga/effects";
import { ActionTypes } from "redux/actions/action_types";
import { HomeActions } from "redux/actions/home_action";

function* latestCollection(action: any) {
  try {
    let response: CollectionResponse = yield call(CollectionApi.getCollection, {
      sport: 1,
      limit: 10,
      page: 1,
    });

    let collections = response.data.collections.map(
      (item: { [key: string]: any }) => {
        return new Collection(item);
      }
    );
    yield put(HomeActions.updateLatestCollection(collections));
  } catch (error) {
    console.log("error: ", error);
  }
}

function* latestCollectionSaga() {
  yield takeLatest(ActionTypes.sagas.home.latestCollection, latestCollection);
}

export default latestCollectionSaga;
