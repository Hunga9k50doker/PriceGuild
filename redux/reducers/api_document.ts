import { ApiDocumentReducerType } from "interfaces";
import { ApiDocumentActionType } from "redux/actions/api_doc_action";

const initState: ApiDocumentReducerType = {
  keyList: [],
};

const apiDocumentReducer = (
  state = initState,
  action: any
): ApiDocumentReducerType => {
  switch (action.type) {
    case ApiDocumentActionType.reducerType.UPDATE_API_KEY_DOCUMENT: {
      return { ...state, keyList: action.payload };
    }

    case ApiDocumentActionType.reducerType.DELETE_API_BY_INDEX: {
      state.keyList.splice(action.payload);
      return { ...state, keyList: [...state.keyList] };
    }

    case ApiDocumentActionType.reducerType.INSERT_KEY_API: {
      return { ...state, keyList: [...state.keyList, action.payload] };
    }
      
    case ApiDocumentActionType.reducerType.INSERT_WEBSITE_ITEM: {
      state.keyList[action.payload.indexApi].allowed_websites.push(action.payload.website);
      return { ...state, keyList: [...state.keyList] };
    }
      
    case ApiDocumentActionType.reducerType.REMOVE_WEB_SITE_BY_INDEX: {
      state.keyList[action.payload.indexApi].allowed_websites.splice(action.payload.indexWeb);
      return {...state}
    }
    default:
      return state;
  }
};

export default apiDocumentReducer;
