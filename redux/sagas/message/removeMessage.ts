import { takeLatest } from "redux-saga/effects";
import { ActionTypes } from "redux/actions/action_types";
import { ActionConversationType } from "interfaces";
// import { firestore } from "firebase";

// eslint-disable-next-line require-yield
function* removeMessage(action: {
  type: string;
  action: ActionConversationType;
}) {
  try {
    // const db = firestore();
    // const unsubscribe = db
    //   .collection("conversations")
    //   .where("user_uid_1", "in", [action.action.uid_1, action.action.uid_2])
    //   .get()
    //   .then((querySnapshot) => {
    //     if (querySnapshot) {
    //       querySnapshot.forEach((doc) => doc.ref.delete());
    //     } else {
    //       console.log("No such document!");
    //     }
    //   })
    //   .catch(function (error) {
    //     console.log("Error getting document:", error);
    //   });
    // return () => unsubscribe;
  } catch (error) {
    console.log("error: ", error);
  }
}

function* removeMessageSaga() {
  yield takeLatest(ActionTypes.sagas.message.removeMessage, removeMessage);
}

export default removeMessageSaga;
