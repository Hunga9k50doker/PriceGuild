import React, { useEffect, useRef, useState } from "react";
import { CardModel, SaleData } from "model/data_sport/card_sport";
import { SaleChartState } from "../../BusinessLogic";
import moment from "moment";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import "react-datepicker/dist/react-datepicker.css";
import { HelperSales, UtilsColorGrade } from "model/data_sport/pricing_grid";
import { options, seriesConfig, getCluster, colorCluster, checkImageExist } from './data';
import StatisticAverage from "./statastic";
import { useDebouncedCallback } from "utils/useDebouncedEffect";
import ModalZoomImage from "components/modal/zoomImage/modalZoomImage"
import ImageDefault from "assets/images/card_default.png"
import ReportImage, { CardForm } from "components/modal/reportImage"
import { api } from "configs/axios";

interface Props {
  listRecord: SaleData[];
  calcMaLine: { [key: string]: any };
  isShowSalePoints: boolean;
  cardId: number;
  cardData: CardModel;
  saleChartState: SaleChartState;
  calcMaxLineRequest: () => void;
  cardName: string;
  reloadPricingGridRequest: () => Promise<void>;
  updataSaleData: (data: SaleData[]) => void
}

const SaleChart: React.FC<Props> = ({
  listRecord,
  isShowSalePoints,
  calcMaLine,
  cardId,
  saleChartState,
  calcMaxLineRequest,
  reloadPricingGridRequest,
  updataSaleData,
  cardName,
  cardData,
}) => {
  const [calcMaxLineCalled, setCalcMaxLineCalled] = useState(false);
  const [cardIdHold, setCardIdHold] = useState(0);
  const [isOpenZoomImage, setIsOpenZoomImage] = useState<boolean>(false);
  const [strImage, setStrImage] = useState<string>("");
  const [isOpenReport, setIsOpenReport] = useState<boolean>(false);
  const [point, setPoint] = React.useState<any| undefined>();
  const [gradeCompanys, setGradeCompany] = useState<Array<any>>([])

  const refChart = useRef();

  const onClickTooltip = async (point: any) => {
    if ((point.id ?? null) === null) return
    const imageExits = await checkImageExist(point.img)
    setPoint({...point})
    if (imageExits) {
      setIsOpenZoomImage(true);
      setStrImage(point.img);
    } else {
      setIsOpenReport(true)
    }
  }

  const chartRef = (): Highcharts.Chart | null => {
    if (!refChart?.current) {
      return null;
    }
    return (refChart?.current as unknown as HighchartsReact.RefObject).chart;
  };

  useEffect(() => {
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
    const getGradeCompany = async () => {
      try {
        const result = await api.v1.gradeCompany.getList({ has_values: true })
        if (result.success) {
          setGradeCompany(result.data)
        }
      } catch (err) {
        console.log(err)
      }
    }
    getGradeCompany()
  }, [])
  
  const onReportSuccess = async (_: CardModel, point: any, cardForm: CardForm, isCorrectCard: boolean) => {
    const i = saleChartState.mainListSaleRecord.findIndex(it => it.id === point.id)
    if (i === -1) return
    if (isCorrectCard) {
      saleChartState.mainListSaleRecord.splice(i, 1)
    } else {
      if (cardForm.report_grade_company.name.toLowerCase() === "ungraded") {
        saleChartState.mainListSaleRecord[i].grade_company = null
        saleChartState.mainListSaleRecord[i].grade_value = "0"
      } else {
        saleChartState.mainListSaleRecord[i].grade_company = cardForm.report_grade_company.name
        saleChartState.mainListSaleRecord[i].grade_value = cardForm.report_grade_value
      }
    }
    updataSaleData(saleChartState.mainListSaleRecord)
    await reloadPricingGridRequest()
    setTimeout(() => calcMaxLineRequest());
  }

  return (
    <div className="content-pricing-grid content-pricing-grid-custom">
      <StatisticAverage saleChartState={saleChartState} />
      <div className="content-sale-chart hide-highcharts-scrollbar">
        <div className="mt-2">
          {/* @ts-ignore */}
          <HighchartsReact constructorType={'stockChart'} ref={refChart} highcharts={Highcharts} options={options} />
        </div>
      </div>
      <ModalZoomImage 
        isOpen={isOpenZoomImage}
        onClose={(isOpenReport) => {
          setIsOpenZoomImage(false)
          if (isOpenReport) setIsOpenReport(true)
          else {
            setStrImage('')
            setPoint(undefined)
          }
        }}
        src={strImage}
        imageDefaultZoom={ImageDefault}
      />
      <ReportImage 
        point={point} 
        gradeCompany={gradeCompanys} 
        cardData={cardData} 
        isOpen={isOpenReport} 
        onSuccess={onReportSuccess}
        onClose={() => {
          setIsOpenReport(false);
          if (strImage) setIsOpenZoomImage(true) 
          else setPoint(undefined)
        }}
      /> 
    </div>
  );
};

export default SaleChart;
