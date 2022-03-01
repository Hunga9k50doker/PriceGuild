import { BaseModel } from "./base";

export class User extends BaseModel {
  userid:              number;
  firstname:           string;
  lastname:            string;
  username:            string;
  email:               string;
  userImg:             string;
  userDefaultSport:    number;
  userDefaultCurrency: string;
  activated:           boolean;
  
  constructor(json?: { [key: string]: any }) {
    super();
    json = json ?? {};
    this.userid = json.userid ?? 0;
    this.firstname = json.firstname ?? '';
    this.lastname = json.lastname ?? '';
    this.username = json.username ?? '';
    this.email = json.email ?? '';
    this.userImg = json.user_img ?? '';
    this.userDefaultSport = json.user_default_sport ?? undefined;
    this.userDefaultCurrency = json.user_default_currency ?? 'USD';
    this.activated = json.activated ?? false;
  }

  toJson(): { [key: string]: any } {
    return {
      "userid": this.userid,
      "firstname": this.firstname,
      "lastname": this.lastname,
      "username": this.username,
      "email": this.email,
      "user_img": this.userImg,
      "user_default_sport": this.userDefaultSport,
      "user_default_currency": this.userDefaultCurrency,
      "activated": this.activated,
    }
  }

  get isLogged(): boolean {
    return Boolean(this.userid);
  }

  toString(): string {
    return JSON.stringify(this.toJson());
  }
}