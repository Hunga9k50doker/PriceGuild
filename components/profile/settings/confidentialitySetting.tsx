import React, { useEffect, useState } from 'react';
import Select from 'react-select'
// import Swal from 'sweetalert2'
import 'sweetalert2/src/sweetalert2.scss'
import { ToastSystem } from "helper/toast_system";
import { api } from 'configs/axios';
import { useDispatch, useSelector } from 'react-redux';
import { AuthActions } from "redux/actions/auth_action";
import IconEditBook from 'assets/images/edit_book_icon.svg'
import Selectors from 'redux/selectors';
import { PgAppProfileType } from 'interfaces';
import { useTranslation } from "react-i18next";
import ModalDeleteAccount from "components/modal/delete/account"
import { useHistory } from "react-router-dom";

type Props = {
  profile: PgAppProfileType | undefined,
  setProfile: (profile: PgAppProfileType | undefined) => void,
}

const ConfidentialitySetting = (props: Props) => {

  const dispatch = useDispatch();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [t, i18n] = useTranslation("common");
  const options = [
    { value: 0, label: 'Private', text: "Your name and location will be hidden from other members and non-members of the site, only your username will be visible." },
    { value: 1, label: 'Public', text: `Your name and location as entered in the profile section will be displayed to other members and non-members of the site when they are browsing your profile, public ${t('portfolio.portfolios')} or interacting with you through messaging on the site.` },
  ]
  const history = useHistory();
  const [confidentiality, setConfidentiality] = useState<{ value: number, label: string, text: string }>(options[props.profile?.user_info?.confidentiality ?? 0]);
  useEffect(() => {
    setConfidentiality(options[props.profile?.user_info?.confidentiality ?? 0]);
  }, [props.profile])

  // const onConfirmRemove = () => {
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: "This will delete your account",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, delete it!'
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       setIsEdit(false);
  //       onRemove()
  //     }
  //   })
  // }

  const onSave = async () => {
    try {
      const res = await api.v1.authorization.updateConfidentiality(confidentiality.value);
      if (res.success) {
        setIsEdit(false)
        ToastSystem.success(res?.data?.message);
        // @ts-ignore
        props.profile.user_info.confidentiality = confidentiality.value;
        // @ts-ignore
        props.setProfile({ ...props.profile })
      } else {
        // @ts-ignore
          if (res.data?.verify_redirect) {
            return history.push('/verify-email')
          }
        ToastSystem.error(res?.message);
      }

    } catch (err: any) {
      console.log(err.response)
      return ToastSystem.error(err?.response?.data?.message);
    }
  }

  const onRemove = async (data: any) => {
    try {
      const res = await api.v1.account.deleteAccount(data);
      if (res.success) {
        let timer: any = null;
        
        if (timer) {
          clearTimeout(timer);
        }
        setTimeout(() => {
          dispatch(AuthActions.logout());
        },1000)
      }
      return ToastSystem.success(res.message);
    }
    catch (err: any) {
      return ToastSystem.error(err.response.data.message);
    }
  }

  return (
    <><div className="profile-setting maxw-430">
      <div className='profile-setting-title'>
        <span>Confidentiality</span>
      </div>
      {!isEdit ?
        (
          <>
            <div className='box-content'>
              <div className='icon-edit' onClick={() => setIsEdit(true)}>
                <img src={IconEditBook} alt="IconEditBook" />
              </div>
              <div className="mb-3 line-content">
                <label className="form-label">Account Type</label>
                <div className='content-data'>{options[props.profile?.user_info?.confidentiality ?? 0].label}</div>
              </div>
            </div>
            <div className='section-btn-delete'>
              <button onClick={() => setIsOpenModal(true)} type="button" className="btn btn-outline-secondary btn-delete-account"> Delete Account </button>
            </div>
          </>
        ) :
        (<form className='frm-profile-setting'>
          <div className="mb-3 mt-3">
            <label className="form-label"> Account Type </label>
            <Select
              options={options}
              value={confidentiality}
              onChange={(value) => {
                if (value) {
                  setConfidentiality(value);
                }
              } }
              className="select-price customScroll"
              classNamePrefix="select-price" />
            <div className="mt-3"> {confidentiality?.text} </div>
          </div>
          <div className="mt-5 mb-3 d-flex justify-content-end section-btn">
            <button type="button" className="btn-lg btn btn-light btn-cancel" onClick={() => setIsEdit(false)}> Cancel </button>
            <button type="button" className="btn-lg btn btn-light btn-save" onClick={onSave}> Save Changes </button>
          </div>
        </form>
        )}
    </div>
    <ModalDeleteAccount
      isOpen={isOpenModal}
      title={`Confirm deletion by entering your password`}
      subTitle={`Deleting your account is permanent and cannot be undone.`}
      onClose={() => setIsOpenModal(false)}
      onSuccess={(e) => onRemove(e)}
    />
     </>
  );
}

export default ConfidentialitySetting;
