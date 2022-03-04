import React, { useState, useEffect } from "react";
import Collections from "components/collections";
import Head from 'next/head';

const CollectionList = (props:any) => {
  return (
    <>
      <Head>
        <title>{props?.data?.name} Card Collections | PriceGuide.Cards</title>
        <meta name="description" content={`Browse ${props?.data?.name} card collections listed on PriceGuide.Cards`} />
      </Head>
      <Collections/>
    </>
  );
};

export const getServerSideProps = async (context:any) => {
  try {

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
    
    const res = await fetch(`${process.env.REACT_APP_API_URL}/collections/list`, config);
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
