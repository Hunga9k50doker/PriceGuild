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
import { api } from 'configs/axios';
import { isEmpty } from "lodash";

import { CardDetailApis } from "api/CardDetailApis";
import { formatCurrency, gen_card_url, formatNumber } from "utils/helper"

import { CardModel, SaleData } from "model/data_sport/card_sport";

import ImageCardSearch from "assets/images/card_search.png";

import CardBreakdownChart from "components/chart/chartCardBreakdown";

export type Inputs = {
    sport: number;
}

function CardBreakDown() {
    const [t, i18n] = useTranslation("common");
    const router = useRouter();
    const { currency } = useSelector(Selectors.config);
    const { cardBreakDown } = useSelector(Selectors.home);
    const { userInfo } = useSelector(Selectors.auth);
    const dispatch = useDispatch();
    const { formState: { errors }, setValue } = useForm<Inputs>();
    const [cardSelected, setCardSelected] = useState<any>();
    const [cardPrice, setCardPrice] = useState<any>();
    const [cardData, setCardData] = useState<CardModel | undefined>()
    const [priceChart, setPriceChart] = useState<any>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        dispatch(HomeActions.getLatestCollection());
        getOptionCardBreakDown(1);
    }, [])

    const getOptionValue = (option: any) => option.order;

    // Set a card selected on "Card Breakdown" when the cardBreakDown data is ready
    useEffect(() => {
        if (!isEmpty(cardBreakDown)) {
            setCardSelected(cardBreakDown[0]);
        }
    }, [cardBreakDown])

    // Get new data when selected Card Breakdown card is changed
    useEffect(() => {
        if (!isEmpty(cardSelected)) {
            getCardBreakdownCardDetail();
        }
    }, [cardSelected])

    // Re-draw the Card Breakdown MA line on currency or data change
    useEffect(() => {
        if (!isEmpty(cardData)) {
            getCardBreakdownMALineData();
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
    const getCardBreakdownCardDetail = async () => {
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
    const getCardBreakdownMALineData = async () => {
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
    );
}

export default React.memo(CardBreakDown);
