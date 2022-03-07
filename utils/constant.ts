import { BaseType } from "interfaces";

const constant = {
  api: {
    get_category: "/category",
    get_sport: "cards/sports",
    search_auto_complete: "elastic-search/search/auto-complete",
    search_card: "elastic-search/search",
    pg_app_top_sale: "top_100/top-sale-trade",
  },
  // route: {
  //   home: process.env.REACT_APP_BASE_URL,
  //   login: process.env.REACT_APP_BASE_URL + "/login",
  // },
};

export class RegexString {
  static email = /[a-z][a-z0-9_.]{3,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}/;
  static emailRegister = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  static username = /^[a-zA-Z0-9_-]*$/;
  static password = /\w{6,20}/;
  static textNone = /\w/;
  static number = /(([-]?[0-9]+.?[0-9]+)|([-]?[0-9]))?/;
  static integer = /[-]?[0-9]+/;
  static numType = /^([0-9]+.[0-9])|([0-9])+$/;
  static userOrEmail =
    /^(?:[A-Z\d][A-Z\d_-]{1,100}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6})$/i;
  static trimWhiteSpace = /[A-Za-z0-9\s.,]+/;
}

export default constant;

export class MetaData {
  static listTimePeriod: BaseType[] = [
    { id: 1, name: "1 Day" },
    { id: 7, name: "7 Day" },
    { id: 14, name: "14 Day" },
    { id: 28, name: "28 Day" },
    { id: 60, name: "60 Day" },
    { id: 90, name: "90 Day" },
    { id: 365, name: "365 Day" },
  ];

  static friend_actions = {
    accept_friend_request: "accept_friend_request",
    delete_friend: "delete_friend",
    block_user: "block_user",
    unblock_user: "unblock_user",
    request_friend: "request_friend",
    reject_friend_request: "reject_friend_request",
  };

  static printRun: BaseType[] = [
    { id: 1, name: "Numbered" },
    { id: 2, name: "Unnumbered" },
    { id: 3, name: "1" },
    { id: 4, name: "2-24" },
    { id: 5, name: "25-99" },
    { id: 6, name: "100-299" },
    { id: 7, name: "299+" },
  ];
  static auto_memo: BaseType[] = [
    { id: 2, name: "Autograph & Memorabilia" },
    { id: 3, name: "Autograph" },
    { id: 4, name: "Memorabilia" },
    { id: 1, name: "Non Auto or Memo" },
  ];

  static sort_list = [
    { value: true, label: "Newest" },
    { value: false, label: "Latest" },
  ];
  static sort_card_in_profile = [
    {
      value: 1,
      label: "Latest Price smallest to largest",
      sort_value: "latest_price",
      sort_by: "asc",
    },
    {
      value: 2,
      label: "Latest Price largest to smallest",
      sort_value: "latest_price",
      sort_by: "desc",
    },
    {
      value: 3,
      label: "Average Price smallest to largest",
      sort_value: "average_price",
      sort_by: "asc",
    },
    {
      value: 4,
      label: "Average Price largest to smallest",
      sort_value: "average_price",
      sort_by: "desc",
    },
  ];

  static sort_card_list = [
    {
      value: 1,
      label: "Most Popular",
      sort_value: "count",
      sort_by: "desc",
    },
    {
      value: 2,
      label: "Most Trending",
      sort_value: "count_30",
      sort_by: "desc",
    },
    {
      value: 3,
      label: "Max Price - Low to High",
      sort_value: "maxPrice",
      sort_by: "asc",
    },
    {
      value: 4,
      label: "Max Price - High to Low",
      sort_value: "maxPrice",
      sort_by: "desc",
    },
    {
      value: 5,
      label: "Average Price - Low to High",
      sort_value: "price",
      sort_by: "asc",
    },
    {
      value: 6,
      label: "Average Price - High to Low",
      sort_value: "price",
      sort_by: "desc",
    },
  ];
  static analyzeDataType = [
    { value: "total", label: "Number of Cards" },
    { value: "totalUni", label: "Number of Non-duplicate Cards" },
    { value: "average", label: "Average Value" },
    { value: "total_value", label: "Total Value" },
  ];

  static groupedBy = [
    { value: 1, label: "Year" },
    { value: 2, label: "Publisher" },
    { value: 3, label: "Collection" },
    { value: 4, label: "Sport" },
    { value: 5, label: "Player Name" },
  ];

  static yesNo = [
    { value: 'n', label: 'No' },
    { value: 'y', label: 'Yes' }
  ]
}

export const userClass = [
  {
    id: 1,
    level: 'Beginner',
    points: '0 -10',
    min: 0,
    max: 10,
  },
  {
    id: 2,
    level: 'Collector',
    points: '11-50',
    min: 11,
    max: 50,
  },
  {
    id: 3,
    level: 'Hobbyist',
    points: '51-100',
    min: 51,
    max: 100,
  },
  {
    id: 4,
    level: 'Enthusiast',
    points: '101-500',
    min: 101,
    max: 500,
  },
  {
    id: 5,
    level: 'Aficionado',
    points: '501-1,000',
    min: 501,
    max: 1000,
  },
  {
    id: 6,
    level: 'Guru',
    points: '1,000-2,000',
    min: 1000,
    max: 2000,
  },
  {
    id: 7,
    level: 'Master',
    points: '2,001-5,000',
    min: 2001,
    max: 5000,
  },
  {
    id: 8,
    level: 'Omniscient',
    points: '5,001-10,000',
    min: 5001,
    max: 10000,
  },
  {
    id: 9,
    level: 'Lord of Winterfell',
    points: '10,001-20,000',
    min: 10001,
    max: 20000,
  }
]