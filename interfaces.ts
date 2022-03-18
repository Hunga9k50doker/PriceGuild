import { Collection } from "model/portfolio/collection";
import { User } from "model/user";

export type BaseType = {
  id: number;
  name: string;
};

export interface IChooseCategory {
  category_id: number;
}

export interface ClaimPhotoReducerType {
  ids: Array<number>;
}
export interface ErrorMessage {
  error_code: string;
  message: string;
}

export type QueryResponse<T> = {
  data: T;
  code: number;
  message: string;
  success: boolean;
  rows?: number;
  error?: string;
  show_captcha?: boolean;
  null_price_tooltip?: string;
  status?:number
};

export type SportType = {
  id: number;
  sportName: string;
  publisherID?: number;
  name?: string;
  icon?: string;
};
export type SearchCriteriaType = {
  playerName?: string;
  sport?: number;
  set?: number;
  publisher?: number;
};

export type SmartSearchType = {
  text: string;
  search_criteria?: SearchCriteriaType;
  card_code?: string;
};

export type SearchType = {
  search_term: string;
  sport?: number;
};

export type SetType = {
  id: number;
  name: string;
};

export type ConvertType = {
  id: number;
  name: string;
  url?: string;
};
export type colorType = {
  code: string;
  name: string;
  url: string;
};
export type CardItemType = {
  id: number;
  cardID?: string;
  onCardCode: string;
  OnCardCode?: string;
  code: string;
  webName: string;
  maxPrice: number;
  minPrice: number;
  lastPrice: number;
  count: number;
  printRun: number;
  publisher: ConvertType;
  sport: SportType;
  set: ConvertType;
  year: number;
  type: ConvertType;
  color: colorType;
  firstname: string;
  lastname: string;
  avgPrice: number;
  imgArr: Array<string | null>;
  note?: string;
  ma28?: number;
  group_ref?: number;
  auto?: number;
  memo?: number;
  portfolio?: number;
  wishlist?: number;
  image?: string;
  cardFrontImage: any;
};

export type SortDictType = {
  sort_value?: string;
  sort_by?: string;
};

export type filterSearchCard = {
  publisher?: number;
  set?: number;
  year?: number;
  // printRun: {
  //   is_number: true;
  //   range: [100, null];
  // };
  sport?: number;
  auto?: number;
  memo?: number;
};

export type SearchCardType = {
  sport?: number;
  search_term?: string;
  search_criteria?: SearchCriteriaType;
  sort_dict?: SortDictType;
  page?: number;
  limit?: number;
  currency?: string;
  filter?: filterSearchCard;
  filter_dict?: [];
  group_ref?: number;
  port_userid?: number;
  portid_only?: boolean;
  table?: string;
  view_mode?: string;
};

/**
 * Reducer types
 */

export type AuthReducerType = {
  userInfo: User;
  loggingIn: boolean;
};

export type PopularType = {
  publisher: PublisherType;
  sports: Array<SportType>;
};

export type OptionCardBreakDown = {
  cardCode: string;
  webName: string;
  order: string;
  image: string;
}

export type HomeReducerType = {
  latestCollections: Array<Collection>;
  popularPublishers: Array<PopularType>;
  cardBreakDown: Array<OptionCardBreakDown>;
};

export type FilterType = {
  id: string | number;
  name: string;
  options?: Array<FilterType>;
  year?: number;
  publisherID?: number;
  typeID?: number;
  publisherName?: string;
  doc_count?: number;
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
export namespace FilterType {
  export function compare(pre: FilterType, next: FilterType): number {
    let firstLetterPre = pre.name.charCodeAt(0);
    let firstLetterNext = next.name.charCodeAt(0);

    if (
      firstLetterPre >= 49 &&
      firstLetterPre <= 57 &&
      firstLetterNext >= 49 &&
      firstLetterNext <= 57
    ) {
      return firstLetterPre > firstLetterNext
        ? 1
        : firstLetterPre < firstLetterNext
        ? -1
        : 0;
    }

    if (firstLetterPre >= 49 && firstLetterPre <= 57) {
      return 1;
    }

    if (firstLetterNext >= 49 && firstLetterNext <= 57) {
      return -1;
    }

    return String.fromCharCode(firstLetterPre)
      .toLowerCase()
      .localeCompare(String.fromCharCode(firstLetterNext).toLowerCase());
  }

  export function firstLetter(data: FilterType): string {
    return data.name[0] ?? "";
  }
}

export type FilterReducerType = {
  collections: DataGroupedSearch<FilterType>[];
  printRuns: Array<number>;
  publishers: DataGroupedSearch<FilterType>[];
  years: Array<FilterType>;
  auto_memo: Array<FilterType>;
  sports: Array<FilterType>;
  grades?: DataGroupedSearch<FilterType>[];
};

export type FriendReducerType = {
  friends: FriendType[];
  requests: FriendType[];
  requests_sent: FriendType[];
  blocked: FriendType[];
};

export type ConversationType = {
  createdAt: any;
  isView: boolean;
  message: string;
  user_uid_1: string | number;
  user_uid_2: string | number;
};
export type MessagesReducerType = {
  conversations?: GroupMessage[];
  users?: UserMessageType[];
};

export type ActionConversationType = {
  uid_1: string | number;
  uid_2: string | number;
};

export type UserMessageType = {
  thread_id: number;
  user_id: number;
  username: string;
  full_name: string;
  sent_user_id: number;
  body: string;
  updated_at: string;
  last_read: string;
};

export type CompareReducerType = {
  cards: CardCompareType[];
};

export type ConfigReducerType = {
  currencies: Array<SelectDefultType>;
  sports: SportType[];
  is_browse: Boolean;
  is_set_username: Boolean;
  is_email_verify: Boolean;
  is_show_card_detail_collection: Boolean;
  is_show_tab_bar: Boolean;
};

export type PublisherType = {
  id: number;
  name: string;
  image?: string;
};

export type FilterResponseType = {
  auto_memo: Array<FilterType>;
  collections: Array<FilterType>;
  printRuns: Array<number>;
  publishers: Array<FilterType>;
  years: Array<number> | Array<any>;
  sports: Array<FilterType>;
  grades?: Array<GradeType>;
};

export type GradeType = {
  grade_company: string;
  data: DatumGrade[];
};

export type DatumGrade = {
  grade_value: number;
  grade_company: string;
  display_value: string;
};

export type DataGroupedSearch<T> = {
  id: string;
  name: string;
  options: T[];
  totalLenPre: number;
};

export type FilyerCollection = {
  type: Array<FilterType>;
  color: Array<FilterType>;
};

export type filterDataType = {
  name: string;
  key: string;
};

export type CardTop100Type = {
  cardID: string;
  code: string;
  sport: string;
  webName: string;
  count: string;
  OnCardCode: string;
  maxPrice: number;
  minPrice: number;
  lastPrice: number;
  printRun: number;
  publisher: string;
  set: string;
  year: number;
  type: string;
  color: string;
};

export type CardCollectionType = {
  id: number;
  cardCode: string;
  printRun: string;
  onCardCode: string;
  minPrice: number;
  maxPrice: number;
  typeID: number;
  colorID: number;
  Name: string;
  average: number;
  count: number;
  type_id: number;
  typeName: string;
  auto: number;
  memo: number;
  wishlist?: number;
  portfolio?: number;
  image?: string;
  sport: string;
};

export type CollectionType = {
  id?: number;
  name?: string;
  release_date?: string;
  sport?: SportType;
  publisher?: PublisherType;
  year?: number;
  total_types?: number;
  total_cards?: number;
  auto_memo?: AutoMemo[];
  type?: string;
  color?: string;
  cards?: CardCollectionType[];
  blurhash?: string;
  image?: string;
  isLoading: boolean;
  rows?: number;
  url?: string;
  title?: string
};

export type AutoMemo = {
  index: number;
  name: string;
  types: Type[];
};

export type Type = {
  name: string;
  total_cards: number;
  colors: Color[];
  id: number;
};

export type Color = {
  colorCode: string;
  colorName: string;
  url: string;
};

export type SalesOverviewType = {
  id: number;
  cardCode: string;
  cardName: string;
  onCardCode: string;
  maxSales: number;
  tradeVol: number;
  auto: number;
  memo: number;
  sportName: string;
  setYear: string;
  year: string;
  publisherName: string;
  image?: string
};

export type LeaderboardType = {
  userid: number;
  username: string;
  total_value: number;
  total_upload: number;
  rank: number;
};

export type TopElementType = {
  id: number;
  cardCode: string;
  cardName: string;
  onCardCode: string;
  publisherID: number;
  publisher: string;
  year: number;
  maxSales: number;
  tradeVol: number;
  webName: string;
  code: string;
  memo: boolean;
  auto: boolean;
  wishlist?: number;
  portfolio?: number;
  rank: number;
  sport?: string;
  image?: string;
};

export type PgAppProfileType = {
  user_info: UserInfoType;
  user_points: number;
  portfolio_data: DatumType[];
  wishlist_data: DatumType[];
  favorite_card: FavoriteCardType;
  is_friend: boolean;
  total_value?: number;
  upload_count?: number;
  error_count?: number;
  total_value_message?: string
};

export type FavoriteCardType = {
  favorite_card_name: string;
  favorite_card_front: string;
  favorite_card_back: string;
};

export type DatumType = {
  group_ref: number;
  group_name: string;
  type: number;
  cardCode_unqiue: number;
  cardCode_total: number;
};

export type UserInfoType = {
  username: string;
  member_since: Date;
  bio: string;
  avatar: string;
  location: string;
  default_sport: number;
  email: string;
  timezone?: string;
  newsLetter: number;
  full_name: string;
  confidentiality: number;
  user_default_sport?: number;
};

export type SelectDefultType = {
  value: any;
  label: string;
  sort_value?: any;
  sort_by?: any;
};

export type ManageCollectionType = {
  group_ref?: number;
  group_name: string;
  type?: number;
  unique_card?: number;
  total_card?: number;
  id?: number;
  claim?: number;
};

type GradeValueType = { id: number; value: number; display_value: string };

export type GradeCompanyType = {
  id: number;
  name: string;
  name_full: string;
  color_1: string;
  color_2: string;
  values: GradeValueType[];
};

export type CardsAddType = {
  cards?: Card[];
  groups?: ManageCollectionType[];
};

export type Card = {
  card_id: string;
  web_name?: string;
  data: Datum[];
  publisher?: string,
  sport?: string,
  year?: number,
  auto?: number,
  memo?: number,
};

export type ImageUploadCard = {
  front?: string;
  back?: string;
};

export type ImageType = {
  url: string;
};

export type Datum = {
  cardid?: string;
  portid?: number;
  user_price: number;
  quantity: number;
  grade_company: any;
  grade_value: number;
  user_currency: string;
  date_acq: Date | string;
  note: string;
  group_ref: number | any;
  front_image?: string;
  back_image?: string;
  group_name?: string;
  port_id?: number;
  image_upload: ImageUploadCard;
} & { [key: string]: any };

export type CountType = {
  count_non_duplicate_cards: number;
  count_cards: number;
  count_entries: number;
};

export interface StatsAnalytics {
  avg: number, 
  last: number, 
  max: number, 
  min: number, 
  year: number
}

export type AnalyticsType = {
  data: { [key: string]: number };
  number_of_cards: number;
  number_of_non_zero_cards: number;
  widget_settings: WidgetSettings;
  stats?: StatsAnalytics[];
  chart_data: { [key: string]: { [key: string]: number } };
};
export type FriendType = {
  id: number;
  username: string;
  full_name: string;
};

export type WidgetSettings = {
  type: string;
  lv1: string;
  lv2: string;
  data: string;
  user_pp: string;
  moving_av: string;
  id: number;
  position: number;
  filter?: string
};

export type CardCompareType = {
  code: string;
  lastname: string;
  firstname: string;
};

//Messages
export interface IMessage {
  isView: boolean;
  message: string;
  user_uid_1: number;
  user_uid_2: number;
  date: Date;
}

export interface GroupMessage {
  messages: IMessage[];
  date: Date;
}

/// Api Document
export interface ApiDocumentReducerType {
  keyList: APIKey[];
}

export interface APIKey {
  id: number;
  api_key: string;
  api_secret: string | null;
  name: string;
  verified: number;
  allowed_websites: AllowedWebsite[];
  embedded: number;
  embedded_counter: number;
}

export interface AllowedWebsite {
  id: number;
  api_key_id: number;
  allowed_website: string;
}
export interface RookieCardType {
  id: number;
  playername: string;
  introtext: string;
  sport_id: number;
  sport_name: string;
  cards: RookieItem[];
}

export interface RookieItem {
  card_code: string;
  card_description: string;
  cardid: number;
  nameForWeb: string;
  minPrice: number;
  maxPrice: number;
  onCardCode: string;
  setName: string;
  publisherName: string;
  typeName: string;
  setYear: number;
}

export type GlossaryResponseType = {
  glossaries: GlossaryType[];
  categories: string[];
};

export type GlossaryType = {
  category: string;
  glossary: GlossaryItemType[];
};

export type GlossaryItemType = {
  id: number;
  title: string;
  description: string;
};

export interface ColorSchemeGrade {
  id: number;
  name: string;
  name_full: string;
  color_1: string;
  color_2: string;
}

export interface IndexAverage {
  latestValue: number;
  lowestValue: number;
  highestValue: number;
  averageValue: number;
  totalTrades: number;
  change: number;
}

export interface GradePair {
  gradeCompany: string | 'RAW' | 'Graded' | 'ALL';
  gradeValue: string | number | 'ALL';
}
export interface BlogData {
  id: number;
  title: string;
  alias: string;
  introtext: string;
  created: string;
  metadesc: string;
  created_by: string;
  ordering: string;
  sport: string;
}
