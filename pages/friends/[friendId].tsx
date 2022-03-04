import React, {useEffect} from 'react';
import { useRouter } from 'next/router'
import FriendDetail from "components/profile/friends/friendDetail";
import { MyStorage } from "helper/local_storage";
import { AuthActions } from "redux/actions/auth_action";
import {  useDispatch } from 'react-redux';
import FriendUnlogged from 'components/friends'

const FriendInfo: React.FC = () => {

  return (
    <FriendUnlogged />
  );
}

export default FriendInfo;
