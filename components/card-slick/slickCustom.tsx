import React, { FC, useState, useEffect } from "react";
import { CardItemType, TopElementType } from "interfaces";
import Slider from "react-slick";
import SkeletonCard from "components/Skeleton/cardItem";
import useWindowDimensions from "utils/useWindowDimensions";
import upper_deck from "assets/images/upper_deck.png";
import Link from "next/link";
import { useRouter } from "next/router";
import IconLeft from "assets/images/arrow_left.svg";
import IconRight from "assets/images/arrow_right.svg";
// @ts-ignore
import MagicSliderDots from 'react-magic-slider-dots';

type PropTypes = {
  data?: any[]
  // cardElement: FC<any>,
  isLoading?: boolean,
  id?: number,
}

type ParamTypes = {
  id: string
}

function SampleNextArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", fontSize: 20, color: "black" }}
      onClick={onClick}
    > <i className="fa"> <img src={IconRight} alt="" /></i> </div>
  );
}

function SamplePrevArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", fontSize: 20, color: "black" }}
      onClick={onClick}
    > <i> <img src={IconLeft} alt="" /></i> </div>
  );
}

const CardSlick: FC<PropTypes> = ({
  isLoading = true,
  data = [],
  ...props }: PropTypes) => {

  const { width } = useWindowDimensions();
  const [dataState, setDataState] = useState<any[]>([])
  const router = useRouter();
  // const { id } = useParams<ParamTypes>();
  const settings = {
    className: "left",
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: data.length > 5 ? 6 : 2,
    slidesToScroll: data.length > 5 ? 6 : data.length,
    rows: data.length > 12 ? 2 : 1 ,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
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
    ],
    appendDots: (dots:boolean) => {
      return <MagicSliderDots dots={dots} numDotsToShow={7} dotWidth={30} />;
    }
  };

  React.useEffect(() => {
    if (data.length) {
      setDataState(data)
    }
  }, [data]);

  const gotoSport = (item: any) => {
    router.push(
      `/search?publisher=${item.id}&publisherName=${item.publisherName}&sport_criteria=${props.id}`
    )
  }
  
  return (
    <div className="slick-custom">
      {
        //@ts-ignore
        width >= 768 && <>
        {data.length > 12 && <>
          {Boolean(dataState?.length) ? <Slider {...settings}>
            {data?.map((item: any, key) => 
              <Link href={`/search?publisher=${item.id}&publisherName=${item.publisherName}&sport_criteria=${props.id}`} key={key}>
                <div className="card-publisher cursor-pointer">
                  <img src={item.image} alt={`${item.publisherName}_${key}`} />
                </div>
              </Link>
            )}
            </Slider> : <div className="row"> <SkeletonCard numberLine={4} /> </div>}
        </>}
        {data.length > 6 && data.length <= 12 && <>
          {Boolean(dataState?.length) ? <Slider {...settings}>
            {data?.map((item: any, key) =>
              <Link href={`/search?publisher=${item.id}&publisherName=${item.publisherName}&sport_criteria=${props.id}`} key={key}>
                <div className="card-publisher cursor-pointer">
                  <img src={item.image} alt={`${item.publisherName}_${key}`} />
                </div>
              </Link>
            )}
          </Slider> : <div className="row"> <SkeletonCard numberLine={4} /> </div>}
        </>}
        {data.length <= 6 && <>
          <div className="row"> {data?.map((item: any, key) =>
            <div className="col-6 col-md-2 col-lg-2" key={key}>
              <Link href={`/search?publisher=${item.id}&publisherName=${item.publisherName}&sport_criteria=${props.id}`} key={key}>
                <div className="card-publisher cursor-pointer">
                  <img src={item.image} alt={`${item.publisherName}_${key}`} />
                </div>
              </Link>
            </div> )}
          </div>
        </>
        }        
      </>}
      {
        //@ts-ignore
        width < 768 && <>
        {data.length > 12 && <>
          {Boolean(dataState?.length) ? <Slider {...settings}>
            {data?.map((item: any, key) => 
              <Link href={`/search?publisher=${item.id}&publisherName=${item.publisherName}&sport_criteria=${props.id}`} key={key}>
                <div className="card-publisher">
                  <img src={item.image} alt={`${item.publisherName}_${key}`} />
                </div>
              </Link>
            )}
          </Slider> : <div className="row"> <SkeletonCard numberLine={4} /> </div>}
        </>}
        {data.length > 6 && data.length <= 12 && <>
          {Boolean(dataState?.length) ? <Slider
            {...settings}
          >
            {data?.map((item: any, key) =>
              <Link href={`/search?publisher=${item.id}&publisherName=${item.publisherName}&sport_criteria=${props.id}`} key={key}>
                <div className="card-publisher">
                  <img src={item.image} alt={`${item.publisherName}_${key}`} />
                </div>
              </Link>
            )}
          </Slider> : <div className="row"> <SkeletonCard numberLine={4} /> </div>}
        </>}
        {data.length <= 6 && <>
          <div className="row">
            {data?.map((item: any, key) =>
              <div className="col-6 col-md-2 col-lg-2" key={key}>
                <Link href={`/search?publisher=${item.id}&publisherName=${item.publisherName}&sport_criteria=${props.id}`} key={key}>
                  <div className="card-publisher">
                    <img src={item.image} alt={`${item.publisherName}_${key}`}/>
                  </div>
                  </Link>
              </div>
            )}
          </div>
        </>}        
      </>}
    </div>
  );
}

export default React.memo(CardSlick);
