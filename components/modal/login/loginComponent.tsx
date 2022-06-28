import React, { useState, useRef } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch } from 'react-redux';
import { AuthActions } from 'redux/actions/auth_action';
import { useSelector } from 'react-redux';
import Selectors from 'redux/selectors';
import SocialLogin from "components/socialLogin"
import { useRouter } from 'next/router'
import Link from 'next/link'
import * as Yup from 'yup';
import { RegexString } from 'utils/constant';
import { yupResolver } from '@hookform/resolvers/yup';
import { is_ios_device } from 'utils/helper';
import { ConfigAction } from "redux/actions/config_action";
import HCaptcha from '@hcaptcha/react-hcaptcha';
import useWindowDimensions from "utils/useWindowDimensions"

type Inputs = {
  userName: string,
  password: string,
};

type PropTypes = {
  onSuccess?: () => void
}
const LoginPage = (props: PropTypes) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [token, setToken] = useState(null);
  const captchaRef = useRef(null);
  const onLoad = () => {
    // @ts-ignore
    captchaRef.current.execute();
  };
  const { width } = useWindowDimensions();
  const { is_set_username } = useSelector(Selectors.config);
  const validationSchema = Yup.object().shape({
    userName: Yup.string()
      // .matches(RegexString.userOrEmail, 'Please provide a valid email address or username')
      // .min(3, 'Usernames can only contain letters of the alphabet, numbers, -,  _ and a minimum of 3 characters')
      // .max(150, 'Usernames can only contain letters of the alphabet, numbers, -,  _, a minimum of 3 and a maximum of 150 characters')
      .required('Username or Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'At least 6 characters long')
  });

  const dispatch = useDispatch();
  const [typePassword, setTypePassword] = useState<string>("password");

  const { loggingIn } = useSelector(Selectors.auth);
  const router = useRouter();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>({
    resolver: yupResolver(validationSchema),
    mode: 'onChange'
  });
  const watchPassword = watch("password");


  React.useEffect(() => {
    if (loggingIn) {
      if (!props.onSuccess) {
        gotoHome()
      }
    }
  }, [loggingIn])

  const gotoHome = () => {
    const pageRedirect = sessionStorage.getItem('redirect');
    if (pageRedirect) {
      sessionStorage.removeItem('redirect')
      return router.push(pageRedirect)
    }
    router.push(`/`)
  }
  const onSubmit: SubmitHandler<Inputs> = async data => {
    setIsLoading(true)
    const headers = { "captcha-token": token };
    dispatch(AuthActions.login({ username: data.userName, password: data.password }, onSuccess, headers, router, onFail));
  };

  const onFail = () => {
    setIsLoading(false)
    // @ts-ignore
    captchaRef.current.resetCaptcha();
  }

  const onSuccess = () => {
    props.onSuccess && props.onSuccess()
  }

  const onChangeTypePassword = () => {
    if (watchPassword) {
      if (typePassword === "password") {
        return setTypePassword("text")
      }
      setTypePassword("password")
    }
  }


  const renderIcon = () => {
    if (!watchPassword) {
      return <svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.5 6H10V4C10 1.794 8.206 0 6 0C3.794 0 2 1.794 2 4V6H1.5C0.673333 6 0 6.67267 0 7.5V14.5C0 15.3273 0.673333 16 1.5 16H10.5C11.3267 16 12 15.3273 12 14.5V7.5C12 6.67267 11.3267 6 10.5 6ZM3.33333 4C3.33333 2.52933 4.52933 1.33333 6 1.33333C7.47067 1.33333 8.66667 2.52933 8.66667 4V6H3.33333V4ZM6.66667 11.148V12.6667C6.66667 13.0347 6.36867 13.3333 6 13.3333C5.63133 13.3333 5.33333 13.0347 5.33333 12.6667V11.148C4.93667 10.9167 4.66667 10.4913 4.66667 10C4.66667 9.26467 5.26467 8.66667 6 8.66667C6.73533 8.66667 7.33333 9.26467 7.33333 10C7.33333 10.4913 7.06333 10.9167 6.66667 11.148Z" fill="#6D7588" />
      </svg>
    }
    return typePassword === "password" ? <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    <>
      <div className="login-form">
        <form onSubmit={handleSubmit(onSubmit)} className="row">
          <div className={`col-12 form-data ${errors.userName ? "error-validation" : ""}`}>
            <label className="text-form mt-1">Username or Email</label>
            <input {...register("userName")} type="text" name="userName" className="form-control" placeholder="Your Username or Email" onFocus={() => handleOnFocus()} onBlur={() => handleOnBlur()} />
            {/* errors will return when field validation fails  */}
            {errors.userName?.message && <div className="invalid-feedback d-inline">{errors.userName?.message}</div>}

          </div>
          <div className={`col-12 position-relative form-data password ${errors.password ? "error-validation" : ""}`}>
            <label className="text-form  mt-3">Password</label>
            <div className="password-input position-relative">
              <input {...register("password")} type={typePassword} name="password" className="form-control mt-1" placeholder="Your Password" onFocus={() => handleOnFocus()} onBlur={() => handleOnBlur()} />
              <button onClick={onChangeTypePassword} type="button" className="btn position-absolute">
                {renderIcon()}
              </button>
            </div>
            {errors.password?.message && <div className="invalid-feedback d-inline">{errors.password?.message}</div>}
          </div>
          <div className="col-12 mt-4 form-data mb-3">
            <div className="form-check ps-0">
              <label className="form-check-label forget-password" htmlFor="rememberMe">
                <Link href={"/password/reset"}>
                  <a className="text-reset text-decoration-none">Forgot Your Password?</a>
                </Link>
              </label>
            </div>
          </div>
          <HCaptcha
            sitekey={`${process.env.REACT_APP_SITE_KEY}`}
            // onLoad={onLoad}
            // @ts-ignore
            onVerify={setToken}
            ref={captchaRef}
            onExpire={() => {
              setToken(null)
              /// @ts-ignore
              captchaRef.current.resetCaptcha();
            }}
            size={width >= 430 ? 'normal' : 'compact'}
          />
          <div className="d-grid gap-2 form-data mt-3">
            <button disabled={!token || isLoading} className="btn btn-primary btn-login" type="submit">Login</button>
          </div>

        </form>
        <div className='socials-media text-center'>
          <div className="col-12 mt-4">
            <p className="text-center mb-0 text-continue">or continue with</p>
          </div>
          <SocialLogin message="Login successful" />
        </div>

      </div>

      <div className="col-12 section-account">
        <p className="text-center mb-0 text-have-account">Don't have an account?</p>
        <p className="text-center mb-0 create-account mt-2"><Link href={"/register"}>Create Account</Link></p>
      </div>
    </>

  );
}

export default LoginPage;
