import { HomeReducerType } from "interfaces";
import { ActionTypes } from "redux/actions/action_types";

let initialState: HomeReducerType = {
  latestCollections: [],
  popularPublishers: [],
  cardBreakDown: [],
};

const homeReducer = (state = initialState, action: any): HomeReducerType => {
  switch (action.type) {
    case ActionTypes.reducer.home.updateLatestCollection: {
      return {
        ...state,
        latestCollections: action.payload,
      }
    }
      
    case ActionTypes.reducer.home.updatePopularPublishers: {
      return {
        ...state,
        popularPublishers: action.payload,
      }
    }
    case ActionTypes.reducer.home.updateCardBreakDown: {
      return {
        ...state,
        cardBreakDown: action.payload,
      }
    }
    default: {
      return state;
    }
  }
};

export default homeReducer;
