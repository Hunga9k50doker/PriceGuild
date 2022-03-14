import { CardDetailApis } from "api/CardDetailApis";
import { BaseType } from "interfaces";
import { PricingGridModel } from "model/data_sport/pricing_grid";
import { Types } from "./setup";

export class CardDetailSaga {
  dispatchReducer: Types.DispatchReducer;

  constructor(dispatch: Types.DispatchReducer) {
    this.dispatchReducer = dispatch;
  }

  loadCardDetail(payload: CardDetailSaga.DetailParam) {
    return CardDetailApis.loadCardDetail(payload).then((response) => {
      this.dispatchReducer({
        type: "loadDataSuccess",
        payload: response.data,
      });
    });
  }

  loadSaleData(payload: CardDetailSaga.DetailParam, headers: any = {}) {
    return CardDetailApis.loadSaleData(payload, headers).then((response) => {
      this.dispatchReducer({
        type: "loadSaleDataSuccess",
        payload: response.data,
      });
    })
  }

  loadPricingGrid(payload: CardDetailSaga.PricingGridParam) {
    return CardDetailApis.pricingGridData(payload).then((response) => {
      this.dispatchReducer({
        type: "LOAD_PRICING_GRID_SUCCESS",
        payload: {
          //@ts-ignore
          data: response.data, 
          null_price_tooltip: response.null_price_tooltip,
          drop_down_options: response.drop_down_options,
          drop_down_options_by_year: response.drop_down_options_by_year,
        },
      });
    });
  }

  requestCalcMaxLine(params: CardDetailApis.CalcMaLineParam) {
    CardDetailApis.getCalcMaLine(params)
      .then((response) => {
        this.dispatchReducer({
          type: "UPDATE_CALC_MA_LINE",
          data: response.data.price,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  requestCalcMaxLineV1(params: CardDetailSaga.CalcMaLine) {
    let cardGrades = params.cardGrades
    let oldData: any = {}
    if (params.oldData) {
      cardGrades = []
      params.cardGrades.forEach(grade => {
        if (params.oldData && params.oldData[grade]) {
          oldData[grade] = params.oldData[grade]
        } else {
          cardGrades.push(grade)
        }
      })
    }
    const apis: any = cardGrades?.map(async (grade) => {
      const temp: string[] = grade.split(' ')
    let gradeCompany: string = temp.length > 1 ? temp[0] : temp[0]
    let gradeValue: string = temp.length > 1 ? temp[1] : temp[0]
      return CardDetailApis.getCalcMaLine({
        card_id: params.cardId,
        grade_company: gradeCompany,
        grade_value: gradeValue,
        time_period: params.period,
        currency: params.currency
      })
        .then((res) => {
          return res.data
        })
    })
    Promise.all(apis)
      .then(res => {
        const data: any = oldData
        cardGrades?.forEach((item, index) => {
          data[item] = res[index]
        })
        this.dispatchReducer({
          type: "UPDATE_CALC_MA_LINE",
          data: data,
        });
      })
    // CardDetailApis.getCalcMaLine({
    //   card_id: params.cardId,
    //   grade_company: params.itemCardGrade.gradeCompany,
    //   grade_value: params.itemCardGrade.gradeValue,
    //   time_period: params.period,
    //   currency: params.currency,
    // })
    //   .then((response) => {
    //     this.dispatchReducer({
    //       type: "UPDATE_CALC_MA_LINE",
    //       data: response.data.price,
    //     });
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  }

  selectPeriodTime(index: number) {
    this.dispatchReducer({
      type: "SELECTED_PERIOD_TIME",
      index,
    });
  }
}

declare namespace CardDetailSaga {
  interface DetailParam {
    card_code: string;
    currency: string;
    onUpdateCard?: (item: any) => void;
  }

  interface PricingGridParam {
    cardcode: string;
    currency: string;
    userid: number;
  }

  interface CalcMaLine {
    cardGrades: string[];
    cardId: number;
    currency: string;
    period: number;
    oldData?: { [key: string]: any }
  }
}
