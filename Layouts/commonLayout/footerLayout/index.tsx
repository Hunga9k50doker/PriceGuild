import React from 'react';
import logo from "assets/images/logo-footer.png";
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useSelector } from 'react-redux';
import Selectors from 'redux/selectors';

function Footer() {
  const router = useRouter();
  const { loggingIn } = useSelector(Selectors.auth);
  const { sports } = useSelector(Selectors.config);
  const pathname = router.pathname.split("/")
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
                <img src={logo.src} />
              </div>
            </div>
          </div>
          <div className="col-md-2 col-sm-4 col-xs-4 menu-item-footer">
            <p className="heading">
                <Link href="/">
                    <a className="text-reset text-decoration-none">
                        Home
                    </a>
                </Link>
            </p>
            <ul className="list-unstyled">
                <li>
                    <Link href="/search">
                        <a className="text-reset text-decoration-none">
                            Search
                        </a>
                    </Link>
                </li>
              {/* <li>Box Breaks</li> */}
                <li>
                    <Link href="/top-100">
                        <a className="text-reset text-decoration-none">
                            Top 100
                        </a>
                    </Link>
                </li>
                <li>
                    <Link href="/leaderboard">
                      <a className="text-reset text-decoration-none">
                          Leaderboard
                      </a>
                    </Link>
                </li>
              {/* <li>Market</li> */}
              {!loggingIn && <div className='has-auth'>
                <li className='no-padding'>
                    <Link href="/login">
                        <a className="text-reset text-decoration-none">
                            Login
                        </a>
                    </Link>
                </li>
                <li className='no-padding'>
                    <Link href="/register">
                        <a className="text-reset text-decoration-none">
                            Create Account
                        </a>
                    </Link>
                </li>
              </div>}
            </ul>
          </div>
          <div className="col-md-2 col-sm-4 col-xs-4 menu-item-footer mobile-flex-menu">
            <p className="heading gray-color">Collections</p>
            <ul className="list-unstyled">
              {
                sports?.map((item, index) => <li key={index}>
                    <Link href={`/collections/${item.sportName.replace(/\s/g, '').toLowerCase()}`}>
                        <a className="text-reset text-decoration-none" >
                            {item?.sportName}
                        </a>
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
                        <a className="text-reset text-decoration-none">
                            {item?.sportName}
                        </a>
                    </Link>
                </li>)
              }
            </ul>
          </div>
          <div className="col-md-2 col-sm-4 col-xs-4 menu-item-footer">
            <ul className="list-unstyled">
                <li>
                    <Link href={`/blog`}>
                        <a className="text-reset text-decoration-none">
                        Blog
                        </a>
                    </Link>
                </li>
                <li>
                    <Link href={`/faq`}>
                        <a className="text-reset text-decoration-none">
                            FAQ
                        </a>
                    </Link>
                </li>
              <li>
                <Link href={`/about`}>
                    <a className="text-reset text-decoration-none">
                        About
                    </a>
                </Link>
              </li>
                <li>
                    <Link href={`/contact`}>
                        <a className="text-reset text-decoration-none">
                            Contact
                        </a>
                    </Link>
                </li>
              <div className='has-auth'>
                <li>API Documentation</li>
                {/* <li>Feedback</li> */}
              </div>
              <div className='has-auth'>
                {/* <li>Links</li> */}
                <li>Sitemap</li>
                <li>
                    <Link href={`/terms-of-use`}>
                        <a className="text-reset text-decoration-none">
                            Terms of Use
                        </a>
                    </Link></li>
                    <li>
                        <Link href={`/privacy-policy`}>
                            <a className="text-reset text-decoration-none">
                                Privacy Policy
                            </a>
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
              <p className="mt-3 color-gray"><i className="fa fa-copyright" /> 2021 Price Guide Limited. All Rights Reserved. </p>
            </div>
          </div>
          <div className="col-md-6 col-sm-6 col-xs-6 socials-icon">
            <div className="pull-right mr-4 d-flex policy">
              <div className="social mt-3 mb-3">
                {/* <i className="fa fa-facebook-official fa-lg" /> */}
                {/* <i className="fa fa-instagram fa-lg" /> */}
                {/* <i className="fa fa-linkedin-square fa-lg" /> */}
                <Link href={{ pathname: "https://www.facebook.com/PriceGuideCards" }}>
                    <a target={"_blank"} style={{color: "#FFFFFF"}}>
                        <i className="fa fa-facebook pr-3" />
                    </a> 
                </Link>
                <Link href={{ pathname: "https://twitter.com/PriceGuideCards" }}>
                    <a style={{color: "#FFFFFF"}} target={"_blank"}>
                        <i className="fa fa-twitter fa-lg" />
                    </a>  
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
