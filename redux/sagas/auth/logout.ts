
import { AuthenticationApi } from 'api/authentication';
import { MyStorage } from 'helper/local_storage';
import {takeLatest, call, put} from 'redux-saga/effects';
import {ActionTypes} from 'redux/actions/action_types';
import { AuthActions } from 'redux/actions/auth_action';


function* logout(action: any) {
  try {
    yield call(AuthenticationApi.logout);
  } catch (error) {
    console.log( 'error: ', error);
  }
  MyStorage.resetWhenLogout();
  yield put(AuthActions.logoutSuccess());

}

function* logoutSaga() {
  yield takeLatest(ActionTypes.sagas.authentication.logout, logout);
}

  export default logoutSaga;
  
