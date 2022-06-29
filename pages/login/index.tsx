import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Selectors from 'redux/selectors';
import Head from 'next/head';

import LoginComponent from "components/modal/login/loginComponent"

const LoginPage: React.FC = () => {
  const { is_set_username, is_email_verify } = useSelector(Selectors.config);
  return (
    <>
      <Head>
        <title>Login | PriceGuide.Cards</title>
        <meta name="description" content="Login to your account at PriceGuide.Cards" />
      </Head>
      <div className="container authenticate-page">
        <div className="">
          <div className="mb-5 d-flex align-items-center flex-column ">
            <h1 className="text-center mt-4 p-4 text-title pb-0">Login</h1>
            <LoginComponent />
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
