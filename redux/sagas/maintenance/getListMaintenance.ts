import { takeLatest } from "redux-saga/effects";
import { ActionTypes } from "redux/actions/action_types";
import { MaintenanceAction } from "redux/actions/maintenance_action";
import { ActionConversationType } from "interfaces";
import { api } from "configs/axios";
import { firestore } from "utils/firebase";
import _ from "lodash";
import moment from "moment";

// eslint-disable-next-line require-yield
function* getListMaintenance(action: {
  type: string;
  dispatch: any;
}) {
  try {
    firestore.collection("maintenance_mode")
      .onSnapshot((querySnapshot) => {
        const listData: any = [];
        querySnapshot.forEach((doc) => {
          listData.push(doc.data());
        });

        action.dispatch(MaintenanceAction.updateListMaintenance(listData));
      });
  } catch (error) {
    console.log("error: ", error);
  }
}

function* getListMaintenanceSaga() {
  yield takeLatest(
    ActionTypes.sagas.maintenance.getListMaintenance,
    getListMaintenance
  );
}

export default getListMaintenanceSaga;
