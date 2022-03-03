import React, { useEffect, useRef, useState } from "react";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { formatCurrency, formatNumber } from "utils/helper"
import drilldown from 'highcharts/modules/drilldown.js';
import { api } from 'configs/axios';
import { AnalyticsType, WidgetSettings } from "interfaces";

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
  chartData: { [key: string]: number },
  widgetSettings: WidgetSettings,
  collection?: string,
  setAnalytics: (value: React.SetStateAction<AnalyticsType[] | undefined>) => void
};

const isNumber = (table_data:string) => {
  return ( table_data === 'totalUni' || table_data === 'total' );
}

const analyticsUpdateWidget = async (data: PropTypes, filter?: string) => {
  const params = {
    group_ref: data.collection ?? "all",
    widgetid: data.widgetSettings.id,
    widget_settings: {
      type: data.widgetSettings.type,
      lv1: data.widgetSettings.lv1,
      lv2: data.widgetSettings.lv2,
      data: data.widgetSettings.data,
      user_pp: "n",
      moving_av: "28",
      filter: filter
    }
  }
  const res = await api.v1.analytics.analyticsUpdateWidget(params);
  return res
}


const getOptions = (): Highcharts.Options => {
  return {
    chart: {
      plotBackgroundColor: undefined,
      plotBorderWidth: undefined,
      plotShadow: false,
      type: "pie",
      events: {
        drilldown: function (e) {
          const getData = async () => {
            this.showLoading()
            const dataCustom: PropTypes = (e.point.series.userOptions as any).dataCustom
            const result = await analyticsUpdateWidget(dataCustom, (e.point as any).drilldownFilter);
            if (result.data.length) {
              const series: Highcharts.SeriesOptionsType = {
                id: e.point.name,
                name: e.point.name,
                type: 'pie',
                colorByPoint: true,
                //@ts-ignore
                dataCustom: dataCustom,
                data: Object.keys(result.data[0].data).map((item) => ({ name: item, y: result.data[0].data[item] }))
              }
              this.addSeriesAsDrilldown(e.point, series)
              const widgetSettings = result.data[0].widget_settings
              dataCustom.setAnalytics(prevState => [...prevState?.map(chart => chart.widget_settings.id === widgetSettings.id ? {...chart, widget_settings: widgetSettings} : chart) ?? []])
            }
            this.hideLoading()
          }
          if ((e.point as any).drilldownFilter) getData()
        },
      }
    },
    title: {
      text: "",
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
      pointFormatter: function () {
        const dataCustom: PropTypes = (this.series.userOptions as any).dataCustom
        //@ts-ignore
        const { y } = this;
        return (
          `<div style="color: white">${isNumber(dataCustom.widgetSettings.data) ? formatNumber(y) : formatCurrency(y)}</div>`
        )
      },
      footerFormat: '</div>',
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          //@ts-ignore
          formatter: function () {
            const dataCustom: PropTypes = (this.series.userOptions as any).dataCustom
            //@ts-ignore
            return `<b>${this.key}</b>: ${isNumber(dataCustom.widgetSettings.data) ? formatNumber(this.y) : formatCurrency(this.y)}`
          },
        },
      },
    },
    series: [
      {
        id: 'brands',
        name: "Brands",
        type: 'pie',
        colorByPoint: true,
        data: [],
      },
    ],
    drilldown: {
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
    }
  };
}

const drillup: Highcharts.DrillupCallbackFunction = function() {
  if (!this.series?.length) return
  const dataCustom: PropTypes = (this.series[0].userOptions as any).dataCustom
  const updateData = async () => {
    const result = await analyticsUpdateWidget(dataCustom)
    if (result.data.length) {
      const widgetSettings = result.data[0].widget_settings
      dataCustom.setAnalytics(prevState => [...prevState?.map(chart => chart.widget_settings.id === widgetSettings.id ? {...chart, widget_settings: widgetSettings} : chart) ?? []])
    }
  }
  updateData()
}

const PieChart = (props: PropTypes) => {
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
      const result = await analyticsUpdateWidget(props);
      data = result.data[0].data
    }
    //@ts-ignore
    options.chart.events.drillup = drillup
    //@ts-ignore
    options.series[0].dataCustom = props
    //@ts-ignore
    options.series[0].data = Object.keys(data).map((item) => ({ name: item, y: data[item], drilldownFilter: item,  drilldown: true }))
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
    // @ts-ignore
    chart.series[0].userOptions.dataCustom = props
  }, [props])

  useEffect(() => {
    getChartData()
  }, [chartData]);

  {/* @ts-ignore */ }
  return <HighchartsReact ref={refChart} highcharts={Highcharts} options={options} />;

};

export default React.memo(PieChart);


// const data = React.useMemo(() => {
//   const optionState = options(isNumber);
//   //@ts-ignore
//   optionState.series[0].data = Object.keys(chartData).map((item) => ({name: item, y: chartData[item], drilldown: true}));
//   return optionState;
// }, [chartData]);