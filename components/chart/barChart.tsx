import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { formatCurrency, formatNumber } from "utils/helper"

type PropTypes = {
  chartData: {
    [key: string]: number;
  };
  isNumber: boolean
};

const options = (isNumer: boolean) => {
  return {
    chart: {
      type: "column",
      padding: 0,
      with: 900
    },
    title: {
      text: "",
    },
    xAxis: {
      type: "category",
      labels: {
        style: {
          fontSize: "13px",
          fontFamily: "Verdana, sans-serif",
        },
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
      color: '#FFFFFF',
      //@ts-ignore
      pointFormatter: function() {
        //@ts-ignore
        const {y} = this;
        return (
          `<div style="color: white">${ isNumer ? formatNumber(y) : formatCurrency(y)}</div>`
        )
      },
      footerFormat: '</div>',
    },
    series: [
      {
        name: "Population",
        data: [["t", 1]],
      },
    ],
  };
}

const BarChart = ({ chartData, isNumber }: PropTypes) => {
  const data = React.useMemo(() => {
    const optionState = options(isNumber);
    optionState.series[0].data = Object.keys(chartData).map((item) => [
      item,
      chartData[item],
    ]);

    return optionState;
  }, [chartData]);

  return <HighchartsReact highcharts={Highcharts} options={data} />;
};

export default React.memo(BarChart);
