import { Api } from "api";
import { AxiosRequestConfig } from "axios";
import { MyStorage } from "helper/local_storage";

const axiosConfig: AxiosRequestConfig = {
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 100000,
};

export const securityWorker =  () => {
  const langCode = MyStorage.langCode;
  const token = MyStorage.token;
  return {
    headers: {
      accept: "application/json;charset=UTF-8",
      "Content-type": "application/json",
      langCode: langCode || "vi",
      Authorization: token ? `Bearer ${token}` : null,
    },
  };
};

export const api = new Api({ securityWorker, ...axiosConfig });
