import { PricingGridModel, UtilsColorGrade } from "model/data_sport/pricing_grid";
import React, { useEffect, useRef, useState } from "react";
import { RegexString } from "utils/constant";
import { labelDefaultsAxisX, labelSpecialAxisX } from "../data";
import { SaleChartState } from "../BusinessLogic";
import { useSelector } from "react-redux";
import Selectors from "redux/selectors";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const getOptions = () => {
  return {
    chart: {
      type: "column",
      backgroundColor: "#f8f8f8"
    },
    title: {
      text: "",
    },
    // subtitle: {
    //   text: 'Source: <a href="http://en.wikipedia.org/wiki/List_of_cities_proper_by_population">Wikipedia</a>',
    // },
    xAxis: {
      tickInterval: 0.5,
      type: "category",
      labels: {
        // rotation: -45,
        style: {
          fontSize: "13px",
          fontFamily: "Verdana, sans-serif",
        },
        //@ts-ignore
        formatter: (axis) => {
          if (new RegExp(/^[0-9]+.[0-9]+$/).test(axis.value)) {
            return ''
          }
          return `${axis.value}`
        }
      },
    },
    legend: {
      enabled: false,
    },
    tooltip: {
      borderColor: "#18213A",
      borderRadius: 6,
      backgroundColor: '#18213A',
      shared: true,
      useHTML: true,
      headerFormat: '<table style="background-color: #18213A">',
      pointFormat: '<tr><td style="color:#FFF">{point.y} sales</td>',
      footerFormat: '</table>',
      valueDecimals: 2
    },
    series: [
      {
        name: "Population",
        color: 'red',
        data: [["t", 1]],
      },
    ],
    plotOptions: {
      series: {
        pointWidth: 20,
        point: {
          events: {},
        },
      },
    },
    drilldown: {
      series: []
    }
  }
}

interface SaleBarItem {
  gradeValue: string;
  value: number;
  color: string;
}

export enum TypeSale {
  volume,
  value,
}

interface Props {
  type: TypeSale;
  dispatchReducer: any;
  sagaController: any;
  dataGraded: any;
  keyData: string;
  listCardGrade: any;
  cardId: any;
  periodSelected: any;
  saleChartState: SaleChartState;
  onChangeGradeCompare?: (cardGrade: PricingGridModel, cardId: number) => void
}

const SaleBarChart = (props: Props) => {
  const { saleChartState } = props
  const [options] = useState(getOptions())
  var dataLabelAxisX: any[] = [];
  var dataAxisX: Map<string, SaleBarItem> = new Map();

  const { userInfo } = useSelector(Selectors.auth);
  const refChart = useRef();

  const initDataAxisX = () => {
    dataLabelAxisX =
      props.keyData === 'SGC' ? labelSpecialAxisX : labelDefaultsAxisX;
  }

  const seriesChart = (): Array<SaleBarItem> => {

    let chart = (refChart?.current as unknown as HighchartsReact.RefObject).chart;
    if (!chart) {
      return [];
    }

    options.tooltip = {
      borderColor: "#18213A",
      borderRadius: 6,
      backgroundColor: '#18213A',
      shared: true,
      useHTML: true,
      headerFormat: '<table style="background-color: #18213A">',
      pointFormat: `<tr><td style="color:#FFF">${props.type === TypeSale.volume ? '' : '$'}{point.y} ${props.type === TypeSale.volume ? 'Sales' : ''}</td>`,
      footerFormat: '</table>',
      valueDecimals: props.type === TypeSale.volume ? 0 : 2
    };

    dataAxisX = new Map();
    initDataAxisX();
    options.series[0].data.length = 0;

    props.dataGraded.get(props.keyData)?.forEach((element: any) => {

      //Check grade_value is Number and Exist in dataLabel hard code
      if (new RegExp(RegexString.numType).test(element.gradeValue) &&
        dataLabelAxisX.findIndex(item => `${item}`.localeCompare(element.gradeValue) === 0) !== -1) {
        //Y axis value
        let valueBarChart: number = props.type === TypeSale.value
          ? element.avg
          : element.count;
        dataAxisX.set(`${element.gradeValue}`, { gradeValue: `${element.gradeValue}`, value: valueBarChart, color: 'red' });
      }
    });

    dataLabelAxisX.forEach((value) => {
      let itemData = dataAxisX.get(`${value}`) ?? { gradeValue: `${value}`, value: 0.0, color: 'red' };
      options.series[0].data.push([itemData.gradeValue, itemData.value]);
    });

    options.series[0].color = UtilsColorGrade.getColorGrade(props.keyData);
    // @ts-ignore
    options.plotOptions.series.point.events.click = function(e) {
      if (!e?.point?.selected) {
        onPressBarChart(this as any, { gradeValue: e?.point?.name, value: e?.point?.name, color: '' }) 
      }
    }
    // @ts-ignore
    options.series[0].dataCustom = props
    // @ts-ignore
    chart.update(options, true, true);
    return dataLabelAxisX
      .map((value) => dataAxisX.get(`${value}`) ?? { gradeValue: `${value}`, value: 0.0, color: 'red' });
  }

  useEffect(() => {
    initDataAxisX();
    seriesChart();
  }, [props.dataGraded, props.keyData]);

  useEffect(() => {
    let chart = (refChart?.current as unknown as HighchartsReact.RefObject).chart;
    if (!chart) return
    // @ts-ignore
    chart.series[0].userOptions.dataCustom = props
  }, [props])

  const onPressBarChart = (point: Highcharts.Point, item: SaleBarItem) => {
    // @ts-ignore
    const dataCustom = point.series.userOptions.dataCustom as Props
    if (!dataCustom) return
    const index = dataCustom.saleChartState.listCardGrade.findIndex(it => it.gradeCompany === dataCustom.keyData && it.gradeValue === item.gradeValue)
    if (index !== -1) {
      if(dataCustom.onChangeGradeCompare) {
        props.onChangeGradeCompare && props.onChangeGradeCompare(dataCustom.saleChartState.listCardGrade[index], +dataCustom.cardId)
        document.getElementById('sale-chart-comparison')?.scrollIntoView();
      } else {
        const cardGrades = dataCustom.saleChartState.getGradeTreeSelect(index)
        if (cardGrades?.length) {
          dataCustom.dispatchReducer({ type: 'SELECT_GRADE_CHART_TOOL', index: +index });
          dataCustom.sagaController.requestCalcMaxLineV1({
            cardId: +dataCustom.cardId,
            currency: userInfo.userDefaultCurrency,
            cardGrades: cardGrades,
            period: dataCustom.saleChartState.periodSelected.id,
            oldData: dataCustom.saleChartState.calcMaLine
          });
          document.getElementById('charting-tool')?.scrollIntoView();
        }
      }
    }

    // for (let index in props.listCardGrade) {
    //   let itemGrade = props.listCardGrade[index];
    //   if (itemGrade.gradeCompany === props.keyData && itemGrade.gradeValue === item.gradeValue) {
    //     props.dispatchReducer({ type: 'SELECT_GRADE_CHART_TOOL', index: +index });
    //     props.sagaController.requestCalcMaxLineV1({
    //       cardId: +props.cardId,
    //       currency: userInfo.userDefaultCurrency,
    //       itemCardGrade:
    //         props.listCardGrade[index],
    //       period: props.periodSelected.id,
    //     });
    //     document.getElementById('charting-tool')?.scrollIntoView();
    //     return;
    //   }
    // }
  };

  return (
    <div className="content-chart">
      <div className="content-chart__title">{props.type === TypeSale.volume ? `${props.keyData} Sales Volume` : `${props.keyData} Average Sales Value ($)`}</div>
      <div className="content-chart__type">75 sales total</div>
      {/* @ts-ignore */}
      <HighchartsReact ref={refChart} highcharts={Highcharts} options={options} />
    </div>
  );
};

export default React.memo(SaleBarChart);
