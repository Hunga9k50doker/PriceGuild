import React, { useEffect, useRef, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { formatCurrency, formatNumber } from "utils/helper"
import { analyticsUpdateWidget, isNumber } from "./models";
import { AnalyticsType, WidgetSettings } from "interfaces";
import drilldown from "highcharts/modules/drilldown.js";

const ISSERVER = typeof window === "undefined";
if (!ISSERVER) {
  drilldown(Highcharts);
  Highcharts.setOptions({
    lang: {
      drillUpText: 'Back to Main Data'
    }
  })
}

type PropTypes = {
  chartData: {[key: string]: number;};
  widgetSettings: WidgetSettings,
  collection?: string,
  setAnalytics: (value: React.SetStateAction<AnalyticsType[] | undefined>) => void
};

const getOptions = (): Highcharts.Options => {
  return {
    chart: {
      type: "column",
      zoomType: 'x',
      events: {
        drilldown: drilldownCallback
      }
    },
    title: {
      text: "",
    },
    xAxis: {
      type: "category",
      crosshair: false,
      labels: {
        style: {
          fontSize: "13px",
        },
        formatter: (axis) => {
          return `${axis.value}`
        }
      },
    },
    legend: {
      enabled: false,
    },
    tooltip: {
      backgroundColor: '#0B0E61',
      useHTML: true,
      headerFormat: '<div style="display: flex; padding: 5px;" class="tooltip-scatter">',
      borderRadius: 6,
      style: {
        color: '#FFFFFF',
      },
      //@ts-ignore
      pointFormatter: function() {
        const dataCustom: PropTypes = (this.series.userOptions as any).dataCustom
        //@ts-ignore
        return `<div style="color: white">${ isNumber(dataCustom.widgetSettings.data) ? formatNumber(this.y) : formatCurrency(this.y)}</div>`
      },
      footerFormat: '</div>',
    },
    series: [
      {
        name: "Population",
        type: "column",
        colorByPoint: true,
        data: [],
      },
    ],
    credits: {
      enabled: false
    },
    drilldown: {
      activeAxisLabelStyle: {
        fontSize: '13px',
        color: '#666666',
        fontWeight: 'normal',
        textDecoration: 'unset'
      },
      // activeDataLabelStyle: {
      //   fontSize: '13px',
      //   color: '#666666',
      //   fontWeight: 'normal',
      //   textDecoration: 'unset'
      // },
      drillUpButton: {
        theme: {
          r: 6,
          fill: '#FFFFFF',
          'stroke-width': 2,
          stroke: '#E9F1FF',
          style: {
            color: '#0B0E61',
            fontSize: '14px',
            fontWeight: 500
          },
          states: {
            hover: {
              fill: 'rgba(233, 241, 255, 0.45)',
              'stroke-width': 2,
              stroke: '#E9F1FF',
            },
            select: {
              fill: 'rgba(233, 241, 255, 0.45)',
              'stroke-width': 2,
              stroke: '#E9F1FF',
            }
          }
        }
      }
    },
    plotOptions: {
      column: {
        cropThreshold: 99999,
        turboThreshold: 0,
      }
    }
  };
}

const drilldownCallback: Highcharts.DrilldownCallbackFunction = function(e) {
  const getData = async () => {
    this.showLoading()
    const dataCustom: PropTypes = (e.point.series.userOptions as any).dataCustom
    const result = await analyticsUpdateWidget(dataCustom.widgetSettings, dataCustom.collection, (e.point as any).drilldownFilter);
    if (result.data.length) {
      const series: Highcharts.SeriesOptionsType = {
        id: `${e.point.name}-drilldown`,
        type: "column",
        colorByPoint: true,
        //@ts-ignore
        dataCustom: dataCustom,
        data: Object.keys(result.data[0].data).map((item) => ([item, result.data[0].data[item]]))
      }
      this.addSeriesAsDrilldown(e.point, series)
      const widgetSettings = result.data[0].widget_settings
      updateAnalytics(dataCustom.setAnalytics, widgetSettings)
    }
    this.hideLoading()
  }
  if ((e.point as any).drilldownFilter) getData()
}

const drillupCallback: Highcharts.DrillupCallbackFunction = function() {
  if (!this.series?.length) return
  const dataCustom: PropTypes = (this.series[0].userOptions as any).dataCustom
  const updateData = async () => {
    const result = await analyticsUpdateWidget(dataCustom.widgetSettings, dataCustom.collection)
    if (result.data.length) {
      const widgetSettings = result.data[0].widget_settings
      updateAnalytics(dataCustom.setAnalytics, widgetSettings)
    }
  }
  updateData()
}

const updateAnalytics = (setAnalytics: (value: React.SetStateAction<AnalyticsType[] | undefined>) => void, widgetSettings: WidgetSettings) => {
  setAnalytics(prevState => [...prevState?.map(chart => chart.widget_settings.id === widgetSettings.id ? {...chart, widget_settings: widgetSettings} : chart) ?? []])
}

const BarChart = (props: PropTypes) => {
  const { chartData, widgetSettings } = props
  
  const refChart = useRef();
  const [options] = useState<Highcharts.Options>(getOptions());

  const chartRef = (): Highcharts.Chart | null => {
    if (!refChart?.current) return null
    return (refChart?.current as unknown as HighchartsReact.RefObject).chart;
  };

  const getChartData = async () => {
    const chart = chartRef()
    if (!chart) return
    //@ts-ignore
    options.chart.events.drillup = undefined
    chart.update(options)
    chart.drillUp()
    let data: any = chartData
    if (widgetSettings.filter) {
      const result = await analyticsUpdateWidget(props.widgetSettings, props.collection);
      data = result.data[0].data
      const widgetSettings = result.data[0].widget_settings
      updateAnalytics(props.setAnalytics, widgetSettings)
    }
    //@ts-ignore
    options.chart.events.drillup = drillupCallback
    //@ts-ignore
    options.series[0].dataCustom = props
    //@ts-ignore
    options.series[0].data = Object.keys(data).map((item) => ({ name: item, y: data[item], drilldownFilter: item, drilldown: true }));
    //@ts-ignore
    chart.update(options, true, true)
    setTimeout(() => {
      if (widgetSettings.filter) {
        const point = chart.series[0].points.find(item => item.name === widgetSettings.filter)
        point?.doDrilldown()
      }
    });
  }

  useEffect(() => {
    let chart = chartRef()
    if (!chart) return
    chart.series.forEach((_, index) => {
      // @ts-ignore
      chart.series[index].userOptions.dataCustom = props
    })
  }, [props])

  useEffect(() => {
    getChartData()
  }, [chartData])

  {/* @ts-ignore */ }
  return <HighchartsReact ref={refChart} highcharts={Highcharts} options={options} />;
};

export default React.memo(BarChart);
