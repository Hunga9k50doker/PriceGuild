import { FriendReducerType } from "interfaces";
import { ActionTypes } from "redux/actions/action_types";

let initialState: FriendReducerType = {
  friends: [],
  requests: [],
  requests_sent: [],
  blocked: [],
};

const friendReducer = (
  state = initialState,
  action: any
): FriendReducerType => {
  switch (action.type) {
    case ActionTypes.reducer.friend.updateListFriend: {
      return {
        ...action.payload,
      };
    }
    default: {
      return state;
    }
  }
};

export default friendReducer;
