import { FilterReducerType } from "interfaces";
import { ActionTypes } from "redux/actions/action_types";

let initialState: FilterReducerType = {
  collections: [],
  auto_memo: [],
  printRuns: [],
  publishers: [],
  years: [],
  sports: [],
  grades: [],
};

const filterReducer = (
  state = initialState,
  action: any
): FilterReducerType => {
  switch (action.type) {
    case ActionTypes.reducer.filter.updateFilter: {
      return {
        ...action.payload,
      };
    }

    default: {
      return state;
    }
  }
};

export default filterReducer;
