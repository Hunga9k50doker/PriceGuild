import React, { useEffect, useRef } from 'react';
import ProfileType from 'components/profile/profileType';
import Head from 'next/head';
import { useRouter } from 'next/router'
import { cloneDeep } from 'lodash';

const Profile: React.FC = (props) => {
  const router = useRouter();
  //@ts-ignore
  const titlePage: string = cloneDeep(props?.titlePage);
  
  return (
    <>
     <Head>
        <title>{
          //@ts-ignore
            `${titlePage.replace(/-/g,'/')}${props?.subTitle}` ?? ''}</title>
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
    let titlePage = ctx.type;
    let subTitle = `- Personal ${pageName} | PriceGuide.Cards`;
    return {
      props: {
        titlePage,
        subTitle
    }}

  } catch (error) {
    
  }
  return {
    props: {},
  };
}
export default Profile;
