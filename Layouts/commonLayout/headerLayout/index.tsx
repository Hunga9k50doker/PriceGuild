import React, { useEffect, useState } from "react";
import SmartSearch from "components/smartSearch"
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux';
import Selectors from 'redux/selectors';
import { AuthActions } from "redux/actions/auth_action";
import { ConfigAction } from "redux/actions/config_action";
import logoHeader from "assets/images/logo-header.svg";
import logoHeader1024 from "assets/images/logo-header-1024.svg";
import { HomeActions } from "redux/actions/home_action";
import IconSport from 'assets/images/icon_foodball.png'
import IconArrow from 'assets/images/arrow_nav.png'
import ImageFutera from 'assets/images/futera.png'
import IconUserProfile from "assets/images/header_user.png"
import IconCollectionProfile from "assets/images/profile_collection.png"
import IconHeartProfile from "assets/images/profile_heart.png"
import IconFriendProfile from "assets/images/profile_user_group.png"
import IconMessageProfile from "assets/images/profile_chat.png"
import IconSettingProfile from "assets/images/profile_setting.png"
import IconCartProfile from "assets/images/profile_card_plus.png"
import IconCloudProfile from "assets/images/profile_cloud.png"
import IconLogout from "assets/images/logout.png"
import IconMobileLogo from "assets/images/logo-mobile.svg"
import IconBurger from "assets/images/burger.svg"
import IconSearch from "assets/images/search.svg";
import IconNavMenu from "assets/images/logo-nav-menu.svg";
import IconCloseNavMenu from "assets/images/close-nav-menu.svg";
import Select from "react-select";
import IconArrowNavMenu from "assets/images/arrow-right-nav.svg";
import IconArrowBackMenu from "assets/images/arrow-back-black.svg";
import IconAccount from "assets/images/account.svg";
import IconInfo from "assets/images/info.svg";
import IconBowse from "assets/images/bowse.svg";
import IconArrowLanguage from "./componennts/iconArrowLanguage";
import SearchMobileModal from "./componennts/searchMobile";
import IconLogo1 from "assets/images/logo_1.png";
import InputSearch, { FilterModalHandle } from "components/smartSearchMobile/inputSearch";
import { divide } from "lodash";
// @ts-ignore
import $ from "jquery";
import { useTranslation } from "react-i18next";
const Header = (props: any) => {
  
  const router = useRouter();
  const query: any = router?.query
  const { userInfo, loggingIn } = useSelector(Selectors.auth);
  const { popularPublishers } = useSelector(Selectors.home);
  const { cards } = useSelector(Selectors.compare);
  
  const dispatch = useDispatch();
  const { sports } = useSelector(Selectors.config);
  const { is_browse, is_show_card_detail_collection, is_show_tab_bar } = useSelector(Selectors.config);
  const [t, i18n] = useTranslation("common");
  const gotoLogin = () => {
    dispatch(ConfigAction.updateUserNameSocial(false));
    dispatch(ConfigAction.updateEmailVerify(false));
    router.push("/login");
  }

  const [isShow, setIsShow] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [showSearchData, setShowSearchData] = useState<boolean>(false);
  const [showMenuContent, setShowMenuContent] = useState<boolean>(false);
  const [showCollectionMenu, setShowCollectionMenu] = useState<boolean>(false);
  const [tabColl, setTabColl] = useState<boolean>(false);
  const [showBowseContent, setShowBowseContent] = useState<boolean>(false);
  const [showProfileContent, setShowProfileContent] = useState<boolean>(false);
  const inputSearchRefs = React.useRef<FilterModalHandle>(null);
  const [keyTab, setKeyTab] = useState(0)
  React.useEffect(() => {
    setIsShow(false)
    setShowMenuContent(false);
    let isCheck = document.body.style.overflow;

    if (Boolean(isCheck)) {
      document.body.removeAttribute("style");
    }

    if (location.pathname.split("/")[1] === "collections-add-card") {
      dispatch(ConfigAction.updateShowTabBar(false));
    } else {
      dispatch(ConfigAction.updateShowTabBar(true));
    }
  }, [router.query])

  useEffect(() => {
    if (query.q) {
      setSearchText(`${query.q}`);
    }
  }, [query.q])

  useEffect(() => {
    if (is_browse === true || showMenuContent === true || showCollectionMenu === true || showProfileContent === true) {
      window.scrollTo(0, 0)
      document.body.style.overflow = 'hidden';
      if(is_browse)  document.getElementsByClassName("section-bowse")[0].scrollTo(0, 0) ;
      
    } else {
      if(!is_show_card_detail_collection) return document.body.removeAttribute("style")
    }
  }, [is_browse, showMenuContent, showCollectionMenu, showProfileContent])

  useEffect(() => {
    if (isShow === true) {
      window.scrollTo(0, 0)
    }
  }, [isShow])


  const logout = () => {
    dispatch(AuthActions.logout());
  };

  const goToCollections = (sportName: string) => {
    router.push(`/collections/${sportName}`);
  }
  const goToCollectionsLink = (sportName: string) => {
    return `/collections/${sportName}`
  }

  const goToCompare = () => {
    router.push(`/comparison`);
  }

  const gotoPersonalProfile = () => {
    router.push(`/profile/personal`);
    setShowMenuContent(false) 
  }

  React.useEffect(() => {
    dispatch(ConfigAction.getCurrencies());
  }, [])

  React.useEffect(() => {
    dispatch(HomeActions.getPopularPublishers());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSearchCard = (sport: any, publisher: any) => {
    const urlObject: { [key: string]: string | number } = {
      publisher: sport.publisherID,
      sport_criteria: sport.id,
      publisherName: publisher?.name
    }
    onRedirectCard(urlObject)
  }

  const onSearchCardBySport = (id: any) => {
    const urlObject: { [key: string]: string | number } = {
      sport_criteria: id
    }
    onRedirectCard(urlObject)
  }

  const onRedirectCard = (urlObject: any) => {
    const str = Object.entries(urlObject).map(([key, val]) => `${key}=${val}`).join('&');
    return router.push(`/search?${str}`)
  }
  
  const gotoAccount = () => {
    if (!loggingIn) {
      return router.push(`/login`);
    }
    return setShowProfileContent(true);
  }

  const onCloseSearchMobile = () => {
    setIsShow(false)
  }
  const handleError = (e: any, index:number) => {
    $(`#error-image-header${index}`).addClass("img-publisher--error");
  }
  const handleTextError = (text: string) => {
     return text.replace(' ','_').replace('-','_').toLowerCase();
  }

  const menuActive = () => {
    setShowMenuContent(!showMenuContent);
  }

  const [loginState, setLoginState] = useState(false)
   
  useEffect(() => {
    setLoginState(Boolean(loggingIn))
  }, [loggingIn])

  return (
    <div className="position-relative container-fluid header-page-content">
      <Link href="/">
        <a href="">
          <img alt="" onClick={() => router.push("/")} className="image-logo cursor-pointer image-logo-1440" src={logoHeader} />
          <img alt="" onClick={() => router.push("/")} className="image-logo cursor-pointer  image-logo-1024" src={logoHeader1024} />
        </a>
      </Link>
      <div className="row position-relative">
        <div className="p-0">
          <nav className="navbar navbar-spport navbar-support  navbar-expand-md navbar-light py-md-0 py-0">
            <div className=" navbar-support-head ">
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"> <span className="navbar-toggler-icon" /> </button>
              <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
                <ul className="navbar-nav mb-lg-0">
                  <li className="nav-item">
                    <Link href="/top-100" >
                      <a className="nav-link" aria-current="page" title="Top 100">
                        Top 100
                      </a>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/rookie-cards">
                      <a className="nav-link" aria-current="page" title="Rookie Cards">
                        Rookie Cards
                      </a>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/leaderboard">
                      <a className="nav-link" aria-current="page" title="Leaderboard">
                        Leaderboard
                      </a>
                    </Link>
                  </li>
                  <li className="nav-item nav-item--blog">
                    <Link href="/blog">
                      <a className="nav-link" aria-current="page" title="Blog">
                          Blog
                      </a>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href={`/faq`} >
                      <a className="nav-link" aria-current="page" title="FAQ">
                        FAQ
                    </a>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/glossary">
                      <a className="nav-link" aria-current="page" title="Glossary">
                          Glossary 
                      </a>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href={`/about`} >
                      <a className="nav-link" title="About">
                        About
                      </a>
                    </Link>
                  </li>
                  <li className="nav-item nav-item--contact">
                    <Link href={`/contact`}>
                      <a className="nav-link" aria-current="page" title="Contact">
                        Contact
                      </a>
                    </Link>
                  </li>
                  <li className="nav-item nav-item--usd">
                    <a className="nav-link" aria-current="page" href="#" title="USD"> USD <IconArrowLanguage /> </a>
                  </li>
                  <li className="nav-item nav-item--usd">
                    <a className="nav-link" aria-current="page" href="#" title="EN"> EN <IconArrowLanguage /> </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mobile-nav">
              {!isShow ?
                <div className="section-logo">
                  <Link href="/">
                    <a>
                      <img alt="" onClick={() => router.push("/")} className="image-logo-mobile cursor-pointer" src={IconMobileLogo} />
                    </a>
                  </Link>
                </div> : ''}
              <div onClick={() => setIsShow(true)} className={`section-search-mobile ${isShow ? 'no-spacing-left' : ''}`}>
                <InputSearch ref={inputSearchRefs} onClose={onCloseSearchMobile} defaultSearch={searchText} onShow={setIsShow}/>
              </div>
              <div className="section-nav-menu">
                {!isShow ?
                  <img src={IconBurger} alt="Cancel" onClick={() => { menuActive() }} /> : <span className="btn-cancel-search" onClick={() => { setIsShow(false); inputSearchRefs?.current?.onClearData() }}> Cancel </span>}
              </div>
            </div>
          </nav>
          <nav className="position-unset navbar navbar-main navbar-expand-sm navbar-light">
            <div className="w-100">
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon" />
              </button>
              <div className="browse collapse navbar-collapse justify-content-between" id="navbarSupportedContent">
                <a href="/" target="_parent" className="logo only-768">
                <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M39.3607 14.3845C38.7573 14.3845 38.2707 13.8978 38.2707 13.2944V3.04627H26.4556C25.8522 3.04627 25.3656 2.55964 25.3656 1.95623C25.3656 1.35282 25.8522 0.866211 26.4556 0.866211H40.4508V13.2944C40.4508 13.893 39.9641 14.3845 39.3607 14.3845Z" fill="white"/>
                  <path d="M40.4508 46H6.00793V19.2409C6.00793 18.6375 6.49455 18.1509 7.09796 18.1509C7.70136 18.1509 8.18798 18.6375 8.18798 19.2409V43.8248H38.2756V26.6618C38.2756 26.0584 38.7622 25.5718 39.3656 25.5718C39.969 25.5718 40.4556 26.0584 40.4556 26.6618V46H40.4508Z" fill="white"/>
                  <path d="M34.0614 15.9367C33.458 15.9367 32.9714 15.4501 32.9714 14.8467V7.24571H29.8035C29.2001 7.24571 28.7135 6.7591 28.7135 6.15569C28.7135 5.55229 29.2001 5.06567 29.8035 5.06567H35.1515V14.8467C35.1515 15.4501 34.6648 15.9367 34.0614 15.9367Z" fill="white"/>
                  <path d="M12.3972 28.2677C11.7938 28.2677 11.3072 27.7811 11.3072 27.1777V22.2482C11.3072 21.6448 11.7938 21.1582 12.3972 21.1582C13.0006 21.1582 13.4872 21.6448 13.4872 22.2482V27.1777C13.4872 27.7811 13.0006 28.2677 12.3972 28.2677Z" fill="white"/>
                  <path d="M11.4629 35.8005C11.1855 35.8005 10.9082 35.6934 10.694 35.4842C10.2707 35.0608 10.2707 34.3747 10.694 33.9513L20.188 24.4574C20.6113 24.0341 21.2975 24.0341 21.7208 24.4574L26.1101 28.8467L35.2829 19.674C35.7062 19.2506 36.3923 19.2506 36.8157 19.674C37.2391 20.0973 37.2391 20.7834 36.8157 21.2068L26.8741 31.1484C26.4507 31.5718 25.7646 31.5718 25.3412 31.1484L20.952 26.7591L12.222 35.489C12.0176 35.6934 11.7403 35.8005 11.4629 35.8005Z" fill="white"/>
                  <path d="M39.9738 16.5353L32.475 18.5402L37.9641 24.0292L39.9738 16.5353Z" fill="white"/>
                  <path d="M31.3315 41.5961H33.0736C34.6745 41.5961 35.9738 40.2968 35.9738 38.6958V24.0632L31.3315 28.7056V41.5961V41.5961Z" fill="white"/>
                  <path d="M26.1101 32.8807C25.4483 32.8807 24.8303 32.6277 24.3583 32.1654V41.5912H29.0006V31.0267L27.8814 32.1459C27.4094 32.6228 26.7816 32.8807 26.1101 32.8807Z" fill="white"/>
                  <path d="M17.3948 32.326V41.596H22.0371V29.8442L20.9568 28.7639L17.3948 32.326Z" fill="white"/>
                  <path d="M11.9933 37.1631C11.4434 37.2798 10.8984 37.2117 10.4264 36.9927V38.691C10.4264 40.292 11.7257 41.5913 13.3266 41.5913H15.0687V34.6521L13.2731 36.4477C12.9227 36.7981 12.4799 37.0609 11.9933 37.1631Z" fill="white"/>
                  <path d="M39.9739 16.5353L32.4799 18.545L34.4459 20.511L26.115 28.8419L21.7257 24.4526C21.3023 24.0292 20.6162 24.0292 20.1928 24.4526L10.6989 33.9465C10.2756 34.3698 10.2756 35.056 10.6989 35.4793C10.913 35.6934 11.1904 35.7956 11.4678 35.7956C11.7452 35.7956 12.0225 35.6886 12.2366 35.4793L20.9666 26.7494L25.3559 31.1387C25.7792 31.562 26.4653 31.562 26.8887 31.1387L35.9885 22.0389L37.9739 24.0243L39.9739 16.5353Z" fill="white"/>
                  <path d="M21.93 16.1752C22.4848 15.6204 23.1709 15.2895 23.7646 15.2895C24.1198 15.2895 24.4264 15.4063 24.6454 15.6302C25.6283 14.0584 26.1977 12.2092 26.1977 10.2238C26.1977 4.58881 21.6138 0 15.9738 0C10.3388 0 5.75 4.58395 5.75 10.2238C5.75 15.8589 10.3339 20.4477 15.9738 20.4477C17.9593 20.4477 19.8133 19.8783 21.3802 18.8954C20.7768 18.2822 21.0201 17.09 21.93 16.1752ZM8.02737 10.219C8.02737 5.83455 11.5943 2.26764 15.9787 2.26764C20.3631 2.26764 23.93 5.83455 23.93 10.219C23.93 14.6034 20.3631 18.1703 15.9787 18.1703C11.5943 18.1703 8.02737 14.6034 8.02737 10.219Z" fill="white"/>
                  <path d="M22.8011 10.219C22.8011 6.45258 19.7451 3.39661 15.9787 3.39661C12.2123 3.39661 9.15631 6.45258 9.15631 10.219C9.15631 10.4818 9.17091 10.7397 9.20011 10.9927C9.55534 7.56206 12.4556 4.89053 15.9787 4.89053C19.5018 4.89053 22.4021 7.56693 22.7573 10.9927C22.7865 10.7397 22.8011 10.4818 22.8011 10.219Z" fill="white"/>
                  <path d="M29.1515 20.798L24.986 16.6326L24.4361 16.0827C24.4215 16.0583 24.4118 16.0389 24.3923 16.0146C24.3729 15.9902 24.3534 15.9659 24.3339 15.9416C24.2999 15.9075 24.2658 15.8832 24.2269 15.8588C24.2172 15.854 24.2026 15.8442 24.1928 15.8394C24.1636 15.8248 24.1344 15.8102 24.1052 15.7956C24.0906 15.7907 24.0809 15.7858 24.0663 15.781C24.0225 15.7664 23.9787 15.7566 23.9349 15.7469C23.8863 15.7372 23.8376 15.7372 23.7889 15.7372C23.7841 15.7372 23.7792 15.7372 23.7743 15.7372C23.7646 15.7372 23.7549 15.7372 23.7451 15.7372C23.7062 15.7372 23.6673 15.742 23.6283 15.7469C23.6138 15.7469 23.5991 15.7518 23.5797 15.7518C23.5262 15.7615 23.4726 15.7712 23.4142 15.7858C23.3558 15.8004 23.3023 15.8199 23.2439 15.8394C23.2293 15.8442 23.2099 15.854 23.1953 15.8588C23.1515 15.8783 23.1077 15.8929 23.0639 15.9172C23.0444 15.927 23.0298 15.9318 23.0103 15.9416C22.9519 15.9708 22.8936 16 22.8352 16.0389C22.7768 16.0729 22.7184 16.1119 22.66 16.1557C22.6405 16.1703 22.6259 16.18 22.6064 16.1946C22.5627 16.2287 22.5237 16.2579 22.4799 16.2919C22.4605 16.3065 22.4459 16.3211 22.4264 16.3357C22.3729 16.3844 22.3145 16.4331 22.261 16.4866C21.9447 16.8029 21.7159 17.163 21.5992 17.4987C21.5846 17.5474 21.57 17.5961 21.5554 17.6399C21.531 17.7323 21.5164 17.8248 21.5067 17.9124C21.5018 17.9562 21.5018 18 21.5018 18.0437C21.5018 18.0875 21.5067 18.1265 21.5116 18.1654C21.5164 18.2043 21.5262 18.2433 21.5359 18.2822C21.57 18.3941 21.6235 18.4914 21.7062 18.5693C21.7305 18.5936 21.7549 18.6082 21.7792 18.6277C21.7889 18.6374 21.7987 18.6472 21.8084 18.652C21.8133 18.6569 21.8181 18.6569 21.823 18.6618L21.8279 18.6666L22.3826 19.2214L26.5578 23.3965C26.5919 22.8418 26.8984 22.2092 27.4337 21.6739C27.9544 21.1581 28.5821 20.8369 29.1515 20.798Z" fill="white"/>
                  <path d="M30.0322 21.8491C30.0079 21.6885 29.9446 21.5523 29.8376 21.4452C29.8035 21.4112 29.7694 21.3868 29.7305 21.3625C29.7208 21.3576 29.711 21.3479 29.6964 21.343C29.6672 21.3284 29.638 21.3138 29.6089 21.2992C29.5943 21.2944 29.5845 21.2895 29.5699 21.2846C29.5261 21.27 29.4823 21.2603 29.4385 21.2506C29.3899 21.2408 29.3412 21.2408 29.2926 21.2408C29.2877 21.2408 29.2828 21.2408 29.278 21.2408C29.2682 21.2408 29.2585 21.2408 29.2488 21.2408C29.2098 21.2408 29.1709 21.2457 29.132 21.2506C29.1174 21.2506 29.0979 21.2554 29.0833 21.2554C29.0298 21.2652 28.9762 21.2749 28.9179 21.2895C28.8595 21.3041 28.8011 21.3236 28.7475 21.343C28.7329 21.3479 28.7135 21.3576 28.6989 21.3625C28.6551 21.382 28.6113 21.3966 28.5675 21.4209C28.548 21.4306 28.5334 21.4355 28.514 21.4452C28.3972 21.5036 28.2755 21.5766 28.1587 21.6593C28.1441 21.6691 28.1247 21.6837 28.1101 21.6983C28.0663 21.7323 28.0225 21.7664 27.9787 21.8005C27.9641 21.8151 27.9446 21.8296 27.93 21.8442C27.8716 21.8929 27.8181 21.9464 27.7646 22C27.312 22.4525 27.0444 22.9878 27.0152 23.4258C27.0103 23.4696 27.0103 23.5134 27.0103 23.5572C27.0152 23.6545 27.0346 23.7469 27.0638 23.8297C27.0687 23.8443 27.0736 23.8589 27.0784 23.8735C27.093 23.9026 27.1076 23.9318 27.1271 23.961C27.1514 24.0048 27.1806 24.0438 27.2196 24.0778C27.2536 24.1119 27.2877 24.1362 27.3217 24.1606C27.3315 24.1654 27.3461 24.1752 27.3558 24.18C27.385 24.1946 27.4142 24.2092 27.4434 24.2238C27.458 24.2287 27.4677 24.2335 27.4823 24.2384C27.5261 24.253 27.5699 24.2627 27.6186 24.2725C27.6672 24.2822 27.7159 24.2822 27.7646 24.2822C27.7792 24.2822 27.7938 24.2822 27.8084 24.2822C27.8473 24.2822 27.8862 24.2773 27.9252 24.2725C27.9398 24.2725 27.9592 24.2676 27.9738 24.2676C28.0273 24.2579 28.0809 24.2481 28.1393 24.2335C28.1977 24.2189 28.2512 24.1995 28.3096 24.18C28.3242 24.1752 28.3436 24.1654 28.3582 24.1606C28.402 24.1411 28.4458 24.1265 28.4896 24.1022C28.5091 24.0924 28.5237 24.0876 28.5432 24.0778C28.6016 24.0486 28.6599 24.0194 28.7183 23.9805C28.7767 23.9464 28.8351 23.9075 28.8935 23.8637C28.913 23.854 28.9276 23.8394 28.9471 23.8248C28.9908 23.7907 29.0346 23.7615 29.0736 23.7226C29.0882 23.708 29.1076 23.6934 29.1222 23.6788C29.1806 23.6301 29.2342 23.5815 29.2877 23.5231C29.5164 23.2944 29.6964 23.0511 29.823 22.8029C29.9008 22.6569 29.9544 22.5109 29.9933 22.3698C30.0176 22.2773 30.0322 22.1849 30.0419 22.0973C30.0468 22.0146 30.0419 21.9318 30.0322 21.8491Z" fill="white"/>
                  </svg>
                </a>
                <a title="Browse" className="button-browse nav-link me-2 btn btn-sm btn-secondary" href="javascript:void(0)" id="navbarDropdownBrowse" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M1.35 1.35001V6.60559H6.65V1.35001H1.35ZM1.35 11.3944V16.65H6.65V11.3944H1.35ZM11.35 1.35001V6.60559H16.65V1.35001H11.35ZM11.35 11.3944V16.65H16.65V11.3944H11.35ZM0.75 0C0.335786 0 0 0.335789 0 0.750005V7.20559C0 7.61981 0.335787 7.9556 0.750001 7.9556H7.25C7.66421 7.9556 8 7.61981 8 7.20559V0.750005C8 0.335789 7.66421 0 7.25 0H0.75ZM0.75 10.0444C0.335786 10.0444 0 10.3802 0 10.7944V17.25C0 17.6642 0.335787 18 0.750001 18H7.25C7.66421 18 8 17.6642 8 17.25V10.7944C8 10.3802 7.66421 10.0444 7.25 10.0444H0.75ZM10 0.750005C10 0.335789 10.3358 0 10.75 0H17.25C17.6642 0 18 0.335789 18 0.750005V7.20559C18 7.61981 17.6642 7.9556 17.25 7.9556H10.75C10.3358 7.9556 10 7.61981 10 7.20559V0.750005ZM10.75 10.0444C10.3358 10.0444 9.99998 10.3802 9.99998 10.7944V17.25C9.99998 17.6642 10.3358 18 10.75 18H17.25C17.6642 18 18 17.6642 18 17.25V10.7944C18 10.3802 17.6642 10.0444 17.25 10.0444H10.75Z" fill="white" />
                  </svg>
                  <span className="ms-1"> Browse </span>
                </a>
                <div className="dropdown-menu div-browse py-0 mt-0 w-100" aria-labelledby="navbarDropdownBrowse">
                  <div className="w-100 fake-padding">
                    <div className="row">
                      <div className="col-xxl-8 col-md-7">
                        <h3 className="pl-4 p-3 pb-3 mt-4 browse__title"> Browse by Sport </h3>
                        <div className="d-flex flex-wrap">
                          {sports.map((item, k) => <div key={k} className="mb-3 cursor-pointer" onClick={() => onSearchCardBySport(item.id)}>
                            <div className="d-flex text-center justify-content-between align-items-center browse-item flex-column">
                              <div className="browse-item-icon w-100 d-flex justify-content-center align-items-center">
                                <div className="browse-item-icon__img"> <img src={item.icon} alt="" /> </div>
                              </div>
                              <div className="w-100 browse-item__name"> {item.sportName} </div>
                            </div>
                          </div>
                          )}
                        </div>
                      </div>
                      <div className="col-xxl-4 col-md-5 popular-publisher-header">
                        <h3> Popular Publishers </h3>
                        <div className="header-nav mt-2 d-flex">
                          <div className="col nav popular-publisher-item flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                            {popularPublishers?.map((item, key) =>
                              <button
                                key={key}
                                onMouseOver={() => setKeyTab(key)}
                                onClick={(e) => { e.stopPropagation() }}
                                className={`w-100 nav-link ${key === keyTab ? "active" : ""} `}
                                id={`v-pills-${item.publisher.name.replace(/\s/g, '')}-tab`}
                                data-bs-toggle="pill"
                                data-bs-target={`#v-pills-${item.publisher.name.replace(/\s/g, '')}`}
                                type="button" role="tab"
                                aria-controls={`v-pills-${item.publisher.name.replace(/\s/g, '')}`}
                                aria-selected="true">
                                <div className=" popular-publisher-item__title d-flex justify-content-between align-items-center pr-3">
                                  {item.publisher.name}
                                  <img alt="" src={IconArrow.src} />
                                </div>
                              </button>
                            )}
                          </div>
                          <div className="col tab-content pt-2" id="v-pills-tabContent">
                            {popularPublishers?.map((item, key) =>
                              <div
                                key={key}
                                className={`tab-pane fade ${key === keyTab ? "active show" : ""}`}
                                id={`v-pills-${item.publisher.name.replace(/\s/g, '')}`}
                                role="tabpanel"
                                aria-labelledby={`v-pills-${item.publisher.name.replace(/\s/g, '')}-tab`}
                              >
                                {item.sports.map((sport, index) =>
                                  <div onClick={() => onSearchCard(sport, item.publisher)} className="cursor-pointer border-under" key={index}> {sport.sportName} </div>)}
                                <div className="nav-pills-image mb-4 d-flex justify-content-center align-items-center">
                                  <div className="nav-pills-image-item">
                                    <img alt="" id={`error-image-header${key}`} className="img-publisher" src={item.publisher.image} onError={(e) => handleError(e, key)}  />
                                    <span className="text-publisher">
                                      {handleTextError(item.publisher.name) }
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {(router.pathname !== "/" && router.pathname.split("/")[1] !== "sport") && <div className={`smart-search`}>
                  <SmartSearch defaultSport={query.sport} defaultSearch={query.q} isArrow={1} />
                </div>}
                <ul className="collection navbar-nav mt-0 mb-2 mb-lg-0 align-items-center justify-content-end">
                  <li className="nav-item position-relative dropdown">
                    <a className="nav-link nav-link--collection dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false" title="Collections"> Collections </a>
                    <div className="dropdown-menu collection-content  py-0 mt-0 " aria-labelledby="navbarDropdown">
                      <div className="col-12">
                        <div className="d-flex flex-wrap p-3">
                          {sports.map((item, k) => <Link href={goToCollectionsLink(item?.sportName?.replace(/\s/g, '').toLowerCase())} key={k} >
                            <a className="cursor-pointer collection-content-item  w-50"> {item.sportName} </a>
                          </Link> )}
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="nav-item position-relative nav-item--wishlist">
                    <div onClick={goToCompare} className="button-compare nav-link cursor-pointer">
                      <svg width="28" height="24" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M14.0449 0.683319C13.5249 0.683319 13.1033 1.10492 13.1033 1.62493V3.43129L3.44606 3.42438C2.92604 3.42438 2.50444 3.84598 2.50444 4.36599C2.50444 4.88601 2.92604 5.30761 3.44606 5.30761H5.37416L0.716044 16.8771C0.669593 16.9868 0.644349 17.1042 0.641663 17.2231V17.2284C0.641663 20.6099 3.38288 23.3511 6.76436 23.3511C10.1458 23.3511 12.8871 20.6099 12.8871 17.2284L12.887 17.2231C12.8843 17.1042 12.8591 16.9868 12.8127 16.8772L8.16155 5.30097L13.1033 5.3073V7.44035C13.1033 7.69623 13.1534 7.94906 13.3192 8.13809C13.4906 8.33339 13.7437 8.41423 14.0449 8.41423C14.3461 8.41423 14.5992 8.33339 14.7706 8.13809C14.9364 7.94906 14.9865 7.69623 14.9865 7.44035V5.30729L19.8109 5.30097L15.1872 16.8774C15.1408 16.987 15.1156 17.1043 15.1129 17.2231V17.2284C15.1129 20.6099 17.8542 23.3511 21.2356 23.3511C24.6171 23.3511 27.3584 20.6099 27.3584 17.2284L27.3583 17.2231C27.3556 17.1041 27.3304 16.9866 27.2838 16.8768L22.6052 5.31469H24.561C25.081 5.31469 25.5026 4.89309 25.5026 4.37307C25.5026 3.85306 25.0808 3.43146 24.5608 3.43146L14.9865 3.43836V1.62493C14.9865 1.10492 14.5649 0.683319 14.0449 0.683319ZM10.5453 16.3009H2.99091L6.77461 6.88388L10.5453 16.3009ZM24.974 16.3009H17.4198L21.2034 6.89059L24.974 16.3009ZM6.76031 21.4785C4.77379 21.4754 3.06898 20.0973 2.63135 18.1842H10.862C10.4266 20.0875 8.73648 21.4627 6.76031 21.4785ZM21.2034 21.4785L20.9958 21.4788C19.1079 21.3711 17.5195 20.0232 17.1021 18.1842H25.3332C24.8955 20.0975 23.1903 21.4757 21.2034 21.4785Z" fill="white" />
                      </svg>
                      {Boolean(cards.length) && <div
                        className="rounded-circle text-center"
                      > {cards.length} </div>}
                    </div>
                  </li>
                  {loginState ? <>
                    <li className="nav-item dropdown user">
                      <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false"> <i style={{ fontSize: 40 }} className="fa fa-user-circle-o" aria-hidden="true" /> </a>
                      <ul className="dropdown-menu dropdown-user-login" aria-labelledby="navbarDropdown">
                        <li >
                          <Link href="/profile/personal">
                            <a className="dropdown-item user-login-info">{userInfo?.firstname} {userInfo?.lastname} <div className="user-login-info-name"> @{userInfo?.username} </div></a>
                          </Link>
                        </li>
                        <li><hr className="dropdown-divider" /></li>
                        <li>
                          <Link href="/profile/personal">
                            <a className="dropdown-item" title="Profile">
                              <span><img alt="Profile" src={IconUserProfile.src} /></span> Profile 
                            </a>
                          </Link>
                        </li>
                        <li>
                          <Link href="/profile/portfolio">
                            <a className="dropdown-item" title={t('portfolio.text_upper')}>
                              <span> <img alt={t('portfolio.text_upper')} src={IconCollectionProfile.src} /> </span> {t('portfolio.text_upper')}
                            </a>
                          </Link>
                        </li>
                        <li>
                          <Link href="/profile/wishlists">
                            <a className="dropdown-item" title="Wishlists">
                              <span> <img src={IconHeartProfile.src} alt="Wishlists"/> </span> Wishlists
                            </a>
                          </Link>
                        </li>
                        <li>
                          <Link href="/profile/friends">
                            <a className="dropdown-item" title="Friends">
                              <span> <img src={IconFriendProfile.src} alt="Friends" /> </span> Friends
                            </a>
                          </Link>
                        </li>
                        <li>
                          <Link href="/profile/messages" >
                            <a className="dropdown-item" title="Messages">
                              <span> <img src={IconMessageProfile.src} alt="Messages" /> </span> Messages
                            </a>
                          </Link>
                        </li>
                        {/* <li>
                          <Link className="dropdown-item" to="/profile/market" title="Market">
                            <span> <img src={IconMessageProfile} alt="Market" /> </span> Market
                          </Link>
                        </li> */}
                        <li><hr className="dropdown-divider" /></li>
                        <li>
                          <Link href="/profile/settings">
                            <a className="dropdown-item" title="Settings">
                              <span> <img src={IconSettingProfile.src} alt="Settings" /> </span> Settings
                            </a>
                          </Link>
                        </li>
                        <li>
                          <Link href="/profile/help">
                            <a className="dropdown-item" title="Can't find a card?">
                              <span> <img src={IconCartProfile.src} alt="Can't find a card?" /> </span> Can't find a card?
                            </a>
                          </Link>
                        </li>
                        <li>
                          <Link href="/profile/api">
                            <a className="dropdown-item"  title="API">
                              <span className="custom-icon-span"> <img src={IconCloudProfile.src} alt="API" /> </span> API
                            </a>
                          </Link>
                        </li>
                        <li><hr className="dropdown-divider" /></li>
                        <li onClick={logout}>
                          <a className="dropdown-item" href="javascript:void(0)" title="Logout">
                            <span> <img src={IconLogout.src} alt="Logout" /> </span> Logout
                          </a>
                        </li>
                      </ul>
                    </li>
                  </> : <> 
                    <li onClick={gotoLogin} className="only-768 nav-user cursor-pointer">
                      <svg width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.6181 11.1284C16.1538 10.0084 17.1538 8.19581 17.1538 6.15384C17.1538 2.76061 14.3932 0 11 0C7.60676 0 4.84615 2.76061 4.84615 6.15384C4.84615 8.19581 5.84613 10.0084 7.38185 11.1284C3.56435 12.5892 0.846161 16.2905 0.846161 20.6154C0.846161 22.4817 2.36449 24 4.23077 24H17.7692C19.6355 24 21.1538 22.4817 21.1538 20.6154C21.1538 16.2905 18.4356 12.5892 14.6181 11.1284ZM6.69232 6.15384C6.69232 3.77859 8.62474 1.84617 11 1.84617C13.3752 1.84617 15.3077 3.77859 15.3077 6.15384C15.3077 8.52909 13.3752 10.4616 11 10.4616C8.62474 10.4616 6.69232 8.52909 6.69232 6.15384ZM17.7692 22.1538H4.23077C3.38247 22.1538 2.69233 21.4637 2.69233 20.6153C2.69233 16.0344 6.41909 12.3076 11 12.3076C15.581 12.3076 19.3077 16.0344 19.3077 20.6153C19.3077 21.4637 18.6176 22.1538 17.7692 22.1538Z" fill="white"/>
                      </svg>
                    </li>
                    <li><button onClick={gotoLogin} className="btn btn-sm btn-primary navbar-btn" title="Login"> Login </button></li>
                    <li className="nav-item nav-item--register">
                        <Link href="/register">
                          <a className="nav-link active" aria-current="page" title="Create Account">
                            Create Account
                          </a>
                        </Link>
                    </li> </>}
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </div >
      {/*  */}
      {/* {showSearchData &&
        <div className="section-search-content">
          <span className="recent-search">Recent Search</span>
          <ul>
            <li>
              <span className="main-text">David Beckham</span> <span className="belong-text">in Football</span>
            </li>
            <li>
              <span className="main-text">David Beckham</span> <span className="belong-text">in Football</span>
            </li>
            <li>
              <span className="main-text">David Beckham</span> <span className="belong-text">in Football</span>
            </li>
            <li>
              <span className="main-text">David Beckham</span> <span className="belong-text">in Football</span>
            </li>
          </ul>
        </div>
      } */}
      <div className={`${showMenuContent?'active':''} section-menu-content`}>
        <div className="section-logo-nav">
          <div className="d-flex justify-content-between section-logo">
            <img src={IconNavMenu} alt="logoHeader" className="logo-nav-menu" />
            <img src={IconCloseNavMenu} alt="IconCloseNavMenu" className="close-icon" onClick={() => { setShowMenuContent(false) }} />
          </div>
          <div className="section-select">
            <Select
              defaultValue={{ value: 'usd', label: 'USD' }}
              classNamePrefix="select-currency"
              className="select-price select-currency customScroll"
              options={[
                { value: 'usd', label: 'USD' },
                { value: 'th', label: 'TH' },
              ]} />
            <Select
              defaultValue={{ value: 'usd', label: 'USD' }}
              classNamePrefix="select-language"
              className="select-price select-language customScroll"
              options={[
                { value: 'usd', label: 'USD' },
                { value: 'th', label: 'TH' },
              ]} />
          </div>
        </div>
        {!loggingIn ?
          <div className="section-account">
            <button className="btn-login btn btn-primary">
              <Link href="/login">
                <a onClick={() => { setShowMenuContent(false) }} title="Login">
                  Login
                </a>
              </Link>
            </button>
            <button className="btn-create-account btn">
              <Link href="/register">
                <a onClick={() => { setShowMenuContent(false) }} title="Create Account">
                  Create Account
                </a>
              </Link>
            </button>
          </div> :
          <div className="section-account-loggined">
            <div className="section-account-box">
              <div className="box-photo" onClick={gotoPersonalProfile}>
                <img src={userInfo.userImg ? `${process.env.REACT_APP_IMAGE_URL}${userInfo.userImg}` : "http://cdn.onlinewebfonts.com/svg/img_568656.png"} className="rounded-circle" data-src="holder.js/171x180" alt="171x180" data-holder-rendered="true" />
              </div>
              <div className="username-text"  onClick={gotoPersonalProfile}>
                <span className="name"> {userInfo?.firstname} {userInfo?.lastname} </span><br/>
                <span className="tag-name"> @{userInfo?.username} </span>
              </div>
            </div>
          </div>
        }
        <div className="menu-data">
          <ul className="main-menu">
            <li>
              <Link href="/">
                <a onClick={() => { setShowMenuContent(false) }} title="Home">Home</a>
              </Link>
            </li>
            <li onClick={() => { dispatch(ConfigAction.updateBrowse(true)); setShowMenuContent(false); }} title="Browse"> Browse </li>
            <li onClick={() => { setShowCollectionMenu(true); setShowMenuContent(false); }} title="Collections"> Collections <img src={IconArrowNavMenu} alt="IconArrowNavMenu" className="icon-arrow" /> </li>
            <li> <Link href="/comparison">
              <a onClick={() => { setShowMenuContent(false) }} title="">
                Comparison {Boolean(cards.length) && <span className="bagde">{cards.length}</span>}
              </a>
            </Link> </li>
          </ul>
          <ul className="belong-menu">
            <li>
              <Link href="/top-100">
                <a onClick={() => { setShowMenuContent(false) }} title="Top 100">
                  Top 100
                </a>
              </Link>
            </li>
            <li>
              <Link href="/rookie-cards">
                <a onClick={() => { setShowMenuContent(false) }} title="Rookie Cards">
                  Rookie Cards
                </a>
              </Link>
            </li>
            <li>
              <Link href="/leaderboard" >
                <a onClick={() => { setShowMenuContent(false) }} title="Leaderboard">
                  Leaderboard
                </a>
              </Link>
            </li>
            <li>
              <Link href={`/blog`} >
                <a className="text-reset text-decoration-none" title="Blog">
                    Blog
                </a>
              </Link>
            </li>
            <li> <Link href={`/faq`} >
              <a className="text-reset text-decoration-none" title="FAQ">
                FAQ
              </a>
            </Link> </li>
            <li> <Link href={`/about`} >
              <a className="text-reset text-decoration-none" title="About">
                About
              </a>
            </Link> </li>
            <li>
              <Link href={`/contact`} >
                <a  className="text-reset text-decoration-none" title="Contact">Contact</a>
              </Link>
            </li>
          </ul>
        </div>
      </div> 
      <div className={`${showCollectionMenu?'active':''} section-collection-menu`}>
        <div className="box-title">
          <div className="section-title">
            {!tabColl ?
              (<><img src={IconArrowBackMenu} onClick={() => { setShowCollectionMenu(false); menuActive(); }} alt="IconArrowBackMenu" className="arrow-back" />
                <span> Collections </span>
              </>)
              :
              <div className="d-flex justify-content-between align-items-center w-100">
                <span> Collections </span>
                <span className="close-text" onClick={() => { setTabColl(false); setShowCollectionMenu(false) }}> Close </span>
              </div>}
          </div>
        </div>
        <div className="content-menu-collection">
          <ul className="menu-collection">
            {sports.map((item, k) =>
              <li onClick={() => {  goToCollections(item?.sportName?.replace(/\s/g, '').toLowerCase()); setShowCollectionMenu(false); setShowMenuContent(false) }}>{item.sportName}</li>
            )}
          </ul>
        </div>
      </div>
      {is_show_tab_bar && 
      <div className="tab-bottom">
        <div className="tab-navigation d-flex justify-content-around">
          <div className="d-flex flex-column tab-item">
            <img src={IconBowse} alt="Browse" onClick={() => { setTabColl(true); dispatch(ConfigAction.updateBrowse(true)) }} /> Browse
          </div>
          <div className="d-flex flex-column tab-item" onClick={() => { setTabColl(true); setShowCollectionMenu(true) }}>
            <img src={IconInfo} alt="Collections" /> Collections
          </div>
          <div className="d-flex flex-column tab-item" onClick={() => gotoAccount()}>
            {loggingIn ?
              <>
                <div className="avatar">
                  <img src={userInfo.userImg ? `${process.env.REACT_APP_IMAGE_URL}${userInfo.userImg}` : "http://cdn.onlinewebfonts.com/svg/img_568656.png"} className="rounded-circle" data-src="holder.js/171x180" alt="Profile" data-holder-rendered="true" />
                </div> Profile
              </>
              :
              <>
                <img src={IconAccount} alt="Account" /> Account
              </>
            }
          </div>
        </div>
      </div>}
      {showProfileContent &&
        <div className="section-profile">
          <div className="account-user d-flex justify-content-between w-100">
            <div className="box-photo-user d-flex">
              <div className="box-photo ">
                <img src={userInfo.userImg ? `${process.env.REACT_APP_IMAGE_URL}${userInfo.userImg}` : "http://cdn.onlinewebfonts.com/svg/img_568656.png"} className="rounded-circle" data-src="holder.js/171x180" alt="171x180" data-holder-rendered="true" />
              </div>
              <div className="username-text d-flex flex-column">
                <span className="name"> {userInfo?.firstname} {userInfo?.lastname} </span>
                <span className="tag-name"> @{userInfo?.username} </span>
              </div>
            </div>
            <span className="close-text" onClick={() => { setShowProfileContent(false) }}> Close </span>
          </div>
          <div className="section-profile-info">
            <ul className="account-profile">
              <li>
                <Link href="/profile/personal">
                  <a title="Profile" onClick={() => { setShowProfileContent(false) }} className="dropdown-item">
                    <span><img src={IconUserProfile.src} alt="Profile" /></span>
                    <span className="text-title"> Profile </span>
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/profile/portfolio">
                  <a title={t('portfolio.text_upper')} className="dropdown-item" onClick={() => { setShowProfileContent(false) }}>
                    <span><img src={IconCollectionProfile.src} alt={t('portfolio.text_upper')} /></span>
                    <span className="text-title"> {t('portfolio.text_upper')} </span>
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/profile/wishlists" >
                  <a  className="dropdown-item" title="Wishlists" onClick={() => { setShowProfileContent(false) }}>
                    <span> <img src={IconHeartProfile.src} alt="Wishlists" /> </span>
                    <span className="text-title"> Wishlists </span>
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/profile/friends" >
                  <a title="Friends" className="dropdown-item" onClick={() => { setShowProfileContent(false) }}>
                    <span> <img src={IconFriendProfile.src} alt="Friends" /> </span>
                    <span className="text-title"> Friends </span>
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/profile/messages" >
                  <a title="Messages" className="dropdown-item" onClick={() => { setShowProfileContent(false) }}>
                    <span> <img src={IconMessageProfile.src} alt="Messages" /> </span>
                    <span className="text-title"> Messages </span>
                  </a>
                </Link>
              </li>
              {/* <li>
                <Link className="dropdown-item" to="/profile/market" title="Market">
                  <span> <img src={IconMessageProfile} alt="Market" /> </span> Market
                </Link>
              </li> */}
              <li><hr className="dropdown-divider" /></li>
              <li>
                <Link href="/profile/settings" >
                  <a title="Settings" className="dropdown-item" onClick={() => { setShowProfileContent(false) }}>
                    <span> <img src={IconSettingProfile.src} alt="Settings" /> </span>
                    <span className="text-title"> Settings </span>
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/profile/help">
                  <a title="Can't find a card?" className="dropdown-item" onClick={() => { setShowProfileContent(false) }}>
                    <span> <img src={IconCartProfile.src} alt="Can't find a card?" /> </span>
                    <span className="text-title"> Can't find a card? </span>
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/profile/api">
                  <a title="API" className="dropdown-item" onClick={() => { setShowProfileContent(false) }}>
                    <span className="custom-icon-span"> <img src={IconCloudProfile.src} alt="API" /> </span>
                    <span className="text-title"> API </span>
                  </a>
                </Link>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li onClick={() => { logout(); setShowProfileContent(false) }}>
                <a title="Logout" className="dropdown-item" href="javascript:void(0)"> <span> <img src={IconLogout.src} alt="Logout" /> </span> Logout </a>
              </li>
            </ul>
          </div>
        </div>}
        <div className={`${is_browse?'active':''} section-bowse`}>
          <div className="section-bowse-head">
            <div className="section-title">
              <div className="d-flex justify-content-between align-items-center w-100">
                <span> Browse </span>
                <span className="close-text" onClick={() => { setTabColl(false); dispatch(ConfigAction.updateBrowse(false)) }}> Close </span>
              </div>
            </div>
          </div>
          <div className="row section-bowse-item">
            {sports.map((item, k) => <div key={k} className="col-6 col-md-4 mb-3 cursor-pointer section-bowse-item-detail" onClick={() => { onSearchCardBySport(item.id); dispatch(ConfigAction.updateBrowse(false)) }}>
              <div className="d-flex text-center justify-content-between align-items-center browse-item flex-column">
                <div className="browse-item-icon w-100 d-flex justify-content-center align-items-center">
                  <div className="browse-item-icon__img"> <img src={item.icon} alt="" /> </div>
                </div>
                <div className="w-100 browse-item__name pt-3"> {item.sportName} </div>
              </div>
            </div>)}
          </div>
        </div>
    </div >
  );
}

export default React.memo(Header);
