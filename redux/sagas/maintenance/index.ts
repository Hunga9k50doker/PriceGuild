import { all } from "redux-saga/effects";
import getListMaintenance from "./getListMaintenance";
export const maintenanceSagas = function* root() {
  yield all([
    getListMaintenance(),
  ]);
};
