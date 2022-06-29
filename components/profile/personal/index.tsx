import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Selectors from 'redux/selectors';
import { api } from 'configs/axios';
import { PgAppProfileType } from "interfaces"
import { useRouter } from 'next/router'
import UserDetail from 'components/profile/personal/userDetail';

type PropTypes = {
  isFriend?: boolean
}

const Personal = ({ isFriend = false }: PropTypes) => {
  const { userInfo } = useSelector(Selectors.auth);
  const router = useRouter();
  const onTabDetail = (value: string) => {
    switch (value) {
      case "collection":
        router.push("/profile/portfolio")
        break;
      default:
        router.push("/profile/wishlists")
    }
  }
  return (
    <div>
      <UserDetail onTabDetail={onTabDetail} userId={userInfo?.userid} isFriend={isFriend} />
    </div>
  );
}

export default Personal;
