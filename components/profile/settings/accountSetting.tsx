import React, { useState, useEffect } from 'react';
import Select from 'react-select'
import { useSelector, useDispatch } from 'react-redux';
import Selectors from "redux/selectors";
import { useForm, Controller } from "react-hook-form";
import { MyStorage } from "helper/local_storage";
import { User } from "model/user";
import { AuthActions } from 'redux/actions/auth_action';
import { api } from 'configs/axios';
import { ToastSystem } from "helper/toast_system";
import { PgAppProfileType } from "interfaces"
import { isEmpty } from "lodash"
import IconEditBook from 'assets/images/edit_book_icon.svg'
import { useRouter } from 'next/router'

type Inputs = {
  default_currency: any,
  default_sport: any,
  news_letter: any,

};

type PropsType = {
  profileData: PgAppProfileType | undefined
}

const AccountSetting = ({ profileData }: PropsType) => {
  const dispatch = useDispatch();
  const [profile, setProfile] = useState<PgAppProfileType | undefined>(profileData)
  const { userInfo } = useSelector(Selectors.auth);
  const { currencies, sports } = useSelector(Selectors.config);
  const { register, handleSubmit, control, formState: { errors }, setValue } = useForm<Inputs>();
  const getOptionValue = (option: any) => option.id;
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [sportNameProfile, setSportNameProfile] = useState<any>({});

  React.useEffect(() => {
    if (!isEmpty(profile)) {
      setValue("default_currency", currencies?.find(c => c.value === userInfo.userDefaultCurrency))
      setValue("default_sport", sports?.find(c => c.id === (profile?.user_info?.default_sport ?? profile?.user_info?.user_default_sport)))
      setValue("news_letter", Boolean(profile?.user_info.newsLetter))
    }
  }, [profile])


  useEffect(() => {
    setProfile(profileData)
  }, [profileData])
  
  const router = useRouter();

  const onSubmit = async (data: Inputs) => {
    try {
      const params = {
        news_letter: data.news_letter ? 1 : 0,
        default_currency: data.default_currency.value,
        default_sport: data.default_sport.id
      }
      const res = await api.v1.authorization.updateProfile(params);
      if (res.success) {
        updateSuccess(res.data)
        //  @ts-ignore
        setProfile(prevState => {
          return { ...prevState, user_info: res.data };
        });
        setIsEdit(false)
      }
      if (!res.success) {
        // @ts-ignore
        if (result.data?.verify_redirect) {
          return router.push('/verify-email')
        }
      }
      return ToastSystem.show(res.message, { status: res.success ? 'success' : 'error' });
    }
    catch (err: any) {
      if(err?.response?.status === 403) {
        return router.push('/verify-email')
      }
      console.log(err)
    }
  }
  const updateSuccess = (data: any) => {
    MyStorage.user = new User(data);
    dispatch(AuthActions.updateInfo(MyStorage.user));
  }
  useEffect(() => {
    if (!isEmpty(sports) && !isEmpty(profile)) {
      const dataSport = sports.find(p => p.id === (profile?.user_info?.default_sport ?? profile?.user_info?.user_default_sport));
      setSportNameProfile(dataSport);
    }

  }, [sports, profile])

  return (
    <div className="profile-setting maxw-430">
      <div className='profile-setting-title'>
        <span> Account </span>
      </div>
      {!isEdit ?
        (<div className='box-content'>
          <div className='icon-edit' onClick={() => setIsEdit(true)}>
            <img src={IconEditBook} alt="IconEditBook" />
          </div>
          <div className="mb-3 line-content">
            <label className="form-label">Username</label>
            <div className='content-data'>{userInfo?.username}</div>
          </div>
          <div className="mb-3 line-content">
            <label className="form-label">Email</label>
            <div className='content-data'>{userInfo?.email}</div>
          </div>
          <div className="mb-3 line-content">
            <label className="form-label">Currency</label>
            <div className='content-data'>{userInfo?.userDefaultCurrency ?? ''}</div>
          </div>
          <div className="mb-3 line-content">
            <label className="form-label">Default Sport</label>
            <div className='content-data'>{sportNameProfile?.sportName ?? ''}</div>
          </div>
        </div>) :
        (
          <form className='frm-profile-setting' onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3 mt-3">
              <label className="form-label">Username</label>
              <input type="text" value={userInfo?.username} className="form-control" readOnly/>
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="text" value={userInfo?.email} className="form-control" readOnly />
            </div>
            <div className="mb-3">
              <label className="form-label">Currency</label>
              <Controller
                control={control}
                name="default_currency"
                render={({
                  field: { onChange, value },
                }) => (
                  <Select
                    value={value}
                    isSearchable={ false }
                    onChange={(e) => {
                      onChange(e);
                    }}
                    classNamePrefix="select-price"
                    className="select-price customScroll"
                    options={currencies}
                    styles={{
                      // @ts-ignore
                      dropdownIndicator: (provided, state) => ({
                        ...provided,
                        transition: 'all .2s ease',
                        transform: state.selectProps.menuIsOpen && "rotate(180deg)"
                      })
                    }}
 />
                )}
                defaultValue={{ value: "USD", label: "USD" }}
              />
            </div>
            <div className="mb-3">
              <label className="form-label"> Default Sport </label>
              <Controller
                control={control}
                name="default_sport"
                render={({
                  field: { onChange, value },
                }) => (
                  <Select
                    isSearchable={ false }
                    value={value}
                    onChange={(e) => {
                      onChange(e);
                    }}
                    getOptionValue={getOptionValue}
                    getOptionLabel={(option) => option.sportName}
                    className="select-price customScroll"
                    classNamePrefix="select-price"
                    options={sports}
                    styles={{
                      // @ts-ignore
                      dropdownIndicator: (provided, state) => ({
                        ...provided,
                        transition: 'all .2s ease',
                        transform: state.selectProps.menuIsOpen && "rotate(180deg)"
                      })
                    }}
 />
                )}
              />
            </div>
            <div className="form-check d-flex mb-5 align-items-center">
              <input {...register("news_letter")} className="form-check-input me-2" type="checkbox" id="flexCheckIndeterminate" />
              <label className="form-check-label lh-sm mt-1" htmlFor="flexCheckIndeterminate"> Sign me up for the Newsletter </label>
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

export default AccountSetting;
