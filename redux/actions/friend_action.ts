import { ActionTypes } from "./action_types";

export class FriendAction {
  ///Sagas
  static getListFriend(action: any) {
    return {
      type: ActionTypes.sagas.friend.getListFriend,
      action,
    };
  }

  ///Reducer
  static updateListFriend(payload: any) {
    return {
      type: ActionTypes.reducer.friend.updateListFriend,
      payload,
    };
  }
  // static updateFriends(payload: any) {
  //   return {
  //     type: ActionTypes.reducer.friend.updateListFriend,
  //     payload,
  //   };
  // }
}
