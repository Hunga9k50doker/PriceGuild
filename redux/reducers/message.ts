import { MessagesReducerType } from "interfaces";
import { ActionTypes } from "redux/actions/action_types";

let initialState: MessagesReducerType = {
  conversations: undefined,
  users: undefined,
};

const messageReducer = (
  state = initialState,
  action: any
): MessagesReducerType => {
  switch (action.type) {
    case ActionTypes.reducer.message.updateInboxAndSent: {
      return {
        ...state,
        users: action.payload,
      };
    }

    case ActionTypes.reducer.message.updateConversations: {
      return {
        ...state,
        conversations: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};

export default messageReducer;
