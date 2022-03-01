import { ActionTypes } from "./action_types";
import { UserMessageType, ConversationType, GroupMessage } from "interfaces";

export class MessagesAction {
  //Sagas
  static getRealtimeConversations(action: any, dispatch: any) {
    return {
      type: ActionTypes.sagas.message.getRealtimeConversations,
      action,
      dispatch,
    };
  }

  static getListUserMessages() {
    return {
      type: ActionTypes.sagas.message.loadInboxAndSent,
    };
  }

  static sendMessages(action: any) {
    return {
      type: ActionTypes.sagas.message.sendMessage,
      action,
    };
  }

  static removeMessages(action: any) {
    return {
      type: ActionTypes.sagas.message.removeMessage,
      action,
    };
  }
  ///Reducer
  static updateListUserMessages(payload: UserMessageType[]) {
    return {
      type: ActionTypes.reducer.message.updateInboxAndSent,
      payload,
    };
  }
  static updateConversations(payload: GroupMessage[]) {
    return {
      type: ActionTypes.reducer.message.updateConversations,
      payload,
    };
  }
}
