import React from "react";
import Head from 'next/head';

import AddCard from "components/profile/addCard"

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