import React from 'react';
import logo from "assets/images/logo-footer.png";
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useSelector } from 'react-redux';
import Selectors from 'redux/selectors';
import facebookIcon from "assets/images/facebook.svg";
import twitterIcon from "assets/images/twitter.svg";

function Footer() {
  const router = useRouter();
  const { loggingIn } = useSelector(Selectors.auth);
  const { sports } = useSelector(Selectors.config);
  const pathname = router.pathname.split("/")

  if (pathname[1] === "collections-add-card") {
    return null
  }

  const openInNewTab = (url: string) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }
  const year = new Date().getFullYear();

  return (
    <div className="footer-content container-fluid pt-5">
      <div className="container-footer">
        <div className="row mb-4">
          <div className="col-md-4 col-sm-11 col-xs-11 menu-logo">
            <div className="footer-text pull-left">
              <div className="d-flex">
                <img src={logo.src} alt="PriceGuide" />
              </div>
            </div>
          </div>
          <div className="col-md-2 col-sm-4 col-xs-4 menu-item-footer">
            <p className="heading">
              <Link href="/">
                <a className="text-reset text-decoration-none" title="Home"> Home </a>
              </Link>
            </p>
            <ul className="list-unstyled">
              <li>
                <Link href="/search">
                  <a className="text-reset text-decoration-none" title="Search"> Search </a>
                </Link>
              </li>
              <li>
                <Link href="/top-100">
                  <a className="text-reset text-decoration-none" title="Top 100"> Top 100 </a>
                </Link>
              </li>
              <li>
                <Link href="/leaderboard">
                  <a className="text-reset text-decoration-none" title="Leaderboard"> Leaderboard </a>
                </Link>
              </li>
              {!loggingIn && <div className='has-auth'>
                <li className='no-padding'>
                  <Link href="/login">
                    <a className="text-reset text-decoration-none" title="Login"> Login </a>
                  </Link>
                </li>
                <li className='no-padding'>
                  <Link href="/register">
                    <a className="text-reset text-decoration-none" title="Create Account"> Create Account </a>
                  </Link>
                </li>
              </div>}
            </ul>
          </div>
          <div className="col-md-2 col-sm-4 col-xs-4 menu-item-footer mobile-flex-menu">
            <p className="heading gray-color"> Collections </p>
            <ul className="list-unstyled">
              {
                sports?.map((item, index) => <li key={index}>
                  <Link href={`/collections/${item.sportName.replace(/\s/g, '').toLowerCase()}`}>
                    <a className="text-reset text-decoration-none" title={item?.sportName}> {item?.sportName} </a>
                  </Link>
                </li>)
              }
            </ul>
          </div>
          <div className="col-md-2 col-sm-4 col-xs-4 menu-item-footer mobile-flex-menu">
            <p className="heading gray-color">Sports</p>
            <ul className="list-unstyled">
              {
                sports?.map((item, key) => <li key={key} >
                  <Link href={`/${item.sportName.replace(/\s/g, '').toLowerCase()}`}>
                    <a className="text-reset text-decoration-none" title={item?.sportName}> {item?.sportName} </a>
                  </Link>
                </li>)
              }
            </ul>
          </div>
          <div className="col-md-2 col-sm-4 col-xs-4 menu-item-footer">
            <ul className="list-unstyled">
              {/*<li>
                <Link href={`/blog`}>
                  <a className="text-reset text-decoration-none" title="Blog"> Blog </a>
                </Link>
              </li>*/}
              <li>
                <Link href={`/faq`}>
                  <a className="text-reset text-decoration-none" title="FAQ"> FAQ </a>
                </Link>
              </li>
              <li>
                <Link href={`/about`}>
                  <a className="text-reset text-decoration-none" title="About"> About </a>
                </Link>
              </li>
              <li>
                <Link href={`/contact`}>
                  <a className="text-reset text-decoration-none" title="Contact"> Contact </a>
                </Link>
              </li>
              <div className='has-auth'>
                {/* <li>API Documentation</li> */}
                {/* <li>Feedback</li> */}
              </div>
              <div className='has-auth'>
                {/* <li>Links</li> */}
                <li>
                  <Link href={`/sitemap.xml`}>
                    <a target="_blank" className="text-reset text-decoration-none" title="Sitemap"> Sitemap </a>
                  </Link>
                </li>
                <li>
                  <Link href={`/terms-of-use`}>
                    <a className="text-reset text-decoration-none" title="Terms of Use"> Terms of Use </a>
                  </Link></li>
                <li>
                  <Link href={`/privacy-policy`}>
                    <a className="text-reset text-decoration-none" title="Privacy Policy"> Privacy Policy </a>
                  </Link>
                </li>
              </div>
            </ul>
          </div>
        </div>
        <div className="divider mb-4"> </div>
        <div className="row socials-section" style={{ fontSize: '14px', borderTop: '1px', borderColor: 'rgba(255, 255, 255, 0.2)', borderTopStyle: 'solid' }} >
          <div className="col-md-6 col-sm-6 col-xs-6 socials-text">
            <div className="pull-left">
              <p className="mt-3 color-gray">&copy; { year }  Price Guide Limited. All Rights Reserved. </p>
            </div>
          </div>
          <div className="col-md-6 col-sm-6 col-xs-6 socials-icon">
            <div className="d-flex policy mr-4 justify-content-end">
              <div className="social mt-3 mb-3">
                <Link href={{ pathname: "https://www.facebook.com/PriceGuideCards" }}>
                  <a target={"_blank"} style={{color: "transparent"}} title="Facebook"> <img className="pr-3" src={facebookIcon} alt="Facebook" title="Facebook" /> </a> 
                </Link>
                <Link href={{ pathname: "https://twitter.com/PriceGuideCards" }}>
                  <a style={{color: "transparent"}} target={"_blank"} title="Twitter"> <img src={twitterIcon} alt="Twitter" title="Twitter" /> </a>  
                </Link>
              </div>
            </div>
            <div className="only-mobile">
              <div className="text-center pull-right-copy-right">
                &#169; {year} Price Guide Limited. All Rights <br/>Reserved.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
