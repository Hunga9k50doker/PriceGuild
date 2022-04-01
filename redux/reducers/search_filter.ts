import { MaintenanceReducerType } from "interfaces";
import { ActionTypes } from "redux/actions/action_types";

let initialState: any = {
  filterSearch: {},
  isFilterStore: false,
  filterSearchTop100: {},
  isFilterStoreTop100: false,
  isEditCardData: false,
  pageSelected: 1,
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
    default: {
      return state;
    }
  }
};

export default maintenanceReducer;
