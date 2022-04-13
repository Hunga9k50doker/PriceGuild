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
  MaintenanceReducerType
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
import maintenanceReducer from "./maintenance";
import searchfilterReducer from './search_filter';
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
  maintenance: MaintenanceReducerType;
  searchFilter: any;
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
  maintenance: maintenanceReducer,
  searchFilter: searchfilterReducer,
});

const createRootReducer = (state: any, action: any) => {
  return reducers(state, action);
};

export default createRootReducer;
