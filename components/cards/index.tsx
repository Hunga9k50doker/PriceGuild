
import React, {useEffect, useState} from "react";
import SkeletonCard from "components/Skeleton/cardItem"
import { isEmpty } from "lodash";
import Skeleton from 'react-loading-skeleton';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import CardNoData from "components/cards/cardNoData"
import { useRouter } from 'next/router'

// @ts-ignore
import $ from "jquery"
import { useSelector } from "react-redux";
import Selectors from "redux/selectors";

interface PropTypes<T> {
  cards: Array<T>;
  isLoadMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  cardElement: (item: T, index: number) => React.ReactNode;
  onSelectItem?: (code: any) => void,
  isSelect?: boolean,
  valueName?: string,
  isTable?: boolean
  isInline?: boolean
  isCheckAll?: boolean
  onClear?: () => void,
  onSelectAll?: () => void
  onSortTable?: (value: string) => void,
  sortCards?: any,
  nameSearch?: string,
  isPortfolioAll?: boolean;
}

const Cards = <T,>({ onSelectAll, onClear, isCheckAll, isTable = false, isInline = false, sortCards, onSortTable, nameSearch = "", isPortfolioAll = false,...props }: PropTypes<T>) => {
  const router = useRouter();
  const [isProfile, setIsProfile] = useState<boolean>(false);
  const { dataFilterStore } = useSelector(Selectors.searchFilter);
  useEffect(() => {
    if(router.pathname === "/profile/[page]/[action]/[type]" && (Boolean(router?.query?.page === "wishlists" || router?.query?.page ===  "portfolio")))
      setIsProfile(true)
  }, [])
  const renderSortTable = (name: string, asc: boolean) => {
    if (asc) {
      if (sortCards?.sort_value === name && sortCards?.sort_by !== "asc" && props.cards.length) {
        return "fa fa-caret-down active"
      }
      return "fa fa-caret-down"
    }
    if (sortCards?.sort_value === name && sortCards?.sort_by === "asc" && props.cards.length) {
      return "fa fa-caret-up active"
    }
    return "fa fa-caret-up"
  }
  
  return (
    <div className="row row-list mt-30" >
      {Boolean(isTable) && Boolean(isInline) ? <div id="table-container" className="content-pricing-grid p-0 table-responsive customScroll content-pricing-grid-custom">
        <table className="table table-striped table-hover table-sort">
          <thead>
            <tr>
              <th scope="col" style={{width: "4%"}}>
                <div className="w-100 h-100">
                  <input onChange={() => { isCheckAll ? onClear && onClear() :  onSelectAll && onSelectAll() }} checked={isCheckAll} className="form-check-input form-check-input-head cursor-pointer border-checkbox" type="checkbox" readOnly />
                </div>
              </th>
              <th scope="col" className={`width-20 ${isPortfolioAll}`} style={{width: "30%"}}>
                <div className="d-flex cursor-pointer"> Card </div>
              </th>
              <th scope="col" style={{width: "13%"}}>
                <div className="d-flex cursor-pointer align-items-center" onClick={() => onSortTable && onSortTable("onCardCode")}> Card No.
                  <div className="ms-1 sort-table d-flex flex-column-reverse">
                    <i className={`sort-asc ${renderSortTable("onCardCode", true)}`} aria-hidden="true"></i>
                    <i className={`sort-desc ${renderSortTable("onCardCode", false)}`} aria-hidden="true"></i>
                  </div>
                </div>
              </th>
              <th scope="col" style={{width: "10%"}}>
                <div className="d-flex cursor-pointer"> Grade </div>
              </th>
              {isPortfolioAll && <th scope="col" style={{width: "10%"}}>
                <div className="d-flex cursor-pointer"> Portfolio </div>
              </th>}
              <th scope="col" style={{width: "10%"}}>
                <div onClick={() => onSortTable && onSortTable("latest_price")} className="d-flex cursor-pointer align-items-center"> Latest
                  <OverlayTrigger overlay={<Tooltip>Latest prices are calculated from the 28 day moving average</Tooltip>}>
                    {({ ref, ...triggerHandler }) => (
                      <span className="cursor-pointer th-question" ref={ref} {...triggerHandler}>
                        <svg  width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.28515 12.8214V10.8928C9.28515 10.7991 9.25502 10.7221 9.19475 10.6618C9.13448 10.6016 9.05747 10.5714 8.96372 10.5714H7.03515C6.9414 10.5714 6.86439 10.6016 6.80413 10.6618C6.74386 10.7221 6.71373 10.7991 6.71373 10.8928V12.8214C6.71373 12.9152 6.74386 12.9922 6.80413 13.0524C6.86439 13.1127 6.9414 13.1428 7.03515 13.1428H8.96372C9.05747 13.1428 9.13448 13.1127 9.19475 13.0524C9.25502 12.9922 9.28515 12.9152 9.28515 12.8214ZM11.8566 6.07142C11.8566 5.48213 11.6708 4.93637 11.2991 4.43414C10.9275 3.93191 10.4637 3.54352 9.90792 3.26896C9.35212 2.99441 8.78292 2.85713 8.20033 2.85713C6.5731 2.85713 5.33091 3.5703 4.47377 4.99664C4.37332 5.15736 4.40011 5.29798 4.55413 5.41852L5.88002 6.42298C5.9269 6.46316 5.99051 6.48325 6.07087 6.48325C6.17801 6.48325 6.26172 6.44307 6.32198 6.36271C6.67689 5.90736 6.96484 5.59932 7.18582 5.43861C7.4135 5.27789 7.70145 5.19754 8.04966 5.19754C8.37109 5.19754 8.65736 5.28459 8.90848 5.4587C9.15959 5.6328 9.28515 5.83035 9.28515 6.05133C9.28515 6.30579 9.21819 6.51004 9.08426 6.66405C8.95033 6.81807 8.72265 6.96874 8.40122 7.11606C7.97935 7.30356 7.59263 7.59318 7.24107 7.98492C6.88951 8.37666 6.71373 8.79687 6.71373 9.24553V9.60713C6.71373 9.70088 6.74386 9.77789 6.80413 9.83816C6.86439 9.89843 6.9414 9.92856 7.03515 9.92856H8.96372C9.05747 9.92856 9.13448 9.89843 9.19475 9.83816C9.25502 9.77789 9.28515 9.70088 9.28515 9.60713C9.28515 9.4799 9.35714 9.31416 9.50111 9.10992C9.64509 8.90568 9.82756 8.73995 10.0485 8.61271C10.2628 8.49218 10.4269 8.39675 10.5407 8.32644C10.6546 8.25613 10.8086 8.13894 11.0028 7.97488C11.197 7.81082 11.346 7.6501 11.4498 7.49274C11.5536 7.33537 11.6473 7.1328 11.731 6.88504C11.8147 6.63727 11.8566 6.36606 11.8566 6.07142ZM15.7137 7.99999C15.7137 9.39954 15.3689 10.6903 14.6791 11.8722C13.9894 13.0541 13.0536 13.9899 11.8716 14.6797C10.6897 15.3694 9.39899 15.7143 7.99944 15.7143C6.59989 15.7143 5.30915 15.3694 4.12723 14.6797C2.94531 13.9899 2.00949 13.0541 1.31975 11.8722C0.630022 10.6903 0.285156 9.39954 0.285156 7.99999C0.285156 6.60044 0.630022 5.3097 1.31975 4.12778C2.00949 2.94586 2.94531 2.01004 4.12723 1.3203C5.30915 0.630572 6.59989 0.285706 7.99944 0.285706C9.39899 0.285706 10.6897 0.630572 11.8716 1.3203C13.0536 2.01004 13.9894 2.94586 14.6791 4.12778C15.3689 5.3097 15.7137 6.60044 15.7137 7.99999Z" fill="#18213A"/>
                        </svg>
                      </span>
                    )}
                  </OverlayTrigger>
                  <div className="ms-1 sort-table d-flex cursor-pointer align-items-center flex-column-reverse">
                    <i className={`sort-asc ${renderSortTable("latest_price", true)}`} aria-hidden="true"></i>
                    <i className={`sort-desc ${renderSortTable("latest_price", false)}`} aria-hidden="true"></i>
                  </div>
                </div>
              </th>
              <th scope="col" style={{width: "10%"}}>
                <div onClick={() =>onSortTable &&  onSortTable("minPrice")} className="d-flex cursor-pointer align-items-center"> Min
                  <div className="ms-1 sort-table d-flex flex-column-reverse">
                    <i className={`sort-asc ${renderSortTable("minPrice", true)}`} aria-hidden="true"></i>
                    <i className={`sort-desc ${renderSortTable("minPrice", false)}`} aria-hidden="true"></i>
                  </div>
                </div>
              </th>
              <th scope="col" style={{width: "10%"}}>
                <div onClick={() => onSortTable && onSortTable("maxPrice")} className="d-flex cursor-pointer align-items-center"> Max
                  <div className="ms-1 sort-table d-flex flex-column-reverse">
                    <i className={`sort-asc ${renderSortTable("maxPrice", true)}`} aria-hidden="true"></i>
                    <i className={`sort-desc ${renderSortTable("maxPrice", false)}`} aria-hidden="true"></i>
                  </div>
                </div>
              </th>
              <th scope="col" style={{width: "10%"}}>
                <div onClick={() => onSortTable && onSortTable("average_price")} className="d-flex cursor-pointer align-items-center "> Average
                  <div className="ms-1 sort-table d-flex flex-column-reverse">
                    <i className={`sort-asc ${renderSortTable("average_price", true)}`} aria-hidden="true"></i>
                    <i className={`sort-desc ${renderSortTable("average_price", false)}`} aria-hidden="true"></i>
                  </div>
                </div>
              </th>
              <th scope="col" style={{width: "9%"}}> </th>
            </tr>
          </thead>
          <tbody>
            {props.cards?.map((e, index) => props.cardElement(e, index))}
            {props.isLoading && Array.from(Array(28).keys()).map((e, index) => <tr key={index} >
             <td className="position-relative align-middle"> <Skeleton height={30} /> </td>
             <td> <Skeleton height={30} /> </td>
             <td className="text-capitalize"> <Skeleton height={30} /> </td>
             <td> <Skeleton height={30} /> </td>
             {isPortfolioAll && <td> <Skeleton height={30} /> </td>}
             <td> <Skeleton height={30} /> </td>
             <td> <Skeleton height={30} /> </td>
             <td> <Skeleton height={30} /> </td>
             <td> <Skeleton height={30} /> </td>
             <td> <Skeleton height={30} /> </td>
           </tr>
            )}
          </tbody>
        </table>
      </div> :
        props.cards?.map((e, index) => props.cardElement(e, index))
      }
      { !(Boolean(isTable) && Boolean(isInline)) && props.isLoading && <SkeletonCard isInline={isInline} numberLine={28} />}
      <div className="col-lg-12 text-left">
        {!props.cards.length && !props.isLoading &&  
          <>
            {
              isProfile && nameSearch === "" && props.cards.length === 0 && isEmpty(dataFilterStore) ? <CardNoData title={router?.query?.page === "wishlists"? "wishlist " : "portfolio"}/> :
              <div className="no-results">No results found</div>
            }
          </>
        } 
      </div>
      <div className="col-lg-12 text-center">
        <div className="pagination__option">
          {props.isLoadMore && (<button onClick={props.onLoadMore} className="btn  btn-load-more" type="button" disabled={props.isLoading}>
            {props.isLoading ? <><span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
              Loading... </> : "Load More"}
          </button>)}
        </div>
      </div>
    </div>
  );
}

export default Cards;
