import React, { useState, useEffect } from "react";
import { api } from "configs/axios";
import { LeaderboardType, FilterType } from "interfaces";
import FilterSport from "components/filter/filterSport";
import { sumBy, inRange } from "lodash";
import { formatCurrency, paginate, formatNumber } from "utils/helper";
import { useSelector } from "react-redux";
import Selectors from "redux/selectors";
import Skeleton from "react-loading-skeleton";
import PersonalPortfolio from "components/personalPortfolio";
import useWindowDimensions from "utils/useWindowDimensions";
import Pagination from "components/panigation";
import { userClass } from "utils/constant";
import Link from "next/link";
// @ts-ignore
import $ from "jquery";
const rowsPerPage = 50;
const dataLoader = Array.from(Array(rowsPerPage).keys());

type DataLoadType = {
  cards: LeaderboardType[];
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

const Leaderboard = () => {
  const { width } = useWindowDimensions();
  const [data, setData] = useState<DataLoadType>({
    cards: [],
    isLoading: true,
  });
  const { userInfo } = useSelector(Selectors.auth);
  const [dataTable, setDataTable] = useState<LeaderboardType[]>([]);
  const [page, setPage] = useState<number>(1);
  const { sports } = useSelector(Selectors.config);
  const [sportsState, setSportsState] = useState<Array<FilterType>>([]);
  const [filterData, setFilterData] = useState<FilterDataType>({});
  const [pagesSelected, setPagesSelected] = useState<Array<number>>([1]);
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
    getListCard();
  }, [filterData]);

  const getListCard = async () => {
    try {
      setData((prevState) => {
        return { ...prevState, isLoading: true };
      });
      let params = {
        ...filterData,
      };
      const result = await api.v1.portfolio.portfolioLeaderboard(params);
      if (result.success) {
        if (result.data.length) {
          setDataTable(paginate(result.data, rowsPerPage, [1]));
        }
        return setData({
          cards: result.data,
          isLoading: false,
        });
      }
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
    setFilterData((prevState) => {
      return {
        ...prevState,
        [key]: e?.[0]?.id === "all" ? undefined : e?.[0]?.id,
      };
    });
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
        paginate([...data.cards],rowsPerPage, pageNew)
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
  const onScroll = () => {
    if(!$("#customScroll").hasClass('custom-scroll-sticky')) {
      $("#customScroll").addClass('custom-scroll-sticky');
    } else {
      if($("#customScroll table").offset().left == 18 ) {
        $("#customScroll").removeClass('custom-scroll-sticky');
      }
    }
  }

  const getLevelUser = (point: number) => {
    const level = userClass.find((item) => {
      if (point === 106186) {
        console.log(inRange(point, item.min, item.max), item)
      }
      return inRange(point, item.min, item.max);
    });
    if (level) {
      return level?.level;
    }
    return userClass[userClass.length-1]?.level;
   
  };

  return (
    <>
      <div className="container-fluid leaderboard-page">
        <div className="row">
            {
                //@ts-ignore
                width >= 768 && (
            <>
              <div className="col-lg-2 g-0 col-md-2 border-end">
                <div className="mt-3">
                  <div className="sidebar__categories">
                    <div className="section-title mt-4">
                      <div className="accordion" id="sportFilter">
                        <div className="accordion-item">
                          <h2 className="accordion-header">
                            <button
                              type="button"
                              className="accordion-button"
                              data-bs-toggle="collapse"
                              data-bs-target="#collapseOne"
                            >
                              Sport{" "}
                              <span>
                                {sumBy(sportsState, function (o) {
                                  return o.options?.length ?? 1;
                                })}
                              </span>
                            </button>
                          </h2>
                          <div
                            id="collapseOne"
                            className="accordion-collapse collapse show"
                            data-bs-parent="#sportFilter"
                          >
                            <div>
                              <FilterSport
                                isFullHeight
                                isAll={true}
                                isSearch={false}
                                onChange={onChangeFilter}
                                name="sport"
                                isDefault={true}
                                options={sportsState}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="col-lg-10 col-12 col-md-10 pb-5 mt-3 card-detail min-vh-100 card-detail-leaderboard">
            {
                //@ts-ignore
                width < 768 && (
              <>
                <div className="filter-mobile position-relative">
                  <div style={{ overflowX:"initial", overflowY:"initial" }} className="button-filter w-100">
                    <button
                      type="button"
                      className={`btn btn-primary btn-sm sport-button ${
                        Boolean(filterData?.sport) ? "active" : ""
                      }`}
                      data-bs-toggle="modal"
                      data-bs-target="#filterModal"
                    >
                      {Boolean(filterData?.sport)
                        ? sportsState.find(
                            (sport) => sport.id === filterData?.sport
                          )?.name
                        : "All Sports"}
                    </button>

                    {/* start modal */}

                    <div
                      className="modal fade"
                      id="filterModal"
                      tabIndex={-1}
                      aria-labelledby="filterModalLabel"
                      aria-hidden="true"
                    >
                      <div
                        className={`modal-dialog align-items-end  modal-filter 
                            modal-lg modal-dialog-centered modal-sport modal-sport-leader-board`}
                      >
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title" id="filterModalLabel">
                              Sport
                              <span>
                                {sumBy(sportsState, function (o) {
                                  return o.options?.length ?? 1;
                                })}
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
                          <div className={`modal-body filter-custom"`}>
                            <div className="position-relative">
                              <div className=" col-lg-2 col-md-2 g-0 border-end">
                                <div className="shop__sidebar mt-3">
                                  <div className="sidebar__categories">
                                    <div className="section-title">
                                      <div
                                        className={`accordion`}
                                        id="sportFilter"
                                      >
                                        <div className="accordion-item">
                                          <div
                                            id="collapsesportFilter"
                                            className="accordion-collapse collapse show"
                                            data-bs-parent="#sportFilter"
                                          >
                                            <div>
                                              <FilterSport
                                                isFullHeight
                                                isAll={true}
                                                isSearch={false}
                                                onChange={onChangeFilter}
                                                name="sport"
                                                isDefault={true}
                                                options={sportsState}
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
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* end modal */}
                  </div>
                </div>
              </>
            )}

            <h1 className="text-title">Collectors' Leaderboard</h1>
            <div className="pricing-grid mt-3">
              {/* <div
                className="btn-group btn-group-detail btn-group-sm filter-date mb-3 border-none"
                role="group"
                aria-label="Basic radio toggle button group"
              >
                <input
                  type="radio"
                  className="btn-check"
                  name="btnradio"
                  id="btnradio1"
                  autoComplete="off"
                  defaultChecked
                />
                <label
                  onClick={() => onChangeFilter(7, "timePeriod")}
                  className="btn btn-light"
                  htmlFor="btnradio1"
                >
                  Worldwide
                </label>
                <input
                  type="radio"
                  className="btn-check"
                  name="btnradio"
                  id="btnradio2"
                  autoComplete="off"
                />
                <label
                  onClick={() => onChangeFilter(14, "timePeriod")}
                  className="btn btn-light"
                  htmlFor="btnradio2"
                >
                  Europe
                </label>
                <input
                  type="radio"
                  className="btn-check"
                  name="btnradio"
                  id="btnradio3"
                  autoComplete="off"
                />
                <label
                  onClick={() => onChangeFilter(30, "timePeriod")}
                  className="btn btn-light"
                  htmlFor="btnradio3"
                >
                  Asia
                </label>
                <input
                  type="radio"
                  className="btn-check"
                  name="btnradio"
                  id="btnradio4"
                  autoComplete="off"
                />
                <label
                  onClick={() => onChangeFilter(90, "timePeriod")}
                  className="btn btn-light"
                  htmlFor="btnradio4"
                >
                  North America
                </label>
                <input
                  type="radio"
                  className="btn-check"
                  name="btnradio"
                  id="btnradio5"
                  autoComplete="off"
                />
                <label
                  onClick={() => onChangeFilter(365, "timePeriod")}
                  className="btn btn-light"
                  htmlFor="btnradio5"
                >
                  South America
                </label>
              </div> */}
              <div className="content-pricing-grid p-0 mt-3 table-responsive mh-100 customScroll" id="customScroll" onScroll={onScroll}>
                <table className="table table-striped table-borderless" >
                  <thead>
                    <tr style={{ height: 48 }}>
                      <th className="text-center" scope="col">Rank</th>
                      <th scope="col">User</th>
                      <th scope="col">User Class</th>
                      <th scope="col">
                        <div className="d-flex cursor-pointer">Total Value</div>
                      </th>
                      <th scope="col">
                        <div className="d-flex cursor-pointer">
                          Upload Total
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {!data.isLoading &&
                      dataTable?.map((item, key) => (
                        <tr key={key}>
                          <td className="text-center"> {item.rank} </td>
                          <td>
                            <Link href={userInfo.userid === item.userid ? `/profile/personal` : `/friends/${item.userid}`}>
                                <a className="text-reset text-decoration-none">
                                    {item.username === "Unknown"  ? `Unknown #${item.userid}` : item.username}
                                </a> 
                            </Link>
                          </td>
                          <td> {getLevelUser(item.total_upload)} </td>
                          <td> {formatCurrency(item.total_value)} </td>
                          <td> {formatNumber(item.total_upload)} </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                {data.isLoading &&
                  dataLoader?.map((item, key) => (
                    <div className="my-2" key={key}>
                      <Skeleton />
                    </div>
                  ))}
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
                  <div className="d-flex justify-content-center pagination-page">
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
              {/* {!data.isLoading && (
                <>
                  <div className="d-flex justify-content-center">
                    <button
                      onClick={onLoadMore}
                      type="button"
                      className="btn btn-light load-more"
                    >
                      Load More
                    </button>
                  </div>
                  <div className="d-flex justify-content-center mt-3">
                    <ReactPaginate
                      breakLabel="..."
                      nextLabel=">"
                      onPageChange={handlePageClick}
                      pageRangeDisplayed={5}
                      pageCount={Math.ceil(
                        (data.cards.length ?? 0) / rowsPerPage
                      )}
                      previousLabel="<"
                      pageClassName="page-item"
                      pageLinkClassName="page-link"
                      previousClassName="page-item"
                      previousLinkClassName="page-link"
                      nextClassName="page-item"
                      nextLinkClassName="page-link"
                      breakClassName="page-item"
                      breakLinkClassName="page-link"
                      containerClassName="pagination"
                      activeClassName="active"
                      // @ts-ignore
                      renderOnZeroPageCount={null}
                      forcePage={page - 1}
                    />
                  </div>
                </>
              )} */}
            </div>
          </div>
        </div>
      </div>
      <div className="pt-5 popular-publishers">
        <div className="p-5 sub-content">
          <div className="mb-1">
            PriceGuide.Cards only includes cards from public collections where a
            user has uploaded both an image front and an image back in
            calculations for the portfolio leaderboard. Values are based on
            average selling prices."
          </div>
          <div className="mb-1">
            {" "}
            To show the user how the leaderboard values are calculated.
          </div>
          <div>
            {" "}
            Many users wonder why they are not on the leaderboard when it's
            because they have not yet uploaded any images.
          </div>
        </div>
      </div>
      <PersonalPortfolio />
    </>
  );
};

export default React.memo(Leaderboard);
