import { HttpClient } from "api";
import { NewHttpClient } from "api/axiosClients";
import Item from "components/react-autosuggest/dist/Item";
import { ColorSchemeGrade, GradePair, IndexAverage } from "interfaces";
import { constant, isEmpty, isInteger } from "lodash";
import { BaseModel, NewBaseResponse } from "model/base";

enum GridSaleColumn {
  grade,
  avg,
  max,
  min,
  count,
}

interface YearPricingType {
  id: number;
  year: string;
}

class YearPricingCard extends BaseModel {
  id: number;
  year: string;

  constructor(yearPricing: YearPricingType) {
    super();
    this.id = yearPricing.id;
    this.year = yearPricing.year;
  }

  static fromJson(json: { [key: string]: any }): YearPricingCard {
    return new YearPricingCard({ id: json.id ?? 0, year: json.year ?? "" });
  }

  toJson(): { [key: string]: any } {
    return {
      id: this.id,
      year: this.year,
    };
  }
}

class PricingGridModel extends BaseModel {
  year: string;
  gradeCompany: string;
  gradeValue: string;
  avg: number;
  max: number;
  min: number;
  count: number;

  constructor(json?: { [key: string]: any }) {
    super();
    json = json ?? {};
    this.year = json.year ?? "";
    this.gradeCompany = json.gradeCompany ?? "";
    this.gradeValue = json.gradeValue ?? "";
    this.avg = json.avg ?? 0;
    this.max = json.max ?? 0;
    this.min = json.min ?? 0;
    this.count = json.count ?? 0;
  }

  get labelGrade(): string {
    return this.year === ""
      ? "All"
      : HelperSales.getStringGrade(this.gradeCompany, this.gradeValue);
  }

  toJson(): { [key: string]: any } {
    return {
      year: this.year,
      gradeCompany: this.gradeCompany,
      gradeValue: this.gradeValue,
      avg: this.avg,
      max: this.max,
      min: this.min,
      count: this.count,
    };
  }
}

class PricingGridData {
  data: Array<PricingGridModel>;

  /**This prop handled sort when loaded data */
  dataGradeSorted: Array<PricingGridModel>;
  isSortDesc = true;
  typSort = GridSaleColumn.grade;
  dropDownOptions:any;

  cardGradeSelected: number;

  constructor() {
    this.data = [];
    this.dataGradeSorted = [];
    this.cardGradeSelected = 0;
    this.dropDownOptions = {};
  }

  selectGrade(index: number) {
    this.cardGradeSelected = index;
  }

  static fromJson(data: Array<{ [key: string]: any }>): PricingGridData {
    let newPricing: PricingGridData = new PricingGridData();
    newPricing.data = data.map((item) => new PricingGridModel(item));

    newPricing.dataGradeSorted = HelperSales.handleSortDataPricing(
      newPricing.data
    );
    return newPricing;
  }

  getListYearUnique(): Array<YearPricingCard> {
    let listYearSort: Array<YearPricingCard> = [];

    this.data.forEach((item, index) => {
      if (isInteger(+item.year)) {
        listYearSort.push(
          new YearPricingCard({ id: index, year: `${item.year}` })
        );
      }
    });

    if (listYearSort.length > 1) {
      listYearSort.sort((current, next) => +current.year - +next.year);

      //handle year unique (case year duplicate)
      let currentYear: number | null;
      listYearSort = listYearSort.filter((element) => {
        if (!currentYear || currentYear !== +element.year) {
          currentYear = +element.year;
          return true;
        }
        return false;
      });
    }
    return listYearSort;
  }

  static dataOption(data:{[key:string]:string}[]): {value:string, label:string, index: number}[] {
    return Object.keys(data).sort((a,b)=>{ 
      if ( a === 'All') {
        return -1;
      } else if ( b === 'All') {
        return -1;
      }

      return a.localeCompare(b);
     }).map((key, i) => ({ label: key, value: key, index: i }));
  }

  static dataOptionByYear(data: any) {
    
    let dataOption: any = [];
    
    for (const [key, value] of Object.entries(data)) {

      let valueOption = [];
      
      if (!isEmpty(value)) {
        //@ts-ignore
        valueOption = Object.keys(value).sort((a,b)=>{ 
          if ( a === 'All') {
            return -1;
          } else if ( b === 'All') {
            return -1;
          }

          return a.localeCompare(b);
        }).map((key, i) => ({ label: key, value: key, index: i }));

        dataOption[key] = valueOption;
      } else {
        dataOption[key] = [];
      }
    }
    return dataOption;
  }

  static filterOptionByYear(data: any, item: any) {
    if (item.id === -1) {
      return data['ALL'];
    }
    
    return data[+item.year];
  }

  get listDataGradeSelected(): PricingGridModel[] {
    const item = this.dropDownOptions[this.cardGradeSelected];

    if ( item?.value === 'All' || !item ) {
      return this.dataGradeSorted;
    } else {
      return this.dataGradeSorted.filter((it)=>{
        return it.gradeCompany === item.value;
      })
    }
    
    return this.dataGradeSorted;

    // if (this.cardGradeSelected === 0) {
    //   return this.dataGradeSorted;
    // }

    // let item = this.dataGradeSorted[this.cardGradeSelected - 1];
    // if (item.gradeValue === 'ALL' && HelperSales.checkDataGradeValid(item.gradeCompany, item.gradeValue)) {
    //   let listData: PricingGridModel[] = [];

    //   for (let index = this.cardGradeSelected - 1; item.gradeCompany === this.dataGradeSorted[index].gradeCompany; index++) {
    //     listData.push(this.dataGradeSorted[index]);
    //   }
    //   return listData;
    // }

    // return [item];
  }

  copyWith(newData?: {
    data?: PricingGridModel[];
    dataGradeSorted?: PricingGridModel[];
    isSortDesc?: boolean;
    typSort?: GridSaleColumn;
    cardGradeSelected?: number;
    dropDownOptions?: any;
  }): PricingGridData {
    let pricing: PricingGridData = new PricingGridData();
    pricing.data = newData?.data ?? this.data;
    pricing.dataGradeSorted = newData?.dataGradeSorted ?? this.dataGradeSorted;
    pricing.isSortDesc = newData?.isSortDesc ?? this.isSortDesc;
    pricing.typSort = newData?.typSort ?? this.typSort;
    pricing.cardGradeSelected =
      newData?.cardGradeSelected ?? this.cardGradeSelected;
    pricing.dropDownOptions = newData?.dropDownOptions ?? this.dropDownOptions;
    return pricing;
  }

  clone(): PricingGridData {
    let newData: PricingGridData = new PricingGridData();

    newData.data = this.data.map((item) => new PricingGridModel(item.toJson()));
    newData.dataGradeSorted = this.dataGradeSorted.map(
      (item) => new PricingGridModel(item.toJson())
    );
    newData.isSortDesc = this.isSortDesc;
    newData.typSort = this.typSort;

    return newData;
  }

  sortDataByGridType() {
    let dataInvalid: Array<PricingGridModel> = [];

    let dataValid: Map<string, Array<PricingGridModel>> = new Map();

    //Handle group by data from company name
    this.data.forEach((item, index) => {
      if (HelperSales.checkDataGradeValid(item.gradeCompany, item.gradeValue)) {
        if (!dataValid.has(item.gradeCompany)) {
          dataValid.set(item.gradeCompany, []);
        }
        dataValid.get(item.gradeCompany)?.push(item);
      } else {
        dataInvalid.push(item);
      }
    });

    let validDataResult: Array<PricingGridModel> = [];

    ///Keys grouped
    let keysGroup: string[] = Array.from(dataValid.keys());

    keysGroup.sort((preValue, curValue) => {
      var pre = this.isSortDesc ? preValue : curValue;
      var cur = this.isSortDesc ? curValue : preValue;
      return pre.localeCompare(cur);
    });

    ///sort value in groups
    keysGroup.forEach((key) => {
      let value: Array<PricingGridModel> = dataValid.get(
        key
      ) as Array<PricingGridModel>;
      if (this.typSort == GridSaleColumn.grade) {
        value!.sort((preValue, curValue) => {
          var pre = this.isSortDesc ? preValue : curValue;
          var cur = this.isSortDesc ? curValue : preValue;

          if (pre.gradeValue === "ALL") {
            return -1;
          }

          if (cur.gradeValue === "ALL" || +pre.gradeValue > +cur.gradeValue) {
            return 1;
          }

          if (+pre.gradeValue === +cur.gradeValue) {
            return 0;
          }
          return -1;
        });
      }

      validDataResult = [...validDataResult, ...value];
    });

    ///case: Ungraded was duplicated
    let newDataInvalid: Array<PricingGridModel> = [];
    let isDuplicate = false;

    for (let item of dataInvalid) {
      if (item.gradeCompany === "RAW") {
        if (!isDuplicate) {
          isDuplicate = true;
        } else {
          continue;
        }
      }
      newDataInvalid.push(item);
    }
    dataInvalid = newDataInvalid;

    if (this.typSort === GridSaleColumn.grade) {
      dataInvalid.sort((preValue, curValue) => {
        var pre = this.isSortDesc ? preValue : curValue;
        var cur = this.isSortDesc ? curValue : preValue;
        return pre.gradeValue.localeCompare(cur.gradeValue);
      });

      this.dataGradeSorted = [
        ...(this.isSortDesc ? dataInvalid : []),
        ...validDataResult,
        ...(!this.isSortDesc ? dataInvalid : []),
      ];
    } else {
      this.dataGradeSorted = [...dataInvalid, ...validDataResult];

      this.dataGradeSorted.sort((preValue, curValue) => {
        var pre = this.isSortDesc ? preValue : curValue;
        var cur = this.isSortDesc ? curValue : preValue;

        switch (this.typSort) {
          case GridSaleColumn.avg: {
            return `${pre.avg}`.localeCompare(`${cur.avg}`);
          }
          case GridSaleColumn.max: {
            return `${pre.max}`.localeCompare(`${cur.max}`);
          }
          case GridSaleColumn.min: {
            return `${pre.min}`.localeCompare(`${cur.min}`);
          }
          case GridSaleColumn.count: {
            return `${pre.count}`.localeCompare(`${cur.count}`);
          }

          default:
            return 0;
        }
      });
    }
  }

  static getPricingGridDataByYear(
    yearPricing: YearPricingCard,
    pricingGridDataHold: PricingGridData
  ): PricingGridData {
    let newPricingGridData: PricingGridData = new PricingGridData();
    pricingGridDataHold.data.forEach((item) => {
      if (
        (yearPricing.id === -1 && item.year === "ALL") ||
        +item.year === +yearPricing.year
      ) {
        newPricingGridData.data.push(item);
      }
    });

    newPricingGridData.sortDataByGridType();
    newPricingGridData.selectGrade(0);
    return newPricingGridData;
  }
}

///Helper

/// Expression to sort grid data
///If [grade_company == "RAW"] => [Grade = "Ungraded"]
///Else if [grade_company == "Graded"] => [Grade = "Graded"]
///Else If [grade_company == "ALL" && grade_value == "ALL"] => [Grade = "Ungraded & Graded"]
///Else If [grade_value == "ALL"] => [Grade = grade_company]
///Else [Grade = "${grade_company} ${grade_value}"]

class HelperSales {
  static checkDataGradeValid(gradeCompany: any, gradeValue: any): boolean {
    if (
      gradeCompany === "RAW" ||
      gradeCompany === "Graded" ||
      (gradeCompany === "ALL" && gradeValue === "ALL")
    ) {
      return false;
    }
    return true;
  }

  static getStringGrade(gradeCompany: any, gradeValue: any): string {
    switch (gradeCompany?.toString()) {
      case "RAW":
        return "Ungraded";
      case "Graded":
        return "Graded";
      case "ALL":
        return "Ungraded & Graded";
      default: {
        if (gradeValue === "ALL") return `${gradeCompany}`;
        return `${gradeCompany} ${
          gradeValue === 999 ? "Authentic" : gradeValue
        }`;
      }
    }
  }
  
  static checkExistGrade(gradeCompany: any): boolean {
    switch (gradeCompany.toString()) {
      case "RAW" : {
        return false;
      }
      case "Graded" : {
        return false;
      }
      case "ALL" : {
        return false;
      }
      default: {
        return true;
      }
    }
  }
  static handleSortDataPricing(
    dataOrigin: Array<PricingGridModel>,
    removeUngraded = false
  ): Array<PricingGridModel> {
    let dataInvalid: Array<PricingGridModel> = [];

    let dataValid: Map<String, Array<PricingGridModel>> = new Map();

    //Handle group by data from company name
    dataOrigin.forEach((item) => {
      if (HelperSales.checkDataGradeValid(item.gradeCompany, item.gradeValue)) {
        if (!dataValid.has(item.gradeCompany)) {
          dataValid.set(item.gradeCompany, []);
        }
        dataValid.get(item.gradeCompany)?.push(item);
      } else {
        dataInvalid.push(item);
      }
    });

    let validDataResult: Array<PricingGridModel> = [];
    dataValid.forEach((pricingGrids) => {
      pricingGrids.sort((pre, cur) => {
        if (pre.gradeValue === "ALL") {
          return -1;
        }
        if (cur.gradeValue === "ALL") {
          return 1;
        }

        if (+pre.gradeValue > +cur.gradeValue) {
          return 1;
        } else if (+pre.gradeValue === +cur.gradeValue) {
          return 0;
        }
        return -1;
      });

      validDataResult = [...validDataResult, ...pricingGrids];
    });

    if (removeUngraded) {
      ///case: Ungraded was duplicated
      let newDataInvalid: Array<PricingGridModel> = [];
      let isDuplicate = false;

      for (let item of dataInvalid) {
        if (item.gradeCompany === "RAW") {
          if (!isDuplicate) {
            isDuplicate = true;
          } else {
            continue;
          }
        }
        newDataInvalid.push(item);
      }
      dataInvalid = newDataInvalid;
    }
    return [...dataInvalid, ...validDataResult];
  }
}

class UtilsColorGrade {


  static getColorGrade(gradeCompany: string, defaultColor = "transparent"): string {
    return this.COLORS[gradeCompany] ? this.COLORS[gradeCompany].color_2 : defaultColor;
  }

  static getMainColorScheme(): any {
    return this.mainColorScheme;
  }

  
  static getTextColorGrade(key: string): string {
    return this.COLORS[key] ? this.COLORS[key].color_1 : this.COLORS["NONE"].color_1;
  }

  static colorTextTable(gradeCompany: any, gradeValue: any) {
    if (HelperSales.checkDataGradeValid(gradeCompany, gradeValue) === false) {
      return this.COLORS["NONE"].color_1;
    }
    return this.getTextColorGrade(gradeCompany);
  }

  static colorSchemeGrade(companyName: string): ColorSchemeGrade {
    return this.COLORS[companyName ?? "ungraded"] ?? this.COLORS['ungraded'];
  }

  static loadDataColors() {
    new NewHttpClient<NewBaseResponse<Array<ColorSchemeGrade>>>({route: '/grade-company/list'}).post({has_values: false}).then((response) => {
      for(let item of response.data) {
        this.mainColorScheme[item.name] = item;
      }
      this.mainColorScheme['NONE'] = { id: -1,
        name: 'None',
        name_full: 'None',
        color_1: '#000000',
        color_2: '#FAFAFA' }
    });
  }

  static get COLORS(): {[key: string]: ColorSchemeGrade} {
    return this.mainColorScheme['NONE'] ?  this.mainColorScheme : this.colorsDefault;
  }

  private static mainColorScheme: {[key: string]: ColorSchemeGrade} = {};

  private static colorsDefault: {[key: string]: ColorSchemeGrade} = { ungraded:
    { id: 1,
      name: 'ungraded',
      name_full: '',
      color_1: '#FFF',
      color_2: '#6D7588' },
   PSA:
    { id: 2,
      name: 'PSA',
      name_full: 'Professional Sports Authenticator',
      color_1: '#FFF',
      color_2: '#EB1C2D' },
   BGS:
    { id: 3,
      name: 'BGS',
      name_full: 'Beckett Grading Services',
      color_1: '#FFF',
      color_2: '#0079BD' },
   BCCG:
    { id: 4,
      name: 'BCCG',
      name_full: 'Beckett Collectors Club Grading',
      color_1: '#FFF',
      color_2: '#800711' },
   SGC:
    { id: 5,
      name: 'SGC',
      name_full: 'Sportscard Guaranty Corporation',
      color_1: '#FFF',
      color_2: '#126C0A' },
   KSA:
    { id: 6,
      name: 'KSA',
      name_full: 'KSA Certification',
      color_1: '#FFF',
      color_2: '#C30000' },
   BVG:
    { id: 7,
      name: 'BVG',
      name_full: 'Beckett Vintage Grading',
      color_1: '#FFF',
      color_2: '#E4650A' },
   GAI:
    { id: 8,
      name: 'GAI',
      name_full: 'Global Authentication Inc.',
      color_1: '#FFF',
      color_2: '#6F9BAE' },
   CSA:
    { id: 9,
      name: 'CSA',
      name_full: 'Certified Sports Authenticators',
      color_1: '#FFF',
      color_2: '#0D0B54' },
   ISA:
    { id: 10,
      name: 'ISA',
      name_full: 'International Sports Authentication',
      color_1: '#FFF',
      color_2: '#4946D7' },
   CSG:
    { id: 11,
      name: 'CSG',
      name_full: 'Certified Sports Guaranty',
      color_1: '#FFF',
      color_2: '#72C554' },
    NONE:  { id: -1,
      name: 'None',
      name_full: 'None',
      color_1: '#000000',
      color_2: '#FAFAFA' }};
}

export {
  UtilsColorGrade,
  GridSaleColumn,
  YearPricingCard,
  PricingGridModel,
  PricingGridData,
  HelperSales,
};
