import { ActionTypes } from "./action_types";
import { CardCompareType } from "interfaces";

export class CompareAction {
  ///Sagas
  static addCard(payload: CardCompareType) {
    return {
      type: ActionTypes.reducer.compare.addCard,
      payload,
    };
  }

  ///Reducer
  static removeCard(payload: string) {
    return {
      type: ActionTypes.reducer.compare.removeCard,
      payload,
    };
  }
}
