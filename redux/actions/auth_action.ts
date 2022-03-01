import { AuthenticationApi } from "api/authentication";
import { User } from "model/user";
import { ActionTypes } from "./action_types";
export class AuthActions {
  static login(
    payload: AuthenticationApi.LoginParamType,
    onSuccess: () => void,
    headers: any,
    router: any,
    onFail: () => void
  ) {
    return {
      type: ActionTypes.sagas.authentication.login,
      onSuccess,
      payload,
      headers,
      router,
      onFail,
    };
  }

  static register(
    payload: AuthenticationApi.RegisterParamType,
    headers: any,
    router: any,
    onFail: () => void
  ) {
    return {
      type: ActionTypes.sagas.authentication.register,
      payload,
      headers,
      router,
      onFail,
    };
  }

  static updateInfo(payload: User) {
    return {
      type: ActionTypes.reducer.authentication.updateInfo,
      payload,
    };
  }

  static activeAccount(payload: AuthenticationApi.ActiveAccountParamType) {
    return {
      type: ActionTypes.reducer.authentication.updateInfo,
      payload,
    };
  }

  static logout() {
    return { type: ActionTypes.sagas.authentication.logout };
  }

  static logoutSuccess() {
    return { type: ActionTypes.reducer.authentication.logout };
  }
}
