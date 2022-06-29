import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import Selectors from "redux/selectors";
import { HomeActions } from "redux/actions/home_action";
import { useTranslation, initReactI18next } from "react-i18next";
import { useForm, SubmitHandler } from "react-hook-form";
import Skeleton from 'react-loading-skeleton'

import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head';

import { api } from 'configs/axios';
import { isEmpty } from "lodash";

import { CardDetailApis } from "api/CardDetailApis";
import { formatCurrency, gen_card_url, formatNumber } from "utils/helper"

import { CardModel, SaleData } from "model/data_sport/card_sport";

import ImageCardSearch from "assets/images/card_search.png";
import imgInfo from "assets/images/alert-info.svg";
import imgClose from "assets/images/cross-gray.svg";
import BackgroundHomePage from "assets/images/background-homepgae.webp";

import SlickSport from "components/homePage/componnents/slickSport"
import PersonalPortfolio from "components/personalPortfolio"
import DatabaseStats from "components/databaseStats/databaseStats"
import SlickPublishers from "components/homePage/componnents/slickPublishers"
import FaqHomePage from "components/homePage/componnents/faqHomePage"
import SmartSearch from "components/smartSearch";
import CardBreakdownChart from "components/chart/chartCardBreakdown";
// import CardBreakDown from "components/cardbreakdown/CardBreakdown";
import TopTradingCards from "components/homePage/topTradingCards";
import TopElementSlick from "components/cards/cardNode";
import LeaderboardHomePage from "components/homePage/leaderboardHomePage"
import LatestCollections from "components/homePage/componnents/latestCollections";

export type Inputs = {
  sport: number;
}

function HomePage() {
  const [t, i18n] = useTranslation("common");
  const router = useRouter();
  const { is_browse, currency } = useSelector(Selectors.config);
  const { popularPublishers, latestCollections, cardBreakDown } = useSelector(Selectors.home);
  const { loggingIn, userInfo } = useSelector(Selectors.auth);
  const dispatch = useDispatch();
  const [cardSelected, setCardSelected] = useState<any>();
  const [saleData, setSaleData] = useState<Array<SaleData> | undefined>();
  const [cardPrice, setCardPrice] = useState<any>();
  const { register, handleSubmit, watch, reset, formState: { errors }, setValue } = useForm<Inputs>();
  const [cardData, setCardData] = useState<CardModel | undefined>()
  const [priceChart, setPriceChart] = useState<any>({});
  const [maintenance, setMaintenance] = useState<Array<any>>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    dispatch(HomeActions.getLatestCollection());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    getOptionCardBreakDown(1);
  }, [])

  const changeTransaction = () => {
    const languageCode = i18n.language === "vi" ? "en" : "vi";
    i18n.changeLanguage(languageCode)
    localStorage.setItem("langCode", languageCode)
  }

  const getOptionValue = (option: any) => option.order;

  useEffect(() => {
    if (!isEmpty(cardBreakDown)) {
      setCardSelected(cardBreakDown[0]);
    }
  }, [cardBreakDown])

  useEffect(() => {
    if (!isEmpty(cardSelected)) {
      getCardDetail();
    }
  }, [cardSelected])

  useEffect(() => {
    let isCardData = false;

    if (!isEmpty(cardData)) {
      isCardData = true;
      getMClineData();
    }
    if (!isCardData) {
      getMClineData();
    }
  }, [cardData, currency])

  // Get the list of cards featured in the "Card Breakdown" section
  const getOptionCardBreakDown = async (sportId: number) => {
    try {
      let prms = {
        "sport": sportId
      }
      const res = await api.v1.cards_break_down.cardBreakDown(prms);
      if (res.success) {
        dispatch(HomeActions.updateCardBreakDown(res.data));
      }
    } catch (error) {
      console.log('error.....', error)
    }
  }

  // Card Details for "Card Breakdown" section
  const getCardDetail = async () => {
    setIsLoading(true);
    try {
      let prms = {
        card_code: cardSelected?.cardCode,
        currency: userInfo.userDefaultCurrency,
      }
      const res = await CardDetailApis.loadCardDetail(prms);
      setIsLoading(false);
      if (res.success) {
        setCardData(new CardModel(res.data?.card_detail))
      }
    } catch (error) {
      setIsLoading(false);
    }
  }

  // Line Chart for "Card Breakdown" section
  const getMClineData = async () => {
    try {
      let card_code = cardData?.code;
      if (card_code) {
        let prms = {
          card_code: card_code,
          grade_company: 'all',
          grade_value: 'all',
          time_period: 365,
          currency: currency,
          resample: "D"
        }
        // pg_app_calc_ma_line_featured
        const res = await api.v1.mc_line_home_fuature.getCalcMaLineFuature(prms);
        if (res.success) {
          setPriceChart(res.data.price);
          setCardPrice(res.data.stats)
        }
      }

    } catch (error) {

    }
  }

  // "See Detailed Overview" button for "Card Breakdown" section
  const gotoCardDetail = () => {
    const url = gen_card_url(cardData?.webName ?? '', cardData?.onCardCode ?? '');
    return `/card-details/${cardData?.code}/${url}`;
  }

  return (
    <div
      style={{ backgroundColor: "#fafafb" }}
    >
      <Head>
        <title>Free Card Price Guide - Baseball, Basketball, Hockey, Soccer, Football, MMA & more | PriceGuide.Cards</title>
        <meta name="description" content="Sports Card Price Guide. Find actual prices from a quarter of a billion card sales. Search sport card values for Baseball, Football, Basketball, Hockey & more." />
      </Head>
      <div style={{
        backgroundImage: `url(${BackgroundHomePage.src})`
      }} className="header d-flex align-items-center">
        <div className="content-header">
          <h1 className="title-header">Sports Card Price Guide</h1>
          <div className="sub-title-header"> Find actual prices from a quarter of a billion card sales </div>
          <SmartSearch isHomePage={1} isArrow={1} />
          {maintenance && maintenance?.[0]?.type === 1 &&
            <div className="alert alert-maintenance" role="alert">
              <img src={imgInfo} alt="" title="" />
              <div className="content">Our database upgrade in <span className="cblue">3:00pm - 4:00pm</span> (CES)</div>
              <span> <img className="close" src={imgClose} alt="" title="" /> </span>
            </div>}
        </div>
      </div>
      <div className="content-home content-slick mb-10 position-relative mt-5">
        <div className="row">
          <SlickSport />
        </div>
      </div>
      <TopTradingCards routerLink="" cardElement={TopElementSlick} />

      {/* // Move all of this section below in to a component, I've started the file components/cardbreakdown/CardBreakdown */}
      {/* <CardBreakDown /> */}

      <div className="popular-publishers py-5">
        <div className="row">
          <div className="card-breakdown col-12 col-md-6 col-lg-6 col-xl-6">
            <h2 className="mb-2 text-title"> Card Breakdown </h2>
            <div className="mb-2 sub-title"> Select card and get actual information about the after-market activity of sales value </div>
            <div className="d-flex justify-content-center align-items-center picture-box">
              <img
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  if (ImageCardSearch) {
                    currentTarget.src = ImageCardSearch.src;
                  }
                }}
                className="img-product-element"
                height="277"
                src={`https://img.priceguide.cards/${cardData?.sport.name === "Non-Sport" ? "ns" : "sp"}/${cardData?.cardFrontImage?.img}.jpg`}
                alt="" title="" />
              {/* <ImageBlurHash
                className=""
                src={`https://img.priceguide.cards/${cardData?.sport.name==="Non-Sport"?"ns":"sp"}/${cardData?.cardFrontImage?.img}.jpg`}
              /> */}
            </div>

            <div className="mb-3">
              <label className="form-label select-card">Select Card</label>
              <Select
                className="custom-select"
                onChange={(value) => {
                  setValue('sport', value?.order?.toString() ?? '');
                  setCardSelected(value)
                }}
                value={cardSelected}
                isSearchable={false}
                options={cardBreakDown}
                getOptionValue={getOptionValue}
                getOptionLabel={(option) => option.webName}
                classNamePrefix="react-select"
                styles={{
                  // @ts-ignore
                  dropdownIndicator: (provided, state) => ({
                    ...provided,
                    transition: 'all .2s ease',
                    transform: state.selectProps.menuIsOpen && "rotate(180deg)"
                  })
                }}
              />
            </div>
            <div className="row picture-box-data">
              <label className="col-4 col-sm-3 col-form-label">Name:</label>
              <div className="col-8 col-sm-9">
                {
                  isLoading ? <Skeleton style={{ width: 100 }} /> :
                    <>
                      {cardData?.fullNameWithCode ? <input
                        type="text"
                        readOnly
                        className="form-control-plaintext"
                        value={cardData?.fullNameWithCode} /> : <Skeleton style={{ width: 100 }} />}
                    </>
                }
              </div>
            </div>
            <div className="row picture-box-data">
              <label className="col-4 col-sm-3 col-form-label">Sport:</label>
              <div className="col-8 col-sm-9 pt-2">
                {
                  isLoading ? <Skeleton style={{ width: 100 }} /> :
                    <>
                      {cardData?.sport?.name ?
                        <Link href={`/collections/${cardData?.sport?.name.replace(/\s/g, '').toLowerCase()}`}>
                          <a className="text-reset" title={cardData?.sport?.name}>{cardData?.sport?.name}</a>
                        </Link> : ''}
                    </>
                }
              </div>
            </div>
            <div className="row picture-box-data">
              <label className="col-4 col-sm-3 col-form-label">Publisher:</label>
              <div className="col-8 col-sm-9">
                {
                  isLoading ? <Skeleton style={{ width: 100 }} /> :
                    <>
                      {cardData?.publisher?.name ?
                        <input
                          type="text"
                          readOnly
                          className="form-control-plaintext"
                          value={cardData?.publisher?.name}
                        /> : <Skeleton style={{ width: 100 }} />}
                    </>
                }
              </div>
            </div>
            <div className="row picture-box-data">
              <label className="col-4 col-sm-3 col-form-label">Collection:</label>
              <div className="col-8 col-sm-9 pt-2">
                {
                  isLoading ? <Skeleton style={{ width: 100 }} /> :
                    <>
                      {cardData?.set.name ?
                        <Link href={`/${cardData?.set.url}`}>
                          <a className="text-reset" title={cardData.set.name}>
                            {cardData.set.name}
                          </a>
                        </Link> : <Skeleton style={{ width: 100 }} />}
                    </>
                }
              </div>
            </div>
            <div className="row picture-box-data">
              <label className="col-4 col-sm-3 col-form-label">Base/Insert:</label>
              <div className="col-8 col-sm-9">
                {
                  isLoading ? <Skeleton style={{ width: 100 }} /> :
                    <>
                      {cardData?.type.name ?
                        <input
                          type="text"
                          readOnly
                          className="form-control-plaintext"
                          value={cardData?.type?.name}
                        /> : <Skeleton style={{ width: 100 }} />}
                    </>
                }
              </div>

            </div>
            <div className="row picture-box-data">
              <label className="col-4 col-sm-3 col-form-label">Parallel:</label>

              <div className="col-8 col-sm-9">
                {
                  isLoading ? <Skeleton style={{ width: 100 }} /> :
                    <>
                      {cardData?.color.name ?
                        <input
                          type="text"
                          readOnly
                          className="form-control-plaintext"
                          value={cardData?.color.name}
                        /> : <Skeleton style={{ width: 100 }} />}
                    </>
                }
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-6 col-xl-6 content-break-down">
            <CardBreakdownChart price_data={priceChart} />
            <div className="data-chart-info">
              <div className="row bold-chart-text">
                <label className="col-8  col-sm-6 col-form-label"> Change (% from first data): </label>
                <div className="col-4 col-sm-6 value-input">
                  {cardPrice?.change ?
                    <input
                      type="text"
                      readOnly
                      className="form-control-plaintext"
                      value={`+${formatNumber(cardPrice?.change)}%`}
                    /> : <Skeleton style={{ width: 100 }} />}
                </div>
              </div>
              <div className="row">
                <label className="col-8  col-sm-6 col-form-label"> Latest Value: </label>
                <div className="col-4 col-sm-6 value-input">
                  {cardPrice?.latest ?
                    <input
                      type="text"
                      readOnly
                      className="form-control-plaintext"
                      value={formatCurrency(cardPrice?.latest, currency)}
                    /> : <Skeleton style={{ width: 100 }} />}
                </div>
              </div>
              <div className="row">
                <label className="col-8  col-sm-6 col-form-label"> Lowest Value: </label>
                <div className="col-4 col-sm-6 value-input">
                  {cardPrice?.min ?
                    <input
                      type="text"
                      readOnly
                      className="form-control-plaintext"
                      value={formatCurrency(cardPrice?.min, currency)}
                    /> : <Skeleton style={{ width: 100 }} />}
                </div>
              </div>
              <div className="row">
                <label className="col-8  col-sm-6 col-form-label"> Highest Value: </label>
                <div className="col-4 col-sm-6 value-input">
                  {cardPrice?.max ?
                    <input
                      type="text"
                      readOnly
                      className="form-control-plaintext"
                      value={formatCurrency(cardPrice?.max, currency)}
                    /> : <Skeleton style={{ width: 100 }} />}
                </div>
              </div>
              <div className="row">
                <label className="col-8  col-sm-6 col-form-label"> Average Value: </label>
                <div className="col-4 col-sm-6 value-input">
                  {cardPrice?.average ?
                    <input
                      type="text"
                      readOnly
                      className="form-control-plaintext"
                      value={formatCurrency(cardPrice?.average, currency)}
                    /> : <Skeleton style={{ width: 100 }} />}
                </div>
              </div>
              <div className="row">
                <label className="col-8  col-sm-6 col-form-label"> Total Trades: </label>
                <div className="col-4 col-sm-6 value-input">
                  {cardPrice?.total_trades ?
                    <input
                      type="text"
                      readOnly
                      className="form-control-plaintext"
                      value={cardPrice?.total_trades}
                    /> : <Skeleton style={{ width: 100 }} />}
                </div>
              </div>
            </div>
            <div className="mb-3 mt-4">
              <label className="form-label select-card"> Select Card </label>
              <Select
                className="custom-select"
                onChange={(value) => {
                  setValue('sport', value?.order?.toString() ?? '');
                  setCardSelected(value)
                }}
                value={cardSelected}
                isSearchable={false}
                options={cardBreakDown}
                getOptionValue={getOptionValue}
                getOptionLabel={(option) => option.webName}
                classNamePrefix="react-select"
                styles={{
                  // @ts-ignore
                  dropdownIndicator: (provided, state) => ({
                    ...provided,
                    transition: 'all .2s ease',
                    transform: state.selectProps.menuIsOpen && "rotate(180deg)"
                  })
                }}
              />
            </div>
            <div className="d-flex justify-content-around section-detail-btn">
              <Link href={gotoCardDetail()}>
                <a className="btn btn-primary btn-see-detail" title="See Detailed Overview">
                  See Detailed Overview
                </a>
              </Link>
              <button onClick={() => router.push(`/search/?sport_criteria=${cardData?.sport?.id}`)} className="btn btn-primary btn-see-all" title="See All Baseball Cards"> See All Baseball Cards </button>
            </div>
          </div>
        </div>
      </div>
      <LatestCollections data={latestCollections} />
      <div className="container-fluid">
        <div className="row leader-board-join-community">
          <LeaderboardHomePage sportId={1} />
        </div>
      </div>
      <DatabaseStats />
      {/* <Market cardElement={TopElementSlick} /> */}
      {/* <div className="container-fluid">
        <div className="row">
          <div
            style={{ paddingRight: 120, backgroundColor: "#ececec" }}
            className="pl-150 col-6"
          >
            <CardContentHomePage
              textButton="Buy Cards"
              title="Buy Cards on a Market"
              textContent="Find unique cards on a market, buy from verified sellers and increase your collection."
            >
              <ul className="ms-5">
                <li>Find rare Cards on Auctions</li>
                <li>Exchange your Cards on new ones with Best Offers</li>
                <li>Buy Cards with best prices</li>
                <li>A fourth item</li>
                <li>And a fifth one</li>
              </ul>
            </CardContentHomePage>
          </div>
          <div style={{ backgroundColor: "#B3B3B3" }} className="col-6 pr-150">
            <CardContentHomePage
              textButton="Sell Cards "
              title="Sell Cards on a Market"
              textContent="Sell your cards with actual market price, find best offers, get best price from the auctions."
            >
              <ul className="ms-5">
                <li>Sell on actions</li>
                <li>Get new cards to your collection through cards exchange</li>
                <li>Sell Cards with real market prices</li>
                <li>A fourth item</li>
                <li>And a fifth one</li>
              </ul>
            </CardContentHomePage>
          </div>
        </div>
      </div> */}
      <FaqHomePage />
      <div
        className="popular-publishers">
        <h2 className="pt-3 text-title mb-5"> Popular Publishers </h2>
        <div className="row pb-5">
          <SlickPublishers />
        </div>
      </div>
      <PersonalPortfolio />
    </div>
  );
}

export default React.memo(HomePage);
