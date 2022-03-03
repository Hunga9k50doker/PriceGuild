import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { User } from "model/user";
// @ts-ignore
import { FacebookProvider, Login as LoginFB } from 'react-facebook';
import GoogleLogin from 'react-google-login';
import { api } from 'configs/axios';
import { ToastSystem } from 'helper/toast_system';
import { AuthActions } from "redux/actions/auth_action";
import { MyStorage } from "helper/local_storage";
import { isEmpty } from "lodash"
//@ts-ignore
import AppleSignin from 'react-apple-signin-auth';
import { parseJwt } from "utils/helper"
// @ts-ignore
import MD5 from "crypto-js/md5";
import moment from "moment"
import {is_ios_device} from 'utils/helper';
import { ConfigAction } from "redux/actions/config_action";
import { useRouter } from 'next/router'

type LoginGoogle = {
  googleId: string;
  accessToken: string;
  profileObj: ProfileObj;
  error?: string;
};

type UserFaceBook = {
  id: string;
  name: string;
  email?: string;
  first_name?: string;
  last_name?: string;
};

type ProfileObj = {
  email: string;
  familyName: string;
  givenName: string;
};

type LoginFacebook = {
  profile: UserFaceBook;
  tokenDetail: {
    accessToken: string;
  };
};

type PropTypes = {
  message: string,
  isUpdateUserName ?: boolean,
  isUpdateVerify ?: boolean,
  onUpdateUserName?: (item: boolean) => void,
  onUpdateVerify?: (item: boolean) => void
}

const SocialLogin = ( {  ...props }: PropTypes) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [query] = useState(router.query)
  const responseFacebook = (responseData: LoginFacebook) => {
    const params = {
      first_name: responseData.profile.first_name,
      last_name: responseData.profile.last_name,
      id: responseData.profile.id,
      email: responseData.profile.email,
      provider: "facebook"
    }
    registerSocial(params)
  };
  const isDeviceIOS = is_ios_device();
  const responseGoogle = (responseData: LoginGoogle) => {
    if (isEmpty(responseData?.error)) {
      const params = {
        first_name: responseData.profileObj.familyName,
        last_name: responseData.profileObj.givenName,
        id: responseData.googleId,
        email: responseData.profileObj.email,
        provider: "google"
      }
      registerSocial(params)
    }
  };

  const registerSocial = async (data: any) => {
    // const response = {
    //         success: true,
    //         data: {
    //             token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY0MjY2NjkxMywianRpIjoiNWExMGY0NWQtMmFjNy00NDliLWIzYTEtMWY2NTZkOTdjZjZmIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjIyMTM1ODAxNDU0NTIyNzgiLCJuYmYiOjE2NDI2NjY5MTMsImV4cCI6MTY0MjcxMDExMywidXNlcl9pZCI6OTUyMzB9.8s_HkLHcmMHLtqxSbX7tNac42f0n76OLAtnv-9RVioM",
    //             token_expiration: 1642710113,
    //             user_data: {
    //                 userid: 95230,
    //                 firstname: "Li\u1ec7u",
    //                 lastname: "Nguy\u1ec5n Ng\u1ecdc",
    //                 username: "",
    //                 email: "ngoclieu1996vn@yahoo.com.vn",
    //                 user_img: "",
    //                 user_default_sport: null,
    //                 user_default_currency: null,
    //                 activated: true
    //             }
    //         }
    //     };

      const MyDate = new Date();
      const MyOffset = (MyDate.getTimezoneOffset()) / -60;
      let time_zone = "";
      if (MyOffset < 0) {
        time_zone = `-${MyOffset}`;
      } else {
        time_zone = `+${MyOffset}`
      }
      data.time_zone = time_zone;
   
      try {
        const response = await api.v1.authorization.socialLogin(data);
        
        if (response.success) {
          MyStorage.user = new User(response.data.user_data);
          MyStorage.token = response.data.token;

          dispatch(AuthActions.updateInfo(MyStorage.user));

          let token: any = { userid: response.data.user_data.userid, email: response.data.user_data.email };
          token = btoa(JSON.stringify(token));

          if (isEmpty(response?.data?.user_data?.username)) {
            sessionStorage.setItem('redirect', `/set-username/${token}`);
            return;
          }

          // if(!Boolean(response?.data?.user_data?.activated)) {
          //   sessionStorage.setItem('redirect', `/verify-email/${token}`);
          //   return;
          // }

          return ToastSystem.success(props.message);
        }
        // ToastSystem.error(response.message);
      }
      catch (err) {
        console.log(err)
      }
  }

  const responseApple = (response: any) => {
    const dataDecode = parseJwt(response.authorization.id_token);
    const params = {
      first_name: dataDecode.email,
      last_name: "",
      id: dataDecode.sub,
      email: dataDecode.email,
      provider: "apple"
    }
    registerSocial(params)
  }

  const handleLoginTwitter = () => {
    window.location.href = "https://api-staging.priceguide.cards/social-login/twitter"
  }

  // React.useEffect(() => {
  //   console.log(renderUrl())
  // }, [])

  const renderUrl = () => {
    const urlCallback = `${window.location.origin}${window.location.pathname}`;
    // const client_id = 0tpzpsbcya46bhsc98txdz64sabfie
    const client_id = process.env.REACT_APP_TWITCH_CLIENT_ID;
    const state = MD5(moment().unix()).toString();
    return `https://www.twitch.tv/login?client_id=${client_id}&redirect_params=client_id%3D${client_id}%26redirect_uri=${urlCallback}%26response_type%3Dcode%26scope%3Duser_read%26state=${state}`
  }

  React.useEffect(() => {
    if (query?.code && location.pathname !== "/card-detail") {
      getDataTwitch()
    }
  }, [query])

  const getDataTwitch = async () => {
    try {
      const params = {
        code: query?.code,
        redirect_uri: `${window.location.origin}${window.location.pathname}`,
      }
      const response = await api.v1.authorization.twitchLogin(params);
      if (response.success) {
        MyStorage.user = new User(response.data.user_data);
        MyStorage.token = response.data.token;

        dispatch(AuthActions.updateInfo(MyStorage.user));

        let token: any = { userid: response.data.user_data.userid, email: response.data.user_data.email };
        token = btoa(JSON.stringify(token));

        if (isEmpty(response?.data?.user_data?.username)) {
          sessionStorage.setItem('redirect', `/set-username/${token}`);
          return;
        }

        return ToastSystem.success(props.message);
      }
      ToastSystem.error(response.message ?? response.error);
    }
    catch (err) { }
  }

  const goToTwitch = () => {
    const url = renderUrl();
    window.location.href = url;
  }

  return (
    <>
      <div className="d-inline-flex align-items-center flex-column social-buttons mb-0 mt-4">
        <div className="d-flex w-100 justify-content-center social-buttons-group">
        <FacebookProvider appId={process.env.REACT_APP_FB_CLIENT_ID}>
            <LoginFB onCompleted={responseFacebook}>
              { // @ts-ignore
                ({ handleClick }) => (
                  <button onClick={handleClick} type="button" className="btn btn-light" data-toggle="tooltip" data-placement="top" title="" data-original-title="Facebook">
                    <svg width="12" height="24" viewBox="0 0 12 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M7.32382 8.89973V5.74116C7.32382 5.30289 7.54681 4.72209 8.2276 4.72209H10.5904V0.333328L6.17637 0.333328C4.65456 0.333328 2.40471 2.28228 2.40471 4.35014L2.40471 8.77473H0.166664L0.166664 13.1383L2.42317 13.1521L2.42317 23.5317H7.28764L7.28764 13.2039L10.6096 13.2039L11.4137 8.89973L7.32382 8.89973Z" fill="#1877F2" />
                    </svg>
                  </button>
                )}
            </LoginFB>
          </FacebookProvider>
          <button onClick={handleLoginTwitter} type="button" className="btn btn-light" data-toggle="tooltip" data-placement="top" title="" data-original-title="Twitter">
            <svg width="25" height="21" viewBox="0 0 25 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M24.5346 3.01134C23.6453 3.40799 22.6875 3.67753 21.6833 3.79545C22.7088 3.17751 23.4962 2.20196 23.8667 1.03269C22.9066 1.60699 21.8446 2.02125 20.7126 2.24561C19.8088 1.27466 18.5178 0.666672 17.0891 0.666672C14.348 0.666672 12.1243 2.90567 12.1243 5.66613C12.1243 6.05589 12.1677 6.43723 12.2537 6.80325C8.12655 6.5942 4.46882 4.60483 2.01918 1.58402C1.59087 2.31912 1.34742 3.17674 1.34742 4.09409C1.34742 5.82694 2.22382 7.35764 3.55591 8.25354C2.7419 8.22751 1.97733 8.00085 1.3071 7.6287C1.30558 7.64708 1.30558 7.67082 1.30558 7.69226C1.30558 10.1112 3.01805 12.1289 5.28892 12.5899C4.87278 12.7055 4.43383 12.7614 3.98041 12.7614C3.66165 12.7614 3.34974 12.7323 3.04772 12.6749C3.67763 14.6612 5.51334 16.1054 7.68531 16.1444C5.98501 17.486 3.845 18.2831 1.5186 18.2831C1.11767 18.2831 0.722841 18.2609 0.333332 18.2119C2.53193 19.63 5.14133 20.457 7.94549 20.457C17.0792 20.457 22.0728 12.8472 22.0728 6.24273C22.0728 6.02603 22.0675 5.81162 22.0576 5.59722C23.0283 4.89428 23.8697 4.01139 24.5346 3.01134Z" fill="#3FADE2" />
            </svg>
          </button>
          <GoogleLogin
            clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}
            buttonText="Login"
            //@ts-ignore 
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            render={renderProps => (
              <button onClick={renderProps.onClick} type="button" className="btn btn-light" data-toggle="tooltip" data-placement="top" title="" data-original-title="Facebook">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_1424_13773)">
                    <path d="M27.7025 14.315C27.7025 13.3933 27.6208 12.5183 27.4808 11.6667L14.2975 11.6667V16.9283H21.8458C21.5075 18.655 20.5158 20.1133 19.0458 21.105V24.605H23.5492C26.1858 22.1667 27.7025 18.5733 27.7025 14.315Z" fill="#4285F4" />
                    <path d="M14.2975 28C18.0775 28 21.2392 26.74 23.5492 24.605L19.0458 21.105C17.7858 21.945 16.1875 22.4583 14.2975 22.4583C10.6458 22.4583 7.55417 19.9967 6.44584 16.6717H1.8025L1.8025 20.2767C4.10084 24.85 8.82584 28 14.2975 28Z" fill="#34A853" />
                    <path d="M6.44584 16.6717C6.15417 15.8317 6.0025 14.9333 6.0025 14C6.0025 13.0667 6.16584 12.1683 6.44584 11.3283L6.44584 7.72333L1.8025 7.72333C0.845835 9.61333 0.297503 11.7367 0.297503 14C0.297503 16.2633 0.845835 18.3867 1.8025 20.2767L6.44584 16.6717Z" fill="#FBBC05" />
                    <path d="M14.2975 5.54167C16.3625 5.54167 18.2058 6.25334 19.6642 7.64167L23.6542 3.65167C21.2392 1.38833 18.0775 0 14.2975 0C8.82584 0 4.10084 3.15 1.8025 7.72334L6.44584 11.3283C7.55417 8.00334 10.6458 5.54167 14.2975 5.54167Z" fill="#EA4335" />
                  </g>
                  <defs>
                    <clipPath id="clip0_1424_13773">
                      <rect width="28" height="28" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </button>
            )}
            cookiePolicy={'single_host_origin'}
          />
    
          <button
            onClick={goToTwitch}
            type="button"
            className="btn btn-light" data-toggle="tooltip" data-placement="top" title="" data-original-title="Linkedin">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_1424_13781)">
                <path d="M1.13703 4.87083L1.13703 24.3472H7.8442L7.8442 28H11.5064L15.1627 24.346L20.6519 24.346L27.9715 17.045L27.9715 0L2.9652 0L1.13703 4.87083ZM5.4047 2.4325L25.532 2.4325L25.532 15.8247L21.262 20.0853L14.5525 20.0853L10.8962 23.7335L10.8962 20.0853H5.4047L5.4047 2.4325Z" fill="#9146FF" />
                <path d="M12.1146 7.30568H14.5529V14.609H12.1146L12.1146 7.30568Z" fill="#9146FF" />
                <path d="M18.8213 7.30568H21.2608V14.609H18.8213V7.30568Z" fill="#9146FF" />
              </g>
              <defs>
                <clipPath id="clip0_1424_13781">
                  <rect width="28" height="28" fill="white" />
                </clipPath>
              </defs>
            </svg>

          </button>
        </div>
        {
          Boolean( isDeviceIOS) &&
          <div className="d-flex align-items-center social-buttons-apple w-100">
            <AppleSignin

            authOptions={{
              clientId: process.env.REACT_APP_APPLE_CLIENT_ID,
              scope: 'email name',
              redirectURI: 'https://staging.priceguide.cards',
              state: '',
              nonce: 'nonce',
              usePopup: true,
            }}
            onSuccess={(response: any) => responseApple(response)}
            onError={(error: any) => console.error(error)}

            uiType="dark"

            className="apple-auth-btn w-100"

            render={(props: any) => <button {...props} type="button" className="btn btn-light w-100 d-inline-flex align-items-center" data-toggle="tooltip" data-placement="top" title="" data-original-title="Facebook">
              <i style={{ fontSize: 30 }} className="fa fa-apple"></i>
              <span>
                Login with Apple ID
              </span>
            </button>}
            />
          </div>
        }
      </div>
    </>
  
  );
}

export default React.memo(SocialLogin);
