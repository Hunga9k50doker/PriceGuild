import React, { useState, useEffect, useRef } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch } from 'react-redux';
import { AuthActions } from "redux/actions/auth_action";
import SocialLogin from "components/socialLogin"
import IconPassword from "assets/images/icon_password.png"
import * as Yup from 'yup';
import { RegexString } from 'utils/constant';
import { yupResolver } from '@hookform/resolvers/yup';
import { ConfigAction } from "redux/actions/config_action";
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { useRouter } from 'next/router'
import axios from 'axios';
import { api } from 'configs/axios';
import Link from 'next/link'
import timezone from 'utils/timezones';
import Head from 'next/head';

type Inputs = {
  firstName: string,
  lastName: string,
  username: string,
  email: string,
  password: string,
  confirmPassword: string,
  agreeTerms: boolean,
  agreeNewsLetter: boolean,
};

const RegisterPage: React.FC = () => {
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const captchaRef = useRef(null);
  const onLoad = () => {
    // @ts-ignore
    captchaRef.current.execute();
  };

  const router = useRouter();
  const [typePassword, setTypePassword] = useState<string>("password")
  const [typePasswordConfirm, setTypePasswordConfirm] = useState<string>("password")
  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .required('First Name is required')
      .max(255, 'First Name maximum of 255 characters'),
    lastName: Yup.string()
      .required('Last Name is required')
      .max(255, 'Last Name maximum of 255 characters'),
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
    email: Yup.string()
      .required('Email is required')
      .email('Please provide a valid email address')
      .max(255, 'Email maximum of 255 characters')
      .matches(RegexString.emailRegister, 'Please provide a valid email address'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'At least 6 characters long'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Confirm Password does not match')
      .required('Confirm Password is required')
      .min(6, 'At least 6 characters long'),
  });

  const dispatch = useDispatch();
  const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm<Inputs>({
    resolver: yupResolver(validationSchema),
    mode: 'onChange'
  });
  const watchPassword = watch("password");
  const watchPasswordConfirm = watch("confirmPassword");
  const watchAgreeTerms = watch("agreeTerms");

  const onSubmit: SubmitHandler<Inputs> = async data => {
    setIsLoading(true)
    const headers = { "captcha-token": token };
    const MyDate = new Date();
    const MyOffset = (MyDate.getTimezoneOffset()) / -60;
    let time_zone = "";
    if (MyOffset < 0) {
      time_zone = `-${MyOffset}`;
    } else {
      time_zone = `+${MyOffset}`
    }
    dispatch(AuthActions.register({
      first_name: data.firstName,
      last_name: data.lastName,
      username: data.username,
      password: data.password,
      news_letter: data.agreeNewsLetter ? 1 : 0,
      email: data.email,
      time_zone,
    }, headers, router, onFail ));
    // router.push('/verify-email');
  };

  const onFail = () => {
    setIsLoading(false);
    // @ts-ignore
    captchaRef.current.resetCaptcha(); 
  }

  useEffect(() => {
    setValue('agreeNewsLetter', true);
  }, [setValue]);

  const onChangeTypePassword = (watchData: any, typeData: any, setData: any) => {
    if (watchData) {
      if (typeData === "password") {
        return setData("text")
      }
      setData("password")
    }
  }

  const renderIcon = (watchData: any, typeData: any) => {
    if (!watchData) {
      return <svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.5 6H10V4C10 1.794 8.206 0 6 0C3.794 0 2 1.794 2 4V6H1.5C0.673333 6 0 6.67267 0 7.5V14.5C0 15.3273 0.673333 16 1.5 16H10.5C11.3267 16 12 15.3273 12 14.5V7.5C12 6.67267 11.3267 6 10.5 6ZM3.33333 4C3.33333 2.52933 4.52933 1.33333 6 1.33333C7.47067 1.33333 8.66667 2.52933 8.66667 4V6H3.33333V4ZM6.66667 11.148V12.6667C6.66667 13.0347 6.36867 13.3333 6 13.3333C5.63133 13.3333 5.33333 13.0347 5.33333 12.6667V11.148C4.93667 10.9167 4.66667 10.4913 4.66667 10C4.66667 9.26467 5.26467 8.66667 6 8.66667C6.73533 8.66667 7.33333 9.26467 7.33333 10C7.33333 10.4913 7.06333 10.9167 6.66667 11.148Z" fill="#6D7588" />
      </svg>
    }
    return typeData === "password" ? <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M8 11.3334C12.4183 11.3334 16 7.33341 16 6.00008C16 4.66675 12.4183 0.666748 8 0.666748C3.58172 0.666748 0 4.66675 0 6.00008C0 7.33341 3.58172 11.3334 8 11.3334ZM8 9.06675C9.69367 9.06675 11.0667 7.69376 11.0667 6.00008C11.0667 4.30641 9.69367 2.93342 8 2.93342C6.30632 2.93342 4.93333 4.30641 4.93333 6.00008C4.93333 7.69376 6.30632 9.06675 8 9.06675ZM10 6.00008C10 7.10465 9.10457 8.00008 8 8.00008C6.89543 8.00008 6 7.10465 6 6.00008C6 4.89551 6.89543 4.00008 8 4.00008C9.10457 4.00008 10 4.89551 10 6.00008Z" fill="#18213A" />
    </svg>
      : <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M1.87174 0.871826L0.928935 1.81463L2.68398 3.56968C1.03727 4.79276 0 6.28256 0 7.00008C0 8.33342 3.58172 12.3334 8 12.3334C9.01938 12.3334 9.99422 12.1205 10.8908 11.7765L13.1855 14.0711L14.1283 13.1283L1.87174 0.871826ZM4.93333 7.00008C4.93333 6.64599 4.99335 6.30591 5.10376 5.98946L6.00305 6.88875C6.00103 6.9256 6 6.96272 6 7.00008C6 8.10465 6.89543 9.00008 8 9.00008C8.03736 9.00008 8.07448 8.99906 8.11134 8.99704L9.01063 9.89632C8.69418 10.0067 8.3541 10.0668 8 10.0668C6.30633 10.0668 4.93333 8.69376 4.93333 7.00008Z" fill="#18213A" />
        <path d="M5.10918 2.22364L6.98938 4.10384C7.30583 3.99343 7.64591 3.93342 8 3.93342C9.69367 3.93342 11.0667 5.30641 11.0667 7.00008C11.0667 7.35418 11.0067 7.69426 10.8962 8.01071L13.316 10.4305C14.9627 9.2074 16 7.71761 16 7.00008C16 5.66675 12.4183 1.66675 8 1.66675C6.98062 1.66675 6.00578 1.87967 5.10918 2.22364Z" fill="#18213A" />
        <path d="M9.99695 7.11142C9.99898 7.07456 10 7.03744 10 7.00008C10 5.89551 9.10457 5.00008 8 5.00008C7.96264 5.00008 7.92552 5.00111 7.88867 5.00313L9.99695 7.11142Z" fill="#18213A" />
      </svg>
  }

  const handleOnFocus = () => {
    dispatch(ConfigAction.updateShowTabBar(false));
  }

  const handleOnBlur = () => {
    dispatch(ConfigAction.updateShowTabBar(true));
  }

  return (
    <div className="container authenticate-page">
      <Head>
        <title>Register | PriceGuice.Cards</title>
        <meta name="description" content="Create a new Account at Price Guide.Cards" />
      </Head>
      <div className="">
        <div className="d-flex justify-content-center">
          <div className="login-form register-account-form mt-4 py-4">
            <form onSubmit={handleSubmit(onSubmit)} className="row g-3">
              <h2 className="text-center text-title">Create Account</h2>
              <SocialLogin message="Register successfully" />
              <div className="col-12">
                <p className="text-center mb-0">or continue with email</p>
              </div>
              <div className={`col-12 form-data ${errors.firstName ? "error-validation" : ""}`}>
                <label className="text-form">First Name</label>
                <input {...register("firstName")} type="text" name="firstName" className="form-control" placeholder="Your First Name" onFocus={() => handleOnFocus()} onBlur={() => handleOnBlur()}/>
                {errors.firstName?.message && <div className="invalid-feedback d-inline">{errors.firstName?.message}</div>}
              </div>
              <div className={`col-12 form-data ${errors.lastName ? "error-validation" : ""}`}>
                <label className="text-form">Last Name</label>
                <input {...register("lastName")} type="text" name="lastName" className="form-control" placeholder="Your Last Name" onFocus={() => handleOnFocus()} onBlur={() => handleOnBlur()}/>
                {errors.lastName?.message && <div className="invalid-feedback d-inline">{errors.lastName?.message}</div>}
              </div>
              <div className={`col-12 form-data ${errors.username ? "error-validation" : ""}`}>
                <label className="text-form">Username</label>
                <input {...register("username")} type="text" name="username" className="form-control" placeholder="Your Username" onFocus={() => handleOnFocus()} onBlur={() => handleOnBlur()}/>
                {errors.username?.message && <div className="invalid-feedback d-inline">{errors.username?.message}</div>}
              </div>
              <div className={`col-12 form-data ${errors.email ? "error-validation" : ""}`}>
                <label className="text-form">Email</label>
                <input {...register("email")} type="text" name="email" className="form-control" placeholder="Your Email" onFocus={() => handleOnFocus()} onBlur={() => handleOnBlur()}/>
                {errors.email?.message && <div className="invalid-feedback d-inline">{errors.email?.message}</div>}
              </div>
              <div className={`col-12 form-data ${errors.password ? "error-validation" : ""}`}>
                <label className="text-form">Password</label>
                <div className="position-password  position-relative">
                  <input {...register("password")} type={typePassword} name="password" className="form-control" placeholder="Your Password" onFocus={() => handleOnFocus()} onBlur={() => handleOnBlur()}/>
                  <div onClick={() => onChangeTypePassword(watchPassword, typePassword, setTypePassword)}  className="btn position-absolute position-password--custom">
                    {renderIcon(watchPassword, typePassword)}
                  </div>
                </div>
                {errors.password?.message && <div className="invalid-feedback d-inline">{errors.password?.message}</div>}
              </div>
              <div className={`col-12 form-data ${errors.confirmPassword ? "error-validation" : ""}`}>
                <label className="text-form">Confirm Password</label>
                <div className="position-password position-relative">
                  <input {...register("confirmPassword")} type={typePasswordConfirm} name="confirmPassword" className="form-control" placeholder="Your Confirm Password" onFocus={() => handleOnFocus()} onBlur={() => handleOnBlur()}/>
                  <button onClick={() => onChangeTypePassword(watchPasswordConfirm, typePasswordConfirm, setTypePasswordConfirm)} type="button" className="btn position-absolute">
                    {renderIcon(watchPasswordConfirm, typePasswordConfirm)}
                  </button>
                </div>
                {errors.confirmPassword?.message && <div className="invalid-feedback d-inline">{errors.confirmPassword?.message}</div>}
              </div>
              <div className="col-12">
                <input {...register("agreeTerms")} className="form-check-input" type="checkbox" id="agreeTerms"/>
                <label htmlFor="agreeTerms" className="form-check-label">I agree to <span className="color-blue">Terms and Conditions</span></label>
              </div>
              <div className="col-12 mt-0">
                <input {...register("agreeNewsLetter")} className="form-check-input" type="checkbox" id="agreeNewsLetter" />
                <label htmlFor="agreeNewsLetter" className="form-check-label">Please sign me up for the newsletter</label>
              </div>
              <HCaptcha
                sitekey={`${process.env.REACT_APP_SITE_KEY}`}
                //onLoad={onLoad}
                // @ts-ignore
                onVerify={setToken}
                ref={captchaRef}
                onExpire={() => {
									setToken(null)
									/// @ts-ignore
									captchaRef.current.resetCaptcha();
								}}
             />
              <div className="col-12 d-grid gap-2">
                <button disabled={!watchAgreeTerms || !token || isLoading} className="btn btn-primary btn-login" type="submit">Create Account</button>
              </div>
              <div className="col-12 mt-4">
                <p className="text-center mb-0 no-credit">No credit card required</p>
              </div>
            </form>
            <hr className="hr--color" />
            <div className="col-12 section-account">
              <p className="text-center mb-1 mt-4">Already have an account?</p>
              <p className="text-center mb-0 mt-2 create-account">
                <Link href="/login">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
