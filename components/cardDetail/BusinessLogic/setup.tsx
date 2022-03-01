import { BaseType, GradePair, IndexAverage } from "interfaces";
import { CardModel, ImageLibrary, SaleData } from "model/data_sport/card_sport";
import {
  HelperSales,
  PricingGridData,
  PricingGridModel,
  YearPricingCard,
} from "model/data_sport/pricing_grid";
import React, { useEffect } from "react";
import { MetaData } from "utils/constant";
import { initCardDetailState, CardDetailReducer } from "./reducer";
import { CardDetailSaga } from "./sagas";

const CardDetailContext = React.createContext<
  Types.PropsContextState | undefined
>(undefined);

const CardDetailProvider = React.forwardRef(
  (props: Types.PropsProvider, ref) => {
    const [state, dispatch] = React.useReducer(CardDetailReducer, initCardDetailState());

    ///State
    const value: Types.PropsContextState = {
      state,
      sagaController: new CardDetailSaga(dispatch),
      dispatchReducer: dispatch,
    };

    //handle ref
    React.useImperativeHandle(ref, () => ({
      controller: value.sagaController,
    }));

    return (
      <CardDetailContext.Provider value={value}>
        {props.children}
      </CardDetailContext.Provider>
    );
  }
);
function useCardDetail() {
  const context = React.useContext(CardDetailContext);
  if (context === undefined) {
    throw new Error("useCount must be used within a CountProvider");
  }
  return context;
}

///Effective memo
const MySelectorComponent = React.memo((props: Types.PropsSelector) => {
  return <>{props.children(props.context)}</>;
});

/** Holding state: Just render UI when origin state changed and shouldBuild is true | undefined.
 * 
 * Example: 
 * ```
  * <CardDetailConsumer
      shouldBuild={(curr, next) => curr.label !== next.label}
    >
      {({ state, dispatch }) => {
        console.log("render label");

        return (
          <div>
            <div>{state.label}</div>
            <button
              onClick={() =>
                dispatch({
                  type: "update-label",
                  label: `label: ${Date.now()}`,
                })
              }
              style={{ backgroundColor: "#D4D4D4", borderColor: "#D4D4D4" }}
              type="button"
              className="px-5 mt-3 btn btn-secondary"
            >{'label'}</button>
          </div>
        );
      }}
    </CardDetailConsumer>
 * ```
*/
const CardDetailConsumer = React.memo(
  ({ children, shouldBuild }: Types.PropsConsumer) => {
    const context = useCardDetail();

    const [myState, setMyState] =
      React.useState<Types.PropsContextState>(context);

    useEffect(() => {
      if (shouldBuild) {
        if (shouldBuild(myState.state, context.state)) setMyState(context);
      } else {
        setMyState(context);
      }
    }, [context]);

    return (
      <MySelectorComponent context={myState}>{children}</MySelectorComponent>
    );
  }
);

export { CardDetailProvider, useCardDetail, CardDetailConsumer };

///Types
export declare module Types {
  /**
   * Provider type
   */
  interface PropsProvider {
    children: React.ReactNode;
  }

  type RefType = React.ForwardedRef<{
    controller: CardDetailSaga;
  }>;

  /**Props holding memo selector component */
  interface PropsSelector {
    children: (context: PropsContextState) => React.ReactNode;
    context: PropsContextState;
  }

  /**
   * Reducer type
   */

  interface PropsContextState {
    state: CardDetailState;
    dispatchReducer: DispatchReducer;
    sagaController: CardDetailSaga;
  }

  interface PropsConsumer {
    children: (context: PropsContextState) => React.ReactNode;
    shouldBuild?: (
      currentState: CardDetailState,
      nextState: CardDetailState
    ) => boolean;
  }

  /**
   * Dispatcher and Actions reducer
   */

  type DispatchReducer = (action: ActionReducer) => void;
  type ActionReducer =
    | { type: "loadDataSuccess"; payload: { [key: string]: any } }
    | { type: "loadSaleDataSuccess"; payload: { [key: string]: any } }
    | {
      type: "LOAD_PRICING_GRID_SUCCESS";
      payload: Array<{ [key: string]: any }>;
    }
    | {
      type: "SELECT_YEAR_PRICING";
      index: number;
    }
    | {
      type: "UPDATE_KEY_GRADE";
      key: string;
    }
    | {
      type: "SELECTED_PERIOD_TIME";
      index: number;
    }
    | {
      type: "SELECTED_PERIOD_CONTROL";
      index: number;
    }
    | {
      type: "UPDATE_CALC_MA_LINE";
      data: { [key: string]: any };
    }
    | { type: "UPDATE_IS_SHOW_POINT"; isShow: boolean }
    | { type: "SELECT_GRADE_CHART_TOOL"; index: number }
    | { type: "SELECT_GRADE_TREE_CHART_TOOL"; dataSelect: Array<string>}
    | { type: "SELECT_GRADE_PRICING"; index: number };

  interface CardDetailState {
    cardData: CardModel;
    dataSales: Array<SaleData>;
    frontImage?: ImageLibrary;
    backImage?: ImageLibrary;
    totalCollectorPort: number;
    totalCollectorWish: number;

    /**Hold data grid to filter on UI*/
    pricingGridDataHold: PricingGridData;

    /**Data to show on UI*/
    pricingGridData: PricingGridData;

    listYearPricingCard: Array<YearPricingCard>;
    indexPricingSelected: number;

    ///Specific section pie chart
    keyData: string;
    dataGraded: Map<string, Array<PricingGridModel>>;
    saleChartState: SaleChartState;
  }
}

interface TreeSelect {
  key: string;
  value: string;
  label: string;
  gradeCompany: string;
  gradeValue: string;
  children: Array<{ [key: string]: any }>;
}

export interface calcMaLineStats {
  average: number, 
  change: number,
  latest: number,
  max: number,
  min: number,
  total_trades: number
}

export interface CalcMaLine {
  price: any[], 
  stats: calcMaLineStats
}

export class SaleChartState {
  listTimePeriod: BaseType[];
  listCardGrade: PricingGridModel[];
  listSaleRecord: SaleData[];
  calcMaLine: { [key: string]: CalcMaLine };
  listPeriodControl: BaseType[];
  periodControlSelected: number;
  cardGradeSelected: number;
  timePeriodSelected: number;
  isShowSalePoints: boolean;

  ///TREE DROPDOWN GRADE CHART
  dataGradedTree: Array<TreeSelect>;
  gradeTreeSelected: Array<string>;

  ///[mainListSaleRecord] to handle load more for list record
  mainListSaleRecord: SaleData[];

  //Limit record once load
  limit: number;

  constructor() {
    this.limit = 30;
    this.listTimePeriod = MetaData.listTimePeriod;
    this.listPeriodControl = [
      { id: -1, name: "All" },
      { id: 30, name: "1M" },
      { id: 90, name: "3M" },
      { id: 180, name: "6M" },
      { id: 365, name: "1Y" },
    ];
    this.listCardGrade = [];
    this.calcMaLine = {};
    this.mainListSaleRecord = [];
    this.listSaleRecord = [];
    this.periodControlSelected = 0;
    this.cardGradeSelected = 0;
    this.timePeriodSelected = 3;
    this.isShowSalePoints = false;
    this.dataGradedTree = [];
    this.gradeTreeSelected = ['ALL'];
  }

  getDataOfChild(data: any[]): any[] {
    return data.reduce((res, item) => {
      if (item.children?.length) return [...res, ...this.getDataOfChild(item.children)]
      return [...res, item]
    }, [])
  }

  get gradeTreeItemSelected(): TreeSelect[] {
    return this.getDataOfChild(this.dataGradedTree).filter(it => this.gradeTreeSelected.includes(it.value))
  }

  handleTreeGrade() {
    let dataSelect: Array<TreeSelect> = [
      { key: "ALL", value: "ALL", label: "ALL", children: [], gradeCompany: 'ALL', gradeValue: 'ALL' },
      { key: "RAW", value: "RAW", label: "Ungraded", children: [], gradeCompany: 'RAW', gradeValue: 'RAW' },
    ];
    this.listCardGrade.forEach((item, index) => {
      if (HelperSales.checkDataGradeValid(item.gradeCompany, item.gradeValue)) {
        if (item.gradeValue === "ALL") {
          dataSelect.push({
            key: `${item.gradeCompany} ${item.gradeValue}`,
            value: `${item.gradeCompany} ${item.gradeValue}`,
            label: item.labelGrade,
            gradeCompany: item.gradeCompany,
            gradeValue: item.gradeValue,
            children: [],
          });
        } else {
          dataSelect[dataSelect.length - 1].children.push({
            key: `${item.gradeCompany} ${item.gradeValue}`,
            value: `${item.gradeCompany} ${item.gradeValue}`,
            gradeCompany: item.gradeCompany,
            gradeValue: item.gradeValue,
            label: item.labelGrade,
          });
        }
      }
    });
    this.dataGradedTree = dataSelect;
  }

  //Wait fix sales record
  updateDataCardGrade(salesRecordState: Types.CardDetailState) {
    let dataGradeSorted = salesRecordState.pricingGridDataHold.dataGradeSorted;
    let isDuplicateUngraded = false;

    let listData: PricingGridModel[] = [];
    for (let i = 0; i < dataGradeSorted.length; i++) {
      let item = dataGradeSorted[i];
      let gradeCompany = item.gradeCompany;
      let gradeValue = item.gradeValue;

      if (item.year === "ALL") {
        if (
          HelperSales.getStringGrade(gradeCompany, gradeValue) === "Ungraded"
        ) {
          if (isDuplicateUngraded) {
            continue;
          }
          isDuplicateUngraded = true;
        }
        listData.push(item);
      }
    }
    this.listCardGrade = listData;
    let indexAll = listData.findIndex(it => it.gradeCompany === "ALL")
    this.cardGradeSelected = indexAll !== -1 ? indexAll :  0
    this.handleTreeGrade();
  }

  //Update data by card Grade name
  // updateDataByCardGrade(saleData: SaleData[], index: number) {
  //   if (this.listCardGrade.length <= index) {
  //     return;
  //   }
  //   let itemSelected = this.listCardGrade[index];
  //   let gradeCompany = itemSelected.gradeCompany;
  //   let gradeValue = itemSelected.gradeValue;

  //   let stringGraded = HelperSales.getStringGrade(gradeCompany, gradeValue);
  //   this.cardGradeSelected = index;

  //   if (stringGraded === "Ungraded & Graded") {
  //     this.mainListSaleRecord = [...saleData];
  //   } else if (stringGraded === "Ungraded") {
  //     this.mainListSaleRecord = saleData.filter(
  //       (element) => element.grade_company == null
  //     );
  //   } else if (stringGraded === "Graded") {
  //     this.mainListSaleRecord = saleData.filter(
  //       (element) => element.grade_company != null
  //     );
  //   } else {
  //     this.mainListSaleRecord = saleData.filter((element) => {
  //       return (
  //         element.grade_company === gradeCompany &&
  //         (gradeValue === "ALL" || element.grade_value === gradeValue)
  //       );
  //     });
  //   }
  // }

  mapDataSaleLoadMore(currentPage: number = 1) {
    try {
      if (this.mainListSaleRecord.length === 0) {
        this.listSaleRecord = [];
        return;
      }
      if (
        currentPage <= Math.ceil(this.mainListSaleRecord.length / this.limit)
      ) {
        if (currentPage * this.limit <= this.mainListSaleRecord.length) {
          ///GetRang from [0,currentPage * this.limit)
          this.listSaleRecord = this.mainListSaleRecord.slice(
            0,
            currentPage * this.limit
          );
        } else {
          this.listSaleRecord = [...this.mainListSaleRecord];
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  updateMainListSaleRecord(saleData: SaleData[]) {
    this.mainListSaleRecord = saleData || []
  }

  getGradeTreeSelect(index: number) {
    if (this.listCardGrade.length <= index) return

    let itemSelected = this.listCardGrade[index];
    let gradeCompany = itemSelected.gradeCompany;
    let gradeValue = itemSelected.gradeValue;
    let stringGraded = HelperSales.getStringGrade(gradeCompany, gradeValue);
    if (stringGraded === "Ungraded & Graded") {
      return ['ALL']
    } else if (stringGraded === "Ungraded") {
      return ['RAW']
    } else {
      return [`${gradeCompany} ${gradeValue}`]
      // const existed = this.gradeTreeSelected.find(it => it === `${gradeCompany} ${gradeValue}`)
      // if (!existed) {
      //   if (this.gradeTreeSelected.length >= 5) {
      //     return [`${gradeCompany} ${gradeValue}`]
      //   } else {
      //     return [`${gradeCompany} ${gradeValue}`, ...this.gradeTreeSelected.filter(it => it !== 'ALL')]
      //   }
      // }
    }
  }

  gradeTreeSelect(index: number) {
    const gradeTreeSelected = this.getGradeTreeSelect(index)
    if (gradeTreeSelected) {
      this.gradeTreeSelected = gradeTreeSelected
    }
    // if (this.listCardGrade.length <= index) {
    //   return;
    // }

    // let itemSelected = this.listCardGrade[index];
    // let gradeCompany = itemSelected.gradeCompany;
    // let gradeValue = itemSelected.gradeValue;
    // let stringGraded = HelperSales.getStringGrade(gradeCompany, gradeValue);
    // this.cardGradeSelected = index;
    // if (stringGraded === "Ungraded & Graded") {
    //   this.gradeTreeSelected = ['ALL']
    // } else if (stringGraded === "Ungraded") {
    //   this.gradeTreeSelected = ['RAW']
    // } else {
    //   const existed = this.gradeTreeSelected.find(it => it === `${gradeCompany} ${gradeValue}`)
    //   if (!existed) {
    //     if (this.gradeTreeSelected.length >= 5) {
    //       this.gradeTreeSelected = [`${gradeCompany} ${gradeValue}`]
    //     } else {
    //       this.gradeTreeSelected = [`${gradeCompany} ${gradeValue}`, ...this.gradeTreeSelected.filter(it => it !== 'ALL')]
    //     }
    //   }
    // }
  }

  gradeTreSelect(saleData: SaleData[], dataSelect: Array<string>) {
    this.gradeTreeSelected = dataSelect;
  }

  get itemCardGradeSelected(): PricingGridModel {
    return this.listCardGrade[this.cardGradeSelected];
  }

  get periodSelected(): BaseType {
    return this.listTimePeriod[this.timePeriodSelected];
  }

  clone(): SaleChartState {
    let newState = new SaleChartState();
    newState.listCardGrade = [...this.listCardGrade];
    newState.listSaleRecord = [...this.listSaleRecord];
    newState.listTimePeriod = this.listTimePeriod;
    newState.cardGradeSelected = this.cardGradeSelected;
    newState.timePeriodSelected = this.timePeriodSelected;
    newState.mainListSaleRecord = [...this.mainListSaleRecord];
    newState.calcMaLine = this.calcMaLine;
    newState.isShowSalePoints = this.isShowSalePoints;
    newState.periodControlSelected = this.periodControlSelected;
    newState.listPeriodControl = this.listPeriodControl;

    return newState;
  }

  copyWith(data?: {
    listTimePeriod?: BaseType[];
    listCardGrade?: PricingGridModel[];
    listSaleRecord?: SaleData[];
    calcMaLine?: { [key: string]: any };
    listPeriodControl?: BaseType[];
    periodControlSelected?: number;
    cardGradeSelected?: number;
    timePeriodSelected?: number;
    isShowSalePoints?: boolean;
    gradeTreeSelected?: Array<string>;
    dataGradedTree?: Array<TreeSelect>;

    ///[mainListSaleRecord] to handle load more for list record
    mainListSaleRecord?: SaleData[];

    //Limit record once load
    limit?: number;
  }): SaleChartState {
    let newState = new SaleChartState();
    newState.listCardGrade = data?.listCardGrade ?? this.listCardGrade;
    newState.listSaleRecord = data?.listSaleRecord ?? this.listSaleRecord;
    newState.listTimePeriod = data?.listTimePeriod ?? this.listTimePeriod;
    newState.cardGradeSelected =
      data?.cardGradeSelected ?? this.cardGradeSelected;
    newState.timePeriodSelected =
      data?.timePeriodSelected ?? this.timePeriodSelected;
    newState.mainListSaleRecord = data?.mainListSaleRecord ?? this.mainListSaleRecord;
    newState.calcMaLine = data?.calcMaLine ?? this.calcMaLine;
    newState.isShowSalePoints = data?.isShowSalePoints ?? this.isShowSalePoints;
    newState.periodControlSelected =
      data?.periodControlSelected ?? this.periodControlSelected;
    newState.listPeriodControl =
      data?.listPeriodControl ?? this.listPeriodControl;
    newState.gradeTreeSelected = data?.gradeTreeSelected ?? this.gradeTreeSelected;
    newState.dataGradedTree = data?.dataGradedTree ?? this.dataGradedTree;

    return newState;
  }

  getIndexAverage() : IndexAverage {
    let valueIndex: IndexAverage = {
      latestValue:  this.mainListSaleRecord.length > 0 ?  this.mainListSaleRecord[0].price : 0,
      lowestValue: 0,
      highestValue: 0,
      averageValue: 0,
      totalTrades: this.mainListSaleRecord.length,
      change: 0,
    };

    if(this.listCardGrade.length === 0 || this.mainListSaleRecord.length === 0) {
      return valueIndex;
    }

    valueIndex.lowestValue = this.mainListSaleRecord[0].price;
    valueIndex.highestValue = valueIndex.lowestValue;
    //Sum to calc average
    let sum: number = valueIndex.lowestValue;

    let grade: GradePair = {gradeCompany: this.itemCardGradeSelected.gradeCompany, gradeValue: this.itemCardGradeSelected.gradeValue};

    let gradeStringAverage: string = HelperSales.getStringGrade(grade.gradeCompany, grade.gradeValue);

    // Xác định xử lý min max và stop
    let flagHandling: boolean = false;

    for (const record of this.mainListSaleRecord) {
      let gradeString = HelperSales.getStringGrade(record.grade_company, record.grade_value);
      if(gradeString === gradeStringAverage) {
        if(!flagHandling) {
          //Start handling
          flagHandling = true;
        }

        sum += record.price;
        
        if(record.price < valueIndex.lowestValue) {
          valueIndex.lowestValue = record.price;
        } else if(record.price > valueIndex.highestValue) {
          valueIndex.highestValue = record.price;
        }

      } else if(flagHandling) {
        flagHandling = false;
        break;
      }
    }

    return {...valueIndex, averageValue: sum / this.mainListSaleRecord.length};
  }
}
