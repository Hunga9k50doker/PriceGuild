import { useEffect } from 'react';
import {useCardDetail} from '../BusinessLogic/setup'

type PropTypes = {
  onUpdateCard?: (item: any) => void;
}

const ChartFlow = (props: PropTypes) => {
  const {state: {cardData, saleChartState}} = useCardDetail();
 
  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    if (cardData.code && saleChartState.listCardGrade.length) {
      props.onUpdateCard && props.onUpdateCard({ ...cardData, saleChartState, cardData })
    }
   
  },[saleChartState.listCardGrade, cardData]);
  return null;
}
export default ChartFlow