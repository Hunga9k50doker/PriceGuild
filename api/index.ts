import constant from "utils/constant";
import { MyStorage } from "helper/local_storage";
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  ResponseType,
} from "axios";
import { AuthenticationApi } from "api/authentication";
import {
  QueryResponse,
  SportType,
  SmartSearchType,
  SearchType,
  LeaderboardType,
  SearchCardType,
  PopularType,
  FilyerCollection,
  FilterType,
  CollectionType,
  SalesOverviewType,
  TopElementType,
  PgAppProfileType,
  ManageCollectionType,
  GradeCompanyType,
  FilterResponseType,
  CardsAddType,
  CountType,
  AnalyticsType,
  UserMessageType,
  FriendType,
  GlossaryResponseType,
} from "interfaces";
import { CardModel } from "model/data_sport/card_sport";
import { BaseResponse } from "model/base";
import CapchaListener from "helper/hcapcha_system";

export type QueryParamsType = Record<string | number, any>;

type UserPortfolioData = {
  card_data: CardModel[];
  filter: FilterResponseType;
  counts: CountType;
  group_name?: string;
  group_type?: number;
};

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  secure?: boolean;
  path: string;
  type?: ContentType;
  query?: QueryParamsType;
  format?: ResponseType;
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;

  private securityData: SecurityDataType | null = null;

  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];

  private secure?: boolean;

  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL,
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  private mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig
  ): AxiosRequestConfig {
    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.instance.defaults.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  public request = async <T = any>({
    secure = true, // Auth Token
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<QueryResponse<T>>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = (format && this.format) || void 0;
    
    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      requestParams.headers.common = { Accept: "*/*" };
      requestParams.headers.post = {};
      requestParams.headers.put = {};
      const formData = new FormData();
      for (const key in body) {
        formData.append(key, body[key as keyof typeof body]);
      }
      body = formData;
    }
    this.instance.interceptors.response.use(
      (response) => {
        return Promise.resolve(response);
      },
      
      async (error) => {
        if (error?.response?.status === 401) {
          MyStorage.resetWhenLogout();
          sessionStorage.setItem(
            "redirect",
            `${window.location?.pathname}${window.location?.search}`
          );
          window.location.href = "/login";
          return Promise.reject();
        }
        if (error?.response?.status === 503) {
          if (window.location.pathname === "/maintenance") return;
          
          window.location.href = "/maintenance";
          return Promise.reject();
        }
        if (error?.response?.status === 404) {
          window.location.href = "/404";
          return Promise.reject();
        }
        return Promise.reject(error);
      }
    );
    return this.instance.request({
      ...requestParams,
      headers: {
        ...(type && type !== ContentType.FormData
          ? { "Content-Type": type }
          : {}),
        ...(requestParams.headers || {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
      httpsAgent: new (require("https").Agent)({
        rejectUnauthorized: false,
      }),
    });
  };
}

export class Api<
  SecurityDataType extends unknown
  > extends HttpClient<SecurityDataType> {
  v1 = {
    authorization: {
      getUserInfo: async (body: any) => {
        const result = await this.request<PgAppProfileType>({
          path: "profile/pg_app_profile",
          method: "POST",
          body,
        });
        return result.data;
      },
      updateProfile: async (body: any) => {
        const result = await this.request<{ [key: string]: any }>({
          path: "profile/settings/update",
          method: "patch",
          body,
        });
        return result.data;
      },
      updateAvatar: async (body: any) => {
        const result = await this.request({
          path: "profile/pg_app_upload_image_profile",
          method: "POST",
          body,
        });
        return result.data;
      },
      updateConfidentiality: async (confidentiality: number) => {
        const result = await this.request({
          path: "profile/confidentiality/update",
          method: "PATCH",
          body: { confidentiality },
        });
        return result.data;
      },
      changePassword: async (body: any) => {
        const result = await this.request({
          path: "/change-password",
          method: "PUT",
          body,
        });
        return result.data;
      },
      socialLogin: async (body: any) => {
        const result = await this.request<AuthenticationApi.LoginResponse>({
          path: "/account/social-login",
          method: "POST",
          body,
        });
        return result.data;
      },
      twitchLogin: async (body: any) => {
        const result = await this.request({
          path: "/account/twitch-login",
          method: "POST",
          body,
        });
        return result.data;
      },
      checkUsername: async (body: any) => {
        const result = await this.request({
          path: "/account/check-username",
          method: "POST",
          body,
        });
        return result.data;
      },
      pg_profile_setting: async (body: any) => {
        const result = await this.request({
          path: "/profile/pg_app_profile_settings",
          method: "POST",
          body,
        });
        return result.data;
      }
    },
    account: {
      deleteAccount: async (body: any) => {
        const result = await this.request({
          path: "/account/delete",
          method: "patch",
          body,
        });
        return result.data;
      },
      forgotPassword: async (body: any) => {
        const result = await this.request({
          path: "/account/forgot-password",
          method: "POST",
          body,
        });
        return result.data;
      },
      resetPassword: async (body: any) => {
        const result = await this.request({
          path: "/account/reset-password",
          method: "patch",
          body,
        });
        return result.data;
      },
      setUserName: async (body: any) => {
        const result = await this.request({
          path: "/account/set-username",
          method: "post",
          body,
        });
        return result.data;
      },
      setActiveAccount: async (body: any) => {
        const result = await this.request({
          path: "/account/pg_app_resend_activation_account",
          method: "post",
          body,
        });
        return result.data;
      },
      restoreAcounnt: async (body: any) => {
        const result = await this.request({
          path: "/account/restore",
          method: "patch",
          body,
        });
        return result.data;
      },
      unSubcribeAcounnt: async (body: any) => {
        const result = await this.request({
          path: "/account/unsubscribe",
          method: "patch",
          body,
        });
        return result.data;
      },
    },
    getListSport: async () => {
      const result = await this.request<SportType[]>({
        path: constant.api.get_sport,
        method: "GET",
      });
      return result.data;
    },
    elasticSearch: {
      searchAutoComplete: async (body: SearchType) => {
        const result = await this.request<SmartSearchType[]>({
          path: constant.api.search_auto_complete,
          method: "POST",
          body,
        });
        return result.data;
      },
      searchCard: async (body: SearchCardType, headers: any= {}) => {
        const result = await this.request<CardModel[]>({
          path: constant.api.search_card,
          method: "POST",
          body,
          headers
        });
        return result.data;
      },
    },
    getTopTradingCard: async (body: any) => {
      const result = await this.request<TopElementType[]>({
        path: constant.api.pg_app_top_sale,
        method: "POST",
        body,
      });
      return result.data;
    },
    getDataFAQ: async () => {
      const result = await this.request({
        path: "faq/list",
        method: "GET",
      });
      return result.data;
    },
    getPopularPublisher: async (body: any = {}) => {
      const result = await this.request<PopularType[]>({
        path: "publishers/popular",
        method: "POST",
        body,
      });
      return result.data;
    },
    getFilterCollection: async (body: any) => {
      const result = await this.request<FilyerCollection>({
        path: "search/pg_app_data_2nd_single_collection",
        method: "POST",
        body,
      });
      return result.data;
    },
    getFilterPublisher: async (query: any) => {
      const result = await this.request<FilterType[]>({
        path: "cards/publishers",
        method: "GET",
        query,
      });
      return result.data;
    },
    gradeCompany: {
      getList: async (body: any) => {
        const result = await this.request<GradeCompanyType[]>({
          path: "grade-company/list",
          method: "POST",
          body,
        });
        return result.data;
      },
    },
    collection: {
      getDetail: async (body: any, headers: any = {}) => {
        const result = await this.request<any>({
          path: "collections/detail",
          method: "POST",
          body,
          headers
        });
        return result.data;
      },
      
      checkList: async (body: any, headers: any = {}) => {
        const result = await this.request<any>({
          path: "collections/checklist",
          method: "POST",
          body,
          headers
        });
        return result.data;
      },
      

      getSalesOverview: async (body: any) => {
        const result = await this.request<SalesOverviewType[]>({
          path: "collections/sales-overview",
          method: "POST",
          body,
        });
        return result.data;
      },
      getManageCollections: async (body: any) => {
        const result = await this.request<ManageCollectionType[]>({
          path: "manage_collections/pg_app_get_manage_collections_or_wishlist_data",
          method: "POST",
          body,
        });
        return result.data;
      },
      createCollection: async (body: any) => {
        const result = await this.request({
          path: "manage_collections/pg_app_create_new_collection_v2",
          method: "POST",
          body,
        });
        return result.data;
      },
      removeCollection: async (body: any) => {
        const result = await this.request({
          path: "manage_collections/pg_app_delete_existing_collection",
          method: "DELETE",
          body,
        });
        return result.data;
      },
      claimPhotosCollection: async (body: any) => {
        const result = await this.request({
          path: "/manage_collections/pg_app_claim_photos_in_collection",
          method: "POST",
          body,
        });
        return result.data;
      },
      editCollection: async (body: any) => {
        const result = await this.request({
          path: "manage_collections/pg_app_edit_existing_collection",
          method: "PUT",
          body,
        });
        return result.data;
      },
    },
    config: {
      getCurrencies: async () => {
        const result = await this.request<string[]>({
          path: "/xrate/currencies",
          method: "GET",
        });
        return result.data;
      },
    },
    portfolio: {
      existingSavedCards: async (body: any) => {
        const result = await this.request<CardsAddType>({
          path: "/portfolio/pg_app_get_existing_saved_cards",
          method: "POST",
          body,
        });
        return result.data;
      },
      saveCards: async (body: any) => {
        const result = await this.request({
          path: "/portfolio/pg_app_save_cards",
          method: "POST",
          body,
        });
        return result.data;
      },
      uploadImage: async (body: any) => {
        const result = await this.request<{ path: string }>({
          path: "/portfolio/pg_app_upload_image_portfolio_v2",
          method: "POST",
          body,
        });
        return result.data;
      },
      getUserPortfolio: async (body: any) => {
        const result = await this.request<UserPortfolioData>({
          path: "/portfolio/pg_app_get_user_portfolio_data",
          method: "POST",
          body,
        });
        return result.data;
      },
      updateNotePortfolio: async (body: any) => {
        const result = await this.request<UserPortfolioData>({
          path: "/portfolio/pg_app_update_card_note",
          method: "POST",
          body,
        });
        return result.data;
      },
      deleteCardsPortfolio: async (body: any) => {
        const result = await this.request({
          path: "/portfolio/pg_app_delete_cards",
          method: "delete",
          body,
        });
        return result.data;
      },
      moveCardsPortfolio: async (body: any) => {
        const result = await this.request({
          path: "/portfolio/pg_app_move_card",
          method: "patch",
          body,
        });
        return result.data;
      },
      portfolioLeaderboard: async (body: any) => {
        const result = await this.request<LeaderboardType[]>({
          path: "/portfolio/pg_app_portfolio_leaderboard",
          method: "POST",
          body,
        });
        let data  = {... result.data };
        if(result.status === 202) {
          (data as any).status = 202;
        }
        return data;
      },
      pg_app_portfolio_export_generate: async (body: any) => {
        const result = await this.request<any>({
          path: "/portfolio/pg_app_portfolio_export_generate",
          method: "POST",
          body,
        });
        return result.data;
      },
    },
    analytics: {
      analyticsGetWidgetData: async (body: any) => {
        const result = await this.request({
          path: "/analytics/pg_app_analytics_get_widget_data",
          method: "POST",
          body,
        });
        return result.data;
      },

      analyticsAddWidget: async (body: any) => {
        const result = await this.request<AnalyticsType[]>({
          path: "/analytics/pg_app_analytics_add_widget",
          method: "POST",
          body,
        });
        return result.data;
      },

      analyticsUpdateWidget: async (body: any) => {
        const result = await this.request<AnalyticsType[]>({
          path: "/analytics/pg_app_analytics_update_widget_settings",
          method: "POST",
          body,
        });
        return result.data;
      },

      analyticsDeleteWidget: async (body: any) => {
        const result = await this.request<AnalyticsType[]>({
          path: "/analytics/pg_app_analytics_delete_widget",
          method: "POST",
          body,
        });
        return result.data;
      },
    },
    friends: {
      searchFriends: async (body: any) => {
        const result = await this.request<FriendType[]>({
          path: "/friends/pg_app_search_users",
          method: "POST",
          body,
        });
        return result.data;
      },
      getFriends: async (body: any) => {
        const result = await this.request<FriendType[]>({
          path: "/friends/pg_app_get_friend_list",
          method: "POST",
          body,
        });
        return result.data;
      },
      friendActions: async (body: any) => {
        const result = await this.request({
          path: "/friends/pg_app_friend_actions",
          method: "POST",
          body,
        });
        return result.data;
      },
    },
    messages: {
      messagesLoadInboxAndSent: async () => {
        const result = await this.request<UserMessageType[]>({
          path: "/messages/pg_app_messages_load_inbox_and_sent",
          method: "GET",
        });
        return result.data;
      },
      messagesStartNewThread: async (body: any) => {
        const result = await this.request<UserMessageType>({
          path: "/messages/pg_app_messages_start_new_thread",
          method: "POST",
          body,
        });
        return result.data;
      },
      messagesReplyInThread: async (body: any) => {
        const result = await this.request({
          path: "/messages/pg_app_messages_reply_in_thread",
          method: "POST",
          body,
        });
        return result.data;
      },
      removeThread: async (body: any) => {
        const result = await this.request({
          path: "/messages/pg_app_messages_delete_thread",
          method: "DELETE",
          body,
        });
        return result.data;
      },
    },
    blogs: {
      getListRookieCard: async (body: any) => {
        const result = await this.request({
          path: "/blogs/rookie-cards",
          method: "POST",
          body,
        });
        return result.data;
      },
      getblogList: async (body: any) => {
        const result = await this.request({
          path: "/blog/list",
          method: "POST",
          body,
        });
        return result.data;
      },
      getBlogDetail: async (body: any) => {
        const result = await this.request({
          path: "/blog/detail",
          method: "POST",
          body,
        });

        return result.data;
      }
    },
    glossary: {
      getListGlossary: async (body: any) => {
        const result = await this.request<GlossaryResponseType>({
          path: "/glossary/list",
          method: "POST",
          body,
        });
        return result.data;
      },
    },
    embedded: {
      requestRaiseLimit: async (body: any) => {
        const result = await this.request({
          path: "/embedded/request-raise-limit",
          method: "POST",
          body,
        });
        return result.data;
      },
      setPermission: async (body: any) => {
        const result = await this.request({
          path: "/embedded/set-permission",
          method: "POST",
          body,
        });
        return result.data;
      },
    },
    communal_images: {
      uploadImageCommunalv2: async (body: any) => {
        const result = await this.request({
          path: "/communal_images/pg_app_upload_image_communal_v2",
          method: "POST",
          body,
        });
        return result.data;
      },
      saveImageCommunal: async (body: any) => {
        const result = await this.request({
          path: "/communal_images/pg_app_save_image_communal",
          method: "POST",
          body,
        });
        return result.data;
      },
    },
    collectors_catalog: {
      pg_app_collectors_catalog: async (body: any) =>  {
        const result = await this.request({
          path: "/collectors_catalog/pg_app_collectors_catalog",
          method: "POST",
          body,
        });
        return result.data;
      }
    },
    card_detail: {
      reportCard: async (body: any) =>  {
        const result = await this.request({
          path: "/card_details/pg_app_user_submitted_error_report",
          method: "POST",
          body,
        });
        return result.data;
      }
    },
    other_API: {
      contact_us: async (body: any, headers: any = {}) => {
        const result = await this.request({
          path: "/contact-us",
          method: "POST",
          body,
          headers
        });
        return result.data;
      }
    },
    cards_break_down: {
      cardBreakDown: async (body: any) => {
        const result = await this.request({
          path: "/cards/breakdown",
          method: "POST",
          body,
        });
        return result.data;
      }
    },
    card_detail_home: {
      cardDetail: async (body: any) => {
        const result = await this.request({
          path: "/card_details/pg_app_card_detail",
          method: "POST",
          body,
        });
        return result.data;
      }
    },
    mc_line_home_fuature: {
      getCalcMaLineFuature: async (body: any) => {
        const result = await this.request({
          path: "/card_details/pg_app_calc_ma_line_featured",
          method: "POST",
          body,
        });
        return result.data;
      }
    }




    // image: {
    //   uploadImage: async (body: any) => {
    //     const result = await this.request<{ path: string }>({
    //       path: "/portfolio/pg_app_get_existing_saved_cards",
    //       method: "POST",
    //       body,
    //     });
    //     return result.data;
    //   },
    // },
  };
}
