import React, { useState, useEffect } from 'react';
import { UserInfoType, PgAppProfileType } from "interfaces"
import { MetaData } from "utils/constant";
import { ToastSystem } from "helper/toast_system";
import { api } from 'configs/axios';
import { useSelector } from 'react-redux';
import Selectors from 'redux/selectors';
import { useRouter } from 'next/router'
import {userClass} from "utils/constant"
import userPicture from "assets/images/user-picture.svg";
import Skeleton from 'react-loading-skeleton'
import { useTranslation } from "react-i18next";

type PropTypes = {
  friend?: PgAppProfileType,
  isFriend?: boolean,
  sendMessage?: () => void,
  onTabDetail?: (tab: string) => void,
  tabDetail?: TabType,
  userId?: number,
  isCollectionCard?: boolean
}

type TabType = {
  status: boolean,
  name: string,
  action?: any,
}
type ParamTypes = {
	friendId?: string,
}

const HeaderUser = ({ friend, isFriend, ...props }: PropTypes) => {
  const router = useRouter();
  const { loggingIn } = useSelector(Selectors.auth);
  const {friendId, page} = router.query;
  const [profile, setProfile] = useState<PgAppProfileType | undefined>();
  const [t, i18n] = useTranslation("common");
  const getUserDetail = async () => {
    try {
      const params = {
        profileid: Number(friendId ?? page)
      }
      const res = await api.v1.authorization.getUserInfo(params);
      if (res.success) {
        return setProfile(res.data)
      }
      if (!res.success) {
        // @ts-ignore
        if (res.data?.verify_redirect) {
          router.push('/verify-email')
        }
      }
    } catch (error: any) {
      if(error?.response?.status === 403) {
        return router.push('/verify-email')
      }
      console.log("error........", error);
    }
  }
  React.useEffect(() => {
    if (friendId || page) {
      getUserDetail()
    }
  }, [friendId, page])

  const sendMessage = () => {
    props.sendMessage && props.sendMessage()
  }

  const addFriend = async () => {
    if (!loggingIn) {
      ToastSystem.error("Please login to continue");
      return router.push("/login")
    }
    try {
      const params = {
        action: MetaData.friend_actions.request_friend,
        other_user: props.userId
      }
      const result = await api.v1.friends.friendActions(params)
      if (result.success) {
        return ToastSystem.success(result.message);
      }
      if (!result.success) {
        // @ts-ignore
        if (result.data?.verify_redirect) {
          return router.push('/verify-email')
        }
      }
    }
    catch (err:any) {
      if(err?.response?.status === 403) {
        return router.push('/verify-email')
      }
      console.log(err)
    }
  }
  const { userInfo } = useSelector(Selectors.auth);
  // console.log(friend, 'friend');/
  return (
    <div className="info-user mt-2">
      <div className="d-lg-flex justify-content-between align-items-center">
        <div className="d-sm-flex justify-content-between align-items-center">
          <div className="avatar-user">
            <div style={{ height: 42, width: 42 }} className="rounded-circle">
            <img className="w-100" src={ friend?.user_info?.avatar ? `${process.env.REACT_APP_IMAGE_URL}${friend?.user_info?.avatar}` : userPicture}  data-src="holder.js/171x180" alt={friend?.user_info?.username} data-holder-rendered="true" />
            </div>
            <div>
              <div className="fw-bold">{friend?.user_info?.full_name}</div>
              <div>@{friend?.user_info?.username}</div>
            </div>
          </div>
          <ul className="tab">
            <li onClick={() => {
              props.onTabDetail && props.onTabDetail("collection")
              // @ts-ignore
            }} className={`${["collection", "card-collection"].includes(props?.tabDetail?.name) ? "active" : ""} cursor-pointer`}>
              { friend?.portfolio_data ? <span>{friend?.portfolio_data.length ?? 0} </span> : <span><Skeleton style={{ width: 10 }} /></span> }
              {t('portfolio.text')}
            </li>
            <li onClick={() => {
                props.onTabDetail && props.onTabDetail("wishlist")
                // @ts-ignore
              }} className={`${["wishlist", "card-wishlist"].includes(props?.tabDetail?.name) ? "active" : ""} cursor-pointer`}>
               { friend?.wishlist_data ? <span>{friend?.wishlist_data.length ?? 0} </span> : <span><Skeleton style={{ width: 10 }} /></span>}
              Wishlists
            </li>
            {/* {
              Boolean( userInfo?.userid.toString() === friendId || userInfo?.userid.toString() === page) &&
              <li onClick={() => { 
                props.onTabDetail && props.onTabDetail("friend")
              }} className={`${props?.tabDetail?.name === "friend" ? "active" : ""} cursor-pointer`}>
                <span>3</span> Friends
              </li>
            }
            */}
          </ul>
        </div>
        {/*
          props.tabDetail && props.tabDetail.name !== "card-collection" &&
          <div className="group-button">
            {isFriend === false && <button onClick={addFriend} type="button" className="btn btn-secondary">Add to Friends</button>}
            <button onClick={sendMessage} type="button" className="ms-2 btn btn-secondary">Send Message</button>
          </div>
        */}
      
      </div>
    </div>
  );
}

export default React.memo(HeaderUser);
