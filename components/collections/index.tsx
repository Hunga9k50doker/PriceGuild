import React, { useState, useEffect } from "react";
import { api } from "configs/axios";
import { FilterType, SelectDefultType } from "interfaces";
import Cards from "components/cards";
import { FilterHandle } from "components/filter/customCheckBox";
import { isEmpty, sumBy } from "lodash";
import CardElement from "components/cards/cardCollection";
import { Collection } from "model/portfolio/collection";
import { CollectionApi } from "api/collection";
import Select from "react-select";
import { MetaData } from "utils/constant";
import { convertListDataToGrouped, formatNumber, isFirefox } from "utils/helper";
import FilterSport, {FilterHandle as FilterHandleSport} from "components/filter/filterSport";
import { useSelector } from "react-redux";
import Selectors from "redux/selectors";
import Skeleton from "react-loading-skeleton";
import { useDebouncedCallback } from "utils/useDebouncedEffect";
import ButtonClear from "assets/images/Clear.png";
import imgClose2 from "assets/images/cross-black.svg";
import useWindowDimensions from "utils/useWindowDimensions";
import CheckBoxDesktop from "components/filter/checkBoxDesktop";
import CheckBoxMobile from "components/filter/checkBoxMobile";
import SortMobile from "components/filter/sortMobile";
import Pagination from "components/panigation";
import { useRouter } from 'next/router'
import Link from 'next/link'
// @ts-ignore
import $ from "jquery"

const rowsPerPage = 16;

type PropTypes = {
  location: any;
};

type PrioritizeType = {
  name: string;
  isChange: boolean;
};

type DataLoadType = {
  cards: Collection[];
  isLoading: boolean;
  rows?: number;
  years: Array<FilterType>;
  name?: string;
  filter_collections?: Array<FilterType>;
  filter_publishers: Array<FilterType>;
};

type ParamTypes = {
  sport: string
}

const defaultSort: SelectDefultType = {
  value: 'newest',
  label: "Newest"
};

const CollectionList = () => {
  const router = useRouter();
  const { sport } = router.query;
  const { width } = useWindowDimensions();
  const [filterValue, setFilterValue] = useState<string>("years");
  const publisherRef = React.useRef<FilterHandle>(null);
  const sportRef = React.useRef<FilterHandleSport>(null);
  const yearRef = React.useRef<FilterHandle>(null);
  const collectionRef = React.useRef<FilterHandle>(null);
  const [isNewest, setIsNewest] = useState<SelectDefultType>(defaultSort);
  const { sports } = useSelector(Selectors.config);
  const [sportsState, setSportsState] = useState<Array<FilterType>>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [data, setData] = useState<DataLoadType>({
    cards: [],
    isLoading: true,
    rows: 0,
    years: [],
    name: "",
    filter_collections: [],
    filter_publishers: []

  });
  
  const [filterData, setFilterData] = useState<
    { [key: string]: Array<FilterType> } | undefined
  >(undefined);
  const [prioritize, setPrioritize] = useState<Array<PrioritizeType>>([]);
  const [sportSelected, setSportSelected] = useState<number>();
  const [keySearch, setKeySearch] = React.useState<string | undefined>();
  const [lengthFilter, setLengthFilter] = useState<number>(1);
  const [pagesSelected, setPagesSelected] = useState<Array<number>>([1]);
  
  const [isScroll, setIsScroll] = useState<boolean>(false)

  const resetFilter = () => {
    publisherRef?.current?.reset();
    yearRef?.current?.reset();
    collectionRef?.current?.reset();
  };

  useEffect(() => {
    if (!isEmpty(router.query)) {
      setPrioritize([]);
      resetPage();
      if (sportRef) {
        // @ts-ignore
        sportRef?.current?.setSport(sport)
      }
    }
  }, [router.query]);

  const resetPage = () => {
    // setPublishers([]);
    setFilterData({});
    resetFilter();
    setIsNewest(defaultSort);
    setPagesSelected([1])
    getListCard([1], false);
  };

  useEffect(() => {
    if (!data.isLoading) {
      setPagesSelected([1])
      getListCard();
    }
  }, [filterData]);

  const onChangeFilter = (e: any, key: string) => {
    let dataSave = [...prioritize];
    if (!prioritize.find((item) => item.name === key)) {
      setPrioritize((prevState) => [
        ...prevState.map((item) => ({ ...item, isChange: false })),
        { name: key, isChange: true },
      ]);
    } else {
      if (prioritize[prioritize.length - 1]?.name === key && e.length === 0) {
        dataSave = dataSave.filter((item) => item.name !== key);
        if (dataSave.length) {
          dataSave[dataSave.length - 1] = {
            name: dataSave[dataSave.length - 1].name,
            isChange: true,
          };
        }
        setPrioritize(dataSave);
      } else {
        dataSave = [...prioritize];
        dataSave = dataSave.map((item) =>
          item.name === key
            ? { ...item, isChange: true }
            : { ...item, isChange: false }
        );
        setPrioritize(dataSave);
      }
    }

    let i = 0;
    dataSave?.forEach(function (item, index) {
      if (item.isChange) {
        i = index;
      }
    });
    let dataFiler = dataSave
      ?.filter((item, index) => index <= i)
      .map((item) => item.name);
    let params = {};
    for (const element of dataFiler) {
      // @ts-ignore
      params[element] = filterData?.[element];
    }
    setFilterData({ ...params, [key]: e });
  };

  const getFilterSearch = () => {
    let params: any = {};
    for (const [key, value] of Object.entries(filterData ?? {})) {
      //@ts-ignore
      const arrayValue = value.map((item) => item.id).sort((a, b) => a - b);
      params[key] = arrayValue?.length ? arrayValue : undefined;
    }
    return params;
  };

  const getListCard = async (
    page: number[] = [1],
    isFilter: boolean = true,
    isSort?: string,
    keySearchState?: string
  ) => {
    try {
      setData((prevState) => {
        return {
          ...prevState,
          isLoading: true,
          cards: page.length === 1 ? [] : [...prevState.cards],
        };
      });

      let filterParams = {};
      if (isFilter) {
        filterParams = { ...filterParams, ...getFilterSearch() };
      } 
      if (keySearch === '' || keySearchState === '') {
        if (!isEmpty(prioritize)) {
          let dataPriorlities = [ ...prioritize ];
          let index = dataPriorlities.findIndex((item: any) => item.name === 'publishers');

          if (index !== -1) {
            dataPriorlities.splice(index,1)
          }
          setPrioritize(dataPriorlities);
        }
        
        //@ts-ignore
        if (filterParams?.publishers.length > 0) {
          //@ts-ignore
          delete filterParams?.publishers;
          publisherRef.current?.reset();
          let filter = { ...filterData };
          
          delete filter?.publishers;

          setFilterData(filter);
        }
      }
      let params: any = {
        limit: rowsPerPage,
        sport_name: sport,
        filter: !isEmpty(filterParams) ? filterParams : undefined,
        // is_newest: isSort ?? isNewest.value,
        sort: isSort ?? isNewest.value,
        search_term: keySearchState ?? keySearch,
        page: page[page.length - 1],
      };
      const result = await CollectionApi.getCollection(params);
      
      if (result.success) {
        result.data.collections = result.data.collections.map(
          (item: { [key: string]: any }) => {
            return new Collection(item);
          }
        );

        if (page.length === 1) {
          return setData({
            cards: result.data.collections,
            isLoading: false,
            rows: result.rows,
            name: result.data.name,
            years: result.data.years?.map((item) => ({
              id: item,
              name: item.toString(),
            })),
            filter_publishers: convertListDataToGrouped(
              result.data.filter_publishers.map((item: any) => ({
                id: item?.id,
                name: item?.publisherName,
              })),
              FilterType.firstLetter,
              (item1, item2) => {
                return item1.name.localeCompare(item2.name);
              }
            ),
          });
        }
        // @ts-ignore
        return setData((prevState) => {
          return {
            ...prevState,
            cards: [...prevState.cards, ...result.data.collections],
            isLoading: false,
          };
        });
      }
      setData((prevState) => {
        return { ...prevState, isLoading: false, rows: 0 };
      });
    } catch (err) {
      console.log(err);
      setData((prevState) => {
        return {
          ...prevState,
          isLoading: false,
          rows: 0 
        };
      });
    }
  };
  
  const onSortTable = (sortValue: any) => {
    setIsNewest(sortValue);
    setPagesSelected([1]);
    getListCard([1], true, sortValue.value);
  };

  const checkFilter = (obj: { [key: string]: Array<FilterType> }) => {
    for (var key in obj) {
      if (obj[key]?.length && key !== "sport") {
        return false;
      }
    }
    return true;
  };

  const removeFilter = (item: FilterType, key: string) => {
    const values = filterData?.[key]?.filter((data) => data.id !== item.id);
    switch (key) {
      case "publisher":
        publisherRef?.current?.reset(values);
        break;
      case "years":
        yearRef?.current?.reset(values);
        break;
      case "collections":
        collectionRef?.current?.reset(values);
        break;
      default:
        // code block
    }
    // @ts-ignore
    return setFilterData((prevState) => {
      return {
        ...prevState,
        [key]: values,
      };
    });
  };

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
                (data.rows ?? 0)
                ? data.rows
                : pagesSelected[pagesSelected.length - 1] * rowsPerPage
            )}
          </span>
        )}{" "}
        of{" "}
        {data.isLoading ? (
          "-"
        ) : (
          <span className="number">{formatNumber(data.rows)}</span>
        )}{" "}
        results
      </>
    );
  };

  var timerid: any = null;

  const handlePageClick = (event: any) => {
    if (event.length === 1) {
      isFirefox ? $('html, body').animate({scrollTop: 0}) : window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
    if (timerid) {
      clearTimeout(timerid);
    }
    timerid = setTimeout(() => {
      setPagesSelected(event);
      getListCard(event, false);
    }, 550);
  };

  const onChangeFilterSport = (event: any) => {
    router.push(`/collections/${event[0]?.name.replace(/\s/g, '').toLowerCase()}`)
  };

  const loadSuggestions = useDebouncedCallback(getListCard, 450);

  const handleChange = (event: any) => {
    setKeySearch(event?.target?.value);
    setPagesSelected([1])
    loadSuggestions([1], true, undefined, event?.target?.value);
  };

  const onClearSearch = () => {
    setKeySearch("");
    setPagesSelected([1])
    loadSuggestions([1], true, undefined, "");
  }

  const renderNumberFilter = () => {
    const filterOld = { ...filterData };
    if (filterOld.sport) {
      delete filterOld.sport;
    }
    return (
      <>
        {Boolean(!checkFilter(filterOld ?? {})) && (
          <span className="filter-number">
            {Object.values(filterOld).flat().length}
          </span>
        )}
      </>
    );
  };

  const renderTitleFilterMobile = () => {
    switch (filterValue) {
      case "years":
        return "Year";
      case "collections":
        return "Collection";
      case "sport":
        return "Sport";
      case "publishers":
          return "Publisher";
      default:
        return "Filters";
    }
  };

  const renderLengthFilterMobile = () => {
    switch (filterValue) {
      case "years":
        return setTimeout(() => {
          setLengthFilter(yearRef?.current?.getLengthOption() ?? 0);
        }, 350);
      case "collections":
        return setTimeout(() => {
          setLengthFilter(collectionRef?.current?.getLengthOption() ?? 0);
        }, 350);
        case "publishers":
          return setTimeout(() => {
            setLengthFilter(publisherRef?.current?.getLengthOption() ?? 0);
        }, 350);
      case "sport":
        return sumBy(sportsState, function (o) {
          return o.options?.length ?? 1;
        });
      default:
        return "3";
    }
  };
  const renderButtonClear = () => {
    switch (filterValue) {
      case "years":
        return Boolean(filterData?.years?.length) ? (
          <button
            onClick={() => {
              yearRef?.current?.reset();
              // @ts-ignore
              return setFilterData((prevState) => {
                return {
                  ...prevState,
                  years: [],
                };
              });
            }}
            type="button"
            className="btn btn-primary clear-select"
          >
            Clear Selected ({filterData?.years?.length})
          </button>
        ) : (
          ""
        );
      case "publishers":
        return Boolean(filterData?.publishers?.length) ? (
          <button
            onClick={() => {
              publisherRef?.current?.reset();
              // @ts-ignore
              return setFilterData((prevState) => {
                return {
                  ...prevState,
                  publishers: [],
                };
              });
            }}
            type="button"
            className="btn btn-primary clear-select"
          > Clear Selected ({filterData?.publishers?.length}) </button>
          ) : ( ""
        );
      default:
        return "";
    }
  };

  const resetFilterMobileUI = () => {
    if (filterValue !== "all") return null;
    const filterOld = { ...filterData };
    if (filterOld.isLoad !== undefined) {
      delete filterOld.isLoad;
    }
    return (
      <>
        {Boolean(!checkFilter(filterOld ?? {})) && (
          <div
            onClick={() => resetPage()}
            className="btn btn-primary clear-select"
          >
            <div>Reset Filters</div>
          </div>
        )}
      </>
    );
  };

  const onLoadMore = () => {
    if (
      pagesSelected[pagesSelected.length - 1] + 1 <=
      Math.ceil((data.rows ?? 0) / rowsPerPage)
    ) {
      getListCard(
        [...pagesSelected, pagesSelected[pagesSelected.length - 1] + 1],
        false
      );
      
      setPagesSelected([
        ...pagesSelected,
        pagesSelected[pagesSelected.length - 1] + 1,
      ]);
    }
  };
  
  return (
    <div className="container-fluid collection-list">
      <div className="row">
        {
          // @ts-ignore
          width >= 768 && (
          <>
            <div className="col-lg-2 col-md-2 g-0 border-end">
              <div className={`shop__sidebar mt-3 ${!data.cards.length && !data.isLoading ? "d-none": ""}`}>
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
                          > Sport
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
                              isLoadingState={false}
                              // @ts-ignore
                              ref={sportRef}
                              onChange={onChangeFilterSport}
                              name="sport"
                              // @ts-ignore
                              defaultValue={sport}
                              isDefault={false}
                              options={sportsState}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="accordion" id="publishersFilter">
                      <CheckBoxDesktop
                        title="Publisher"
                        prioritize={prioritize}
                        ref={publisherRef}
                        onChange={onChangeFilter}
                        name="publishers"
                        options={data.filter_publishers}
                      />
                    </div>
                    <div className="accordion" id="yearFilter">
                      <CheckBoxDesktop
                        title="Year"
                        prioritize={prioritize}
                        ref={yearRef}
                        onChange={onChangeFilter}
                        name="years"
                        options={data.years}
                      />
                    </div>
                    {/* <div className="accordion" id="collectionFilter">
                      <CheckBoxDesktop
                        title="Collection"
                        prioritize={prioritize}
                        ref={collectionRef}
                        onChange={onChangeFilter}
                        name="collections"
                        options={data.filter_collections}
                      />
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="col-lg-10 col-md-10 pb-5 content-page"> 
            {
            // @ts-ignore
            width < 768 && (
            <>
              <div className={`filter-mobile position-relative ${!data.cards.length && !data.isLoading ? "d-none": ""}`}>
                <div className="button-filter ">
                  <button
                    onClick={() => setFilterValue("sport")}
                    type="button"
                    className={`btn btn-primary btn-sm sport-button ${
                      Boolean(sportsState?.find(item=> item.name.replace(/\s/g, '').toLowerCase() === sport)) ? "active" : ""
                    }`}
                    data-bs-toggle="modal"
                    data-bs-target="#filterModal"
                  >
                    {sportsState?.find(item=> item.name.replace(/\s/g, '').toLowerCase() === sport)?.name ?? "All Sport"}
                  </button>
                  <button
                    onClick={() => setFilterValue("publishers")}
                    type="button"
                    className={`btn btn-primary btn-sm ${Boolean(filterData?.publishers?.length) ? "active" : ""}`}
                    data-bs-toggle="modal"
                    data-bs-target="#filterModal"
                  >
                    Publisher {Boolean(filterData?.publishers?.length) && <span>{filterData?.publishers?.length}</span>}
                  </button>
                  <button
                    onClick={() => setFilterValue("years")}
                    type="button"
                    className={`btn btn-primary btn-sm ${Boolean(filterData?.years?.length) ? "active" : ""}`}
                    data-bs-toggle="modal"
                    data-bs-target="#filterModal"
                  >
                    Year {Boolean(filterData?.years?.length) && <span>{filterData?.years?.length}</span>}
                  </button>
                  {/* <button
                    onClick={() => setFilterValue("collections")}
                    type="button"
                    className="btn btn-primary btn-sm"
                    data-bs-toggle="modal"
                    data-bs-target="#filterModal"
                  >
                    Collection
                  </button> */}

                  <div className="btn btn-filter btn-primary btn-sm">
                    <button
                      onClick={() => setFilterValue("all")}
                      type="button"
                      data-bs-toggle="modal"
                      data-bs-target="#filterModal"
                      className="btn btn-link"
                    >
                      <svg
                        width="16"
                        height="13"
                        viewBox="0 0 16 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0.5 1.59025L0.5 0.6C0.5 0.268629 0.768629 0 1.1 0L14.9 0C15.2314 0 15.5 0.268629 15.5 0.6V1.59025C15.5 1.76301 15.4255 1.92739 15.2957 2.04131L9.70435 6.94576C9.57447 7.05968 9.5 7.22406 9.5 7.39682V11.2136C9.5 11.435 9.37808 11.6384 9.18283 11.7428L7.38283 12.7049C6.98314 12.9185 6.5 12.6289 6.5 12.1757L6.5 7.39682C6.5 7.22406 6.42553 7.05968 6.29565 6.94576L0.704347 2.04131C0.574469 1.92739 0.5 1.76301 0.5 1.59025Z"
                          fill="#18213A"
                        />
                      </svg>
                    </button>

                    <span
                      data-bs-toggle="modal"
                      data-bs-target="#filterModal"
                      onClick={() => setFilterValue("all")}>
                      Filters
                      {renderNumberFilter()}
                    </span>

                    <button
                      onClick={() => setFilterValue("sport")}
                      data-bs-toggle="modal"
                      data-bs-target="#sortModal"
                      type="button"
                      className="btn btn-link"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M12.9697 4.37115L12.9697 16.3105L11.4697 16.3105L11.4697 4.37115L9.75 6.09082L8.68934 5.03016L12.2197 1.49983L15.75 5.03016L14.6893 6.09082L12.9697 4.37115Z"
                          fill="#18213A"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M5.03033 13.4394L5.03033 1.5H6.53033L6.53033 13.4394L8.25 11.7197L9.31066 12.7804L5.78033 16.3107L2.25 12.7804L3.31066 11.7197L5.03033 13.4394Z"
                          fill="#18213A"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* start modal */}

                  <div
                    className="modal fade"
                    id="sortModal"
                    tabIndex={-1}
                    aria-labelledby="sortModalLabel"
                    aria-hidden="true"
                  >
                    <div
                      className={`modal-dialog ${
                        filterValue === "all" ? "modal-all" : "align-items-end"
                      }  modal-filter modal-lg modal-dialog-centered modal-sort`}
                    >
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title" id="sortModalLabel">
                            Sort by{" "}
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
                        <div className={`modal-body filter-custom`}>
                          <div className="position-relative">
                            <div className=" col-lg-2 col-md-2 g-0 ">
                              <div className="shop__sidebar mt-3">
                                <div className="sidebar__categories">
                                  <div className="section-title">
                                    <SortMobile
                                      className="section-title-item"
                                      onChange={onSortTable}
                                      value={isNewest}
                                      options={MetaData.sort_list}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
                            ${filterValue === "years" ? "modal-year" : ""} 
                            ${
                              filterValue === "collections"
                                ? "modal-collection-filter"
                                : ""
                            } `}
                    >
                      <div className="modal-content">
                        <div className="modal-header">
                          <div className="d-none">
                            {renderLengthFilterMobile()}
                          </div>
                          <h5 className="modal-title" id="filterModalLabel">
                            {renderTitleFilterMobile()}{" "}
                            <span>
                              {(filterValue === "sport" || filterValue === "all")
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
                            <div className=" col-lg-2 col-md-2 g-0">
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
                                              // isFullHeight
                                              // isAll={true}
                                              isSearch={false}
                                              isLoadingState={false}
                                              // @ts-ignore
                                              ref={sportRef}
                                              onChange={onChangeFilterSport}
                                              name="sport"
                                              // @ts-ignore
                                              defaultValue={sport}
                                              isDefault={false}
                                              options={sportsState}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                           <div
                                      className={`accordion ${
                                        filterValue === "publishers" ||
                                        filterValue === "all"
                                          ? ""
                                          : "d-none"
                                      }`}
                                      id="publishersFilter"
                                    >
                                      <div className="accordion-item">
                                        <CheckBoxMobile
                                          prioritize={prioritize}
                                          ref={publisherRef}
                                          onChange={onChangeFilter}
                                          name="publishers"
                                          options={data.filter_publishers}
                                          title="Publisher"
                                          isButton={filterValue === "all"}
                                          numberFilter={
                                            filterData?.publishers?.length
                                          }
                                          setIsScroll={setIsScroll}
                                          filterValue={filterValue}
                                        />
                                      </div>
                                    </div> 
                                    <div
                                      className={`accordion ${
                                        filterValue === "years" ||
                                        filterValue === "all"
                                          ? ""
                                          : "d-none"
                                      }`}
                                      id="yearsFilter"
                                    >
                                      <div className="accordion-item">
                                        <CheckBoxMobile
                                          prioritize={prioritize}
                                          ref={yearRef}
                                          onChange={onChangeFilter}
                                          name="years"
                                          options={data.years}
                                          title="Year"
                                          isButton={filterValue === "all"}
                                          numberFilter={
                                            filterData?.years?.length
                                          }
                                          setIsScroll={setIsScroll}
                                          filterValue={filterValue}
                                        />
                                      </div>
                                    </div>
                                    {/* <div
                                      className={`accordion ${
                                        filterValue === "collections" ||
                                        filterValue === "all"
                                          ? ""
                                          : "d-none"
                                      }`}
                                      id="collectionsFilter"
                                    >
                                      <div className="accordion-item">
                                        <CheckBoxMobile
                                          prioritize={prioritize}
                                          ref={collectionRef}
                                          onChange={onChangeFilter}
                                          name="collections"
                                          options={data.filter_collections}
                                          title="Collection"
                                          isButton={filterValue === "all"}
                                          numberFilter={
                                            filterData?.collections?.length
                                          }
                                        />
                                      </div>
                                    </div> */}
                                  </div>
                                </div>
                              </div>
                            </div>
                            {renderButtonClear()}
                            {resetFilterMobileUI()}
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

          <div className="header-container d-flex justify-content-between align-items-center">
            <h1 className="title"> {" "} {data.name ? data.name : <Skeleton width={500} />} {" "} </h1>
            <div className="search">
              <i className="fa fa-search" />
              <input
                type="text"
                className="form-control"
                placeholder="Search"
                value={keySearch}
                onChange={handleChange}
              />
              {Boolean(keySearch) && <span onClick={onClearSearch} className="clear"><img src={imgClose2} alt="Clear" title="Clear" /></span>}
            </div>
          </div>
          <div className="d-flex mb-4 align-items-start justify-content-between">
            <div className="d-flex align-items-center">
              <div className="d-flex">
                <div className="me-2 total-item mt-1">
                {!data.cards.length && !data.isLoading ? <>
                    <span className="number">0</span> results
                  </> : <>
                  {renderTotal()} 
                  </>}
                </div>
                <div className="d-flex flex-wrap hidden-filter-mobile">
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
                    return (
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
                            >
                              <img src={ButtonClear.src} className="collection" />
                            </button>
                          </div>
                        ))}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-center align-items-center">
              {/* <div className="me-2">
                Sort by:
              </div> */}
              <div
                className="hidden-select only-desktop"
                style={{ width: 168 }}
              >
                <Select
                  onChange={onSortTable}
                  value={isNewest}
                  options={MetaData.sort_list}
                />
              </div>
            </div>
          </div>
          <Cards<Collection>
            cardElement={(item: Collection) => {
              return <CardElement key={item.id} item={item} />;
            }}
            onLoadMore={onLoadMore}
            isLoading={data.isLoading}
            isLoadMore={false}
            cards={data.cards}
          />

          {!data.isLoading && Boolean(data.rows) && (
            <>
             {						
                Boolean(pagesSelected[pagesSelected.length - 1] < (Math.ceil(
                    (data?.rows ?? 0) / rowsPerPage
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
            <div className="d-flex justify-content-center mt-3">
                <Pagination
                    pagesSelected={pagesSelected}
                    onSelectPage={handlePageClick}
                    totalPage={Math.ceil((data.rows ?? 0) / rowsPerPage)}
                />
            </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionList;
