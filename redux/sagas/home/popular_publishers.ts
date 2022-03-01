import { takeLatest, call, put } from "redux-saga/effects";
import { ActionTypes } from "redux/actions/action_types";
import { HomeActions } from "redux/actions/home_action";
import { QueryResponse, PopularType } from "interfaces";
import { api } from "configs/axios";

function* popularPublisher(action: any) {
  try {
    let response: QueryResponse<PopularType[]> = yield call(
      api.v1.getPopularPublisher
    );
    yield put(HomeActions.updatePopularPublishers(response.data));
  } catch (error) {
    console.log("error: ", error);
  }
}

function* popularPublisherSaga() {
  yield takeLatest(ActionTypes.sagas.home.popularPublishers, popularPublisher);
}

export default popularPublisherSaga;
