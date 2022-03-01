import {
  AuthReducerType,
  HomeReducerType,
  IChooseCategory,
  FilterReducerType,
  ConfigReducerType,
  MessagesReducerType,
  CompareReducerType,
  FriendReducerType,
  ApiDocumentReducerType,
  ClaimPhotoReducerType,
} from "interfaces";
import { combineReducers } from "redux";
import categoryReducer from "redux/reducers/category";
import authReducer from "./auth";
import homeReducer from "./home";
import FilterReducer from "./filter";
import configReducer from "./config";
import messageReducer from "./message";
import compareReducer from "./compare";
import friendReducer from "./friend";
import apiDocumentReducer from "./api_document";
import claimPhotoReducer from "./claimPhoto";
export interface ReducerType {
  auth: AuthReducerType;
  category: IChooseCategory;
  home: HomeReducerType;
  filter: FilterReducerType;
  config: ConfigReducerType;
  message: MessagesReducerType;
  compare: CompareReducerType;
  friend: FriendReducerType;
  apiDocumentReducer: ApiDocumentReducerType;
  claimPhoto: ClaimPhotoReducerType;
}

const reducers = combineReducers<ReducerType>({
  category: categoryReducer,
  auth: authReducer,
  home: homeReducer,
  filter: FilterReducer,
  config: configReducer,
  message: messageReducer,
  compare: compareReducer,
  friend: friendReducer,
  apiDocumentReducer: apiDocumentReducer,
  claimPhoto: claimPhotoReducer,
});

const createRootReducer = (state: any, action: any) => {
  return reducers(state, action);
};

export default createRootReducer;
