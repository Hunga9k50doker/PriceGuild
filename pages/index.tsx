import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Selectors from "redux/selectors";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/router'
import Head from 'next/head';

import { CardModel } from "model/data_sport/card_sport";

import imgInfo from "assets/images/alert-info.svg";
import imgClose from "assets/images/cross-gray.svg";
import BackgroundHomePage from "assets/images/background-homepgae.webp";

import SlickSport from "components/homePage/slickSport"
import PersonalPortfolio from "components/personalPortfolio"
import DatabaseStats from "components/databaseStats/databaseStats"
import SlickPublishers from "components/homePage/slickPublishers"
import FaqHomePage from "components/homePage/faqHomePage"
import SmartSearch from "components/smartSearch";
import CardBreakDown from "components/cardbreakdown/CardBreakdown";
import TopTradingCards from "components/homePage/topTradingCards";
import TopElementSlick from "components/cards/cardNode";
import LeaderboardHomePage from "components/homePage/leaderboardHomePage"
import LatestCollections from "components/homePage/latestCollections";

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
  const { register, handleSubmit, watch, reset, formState: { errors }, setValue } = useForm<Inputs>();
  const [cardSelected, setCardSelected] = useState<any>();
  const [cardPrice, setCardPrice] = useState<any>();
  const [cardData, setCardData] = useState<CardModel | undefined>()
  const [priceChart, setPriceChart] = useState<any>({});
  const [maintenance, setMaintenance] = useState<Array<any>>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

      <CardBreakDown />

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
