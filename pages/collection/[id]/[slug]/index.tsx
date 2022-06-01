import React, { useState } from "react";
import moment from "moment";
import Select from "react-select";
import Skeleton from "react-loading-skeleton";
import { CollectionType, SalesOverviewType, ManageCollectionType } from "interfaces";
import { api } from "configs/axios";
import ParameterTitle from "components/Skeleton/collection/parameterTitle";
import { formatCurrency, gen_card_url } from "utils/helper";
import { useRouter } from 'next/router'
import Link from 'next/link'
import { isEmpty, truncate } from "lodash";
import ScrollspyNav from "components/scrollspy/lib/ScrollspyNav";
import ArrowRight from "assets/images/arrow-right-blue.svg";
import ArrowGray from "assets/images/arrow-gray.svg";
import FolderPlus from "assets/images/folder-plus.svg";
import Modal from "react-bootstrap/Modal";
import ImageBlurHash from "components/imageBlurHash";
import ImgCard from "assets/images/Collection_Card.png";
import LoadingCollection from "components/Skeleton/collection/loadingCollectionDetail";
import CaptCha from "components/modal/captcha";
import CardPhotoBase from "assets/images/Card Photo Base.svg";
import { useTranslation } from "react-i18next";
import Head from 'next/head';
import IconFolder from "assets/images/icon-folder-svg.svg";
import IconFolderFull from "assets/images/icon-folder-active.svg";
import IconHeart from "assets/images/icon_heart.svg";
import IconHeartFull from "assets/images/icon_heart_tim.svg";
import IconDot3 from "assets/images/dot-3.svg";
import IconCanFull from "assets/images/icon_can_tim.svg";
import IconCan from "assets/images/icon_can.svg";
import { useSelector, useDispatch } from "react-redux";
import Selectors from "redux/selectors";
import LoginModal from "components/modal/login";
import ChosseCollection from "components/modal/chosseCollection";
import { ToastSystem } from "helper/toast_system";
import { CompareAction } from "redux/actions/compare_action";
import SelectGrading from "components/modal/selectGrading";
import LazyLoadImg from "components/lazy/LazyLoadImg";
import {pageView, event} from "libs/ga"

type PropTypes = {
  location: any;
};

type ParamTypes = {
  id: string;
};

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

type SortType = {
  by: string;
  asc: boolean;
};

type FilterDataType = {
  auto_memo?: number;
  timePeriod?: number;
  sort?: SortType;
};

const CollectionDetail = (props: PropTypes) => {
  const [collection, setCollection] = useState<CollectionType | undefined>();
  const router = useRouter();
  const { id } = router.query;
  const [isCaptCha, setIsCaptCha] = useState<boolean>(false);
  const { loggingIn } = useSelector(Selectors.auth);
  const [cardData, setCardData] = useState<SalesOverviewType | undefined>();
  const [isOpenCollection, setIsOpenCollection] = useState<boolean>(false);
  const [isOpenLogin, setIsOpenLogin] = useState<boolean>(false);
  const [isOpenWishList, setIsOpenWishList] = React.useState(false);
  const [cardSelected, setCardSelected] = useState<Array<string | number>>([]);
  const dispatch = useDispatch();
  const { cards } = useSelector(Selectors.compare);

  const [dataTable, setDataTable] = useState<Array<SalesOverviewType>>([]);
  const [filterData, setFilterData] = useState<FilterDataType>({
    timePeriod: 7,
    sort: {
      by: "maxSales",
      asc: false,
    },
  });
  const [isOpen, setIsOpen] = React.useState(false);
  const { currency } = useSelector(Selectors.config);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getDetail = async (headers: any = {}): Promise<void> => {
    try {
      const res = await api.v1.collection.getDetail({ setID: Number(id) }, headers);
      if (res.success) {
        return setCollection(res.data);
      }
      setIsCaptCha(Boolean(res?.show_captcha))

    } catch (error) {
      console.log("error........", error);
    }
  };
  const [t, i18n] = useTranslation("common")
  React.useEffect(() => {
    if (!isEmpty(router.query)) {
      getDetail();
    }
  }, [router.query]);

  React.useEffect(() => {
    if (!isEmpty(collection)) {
      setFilterData((prevState) => {
        return { ...prevState, auto_memo: collection?.auto_memo?.[0]?.index };
      });
    }
  }, [collection]);

  React.useEffect(() => {
    let isCheckCurrency =  true;
    if (!isEmpty(collection)) {
      isCheckCurrency = false;
      salesOverviewCollection();
    
    }
    if(isCheckCurrency && !isLoading) {
      salesOverviewCollection();
    }
  }, [filterData, currency]);

  const salesOverviewCollection = async () => {
    await setIsLoading(true);
    try {
      const params = {
        setID: Number(id),
        currency: currency,
        ...filterData,
      };
      if(params.auto_memo) {
        const res = await api.v1.collection.getSalesOverview(params);
        if (res.success) {
          setIsLoading(false);
          return setDataTable(res.data);
        }
      }
      
      setDataTable([]);
    } catch (error) {
      setIsLoading(false);
      console.log("error........", error);
    }
  };

  const onChangeFilterAuto = (e: any) => {
    setFilterData((prevState) => {
      return { ...prevState, auto_memo: e.index };
    });
  };

  const renderButtonFilter = (day: number) => {
    switch (day) {
      case 7:
        return `btn btn-secondary ${filterData?.timePeriod === 7 ? "isActive" : ""
          } `;
      case 14:
        return `btn btn-secondary ${filterData?.timePeriod === 14 ? "isActive" : ""
          } `;
      case 30:
        return `btn btn-secondary ${filterData?.timePeriod === 30 ? "isActive" : ""
          } `;
      case 90:
        return `btn btn-secondary ${filterData?.timePeriod === 90 ? "isActive" : ""
          } `;
      case 365:
        return `btn btn-secondary ${filterData?.timePeriod === 365 ? "isActive" : ""
          } `;
      default:
    }
  };

  const onChangeFilter = (e: any) => {
    setFilterData((prevState) => {
      return { ...prevState, timePeriod: e };
    });
  };

  const renderSortTable = (name: string, asc: boolean) => {
    if (asc) {
      if (
        filterData?.sort?.by === name &&
        !filterData?.sort?.asc &&
        dataTable.length
      ) {
        return "ic-caret-down active";
      }
      return "ic-caret-down";
    }
    if (
      filterData?.sort?.by === name &&
      filterData?.sort?.asc &&
      dataTable.length
    ) {
      return "ic-caret-down revert active";
    }
    return "ic-caret-down revert";
  };

  const onSortTable = (name: string) => {
    if (dataTable.length) {
      setFilterData((prevState) => {
        return {
          ...prevState,
          sort: {
            by: name,
            asc: prevState?.sort?.by === name ? !prevState?.sort?.asc : false,
          },
        };
      });
    }
  };

  const goToDetail = (type: number, color: string, url: string) => {
    router.push(`/checklist/${type}/${color}/${url}`);
  };
  const onGoToCard = (item: any) => {
    const url = gen_card_url(item.cardName, item.onCardCode)
    router.push(
      `/card-details/${item.cardCode}/${url}`
    );
  };

  const renderBreadcrumbs = () => {
    return (
      <nav aria-label="breadcrumb" className="breadcrumb-nav">
        <ol className="breadcrumb" vocab="https://schema.org/" typeof="BreadcrumbList">
          <li className="breadcrumb-item" property="itemListElement" typeof="ListItem">
            <Link href={`/collections/${collection?.sport?.name?.replace(/\s/g, '')?.toLowerCase()}`}>
              <a title={`${collection?.sport?.name} Card Collections`} property="item" typeof="WebPage"> 
                <span property="name"> {collection?.sport?.name} Card Collections </span>
              </a>
            </Link>
            <meta property="position" content="1"></meta>
          </li>
          <li className="breadcrumb-item active" aria-current="page" property="itemListElement" typeof="ListItem">
            <Link href={`/${collection?.url}`}>
              <a title={collection?.title} property="item" typeof="WebPage">
                <span property="name"> {collection?.title} </span>
              </a>
            </Link>
            <meta property="position" content="2"></meta>
          </li>
        </ol>
      </nav>
    );
  };
  const renderOptionIcon = (data: any) => {
 
    return    Boolean(cards.find((item) => item.code === data.cardCode))
      ? IconCanFull
      : IconDot3;
  };

  const onAddWishList = (item: any) => {
    setCardData(item);
    if (loggingIn) {
      setIsOpenWishList(true);
    } else {
      setIsOpenLogin(true);
    }
  };
  const renderTable = () => {
    return (
      <div className="row content-home sale-overview-collection">
        <div className="pricing-grid mt-0">
          <div className="fs-3 sl-over-title mb-5">Sales Overview</div>
          <div className="section-tabs-sl-over-coll">
            <ul className="nav nav-tabs" id="myTab" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  onClick={() => onChangeFilter(7)}
                  className="nav-link active"
                  data-bs-toggle="tab"
                  type="button"
                  role="tab"
                  aria-selected="true"
                > 1 week </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  onClick={() => onChangeFilter(14)}
                  className="nav-link"
                  data-bs-toggle="tab"
                  type="button"
                  role="tab"
                  aria-selected="false"
                > 2 weeks </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  onClick={() => onChangeFilter(30)}
                  className="nav-link"
                  data-bs-toggle="tab"
                  type="button"
                  role="tab"
                  aria-selected="false"
                > 1 Month </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  onClick={() => onChangeFilter(90)}
                  className="nav-link"
                  data-bs-toggle="tab"
                  type="button"
                  role="tab"
                  aria-selected="false"
                > 3 Month </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  onClick={() => onChangeFilter(365)}
                  className="nav-link"
                  data-bs-toggle="tab"
                  type="button"
                  role="tab"
                  aria-selected="false"
                > 1 Year </button>
              </li>
            </ul>
            <div className="tab-content" id="myTabContent">
              <div className="filter-pricing-grid d-flex justify-content-between align-items-center">
                <div className="h-left d-flex align-items-center justify-content-center">
                  <div className="title">Card Type</div>
                  <div className="grade grade-index">
                    <Select
                      getOptionValue={(item: any) => item.index}
                      getOptionLabel={(item: any) => item.name}
                      className="react-select"
                      onChange={onChangeFilterAuto}
                      value={collection?.auto_memo?.find(
                        (item) => item.index === filterData?.auto_memo
                      )}
                      classNamePrefix="react-select"
                      options={collection?.auto_memo}
                    />
                  </div>
                </div>
              </div>
              <div
                className={`box-table-memo-sl-over customScroll ${dataTable.length > 0 ? "table-scroll" : ""
                  }`}
              >
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col" style={{ width: "60%" }}>
                        <div
                          onClick={() => onSortTable("cardName")}
                          className="d-flex align-items-center cursor-pointer"
                        > Card
                          <div className="sort-table">
                            <i
                              className={`${renderSortTable(
                                "cardName",
                                true
                              )} sort-asc`}
                              aria-hidden="true"
                            ></i>
                            <i
                              className={`${renderSortTable(
                                "cardName",
                                false
                              )} sort-desc`}
                              aria-hidden="true"
                            ></i>
                          </div>
                        </div>
                      </th>
                      <th scope="col">
                        <div
                          onClick={() => onSortTable("maxSales")}
                          className="d-flex align-items-center cursor-pointer"
                        > Max Sales Value
                          <div className="sort-table">
                            <i
                              className={`${renderSortTable(
                                "maxSales",
                                true
                              )} sort-asc`}
                              aria-hidden="true"
                            ></i>
                            <i
                              className={`${renderSortTable(
                                "maxSales",
                                false
                              )} sort-desc`}
                              aria-hidden="true"
                            ></i>
                          </div>
                        </div>
                      </th>
                      <th scope="col">
                        <div
                          onClick={() => onSortTable("tradeVol")}
                          className="d-flex align-items-center cursor-pointer"
                        > Trade Volume
                          <div className="sort-table">
                            <i
                              className={`${renderSortTable(
                                "tradeVol",
                                true
                              )} sort-asc`}
                              aria-hidden="true"
                            ></i>
                            <i
                              className={`${renderSortTable(
                                "tradeVol",
                                false
                              )} sort-desc`}
                              aria-hidden="true"
                            ></i>
                          </div>
                        </div>
                      </th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataTable.map((item: SalesOverviewType, k: number) => (
                      <tr key={k}>
                        <td>
                          <div className="d-flex">
                            <div onClick={() => onGoToCard(item)} className="box-picture-table cursor-pointer">
                              {/* <img alt="" onError={({ currentTarget }) => {
                                currentTarget.onerror = null;
                                currentTarget.src = CardPhotoBase;
                              }}
                                src={
                                  item?.image
                                    ? `https://img.priceguide.cards/${item.sportName === "Non-Sport"
                                      ? "ns"
                                      : "sp"
                                    }/${item?.image}.jpg`
                                    : CardPhotoBase
                                }
                              /> */}
                              <LazyLoadImg imgError={CardPhotoBase} url={  item?.image ? `https://img.priceguide.cards/${item.sportName === "Non-Sport" ? "ns" : "sp"}/${item?.image}.jpg`: CardPhotoBase }/>
                            </div>
                            <div className="ps-3">
                              <div className="d-flex align-items-center card-info">
                                <div> {item.sportName} </div>
                                <i className="dot-margin" />
                                <div> {item.year} </div>
                                <i className="dot-margin" />
                                <div> {item.publisherName} </div>
                              </div>
                              <div onClick={() => onGoToCard(item)} className="card-title cursor-pointer">
                                {`${item.cardName} # ${item.onCardCode}`}
                              </div>
                              <div className="tag-data d-flex">
                                {Boolean(item?.auto) && (
                                  <div className="tag-au">AU</div>
                                )}
                                {Boolean(item?.memo) && (
                                  <div className="tag-mem">MEM</div>
                                )}
                              </div>
                            </div>
                            <div></div>
                          </div>
                        </td>
                        <td>{formatCurrency(item.maxSales, currency)}</td>
                        <td>{item.tradeVol}</td>
                        <td>
                          {/* <div className="icon-folder">
                            <img src={FolderPlus} alt="FolderPlus" />
                          </div> */}
                          <div className="dropdown dropdown--top">
                            <a href="#" id="navbarDropdownDot" role="button" data-bs-toggle="dropdown" aria-expanded="true"> {" "} <img alt="" src={renderOptionIcon(item)} /> {" "} </a>
                            <div
                              className="dropdown-menu"
                              aria-labelledby="navbarDropdownDot"
                              data-bs-popper="none"
                            >
                              <div
                                onClick={() => {
                                  setCardData(undefined);
                                  setCardSelected([item.cardCode]);
                                  if (loggingIn) {
                                    setIsOpenCollection(true);
                                  } else {
                                    setIsOpenLogin(true);
                                  }
                                }}
                                className="dropdown-menu-item d-flex cursor-pointer"
                              >
                                <div className="dropdown-menu-item__icon">
                                  <img
                                    alt=""
                                    src={!Boolean(item.portfolio)
                                      ? IconFolder
                                      : IconFolderFull} />
                                </div>
                                <div className="dropdown-menu-item__txt"> {" "} Add to {t('portfolio.text')} {" "} </div>
                              </div>
                              <div
                                onClick={() => onAddWishList({
                                  ...item,
                                  code: item.cardCode,
                                })}
                                className="dropdown-menu-item  d-flex cursor-pointer"
                              >
                                <div className="dropdown-menu-item__icon">
                                  <img
                                    alt=""
                                    src={!Boolean(item.wishlist)
                                      ? IconHeart
                                      : IconHeartFull} />
                                </div>
                                <div className="dropdown-menu-item__txt"> Add to Wishlist </div>
                              </div>
                              <div
                                onClick={() => onComparison(item)}
                                className="dropdown-menu-item  d-flex cursor-pointer"
                              >
                                <div className="dropdown-menu-item__icon">
                                  <img alt="" src={renderCompareIcon(item)} />
                                </div>
                                <div className="dropdown-menu-item__txt"> {" "} Add to Comparison {" "} </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="only-mobile">
              <div className="btn btn-see-full" onClick={handleSeeFullTable} title="See Full Table"> See Full Table </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderModalTable = () => {
    return (
      <Modal centered show={isOpen} fullscreen={true} className="modal-seefull">
        <Modal.Header>
          <Modal.Title className="text-truncate">Sales Overview </Modal.Title>
          <a onClick={() => setIsOpen(false)} title="Close"> Close </a>
        </Modal.Header>
        <Modal.Body className="customScroll">{renderTable()}</Modal.Body>
      </Modal>
    );
  };

  const handleSeeFullTable = () => {
    setIsOpen(true);
  };

  const onSuccessCaptcha = (token: any) => {
    setIsCaptCha(false)
    const headers = { "captcha-token": token };
    getDetail(headers)
  }
  const renderCompareIcon = (data: any) => {
    return Boolean(cards.find((item) => item.code === data.cardCode))
      ? IconCanFull
      : IconCan;
    // return Boolean(false)
    //   ? IconCanFull
    //   : IconCan;
  };
  const [wishList, setWishList] = React.useState<
    ManageCollectionType | undefined
  >();
  const [isOpenGrade, setIsOpenGrade] = React.useState<boolean>(false);
  const selectWishlist = (item: ManageCollectionType) => {
    setWishList(item);
    setIsOpenWishList(false);
    setIsOpenGrade(true);
  };
  const selectCollection = (item: ManageCollectionType) => {


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
      code: cardData.cardCode,
      lastname: cardData.lastname,
      firstname: cardData.firstname,
    };

    if (dataOld.find((item: any) => item.code === cardData.cardCode)) {
      dataOld = dataOld.filter((item: any) => item.code !== cardData.cardCode);
      dispatch(CompareAction.removeCard(cardData.cardCode));
      // ToastSystem.success("Card removed from comparison list");
      ToastSystem.success(<span>Card removed from <Link href="/comparison">comparison list</Link> </span>);
    } else {
      dataOld.push(cardNew);
      // ToastSystem.success("Card added to comparison list");
      ToastSystem.success(<span> Card added to <Link href="/comparison">comparison list</Link> </span>);
      dispatch(CompareAction.addCard(cardNew));
    }
    
    localStorage.setItem("comparison", JSON.stringify(dataOld));

    /* ga event */
    event({
      action: "card_added_to_comparison",
      params : {
        eventCategory:  'Comparison',
        eventAction:    "card_added_to_comparison",
        eventLabel:     "Card Added to Comparison"
      }
    })
  };

  return (
    <div className="container-fluid card-detail collection-detail">
      <Head>
        <title>
          {
            //@ts-ignore
            props?.titlePage ?? ''} | PriceGuide.Cards</title>
        <meta name="description" content={`${
          //@ts-ignore
          props?.titlePage ?? ''} Collection Overview. Browse set and check out the top sales from the collection.`} />
        <link rel="canonical" href={
          //@ts-ignore
          `${process.env.DOMAIN}/${props?.urlPage}`} />
      </Head>
      <CaptCha
        isOpen={isCaptCha}
        onSuccess={onSuccessCaptcha}
        onClose={() => setIsCaptCha(false)} />
      <div>
        {isEmpty(collection) ? <Skeleton width={300} /> : renderBreadcrumbs()}{" "}
      </div>
      <div className="template-collection-detail template-collection-detail--mobile mt-5 mb-3">
        <div className="row content-home">
          <div className="col-12 col-md-6">
            <div className="h-100 row d-flex justify-content-end">
              <div className="col-12 col-md-7 pr-box-picture box-picture">
                <div className="bg-color-picture">
                  {!isEmpty(collection) && (
                    <ImageBlurHash
                      height={"100%"}
                      width={"100%"}
                      imageDefault={ImgCard}
                      blurHash={
                        collection?.blurhash ?? "LEHV6nWB2yk8pyo0adR*.7kCMdnj"
                      }
                      className="w-100"
                      src={
                        collection?.image
                          ? `${process.env.REACT_APP_IMAGE_COLLECTION_URL}/${collection?.image}`
                          : ImgCard.src
                      }
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          {isEmpty(collection) ? (
            <ParameterTitle />
          ) : (
            <div className="col-md-6 col-12 ps-4 collection-detail">
              <div className="collection-title-topic d-flex align-items-center">
                <div>{collection?.sport?.name}</div>{" "}
                <i className="dot-margin" />{" "}
                <div>{collection?.year}</div>{" "}
                <i className="dot-margin" />{" "}
                <div>{collection?.publisher?.name}</div>
              </div>
              <h1 className="mb-3 collection-title"> {collection?.title} </h1>
              <ul className="collection-gallery-info">
                <li>
                  <label>Release Date:</label> {typeof collection?.release_date === "number" ? collection?.release_date : moment(collection?.release_date, "MM/DD/YYYY").format("MMM Do YYYY")}
                </li>
                <li>
                  <label>Sport:</label>
                  <Link href={`/collections/${collection?.sport?.name?.replace(/\s/g, '')?.toLowerCase()}`} >
                    <a title={collection?.sport?.name}> {collection?.sport?.name} </a>
                  </Link>
                </li>
                <li>
                  <label>Publisher:</label> {collection?.publisher?.name}
                </li>
                <li>
                  <label>Year:</label> {collection?.year}
                </li>
                <li>
                  <label>Includes:</label> {collection?.auto_memo?.map((item, k) =>
                    <div key={k}> {item.name} </div>
                  )}
                </li>
                <li>
                  <label>Base/Insert:</label> {collection?.total_types}
                </li>
                <li>
                  <label>Cards in Collection:</label> {collection?.total_cards}
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="row">
          {!isEmpty(collection?.auto_memo) ? (
            <>
              <div className="nav-scrollspy">
                <ScrollspyNav
                  offset={80}
                  scrollTargetIds={collection?.auto_memo?.map(
                    (item) => `section_${item.index}`
                  )}
                  activeNavClass="is-active"
                  scrollDuration="100"
                >
                  <ul className="nav nav-pills nav-justified content-collection">
                    {collection?.auto_memo?.map((item, key) => (
                      <li key={key} className="nav-item">
                        <a className="nav-link" href={`#section_${item.index}`}> <span>{item.name}</span> </a>
                      </li>
                    ))}
                  </ul>
                </ScrollspyNav>
              </div>
              <div className="content content-home content-conllection-data">
                {collection?.auto_memo?.map((item, index) => (
                  <div
                    className="section-collection"
                    id={`section_${item.index}`}
                    key={index}
                  >
                    <div className="fs-3 mb-5 collection_memo_title">
                      {item?.name}
                    </div>
                    <div className="">
                      {item.types?.map((type, key) => (
                        <>
                          <div key={key} className="row section-memo">
                            <div className="col-12">
                              <div
                                className="memo_types_title d-flex justify-content-between"
                                data-bs-toggle="collapse"
                                data-bs-target={`#collapseCollection_${key}_${type?.id}_${type?.total_cards}`}
                                role="button"
                                aria-expanded="false"
                                aria-controls="collapseCollection"
                              >
                                <div className="memo_types_title--detail">
                                  <span className="memo_types_title__info">
                                    {type?.name}
                                  </span>
                                  <span className="memo_types_title__amount">
                                    {type?.total_cards} Cards Set{" "}
                                  </span>
                                </div>
                                <img src={ArrowGray} alt="ArrowGray" />
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            {type.colors?.map((colorItem, k) => (
                              <div
                                className="col-6 box-item-memo collapse show"
                                id={`collapseCollection_${key}_${type?.id}_${type?.total_cards}`}
                              >
                                <div
                                  key={k}
                                  onClick={() =>
                                    goToDetail(type?.id, colorItem.colorCode, colorItem.url)
                                  }
                                  style={{
                                    padding: 15,
                                    backgroundColor: "#ececec",
                                  }}
                                  className="d-flex cursor-pointer justify-content-between align-items-center item-memo"
                                >
                                  <div> {colorItem?.colorName} </div>
                                  <div> <img src={ArrowRight} alt="ArrowRight" /> </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <LoadingCollection />
          )}
        </div>
        {renderTable()}
        {isOpen && renderModalTable()}
      </div>
      <ChosseCollection
          selectCollection={selectWishlist}
          table="wishlist"
          title="wishlist"
          isOpen={isOpenWishList}
          setIsOpen={setIsOpenWishList} />
        <ChosseCollection
          selectCollection={selectCollection}
          isOpen={isOpenCollection}
          setIsOpen={setIsOpenCollection} />
          {cardData && loggingIn && (
          <SelectGrading
            wishList={wishList}
            cardData={cardData}
            isOpen={isOpenGrade}
            onSuccess={(code) => {
              let dataNew = [...(dataTable?? [])];
              dataNew = dataNew.map((card) => card.cardCode === code ? { ...card, wishlist: 1 } : { ...card }
              );
              return setDataTable(dataNew);
            } }
            setIsOpen={setIsOpenGrade} />
        )}
      
      <LoginModal
          onSuccess={() => {
            setIsOpenLogin(false);
            if (cardData) {
              setIsOpenWishList(true);
            } else {
              setIsOpenCollection(true);
            }
          } }
          isOpen={isOpenLogin}
          onClose={() => setIsOpenLogin(false)} />
    </div>
  );
};

export const getServerSideProps = async (context: any) => {
  try {

    let data: any = {};
    let titlePage = "";
    let urlPage = "";

    const params = {
      setID: +context?.query?.id
    };

    const config = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      //@ts-ignore
      body: JSON.stringify(params)
    }

    const res = await fetch(`${process.env.REACT_APP_API_LOCAL}/collections/collection/page-title`, config);
    data = await res.json();

    titlePage = data?.collection_title ?? '';
    urlPage = data?.collection_url ?? '';

    return {props:{
      titlePage,
      urlPage,
    }}
  } catch (e) {
    console.error(e);
  }
  return {
    props: {},
  };
};

export default CollectionDetail;
