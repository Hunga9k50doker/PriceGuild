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
      <CardDetail />
    </>
  );
}
export const getServerSideProps = async (context: any) => { 
  try {
    
    const ctx = context?.query;
    
    let titlePage = `${ctx.cardName} | PriceGuide.Cards`;
    let descriptionPage = `${ctx.cardName} Card Details`;
    

    return {props:{
     titlePage,
     descriptionPage
    }}

  } catch (error) {
    
  }
  return {
    props: {},
  };
}
export default CardDetailPage;