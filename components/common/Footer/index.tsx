import React from 'react';
import logo from "assets/images/logo-footer.png";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
import Selectors from 'redux/selectors';

function Footer() {
  const location = useLocation();
  const { loggingIn } = useSelector(Selectors.auth);
  const { sports } = useSelector(Selectors.config);
  const pathname = location.pathname.split("/")
  // 
  if (pathname[1] === "collections-add-card") {
    return null
  }
  const openInNewTab = (url: string) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }
  return (
    <div className={`footer-content container-fluid pt-5`}>
      <div className="container-footer">
        <div className="row mb-4">
          <div className="col-md-4 col-sm-11 col-xs-11 menu-logo">
            <div className="footer-text pull-left">
              <div className="d-flex">
                <img src={logo} />
              </div>
            </div>
          </div>
          <div className="col-md-2 col-sm-4 col-xs-4 menu-item-footer">
            <p className="heading"><Link className="text-reset text-decoration-none" to="/">Home</Link></p>
            <ul className="list-unstyled">
              <li><Link className="text-reset text-decoration-none" to="/search">Search</Link></li>
              {/* <li>Box Breaks</li> */}
              <li><Link className="text-reset text-decoration-none" to="/top-100">Top 100</Link> </li>
              <li><Link className="text-reset text-decoration-none" to="/leaderboard">Leaderboard</Link></li>
              {/* <li>Market</li> */}
              {!loggingIn && <div className='has-auth'>
                <li className='no-padding'><Link className="text-reset text-decoration-none" to="/login">Login</Link></li>
                <li className='no-padding'><Link className="text-reset text-decoration-none" to="/register">Create Account</Link></li>
              </div>}
            </ul>
          </div>
          <div className="col-md-2 col-sm-4 col-xs-4 menu-item-footer mobile-flex-menu">
            <p className="heading gray-color">Collections</p>
            <ul className="list-unstyled">
              {
                sports?.map((item, index) => <li key={index}>
                  <Link className="text-reset text-decoration-none" to={`/collections/${item.sportName.replace(/\s/g, '').toLowerCase()}`}>{item?.sportName}</Link>
                </li>)
              }
            </ul>
          </div>
          <div className="col-md-2 col-sm-4 col-xs-4 menu-item-footer mobile-flex-menu">
            <p className="heading gray-color">Sports</p>
            <ul className="list-unstyled">
              {
                sports?.map((item, key) => <li key={key} >
                  <Link className="text-reset text-decoration-none" to={`/sport/${item.sportName.replace(/\s/g, '').toLowerCase()}`}>{item?.sportName}</Link>
                </li>)
              }
            </ul>
          </div>
          <div className="col-md-2 col-sm-4 col-xs-4 menu-item-footer">
            <ul className="list-unstyled">
            <li><Link className="text-reset text-decoration-none" to={`/blog`}>Blog</Link></li>
              <li><Link className="text-reset text-decoration-none" to={`/faq`}>FAQ</Link></li>
              <li>
              <Link className="text-reset text-decoration-none" to={`/about`}>About</Link>
              </li>
              <li><Link className="text-reset text-decoration-none" to={`/contact`}>Contact</Link></li>
              <div className='has-auth'>
                <li>API Documentation</li>
                {/* <li>Feedback</li> */}
              </div>
              <div className='has-auth'>
                {/* <li>Links</li> */}
                <li>Sitemap</li>
                <li><Link className="text-reset text-decoration-none" to={`/terms-of-use`}>Terms of Use</Link></li>
                <li><Link className="text-reset text-decoration-none" to={`/privacy-policy`}>Privacy Policy</Link></li>
              </div>
            </ul>
          </div>
        </div>
        <div className="divider mb-4"> </div>
        <div className="row socials-section" style={{ fontSize: '14px', borderTop: '1px', borderColor: 'rgba(255, 255, 255, 0.2)', borderTopStyle: 'solid' }} >
          <div className="col-md-6 col-sm-6 col-xs-6 socials-text">
            <div className="pull-left">
              <p className="mt-3 color-gray"><i className="fa fa-copyright" /> 2021 Price Guide Limited. All Rights Reserved. </p>
            </div>
          </div>
          <div className="col-md-6 col-sm-6 col-xs-6 socials-icon">
            <div className="pull-right mr-4 d-flex policy">
              <div className="social mt-3 mb-3">
                {/* <i className="fa fa-facebook-official fa-lg" /> */}
                {/* <i className="fa fa-instagram fa-lg" /> */}
                {/* <i className="fa fa-linkedin-square fa-lg" /> */}
                <Link style={{color: "#FFFFFF"}} target={"_blank"} to={{ pathname: "https://www.facebook.com/PriceGuideCards" }}>
                  <i className="fa fa-facebook pr-3" />   
                </Link>
                <Link style={{color: "#FFFFFF"}} target={"_blank"} to={{ pathname: "https://twitter.com/PriceGuideCards" }}>
                  <i className="fa fa-twitter fa-lg" />  
                </Link>
              </div>
            </div>
            <div className="only-mobile">
              <div className="text-center pull-right-copy-right">
                &#169; 2021 Price Guide Limited. All Rights <br/>
                Reserved.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
