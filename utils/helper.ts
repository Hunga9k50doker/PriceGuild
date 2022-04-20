// import moment from "moment";

import { DataGroupedSearch } from "interfaces";
import { sortBy } from "lodash";
const ISSERVER = typeof window === "undefined";

export const getCookie = (c_name: string) => {
  var c_value: string | null = " " + document.cookie;
  var c_start: number = c_value.indexOf(" " + c_name + "=");
  if (c_start === -1) {
    c_value = null;
  } else {
    c_start = c_value.indexOf("=", c_start) + 1;
    var c_end = c_value.indexOf(";", c_start);
    if (c_end === -1) {
      c_end = c_value.length;
    }
    c_value = unescape(c_value.substring(c_start, c_end));
  }
  return c_value;
};

export const setCookie = (cname: string, cvalue: string, exdays: number) => {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  const expires = "expires=" + d.toUTCString();
  if (!ISSERVER) {
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
};

export const formatCurrency = (value?: number, currency?: string) => {
  return new Intl.NumberFormat(`en-US`, {
    currency: `${currency || "USD"}`,
    style: "currency",
    // @ts-ignore
  }).format(value);
};

export const formatCurrencyCustom = (value?: number, currency?: string) => {
  return `${new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(value || 0)}`;
};

export const isInt = (n: any) => {
  return Number(n) === n && n % 1 === 0;
};

export const isFloat = (n: any) => {
  return Number(n) === n && n % 1 !== 0;
};

export const formatNumber = (num: number = 0) => {
  if (isInt(num)) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }
  return num
    .toFixed(2)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

export const updateDataByKey = (Ar: any, key: string, data: any) => {
  for (let index in Ar) {
    if (Ar[index].key === key) {
      Ar[index] = data;
      return Ar;
    }
  }
  Ar.push(data);
  return Ar;
};

export function convertListDataToGrouped<T>(
  data: T[],
  getFirstLetter: (item: T) => string,
  compareOption?: (pre: T, next: T) => number
): DataGroupedSearch<T>[] {
  let newData = [...data];

  if (newData.length === 0) {
    return [];
  }

  let dataGrouped: DataGroupedSearch<T>[] = [];

  newData.forEach((item, index) => {
    let firstLetter =
      getFirstLetter(item).charCodeAt(0) >= 49 &&
      getFirstLetter(item).charCodeAt(0) <= 57
        ? "1-9"
        : getFirstLetter(item);

    ///Check new group option
    let isNewGroup: boolean =
      (index === 0 && dataGrouped.length === 0) ||
      firstLetter.toUpperCase() !== dataGrouped[dataGrouped.length - 1].id;

    if (isNewGroup && dataGrouped.length !== 0 && compareOption) {
      dataGrouped[dataGrouped.length - 1].options.sort(compareOption);
    }

    if (isNewGroup) {
      dataGrouped.push({
        id: firstLetter.toUpperCase(),
        name: firstLetter.toUpperCase(),
        options: [item],
        totalLenPre:
          index === 0
            ? 0
            : dataGrouped[dataGrouped.length - 1].totalLenPre +
              dataGrouped[dataGrouped.length - 1].options.length,
      });
    } else {
      dataGrouped[dataGrouped.length - 1].options.push(item);
    }

    ///Case last element
    if (index === newData.length - 1 && compareOption) {
      dataGrouped[dataGrouped.length - 1].options.sort(compareOption);
    }
  });

  dataGrouped = sortBy(dataGrouped, ["id"]);
  return dataGrouped;
}

export const parseJwt = (token: string) => {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
};

export const decodeBase64 = (s: string) => {
  var e = {},
    i,
    b = 0,
    c,
    x,
    l = 0,
    a,
    r = "",
    w = String.fromCharCode,
    L = s.length;
  var A = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  for (i = 0; i < 64; i++) {
    // @ts-ignore
    e[A.charAt(i)] = i;
  }
  for (x = 0; x < L; x++) {
    // @ts-ignore
    c = e[s.charAt(x)];
    b = (b << 6) + c;
    l += 6;
    while (l >= 8) {
      ((a = (b >>> (l -= 8)) & 0xff) || x < L - 2) && (r += w(a));
    }
  }
  return r;
};

export const paginate = (
  array: any[],
  page_size: number,
  page_number: number[]
) => {
  let data: any = [];
  for (const page of page_number) {
    data = [...data, ...array.slice((page - 1) * page_size, page * page_size)];
  }
  // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
  return data;
};

export const gen_card_url = (name_for_web: string, on_card_code: string) => {
  let url_string: any = `${name_for_web}${
    on_card_code ? `-${on_card_code}` : ""
  }`;
  url_string = url_string.split(" - ");
  url_string[4] = url_string?.[4]?.split(" Not #'d")[0];
  url_string[4] = url_string?.[4]?.split(" #'d")[0];
  if (url_string?.[4]?.substring(0, 5) == "#'d /") {
    url_string[4] = "Standard";
  }
  if (url_string?.[5]) {
    url_string[5] = url_string?.[5]?.replace(/\//g, "").replace(/  /g, " ");
  }
  url_string = url_string.join("-");
  return Boolean(name_for_web) && typeof url_string === "string"
    ? url_string?.replaceAll(" ", "-").toLowerCase()
    : "";
};

export const is_ios_device = () => {
  return typeof window === "undefined"
    ? false
    : !!navigator.platform &&
        /iPad|iPhone|MacIntel|iPod/.test(navigator.platform);
};
// @ts-ignore
export const isFirefox = typeof InstallTrigger !== "undefined";
