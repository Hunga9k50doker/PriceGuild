import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { CardModel } from "model/data_sport/card_sport";
import { useForm, Controller } from "react-hook-form";
import Select, { components } from "react-select";
import { isEmpty } from "lodash";
import { api } from 'configs/axios';
import { ToastSystem } from 'helper/toast_system';

type PropTypes = {
  isOpen: boolean;
  onClose?: () => void;
  onSuccess?: (cardData: CardModel, point: any, cardForm: CardForm, isCorrectCard: boolean) => void;
  cardData?: CardModel;
  gradeCompany?: any;
  point?: any;
  isReportImage ?: boolean;
  setIsReportImage?: (flag: boolean) => void
};

export type CardForm = {
  report_saleid: any;
  report_cardcode: any;
  report_type: any;
  report_note: any;
  report_auto_only_grade: any;
  report_grade_company: any;
  report_grade_value: any;
  report_authentic: any;
};

const Index = ({
  isOpen = false,
  gradeCompany,
  point,
  isReportImage = false,
  ...props
}: PropTypes) => {

  const [isCorrectCard, setIsCorrectCard] = useState<boolean>(true);
  const {
    handleSubmit,
    register,
    watch,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<CardForm>();

  const [gradeValue, setGradeValue] = useState<Array<any>>([]);
  // const []
  const watchGrade = watch("report_grade_company");
  const watchGradeValue = watch("report_grade_value");
  const [isLoading, setIsLoading] = useState<boolean>(false)
  React.useEffect(() => {
    if (!isOpen) {
      setIsLoading(false)
      reset({
        report_saleid: 0,
        report_cardcode: 0,
        report_type: 1,
        report_note: "",
        report_auto_only_grade: 0,
        report_authentic: 0,
      });
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (gradeCompany.length) {
      setGradeValue([]);
      const grade = gradeCompany.find(
        (item: any) => item.name === watchGrade?.name
      );
      const dataGradeValue = grade?.values ?? [];
      setGradeValue(dataGradeValue);
      setValue("report_grade_value", `${dataGradeValue[0].value}`);
    }
  }, [watchGrade]);

  React.useEffect(() => {
    if (!isEmpty(gradeCompany)) {
      setValue("report_grade_company", gradeCompany[0]);
    }
  }, [gradeCompany, isOpen]); 

  // @ts-ignore
  const Option = (props: any) => {
    return (
      <components.Option {...props}>
        <div
          style={{
            backgroundColor: props?.isSelected ? props.data?.color_2 : "#FFF",
          }}
          className="item-grade"
        >
          <div
            className={`grade-value ${props.data?.name === "ungraded" ? "ungraded" :""}`}
            style={{
              color: props.data?.color_1,
              backgroundColor: props.data?.color_2,
            }}
          >
           { props.data?.name}
          </div>
        </div>
      </components.Option>
    );
  };

  const onSubmit = async (data: CardForm) => {
    setIsLoading(true)
    let params: any = {  
      ...data,
      // @ts-ignore
     report_auto_only_grade: data.report_auto_only_grade | 0,
     report_authentic: data.report_authentic | 0,
      report_grade_company: isCorrectCard ? undefined : `${data.report_grade_company.name}`,
      report_grade_value:  isCorrectCard ? undefined : +data.report_grade_value,
     report_cardcode: props?.cardData?.code,
     report_saleid: point?.id || props?.cardData?.cardFrontImage?.id
    }
    try {
      const result = await api.v1.card_detail.reportCard(params);
      setIsLoading(false)
      if (result.success) {
        if (props.cardData && point) {
          props?.onSuccess && props.onSuccess(props.cardData, point, data, isCorrectCard);
        }
        if(isReportImage) {
           props?.setIsReportImage && props.setIsReportImage(false);
        }
        props?.onClose && props.onClose();
        return ToastSystem.success(result.message);
      }
      return ToastSystem.error(result.message || result?.error);
     }
    catch (err) {
      setIsLoading(false)
    }
  }

  return (
    <Modal
      show={isOpen}
      centered
      keyboard={true}
      restoreFocus={false}
      onHide={() => {
        props?.onClose && props.onClose();
      }}
      fullscreen="sm-down"
      className="modal-collection modal-report-image"
    >
      <Modal.Header className="justify-content-start">
        <Modal.Title className="text-capitalize">Report an Error</Modal.Title>
        <button
          onClick={() => props?.onClose && props.onClose()}
          type="button"
          className="close mt-2"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M9.9999 12.4199L17.6799 20.0999L19.5999 18.1799L11.9199 10.4999L19.5999 2.8199L17.6799 0.899902L9.9999 8.5799L2.3199 0.899902L0.399902 2.8199L8.0799 10.4999L0.399902 18.1799L2.3199 20.0999L9.9999 12.4199Z"
              fill="#6D7588"
            />
          </svg>
        </button>
      </Modal.Header>
      <Modal.Body className="modal-body-custom hide-scroll">
        <div className="customScroll">
          <div className="product-item">
            <div className="sub-title">
              {props?.cardData?.sport.name}
              <i className="dot-margin" />
              {props?.cardData?.year}
              <i className="dot-margin" />{" "}
              {props.cardData?.publisher?.name}
            </div>
            <div className="card-title cursor-pointer">
              {" "}
              {props?.cardData?.fullWebName}
            </div>
            <div className="d-flex">
              {Boolean(true) && (
                <button
                  type="button"
                  className="cursor-default btn me-1 btn-au btn-au--custom mb-3"
                >
                  {" "}
                  AU{" "}
                </button>
              )}
              {Boolean(true) && (
                <button
                  type="button"
                  className="cursor-default btn btn-mem btn-mem--custom mb-3"
                >
                  {" "}
                  MEM{" "}
                </button>
              )}
            </div>
          </div>
          <form className="row">
            <div className={`col-12 form-data `}>
              <label className="text-form mt-1">Error Type</label>
              <div className="tab d-flex">
                <div
                  className={`tab-item  cursor-pointer w-50 ${
                    Boolean(isCorrectCard) ? "active" : ""
                  } `}
                  onClick={() => {
                    setIsCorrectCard(true);
                    setValue("report_type", 1);
                  }}
                >
                  Incorrect Card
                </div>
                <div
                  className={`tab-item cursor-pointer w-50  ${
                    !Boolean(isCorrectCard) ? "active" : ""
                  }`}
                  onClick={() => {
                    setIsCorrectCard(false);
                    setValue("report_type", 2);
                  }}
                >
                  Incorrect Grade
                </div>
              </div>
            </div>

            <div className={`add-collection-right section-garding ps-0 pt-0  ${!isCorrectCard ? "" : "d-none"}`}>
              {!isEmpty(gradeCompany) && (
                <div className="mb-3 mt-3">
                  <label htmlFor="" className="form-label">
                    Select Grading
                  </label>
                  <Controller
                    control={control}
                    name="report_grade_company"
                    render={({ field: { onChange, value } }) => (
                      <Select
                        value={value}
                        onChange={(e) => {
                          onChange(e);
                          // onUpdateValue(e, "group_ref")
                          setValue("report_grade_value", e.values[0].value);
                        }}
                        isSearchable={ false }
                        components={{ Option }}
                        classNamePrefix="react-select-grading"
                        className="react-select-grading"
                        getOptionLabel={(value: any) => value.name}
                        getOptionValue={(item: any) => item.id}
                        options={gradeCompany ?? []}
                      />
                    )}
                  />
                </div>
              )}
              {
                watchGrade?.name !== "ungraded" && 
                <div>
                  <label htmlFor="" className="form-label">
                    Select Grade Value
                  </label>
                  <div
                    className="w-100 btn-group btn-group-sm grade-value-checkbox pl-3"
                    role="group"
                    aria-label="Basic radio toggle button group"
                  >
                    {gradeValue?.map((item, key) => (
                      <div key={key} className="item-value">
                        <input
                          type="radio"
                          {...register("report_grade_value", { required: true })}
                          className="btn-check"
                          name="report_grade_value"
                          value={`${item.value}`}
                          id={`grade-${item.value}`}
                          autoComplete="off"
                          defaultChecked={key === 0}
                        />
                        <label
                          style={{
                            backgroundColor:
                              +watchGradeValue === +item.value
                                ? watchGrade?.color_4
                                : "#FFF",
                            color:
                              +watchGradeValue === +item.value
                                ? watchGrade?.color_3
                                : "#18213A",
                          }}
                          className="btn btn-light text-capitalize"
                          htmlFor={`grade-${item.value}`}
                        >
                          {item.display_value_short}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              }
          
              <div className="form-check">
                <input
                  {...register("report_authentic")}
                  className="form-check-input"
                  type="checkbox"
                  id="flexCheckDefault"
                />
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  Graded Only as Authentic
                </label>
              </div>
              <div className="form-check">
                <input
                  {...register("report_auto_only_grade")}
                  className="form-check-input"
                  type="checkbox"
                  id="flexCheckChecked"
                />
                <label className="form-check-label" htmlFor="flexCheckChecked">
                  Auto Grade Only
                </label>
              </div>
            </div>

            <div className={`col-12 position-relative`}>
              <label className="text-form  mt-3">
                Note <span>(optional)</span>
              </label>
              <div className="position-relative">
                <textarea
                  {...register("report_note")}
                  className="form-control mt-1"
                  placeholder="Details of the error"
                ></textarea>
              </div>
            </div>
          </form>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="d-flex">
          <button
            className="btn btn-cancel"
            onClick={() => props?.onClose && props.onClose()}
          >
            Cancel
          </button>
          <button disabled={isLoading} className="btn btn-submit" onClick={handleSubmit(onSubmit)}>Submit Report</button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default Index;
