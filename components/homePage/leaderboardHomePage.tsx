import React, { useState, useEffect } from "react";
import { api } from 'configs/axios';
import { LeaderboardType } from "interfaces"
import { formatCurrency, formatNumber } from "utils/helper";
import Skeleton from 'react-loading-skeleton';
import CardContentHomePage from "components/homePage/cardContentHomePage";
import JoinCommunityImage from "assets/images/join-community.png";
import { useRouter } from 'next/router'
import Link from 'next/link'
import Loading from "components/loading/loading"
import { useSelector } from 'react-redux';
import Selectors from "redux/selectors";

const dataLoader = Array.from(Array(10).keys());

type PropTypes = {
  sportId?: number,
}

type DataLoadType = {
  cards: LeaderboardType[],
  isLoading: boolean,
}

const LeaderboardHomePage = (props: PropTypes) => {
  const router = useRouter();
  const [data, setData] = useState<DataLoadType>({
    cards: [],
    isLoading: true,
  })
  const { currency } = useSelector(Selectors.config);
  const [page] = useState<number>(1);
  const { userInfo } = useSelector(Selectors.auth);

  useEffect(() => {
    let isCheckSportId = false;
    if (props.sportId) {
      getListCard()
      isCheckSportId = true;
    }
    if (!isCheckSportId) {
      getListCard()
    }
  }, [props.sportId, currency])

  const getListCard = async () => {
    try {
      setData(prevState => {
        return { ...prevState, isLoading: true };
      });
      let params = {
        sport: props.sportId,
        page,
        limit: 10,
        currency: currency
      };
      const result = await api.v1.portfolio.portfolioLeaderboard(params);
      if (result.success) {
        return setData({
          cards: result.data,
          isLoading: false
        })
      }
      setData(prevState => {
        return { ...prevState, isLoading: false };
      });
    }
    catch (err) {
      console.log(err)
      setData(prevState => {
        return { ...prevState, isLoading: false };
      });
    }
  }


  const onCreatePersonalPortfolio = () => {
    router.push("/profile/collections")
  }

  return (
    <div className="col-12 py-5 leader-board-home-page g-0">
      <div className="row g-0">
        <div className="col-12 col-sm-12 col-md-6 pl-150 leader-board">
          <h2 className="text-title mb-3">Collectors' Leaderboard</h2>
          <div className="content-table content-table--home">
            <table className="table mb-0 table-borderless table-striped table-hover">
              <thead>
                <tr>
                  <th scope="col"> Rank </th>
                  <th scope="col"> User </th>
                  <th scope="col">
                    <div className="d-flex cursor-pointer"> Total Value </div>
                  </th>
                  <th scope="col" className="th-upload-total">
                    <div className="d-flex cursor-pointer"> Upload Total </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.cards?.map((item, key) =>
                  <tr key={key} >
                    <td> {item.rank} </td>
                    <td>
                      <Link href={userInfo.userid === item.userid ? `/profile/personal` : `/profile/${item.userid}`}>
                        <a className="text-reset text-decoration-none">
                          {item.username === "Unknown" ? `Unknown #${item.userid}` : item.username}
                        </a>
                      </Link>

                    </td>
                    <td> {formatCurrency(item.total_value, currency)} </td>
                    <td className="th-upload-total">{formatNumber(item.total_upload)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {!data.isLoading && !data.cards.length && <Loading type="warning" />}
          {data.isLoading ?
            <Loading type="loading" />
            // dataLoader?.map((item, key) =>
            // <div className="my-2" key={key}>
            //   <Skeleton height={30} />
            // </div>
            :
            <div className="d-flex justify-content-center align-items-center mt-4">
              <Link href={"/leaderboard"}>
                <a className="btn see-more btn-primary" title="See Leaderboard">
                  See Leaderboard
                </a>
              </Link>
            </div>}
        </div>
        <div className="col-12 col-sm-12 col-md-6 py-5 join-community position-relative">
          <div className="position-absolute image-background">
            <CardContentHomePage
              textButton="Create Personal Portfolio"
              title="Join Community"
              textContent="Join a worldwide community of card collectors."
              onClickButton={onCreatePersonalPortfolio}
            >
              <ul className="ms-5">
                <li> Track and Compare Actual Prices </li>
                <li> Manage Your Personal Portfolio </li>
                <li> Join the Leaderboard </li>
                <li> Create Your Personal Wishlist </li>
                <li> Chat with Thousands of Collectors </li>
              </ul>
            </CardContentHomePage>
          </div>
        </div>
      </div>
    </div >
  );
}

export default React.memo(LeaderboardHomePage);
