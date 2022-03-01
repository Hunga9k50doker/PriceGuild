import React, { useState } from 'react';
import { api } from 'configs/axios';
import CollectionList, { DataCollectionType } from "components/profile/collection/collectionList"
import { ManageCollectionType } from "interfaces"
import {  PgAppProfileType } from "interfaces"
import { useHistory } from "react-router-dom";

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
  const history = useHistory();

  const getData = async () => {
    try {
      if(isProfileFriend) {
        const params = {
          profileid: userId
        }
        const res = await api.v1.authorization.getUserInfo(params);
        if (res.success) {
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
            history.push('/verify-email')
          }
        }
      } else {
        const params = {
          table: table,
          user_id: userId
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
            return history.push('/verify-email')
          }
        }
      }
     
    }
    catch (err) {
      console.log(err)
      setCollections({
        data: [],
        isLoading: false
      })
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
        profileFriend={profileFriend}
      />
    
    </div>
  );
}

export default ProfileCollection;
