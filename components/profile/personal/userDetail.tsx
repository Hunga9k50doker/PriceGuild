import React, { useEffect, useState } from "react";
import { PgAppProfileType, UserInfoType } from "interfaces"
import { formatCurrency } from "utils/helper"
import { sumBy, isEmpty, divide } from "lodash";
import moment from 'moment';
import { api } from 'configs/axios';
import Skeleton from 'react-loading-skeleton'
import { MetaData } from "utils/constant";
import { ToastSystem } from "helper/toast_system";
import { useSelector } from 'react-redux';
import Selectors from 'redux/selectors';
import { useRouter } from 'next/router'
// import { matchPath } from "react-router";
import IconFolderTim from "assets/images/folder_tim.png";
import IconHeartTim from "assets/images/heart_tim.png";
import Progress_bar from 'components/progress-bar';
import ModalProfileLayout from 'components/modal/profileLayout';
import {userClass} from "utils/constant"
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import userPicture from "assets/images/user-picture.svg";
import { MyStorage } from "helper/local_storage";
import { useTranslation } from "react-i18next";

type PropTypes = {
  isFriend: boolean,
  userId?: number,
  onSuccess?: (item: UserInfoType, isFriend: boolean) => void,
  onTabDetail?: (tab: string) => void,
  sendMessage?: () => void,
  setProfileFriend?: (item: PgAppProfileType | undefined) => void,
}

const UserDetail = ({ isFriend = false, userId, onSuccess, onTabDetail, setProfileFriend, ...props }: PropTypes) => {
  const [profile, setProfile] = useState<PgAppProfileType | undefined>()
  const router = useRouter();
  const { loggingIn } = useSelector(Selectors.auth);
  const [isModal, setIsModal] = useState<boolean>(false);
  const [pointlv, setPointLv] = useState<number>(0);
  const [level, setLevel] = useState<string>('');
  const [isUser, setIsUser] = useState<boolean>(false);
  const [t, i18n] = useTranslation("common");
  const getUserDetail = async () => {
    try {
      const params = {
        profileid: userId
      }
      const res = await api.v1.authorization.getUserInfo(params); 
      if (res.success) {
        onSuccess && onSuccess(res.data.user_info, res.data.is_friend);
        setProfileFriend && setProfileFriend(res.data);
        return setProfile(res.data)
      }
      if (!res.success) {
        // @ts-ignore
        if (res.data?.verify_redirect) {
          router.push('/verify-email')
        }
      }
    } catch (error) {
      console.log("error........", error);
    }
  }

  const sendMessage = () => {
    props.sendMessage && props.sendMessage()
  }
  React.useEffect(() => {
    if(MyStorage.user.userid === userId) {
      setIsUser(true);
    }
    // cần check lại
    // const matchPatchRoute = matchPath(history.location.pathname, {
    //   path:  "/profile/personal",
    //   exact: true,
    //   strict: false
    // });
    let matchPatchRoute = true;
    if(matchPatchRoute) {
      setIsUser(true);
    }
    if (userId) {
      getUserDetail()
    }
  }, [userId])
  
  const goToTab = (name: string) => {
    if (Boolean(Number(router.query.page))) {
      return router.push(`/profile/${router.query?.page}/${name === 'collection' ? 'portfolio' : 'wishlists'}`)
    }
    onTabDetail && onTabDetail(name)
    
  }

  const addFriend = async () => {
    if (!loggingIn) {
      ToastSystem.error("Please login to continue");
      return router.push("/login")
    }
    try {
      const params = {
        action: MetaData.friend_actions.request_friend,
        other_user: userId
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
      return ToastSystem.error(result.error);
    }
    catch (err) {
      console.log(err)
    }
  }
  const closeModal = () => {
    setIsModal(false);
  }
  
  useEffect(() => {
    getLevelUser();
  }, [profile]) 
  const getLevelUser = () => {
    let point: number = profile?.user_points ?? 0;
    const e = userClass.filter(function (el) {
    return el.min <= point &&
          el.max > point
    });
    if (!isEmpty(e)) {
      let poi : number = +(e[0]['id'] / 9) * 100;
      
      setPointLv(poi);
      setLevel(e[0]['level']);
    } else {
      setLevel('Beginer')
    }
  }

  const renderTotal = () => {
    if (profile?.total_value_message) {
   return   <OverlayTrigger
     overlay={<Tooltip>{profile?.total_value_message}</Tooltip>}
                   >
                    {({ ref, ...triggerHandler }) => (
                    <span ref={ref} {...triggerHandler}>$--.--</span>
                        )}
                  </OverlayTrigger>
    }
    return profile?.total_value !== 0 ? formatCurrency(profile?.total_value) : formatCurrency(0)
  }
  console.log('userDetail');
  return (
    <div className="content-user-profile d-flex justify-content-center">
      <div className="profile-user w-100 mt-5">
        <div className="text-center">
          <div className="user-image d-flex justify-content-center">
            <div>
              <img className="w-100 border-circle" src={ profile?.user_info.avatar ? `${process.env.REACT_APP_IMAGE_URL}${profile?.user_info.avatar}` : userPicture}  data-src="holder.js/171x180" alt={profile?.user_info?.username} data-holder-rendered="true" />
            </div>
          </div>
          <div className="content-user-profile-title">
            <h4 className="mb-1">{profile?.user_info?.full_name ? profile?.user_info?.full_name : ''}</h4>
            <div className="content-user-profile-name">{profile?.user_info?.username ? `@${profile?.user_info?.username}` : <Skeleton style={{ width: 50 }} />}</div>
            {!isFriend && !isEmpty(profile) && <div className="py-2">
              {/*profile?.is_friend === false && <button onClick={addFriend} type="button" className="btn btn-secondary">Add to Friends</button>*/}
              {/*profile?.is_friend === false && <button type="button" onClick={sendMessage} className="btn btn-secondary ms-3">Send Message</button>*/}
            </div>}
            <div className="content-user-profile-description fz-14 mt-4">{profile?.user_info.bio ?? "\u00A0"}</div>
          </div>
          {profile?.portfolio_data && profile?.wishlist_data ? 
            <div className="d-flex justify-content-center align-items-center mt-4 mb-3 content-user-profile-report">
              <ul>
                <li> {profile?.portfolio_data.length ?? 0} {t('portfolio.text_upper')} </li>
                <li> {profile?.wishlist_data.length ?? 0} Wishlists </li>
                <li> 0 Friends </li>
              </ul>
            </div> :
            <div className="mt-3 mb-3 d-flex justify-content-center align-items-center mt-4 content-user-profile-report">
              <Skeleton style={{ width: 350 }} />
            </div>
          }
          <div className="d-flex justify-content-around  align-items-center content-user-profile-detail border-line cursor-pointer">
            <div className="pe-5">
              {profile ?
                <div className="cursor-pointer" onClick={() => { setIsModal(true)}}>
                  <label className="mb-1 cursor-pointer">{ level }</label>
                  <Progress_bar
                    height={6}
                    bgcolor="linear-gradient(85.65deg, #7909A0 -0.56%, #0B0E61 107.56%)"
                    progress={pointlv}
                  ></Progress_bar>
                </div>
              : <Skeleton style={{ width: 50 }} />}
            </div>
            <ModalProfileLayout data={userClass} your_points={profile?.user_points} upload_points={profile?.upload_count} error_points={profile?.error_count} isOpen={isModal} onClose={() => { closeModal() }}/>
            <div className="ps-5 padt-5">
              {profile ? <><span>Total Value:</span> <strong className="ps-2 letter-space-1">{renderTotal()}</strong> </>: <Skeleton style={{ width: 150 }} />} 
            </div>
          </div>
          {profile?.user_info ?
            <div className="d-flex justify-content-center align-items-center mt-1 fz-14 pt-1 content-user-profile-info">
              {profile?.user_info.location}<i style={{ color: 'rgba(109, 117, 136, 0.35)' }} className="mx-1 fa fs4 fa-circle" aria-hidden="true" /> Member since {moment(profile?.user_info.member_since, "YYYY-MM-DD").format("MMM D, YYYY")}
            </div> : <Skeleton style={{ width: 250 }} />}
        </div>
        <div className="row mt-5 content-user-profile-card">
          <div onClick={() => goToTab("collection")} className="col cursor-pointer " style={{ pointerEvents: (sumBy(profile?.portfolio_data, 'total_card') ?? 0) === 0 && !isUser ? 'none' : 'auto' }}>
            <div className="ms-3 me-3 content-user-profile-card-shadow">
            </div>
            <div className="text-center content-user-profile-card-item p-3">
              <div className="content-user-profile-card-item-icon d-flex align-items-center justify-content-center">
                <div className="icon">
                  <img src={IconFolderTim.src} alt="" />
                </div>
              </div>
              <div style={{ height: "calc(100% - 50px)" }} className="d-flex justify-content-start align-items-end content-user-profile-card-item-detail">
                <div className="text-start text-white ">
                  <h4 className="fz-18 fw-700">{ t('portfolio.text_upper') }</h4>
                  {profile?.portfolio_data ? <div className="fz-14 fw-500">{profile?.portfolio_data.length ?? 0} { t('portfolio.text_upper') }</div> : <div><Skeleton style={{ width: 50 }} /></div> }
                  { profile?.portfolio_data ? <div className="fz-14 fw-500">{sumBy(profile?.portfolio_data, 'total_card') ?? 0} Cards</div> : <div><Skeleton style={{ width: 50 }} /></div> }
                </div>
              </div>
            </div>
          </div>
          <div onClick={() => goToTab("wishlist")} className="col cursor-pointer" style={{ pointerEvents: (sumBy(profile?.wishlist_data, 'total_card') ?? 0) === 0 && !isUser ? 'none' : 'auto' }}>
            <div className="ms-3 me-3 content-user-profile-card-shadow">
            </div>
            <div className="text-center content-user-profile-card-item p-3">
              <div className="content-user-profile-card-item-icon d-flex align-items-center justify-content-center">
                <div className="icon ">
                  <img src={IconHeartTim.src} alt="" />
                </div>
              </div>
              <div  className="d-flex justify-content-start align-items-end content-user-profile-card-item-detail">
                <div className="text-start text-white ">
                   <h4  className="fz-18 fw-700">Wishlists</h4>
                  { profile?.wishlist_data ? <div className="fz-14 fw-500">{profile?.wishlist_data.length ?? 0} Wishlists</div> : <div><Skeleton style={{ width: 50 }} /></div>}
                  { profile?.portfolio_data ?  <div className="fz-14 fw-500">{sumBy(profile?.wishlist_data, 'total_card') ?? 0} Cards</div> : <div><Skeleton style={{ width: 50 }} /></div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(UserDetail);
