import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import store from "stores";
import DefaultLayout from 'Layouts/index'
// import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'react-magic-slider-dots/dist/magic-dots.css';
import "scss/style.scss";
import "scss/config.scss";
import "scss/custom.scss";
import "scss/newpage.scss";
import firebase from "firebase"
import '../i18n';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import { AppProps } from 'next/app';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import UsesCookiesPage from "components/usesCookiesPage"
import { UtilsColorGrade } from "model/data_sport/pricing_grid";
import ArrowUp from "assets/images/long-arrow-up.svg";
// @ts-ignore
import $ from "jquery";
import CapchaHandler from "components/capchaHandler";


const firebaseConfig = {
  apiKey: "AIzaSyAEhlnNzWpoOow4sgMYvdrFNxu2dYjB70A",
  authDomain: "sports-card-price-guide.firebaseapp.com",
  databaseURL: "https://sports-card-price-guide.firebaseio.com",
  projectId: "sports-card-price-guide",
  storageBucket: "sports-card-price-guide.appspot.com",
  messagingSenderId: "371099373657",
  appId: "1:371099373657:web:c3db080b26e9c1f9f02148"
};

export default function MyApp({ Component, pageProps }: AppProps) {

  React.useEffect(() => {
    
    typeof document !== undefined ? require("bootstrap/dist/js/bootstrap.bundle.min") : null;
    
    UtilsColorGrade.loadDataColors();
    
    // firebase.initializeApp(firebaseConfig);

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [])

  
  // @ts-ignore
  const Layout = Component.Layout || DefaultLayout;
  
  const gotoTop = () => {
    window.scrollTo(0, 0);
  }
  const handleScroll = () => {
    var scrollTop = $(window).scrollTop();
    if (scrollTop >= 500) {
        $("#back-to-top").addClass("active");
    } else {
      $("#back-to-top").removeClass("active");
    }
  };

  
  return (
    <React.StrictMode>
      <Provider store={store}>
        <I18nextProvider i18n={i18next}>
          <Layout>
            <Component {...pageProps} /> 
            <ToastContainer />
            <UsesCookiesPage />
            <span id="back-to-top" onClick={() => gotoTop()}> <img src={ArrowUp} alt="Back to Top" title="Back to Top" /> </span>
          </Layout>
        </I18nextProvider>
      </Provider>
    </React.StrictMode>

  );
}
