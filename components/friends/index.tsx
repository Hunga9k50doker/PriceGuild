import React, {useEffect} from 'react';
import { useRouter } from 'next/router'
import FriendDetail from "components/profile/friends/friendDetail";
import { MyStorage } from "helper/local_storage";
import { AuthActions } from "redux/actions/auth_action";
import {  useDispatch } from 'react-redux';


const FriendUnlogged: React.FC = () => {
    const router = useRouter();
//   const { friendId } = router.query;
    const { page, friendId } = router.query;
  const dispatch = useDispatch();
  useEffect(() => {
    if(MyStorage.user) {
      if(MyStorage.user.userid === 0) {
        dispatch(AuthActions.logout());
      }
    }
  }, [])

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 min-vh-100">
          <div className="friend-unlog page-profile">
            <div className="container-collection">
              <FriendDetail userId={Number(page ?? friendId)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FriendUnlogged;
