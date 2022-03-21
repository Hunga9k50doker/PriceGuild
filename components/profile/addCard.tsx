import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Selectors from "redux/selectors";
import { api } from "configs/axios";
import {
  GradeCompanyType,
  Datum,
  SelectDefultType,
  CardsAddType,
} from "interfaces";
import Skeleton from "react-loading-skeleton";
import Select, { components } from "react-select";
import DatePicker from "react-datepicker";
import EditImage, { EditImageType } from "components/modal/editImage";
import imageUpload from "assets/images/ImageUpload.png";
import backgroundImage from "assets/images/profile_user.png";
import backgroundImageUpload from "assets/images/ImageUpload.png";
import { cloneDeep, isEmpty, sumBy, isEqual } from "lodash";
import { useForm, Controller } from "react-hook-form";
import queryString from "query-string";
import { formatCurrencyCustom, isFirefox } from "utils/helper";
import moment from "moment";
import { useRouter } from 'next/router'
import { ToastSystem } from "helper/toast_system";
import IconArrow from "assets/images/arrow_nav.png";
import IconQuestion from "assets/images/icon_question.png";
import IconDelete from "assets/images/delete.png";
import Link from 'next/link'
import useWindowDimensions from "utils/useWindowDimensions";
import ArrowProfile from "assets/images/arrow_profile.svg";
import rotateLeft from "assets/images/rotate-left.svg";
// @ts-ignore
import $ from "jquery";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { ConfigAction } from "redux/actions/config_action";
import { useTranslation } from "react-i18next";

const ungraded = "ungraded";
const NotSpecified = "1";

type CardForm = {
  grade_company: any;
  user_currency: SelectDefultType;
  user_price: string;
  date_acq: Date;
  group_ref: any;
  grade_value: number;
  note: string;
  // agree_share: number;
};

type PropTypes = {
  location?: any;
  isEdit?: boolean;
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
  // agree_share: 0,
  group_ref: 0,
  front_image: "",
  back_image: "",
  image_upload: {
    front: backgroundImage.src,
    back: backgroundImage.src,
  },
};

type ImageType = {
  url: string;
  path?: string;
};

type GroupRefType = {
  id?: number;
  name?: string;
};
const AddCard = ({ isEdit = false }: PropTypes) => {
  let router = useRouter();
  const imageBackRef = React.useRef<HTMLInputElement>(null);
  const imageFrontRef = React.useRef<HTMLInputElement>(null);
  const EditImageRef = React.useRef<EditImageType>(null);
  const [imageFront, setImageFront] = useState<ImageType>({
    url: imageUpload.src,
    path: "",
  });
  const [imageBack, setImageBack] = useState<ImageType>({
    url: imageUpload.src,
    path: "",
  });
  const [gradeCompanys, setGradeCompanys] = useState<Array<GradeCompanyType>>(
    []
  );
  const { currencies, is_show_card_detail_collection } = useSelector(Selectors.config);
  const {
    register,
    getValues,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<CardForm>();
  const [gradeValue, setGradeValue] = useState<Array<any>>([]);
  const watchGrade = watch("grade_company");
  const watchUserPrice = watch("user_price");
  const watchNote = watch("note");
  const watchGradeValue = watch("grade_value");
  // const watchAgreeShare = watch("agree_share");
  const dataQueries = router.query; 
  const [cards, setCards] = useState<CardsAddType>({
    groups: [],
    cards: [],
  });
  const [cardsOld, setCardsOld] = useState<CardsAddType>({
    groups: [],
    cards: [],
  });
  const [cardsMobile, setCardsMobile] = useState<CardsAddType>({
    groups: [],
    cards: undefined,
  });
  const [cardIds] = useState(
    typeof dataQueries.code === "string" ? dataQueries?.code.split(",") : ""
  );
  const [activeEntry, setActiveEntry] = useState({
    cardIndex: 0,
    entryIndex: 0,
  });

  const [activeEntryData, setActiveEntryData] = useState<Datum>();
  const [t, i18n] = useTranslation("common")
  const [groupRef, setGroupRef] = useState<GroupRefType>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false);
  let resizeWindow = () => {
    setWindowWidth(window.innerWidth);
  };
  
  const [showContentAddCollection, SetShowContentAddCollection] =
    React.useState<boolean>(false);
  const { width } = useWindowDimensions();
  const dispatch = useDispatch();
  // @ts-ignore
  const [oldValueActive, setOldValueActive] = useState<Datum>();
  const [undoChangeStatus, setUndoChangeStatus] = useState<Boolean>(false);
  
  // React.useEffect(() => {
  //   resizeWindow();
  //   window.addEventListener("resize", resizeWindow);
  //   if(windowWidth <= 680) {
  //     setIsMobile(true);
  //   }
  //   return () => window.removeEventListener("resize", resizeWindow);
  // }, [windowWidth]);

  const getDataCards = async () => {
    try {
      const params = {
        cardcode: typeof router.query?.code === "string" ? router.query?.code.split(",") : "",
        table: "portfolio",
        all_data: isEdit,
        group_ref: Number(dataQueries?.collection ?? 0),
      };
      const result = await api.v1.portfolio.existingSavedCards(params);
      if (result.success) {
        let data = result.data;
        if (data?.cards?.length === 0 && isEdit) {
          router.back();
        }
        if (data?.cards?.length && isEdit) {
          setCardsOld(cloneDeep(data));
          setCards(data);
          // if (width < 768) {
            // setCardsMobile(cloneDeep(data));
          // }
          const dataEntry =
            data?.cards[0].data[0];
          const selecedData = data?.groups?.find(
            (item) => item.id === dataEntry.group_ref
          );
          setGroupRef({
            id: selecedData?.id,
            name: selecedData?.group_name,
          });
          setValue("group_ref", selecedData);
          setFromValue(dataEntry);
        } else {
          const selecedData = data?.groups?.find(
            (item) => item.id === +(dataQueries?.collection ?? 0)
          );
          setValue("group_ref", selecedData);
          data.cards = result.data?.cards?.map((card) => ({
            ...card,
            data: [
              { ...cloneDeep(defaultCard), group_ref: selecedData?.id ?? 0 },
            ],
          }));
          setCards(data);
          // if (width < 768) {
          //   setCardsMobile(cloneDeep(data));
          // }
        }
      }
    } catch (err) {
      // console.log(err);
      setCards({});
    }
  };
  
  React.useEffect(() => {
    if (!isEmpty(router.query)) {
        const getDataGrade = async () => {
        try {
          const params = {
            has_values: true,
          };
          const result = await api.v1.gradeCompany.getList(params);
          if (result.success) {
            setGradeCompanys(result.data);
            if (!isEdit) {
              setValue("grade_company", result.data[0]);
              setValue("grade_value", result.data[0].values[0].value);
            }
          }
        } catch (err) {
          // console.log(err);
          setGradeCompanys([]);
        }
        };
      getDataCards();
      getDataGrade();
      setWindowWidth(window.innerWidth);
    }
    
  }, [router.query]);
  const onUploadFileInput = (e: any, name: string) => {
    var file = e.target.files[0];
    if (file) {
      var url = URL.createObjectURL(file);
      let current_path: string =
        name === "Front" ? imageFront?.path ?? "" : imageBack?.path ?? "";
      EditImageRef?.current?.action(url, name, current_path);
    }
  };

  const onUpLoadFile = (value: string) => {
    if (value === "Back") {
      imageBackRef?.current?.click();
    } else {
      imageFrontRef?.current?.click();
    }
  };

  const onSuccessFile = (base64: any, name?: string, path?: string) => {
    if (name === "Front") {
      // @ts-ignore: Unreachable code error
      document.getElementById("imageFrontRef").value = "";
      return setImageFront({
        url: base64,
        path: path,
      });
    }
    // @ts-ignore: Unreachable code error
    document.getElementById("imageBackRef").value = "";
    setImageBack({
      url: base64,
      path: path,
    });
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
    }
  }, [watchGrade, gradeCompanys]);

  React.useEffect(() => {
    if (cards?.cards?.length) {
      onUpdateValue(watchGradeValue, "grade_value");
    }
  }, [watchGradeValue]);

  React.useEffect(() => {
    let newData = { ...cards };

    if (newData?.cards?.length) {
      newData.cards[activeEntry.cardIndex].data[
        activeEntry.entryIndex
      ].image_upload.front = imageFront.url;
      newData.cards[activeEntry.cardIndex].data[
        activeEntry.entryIndex
      ].front_image = imageFront.path;
      newData.cards[activeEntry.cardIndex].data[
        activeEntry.entryIndex
      ].image_upload.back = imageBack.url;
      newData.cards[activeEntry.cardIndex].data[
        activeEntry.entryIndex
      ].back_image = imageBack.path;
      setCards(newData);
    }

    // @ts-ignore
    const dataOld = cardsOld.cards?.[activeEntry.cardIndex]?.data[activeEntry.entryIndex];
    // @ts-ignore
    const datanew = newData.cards?.[activeEntry.cardIndex]?.data[activeEntry.entryIndex];
    // @ts-ignore
    if (!isEmpty(datanew)) {
      // @ts-ignore
      // delete datanew.back_image;
      // @ts-ignore
      // delete datanew.front_image;
    }

    let dataCompare = {...datanew};
    delete dataCompare.back_image;
    delete dataCompare.front_image;
    
    if (!isEqual(dataOld, dataCompare)) {
      return setUndoChangeStatus(true);
    } else {
      if (!isEmpty(imageFront.path) || !isEmpty(imageBack.path)) {
        return setUndoChangeStatus(true);
      }
      return setUndoChangeStatus(false);
    }
  }, [imageFront, imageBack]);

  React.useEffect(() => {
    if (cards?.cards?.length) {
      onUpdateValue(+watchUserPrice, "user_price");
    }
  }, [watchUserPrice]);

  React.useEffect(() => {
    if (cards?.cards?.length) {
      onUpdateValue(watchNote, "note");
    }
  }, [watchNote]);

  // React.useEffect(() => {
  //   if (cards?.cards?.length) {
  //     onUpdateValue(watchAgreeShare, "agree_share");
  //   }
  // }, [watchAgreeShare]);

  React.useEffect(() => {
    if (isEmpty(activeEntryData)) {
      setActiveEntryData(cards?.cards?.[activeEntry.cardIndex]?.data[activeEntry.entryIndex])
    }
  }, [cards?.cards])

  React.useEffect(() => {
    if (isEmpty(oldValueActive)) {
      // @ts-ignore
      setOldValueActive({ ...cards?.cards?.[activeEntry.cardIndex]?.data[activeEntry.entryIndex] })
    }
  }, [activeEntryData])

  const onCreate = async (params: any) => {
    try {
      setIsLoading(true);
      const result = await api.v1.portfolio.saveCards(params);
      if (result.success) {
        setIsLoading(false);
        router.push("/profile/portfolio");
        return ToastSystem.success(result.message ?? "Create successfully");
      }
      if (!result.success) {
        // @ts-ignore
        if (result.data?.verify_redirect) {
          return router.push('/verify-email')
        }
      }
      setIsLoading(false);
      return ToastSystem.error(result.message ?? result.error);
    } catch (err: any) {
      setIsLoading(false);
      if(err?.response?.status === 403) {
        return router.push('/verify-email')
      }
      // console.log(err);
    }
  };

  const onUpdateValue = (e: any, key: string) => {
    let newData = { ...cards };
    if (newData?.cards?.length) {
      if (key === 'date_acq') {
        newData.cards[activeEntry.cardIndex].data[activeEntry.entryIndex][key] =
        moment(e?.value ?? e).format("YYYY-MM-DD");
      } else {
        newData.cards[activeEntry.cardIndex].data[activeEntry.entryIndex][key] =
        e?.value ?? e;
      }
     
      setCards(newData);
    } 
    // @ts-ignore
    let dataCompare = { ...newData.cards?.[activeEntry.cardIndex]?.data?.[activeEntry.entryIndex] };
    delete dataCompare.back_image;
    delete dataCompare.front_image;

    const dataEntry = cardsOld.cards?.[activeEntry.cardIndex]?.data[activeEntry.entryIndex];
    
    let dataOldCompare = {...dataEntry};

    // @ts-ignore
    if (isEqual(dataOldCompare, dataCompare)) {
      return setUndoChangeStatus(false);
    } else {
      return setUndoChangeStatus(true);
    }
  };

  const onNewEntry = () => {
    // @ts-ignore
    if(width < 768) {
      $('.d-block-add-collection').animate({
        scrollTop: 0
      }, 300);
    }
    let newData = { ...cards };

    if (newData.cards?.length) {
      const newEntry = { ...cloneDeep(defaultCard), group_ref:  Number(dataQueries?.collection ?? 0) };
      newData?.cards[activeEntry.cardIndex].data.push({ ...newEntry });
      setCards(newData);
      // set new index on old card
      // @ts-ignore
      // cardsOld?.cards?.[activeEntry.cardIndex]?.data.push({ ...newEntry });
      // setCardsOld(cardsOld);
      // end
      setActiveEntry((prevState) => {
        // @ts-ignore
        return { ...prevState, entryIndex: newData?.cards[activeEntry.cardIndex].data.length - 1  };
      });
      setFromValue(newEntry);
    }

    isFirefox ? $('html, body').animate({scrollTop: 0}) : window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const onDuplicateEntry = () => {
    let newData = { ...cards }; 
    if (newData.cards?.length) {
      let newEntry = cloneDeep(
        newData.cards[activeEntry.cardIndex].data[activeEntry.entryIndex]
      );
      newEntry.image_upload = {
        front: backgroundImage.src,
        back: backgroundImage.src,
      }
      newData?.cards[activeEntry.cardIndex].data.push({ ...newEntry });
      
      setCards(newData);
      // set new index on old card
      setActiveEntry((prevState) => {
        // @ts-ignore
        return { ...prevState, entryIndex: newData?.cards[activeEntry.cardIndex].data.length - 1 };
      });
      isFirefox ? $('html, body').animate({scrollTop: 0}) : window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
       // @ts-ignore
      if (width < 768) {
        $('.d-block-add-collection').animate({
          scrollTop: 0
        }, 300);
      }
      onActiveEntry(activeEntry.cardIndex, newData?.cards[activeEntry.cardIndex].data.length - 1, newEntry)
      // @ts-ignore
      // cardsOld?.cards?.[activeEntry.cardIndex]?.data.push({ ...newEntry });
      // setCardsOld(cardsOld);
      // end
    }
    // this onActiveEntry function remove activeEntry.entryIndex + 1 to activeEntry.entryIndex
    // this setActiveEntry function remove  prevState.entryIndex + 1 to prevState.entryIndex
  };

  const onActiveEntry = (cardIndex: number, entryIndex: number, data: any) => {
    
    let old = { ...data };
    // @ts-ignore
    const dataEntry = cardsOld.cards?.[cardIndex]?.data[entryIndex];

    let oldCompare = { ...data };
    delete oldCompare.back_image;
    delete oldCompare.front_image;
    
    if (!isEmpty(dataEntry)) {
      if (!isEqual(dataEntry, oldCompare)) {
        setOldValueActive(dataEntry);
        setUndoChangeStatus(true);
      }
    } else {
      setOldValueActive(old);
      setUndoChangeStatus(false);
    }
    setActiveEntry({
      cardIndex,
      entryIndex,
    });
    setFromValue(data);
    setActiveEntryData(data);
  };

  const setFromValue = (dataEntry: Datum) => {
    setValue("grade_value", dataEntry.grade_value);
    setValue("grade_company", dataEntry.grade_company);
    setValue("user_currency", {
      value: dataEntry.user_currency,
      label: dataEntry.user_currency,
    });
    setValue("user_price", dataEntry.user_price.toString());
    // @ts-ignore: Unreachable code error
    setValue(
      "date_acq",
      typeof dataEntry.date_acq === "string"
        ? new Date(dataEntry.date_acq)
        : dataEntry.date_acq
    );
    if (cards.groups?.length) {
      setValue(
        "group_ref",
        cards.groups?.find((item) => item.id === dataEntry.group_ref)
      );
    }
    setImageBack({
      url: dataEntry?.image_upload?.back ?? imageUpload.src,
      path: dataEntry.back_image,
    });
  
    setImageFront({
      url: dataEntry?.image_upload?.front ?? imageUpload.src,
      path: dataEntry.front_image,
    });
    
    setValue("note", dataEntry.note);
    // setValue("agree_share", dataEntry.agree_share);
  };
  const onCancle = () => {
    router.push("/profile/collections");
  };

  const onSubmitForm = () => {
    let newDataForm = null;
    // if (width >= 768) {
      newDataForm = cloneDeep([...(cards?.cards ?? [])]);
    // } else {
    //   newDataForm = cloneDeep([...(cardsMobile?.cards ?? [])]);
    // }
    newDataForm?.forEach((v, i) => {
      delete v.web_name;
      v.data?.forEach((card) => {
        card.image_upload.back = card?.back_image ??  "";
        card.image_upload.front = card?.front_image  ?? "";

        card.date_acq = moment(card.date_acq).format("YYYY-MM-DD");
        card.group_ref = card.group_ref?.id ?? card.group_ref;
        card.grade_company = card.grade_company.name;
        card.grade_value = +card.grade_value;
        delete card.front_image;
        delete card.back_image;
        delete card.cardid;
        delete card.portid;
      });
    });
    const params = {
      table: "portfolio",
      data: newDataForm,
    };
    onCreate(params);
  };

  const onUndo = () => {
    let newData = { ...cards };
    if (cardsOld?.cards?.length && newData?.cards?.length) {
      const dataEntry =
        cardsOld.cards[activeEntry.cardIndex].data[activeEntry.entryIndex];
      newData.cards[activeEntry.cardIndex].data[activeEntry.entryIndex] =
        cloneDeep(dataEntry);
      setOldValueActive(dataEntry);
      setFromValue(dataEntry);
      setCards(newData);
      setUndoChangeStatus(false);
    }
  };

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
  React.useEffect(() => {
    // @ts-ignore
    if (is_show_card_detail_collection && width < 768) {
      
    } else {

    }
  }, [is_show_card_detail_collection]);

  React.useEffect(() => {
    // @ts-ignore
    if (width > 768) {
      document.body.removeAttribute("style");
    }
  }, [width]);

  const onSaveEntry = () => {
    // setCardsMobile(cloneDeep(cards));
    // SetShowContentAddCollection(false);
    dispatch(ConfigAction.updateShowMenuCollection(false))
  };

  const renderTextButton = () => {
    if (
      sumBy(cards?.cards, function (o) {
        return o?.data?.length ?? 1;
      }) > 1
    )
      return "s";
    return "";
  };

  const onRemoveCard = async () => {
    try {
      let newData: any = null;
      // if (width >= 768) {
        newData = cloneDeep([...(cards?.cards ?? [])]);
      // } else {
      //   newData = cloneDeep([...(cardsMobile?.cards ?? [])]);
      // }

      if(newData && newData[0].data.length > 1) {
        isFirefox ? $('html, body').animate({scrollTop: 0}) : window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }
    } catch (error) {
      //
    }  
    setIsLoadingDelete(true);
    // @ts-ignore
    if(cards?.cards[activeEntry.cardIndex].data[activeEntry.entryIndex].port_id) {
        try {
          const params = {
            table: "portfolio",
            portid_list: [
              // @ts-ignore
              cards?.cards[activeEntry.cardIndex].data[activeEntry.entryIndex]
                .port_id,
            ],
          };
          const result = await api.v1.portfolio.deleteCardsPortfolio(params);
          if (result.success) {
            setActiveEntry({
              cardIndex: 0,
              entryIndex: 0,
            });
            setCards({
              groups: [],
              cards: [],
            });
            setCardsOld({
              groups: [],
              cards: [],
            });
            // setCardsMobile({
            //   groups: [],
            //   cards: undefined,
            // });
            // SetShowContentAddCollection(false);
            dispatch(ConfigAction.updateShowMenuCollection(false))
            getDataCards();
            setIsLoadingDelete(false);
            // // onHandleToast()
            // setCardSelected([]);
            // setPagesSelected([1])
            // getListCard([1])
            // setIsOpenModal(false)
            return ToastSystem.success(result.message ?? result.error);
          }
          //setIsOpenModal(false)
          setIsLoadingDelete(false);
          return ToastSystem.error(result.message ?? result.error);
        } catch (err) {
          setIsLoadingDelete(false);
          // setIsOpenModal(false)
          // console.log(err);
        }
    }
    onRemoveEntry();
  };

  const onRemoveEntry = () => {
    const dataKey = { ...activeEntry };
    let newData: any = null;
    // if (width >= 768) {
      newData = cloneDeep([...(cards?.cards ?? [])]);
    // } else {
    //   newData = cloneDeep([...(cardsMobile?.cards ?? [])]);
    // }
    newData = newData.filter((item: any, i: number) => {
      const dataSearch = item?.data.filter(
        (entry: any, k: number) =>
          !(i === dataKey.cardIndex && dataKey.entryIndex === k)
      );
      item.data = dataSearch;
      return true;
    });
    setCards((prevState) => {
      return {
        ...prevState,
        cards: newData,
      };
    });
    // setCardsMobile((prevState) => {
    //   return {
    //     ...prevState,
    //     cards: newData,
    //   };
    // });
    if (newData?.length) { 
      // console.log(newData)
      const dataEntry = {...newData[0].data[0]};
      onActiveEntry(0, 0, dataEntry)
    }
    // SetShowContentAddCollection(false);
    dispatch(ConfigAction.updateShowMenuCollection(false))
    setIsLoadingDelete(false);
  };

  const renderGradeValue = (entry: any) => {
    const grade_company_name =
      entry?.grade_company?.name == ungraded && entry.grade_value != NotSpecified
        ? ""
        : entry?.grade_company?.name === ungraded
        ? ungraded
          : "";
    const values = gradeCompanys?.find(item => item?.id == entry?.grade_company?.id)?.values ?? [];
    
    const gradeCompanyShow = values?.find(
      (item: any) => item?.value == entry?.grade_value
    );
    const grade_value_name =
      entry.grade_company?.name === ungraded && entry.grade_value == NotSpecified
        ? ""
        : gradeCompanyShow?.display_value ?? entry.grade_value;
    return (
      <>
        <span className="text-transform-capitalize">{grade_company_name}</span>
        {grade_value_name}
      </>
    );
  };

  const renderTitleRemove = () => {
    //@ts-ignore
    if (width < 768) {
      return "Remove Card";
    }
   return `Remove Card from ${t('portfolio.text')}` 
  }

  const scrollTopAsync = (d: number, fn: Function) => {
    let timer: any = null;
    $('html, body').animate({ scrollTop: 0 }, d);

    if (timer) {
      clearTimeout(timer);
    }
    setTimeout(() => {
      fn(ConfigAction.updateShowMenuCollection(true));
    },550)
    
  }
  const onGetTimeCurrent = () => {
    var date = new Date();
    return date.valueOf()
  }

  return (
    <div className="add-collection prf-template pl-3 position-relative">
      <div>
        <div className="only-mobile">
          {isEdit ? (
            <Link
              href={`/profile/collections/${groupRef?.id}/${groupRef?.name}`}
            >
              <a className="container-collection-profile-head">
                <img
                  // onClick={() => history.push("profile/collections")}
                  src={ArrowProfile}
                  alt=""
                />
                {groupRef?.name}
              </a>
            </Link>
          ) : (
            <Link
              href={`/profile/collections`}
            >
            <a className="container-collection-profile-head">
              <img
                // onClick={() => history.push("profile/collections")}
                src={ArrowProfile}
                alt=""
              />
              {t('portfolio.text')}
             </a>
            </Link>
          )}
          {/* <Link to="/profile/collections" className="container-collection-profile-head">
              <img onClick={() => history.push("profile/collections")}  src={ArrowProfile} />
              {groupRef?.name}
            </Link> */}
        </div>
      </div>
      <div className="only-mobile add-collection-title" >
        {isEdit ? `Edit Card in ${t('portfolio.text')}` : `Add Card to ${t('portfolio.text')}`}
      </div>
      <div className="pr-3 row g-0">
        <div className={`col-md-4 col-12 add-collection-left ml-0 ${is_show_card_detail_collection === false ? '' : 'd-none'}`}>
          {!cards.cards?.length && (
            <div>
              <Skeleton style={{ width: 150 }} />
              <Skeleton style={{ height: 25 }} />
              <Skeleton style={{ height: 75, marginBottom: 15 }} />
              <Skeleton style={{ width: 150 }} />
              <Skeleton style={{ height: 25 }} />
              <Skeleton style={{ height: 75, marginBottom: 15 }} />
              <Skeleton style={{ width: 150 }} />
              <Skeleton style={{ height: 25 }} />
              <Skeleton style={{ height: 75, marginBottom: 15 }} />
              <Skeleton style={{ width: 150 }} />
              <Skeleton style={{ height: 25 }} />
              <Skeleton style={{ height: 75, marginBottom: 15 }} />
            </div>
          )}
          <div className="card-scroll clear-scroll mt-14">
            {cards?.cards?.map((item, key) => (
              <div key={key} className="card-add">
                <div className="card-add-info d-flex align-items-center">
                  {item?.sport}{" "}
                  <i className="mx-1 fa fs4 fa-circle" aria-hidden="true" />{" "}
                  {item?.year}{" "}
                  <i className="mx-1 fa fs4 fa-circle" aria-hidden="true" />{" "}
                  {item?.publisher}
                </div>
                <div className="mb-3 fs-5 card-add-description mt-2">
                  {item?.web_name}
                </div>
                {(Boolean(item.auto) || Boolean(item.memo)) && <div className="card-add-group mb-3">
                  <div className="btn-group">
                    {Boolean(item.auto) && (
                      <button
                        type="button"
                        className="btn btn-au--custom cursor-default"
                      > AU </button>
                    )}
                    {Boolean(item.memo) && (
                      <button
                        type="button"
                        className="btn btn-mem--custom cursor-default"
                      > MEM </button>
                    )}
                  </div>
                </div>}
             
                {item?.data?.map((entry, k) => (
                  <div
                    key={k}
                    onClick={(e) => {
                      //@ts-ignore
                      if (width >= 768) {
                        onActiveEntry(key, k, entry);
                      }
                    }}
                    className="mb-3 card-add-detail entry"
                  >
                    <div
                      className={`d-flex justify-content-between ${
                        activeEntry.cardIndex === key &&
                        activeEntry.entryIndex === k
                          ? "active"
                          : ""
                      }  rounded border border-1 p-2`}
                      onClick={() => {
                        //@ts-ignore
                        if (width < 768) {
                          onActiveEntry(key, k, entry);
                          // setCards(cloneDeep(cardsMobile));
                          scrollTopAsync(0, dispatch)
                            // dispatch(ConfigAction.updateShowMenuCollection(true))
                          setFromValue(entry);
                          // SetShowContentAddCollection(true);
                        }
                      }}
                    >
                      <div className="box-left">
                        <div className="d-block justify-content-between align-items-center card-add-detail__txt">
                          <div
                            className={`me-1 ${
                              entry.grade_company &&
                              entry.grade_company?.name == ungraded &&
                              `${entry.grade_value}` == NotSpecified
                                ? ""
                                : "card-add-detail-grade text-nowrap"
                            }`}
                            style={{
                              backgroundColor:
                                entry.grade_company &&
                                entry.grade_company?.name === ungraded &&
                                `${entry.grade_value}` == NotSpecified
                                  ? "transparent"
                                  : entry.grade_company?.color_2 ??
                                    entry.grade_company?.grade_color_2,
                              color:
                                entry.grade_company?.name === ungraded &&
                                `${entry.grade_value}` == NotSpecified
                                  ? "#18213A"
                                  : entry.grade_company?.color_1 ??
                                    entry.grade_company?.grade_color_1,
                            }}
                          >
                            {renderGradeValue(entry)}
                          </div>
                          <strong className="text-ellipsis">
                            {Boolean(+entry.user_price) && formatCurrencyCustom(
                              entry.user_price,
                              entry.user_currency
                            )}
                          </strong>{" "}
                        </div>
                        <div className="card-add-detail__name">
                          {cards?.groups?.find(
                            (item) =>
                              item.id ===
                              (entry?.group_ref?.id ?? entry?.group_ref)
                          )?.group_name ?? ""}
                        </div>
                      </div>
                      <div className="d-flex images justify-content-center align-items-center">
                        <div className="hide-tablet aspect-sm">
                          <img
                            className="rounded"
                            src={
                              entry?.image_upload?.front
                                ? entry?.image_upload?.front
                                : backgroundImage.src
                            }
                            alt=""
                          />
                        </div>
                        <div className="ms-2 hide-tablet aspect-sm">
                          <img
                            className="rounded"
                            src={
                              entry?.image_upload?.back
                                ? entry?.image_upload?.back
                                : backgroundImage.src
                            }
                            alt=""
                          />
                        </div>
                        <span>
                          <img src={IconArrow.src} alt="" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <hr className="hr--color mt-4 mb-3" />
          {Boolean(cards.cards?.length) && (
            <div className="mt-2 d-flex justify-content-between align-items-center card-add-group-button">
              <button
                onClick={onCancle}
                type="button"
                className="btn-lg btn btn-cancel mb-2"
              > Cancel </button>
              <button
                onClick={onSubmitForm}
                disabled={isLoading}
                type="button"
                className="btn-lg btn btn-add mb-2"
              >
                {isEdit
                  ? "Save Changes"
                  : `Add Card${renderTextButton()} to ${t('portfolio.text')}`}
                {isLoading && (
                  <span
                    className="spinner-grow spinner-grow-sm"
                    role="status"
                    aria-hidden="true"
                  />
                )}
              </button>
            </div>
          )}
        </div>
        <div
          className={`col-md-8 col-12 add-collection-right ${
            is_show_card_detail_collection ? "d-block-add-collection" : ""
          }`}
        >
          {
            //@ts-ignore
            width < 768 && is_show_card_detail_collection === true && (
            // <div>
            //   <div className={`d-flex align-items-center active rounded border border-1 p-2`} onClick={ () => {SetShowContentAddCollection(width < 768 ? false : false)}}>
            //     <div className='arrowBack'>
            //       <img src={IconArrow}  className='revertArrow'/>
            //     </div>
            //     <div>
            //         <div className="d-flex justify-content-between align-items-center card-add-detail__txt">

            //           <div className={`me-1 title-grade ${activeEntryData?.grade_company && activeEntryData?.grade_company?.name != "ungraded" ? 'card-add-detail-grade' : ''
            //             }`}
            //             style={{ backgroundColor: activeEntryData?.grade_company && activeEntryData?.grade_company?.name != "ungraded" ? activeEntryData?.grade_company?.color_2 ?? activeEntryData?.grade_company?.grade_color_2 : 'transparent' }}>
            //             <span className="text-transform-capitalize">{activeEntryData?.grade_company?.name}</span> {activeEntryData?.grade_value}
            //           </div>
            //           {/* <span>{formatCurrencyCustom(activeEntryData?.user_price, activeEntryData?.user_currency)}</span> */}
            //           </div>
            //         <div className="card-add-detail__name">{cards?.groups?.find(item => item.id === (activeEntryData?.group_ref?.id ?? activeEntryData?.group_ref))?.group_name ?? ""}</div>
            //       </div>
            //     </div>
            //   </div>
            <>
              {cards.cards?.map((item, key) => (
                <div key={key} className="card-add">
                  {item?.data?.map((entry, k) => (
                    <div
                      key={k}
                      onClick={() => onActiveEntry(key, k, entry)}
                      className="mb-3 card-add-detail entry"
                    >
                      <div
                        className={`d-flex justify-content-between card-add-mobile ${
                          activeEntry.cardIndex === key &&
                          activeEntry.entryIndex === k
                            ? "active"
                            : "d-none"
                        }  rounded border border-1 p-2`}
                        onClick={() => {
                          // setCards(cloneDeep(cardsMobile))
                          // SetShowContentAddCollection(false);
                          dispatch(ConfigAction.updateShowMenuCollection(false))
                        }}
                      >
                        <div className="arrowBack">
                          <img src={IconArrow.src} className="revertArrow" alt="" />
                        </div>
                        <div className="content-card">
                          <div className="d-block justify-content-between align-items-center card-add-detail__txt box-left">
                            <div className="d-block align-items-center">
                              <div
                                className={`me-1 ${
                                  entry.grade_company &&
                                  entry.grade_company?.name == ungraded &&
                                  `${entry.grade_value}` == NotSpecified
                                    ? ""
                                    : "card-add-detail-grade text-nowrap"
                                }`}
                                style={{
                                  backgroundColor:
                                  entry.grade_company &&
                                  entry.grade_company?.name === ungraded &&
                                  `${entry.grade_value}` == NotSpecified
                                    ? "transparent"
                                    : entry.grade_company?.color_2 ??
                                      entry.grade_company?.grade_color_2,
                                color:
                                  entry.grade_company?.name === ungraded &&
                                  `${entry.grade_value}` == NotSpecified
                                    ? "#18213A"
                                    : entry.grade_company?.color_1 ??
                                      entry.grade_company?.grade_color_1,
                                }}
                              >
                                {renderGradeValue(entry)}
                              </div>
                              <strong className="ms-1 text-ellipsis">
                                {Boolean(+entry.user_price) && formatCurrencyCustom(
                                  entry.user_price,
                                  entry.user_currency
                                )}
                              </strong>
                            </div>
                          </div>
                          <div className="card-add-detail__name">
                            {cards?.groups?.find(
                              (item) =>
                                item.id ===
                                (entry?.group_ref?.id ?? entry?.group_ref)
                            )?.group_name ?? ""}
                          </div>
                        </div>
                        <div className="d-flex images justify-content-center align-items-center">
                          <div>
                            <img
                              className="rounded rounded-collection"
                              src={
                                entry?.image_upload?.front
                                  ? entry?.image_upload?.front
                                  : backgroundImage.src
                              }
                              alt=""
                            />
                          </div>
                          <div className="ms-2">
                            <img
                              className="rounded rounded-collection"
                              src={
                                entry?.image_upload?.back
                                  ? entry?.image_upload?.back
                                  : backgroundImage.src
                              }
                              alt=""
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </>
          )}
          {
            //@ts-ignore
            width >= 768 && (
            <>
              {isEdit && isEmpty(groupRef) ? (
                <Skeleton style={{ width: 100 }} />
              ) : (
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb breadcrumb-edit-card mt-1">
                    <li className="breadcrumb-item">
                        <Link href="/profile/portfolio">{ t('portfolio.text') }</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      {isEdit ? (
                        <Link
                          href={`/profile/portfolio/${groupRef?.id}/${groupRef?.name}`}
                        >
                          {groupRef?.name}
                        </Link>
                      ) : (
                        "Add Card"
                      )}
                    </li>
                    {isEdit && (
                      <li
                        className="breadcrumb-item active"
                        aria-current="page"
                      > Edit Card </li>
                    )}
                  </ol>
                </nav>
              )}
            </>
          )}

          <div className="add-collection-right-content">
            <div className="d-flex justify-content-between align-items-center add-collection-right__title">
              <h2 className="minhei-32">
                {isEdit ? `Edit Card in ${t('portfolio.text')}` : `Add Card to ${t('portfolio.text')}`}{" "}
              </h2>
              { // @ts-ignore
                isEdit && Boolean(cards?.cards?.length) && Boolean(cards?.cards[activeEntry.cardIndex].data[activeEntry.entryIndex].port_id) && undoChangeStatus && (
                <button type="button" onClick={onUndo} className="btn btn-undo m-0">
                  <img src={rotateLeft} alt="Undo Changes" title="Undo Changes"/> Undo Changes
                </button>
              )}
              {// @ts-ignore
                Boolean(cards?.cards?.length) && !Boolean(cards?.cards[activeEntry.cardIndex].data[activeEntry.entryIndex].port_id) && renderTextButton() === "s" && (
                <button
                  type="button"
                  onClick={onRemoveEntry}
                  className="btn btn-remove-entry"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.35559 5.66221L3.35559 15.1827C3.35559 15.7454 3.56345 16.2738 3.92657 16.653C4.28801 17.0332 4.79102 17.2491 5.31745 17.25H12.6826C13.2091 17.2491 13.7121 17.0332 14.0734 16.653C14.4365 16.2738 14.6444 15.7454 14.6444 15.1827L14.6444 5.66221C15.3662 5.47202 15.834 4.77979 15.7374 4.04455C15.6407 3.30945 15.0098 2.75956 14.2629 2.75941H12.2699V2.27639C12.2721 1.8702 12.1104 1.48017 11.8207 1.19322C11.531 0.906428 11.1375 0.74673 10.7283 0.750051L7.2717 0.750051C6.86251 0.74673 6.46899 0.906428 6.17932 1.19322C5.88964 1.48017 5.72785 1.8702 5.73013 2.27639V2.75941L3.7371 2.75941C2.99019 2.75956 2.3593 3.30945 2.26259 4.04455C2.16604 4.77979 2.63377 5.47202 3.35559 5.66221ZM12.6826 16.4772H5.31745C4.65189 16.4772 4.13413 15.9096 4.13413 15.1827L4.13413 5.69617L13.8659 5.69617L13.8659 15.1827C13.8659 15.9096 13.3481 16.4772 12.6826 16.4772ZM6.50867 2.27639C6.50609 2.07518 6.58577 1.88152 6.72961 1.73949C6.87331 1.59745 7.06886 1.51941 7.2717 1.52288L10.7283 1.52288C10.9311 1.51941 11.1267 1.59745 11.2704 1.73949C11.4142 1.88137 11.4939 2.07518 11.4913 2.27639V2.75941L6.50867 2.75941V2.27639ZM3.7371 3.53224L14.2629 3.53224C14.6499 3.53224 14.9636 3.84364 14.9636 4.22779C14.9636 4.61194 14.6499 4.92334 14.2629 4.92334L3.7371 4.92334C3.35012 4.92334 3.03642 4.61194 3.03642 4.22779C3.03642 3.84364 3.35012 3.53224 3.7371 3.53224Z"
                      fill="#CA1130"
                      stroke="#CA1130"
                      stroke-width="0.4"
                      stroke-linejoin="round"
                    />
                    <rect
                      x="5.94141"
                      y="7.5"
                      width="1.14"
                      height="7.32"
                      rx="0.57"
                      fill="#CA1130"
                    />
                    <rect
                      x="8.42969"
                      y="7.5"
                      width="1.14"
                      height="7.32"
                      rx="0.57"
                      fill="#CA1130"
                    />
                    <rect
                      x="10.9219"
                      y="7.5"
                      width="1.14"
                      height="7.32"
                      rx="0.57"
                      fill="#CA1130"
                    />
                  </svg>
                  Remove Entry
                </button>
              )}
            </div>
            <div>
              {!isEmpty(gradeCompanys) && (
                <div className="mb-3 add-collection-right-content-form">
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
                          // @ts-ignore
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
              <div className="mb-3">
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
            <div>
              <div className="d-flex justify-content-between form-input">
                <div className="mr-3 form-purchase">
                  <label htmlFor="inputEmail4" className="form-label">
                    Purchase Price{" "}
                    <OverlayTrigger
                     overlay={<Tooltip>This value is private. It can be used in the collection analytics as a substitute value for missing prices.</Tooltip>}
                    >
                      {({ ref, ...triggerHandler }) => (
                        <img
                          ref={ref}
                          {...triggerHandler}
                          className="ml-1 label-icon cursor-pointer"
                          src={IconQuestion.src}
                          alt=""
                        />
                      )}
                    </OverlayTrigger>
                  </label>
                  <div className="d-flex purchase-price">
                    <Controller
                      control={control}
                      name="user_currency"
                      render={({ field: { onChange, value } }) => (
                        <Select
                          value={value}
                          onChange={(e) => {
                            onChange(e);
                            onUpdateValue(e, "user_currency");
                          }}
                          classNamePrefix="select-price"
                          className="select-price customScroll input-height-56"
                          options={currencies}
                          styles={{
                            // @ts-ignore
                            dropdownIndicator: (provided, state) => ({
                              ...provided,
                              transition: 'all .2s ease',
                              transform: state.selectProps.menuIsOpen && "rotate(180deg)"
                            })
                          }}
                        />
                      )}
                      defaultValue={{ value: "USD", label: "USD" }}
                    />
                    <input
                      type="number"
                      defaultValue={0}
                      pattern="^-?[0-9]\d*\.?\d*$"
                      {...register("user_price", { required: true })}
                      onBlur={() => {
                        if (isEmpty(watchUserPrice)) {
                          onUpdateValue(0, "user_price");
                          setValue("user_price", "0");
                        }
                      }}
                      className="form-control input-price input-height-56"
                      id="inputEmail4"
                    />
                  </div>
                </div>
                <div className="form-purchase-date custom-input-date">
                  <label className="form-label">
                    Date Acquired{" "}
                    <span>
                      <OverlayTrigger
                        overlay={<Tooltip>This date is private, it is used in collection analytics to chart your portfolio value over time.</Tooltip>}
                      >
                        {({ ref, ...triggerHandler }) => (
                          <img
                            ref={ref}
                            {...triggerHandler}
                            className="ml-1 label-icon cursor-pointer"
                            src={IconQuestion.src}
                            alt=""
                          />
                        )}
                      </OverlayTrigger>
                    </span>
                  </label>
                  <Controller
                    control={control}
                    name="date_acq"
                    render={({ field: { onChange, value } }) => (
                      <DatePicker
                        className="form-control input-height-56"
                        dateFormat="MMM, d, yyyy"
                        maxDate={new Date()}
                        selected={value}
                        onChange={(e) => {
                          if (!e) {
                            onChange(new Date());
                            onUpdateValue(new Date(), "date_acq");
                          } else {
                            onChange(e);
                            onUpdateValue(e, "date_acq");
                          }
                        }}
                      />
                    )}
                    defaultValue={new Date()}
                  />
                </div>
              </div>
              <div></div>
            </div>
            <div className="mb-3 mt-4">
              <label htmlFor="" className="form-label">
                {" "}
                { t('portfolio.text') }{" "}
              </label>
              <Controller
                control={control}
                name="group_ref"
                render={({ field: { onChange, value } }) => (
                  <Select
                    value={value}
                    onChange={(e) => {
                      onChange(e);
                      onUpdateValue(e, "group_ref");
                    }}
                    className="w-100 input-collection"
                    classNamePrefix="input-collection"
                    getOptionLabel={(value: any) => value.group_name}
                    getOptionValue={(item: any) => item.id}
                    // classNamePrefix="w-100 input-collection-prefix"
                    options={cards.groups}
                    styles={{
                      // @ts-ignore
                      dropdownIndicator: (provided, state) => ({
                        ...provided,
                        transition: 'all .2s ease',
                        transform: state.selectProps.menuIsOpen && "rotate(180deg)"
                      })
                    }}
                  />
                )}
              />
            </div>
            <div className="row image-upload">
              <div
                onClick={() => onUpLoadFile("Front")}
                className="col-6 text-center"
              >
                <div className="border-img">
                  <input
                    ref={imageFrontRef}
                    id="imageFrontRef"
                    className="d-none"
                    type="file"
                    onChange={(e) => onUploadFileInput(e, "Front")}
                    accept="image/*"
                    onClick={(e: any) => {e.target.value = ''}}
                  />
                  <img
                    className="cursor-pointer w-100"
                    src={
                      imageFront.url ? (imageFront.url === backgroundImage.src ? backgroundImageUpload.src :   imageFront.url) : backgroundImageUpload.src
                    }
                    alt=""
                  />
                </div>
                <div className="mt-1 form-label"> Card Front </div>
              </div>
              <div
                onClick={() => onUpLoadFile("Back")}
                className="col-6 text-center"
              >
                <div className="border-img">
                  <img
                    className="cursor-pointer w-100"
                    src={imageBack.url ? imageBack.url === backgroundImage.src ? backgroundImageUpload.src : imageBack.url : backgroundImageUpload.src}
                    alt=""
                  />
                  <input
                    ref={imageBackRef}
                    id="imageBackRef"
                    className="d-none"
                    type="file"
                    onChange={(e) => onUploadFileInput(e, "Back")}
                    accept="image/*"
                    onClick={(e: any) => {e.target.value = ''}}
                  />
                </div>
                <div className="mt-1 form-label"> Card Back </div>
              </div>
            </div>
            <hr className="hr--color" />
            {/* {isEdit && (
              <div className="mt-3 pb-3 border-underline">
                <div className="d-flex justify-content-center">
                  <button
                    type="button"
                    className="btn btn-collection-outline btn-claim"
                  > Submit Images </button>
                </div>
                <div>
                  <span className="text-decoration-underline color-124DE3 text-claim">{" "}Submit your images{" "} </span>{" "} to the public gallery
                </div>
              </div>
            )} */}
            {/* <div className="form-check d-flex justify-content-between align-items-center">
              <div>
                <input {...register("agree_share")} className="form-check-input me-2" type="checkbox" id="flexCheckIndeterminate" />
              </div>
              <label className="form-check-label lh-sm" htmlFor="flexCheckIndeterminate">
                I agree to submit these uploaded images to the public gallery. For further details please see <a>Claiming Photos</a>.
              </label>
            </div> */}
            <div className="mb-3 mt-4">
              <label htmlFor="formGroupExampleInput" className="form-label">
                Note{" "}
                <OverlayTrigger overlay={<Tooltip>This note is private.</Tooltip>}>
                  {({ ref, ...triggerHandler }) => (
                    <img
                      ref={ref}
                      {...triggerHandler}
                      className="ml-1 label-icon cursor-pointer"
                      src={IconQuestion.src}
                      alt=""
                    />
                  )}
                </OverlayTrigger>
                (optional)
              </label>
              <textarea
                {...register("note")}
                className="form-control"
                rows={4}
                cols={50}
              ></textarea>
            </div>
            <div className="mt-56 mb-5 d-flex justify-content-between align-items-center btn-group-entry">
              {
                //@ts-ignore
                width < 768 && (
                <button
                  onClick={onSaveEntry}
                  type="button"
                  className="btn-lg btn btn-light btn-save w-50 mr-2"
                > Save Entry 	&amp; Back </button>
              )}
              <button
                onClick={onNewEntry}
                type="button"
                className="btn-lg btn btn-light btn-add w-50 mr-2"
              > Add New Entry </button>
              <button
                onClick={onDuplicateEntry}
                type="button"
                className="btn-lg btn btn-light btn-duplicate w-50 ml-2"
              > Duplicate Entry </button>
            </div>
            { // @ts-ignore
              isEdit && Boolean(cards?.cards?.length) && Boolean(cards?.cards?.[activeEntry.cardIndex]?.data[activeEntry.entryIndex]?.port_id) && (
              <div className="d-flex justify-content-center btn-remove-card-collection">
                <button
                  disabled={isLoadingDelete}
                  onClick={onRemoveCard}
                  className="btn btn-remove"
                > <img src={IconDelete.src} alt="" /> {renderTitleRemove()} </button>
              </div>
            )}
            {
              // @ts-ignore
              width < 768 && Boolean(cards?.cards.length) && !Boolean(cards?.cards?.[activeEntry.cardIndex]?.data[activeEntry.entryIndex]?.port_id)  && (
              <div className="d-flex justify-content-center btn-remove-card-collection">
                <button
                  disabled={isLoadingDelete}
                  onClick={onRemoveEntry}
                  className="btn btn-remove"
                > <img src={IconDelete.src} alt="Remove Entry" title="Remove Entry" /> Remove Entry </button>
              </div>
            )}
            { // @ts-ignore
              width < 768 && isEdit && Boolean(cards?.cards.length) && Boolean(cards?.cards?.[activeEntry.cardIndex]?.data[activeEntry.entryIndex]?.port_id) && (  
                <div className="d-flex justify-content-center btn-remove-card-collection">
                <button
                  onClick={onUndo}
                  className="btn btn-undo"
                >  <img src={rotateLeft} alt="Undo Changes" title="Undo Changes"/> Undo Changes </button>
              </div>
              )}
          </div>
        </div>
      </div>
      <EditImage
        code={`${
          cards?.cards?.length
            ? cards?.cards[activeEntry.cardIndex].card_id
            : ""
        }`}
        onSuccessFile={onSuccessFile}
        ref={EditImageRef}
      />
    </div>
  );
};

export default React.memo(AddCard);
