import { all } from "redux-saga/effects";
import getListFriend from "./getListFriend";

export const friendSagas = function* root() {
  yield all([getListFriend()]);
};
