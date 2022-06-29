import React, { useState, useEffect } from "react";
import Head from 'next/head';

import Collections from "components/collections";

const CollectionList = (props: any) => {
  return (
    <>
      <Head>
        <title>{props?.data?.name} Card Collections | PriceGuide.Cards</title>
        <meta name="description" content={`Browse ${props?.data?.name} card collections listed on PriceGuide.Cards`} />
      </Head>
      <Collections />
    </>
  );
};

export const getServerSideProps = async (context: any) => {
  try {

    // Check if the sport is a valid sport via hardcode
    const accepted_sports = ["baseball", "football", "hockey", "basketball", 
                             "racing", "soccer", "wrestling", "multi-sport", 
                             "non-sport", "mma", "golf", "tennis", "boxing"];

    if (!accepted_sports.includes(context.query.sport)) {
      return {
        // returns the default 404 page with a status code of 404
        notFound: true,
      };
    }

    // Get the Collection List
    let parCollections = {
      is_newest: true,
      limit: 1,
      page: 1,
      sport_name: context.query.sport
    }

    const config = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parCollections)
    }

    const res = await fetch(`${process.env.REACT_APP_API_LOCAL}/collections/list`, config);
    const data = await res.json();
    return {
      props: {
        data: data?.data
      },
    };
  } catch (e) {
    console.error(e);
  }
  return {
    props: {},
  };
};

export default CollectionList;
