import React, { useState, useRef } from "react";
import moment from "moment";
import Skeleton from "react-loading-skeleton";
import {
  ManageCollectionType,
  CollectionType,
  CardCollectionType,
} from "interfaces";
import { api } from "configs/axios";
import { isEmpty, pull } from "lodash";
import ParameterTitle from "components/Skeleton/collection/parameterTitle";
import { formatCurrency, gen_card_url, isFirefox } from "utils/helper";
import CardElement from "components/cards/cardNode";
import { CardModel } from "model/data_sport/card_sport";
import Selectors from "redux/selectors";
import { useSelector, useDispatch } from "react-redux";
import LoginModal from "components/modal/login";
import ChosseCollection from "components/modal/chosseCollection";
import SelectGrading from "components/modal/selectGrading";
import { useRouter } from 'next/router'
import Link from 'next/link';
import IconPlus from "components/icon/iconPlus";
import IconMinis from "components/icon/iconMinis";
import IconDot3 from "assets/images/dot-3.svg";
// import ListLine from "components/icon/listLine"
import IconCloseMobile from "assets/images/close_mobile.svg";
import IconFolder from "assets/images/icon-folder-svg.svg";
import IconFolderFull from "assets/images/icon-folder-active.svg";
import IconHeart from "assets/images/icon_heart.svg";
import IconHeartFull from "assets/images/icon_heart_tim.svg";
import IconCan from "assets/images/icon_can.svg";
import IconCanFull from "assets/images/icon_can_tim.svg";
import { CompareAction } from "redux/actions/compare_action";
import { ToastSystem } from "helper/toast_system";
import ImageBlurHash from "components/imageBlurHash";
import ImgCard from "assets/images/Collection_Card.png";
import Pagination from "components/panigation";
import SkeletonCard from "components/Skeleton/cardItem";
import ListLine from "components/icon/listLine";
// @ts-ignore
import $ from "jquery";
import CardPhotoBase from "assets/images/Card Photo Base.svg";
import { useTranslation } from "react-i18next";
import Head from "next/head";
import CaptCha from "components/modal/captcha";

const rowsPerPage = 20;

type ParamTypes = {
  id: string;
  type: string;
  color: string;
};

type SortType = {
  by: string;
  asc: boolean;
};

type FilterDataType = {
  timePeriod?: number;
  sort?: SortType;
};

type DataTableTye = {
  cards: Array<CardCollectionType>;
  isLoading: boolean;
};

const limit = 20;

const CollectionBase = ({ ...props}) => {
  const [pagesSelected, setPagesSelected] = useState<Array<number>>([1]);
  const { loggingIn } = useSelector(Selectors.auth);
  const { cards } = useSelector(Selectors.compare);
  const [isOpenLogin, setIsOpenLogin] = useState<boolean>(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [cardData, setCardData] = useState<CardModel | undefined>();
  const [collection, setCollection] = useState<CollectionType>({
    cards: [],
    isLoading: true,
    rows: 0,
  });
  const [isCaptCha, setIsCaptCha] = useState<boolean>(false);
  // :type/:color/:slug
  const router = useRouter();
  const [cardSelected, setCardSelected] = useState<Array<string | number>>([]);
  const { type, color } = router.query;
  const [isCheckAll, setIsCheckAll] = useState<boolean>(false);
  
  const dispatch = useDispatch();
  const [wishList, setWishList] = React.useState<
    ManageCollectionType | undefined
  >();
  const [isOpenGrade, setIsOpenGrade] = React.useState(false);
  const [filterData, setFilterData] = useState<FilterDataType>({
    sort: {
      by: "onCardCode",
      asc: true,
    },
  });
  const checkListRef = useRef<any>(null);
  const [isSelect, setIsSelect] = useState<boolean>(false);
  const [isInline, setIsInline] = useState<boolean>(false);
  const [isOpenWishList, setIsOpenWishList] = React.useState(false);
  React.useEffect(() => {
    if (!isEmpty(router.query)) {
      getDetail();
    }
  }, [router.query]);
  const [t, i18n] = useTranslation("common")
  const getDetail = async (page: number[] = [1],  headers: any = {}): Promise<void> => {
    try {
      setCollection((prevState) => {
        return {
          ...prevState,
          isLoading: true,
          cards: page.length === 1 ? [] : [...(prevState?.cards ?? [])],
        };
      });
      let params: any = {
        type: Number(type),
        limit: rowsPerPage,
        page: page[page.length - 1],
        color: color,
        sort_dict: {
          sort_value: filterData?.sort?.by,
          sort_by: filterData?.sort?.asc ? "asc" : "desc",
        },
      };

      const result = await api.v1.collection.checkList({ ...params }, headers);
      result.data.rows = result.rows;
      if (result.success) {
        if (page.length === 1) {
          return setCollection({
            ...result.data,
            isLoading: false,
          });
        }
        // @ts-ignore
        return setCollection((prevState) => {
          return {
            ...prevState,
            cards: [...(prevState?.cards ?? []), ...result.data.cards],
            isLoading: false,
          };
        });
      }
      setCollection((prevState) => {
        return { ...prevState, isLoading: false };
      });
    } catch (error) {
      console.log("error........", error);
      //@ts-ignore
      if (error?.response?.status === 409) {
        //@ts-ignore
          setIsCaptCha(Boolean(error?.response?.data?.show_captcha))
      }

    }
  };

  const onSuccessCaptcha = (token: any) => {
    setIsCaptCha(false)
    const headers = { "captcha-token": token };
    getDetail([1],headers);
  }

  React.useEffect(() => {
    if (Boolean(collection.rows)) {
      getDetail([1]);
      setPagesSelected([1]);
    }
  }, [filterData]);

  const renderButtonFilter = (day: number) => {
    switch (day) {
      case 7:
        return `btn btn-secondary ${
          filterData?.timePeriod === 7 ? "isActive" : ""
        } `;
      case 14:
        return `btn btn-secondary ${
          filterData?.timePeriod === 14 ? "isActive" : ""
        } `;
      case 30:
        return `btn btn-secondary ${
          filterData?.timePeriod === 30 ? "isActive" : ""
        } `;
      case 90:
        return `btn btn-secondary ${
          filterData?.timePeriod === 90 ? "isActive" : ""
        } `;
      case 365:
        return `btn btn-secondary ${
          filterData?.timePeriod === 365 ? "isActive" : ""
        } `;
      default:
    }
  };

  const onChangeFilter = (e: any) => {
    // setFilterData(prevState => {
    //   return { ...prevState, timePeriod: e };
    // });
  };

  const renderSortTable = (name: string, asc: boolean) => {
    if (asc) {
      if (
        filterData?.sort?.by === name &&
        !filterData?.sort?.asc &&
        collection.rows
      ) {
        return "fa fa-caret-down active";
      }
      return "fa fa-caret-down";
    }
    if (
      filterData?.sort?.by === name &&
      filterData?.sort?.asc &&
      collection.rows
    ) {
      return "fa fa-caret-up active";
    }
    return "fa fa-caret-up";
  };

  const onSortTable = (name: string) => {
    if (collection.rows) {
      setFilterData((prevState) => {
        return {
          ...prevState,
          sort: {
            by: name,
            asc: prevState?.sort?.by === name ? !prevState?.sort?.asc : false,
          },
        };
      });
    }
  };

  const renderBreadcrumbs = () => {
    return (
      <nav aria-label="breadcrumb" className="breadcrumb-nav">
        <ol className="breadcrumb cursor-default">
          <li className="breadcrumb-item">
            <Link
              href={`/collections/${collection?.sport?.name
                ?.replace(/\s/g, "")
                ?.toLowerCase()}`}
            >
              <a>
                {collection?.sport?.name} Card Collections
              </a>
            </Link>
          </li>
          <li className="breadcrumb-item">
            <Link href={`/${collection.url}`}>{collection?.title}</Link>
          </li>
          <li className="breadcrumb-item active " aria-current="page">
            {`${collection?.type} - ${collection?.color}`}
          </li>
        </ol>
      </nav>
    );
  };

  const selectCollection = (item: ManageCollectionType) => {
    router.push(
      `/collections-add-card?collection=${
        item.group_ref
      }&code=${cardSelected.toString()}`
    );
  };

  const onGoToCard = (item: any) => {
    const url = gen_card_url(item.NameForWeb, item.onCardCode);
    router.push(`/card-details/${item.cardCode}/${url}`);
  };

  const selectWishlist = (item: ManageCollectionType) => {
    setWishList(item);
    setIsOpenWishList(false);
    setIsOpenGrade(true);
  };

  const onAddWishList = (item: any) => {
    setCardData(item);
    if (loggingIn) {
      setIsOpenWishList(true);
    } else {
      setIsOpenLogin(true);
    }
  };

  const onSelectItem = (code: any) => {
    if (cardSelected.includes(code)) {
      setCardSelected((prevState) => [...pull(prevState, code)]);
    } else {
      setCardSelected((prevState) => [...prevState, code]);
    }
  };

  const onSelectAll = () => {
    setIsCheckAll(true);
    //@ts-ignore
    setCardSelected([...collection.cards?.map((item) => item.cardCode)]);
    /// cần sửa
  };
  const onClear = () => {
    setIsCheckAll(false);
    setCardSelected([]);
  };

  React.useEffect(() => {
    if (!isSelect) {
      setIsCheckAll(false);
      setCardSelected([]);
    }
  }, [isSelect]);

  React.useEffect(() => {
    if (isInline && cardSelected.length) {
      setIsSelect(true);
    }
    if (isInline && !cardSelected.length) {
      setIsSelect(false);
    }
  }, [cardSelected]);

  const onHandleMode = () => {
    if (!isInline) {
      return setIsSelect((prevState) => !prevState);
    }
    if (isSelect) {
      setIsSelect(false);
    }
  };

  React.useEffect(() => {
    if (!isSelect && !isOpenWishList && !isSelect && !isOpen) {
      setCardSelected([]);
    }
  }, [isOpenWishList, isOpen]);

  const renderCompareIcon = (data: any) => {
    return Boolean(cards.find((item) => item.code === data.cardCode))
      ? IconCanFull
      : IconCan;
  };
  const renderOptionIcon = (data: any) => {
    return Boolean(cards.find((item) => item.code === data.cardCode))
      ? IconCanFull
      : IconDot3;
  };

  const onComparison = (cardData: any) => {
    let dataOld = JSON.parse(localStorage.getItem("comparison") ?? "[]") ?? [];

    if ( dataOld.length === 9 ) {
      return ToastSystem.error(<span> Max number of 9 cards reached on <Link href="/comparison">comparison list</Link> </span>);
    }

    const cardNew = {
      code: cardData.cardCode,
      lastname: cardData.lastname,
      firstname: cardData.firstname,
    };

    if (dataOld.find((item: any) => item.code === cardData.cardCode)) {
      dataOld = dataOld.filter((item: any) => item.code !== cardData.cardCode);
      dispatch(CompareAction.removeCard(cardData.cardCode));
      // ToastSystem.success("Card removed from comparison list");
      ToastSystem.success(<span>Card removed from <Link href="/comparison">comparison list</Link> </span>);
    } else {
      dataOld.push(cardNew);
      // ToastSystem.success("Card added to comparison list");
      ToastSystem.success(<span> Card added to <Link href="/comparison">comparison list</Link> </span>);
      dispatch(CompareAction.addCard(cardNew));
    }
    
    localStorage.setItem("comparison", JSON.stringify(dataOld));
  };

  const onLoadMore = () => {
    if (
      pagesSelected[pagesSelected.length - 1] + 1 <=
      Math.ceil((collection.rows ?? 0) / rowsPerPage)
    ) {
      getDetail([
        ...pagesSelected,
        pagesSelected[pagesSelected.length - 1] + 1,
      ]);

      setPagesSelected([
        ...pagesSelected,
        pagesSelected[pagesSelected.length - 1] + 1,
      ]);
    }
  };

  var timerid: any = null;

  const handlePageClick = (event: any) => {
    if (event.length === 1) {
      isFirefox
        ? $("html, body").animate({ scrollTop: checkListRef.current.offsetTop })
        : window.scrollTo({
            behavior: "smooth",
            top: checkListRef.current.offsetTop,
          });
    }
    if (timerid) {
      clearTimeout(timerid);
    }
    timerid = setTimeout(() => {
      setPagesSelected(event);
      getDetail(event);
    }, 550);
  };

  return (
    <>
      <Head>
      <title>{
        //@ts-ignore
        props?.titlePage ?? ''}</title>
      <meta name="description" content={
        //@ts-ignore
        props?.descriptionPage ?? ''} />
    </Head><div className="container-fluid card-detail collection-detail collection-detail--mobile">
        <div>
          {" "}
          {!Boolean(collection?.id) ? (
            <Skeleton width={300} />
          ) : (
            renderBreadcrumbs()
          )}{" "}
        </div>
        <div className="content-home template-collection-detail  template-collection-detail--mobile mt-5 mb-3">
          <div className="row">
            <div className="col-sm-6 col-12">
              <div className="h-100 row d-flex justify-content-end">
                <div className="col-sm-7 col-12 pr-box-picture box-picture">
                  <div className="bg-color-picture">
                    {Boolean(collection?.id) && (
                      <ImageBlurHash
                        imageDefault={ImgCard}
                        blurHash={collection?.blurhash ?? "LEHV6nWB2yk8pyo0adR*.7kCMdnj"}
                        height={"100%"}
                        width={"100%"}
                        className="w-100"
                        src={collection?.image
                          ? `${process.env.REACT_APP_IMAGE_COLLECTION_URL}/${collection?.image}`
                          : ImgCard.src} />
                    )}
                  </div>
                </div>
              </div>
            </div>
            {!Boolean(collection.id) ? (
              <ParameterTitle type="base" />
            ) : (
              <div className="col-md-6 col-12 ps-4 col-detail-base">
                <div className="collection-title-topic d-flex align-items-center">
                  <div>{collection?.sport?.name}</div>{" "}
                  <div className="circle-gray"></div>{" "}
                  <div>{collection?.year}</div>{" "}
                  <div className="circle-gray"></div>{" "}
                  <div>{collection?.publisher?.name}</div>
                </div>
                <h1 className=" collection-title mb-3">
                  {" "}
                  {`${collection?.title} - ${collection?.type} - ${collection?.color}`}{" "}
                </h1>
                <ul className="collection-gallery-info">
                  <li>
                    <label>Release Date:</label>{" "}
                    {typeof collection?.release_date === "number"
                      ? collection?.release_date
                      : moment(collection?.release_date, "MM/DD/YYYY").format(
                        "MMM Do YYYY"
                      )}
                  </li>
                  <li>
                    <label>Sport:</label>{" "}
                    <Link
                      href={`/collections/${collection?.sport?.name
                        ?.replace(/\s/g, "")
                        ?.toLowerCase()}}`}
                    >
                      <a title={collection?.sport?.name}>
                        {" "}
                        {collection?.sport?.name}{" "}
                      </a>
                    </Link>
                  </li>
                  <li>
                    <label>Publisher:</label> {collection?.publisher?.name}
                  </li>
                  <li>
                    <label>Year:</label> {collection?.year}
                  </li>
                  <li>
                    <label>Includes:</label>{" "}
                    {
                      // @ts-ignore
                      collection?.auto_memo?.name}
                  </li>
                  <li>
                    <label>Cards in Checklist: </label> {collection?.rows}
                  </li>
                </ul>
              </div>
            )}
            <div className="card-detail mt-3">
              <div
                id="checkList_collection"
                ref={checkListRef}
                className="d-flex justify-content-between align-items-center checklist-collection-title"
              >
                <span>Checklist</span>
                <div className="action-list d-flex justify-content-start align-items-center">
                  <div className="d-flex btn-group-card">
                    <button
                      type="button"
                      onClick={() => setIsInline((prevState) => !prevState)}
                      className={` ${!isInline ? "active" : ""} ms-2 btn btn-outline-secondary`}
                    >
                      {" "}
                      <i className="fa fa-th" aria-hidden="true"></i>{" "}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsInline((prevState) => !prevState);
                        setIsSelect(false);
                      } }
                      className={` ${isInline ? "active" : ""} btn btn-outline-secondary pl-0`}
                    >
                      {/* <i className="fa fa-list" aria-hidden="true"></i> */}
                      {/* <img src={IconList} /> */}
                      <ListLine />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={onHandleMode}
                    disabled={isInline && !cardSelected.length}
                    className={`ms-2  ${isInline && !cardSelected.length
                        ? "opacity-50"
                        : "opacity-100"}  btn btn-outline-secondary btn-search-plus ${isSelect ? "active" : ""} d-flex justify-content-center align-items-center`}
                  >
                    {isSelect ? <IconMinis /> : <IconPlus />}
                  </button>
                </div>
              </div>
              {isSelect && (
                <div
                  className={`d-flex justify-content-between align-items-start p-head-search p-10 ${isSelect ? "p-sticky-header" : ""}`}
                >
                  <div className="d-flex align-items-center ml-1 btn-group-head-search">
                    <div className="me-2  btn-group-head-search-title">
                      <span className="fw-bold">{cardSelected.length} </span>{" "}
                      cards selected
                    </div>
                    <button
                      disabled={!cardSelected.length}
                      type="button"
                      onClick={() => {
                        setCardData(undefined);
                        if (loggingIn) {
                          setIsOpen(true);
                        } else {
                          setIsOpenLogin(true);
                        }
                      } }
                      className="me-2 btn btn-portfolio"
                    >
                      {" "}
                      Add To Portfolio{" "}
                    </button>
                    <button
                      type="button"
                      onClick={onSelectAll}
                      className="me-2 btn btn-secondary btn-select-all"
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={onClear}
                      className="me-2 btn btn-outline-secondary btn-clear-section"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="only-mobile group-head-search-content">
                    <div className="d-flex align-items-center ml-1 btn-group-head-search btn-group-head-search--mobile">
                      <div className="group-head-search-info">
                        <div className="group-head-search-info-text d-flex">
                          <div> Select All </div>
                          <div>
                            {" "}
                            <span className="fw-bold">
                              {cardSelected.length}
                            </span>{" "}
                            cards selected{" "}
                          </div>
                        </div>
                        <img
                          alt=""
                          onClick={onHandleMode}
                          src={IconCloseMobile} />
                      </div>
                      {cardSelected.length > 0 && (
                        <div className="group-head-search-btn">
                          <button
                            disabled={!cardSelected.length}
                            type="button"
                            onClick={() => {
                              setCardData(undefined);
                              if (loggingIn) {
                                setIsOpen(true);
                              } else {
                                setIsOpenLogin(true);
                              }
                            } }
                            className="me-2 btn  btn-portfolio"
                          >
                            {" "}
                            Add to {t('portfolio.text')}{" "}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {!isInline ? (
                <div className="row mt-4 row-collection-base">
                  {collection.cards?.map((item, key) => (
                    <CardElement
                      valueName="code"
                      isInline={isInline}
                      key={item.id}
                      cardSelected={cardSelected}
                      onSelectItem={onSelectItem}
                      imageUrl={item?.image
                        ? `https://img.priceguide.cards/${item.sport === "Non-Sport" ? "ns" : "sp"}/${item?.image}.jpg`
                        : undefined}
                      isSelect={isSelect}
                      gotoCard={() => onGoToCard(item)}
                      // @ts-ignore
                      onAddWishList={() => onAddWishList({
                        ...item,
                        code: item.cardCode,
                      })}
                      onAddCollection={() => {
                        setCardData(undefined);
                        //@ts-ignore
                        setCardSelected([item.cardCode]);
                        if (loggingIn) {
                          setIsOpen(true);
                        } else {
                          setIsOpenLogin(true);
                        }
                      } }
                      item={{
                        ...item,
                        //@ts-ignore
                        sport: collection?.sport?.name ?? "",
                        year: collection?.year ?? "",
                        webName: item.Name ?? "",
                        code: item.cardCode,
                        // @ts-ignore
                        publisher: collection?.publisher?.name ?? "",
                      }} />
                  ))}
                </div>
              ) : (
                <>
                  <div className="pricing-grid mt-3">
                    <div className="content-pricing-grid p-0 customScroll custom-scroll-sticky">
                      <table
                        className="table table-hover"
                        style={{ minWidth: "1140px" }}
                      >
                        <thead
                          style={{
                            top: isSelect ? 52 : 0,
                          }}
                          className="p-sticky-header"
                        >
                          <tr>
                            <th
                              style={{ width: "4%" }}
                              scope="col"
                              className="text-center"
                            >
                              <input
                                onChange={() => {
                                  isCheckAll ? onClear() : onSelectAll();
                                } }
                                checked={isCheckAll}
                                className="form-check-input cursor-pointer mt-0"
                                type="checkbox" />
                            </th>
                            <th style={{ width: "12%" }} scope="col">
                              {" "}
                            </th>
                            <th style={{ width: "13%" }} scope="col">
                              <div
                                onClick={() => onSortTable("onCardCode")}
                                className="d-flex cursor-pointer align-items-center"
                              >
                                {" "}
                                Card No.
                                <div className="ms-1 sort-table">
                                  <i
                                    className={`sort-asc ${renderSortTable(
                                      "onCardCode",
                                      true
                                    )}`}
                                    aria-hidden="true"
                                  ></i>
                                  <i
                                    className={`sort-desc ${renderSortTable(
                                      "onCardCode",
                                      false
                                    )}`}
                                    aria-hidden="true"
                                  ></i>
                                </div>
                              </div>
                            </th>
                            <th style={{ width: "24%" }} scope="col">
                              <div
                                onClick={() => onSortTable("Name")}
                                className="d-flex cursor-pointer align-items-center"
                              >
                                {" "}
                                Player Name
                                <div className="ms-1 sort-table">
                                  <i
                                    className={`sort-asc ${renderSortTable(
                                      "Name",
                                      true
                                    )}`}
                                    aria-hidden="true"
                                  ></i>
                                  <i
                                    className={`sort-desc ${renderSortTable(
                                      "Name",
                                      false
                                    )}`}
                                    aria-hidden="true"
                                  ></i>
                                </div>
                              </div>
                            </th>
                            <th style={{ width: "8%" }} scope="col">
                              <div
                                onClick={() => onSortTable("minPrice")}
                                className="d-flex cursor-pointer align-items-center"
                              >
                                {" "}
                                Min
                                <div className="ms-1 sort-table">
                                  <i
                                    className={`sort-asc ${renderSortTable(
                                      "minPrice",
                                      true
                                    )}`}
                                    aria-hidden="true"
                                  ></i>
                                  <i
                                    className={`sort-desc ${renderSortTable(
                                      "minPrice",
                                      false
                                    )}`}
                                    aria-hidden="true"
                                  ></i>
                                </div>
                              </div>
                            </th>
                            <th style={{ width: "8%" }} scope="col">
                              <div
                                onClick={() => onSortTable("maxPrice")}
                                className="d-flex cursor-pointer align-items-center"
                              >
                                {" "}
                                Max
                                <div className="ms-1 sort-table">
                                  <i
                                    className={`sort-asc ${renderSortTable(
                                      "maxPrice",
                                      true
                                    )}`}
                                    aria-hidden="true"
                                  ></i>
                                  <i
                                    className={`sort-desc ${renderSortTable(
                                      "maxPrice",
                                      false
                                    )}`}
                                    aria-hidden="true"
                                  ></i>
                                </div>
                              </div>
                            </th>
                            <th style={{ width: "15%" }} scope="col">
                              <div
                                onClick={() => onSortTable("count")}
                                className="d-flex cursor-pointer align-items-center"
                              >
                                {" "}
                                No. of Trades
                                <div className="ms-1 sort-table">
                                  <i
                                    className={`sort-asc ${renderSortTable(
                                      "count",
                                      true
                                    )}`}
                                    aria-hidden="true"
                                  ></i>
                                  <i
                                    className={`sort-desc ${renderSortTable(
                                      "count",
                                      false
                                    )}`}
                                    aria-hidden="true"
                                  ></i>
                                </div>
                              </div>
                            </th>
                            <th style={{ width: "10%" }} scope="col">
                              <div
                                onClick={() => onSortTable("printRun")}
                                className="d-flex cursor-pointer align-items-center"
                              >
                                {" "}
                                Print Run
                                <div className="ms-1 sort-table">
                                  <i
                                    className={`sort-asc ${renderSortTable(
                                      "printRun",
                                      true
                                    )}`}
                                    aria-hidden="true"
                                  ></i>
                                  <i
                                    className={`sort-desc ${renderSortTable(
                                      "printRun",
                                      false
                                    )}`}
                                    aria-hidden="true"
                                  ></i>
                                </div>
                              </div>
                            </th>
                            <th style={{ width: "6%" }} scope="col"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {collection.cards?.map((item, index) => (
                            <tr key={index}>
                              <td className="text-center">
                                {" "}
                                <input
                                  onChange={() => onSelectItem(item.cardCode)}
                                  checked={cardSelected?.includes(item.cardCode)}
                                  className="form-check-input cursor-pointer"
                                  type="checkbox" />
                              </td>
                              <td>
                                <div className="d-flex">
                                  <div
                                    onClick={() => onGoToCard(item)}
                                    className="cursor-pointer image-box-table mr-2"
                                  >
                                    <img
                                      alt=""
                                      className="w-100"
                                      onError={({ currentTarget }) => {
                                        currentTarget.onerror = null; // prevents looping
                                        currentTarget.src = CardPhotoBase;
                                      } }
                                      src={item?.image
                                        ? `https://img.priceguide.cards/${item.sport === "Non-Sport"
                                          ? "ns"
                                          : "sp"}/${item?.image}.jpg`
                                        : CardPhotoBase} />
                                  </div>
                                  <div
                                    onClick={() => onGoToCard(item)}
                                    className="cursor-pointer image-box-table mr-2"
                                  >
                                    <img className="w-100" src={CardPhotoBase} alt="" />
                                  </div>
                                </div>
                              </td>
                              <td
                                onClick={() => onGoToCard(item)}
                                className="cursor-pointer"
                              >
                                {" "}
                                {item.onCardCode}
                              </td>
                              <td
                                onClick={() => onGoToCard(item)}
                                className="cursor-pointer"
                              >
                                <div> {item.Name} </div>
                                {(Boolean(item.auto) || Boolean(item.memo)) && (
                                  <div className="content-tag d-flex mt-2">
                                    {Boolean(item.auto) && (
                                      <div className="au-tag"> AU </div>
                                    )}
                                    {Boolean(item.memo) && (
                                      <div className="mem-tag"> MEM </div>
                                    )}
                                  </div>
                                )}
                              </td>
                              <td>
                                {" "}
                                {item.minPrice
                                  ? formatCurrency(item.minPrice)
                                  : "N/A"}{" "}
                              </td>
                              <td>
                                {" "}
                                {item.maxPrice
                                  ? formatCurrency(item.maxPrice)
                                  : "N/A"}{" "}
                              </td>
                              <td> {item.count} </td>
                              <td> {item.printRun} </td>
                              <td>
                                <div className="dropdown dropdown--top">
                                  <a href="#" id="navbarDropdownDot" role="button" data-bs-toggle="dropdown" aria-expanded="true"> {" "} <img alt="" src={renderOptionIcon(item)} /> {" "} </a>
                                  <div
                                    className="dropdown-menu"
                                    aria-labelledby="navbarDropdownDot"
                                    data-bs-popper="none"
                                  >
                                    <div
                                      onClick={() => {
                                        setCardData(undefined);
                                        setCardSelected([item.cardCode]);
                                        if (loggingIn) {
                                          setIsOpen(true);
                                        } else {
                                          setIsOpenLogin(true);
                                        }
                                      } }
                                      className="dropdown-menu-item d-flex cursor-pointer"
                                    >
                                      <div className="dropdown-menu-item__icon">
                                        <img
                                          alt=""
                                          src={!Boolean(item.portfolio)
                                            ? IconFolder
                                            : IconFolderFull} />
                                      </div>
                                      <div className="dropdown-menu-item__txt"> {" "} Add to {t('portfolio.text')} {" "} </div>
                                    </div>
                                    <div
                                      onClick={() => onAddWishList({
                                        ...item,
                                        code: item.cardCode,
                                      })}
                                      className="dropdown-menu-item  d-flex cursor-pointer"
                                    >
                                      <div className="dropdown-menu-item__icon">
                                        <img
                                          alt=""
                                          src={!Boolean(item.wishlist)
                                            ? IconHeart
                                            : IconHeartFull} />
                                      </div>
                                      <div className="dropdown-menu-item__txt"> Add to Wishlist </div>
                                    </div>
                                    <div
                                      onClick={() => onComparison(item)}
                                      className="dropdown-menu-item  d-flex cursor-pointer"
                                    >
                                      <div className="dropdown-menu-item__icon">
                                        <img alt="" src={renderCompareIcon(item)} />
                                      </div>
                                      <div className="dropdown-menu-item__txt"> {" "} Add to Comparison {" "} </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {collection.isLoading &&
                            Array.from(Array(16).keys())?.map((e, index) => (
                              <tr key={index}>
                                <td className="text-center">
                                  {" "}
                                  <Skeleton />{" "}
                                </td>
                                <td>
                                  {" "}
                                  <Skeleton />{" "}
                                </td>
                                <td className="cursor-pointer">
                                  {" "}
                                  <Skeleton />{" "}
                                </td>
                                <td className="cursor-pointer">
                                  {" "}
                                  <Skeleton />{" "}
                                </td>
                                <td>
                                  {" "}
                                  <Skeleton />{" "}
                                </td>
                                <td>
                                  {" "}
                                  <Skeleton />{" "}
                                </td>
                                <td>
                                  {" "}
                                  <Skeleton />{" "}
                                </td>
                                <td>
                                  {" "}
                                  <Skeleton />{" "}
                                </td>
                                <td>
                                  {" "}
                                  <Skeleton />{" "}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
              <div className="row row-list">
                {collection.isLoading && (
                  <>{!isInline && <SkeletonCard numberLine={28} />}</>
                )}
              </div>
            </div>
            <div
              className={`${!collection.isLoading && Boolean(collection.rows) ? "" : "d-none"}`}
            >
              {Boolean(
                pagesSelected[pagesSelected.length - 1] <
                Math.ceil((collection?.rows ?? 0) / rowsPerPage)
              ) && (
                  <div className="d-flex justify-content-center">
                    <button
                      onClick={onLoadMore}
                      type="button"
                      className="btn btn-light load-more"
                      title="Load More"
                    > {" "} Load More {" "} </button>
                  </div>
                )}
              <div className="d-flex justify-content-center mt-3">
                <Pagination
                  pagesSelected={pagesSelected}
                  onSelectPage={handlePageClick}
                  totalPage={Math.ceil((collection.rows ?? 0) / rowsPerPage)} />
              </div>
            </div>
            {/* <nav aria-label="Page navigation example">
      <ul className="pagination">
        <li className="page-item"><a className="page-link" href="#">Previous</a></li>
        <li className="page-item"><a className="page-link" href="#">1</a></li>
        <li className="page-item"><a className="page-link" href="#">2</a></li>
        <li className="page-item"><a className="page-link" href="#">3</a></li>
        <li className="page-item"><a className="page-link" href="#">Next</a></li>
      </ul>
    </nav> */}
            {/* <div style={{ fontSize: 18 }} className="pricing-grid mt-0">
      <div className="fs-3 fw-bold mb-5">Sales Overview</div>
      <div className="btn-group btn-group-sm filter-date" role="group" aria-label="Basic radio toggle button group">
        <input type="radio" className="btn-check" name="btnradio" id="btnradio1" autoComplete="off" defaultChecked />
        <label onClick={() => onChangeFilter(7)} className="btn btn-light" htmlFor="btnradio1">1 week</label>
        <input type="radio" className="btn-check" name="btnradio" id="btnradio2" autoComplete="off" />
        <label onClick={() => onChangeFilter(14)} className="btn btn-light" htmlFor="btnradio2">2 weeks</label>
        <input type="radio" className="btn-check" name="btnradio" id="btnradio3" autoComplete="off" />
        <label onClick={() => onChangeFilter(30)} className="btn btn-light" htmlFor="btnradio3">1 Month</label>
        <input type="radio" className="btn-check" name="btnradio" id="btnradio4" autoComplete="off" />
        <label onClick={() => onChangeFilter(90)} className="btn btn-light" htmlFor="btnradio4">3 Month</label>
        <input type="radio" className="btn-check" name="btnradio" id="btnradio5" autoComplete="off" />
        <label onClick={() => onChangeFilter(365)} className="btn btn-light" htmlFor="btnradio5">1 Year</label>
      </div>
      <div className="content-pricing-grid mh-100 customScroll">
        <ChartLineDemo />
      </div>
    </div> */}
          </div>
        </div>
        <ChosseCollection
          selectCollection={selectWishlist}
          table="wishlist"
          title="wishlist"
          isOpen={isOpenWishList}
          setIsOpen={setIsOpenWishList} />
        <ChosseCollection
          selectCollection={selectCollection}
          isOpen={isOpen}
          setIsOpen={setIsOpen} />
        <LoginModal
          onSuccess={() => {
            setIsOpenLogin(false);
            if (cardData) {
              setIsOpenWishList(true);
            } else {
              setIsOpen(true);
            }
          } }
          isOpen={isOpenLogin}
          onClose={() => setIsOpenLogin(false)} />
        {cardData && loggingIn && (
          <SelectGrading
            wishList={wishList}
            cardData={cardData}
            isOpen={isOpenGrade}
            onSuccess={(code) => {
              let dataNew = [...(collection?.cards ?? [])];
              dataNew = dataNew.map((card) => card.cardCode === code ? { ...card, wishlist: 1 } : { ...card }
              );
              return setCollection((prevState) => {
                return {
                  ...prevState,
                  cards: dataNew,
                };
              });
            } }
            setIsOpen={setIsOpenGrade} />
        )}
        <CaptCha
        isOpen={isCaptCha}
        onSuccess={onSuccessCaptcha}
        onClose={() => setIsCaptCha(false)} />
      </div></>
  );
};
export const getServerSideProps = async (context: any) => { 
  try {
    const ctx = context.query;
    
    let titlePage = `${ctx.slug}| PriceGuide.Cards`;
    let descriptionPage = `${ctx.slug} Checklist`;

    return {props:{
     titlePage,
     descriptionPage,
    }}

  } catch (error) {
    
  }
  return {
    props: {},
  };
}
export default CollectionBase;
