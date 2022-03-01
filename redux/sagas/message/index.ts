import { all } from "redux-saga/effects";
import getListConversations from "./getListConversations";
import getListUserMessage from "./getListUserMessage";
import sendMessage from "./sendMessage";
import removeMessage from "./removeMessage";
export const messageSagas = function* root() {
  yield all([
    getListConversations(),
    getListUserMessage(),
    sendMessage(),
    removeMessage(),
  ]);
};
