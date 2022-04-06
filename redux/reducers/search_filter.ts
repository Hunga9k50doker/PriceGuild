import { MaintenanceReducerType } from "interfaces";
import { ActionTypes } from "redux/actions/action_types";

let initialState: any = {
  filterSearch: {},
  isFilterStore: false,
  filterSearchTop100: {},
  isFilterStoreTop100: false,
  isEditCardData: false,
  pageSelected: 1,
  isAddCardCheckList: false,
  isAddCardProfile: false,
  cardSelectedStore: {},
  paramsSearchFilterProfile: {},
  changeGradeCardEdit: false,
  newGradeChanged: {},
  dataFilterStore: {},
  lastestFilterEditCardStore: {}
};

const maintenanceReducer = (
  state = initialState,
  action: any
) => {
  switch (action.type) {
    case ActionTypes.reducer.search_filter.updateSearchFilter: { 
      return {
        ...state,
        filterSearch: action.payload,
      };
    }
    case ActionTypes.reducer.search_filter.isFilter: { 
      return {
        ...state,
        isFilterStore: action.payload,
      };
    }
    case ActionTypes.reducer.search_filter.updateSearchFilterTop100: { 
      return {
        ...state,
        filterSearchTop100: action.payload,
      };
    }
    case ActionTypes.reducer.search_filter.isFilter100: { 
      return {
        ...state,
        isFilterStoreTop100: action.payload,
      };
    }
    case ActionTypes.reducer.search_filter.isEdit: {
      return {
        ...state,
        isEditCardData: action.payload
      };
    }
    case ActionTypes.reducer.search_filter.pageSelected: { 
      return {
        ...state,
        pageSelected: action.payload
      };
    }
    case ActionTypes.reducer.search_filter.isAddCardCheckList: { 
       return {
         ...state,
         isAddCardCheckList: action.payload
       };
    }
    case ActionTypes.reducer.search_filter.isAddCardProfile: { 
       return {
         ...state,
         isAddCardProfile: action.payload
       };
    }
    case ActionTypes.reducer.search_filter.cardSelected: { 
       return {
         ...state,
         cardSelectedStore: action.payload
       };
    }
    case ActionTypes.reducer.search_filter.paramsSearchFilterProfile: { 
       return {
         ...state,
         paramsSearchFilterProfile: action.payload
       };
    }
    case ActionTypes.reducer.search_filter.changeGradeCardValue: { 
       return {
         ...state,
         changeGradeCardEdit: action.payload
       };
    }
    case ActionTypes.reducer.search_filter.newGradeChangedValue: { 
       return {
         ...state,
         newGradeChanged: action.payload
       };
    }
    case ActionTypes.reducer.search_filter.setDataFilter: { 
       return {
         ...state,
         dataFilterStore: action.payload
       };
    }
    case ActionTypes.reducer.search_filter.lastestFilterEditCard: { 
       return {
         ...state,
         lastestFilterEditCardStore: action.payload
       };
    }
    default: {
      return state;
    }
  }
};

export default maintenanceReducer;
