import React, { useState } from 'react';
import { api } from 'configs/axios';
import CollectionList, { DataCollectionType } from "components/profile/collection/collectionList"
import { ManageCollectionType } from "interfaces"
import {  PgAppProfileType } from "interfaces"
import { useRouter } from 'next/router'
import { isEmpty } from 'lodash';
import { useSelector } from 'react-redux';
import Selectors from 'redux/selectors';

type PropTypes = {
  isButtonRight?: boolean,
  isEdit?: boolean,
  userId?: number,
  gotoCard?: (item: ManageCollectionType) => void,
  table?: string,
  isAnalytics?: boolean,
  title?: string,
  isProfileFriend?: boolean,
  dataProfileFriend?: [],
  profileFriend?: PgAppProfileType | undefined,
}

const ProfileCollection = ({ title = "collection", isAnalytics = true, table = "portfolio", gotoCard, userId, isButtonRight = true, isEdit = true, isProfileFriend = false, dataProfileFriend = [], profileFriend = undefined }: PropTypes) => {
  const [collections, setCollections] = useState<DataCollectionType>({
    data: [],
    isLoading: true
  });
  const [profileDataFriend, setProfileDataFriend] = useState<PgAppProfileType | undefined>();
  const router = useRouter();
  const { loggingIn, userInfo } = useSelector(Selectors.auth);
  const getData = async () => {
    try {
      if(isProfileFriend) {
        const params = {
          profileid: userId
        }
        const res = await api.v1.authorization.getUserInfo(params);
        if (res.success) {
          setProfileDataFriend(res.data);
          if(title === "collection") {
            setCollections({
              data: res.data.portfolio_data,
              isLoading: false,
            })
          } else {
            setCollections({
              data: res.data.wishlist_data,
              isLoading: false,
            })
          }
        }
        if (!res.success) {
          // @ts-ignore
          if (res.data?.verify_redirect) {
            router.push('/verify-email')
          }
        }
      } else {
        const params = {
          table: table,
          user_id: loggingIn ? userId : (!isEmpty(router.query.page) && Boolean(Number(router.query.page)) ? +router.query.page : userId)
        }
        const result = await api.v1.collection.getManageCollections(params);
        if (result.success) {
          setCollections({
            data: result.data,
            isLoading: false,
          })
        }
        if (!result.success) {
          // @ts-ignore
          if (result.data?.verify_redirect) {
            return router.push('/verify-email')
          }
        }
      }
     
    }
    catch (err: any) {
      setCollections({
        data: [],
        isLoading: false
      });
      if(err?.response?.status === 403) {
        return router.push('/verify-email')
      }
    }
  }

  React.useEffect(() => {
    getData();
  }, [])

  return (
    <div>
      <CollectionList
        title={title}
        isEdit={isEdit}
        isButtonRight={isButtonRight}
        collections={collections}
        setCollections={setCollections}
        getData={getData}
        gotoCard={gotoCard}
        table={table}
        isAnalytics={isAnalytics}
        profileFriend={profileDataFriend ?? profileFriend}
      />
    
    </div>
  );
}

export default ProfileCollection;
