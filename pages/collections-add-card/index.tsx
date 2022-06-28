import React from "react";
import AddCard from "components/profile/addCard"
import Head from 'next/head';

type PropTypes = {
  location: any,
};

const CollectionAddCard = (props: PropTypes) => {
  return (
    <>
    <Head>
        <title>Add Cards | PriceGuide.Cards</title>
        <meta name="description" content="Add Cards to your portfolio"/>
    </Head>
    <div className="clear-padding-add">
        <AddCard />
    </div>
    </>
  );
};

export default CollectionAddCard;