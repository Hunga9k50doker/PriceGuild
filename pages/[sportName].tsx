import React from "react";
import Head from 'next/head';

import Sport from "components/sport";

function SportLandingPage({ ...props }) {

  return (
    <>
      <Head>
        <title>{
          //@ts-ignore
          props?.titlePage ?? ''}</title>
        <meta name="description" content={
          //@ts-ignore
          props?.descriptionPage ?? ''} />
      </Head>
      <Sport />
    </>
  );
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const getServerSideProps = async (context: any) => {
  try {

    // METHOD 1 Check if the sport is a valid sport via API
    // const prms = {
    //   sport: context?.query?.sportName,
    // };

    // const config = {
    //   method: 'POST',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   //@ts-ignore
    //   body: JSON.stringify(prms)
    // }

    // const res = await fetch(`${process.env.REACT_APP_API_LOCAL}/cards/check-sport-exists`, config);
    // const data = await res.json();

    // if (!data.exists) {
    //   return {
    //     // returns the default 404 page with a status code of 404
    //     notFound: true,
    //   };
    // }

    // METHOD 2 Check if the sport is a valid sport via hardcode
    const accepted_sports = ["baseball", "football", "hockey", "basketball",
      "racing", "soccer", "wrestling", "multi-sport",
      "non-sport", "mma", "golf", "tennis", "boxing"];

    if (!accepted_sports.includes(context?.query?.sportName)) {
      return {
        // returns the default 404 page with a status code of 404
        notFound: true,
      };
    }

    // Sport exists, continue. Call API to get a list of publishers for the page title
    const config_popular = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sport_name: context?.query?.sportName })
    }

    const res_popular = await fetch(`${process.env.REACT_APP_API_LOCAL}/publishers/popular`, config_popular);
    const data_popular = await res_popular.json();

    // Build the page title
    const sportName = capitalizeFirstLetter(context?.query?.sportName);
    let titlePage = `Free Online ${sportName} Card Price Guide - ${sportName} Card Values from `;
    let descriptionPage = `${sportName} Price Guide. Find actual prices for your favorite cards. Add cards to your personal online collection and track values over time.`;

    // Loop 3 (max) publishers on to the page title
    interface PopularDict {
      id: number,
      publisherName: string,
      count: number,
      image: string
    }

    let check_more = false;

    data_popular.data.map((item: Array<PopularDict>, key: number) => {
      if (key < 3) {
        // @ts-ignore
        titlePage += item.publisherName + ", "
      }
      if (key > 3) {
        check_more = true;
        return;
      }
    })

    let textEditor = titlePage.slice(0, -2);

    titlePage = `${textEditor} ${check_more ? '& more ' : ''}| PriceGuide.Cards`;

    return {
      props: {
        titlePage,
        descriptionPage
      }
    }

  } catch (error) {
    // console.log('error', error);
  }
  return {
    props: {},
  };
}
export default React.memo(SportLandingPage);
