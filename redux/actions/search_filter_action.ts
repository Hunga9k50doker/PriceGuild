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
  static updateIsFilterTop100(payload: any) {
    return {
      type: ActionTypes.reducer.search_filter.isFilter100,
      payload,
    };
  }
  static updateSeachFilterTop100(payload: any) {
     return {
      type: ActionTypes.reducer.search_filter.updateSearchFilterTop100,
      payload,
    };
  }
  static updateIsEditSaveCard(payload: any) {
     return {
      type: ActionTypes.reducer.search_filter.isEdit,
      payload,
    };
  }
  static updatePageSelected(payload: any) {
     return {
      type: ActionTypes.reducer.search_filter.pageSelected,
      payload,
    };
  }
}
