import React, { useEffect, useRef } from "react";
import Personal from "components/profile/personal";
import { useRouter } from "next/router";
import Link from "next/link";
import Collection from "components/profile/collection";
import CollectionAnalytics from "components/profile/collection/analytics";
import AddCard from "components/profile/addCard";
import { useSelector, useDispatch } from "react-redux";
import Selectors from "redux/selectors";
import Settings from "components/profile/settings";
import CardListCollection from "components/profile/collection/cardListCollection";
import Messages from "components/profile/messages";
import ReportCard from "components/profile/reportCard";
import Friends from "components/profile/friends";
import FriendDetail from "components/profile/friends/friendDetail";
import RequestAPI from "components/profile/requestAPI";
import { MyStorage } from "helper/local_storage";
import { AuthActions } from "redux/actions/auth_action";
import IconUserProfile from "assets/images/icon-user.svg";
import IconCollectionProfile from "assets/images/icon-collection.svg";
import IconHeartProfile from "assets/images/icon-heart.svg";
import IconFriendProfile from "assets/images/icon-users.svg";
import IconMessageProfile from "assets/images/icon-chat.svg";
import IconSettingProfile from "assets/images/icon-settings.svg";
import IconCartProfile from "assets/images/icon-card-plus.svg";
import IconCloudProfile from "assets/images/icon-api.svg";

import IconUserProfileActive from "assets/images/icon-user-filled.svg";
import IconCollectionProfileActive from "assets/images/icon-collection-filled.svg";
import IconHeartProfileActive from "assets/images/icon-heart-filled.svg";
import IconFriendProfileActive from "assets/images/icon-users-filled.svg";
import IconMessageProfileActive from "assets/images/icon-chat-filled.svg";
import IconSettingProfileActive from "assets/images/icon-settings-filled.svg";
import IconCartProfileActive from "assets/images/icon-card-plus-filled.svg";
import IconCloudProfileActive from "assets/images/icon-api-filled.svg";
import useWindowDimensions from "utils/useWindowDimensions";
import { useTranslation } from "react-i18next";

interface ParamTypes {
  page: string;
  action?: string;
  type?: string;
}

const ProfileType = () => {
  const { userInfo } = useSelector(Selectors.auth);
  const router = useRouter();
  const { page, action, type } = router.query;
  const [currentPage, setCurrentPage] = React.useState<string>("");

  const profileRef = useRef<HTMLDivElement>(null);
  const collectionsRef = useRef<HTMLDivElement>(null);
  const wishlistRef = useRef<HTMLDivElement>(null);
  const friendtRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const settingRef = useRef<HTMLDivElement>(null);
  const findCardRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<HTMLDivElement>(null);
  const { width } = useWindowDimensions();
  const dispatch = useDispatch();
  const [t, i18n] = useTranslation("common");
  const renderContent = () => {
    if (MyStorage.user) {
      if (MyStorage.user.userid === 0) {
        dispatch(AuthActions.logout());
      }
    }

    switch (page) {
      case "personal":
        profileRef && profileRef.current && profileRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        return (
          <div className="col-12 col-md-10 min-vh-100">
            <Personal isFriend={true} />
          </div>
        );
      case "portfolio":
        collectionsRef &&
          collectionsRef.current &&
          collectionsRef?.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        if (action === "add-card") {
          return (
            <div className="col-12 col-md-10 min-vh-100 col-edit-card ">
              <AddCard />
            </div>
          );
        }
        if (action === "edit-card") {
          return (
            <div className="col-12 col-md-10 min-vh-100 col-edit-card ">
              <AddCard isEdit={true} />
            </div>
          );
        }
        if (action === "analytics") {
          return (
            <div className="col-12 col-md-10 min-vh-100 py-30 profile-collection-analytics--mobile">
              <CollectionAnalytics collection={"all"} />
            </div>
          );
        }
        if (type === "analytics") {
          //@ts-ignore
          return (
            <div className="col-12 col-md-10 min-vh-100 py-30 profile-collection-analytics--mobile">
              <CollectionAnalytics collection={action} />
            </div>
          );
        }
        if (type !== undefined) {
          //@ts-ignore
          return (
            <div className="col-12 col-md-10 min-vh-100">
              <CardListCollection isSelectCard={true} isEditCard={true} collection={action} />
            </div>
          );
        }
        return (
          <div className="col-12 col-md-10 min-vh-100 container-collection">
            <Collection key={"collections"} userId={userInfo?.userid} />
          </div>
        );
      case "collections":
        collectionsRef &&
          collectionsRef.current &&
          collectionsRef?.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        if (action === "add-card") {
          return (
            <div className="col-12 col-md-10 min-vh-100 col-edit-card ">
              <AddCard />
            </div>
          );
        }
        if (action === "edit-card") {
          return (
            <div className="col-12 col-md-10 min-vh-100 col-edit-card ">
              <AddCard isEdit={true} />
            </div>
          );
        }
        // if(action ==="analytics") {
        //   return <div className="col-12 col-md-10 min-vh-100 py-30 profile-collection-analytics--mobile"><CollectionAnalytics collection={"all"} /></div>
        // }
        // if (type === "analytics") {
        //   return <div className="col-12 col-md-10 min-vh-100 py-30 profile-collection-analytics--mobile"><CollectionAnalytics collection={action} /></div>
        // }
        if (type !== undefined) {
          //@ts-ignore
          return (
            <div className="col-12 col-md-10 min-vh-100">
              <CardListCollection isSelectCard={true} isEditCard={true} collection={action} />
            </div>
          );
        }
        return (
          <div className="col-12 col-md-10 min-vh-100 container-collection">
            <Collection key={"collections"} userId={userInfo?.userid} />
          </div>
        );
      case "wishlists":
        wishlistRef && wishlistRef.current && wishlistRef?.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        if (type) {
          //@ts-ignore
          return (
            <div className="col-12 col-md-10 min-vh-100 container-collection">
              <CardListCollection isSelectCard={true} title="wishlist" table="wishlist" isEditCard={false} collection={action} />
            </div>
          );
        }
        return (
          <div className="col-12 col-md-10 min-vh-100 container-collection">
            <Collection title="wishlist" key={"wishlists"} isAnalytics={false} userId={userInfo?.userid} table="wishlist" />
          </div>
        );
      case "market":
        return (
          <div className="col-12 col-md-10 min-vh-100">
            <Collection />
          </div>
        );
      case "analytics":
        return (
          <div className="col-12 col-md-10 min-vh-100 container-collection">
            <CollectionAnalytics />
          </div>
        );
      case "friends":
        friendtRef && friendtRef.current && friendtRef.current.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        if (action) {
          return (
            <div className="col-12 col-md-10 min-vh-100 container-collection">
              <FriendDetail userId={Number(action)} />
            </div>
          );
        }
        return <Friends />;
      case "messages":
        messageRef && messageRef.current && messageRef.current.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        return <Messages userId={Number(action)} />;
      case "settings":
        settingRef && settingRef.current && settingRef.current.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        const checkData = [undefined, "account", "security", "confidentiality"];
        //@ts-ignore
        if (checkData.includes(action)) {
          return (
            <div className="col-12 col-md-10 min-vh-100">
              <Settings />
            </div>
          );
        }
        return router.push("/404");
      case "help":
        findCardRef && findCardRef.current && findCardRef.current.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        return <ReportCard />;
      case "api":
        apiRef && apiRef.current && apiRef.current.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        return <RequestAPI />;
      default:
        return (
          <div className="col-12 col-md-10 min-vh-100">
            <Personal isFriend={false} />
          </div>
        );
    }
  };

  const renderClass = (pageName: string) => {
    if (pageName === "collections" && page === "portfolio") {
      return `title-menu active`;
    }
    return `title-menu ${Boolean(page === pageName) && "active"}`;
  };

  const renderRefMenu = () => {
    //@ts-ignore
    if (width < 768) {
      switch (page) {
        case "personal":
          return profileRef && profileRef.current && profileRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        case "collections":
          return (
            collectionsRef &&
            collectionsRef.current &&
            collectionsRef?.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
          );
        case "wishlists":
          return (
            wishlistRef && wishlistRef.current && wishlistRef?.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
          );
        case "market":
        case "analytics":
        case "friends":
          return friendtRef && friendtRef.current && friendtRef.current.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        case "messages":
          return messageRef && messageRef.current && messageRef.current.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        case "settings":
          return settingRef && settingRef.current && settingRef.current.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        case "help":
          return findCardRef && findCardRef.current && findCardRef.current.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        case "api":
          return apiRef && apiRef.current && apiRef.current.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        default:
      }
    }
  };
  const gotoMenu = (pageName: string) => {
    setCurrentPage(pageName);
    router.push(`/profile/${pageName}`);
  };

  const hideMenu = (pageName: string) => {
    switch (router.pathname) {
      case "/profile/settings":
        return "hide-menu";

      case "/profile/settings/account":
        return "hide-menu";

      case "/profile/settings/security":
        return "hide-menu";

      case "/profile/settings/confidentiality":
        return "hide-menu";

      default:
        break;
    }

    const list_route = ["/profile/portfolio/:id/analytics", "/profile/portfolio/:id/:name", "/profile/portfolio/edit-card"];

    for (let i = 0; i < list_route.length; i++) {
      let match = true;
      if (match) {
        return "hide-menu";
      }
    }
  };

  var timerid: any = null;

  useEffect(() => {
    if (timerid) clearTimeout(timerid);
    timerid = setTimeout(() => {
      renderRefMenu();
    }, 550);
  }, [page]);
  return (
    <div className="container-fluid page-profile">
      <div className="row">
        <div className={`col-12 col-md-2 p-3 border-end pt-5 page-profile-list ${hideMenu(currentPage)}`}>
          <div className="profile-menu">
            <div onClick={() => gotoMenu("personal")} className={renderClass("personal")}>
              <span className="icon">
                <img src={page === "personal" ? IconUserProfileActive : IconUserProfile} alt="Profile" title="Profile" />
              </span>
              <span className="profile-menu-text" ref={profileRef}>
                Profile
              </span>
            </div>
            <div onClick={() => gotoMenu("portfolio")} className={renderClass("collections")}>
              <span className="icon">
                <img
                  src={page === "collections" || page === "portfolio" ? IconCollectionProfileActive : IconCollectionProfile}
                  alt={t("portfolio.text_upper")}
                  title={t("portfolio.text_upper")}
                />
              </span>
              <span className="profile-menu-text" ref={collectionsRef}>
                {t("portfolio.text_upper")}
              </span>
            </div>
            <div onClick={() => gotoMenu("wishlists")} className={renderClass("wishlists")}>
              <span className="icon">
                <img src={page === "wishlists" ? IconHeartProfileActive : IconHeartProfile} alt="Wishlists" title="Wishlists" />
              </span>
              <span className="profile-menu-text" ref={wishlistRef}>
                Wishlists
              </span>
            </div>
            <div onClick={() => gotoMenu("friends")} className={renderClass("friends")}>
              <span className="icon">
                <img src={page === "friends" ? IconFriendProfileActive : IconFriendProfile} alt="Friends" title="Friends" />
              </span>
              <span className="profile-menu-text" ref={friendtRef}>
                Friends
              </span>
            </div>
            <div onClick={() => gotoMenu("messages")} className={renderClass("messages")}>
              <span className="icon">
                <img src={page === "messages" ? IconMessageProfileActive : IconMessageProfile} alt="Messages" title="Messages" />
              </span>
              <span className="profile-menu-text" ref={messageRef}>
                Messages
              </span>
            </div>
            {/* <div onClick={() => gotoMenu("market")} className={renderClass("market")}>
              <span className="icon">
                <img src={IconMessageProfile} alt="Market" title="" />
              </span>
              <span className="profile-menu-text"> Market </span>
            </div> */}
            <hr className="hr-color-profile" />
            <div onClick={() => gotoMenu("settings")} className={renderClass("settings")}>
              <span className="icon">
                <img src={page === "settings" ? IconSettingProfileActive : IconSettingProfile} alt="Settings" title="Settings" />
              </span>
              <span className="profile-menu-text" ref={settingRef}>
                Settings
              </span>
            </div>
            <div onClick={() => gotoMenu("help")} className={renderClass("help")}>
              <span className="icon">
                <img src={page === "help" ? IconCartProfileActive : IconCartProfile} alt="Can't find a card?" title="Can't find a card?" />
              </span>
              <span className="profile-menu-text" ref={findCardRef}>
                Can't find a card?
              </span>
            </div>
            <div onClick={() => gotoMenu("api")} className={renderClass("api")}>
              <span className="icon">
                <img src={page === "api" ? IconCloudProfileActive : IconCloudProfile} alt="API" title="API" />
              </span>
              <span className="profile-menu-text" ref={apiRef}>
                API
              </span>
            </div>
          </div>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default ProfileType;
