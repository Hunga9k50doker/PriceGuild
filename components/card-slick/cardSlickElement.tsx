import React, { FC } from "react";
import CardSlick from "components/card-slick"
import { CardItemType, TopElementType } from "interfaces"
import Link from 'next/link'

type PropTypes = {
  cardElement: FC<any>,
  cards?: CardItemType[] | TopElementType[],
  title: string,
  routerLink?: string,
  routerName?: string,
  hasFilter?: boolean,
  cardName?: string,
  isFullPage?: boolean,
  onFilter?: (time: number) => void
  isLoading?: boolean,
  namePrice?: string,
  defaultChecked?: number
}

const CardSlickElement = ({ defaultChecked = 7, namePrice = "ma28", isFullPage = true, ...props }: PropTypes) => {
  return (
    <div className={`${isFullPage ? "content-home" : ""} pt-5 mt-3 pb-5 card-slick-element`}>
      {props.cardName && <div>{props?.cardName}</div>}
      <div className="justify-content-between align-items-center d-flex">
        <h2 className="pb-3 title-content">{props.title}</h2>
        {props.routerLink && <Link  href={props.routerLink}>
          <a className="link-see-all text-decoration-none">{props.routerName}</a>
        </Link>}
      </div>
      {props.hasFilter && <div className="btn-group btn-group-sm filter-date border-light" role="group" aria-label="Basic radio toggle button group">
        <input type="radio" className="btn-check" name="btnradio" id="btnradio1" autoComplete="off" defaultChecked={defaultChecked === 7} />
        <label onClick={() => props.onFilter && props.onFilter(7)} className="btn btn-light" htmlFor="btnradio1">1 week</label>
        <input type="radio" className="btn-check" name="btnradio" id="btnradio2" autoComplete="off" defaultChecked={defaultChecked === 14} />
        <label onClick={() => props.onFilter && props.onFilter(14)} className="btn btn-light" htmlFor="btnradio2">2 weeks</label>
        <input type="radio" className="btn-check" name="btnradio" id="btnradio3" autoComplete="off" defaultChecked={defaultChecked === 30} />
        <label onClick={() => props.onFilter && props.onFilter(30)} className="btn btn-light" htmlFor="btnradio3">1 Month</label>
        <input type="radio" className="btn-check" name="btnradio" id="btnradio4" autoComplete="off" defaultChecked={defaultChecked === 90} />
        <label onClick={() => props.onFilter && props.onFilter(90)} className="btn btn-light" htmlFor="btnradio4">3 Month</label>
        <input type="radio" className="btn-check" name="btnradio" id="btnradio5" autoComplete="off" defaultChecked={defaultChecked === 365} />
        <label onClick={() => props.onFilter && props.onFilter(365)} className="btn btn-light" htmlFor="btnradio5">1 Year</label>
      </div>}
      <div className="mt-2 mb-3 data-card-slicker cs-mar--15 mt-5">
        <CardSlick namePrice={namePrice} isLoading={props.isLoading} cardElement={props.cardElement} cards={props.cards} />
      </div>
      {props.routerLink &&
        <button className="btn btn-primary d-block d-sm-block d-md-none btn-see-all-trading mt-5">See All Trading Cards</button>
      }
    </div>
  );
}

export default React.memo(CardSlickElement);
