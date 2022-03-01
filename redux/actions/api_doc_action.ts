import { AllowedWebsite, APIKey } from "interfaces";

export class ApiDocumentActionType {
  /**Key dành cho sagas type */
  static readonly sagasType = {
    GET_API_KEY_DOCUMENT: "GET_API_KEY_DOCUMENT_SAGA",
    REQUEST_API_KEY_DOCUMENT: "REQUEST_API_KEY_DOCUMENT_SAGA",
    DELETE_API_KEY_DOCUMENT: "DELETE_API_KEY_DOCUMENT_SAGA",
    ADD_WEBSITE_ALLOWED: "ADD_WEBSITE_ALLOWED",
    DELETE_WEB_SITE: "DELETE_WEB_SITE",
  };

  /**Key dành cho reducer type */
  static readonly reducerType = {
    UPDATE_API_KEY_DOCUMENT: "UPDATE_API_KEY_DOCUMENT_REDUCER",
    DELETE_API_BY_INDEX: "DELETE_API_BY_INDEX",
    INSERT_KEY_API: "INSERT_KEY_API",
    INSERT_WEBSITE_ITEM: "INSERT_WEBSITE_ITEM",
    REMOVE_WEB_SITE_BY_INDEX: "REMOVE_WEB_SITE_BY_INDEX",
  };

  ///Handle saga

  static requestNewKey(apiName: string) {
    return { type: this.sagasType.REQUEST_API_KEY_DOCUMENT, payload: apiName };
  }

  static getApiKeys() {
    return { type: this.sagasType.GET_API_KEY_DOCUMENT };
  }

  static requestDelete(payload: { id: number; indexReducer: number }) {
    return { type: this.sagasType.DELETE_API_KEY_DOCUMENT, payload };
  }

  static addWebsiteAllowed(payload: {
    api_id: number;
    url: string;
    indexApi: number;
  }) {
    return { type: this.sagasType.ADD_WEBSITE_ALLOWED, payload };
  }

  static deleteWebsiteAllowed(payload: {
    api_id: number;
    web_id: number;
    indexWeb: number;
    indexApi: number;
  }) {
    return { type: this.sagasType.DELETE_WEB_SITE, payload };
  }

  ///Handle reducer
  static saveApiKeys(payload: APIKey[]) {
    return {
      type: this.reducerType.UPDATE_API_KEY_DOCUMENT,
      payload,
    };
  }

  static deleteKeyByIndex(index: number) {
    return {
      type: this.reducerType.DELETE_API_BY_INDEX,
      payload: index,
    };
  }

  static insertKeyApi(data: APIKey) {
    return {
      type: this.reducerType.INSERT_KEY_API,
      payload: data,
    };
  }

  static insertWebSiteItem(payload: {
    indexApi: number;
    website: AllowedWebsite;
  }) {
    return {
      type: this.reducerType.INSERT_WEBSITE_ITEM,
      payload,
    };
  }

  static deleteWebSiteByIndex(payload: {
    api_id: number;
    indexWeb: number;
    indexApi: number;
  }) {
    return {
      type: this.reducerType.REMOVE_WEB_SITE_BY_INDEX,
      payload,
    };
  }
}
