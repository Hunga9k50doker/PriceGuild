import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import store from "stores";
import DefaultLayout from 'Layouts/index'
// import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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
    firebase.initializeApp(firebaseConfig);
  }, [])


  React.useEffect(() => {
    typeof document !== undefined ? require("bootstrap/dist/js/bootstrap.bundle.min") : null;
  }, []);
  
  // @ts-ignore
  const Layout = Component.Layout || DefaultLayout;

  return (
    <React.StrictMode>
      <Provider store={store}>
         <I18nextProvider i18n={i18next}>
          <Layout>
            <Component {...pageProps} /> 
            <ToastContainer />
            <UsesCookiesPage/>
          </Layout>
        </I18nextProvider>
      </Provider>
    </React.StrictMode>

  );
}
