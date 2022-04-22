import React, { FC } from "react";
import Slider from "react-slick";
import { useSelector } from "react-redux";
import Selectors from "redux/selectors";
import Skeleton from 'react-loading-skeleton';
import TopImage from "assets/images/topps.png";
import { PopularType } from "interfaces"
import { useRouter } from 'next/router'
// @ts-ignore
import $ from "jquery";
type PropTypes = {

}
const dataLoader = Array.from(Array(6).keys());
function SampleNextArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", fontSize: 20, color: "black" }}
      onClick={onClick}
    >
      <i className="chevron-right"></i>
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
      <i className="chevron-left"></i>
    </div>
  );
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
        slidesToShow: 3,
        slidesToScroll: 3,
        initialSlide: 3
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



const SlickSport: FC<PropTypes> = ({

  ...props }: PropTypes) => {
  const router = useRouter();
  const { sports } = useSelector(Selectors.config);
  const { popularPublishers } = useSelector(Selectors.home);

  const gotoSport = (item: any, sport: any) => {
    router.push(
      `/search?publisher=${sport.publisherID}&publisherName=${item.publisher.name}&sport_criteria=${sport.id}`
    )
  }
  const handleError = (e: any, index:number) => {
    $(`#error-image${index}`).addClass("img-publisher--error");
  }
  const handleTextError = (text: string) => {
     return text.replace(' ','_').replace('-','_').toLowerCase();
  }
  return (
    <div >
      {Boolean(sports?.length) && <Slider {...settings}>
        {popularPublishers.map((item: PopularType, index: number) => <div key={index} className="col">
          <div className="d-flex justify-content-center align-items-center bg-white section-publishers-piture" >
            <img id={`error-image${index}`} className="img-publisher" src={item.publisher.image} alt="hai"  onError={(e) => handleError(e, index)} />
            <span className="text-publisher">
             {handleTextError(item.publisher.name) }
            </span>
          </div>
          <ul className="list-group publishers-item-sport">
            {item.sports?.map((sport, key) =>
              <li key={key} className="list-group-item d-flex justify-content-between align-items-center cursor-pointer" onClick={() => gotoSport(item, sport)}>
                {sport.sportName} <i className="ic-arrow-tiny-blue"></i>
              </li>
            )}
          </ul>
        </div>)}
      </Slider>}
    </div>
  );
}

export default React.memo(SlickSport);
