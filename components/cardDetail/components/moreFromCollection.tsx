import React, { FC, useEffect, useState } from "react";
import MyCardSlickElement from "components/card-slick/card_slick/MyCardSlickElement";
import { CollectionApi } from "api/collection";
import { CardModel } from "model/data_sport/card_sport";
import CardElement from "components/cards/cardNode"
import { FilterType, SelectDefultType, FilyerCollection, ManageCollectionType } from "interfaces"
import { useDispatch, useSelector } from "react-redux";
import Selectors from "redux/selectors";
import ChosseCollection from "components/modal/chosseCollection";
import SelectGrading from "components/modal/selectGrading";
import { useRouter } from 'next/router'
import LoginModal from "components/modal/login"

type PropTypes = {
  // cardElement: FC<any>,
  cardData: CardModel,
  // onAddWishList:  (status: boolean, item: any) => void,
  // onAddCollection: (status: boolean, item: any) => void
}

const MoreFromCollection = (props: PropTypes) => {
  const router = useRouter();
  const [cardSelected, setCardSelected] = useState<Array<string | number>>([]);
  const { loggingIn } = useSelector(Selectors.auth);
  const [cardData, setCardData] = useState<CardModel | undefined>()
  const [isOpenGrade, setIsOpenGrade] = React.useState(false);
  const [collections, setCollection] = useState<CardModel[]>([])
  const [isOpenLogin, setIsOpenLogin] = useState<boolean>(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [wishList, setWishList] = React.useState<
  ManageCollectionType | undefined
    >();
    const [isOpenWishList, setIsOpenWishList] = React.useState(false);
  useEffect(() => {
    if (+props.cardData.id !== 0) {
      getTopTradingCard()
    }
  }, [props.cardData.id])

  const getTopTradingCard = async () => {
    try {
      const params = {
        "currency": "USD",
        "setID":  props.cardData.set.id,
        "cardCode": props?.cardData.code,
        "limit": 10
      };
      const result =  await CollectionApi.getMoreCollection(params);
      if (result.success) {
        setCollection(result.data.map((item: any) => new CardModel(item)) ?? []);
      }
    }
    catch (err) {
    }
  }

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

  const selectCollection = (item: ManageCollectionType) => {
    router.push(
      `/collections-add-card?collection=${item.group_ref}&code=${cardSelected.toString()}`
    );
  };
  
  const onUpdateWishList = (code: string) => {
    // @ts-ignore
    setCollection([...collections]?.map(item=> item.code === code ? ({...item, wishlist: 1}) : item ));
  }
  
  return (<>
 
    <MyCardSlickElement<CardModel>
      title="More from Collection"
      cards={collections}
      cardElement={
        (item: CardModel) => {
          return (
            <CardElement
              // @ts-ignore
            imageUrl={(item?.imgArr?.length && item?.imgArr[0] !== null) ? `https://img.priceguide.cards/${item.sport==="Non-Sport"?"ns":"sp"}/${item?.imgArr[0]}.jpg`: undefined }
            onAddWishList={() => onAddWishList(item)}
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
              style={{ width: '100%' }} className='col-lg-2 col-md-2 p-2' key={item.id} item={item} />
          );
        }
      }
      routerLink={props?.cardData?.set.url ? `/${props?.cardData?.set.url}` : ""}
      routerName={`See All Cards from Collection`}
      titleBtn={"See All Cards from Collection"}
    />

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
      {
        cardData && loggingIn && <SelectGrading
          wishList={wishList}
          cardData={cardData}
          isOpen={isOpenGrade}
          onSuccess={onUpdateWishList}
          setIsOpen={setIsOpenGrade}
        />
      }
    </>
  );
}

export default React.memo(MoreFromCollection);
