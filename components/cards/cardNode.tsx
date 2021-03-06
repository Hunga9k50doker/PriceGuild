import React, { useEffect, useState } from "react";
import { formatCurrency, gen_card_url,formatCurrencyCollection } from "utils/helper"
import { useRouter } from 'next/router'
import Link from 'next/link'
import { CardModel } from "model/data_sport/card_sport";
import { isEmpty } from "lodash"
import { useDispatch, useSelector } from 'react-redux';
import { CompareAction } from "redux/actions/compare_action";
import { ToastSystem } from "helper/toast_system";
import IconHeart from "assets/images/icon-heart-v2.svg";
import IconHeartFull from "assets/images/icon-heart-v2-active.svg";
import IconFolder from "assets/images/icon-folder.svg";
import IconFolderFull from "assets/images/icon-folder-active.svg";
import IconCheck from "assets/images/checkbox.svg";
import IconEdit from "assets/images/edit.png";
import IconEditNode from "assets/images/edit_note.png";
import Selectors from "redux/selectors";
import ImageCardSearch from "assets/images/card_search.png";
import IconDelete from "assets/images/delete_wishlist.svg";
import IconUnion from "assets/images/union_wishlist.svg";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import IconDot3 from "assets/images/dot-3.svg";
import EditIconBlack from "assets/images/edit-icon-black.svg";
// @ts-ignore
import $ from "jquery"
import { SearchFilterAction } from "redux/actions/search_filter_action";
import LazyLoadImg from "components/lazy/LazyLoadImg";
import {pageView, event} from "libs/ga"

type PropTypes = {
  item: CardModel & { [key: string]: any },
  className?: string,
  style?: React.CSSProperties,
  onEditNote?: (item: CardModel) => void,
  isEditCard?: boolean,
  isSelect?: boolean,
  cardSelected?: Array<string | number>,
  onSelectItem?: (code: any) => void,
  valueName?: string,
  isInline?: boolean,
  isTable?: boolean
  namePrice?: string
  onAddWishList?: () => void
  onAddCollection?: () => void
  isWishlist?: boolean,
  onRemoveWishlist?: (code: any) => void,
  onAddNewEntry?: (code: any) => void,
  gotoCard?: (item: any) => void,
  imageUrl?: string,
  priceTooltip?: string,
  isPortfolioAll?: boolean
}

const CardNode = ({ namePrice = "ma28", isTable = false, isInline = false, isWishlist = false, isPortfolioAll = false, ...props }: PropTypes) => {  
  const dispatch = useDispatch();
  const { cards } = useSelector(Selectors.compare);
  const { loggingIn } = useSelector(Selectors.auth);
  const router = useRouter();
  const [openMnWlist, setOpenMnWlist] = useState<boolean>(false);
  const [onMenu, setOnMenu] = useState<boolean>(false);
  const [onIcon, setOnIcon] = useState<boolean>(false);
  const [isShowTooltip, setIsShowTooltip] = useState<boolean>(false);
  const [openMnCardPortfolio, setOpenMnCardPortfolio] = useState<boolean>(false);
  const { currency } = useSelector(Selectors.config);
  const gotoCard = (code: string) => {
    if (!props.isSelect) {
      if (!props.gotoCard) {
        const url = gen_card_url(props.item.webName, props.item.onCardCode);
        return router.push(`/card-details/${code}/${url}`)
      }
      return props.gotoCard(props.item)
    }
  }

  const onEditNote = (e?: any) => {
    e.stopPropagation();
    !props.isSelect && props.onEditNote && props.onEditNote(props.item)
  }

  const onEdit = (e?: any) => {
    e.stopPropagation();
    
    dispatch(SearchFilterAction.updateCardSelectedProfile(props.item));

    if(isPortfolioAll){
     return router.push(`/profile/portfolio/edit-card?collection=0&code=${props.item.code}`)
    }
    !props.isSelect && router.push(`/profile/portfolio/edit-card?collection=${props.item.group_ref ?? 0}&code=${props.item.code}`)
  }

  const onSelectItem = () => {
    (props.isSelect || isTable) && props?.onSelectItem && props?.onSelectItem(props.item[props?.valueName ?? "code"])
  }

  const onAddWishList = (e?: any) => {
    e.stopPropagation();
    if(props.isSelect) return;
    if (isWishlist) {
      setOpenMnWlist(!openMnWlist);
      return;
    }
    
    if (props.item.wishlist) {
      return router.push(`/profile/wishlists`)
    }
    props.onAddWishList && props?.onAddWishList()
  }

  const onComparison = (e?: any) => {
    e.stopPropagation();
    if(props.isSelect) return;

    let dataOld = JSON.parse(localStorage.getItem("comparison") ?? "[]") ?? [];

    if ( dataOld.length === 9 ) {
      return ToastSystem.error(<span> Max number of 9 cards reached on <Link href="/comparison">comparison list</Link> </span>);
    }

    const cardNew = {
      code: props.item.code,
      lastname: props.item.lastname,
      firstname: props.item.firstname
    };

    if (dataOld.find((item: any) => item.code === props.item.code)) {
      dataOld = dataOld.filter((item: any) => item.code !== props.item.code)
      dispatch(CompareAction.removeCard(props.item.code));
      ToastSystem.success(<span>Card removed from <Link href="/comparison">comparison list</Link> </span>);
    }
    else {
      dataOld.push(cardNew)
      ToastSystem.success(<span> Card added to <Link href="/comparison">comparison list</Link> </span>);
      dispatch(CompareAction.addCard(cardNew));
    }
    
    localStorage.setItem("comparison", JSON.stringify(dataOld))

    /* ga event */
    event({
      action: "card_added_to_comparison",
      params : {
        eventCategory:  'Comparison',
        eventAction:    "card_added_to_comparison",
        eventLabel:     "Card Added to Comparison"
      }
    })
  }

  const renderGrade = () => {
    return props.item.grade_display_value !== "Not Specified" ? props.item.grade_display_value : '';
    // switch (props.item.grade_company) {
    //   case "ungraded":
    //     if (props.item.grade_value >= 101 && props.item.grade_value <= 110)
    //       return `${props.item.grade_company?.name} ${props.item.grade_value}`;
    //     return `Ungraded`;
    //   default:
    //     return `${props.item.grade_company?.name} ${props.item.grade_value}`;
    // }
  }

  const onAddCollection = (e?: any) => {
    e.stopPropagation();
    if (props.item.portfolio) {
      return setOpenMnCardPortfolio(!openMnCardPortfolio)
    }
    if(props.isSelect) return;
    
    props.onAddCollection && props.onAddCollection();

    /* ga event */
    event({
      action: "add_to_portfolio",
      params : {
        eventCategory:  'Portfolio',
        eventAction:    'add_to_portfolio',
        eventLabel:     'Card Added to Portfolio'
      }
    })
  }
  const addNewEntriesPortfolio = (e?: any) => {
    e.stopPropagation();
    props.onAddCollection && props.onAddCollection();
  }

  const renderPrice = () => {
    if (props.item.minPrice === null && props.item.maxPrice === null) { 
      return <>
      <OverlayTrigger
        overlay={<Tooltip>{props?.priceTooltip ?? 'Login to see pricing'}</Tooltip>}
      >
        {({ ref, ...triggerHandler }) => (
          <Link href="/login">
           <a title="Login" className="range-price-card text-decoration-none">
             <span className="cursor-pointer" ref={ref} {...triggerHandler}>$###</span>
           </a>
          </Link>
        )}
      </OverlayTrigger>
       {' - '}
      <OverlayTrigger
        overlay={<Tooltip>{props?.priceTooltip ?? 'Login to see pricing'}</Tooltip>}
      >
        {({ ref, ...triggerHandler }) => (
          <Link href="/login">
            <a title="Login" className="range-price-card text-decoration-none">
              <span className="cursor-pointer" ref={ref} {...triggerHandler}>$###</span>
            </a>
          </Link>
        )}
      </OverlayTrigger> </> 
    }

    if (!props.item.minPrice && !props.item.maxPrice) {
      return "N/A"
    }
    return `${formatCurrency(props.item.minPrice, currency)} - ${formatCurrency(props.item.maxPrice, currency)}`
  }

  const renderCompareIcon = () => {
    return Boolean(cards.find(item => item.code === (props.item.code ?? props.item.code))) ?
    <svg className="compare--transition" width="30" height="25" viewBox="0 0 30 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0385 3.30005C11.5928 3.30005 11.2314 3.66142 11.2314 4.10715V5.65545L2.95376 5.64953C2.50803 5.64953 2.14666 6.0109 2.14666 6.45662C2.14666 6.90235 2.50803 7.26372 2.95376 7.26372H4.60642L0.613744 17.1804C0.573928 17.2744 0.552291 17.3751 0.549988 17.477V17.4815C0.549988 20.3799 2.89961 22.7296 5.79801 22.7296C8.69642 22.7296 11.0461 20.3799 11.0461 17.4815L11.046 17.477C11.0437 17.3751 11.0221 17.2745 10.9823 17.1805L6.9956 7.25803L11.2314 7.26346V9.09179C11.2314 9.31112 11.2743 9.52783 11.4165 9.68985C11.5634 9.85725 11.7803 9.92654 12.0385 9.92654C12.2966 9.92654 12.5136 9.85725 12.6605 9.68985C12.8027 9.52783 12.8456 9.31111 12.8456 9.09179V7.26346L16.9807 7.25804L13.0176 17.1807C12.9778 17.2746 12.9562 17.3752 12.9539 17.477V17.4815C12.9539 20.3799 15.3036 22.7296 18.202 22.7296C21.1004 22.7296 23.45 20.3799 23.45 17.4815L23.4499 17.477C23.4476 17.3743 23.4257 17.273 23.3854 17.1784L23.302 16.983L23.2818 16.9931L19.3751 7.26979H20.9491C21.3948 7.26979 21.7562 6.90842 21.7562 6.4627C21.7562 6.01697 21.3947 5.6556 20.9489 5.6556L12.8456 5.66152V4.10715C12.8456 3.66142 12.4842 3.30005 12.0385 3.30005ZM9.03884 16.6866H2.56363L5.8068 8.61482L9.03884 16.6866ZM21.4063 16.6866H14.9312L18.1743 8.62057L21.4063 16.6866Z" fill="#7909A0"/>
      <path d="M29.1 7.8C29.1 11.8317 25.8317 15.1 21.8 15.1C17.7683 15.1 14.5 11.8317 14.5 7.8C14.5 3.76832 17.7683 0.5 21.8 0.5C25.8317 0.5 29.1 3.76832 29.1 7.8Z" fill="#124DE3"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M29.6 7.8C29.6 12.1078 26.1078 15.6 21.8 15.6C17.4922 15.6 14 12.1078 14 7.8C14 3.49218 17.4922 0 21.8 0C26.1078 0 29.6 3.49218 29.6 7.8ZM21.8 13.8C25.1137 13.8 27.8 11.1137 27.8 7.8C27.8 4.48629 25.1137 1.8 21.8 1.8C18.4863 1.8 15.8 4.48629 15.8 7.8C15.8 11.1137 18.4863 13.8 21.8 13.8Z" fill="white"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M25.821 6.09511L20.8989 10.5697L18 7.67081L19.0465 6.6243L20.9476 8.52536L24.8255 5L25.821 6.09511Z" fill="white"/>
    </svg> : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0385 2.2998C11.5928 2.2998 11.2314 2.66118 11.2314 3.1069V4.6552L2.95382 4.64928C2.50809 4.64928 2.14672 5.01065 2.14672 5.45638C2.14672 5.90211 2.50809 6.26348 2.95382 6.26348H4.60648L0.613805 16.1802C0.573989 16.2742 0.552352 16.3748 0.550049 16.4768V16.4813C0.550049 19.3797 2.89967 21.7293 5.79807 21.7293C8.69648 21.7293 11.0461 19.3797 11.0461 16.4813L11.046 16.4768C11.0437 16.3749 11.0222 16.2742 10.9824 16.1803L6.99566 6.25779L11.2314 6.26322V8.09154C11.2314 8.31087 11.2744 8.52758 11.4165 8.6896C11.5634 8.85701 11.7804 8.9263 12.0385 8.9263C12.2967 8.9263 12.5136 8.85701 12.6605 8.6896C12.8027 8.52758 12.8456 8.31087 12.8456 8.09154V6.26321L16.9808 6.2578L13.0176 16.1805C12.9779 16.2744 12.9563 16.3749 12.954 16.4768V16.4813C12.954 19.3797 15.3036 21.7293 18.202 21.7293C21.1004 21.7293 23.4501 19.3797 23.4501 16.4813L23.45 16.4768C23.4477 16.3748 23.4261 16.274 23.3862 16.1799L19.376 6.26955H21.0523C21.498 6.26955 21.8594 5.90818 21.8594 5.46245C21.8594 5.01672 21.4979 4.65535 21.0522 4.65535L12.8456 4.66127V3.1069C12.8456 2.66118 12.4843 2.2998 12.0385 2.2998ZM9.0389 15.6863H2.56369L5.80686 7.61457L9.0389 15.6863ZM21.4064 15.6863H14.9313L18.1744 7.62033L21.4064 15.6863ZM5.7946 20.1242C4.09187 20.1216 2.63061 18.9403 2.25549 17.3005H9.31031C8.93714 18.932 7.48846 20.1107 5.7946 20.1242ZM18.1744 20.1242L17.9965 20.1245C16.3783 20.0322 15.0167 18.8768 14.659 17.3005H21.7143C21.3391 18.9406 19.8775 20.1219 18.1744 20.1242Z" fill="#0B0E61"/>
    </svg>
  }
  const renderOptionIcon = () => {
    return IconDot3;
  }

  const renderInLine = () => {
    if (isTable) {
      return <tr >
        <td className="position-relative align-middle text-center">
         <input onChange={onSelectItem} checked={props.cardSelected?.includes(props.item[props?.valueName ?? "code"])} className="form-check-input cursor-pointer border-checkbox" type="checkbox" /> 
        </td>
        <td>
          <div className="d-flex ">
            <div className="d-flex">
              <div className="box-image-picture box-image-picture-mr" style={{ width: 51, minWidth: 51 }}> 
                <img
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  if (ImageCardSearch) {
                    currentTarget.src=ImageCardSearch.src;
                  }
                }}
                className="box-image-picture__img w-100" src={props?.item?.url_image  || props?.item?.image_front?.file_name  ||  `${process.env.REACT_APP_IMAGE_URL}/collection/${props?.item?.url_image}` } alt="" title="" />
              </div>
              <div className="box-image-picture" style={{ width: 51, minWidth: 51 }}> 
                <img
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  if (ImageCardSearch) {
                    currentTarget.src=ImageCardSearch.src;
                  }
                }}
                className="box-image-picture__img w-100" src={props?.item?.url_image  ||   props?.item?.image_back?.file_name || `${process.env.REACT_APP_IMAGE_URL}/collection/${props?.item?.url_image}` } alt="" title="" />
              </div>
            </div>
            
            <div className="ps-3 collection-card-table-detail">
              <h1 className="mb-1 fs14 d-flex align-items-center collection-card-title">{props.item?.sport} <i className="dot-margin" /> {props.item?.year} <i className="dot-margin" /> {props.item?.publisher} </h1>
              <div onClick={()=>  gotoCard(props.item?.code)} className="mb-1 collection-card-desc fw-500 cursor-pointer" > {`${props.item.webName}${isEmpty(props.item?.onCardCode) ? '' : ' - #' + props.item.onCardCode}`} </div>
              <div className="d-flex btn-group-auto">
                {Boolean(props.item.auto) && <button className="cursor-default btn btn-au--custom"> AU </button>}
                {Boolean(props.item.memo) && <button className="cursor-default btn btn-mem--custom"> MEM </button>}
              </div>
            </div>
          </div>
        </td>
        <td>
          {props.item.onCardCode}
        </td>
        <td className="text-capitalize">
          {props.item.grade_display_value && <div className={`custom-grade ${props.item.grade_company.name === "ungraded" && props.item.grade_value === 1 ? '' : 'custom-grade-bold'}`} style={{
            backgroundColor: props.item.grade_company.name === "ungraded"  && props.item.grade_value === 1 ? 'transparent' : props.item.grade_company.color_2,
            color: props.item.grade_company.name === "ungraded" && props.item.grade_value === 1 ? "#18213A" : props.item.grade_company.color_1
          }}> {props.item.grade_company.name === "ungraded" && props.item.grade_value === 1 ?  "ungraded" : `${props.item.grade_display_value}`} </div>
          }
        </td>
        {isPortfolioAll && <td>
          <Link href={`/profile/portfolio/${props?.item?.group_ref}/${props?.item?.group_name}`}>
            <a title={props?.item?.group_name} className="text-decoration-none c-blue">
              {props?.item?.group_name}
            </a>
          </Link>
        </td>}
        <td> {!props.item[namePrice] ? "N/A" : formatCurrencyCollection(props.item[namePrice], currency)} </td>
        <td> {!props.item.minPrice ? "N/A" : formatCurrencyCollection(props.item.minPrice, currency)} </td>
        <td> {!props.item.maxPrice ? "N/A" : formatCurrencyCollection(props.item.maxPrice, currency)} </td>
        <td> {!props.item.avgPrice ? "N/A" : formatCurrencyCollection(props.item.avgPrice, currency)} </td>
        <td>
            <div className="dropdown dropdown--top">
              <a href="#" id="navbarDropdownDot" role="button" data-bs-toggle="dropdown" aria-expanded="true"> <img src={renderOptionIcon()} alt="" /> </a>
            <div
              className="dropdown-menu"
              aria-labelledby="navbarDropdownDot"
              data-bs-popper="none"
            >
              <div
                className="dropdown-menu-item  d-flex cursor-pointer "
                onClick={onEdit}
              >
                <div className="dropdown-menu-item__icon"  >
                  <img src={IconEdit.src} alt="" title=""/> 
                </div>
                <div className="dropdown-menu-item__txt"> Edit Card </div>
              </div>
              {
                props.isEditCard &&  props.item.note &&
                <div 
                  onClick={onEditNote}
                  className="dropdown-menu-item  d-flex cursor-pointer"
                >
                  <div className="dropdown-menu-item__icon">
                    <img src={IconEditNode.src} alt="" title="" />
                  </div>
                  <div className="dropdown-menu-item__txt"> Read Note </div>
                </div>              
              }
            </div>
          </div>
        </td>
      </tr>
    }
    return <div style={props.style} className="col-03 col-lg-6 col-md-6 mbr-2" >
      <div onClick={onSelectItem} className={`product__item product__item--list ${props.cardSelected?.includes(props.item[props?.valueName ?? "code"]) ? "selected-content" : ""}`}>
        <div className={`position-relative p-2 ${props.isSelect ? "select-item" : ""}`}>
          {props.isSelect && props.cardSelected?.includes(props.item[props?.valueName ?? "code"]) && <div className="selected active">
            <div className="select-none active"> <img src={IconCheck} alt="" /> </div>
          </div>}
          {props.isSelect && !props.cardSelected?.includes(props.item[props?.valueName ?? "code"]) && <div className="selected active">
            <div className="select-none"> </div>
          </div>}
          <div className={`content-product row ${props.cardSelected?.includes(props.item[props?.valueName ?? "code"]) ? "selected-item" : ""} position-relative`}>
            <div className="col-md-4 col-5 image-product image-product-left">
              <div className="mb-1 position-relative img image-product__img" >
                <img
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    if (ImageCardSearch) {
                      currentTarget.src=ImageCardSearch.src;
                    }
                  }}
                  className="img-product-element" src={props?.item?.url_image ?? `${props?.imageUrl}` } alt="" title="" />
                {props.item.grade_display_value_short && props.item.grade_display_value_short != "Not Specified" && <div className={`grade-card ${props.item.grade_company === "ungraded" ? '' : 'custom-grade-bold'}`}
                  style={{
                    backgroundColor: props.item.grade_company?.color_2,
                    color: props.item.grade_company?.color_1,
                  }}>
                  {renderGrade()}
                </div>}
                {props.isEditCard ? <div onClick={onEdit} className="edit-card">
                  <img src={IconEdit.src} alt="Edit" title="Edit" />
                </div> : <span onClick={onComparison} className="edit-card compare">
                  {renderCompareIcon()}
                </span>}
              </div>
              <div className="d-flex justify-content-center align-items-center px-4">
                {props.isEditCard ? <div onClick={onEditNote} className={`rounded-circle border border-1 p-2 mx-2 ${!props.item.note ? "d-none" : ""}`}>
                  <img src={IconEditNode.src} alt="" />
                </div> : <>
                  <div onClick={onAddCollection} className="cursor-pointer rounded-circle rounded-circle-shadow p-2 mx-2">
                    <img src={`${Boolean(props.item.portfolio) ? IconFolderFull : IconFolder}`} alt="" />
                  </div>
                  <div onClick={onAddWishList} className="cursor-pointer rounded-circle rounded-circle-shadow p-2 mx-2">
                    <img style={{ height: 20 }} src={`${Boolean(props.item.wishlist) ? IconHeartFull : IconHeart}`} alt="" />
                  </div>
                </>}
                { 
                    openMnCardPortfolio && Boolean(props.item?.portfolio) &&
                    <div className="position-absolute menu-portfolio-static-scroll" onMouseEnter={() => { setOnMenu(true) }} onMouseLeave={() => { setOnMenu(false); onLeave();  }}>
                      <ul className="box-menu">
                        <li className="d-flex align-items-center cursor-pointer" onClick={(e) => {onEdit(e)}}> <img src={EditIconBlack} alt="IconDelete" /> <span> Edit card in Portfolio </span> </li>
                        <li className="d-flex align-items-center cursor-pointer" onClick={(e) => {addNewEntriesPortfolio(e)}}> <img src={IconUnion} alt="IconUnion" /> <span> Add New Entry </span> </li>
                      </ul>
                    </div>
                  }
              </div>
            </div>
            <div className="col-7 col-md-8 content-product-detail">
              <div className="sub-title mb-1">{props.item.sport} <i className="dot-margin" />{props.item.year}  <i className="dot-margin" />{props.item.publisher}</div>
              <div className="position-relative card-title--hover">
                <div className="cursor-pointer content-product-detail-name card-title" onClick={(e) => {
                  gotoCard(props.item?.code)
                }} onMouseOver={hiddenScript}>
                  {`${props.item.webName}${isEmpty(props.item?.onCardCode) ? '' : ' - #' + props.item.onCardCode}`}
                </div>
                {
                  isShowTooltip && (
                    <span className="card-title--tooltip">{`${props.item.webName}${isEmpty(props.item?.onCardCode) ? '' : ' - #' + props.item.onCardCode}`}</span>
                  )
                }
              </div>
              {Boolean(props.item.auto) && <button type="button" className="cursor-default btn btn-primary btn-sm me-1 btn-au mb-3"> AU </button>}
              {Boolean(props.item.memo) && <button type="button" className="cursor-default btn btn-secondary btn-sm btn-mem mb-3"> MEM </button>}
              <div  className={`content-product-detail-price ${!Boolean(props.item.auto) && !Boolean(props.item.memo) ? 'content-product-detail-price--mt' : ''}`}
               style={
                { fontSize: 18, fontWeight: "bold" }
                }> {props.item[namePrice] ? formatCurrency(props.item[namePrice]) : renderPrice()} </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  }

  const onLeave = () => {
    setTimeout(() => {
      if (!onIcon && !onMenu) {
        setOpenMnWlist(false);
        setOpenMnCardPortfolio(false)
      }
    },1000)
  }
  const onLeaveIcon = () => {
    setTimeout(() => {
      if (!onMenu && !onIcon) {
        setOpenMnWlist(false);
        setOpenMnCardPortfolio(false)
      }
    },1000)
  }
  useEffect(() => {
    if (!onIcon && !onMenu) {
      onLeave();
    }
  }, [onIcon, onMenu])

  const removeWishlist = (e: any) => {
    e.stopPropagation();
    props.onRemoveWishlist && props.onRemoveWishlist(props.item[props?.valueName ?? "code"])
  }

  const addNewEntry = (e: any) => {
    e.stopPropagation();
    props.onAddNewEntry && props.onAddNewEntry(props.item);
  }
  const getHeightElement = (target: any) => {
    var style = window.getComputedStyle(target, null);
    var height = parseInt(style.getPropertyValue("height"));
    var font_size = parseInt(style.getPropertyValue("font-size"));
    var line_height = parseInt(style.getPropertyValue("line-height"));
    var box_sizing = style.getPropertyValue("box-sizing");
    
    if(isNaN(line_height)) line_height = font_size * 1.2;
  
    if ( box_sizing === 'border-box' ) {
      var padding_top = parseInt(style.getPropertyValue("padding-top"));
      var padding_bottom = parseInt(style.getPropertyValue("padding-bottom"));
      var border_top = parseInt(style.getPropertyValue("border-top-width"));
      var border_bottom = parseInt(style.getPropertyValue("border-bottom-width"));
      height = height - padding_top - padding_bottom - border_top - border_bottom
    }
    var lines = Math.ceil(height / line_height);
    return lines; 
  }
  const checkTooltipOverlow = (target: any) => {
    var style = window.getComputedStyle(target, null);
    var height = parseFloat(style.getPropertyValue("height")) + 2;
    var scrollHeight = target.scrollHeight;
    
    if(scrollHeight > height) {
      return true;
    }
    return false;
  }
  const hiddenScript = (e: any) => {
    setIsShowTooltip(checkTooltipOverlow(e.target))
  }
  return (
    <>
      {isInline ? renderInLine() :
        <div style={props.style} className={`${props.className ?? 'col-5 col-6 col-5 col-xl-3 col-lg-4 col-sm-4 collection-card-base'} ${props.isSelect ? "select-item" : ""}`}>
          <div onClick={onSelectItem} className={`product__item mb-4 ${props.cardSelected?.includes(props.item[props?.valueName ?? "code"]) ? "selected-content" : ""}`}>
            <div className={`position-relative collection-card-base-content ${props.isSelect ? "select-item" : ""}`}>
              {props.isSelect && props.cardSelected?.includes(props.item[props?.valueName ?? "code"]) && <div className="selected">
                <div className="select-none active"> <img src={IconCheck} alt="" title="" /> </div>
              </div>
              }
              {props.isSelect && !props.cardSelected?.includes(props.item[props?.valueName ?? "code"]) && <div className="selected">
                <div className="select-none"> </div>
              </div>}
              <div className={`content-product position-relative  ${props.cardSelected?.includes(props.item[props?.valueName ?? "code"]) ? "selected-item" : ""} `}>
                <div onClick={() => {
                    gotoCard(props.item?.code)
                  }}
                  className="image-product cursor-pointer position-relative box-card-element">
                  <LazyLoadImg imgError={ImageCardSearch.src} url={ props?.item?.image_front?.file_name  ||  props?.item?.image_back?.file_name  || `${props?.imageUrl}` } className="img-product-element"/>
                  {props.item.grade_display_value && props.item.grade_display_value != "Not Specified" && <div className={`grade-card  ${props.item.grade_company === "ungraded" ? '' : 'custom-grade-bold'}`}
                    style={{
                      backgroundColor: props.item.grade_company?.color_2,
                      color: props.item.grade_company?.color_1,
                    }}
                  > {renderGrade()} </div>}
                  { props.isEditCard ? <div onClick={onEdit} className="edit-card">
                    <img src={IconEdit.src} alt="" title="" />
                  </div> : <div onClick={onComparison} className="edit-card compare">
                    {renderCompareIcon()}
                  </div>}
                  {props.isEditCard ? <div onClick={onEditNote} className={`edit-note ${!props.item.note ? "d-none" : ""}`}>
                    <img src={IconEditNode.src} alt="" title="" />
                  </div> : <>
                    <div onClick={onAddCollection} className="collecion-check cursor-pointer">
                      <img src={`${Boolean(props.item.portfolio) ? IconFolderFull : IconFolder}`} alt="" title="" />
                      {Boolean(props.item?.portfolio) &&
                        <div className="position-absolute menu-wishlist">
                          <ul className="box-menu">
                            <li className="d-flex align-items-center" onClick={(e) => {onEdit(e)}}> <img src={EditIconBlack} alt="IconDelete" /> <span> Edit card in Portfolio </span> </li>
                            <li className="d-flex align-items-center" onClick={(e) => {addNewEntriesPortfolio(e)}}> <img src={IconUnion} alt="IconUnion" /> <span> Add New Entry </span> </li>
                          </ul>
                        </div>
                      }
                    </div>
                      <div onClick={onAddWishList} className="edit-note cursor-pointer" onMouseEnter={() => { setOnIcon(true); setOnMenu(true) }} onMouseLeave={() => { setOnIcon(false); onLeaveIcon();  }}>
                      <img src={`${Boolean(props.item.wishlist) ? IconHeartFull : IconHeart}`} alt="" title="" />
                    </div></>
                  }
                  
                  {openMnWlist && isWishlist &&
                    <div className="position-absolute menu-wishlist" onMouseEnter={() => { setOnMenu(true) }} onMouseLeave={() => { setOnMenu(false); onLeave();  }}>
                      <ul className="box-menu">
                        <li className="d-flex align-items-center" onClick={(e) => {removeWishlist(e)}}> <img src={IconDelete} alt="IconDelete" /> <span> Remove from Wishlist </span> </li>
                        <li className="d-flex align-items-center" onClick={(e) => {addNewEntry(e)}}> <img src={IconUnion} alt="IconUnion" /> <span> Add New Entry </span> </li>
                      </ul>
                    </div>
                  }
                </div>
                <div className="sub-title">{props.item.sport} <i className="dot-margin" />{props.item.year}  <i className="dot-margin" />{props.item.publisher}</div>
                <div className="position-relative card-title--hover">
                  <div className="card-title cursor-pointer" onClick={(e) => {
                    gotoCard(props.item?.code)
                  }}
                  onMouseOver={hiddenScript}>
                    {`${props.item.webName}${isEmpty(props.item?.onCardCode) ? '' : ' - #' + props.item.onCardCode}`}
                  </div>
                  {
                    isShowTooltip && (
                      <span className="card-title--tooltip">{`${props.item.webName}${isEmpty(props.item?.onCardCode) ? '' : ' - #' + props.item.onCardCode}`}</span>
                    )
                  }
                </div>
                {Boolean(props.item.auto) && <button type="button" className="cursor-default btn btn-primary btn-sm me-1 btn-au mb-3"> AU </button>}
                {Boolean(props.item.memo) && <button type="button" className="cursor-default btn btn-secondary btn-sm btn-mem mb-3"> MEM </button>}
                <div className="range-price-card"> {props.item[namePrice] ? formatCurrency(props.item[namePrice], currency) : renderPrice()} </div>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default React.memo(CardNode);
