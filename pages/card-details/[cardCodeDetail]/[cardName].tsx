import React, { useState } from 'react';
import CardDetail from "components/cardDetail"
import Head from 'next/head';

const CardDetailPage: React.FC = ({ ...props}) => {
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
      <CardDetail isGradedCardTitle={true}/>
    </>
  );
}
export const getServerSideProps = async (context: any) => { 
  try {
    
    const ctx = context?.query;

    let prms = {
      card_code: context.query.cardCodeDetail,
      currency: "USD"
    }

    const config = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(prms)
    }
    
    const res = await fetch(`${process.env.REACT_APP_API_URL}/card_details/pg_app_card_detail`, config);

    const data = await res.json();
    let titlePage = `${data?.data?.card_detail?.webName} ${data?.data?.card_detail?.OnCardCode ? '- #' + data?.data?.card_detail?.OnCardCode : ''} | PriceGuide.Cards`;
    let descriptionPage = `${data?.data?.card_detail?.webName} ${data?.data?.card_detail?.OnCardCode ? '- #' + data?.data?.card_detail?.OnCardCode : ''} Card Details`;
    
    return {props:{
     titlePage,
      descriptionPage,
     data
    }}

  } catch (error) {
    
  }
  return {
    props: {},
  };
}
export default CardDetailPage;