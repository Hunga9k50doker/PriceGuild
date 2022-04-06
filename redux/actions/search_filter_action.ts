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
  static updateIsAddCardCheckList(payload: any) {
      return {
       type: ActionTypes.reducer.search_filter.isAddCardCheckList,
       payload,
     };
  }
  static updateIsAddCardProfile(payload: any) {
      return {
       type: ActionTypes.reducer.search_filter.isAddCardProfile,
       payload,
     };
  }
  static updateCardSelectedProfile(payload: any) {
      return {
       type: ActionTypes.reducer.search_filter.cardSelected,
       payload,
     };
  }
  static updateParamsSearchFilterProfile(payload: any) {
      return {
       type: ActionTypes.reducer.search_filter.paramsSearchFilterProfile,
       payload,
     };
  }
  static updateChangedGradeValue(payload: any) {
    return {
      type: ActionTypes.reducer.search_filter.changeGradeCardValue,
      payload,
    };
  }
  static updateNewGradeValue(payload: any) {
    return {
      type: ActionTypes.reducer.search_filter.newGradeChangedValue,
      payload,
    };
  }
  static updateSetDataFilter(payload: any) {
    return {
      type: ActionTypes.reducer.search_filter.setDataFilter,
      payload,
    };
  }
  static updateLastestFilterEditCard(payload: any) {
    return {
      type: ActionTypes.reducer.search_filter.lastestFilterEditCard,
      payload,
    };
  }
  static updateModeProfile(payload: any) {
    return {
      type: ActionTypes.reducer.search_filter.setModeProfile,
      payload,
    };
  }
  static updateModeSearch(payload: any) {
    return {
      type: ActionTypes.reducer.search_filter.setModeSearch,
      payload,
    };
  }
}
