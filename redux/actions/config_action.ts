import { ActionTypes } from "./action_types";
import { SelectDefultType, SportType } from "interfaces";

export class ConfigAction {
  ///Sagas
  static getCurrencies() {
    return {
      type: ActionTypes.sagas.config.getCurrencies,
    };
  }

  ///Reducer
  static updateCurrencies(payload: SelectDefultType[]) {
    return {
      type: ActionTypes.reducer.config.updateCurrencies,
      payload,
    };
  }
  static updateSports(payload: SportType[]) {
    return {
      type: ActionTypes.reducer.config.updateSports,
      payload,
    };
  }
  static updateBrowse(payload: boolean) {
    return {
      type: ActionTypes.reducer.config.updateIsBrowse,
      payload,
    };
  }
  static updateUserNameSocial(payload: boolean) {
    return {
      type: ActionTypes.reducer.config.updateUserNameSocial,
      payload,
    };
  }
  static updateEmailVerify(payload: boolean) {
    return {
      type: ActionTypes.reducer.config.updateEmailVerify,
      payload,
    };
  }
  static updateShowMenuCollection(payload: boolean) {
    return {
      type: ActionTypes.reducer.config.updateIsShowCollection,
      payload,
    }
  }
  static updateShowTabBar(payload: boolean) {
    return {
      type: ActionTypes.reducer.config.updateIsShowTabBar,
      payload,
    }
  }
  
}
