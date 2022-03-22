import { MaintenanceReducerType } from "interfaces";
import { ActionTypes } from "redux/actions/action_types";

let initialState: MaintenanceReducerType = {
  maintenanceList: undefined,
};

const maintenanceReducer = (
  state = initialState,
  action: any
): MaintenanceReducerType => {
  switch (action.type) {
    case ActionTypes.reducer.maintenance.updateListMaintenance: {
      return {
        ...state,
        maintenanceList: action.payload,
      };
    }

    default: {
      return state;
    }
  }
};

export default maintenanceReducer;
