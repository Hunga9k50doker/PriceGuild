import { takeLatest, call, put } from "redux-saga/effects";
import { ActionTypes } from "redux/actions/action_types";
import { FriendAction } from "redux/actions/friend_action";
import { QueryResponse, FriendReducerType } from "interfaces";
import { api } from "configs/axios";

function* getListFriend(action: any) {
  try {
    let response: QueryResponse<FriendReducerType> = yield call(
      api.v1.friends.getFriends,
      action.action
    );
    yield put(FriendAction.updateListFriend(response.data));
  } catch (error) {
    console.log("error: ", error);
  }
}

function* getListFriendSaga() {
  yield takeLatest(ActionTypes.sagas.friend.getListFriend, getListFriend);
}

export default getListFriendSaga;
