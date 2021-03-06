import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { RegexString } from 'utils/constant';
import { yupResolver } from '@hookform/resolvers/yup';
import { MyStorage } from "helper/local_storage";
import { api } from "configs/axios";
import { useRouter } from 'next/router'
import { ToastSystem } from 'helper/toast_system';
import { AuthActions } from 'redux/actions/auth_action';
import { User } from "model/user";
import Selectors from "redux/selectors";
import { useSelector } from "react-redux";
import { isEmpty } from "lodash";

type Inputs = {
  username: string,
};

type ParamTypes = {
  token: string
}

const SetUsername: React.FC = () => {

  const router = useRouter();
  const token = router.query.token as string;
  const { userInfo, loggingIn } = useSelector(Selectors.auth);

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required('Username is required')
      .min(3, 'Usernames can only contain letters of the alphabet, numbers, -,  _ and a minimum of 3 characters')
      .max(150, 'Usernames can only contain letters of the alphabet, numbers, -,  _, a minimum of 3 and a maximum of 150 characters')
      .matches(RegexString.username, 'Usernames can only contain letters of the alphabet, numbers, - and _')
      .test('Unique Username', 'Username already taken',
        function (value) {
          return new Promise((resolve, reject) => {
            api.v1.authorization.checkUsername({ username: value })
              .then(res => {
                // @ts-ignore
                if (res.username_available === false) {
                  resolve(false);
                } else {
                  resolve(true);
                }
              })
          })
        }
      ),
  });

  useEffect(() => {
    if (!isEmpty(userInfo.username)) {
      router.push('/')
    }
  }, [])
  useEffect(() => {
    if (token) {
      try {
        let data = JSON.parse(atob(token));
        if (!data.userid) {
          ToastSystem.error("Token invalid");
          router.push('/')
        }
      }
      catch (err) {
        router.push('/')
      }
    }
  }, [token])

  const dispatch = useDispatch();
  const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm<Inputs>({
    resolver: yupResolver(validationSchema),
    mode: 'onChange'
  });
  const onSubmit: SubmitHandler<Inputs> = async data => {
    try {
      // let tokenData = JSON.parse(atob(token));
      const form_request = { username: data.username };
      await api.v1.authorization.checkUsername({ username: data.username })
        .then(res => {
          // @ts-ignore
          if (res.username_available === false) {
            ToastSystem.error("Username already taken")
            return;
          }
        });
      const result = await api.v1.account.setUserName(form_request);

      if (result.success) {
        let userData = MyStorage.user;
        userData.username = data.username;
        MyStorage.user = new User(userData);
        dispatch(AuthActions.updateInfo(MyStorage.user));
        router.push('/')
      }
    } catch (err) {
      ToastSystem.error("Set Username Error!")
      console.log(err);
    }
  };

  return (
    <div className="container authenticate-page pb-5">
      <div className="">
        <div className="d-flex justify-content-center">
          <div className="login-form register-account-form mt-4 py-4">
            <form className="row g-3" onSubmit={handleSubmit(onSubmit)}>
              <h2 className="text-center text-title">Set Username</h2>
              <div className={`col-12 form-data ${errors.username ? "error-validation" : ""}`}>
                <label className="text-form">Username</label>
                <input {...register("username")} type="text" name="username" className="form-control" placeholder="Your Username" />
                {errors.username?.message && <div className="invalid-feedback d-inline">{errors.username?.message}</div>}
              </div>
              <div className="col-12 d-grid gap-2">
                <button className="btn btn-primary btn-login" type="submit">Save and Confirm</button>
              </div>
              <div className="col-12 mt-4">
                <p className="text-center mb-0 no-credit">You can change it later in Profile Settings</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SetUsername;
