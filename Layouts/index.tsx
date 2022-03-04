import React, { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import Head from 'next/head';
import Header from './commonLayout/headerLayout';
import Footer from './commonLayout/footerLayout';

type Props = {
  children: JSX.Element
}

const CommonLayout = ({ children }: Props) => {
  
  const router = useRouter();
  const _pathSliceLength = Math.min.apply(Math, [
      router.asPath.indexOf('?') > 0 ? router.asPath.indexOf('?') : router.asPath.length,
      router.asPath.indexOf('#') > 0 ? router.asPath.indexOf('#') : router.asPath.length
  ]);
  const canonicalURL= process.env.DOMAIN + router.asPath.substring(0, _pathSliceLength);

  return (
    <>
      <Head>
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <link rel="canonical" href={canonicalURL} />
      </Head>
      <Header />
      {children}
      <Footer />
    </>
  )
};

export default CommonLayout;
