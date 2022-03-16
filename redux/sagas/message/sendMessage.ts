import { takeLatest, call, put } from "redux-saga/effects";
import { ActionTypes } from "redux/actions/action_types";
import { MessagesAction } from "redux/actions/messages_action";
import { QueryResponse, UserMessageType } from "interfaces";
import { api } from "configs/axios";
// import { firestore } from "firebase";

// eslint-disable-next-line require-yield
function* sendMessage(action: { type: string; action: any }) {
  // try {
  //   const db = firestore();
  //   db.collection("conversations").add({
  //     ...action.action,
  //     isView: false,
  //     createdAt: new Date(),
  //   });
  // } catch (error) {
  //   console.log("error: ", error);
  // }
}

function* sendMessageSaga() {
  yield takeLatest(ActionTypes.sagas.message.sendMessage, sendMessage);
}

export default sendMessageSaga;
