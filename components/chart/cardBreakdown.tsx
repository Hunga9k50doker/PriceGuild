import React, { useEffect, useState, useRef } from 'react';
import { Chart, LineAdvance } from 'bizcharts';
import { SaleData } from "model/data_sport/card_sport";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import moment from 'moment';
import { isEmpty } from 'lodash';
import { formatCurrency, formatNumber, formatCurrencyIcon } from "utils/helper"
import { useSelector } from "react-redux";
import Selectors from "redux/selectors";

type PropsType = {
  price_data?: any;
}
let  options = {
  chart: {
        type: 'area',
        zoomType: 'x',
        marginTop: 50,
        marginBottom: 50,
        borderRadius: 12,
    },
    title: {
        text: ''
    },
    subtitle: {
        text: ''
    },
    xAxis: {
      type: 'datetime',
      crosshair: {
        color: '#6EF6FE',
        width: 1,
      },
      lables: {
        //@ts-ignore
        formatter: function () {
          //@ts-ignore
          return this.value;
        }
      },
    },
    yAxis: {
        title: {
            text: ''
      },
      //@ts-ignore
      labels: {
        //@ts-ignore
        formatter: function () {
          //@ts-ignore
            return `$` + this.value;
        }
      },
    },
    legend: {
        enabled: false
    },
    tooltip: {
        backgroundColor: '#0B0E61',
        useHTML: true,
        headerFormat: '<div style="display: flex; padding: 5px;" class="tooltip-scatter">',
        borderRadius: 6,
        color: '#FFFFFF',
        //@ts-ignore
        pointFormatter: function() {
            //@ts-ignore
            const {y} = this;
            return (
                `
                <div style="color: white">${formatCurrency(y)} </div>
              `
            )
        },
      footerFormat: '</div>',
    },
    plotOptions: {
        area: {
            fillColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [
                      [0, "#FFFFFF"],
                      [1, "#FFFFFF"]
                  ]
            },
            marker: {
              radius: 6,
              color: "#0B0E61"
            },
            lineWidth: 3,
            states: {
                hover: {
                    lineWidth: 3
                }
            },
            threshold: null
        },
        series: {
          marker: {
                enabled: false,
                symbol: 'circle',
                fillColor: '#0B0E61',
                lineWidth: 2,
                // lineColor: '#FFFFFF',
                states: {
                  hover: {
                      symbol: 'circle',
                      fillColor: '#6EF6FE',
                      lineColor: '#FFFFFF',
                      lineWidth: 4
                    }
                }
          },
          label: {
                connectorAllowed: false
          },
          shadow: {
            color: '#6D7588',
          }
        },
    },
    shadow: {
        color: 'rgba(233, 241, 255, 0.35)',
        offsetX: 0,
        offsetY: 12,
        opacity: '0.9',
        width: 10
    },
    series: [{
      name: '$',
      color: '#124DE3',
      shadow: true,
      borderRadius: 20,
      data: [],
      fillColor: {
          linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1.2 },
          stops: [
              //@ts-ignore
              [0, '#124DE333'],
              //@ts-ignore
              [1, '#124DE300']
          ]
      },
      enableMouseTracking: true,
      marker: {
        enabled: false,
      },
      threshold: null
    }],
    drilldown: {
      series: []
    }
};

const ChartCardBreakdown = ({ price_data = {} ,...props }: PropsType) => {
  const { currency } = useSelector(Selectors.config);
  const refChart = useRef();

  const chartRef = (): Highcharts.Chart | null => {
    if (!refChart?.current) {
      return null;
    }
    return (refChart?.current as unknown as HighchartsReact.RefObject).chart;
  };
  useEffect(() => {
    const renderDataChartConfig = () => {
      var chart = chartRef();

      if (chart === null) {
        return;
      }
      let data: any = [];
      //@ts-ignore
      // price_data.forEach((element: any) => {
      //   let item = { ...element };
      //   // item.date =  moment(item?.date, 'YYYY-MM-DD').unix();
      //    item.date =  moment(item?.date, ).format('YYYY');;
      //   data.push([item.date, item.price]);
      // })
      for (const key in price_data) {
        // @ts-ignore
        data = [...data, [+key, +price_data[key]]]
      }
      
      

      options.series[0].data = data;
      // @ts-ignore
      options.tooltip.pointFormatter = 
          function() {
            //@ts-ignore
            const {y} = this;
            return (
              `  <div style="color: white">${formatCurrency(y,currency)} </div>`
            )
        }
        options.yAxis.labels =  {
          //@ts-ignore
          formatter: function () {
            //@ts-ignore
              return `${formatCurrencyIcon(currency)}` + this.value;
          }
        }
      
      
      // @ts-ignore
      chart.update({ ...options } as Highcharts.Options);
    } 
    if (!isEmpty(price_data)) {
      renderDataChartConfig();
      
    }
  },[price_data, currency])


  {/* @ts-ignore */}
  return <HighchartsReact highcharts={Highcharts} options={options} ref={refChart} />;
}


export default React.memo(ChartCardBreakdown)


