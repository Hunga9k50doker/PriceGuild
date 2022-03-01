import React, {useState} from 'react';
import { RegexString } from 'utils/constant';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { ToastSystem } from "helper/toast_system";
import { api } from 'configs/axios';
import IconEditBook from 'assets/images/edit_book_icon.svg'

import * as Yup from 'yup';
type Inputs = {
  current_pw: string,
  confirmPassword: string,
  new_pw: string,
};

const SecuritySetting = () => {
  const validationSchema = Yup.object().shape({
    new_pw: Yup.string()
      .matches(RegexString.password, 'New password is invalid')
      .required('New password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('new_pw'), null], 'Passwords must match')
      .required('Confirm Password is required')
      .matches(RegexString.password, 'Confirm Password is invalid'),
    current_pw: Yup.string()
      .required('Password current is required')
      .matches(RegexString.password, 'Password current is invalid'),
  });
  const formOptions = { resolver: yupResolver(validationSchema) }
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<Inputs>(formOptions);

  const onSubmit = async (data: Inputs) => {
    try {
      const params = {
        current_pw: data.current_pw,
        new_pw: data.new_pw
      }
      const res = await api.v1.authorization.changePassword(params);
      if (res.success) {
        setValue("current_pw", "")
        setValue("confirmPassword", "")
        setValue("new_pw", "")
        setIsEdit(false)
        return ToastSystem.success(res.message);
      }
      return ToastSystem.error(res.message);
    }
    catch (err: any) {
      console.log(err.response)
      return ToastSystem.error(err.response.data.message);
    }
  }
  const [isEdit, setIsEdit] = useState<boolean>(false);
  return (
    <div className="profile-setting maxw-430">
      <div className='profile-setting-title'>
        <span>Security</span>
      </div>
      {!isEdit ? 
        (<div className='box-content'>
            <div className='icon-edit' onClick={() => setIsEdit(true)}>
              <img src={IconEditBook} alt="IconEditBook" />
            </div>
            <div className="mb-3 line-content">
              <label className="form-label">Password</label>
              <div className='content-data'>**************</div>
            </div>
          </div> ): 
          (<form className="needs-validation frm-profile-setting" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3 mt-3">
            <label className="form-label">New Password</label>
            <input
              {...register("new_pw")}
              type="password"
              className={`form-control ${errors.new_pw?.message ? "is-invalid" : ""} `}
              placeholder="Enter Your Password" />
            {errors.new_pw?.message && <div className="invalid-feedback">{errors.new_pw?.message}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              {...register("confirmPassword")}
              type="password"
              className={`form-control ${errors.confirmPassword?.message ? "is-invalid" : ""} `}
              placeholder="Enter Your Password" />
            {errors.confirmPassword?.message && <div className="invalid-feedback">{errors.confirmPassword?.message}</div>}
          </div>
          <div className="mb-5 ">
            <label className="form-label">Current Password</label>
            <input
              {...register("current_pw")}
              type="password"
              className={`form-control ${errors.current_pw?.message ? "is-invalid" : ""} `}
              placeholder="Enter Your Password" />
            {errors.current_pw?.message && <div className="invalid-feedback">{errors.current_pw?.message}</div>}
          </div>
          <div className="mt-2 mb-3 d-flex justify-content-end section-btn">
            <button type="button" className="btn-lg btn btn-light btn-cancel" onClick={() => setIsEdit(false)}>Cancel</button>
            <button type="submit" className="btn-lg btn btn-light btn-save">Save Changes</button>
          </div>
        </form>
      )}
    </div>
  );
}

export default SecuritySetting;
