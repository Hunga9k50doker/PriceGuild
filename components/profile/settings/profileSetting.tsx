import React, { useState } from 'react';
import Select from 'react-select'
import { useSelector, useDispatch } from 'react-redux';
import Selectors from 'redux/selectors';
import { useForm, Controller } from "react-hook-form";
import Timezone from 'utils/timezones';
import { api } from 'configs/axios';
import { PgAppProfileType } from "interfaces"
import { isEmpty } from "lodash";
import { ToastSystem } from "helper/toast_system";
import { MyStorage } from "helper/local_storage";
import { User } from "model/user";
import { AuthActions } from 'redux/actions/auth_action';
import IconEditBook from 'assets/images/edit_book_icon.svg'
import { useRouter } from 'next/router'

type Inputs = {
  firstname: string,
  lastname: string,
  location: string,
  timezone: any,
  bio: string,
};

type PropsType = {
  profileData: PgAppProfileType | undefined
}

const ProfileSetting = ({ profileData }: PropsType) => {
  const { register, handleSubmit, control, formState: { errors }, setValue } = useForm<Inputs>();
  const [profile, setProfile] = useState<PgAppProfileType | undefined>(profileData)
  const { userInfo } = useSelector(Selectors.auth);
  const avatarRef = React.useRef<HTMLInputElement>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const dispatch = useDispatch();
  const router = useRouter();

  React.useEffect(() => {
    if (!isEmpty(profileData)) {
      setProfile(profileData);
      setValue("location", profileData?.user_info.location ?? "")
      setValue("bio", profileData?.user_info.bio ?? "");
      ChangeTextAreaCount(profileData?.user_info.bio?.length ?? 0);
      if (!isEmpty(profileData?.user_info.timezone)) {
        const timezone = Timezone.find(item => item.value === profileData?.user_info.timezone);
        setValue("timezone", timezone)
      }
    }
  }, [profileData])

  const onSubmit = async (data: Inputs) => {
    try {
      const params = {
        ...data,
        timezone: data.timezone?.value ?? ""
      }
      const res = await api.v1.authorization.updateProfile(params);
      if (res.success) {
        updateSuccess(res.data);
        setIsEdit(false);
        //  @ts-ignore
        setProfile(prevState => {
          return { ...prevState, user_info: res.data };
        });
        return ToastSystem.success(res.message);
      }
      if (!res.success) {
        // @ts-ignore
        if (res.data?.verify_redirect) {
          return router.push('/verify-email')
        }
      }
      return ToastSystem.error(res.message);
    }
    catch (err: any) {
      if(err?.response?.status === 403) {
        return router.push('/verify-email')
      }
      console.log(err)
    }
  }

  const onUploadFile = async (e: any) => {
    var file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append(
        "image_profile",
        file,
        file.name
      );
      try {
        const res = await api.v1.authorization.updateAvatar(formData);
        if (res.success) {
          userInfo.userImg = res.data;
          updateSuccess(userInfo.toJson())
          // @ts-ignore: Unreachable code error
          document.getElementById("avatarRef").value = "";
          return ToastSystem.success(res.message);
        }
        // @ts-ignore: Unreachable code error
        document.getElementById("avatarRef").value = "";
        return ToastSystem.error(res.message);
      }
      catch (err) {
        console.log(err)
      }
    }
  }

  const updateSuccess = (data: any) => {
    MyStorage.user = new User(data);
    dispatch(AuthActions.updateInfo(MyStorage.user));
  }

  const [textAreaCount, ChangeTextAreaCount] = React.useState(0);

  const recalculate = async (e: any) => {
    ChangeTextAreaCount(e.target.value.length);
  };
  // console.log(profile, 'profile')
  return (
    <div className="profile-setting maxw-430">
      <div className='profile-setting-title'>
        <span>Profile</span>
      </div>
      <div className="d-flex align-items-center mt-3 mb-3 box-avatar-picture">
        <div className="avatar">
          <img src={userInfo.userImg ? `${process.env.REACT_APP_IMAGE_URL}${userInfo.userImg}` : "http://cdn.onlinewebfonts.com/svg/img_568656.png"} className="rounded-circle" data-src="holder.js/171x180" alt="171x180" data-holder-rendered="true" />
        </div>
        <input ref={avatarRef} id="avatarRef" className="d-none" type='file' onChange={onUploadFile} accept="image/*" />
        <button onClick={() => avatarRef?.current?.click()} type="button" className="btn btn-outline-secondary btn-upload-image">Upload Photo</button>
      </div>
      {!isEdit ?
        (<div className='box-content'>
          <div className='icon-edit' onClick={() => setIsEdit(true)}>
            <img src={IconEditBook} alt="IconEditBook" />
          </div>
          <div className="mb-3 line-content">
            <label className="form-label">First Name</label>
            <div className='content-data'>{userInfo.firstname}</div>
          </div>
          <div className="mb-3 line-content">
            <label className="form-label">Last Name</label>
            <div className='content-data'>{userInfo.lastname}</div>
          </div>
          <div className="mb-3 line-content">
            <label className="form-label">Location</label>
            <div className='content-data'>{profile?.user_info?.location ?? ''}</div>
          </div>
          <div className="mb-3 line-content">
            <label className="form-label">Timezone</label>
            <div className='content-data'>{'GMT' + profile?.user_info?.timezone ?? ''}</div>
          </div>
          <div className="mb-3 line-content">
            <label className="form-label">Bio</label>
            <div className='content-data'>{profile?.user_info?.bio ?? ''}</div>
          </div>
        </div>) :
        (
          <form className='frm-profile-setting' onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label className="form-label">First Name</label>
              <input type="text" defaultValue={userInfo.firstname} {...register("firstname", { required: true })} className="form-control" />
            </div>
            <div className="mb-3">
              <label className="form-label">Last Name</label>
              <input type="text" defaultValue={userInfo.lastname} {...register("lastname", { required: true })} className="form-control" />
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <div className="col-md-8">
                <label className="form-label">Location</label>
                <input {...register("location")} type="text" className="form-control" />
              </div>
              <div className="col-md-4">
                <label className="form-label w-custom-lable">Timezone</label>
                <Controller
                  control={control}
                  name="timezone"
                  render={({
                    field: { onChange, value },
                  }) => (
                    <Select
                      value={value}
                      onChange={(e) => {
                        onChange(e);
                      }}
                      classNamePrefix="select-price"
                      className="select-price customScroll w-custom"
                      options={Timezone}
                      styles={{
                        // @ts-ignore
                        dropdownIndicator: (provided, state) => ({
                          ...provided,
                          transition: 'all .2s ease',
                          transform: state.selectProps.menuIsOpen && "rotate(180deg)"
                        })
                      }} />
                  )}
                  defaultValue={{ value: "-8", label: "GMT-8" }}
                />
              </div>
            </div>
            <div className="mb-5 mt-3">
              <label className="form-label">Bio</label>
              <textarea {...register("bio")} className="form-control" rows={4} cols={50} maxLength={500} onChange={recalculate}></textarea>
              <label className="form-label float-right">{textAreaCount}/500</label>
            </div>
            <div className=" mb-3 d-flex justify-content-end section-btn">
              <button type="button" className="btn-lg btn btn-light btn-cancel" onClick={() => setIsEdit(false)}>Cancel</button>
              <button type="submit" className="btn-lg btn btn-light btn-save">Save Changes</button>
            </div>
          </form>
        )}
    </div>
  );
}

export default ProfileSetting;