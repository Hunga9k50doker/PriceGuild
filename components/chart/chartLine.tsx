import React, { useState, useEffect, useRef } from "react";
import { StatsAnalytics, WidgetSettings } from "interfaces"
import "react-datepicker/dist/react-datepicker.css";
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import { navigatorHangle } from "components/comparison/sale-chart/data";
import { formatCurrency } from "utils/helper";

type PropTypes = {
  chartData: { [key: string]: { [key: string]: number } },
  widget_settings: WidgetSettings,
  stats: StatsAnalytics[];
  onHandleChart: (setting: WidgetSettings) => void,
  onConfirmRemove: (id: number) => void
}

export const seriesConfig: {[key: string]: Highcharts.SeriesOptionsType} = {
  line: {
    type: "line",
    name: "",
    data: [],
    color: '#124DE3',
    shadow: true,
    borderRadius: 20,
    marker: {
      enabled: false
    },
    dataLabels: {
      borderColor: '#124DE3',
      backgroundColor: '#124DE3',
      borderRadius: 20,
      padding: 6,
      color: "#fff",
      allowOverlap: true,
      enabled: true,
      borderWidth: 0,
      style: {
        textOutline: 'none',
        fontWeight: '600',
        stroke: 'none',
        fontSize: '12px',
        fontFamily: 'manrope,sans-serif',
        lineHeight: 1,
      },
      // @ts-ignore
      formatter: function () {
        // @ts-ignore
        const data = this.series.groupedData || this.series.data
        // @ts-ignore
        const isLast = data.length && this.point.category === data[data.length -1].category
        // @ts-ignore
        return isLast ? this.series.name : null
      }
    },
    stickyTracking: false,
    showInNavigator: true,
    enableMouseTracking: true,
    states: {
        hover: {
            animation: {
                duration: 0
            }
        },
        inactive: {
            animation: {
                duration: 0
            }
        },
        normal: {
            animation: false
        }
    }
  }
}

const getOptions = (): Highcharts.Options => {
  return {
    rangeSelector: {
      inputBoxBorderColor: '#DFDFDF',
      inputBoxWidth: 128,
      inputBoxHeight: 20,
      inputStyle: {
        color: '#18213A',
        fontSize: "14px",
        fontFamily: 'manrope,sans-serif'
      },
      labelStyle: {
        display: 'none'
      },
      buttons: [{
          type: 'all',
          text: 'All',
          title: 'View all'
      }, {
          type: 'month',
          count: 1,
          text: '1m',
          title: 'View 1 month'
      }, {
          type: 'month',
          count: 3,
          text: '3m',
          title: 'View 3 months'
      }, {
          type: 'month',
          count: 6,
          text: '6m',
          title: 'View 6 months'
      }, {
          type: 'year',
          count: 1,
          text: '1y',
          title: 'View 1 year'
      }, {
          type: 'ytd',
          text: 'YTD',
          title: 'View year to date'
      }]
    },
    xAxis: {
      type: 'datetime',
      crosshair: false
    },
    yAxis: {
        opposite: false,
        labels: {
            align: 'right',
        }
    },
    scrollbar: {
      enabled: false,
      height: 0,
      zIndex: -1,
      margin: 0,
      buttonArrowColor: 'transparent',
      buttonBackgroundColor: 'transparent',
      buttonBorderWidth: 0,
      trackBorderWidth: 0,
      trackBackgroundColor: 'transparent',
      rifleColor: 'transparent',
      barBorderWidth: 0,
      barBackgroundColor: 'transparent'
    },
    tooltip: {
      enabled: false
    },
    navigator: {
      // adaptToUpdatedData: false,
      outlineWidth: 0,
      height: 70,
      handles: {
          width: 24,
          height: 24,
          symbols: [navigatorHangle, navigatorHangle]
      },
      series: {
          type: 'line'
      }
    },
    plotOptions: {
      series: {
        turboThreshold: 0
      }
    },
    series: [],
    legend: {
      enabled: true,
    },
    chart: {
      height: 700
    }
  }
}

const ChartSliderDemo = ({ chartData, stats, ...props }: PropTypes) => {

  const refChart = useRef();
  const [options] = useState(getOptions());
  const [lineShow, setLineShow] = useState<string[]>([]);
  
  const chartRef = (): Highcharts.Chart | null => {
    if (!refChart?.current) return null
    return (refChart?.current as unknown as HighchartsReact.RefObject).chart;
  };

  const getData = (chartData: { [key: string]: { [key: string]: number } }) => {
    const data: any[] = []
    if (!chartData) return data;
    for (const element of Object.keys(chartData)) {
      if (!["date", "COUNT"].includes(element)) {
        const line = [];
        for (const [key, value] of Object.entries(chartData[element])) {
          line.push({
            x: chartData.date[key],
            y: Number(value.toFixed(2))
          })
        }
        data.push({ data: line, name: element })
      }
    }
    return data
  }

  const addDataToChart = (_data: { [key: string]: { [key: string]: number } }) => {
    const chart = chartRef();
    if (!chart) return
    const data = getData(_data)
    setLineShow(data.map(it => it.name))
    const series: Highcharts.SeriesOptionsType[] = []
    for (const item of data) {
      // @ts-ignore
      series.push({ ...seriesConfig.line, name: item.name, data: item.data, id: `${item.name}-line`})
    }
    options.series = series
    chart.update(options, true, true)
  }

  useEffect(() => {
    addDataToChart(chartData)
  },[chartData])

  const onToggleChart = (e: any, name: string) => {
    const chart = chartRef();
    if (!chart) return
    let lineShowTemp: string[] = [...lineShow]
    const series = chart.get(`${name}-line`) as Highcharts.Series
    if (e.target.checked) {
      lineShowTemp.push(name)
      series?.visible !== true && series.setVisible(true)
    } else {
      lineShowTemp = lineShowTemp.filter(it => it !== name)
      series?.visible !== false && series.setVisible(false)
    }
    setLineShow(lineShowTemp)
  }

  const onCheckAll = (e: any) => {
    const chart = chartRef();
    if (!chart) return
    let lineShowTemp: string[] = [...lineShow]
    if (e.target.checked) {
      lineShowTemp = options.series?.map(it => it.name || '') || []
    } else {
      lineShowTemp = []
    }
    setLineShow(lineShowTemp)
    options.series?.forEach((_, index) => {
      // @ts-ignore
      options.series[index].visible = e.target.checked
    })
    chart.update(options)
    // options.series?.forEach(item => {
    //   const series = chart.get(item.id || '') as Highcharts.Series
    //   series?.visible !== e.target.checked && setTimeout(() => series?.setVisible(e.target.checked))
    // })
  }

  return (
    <div className="mt-2 custom-chart-analytics">
      {chartData && <HighchartsReact
        // @ts-ignore
        ref={refChart}
        highcharts={Highcharts}
        constructorType={'stockChart'}
        options={options}
      />}
      <div className="table-responsive table-config">
        <table className="table min-w-1140">
          <thead>
            <tr>
              <th scope="col">
                <input
                  className="form-check-input cursor-pointer"
                  type="checkbox"
                  value=""
                  onChange={onCheckAll}
                  checked={lineShow.length === stats.length}
                />
              </th>
              <th scope="col">Card name</th>
              <th scope="col">Latest Value</th>
              <th scope="col">Lowest Value</th>
              <th scope="col">Highest Value</th>
              <th scope="col">Average Value</th>    
            </tr>
          </thead>
          <tbody>
            {
              stats?.map((item, key) => (
                <tr key={key}>
                  <td>
                    <input
                      className="form-check-input cursor-pointer"
                      type="checkbox"
                      value=""
                      onChange={(e) => onToggleChart(e, `${item.year}`)}
                      checked={lineShow.includes(`${item.year}`)}
                    />
                  </td>
                  <td>{ item.year }</td>
                  <td>{ formatCurrency(item.last) }</td>
                  <td>{ formatCurrency(item.min) }</td>
                  <td>{ formatCurrency(item.max) }</td>
                  <td>{ formatCurrency(item.avg) }</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default React.memo(ChartSliderDemo);