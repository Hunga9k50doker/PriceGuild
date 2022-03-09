import React, { useState, useEffect } from "react";
import Head from 'next/head';
import { api } from 'configs/axios';
import Sport from "components/sport";

function SportLandingPage({...props}) {
  
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
      <Sport/>
     </>
  );
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const getServerSideProps = async (context: any) => { 
  try {
      const params = {
        sport_name: context?.query?.sportName
      }
    const result = await api.v1.getPopularPublisher(params);
    const sportName = capitalizeFirstLetter(context?.query?.sportName);
    
    let titlePage = `Free Online ${sportName} Card Price Guide - ${sportName} Card Values from `;
    let descriptionPage = `${sportName} Price Guide. Find actual prices for your favorite cards. Add cards to your personal online collection and track values over time.`;
    
    let check_more = false;
    if (result.success) {
      result.data.map((item, key) => {
        if (key < 3) {
          //@ts-ignore
          titlePage += item.publisherName + ", "
        } 
        if (key > 3) {
          check_more = true;
          return;
        }
        
      })
    }
    let textEditor = titlePage.slice(0, -2);

    titlePage = `${textEditor} ${check_more ? '& more' : ''}| PriceGuide.Cards`;

    return {props:{
     titlePage,
      descriptionPage,
     result
    }}

  } catch (error) {
    
  }
  return {
    props: {},
  };
}
export default React.memo(SportLandingPage);
