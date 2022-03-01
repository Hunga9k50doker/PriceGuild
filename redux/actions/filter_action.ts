import { ActionTypes } from "./action_types";
import { FilterReducerType, SearchCardType } from "interfaces";

export class FilterAction {
  ///Sagas
  static getFiltersCardDetail(
    action: SearchCardType,
    setDataFilterState?: () => void
  ) {
    return {
      type: ActionTypes.sagas.filter.getFilter,
      action,
      setDataFilterState,
    };
  }

  ///Reducer
  static updateFiltersCardDetail(payload: FilterReducerType) {
    return {
      type: ActionTypes.reducer.filter.updateFilter,
      payload,
    };
  }
}
