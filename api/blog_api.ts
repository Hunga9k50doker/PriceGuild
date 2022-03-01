import { NewHttpClient } from "./axiosClients";
import { RookieCardType } from 'interfaces';
import { NewBaseResponse } from "model/base";

export default class BlogsApis {
  static getRookieDetail(blog_id: number) {
    return new NewHttpClient<NewBaseResponse<RookieCardType>>({route: '/blogs/rookie-cards/detail'}).post({blog_id});
  }
}