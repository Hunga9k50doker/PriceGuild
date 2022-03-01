import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Selectors from 'redux/selectors';
import { api } from 'configs/axios';
import { PgAppProfileType } from "interfaces"
import { useHistory } from "react-router-dom";
import UserDetail from 'components/profile/personal/userDetail';

type PropTypes = {
  isFriend?: boolean
}

const Personal = ({ isFriend = false }: PropTypes) => {
  const { userInfo } = useSelector(Selectors.auth);
  const history = useHistory();
  const onTabDetail = (value: string) => {
    switch (value) {
      case "collection":
        history.push("/profile/collections")
        break;
      default:
        history.push("/profile/wishlists")
    }
  }
  return (
    <div>
      <UserDetail onTabDetail={onTabDetail} userId={userInfo?.userid} isFriend={isFriend} />
    </div>
  );
}

export default Personal;
