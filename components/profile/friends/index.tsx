import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FriendAction } from "redux/actions/friend_action";
import Selectors from 'redux/selectors';
import { FriendType } from "interfaces"
import { api } from 'configs/axios';
import { MetaData } from "utils/constant"
import { ToastSystem } from "helper/toast_system";
import { useRouter } from 'next/router'
import Link from 'next/link'

type PropTypes = {
  userId?: number,
  isEdit?: boolean,
}

const Friends = ({ isEdit = true, ...props }: PropTypes) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector(Selectors.auth);
  // @ts-ignore
  const { friends, requests, blocked, requests_sent } = useSelector(Selectors.friend);
  const [friendsState, setFriendsState] = useState<FriendType[]>();
  const [requestsState, setRequestsState] = useState<FriendType[]>();
  const [blockedState, setBlockedState] = useState<FriendType[]>();
  const router = useRouter();

  React.useEffect(() => {
    // if(userInfo && !userInfo?.activated) {
    //   router.push('/verify-email');
    //   return;
    // }
    dispatch(FriendAction.getListFriend({
      user_id: props?.userId ?? userInfo?.userid
    }))
  }, [])

  const setDataFriend = () => {
    setFriendsState(friends)
    setRequestsState(requests)
    setBlockedState(blocked)
  }

  React.useEffect(() => {
    setDataFriend()
  }, [friends, requests, blocked])

  const actionFriend = async (action: string, friend: FriendType) => {
    try {
      const params = {
        action,
        other_user: friend?.id
      }
      const result = await api.v1.friends.friendActions(params)
      if (result.success) {
        switch (action) {
          case MetaData.friend_actions.accept_friend_request:
          case MetaData.friend_actions.reject_friend_request:
            dispatch(FriendAction.updateListFriend({
              friends: action === MetaData.friend_actions.accept_friend_request ? [...friends, friend] : [...friends],
              requests: requests?.filter(item => item.id !== friend.id),
              blocked,
              requests_sent
            }))
            break
          case MetaData.friend_actions.block_user:
            dispatch(FriendAction.updateListFriend({
              friends: friends?.filter(item => item.id !== friend.id),
              requests,
              blocked: [...blocked, friend],
              requests_sent
            }))
            break;
          case MetaData.friend_actions.delete_friend:
            dispatch(FriendAction.updateListFriend({
              friends: friends?.filter(item => item.id !== friend.id),
              requests,
              blocked,
              requests_sent
            }))
            break
          case MetaData.friend_actions.unblock_user:
            dispatch(FriendAction.updateListFriend({
              friends: [...friends, friend],
              requests,
              blocked: blocked?.filter(item => item.id !== friend.id),
              requests_sent
            }))
            break
          default:
          // code block
        }
        return ToastSystem.success(result.message);
      }
      if (!result.success) {
        // @ts-ignore
        if (result.data?.verify_redirect) {
          return router.push('/verify-email')
        }
      }
    }
    catch (err: any) {
      if(err?.response?.status === 403) {
        return router.push('/verify-email')
      }
      console.log(err)
    }
  }

  const onSearchUser = (value: any) => {
    // @ts-ignore
    const tabIndex = document.getElementById("FriendTabContent");
    // @ts-ignore
    switch (tabIndex.getElementsByClassName("active")[0].id) {
      case "friends":
        const userFind = friends?.filter(e => e.full_name.toLowerCase().includes(value?.target?.value.toLowerCase()));
        setFriendsState(userFind)
        break;
      case "friends-requests":
        const requestFind = requests?.filter(e => e.full_name.toLowerCase().includes(value?.target?.value.toLowerCase()));
        setRequestsState(requestFind)
        break;
      case "blocked":
        const blockedFind = blocked?.filter(e => e.full_name.toLowerCase().includes(value?.target?.value.toLowerCase()));
        setBlockedState(blockedFind)
        break;
      default:
      // code block
    }
  }

  const onCloseSearch = () => {
    // @ts-ignore
    document.getElementById("input-search").value = "";
    setDataFriend()
  }

  const goToFriendDetail = (id: number) => {
    router.push(`/profile/friends/${id}`)
  }

  const sendMessage = (friend: FriendType) => {
    router.push(`/profile/messages/${friend.id}`)
  }

  return (
    <div className="col-12 col-md-10 min-vh-100 friends">
      <div className="text-center mt-5 mb-5 coming-soon">Coming Soon</div>
      {/* {isEdit && <div className="d-flex header-friends border-bottom mt-3 justify-content-between align-items-center"> <ul className="nav nav-tabs" id="FriendTab" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className="nav-link active"
            id="friends-tab"
            data-bs-toggle="tab"
            data-bs-target="#friends"
            type="button" role="tab"
            aria-controls="friends"
            aria-selected="true"
          >
            Friends  ({friends.length})
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="friends-requests-tab"
            data-bs-toggle="tab"
            data-bs-target="#friends-requests"
            type="button"
            role="tab"
            aria-controls="friends-requests"
            aria-selected="false"
          >
            Friends Requests ({requests.length})
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="blocked-tab"
            data-bs-toggle="tab"
            data-bs-target="#blocked"
            type="button"
            role="tab"
            aria-controls="blocked"
            aria-selected="false"
          >
            Blocked Users ({blocked.length})
          </button>
        </li>
      </ul>
        <div className="d-flex align-items-center justify-content-center">
          <div className="search">
            <i className="fa fa-search" />
            <input onBlur={onCloseSearch} onChange={onSearchUser} id="input-search" type="text" className="form-control" placeholder="Search" />
          </div>
          <Link className="ms-2 btn btn-secondary" to={"/profile/settings"}>Edit Profile</Link>
        </div>
      </div>
      }
      <div className="tab-content mt-4" id="FriendTabContent">
        <div className="tab-pane fade show active" id="friends" role="tabpanel" aria-labelledby="friends-tab">
          <div className="row">
            {friendsState?.map((friend, key) =>
              <div onClick={() => isEdit && goToFriendDetail(friend.id)} key={key} className="col-4 cursor-pointer">
                <div className="d-flex justify-content-between align-items-center border rounded p-2">
                  <div className="avatar-user d-flex justify-content-start align-items-center">
                    <div style={{ height: 50, width: 50 }} className="rounded-circle bg-secondary me-1">
                    </div>
                    <div>
                      <div className="fw-bold">{friend.full_name}</div>
                      <div> @{friend.username}</div>
                    </div>
                  </div>
                  {isEdit && <div className="menu-button">
                    <div className="dropdown">
                      <button onClick={(e) => { e.stopPropagation() }} className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">
                        <i className="fa fa-ellipsis-h" aria-hidden="true" />
                      </button>
                      <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton2">
                        <li><span onClick={(e) => {
                          e.stopPropagation();
                          sendMessage(friend)
                        }} className="dropdown-item cursor-pointer">Send Message</span></li>
                        <li><hr className="dropdown-divider m-0" /></li>
                        <li><span onClick={(e) => {
                          e.stopPropagation();
                          actionFriend(MetaData.friend_actions.block_user, friend)
                        }} className="dropdown-item cursor-pointer" >Block</span></li>
                        <li><hr className="dropdown-divider m-0" /></li>
                        <li><span className="dropdown-item cursor-pointer" >Report</span></li>
                        <li><hr className="dropdown-divider m-0" /></li>
                        <li><span onClick={(e) => {
                          e.stopPropagation();
                          actionFriend(MetaData.friend_actions.delete_friend, friend)
                        }} className="dropdown-item cursor-pointer" >Remove from Friends</span></li>
                      </ul>
                    </div>
                  </div>}
                </div>
              </div>)}
          </div>
        </div>
        <div className="tab-pane fade" id="friends-requests" role="tabpanel" aria-labelledby="friends-requests-tab">
          <div className="row">
            {requestsState?.map((friend, key) =>
              <div key={key} className="col-4">
                <div className="border rounded p-2">
                  <div className="avatar-user d-flex justify-content-start align-items-center">
                    <div style={{ height: 50, width: 50 }} className="rounded-circle bg-secondary me-1">
                    </div>
                    <div>
                      <div className="fw-bold">{friend.full_name}</div>
                      <div> @{friend.username}</div>
                    </div>
                  </div>
                  <div className="mt-2 row">
                    <div className="col">
                      <div className="d-grid gap-2">
                        <button onClick={() => actionFriend(MetaData.friend_actions.accept_friend_request, friend)} className="btn btn-primary" type="button">Accept</button>
                      </div>
                    </div>
                    <div className="col">
                      <div className="d-grid gap-2">
                        <button onClick={() => actionFriend(MetaData.friend_actions.reject_friend_request, friend)} className="btn btn-secondary" type="button">Decline</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>)}
          </div>
        </div>
        <div className="tab-pane fade" id="blocked" role="tabpanel" aria-labelledby="blocked-tab">
          <div className="row">
            {blockedState?.map((friend, key) =>
              <div key={key} className="col-4">
                <div className="d-flex justify-content-between align-items-center border rounded p-2">
                  <div className="avatar-user d-flex justify-content-start align-items-center">
                    <div style={{ height: 50, width: 50 }} className="rounded-circle bg-secondary me-1">
                    </div>
                    <div>
                      <div className="fw-bold">{friend.full_name}</div>
                      <div> @{friend.username}</div>
                    </div>
                  </div>
                  <div className="menu-button">
                    <div className="dropdown">
                      <button onClick={(e) => { e.stopPropagation() }} className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">
                        <i className="fa fa-ellipsis-h" aria-hidden="true" />
                      </button>
                      <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton2">
                        <li><span onClick={() => actionFriend(MetaData.friend_actions.unblock_user, friend)} className="dropdown-item cursor-pointer">Unblock</span></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>)}
          </div>
        </div>
      </div> */}



    </div>
  );
}

export default React.memo(Friends);
