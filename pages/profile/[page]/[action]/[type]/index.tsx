import React, { useEffect, useRef } from 'react';
import ProfileType from 'components/profile/profileType';
import Head from 'next/head';
import { useRouter } from 'next/router'

const Profile: React.FC = (props) => {
  const router = useRouter();
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
      <ProfileType/>
    </>
  );
}
export const getServerSideProps = async (context: any) => { 
  try {
    
    const ctx = context?.query;
    const pageName = ctx.page === 'wishlists' ? 'Wishlists' : 'Profolio'
    let titlePage = `${ctx.type} - Personal ${pageName} | PriceGuide.Cards`;

    return {
      props: {
        titlePage,
    }}

  } catch (error) {
    
  }
  return {
    props: {},
  };
}
export default Profile;
