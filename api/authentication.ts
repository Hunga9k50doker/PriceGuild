import {NewHttpClient} from "./axiosClients";

export class AuthenticationApi {

  static login(body: AuthenticationApi.LoginParamType, headers: any = {}) {
   return new NewHttpClient<AuthenticationApi.LoginResponse>({route: '/login', headers }).post(body);
  }

  static register(body: AuthenticationApi.RegisterParamType, headers: any = {})  {
    return new NewHttpClient<AuthenticationApi.RegisterResponse>({ route: '/account/pg_app_register_account', headers }).post(body);
  }

  static activationAccount(body: AuthenticationApi.ActiveAccountParamType)  {
    return new NewHttpClient({ route: '/account/pg_app_activate_account'}).post(body);
  }

  static logout()  {
    return new NewHttpClient({ route: '/logout' }).delete();
  }
}

export declare namespace AuthenticationApi {
  /**Post data login */
  interface LoginParamType {
    username: string;
    password: string;
  }

  interface LoginResponse {
    success:          boolean;
    token:            string;
    token_expiration: number;
    user_data:        {[key: string]: any};
  }


  /**Post data register */
  interface RegisterParamType {
    first_name: string,
    last_name: string,
    username: string,
    email: string,
    password: string,
    news_letter: 0 | 1,
    time_zone: string
  }
  interface RegisterResponse {
    success:          boolean;
    token:            string;
    token_expiration: number;
    user_data:        {[key: string]: any};
  }

  /**Post data register */
  interface ActiveAccountParamType {
    userid: number;
    token:  string;
  }
}


