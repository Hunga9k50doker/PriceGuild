import { all } from "redux-saga/effects";
import { authSagas } from "./auth";
import { homeSagas } from "./home";
import { filterSagas } from "./filter";
import { configSagas } from "./config";
import { messageSagas } from "./message";
import { friendSagas } from "./friend";
import { apiDocumentSagas } from "./api_document";
import { maintenanceSagas } from "./maintenance";
export const rootSaga = function* root() {
  yield all([
    authSagas(),
    homeSagas(),
    filterSagas(),
    configSagas(),
    messageSagas(),
    friendSagas(),
    apiDocumentSagas(),
    maintenanceSagas(),
  ]);
};
