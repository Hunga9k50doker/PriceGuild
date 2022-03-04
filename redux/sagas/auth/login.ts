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

    
      MyStorage.user = new User(response.user_data);
      MyStorage.token = response.token;
      action.onSuccess();
    
      yield put(AuthActions.updateInfo(MyStorage.user));
      if (!response?.user_data?.activated) {
        sessionStorage.setItem('redirect',`/verify-email`);
      }
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
