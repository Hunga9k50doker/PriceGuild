import React, { useState } from "react";
import { Chart, Line, Point, Slider } from "bizcharts";

// 数据源
const data = [
  {
    year: "1991",
    value: 3,
  },
  {
    year: "1992",
    value: 4,
  },
  {
    year: "1993",
    value: 3.5,
  },
  {
    year: "1994",
    value: 5,
  },
  {
    year: "1995",
    value: undefined,
  },
  {
    year: "1996",
    value: undefined,
  },
  {
    year: "1997",
    value: 7,
  },
  {
    year: "1998",
    value: 9,
  },
  {
    year: "1999",
    value: 13,
  },
];

const ChartSliderDemo = () => {
  let flag = false;
  const [start] = useState(0.3);
  return (
    <>
      {/* <button className="btn btn-secondary m-2" onClick={() => {
        chart.controllers[4].onValueChange([0.1, 0.9])
        console.log(chart.controllers[4].onValueChange)
      }}>Update start test</button> */}
      <Chart
        padding={[10, 20, 50, 40]}
        autoFit
        height={250}
        data={data}
        scale={{ value: { min: 0 } }}
        // onGetG2Instance={(c => {
        //   // console.log(c.controllers[4].start)
        //   setChart(c)
        //   c.getController('slider').slider.component.on('sliderchange', console.log)
        // })}
      >
        <Line position="year*value" />
        <Point position="year*value" />
        <Slider
          start={start}
          height={20}
          padding={[0, 0, 0, 0]}
          formatter={(v, d, i) => {
            flag = !flag;
            return "";
          }}
        />
      </Chart>
    </>
  );
}

export default React.memo(ChartSliderDemo);