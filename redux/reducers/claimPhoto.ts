// import { ClaimPhotoReducerType } from "interfaces";
// import { ActionTypes } from "redux/actions/action_types";

// let initialState: ClaimPhotoReducerType = {
//   ids: [],
// };

// const claimPhotoReducer = (
//   state = initialState,
//   action: any
// ): ClaimPhotoReducerType => {
//   switch (action.type) {
//     case ActionTypes.reducer.claim.updateListId: {
//       return {
//         ...state,
//         ids: action.payload,
//       };
//     }
//     default: {
//       return state;
//     }
//   }
// };

// export default claimPhotoReducer;

import { ClaimPhotoReducerType } from "interfaces";
import { ActionTypes } from "redux/actions/action_types";

let initialState: ClaimPhotoReducerType = {
  ids: [],
};
const claimPhotoReducer = (
  state = initialState,
  action: any
): ClaimPhotoReducerType => {
  switch (action.type) {
    case ActionTypes.reducer.claim.updateListId: {
      return {
        ...state,
        ids: [...state.ids, action.payload],
      };
    }
    default: {
      return state;
    }
  }
};

export default claimPhotoReducer;
