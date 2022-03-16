import React, { FC } from "react";
import Slider from "react-slick";
import { useSelector } from "react-redux";
import Selectors from "redux/selectors";
import { useRouter } from 'next/router'
import Skeleton from 'react-loading-skeleton'
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
      <i className="fa fa-chevron-right"></i>
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
      <i className="fa fa-chevron-left"></i>
    </div>
  );
}

const settings = {
  dots: true,
  infinite: true,
  lazyLoad: true,
  speed: 500,
  slidesToShow: 6,
  slidesToScroll: 6,
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,
  responsive: [
    {
      breakpoint: 1198,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 5,
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
  return (
    <div className="slick-sport">
      {Boolean(sports?.length) && <Slider {...settings}>
        {sports?.map((item, index) =>
          <div 
            className="card-slick-sport">
            <div onClick={() => router.push(`/search?sport_criteria=${item.id}`)}
              key={index}
              className="content-slick p-2 cursor-pointer">
              <div className="image-sport d-flex justify-content-center align-items-center">
                <img src={item.icon} alt={item.sportName} />
              </div>
              <div className="text-center"> {item.sportName}</div>
            </div>
          </div>
        )}
      </Slider>}
      {!sports.length && <Slider {...settings}>
        {dataLoader?.map((item, index) =>
          <div
            className="card-slick-sport">
            <div key={index} className="content-slick col-lg-2 col-md-2 p-2">
              <div className="image-sport d-flex justify-content-center align-items-center">
                <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_11_4467)">
                    <path d="M37.9121 29.8281C33.454 29.8281 29.827 33.4551 29.827 37.9132C29.827 42.3714 33.454 45.9983 37.9121 45.9983C42.3702 45.9983 45.9972 42.3714 45.9972 37.9132C45.9972 33.4551 42.3702 29.8281 37.9121 29.8281ZM37.9121 43.3033C34.94 43.3033 32.5221 40.8853 32.5221 37.9132C32.5221 34.9411 34.94 32.5232 37.9121 32.5232C40.8842 32.5232 43.3022 34.9411 43.3022 37.9132C43.3022 40.8853 40.8842 43.3033 37.9121 43.3033Z" fill="url(#paint0_linear_11_4467)" />
                    <path d="M34.5017 1.97023C34.4749 1.997 34.4493 2.02476 34.4249 2.05368L6.5926 35.0122C5.0064 33.7195 2.66001 33.8119 1.1825 35.2895C-0.393102 36.8651 -0.393281 39.4308 1.1825 41.0065L4.99382 44.8179C6.56988 46.3941 9.13465 46.3942 10.7108 44.8179C12.1884 43.3403 12.2808 40.994 10.988 39.4077C10.988 39.4077 44.0033 11.5254 44.03 11.4987C46.6548 8.87391 46.6548 4.59501 44.03 1.97032C41.403 -0.656802 37.1285 -0.656712 34.5017 1.97023ZM17.2435 26.5767L19.4236 28.7568L9.09171 37.4817L8.51857 36.9085L17.2435 26.5767ZM8.80514 42.9122C8.28383 43.4335 7.42285 43.4356 6.89948 42.9122L3.08816 39.1008C2.56676 38.5794 2.56488 37.7184 3.08816 37.1951C3.60947 36.6738 4.47054 36.6717 4.99382 37.1951L8.80514 41.0064C9.32752 41.5288 9.32743 42.3899 8.80514 42.9122ZM42.1615 9.5554L21.4899 27.0118L18.9885 24.5104L36.4449 3.83887C38.024 2.29974 40.5605 2.31205 42.1245 3.87588C43.6834 5.43496 43.6957 7.98096 42.1615 9.5554Z" fill="url(#paint1_linear_11_4467)" />
                  </g>
                  <defs>
                    <linearGradient id="paint0_linear_11_4467" x1="44.4424" y1="45.9983" x2="25.4735" y2="18.6334" gradientUnits="userSpaceOnUse">
                      {/* <stop stop-color="#124DE3" />
                      <stop offset="1" stop-color="#6EF6FE" /> */}
                    </linearGradient>
                    <linearGradient id="paint1_linear_11_4467" x1="41.5757" y1="46.0001" x2="-12.3868" y2="-31.8438" gradientUnits="userSpaceOnUse">
                      {/* <stop stop-color="#124DE3" />
                      <stop offset="1" stop-color="#6EF6FE" /> */}
                    </linearGradient>
                    <clipPath id="clip0_11_4467">
                      {/* <rect width="46" height="46" fill="white" /> */}
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <div className="text-center"><Skeleton /> </div>
            </div>
          </div>
        )}
      </Slider>}
    </div>
  );
}

export default React.memo(SlickSport);
