import { NewHttpClient } from "./axiosClients";

export class SearchApis {
  static reportCantFindCard(body: any) {
    return new NewHttpClient({
      route: "/search/pg_app_cant_find_a_card",
    }).post(body);
  }
}
