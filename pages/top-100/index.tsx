import React, { useState, useEffect } from "react";
import { api } from "configs/axios";
import { TopElementType, FilterType, ManageCollectionType } from "interfaces";
import CheckBoxFilter, { FilterHandle } from "components/filter/customCheckBox";
import { isEmpty, sumBy } from "lodash";
import { MetaData } from "utils/constant";
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useSelector, useDispatch } from "react-redux";
import Selectors from "redux/selectors";
import FilterSport from "components/filter/filterSport";
import { paginate, formatNumber, formatCurrency, gen_card_url } from "utils/helper";
import ButtonClear from "assets/images/Clear.png";
import IconFolder from "assets/images/icon-folder-svg.svg";
import IconFolderFull from "assets/images/icon-folder-active.svg";
import IconHeart from "assets/images/icon_heart.svg";
import IconHeartFull from "assets/images/icon_heart_tim.svg";
import IconCan from "assets/images/icon_can.svg";
import IconCanFull from "assets/images/icon_can_tim.svg";
import IconDot3 from "assets/images/dot-3.svg";
import LoginModal from "components/modal/login";
import ChosseCollection from "components/modal/chosseCollection";
import SelectGrading from "components/modal/selectGrading";
import { CompareAction } from "redux/actions/compare_action";
import { ToastSystem } from "helper/toast_system";
import Pagination from "components/panigation";
import CheckBoxMobile from "components/filter/checkBoxMobile";
import useWindowDimensions from "utils/useWindowDimensions";
import Skeleton from "react-loading-skeleton";
import Head from 'next/head';
// @ts-ignore
import $ from "jquery";
import { CardModel } from "model/data_sport/card_sport";
import CardPhotoBase from "assets/images/Card Photo Base.svg";
import { useTranslation } from "react-i18next";
import { SearchFilterAction } from "redux/actions/search_filter_action";
import filterSport from "components/filter/filterSport";

const rowsPerPage = 20;

type PropTypes = {
  location: any;
};

type DataLoadType = {
  cards: TopElementType[];
  isLoading: boolean;
};

type SortType = {
  by?: string;
  asc?: boolean;
};

type FilterDataType = {
  auto_memo?: number;
  timePeriod?: number;
  sort?: SortType;
  sport?: number;
};

const Top100 = (props: PropTypes) => {
  const { width } = useWindowDimensions();
  const [data, setData] = useState<DataLoadType>({
    cards: [],
    isLoading: true,
  });
  const [lengthFilter, setLengthFilter] = useState<number>(1);
  const { loggingIn } = useSelector(Selectors.auth);
  const { cards } = useSelector(Selectors.compare);
  const router = useRouter();
  const [isOpenLogin, setIsOpenLogin] = useState<boolean>(false);
  const automemoRef = React.useRef<FilterHandle>(null);
  const { sports } = useSelector(Selectors.config);
  const [sportsState, setSportsState] = useState<Array<FilterType>>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filterValue, setFilterValue] = useState<string>("sport");
  const [wishList, setWishList] = React.useState<
    ManageCollectionType | undefined
  >();
  const [isOpenWishList, setIsOpenWishList] = React.useState(false);
  const [isOpenGrade, setIsOpenGrade] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [cardSelected, setCardSelected] = useState<Array<string | number>>([]);
  const [cardData, setCardData] = useState<any>();
  const dispatch = useDispatch();
  const [pagesSelected, setPagesSelected] = useState<Array<number>>([1]);
  const [dataTable, setDataTable] = useState<TopElementType[]>([]);
  const [sortData, setSortData] = useState<FilterDataType>({
    sort: {
      by: "maxSales",
      asc: false,
    },
  });
  const [filterData, setFilterData] = useState<
    { [key: string]: Array<FilterType> } | undefined
  >({
    sport: [{ id: 2, name: "Basketball" }],
    // @ts-ignore
    timePeriod: 365,
  });
  const [t, i18n] = useTranslation("common")
  const { filterSearchTop100, isFilterStoreTop100 } = useSelector(Selectors.searchFilter);
  const [filterState, setFilterState] = useState<Boolean>(false);

  useEffect(() => {
    if (sports.length) {
      setSportsState(
        sports.map((item) => ({
          id: item.id,
          name: item.sportName,
        }))
      );
    }
  }, [sports]);
  
  useEffect(() => {
    if (!isEmpty(filterData)) {
      dispatch(SearchFilterAction.updateSeachFilterTop100(filterData))
    }
    if (pagesSelected.length > 1 || pagesSelected[0] !== 1) {
      setPagesSelected([1])
    }

    getListCard();
    console.log(filterData, 'filterData');
  }, [filterData, sortData]);

  useEffect(() => {
    if (Boolean(isFilterStoreTop100)) { 
      setFilterData(filterSearchTop100);
    }
  }, [isFilterStoreTop100])
  
  useEffect(() => {
    if (Boolean(isFilterStoreTop100) && Boolean(filterState) && automemoRef.current) {
      automemoRef.current.reset(filterSearchTop100?.a_filter);
    }
  }, [filterState])
  
  const getListCard = async () => {
    try {
      setData((prevState) => {
        return { ...prevState, isLoading: true ,cards :[] };
      });
      setDataTable([]);
      let params = {
        timePeriod: filterData?.timePeriod,
        currency: "USD",
        sport: filterData?.sport[0].id,
        ...sortData,
        auto_memo: isEmpty(filterData?.a_filter)
          ? undefined
          : filterData?.a_filter?.map((item) => item.id),
        // ...filterData
      };
      
      const result = await api.v1.getTopTradingCard(params);
      if (result.success) {

        result.data = result.data.map(item => ({ ...item, sport: filterData?.sport[0].name}));

        setDataTable(paginate(result.data, rowsPerPage, [1]));

        if (Boolean(isFilterStoreTop100)) {
          setFilterState(true)
        }
        return setData({
          cards: result.data,
          isLoading: false,
        });
      }
      if (Boolean(isFilterStoreTop100)) {
        dispatch(SearchFilterAction.updateIsFilterTop100(false))
      }
      setDataTable([]);
      setData((prevState) => {
        return { ...prevState, isLoading: false };
      });
    } catch (err) {
      console.log(err);
      setData((prevState) => {
        return { ...prevState, isLoading: false };
      });
    }
  };

  const onChangeFilter = (e: any, key: string) => {
    setFilterData({ ...filterData, [key]: e });
  };
  // const renderButtonFilter = (day: number) => {
  //   switch (day) {
  //     case 7:
  //       return `btn btn-secondary ${filterData?.timePeriod === 7 || isEmpty(filterData.timePeriod) ? "isActive" : ""} `
  //     case 14:
  //       return `btn btn-secondary ${filterData?.timePeriod === 14 ? "isActive" : ""} `
  //     case 30:
  //       return `btn btn-secondary ${filterData?.timePeriod === 30 ? "isActive" : ""} `
  //     case 90:
  //       return `btn btn-secondary ${filterData?.timePeriod === 90 ? "isActive" : ""} `
  //     case 365:
  //       return `btn btn-secondary ${filterData?.timePeriod === 365 ? "isActive" : ""} `
  //     default:
  //   }
  // }

  const renderSortTable = (name: string, asc: boolean) => {
    if (asc) {
      if (
        sortData?.sort?.by === name &&
        !sortData?.sort?.asc &&
        data?.cards.length
      ) {
        return "fa fa-caret-down active";
      }
      return "fa fa-caret-down";
    }
    if (
      sortData?.sort?.by === name &&
      sortData?.sort?.asc &&
      data?.cards.length
    ) {
      return "fa fa-caret-up active";
    }
    return "fa fa-caret-up";
  };

  const onSortTable = (name: string) => {
    if (data?.cards.length) {
      if (sortData?.sort?.by !== name) {
        setSortData((prevState) => {
          return {
            ...prevState,
            sort: {
              by: name,
              asc: false,
            },
          };
        });
      }
      
    }
  };

  const renderTotal = () => {
    return (
      <>
        {" "}
        {data.isLoading ? (
          "-"
        ) : data.cards.length ? (
          <span className="number">
            {(pagesSelected[0] - 1) * rowsPerPage + 1}
          </span>
        ) : (
          0
        )}
        -
        {data.isLoading ? (
          "-"
        ) : (
          <span className="number">
            {formatNumber(
              pagesSelected[pagesSelected.length - 1] * rowsPerPage >
                (data.cards.length ?? 0)
                ? data.cards.length
                : pagesSelected[pagesSelected.length - 1] * rowsPerPage
            )}
          </span>
        )}{" "}
        of{" "}
        {data.isLoading ? (
          "-"
        ) : (
          <span className="number">{formatNumber(data.cards.length)}</span>
        )}{" "}
        results
      </>
    );
  };

  const resetPage = () => {
    automemoRef?.current?.reset([]);
    return setFilterData((prevState) => {
      return {
        ...prevState,
        a_filter: [],
      };
    });
  };

  const removeFilter = (item: FilterType, key: string) => {
    const values = filterData?.[key]?.filter((data) => data.id !== item.id);
    automemoRef?.current?.reset(values);
    // @ts-ignore
    return setFilterData((prevState) => {
      return {
        ...prevState,
        [key]: values,
      };
    });
  };

  const checkFilter = (obj: { [key: string]: Array<FilterType> }) => {
    for (var key in obj) {
      // @ts-ignore
      if (obj[key]?.length && key !== "sport") return false;
    }
    return true;
  };

  const onSelectCard = (code: string) => {
    setCardSelected([code]);
    if (loggingIn) {
      return setIsOpen(true);
    }
    setIsOpenLogin(true);
  };

  const renderCompareIcon = (data: any) => {
    return Boolean(cards.find((item) => item.code === data.code))
      ? IconCanFull
      : IconCan;
  };
  const renderOptionIcon = (data: any) => {
    return Boolean(cards.find((item) => item.code === data.code)) ? IconCanFull
    : IconDot3
  }
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

  const selectCollection = (item: ManageCollectionType) => {
    dispatch(SearchFilterAction.updateIsFilterTop100(true))
    
    router.push(
      `/collections-add-card?collection=${
        item.group_ref
      }&code=${cardSelected.toString()}`
    );
  };

  const onComparison = (cardData: any) => {
    let dataOld = JSON.parse(localStorage.getItem("comparison") ?? "[]") ?? [];

    if ( dataOld.length === 9 ) {
      return ToastSystem.error(<span> Max number of 9 cards reached on <Link href="/comparison">comparison list</Link> </span>);
    }

    const cardNew = {
      code: cardData.code,
      lastname: cardData.lastname,
      firstname: cardData.firstname,
    };

    if (dataOld.find((item: any) => item.code === cardData.code)) {
      dataOld = dataOld.filter((item: any) => item.code !== cardData.code);
      dispatch(CompareAction.removeCard(cardData.code));
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
      Math.ceil((data.cards.length ?? 0) / rowsPerPage)
    ) {
      const pageNew = [
        ...pagesSelected,
        pagesSelected[pagesSelected.length - 1] + 1,
      ];
      setDataTable(
        paginate([...data.cards], rowsPerPage, pageNew)
      );
      // getListCard([...pagesSelected, pagesSelected[pagesSelected.length-1]+1], false)
      // // setCurrentPage(currentPage + 1);
      setPagesSelected(pageNew);
    }
  };

  const handlePageClick = (event: any) => {
    if (event.length === 1) {
      $('html, body').animate({ scrollTop: 0 });
    }
    setPagesSelected(event);
    if (event.length === 1) {
      return setDataTable(paginate([...data.cards], rowsPerPage, event));
    }
    setDataTable(paginate([...data.cards], rowsPerPage, event));
  };

  const renderLengthFilterMobile = () => {
    switch (filterValue) {
      case "a_filter":
        return setTimeout(() => {
          setLengthFilter(automemoRef?.current?.getLengthOption() ?? 0);
        }, 350);

      case "sport":
        return sumBy(sportsState, function (o) {
          return o.options?.length ?? 1;
        });
      default:
        return "";
    }
  };

  const renderTitleFilterMobile = () => {
    switch (filterValue) {
      case "a_filter":
        return "Autograph/Memorabilia";
      case "sport":
        return "Sport";
      default:
        return "";
    }
  };

  const renderButtonClear = () => {
    switch (filterValue) {
      case "a_filter":
        return Boolean(filterData?.a_filter?.length) ? (
          <button
            onClick={() => {
              automemoRef?.current?.reset();
              // @ts-ignore
              return setFilterData((prevState) => {
                return {
                  ...prevState,
                  a_filter: [],
                };
              });
            }}
            type="button"
            className="btn btn-primary clear-select"
          >
            Clear Selected ({filterData?.a_filter?.length})
          </button>
        ) : (
          ""
        );
      default:
        return "";
    }
  };
  const onScroll = () => {
    if(!$("#customScroll").hasClass('custom-scroll-sticky')) {
      $("#customScroll").addClass('custom-scroll-sticky');
    } else {
      if($("#customScroll table").offset().left == 16 ) {
        $("#customScroll").removeClass('custom-scroll-sticky');
      }
    }
  }

  const onSuccess = (code: any) => {
    setDataTable(dataTable?.map(item => item.code === code ? ({ ...item, wishlist: 1 }) : item))
    setData((prevState) => {
      return {
        ...prevState,
        cards: prevState.cards?.map(item => item.code === code ? ({ ...item, wishlist: 1 }) : item)
      };
    });
  }

  const gotoCard = (card: any) => {
    const url = gen_card_url(card?.webName, card.onCardCode);
    return router.push(`/card-details/${card?.code}/${url}`)   
  }
  
  return (
    <div className="container-fluid container-top-100">
      <Head>
        <title>Top 100 Sports Card Sales Guide - Highest Value & Most Traded | PriceGuide.Cards</title>
        <meta name="description" content="View the top 100 selling cards by sales value and sales volume. Filter your search by autograph and relic only filters." />
      </Head>
      <div className="row">
        {
            //@ts-ignore
            width >= 768 && (
          <>
            <div className="col-xl-2 col-md-4 g-0 border-end">
              <div className="mt-3">
                <div className="sidebar__categories">
                  <div className="section-title">
                    <div className="accordion" id="sportFilter">
                      <div className="accordion-item">
                        <h2 className="accordion-header">
                          <button
                            type="button"
                            className="accordion-button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapsesportFilter"
                          >
                            Sport
                            <span>
                              {sumBy(sportsState, function (o) {
                                return o.options?.length ?? 1;
                              })}
                            </span>
                          </button>
                        </h2>
                        <div
                          id="collapsesportFilter"
                          className="accordion-collapse collapse show"
                          data-bs-parent="#sportFilter"
                        >
                          <div>
                            <FilterSport
                              // isFullHeight
                              // isAll={true}
                              isSearch={false}
                              onChange={onChangeFilter}
                              name="sport"
                              //@ts-ignore
                              defaultValue={+filterData?.sport?.[0]?.id ?? 2}
                              isDefault={false}
                              options={sportsState}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="accordion" id="yearFilter">
                      <div className="accordion-item">
                        <h2 className="accordion-header">
                          <button
                            type="button"
                            className="accordion-button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseYearFilter"
                          >
                            Autograph/Memorabilia
                            <span>
                              {sumBy(MetaData.auto_memo, function (o) {
                                // @ts-ignore
                                return o.options?.length ?? 1;
                              })}
                            </span>
                          </button>
                        </h2>
                        <div
                          id="collapseYearFilter"
                          className="accordion-collapse collapse show"
                          data-bs-parent="#yearFilter"
                        >
                          <div>
                            <CheckBoxFilter
                              ref={automemoRef}
                              // prioritize={prioritize}
                              isSearch={false}
                              onChange={onChangeFilter}
                              name="a_filter"
                              options={MetaData.auto_memo}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className="sidebar__categories">
              <div className="section-title">
                <div className="fw-bold mb-1 mt-3">Sport</div>
                <CheckBoxFilter
                  isAll={false}
                  onChange={onChangeFilter}
                  name="sport"
                  defaultValue={2}
                  options={sportsState} />
                <div className="fw-bold mb-1 mt-3">Autograph/Memorabilia</div>
                <CheckBoxFilter
                  onChange={onChangeFilter}
                  name="a_filter"
                  options={MetaData.auto_memo} />
              </div>
            </div> */}
              </div>
            </div>
          </>
        )}
        <div className="col-xl-10 col-md-8  card-detail card-top-100">
        {
            //@ts-ignore
            width < 768 && (
            <>
              <div className="filter-mobile position-relative">
                <div
                  style={{
                    overflowX: "initial",
                  }}
                  className="button-filter "
                >
                  <button
                    onClick={() => setFilterValue("sport")}
                    type="button"
                    className={`btn btn-primary btn-sm sport-button ${
                      Boolean(filterData?.sport?.length) ? "active" : ""
                    }`}
                    data-bs-toggle="modal"
                    data-bs-target="#filterModal"
                  >
                    {Boolean(filterData?.sport?.length)
                      ? filterData?.sport[0]?.name
                      : "Sport"}
                  </button>

                  <button
                    onClick={() => setFilterValue("a_filter")}
                    type="button"
                    className="btn btn-primary btn-sm"
                    data-bs-toggle="modal"
                    data-bs-target="#filterModal"
                  >
                    Autograph/Memorabilia
                    {Boolean(filterData?.a_filter?.length) && (
                      <span className="filter-number filter-number--top100">
                        {filterData?.a_filter?.length}
                      </span>
                    )}
                  </button>

                  <div
                    className="modal fade"
                    id="filterModal"
                    tabIndex={-1}
                    aria-labelledby="filterModalLabel"
                    aria-hidden="true"
                  >
                    <div
                      className={`modal-dialog ${
                        filterValue === "all" ? "modal-all" : "align-items-end"
                      }  modal-filter 
                            modal-lg modal-dialog-centered ${
                              filterValue === "sport" ? "modal-sport" : ""
                            }
                            ${filterValue ==="auto_memo" ? 'modal-auto_memo' : ''} 
    
                            `}
                    >
                      <div className="modal-content">
                        <div className="modal-header">
                          <div className="d-none">
                            {renderLengthFilterMobile()}
                          </div>
                          <h5 className="modal-title" id="filterModalLabel">
                            {renderTitleFilterMobile()}{" "}
                            <span
                              className={` ${
                                filterValue === "all" ? "d-none" : ""
                              }`}
                            >
                              {filterValue === "sport"
                                ? renderLengthFilterMobile()
                                : lengthFilter}
                            </span>
                          </h5>
                          <button
                            type="button"
                            className="btn btn-link text-decoration-none"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          >
                            {" "}
                            Close
                          </button>
                        </div>
                        <div
                          className={`modal-body ${
                            filterValue !== "all" ? "filter-custom" : ""
                          }`}
                        >
                          <div className="position-relative">
                            <div className=" col-lg-2 col-md-2 g-0 border-end">
                              <div className="shop__sidebar mt-3">
                                <div className="sidebar__categories">
                                  <div className="section-title">
                                    <div
                                      className={`accordion ${
                                        filterValue === "sport" ||
                                        filterValue === "all"
                                          ? ""
                                          : "d-none"
                                      }`}
                                      id="sportFilter"
                                    >
                                      <div className="accordion-item">
                                        {filterValue === "all" && (
                                          <h2 className="accordion-header">
                                            <button
                                              type="button"
                                              className="accordion-button"
                                              data-bs-toggle="collapse"
                                              data-bs-target="#collapsesportFilter"
                                            >
                                              Sport
                                              <span>
                                                {sumBy(
                                                  sportsState,
                                                  function (o) {
                                                    return (
                                                      o.options?.length ?? 1
                                                    );
                                                  }
                                                )}
                                              </span>
                                            </button>
                                          </h2>
                                        )}
                                        <div
                                          id="collapsesportFilter"
                                          className="accordion-collapse collapse show"
                                          data-bs-parent="#sportFilter"
                                        >
                                          <div>
                                            <FilterSport
                                              isSearch={false}
                                              onChange={onChangeFilter}
                                              name="sport"
                                              defaultValue={2}
                                              isDefault={false}
                                              options={sportsState}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div
                                      className={`accordion ${
                                        filterValue === "a_filter" ||
                                        filterValue === "all"
                                          ? ""
                                          : "d-none"
                                      }`}
                                      id="a_filterFilter"
                                    >
                                      <div className="accordion-item">
                                        <CheckBoxMobile
                                          ref={automemoRef}
                                          // prioritize={prioritize}
                                          isSearch={false}
                                          onChange={onChangeFilter}
                                          name="a_filter"
                                          options={MetaData.auto_memo}
                                          title="Autograph/Memorabilia"
                                          isButton={filterValue === "all"}
                                          numberFilter={
                                            filterData?.a_filter?.length
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* {renderButtonClear()} */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* end modal */}
                </div>
              </div>
            </>
          )}

          <h1 >Top 100</h1>

          <div className="pricing-grid mt-3">
            <div className="pricing-grid-date">
              <ul>
                <li
                  className={`${ // @ts-ignore
                    filterData?.timePeriod === 7 ? "active" : ""}`}
                  onClick={() => onChangeFilter(7, "timePeriod")}>
                  <span>1 Week</span>
                </li>
                <li className={`${ // @ts-ignore
                  filterData?.timePeriod === 14 ? "active" : ""}`}
                  onClick={() => onChangeFilter(14, "timePeriod")}>
                  <span>2 Weeks</span>
                </li>
                <li
                  className={`${ // @ts-ignore
                    filterData?.timePeriod === 30 ? "active" : ""}`}
                  onClick={() => onChangeFilter(30, "timePeriod")}>
                  <span>1 Month</span>
                </li>
                <li
                  className={`${ // @ts-ignore
                    filterData?.timePeriod === 90 ? "active" : ""}`}
                  onClick={() => onChangeFilter(90, "timePeriod")}>
                  <span>3 Month</span>
                </li>
                <li
                  className={`${ // @ts-ignore
                    filterData?.timePeriod === 365 ? "active" : ""}`}
                  onClick={() => onChangeFilter(365, "timePeriod")}>
                  <span>1 Year</span>
                </li>
              </ul>
            </div>
            <div className="d-flex flex-wrap btn-number align-items-center">
              <div className="me-2 total-item ">{renderTotal()}</div>
              <div className="d-flex flex-wrap">
                {Boolean(!checkFilter(filterData ?? {})) && (
                  <div
                    onClick={resetPage}
                    style={{
                      border: "1px solid #CA1130",
                      borderRadius: 6,
                      backgroundColor: "#fff",
                    }}
                    className="cursor-pointer d-flex ms-2 ps-2 pe-2 cus btn-reset-collection"
                  >
                    <div>Reset Filters</div>
                  </div>
                )}
                {Object.keys(filterData ?? {}).map((key, index) => {
                  return key !== "timePeriod" && key !== "sport" ? (
                    <React.Fragment key={index}>
                      {filterData?.[key].map((item, i) => (
                        <div
                          key={item.id}
                          className="d-flex justify-content-center align-items-center ms-2 btn-reset btn-clear"
                        >
                          <div className="btn-text-clear">{item.name}</div>
                          <button
                            type="button"
                            onClick={() => removeFilter(item, key)}
                            style={{
                              backgroundColor: "transparent",
                              border: "none",
                            }}
                          > <img src={ButtonClear.src} className="collection" alt="" /> </button>
                        </div>
                      ))}
                    </React.Fragment>
                  ) : null;
                })}
              </div>
            </div>
            <div id="customScroll" className="content-pricing-grid content-pricing-grid-custom content-pricing-grid-custom--top100 p-0 mt-2 mh-100 customScroll"
            onScroll={onScroll}>
              <table className="table table-striped table-hover">
                <thead className="p-sticky-header">
                  <tr>
                    <th className="th-66" scope="col">#</th>
                    <th scope="col">
                      <div
                        onClick={() => onSortTable("cardName")}
                        className="d-flex cursor-pointer text-nowrap align-items-center"
                      >
                        Card
                        <div className="d-flex flex-column-reverse sort">
                          <i
                            className={renderSortTable("cardName", true)}
                            aria-hidden="true"
                          ></i>
                          {/* <i
                            className={renderSortTable("cardName", false)}
                            aria-hidden="true"
                          ></i> */}
                        </div>
                      </div>
                    </th>
                    <th scope="col" className="th-254" >
                      <div
                        onClick={() => onSortTable("maxSales")}
                        className="d-flex cursor-pointer text-nowrap align-items-center"
                      > Max Sales Value
                        <div className="d-flex flex-column-reverse sort">
                          <i
                            className={renderSortTable("maxSales", true)}
                            aria-hidden="true"
                          ></i>
                          {/* <i
                            className={renderSortTable("maxSales", false)}
                            aria-hidden="true"
                          ></i> */}
                        </div>
                      </div>
                    </th>
                    <th scope="col" className="th-211" >
                      <div
                        onClick={() => onSortTable("tradeVol")}
                        className="d-flex cursor-pointer text-nowrap align-items-center"
                      > Trade Volume
                        <div className="d-flex flex-column-reverse sort">
                          <i
                            className={renderSortTable("tradeVol", true)}
                            aria-hidden="true"
                          ></i>
                          {/* <i
                            className={renderSortTable("tradeVol", false)}
                            aria-hidden="true"
                          ></i> */}
                        </div>
                      </div>
                    </th>
                    <th scope="col" className="th-56" ></th>
                  </tr>
                </thead>
                <tbody>
                  {data.isLoading && (
                    <>
                      {Array.from(Array(20).keys()).map((item, key) => (
                        <tr key={key}>
                          <td>
                            <Skeleton />
                          </td>
                          <td>
                            <Skeleton />
                          </td>
                          <td>
                            <Skeleton />
                          </td>
                          <td>
                            <Skeleton />
                          </td>
                          <td>
                            <Skeleton />
                          </td>
                        </tr>
                      ))}
                    </>
                  )}
                  {dataTable?.map((item, key) => (
                    <tr key={key}>
                      <td className="text-center">{item.rank}</td>
                      <td>
                        <div className="d-flex">
                          <div className="td-image cursor-pointer" onClick={() => gotoCard(item)}>
                            <img
                              alt=""
                              onError={({ currentTarget }) => {
                                currentTarget.onerror = null; // prevents looping
                                currentTarget.src = CardPhotoBase;
                              }}
                              src={
                                item?.image
                                  ? `https://img.priceguide.cards/${
                                      item.sport === "Non-Sport"
                                        ? "ns"
                                        : "sp"
                                    }/${item?.image}.jpg`
                                  : CardPhotoBase
                              }
                            />
                          </div>
                          <div className="th-content">
                            <div className="d-flex align-items-center th-title">
                              {item.sport} <i className="mx-1 fa fs4 fa-circle" aria-hidden="true" />
                              {item.year} <i className="mx-1 fa fs4 fa-circle" aria-hidden="true" />
                              {item.publisher}
                            </div>
                            <div className="fw-500 cursor-pointer" onClick={() => gotoCard(item)}>
                              {`${item.webName}${
                                !item.onCardCode ? "" : " - #" + item.onCardCode
                              }`}
                            </div>
                            <div className="d-flex btn-group-auto">
                              {Boolean(item.auto) && (
                                <button className="btn btn-au">AU</button>
                              )}
                              {Boolean(item.memo) && (
                                <button className="btn btn-mem">MEM</button>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{formatCurrency(item.maxSales)}</td>
                      <td>{item.tradeVol}</td>
                      <td>
                        <div className="dropdown dropdown--top">
                          <a
                            href="#"
                            id="navbarDropdownDot"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="true"
                          >
                            <img src={renderOptionIcon(item)} />
                          </a>
                          <div
                            className="dropdown-menu"
                            aria-labelledby="navbarDropdownDot"
                            data-bs-popper="none"
                          >
                            <div
                              onClick={() => {
                                setCardData(undefined);
                                setCardSelected([item.code]);
                                if (loggingIn) {
                                  setIsOpen(true);
                                } else {
                                  setIsOpenLogin(true);
                                }
                              }}
                              className="dropdown-menu-item d-flex cursor-pointer"
                            >
                              <div className="dropdown-menu-item__icon">
                                <img
                                  src={
                                    !Boolean(item?.portfolio)
                                      ? IconFolder
                                      : IconFolderFull
                                  }
                                />
                              </div>
                              <div className="dropdown-menu-item__txt">
                                Add to {t('portfolio.text')}
                              </div>
                            </div>
                            <div
                              onClick={() => onAddWishList(item)}
                              className="dropdown-menu-item  d-flex cursor-pointer"
                            >
                              <div className="dropdown-menu-item__icon">
                                <img
                                  src={
                                    !Boolean(item?.wishlist)
                                      ? IconHeart
                                      : IconHeartFull
                                  }
                                />
                              </div>
                              <div className="dropdown-menu-item__txt">
                                Add to Wishlist
                              </div>
                            </div>
                            <div
                              onClick={() => onComparison(item)}
                              className="dropdown-menu-item  d-flex cursor-pointer"
                            >
                              <div className="dropdown-menu-item__icon">
                                <img src={renderCompareIcon(item)} />
                              </div>
                              <div className="dropdown-menu-item__txt">
                                Add to Comparison
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* <button onClick={() => onSelectCard(item.code)} className="btn btn-folder">
                        <img src={IconFolder} />
                      </button> */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!data.isLoading && Boolean(data.cards.length) && (
                <>
                  {
                    
                  Boolean(pagesSelected[pagesSelected.length - 1] < (Math.ceil(
                    (data.cards.length ?? 0) / rowsPerPage
                  )))  && (
                  <div className="d-flex justify-content-center">
                    <button
                      onClick={onLoadMore}
                      type="button"
                      className="btn btn-light load-more"
                    >
                      Load More
                    </button>
                  </div>
                  )
                  }
                  <div className="d-flex justify-content-center mt-3 pagination-page">
                    <Pagination
                      pagesSelected={pagesSelected}
                      onSelectPage={handlePageClick}
                      totalPage={Math.ceil(
                        (data.cards.length ?? 0) / rowsPerPage
                      )}
                    />
                  </div>
                </>
              )}
          </div>
        </div>
      </div>
      <ChosseCollection
        selectCollection={selectWishlist}
        table="wishlist"
        title="wishlist"
        isOpen={isOpenWishList}
        setIsOpen={setIsOpenWishList}
      />
      <ChosseCollection
        selectCollection={selectCollection}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
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
      {cardData && loggingIn && (
        <SelectGrading
          wishList={wishList}
          cardData={cardData}
          isOpen={isOpenGrade}
          onSuccess={onSuccess}
          setIsOpen={setIsOpenGrade}
        />
      )}
    </div>
  );
};

export default Top100;
