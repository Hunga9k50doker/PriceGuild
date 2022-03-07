import React from "react";
import SkeletonCard from "components/Skeleton/cardItem"
import Slider from "react-slick";
import IconLeft from "assets/images/arrow_left.svg"
import IconRight from "assets/images/arrow_right.svg"
import Link from 'next/link'

interface PropTypes<T> {
  cardElement: (item: T, index: number) => React.ReactNode;
  cards: Array<T>;
  title: string;
  routerLink?: string;
  routerName?: string;
  hasFilter?: boolean;
  titleBtn?: string;
}

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 6,
  slidesToScroll: 6,
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,
  responsive: [
      {
        breakpoint: 2600,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      }
    ]
};

function SampleNextArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", fontSize: 20, color: "black" }}
      onClick={onClick}
    >
      <i className="fa">
        <img src={IconRight} alt="" />
      </i>
    </div>
  );
}

function SamplePrevArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", fontSize: 20, color: "black" }}
      onClick={onClick}
    >
      <i >
        <img src={IconLeft} alt="" />
      </i>
    </div>
  );
}

const MyCardSlickElement = <T,>(props: PropTypes<T>) => {
  return (
    <div className="content-home mt-3 mb-5 card-slick-element latest-collection">
      <div className="justify-content-between align-items-center d-flex llllllllll">
        <h2 className="pt-3 pb-3 title-content">{props.title}</h2>
        {props.routerLink && <Link href={props.routerLink}>
          <a className="link-see-all text-decoration-none">{props.routerName}
          </a></Link>}
      </div>
      {props.hasFilter && <div className="btn-group btn-group-sm pb-3" role="group" aria-label="Basic radio toggle button group">
        <input type="radio" className="btn-check" name="btnradio" id="btnradio1" autoComplete="off" defaultChecked />
        <label className="btn btn-outline-primary" htmlFor="btnradio1">Last Week</label>
        <input type="radio" className="btn-check" name="btnradio" id="btnradio2" autoComplete="off" />
        <label className="btn btn-outline-primary" htmlFor="btnradio2">Last Month</label>
        <input type="radio" className="btn-check" name="btnradio" id="btnradio3" autoComplete="off" />
        <label className="btn btn-outline-primary" htmlFor="btnradio3">Last 3 Months</label>
      </div>}
      <div className="mt-2 mb-3 data-slicker-collection cs-mar--15">
        <div className="data-slicker-collection-mobile">
          {props.cards.length ? <Slider {...settings}>
            {props.cards.map((item, index) => props.cardElement(item, index))}
          </Slider> : <div className="row">
            <SkeletonCard numberLine={4} />
          </div>}
        </div>
      </div>
      {props.routerLink && <Link href={props.routerLink}>
        <a className="btn btn-primary btn-trading-card only-mobile">
          {props.titleBtn || 'See All Trading Cards'}
        </a>
      </Link>}
    </div>
  );
}

export default MyCardSlickElement;