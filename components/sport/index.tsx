import React, { useState, useEffect } from "react";
import SmartSearch from "components/smartSearch";
import { isEmpty } from "lodash";
import CardBreakdown from "components/chart/cardBreakdown";
import TopTradingCards from "components/homePage/topTradingCards";
import Select from "react-select";
import TopElementSlick from "components/cards/cardNode";
import { useRouter } from 'next/router'
import Link from 'next/link'
import LatestCollections from "components/homePage/componnents/latestCollections";
import { Collection } from "model/portfolio/collection";
import { SportType } from "interfaces"
import Skeleton from 'react-loading-skeleton';
import SlickCustom from "components/card-slick/slickCustom";
import { api } from 'configs/axios';
import { ToastSystem } from "helper/toast_system";
import LeaderboardHomePage from "components/homePage/leaderboardHomePage"
import BackgroundHomePage from "assets/images/background-homepgae.webp";
import PersonalPortfolio from "components/personalPortfolio"
import {
  CollectionApi,
} from "api/collection";
import FaqHomePage from "components/homePage/componnents/faqHomePage"
import Selectors from "redux/selectors";
import { useSelector, useDispatch } from "react-redux";
import { formatCurrency, gen_card_url, formatNumber } from "utils/helper"
import ImageCardSearch from "assets/images/card_search.png";
import { useForm, SubmitHandler } from "react-hook-form";
import { CardModel, SaleData } from "model/data_sport/card_sport";
import { CardDetailApis } from "api/CardDetailApis";
import { HomeActions } from "redux/actions/home_action";
// import Head from 'next/head';

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

type ParamTypes = {
  sportName: string
}

export type Inputs = {
  sport: number;
}

function SportLandingPage({...props}) {
  const router = useRouter();
  const { sportName } = router.query;
  const [sportSelected, setSportSelected] = useState<SportType>();
  const [publishers, setPublishers] = useState<any[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const { loggingIn, userInfo } = useSelector(Selectors.auth);
  const dispatch = useDispatch();
  const [cardSelected, setCardSelected] = useState<any>();
  const [saleData, setSaleData] = useState<Array<SaleData> | undefined>();
  const [cardPrice, setCardPrice] = useState<any>();
  const { register, handleSubmit, watch, reset, formState: { errors }, setValue } = useForm<Inputs>();
  const [cardData, setCardData] = useState<CardModel | undefined>()
  const [priceChart, setPriceChart] = useState<any>({});
  const { cardBreakDown } = useSelector(Selectors.home);

  React.useEffect(() => {
    if (sportSelected) {
      getListPublisher()
      getListCard()
      getOptionCardBreakDown(sportSelected?.id);
    }
  }, [sportSelected])

  const getListCard = async () => {
    try {
      const params: any = {
        limit: 10,
        // sport: sportSelected?.id,
        sport_name: sportSelected?.sportName,
        is_newest: true,
        page: 1,
      };
      const result = await CollectionApi.getCollection(params);
      if (result.success) {
        let collectionsNew = result.data.collections.map(
          (item: { [key: string]: any }) => {
            return new Collection(item);
          }
        );
        setCollections(collectionsNew);
      }
    }
    catch (err) {
      // console.log(err)
      // //@ts-ignore
      // if (err.status === 200) {
      //   router.push('/404')
      // }
    }
  }
  
  const getListPublisher = async () => {
    try {
      const params = {
        sport: sportSelected?.id
        // sport_name: 'baseball'
      }
      const result = await api.v1.getPopularPublisher(params);
      if (result.success) {
        return setPublishers(result.data)
      }
      return ToastSystem.error(result.message ?? result.error);
    }
    catch (err) {
      console.log(err)
    }

  }

  const onCreatePersonalPortfolio = () => {
    router.push("/profile/collections")
  }

  const renderLink = () => {
		if (!loggingIn) return '/login';
		return '/profile/collections';
  }

  const getOptionValue = (option: any) => option.order;

  useEffect(() => {
    if (!isEmpty(cardBreakDown)) {
      setCardSelected(cardBreakDown[0]);
    }
  },[cardBreakDown])

  useEffect(() => {
    if (!isEmpty(cardSelected)) {
      getCardDetail();
    }
  }, [cardSelected])

  useEffect(() => {
    if (!isEmpty(cardData)) {
      getMClineData();
    }
  },[cardData])

  const getOptionCardBreakDown = async (sportId: number) => {
    try {
      let prms = {
        "sport": sportSelected?.id
      }
      const res = await api.v1.cards_break_down.cardBreakDown(prms);
      
      if (res.success) {
        dispatch(HomeActions.updateCardBreakDown(res.data));
      }
    } catch (error) {
      console.log('error.....', error)
    }
  }
  
  const getCardDetail = async () => {
    try {
      let prms = {
        card_code: cardSelected?.cardCode,
        currency: userInfo.userDefaultCurrency,
      }

      const res = await CardDetailApis.loadCardDetail(prms);

      if (res.success) { 
        setCardData(new CardModel(res.data?.card_detail))
      }
    } catch (error) {
      
    }
  }

  const getMClineData = async () => {
    try {
      //@ts-ignore
      let card_code = cardData?.code; 
      let prms = {
        card_code: card_code,
        grade_company: 'all',
        grade_value: 'all',
        time_period: 365,
        currency: userInfo.userDefaultCurrency,
        resample: "D"
      }
      const res = await api.v1.mc_line_home_fuature.getCalcMaLineFuature(prms);
      if (res.success) {
        setPriceChart(res.data.price);
        setCardPrice(res.data.stats)
      }
    } catch (error) {
      
    }
  }

  const gotoCardDetail = () => {
    //@ts-ignore
    const url = gen_card_url(cardData?.webName ?? '', cardData?.onCardCode ?? '');
    return `/card-details/${cardData?.code}/${url}`;
  }
  return (
    <>
      <div className="sport-landing-page">
        <div style={{ backgroundImage: `url(${BackgroundHomePage.src})` }} className="header d-flex align-items-center">
          <div className="content-header">
            <div className="title-header">{sportSelected?.sportName && `${sportSelected?.sportName} Card Price Guide`} </div>
            <div className="sub-title-header"> Find actual prices from a quarter of a billion card sales </div>
            <SmartSearch
              // @ts-ignore
              sportName={sportName} onSelectSport={e => setSportSelected(e)} isHomePage={1} isArrow={0} />
            <div>
              <button className="btn btn-primary btn-find-card"> Find Cards </button>
            </div>
            <div>
              <Link href={renderLink()}>
                <a className="btn btn-primary btn-create-portfolio" title="Create Personal Portfolio"> Create Personal Portfolio </a>
              </Link>
            </div>
          </div>
        </div>
        <div className="content-home  mt-5 mb-3 sport-publisher">
          <div className="pt-3 title-publisher">{isEmpty(sportSelected) ? <Skeleton /> : `${sportSelected?.sportName} Publishers`} {Boolean(publishers.length) && !isEmpty(sportSelected) && <span className="fs14 count-publishers"> {publishers.length} Publishers</span>}  </div>
          <div className="row pb-5">
            <SlickCustom id={sportSelected?.id} data={publishers} />
          </div>
        </div>
        <TopTradingCards sportId={sportSelected?.id} title={sportSelected?.sportName ? `Top Trading ${sportSelected?.sportName} Cards` : ""} cardElement={TopElementSlick} />
        <div className="popular-publishers py-5">
          <div className="row">
            <div className="card-breakdown col-12 col-md-6 col-lg-6 col-xl-6">
              <h2 className="mb-2 text-title">Card Breakdown</h2>
              <div className="mb-2 sub-title"> Select card and get actual information about the after-market activity of sales value </div>
              <div className="d-flex justify-content-center align-items-center picture-box">
                <img
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    if (ImageCardSearch) {
                      currentTarget.src = ImageCardSearch.src;
                    }
                  } }
                  className="img-product-element"
                  height="277"
                  src={`https://img.priceguide.cards/${cardData?.sport.name === "Non-Sport" ? "ns" : "sp"}/${cardData?.cardFrontImage?.img}.jpg`}
                  alt="" title="" />
              </div>
              <div className="mb-3">
                <label className="form-label select-card"> Select Card </label>
                <Select
                  className="custom-select"
                  onChange={(value) => {
                    setValue('sport', value?.order?.toString() ?? '');
                    setCardSelected(value);
                  } }
                  value={cardSelected}
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
                  }} />
              </div>
              <div className="row picture-box-data">
                <label className="col-4 col-sm-3 col-form-label">Name:</label>
                <div className="col-8 col-sm-9">
                  {cardData?.fullNameWithCode ? <input
                    type="text"
                    readOnly
                    className="form-control-plaintext"
                    value={cardData?.fullNameWithCode} /> : <Skeleton style={{ width: 100 }} />}
                </div>
              </div>
              <div className="row picture-box-data">
                <label className="col-4 col-sm-3 col-form-label">Sport:</label>
                <div className="col-8 col-sm-9">
                  {cardData?.sport?.name ?
                    <Link href={`/collections/${cardData?.sport?.name.replace(/\s/g, '').toLowerCase()}`}>
                      <a className="text-reset" title={cardData?.sport?.name}> {cardData?.sport?.name} </a>
                    </Link> : ''}
                </div>
              </div>
              <div className="row picture-box-data">
                <label className="col-4 col-sm-3 col-form-label">Publisher:</label>
                <div className="col-8 col-sm-9">
                  {cardData?.publisher?.name ?
                    <input
                      type="text"
                      readOnly
                      className="form-control-plaintext"
                      value={cardData?.publisher?.name} /> : <Skeleton style={{ width: 100 }} />}
                </div>
              </div>
              <div className="row picture-box-data">
                <label className="col-4 col-sm-3 col-form-label">Collection:</label>
                <div className="col-8 col-sm-9">
                  {cardData?.set.name ?
                    <Link href={`/${cardData?.set.url}`}>
                      <a title={cardData.set.name} className="text-reset"> {cardData.set.name} </a>
                    </Link> : <Skeleton style={{ width: 100 }} />}
                </div>
              </div>
              <div className="row picture-box-data">
                <label className="col-4 col-sm-3 col-form-label">Base/Insert:</label>
                <div className="col-8 col-sm-9">
                  {cardData?.type.name ?
                    <input
                      type="text"
                      readOnly
                      className="form-control-plaintext"
                      value={cardData?.type?.name} /> : <Skeleton style={{ width: 100 }} />}
                </div>
              </div>
              <div className="row picture-box-data">
                <label className="col-4 col-sm-3 col-form-label">Parallel:</label>
                <div className="col-8 col-sm-9">
                  {cardData?.color.name ?
                    <input
                      type="text"
                      readOnly
                      className="form-control-plaintext"
                      value={cardData?.color.name} /> : <Skeleton style={{ width: 100 }} />}
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-6 col-xl-6 content-break-down">
              <CardBreakdown price_data={priceChart} />
              <div className="data-chart-info">
                <div className="row bold-chart-text">
                  <label className="col-8  col-sm-6 col-form-label">Change (% from first data1):</label>
                  <div className="col-4 col-sm-6 value-input">
                    {cardPrice?.change ?
                      <input
                        type="text"
                        readOnly
                        className="form-control-plaintext"
                        value={`+${formatNumber(cardPrice?.change)}%`} /> : <Skeleton style={{ width: 100 }} />}
                  </div>
                </div>
                <div className="row">
                  <label className="col-8  col-sm-6 col-form-label">Latest Value:</label>
                  <div className="col-4 col-sm-6 value-input">
                    {cardPrice?.latest ?
                      <input
                        type="text"
                        readOnly
                        className="form-control-plaintext"
                        value={formatCurrency(cardPrice?.latest)} /> : <Skeleton style={{ width: 100 }} />}
                  </div>
                </div>
                <div className="row">
                  <label className="col-8  col-sm-6 col-form-label">Lowest Value:</label>
                  <div className="col-4 col-sm-6 value-input">
                    {cardPrice?.min ?
                      <input
                        type="text"
                        readOnly
                        className="form-control-plaintext"
                        value={formatCurrency(cardPrice?.min)} /> : <Skeleton style={{ width: 100 }} />}
                  </div>
                </div>
                <div className="row">
                  <label className="col-8  col-sm-6 col-form-label">Highest Value:</label>
                  <div className="col-4 col-sm-6 value-input">
                    {cardPrice?.max ?
                      <input
                        type="text"
                        readOnly
                        className="form-control-plaintext"
                        value={formatCurrency(cardPrice?.max)} /> : <Skeleton style={{ width: 100 }} />}
                  </div>
                </div>
                <div className="row">
                  <label className="col-8  col-sm-6 col-form-label">Average Value:</label>
                  <div className="col-4 col-sm-6 value-input">
                    {cardPrice?.average ?
                      <input
                        type="text"
                        readOnly
                        className="form-control-plaintext"
                        value={formatCurrency(cardPrice?.average)} /> : <Skeleton style={{ width: 100 }} />}
                  </div>
                </div>
                <div className="row">
                  <label className="col-8  col-sm-6 col-form-label">Total Trades:</label>
                  <div className="col-4 col-sm-6 value-input">
                    {cardPrice?.total_trades ?
                      <input
                        type="text"
                        readOnly
                        className="form-control-plaintext"
                        value={cardPrice?.total_trades} /> : <Skeleton style={{ width: 100 }} />}
                  </div>
                </div>
              </div>
              <div className="mb-3 mt-4">
                <label className="form-label select-card">Select Card</label>
                <Select
                  className="custom-select"
                  onChange={(value) => {
                    setValue('sport', value?.order?.toString() ?? '');
                    setCardSelected(value);
                  } }
                  value={cardSelected}
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
                  }} />
              </div>
              <div className="d-flex justify-content-around section-detail-btn">
                <Link href={gotoCardDetail()}>
                  <a className="btn btn-primary btn-see-detail"> See Detailed Overview </a>
                </Link>
                <button onClick={() => router.push(`/search/?sport_criteria=${sportSelected?.id}`)} className="btn btn-primary btn-see-all">  See All {sportSelected?.sportName} Cards </button>
              </div>
            </div>
          </div>
        </div>
        <LatestCollections
          routerLink={`/collections/${sportName}`}
          title={isEmpty(sportSelected) ? "" : `Latest ${sportSelected?.sportName} Collections`} data={collections} />
        <div className="container-fluid">
          <div className="row leader-board-join-community">
            <LeaderboardHomePage sportId={sportSelected?.id} />
          </div>
        </div>
        <div className="row g-0 statistical">
          <div className="col">
            <div className="text-statistical"> 250M </div>
            <div className="sub-text-statistical"> Recorded Sales Prices </div>
          </div>
          <div className="col">
            <div className="text-statistical"> 10.5M </div>
            <div className="sub-text-statistical"> Cards Featured </div>
          </div>
          <div className="col">
            <div className="text-statistical"> 135K </div>
            <div className="sub-text-statistical"> Active Collectors </div>
          </div>
          <div className="line-bottom"></div>
        </div>
        <FaqHomePage />
        <PersonalPortfolio />
        {/* <Footer></Footer> */}
      </div></>
  );
}

// function capitalizeFirstLetter(string: string) {
//   return string.charAt(0).toUpperCase() + string.slice(1);
// }

// export const getServerSideProps = async (context: any) => { 
//   try {
//       const params = {
//         sport_name: context?.query?.sportName
//       }
//     const result = await api.v1.getPopularPublisher(params);
//     const sportName = capitalizeFirstLetter(context?.query?.sportName);
    
//     let titlePage = `Free Online ${sportName} Card Price Guide - ${sportName} Card Values from `;
//     let descriptionPage = `${sportName} Price Guide. Find actual prices for your favorite cards. Add cards to your personal online collection and track values over time.`;
    
//     let check_more = false;
//     if (result.success) {
//       result.data.map((item, key) => {
//         if (key < 3) {
//           //@ts-ignore
//           titlePage += item.publisherName + ", "
//         } 
//         if (key > 3) {
//           check_more = true;
//           return;
//         }
        
//       })
//     }
//     let textEditor = titlePage.slice(0, -2);

//     titlePage = `${textEditor} ${check_more ? '& more' : ''}| PriceGuide.Cards`;

//     return {props:{
//      titlePage,
//       descriptionPage,
//      result
//     }}

//   } catch (error) {
    
//   }
//   return {
//     props: {},
//   };
// }
export default React.memo(SportLandingPage);
