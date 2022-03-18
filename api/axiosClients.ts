import axios, { AxiosInstance, AxiosResponse } from "axios";
import CapchaListener from "helper/hcapcha_system";
import { MyStorage } from "helper/local_storage";
import { ToastSystem } from "helper/toast_system";
import { BaseResponse } from "model/base";
import queryString from "query-string";

const axiosClient: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "content-type": "application/json",
  },
  paramsSerializer: (params) => queryString.stringify(params),
});

// axiosClient.interceptors.request.use((config) => {
//   const token = getCookie("token");

//   config.headers.Authorization = "Bearer " + token;

//   return config;
// }, function (error) {
//   // Do something with request error
//   return Promise.reject(error);
// },);

axiosClient.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    let _response: BaseResponse & object = {
      status: response.status,
      success: false,
      ...response.data,
    };
    if (_response.message) {
      if(_response.message !== "Login to see pricing")
        ToastSystem.show(_response.message, {status: _response.success ? "success" : "error"});
    }

    if (_response.success === false) {
      return Promise.reject(_response);
    }
    return Promise.resolve(_response);
  },
  (error) => {
    if (error?.response?.status === 404) {
      window.location.href = "/404";
      return Promise.reject();
    }
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
    let response: BaseResponse & object = {
      message: "Server error please try again",
      status: error?.response?.status ?? 501,
      success: false,
      ...error?.response?.data,
    };
    // if (response.message) {
    //   ToastSystem.show(response.message, {status: 'error'})
    // }
    return Promise.reject(response);
  }
);

/**
 * T: Giá trị trả về khi hoàn tất call api
 */
export class NewHttpClient<T> {
  private url: string;
  private header: { [key: string]: string };
  private useLoading: boolean;

  constructor(vars: Initial) {
    this.url = vars.route;

    let langCode = MyStorage.langCode;
    let token = MyStorage.token;
    this.header = {
      langCode: langCode || "vi",
      Authorization: token ? `Bearer ${token}` : "",
      ...defaultHeader,
      ...vars.headers,
    };
    this.useLoading = vars.useLoading ?? false;
  }

  get(params?: object): Promise<BaseResponse & T> {
    return axiosClient.get(this.url, {
      params: params,
      headers: this.header,
    });
  }

  post(body?: object, header : any = {}): Promise<BaseResponse & T> {
    return axiosClient.post(this.url, body, {
      headers: {
        ...this.header,
        ...encodeHeader,
        ...header
      },
    });
  }

  // put(): Promise<AxiosResponse<T>> {
  //   return Promise.reject();
  // }

  // path(): Promise<AxiosResponse<T>> {
  //   return Promise.reject();
  // }

  delete(params?: object): Promise<AxiosResponse<T>> {
    return axiosClient.delete(this.url, {
      data: params,
      headers: {
        ...this.header,
        ...encodeHeader,
      },
    });
  }

  // form(): Promise<AxiosResponse<T>> {
  //   return Promise.reject();
  // }
}

interface Initial {
  route: string;
  useLoading?: boolean;
  headers?: { [key: string]: string };
}

class AcceptType {
  static json: string = "application/json";
  static formData: string = "multipart/form-data";
  static urlEnCode: string = "application/x-www-form-urlencoded";
}

const defaultHeader: { [key: string]: string } = {
  Accept: AcceptType.json,
  "Content-Type": AcceptType.json,
};

const encodeHeader: { [key: string]: string } = {
  Accept: AcceptType.json,
  "Content-Type": AcceptType.urlEnCode,
};

// const formHeader: {[key: string]: string} = {
//   Accept: AcceptType.json,
//   'Content-Type': AcceptType.formData,
// };

export default axiosClient;
