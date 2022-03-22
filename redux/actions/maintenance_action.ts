import { ActionTypes } from "./action_types";
import { MaintenanceType } from "interfaces";

export class MaintenanceAction {
  //Sagas
  static getListMaintenance(dispatch: any) {
    return {
      type: ActionTypes.sagas.maintenance.getListMaintenance,
      dispatch,
    };
  }

  ///Reducer
  static updateListMaintenance(payload: MaintenanceType[]) {
    return {
      type: ActionTypes.reducer.maintenance.updateListMaintenance,
      payload,
    };
  }
}
