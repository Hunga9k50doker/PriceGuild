import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from './commonLayout/headerLayout';
import Footer from './commonLayout/footerLayout';


type Props = {
  children: JSX.Element
}

const CommonLayout = ({ children }: Props) => {

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />

      </Head>
      <Header />
      {children}
      <Footer />
    </>
  )
};

export default CommonLayout;
