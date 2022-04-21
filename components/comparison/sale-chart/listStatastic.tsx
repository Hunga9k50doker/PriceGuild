import React, { useState, useImperativeHandle, useEffect } from 'react';
import Select, { components } from "react-select";
import { ChartData, HoldChartData } from "./data";
import IconQuestion from "assets/images/question.svg";
import {
  HelperSales, PricingGridModel,
} from "model/data_sport/pricing_grid";
import { formatCurrency, formatNumber } from "utils/helper"
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import _ from 'lodash';
import { useSelector } from "react-redux";
import Selectors from "redux/selectors";
interface Props {
  onHideChart: (status: boolean, cardId: Array<string>) => void;
  onChangeGrade: (cardGrade: PricingGridModel, cardId: string) => void;
}

export interface RefType {
  updateChartData: (chartData: ChartData) => void;
}

const ListStatastic = React.forwardRef<RefType, Props>((props, ref) => {
  const [statastics, setStatastics] = useState<Array<HoldChartData>>([])
  // const [cardSelected, setCardSelected] = useState<Array<any>>([]);
  const _addDataToChart = (chartData: ChartData) => {
    // @ts-ignore
    setStatastics(Object.values(chartData));
    // //@ts-ignore
    // setCardSelected(Object.keys(chartData))
  }
  useImperativeHandle(ref, () => ({
    updateChartData: _addDataToChart,
  }));
  const { currency } = useSelector(Selectors.config);
  // @ts-ignore
  const DropdownIndicator = props => {
    return (
      components.DropdownIndicator && (
        <components.DropdownIndicator {...props}>
          {!props.selectProps.menuIsOpen ? <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M6.00006 4.92426L9.96973 0.95459L11.0304 2.01525L6.00006 7.04558L0.969727 2.01525L2.03039 0.95459L6.00006 4.92426Z" fill="#6D7588" />
          </svg>
            : <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M6.00006 3.07591L2.03039 7.04558L0.969727 5.98492L6.00006 0.95459L11.0304 5.98492L9.96973 7.04558L6.00006 3.07591Z" fill="#6D7588" />
            </svg>
          }</components.DropdownIndicator>
      )
    );
  };

  const onChangeChart = (e: any, item: HoldChartData) => {
    if (e.target.checked) {
      props.onHideChart && props.onHideChart(e.target.checked, [...getItemShow(), item.cardId]);
      //return setCardSelected([...cardSelected, item.cardId]);
    } else {
      //setCardSelected([...cardSelected.filter(cards => cards !== item.cardId)]);
      props.onHideChart && props.onHideChart(e.target.checked, [item.cardId]);
    }
  } 

  const onCheckAll = (e: any) => {
    //setCardSelected(e.target.checked ? statastics.map((item=> item.cardId)) : [])
    props.onHideChart && props.onHideChart(e.target.checked, statastics.map((item=> item.cardId)));

  }

  const getItemShow = () => {
    return statastics.filter(it => it.isShow).map(it => it.cardId)
  }

  return (
    <div className="table-responsive mt-3">
      <table className="table min-w-1140">
        <thead>
          <tr>
            <th scope="col">
              <input
                className="form-check-input cursor-pointer"
                type="checkbox"
                value=""
                onChange={onCheckAll}
                checked={getItemShow().length === statastics.length}
              />
            </th>
            <th scope="col">Card name</th>
            <th scope="col">Grading</th>
            <th scope="col">Latest Value</th>
            <th scope="col">Lowest Value</th>
            <th scope="col">Highest Value</th>
            <th scope="col">Average Value</th>
            <th scope="col">Total Trades</th>
            <th scope="col">
              <span className="me-2">Change</span>
              <span className="position-relative tool-tip-custom">
                <img src={IconQuestion} />
                <span className="position-absolute tool-tip-text">
                  % from first data
                </span>
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {statastics.map((item: HoldChartData) => {
            let dataSelect = item.saleState.listCardGrade.map(
              (item: any, index: number) => {
                let name = HelperSales.getStringGrade(
                  item.gradeCompany,
                  item.gradeValue
                );
                return { label: name, value: name, index };
              }
            );
            const stats = item.calcMaLine.stats
            const isNoData = _.isEmpty(item?.calcMaLine?.price)
            return (
              <tr key={item.cardId}>
                <td>
                  <input
                    className="form-check-input cursor-pointer"
                    type="checkbox"
                    value=""
                    readOnly={isNoData}
                    disabled={isNoData}
                    onChange={(e)=> onChangeChart(e, item)}
                    checked={item.isShow && !isNoData}
                  />
                </td>
                <td>
                  <OverlayTrigger overlay={<Tooltip>{item?.cardData?.webName ?? ""} - {item?.cardData?.onCardCode ?? ""}</Tooltip>}>
                    {({ ref, ...triggerHandler }) => (
                      <div ref={ref} {...triggerHandler}>{item?.cardName ?? ""}</div>
                    )}
                  </OverlayTrigger>
                </td>
                {/* custom-select-table */}
                <td className="hidden-select">
                  <Select
                    value={dataSelect[item.cardGradeSelected]}
                    className="react-select"
                    // menuIsOpen={true}
                    styles={{
                      control: (styles) => ({ ...styles, minWidth: 160 })
                    }}
                    classNamePrefix="react-select"
                    options={dataSelect ?? []}
                    onChange={(it) => {
                      it && props.onChangeGrade(item.saleState.listCardGrade[it.index], item.cardId)
                    }}
                    menuPosition="fixed"
                    placeholder={isNoData ? 'N/A' : 'Select...'}
                    components={{ DropdownIndicator }}
                  />
                </td>
                <td>{isNoData ? 'N/A' : formatCurrency(stats.latest, currency)}</td>
                <td>{isNoData ? 'N/A' : formatCurrency(stats.min, currency)}</td>
                <td>{isNoData ? 'N/A' : formatCurrency(stats.max, currency)}</td>
                <td>{isNoData ? 'N/A' : formatCurrency(stats.average, currency)}</td>
                <td>{isNoData ? 'N/A' : formatNumber(stats.total_trades)}</td>
                <td>{isNoData ? 'N/A' : (<>{formatNumber(stats.change)}%</>)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
})

export default React.memo(ListStatastic);