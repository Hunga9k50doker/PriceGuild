import { NewHttpClient } from "./axiosClients";
import { AllowedWebsite, APIKey } from 'interfaces';
import { NewBaseResponse } from "model/base";

export default class ApiDocumentApis {
  static getKey() {
    return new NewHttpClient<NewBaseResponse<APIKey>>({route: '/embedded/api-key'}).get();
  }

  static requestKey(apiName: string) {
    return new NewHttpClient<NewBaseResponse<APIKey>>({route: '/embedded/api-key/request'}).post({'api_name': apiName});
  }

  static deleteKey(id: number) {
    return new NewHttpClient({route: '/embedded/api-key/delete'}).delete({api_id: id});
  }

  static addWebsiteAllowed(data: {
    api_id: number;
    url: string;
  }) {
    return new NewHttpClient<NewBaseResponse<AllowedWebsite>>({ route: '/embedded/api-key/allowed-webiste/add' }).post(data);
  }

  static deleteWebsiteAllowed(data: {
    api_id: number;
    web_id: number;
  }) {
    return new NewHttpClient({ route: 'embedded/api-key/allowed-webiste/delete' }).delete(data);
  }
}