import ApiDocumentApis from "api/api_document";
import { AllowedWebsite, APIKey } from "interfaces";
import { NewBaseResponse } from "model/base";
import { takeLatest, call, put } from "redux-saga/effects";
import { ApiDocumentActionType } from "redux/actions/api_doc_action";

///Get keys

function* getApiKey(action: any) {
  try {
    let response: NewBaseResponse<APIKey> = yield call(ApiDocumentApis.getKey);
    yield put(ApiDocumentActionType.saveApiKeys([response.data]));
  } catch (error) {
    console.log(error);
  }
}

export function* getApiKeySaga() {
  yield takeLatest(ApiDocumentActionType.sagasType.GET_API_KEY_DOCUMENT, getApiKey);
}


///Delete key api
function* deleteApiKey(action: any) {
  try {
    yield call(ApiDocumentApis.deleteKey, action.payload.id);
    yield put(ApiDocumentActionType.deleteKeyByIndex(action.payload.indexReducer));
  } catch (error) {
    console.log(error);
  }
}

export function* deleteApiKeySaga() {
  yield takeLatest(ApiDocumentActionType.sagasType.DELETE_API_KEY_DOCUMENT, deleteApiKey);
}


///Request a key api
function* requestApiKey(action: any) {
  try {
    let response: NewBaseResponse<APIKey> = yield call(ApiDocumentApis.requestKey, action.payload);
    yield put(ApiDocumentActionType.insertKeyApi(response.data));
  } catch (error) {
    console.log(error);
  }
}

export function* requestApiKeySaga() {
  yield takeLatest(ApiDocumentActionType.sagasType.REQUEST_API_KEY_DOCUMENT, requestApiKey);
}


///Add website 
function* addWebsite(action: any) {
  try {
    let response: NewBaseResponse<AllowedWebsite> = yield call(ApiDocumentApis.addWebsiteAllowed, action.payload);
    yield put(ApiDocumentActionType.insertWebSiteItem({indexApi: action.payload.indexApi, website: response.data}));
  } catch (error) {
    console.log(error);
  }
}

export function* addWebsiteSaga() {
  yield takeLatest(ApiDocumentActionType.sagasType.ADD_WEBSITE_ALLOWED, addWebsite);
}

///Delete website 
function* deleteWebsite(action: any) {
  try {
    yield call(ApiDocumentApis.deleteWebsiteAllowed, action.payload);
    yield put(ApiDocumentActionType.deleteWebSiteByIndex(action.payload));
  } catch (error) {
    console.log(error);
  }
}

export function* deleteWebsiteSaga() {
  yield takeLatest(ApiDocumentActionType.sagasType.DELETE_WEB_SITE, deleteWebsite);
}

