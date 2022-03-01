import { Chart, Interval, Tooltip } from 'bizcharts';
import React from 'react';

const data = [
  { year: '1951', sales: 0 },
  { year: '1952', sales: 52 },
  { year: '1956', sales: 61 },
  { year: '1957', sales: 45 },
  { year: '1958', sales: 48 },
  { year: '1959', sales: 38 },
  { year: '1960', sales: 38 },
  { year: '1962', sales: 38 },
];


const ChartLineDemo = () => {
  return <Chart height={400} autoFit data={data} >
    <Interval position="year*sales" />
    <Tooltip shared />
  </Chart>
}

export default React.memo(ChartLineDemo)