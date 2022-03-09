import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, SubmitHandler } from "react-hook-form";
import { api } from "configs/axios";
import { ToastSystem } from "helper/toast_system";
import { useRouter } from 'next/router'

type Inputs = {
  password: string;
  confirmPassword: string;
};

type PropTypes = {
  query?: any;
};

const ForgotPassword = ({ ...props }: PropTypes) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const [typePassword, setTypePassword] = useState<string>("password");
  const [typePasswordConfirm, setTypePasswordConfirm] =
    useState<string>("password");

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required("Password is required")
      .min(6, "At least 6 characters long"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required")
      .min(6, "At least 6 characters long"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>(formOptions);
  const watchPassword = watch("password");
  const watchPasswordConfirm = watch("confirmPassword");

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    try {
      const result = await api.v1.account.resetPassword({
        email: props.query.email,
        token: props.query.token,
        password: data.password,
      });
      if (result.success) {
        ToastSystem.success(result.message);
        setIsLoading(false);
        return router.push("/login");
      }
      setIsLoading(false);
      ToastSystem.error(result.message);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };

  const onChangeTypePassword = (
    watchData: any,
    typeData: any,
    setData: any
  ) => {
    if (watchData) {
      if (typeData === "password") {
        return setData("text");
      }
      setData("password");
    }
  };

  const renderIcon = (watchData: any, typeData: any) => {
    if (!watchData) {
      return (
        <svg
          width="12"
          height="16"
          viewBox="0 0 12 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.5 6H10V4C10 1.794 8.206 0 6 0C3.794 0 2 1.794 2 4V6H1.5C0.673333 6 0 6.67267 0 7.5V14.5C0 15.3273 0.673333 16 1.5 16H10.5C11.3267 16 12 15.3273 12 14.5V7.5C12 6.67267 11.3267 6 10.5 6ZM3.33333 4C3.33333 2.52933 4.52933 1.33333 6 1.33333C7.47067 1.33333 8.66667 2.52933 8.66667 4V6H3.33333V4ZM6.66667 11.148V12.6667C6.66667 13.0347 6.36867 13.3333 6 13.3333C5.63133 13.3333 5.33333 13.0347 5.33333 12.6667V11.148C4.93667 10.9167 4.66667 10.4913 4.66667 10C4.66667 9.26467 5.26467 8.66667 6 8.66667C6.73533 8.66667 7.33333 9.26467 7.33333 10C7.33333 10.4913 7.06333 10.9167 6.66667 11.148Z"
            fill="#6D7588"
          />
        </svg>
      );
    }
    return typeData === "password" ? (
      <svg
        width="16"
        height="12"
        viewBox="0 0 16 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M8 11.3334C12.4183 11.3334 16 7.33341 16 6.00008C16 4.66675 12.4183 0.666748 8 0.666748C3.58172 0.666748 0 4.66675 0 6.00008C0 7.33341 3.58172 11.3334 8 11.3334ZM8 9.06675C9.69367 9.06675 11.0667 7.69376 11.0667 6.00008C11.0667 4.30641 9.69367 2.93342 8 2.93342C6.30632 2.93342 4.93333 4.30641 4.93333 6.00008C4.93333 7.69376 6.30632 9.06675 8 9.06675ZM10 6.00008C10 7.10465 9.10457 8.00008 8 8.00008C6.89543 8.00008 6 7.10465 6 6.00008C6 4.89551 6.89543 4.00008 8 4.00008C9.10457 4.00008 10 4.89551 10 6.00008Z"
          fill="#18213A"
        />
      </svg>
    ) : (
      <svg
        width="16"
        height="15"
        viewBox="0 0 16 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M1.87174 0.871826L0.928935 1.81463L2.68398 3.56968C1.03727 4.79276 0 6.28256 0 7.00008C0 8.33342 3.58172 12.3334 8 12.3334C9.01938 12.3334 9.99422 12.1205 10.8908 11.7765L13.1855 14.0711L14.1283 13.1283L1.87174 0.871826ZM4.93333 7.00008C4.93333 6.64599 4.99335 6.30591 5.10376 5.98946L6.00305 6.88875C6.00103 6.9256 6 6.96272 6 7.00008C6 8.10465 6.89543 9.00008 8 9.00008C8.03736 9.00008 8.07448 8.99906 8.11134 8.99704L9.01063 9.89632C8.69418 10.0067 8.3541 10.0668 8 10.0668C6.30633 10.0668 4.93333 8.69376 4.93333 7.00008Z"
          fill="#18213A"
        />
        <path
          d="M5.10918 2.22364L6.98938 4.10384C7.30583 3.99343 7.64591 3.93342 8 3.93342C9.69367 3.93342 11.0667 5.30641 11.0667 7.00008C11.0667 7.35418 11.0067 7.69426 10.8962 8.01071L13.316 10.4305C14.9627 9.2074 16 7.71761 16 7.00008C16 5.66675 12.4183 1.66675 8 1.66675C6.98062 1.66675 6.00578 1.87967 5.10918 2.22364Z"
          fill="#18213A"
        />
        <path
          d="M9.99695 7.11142C9.99898 7.07456 10 7.03744 10 7.00008C10 5.89551 9.10457 5.00008 8 5.00008C7.96264 5.00008 7.92552 5.00111 7.88867 5.00313L9.99695 7.11142Z"
          fill="#18213A"
        />
      </svg>
    );
  };

  return (
    <section id="page-resd">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h2 className="title text-center mt-70"> New Password </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="maxw-420">
              <div
                className={`form-group form-data ${
                  errors.password ? "error-validation" : ""
                } `}
              >
                <label>New password</label>
                <div className="position-relative position-password">
                  <input
                    {...register("password")}
                    type={typePassword}
                    className="form-control"
                    placeholder="Enter your new password"
                  />
                  <div
                    onClick={() =>
                      onChangeTypePassword(
                        watchPassword,
                        typePassword,
                        setTypePassword
                      )
                    }
                    className="btn btn-icon position-absolute btn-icon--custom"
                  >
                    {renderIcon(watchPassword, typePassword)}
                  </div>
                </div>

                {errors.password?.message && (
                  <div className="invalid-feedback d-inline">
                    {errors.password?.message}
                  </div>
                )}
              </div>
              <div
                className={`form-group form-data mb-30 ${
                  errors.confirmPassword ? "error-validation" : ""
                } `}
              >
                <label>Confirm password</label>
                <div className="position-relative position-password">
                  <input
                    type={typePasswordConfirm}
                    {...register("confirmPassword")}
                    className="form-control"
                    placeholder="Confirm your new password"
                  />
                  <button
                    onClick={() =>
                      onChangeTypePassword(
                        watchPasswordConfirm,
                        typePasswordConfirm,
                        setTypePasswordConfirm
                      )
                    }
                    type="button"
                    className="btn btn-icon position-absolute"
                  >
                    {renderIcon(watchPasswordConfirm, typePasswordConfirm)}
                  </button>
                </div>
                {errors.confirmPassword?.message && (
                  <div className="invalid-feedback d-inline">
                    {errors.confirmPassword?.message}
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary"
              >
                Change Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
