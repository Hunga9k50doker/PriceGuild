import { ReducerType } from "redux/reducers";

export default class Selectors {
  static auth = (state: ReducerType) => state.auth;
  static home = (state: ReducerType) => state.home;
  static category = (state: ReducerType) => state.category;
  static filter = (state: ReducerType) => state.filter;
  static config = (state: ReducerType) => state.config;
  static message = (state: ReducerType) => state.message;
  static compare = (state: ReducerType) => state.compare;
  static friend = (state: ReducerType) => state.friend;
  static apiDocument = (state: ReducerType) => state.apiDocumentReducer;
  static claimPhoto = (state: ReducerType) => state.claimPhoto;
}
