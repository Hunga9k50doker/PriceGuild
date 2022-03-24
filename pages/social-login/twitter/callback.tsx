import React, { useEffect, useState } from "react";
import queryString from 'query-string';
import { api } from 'configs/axios';
import { useDispatch } from "react-redux";
import { isEmpty } from "lodash";
import { decodeBase64 } from "utils/helper";
import { ToastSystem } from 'helper/toast_system';
import { AuthActions } from "redux/actions/auth_action";
import { MyStorage } from "helper/local_storage";
import { User } from "model/user";
import { useRouter } from 'next/router';

type PropTypes = {
  location: any,
}

const CallbackTwiiter = (props: PropTypes) => {
  
  const router = useRouter();
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (!isEmpty(router.query)) {
      // @ts-ignore 
      const data = decodeBase64(router.query.data)
      registerSocial(JSON.parse(data))
    }
    else {
      router.push("/")
    }
  }, [router.query])

  const registerSocial = async (data: any) => {
    try {
      data.id = data.id.toString()
      const response = await api.v1.authorization.socialLogin(data)
      if (response.success) {
        MyStorage.user = new User(response.data.user_data);
        MyStorage.token = response.data.token;
        dispatch(AuthActions.updateInfo(MyStorage.user));

        let token: any = { userid: response.data.user_data.userid, email: response.data.user_data.email };
        token = btoa(JSON.stringify(token));

        if (isEmpty(response?.data?.user_data?.username) || response?.data?.user_data?.username === "") {
          sessionStorage.setItem('redirect', `/set-username/${token}`);
          return;
        }
        return ToastSystem.success("Login successful");
      }
      ToastSystem.error(response.message);
    }
    catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="container">
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <div className="text-center">
          <div className=" spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <div className="text-center">Callback Twiiter </div>
        </div>
      </div>
    </div>
  );
}

export default CallbackTwiiter;
