import { ConfigReducerType } from "interfaces";
import { ActionTypes } from "redux/actions/action_types";

let initialState: ConfigReducerType = {
  currencies: [],
  sports: [],
  is_browse: false,
  is_set_username: false,
  is_email_verify: false,
  is_show_card_detail_collection: false,
  is_show_tab_bar: true,
  currency: "USD",
};

const configReducer = (
  state = initialState,
  action: any
): ConfigReducerType => {
  switch (action.type) {
    case ActionTypes.reducer.config.updateCurrencies: {
      return {
        ...state,
        currencies: action.payload,
      };
    }
    case ActionTypes.reducer.config.updateSports: {
      return {
        ...state,
        sports: action.payload,
      };
    }
    case ActionTypes.reducer.config.updateIsBrowse: {
      return {
        ...state,
        is_browse: action.payload,
      };
    }
    case ActionTypes.reducer.config.updateUserNameSocial: {
      return {
        ...state,
        is_set_username: action.payload,
      };
    }

    case ActionTypes.reducer.config.updateEmailVerify: {
      return {
        ...state,
        is_email_verify: action.payload,
      };
    }
    case ActionTypes.reducer.config.updateIsShowCollection: {
      return {
        ...state,
        is_show_card_detail_collection: action.payload
      }
    }
    case ActionTypes.reducer.config.updateIsShowTabBar: {
      return {
        ...state,
        is_show_tab_bar: action.payload
      }
    }
    case ActionTypes.reducer.config.updateNameCurrencies: {
      return {
        ...state,
        currency: action.payload
      }
    }
    default: {
      return state;
    }
  }
};

export default configReducer;
