import React, { FC, useEffect, useState } from "react";
import { TopElementType } from "interfaces"
import { api } from 'configs/axios';

import CardSlickElement from "components/card-slick/cardSlickElement"

type PropTypes = {
  cardElement: FC<any>,
}

const LatestCollections = (props: PropTypes) => {
  const [cards, setCards] = useState<TopElementType[]>([])
  useEffect(() => {
    getTopTradingCard()
  }, [])

  const getTopTradingCard = async () => {
    try {
      const params = {
        "sport": 2,
        "a_filter": 0,
        "timePeriod": 90,
        "a_type": "topSale",
        "currency": "USD"
      };
      const result = await api.v1.getTopTradingCard(params);
      if (result.success) {
        result.data = result.data.filter(((item: TopElementType, key: number) => key < 10))
        setCards(result.data)
      }
    }
    catch (err) {
    }
  }

  return (
    <CardSlickElement
      title="Market"
      cards={cards}
      cardElement={props.cardElement}
      routerLink="/market"
      routerName="See All Market Cards"
    />
  );
}

export default React.memo(LatestCollections);
