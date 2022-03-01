import React, {useState, useEffect} from "react";
import { MetaData } from "utils/constant"
import useWindowDimensions from "utils/useWindowDimensions";
import Modal from "react-bootstrap/Modal";
import { formatNumber, formatCurrency } from "utils/helper"
import _ from "lodash";

type PropTypes = {
  chartData: {
    [key: string]: number;
  }
  type: string;
  name_column?:string;
  table_data?:string;
}

type TypeData = {
  label: string;
  value: number;
}

const PieChart = ({ chartData, type,  name_column = "Number of Cards", table_data = "" }: PropTypes) => {

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
  const [nameSort, setNameSort] = useState<string>("");
  useEffect(() => { 
      setDataFilter(_.orderBy(data, [statusSort.name], [statusSort.desc ? 'desc': 'asc']));
  },[data])

  const typeName = React.useMemo(() => {
    return MetaData.groupedBy.find(item => item.value.toString() === type)?.label ?? "Year"
  }, [type]);

  const { width } = useWindowDimensions();
  const [isOpenSeeFullTable, setIsOpenSeeFullTable] = React.useState(false);

  const handleSeeFullTable = () => {
    setIsOpenSeeFullTable(true);
  };

  const [isLimitTable, setIsLimitTable] = useState<boolean>(true);
  const renderModalTable = () => {
    return (
      <Modal centered show={isOpenSeeFullTable} fullscreen={true} className="modal-seefull modal-seefull-card-detail">
        <Modal.Header>
          <Modal.Title className="text-truncate"></Modal.Title>
          <a onClick={() => {setIsOpenSeeFullTable(false);setIsLimitTable(true)}}>Close</a>
        </Modal.Header>
        <Modal.Body className="customScroll">{renderTable()}</Modal.Body>
      </Modal>
    );
  };

  const renderTable = () => {
    return (
      <div style={{ maxHeight: 400 }} className="table-responsive content-table-custom table-chart content-table-custom--body">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th scope="col"> {typeName} </th>
              <th scope="col"> Number of Cards </th>
            </tr>
          </thead>
          <tbody>
            {dataFilter?.map((item, key) => 
            <tr key={key}>
              <th scope="row">{item.label}</th>
              <td> {item.value} </td>
            </tr>)}
          </tbody>
        </table>
      </div>
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
  
  return (
    <>
      <div className="table-responsive content-table-custom table-chart customScroll content-table-custom--body table-scroll">
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
            Boolean(key < (width < 768 ? 10 :data?.length )) &&
            <tr key={key}>
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
    </>
  );
}

export default React.memo(PieChart);