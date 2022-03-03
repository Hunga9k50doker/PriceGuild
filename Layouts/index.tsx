import React, { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import Head from 'next/head';
import Header from './commonLayout/headerLayout';
import Footer from './commonLayout/footerLayout';

type Props = {
  children: JSX.Element
}

const CommonLayout = ({ children }: Props) => {
  const canonicalURL = process.env.DOMAIN + useRouter().pathname;

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
