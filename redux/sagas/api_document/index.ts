import { all } from "redux-saga/effects";
import {
  getApiKeySaga,
  deleteApiKeySaga,
  requestApiKeySaga,
  addWebsiteSaga,
  deleteWebsiteSaga,
} from "./get_api";

export const apiDocumentSagas = function* root() {
  yield all([
    getApiKeySaga(),
    deleteApiKeySaga(),
    requestApiKeySaga(),
    addWebsiteSaga(),
    deleteWebsiteSaga(),
  ]);
};
