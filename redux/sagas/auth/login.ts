import { AuthenticationApi } from "api/authentication";
import { MyStorage } from "helper/local_storage";
import { User } from "model/user";
import { takeLatest, call, put } from "redux-saga/effects";
import { ActionTypes } from "redux/actions/action_types";
import { AuthActions } from "redux/actions/auth_action";

function* login(action: any) {
  try {
    let response: AuthenticationApi.LoginResponse = yield call(
      AuthenticationApi.login,
      action.payload,
      action.headers
    );

    if (response.success) {
      if (!response?.user_data?.activated) {
        action.router.push(`/verify-email`);
      }
      MyStorage.user = new User(response.user_data);
      MyStorage.token = response.token;
      action.onSuccess();
      yield put(AuthActions.updateInfo(MyStorage.user));
      return;
    }
    action?.onFail();
  } catch (error) {
    action?.onFail();
    console.log("error: ", error);
  }
}

function* loginSaga() {
  yield takeLatest(ActionTypes.sagas.authentication.login, login);
}

export default loginSaga;
