import { MaintenanceReducerType } from "interfaces";
import { ActionTypes } from "redux/actions/action_types";

let initialState: any = {
    filterSearch: {},
    isFilterStore: false,
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

    default: {
      return state;
    }
  }
};

export default maintenanceReducer;
