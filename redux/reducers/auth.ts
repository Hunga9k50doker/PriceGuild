import { MyStorage } from "helper/local_storage";
import { AuthReducerType } from "interfaces";
import { User } from "model/user";
import { ActionTypes } from "redux/actions/action_types";

const userInfo: User = MyStorage.user;

let initialState: AuthReducerType = {
  userInfo: userInfo,
  loggingIn: Boolean(userInfo.userid),
};

const authReducer = (state = initialState, action: any): AuthReducerType => {
  switch (action.type) {
    case ActionTypes.reducer.authentication.updateInfo: {
      return {
        ...state,
        userInfo: action.payload,
        loggingIn: true,
      };
    }
      
    case ActionTypes.reducer.authentication.logout: {
      return {
        ...state,
        userInfo: new User(),
        loggingIn: false,
      };
    }

    default: {
      return state;
    }
  }
};

export default authReducer;
