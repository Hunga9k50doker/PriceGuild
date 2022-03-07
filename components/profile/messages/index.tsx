/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MessagesAction } from "redux/actions/messages_action";
import Selectors from "redux/selectors";
import { GroupMessage, IMessage, UserMessageType } from "interfaces";
import moment from "moment";
import { isEmpty } from "lodash";
import SlectUser from "components/select/selectUser";
import { api } from "configs/axios";
import { MetaData } from "utils/constant";
import { ToastSystem } from "helper/toast_system";
import { firestore } from "firebase";
import { useRouter } from 'next/router'

type PropTypes = {
  userId?: number;
};

type MessageType = {
  uid_1?: string | number;
  uid_2?: string | number;
};

const Messages = ({ ...props }: PropTypes) => {
  const dispatch = useDispatch();
  const { users, conversations } = useSelector(Selectors.message);
  const db = firestore();
  const { userInfo } = useSelector(Selectors.auth);
  const contentRef = useRef<HTMLDivElement>(null);
  const [userId, setUserId] = useState<number | undefined>(props.userId);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const [userMessage, setUserMessage] = useState<UserMessageType | undefined>();
  const [startMessage, setStartMessage] = useState<boolean | undefined>();
  const [userData, setUserData] = useState<UserMessageType[] | undefined>();
  const [messageData, setMessageData] = useState<MessageType>();
  const router = useRouter();

  React.useEffect(() => {
    if(userInfo && !userInfo?.activated) {
      router.push('/verify-email');
      return;
    }
    dispatch(MessagesAction.getListUserMessages());
  }, []);

  React.useEffect(() => {
    if (users !== undefined) {
      setUserData([...users]);
      if (userId) {
        const userFind = users?.find((item) => item.user_id === userId);
        if (isEmpty(users) || !userFind) {
          selectUser({ id: userId }, true);
        } else {
          initChat(userFind);
        }
        setUserId(undefined);
      }
    }
  }, [users]);

  React.useEffect(() => {
    if (messageData) {
      const unsubscribe = db
        .collection("conversations")
        .where("user_uid_1", "in", [messageData?.uid_1, messageData?.uid_2])
        .orderBy("createdAt", "asc")
        .onSnapshot((querySnapshot) => {
          const conversations: GroupMessage[] = [];
          let currentDate: Date = new Date(Date.now());

          querySnapshot.forEach((doc) => {
            let itemData = doc.data();

            if (
              (itemData.user_uid_1 === messageData?.uid_1 &&
                itemData.user_uid_2 === messageData?.uid_2) ||
              (itemData.user_uid_1 === messageData?.uid_2 &&
                itemData.user_uid_2 === messageData?.uid_1)
            ) {
              //Type message item
              let _message: IMessage = {
                user_uid_1: itemData.user_uid_1,
                user_uid_2: itemData.user_uid_1,
                isView: itemData.isView,
                message: itemData.message,
                date: new Date(itemData.createdAt.seconds * 1000),
              };

              ///Nếu date current khác với next date thì là group mới
              // ||
              //Case group message đang rỗng
              if (
                (currentDate.getTime() / 86400000).toFixed(0) !==
                (_message.date.getTime() / 86400000).toFixed(0) ||
                conversations.length === 0
              ) {
                currentDate = _message.date;
                conversations.push({ messages: [_message], date: currentDate });
              } else {
                conversations[conversations.length - 1].messages.push(_message);
              }
            }
          });

          dispatch(MessagesAction.updateConversations(conversations));
        });
      return unsubscribe;
    }
  }, [messageData]);

  const initChat = (user: UserMessageType) => {
    setUserMessage(user);
    setMessageData({ uid_1: userInfo?.userid, uid_2: user.user_id });
    // dispatch(MessagesAction.getRealtimeConversations({ uid_1: userInfo?.userid, uid_2: user.user_id }, dispatch));
  };

  React.useEffect(() => {
    if (contentRef) {
      contentRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    if (conversations?.length) {
      const conversation = conversations[conversations.length - 1];
      let listUser = [...(users ?? [])];
      // @ts-ignore
      listUser = listUser?.map((item) =>
        item.user_id === userMessage?.user_id
          ? {
            ...item,
            updated_at: conversation.messages[conversation.messages.length - 1].date,
            sent_user_id: conversation.messages[conversation.messages.length - 1].user_uid_1,
            body: conversation.messages[conversation.messages.length - 1].message,
          }
          : item
      );
      dispatch(MessagesAction.updateListUserMessages(listUser));
    }
  }, [conversations]);

  const removeMessage = async () => {
    try {
      const result = await api.v1.messages.removeThread({
        threadid: userMessage?.thread_id,
      });
      if (result.success) {
        const msgObj = {
          uid_1: userInfo.userid,
          uid_2: userMessage?.user_id,
        };
        dispatch(MessagesAction.removeMessages(msgObj));
        dispatch(
          MessagesAction.updateListUserMessages(
            (users ?? []).filter(
              (item) => item.user_id !== userMessage?.user_id
            )
          )
        );
        setUserMessage(undefined);
      }
    } catch (err) { }
  };

  const submitMessage = () => {
    const message = inputRef?.current?.value;
    const msgObj = {
      user_uid_1: userInfo.userid,
      user_uid_2: userMessage?.user_id,
      message,
    };
    if (message !== "") {
      api.v1.messages.messagesReplyInThread({
        threadid: userMessage?.thread_id,
        message,
      });
      dispatch(MessagesAction.sendMessages(msgObj));
      // @ts-ignore
      document.getElementById("inputRef").value = "";
    }
  };

  const handleKeyBoard = (evt: any) => {
    if (evt.charCode === 13 && !evt.shiftKey) {
      submitMessage();
    }
  };

  const selectUser = async (user: any, isPush: boolean = false) => {
    const body = {
      recipients: [user?.id],
      subject: "",
      message: "",
    };
    const result = await api.v1.messages.messagesStartNewThread(body);
    if (result.success) {
      setUserMessage(result.data);
      dispatch(
        MessagesAction.getRealtimeConversations(
          { uid_1: userInfo?.userid, uid_2: result.data.user_id },
          dispatch
        )
      );
      if (!isPush) {
        dispatch(MessagesAction.updateListUserMessages([result.data]));
      } else {
        dispatch(
          MessagesAction.updateListUserMessages([...(users ?? []), result.data])
        );
      }
      setStartMessage(undefined);
    } else {
      ToastSystem.error(result.error);
    }
  };
  const onSearchUser = (value: any) => {
    const userFind =
      users?.filter((e) =>
        e.full_name.toLowerCase().includes(value?.target?.value.toLowerCase())
      ) ?? [];
    setUserData([...userFind]);
  };

  const onCloseSearch = () => {
    setUserData([...(users ?? [])]);
    // @ts-ignore
    document.getElementById("input-search").value = "";
  };

  const userAction = async (action: string) => {
    try {
      const params = {
        action,
        other_user: userMessage?.user_id,
      };
      const result = await api.v1.friends.friendActions(params);
      if (result.success) {
        dispatch(
          MessagesAction.updateListUserMessages(
            users?.filter((item) => item.user_id !== userMessage?.user_id) ?? []
          )
        );
        dispatch(MessagesAction.updateConversations([]));
        setUserMessage(undefined);
      }
      if (!result.success) {
        // @ts-ignore
        if (result.data?.verify_redirect) {
          return router.push('/verify-email')
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="col-12 col-md-10 min-vh-100">
      <div className="text-center mt-5 mb-5 coming-soon">Coming Soon</div>
      {/* <div className="row messages">
        <div className="col-3 mt-2 pe-0">
          <div className="ps-2 d-flex justify-content-between align-items-center">
            <div className="search">
              <i className="fa fa-search" />
              <input
                id="input-search"
                onBlur={onCloseSearch}
                onChange={onSearchUser}
                type="text"
                className="form-control"
                placeholder="Search"
              />
            </div>
            <div>
              <button type="button" className="mx-2 btn btn-secondary">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.49052 2.91367L3.4904 2.91367C2.06042 2.91529 0.901619 4.07409 0.9 5.50408V5.50419L0.9 18.4845L0.9 18.4846C0.901619 19.9146 2.06042 21.0734 3.4904 21.075H3.49052H17.4668H17.4669C18.8969 21.0734 20.0557 19.9146 20.0573 18.4846V18.4845V14.0616C20.0573 13.7313 19.7896 13.4635 19.4592 13.4635C19.1289 13.4635 18.8611 13.7313 18.8611 14.0616V18.4841C18.8602 19.254 18.2365 19.8778 17.4667 19.8786H3.49061C2.72084 19.8778 2.09717 19.2541 2.09621 18.4842C2.09621 18.4842 2.09621 18.4842 2.09621 18.4841V5.50431C2.09621 5.50427 2.09621 5.50424 2.09621 5.50421C2.09717 4.73459 2.72083 4.11079 3.49064 4.10988H7.91313C8.24349 4.10988 8.51124 3.84213 8.51124 3.51178C8.51124 3.18164 8.24351 2.91367 7.91313 2.91367L3.49052 2.91367Z"
                    fill="black"
                    stroke="black"
                    strokeWidth="0.2"
                  />
                  <path
                    d="M6.46414 15.6134L6.46403 15.6133C6.31179 15.4608 6.25309 15.2384 6.31078 15.0307L6.46414 15.6134ZM6.46414 15.6134C6.61663 15.7657 6.83902 15.8243 7.04672 15.7668L7.04675 15.7668L11.2657 14.598C11.3652 14.5705 11.4558 14.5177 11.5289 14.4445L11.463 14.3786L11.529 14.4445L20.4152 5.55787L20.4153 5.55779C21.3283 4.6428 21.3283 3.16156 20.4153 2.24657L20.4152 2.24649L19.8307 1.66199C18.9163 0.747564 17.4338 0.747564 16.5194 1.66199L7.63288 10.5485C7.55975 10.6216 7.50695 10.7123 7.47938 10.8118L6.3108 15.0306L6.46414 15.6134ZM19.1119 5.16965L16.9076 2.96533L17.3653 2.50778L17.3653 2.50777C17.8125 2.06058 18.5376 2.06058 18.9848 2.50777L18.9848 2.50778L19.5694 3.09216C19.5694 3.09219 19.5694 3.09222 19.5695 3.09225C20.0159 3.54005 20.0159 4.26463 19.5694 4.71219L19.1119 5.16965ZM11.1343 13.1471L8.93033 10.943L16.0618 3.81128L18.266 6.01542L11.1343 13.1471ZM7.74574 14.3319L8.37095 12.0751L10.0023 13.7067L7.74574 14.3319Z"
                    fill="black"
                    stroke="black"
                    strokeWidth="0.2"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="customScroll list-user mt-4 cursor-pointer">
            {userData?.map((user, key) => (
              <div
                onClick={() => initChat(user)}
                key={key}
                className={`${userMessage?.user_id === user.user_id ? "active" : ""
                  } px-2 user py-2 d-flex justify-content-between align-items-center`}
              >
                <div className="col-8 d-flex">
                  <div className="avatar me-2">
                    <div
                      style={{
                        height: 42,
                        width: 42,
                        backgroundColor: "#b4b4b4",
                      }}
                      className="rounded-circle"
                    ></div>
                  </div>
                  <div className="content-user text-ellipsis text-nowrap">
                    <div className="fs16 fw-bold text-ellipsis">
                      {user.full_name}
                    </div>
                    <div className="text-ellipsis">
                      {user?.body ? (
                        <>
                          {user?.sent_user_id === userInfo.userid
                            ? `You: ${user?.body}`
                            : user?.body}
                        </>
                      ) : (
                        "\u00A0"
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-4 mt-4 d-flex justify-content-end align-items-center">
                  <span className="fs10" style={{ color: "#BBBBBB" }}>
                    {moment(user.updated_at).fromNow()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="ps-0 col-9">
          <div className="content-message">
            {userMessage && (
              <div className="mt-2 border-bottom header-messages d-flex justify-content-between align-items-center">
                <div className="px-2 user py-2 d-flex justify-content-between align-items-center">
                  <div className="avatar me-2">
                    <div
                      style={{
                        height: 42,
                        width: 42,
                        backgroundColor: "#ececec",
                      }}
                      className="rounded-circle"
                    ></div>
                  </div>
                  <div className="content-user text-ellipsis text-nowrap">
                    <div className="fs16 fw-bold text-ellipsis">
                      {userMessage.full_name}
                    </div>
                    <div className="text-ellipsis">@{userMessage.username}</div>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="search">
                    <i className="fa fa-search" />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search in messages"
                    />
                  </div>
                  <div className="ms-2 menu">
                    <div className="dropdown">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="btn btn-secondary dropdown-toggle"
                        type="button"
                        id="dropdownMenuButton2"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i className="fa fa-ellipsis-h" aria-hidden="true" />
                      </button>
                      <ul
                        className="dropdown-menu"
                        aria-labelledby="dropdownMenuButton2"
                      >
                        <li>
                          <span
                            onClick={(e) =>
                              userAction(MetaData.friend_actions.block_user)
                            }
                            className="dropdown-item cursor-pointer"
                          >
                            Block
                          </span>
                        </li>
                        <li>
                          <hr className="dropdown-divider m-0" />
                        </li>
                        <li>
                          <span className="dropdown-item cursor-pointer">
                            Report
                          </span>
                        </li>
                        <li>
                          <hr className="dropdown-divider m-0" />
                        </li>
                        <li>
                          <span
                            onClick={removeMessage}
                            className="dropdown-item cursor-pointer"
                          >
                            Remove Chat
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {startMessage === true && (
              <div className="mt-2 border-bottom header-messages d-flex justify-content-between align-items-center">
                <div className="px-2 user py-2 d-flex justify-content-between align-items-center">
                  <div className="avatar me-2">
                    <div
                      style={{ height: 42 }}
                      className="d-flex justify-content-center align-items-center"
                    >
                      To:
                      <SlectUser onChange={selectUser} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div
              className="messages_table customScroll"
              style={{
                backgroundColor: "#D2D2D2",
                height: isEmpty(userMessage)
                  ? "calc(100vh - 130px)"
                  : "calc(100vh - 280px)",
              }}
            >
              {!users?.length &&
                conversations !== undefined &&
                startMessage === undefined && (
                  <div className="h-100 d-flex align-items-center justify-content-center">
                    <div>
                      <h3>You don't have any chats yet</h3>
                      <div className="mt-3 d-flex justify-content-center align-items-center">
                        <button
                          onClick={() => setStartMessage(true)}
                          type="button"
                          className="btn btn-secondary"
                        >
                          Start New Chat
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              {!isEmpty(userMessage) && (
                <div className="pt-2">
                  {conversations?.map((groupMessage, key) => (
                    <>
                      <div className="position-relative">
                        <hr />
                        <div style={{ width: 60, top: "-15px", margin: "auto", right: 0, left: 0, backgroundColor: "#D2D2D2" }} className="text-center position-absolute" >{moment().isSame(groupMessage.date, 'day') ? "Today" : moment(groupMessage.date).format("DD-MM")}</div>
                      </div>


                      {groupMessage.messages.map((mess, indexMess) => (
                        <div
                          key={indexMess}
                          className={`${mess.user_uid_1 !== userInfo.userid
                            ? "justify-content-star"
                            : "justify-content-end"
                            } d-flex align-items-start`}
                        >
                          {mess.user_uid_1 !== userInfo.userid && (
                            <div
                              className="rounded-circle mx-2"
                              style={{
                                height: 28,
                                width: 28,
                                backgroundColor: "#929292",
                              }}
                            ></div>
                          )}
                          <div
                            className={`${mess.user_uid_1 === userInfo.userid ? "me-2" : ""
                              } messageStyle`}
                          >
                            <div>{mess.message}</div>
                            <div className="time-create text-end">
                              {moment(mess.date).format("h:mm A")}
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  ))}
                </div>
              )}
              <div ref={contentRef} />
            </div>
            {!isEmpty(userMessage) ? (
              <div className="chatControls">
                <textarea
                  className="input-send"
                  ref={inputRef}
                  onKeyPress={handleKeyBoard}
                  id="inputRef"
                  placeholder="Enter your message here..."
                />
                <button
                  onClick={submitMessage}
                  type="button"
                  className="me-2 btn btn-secondary"
                >
                  Send
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default React.memo(Messages);
