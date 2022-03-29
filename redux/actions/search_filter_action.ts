import { ActionTypes } from "./action_types";

export class SearchFilterAction {
  ///Reducer
  static updateSearchFilter(payload: any) {
    return {
      type: ActionTypes.reducer.search_filter.updateSearchFilter,
      payload,
    };
  }
  static updateIsFilter(payload: any) {
    return {
      type: ActionTypes.reducer.search_filter.isFilter,
      payload,
    };
  }
}
