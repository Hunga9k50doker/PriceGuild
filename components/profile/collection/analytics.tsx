import React, { useState } from 'react';
import { useRouter } from 'next/router'
import Link from 'next/link'
import { formatCurrency } from "utils/helper"
import "react-datepicker/dist/react-datepicker.css";
import UpsertChart from "components/modal/chart/upsertChart"
import { api } from 'configs/axios';
import { AnalyticsType, WidgetSettings } from "interfaces"
import { MetaData } from "utils/constant"
import Swal from 'sweetalert2'
// import 'sweetalert2/src/sweetalert2.scss'
import { ToastSystem } from "helper/toast_system";
import { isEmpty } from "lodash"
import PieChart from 'components/chart/pieChart';
import TableChart from 'components/chart/tableChart';
import BarChart from 'components/chart/barChart';
import ChartLine from 'components/chart/chartLine';
import ArrowProfile from "assets/images/arrow_profile.svg";
import IconDot3 from "assets/images/dot-3.svg";
import Skeleton from "react-loading-skeleton";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";

type PropTypes = {
  collection?: string
}

type DataChartTable = {
  car_name?: string,
  min?: number,
  max?: number,
  latest?: number,
  average?: number;
}
type ChartForm = {
  type: string,
  lv1: any;
  lv2: any;
  data: any
};


const CollectionAnalytics = ({ collection }: PropTypes) => {

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [analytics, setAnalytics] = useState<AnalyticsType[]>();
  const [chartDetail, setChartDetail] = useState<WidgetSettings | undefined>();
  const [collectionDetail, setCollectionDetail] = useState<any>();
  const [isAll, setIsAll] = useState<boolean>(false);
  const router = useRouter();
  const [t, i18n] = useTranslation("common")
  const { register, control, handleSubmit, reset, setValue, formState: { errors } } = useForm<ChartForm>();
  const getData = async () => {
    try {
      const params = {
        group_ref: collection
      }
      const result = await api.v1.analytics.analyticsGetWidgetData(params);
      if (result.success) {
        console.log(result)
        setAnalytics(result.data.widget_data);
        setCollectionDetail(result.data.collection)
      }
    }
    catch (err) {

    }
  }

  React.useEffect(() => {
    getData();
    if(router.asPath === "/profile/portfolio/analytics") {
      setIsAll(true);
    }
  }, [])

  const onHandleChart = async (e: WidgetSettings | undefined = undefined) => {
    setChartDetail(e)
    setIsOpen(true)
  }

  const getTitleDrilldown = (seting: WidgetSettings) => {
    let title_set = MetaData.analyzeDataType.find(item => item.value === seting.data)?.label ?? ""
    const drillDownGroupedBy = MetaData.groupedBy.find(item => item.value.toString() === seting.lv2)?.label ?? ""
    switch (seting.data) {
      case "total":
        title_set = title_set + ' from ' + seting.filter
        break;
      case "totalUni":
        title_set = title_set + ' from ' + seting.filter
        break;
      case "average":
        title_set = title_set + ' from ' + seting.filter
        break;
      case "total_value":
        title_set = title_set + ' of ' + seting.filter + ' cards'
        break;
    }
    title_set = title_set + ' by ' + drillDownGroupedBy
    return title_set
  }

  const renderNameChart = (seting: WidgetSettings) => {
    const isDrillDown = !!seting.filter;
    if (isDrillDown) {
      switch (seting.type) {
        case "column":
          return getTitleDrilldown(seting)
        case "pie":
          return getTitleDrilldown(seting)
        case "line":
          return `Card Collection Total Value by ${MetaData.groupedBy.find(item => item.value.toString() === seting.lv2)?.label ?? ""}`;
        default:
          return `${MetaData.analyzeDataType.find(item => item.value === seting.data)?.label ?? ""} ${seting.data === "total_value" ? 'of' : 'from'} by ${MetaData.groupedBy.find(item => item.value.toString() === seting.lv2)?.label ?? ""}`;
      }
    }

    switch (seting.type) {
      case "line":
        return `Card Collection Total Value by ${MetaData.groupedBy.find(item => item.value.toString() === seting.lv1)?.label}`;
      default:
        return `${MetaData.analyzeDataType.find(item => item.value === seting.data)?.label ?? ""} by ${MetaData.groupedBy.find(item => item.value.toString() === seting.lv1)?.label}`;
    }
  }

  const renderNameTable = (seting: any) => {
    const isDrillDown = false;
    if (isDrillDown) {
      switch (seting.type) {
        case "line":
          return `Card Collection Total Value`;
        default:
          return `${MetaData.analyzeDataType.find(item => item.value === seting.data)?.label ?? ""} ${seting.data === "total_value" ? 'of' : 'from'}`;
      }
    }

    switch (seting.type) {
      case "line":
        return `Card Collection Total Value `;
      default:
        return `${MetaData.analyzeDataType.find(item => item.value === seting.data)?.label ?? ""} `;
    }
  }

  const onSuccess = (item: AnalyticsType, isCreated: boolean) => {
    if (isCreated) {
      setAnalytics(prevState => [...prevState ?? [], item])
      setIsOpen(false)
    }
    else {
      setAnalytics(prevState => [...prevState?.map(chart => chart.widget_settings.id === chartDetail?.id ? item : chart) ?? []])
      setIsOpen(false)
    }
  }

  const onConfirmRemove = (id: number) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        onRemove(id)
      }
    })
  }

  const onRemove = async (id: number) => {
    try {
      const params = {
        widgetid: id
      }
      let result = await api.v1.analytics.analyticsDeleteWidget(params);
      if (result.success) {
        setAnalytics(prevState => [...prevState?.filter(chart => chart.widget_settings.id !== id) ?? []]);
        setIsOpen(false);
        return ToastSystem.success(result.message);
      }
      ToastSystem.error(result.message);
    }
    catch (err) {
      console.log(err)
    }
  }

  const renderTableChartLine = (item: any) => {
     return (
      <div className="table-responsive table-config">
        <table className="table min-w-1140">
          <thead>
            <tr>
              <th scope="col">
                <input
                  className="form-check-input cursor-pointer"
                  type="checkbox"
                  value=""
                />
              </th>
              <th scope="col"> Card name </th>
              <th scope="col"> Latest Value </th>
              <th scope="col"> Lowest Value </th>
              <th scope="col"> Highest Value </th>
              <th scope="col"> Average Value </th>    
            </tr>
          </thead>
          <tbody>
             {item?.stats.map((value:any,key:any) =>
              <tr>
                <td>
                  <input
                    className="form-check-input cursor-pointer"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td> {value?.year} </td>
                <td> {formatCurrency(value?.last || 0)} </td>
                <td> {formatCurrency(value?.min || 0)} </td>
                <td> {formatCurrency( value?.max|| 0)} </td>
                <td> {formatCurrency( value?.avg || 0)} </td>
              </tr>
            )} 
          </tbody>
        </table>
      </div>
    );
  }

  const isNumber = (table_data:string) => {
    return ( table_data === 'totalUni' || table_data === 'total' );
  }
  const onChange = async (e:any, data: any, ) => {
    console.log(e.value, "s")
    const params = {
      group_ref: collection ?? "all",
      widgetid: data.widget_settings.id,
      widget_settings: {
        type: data.widget_settings.type,
        lv1: data.widget_settings.lv1,
        lv2: e.value.toString(),
        data: data.widget_settings.data,
        user_pp: "n",
        moving_av: "28",
      }
    }
    let result:any = null;
    result = await api.v1.analytics.analyticsUpdateWidget(params);
    if (result.success) {
      if (result.data.length) {
        setAnalytics(prevState => [...prevState?.map(chart => chart.widget_settings.id === result.data[0]?.widget_settings.id  ? result.data[0] : chart) ?? []])
      }
      return ToastSystem.success(result.message);
    }
  }
  const renderChart = (item: AnalyticsType, key: number) => {
    switch (item.widget_settings.type) {
      case "pie":
        return <div key={key}>
          <div className="d-flex justify-content-between align-items-center mb-2 profile-collections-analytics-item-title">
            <h3 className="mb-0 title-profile fs-40">{renderNameChart(item.widget_settings)}</h3>
            {key == 0 && 
              <div className="d-flex justify-content-end mt-3">
                <button type="button" onClick={() => onHandleChart()} className="ms-3 btn btn-primary--custom">Add Widget</button>
              </div>
            }
          </div>
          <div className="row  m-0 mt-4 border-chart p-3">
            <div className="d-flex justify-content-end align-items-center p-0">
              <div className="d-flex justify-content-between date-filter align-items-center">
                <div className="option-collection ms-2">
                  <div className="dropdown">
                    <button className="btn dropdown-toggle p-0" type="button" id="dropdownMenu2" data-bs-toggle="dropdown" aria-expanded="false">
                      <img src={IconDot3} alt="" title="" />
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenu2">
                      <li><button onClick={() => onHandleChart(item.widget_settings)} className="dropdown-item" type="button">Edit Widget</button></li>
                      <li><button onClick={() => onConfirmRemove(item.widget_settings.id)} className="dropdown-item" type="button">Remove Widget</button></li>
                      {/* <li className="dropdown-item p-12" onClick={(e) =>{e.stopPropagation()}}>
                        <label htmlFor="" className="form-label">Drill-down group by</label>
                        <div className="custom-select-56">
                              <Select
                                value={MetaData.groupedBy.find(item1 => item1.value.toString() === item.widget_settings?.lv2) ?? { value: 1, label: "Year" }}
                                onChange={(e) => onChange(e, item )}
                                classNamePrefix="select-price"
                                className="select-price customScroll"
                                options={MetaData.groupedBy} />
                        </div>
                      </li> */}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ margin: "0 auto" }} className="d-flex justify-content-center align-items-center">
              <PieChart 
                widgetSettings={item.widget_settings}
                collection={collection}
                chartData={item.data} 
                setAnalytics={setAnalytics}
              />
            </div>
          </div>
        </div>
      case "column":
        return <div key={key}>
          <div className="d-flex justify-content-between align-items-center mb-2 profile-collections-analytics-item-title">
            <h3 className="mb-0 title-profile fs-40">{renderNameChart(item.widget_settings)}</h3>
            {key == 0 && 
              <div className="d-flex justify-content-end mt-3">
                <button type="button" onClick={() => onHandleChart()} className="ms-3 btn btn-primary--custom">Add Widget</button>
              </div>
            }
          </div>
          <div className="row  m-0 mt-4 border-chart p-3">
            <div className="d-flex justify-content-end align-items-center p-0">
              <div className="d-flex justify-content-between date-filter align-items-center ">
                <div className="option-collection ms-2">
                  <div className="dropdown">
                    <button className="btn dropdown-toggle p-0" type="button" id="dropdownMenu2" data-bs-toggle="dropdown" aria-expanded="false">
                      <img src={IconDot3} alt="" title="" />
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenu2">
                      <li><button onClick={() => onHandleChart(item.widget_settings)} className="dropdown-item" type="button">Edit Widget</button></li>
                      <li><button onClick={() => onConfirmRemove(item.widget_settings.id)} className="dropdown-item" type="button">Remove Widget</button></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ margin: "0 auto" }} className="w-100">
              <BarChart 
                widgetSettings={item.widget_settings}
                collection={collection}
                chartData={item.data} 
                setAnalytics={setAnalytics}
              />
            </div>
          </div>
        </div>
      case "table":
        return <div key={key}>
          <div className="d-flex justify-content-between align-items-center mb-2 profile-collections-analytics-item-title">
            <h3 className="mb-0 title-profile fs-40">{renderNameChart(item.widget_settings)}</h3>
            {key == 0 && 
              <div className="d-flex justify-content-end mt-3">
                <button type="button" onClick={() => onHandleChart()} className="ms-3 btn btn-primary--custom">Add Widget</button>
              </div>
            }
          </div>
          <div className="row m-0 mt-4 border-chart p-3">
            <div className="d-flex justify-content-end align-items-center p-0">
              <div className="d-flex justify-content-between date-filter align-items-center">
                <div className="option-collection ms-2">
                  <div className="dropdown">
                    <button className="btn dropdown-toggle p-0" type="button" id="dropdownMenu2" data-bs-toggle="dropdown" aria-expanded="false">
                      <img src={IconDot3} alt="" title="" />
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenu2">
                      <li><button onClick={() => onHandleChart(item.widget_settings)} className="dropdown-item" type="button">Edit Widget</button></li>
                      <li><button onClick={() => onConfirmRemove(item.widget_settings.id)} className="dropdown-item" type="button">Remove Widget</button></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="">
              <TableChart table_data={item.widget_settings.data} name_column={renderNameTable(item.widget_settings)} type={item.widget_settings.lv1} chartData={item.data} />
            </div>
          </div>
        </div>
        default:
          return <div key={key}>
            <div className="d-flex justify-content-between align-items-center mb-2 profile-collections-analytics-item-title">
              <h3 className="mb-0 title-profile fs-40">{renderNameChart(item.widget_settings)}</h3>
              {key == 0 && 
                <div className="d-flex justify-content-end mt-3">
                  <button type="button" onClick={() => onHandleChart()} className="ms-3 btn btn-primary--custom">Add Widget</button>
                </div>
              }
            </div>
            <div className=" border-chart p-3 mt-4">
              <div className="d-flex justify-content-end align-items-center p-0">
                <div className="d-flex justify-content-between date-filter align-items-center ">
                  <div className="option-collection ms-2">
                    <div className="dropdown">
                      <button className="btn dropdown-toggle p-0" type="button" id="dropdownMenu2" data-bs-toggle="dropdown" aria-expanded="false">
                        <img src={IconDot3} alt="" title="" />
                      </button>
                      <ul className="dropdown-menu" aria-labelledby="dropdownMenu2">
                        <li><button onClick={() => onHandleChart(item.widget_settings)} className="dropdown-item" type="button">Edit Widget</button></li>
                        <li><button onClick={() => onConfirmRemove(item.widget_settings.id)} className="dropdown-item" type="button">Remove Widget</button></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <ChartLine
                onConfirmRemove={onConfirmRemove}
                onHandleChart={onHandleChart}
                widget_settings={item.widget_settings}
                chartData={item.chart_data} 
                stats={item.stats || []} 
              />
            </div>
          </div>
    }
  }

  return (
    <div className="profile-collections-analytics">
      { Boolean(isAll) ? <nav aria-label="breadcrumb" className="breadcrumb-nav">
        <ol className="breadcrumb">
        <li className="breadcrumb-item">
            <Link href={`/profile/portfolio`}>
              <a title={t('portfolio.text')}>
                {t('portfolio.text')}
              </a>
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">Analytics </li>
        </ol>
        
      </nav> :
        isEmpty(collectionDetail)  ? <Skeleton style={{ width: 100 }} /> :<nav aria-label="breadcrumb" className="breadcrumb-nav">
          <ol className="breadcrumb">
          <li className="breadcrumb-item">
              <Link href={`/profile/portfolio`}>
                <a title={t('portfolio.text')}>
                  {t('portfolio.text')}
                </a>
              </Link>
            </li>
            <li className="breadcrumb-item">
              <Link href={`/profile/portfolio/${collectionDetail?.[0]?.id ?? collectionDetail?.id}/${collectionDetail?.[0]?.name ?? collectionDetail?.name}`} >
                <a title={collectionDetail?.[0]?.name ?? collectionDetail?.name}>
                  {collectionDetail?.[0]?.name ?? collectionDetail?.name}
                </a>
              </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">Analytics </li>
          </ol>
        </nav>
      }
      {
        Boolean(isAll)  ? <></> :isEmpty(collectionDetail) ? <Skeleton style={{ width: 100 }} /> : <div className="only-mobile">
        <Link href={`/profile/portfolio/${collectionDetail?.[0]?.id ?? collectionDetail?.id}/${collectionDetail?.[0]?.name ?? collectionDetail?.name}`} >
          <a className="profile-collections-analytics-head" title={collectionDetail?.[0]?.name ?? collectionDetail?.name}>
            <img  src={ArrowProfile} alt="" />
            {collectionDetail?.[0]?.name ?? collectionDetail?.name}
          </a>
        </Link>
      </div>
      }
      
      {isEmpty(analytics) && <div className="d-flex mt-3 justify-content-center">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div> }
      {analytics?.map((item, key) => 
        <div className="profile-collections-analytics-item">
          {renderChart(item, key)}
        </div>)}
      
      <UpsertChart
        onConfirmRemove={onConfirmRemove}
        onSuccess={onSuccess}
        chartDetail={chartDetail}
        collection={collection}
        isOpen={isOpen}
        setIsOpen={setIsOpen} />
    </div>);
}

export default CollectionAnalytics;
