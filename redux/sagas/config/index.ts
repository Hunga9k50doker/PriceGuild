import { all } from "redux-saga/effects";
import currencies from "./currencies";

export const configSagas = function* root() {
  yield all([currencies()]);
};
