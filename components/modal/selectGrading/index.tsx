import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { ManageCollectionType } from "interfaces";
import { api } from "configs/axios";
import "nouislider/distribute/nouislider.css";
import { useForm, Controller } from "react-hook-form";
import {
  GradeCompanyType,
  Datum,
  SelectDefultType,
  CardsAddType,
} from "interfaces";
import { isEmpty, cloneDeep } from "lodash";
import Skeleton from "react-loading-skeleton";
import moment from "moment";
import { CardModel } from "model/data_sport/card_sport";
import Select, { components } from "react-select";
import { ToastSystem } from "helper/toast_system";
import { useRouter } from 'next/router'
import Link from 'next/link'

type PropTypes = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  cardData: CardModel;
  wishList?: ManageCollectionType;
  onSuccess?: (code: string) => void;
  onSetGradeCompany?: (data: any)=> void
};

type CardForm = {
  grade_company: any;
  user_currency: SelectDefultType;
  user_price: string;
  date_acq: Date;
  group_ref: any;
  grade_value: number;
  note: string;
};

const defaultCard: Datum = {
  cardid: "",
  portid: 0,
  user_price: 0,
  quantity: 1,
  grade_company: {
    color_1: "#FFF",
    color_2: "#6D7588",
    color_3: "#18213A",
    color_4: "#E9EAED",
    id: 1,
    name: "ungraded",
    name_full: "",
  },
  grade_value: 1,
  user_currency: "USD",
  date_acq: new Date(),
  note: "",
  group_ref: 0,
  front_image: "",
  back_image: "",
  image_upload: {
    front: "",
    back: "",
  },
};

const SelectGrading = ({
  isOpen = true,
  wishList,
  cardData,
  setIsOpen,
  ...props
}: PropTypes) => {
  const [gradeValue, setGradeValue] = useState<Array<any>>([]);
  const {
    register,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<CardForm>();
  const [gradeCompanys, setGradeCompanys] = useState<Array<GradeCompanyType>>(
    []
  );
  const watchGrade = watch("grade_company");
  const watchGradeValue = watch("grade_value");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cards, setCards] = useState<CardsAddType>({
    cards: [],
  });
  const router = useRouter();
  React.useEffect(() => {
    if (cards?.cards?.length) {
      onUpdateValue(watchGradeValue, "grade_value");
    }
  }, [watchGradeValue]);

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
            className="grade-value"
            style={{
              color: props.data?.color_1,
              backgroundColor: props.data?.color_2,
            }}
          >
            {props.data?.name}
          </div>
        </div>
      </components.Option>
    );
  };

  // React.useEffect(() => {
  //   getData();
  // }, []);

  React.useEffect(() => {
    if (isOpen) {
      setCards({
        cards: [
          {
            card_id: cardData.code,
            data: [{ ...defaultCard }],
          },
        ],
      });
    } else {
      getData();
    }
  }, [isOpen]);

  const getData = async () => {
    try {
      const params = {
        has_values: true,
      };
      const result = await api.v1.gradeCompany.getList(params);
      if (result.success) {
        setGradeCompanys(result.data);
        setValue("grade_company", result.data[0]);
        props.onSetGradeCompany && props.onSetGradeCompany(result.data)
        // setValue("grade_company", "ungraded")
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onUpdateValue = (e: any, key: string) => {
    let newData = { ...cards };
    if (newData?.cards?.length) {
      newData.cards[0].data[0][key] = e.value ?? e;
      setCards(newData);
    }
  };

  React.useEffect(() => {
    if (gradeCompanys.length) {
      setGradeValue([]);
      onUpdateValue(watchGrade, "grade_company");
      const grade = gradeCompanys.find(
        (item) => item.name === watchGrade?.name
      );
      const dataGradeValue = grade?.values ?? [];
      setGradeValue(dataGradeValue);
      setValue("grade_value", dataGradeValue[0].value);
    }
  }, [watchGrade]);

  const onSubmit = () => {
    const newDataForm = cloneDeep([...(cards?.cards ?? [])]);
    newDataForm?.forEach((v, i) => {
      delete v.web_name;
      v.data?.forEach((card, k) => {
        card.image_upload.back = card.back_image ?? "";
        card.image_upload.front = card.front_image ?? "";
        card.date_acq = moment(card.date_acq).format("YYYY-MM-DD");
        card.group_ref = wishList?.group_ref;
        card.grade_company = card.grade_company.name;
        card.grade_value = +card.grade_value;
        delete card.front_image;
        delete card.back_image;
        delete card.cardid;
        delete card.portid;
      });
    });
    const params = {
      table: "wishlist",
      data: newDataForm,
    };
    // console.log(wishList, 'wishList')
    onCreate(params);
  };

  const onCreate = async (params: any) => {
    try {
      setIsLoading(true);
      const result = await api.v1.portfolio.saveCards(params);
      if (result.success) {
        setIsLoading(false);
        setIsOpen(false);
        props.onSuccess && props.onSuccess(cardData.code);
        return onHandleToast();
      } 
      if (!result.success) {
        // @ts-ignore
        if (result.data?.verify_redirect) {
          return router.push('/verify-email')
        }
      }
      setIsLoading(false);
      return ToastSystem.error(result.message);
    } catch (err: any) {
      setIsLoading(false);
      console.log(err);
      if(err?.response?.status === 403) {
        return router.push('/verify-email')
      }
    }
  };

  // @ts-ignore
  const CloseButton = ({ closeToast }) => (
    <div className="close-button" onClick={closeToast}>
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M7.00039 8.27998L1.88039 13.4L0.600389 12.12L5.72039 6.99998L0.600389 1.87998L1.88039 0.599976L7.00039 5.71998L12.1204 0.599976L13.4004 1.87998L8.28039 6.99998L13.4004 12.12L12.1204 13.4L7.00039 8.27998Z"
          fill="#6D7588"
        />
      </svg>
    </div>
  );

  const onHandleToast = () => {
    ToastSystem.success(
      <div className="toast-grade-content">
        Card saved to wishlist{" "}
        <Link href={`/profile/wishlists/${wishList?.group_ref}/${wishList?.group_name}`}>
          <a className="text-decoration-none">
            {wishList?.group_name} { Boolean(wishList?.type === 2) && <i className="fa fa-lock" aria-hidden="true"></i>}{" "}
          </a>
        </Link>
      </div>
    );
  };

  return (
    <>
      <Modal
        onHide={() => {
          setIsOpen(false);
        }}
        centered
        size="lg"
        show={isOpen}
        fullscreen="sm-down"
        className="modal-profile-collection modal-collection"
      >
        <Modal.Header>
          <Modal.Title className="text-truncate">Select Grading</Modal.Title>
          <button
            onClick={() => setIsOpen(false)}
            type="button"
            className="close p-0"
            data-dismiss="modal"
            aria-label="Close"
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
              ></path>
            </svg>
          </button>
        </Modal.Header>
        <Modal.Body className="customScroll border-none">
          <form className="form-collection mheight-300">
            <div className="add-collection-right section-garding ps-0 pt-0">
              {!isEmpty(gradeCompanys) && (
                <div className="mb-3">
                  <label htmlFor="" className="form-label">
                    Select Grading
                  </label>
                  <Controller
                    control={control}
                    name="grade_company"
                    render={({ field: { onChange, value } }) => (
                      <Select
                        value={value}
                        onChange={(e) => {
                          onChange(e);
                          // onUpdateValue(e, "group_ref")
                          setValue("grade_value", e.values[0].value);
                          onUpdateValue(e.values[0].value, "grade_value");
                        }}
                        components={{ Option }}
                        classNamePrefix="react-select-grading"
                        className="react-select-grading"
                        getOptionLabel={(value: any) => value.name}
                        getOptionValue={(item: any) => item.id}
                        options={gradeCompanys ?? []}
                      />
                    )}
                  />
                </div>
              )}
              <div>
                <label htmlFor="" className="form-label">
                  Select Grade Value
                </label>
                <div
                  className="w-100 btn-group btn-group-sm grade-value-checkbox"
                  role="group"
                  aria-label="Basic radio toggle button group"
                >
                  {gradeValue?.map((item, key) => (
                    <div key={key} className="item-value">
                      <input
                        type="radio"
                        {...register("grade_value", { required: true })}
                        className="btn-check"
                        name="grade_value"
                        value={item.value}
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
              {isEmpty(gradeCompanys) && (
                <div className="d-inline">
                  {" "}
                  <Skeleton style={{ height: 35 }} />
                </div>
              )}
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer className="modal-content-wishlist">
          <button
            className="btn btn-outline--custom color-124DE3 mr-2"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
          <button
            disabled={isLoading}
            onClick={onSubmit}
            className="btn btn-collection-primary p-0 ml-3"
          >
            Save to Wishlist
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default React.memo(SelectGrading);
