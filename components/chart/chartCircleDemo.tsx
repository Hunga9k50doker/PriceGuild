import React, { useEffect, useRef } from "react";
import { UtilsColorGrade } from "model/data_sport/pricing_grid";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

type PropTypes = {
  code?: string;
  dispatchReducer: any;
  dataGraded: any;
  keyData: string;
}

const options = {
  chart: {
    plotBackgroundColor: null,
    plotBorderWidth: null,
    plotShadow: false,
    type: 'pie',
  },
  colors: [],
  title: {
    text: '',
  },
  tooltip: {
    borderRadius: 6,
    borderColor: '#18213A',
    pointFormat: '{point.percentage:.1f}%',
    backgroundColor: '#18213A',
    style: {color: "#FFF",}
  },
  accessibility: {
    point: {
      valueSuffix: '%',
    },
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: 'pointer',
      dataLabels: {
        format: '<b>{point.name}</b><br>{point.percentage:.1f} %',
      }
    },
    series: {
      point: {
        events: {
          click: function (e: any) {
            if (!e?.point?.selected) {
              //
            }
          }
        }
      },
    }
  },
  series: [ {
      colorByPoint: true,
      data: [],
      states: {
        hover: {
          halo: {
            size: 6,
          }
        }
      }
    },
  ],
};

const ChartCircleDemo = ({ code, dispatchReducer, dataGraded, keyData }: PropTypes) => {

  const refChart = useRef();

  const dataSection = (dataGraded: any) => {
    var chart = (refChart.current as unknown as HighchartsReact.RefObject).chart;

    if (!chart) {
      return;
    }

    let colors: any[] = [];

    let allCount = 0;
    options.series[0].data.length = 0;

    Array.from(dataGraded.keys()).map((gradeCompany: any, index) => {
      let count = 0;
      dataGraded.get(gradeCompany)?.forEach((element: any) => {
        count += +element.count;
      });
      allCount += count;
      // @ts-ignore
      options.series[0].data.push({ name: gradeCompany, y: count, sliced: gradeCompany === keyData, selected: false });
      colors.push(UtilsColorGrade.getColorGrade(gradeCompany));
      return {};
    });

    // set percent
    options.series[0].data.forEach((element) => {
      // @ts-ignore
      element.y = +((element.y / allCount) * 100).toFixed(0);
    });

    options.plotOptions.series.point.events.click = (e: any) => {
      if (!e?.point?.selected) {
        dispatchReducer({ type: 'UPDATE_KEY_GRADE', key: e?.point?.name });
      }
    };
    // @ts-ignore
    options.colors = colors;
    // @ts-ignore
    chart.update(options);
  };

  useEffect(() => {
    dataSection(dataGraded);
  }, [keyData, dataGraded]);

  // @ts-ignore
  return <HighchartsReact ref={refChart} highcharts={Highcharts} options={options} />;
};

export default React.memo(ChartCircleDemo);
