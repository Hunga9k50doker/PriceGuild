import React, {useEffect, useState} from "react";

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
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: "pie",
    },
    title: {
      text: "",
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
          formatter: function() {
              //@ts-ignore
            console.log(this.name)
            //@ts-ignore
            return `<b>${this.key}</b>: ${ isNumer ? formatNumber(this.y) : formatCurrency(this.y) }`
          },
        },
      },
    },
    series: [
      {
        name: "Brands",
        colorByPoint: true,
        data: [
          {
            name: "Chrome",
            y: 61.41,
            sliced: true,
            selected: true,
          },
          {
            name: "Internet Explorer",
            y: 11.84,
          },
          {
            name: "Firefox",
            y: 10.85,
          },
          {
            name: "Edge",
            y: 4.67,
          },
          {
            name: "Safari",
            y: 4.18,
          },
          {
            name: "Sogou Explorer",
            y: 1.64,
          },
          {
            name: "Opera",
            y: 1.6,
          },
          {
            name: "QQ",
            y: 1.2,
          },
          {
            name: "Other",
            y: 2.61,
          },
        ],
      },
    ],
  };
}

const PieChart = ({ chartData, isNumber }: PropTypes) => {
  const [dataFilter,setDataFilter] = useState<any>();
  const data = React.useMemo(() => {
    const optionState = options(isNumber);
    optionState.series[0].data = Object.keys(chartData).map((item) => ({name: item, y: chartData[item]}));
    return optionState;
  }, [chartData]);
  useEffect(() => {
    setDataFilter({...data})
  }, [chartData]);
  
  return <HighchartsReact highcharts={Highcharts} options={dataFilter} />;

};

export default React.memo(PieChart);
