import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Select from "react-select";
import closeImge from "assets/images/close.png"
import { MetaData } from "utils/constant"
import { useForm, Controller } from "react-hook-form";
import { api } from 'configs/axios';
import { ToastSystem } from "helper/toast_system";
import { WidgetSettings, AnalyticsType } from "interfaces"
import { isEmpty } from "lodash"
import IconPieChart from "assets/images/pie-chart.svg"
import IconLineChart from "assets/images/line-chart.svg"
import IconTableChart from "assets/images/table-chart.svg"
import IconBarChart from "assets/images/bar-chart.svg"
import IconDelete from "assets/images/delete_chart.svg"
import {pageView, event} from "libs/ga"

type PropTypes = {
  isOpen: boolean,
  setIsOpen: (isOpen: boolean) => void,
  collection?: string,
  chartDetail?: WidgetSettings
  onSuccess?: (item: AnalyticsType, isCreated: boolean) => void
  onConfirmRemove?: (id: number) => void
}

type ChartForm = {
  type: string,
  lv1: any;
  lv2: any;
  data: any;
  user_pp: any;
};

const UpsertChart = ({ isOpen, setIsOpen, collection, chartDetail, onSuccess, onConfirmRemove }: PropTypes) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { register, control, handleSubmit, reset, setValue, formState: { errors } } = useForm<ChartForm>();
  const onSubmit = async (data: ChartForm) => {
    setIsLoading(true)
    try {
      const params = {
        group_ref: collection ?? "all",
        widgetid: chartDetail?.id,
        widget_settings: {
          type: data.type,
          lv1: data.lv1.value.toString(),
          lv2: data.lv2.value.toString(),
          data: data.data.value.toString(),
          user_pp: data.user_pp.value,
          moving_av: "28",
          //filter: chartDetail?.filter,
        }
      }
      const isCreated = isEmpty(chartDetail);
      let result = null;
      if (isCreated) {
        result = await api.v1.analytics.analyticsAddWidget(params);
      }
      else {
        result = await api.v1.analytics.analyticsUpdateWidget(params);
      }
      setIsLoading(false)
      if (result.success) {
        if (result.data.length) {
          onSuccess && onSuccess(result.data[0], isCreated)
        }
        return ToastSystem.success(result.message);
      }
      ToastSystem.error(result.error);

      /* ga event */
      event({
        action: "anayltics_widget_added",
        params : {
          eventCategory:  'Portfolio',
          eventAction:    'anayltics_widget_added',
          eventLabel:     'Analytics Widget Added'
        }
      })
    }
    catch (err) {
      setIsLoading(false)
      console.log(err)
    }
  }

  // React.useEffect(() => {
  //   setForm()
  // }, [chartDetail])
  React.useEffect(() => {
    if(isOpen) {
      setForm()
    }
  }, [isOpen])


  const setForm = () => {
    setValue("type", chartDetail?.type ?? "pie")
    setValue("data", MetaData.analyzeDataType.find(item => item.value === chartDetail?.data) ?? { value: "total", label: "Number of Cards" })
    setValue("lv1", MetaData.groupedBy.find(item => item.value.toString() === chartDetail?.lv1) ?? { value: 1, label: "Year" })
    setValue("lv2", MetaData.groupedBy.find(item => item.value.toString() === chartDetail?.lv2) ?? { value: 1, label: "Year" })
    setValue("user_pp", MetaData.yesNo.find(item => item.value === chartDetail?.user_pp) ?? MetaData.yesNo[0])
  }

  const onDelete = () => {
    if (chartDetail) {
      onConfirmRemove && onConfirmRemove(chartDetail.id)
    }
  }
  return (
    <Modal
      onHide={() => {
        setIsOpen(false)
      }}
      centered show={isOpen} fullscreen="sm-down" className="modal-profile-collection modal-content--radius modal-profile-collection-chart add-collection-right profile-chart">
      <Modal.Header >
        <Modal.Title>{isEmpty(chartDetail) ? "Add" : "Edit"} Widget</Modal.Title>
        <button
          onClick={() => setIsOpen(false)}
          type="button"
          className="close"
          data-dismiss="modal"
          aria-label="Close"
        >
         <svg width="20" height="20" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.9999 12.4199L17.6799 20.0999L19.5999 18.1799L11.9199 10.4999L19.5999 2.8199L17.6799 0.899902L9.9999 8.5799L2.3199 0.899902L0.399902 2.8199L8.0799 10.4999L0.399902 18.1799L2.3199 20.0999L9.9999 12.4199Z" fill="#6D7588">
           </path>
          </svg>
        </button>
      </Modal.Header>
      <Modal.Body className="customScroll p-32">
        <form>
          <div className="row col-mar-10">
            <div className="mb-3 profile-chart-head">
              <label htmlFor="" className="form-label">Widget Type</label>
              <div className="btn-group w-100" role="group" aria-label="Basic radio toggle button group">
                <div className="d-flex w-100">
                  <div className="btn-group-item w-25">
                    <input {...register("type", { required: true })} type="radio" value="pie" className="btn-check" name="type" id="chartPie" autoComplete="off" defaultChecked />
                    <label className="btn btn-outline-primary w-100" htmlFor="chartPie">
                      <img src={IconPieChart} alt="" />
                      <span>
                        Pie <span className="only-desktop">Chart</span>
                      </span>
                    </label>
                  </div>
                  <div className="btn-group-item w-25">
                    <input  {...register("type", { required: true })} type="radio" value="column" className="btn-check" name="type" id="chartBar" autoComplete="off" />
                    <label className="btn btn-outline-primary w-100" htmlFor="chartBar">
                      <img src={IconBarChart} alt="" />
                      <span>Bar <span className="only-desktop">Chart</span></span>
                    </label>
                  </div>
                  <div className="btn-group-item w-25">
                    <input  {...register("type", { required: true })} type="radio" value="line" className="btn-check" name="type" id="chartChart" autoComplete="off" />
                    <label className="btn btn-outline-primary w-100" htmlFor="chartChart">
                      <img src={IconLineChart} alt="" />
                      <span>
                        Line <span className="only-desktop">Chart</span>
                      </span>
                    </label>
                  </div>
                  <div className="btn-group-item w-25">
                    <input  {...register("type", { required: true })} type="radio" value="table" className="btn-check" name="type" id="chartTable" autoComplete="off" />
                    <label className="btn btn-outline-primary w-100" htmlFor="chartTable">
                      <img src={IconTableChart} alt="" />
                      <span>
                        Table
                      </span>
                    </label>
                  </div>
                </div>                
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="" className="form-label">Show</label>
              <div className="custom-select-56 ">
                <Controller
                  control={control}
                  name="data"
                  render={({
                    field: { onChange, value },
                  }) => (
                    <Select
                      value={value}
                      onChange={onChange}
                      classNamePrefix="select-price"
                      className="select-price customScroll"
                      options={MetaData.analyzeDataType} />
                  )}
                />
                {/* <Select options={MetaData.analyzeDataType} /> */}
              </div>
            </div>
            <div className="mb-3 custom-select-56">
              <label htmlFor="" className="form-label">Group by</label>
              <div className="">
                {/* <Select options={MetaData.groupedBy} /> */}
                <Controller
                  control={control}
                  name="lv1"
                  render={({
                    field: { onChange, value },
                  }) => (
                    <Select
                      value={value}
                      onChange={onChange}
                      classNamePrefix="select-price"
                      className="select-price customScroll"
                      options={MetaData.groupedBy} />
                  )}
                  defaultValue={{ value: 1, label: "Year" }}
                />
              </div>
            </div> 
            <div className="mb-3 custom-select-56">
              <label htmlFor="" className="form-label">Drill-down group by</label>
              <div className="">
                {/* <Select options={MetaData.groupedBy} /> */}
                <Controller
                  control={control}
                  name="lv2"
                  render={({
                    field: { onChange, value },
                  }) => (
                    <Select
                      value={value}
                      //menuIsOpen={true}
                      onChange={onChange}
                      menuPosition="fixed"
                      classNamePrefix="select-price"
                      className="select-price customScroll"
                      options={MetaData.groupedBy} />
                  )}
                  defaultValue={{ value: 1, label: "Year" }}
                />
              </div>
            </div>
            <div className="mb-3 custom-select-56">
              <label htmlFor="" className="form-label">Use purchase price for missing data</label>
              <div className="">
                <Controller
                  control={control}
                  name="user_pp"
                  render={({
                    field: { onChange, value },
                  }) => (
                    <Select
                      value={value}
                      //menuIsOpen={true}
                      onChange={onChange}
                      menuPosition="fixed"
                      classNamePrefix="select-price"
                      className="select-price customScroll"
                      options={MetaData.yesNo} />
                  )}
                  defaultValue={MetaData.yesNo[0]}
                />
              </div>
            </div>
            <div>{!isEmpty(chartDetail) && <div className="d-flex justify-content-center mt-3 btn-group-remove">
              <a href="javascript:void(0)" onClick={onDelete} className="d-flex justify-content-center align-items-center btn-remove mb-0"> <img src={IconDelete} alt="Remove Widget" /> <span>Remove Widget</span> </a>
            </div>}
            </div>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer className="custom-modal-footer">
        <button className="btn btn-outline--custom color-124DE3 h-56" onClick={() => setIsOpen(false)}>Cancel</button>
        <button disabled={isLoading} onClick={handleSubmit(onSubmit)} className="btn h-56 btn-collection-primary p-0 ml-3">{isEmpty(chartDetail) ? "Add" : "Update"} Widget {isLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />}</button>
      </Modal.Footer>
    </Modal>);
}

export default UpsertChart;
