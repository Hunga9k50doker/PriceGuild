import React, { useEffect, useState, useRef, useImperativeHandle } from "react";
import queryString from "query-string";
import Select, { components } from "react-select";
import ChartCircleDemo from "components/chart/chartCircleDemo";
import SaleBarChart, { TypeSale } from "./components/sale_bar_chart";
import "react-toggle/style.css";
import SaleChart from "./components/sale_chart";
import MoreFromCollection from "components/cardDetail/components/moreFromCollection";
import { formatCurrency, gen_card_url } from "utils/helper";
import { ManageCollectionType } from "interfaces";
import { Types } from "components/cardDetail/BusinessLogic";
import IconChart from "assets/images/view_chart.svg";
import Icon3Dot from "assets/images/dot-3.svg";
import IconFolder from "assets/images/icon_folder.svg";
import IconFolderTim from "assets/images/icon_folder_tim.svg";
import IconTable from "assets/images/table.svg";
import IconHeart from "assets/images/icon_heart.svg";
import IconHeartTim from "assets/images/icon_heart_tim.svg";
import IconCan from "assets/images/icon_can.svg";
import IconCanTim from "assets/images/icon_can_tim.svg";
import LoginModal from "components/modal/login";
import Skeleton from "react-loading-skeleton";
import { Helmet } from "react-helmet";
import Modal from "react-bootstrap/Modal";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { UtilsColorGrade, HelperSales, PricingGridModel } from "model/data_sport/pricing_grid";
import { CardDetailProvider, CardDetailConsumer, CardDetailSaga } from "./BusinessLogic";
import { useDispatch, useSelector } from "react-redux";
import Selectors from "redux/selectors";
import { CardModel, SaleData } from "model/data_sport/card_sport";
import { useRouter } from "next/router";
import Link from "next/link";
import ChosseCollection from "components/modal/chosseCollection";
import { isEmpty, size } from "lodash";
import SelectGrading from "components/modal/selectGrading";
import { CompareAction } from "redux/actions/compare_action";
import { ToastSystem } from "helper/toast_system";
import ClaimPhoto from "components/modal/claimPhoto";
import ImageBlurHash from "components/imageBlurHash";
import useWindowDimensions from "utils/useWindowDimensions";
// @ts-ignore
import $ from "jquery";
import ChartFlow from "./components/chartFlow";
import ModalZoomImage from "components/modal/zoomImage/modalZoomImage";
import ImageDefault from "assets/images/card_default.png";
import ReportImage, { CardForm } from "components/modal/reportImage";
import "rc-tree-select/assets/index.css";
// @ts-ignore
import TreeSelect, { TreeNode } from "rc-tree-select";
import PlaceholderChart from "./components/placeholder_chart";
import ImageLineChart from "assets/images/line_chart_placeholder.png";
import ImageSaleChart from "assets/images/sale_chart_placeholder.png";
import classes from "./styles.module.scss";
import * as _ from "lodash";
import { useTranslation } from "react-i18next";
import CaptCha from "components/modal/captcha";
import { api } from "configs/axios";
import EditIconBlack from "assets/images/edit-icon-black.svg";
import IconUnion from "assets/images/union_wishlist.svg";
import { ConfigAction } from "redux/actions/config_action";
import { getCookie } from "utils/helper";

type PropTypes = {
  code?: string;
  onUpdateCard?: (item: any, controller: CardDetailSaga) => void;
  isHideGrid?: boolean;
  isHideDetail?: boolean;
  isHideSaleChart?: boolean;
  classContent?: string;
  isGradedCardTitle?: boolean;
  onChangeGradeCompare?: (cardGrade: PricingGridModel, cardId: number) => void;
  errorCard?: (code: string) => void;
  errorNoSaleData?: (code: string) => void;
  errorSale?: (code: boolean) => void;
};

type ParamTypes = {
  cardCodeDetail: string;
  nameCard: string;
};
export interface RefType {
  loadSalaData: (token: any) => void;
}

const CardDetail = React.forwardRef<RefType, PropTypes>((props, ref) => {
  const nameToolTip = "Login to see pricing";
  const [value, setValue] = useState(["ALL"]);
  const dispatch = useDispatch();
  const pricingGridRef = useRef<any>(null);
  const salesOverviewRef = useRef<any>(null);
  const salesChartdRef = useRef<any>(null);
  const treeRef = useRef<any>(null);
  const [isOpenLogin, setIsOpenLogin] = useState<boolean>(false);
  const [isLoadingSalesChart, setIsLoadingSalesChart] = useState<boolean>(false);
  const [cardData, setCardData] = useState<CardModel | undefined>();
  const refProvider = useRef<any>(null);
  const [isOpenClaim, setIsOpenClaim] = useState<boolean>(false);
  const { userInfo, loggingIn } = useSelector(Selectors.auth);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isOpenWishList, setIsOpenWishList] = React.useState(false);
  const [isOpenSeeFullTable, setIsOpenSeeFullTable] = React.useState(false);
  const router = useRouter();
  const [cardDetail] = useState(router.query);
  const [point, setPoint] = React.useState<any | undefined>();
  const [frontBack, setFrontBack] = useState<string>("");
  const { cards } = useSelector(Selectors.compare);
  const [wishList, setWishList] = React.useState<ManageCollectionType | undefined>();
  const { width } = useWindowDimensions();
  const [isLimitTable, setIsLimitTable] = useState<boolean>(true);
  const [lengthTablePrice, setLengthTablePrice] = useState<number>(0);
  const [gradeCompanys, setGradeCompany] = useState<Array<any>>([]);
  const [isOpenReport, setIsOpenReport] = useState<boolean>(false);
  const [isCaptCha, setIsCaptCha] = useState<boolean>(false);
  const [t, i18n] = useTranslation("common");
  const [isOpenGrade, setIsOpenGrade] = React.useState(false);
  const [isNotActive, setIsNotAcitve] = React.useState<Boolean>(false);
  const [notActiveMessage, setNotActiveMessage] = React.useState<string>("");
  const [checkLoadImage, setCheckLoadImage] = useState<boolean>(false);
  const [checkLoadImageBack, setCheckLoadImageBack] = useState<boolean>(false);
  const [keepCardCode, setKeepCardCode] = useState("");
  const [isReportImage, setIsReportImage] = useState<boolean>(true);
  const [onMenu, setOnMenu] = useState<boolean>(false);
  const [onIcon, setOnIcon] = useState<boolean>(false);
  const [openMnCardPortfolio, setOpenMnCardPortfolio] = useState<boolean>(false);
  const { currency } = useSelector(Selectors.config);
  useEffect(() => {
    if (getCookie("currency_name") === currency) {
      if (!isEmpty(router?.query.cardCodeDetail) || !isEmpty(props.code)) {
        console.log(currency, "currency");
        let cardCode = router?.query?.cardCodeDetail ?? props.code;
        // @ts-ignore
        setKeepCardCode(cardCode);
        let controller: CardDetailSaga = refProvider?.current.controller as CardDetailSaga;
        if (!isEmpty(cardCode)) {
          controller
            .loadCardDetail({
              // @ts-ignore
              card_code: cardCode,
              currency: currency,
            })
            .catch((error) => {
              props.errorCard && props.errorCard(props?.code ?? "");
            });

          if (loggingIn) {
            controller
              .loadSaleData({
                // @ts-ignore
                card_code: cardCode,
                currency: currency,
              })
              .catch((err) => {
                //@ts-ignore
                if (err?.status === 403) {
                  setIsNotAcitve(true);
                  setNotActiveMessage(err.message);
                }
                // debugger;
                if (err?.status === 409) {
                  if (Boolean(err?.show_captcha)) {
                    if (router.pathname === "/card-details/[cardCodeDetail]/[cardName]") {
                      setIsCaptCha(Boolean(err?.show_captcha));
                    }

                    props.errorSale && props.errorSale(true);
                  }
                } else {
                  props.errorNoSaleData && props.errorNoSaleData(props?.code ?? "");
                }
              });
          }

          controller
            .loadPricingGrid({
              // @ts-ignore
              cardcode: cardCode,
              currency: currency,
              userid: userInfo.userid,
            })
            .catch((err: any) => {
              props.errorNoSaleData && props.errorNoSaleData(props?.code ?? "");
            });
        }
      }
    }
  }, [props.code, loggingIn, router.query, currency]);

  useImperativeHandle(ref, () => ({
    loadSalaData: _loadSaleDataCapCha,
  }));

  const _loadSaleDataCapCha = (headers: any = {}) => {
    let controller: CardDetailSaga = refProvider?.current.controller as CardDetailSaga;
    controller.loadSaleData(
      {
        // @ts-ignore
        card_code: keepCardCode,
        currency: currency,
      },
      headers
    );
  };

  const loadCardDetail = () => {
    let cardCode = router?.query?.cardCodeDetail;
    let controller: CardDetailSaga = refProvider?.current.controller as CardDetailSaga;

    controller.loadCardDetail({
      // @ts-ignore
      card_code: cardCode,
      currency: currency,
      onUpdateCard: undefined,
    });
  };

  const renderBreadcrumbs = (cardData: CardModel) => {
    if (cardData?.id) {
      return (
        <nav className="border-botom" aria-label="breadcrumb">
          <ol className="breadcrumb" vocab="https://schema.org/" typeof="BreadcrumbList">
            <li className="breadcrumb-item" property="itemListElement" typeof="ListItem">
              <Link href={`/collections/${cardData.sport.name.replace(/\s/g, "").toLowerCase()}`}>
                <a title={`${cardData.sport.name} Card Collections`} property="item" typeof="WebPage">
                  <span property="name"> {cardData.sport.name} Card Collections </span>
                </a>
              </Link>
              <meta property="position" content="1"></meta>
            </li>
            <li className="breadcrumb-item" property="itemListElement" typeof="ListItem">
              <Link href={`/${cardData.set.url}`}>
                <a title={cardData.set.title} property="item" typeof="WebPage">
                  <span property="name"> {cardData.set.title} </span>
                </a>
              </Link>
              <meta property="position" content="2"></meta>
            </li>
            <li className="breadcrumb-item" property="itemListElement" typeof="ListItem">
              <Link href={`/checklist/${cardData.type.id}/${cardData.color.code}/${cardData.color.url}`}>
                <a title={`${cardData.type.name} - ${cardData.color.name}`} property="item" typeof="WebPage">
                  <span property="name">
                    {cardData.type.name} - {cardData.color.name}
                  </span>
                </a>
              </Link>
              <meta property="position" content="3"></meta>
            </li>
            <li className="breadcrumb-item active" aria-current="page" property="itemListElement" typeof="ListItem">
              <Link href={`/card-details/${cardData?.code}/${gen_card_url(cardData?.webName, cardData?.cardNumber)}`}>
                <a title={`${cardData.firstname} ${cardData?.lastname ?? ""}`} property="item" typeof="WebPage">
                  <span property="name">
                    {cardData.firstname} {cardData?.lastname ?? ""}
                  </span>
                </a>
              </Link>
              <meta property="position" content="4"></meta>
            </li>
          </ol>
        </nav>
      );
    }
    return <Skeleton width={150} height={34} />;
  };

  const selectCollection = (item: ManageCollectionType) => {
    router.push(`/collections-add-card?collection=${item.group_ref}&code=${router?.query?.cardCodeDetail}`);
  };

  const selectWishlist = (item: ManageCollectionType) => {
    setWishList(item);
    setIsOpenWishList(false);
    setIsOpenGrade(true);
  };

  const onComparison = (cardData: CardModel) => {
    let dataOld = JSON.parse(localStorage.getItem("comparison") ?? "[]") ?? [];

    if (dataOld.length === 9) {
      return ToastSystem.error(
        <span>
          Max number of 9 cards reached on <Link href="/comparison"> comparison list </Link>
        </span>
      );
    }

    const cardNew = {
      code: cardData.code,
      lastname: cardData.lastname,
      firstname: cardData.firstname,
    };

    if (dataOld.find((item: any) => item.code === cardData.code)) {
      dataOld = dataOld.filter((item: any) => item.code !== cardData.code);
      dispatch(CompareAction.removeCard(cardData.code));
      ToastSystem.success(
        <span>
          Card removed from <Link href="/comparison">comparison list</Link>
        </span>
      );
    } else {
      dataOld.push(cardNew);
      ToastSystem.success(
        <span>
          Card added to <Link href="/comparison">comparison list</Link>
        </span>
      );
      dispatch(CompareAction.addCard(cardNew));
    }

    localStorage.setItem("comparison", JSON.stringify(dataOld));
  };

  const onClaimPhoto = (front_back: string) => {
    setFrontBack(front_back);
    setIsOpenClaim(true);
  };

  const renderGrade = (vale: Map<string, PricingGridModel[]>, dispatchReducer: Types.DispatchReducer, gradeName: string) => {
    let colors: any[] = [];
    // @ts-ignore
    Array.from(vale.keys()).map((gradeCompany) => colors.push(UtilsColorGrade.getColorGrade(gradeCompany)));

    return (
      <>
        <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
          <ul className="nav nav-tabs" id="myTab" role="tablist">
            {Array.from(vale.keys()).map((item, key) => (
              <li
                key={key}
                onClick={() => {
                  dispatchReducer({ type: "UPDATE_KEY_GRADE", key: item });
                }}
                className={`nav-item ${gradeName === item ? "active" : ""}`}
                role="presentation"
              >
                <button
                  style={{ backgroundColor: colors[key] }}
                  className={`border-0 nav-link ${gradeName === item ? "active" : ""} `}
                  id={`${item}grade`}
                  data-bs-toggle="tab"
                  data-bs-target={`#${item}grade`}
                  type="button"
                  role="tab"
                  aria-controls={`${item}grade`}
                  aria-selected={gradeName === item}
                >
                  {item}
                  <span style={{ backgroundColor: colors[key] }}></span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </>
    );
  };

  const handleScroll = () => {
    var scrollTop = $(window).scrollTop();
    const stickyData = $(".section-block-sticky").offset();
    if (stickyData) {
      const divOffset = stickyData.top;
      const dist = divOffset - scrollTop;
      if (dist <= 0) {
        $(".card-detail-header").addClass("show");
      } else {
        $(".card-detail-header").removeClass("show");
      }
    }
  };

  // @ts-ignore
  const DropdownIndicator = (props) => {
    return (
      components.DropdownIndicator && (
        <components.DropdownIndicator {...props}>
          {!props.selectProps.menuIsOpen ? (
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M6.00006 4.92426L9.96973 0.95459L11.0304 2.01525L6.00006 7.04558L0.969727 2.01525L2.03039 0.95459L6.00006 4.92426Z"
                fill="#6D7588"
              />
            </svg>
          ) : (
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M6.00006 3.07591L2.03039 7.04558L0.969727 5.98492L6.00006 0.95459L11.0304 5.98492L9.96973 7.04558L6.00006 3.07591Z"
                fill="#6D7588"
              />
            </svg>
          )}
        </components.DropdownIndicator>
      )
    );
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    const getGradeCompany = async () => {
      try {
        const result = await api.v1.gradeCompany.getList({ has_values: true });
        if (result.success) {
          setGradeCompany(result.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getGradeCompany();
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const onAddWishList = (status: boolean, item: any) => {
    setCardData(item);
    if (!loggingIn) {
      return setIsOpenLogin(true);
    }

    if (status) {
      return router.push(`/profile/wishlists`);
    }
    setIsOpenWishList(true);
  };

  const onAddCollection = (status: boolean, item: any) => {
    setCardData(undefined);

    //@ts-ignore
    if (!loggingIn) {
      return setIsOpenLogin(true);
    }

    if (status) {
      setCardData(item);
      return setOpenMnCardPortfolio(!openMnCardPortfolio);
    }

    setIsOpen(true);
  };
  const addNewEntry = (e: any) => {
    e.stopPropagation();
    if (!loggingIn) {
      return setIsOpenLogin(true);
    }
    setIsOpen(true);
  };

  const onEdit = (e: any) => {
    e.stopPropagation();
    router.push(`/profile/portfolio/edit-card?collection=${cardData?.group_ref ?? 0}&code=${router?.query?.cardCodeDetail}`);
  };

  const goToPricingGrid = () => {
    window.scrollTo({ behavior: "smooth", top: pricingGridRef.current.offsetTop - 93 });
  };
  const goToSalesOverview = () => {
    window.scrollTo({ behavior: "smooth", top: salesOverviewRef.current.offsetTop - 93 });
  };
  const goToSalesChart = () => {
    window.scrollTo({ behavior: "smooth", top: salesChartdRef.current.offsetTop - 93 });
  };
  const renderTable = () => {
    return (
      <div ref={pricingGridRef} className="pricing-grid">
        <h2 className="mb-5 title-profile title-profile--color"> Pricing Grid </h2>
        <CardDetailConsumer
          shouldBuild={(pre, next) => pre.listYearPricingCard !== next.listYearPricingCard || pre.indexPricingSelected !== next.indexPricingSelected}
        >
          {({ state: { pricingGridData, listYearPricingCard, indexPricingSelected }, dispatchReducer }) => {
            setLengthTablePrice(pricingGridData.listDataGradeSelected?.length);
            return (
              <div className={"header-pricing-grid btn-group"} role="group" aria-label="Basic mixed styles example">
                {listYearPricingCard.map((item, index) => {
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() =>
                        dispatchReducer({
                          type: "SELECT_YEAR_PRICING",
                          payload: {
                            item,
                            index,
                          },
                        })
                      }
                      className={"btn btn-secondary" + (indexPricingSelected === index ? " isActive" : "")}
                    >
                      {item.year}
                    </button>
                  );
                })}
              </div>
            );
          }}
        </CardDetailConsumer>
        <div className="pricing-grid-content mr--16" id="pricing-grid-content">
          {lengthTablePrice !== 0 ? (
            <>
              <div className="filter-pricing-grid d-flex justify-content-between align-items-center">
                <div className="h-left d-flex align-items-center justify-content-center">
                  <div className="title me-3">Grading</div>
                  <div className="grade hidden-select">
                    <CardDetailConsumer
                      shouldBuild={(pre, next) => {
                        return (
                          pre.pricingGridData.dataGradeSorted !== next.pricingGridData.dataGradeSorted ||
                          pre.pricingGridData.cardGradeSelected !== next.pricingGridData.cardGradeSelected
                        );
                      }}
                    >
                      {({ state: { pricingGridData, dropDownOptions }, dispatchReducer }) => {
                        let dataSelect = [new PricingGridModel(), ...pricingGridData.dataGradeSorted].map((item, index) => {
                          let name = item.labelGrade;
                          return { label: name, value: name, index };
                        });
                        return (
                          <Select
                            value={
                              !isEmpty(dropDownOptions[pricingGridData.cardGradeSelected]) ? dropDownOptions[pricingGridData.cardGradeSelected] : null
                            }
                            onChange={(item) => {
                              if (item)
                                dispatchReducer({
                                  type: "SELECT_GRADE_PRICING",
                                  index: item.index,
                                });
                            }}
                            className="react-select"
                            classNamePrefix="react-select"
                            options={dropDownOptions}
                            components={{ DropdownIndicator }}
                          />
                        );
                      }}
                    </CardDetailConsumer>
                  </div>
                </div>
              </div>
              <div className="content-pricing-grid content-pricing-grid-custom customScroll table-responsive mr-16">
                <div onScroll={onScroll} className="content-pricing-grid-custom-table " id="table_grade">
                  <table className="table min-w-mobile">
                    <thead>
                      <tr>
                        <th scope="col"> Grade </th>
                        <th scope="col"> Min </th>
                        <th scope="col"> Max </th>
                        <th scope="col"> Average </th>
                        <th scope="col"> Trade Volume </th>
                        <th scope="col"> </th>
                      </tr>
                    </thead>
                    <CardDetailConsumer
                      shouldBuild={(pre, next) =>
                        pre.pricingGridData.dataGradeSorted !== next.pricingGridData.dataGradeSorted ||
                        pre.pricingGridData !== next.pricingGridData ||
                        pre.pricingGridData.cardGradeSelected !== next.pricingGridData.cardGradeSelected ||
                        pre.saleChartState !== next.saleChartState ||
                        pre.cardData !== next.cardData
                      }
                    >
                      {({ state: { pricingGridData, saleChartState, cardData, priceTooltipPricingGrid }, dispatchReducer, sagaController }) => {
                        return (
                          <tbody>
                            {setLengthTablePrice(pricingGridData.listDataGradeSelected?.length)}
                            {pricingGridData.listDataGradeSelected.map((item, index) => {
                              return (
                                // @ts-ignore
                                Boolean(index < (width < 768 ? (isOpenSeeFullTable === true ? lengthTablePrice : 10) : lengthTablePrice)) && (
                                  <tr key={index}>
                                    <td
                                      className="has-border"
                                      style={{
                                        color: UtilsColorGrade.colorTextTable(item.gradeCompany, item.gradeValue),
                                      }}
                                    >
                                      <div className="grade-content">
                                        <div
                                          className={`custom-grade d-inline-flex ${
                                            HelperSales.checkExistGrade(item.gradeCompany) ? "custom-grade-bold" : ""
                                          }`}
                                          style={{
                                            backgroundColor: UtilsColorGrade.getColorGrade(item.gradeCompany),
                                            color: UtilsColorGrade.colorTextTable(item.gradeCompany, item.gradeValue),
                                          }}
                                        >
                                          {HelperSales.getStringGrade(item.gradeCompany, item.gradeValue)}
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      {item.min ? (
                                        formatCurrency(item.min, currency)
                                      ) : (
                                        <OverlayTrigger overlay={<Tooltip>{priceTooltipPricingGrid ?? ""}</Tooltip>}>
                                          {({ ref, ...triggerHandler }) => (
                                            <Link href={priceTooltipPricingGrid === nameToolTip ? "/login" : "/verify-email"}>
                                              <a title="Login" className="range-price-card-custom text-decoration-none">
                                                <span className="cursor-pointer" ref={ref} {...triggerHandler}>
                                                  $###
                                                </span>
                                              </a>
                                            </Link>
                                          )}
                                        </OverlayTrigger>
                                      )}
                                    </td>
                                    <td>
                                      {item.max ? (
                                        formatCurrency(item.max, currency)
                                      ) : (
                                        <OverlayTrigger overlay={<Tooltip>{priceTooltipPricingGrid ?? ""}</Tooltip>}>
                                          {({ ref, ...triggerHandler }) => (
                                            <Link href={priceTooltipPricingGrid === nameToolTip ? "/login" : "/verify-email"}>
                                              <a title="Login" className="range-price-card-custom text-decoration-none">
                                                <span className="cursor-pointer" ref={ref} {...triggerHandler}>
                                                  $###
                                                </span>
                                              </a>
                                            </Link>
                                          )}
                                        </OverlayTrigger>
                                      )}
                                    </td>
                                    <td>
                                      {item.avg ? (
                                        formatCurrency(item.avg, currency)
                                      ) : (
                                        <OverlayTrigger overlay={<Tooltip>{priceTooltipPricingGrid ?? ""}</Tooltip>}>
                                          {({ ref, ...triggerHandler }) => (
                                            <Link href={priceTooltipPricingGrid === nameToolTip ? "/login" : "/verify-email"}>
                                              <a title="Login" className="range-price-card-custom text-decoration-none">
                                                <span className="cursor-pointer" ref={ref} {...triggerHandler}>
                                                  $###
                                                </span>
                                              </a>
                                            </Link>
                                          )}
                                        </OverlayTrigger>
                                      )}
                                    </td>
                                    <td> {item.count} </td>
                                    <td>
                                      {props.onChangeGradeCompare ? (
                                        <button
                                          className="btn btn-line-chart"
                                          onClick={() => {
                                            const index = saleChartState.listCardGrade.findIndex(
                                              (it) => it.gradeCompany === item.gradeCompany && it.gradeValue === item.gradeValue
                                            );
                                            if (index !== -1) {
                                              props.onChangeGradeCompare &&
                                                props.onChangeGradeCompare(saleChartState.listCardGrade[index], +cardData.id);
                                              document.getElementById("sale-chart-comparison")?.scrollIntoView();
                                            }
                                          }}
                                        >
                                          <img src={IconChart} alt="View Chart" title="View Chart" />
                                        </button>
                                      ) : (
                                        (item.gradeValue !== "ALL" || ["ALL", "RAW"].includes(item.gradeCompany)) && (
                                          <button
                                            className="btn btn-line-chart"
                                            onClick={() => {
                                              const index = saleChartState.listCardGrade.findIndex(
                                                (it) => it.gradeCompany === item.gradeCompany && it.gradeValue === item.gradeValue
                                              );
                                              if (index !== -1) {
                                                const cardGrades = saleChartState.getGradeTreeSelect(index);
                                                if (cardGrades?.length) {
                                                  dispatchReducer({ type: "SELECT_GRADE_CHART_TOOL", index: +index });

                                                  if (loggingIn) {
                                                    sagaController.requestCalcMaxLineV1({
                                                      cardId: +cardData.id,
                                                      currency: currency,
                                                      cardGrades: cardGrades,
                                                      period: saleChartState.periodSelected.id,
                                                      oldData: saleChartState.calcMaLine,
                                                    });
                                                  }

                                                  goToSalesChart();
                                                }
                                              }
                                            }}
                                          >
                                            <img src={IconChart} alt="View Chart" title="View Chart" />
                                          </button>
                                        )
                                      )}
                                    </td>
                                  </tr>
                                )
                              );
                            })}
                          </tbody>
                        );
                      }}
                    </CardDetailConsumer>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="pricing-grid-content-no-data">
              <img src={IconTable} alt="" />
              <p>There are no data available</p>
            </div>
          )}
        </div>
        <div>
          {lengthTablePrice > 10 && (
            <button className="btn-price-full-table only-mobile" onClick={handleSeeFullTable}>
              See Full Table
            </button>
          )}
        </div>
      </div>
    );
  };

  const handleSeeFullTable = () => {
    setIsOpenSeeFullTable(true);
    setIsLimitTable(false);
  };

  const renderModalTable = () => {
    return (
      <Modal centered show={isOpenSeeFullTable} fullscreen={true} className="modal-seefull modal-seefull-card-detail">
        <Modal.Header>
          <Modal.Title className="text-truncate"> Pricing Grid </Modal.Title>
          <a
            onClick={() => {
              setIsOpenSeeFullTable(false);
              setIsLimitTable(true);
            }}
            title="Close"
          >
            Close
          </a>
        </Modal.Header>
        <Modal.Body className="customScroll">{renderTable()}</Modal.Body>
      </Modal>
    );
  };

  const onScroll = (e: any) => {
    if (!$("#pricing-grid-content").hasClass("pricing-grid-content--scroll")) {
      if ($("#table_grade table").offset().left < 33) {
        $("#pricing-grid-content").addClass("pricing-grid-content--scroll");
      }
    } else {
      if ($("#table_grade table").offset().left == 1) {
        $("#pricing-grid-content").removeClass("pricing-grid-content--scroll");
      }
    }
    if (!$("#table_grade").hasClass("custom-scroll-sticky-card")) {
      if ($("#table_grade table").offset().left < 33) {
        // $("#pricing-grid-content").addClass("pricing-grid-content--scroll");
        $("#table_grade").addClass("custom-scroll-sticky-card");
      }
    } else {
      if ($("#table_grade table").offset().left === 33) {
        $("#table_grade").removeClass("custom-scroll-sticky-card");
      }
    }
  };

  const [isOpenZoomImage, SetIsOpenZoomImage] = useState<boolean>(false);
  const [strImage, SetStrImage] = useState<string>("");
  const openZoom = (src: any) => {
    if (!isEmpty(src)) {
      setPoint(undefined);
      SetIsOpenZoomImage(true);
      SetStrImage(src || "");
    }
  };

  const onSetGradeCompany = (data: any) => {
    setGradeCompany(data);
  };

  const onMouseOverTreeSelect = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    const tooltip = (e.target as any).children[0] as HTMLSpanElement;
    if (tooltip) {
      let top = (e.target as any).getBoundingClientRect().top - tooltip.offsetHeight - 6;
      tooltip.classList.remove("bottom");
      if (top <= 0) {
        tooltip.classList.add("bottom");
        top = (e.target as any).getBoundingClientRect().bottom + 6;
      }
      const left = e.clientX - tooltip.offsetWidth / 2;
      tooltip.style.top = `${top}px`;
      tooltip.style.left = `${left}px`;
      tooltip.style.visibility = "visible";
    }
  };

  const onMouseOutTreeSelect = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    const tooltip = (e.target as any).children[0] as HTMLSpanElement;
    if (tooltip) tooltip.style.visibility = "hidden";
  };

  const onSuccessCaptcha = async (token: any) => {
    setIsCaptCha(false);
    const headers = { "captcha-token": token };
    if (router.pathname === "/card-details/[cardCodeDetail]/[cardName]") {
      if (!isEmpty(router?.query.cardCodeDetail) || !isEmpty(props.code)) {
        let cardCode = router?.query?.cardCodeDetail ?? props.code;
        // @ts-ignore
        setKeepCardCode(cardCode);
        let controller: CardDetailSaga = refProvider?.current.controller as CardDetailSaga;
        if (!isEmpty(cardCode)) {
          if (loggingIn) {
            controller
              .loadSaleData(
                {
                  // @ts-ignore
                  card_code: cardCode,
                  currency: currency,
                },
                headers
              )
              .catch((err) => {
                //@ts-ignore
                if (err?.status === 403) {
                  setIsNotAcitve(true);
                  setNotActiveMessage(err.message);
                }

                if (err?.status === 409) {
                  if (Boolean(err?.show_captcha)) {
                    if (router.pathname === "/card-details/[cardCodeDetail]/[cardName]") {
                      setIsCaptCha(Boolean(err?.show_captcha));
                    }

                    props.errorSale && props.errorSale(true);
                  }
                } else {
                  props.errorNoSaleData && props.errorNoSaleData(props?.code ?? "");
                }
              });
          }
        }
      }
    }

    await setIsLoadingSalesChart(false);
  };

  const onHandleReportImage = (e: boolean) => {
    setIsReportImage(e);
    loadCardDetail();
  };

  const onLeave = () => {
    setTimeout(() => {
      if (!onIcon && !onMenu) {
        setOpenMnCardPortfolio(false);
      }
    }, 1000);
  };
  const onLeaveIcon = () => {
    setTimeout(() => {
      if (!onMenu && !onIcon) {
        setOpenMnCardPortfolio(false);
      }
    }, 1000);
  };
  useEffect(() => {
    if (!onIcon && !onMenu) {
      onLeave();
    }
  }, [onIcon, onMenu]);

  return (
    <CardDetailProvider ref={refProvider}>
      <ChartFlow
        onUpdateCard={(item) => {
          let controller: CardDetailSaga = refProvider?.current.controller as CardDetailSaga;
          props.onUpdateCard && props.onUpdateCard(item, controller);
        }}
      />
      <div className="container-fluid card-detail">
        {isEmpty(props.code) && (
          <CardDetailConsumer shouldBuild={(pre, next) => pre.cardData !== next.cardData}>
            {({ state: { cardData } }) => {
              return <>{renderBreadcrumbs(cardData)}</>;
            }}
          </CardDetailConsumer>
        )}
        <div className="card-detail-header">
          <div className="d-flex justify-content-between card-detail-header-content">
            <div className="card-detail-header-nav">
              <a className="cursor-pointer" onClick={goToPricingGrid} title="Pricing Grid">
                Pricing Grid
              </a>
              {/*isEmpty(props.code) && (
                <CardDetailConsumer
                  shouldBuild={(pre, next) =>
                    pre.frontImage !== next.frontImage ||
                    pre.cardData !== next.cardData ||
                    pre.backImage !== next.backImage ||
                    pre.totalCollectorPort !== next.totalCollectorPort}>
                  {({ state: { dataGraded } }) => {
                    return <> {Boolean(size(dataGraded)) && <a className="cursor-pointer " onClick={goToSalesOverview} title="Sales Overview"> Sales Overview </a>}</>;
                  }}
                </CardDetailConsumer>
              )*/}
              <a className="cursor-pointer" onClick={goToSalesOverview} title="Sales Overview">
                Sales Overview
              </a>
              <a className="cursor-pointer" onClick={goToSalesChart} title="Sales Chart">
                Sales Chart
              </a>
            </div>
            {isEmpty(props.code) && (
              <CardDetailConsumer shouldBuild={(pre, next) => pre.cardData !== next.cardData}>
                {({ state: { cardData } }) => {
                  return (
                    <div className="card-detail-header-btn">
                      <div className="d-flex btn-group-action position-relative">
                        <button onClick={() => onAddCollection(Boolean(cardData?.portfolio), cardData)} type="button" className="btn btn-add">
                          <img alt="" src={Boolean(cardData?.portfolio) ? IconFolderTim : IconFolder} /> {cardData?.portfolio ? "Added" : "Add"} to
                          {t("portfolio.text")}
                          {openMnCardPortfolio && Boolean(cardData?.portfolio) && (
                            <div
                              className="position-absolute menu-portfolio-static-scroll"
                              onMouseEnter={() => {
                                setOnMenu(true);
                              }}
                              onMouseLeave={() => {
                                setOnMenu(false);
                                onLeave();
                              }}
                            >
                              <ul className="box-menu">
                                <li
                                  className="d-flex align-items-center"
                                  onClick={(e) => {
                                    onEdit(e);
                                  }}
                                >
                                  <img src={EditIconBlack} alt="IconDelete" /> <span> Edit card in Portfolio </span>
                                </li>
                                <li className="d-flex align-items-center" onClick={(e) => addNewEntry(e)}>
                                  <img src={IconUnion} alt="IconUnion" /> <span> Add New Entry </span>
                                </li>
                              </ul>
                            </div>
                          )}
                        </button>
                        <button onClick={() => onAddWishList(Boolean(cardData?.wishlist), cardData)} type="button" className="btn btn-heart p-0">
                          <img alt="" src={Boolean(cardData?.wishlist) ? IconHeartTim : IconHeart} />
                        </button>
                        <button type="button" className="btn btn-can p-0" onClick={() => onComparison(cardData)}>
                          <img
                            alt=""
                            src={Boolean(cards.find((item) => item.code === (props.code ?? router?.query?.cardCodeDetail))) ? IconCanTim : IconCan}
                          />
                        </button>
                      </div>
                    </div>
                  );
                }}
              </CardDetailConsumer>
            )}
          </div>
        </div>
        <div className={props.classContent ? "content-home mt-5 mb-3 pb-5" : "content-home mt-5 mb-3 pb-5"}>
          <div className="row row--card-detail">
            {isEmpty(props.code) && (
              <CardDetailConsumer
                shouldBuild={(pre, next) =>
                  pre.frontImage !== next.frontImage ||
                  pre.cardData !== next.cardData ||
                  pre.backImage !== next.backImage ||
                  pre.totalCollectorPort !== next.totalCollectorPort
                }
              >
                {({ state: { dataGraded, cardData, frontImage, backImage, totalCollectorPort }, dispatchReducer }) => {
                  return (
                    <>
                      {cardData.fullWebName && (
                        <Helmet>
                          {/* <title>{cardData.fullWebName}</title>  not use for now */}
                          <meta property="og:type" content={cardData.fullWebName} />
                          <meta property="og:title" content={cardData.fullWebName} />
                          <meta property="og:description" content={cardData.fullWebName} />
                          <meta property="og:image" content={""} />
                          <meta property="fb:app_id" content="600084038002558" />
                          <meta name="description" content="Helmet application" />
                        </Helmet>
                      )}
                      <ClaimPhoto
                        onSuccess={() => {
                          loadCardDetail();
                          setIsOpenClaim(false);
                        }}
                        onClose={() => setIsOpenClaim(false)}
                        isOpen={isOpenClaim}
                        frontBack={frontBack}
                        code={cardData.code}
                      />
                      <ChosseCollection selectCollection={selectCollection} isOpen={isOpen} setIsOpen={setIsOpen} />
                      <ChosseCollection
                        selectCollection={selectWishlist}
                        table="wishlist"
                        title="wishlist"
                        isOpen={isOpenWishList}
                        setIsOpen={setIsOpenWishList}
                      />
                      {loggingIn === true && (
                        <SelectGrading
                          wishList={wishList}
                          cardData={cardData}
                          onSetGradeCompany={onSetGradeCompany}
                          isOpen={isOpenGrade}
                          setIsOpen={setIsOpenGrade}
                          //@ts-ignore
                          onSuccess={() => {
                            dispatchReducer({
                              type: "UPDATE_DATA_WISHLISH",
                            });
                          }}
                        />
                      )}
                      <div className="col-12 col-sm-7 col-md-7 card-detail-content px-0">
                        <div className="card-detail-content-info">
                          <div className="row card-detail-img my-0">
                            <div className="col-12 col-sm-12 col-md-12 px-0 card-detail-img-item">
                              <div
                                className={`${cardData.cardFrontImage.img ? "" : "no-img"} ${checkLoadImage ? "" : "no-img"} img cursor-pointer`}
                                onClick={() =>
                                  cardData.cardFrontImage?.img &&
                                  openZoom(
                                    `https://img.priceguide.cards/${cardData.sport.name === "Non-Sport" ? "ns" : "sp"}/${
                                      cardData.cardFrontImage?.img
                                    }.jpg`
                                  )
                                }
                              >
                                {cardData.cardFrontImage?.img && (
                                  <ImageBlurHash
                                    className=""
                                    src={`https://img.priceguide.cards/${cardData.sport.name === "Non-Sport" ? "ns" : "sp"}/${
                                      cardData.cardFrontImage?.img
                                    }.jpg`}
                                    loadImage={setCheckLoadImage}
                                  />
                                )}
                              </div>
                              {frontImage && frontImage.userId ? (
                                <div className="user info-card">
                                  Uploaded by
                                  <strong>
                                    <Link href={frontImage.userId === userInfo.userid ? `/profile/personal` : `/friends/${frontImage.userId}`}>
                                      <a className="text-reset text-decoration-none">{frontImage.userName}</a>
                                    </Link>
                                  </strong>
                                </div>
                              ) : (
                                ""
                              )}
                              {isEmpty(frontImage?.url) && !isEmpty(backImage?.url) && isEmpty(props.code) && loggingIn && (
                                <div className="info-card">
                                  Are you owner of this card ?
                                  <a onClick={() => onClaimPhoto("front")} href="javascript:void(0)" title="Claim a photo">
                                    Claim a photo
                                  </a>
                                </div>
                              )}
                            </div>
                            <div className="col-12 col-sm-12 col-md-12 px-0 card-detail-img-item">
                              <div
                                className={`${backImage?.url ? "" : "no-img"} ${checkLoadImageBack ? "" : "no-img"} img cursor-pointer`}
                                onClick={() => backImage?.url && openZoom(backImage?.url)}
                              >
                                {backImage?.url && (
                                  <ImageBlurHash
                                    blurHash={backImage?.blurHash ?? ""}
                                    className=""
                                    src={backImage?.url ?? ""}
                                    loadImage={setCheckLoadImageBack}
                                  />
                                )}
                              </div>
                              {backImage && backImage.userId ? (
                                <div className="user info-card">
                                  Uploaded by
                                  <strong>
                                    <Link href={backImage.userId === userInfo.userid ? `/profile/personal` : `/friends/${backImage.userId}`}>
                                      <a className="text-reset text-decoration-none">{backImage.userName}</a>
                                    </Link>
                                  </strong>
                                </div>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                          <ModalZoomImage
                            isOpen={isOpenZoomImage}
                            onClose={(isOpenReport) => {
                              SetIsOpenZoomImage(false);
                              if (isOpenReport) {
                                setIsOpenReport(true);
                                setIsReportImage(true);
                              } else {
                                SetStrImage("");
                                setPoint(undefined);
                              }
                            }}
                            src={strImage}
                            imageDefaultZoom={ImageDefault}
                          />
                          <ReportImage
                            point={point}
                            gradeCompany={gradeCompanys}
                            isReportImage={isReportImage}
                            setIsReportImage={(e) => {
                              onHandleReportImage(e);
                            }}
                            cardData={cardData}
                            isOpen={isOpenReport}
                            onClose={() => {
                              setIsOpenReport(false);
                              setIsReportImage(false);
                              if (strImage) SetIsOpenZoomImage(true);
                              else setPoint(undefined);
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-5 com-md-5  card-detail-content-right mt-1 px-0">
                        <div className="card-detail-content-right__title d-flex align-items-center">
                          {!Boolean(cardData.sport.name) ? (
                            <Skeleton width={150} />
                          ) : (
                            <>
                              {cardData.sport.name} <i className="dot-margin" /> {cardData.year} <i className="dot-margin" />
                              {cardData?.publisher?.name}
                            </>
                          )}
                        </div>
                        <h1 className="card-detail-content-right__description">
                          {!Boolean(cardData.fullWebName) ? <Skeleton /> : cardData.fullWebName}
                        </h1>
                        <div className="btn-group">
                          {!Boolean(cardData.fullWebName) ? (
                            <Skeleton width={100} />
                          ) : (
                            <>
                              {Boolean(cardData.auto) && (
                                <button type="button" className="btn btn-au--custom cursor-default">
                                  AU
                                </button>
                              )}
                              {Boolean(cardData.memo) && (
                                <button type="button" className="btn btn-mem--custom cursor-default">
                                  MEM
                                </button>
                              )}
                            </>
                          )}
                        </div>
                        <div className="fs-3 fw-bold mt-4 card-detail-content-right__price">
                          {!Boolean(cardData.fullWebName) ? (
                            <Skeleton width={200} />
                          ) : (
                            <>
                              {!cardData.minPrice && !cardData.maxPrice ? (
                                "N/A"
                              ) : (
                                <>{formatCurrency(cardData.minPrice, currency) + " - " + formatCurrency(cardData.maxPrice, currency)}</>
                              )}
                            </>
                          )}
                        </div>
                        <div className="mt-5 btn-group-action d-flex ">
                          {Boolean(cardData?.id) ? (
                            <>
                              <button
                                onClick={() => onAddCollection(Boolean(cardData?.portfolio), cardData)}
                                type="button"
                                className="btn btn-add position-relative"
                                title=""
                              >
                                <img alt="" src={Boolean(cardData?.portfolio) ? IconFolderTim : IconFolder} /> {cardData?.portfolio ? "Added" : "Add"}
                                to {t("portfolio.text")}
                                {openMnCardPortfolio && Boolean(cardData?.portfolio) && (
                                  <div
                                    className="position-absolute menu-portfolio"
                                    onMouseEnter={() => {
                                      setOnMenu(true);
                                    }}
                                    onMouseLeave={() => {
                                      setOnMenu(false);
                                      onLeave();
                                    }}
                                  >
                                    <ul className="box-menu">
                                      <li
                                        className="d-flex align-items-center"
                                        onClick={(e) => {
                                          onEdit(e);
                                        }}
                                      >
                                        <img src={EditIconBlack} alt="IconDelete" /> <span> Edit card in Portfolio </span>
                                      </li>
                                      <li className="d-flex align-items-center" onClick={(e) => addNewEntry(e)}>
                                        <img src={IconUnion} alt="IconUnion" /> <span> Add New Entry </span>
                                      </li>
                                    </ul>
                                  </div>
                                )}
                              </button>
                              <div className="d-flex">
                                <button onClick={() => onAddWishList(Boolean(cardData?.wishlist), cardData)} type="button" className="btn btn-heart">
                                  <img alt="Save to Wishlist" src={Boolean(cardData?.wishlist) ? IconHeartTim : IconHeart} />
                                  <span className="only-mobile"> Save to Wishlist </span>
                                </button>
                                <button type="button" className="btn btn-can" onClick={() => onComparison(cardData)}>
                                  <img
                                    alt=""
                                    src={
                                      Boolean(cards.find((item) => item.code === (props.code ?? router?.query?.cardCodeDetail)))
                                        ? IconCanTim
                                        : IconCan
                                    }
                                  />
                                </button>
                              </div>
                            </>
                          ) : (
                            <div className="btn-add-loading">
                              <Skeleton height={50} />
                            </div>
                          )}
                        </div>
                        <div className="mt-3 btn-group-see maxw-488">
                          {Boolean(cardData?.id) ? (
                            <>
                              {Boolean(totalCollectorPort) && (
                                <button
                                  onClick={() =>
                                    router.push(
                                      `/card-owners/${router?.query?.cardCodeDetail}/${gen_card_url(cardData?.webName, cardData?.cardNumber)}`
                                    )
                                  }
                                  type="button"
                                  className="btn btn-see-one"
                                >
                                  See {Boolean(totalCollectorPort) ? totalCollectorPort : ""} Card Owners
                                </button>
                              )}
                              <button
                                onClick={() => router.push(`/${cardData.set.url}`)}
                                type="button"
                                className={`btn btn-see-all ${Boolean(totalCollectorPort) ? "" : "w-100"}`}
                              >
                                See Full Collection
                              </button>
                            </>
                          ) : (
                            <div style={{ width: "100%" }}>
                              <Skeleton height={45} width={"48%"} />
                              <span style={{ width: "4%", display: "inline-flex" }}></span>
                              <Skeleton height={45} width={"48%"} />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="card-detail-content-left__detail p-0">
                        <div className="row">
                          <label className="col-sm-3 col-4 col-form-label"> Name: </label>
                          <div className="col-sm-9 col-8">
                            {cardData.fullNameWithCode ? (
                              <span className="form-control-plaintext">{cardData.fullNameWithCode}</span>
                            ) : (
                              <Skeleton style={{ width: 100 }} />
                            )}
                          </div>
                        </div>
                        <div className="row">
                          <label className="col-sm-3 col-4 col-form-label"> Sport: </label>
                          <div className="col-sm-9 col-8">
                            {cardData.sport.name ? (
                              <Link href={`/collections/${cardData.sport.name.replace(/\s/g, "").toLowerCase()}`}>
                                <a title={cardData.sport.name}>{cardData.sport.name}</a>
                              </Link>
                            ) : (
                              <Skeleton style={{ width: 100 }} />
                            )}
                          </div>
                        </div>
                        <div className="row">
                          <label className="col-sm-3 col-4  col-form-label"> Publisher: </label>
                          <div className="col-sm-9 col-8">
                            {cardData?.publisher?.name ? (
                              <span className="form-control-plaintext"> {cardData?.publisher?.name} </span>
                            ) : (
                              <Skeleton style={{ width: 100 }} />
                            )}
                          </div>
                        </div>
                        <div className="row">
                          <label className="col-sm-3 col-4 col-form-label"> Year: </label>
                          <div className="col-sm-9 col-8">
                            {cardData.year ? <span className="form-control-plaintext"> {cardData.year} </span> : <Skeleton style={{ width: 100 }} />}
                          </div>
                        </div>
                        <div className="row">
                          <label className="col-sm-3 col-4 col-form-label"> Collection: </label>
                          <div className="col-sm-9 col-8">
                            {cardData.set.name ? (
                              <Link href={`/${cardData.set.url}`}>
                                <a title={cardData.set.name} className="text-reset">
                                  {cardData.set.name}
                                </a>
                              </Link>
                            ) : (
                              <Skeleton style={{ width: 100 }} />
                            )}
                          </div>
                        </div>
                        <div className=" row">
                          <label className="col-sm-3 col-4 col-form-label"> Base/Insert: </label>
                          <div className="col-sm-9 col-8">
                            {cardData.type.name ? (
                              <span className="form-control-plaintext">{cardData.type.name}</span>
                            ) : (
                              <Skeleton style={{ width: 100 }} />
                            )}
                          </div>
                        </div>
                        <div className="row">
                          <label className="col-sm-3 col-4 col-form-label"> Parallel: </label>
                          <div className="col-sm-9 col-8">
                            {cardData.color.name ? (
                              <span className="form-control-plaintext">
                                <Link href={`/checklist/${cardData.type.id}/${cardData.color.code}/${cardData.color.url}`}>
                                  <a className="text-reset text-decoration-none">{cardData.color.name}</a>
                                </Link>
                              </span>
                            ) : (
                              <Skeleton style={{ width: 100 }} />
                            )}
                          </div>
                        </div>
                        <div className="row">
                          <label className="col-sm-3 col-4 col-form-label"> Print Run: </label>
                          <div className="col-sm-9 col-8">
                            {cardData.printRun ? (
                              <span className="form-control-plaintext">{cardData.printRun}</span>
                            ) : (
                              <Skeleton style={{ width: 100 }} />
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  );
                }}
              </CardDetailConsumer>
            )}
            <div className="section-block-sticky px-0">
              {!Boolean(props.isHideGrid ?? false) && (
                <>
                  {renderTable()}
                  {isOpenSeeFullTable && renderModalTable()}
                </>
              )}
              <CardDetailConsumer
                shouldBuild={(pre, next) =>
                  pre.dataGraded !== next.dataGraded ||
                  pre.keyData !== next.keyData ||
                  next.saleChartState.calcMaLine !== pre.saleChartState.calcMaLine ||
                  next.saleChartState.gradeTreeSelected !== pre.saleChartState.gradeTreeSelected
                }
              >
                {({ state: { dataGraded, keyData, saleChartState, cardData, priceTooltipPricingGrid }, dispatchReducer, sagaController }) => {
                  return (
                    <div ref={salesOverviewRef} className={`${props.isGradedCardTitle ? "chart-graded-card" : ""} p-0`}>
                      {props.isGradedCardTitle && <h2 className={`mb-5 title-profile `}> Graded Card Sales Overview </h2>}
                      {saleChartState.listCardGrade.length === 0 ? (
                        <PlaceholderChart isNoIcon={true} src={ImageSaleChart.src} />
                      ) : (
                        <div>
                          {Boolean(!loggingIn) && <PlaceholderChart src={ImageSaleChart.src} />}
                          {Boolean(loggingIn) && !size(dataGraded) && <PlaceholderChart src={ImageSaleChart.src} isNoData={true} />}
                          {Boolean(loggingIn) && !isEmpty(priceTooltipPricingGrid) && (
                            <PlaceholderChart src={ImageSaleChart.src} message={notActiveMessage} />
                          )}
                        </div>
                      )}
                      {(Boolean(loggingIn) || saleChartState.listCardGrade.length !== 0) && (
                        <div
                          className={`row chart-graded-card-content ${
                            size(dataGraded) ? (isEmpty(priceTooltipPricingGrid) ? "" : "d-none") : "d-none"
                          }`}
                        >
                          <div className={`col-sm-12 col-12 col-md-4 chart p-0`}>
                            <div className="content-chart">
                              <div className="mb-3 content-chart__title"> Graded Sales Volume by Company </div>
                              <div className="content-chart__description"> Graded card sales overview data is based off sales from all years </div>
                              <ChartCircleDemo keyData={keyData} dataGraded={dataGraded} dispatchReducer={dispatchReducer} code={props.code} />
                            </div>
                          </div>
                          <div className="col-md-8 col-sm-12 col-12 chart-group">
                            {renderGrade(dataGraded, dispatchReducer, keyData)}
                            <div className="row chart-group-list">
                              <div className="col-12 col-sm-12 col-lg-6 chart">
                                <SaleBarChart
                                  keyData={keyData}
                                  saleChartState={saleChartState}
                                  listCardGrade={saleChartState.listCardGrade}
                                  dataGraded={dataGraded}
                                  cardId={cardData.id}
                                  periodSelected={saleChartState.periodSelected}
                                  dispatchReducer={dispatchReducer}
                                  sagaController={sagaController}
                                  type={TypeSale.volume}
                                  onChangeGradeCompare={props.onChangeGradeCompare}
                                />
                                <div className="chart-group__grade only-mobile"> {keyData} Grade </div>
                              </div>
                              <div className="col-12 col-lg-6 chart chart-right">
                                <SaleBarChart
                                  keyData={keyData}
                                  saleChartState={saleChartState}
                                  listCardGrade={saleChartState.listCardGrade}
                                  dataGraded={dataGraded}
                                  cardId={cardData.id}
                                  periodSelected={saleChartState.periodSelected}
                                  dispatchReducer={dispatchReducer}
                                  sagaController={sagaController}
                                  type={TypeSale.value}
                                  onChangeGradeCompare={props.onChangeGradeCompare}
                                />
                              </div>
                            </div>
                            <div className="chart-group__grade"> {keyData} Grade </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }}
              </CardDetailConsumer>
              {!Boolean(props.isHideSaleChart) && (
                <div ref={salesChartdRef} id={"charting-tool"} className="pricing-grid">
                  <h2 className="title-profile mb-5"> Sales Chart </h2>
                  <div className={isLoadingSalesChart ? "" : "d-none"}>
                    <PlaceholderChart src={ImageLineChart.src} isNoIcon={true} />
                  </div>
                  <div className={!isLoadingSalesChart ? "" : "d-none"}>
                    <div>
                      {Boolean(!loggingIn) && <PlaceholderChart src={ImageLineChart.src} />}
                      {!Boolean(!loggingIn) && isNotActive && <PlaceholderChart src={ImageLineChart.src} message={notActiveMessage} />}
                    </div>
                    {!Boolean(!loggingIn) && !isNotActive && (
                      <div className="pricing-grid-content pricing-grid-content--sales">
                        <div className="filter-pricing-grid d-flex justify-content-between align-items-center">
                          <div className="h-left d-flex align-items-center justify-content-center">
                            <div className="title me-3">Card Grade</div>
                            <div className="grade hidden-select">
                              <CardDetailConsumer
                                shouldBuild={(pre, next) => {
                                  return (
                                    pre.cardData.id !== next.cardData.id ||
                                    pre.saleChartState.cardGradeSelected !== next.saleChartState.cardGradeSelected ||
                                    pre.saleChartState.gradeTreeSelected !== next.saleChartState.gradeTreeSelected ||
                                    pre.saleChartState.periodSelected !== next.saleChartState.periodSelected ||
                                    pre.saleChartState.calcMaLine !== next.saleChartState.calcMaLine
                                  );
                                }}
                              >
                                {({ state: { saleChartState, cardData }, dispatchReducer, sagaController }) => {
                                  return (
                                    <>
                                      <TreeSelect
                                        className={classes.treeSelect}
                                        dropdownClassName="grade-tree-selected-custom"
                                        dropdownStyle={{ maxHeight: 200, overflow: "auto" }}
                                        // defaultValue="ALL"
                                        // treeData={saleChartState.dataGradedTree}
                                        multiple
                                        maxTagCount={2}
                                        treeCheckable
                                        treeDefaultExpandAll
                                        value={saleChartState.gradeTreeSelected}
                                        showSearch={false}
                                        ref={treeRef}
                                        onChange={(e: string[]) => {
                                          let dataSelect = e || [];
                                          const hasAll = !!e.find((it) => it === "ALL");
                                          const checkedAll = saleChartState.gradeTreeSelected?.find((it) => it === "ALL");

                                          if (hasAll) {
                                            if (checkedAll) {
                                              dataSelect = dataSelect.filter((it) => it !== "ALL");
                                            } else {
                                              dataSelect = ["ALL"];
                                            }
                                          }

                                          if (!dataSelect.length) dataSelect = ["ALL"];
                                          if (_.isEqual(dataSelect.sort(), saleChartState.gradeTreeSelected.sort())) return;
                                          dispatchReducer({
                                            type: "SELECT_GRADE_TREE_CHART_TOOL",
                                            dataSelect: dataSelect,
                                          });

                                          if (loggingIn) {
                                            sagaController.requestCalcMaxLineV1({
                                              cardId: +cardData.id,
                                              currency: currency,
                                              cardGrades: dataSelect,
                                              period: saleChartState.periodSelected.id,
                                              oldData: saleChartState.calcMaLine,
                                            });
                                          }

                                          const dropdown = document.querySelector(".grade-tree-selected-custom");
                                          if (dropdown) {
                                            if (dataSelect.length >= 5) {
                                              const warning = dropdown.querySelector(".warning-selected");
                                              if (warning) return;
                                              const span = document.createElement("span");
                                              span.innerHTML = "Only 5 ratings can be selected";
                                              span.className = "warning-selected";
                                              dropdown.appendChild(span);
                                            } else {
                                              const warning = dropdown.querySelector(".warning-selected");
                                              warning?.remove();
                                            }
                                          }
                                        }}
                                        onDropdownVisibleChange={() => {
                                          const dropdown = document.querySelector(".grade-tree-selected-custom");

                                          if (Boolean(treeRef?.current?.state?.open)) {
                                            dispatch(ConfigAction.updateShowTabBar(true));
                                          } else {
                                            dispatch(ConfigAction.updateShowTabBar(false));
                                          }

                                          if (dropdown) {
                                            if (saleChartState.gradeTreeSelected?.length >= 5) {
                                              const warning = dropdown.querySelector(".warning-selected");
                                              if (warning) return;
                                              const span = document.createElement("span");
                                              span.innerHTML = "Only 5 ratings can be selected";
                                              span.className = "warning-selected";
                                              dropdown.appendChild(span);
                                            } else {
                                              const warning = dropdown.querySelector(".warning-selected");
                                              warning?.remove();
                                            }
                                          }
                                        }}
                                      >
                                        {saleChartState.dataGradedTree?.map((item) => {
                                          const gradeTreeSelected = saleChartState.gradeTreeSelected.filter((it) => it !== "ALL");
                                          if (item.children?.length) {
                                            const notInside = gradeTreeSelected?.filter((it) => !item.children.find((temp) => temp.key === it)) || [];
                                            const disabled = item.children.length + notInside.length > 5;
                                            return (
                                              <TreeNode
                                                value={item.value}
                                                title={
                                                  <span
                                                    className={`${classes.titleToolTip} rc-tree-select-tree-title-custom-parent`}
                                                    onMouseOver={(e) => disabled && onMouseOverTreeSelect(e)}
                                                    onMouseOut={(e) => onMouseOutTreeSelect(e)}
                                                  >
                                                    {item.label}
                                                    <span className="tooltip-custom-tree">
                                                      A maximum of 5 grades can be compared at once, please select grades individually.
                                                    </span>
                                                  </span>
                                                }
                                                key={item.key}
                                                disabled={disabled}
                                              >
                                                {item.children.map((child) => (
                                                  <TreeNode
                                                    value={child.value}
                                                    title={<span className="rc-tree-select-tree-title-custom">{child.label}</span>}
                                                    key={child.key}
                                                    disabled={gradeTreeSelected?.length >= 5 && !gradeTreeSelected?.find((it) => it === child.key)}
                                                  />
                                                ))}
                                              </TreeNode>
                                            );
                                          } else
                                            return (
                                              <TreeNode
                                                value={item.value}
                                                title={<span className="rc-tree-select-tree-title-custom">{item.label}</span>}
                                                key={item.key}
                                                disabled={
                                                  gradeTreeSelected?.length >= 5 &&
                                                  !gradeTreeSelected?.find((it) => it === item.key) &&
                                                  item.key !== "ALL"
                                                }
                                              />
                                            );
                                        })}
                                      </TreeSelect>
                                    </>
                                  );
                                }}
                              </CardDetailConsumer>
                            </div>
                          </div>
                          <div className="h-right d-flex align-items-center justify-content-center">
                            <label className="toggle-custom d-flex only-desktop">
                              <CardDetailConsumer
                                shouldBuild={(pre, next) => pre.saleChartState.isShowSalePoints !== next.saleChartState.isShowSalePoints}
                              >
                                {({ state, dispatchReducer }) => {
                                  return (
                                    <div className="ms-1 form-check">
                                      <input
                                        className="form-check-input cursor-pointer"
                                        type="checkbox"
                                        defaultChecked={state.saleChartState.isShowSalePoints}
                                        onChange={(e) =>
                                          dispatchReducer({
                                            type: "UPDATE_IS_SHOW_POINT",
                                            isShow: !state.saleChartState.isShowSalePoints,
                                          })
                                        }
                                      />
                                      <label className="ml-2 form-check-label fz-14"> Sale Points </label>
                                    </div>
                                  );
                                }}
                              </CardDetailConsumer>
                            </label>
                            <div className="d-flex align-items-center hidden-select grade">
                              Moving Average Time Period
                              <CardDetailConsumer
                                shouldBuild={(next, pre) =>
                                  next.saleChartState.timePeriodSelected !== pre.saleChartState.timePeriodSelected ||
                                  next.cardData.id !== pre.cardData.id ||
                                  next.saleChartState.gradeTreeSelected !== pre.saleChartState.gradeTreeSelected
                                }
                              >
                                {({ state: { saleChartState, cardData }, sagaController }) => {
                                  let dataSelect = saleChartState.listTimePeriod.map((item, index) => {
                                    return {
                                      label: item.name,
                                      value: `${item.id}`,
                                      index,
                                    };
                                  });

                                  return (
                                    <Select
                                      value={dataSelect[saleChartState.timePeriodSelected]}
                                      onChange={(item) => {
                                        let index: number = item?.index ?? 0;
                                        sagaController.selectPeriodTime(index);

                                        if (loggingIn) {
                                          sagaController.requestCalcMaxLineV1({
                                            cardId: +cardData.id,
                                            currency: currency,
                                            cardGrades: saleChartState.gradeTreeSelected,
                                            period: saleChartState.listTimePeriod[index].id,
                                          });
                                        }
                                      }}
                                      className="react-select"
                                      classNamePrefix="react-select"
                                      options={dataSelect}
                                    />
                                  );
                                }}
                              </CardDetailConsumer>
                              <button className="btn p-0 btn-dot">
                                <img alt="" src={Icon3Dot} />
                              </button>
                            </div>
                          </div>
                          <div className="h-option only-mobile">
                            <button>
                              <img alt="" src={Icon3Dot} />
                            </button>
                          </div>
                        </div>
                        <CardDetailConsumer
                          shouldBuild={(pre, next) => {
                            return (
                              pre.saleChartState.calcMaLine !== next.saleChartState.calcMaLine ||
                              pre.saleChartState.isShowSalePoints !== next.saleChartState.isShowSalePoints ||
                              pre.saleChartState.periodControlSelected !== next.saleChartState.periodControlSelected ||
                              next.cardData.id !== pre.cardData.id ||
                              pre.saleChartState.gradeTreeSelected !== next.saleChartState.gradeTreeSelected
                            );
                          }}
                        >
                          {({ state: { saleChartState, cardData }, sagaController, dispatchReducer }) => {
                            return (
                              <SaleChart
                                cardData={cardData}
                                cardId={+cardData.id}
                                cardName={cardData.fullName}
                                saleChartState={saleChartState}
                                isShowSalePoints={saleChartState.isShowSalePoints}
                                calcMaLine={saleChartState.calcMaLine}
                                listRecord={saleChartState.mainListSaleRecord}
                                updataSaleData={(data: SaleData[]) => {
                                  dispatchReducer({
                                    type: "UPDATE_SALE_DATA",
                                    payload: {
                                      data: data,
                                    },
                                  });
                                }}
                                calcMaxLineRequest={async () => {
                                  await sagaController.requestCalcMaxLineV1({
                                    cardId: +cardData.id,
                                    currency: currency,
                                    cardGrades: saleChartState.gradeTreeSelected,
                                    period: saleChartState.periodSelected.id,
                                  });
                                }}
                                reloadPricingGridRequest={async () => {
                                  return sagaController
                                    .reloadPricingGrid({
                                      // @ts-ignore
                                      cardcode: cardData.code,
                                      currency: currency,
                                      userid: userInfo.userid,
                                    })
                                    .catch((err: any) => {
                                      props.errorNoSaleData && props.errorNoSaleData(props?.code ?? "");
                                    });
                                }}
                              />
                            );
                          }}
                        </CardDetailConsumer>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            {isEmpty(props.code) && (
              <>
                <div className="popular-publishers popular-publishers--custom mt-5">
                  <CardDetailConsumer shouldBuild={(pre, next) => pre.cardData.id !== next.cardData.id}>
                    {({ state }) => <MoreFromCollection cardData={state.cardData} />}
                  </CardDetailConsumer>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {router.pathname === "/card-details/[cardCodeDetail]/[cardName]" && (
        <CaptCha isOpen={isCaptCha} onSuccess={onSuccessCaptcha} onClose={() => setIsCaptCha(false)} />
      )}
      <LoginModal
        onSuccess={() => {
          setIsOpenLogin(false);
          if (cardData) {
            setIsOpenWishList(true);
          } else {
            setIsOpen(true);
          }
        }}
        isOpen={isOpenLogin}
        onClose={() => setIsOpenLogin(false)}
      />
    </CardDetailProvider>
  );
});

export default React.memo(CardDetail);
