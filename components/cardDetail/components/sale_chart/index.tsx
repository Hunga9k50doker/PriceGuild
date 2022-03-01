import React, { useEffect, useRef, useState } from "react";
import { SaleData } from "model/data_sport/card_sport";
import { SaleChartState } from "../../BusinessLogic";
import moment from "moment";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import "react-datepicker/dist/react-datepicker.css";
import { HelperSales, UtilsColorGrade } from "model/data_sport/pricing_grid";
import { options, seriesConfig, getCluster, colorCluster } from './data';
import StatisticAverage from "./statastic";
import { useDebouncedCallback } from "utils/useDebouncedEffect";

interface Props {
  listRecord: SaleData[];
  calcMaLine: { [key: string]: any };
  isShowSalePoints: boolean;
  cardId: number;
  saleChartState: SaleChartState;
  calcMaxLineRequest: () => void;
  cardName: string;
  onClickTooltip?: (e: any) => void;
}

const SaleChart: React.FC<Props> = ({
  listRecord,
  isShowSalePoints,
  calcMaLine,
  cardId,
  saleChartState,
  calcMaxLineRequest,
  cardName,
  ...props
}) => {
  const [calcMaxLineCalled, setCalcMaxLineCalled] = useState(false);
  const [cardIdHold, setCardIdHold] = useState(0);

  const refChart = useRef();

  const onClickTooltip = (point: any) => {
    point?.id && props.onClickTooltip && props.onClickTooltip(point);
  }


  const chartRef = (): Highcharts.Chart | null => {
    if (!refChart?.current) {
      return null;
    }
    return (refChart?.current as unknown as HighchartsReact.RefObject).chart;
  };

  useEffect(() => {
    console.log('cardId: ', cardId);
    if ((saleChartState.listCardGrade.length !== 0 && calcMaxLineCalled === false && cardId > 0) || (calcMaxLineCalled && cardIdHold !== cardId)) {
      setCardIdHold(cardId)
      ///Just call once
      setCalcMaxLineCalled(true);
      calcMaxLineRequest();
    }
  }, [cardId, saleChartState.listCardGrade]);

  const getSaleData = (listRecord: SaleData[]) => {
    return listRecord?.map(element => {
      let timestamp = moment(element.date).valueOf();
      // @ts-ignore
      let colorScheme = UtilsColorGrade.colorSchemeGrade(element.grade_company ?? "Ungraded")
      return {
        // @ts-ignore
        x: timestamp,
        // @ts-ignore
        y: element.price,
        // @ts-ignore
        color: colorScheme.color_2,
        // @ts-ignore
        colorText: colorScheme.color_1,
        // @ts-ignore
        id: element.id,
        //@ts-ignore
        cardName: cardName,
        // @ts-ignore
        img: element.img ? `https://img.priceguide.cards/sp/${element.img}.jpg` : null,
        // @ts-ignore
        graded: element.grade_company ? HelperSales.getStringGrade(element.grade_company, element.grade_value) : 'Ungraded',
        marker: {
          // @ts-ignore
          // symbol: 'url(https://www.highcharts.com/samples/graphics/sun.png)'
          // @ts-ignore
          symbol: element.grade_company  ? 'cross' : 'circle',
          // @ts-ignore
          lineColor: element.grade_company  ? colorScheme.color_2 : '#124DE3',
          // @ts-ignore
          fillColor: 'transparent',
          // @ts-ignore
          lineWidth: 2,
        }
      }
    }) || []
  }

  const handleDataChart = useDebouncedCallback(() => {
    const chart = chartRef()
    if (!chart) return
    // @ts-ignore
    options.series = []
    saleChartState.gradeTreeItemSelected.forEach((grade) => {
      if (calcMaLine[grade.value]) {
        const calcMaLineData: any = []
        const price: any = calcMaLine[grade.value].price
        for (const key in price) {
          calcMaLineData.push([+key, +price[key]])
        }
        if (grade.value === 'ALL') {
          // @ts-ignore
          (options.series as Highcharts.SeriesOptionsType[]).push({...seriesConfig['areaspline'], data: calcMaLineData, name: grade.label, id: `${grade.label}-calcMaLine`})
        } else {
          let color = '#124DE3', colorText: string = '#ffffff';
          if (grade.value !== 'RAW') {
            //@ts-ignore
            let colorScheme = UtilsColorGrade.colorSchemeGrade(grade.gradeCompany ?? "Ungraded")
            color = colorScheme.color_2
            colorText = colorScheme.color_1
          }
          // @ts-ignore
          (options.series as Highcharts.SeriesOptionsType[]).push({...seriesConfig['line'], data: calcMaLineData, name: grade.label, id: `${grade.label}-calcMaLine`, color: color, dataLabels: {...seriesConfig['line'].dataLabels, color: colorText, backgroundColor: color, borderColor: color}})
        }
      }
    })
    if (saleChartState.gradeTreeItemSelected[0]?.value === 'ALL') {
      // @ts-ignore
      options.series.push({...seriesConfig['scatter'], data: getSaleData(listRecord), name: 'ALL-sale', id: 'ALL-sale', visible: isShowSalePoints, point: { events: { click: (e) => onClickTooltip(e.point) } } })
    } else {
      saleChartState.gradeTreeItemSelected.forEach((grade) => {
        let data: SaleData[]
        let color = colorCluster
        if (HelperSales.checkDataGradeValid(grade.gradeCompany, grade.gradeValue)) {
          //@ts-ignore
          let colorScheme = UtilsColorGrade.colorSchemeGrade(grade.gradeCompany)
          color = colorScheme.color_2
        }
        if (grade.value === 'RAW') {
          data = listRecord.filter(it => !it.grade_company)
        } else {
          data = listRecord.filter(it => it.grade_company === grade.gradeCompany && (it.grade_value === grade.gradeValue || grade.gradeValue === 'ALL'))
        }
        // @ts-ignore
        options.series.push({...seriesConfig['scatter'], data: getSaleData(data), name: grade.label, id: `${grade.label}-sale`, cluster: getCluster(color), visible: isShowSalePoints, linkedTo: `${grade.label}-calcMaLine`, point: { events: { click: (e) => onClickTooltip(e.point) } } })
      })
    }
    chart.update(options, true, true);
  }, 100)

  useEffect(() => {
    handleDataChart()
  }, [calcMaLine, listRecord])

  useEffect(() => {
    const chart = chartRef()
    if (!chart) return
    const series = chart.series.filter(item => item.type === 'scatter' && item.visible !== isShowSalePoints)
    series.forEach(item => {
      const index = chart.series.findIndex(it => it.options.id === item.options.id)
      if (index !== -1) chart.series[index].setVisible(isShowSalePoints)
    })
  }, [isShowSalePoints])

  useEffect(() => {
    options.rangeSelector?.buttons?.forEach((_, index) => {
      // @ts-ignore
      options.rangeSelector.buttons[index].events = {
        click: () => {
          const chart = chartRef()
          chart?.zoomOut()
        }
      }
    })
  }, [])
  
  return (
    <div className="content-pricing-grid content-pricing-grid-custom">
      <StatisticAverage saleChartState={saleChartState} />
      <div className="content-sale-chart">
        <div className="mt-2">
          {/* @ts-ignore */}
          <HighchartsReact constructorType={'stockChart'} ref={refChart} highcharts={Highcharts} options={options} />
        </div>
      </div>
    </div>
  );
};

export default SaleChart;
