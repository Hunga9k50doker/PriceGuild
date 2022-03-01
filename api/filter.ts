import { NewHttpClient } from "./axiosClients";
import { FilterResponseType, SearchCardType } from "interfaces";
export class FilterApi {
  static getFilter(body: SearchCardType) {
    return new NewHttpClient<FilterResponse>({
      route: "/elastic-search/get-filter-data",
    }).post(body);
  }
}

export interface FilterResponse {
  data: FilterResponseType;
}
