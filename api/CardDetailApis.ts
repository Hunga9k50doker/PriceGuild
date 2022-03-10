import { BaseResponseData } from "model/base";
import { HelperSales } from "model/data_sport/pricing_grid";
import { NewHttpClient } from "./axiosClients";

export class CardDetailApis {
  static loadSaleData(body: CardDetailApis.SaleDataParam, headers: any = {}) {
    return new NewHttpClient<CardDetailApis.SaleDataResponse>({
      route: "/card_details/pg_app_sales_data",
    }).post(body, headers);
  }

  static loadCardDetail(body: CardDetailApis.SaleDataParam) {
    return new NewHttpClient<CardDetailApis.SaleDataResponse>({
      route: "/card_details/pg_app_card_detail",
    }).post(body);
  }

  static pricingGridData(body: CardDetailApis.PricingGridParam) {
    return new NewHttpClient<{ [key: string]: any }>({
      route: "/card_details/pg_app_pricing_grid",
    }).post(body);
  }

  static getCalcMaLine(body: CardDetailApis.CalcMaLineParam) {
    let isGradeValid = HelperSales.checkDataGradeValid(
      body.grade_company,
      body.grade_value
    );
    let nameGradeCompany = HelperSales.getStringGrade(
      body.grade_company,
      body.grade_value
    ).toLowerCase();
    return new NewHttpClient<CardDetailApis.CalcMaLineResponse>({
      route: "/card_details/pg_app_calc_ma_line",
    }).post({
      ...body,
      grade_company: `${
        isGradeValid
          ? body.grade_company
          : body.grade_company === "ALL"
          ? "all"
          : nameGradeCompany
      }`,
      grade_value: `${
        isGradeValid
          ? body.grade_value.toString().toLowerCase()
          : body.grade_company === "ALL"
          ? "all"
          : nameGradeCompany
      }`,
    });
  }

  ///Interfaces
}

export declare module CardDetailApis {
  export interface SaleDataParam {
    card_id?: number;
    card_code: string;
    currency: string;
    device_id?: string;
  }

  export interface SaleDataResponse {
    data: { [key: string]: any };
  }

  export type CalcMaLineResponse = {
    data: {
      price: { [key: string]: any }[];
      stats: any;
    };
  };

  /**Post data pricing grid */
  export interface PricingGridParam {
    cardcode: string;
    userid: number;
    currency: string;
  }

  export interface CalcMaLineParam {
    card_id: number;
    grade_company: string;
    grade_value: string;
    time_period: number;
    currency: string;
  }
}
