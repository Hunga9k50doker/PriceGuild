import { Collection } from "model/portfolio/collection";
import { ActionTypes } from "./action_types";
import { PopularType, OptionCardBreakDown } from "interfaces";

export class HomeActions {
  ///Sagas
  static getLatestCollection() {
    return {
      type: ActionTypes.sagas.home.latestCollection,
    };
  }

  static getPopularPublishers() {
    return {
      type: ActionTypes.sagas.home.popularPublishers,
    };
  }

  ///Reducer
  static updateLatestCollection(payload: Array<Collection>) {
    return {
      type: ActionTypes.reducer.home.updateLatestCollection,
      payload,
    };
  }

  static updatePopularPublishers(payload: Array<PopularType>) {
    return {
      type: ActionTypes.reducer.home.updatePopularPublishers,
      payload,
    };
  }
  static updateCardBreakDown(payload: Array<OptionCardBreakDown>) {
    return {
        type: ActionTypes.reducer.home.updateCardBreakDown,
        payload,
    }
  }
}
