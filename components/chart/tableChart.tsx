import React, {useState, useEffect} from "react";
import { MetaData } from "utils/constant"
import useWindowDimensions from "utils/useWindowDimensions";
import Modal from "react-bootstrap/Modal";
import { formatNumber, formatCurrency } from "utils/helper"
import _ from "lodash";
import { AnalyticsType, WidgetSettings } from "interfaces";
import classes from './styles.module.scss'
import { analyticsUpdateWidget } from "./models";
import IconDot3 from "assets/images/dot-3.svg";

type PropTypes = {
  chartData: {[key: string]: number;}
  name_column?:string;
  table_data?:string;
  widgetSettings: WidgetSettings,
  collection?: string,
  setAnalytics: (value: React.SetStateAction<AnalyticsType[] | undefined>) => void,
  onHandleChart: (e?: WidgetSettings | undefined) => Promise<void>,
  onConfirmRemove: (id: number) => void
}

const TableChart = (props: PropTypes) => {

  const {
    chartData,
    name_column = "Number of Cards",
    table_data = "",
    widgetSettings,
    collection,
    setAnalytics,
    onHandleChart,
    onConfirmRemove
  } = props

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const data = React.useMemo(() => {
    return Object.keys(chartData).map(item => ({
      label: item,
      value: chartData[item]
    }))

  }, [chartData]);

  const [statusSort,setStatusSort] = useState<{desc: boolean; name:string; status: boolean;}>({
    desc: false,
    name: "label",
    status:false
  })

  const [dataFilter, setDataFilter] = useState< {label: string;value: number;}[] | undefined>([]);
  
  useEffect(() => { 
      setDataFilter(_.orderBy(data, [statusSort.name], [statusSort.desc ? 'desc': 'asc']));
  },[data])

  const typeName = React.useMemo(() => {
    if (widgetSettings.filter) {
      return MetaData.groupedBy.find(item => item.value.toString() === widgetSettings.lv2)?.label ?? ""
    } else {
      return MetaData.groupedBy.find(item => item.value.toString() === widgetSettings.lv1)?.label ?? "Year"
    }
  }, [widgetSettings.lv1, widgetSettings.lv2, widgetSettings.filter]);

  const { width } = useWindowDimensions();
  const [isOpenSeeFullTable, setIsOpenSeeFullTable] = React.useState(false);

  const handleSeeFullTable = () => {
    setIsOpenSeeFullTable(true);
  };

  const renderModalTable = () => {
    return (
      <Modal centered show={isOpenSeeFullTable} fullscreen={true} className="modal-seefull modal-seefull-card-detail">
        <Modal.Header>
          <Modal.Title className="text-truncate"></Modal.Title>
          <a onClick={() => {setIsOpenSeeFullTable(false);}}>Close</a>
        </Modal.Header>
        <Modal.Body className="customScroll">{renderTable()}</Modal.Body>
      </Modal>
    );
  };

  const renderTable = () => {
    return (
      <>
        {widgetSettings?.filter && (
          <div className={`${classes.drilldownBox} my-2`}>
            <button disabled={isLoading} className={classes.drilldownBtn} onClick={onDrillup}>Back to Main Data {isLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />}</button>
          </div>
        )}
        <div style={{ maxHeight: 400 }} className="table-responsive content-table-custom table-chart content-table-custom--body position-relative">
          { isLoading && <div className={classes.loadingBox}><span className="spinner-border spinner-border-md" role="status" aria-hidden="true" /></div> }
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col"> {typeName} </th>
                <th scope="col"> {name_column} </th>
              </tr>
            </thead>
            <tbody>
              {dataFilter?.map((item, key) => 
              <tr key={key} className={`${!widgetSettings.filter ? classes.drilldown : ''}`} onClick={() => onDrilldown(item.label)}>
                <th scope="row">{item.label}</th>
                <td> {onValue(table_data, item.value)} </td>
              </tr>)}
            </tbody>
          </table>
        </div>
      </>
    )
  }

  const renderSortTable = (name: string, desc: boolean) => {
    if (desc) {
      if(name === statusSort.name && statusSort.desc === desc) {
        return "fa fa-caret-down active";
      }
      return "fa fa-caret-down";
    }
    if(name === statusSort.name && statusSort.desc === desc) {
      return "fa fa-caret-up active";
    }
    return "fa fa-caret-up";
  };

  const onSortTable = (name: string) => {
    if(name === statusSort.name) {
      setStatusSort({
        name:name,
        desc: !statusSort.desc ,
        status: true
      })
    } else {
      setStatusSort({
        name:name,
        desc: true,
        status: true
      })
    }
  };

  const onValue = (table_data: string, value: number) => {
    if ( table_data === 'totalUni' || table_data === 'total' ) {
      return !value ? "N/A" : formatNumber(value);
    } 
    return !value ? "N/A" : formatCurrency(value);
    
  }

  useEffect(()=> {
    
   setDataFilter(_.orderBy(data, [statusSort.name], [statusSort.desc ? 'desc': 'asc']));
  },[statusSort])

  const onDrilldown = async (filter: string) => {
    if (widgetSettings.filter) return
    setIsLoading(true)
    const result = await analyticsUpdateWidget(widgetSettings, collection, filter);
    if (result.data.length) {
      const item = result.data[0]
      setAnalytics(prevState => [...prevState?.map(chart => chart.widget_settings.id === item.widget_settings.id ? item : chart) ?? []])
    }
    setIsLoading(false)
  }

  const onDrillup = async () => {
    if (!widgetSettings.filter) return
    setIsLoading(true)
    const result = await analyticsUpdateWidget(widgetSettings, collection);
    if (result.data.length) {
      const item = result.data[0]
      setAnalytics(prevState => [...prevState?.map(chart => chart.widget_settings.id === item.widget_settings.id ? item : chart) ?? []])
    }
    setIsLoading(false)
  }
  
  return (
    <>
      <div className="d-flex justify-content-end align-items-center p-0" style={{minHeight: 34}}>
        {widgetSettings?.filter && <button disabled={isLoading} className={`${classes.drilldownBtn} me-2`} onClick={onDrillup}>Back to Main Data {isLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />}</button>}
        <div className="d-flex justify-content-between date-filter align-items-center">
          <div className="option-collection ms-2">
            <div className="dropdown">
              <button className="btn dropdown-toggle p-0 d-flex align-items-center" type="button" id="dropdownMenu2" data-bs-toggle="dropdown" aria-expanded="false">
                <img src={IconDot3} alt="" title="" />
              </button>
              <ul className="dropdown-menu" aria-labelledby="dropdownMenu2">
                <li><button onClick={() => onHandleChart(widgetSettings)} className="dropdown-item" type="button">Edit Widget</button></li>
                <li><button onClick={() => onConfirmRemove(widgetSettings.id)} className="dropdown-item" type="button">Remove Widget</button></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="table-responsive content-table-custom table-chart customScroll content-table-custom--body table-scroll position-relative">
          { isLoading && <div className={classes.loadingBox}><span className="spinner-border spinner-border-md" role="status" aria-hidden="true" /></div> }
          <table className="table">
            <thead>
              <tr>
                <th scope="col"> 
                <div
                    onClick={() => onSortTable("label")}
                    className="d-flex cursor-pointer align-items-center"
                  >
                    {typeName}
                    <div className="ms-1 sort-table sort-table--custom cursor-pointer">
                        <i
                          className={`sort-asc ${renderSortTable(
                            "label",
                            true
                          )}`}
                          aria-hidden="true"
                        ></i>
                        <i
                          className={`sort-desc ${renderSortTable(
                            "label",
                            false
                          )}`}
                          aria-hidden="true"
                        ></i>
                    </div>
                  </div>
                </th>
                <th scope="col">
                  <div
                    onClick={() => onSortTable("value")}
                    className="d-flex cursor-pointer align-items-center cursor-pointer"
                  >
                    {name_column}
                    <div className="ms-1 sort-table sort-table--custom ">
                        <i
                          className={`sort-asc ${renderSortTable(
                            "value",
                            true
                          )}`}
                          aria-hidden="true"
                        ></i>
                        <i
                          className={`sort-desc ${renderSortTable(
                            "value",
                            false
                          )}`}
                          aria-hidden="true"
                        ></i>
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {dataFilter?.map((item, key) => 
              Boolean(key < ((width || 0) < 768 ? 10 :data?.length )) &&
              <tr key={key} className={`${!widgetSettings.filter ? classes.drilldown : ''}`} onClick={() => onDrilldown(item.label)}>
                <th scope="row"> {item.label} </th>
                <td> {onValue(table_data, item.value)} </td>
              </tr>)}
            </tbody>
          </table>
        </div>
        {
        data?.length > 10 &&
          <div className="only-mobile">
            <button className="btn-see-full-custom" onClick={handleSeeFullTable} title="See Full Table"> See Full Table </button>
          </div>
        }
        {isOpenSeeFullTable && renderModalTable()}
      </div>
    </>
  );
}

export default React.memo(TableChart);