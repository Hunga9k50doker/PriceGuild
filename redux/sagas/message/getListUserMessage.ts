import { takeLatest, call, put } from "redux-saga/effects";
import { ActionTypes } from "redux/actions/action_types";
import { MessagesAction } from "redux/actions/messages_action";
import { QueryResponse, UserMessageType } from "interfaces";
import { api } from "configs/axios";
import { isEmpty } from "lodash";
import moment from "moment";

function* getListUserMessages(action: any) {
  try {
    let response: QueryResponse<UserMessageType[]> = yield call(
      api.v1.messages.messagesLoadInboxAndSent
    );
    if (isEmpty(response.data)) {
      yield put(MessagesAction.updateConversations([]));
    }

    response.data.forEach((item) => {
      let newDate = new Date(item.updated_at)
      newDate.setUTCHours(newDate.getHours() - (new Date()).getTimezoneOffset() / 60)
      item.updated_at = moment.utc(newDate).format('YYYY-MM-DD HH:mm:ss')
    })
    yield put(MessagesAction.updateListUserMessages(response.data));
  } catch (error) {
    console.log("error: ", error);
  }
}

function* getUserMessagesSaga() {
  yield takeLatest(
    ActionTypes.sagas.message.loadInboxAndSent,
    getListUserMessages
  );
}

export default getUserMessagesSaga;
