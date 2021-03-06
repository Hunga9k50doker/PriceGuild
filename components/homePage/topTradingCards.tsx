import React, { FC, useEffect, useState } from "react";
import { TopElementType } from "interfaces";
import { api } from "configs/axios";
import { useSelector } from "react-redux";
import Selectors from "redux/selectors";

import CardSlickElement from "components/card-slick/cardSlickElement";

type PropTypes = {
  cardElement: FC<any>;
  title?: string;
  routerLink?: string;
  sportId?: number;
};

type DataType = {
  isLoading: boolean;
  card: TopElementType[];
};

const TopTradingCards = ({ routerLink = "/top-100", sportId = 1, title = "Top Trading Cards", ...props }: PropTypes) => {
  const [data, setData] = useState<DataType>({
    isLoading: true,
    card: [],
  });
  const { currency } = useSelector(Selectors.config);
  useEffect(() => {
    let checkSport = false;
    if (sportId) {
      checkSport = true;
      getTopTradingCard(365);
    }
    if (!checkSport) {
      getTopTradingCard(365);
    }
  }, [sportId, currency]);

  const getTopTradingCard = async (value: number = 7) => {
    try {
      setData((prevState) => {
        return { ...prevState, isLoading: true };
      });
      const params = {
        timePeriod: value,
        sport: sportId,
        currency: currency,
      };
      const result = await api.v1.getTopTradingCard(params);
      console.log(result.data);
      if (result.success) {
        result.data = result.data.filter((item: TopElementType, key: number) => key < 10);
        return setData({
          isLoading: false,
          card: result.data,
        });
      }
      setData({
        isLoading: false,
        card: [],
      });
    } catch (err) {}
  };

  const onFilter = (value: number) => {
    getTopTradingCard(value);
  };

  return (
    <CardSlickElement
      namePrice="maxSales"
      hasFilter
      defaultChecked={365}
      onFilter={onFilter}
      title={title}
      cards={data.card}
      isLoading={data.isLoading}
      cardElement={props.cardElement}
      routerLink={routerLink}
      routerName={"See All Trading Cards"}
    />
  );
};

export default React.memo(TopTradingCards);
