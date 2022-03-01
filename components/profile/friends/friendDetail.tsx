import React, { useState } from 'react';
import { UserInfoType, ManageCollectionType, PgAppProfileType } from "interfaces"
import UserDetail from 'components/profile/personal/userDetail';
import HeaderUser from "components/user/headerUser"
import Collection from "components/profile/collection"
import { useHistory } from "react-router-dom";
import CardListCollection from "components/profile/collection/cardListCollection"
import ListFriend from "components/profile/friends"
import { useDispatch } from 'react-redux';
import { FriendAction } from "redux/actions/friend_action";
import { useTranslation } from "react-i18next";

type PropTypes = {
  isFriend?: boolean,
  userId?: number,
}

export type TabType = {
  status: boolean,
  name: string,
  action?: any,
}

const FriendDetail = ({ isFriend = false, userId }: PropTypes) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [friend, setFriend] = useState<UserInfoType>()
  const [isFriendUser, setIsFriendUser] = useState<boolean>()
  const onSuccess = (user: UserInfoType, is_friend: boolean) => {
    setIsFriendUser(is_friend)
    setFriend(user)
  }
  const [tabDetail, setTabDetail] = useState<TabType>({
    status: false,
    name: 'collection',
    action: 0,
  });

  const [profile, setProfile] = useState<PgAppProfileType | undefined>();
  const [t, i18n] = useTranslation("common");
  const onTabDetail = (tab: string) => {
    if (tab === "friend") {
      dispatch(FriendAction.updateListFriend({
        friends: [],
        requests: [],
        blocked: [],
        requests_sent: []
      }))
    }
    setTabDetail({
      status: true,
      name: tab
    })
  }

  const sendMessage = () => {
    history.push(`/profile/messages/${userId}`)
  }

  const gotoCard = (item: ManageCollectionType) => {
    if(item.type === 1){
    setTabDetail({
      status: true,
      name: "card-collection",
      action: item
    })
    }
  }

  const gotoCardWishlist = (item: ManageCollectionType) => {
    if(item.type === 1){
      setTabDetail({
      status: true,
      name: "card-wishlist",
      action: item
    })
    }
    
  }


  const goToCollection = () => {
    setTabDetail({
      status: true,
      name: 'collection',
      action: 0,
    })
  }

  const goToWishlist = () => {
    setTabDetail({
      status: true,
      name: "wishlist"
    })
  }

  const goToProfile = () => {
    setTabDetail({
      status: false,
      name: 'collection',
      action: 0,
    })
  }
  const setFriendCollection = (item:any) => {
    switch(item) {
      case 'collection' : {
        goToCollection();
        break;
      } 
      case 'wishlist' : {
        goToWishlist();
        break;
      }
      default:
        break;
    }
  }

  const renderTab = () => {
    switch (tabDetail.name) {
      case "collection":
        return <Collection profileFriend={profile} isProfileFriend={true}  key={"collection"} gotoCard={gotoCard} isEdit={false} userId={userId} isButtonRight={false} />
      case "wishlist":
        return <Collection profileFriend={profile} isProfileFriend={true} title="wishlist" gotoCard={gotoCardWishlist} key={"wishlists"} isAnalytics={false} userId={userId} isEdit={false} isButtonRight={false} table="wishlist" />
      case "card-collection":
        return <>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a onClick={goToProfile} href="javascript:void(0)">{friend?.full_name}</a></li>
              <li className="breadcrumb-item"><a onClick={goToCollection} href="javascript:void(0)">{ t('portfolio.text')}</a></li>
              <li className="breadcrumb-item active" aria-current="page">{tabDetail?.action?.group_name}</li>
            </ol>
          </nav>
          <CardListCollection setGotoFriend={setFriendCollection} isFriend={true} key="card-collection" userId={`${userId}`} isEditCard={false} collection={`${tabDetail?.action?.group_ref}`} />
        </>
      case "card-wishlist":
        return <>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a onClick={goToProfile} href="javascript:void(0)">{friend?.full_name}</a></li>
              <li className="breadcrumb-item"><a onClick={goToWishlist} href="javascript:void(0)">wishlists</a></li>
              <li className="breadcrumb-item active" aria-current="page">{tabDetail?.action?.group_name}</li>
            </ol>
          </nav>
          <CardListCollection setGotoFriend={setFriendCollection} isFriend={true} key="card-wishlist" title="wishlist" table="wishlist" userId={`${userId}`} isEditCard={false} collection={`${tabDetail?.action?.group_ref}`} />
        </>
      case "friend":
        return <ListFriend isEdit={false} userId={userId} />
      default:
        return <div>
        </div>
    }

  }
  return (
    <>
      {!tabDetail?.status ? <UserDetail sendMessage={sendMessage} onTabDetail={onTabDetail} onSuccess={onSuccess} userId={userId} isFriend={isFriend}  setProfileFriend={setProfile}/> : <>
        <HeaderUser userId={userId} tabDetail={tabDetail} onTabDetail={onTabDetail} sendMessage={sendMessage} isFriend={isFriendUser} friend={friend} />
        {renderTab()}
      </>}
    </>
  );
}

export default React.memo(FriendDetail);
