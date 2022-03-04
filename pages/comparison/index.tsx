import React, { useState, useRef, useEffect } from "react";
import CardDetail from "components/cardDetail";
import { CardItemType, ManageCollectionType } from "interfaces";
import { isEmpty, cloneDeep } from "lodash";
import { Tab, Nav, Row, Col } from "react-bootstrap";
import { formatCurrency, gen_card_url } from "utils/helper";
import Skeleton from "react-loading-skeleton";
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useSelector } from "react-redux";
import Selectors from "redux/selectors";
import { useDispatch } from "react-redux";
import { CompareAction } from "redux/actions/compare_action";
import IconPlus from "assets/images/plus.svg";
import IconShare from "assets/images/share.svg";
import IconHeart from "assets/images/icon-heart-v2.svg";
import IconHeartFull from "assets/images/icon-heart-v2-active.svg";
import IconFolder from "assets/images/icon-folder.svg";
import IconFolderFull from "assets/images/icon-folder-active.svg";
import IconDelete from "assets/images/delete.svg";
import LoginModal from "components/modal/login"
import ChosseCollection from "components/modal/chosseCollection";
import SelectGrading from "components/modal/selectGrading";
import { CardModel } from "model/data_sport/card_sport";
import SaleChartComparison, {RefType as RefTypeSaleChart} from 'components/comparison/sale-chart'
import CardPhotoBase from "assets/images/Card Photo Base.svg";
import PlaceholderChart from "components/cardDetail/components/placeholder_chart"
import ImageLineChart from "assets/images/line_chart_placeholder.png";
import ImageSaleChart from "assets/images/sale_chart_placeholder.png";
const ISSERVER = typeof window === "undefined";

  const Comparison: React.FC = () => {
  const refCompare = useRef<RefTypeSaleChart>(null)

  const [isOpenLogin, setIsOpenLogin] = useState<boolean>(false);
  const [isOpenWishList, setIsOpenWishList] = React.useState(false);
  const [wishList, setWishList] = React.useState<
    ManageCollectionType | undefined
  >();
  const [cardSelected, setCardSelected] = useState<Array<string | number>>([]);
  const { loggingIn } = useSelector(Selectors.auth);
  const [isOpen, setIsOpen] = React.useState(false);
  const [cardData, setCardData] = useState<CardModel | undefined>()
  const [isOpenGrade, setIsOpenGrade] = React.useState(false);
  const [isCopy, SetIsCopy] = useState<boolean>(false);
  let router = useRouter();
  const dispatch = useDispatch();
  const {cards} = router.query;
  const getCardData = (data: any) => {
    let arrayCards: Array<any> = [];
    
    if (!isEmpty(data)) {
      let arr = data.split(" ");
      arr.map((item:string, i: number) => {
        if(i <= 8){
          let obj = {
            code: item,
            firstname: "",
            lastname: "",
          }
          arrayCards.push(obj);
        }
      })
    }

    // localStorage.removeItem('comparison');
    // localStorage.setItem('comparison', JSON.stringify(arrayCards));

    return arrayCards;
  }
  useEffect(() => {
    if(cards) {
      if(!isEmpty(cards)) {
        setCard(getCardData(cards));
      }
    }
  }, [cards])
  const [card, setCard] = React.useState<Array<CardItemType>>(
    !isEmpty(cards) ?
      getCardData(cards)
    : 
    !ISSERVER ? JSON.parse(localStorage.getItem("comparison") ?? "[]") ?? [] : []
  );  

  

  const [cardState] = React.useState<Array<CardItemType>>(
    !isEmpty(cards) ?
      getCardData(cards)
    : 
    !ISSERVER ? JSON.parse(localStorage.getItem("comparison") ?? "[]") ?? [] : []
  ); 
    
  const { userInfo } = useSelector(Selectors.auth);
  const [activeKey, setActiveKey] = useState<string|undefined>(undefined)
  const pricingGridRef = useRef<any>(null);

  const addMoreCard = () => {
    const url = localStorage.getItem("url-search");
    router.push(
      url ?? `/search?sport_criteria=${userInfo?.userDefaultSport ?? 1}`
    );
  };

  const removeCard = (item: CardItemType) => {
    refCompare.current?.removeSeries(`${item.id}`)
    setCard((prevState) => [...prevState?.filter((c) => c.code !== item.code)]);
    let cardOld = JSON.parse(localStorage.getItem("comparison") ?? "[]") ?? [];
    cardOld = cardOld.filter((c: any) => c?.code !== item.code);
    localStorage.setItem("comparison", JSON.stringify(cardOld));
    dispatch(CompareAction.removeCard(item.code));
    setActiveKey(cardOld?.length ? cardOld[0].code : null)
  };

  const selectWishlist = (item: ManageCollectionType) => {
    setWishList(item);
    setIsOpenWishList(false);
    setIsOpenGrade(true);
  };

  const onAddWishList = (item: any) => {
    setCardData(item)
    if (loggingIn) {
      setIsOpenWishList(true)
    }
    else {
      setIsOpenLogin(true);
    }
  }

  const selectCollection = (item: ManageCollectionType) => {
    router.push(
      `/collections-add-card?collection=${item.group_ref}&code=${cardSelected.toString()}`
    );
  };

  const gotoCardDetail = (card: any) => {
    if (card?.webName && card.onCardCode) {
      const url = gen_card_url(card?.webName, card?.onCardCode);
      router.push(
        `/card-details/${card.code}/${url}`
      );
    }
  }

  const updateCard = (code: string) => {
    let cardOld = cloneDeep(card);
    cardOld = cardOld.map(card => card.code === code ? ({ ...card, wishlist: 1 }) : ({ ...card }));
    setCard(cardOld)
  }
  
  const handleClipBoard = () => {
    let cardsData = cards !== undefined ? cards :  JSON.parse(localStorage.getItem("comparison") ?? "[]") ?? [];
    let string = ''; 
    if (!isEmpty(cards)) {
      // @ts-ignore
      string = cards?.replace(/\s/g, '+')
    } else {
      if (cardsData.length > 0) {
        for (const i in cardsData) {
          if ( +i === cardsData.length - 1 ) {
            string += cardsData[i]['code'];
          } else {
            string += cardsData[i]['code'] + "+";
          }
        }
      }
    }
    //
   

    // handle copy
    const el = document.createElement("textarea");
    el.value = `https://${window.location.host}/comparison?cards=`+string;
    el.setAttribute("readonly", "");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    el.select();
    el.setSelectionRange(0, 99999); // for mobile
    document.execCommand("copy");
    document.body.removeChild(el);

    SetIsCopy(true);
  }

  const removeErrorCard = (code: string) => {
    setCard(prevState => [...prevState.filter(item => item.code !== code)]);
  }
    
  useEffect(() => {
    if (isCopy) {
      setTimeout(() => {
        SetIsCopy(false)
      },1000)
    }
  }, [isCopy])
  return (
    <div>
      <div className="container-fluid comparison">
        <div className="d-flex align-items-center justify-content-between comparison-head">
          <h1 className="comparison-head__title"> Cards Comparison </h1>
          { !isEmpty(card) && <div className="comparison-head-group">
            <button onClick={addMoreCard} type="button" className="btn btn-add">
              <img src={IconPlus} alt="Add More Cards" title="Add More Cards" />
              <span className="only-desktop"> Add More Cards </span>
            </button>
            <button type="button" className="btn btn-share position-relative" onClick={() => handleClipBoard()}>
              <img src={IconShare} alt="Share Comparison List" title="Share Comparison List" />
              <span className="only-desktop"> Share Comparison List </span>
              { isCopy && <div className="position-absolute text-copy">Copied!</div> }
            </button>
          </div> }
        </div>
        { !isEmpty(card) && <div className="row comparison-content">
          {card?.map((item, key) => (
            <div key={key} className={`${card.length < 3 ? "col-md-6 col-lg-6" : " col-md-6 col-lg-4"} col-12  mb-3 comparison-content-item`}>
              <div className="comparison-content-box ">
                <div className="comparison-content-box-card">
                  <div className="comparison-content-box-card" >
                    <div onClick={()=> gotoCardDetail(item)} className="comparison-content-box__img cursor-pointer">
                      <div className="h-100"> <img alt=""
                                className="w-100"
                                onError={({ currentTarget }) => {
                                  currentTarget.onerror = null;
                                    currentTarget.src=CardPhotoBase;
                                }}
                                src={item?.cardFrontImage?.img ? `https://img.priceguide.cards/${item.sport.name === "Non-Sport" ? "ns" : "sp"}/${item.cardFrontImage?.img}.jpg` : CardPhotoBase} /> 
                      </div>
                    </div>
                    <div className="d-flex comparison-content-box-group">
                      <div
                        onClick={() => {
                          if (Boolean(item?.portfolio)) {
                            return router.push(`/profile/collections`)
                          }
                          setCardData(undefined);
                          //@ts-ignore
                          setCardSelected([item.code]);
                          if (loggingIn) {
                            setIsOpen(true)
                          }
                          else {
                            setIsOpenLogin(true);
                          }
                        }}
                        className="comparison-content-box-icon cursor-pointer comparison-content-box-icon--document"> <img src={`${Boolean(item?.portfolio) ? IconFolderFull : IconFolder}`} alt="" /> </div>
                      <div
                        onClick={() => {
                          if (Boolean(item?.wishlist)) {
                            return router.push(`/profile/wishlists`)
                          }
                          onAddWishList(item)
                        }}
                        className="comparison-content-box-icon cursor-pointer comparison-content-box-icon--note"> <img src={`${Boolean(item?.wishlist) ? IconHeartFull : IconHeart}`} alt="" /> </div>
                    </div>
                  </div>
                </div>
                <div onClick={()=> gotoCardDetail(item)} className="comparison-content-box-detail cursor-pointer">
                  <div className="mb-2 d-flex align-items-center comparison-content-box-detail__title">
                    {item?.sport?.name ?? <Skeleton style={{ width: 50 }} />}
                    <i className="mx-1 fa fs4 fa-circle" aria-hidden="true" />
                    <span> {item.year ?? <Skeleton style={{ width: 50 }} />} </span>
                    <i className="mx-1 fa fs4 fa-circle" aria-hidden="true" />
                    {item?.publisher?.name ?? <Skeleton style={{ width: 50 }} />}
                  </div>
                  <div className="comparison-content-box-detail__description">
                    {item.webName ? ( `${item.webName}${isEmpty(item?.OnCardCode) ? "" : " - #" + item.OnCardCode}`
                    ) : (
                      <Skeleton style={{ width: 100 }} />
                    )}
                  </div>
                  <div className="btn-au-memo">
                    {Boolean(item.auto) && <button type="button" className="me-1 btn-au mb-3 cursor-default"> AU </button>}
                    {Boolean(item.memo) && <button type="button" className="btn-memo mb-3 cursor-default"> MEM </button>}
                  </div>
                  <div className="comparison-content-box-detail__price">
                    {item.webName ? (
                      !item.minPrice && !item.maxPrice ? "N/A" : `${formatCurrency(item.minPrice)} - ${formatCurrency(item.maxPrice)}`
                    ) : (
                      <Skeleton style={{ width: 100 }} />
                    )}
                  </div>
                </div>
                <div className="btn-delete">
                  <img onClick={() => removeCard(item)} src={IconDelete} className="cursor-pointer" alt="Delete" />
                </div>
              </div>
            </div>
          ))}
        </div> }
        { !isEmpty(card) && <div className="comparison-detail">
          <div className="mb-5 comparison-detail-item">
            <span className="comparison-detail-item__title"> Name </span>
            <div className="row">
              {card?.map((item, key) => (
                <div
                  key={key}
                  className={`${card.length < 3 ? "col-md-6 col-lg-6" : " col-md-4 col-md-6 col-lg-4"} col-12`}
                >
                  <div className="only-mobile ">
                    <p className="comparison-detail-item__title-name "> {item.webName} {isEmpty(item?.onCardCode) ? "" : " - #" + item.onCardCode} </p>
                  </div>
                      <span className="text-decoration-underline">
                          <Link href={`/search?sport=${item?.sport?.id}&q=${item?.firstname}`}>
                              <a className="text-reset">
                                  {item?.firstname}
                              </a>
                          </Link>
                  </span>{" "} {item?.onCardCode ? `#${item?.onCardCode}` : ""}
                </div>
              ))}
            </div>
          </div>
          <div className="mb-5 comparison-detail-item">
            <span className="comparison-detail-item__title"> Sport </span>
            <div className="row">
              {card?.map((item, key) => (
                <div
                  key={key}
                  className={`${card.length < 3 ? "col-md-6 col-lg-6" : " col-md-6 col-lg-4"} col-12`}
                >  
                  <div className="only-mobile ">
                    <p className="comparison-detail-item__title-name ">
                      {item.webName} {isEmpty(item?.OnCardCode) ? "" : " - #" + item.OnCardCode}
                    </p>
                  </div>
                      <Link href={`/search?sport_criteria=${item?.sport?.id}`} >
                          <a className="text-reset text-decoration-none" title={item?.sport?.name}>
                              {item?.sport?.name}
                          </a>
                      </Link>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-5 comparison-detail-item">
            <span className="comparison-detail-item__title"> Publisher </span>
            <div className="row">
              {card?.map((item, key) => (
                <div
                  key={key}
                  className={`${card.length < 3 ? "col-md-6 col-lg-6" : " col-md-6 col-lg-4"} col-12`}
                >
                  <div className="only-mobile ">
                    <p className="comparison-detail-item__title-name "> {item.webName} {isEmpty(item?.OnCardCode) ? "" : " - #" + item.OnCardCode} </p>
                  </div>
                      <Link href={`/search?publisher=${item.publisher?.id}&publisherName=${item.publisher?.name}&sport_criteria=${item?.sport?.id}`} >
                          <a className="text-reset text-decoration-none" title={item.publisher?.name}>
                              {item.publisher?.name}
                          </a>
                      </Link>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-5 comparison-detail-item">
            <span className="comparison-detail-item__title"> Year </span>
            <div className="row">
              {card?.map((item, key) => (
                <div
                  key={key}
                  className={`${card.length < 3 ? "col-md-6 col-lg-6" : " col-md-6 col-lg-4"} col-12`}
                >
                  <div className="only-mobile ">
                    <p className="comparison-detail-item__title-name "> {item.webName} {isEmpty(item?.OnCardCode) ? "" : " - #" + item.OnCardCode} </p>
                  </div> {item.year}
                </div>
              ))}
            </div>
          </div>
          <div className="mb-5 comparison-detail-item">
            <span className="comparison-detail-item__title"> Collection </span>
            <div className="row">
              {card?.map((item, key) => (
                <div
                  key={key}
                  className={`${card.length < 3 ? "col-md-6 col-lg-6" : " col-md-6 col-lg-4"} col-12`}
                >
                <div className="only-mobile ">
                  <p className="comparison-detail-item__title-name ">
                    {item.webName} {isEmpty(item?.OnCardCode) ? "" : " - #" + item.OnCardCode}
                  </p>
                </div>
                    <Link href={`/${item?.set?.url}`} >
                        <a className="text-reset text-decoration-none" title={item?.set?.name}>
                            {item?.set?.name}
                        </a>
                    </Link>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-5 comparison-detail-item">
            <span className="comparison-detail-item__title"> Base/Insert </span>
            <div className="row">
              {card?.map((item, key) => (
                <div
                  key={key}
                  className={`${card.length < 3 ? "col-md-6 col-lg-6" : " col-md-6 col-lg-4"} col-12`}
                >
                  <div className="only-mobile ">
                    <p className="comparison-detail-item__title-name "> {item.webName} {isEmpty(item?.OnCardCode) ? "" : " - #" + item.OnCardCode} </p>
                  </div>
                  {item?.type?.name}
                </div>
              ))}
            </div>
          </div>
          <div className="mb-5 comparison-detail-item">
            <span className="comparison-detail-item__title"> Parallel </span>
            <div className="row ">
              {card?.map((item, key) => (
                <div
                  key={key}
                  className={`${card.length < 3 ? "col-md-6 col-lg-6" : " col-md-6 col-lg-4"} col-12`}
                >
                  <div className="only-mobile ">
                    <p className="comparison-detail-item__title-name "> {item.webName} {isEmpty(item?.OnCardCode) ? "" : " - #" + item.OnCardCode} </p>
                  </div>
                      <Link  href={`/checklist/${item?.type?.id}/${item?.color?.code}/${item?.color?.url}`}>
                          <a className="text-reset text-decoration-none"  title={item?.color?.name}>
                              {item?.color?.name}
                          </a>
                      </Link>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-5 comparison-detail-item">
            <span className="comparison-detail-item__title"> Print Run </span>
            <div className="row">
              {card?.map((item, key) => (
                <div
                  key={key}
                  className={`${card.length < 3 ? "col-md-6 col-lg-6" : " col-md-6 col-lg-4"} col-12`}
                >
                  <div className="only-mobile ">
                    <p className="comparison-detail-item__title-name "> {item.webName} {isEmpty(item?.OnCardCode) ? "" : " - #" + item.OnCardCode} </p>
                  </div>
                  {item?.printRun}
                </div>
              ))}
            </div>
          </div>
        </div> }
      </div>
      <div>
        { !isEmpty(card) && (
            <div ref={pricingGridRef}>
              <Tab.Container
              transition={true}
              id="tab-settings"
              activeKey={activeKey}
              // @ts-ignore
              onSelect={(k) =>  activeKey && setActiveKey(k)}
              defaultActiveKey={`${card[0].code}`}
            >
              <Row className="row-comparison">
                <Col className="nav-comparison p-sticky-header">
                  <Nav variant="pills">
                    {card?.map((item, key) => (
                      <Nav.Item onClick={() =>  window.scrollTo({ behavior: 'smooth', top: pricingGridRef.current.offsetTop}) } className="col text-center" key={key}>
                        <Nav.Link className="cursor-pointer w-100" eventKey={item.code}>{`${item.firstname ?? ""}`} </Nav.Link>
                      </Nav.Item>
                    ))}
                  </Nav>
                </Col>
                <Col sm={12}>
                  <Tab.Content>
                    {card?.map((item, key) => {
                      return (
                        <Tab.Pane key={item.id} eventKey={item.code}>
                          <CardDetail
                              isHideSaleChart={true}
                              key={item.id}
                              code={item.code}
                              onUpdateCard={(e) => {
                                if (refCompare.current) {
                                  refCompare.current.addData({cardId: `${e.id}`, cardCode: e.code, data: e.saleChartState, cardName: `${item.firstname ? `${item.firstname} ` : ''}${item.lastname ?? ''}`, cardData: e.cardData})
                                }
                                setCard((prevState) => [
                                  ...prevState.map((item, index) =>
                                    item.code === e.code ? { ...item, ...e } : item
                                  ),
                                ]);
                              }}
                              onChangeGradeCompare={(cardGrade, cardId) => refCompare.current?.onChangeGrade(cardGrade, `${cardId}`)}
                              errorCard={async (e) => { removeErrorCard(e) } }
                            />
                        </Tab.Pane>
                      );
                    })}
                  </Tab.Content>
                  <div className="container-fluid card-detail container-comparison-chart" id="sale-chart-comparison">
                    <div className="content-home">
                      <h2 className="mb-5 title-profile "> Sales Chart </h2>
                        {Boolean(!loggingIn) ?
                          <PlaceholderChart src={ImageSaleChart.src} /> : <SaleChartComparison ref={refCompare} />}
                    </div>
                  </div>
                </Col>
              </Row>
            </Tab.Container>  
            </div>
          )}
      </div>
      <ChosseCollection
        selectCollection={selectWishlist}
        table="wishlist"
        title="wishlist"
        isOpen={isOpenWishList}
        setIsOpen={setIsOpenWishList}
      />
      <ChosseCollection
        selectCollection={selectCollection}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <LoginModal
        onSuccess={() => {
          setIsOpenLogin(false);
          if (cardData) {
            setIsOpenWishList(true)
          } else {
            setIsOpen(true)
          }
        }}
        isOpen={isOpenLogin}
        onClose={() => setIsOpenLogin(false)} />
        {cardData && loggingIn && <SelectGrading
        wishList={wishList}
        cardData={cardData}
        isOpen={isOpenGrade}
        onSuccess={updateCard}
        setIsOpen={setIsOpenGrade}
      />}
      { isEmpty(card) && <div className="empty-collection pt-0">
        <div className="box-content">
          <p>You don't have any cards <br/>in your comparison list</p>
            <Link href="/search">
                <a title="Start Adding Cards" className="btn btn-primary">
                    Start Adding Cards
                </a>
            </Link>
        </div>
      </div> }
    </div>
  );
};

export default React.memo(Comparison);
