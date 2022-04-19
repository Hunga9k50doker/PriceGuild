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
      const params = {
        table: table,
        user_id: loggingIn ? userId : (!isEmpty(router.query.page) && Boolean(Number(router.query.page)) ? +router.query.page : userId)
      }
      const result = await api.v1.collection.getManageCollections(params); console.log(result, 'result');
      let dataCollections: Array<ManageCollectionType> = []; 
      //@ts-ignore
      if (result?.show_all_cards_folder) {
          
        let itemAllCard = {
          group_ref: 0,
          group_name: "All Cards",
          type: 0,
          //@ts-ignore
          unique_card: result?.all_cards_count.unique_card,
          //@ts-ignore
          total_card: result?.all_cards_count.total_card,
          claim: 0
        }
        dataCollections.push(itemAllCard);
      }
      
      dataCollections = [...dataCollections, ...result.data];

      if (result.success) {
        setCollections({
          data: dataCollections,
          isLoading: false,
          //@ts-ignore
          showAllCardsFolder: result?.show_all_cards_folder,
          //@ts-ignore
          allCardsCount: result?.all_cards_count
        })
      }
      if (!result.success) {
        // @ts-ignore
        if (result.data?.verify_redirect) {
          return router.push('/verify-email')
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

  React.useEffect(() => {
    console.log(collections, 'collections');
  }, [collections])
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
