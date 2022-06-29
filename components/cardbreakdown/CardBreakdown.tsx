import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import Skeleton from 'react-loading-skeleton'
import { useForm, SubmitHandler } from "react-hook-form";
import Selectors from "redux/selectors";

import Link from 'next/link'
import { useRouter } from 'next/router'

import { formatCurrency, gen_card_url, formatNumber } from "utils/helper"

import ImageCardSearch from "assets/images/card_search.png";

import CardBreakdownChart from "components/chart/chartCardBreakdown";


type PropTypes = {
    cardData?: any;
}

type defaultProps = {
    cardData: {
        webName: 'foobar',
        onCardCode: 'foobar',
        sport: { name: 'Baseball' },
        cardFrontImage: {
            id: 'Baseball',
            img: ''
        },
        set: { name: 'None' },
        type: { name: 'None' },
        color: { name: 'None' },
    }
};

export type Inputs = {
    sport: number;
}

const CardBreakDown = ({ cardData = {
    webName: '',
    onCardCode: '',
    sport: { name: 'Baseball' },
    cardFrontImage: {
        id: '',
        img: ''
    },
    set: { name: '' },
    type: { name: '' },
    color: { name: '' }
}, ...props }: PropTypes) => {

    // "See Detailed Overview" button for "Card Breakdown" section
    const gotoCardDetail = () => {
        // const url = gen_card_url(cardData?.webName ?? '', cardData?.onCardCode ?? '');
        // return `/card-details/${cardData?.code}/${url}`;
        return `aaa`;
    }

    const genS3ImageLink = () => {
        return `https://img.priceguide.cards/${cardData?.sport.name === "Non-Sport" ? "ns" : "sp"}/${cardData?.cardFrontImage?.img}.jpg`;
    }

    const router = useRouter();
    const { formState: { errors }, setValue } = useForm<Inputs>();
    const [cardSelected, setCardSelected] = useState<any>();
    const { cardBreakDown } = useSelector(Selectors.home);
    const getOptionValue = (option: any) => option.order;
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [priceChart, setPriceChart] = useState<any>({});
    const [cardPrice, setCardPrice] = useState<any>();
    const { is_browse, currency } = useSelector(Selectors.config);

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
                            src={genS3ImageLink()}
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
    );
}

export default React.memo(CardBreakDown);



