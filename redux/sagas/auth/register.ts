import { AuthenticationApi } from "api/authentication";
import { takeLatest, call, put } from "redux-saga/effects";
import { ActionTypes } from "redux/actions/action_types";
import { MyStorage } from "helper/local_storage";
import { User } from "model/user";
import { AuthActions } from "redux/actions/auth_action";

function* register(action: any) {
  try {
    let response: AuthenticationApi.RegisterResponse = yield call(
      AuthenticationApi.register,
      action.payload,
      action.headers
    );

    if (response.success) {
      if (!response?.user_data?.activated) {
        action.router.push(`/verify-email`);
      }
      MyStorage.user = new User(response.user_data);
      MyStorage.token = response.token;
      yield put(AuthActions.updateInfo(MyStorage.user));
      return;
    }
    action?.onFail();
  } catch (error) {
    action?.onFail();
    console.log("tada: ", error);
  }
}

function* registerSaga() {
  yield takeLatest(ActionTypes.sagas.authentication.register, register);
}

export default registerSaga;
