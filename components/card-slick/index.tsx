import React, { useState, FC, useEffect } from "react";
import {
  CardItemType,
  TopElementType,
  ManageCollectionType
} from "interfaces"
import Slider from "react-slick";
import SkeletonCard from "components/Skeleton/cardItem"
import { useSelector } from "react-redux";
import Selectors from "redux/selectors";
import { CardModel } from "model/data_sport/card_sport";
import { useRouter } from 'next/router'
import ChosseCollection from "components/modal/chosseCollection";
import SelectGrading from "components/modal/selectGrading";
import LoginModal from "components/modal/login"
import IconLeft from "assets/images/arrow_left.svg"
import IconRight from "assets/images/arrow_right.svg"

type PropTypes = {
  cards?: CardItemType[] | TopElementType[],
  cardElement: FC<any>,
  isLoading?: boolean,
  namePrice?: string,
}

function SampleNextArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", fontSize: 20, color: "black" }}
      onClick={onClick}
    >
     <i className="fa">
        <img src={IconRight} />
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
      <i>
        <img src={IconLeft} />
      </i>
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
const CardSlick: FC<PropTypes> = ({
  namePrice = "ma28",
  isLoading = true,
  ...props }: PropTypes) => {
  const router = useRouter();
  const [cardData, setCardData] = useState<CardModel>()
  const [data, setData] =  useState<CardItemType[] | TopElementType[] | undefined>([] );
  const { loggingIn } = useSelector(Selectors.auth);
  const [isOpenWishList, setIsOpenWishList] = React.useState(false);
  const [isOpenGrade, setIsOpenGrade] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [cardSelected, setCardSelected] = useState<Array<string | number>>([]);
  const [isOpenLogin, setIsOpenLogin] = useState<boolean>(false);
  const [wishList, setWishList] = React.useState<
    ManageCollectionType | undefined
  >();
  const selectWishlist = (item: ManageCollectionType) => {
    setWishList(item);
    setIsOpenWishList(false);
    setIsOpenGrade(true);
  };

  const onAddWishList = (item: CardModel) => {
    setCardData(item)
    if (loggingIn) {
      setIsOpenWishList(true)
    }
    else {
      setIsOpenLogin(true);
    }
  }

  useEffect(() => {
    setData(props?.cards ?? []);
  }, [props?.cards]);
  const selectCollection = (item: ManageCollectionType) => {
    router.push(
      `/collections-add-card?collection=${item.group_ref}&code=${cardSelected.toString()}`
    );
  };

  const onUpdateWishList = (code: string) => {
    // @ts-ignore
    setData(prevState => [...prevState?.map(item=> item.code === code ? ({...item,wishlist: 1}): item ) ]);
  }

  return (
    <div>
      {isLoading === false && Boolean(data?.length) && <Slider {...settings}>
        {data?.map((item, index) => <props.cardElement
          
          imageUrl={item?.image ? `https://img.priceguide.cards/${item.sport==="Non-Sport"?"ns":"sp"}/${item?.image}.jpg`: undefined }
          onAddCollection={() => {
            setCardData(undefined);
            setCardSelected([item.code]);
            if (loggingIn) {
              setIsOpen(true)
            }
            else {
              setIsOpenLogin(true);
            }
          }}
          onAddWishList={() => {
            // @ts-ignore
            onAddWishList(item)
          }}
          namePrice={namePrice}
          className="cs-padd-15"
          item={item}
          key={index}
        />)}
      </Slider>}
      {isLoading === true && <div className="row">
        <SkeletonCard numberLine={4} />
      </div>}
      {!data?.length && isLoading === false && <div>
        No data
      </div>}
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
      {cardData && loggingIn && <SelectGrading
        wishList={wishList}
        cardData={cardData}
        isOpen={isOpenGrade}
        setIsOpen={setIsOpenGrade}
        onSuccess={onUpdateWishList}
      />}
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
    </div>
  );
}

export default React.memo(CardSlick);
