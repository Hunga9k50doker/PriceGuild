import React, { useState } from "react";
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useSelector } from "react-redux";
import Selectors from "redux/selectors";
import { isEmpty } from "lodash"
import { rowsPerPage } from "configs/common"
import { RookieCardType } from "interfaces"
import { api } from 'configs/axios';
import Skeleton from 'react-loading-skeleton';
import { useDebouncedCallback } from "utils/useDebouncedEffect"
import ReactPaginate from 'react-paginate';
import Head from 'next/head';
// @ts-ignore
import $ from "jquery"

import SkeletonCard from "components/Skeleton/cardItem"

type ParamTypes = {
  id?: string,
}

type DataLoadType = {
  cards: RookieCardType[],
  isLoading: boolean,
  isLoadMore: boolean,
  page: number,
  rows?: number
}

const RookieCards = () => {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const router = useRouter();
  const { sports } = useSelector(Selectors.config);
  const { id } = router.query;
  const [keySearch, setKeySearch] = useState<string>("");
  const [data, setData] = useState<DataLoadType>({
    cards: [],
    isLoading: true,
    isLoadMore: false,
    page: 1,
    rows: 0
  })

  React.useEffect(() => {
    getListCard()
  }, [id])



  const getListCard = async (page = 1, search: string = "") => {
    try {
      setData(prevState => {
        return { ...prevState, isLoading: true, cards: page === 1 ? [] : [...prevState.cards] };
      });
      const params: any = {
        sport_id: id ? Number(id) : undefined,
        page: page,
        limit: rowsPerPage,
        search_term: search ?? keySearch
      }
      const result = await api.v1.blogs.getListRookieCard(params);

      if (result.success) {
        // if (page === 1) {
          $('html, body').animate({ scrollTop: 0 })
        return setData({
          cards: result.data,
          isLoading: false,
          isLoadMore: page * rowsPerPage < Number(result.rows),
          page: page,
          rows: result.rows
        })
        //  }
        // return setData(prevState => {
        //   return {
        //     ...prevState,
        //     cards: [...prevState.cards, ...result.data],
        //     isLoading: false,
        //     isLoadMore: page * rowsPerPage < Number(result.rows),
        //     page: page,
        //     rows: result.rows
        //   };
        // });

      }
      setData(prevState => {
        return { ...prevState, isLoading: false, isLoadMore: false, rows: page === 1 ? 0 : prevState.rows };
      });
    }
    catch (err) {
      setData(prevState => {
        return { ...prevState, isLoading: false, isLoadMore: false, rows: page === 1 ? 0 : prevState.rows };
      });
    }
  }
  const onLoadMore = () => {
    setCurrentPage(data?.page)
    getListCard(data?.page + 1)
  }

  const renderLoading = () => {
    if (sports?.length) return null;
    const dataLoad = [];
    for (let i = 0; i < 10; i++) {
      dataLoad.push(<Skeleton height={30} />)
    }
    return dataLoad
  }

  const loadSuggestions = useDebouncedCallback(getListCard, 450);

  const handleChange = (event: any) => {
    setKeySearch(event?.target?.value)
    loadSuggestions(1, event?.target?.value)
  }

  const handlePageClick = (event: any) => {
    setCurrentPage(event.selected)
    getListCard(event.selected + 1)
  };

  return (
    <div className="container rookie-cards">
      <Head>
        <title>Top Rookie Cards Guide with Pricing | PriceGuide.Cards</title>
        <meta name="description" content="Explore the top selling rookie cards by player. Historical charts enable you to see which cards have been performing the best and which are undervalued." />
      </Head>
      <div className="row">
        <div className="col-4 tab-menu">
          <ul className="list-group list-group-flush my-3">{renderLoading()}
            <li className={`${isEmpty(sports) ? "d-none" : ""} list-group-item ${isEmpty(id) ? "active" : ""}`}>
                <Link href={`/rookie-cards`}>
                    <a className="text-reset text-decoration-none">
                        All Sports
                    </a>
                </Link>
            </li>
            {sports?.map((sport, key) => (
              <li key={key} className={`list-group-item ${Number(id) === sport.id ? "active" : ""}`}>
                <Link href={`/rookie-cards/${sport.id}`}>
                    <a className="text-reset text-decoration-none">
                        {sport.sportName}
                    </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-8">
          <div className="my-3 d-flex justify-content-between align-item-center">
            <h3>{sports?.find(sport => sport.id === Number(id))?.sportName ?? "All Sports"} Rookie Cards</h3>
            <div className="search">
              <i className="ic-search-input" />
              <input
                onChange={handleChange}
                type="text"
                className="form-control"
                placeholder="Search"
              />
            </div>
          </div>
          <div className="row">
            {!data.cards.length && data.isLoading && <SkeletonCard numberLine={28} />}
            {data.cards.map((card, index) =>
              <div onClick={() => router.push(`/rookie-cards-detail/${card.id}`)} key={index} className="cursor-pointer col-lg-3 col-md-3 mb-3">
                <div style={{ backgroundColor: "#CECECE", height: 300 }}></div>
                <div className="fs12">{card.sport_name}</div>
                <div className="fw-bold">{card.playername ?? "Unknown"}</div>
              </div>)}
          </div>
          <div className="d-flex justify-content-center align-items-center mb-3">
            {data.isLoadMore && (<button className="btn btn-primary" type="button" onClick={onLoadMore} disabled={data.isLoading}>
              {data.isLoading ? <><span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                Loading... </> : "Load More"}
            </button>)}


          </div>
          <div className="d-flex justify-content-center">
            <ReactPaginate
              breakLabel="..."
              nextLabel=">"
              onPageChange={handlePageClick}
              pageRangeDisplayed={5}
              pageCount={Math.ceil((data?.rows ?? 0) / rowsPerPage)}
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
              forcePage={currentPage}
              // @ts-ignore
              renderOnZeroPageCount={null}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default React.memo(RookieCards);
