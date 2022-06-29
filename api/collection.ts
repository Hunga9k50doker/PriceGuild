import { NewHttpClient } from "./axiosClients";

import { Collection } from "model/collections/collection";

export class CollectionApi {
  static getCollection(body: CollectionParam) {
    return new NewHttpClient<CollectionResponse>({
      route: "/collections/list",
    }).post(body);
  }

  //**Detail page */
  static getMoreCollection(body: any) {
    return new NewHttpClient<MoreCollectionResponse>({
      route: "/card_details/pg_app_more_from_collection",
    }).post(body);
  }
}

/**Post data collection */
export enum CollectionType {
  lastest = "lastest",
  all = "all",
}
export interface CollectionParam {
  limit: number;
  is_newest?: boolean;
  filter?: { [key: string]: string | number };
  page?: number;
  sport?: number;
}

export interface MoreCollectionParam {
  search_criteria: { set: number };
  page: number;
  limit: number;
  currency: string;
}

export interface DataType {
  collections: Array<Collection>;
  years: Array<number>;
  name?: string;
  filter_collections: Array<string>;
  filter_publishers: Array<string>;
}

export interface CollectionResponse {
  data: DataType;
  rows?: number;
}

export interface MoreCollectionResponse {
  success: boolean;
  rows: number;
  page: number;
  limit: number;
  data: { [key: string]: any }[];
}
