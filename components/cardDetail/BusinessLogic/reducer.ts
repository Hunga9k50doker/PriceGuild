import { Types, SaleChartState } from "./setup";
import { CardModel, ImageLibrary, SaleData } from "model/data_sport/card_sport";
import {
  HelperSales,
  PricingGridData,
  PricingGridModel,
  YearPricingCard,
} from "model/data_sport/pricing_grid";

export const initCardDetailState: () => Types.CardDetailState = () => ({
  cardData: new CardModel(),
  dataSales: [],
  totalCollectorPort: 0,
  totalCollectorWish: 0,
  pricingGridData: new PricingGridData(),
  pricingGridDataHold: new PricingGridData(),
  listYearPricingCard: [new YearPricingCard({ id: -1, year: "All years" })],
  indexPricingSelected: 0,
  keyData: "PSA",
  dataGraded: new Map(),
  saleChartState: new SaleChartState(),
  priceTooltipPricingGrid: '',
  dropDownOptions: [],
  dropDownOptionsByYear: [],
});

export const CardDetailReducer = (
  state: Types.CardDetailState,
  action: Types.ActionReducer
): Types.CardDetailState => {
  switch (action.type) {
    case "loadDataSuccess": {
      let newState = {
        ...state,
        cardData: new CardModel(action.payload.card_detail),
        // dataSales: (action.payload.sale_data ?? []).map(
        //   (item: object) => new SaleData(item)
        // ),
        // frontImage: new ImageLibrary(action.payload["library_image"]["front"]),
        // backImage: new ImageLibrary(action.payload["library_image"]["back"]),
        totalCollectorPort:
          action.payload["collectors_catalog"]["portfolio"] ?? 0,
        totalCollectorWish:
          action.payload["collectors_catalog"]["wishlist"] ?? 0,
      };

      // ///Cập nhật grade data ở chart
      // newState.saleChartState.updateDataByCardGrade(
      //   newState.dataSales,
      //   newState.saleChartState.cardGradeSelected
      // );

      // newState.saleChartState.gradeTreeSelect(
      //   newState.dataSales,
      //   newState.saleChartState.cardGradeSelected
      // );

      return newState;
    }
      
      
    case "loadSaleDataSuccess": {
      let newState = {
        ...state,
        // cardData: new CardModel(action.payload.card_detail),
        dataSales: (action.payload.sale_data ?? []).map(
          (item: object) => new SaleData(item)
        ),
        // frontImage: new ImageLibrary(action.payload["library_image"]["front"]),
        // backImage: new ImageLibrary(action.payload["library_image"]["back"]),
        // totalCollectorPort:
        //   action.payload["collectors_catalog"]["portfolio"] ?? 0,
        // totalCollectorWish:
        //   action.payload["collectors_catalog"]["wishlist"] ?? 0,
      };

      ///Cập nhật grade data ở chart
      // newState.saleChartState.updateDataByCardGrade(
      //   newState.dataSales,
      //   newState.saleChartState.cardGradeSelected
      // );
      // newState.saleChartState.gradeTreeSelect(
      //   newState.dataSales,
      //   newState.saleChartState.cardGradeSelected
      // );
      newState.saleChartState.updateMainListSaleRecord(newState.dataSales)
      return newState;
    }

    case "UPDATE_SALE_DATA": {
      let newState = { 
        ...state,
        dataSales: action.payload.data || []
      };
      newState.saleChartState.updateMainListSaleRecord(newState.dataSales)
      return {
        ...newState,
      };
    }
    case "LOAD_PRICING_GRID_SUCCESS":
      let newState = { ...state };
      //@ts-ignore
      newState.pricingGridDataHold = PricingGridData.fromJson(action.payload.data);
      //@ts-ignore
      newState.priceTooltipPricingGrid = action.payload.null_price_tooltip;
      newState.pricingGridData = newState.pricingGridDataHold.clone();
      //@ts-ignore
      newState.dropDownOptions = PricingGridData.dataOption(action.payload.drop_down_options);
      //@ts-ignore
      newState.dropDownOptionsByYear = PricingGridData.dataOptionByYear(action.payload.drop_down_options_by_year);
      
      newState.listYearPricingCard =
      newState.pricingGridData.getListYearUnique();
      newState.listYearPricingCard.unshift(
        new YearPricingCard({ id: -1, year: "All years" })
      );
      newState.pricingGridData = PricingGridData.getPricingGridDataByYear(
        newState.listYearPricingCard[0],
        newState.pricingGridDataHold
      );
      //@ts-ignore
      newState.pricingGridData.dropDownOptions = PricingGridData.dataOption(action.payload.drop_down_options);
      newState.indexPricingSelected = 0;

      newState.saleChartState.updateDataCardGrade(newState);

      // Làm mới instance để không bị tham chiếu
      newState.dataGraded = new Map();
      resetDataGraded(newState.dataGraded, newState.pricingGridDataHold);
      newState.keyData =
        newState.dataGraded.size > 0
          ? Array.from(newState.dataGraded.keys())[0]
          : "";

      ///Cập nhật grade data ở chart
      // newState.saleChartState.updateDataByCardGrade(
      //   newState.dataSales,
      //   newState.saleChartState.cardGradeSelected
      // );
      // newState.saleChartState.gradeTreeSelect(
      //   newState.dataSales,
      //   newState.saleChartState.cardGradeSelected
      // );
      newState.saleChartState.updateMainListSaleRecord(newState.dataSales)
      return {
        ...newState,
      };
    case "RELOAD_PRICING_GRID_SUCCESS": {
      let newState = { ...state };
    
      let keySelectPricingGrid = newState.dropDownOptions[newState.pricingGridData.cardGradeSelected];
      //@ts-ignore
      newState.pricingGridDataHold = PricingGridData.fromJson(action.payload.data);
      //@ts-ignore
      newState.priceTooltipPricingGrid = action.payload.null_price_tooltip;
       //@ts-ignore
      newState.dropDownOptionsByYear = PricingGridData.dataOptionByYear(action.payload.drop_down_options_by_year);
      
      newState.dropDownOptions = PricingGridData.filterOptionByYear(
        newState.dropDownOptionsByYear,
        newState.listYearPricingCard[newState.indexPricingSelected]
      )
      newState.pricingGridData = newState.pricingGridDataHold.clone();
     
      newState.listYearPricingCard =
        newState.pricingGridData.getListYearUnique();

      newState.listYearPricingCard.unshift(
        new YearPricingCard({ id: -1, year: "All years" })
      );

      newState.pricingGridData = PricingGridData.getPricingGridDataByYear(
        newState.listYearPricingCard[newState.indexPricingSelected],
        newState.pricingGridDataHold
      );
      // check key selected Pricing Grid
      if (keySelectPricingGrid) {
        let index = newState.dropDownOptions.findIndex(el => el.index === keySelectPricingGrid.index);

        if (index !== -1) {
          newState.pricingGridData.cardGradeSelected = index;
        } else {
          newState.pricingGridData.cardGradeSelected = 0;
        }
      }
      // keep current data filter by year
      newState.pricingGridData = newState.pricingGridData.copyWith({
          dropDownOptions: newState.dropDownOptions
      }),

      // Làm mới instance để không bị tham chiếu
      newState.dataGraded = new Map();
      resetDataGraded(newState.dataGraded, newState.pricingGridDataHold);
      let keyData: string = ''
      if (newState.dataGraded.size) {
        const item = Array.from(newState.dataGraded.keys()).find(it => it === state.keyData)
        if (item) keyData = state.keyData
        else Array.from(newState.dataGraded.keys())[0]
      }
      newState.saleChartState.updateDataCardGrade(newState, true);
      newState.keyData = keyData
      return {
        ...newState,
      };
    }
    case "SELECT_YEAR_PRICING": {
      let newState = { ...state };
      
      let keySelectPricingGrid = newState.dropDownOptions[newState.pricingGridData.cardGradeSelected];

      newState.pricingGridData = PricingGridData.getPricingGridDataByYear(
        newState.listYearPricingCard[action.payload?.index],
        newState.pricingGridDataHold
      );
      
      newState.dropDownOptions = PricingGridData.filterOptionByYear(
        newState.dropDownOptionsByYear,
        action.payload.item
      )
      if (keySelectPricingGrid) {
        let index = newState.dropDownOptions.findIndex(el => el.index === keySelectPricingGrid.index && el.value === keySelectPricingGrid.value);
      
        if (index !== -1) {
          newState.pricingGridData.cardGradeSelected = index;
        } else {
          newState.pricingGridData.cardGradeSelected = 0;
        }
      }

      newState.pricingGridData = newState.pricingGridData.copyWith({
        dropDownOptions: newState.dropDownOptions
      })

      return {
        ...newState,
        indexPricingSelected: action.payload?.index,
      };
    }
    case "UPDATE_KEY_GRADE": {
      return {
        ...state,
        keyData: action.key,
      };
    }
    case "UPDATE_CALC_MA_LINE": {
      let newState = {
        ...state,
        saleChartState: state.saleChartState.copyWith({
          calcMaLine: action.data,
        }),
      };
      return {
        ...newState,
      };
    }
    case "UPDATE_IS_SHOW_POINT": {
      let newState = {
        ...state,
        saleChartState: state.saleChartState.copyWith({
          isShowSalePoints: action.isShow,
        }),
      };
      return newState;
    }
    case "SELECTED_PERIOD_TIME": {
      if (action.index === state.saleChartState.timePeriodSelected) {
        return state;
      }
      let newState = {
        ...state,
        saleChartState: state.saleChartState.copyWith({
          timePeriodSelected: action.index,
        }),
      };
      return newState;
    }
    case "SELECTED_PERIOD_CONTROL": {
      if (action.index === state.saleChartState.periodControlSelected) {
        return state;
      }
      let newState = {
        ...state,
        saleChartState: state.saleChartState.copyWith({
          periodControlSelected: action.index,
        }),
      };
      return newState;
    }
    case "SELECT_GRADE_CHART_TOOL": {
      // if (action.index === state.saleChartState.cardGradeSelected) {
      //   return state;
      // }
      // let newState = {
      //   ...state,
      //   saleChartState: state.saleChartState.copyWith({
      //     cardGradeSelected: action.index,
      //   }),
      // };
      
      ///Cập nhật grade data ở chart
      // newState.saleChartState.updateDataByCardGrade(
      //   newState.dataSales,
      //   newState.saleChartState.cardGradeSelected
      // );
      let newState = {
        ...state
      }
      newState.saleChartState.gradeTreeSelect(action.index);

      return newState;
    }

    case "SELECT_GRADE_TREE_CHART_TOOL": {
      return {
        ...state,
        saleChartState: state.saleChartState.copyWith({
          gradeTreeSelected: action.dataSelect,
        }),
      }
    }

    case "SELECT_GRADE_PRICING": {
      if (action.index === state.pricingGridData.cardGradeSelected) {
        return state;
      }
    
      return {
        ...state,
        pricingGridData: state.pricingGridData.copyWith({
          cardGradeSelected: action.index,
          dropDownOptions: state.dropDownOptions
        }),
      };
    }
    case "UPDATE_DATA_WISHLISH": {

      let newState = {
        ...state,
      };
     
      state.cardData.wishlist = 1;

      newState.cardData = new CardModel(state.cardData);
      
      return newState;

    }
    default:
      return state;
  }
};

const resetDataGraded = (
  dataGraded: Map<String, Array<PricingGridModel>>,
  pricingGridDataHold: PricingGridData
) => {
  dataGraded.clear();
  pricingGridDataHold.data.forEach((item) => {
    if (HelperSales.checkDataGradeValid(item.gradeCompany, item.gradeValue)) {
      if (!dataGraded.has(item.gradeCompany)) {
        dataGraded.set(item.gradeCompany, []);
      }
      dataGraded.get(item.gradeCompany)!.push(item);
    }
  });
};
