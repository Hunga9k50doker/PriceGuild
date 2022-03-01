import { takeLatest } from "redux-saga/effects";
import { ActionTypes } from "redux/actions/action_types";
import { MessagesAction } from "redux/actions/messages_action";
import { ActionConversationType } from "interfaces";
import { api } from "configs/axios";
import { firestore } from "firebase";
import _ from "lodash";
import moment from "moment";

// eslint-disable-next-line require-yield
function* getConversations(action: {
  type: string;
  action: ActionConversationType;
  dispatch: any;
}) {
  try {
    const monthName = (item: any) =>
      moment(item.createdAt.toDate()).format("DD-MM-YYYY");
    const db = firestore();
    db.collection("conversations")
      .where("user_uid_1", "in", [action.action.uid_1, action.action.uid_2])
      .orderBy("createdAt", "asc")
      .onSnapshot((querySnapshot) => {
        const conversations: any = [];
        querySnapshot.forEach((doc) => {
          if (
            (doc.data().user_uid_1 == action.action.uid_1 &&
              doc.data().user_uid_2 == action.action.uid_2) ||
            (doc.data().user_uid_1 == action.action.uid_2 &&
              doc.data().user_uid_2 == action.action.uid_1)
          ) {
            conversations.push(doc.data());
          }
        });

        // const result = _.chain(conversations)
        //   .groupBy(monthName)
        //   .mapValues((items) => _.map(items))
        //   .value();
        action.dispatch(MessagesAction.updateConversations(conversations));
      });
  } catch (error) {
    console.log("error: ", error);
  }
}

function* getConversationsSaga() {
  yield takeLatest(
    ActionTypes.sagas.message.getRealtimeConversations,
    getConversations
  );
}

export default getConversationsSaga;
