import React, { useEffect, useRef, useImperativeHandle, useState } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import "react-datepicker/dist/react-datepicker.css";
import { options, ArgumentType, ChartData, HoldChartData } from "./data";
import { CardDetailApis } from "api/CardDetailApis";
import { useSelector } from "react-redux";
import Selectors from "redux/selectors";
import Select from "react-select";
import _ from "lodash";
import { MetaData } from "utils/constant";
import {
  PricingGridModel,
} from "model/data_sport/pricing_grid";
import IconDot3 from "assets/images/dot-3.svg";
import ListStatastic, { RefType as RefTypeStatic } from "./listStatastic"
import { CalcMaLine, SaleChartState } from "components/cardDetail/BusinessLogic/setup";
import ImageDefault from "assets/images/card_default.png"
import { CardModel } from "model/data_sport/card_sport";
import { api } from "configs/axios";
import ModalZoomImage from "components/modal/zoomImage/modalZoomImage"
import ReportImage, { CardForm } from "components/modal/reportImage"
import { checkImageExist } from "components/cardDetail/components/sale_chart/data";
const ISSERVER = typeof window === "undefined";

if (!ISSERVER) {
  require('highcharts/modules/series-label')(Highcharts)
}
export interface RefType {
  addData: (data: ArgumentType) => Promise<void>;
  removeSeries: (cardId: string) => void;
  onChangeGrade: (cardGrade: PricingGridModel, cardId: string) => Promise<void>
}

interface Props {
  errorNoSaleData?: (code: string) => void;
}

const calcMaLineDefault: CalcMaLine = { price: [], stats: { average: 0, change: 0, latest: 0, max: 0, min: 0, total_trades: 0 }}

const SaleChartComparison = React.forwardRef<RefType, Props>((props, ref) => {
  const refChart = useRef();
  const refStatistics = useRef<RefTypeStatic>(null);
  const { userInfo } = useSelector(Selectors.auth);
  const [isOpenZoomImage, setIsOpenZoomImage] = useState<boolean>(false);
  const [strImage, setStrImage] = useState<string>("");
  const [cardData, setCardData] = useState<CardModel | undefined>();
  const [gradeCompanys, setGradeCompany] = useState<Array<any>>([])
  const [isOpenReport, setIsOpenReport] = useState<boolean>(false);
  const [point, setPoint] = React.useState<any| undefined>();
  const {  currency } = useSelector(Selectors.config);

  const chartRef = (): Highcharts.Chart | null => {
    if (!refChart?.current) {
      return null;
    }

    return (refChart?.current as unknown as HighchartsReact.RefObject).chart;
  };

  const [chartData] = useState<ChartData>({});
  const [listTimePeriod] = useState(
    MetaData.listTimePeriod.map((item) => ({
      label: item.name,
      value: `${item.id}`,
    }))
  );
  const [timePeriodSelected, setTimePeriodSelected] = useState<{
    label: string;
    value: string;
  }>(listTimePeriod[3]);

  const [isShowSalePoints, setIsShowSalePoints] = useState(true);

  const getCalcMaLine = async (cardId: string | number, saleChartState: SaleChartState) => {
    const calcMaLine: CalcMaLine = await CardDetailApis.getCalcMaLine({
      card_id: +cardId,
      currency: currency,
      grade_company: saleChartState.itemCardGradeSelected.gradeCompany,
      grade_value: saleChartState.itemCardGradeSelected.gradeValue,
      time_period: +timePeriodSelected.value,
    })
      .then((response) => response.data)
      .catch((error) => {
        console.log(error);
        return Promise.resolve(calcMaLineDefault);
      });
    return calcMaLine
  }

  const _addDataToChart = async ({ saleChartState, cardName, cardId, cardCode, cardData, controller }: ArgumentType) => {
    if (!(cardId in chartData)) {
      const calcMaLine = saleChartState.itemCardGradeSelected ? await getCalcMaLine(cardId, saleChartState) : calcMaLineDefault
      chartData[cardId] = new HoldChartData(cardId, cardCode, cardName, saleChartState, calcMaLine, cardData, controller);
      chartData[cardId].updateDataGradeToChart(options, chartRef()!, onClickTooltip);
      refStatistics.current?.updateChartData(chartData);
    } else {
      if (saleChartState.itemCardGradeSelected) {
        const calcMaLine = await getCalcMaLine(cardId, saleChartState)
        chartData[cardId].updateConstructor(cardId, cardCode, cardName, saleChartState, calcMaLine, cardData, controller)
        chartData[cardId].updateDataChart(options, chartRef()!, calcMaLine)
        refStatistics.current?.updateChartData(chartData);
      } else {
        chartData[cardId].updateConstructor(cardId, cardCode, cardName, saleChartState, calcMaLineDefault, cardData, controller)
        refStatistics.current?.updateChartData(chartData);
      }
    }
  };

  const _removeSeries = (cardId: string) => {
    if (chartData[cardId]) {
      chartData[cardId].removeSeries(options, chartRef()!);
      delete chartData[cardId];
      refStatistics.current?.updateChartData(chartData);
    }
  };

  const onChangePeriod = (item: { label: string; value: string }) => {
    setTimePeriodSelected(item);
    Object.keys(chartData).forEach(async (cardId) => {
      const calcMaLine: CalcMaLine = await CardDetailApis.getCalcMaLine({
        card_id: +cardId,
        currency: currency,
        grade_company:
          chartData[cardId].itemCardGradeSelected.gradeCompany,
        grade_value:
          chartData[cardId].itemCardGradeSelected.gradeValue,
        time_period: +item.value,
      })
        .then((response) => response.data)
        .catch((error) => {
          console.log(error);
          return Promise.resolve(calcMaLineDefault);
        });
      chartData[cardId].updateCalcMaLineSeries(
        options,
        chartRef()!,
        calcMaLine
      );
    });
  };

  const onChangeGrade = async (cardGrade: PricingGridModel, cardId: string) => {
    const chart = chartRef();
    if (!options.series?.length || !chart || !chartData[cardId]) return;
    const cardGradeSelected = chartData[cardId].saleState.listCardGrade.findIndex(it => it.gradeCompany === cardGrade.gradeCompany && it.gradeValue === cardGrade.gradeValue)
    if (cardGradeSelected === -1 || cardGradeSelected === chartData[cardId].cardGradeSelected) return
    chartData[cardId].cardGradeSelected = cardGradeSelected
    chartData[cardId].saleState.updateCardGradeSelected(cardGradeSelected)
    const calcMaLine: CalcMaLine = await CardDetailApis.getCalcMaLine({
      card_id: +cardId,
      currency: currency,
      grade_company:
        chartData[cardId].itemCardGradeSelected.gradeCompany,
      grade_value:
        chartData[cardId].itemCardGradeSelected.gradeValue,
      time_period: +timePeriodSelected.value,
    })
      .then((response) => response.data)
      .catch((error) => {
        console.log(error);
        return Promise.resolve(calcMaLineDefault);
      });
    chartData[cardId].updateDataChart(options, chartRef()!, calcMaLine)
    refStatistics.current?.updateChartData(chartData);
  }

  const toggleShowSale = () => {
    const chart = chartRef();
    if (!options.series?.length || !chart) return;
    const indexs = Object.keys(chartData)
      .map((cardId) => chartData[cardId].getIndexSaleSeries())
      .reduce((res, item) => res.concat(item), []);
    if (isShowSalePoints) {
      options.series?.forEach((_, index) => {
        if (indexs.includes(index)) {
            //@ts-ignore
          (options.series as Highcharts.SeriesOptionsType[])[index].visible = !isShowSalePoints;
        }
      })
    } else {
      options.series?.forEach((_, index) => {
        if (indexs.includes(index)) {
          const calcMaLineId = (options.series as Highcharts.SeriesOptionsType[])[index].id?.replace('sale', 'calcMaLine')
          if (calcMaLineId) {
            const calcMaLine = chart?.get(calcMaLineId) as Highcharts.Series
            if (calcMaLine?.visible) {
               //@ts-ignore
              (options.series as Highcharts.SeriesOptionsType[])[index].visible = true;
            }
          }
        }
      })
    }
    
    chart.update({ ...options }, true, true);
    setIsShowSalePoints(!isShowSalePoints);
  };

  useImperativeHandle(ref, () => ({
    addData: _addDataToChart,
    removeSeries: _removeSeries,
    onChangeGrade: onChangeGrade
  }));

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
    return () => {
      options.series = [];
    };
  }, []);

  const onHideChart = (status: boolean, cardIds: Array<string>) => {
    const chart = chartRef();
    if (!options.series?.length || !chart) return;
    cardIds.forEach((cardId) => {
      chartData[cardId].isShow = status
      //@ts-ignore
      const iCalcMaLine = options.series.findIndex(it => it.id === `${cardId}-calcMaLine`)
      //@ts-ignore
      if (iCalcMaLine !== -1) options.series[iCalcMaLine].visible = status
      //@ts-ignore
      const iSale = options.series.findIndex(it => it.id === `${cardId}-sale`)
      //@ts-ignore
      if (iSale !== -1) options.series[iSale].visible = status
      if (status && !isShowSalePoints) {
        //@ts-ignore
        if (iSale !== -1) options.series[iSale].visible = false
      }
      const sale = chart?.get(`${cardId}-sale`) as Highcharts.Series
      //@ts-ignore
      const linkedTo = sale?.options?.linkedTo || ''
      //@ts-ignore
      sale?.update({linkedTo: ''})
      //@ts-ignore
      const calcMaLine = chart?.get(`${cardId}-calcMaLine`) as Highcharts.Series
      setTimeout(() => {
        calcMaLine?.setVisible(status)
        if (status && !isShowSalePoints) {
          sale?.setVisible(false)
        } else {
          sale?.setVisible(status)
        }
        //@ts-ignore
        sale?.update({linkedTo: linkedTo})
      });
    })
    refStatistics.current?.updateChartData(chartData);
  }

  const onClickTooltip = async (e: any, cardData: CardModel) => {
    if ((e.id ?? null) === null) return
    const imageExist = await checkImageExist(e.img)
    if (imageExist) {
      setIsOpenZoomImage(true);
      setStrImage(e.img);
    } else {
      setIsOpenReport(true)
    }
    setPoint({...e});
    setCardData(cardData)
  }

  const onReportSuccess = async (cardData: CardModel, point: any, cardForm: CardForm, isCorrectCard: boolean) => {
    if (!chartData[cardData.id] || !chartData[cardData.id].controller) return
    const i = chartData[cardData.id].saleState.mainListSaleRecord.findIndex(it => it.id === point.id)
    if (i === -1) return
    if (isCorrectCard) {
      chartData[cardData.id].saleState.mainListSaleRecord.splice(i, 1)
    } else {
      if (cardForm.report_grade_company.name.toLowerCase() === "ungraded") {
        chartData[cardData.id].saleState.mainListSaleRecord[i].grade_company = null
        chartData[cardData.id].saleState.mainListSaleRecord[i].grade_value = "0"
      } else {
        chartData[cardData.id].saleState.mainListSaleRecord[i].grade_company = cardForm.report_grade_company.name
        chartData[cardData.id].saleState.mainListSaleRecord[i].grade_value = cardForm.report_grade_value
      }
    }
    chartData[cardData.id].controller.dispatchReducer({
      type: "UPDATE_SALE_DATA",
      payload: {
        data: chartData[cardData.id].saleState.mainListSaleRecord
      }
    })
    chartData[cardData.id].updateSaleSeries(options, chartRef()!)
    chartData[cardData.id].controller.reloadPricingGrid({
      // @ts-ignore
      cardcode: cardData.code,
      currency: currency,
      userid: userInfo.userid,
    }).catch((err: any) => {
        props.errorNoSaleData && props.errorNoSaleData(cardData.code);
    })
  }

  return (
    <div className="content-sale-chart hide-highcharts-scrollbar">
      <div className="mt-2">
        <div className="only-mobile">
          <div className="d-flex justify-content-end mb-3 mr-2 sale-chart-option">
            <img src={IconDot3} alt="" />
          </div>
       
        </div>
        <div className="h-right d-flex align-items-center justify-content-center">
          <label className="toggle-custom d-flex only-desktop h-right-sale-point">
            <div className="ms-1 form-check">
              <input
                className="form-check-input cursor-pointer"
                type="checkbox"
                defaultChecked={isShowSalePoints}
                onChange={(e) => toggleShowSale()}
              />
              <label className="ml-2 form-check-label fz-14">Sale Points</label>
            </div>
          </label>
          <div className="d-flex align-items-center hidden-select grade h-right-move">
            <span>Moving Average Time Period</span>{" "}
            <Select
              value={timePeriodSelected}
              onChange={(item) => {
                if (item) onChangePeriod(item);
              }}
              className="react-select"
              classNamePrefix="react-select"
              options={listTimePeriod}
            />
          </div>
        </div>

        <HighchartsReact
          constructorType={"stockChart"}
          // @ts-ignore
          ref={refChart}
          highcharts={Highcharts}
          options={options}
        />

        <ListStatastic
          ref={refStatistics} 
          onHideChart={onHideChart}
          onChangeGrade={onChangeGrade}
        />

        <ModalZoomImage 
          isOpen={isOpenZoomImage}
          onClose={(isOpenReport) => {
            setIsOpenZoomImage(false);
            if (isOpenReport) setIsOpenReport(true)
            else {
              setStrImage('')
              setPoint(undefined)
              setCardData(undefined)
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
              else {
                setPoint(undefined)
                setCardData(undefined)
              }
            }}
          /> 
      </div>
    </div>
  );
});

export default React.memo(SaleChartComparison);
