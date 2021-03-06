import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useForm, SubmitHandler } from "react-hook-form";
import { api } from 'configs/axios';
import { ToastSystem } from 'helper/toast_system';
import { ManageCollectionType } from "interfaces"
import { isEmpty } from "lodash"
import IconDelete from "assets/images/delete.png"
import SheetIcon from "assets/images/sheet.svg"
import * as Yup from 'yup';
import { RegexString } from 'utils/constant';
import { yupResolver } from '@hookform/resolvers/yup';
import moment from "moment"
// @ts-ignore
import { CSVLink } from "react-csv";
import { useTranslation } from "react-i18next";
import { useRouter } from 'next/router'
import Link from 'next/link'
import { MyStorage } from 'helper/local_storage';
import { pageView, event } from "libs/ga"

type PropTypes = {
  isOpen: boolean,
  onClose?: () => void,
  onSuccess?: (item?: any) => void,
  collectionDetail?: ManageCollectionType,
  selectCollection?: (item: ManageCollectionType) => void;
  onConfirmRemove?: () => void,
  title?: string,
  table?: string,
  onClaimPhoto?: (id: number) => void,
}
type CollectionForm = {
  collectionName: string,
  type: string;
};

const Collection = ({ 
  onClaimPhoto, 
  title = "collection", 
  table, 
  collectionDetail, 
  isOpen = false, ...props }: PropTypes) => {

  const inputNameRef = useRef<HTMLInputElement>(null);

  const CSVRef = React.useRef<HTMLLinkElement>(null);

  const validationSchema = Yup.object().shape({
    collectionName: Yup.string()
      .matches(RegexString.trimWhiteSpace, 'This field is required')
      .required('This field is required').min(1, 'This field is required'),
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [dataJson, setDataJson] = useState<any>({
    head: [],
    body: [],
  });

  const router = useRouter()

  const [t, i18n] = useTranslation("common")

  const pathname = router.pathname.split("/")

  const { 
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    setFocus,
    clearErrors,
    resetField } = useForm<CollectionForm>({
      resolver: yupResolver(validationSchema),
      mode: 'onChange'
    });

  const onClickSubmit: SubmitHandler<CollectionForm> = async data => {
    isEmpty(collectionDetail) ? onCreate(data) : onUpdate(data)
  }

  const onUpdate = async (data: CollectionForm) => {
    try {
      const params = {
        table: table,
        group_id: collectionDetail?.group_ref,
        visibility: Number(data.type),
        new_group_name: data.collectionName
      }
      const result = await api.v1.collection.editCollection(params);
      if (result.success) {
        props.onSuccess && props.onSuccess({
          name: data.collectionName,
          type: Number(data.type),
          isEdit: true
        });
        return ToastSystem.success("Update successfully");
      }
      ToastSystem.error(result.message ?? result.error);
    }
    catch (err) { }
  }

  const selectCollection = (item: ManageCollectionType) => {
    props.selectCollection && props.selectCollection(item)
  }

  // Create a New Portfolio / Wishlist
  const onCreate = async (data: CollectionForm) => {
    try {
      const params = {
        table: table,
        name: data.collectionName,
        type: Number(data.type)
      }
      setIsLoading(true);
      const result = await api.v1.collection.createCollection(params);
      if (result.success) {

        console.log('folder created sucesfully here', result)

        props.onSuccess && props.onSuccess({
          name: data.collectionName,
          type: Number(data.type),
          isEdit: false
        });

        selectCollection({
          group_ref: result.data.id,
          group_name: result.data.group_name,
          type: result.data.type,
          unique_card: 0,
          total_card: 0
        });
        resetForm();
        setIsLoading(false);

        // Do not show the success toast when user is in the flow of adding a card
        // only show when created inside the profile section
        return pathname[1] == 'profile' ? ToastSystem.success(
          <div className="toast-grade-content">
            Create new {title === 'collection' ? 'portfolio' : title} successfully {" "}
            <Link href={`/profile/${title === 'collection' ? 'portfolio' : title + 's'}/${result?.data?.id}/${encodeURIComponent(result?.data?.group_name?.replaceAll("/", "-"))}}`}>
              <a className="text-decoration-none">
                {result?.data?.group_name} {" "} {Boolean(result?.data?.type === 2) && <i className="ic-padlock fz-10" aria-hidden="true"></i>}{" "}
              </a>
            </Link>
          </div>) : '';
      }
      ToastSystem.error(result.message ?? result.error);
    }
    catch (err) { }
  }

  useEffect(() => {
    if (isEmpty(collectionDetail)) {
      resetForm()
    }
    else {
      setForm()
    }
  }, [collectionDetail])

  React.useEffect(() => {
    if (dataJson.head.length) {
      // @ts-ignore
      CSVRef?.current?.link.click();
    }
  }, [dataJson])

  const getDataJson = async () => {
    try {
      const result = await api.v1.portfolio.pg_app_portfolio_export_generate({
        "collection": `${collectionDetail?.group_ref}`,
        "list_name": table
      })
      setDataJson(result)

      /* ga event */
      event({
        action: "data_export",
        params: {
          eventCategory: 'Portfolio',
          eventAction: "data_export",
          eventLabel: "Portfolio Data Export"
        }
      })
    }
    catch (err) {

    }
  }

  const setForm = () => {
    setValue('collectionName', collectionDetail?.group_name ?? "")
    setValue('type', collectionDetail?.type?.toString() ?? "1")
  }

  const resetForm = () => {
    reset({
      collectionName: "",
      type: "1"
    })
  }

  const onRemove = () => {
    props.onConfirmRemove && props.onConfirmRemove();
  }

  const claimPhoto = () => {
    onClaimPhoto && onClaimPhoto(collectionDetail?.group_ref ?? 0)
  }

  const renderTextLower = (type: String) => {
    switch (type) {
      case 'wishlist':
        return 'Wishlist';
      case 'collection':
        return `${t('portfolio.text')}`;
      default:
        break;
    }
  }

  React.useEffect(() => {
    setDataJson({
      head: [],
      body: [],
    })
    if (isOpen === true) {
      let timerid = null;
      if (timerid) {
        clearTimeout(timerid);
      }
      timerid = setTimeout(() => {
        // console.log(inputNameRef.current?.focus)
        // inputNameRef.current?.focus();
        isEmpty(collectionDetail) && resetField("collectionName");
        isCheckGroupRef() && setFocus("collectionName");
      }, 350);
    }
  }, [isOpen])

  const renderLinkShareFB = () => {
    let fb_share = `https://www.facebook.com/sharer/sharer.php?u=`;
    let host: string | undefined = '';

    if (location.hostname === 'localhost') {
      host = 'http://localhost:3000';
    } else {
      host = process.env.DOMAIN;
    }
    let data_url = encodeURI(`${fb_share}${host}/profile/${MyStorage.user.userid.toString()}/${table === 'wishlist' ? 'wishlists' : table}/${collectionDetail?.group_ref}/${collectionDetail?.group_name.indexOf('/') === -1 ? collectionDetail?.group_name?.replace(/\s/g, "-") : collectionDetail?.group_name?.replaceAll('/', '-').replaceAll(' ', '')}`);

    return data_url;
  }

  const renderLinkShareTwitter = () => {
    let fb_share = `https://twitter.com/intent/tweet?url=`;
    let host: string | undefined = '';

    if (location.hostname === 'localhost') {
      host = 'http://localhost:3000';
    } else {
      host = process.env.DOMAIN;
    }
    let data_url = encodeURI(`${fb_share}${host}/profile/${MyStorage.user.userid.toString()}/${table === 'wishlist' ? 'wishlists' : table}/${collectionDetail?.group_ref}/${collectionDetail?.group_name.indexOf('/') === -1 ? collectionDetail?.group_name?.replace(/\s/g, "-") : collectionDetail?.group_name?.replaceAll('/', '-').replaceAll(' ', '')}`);

    return data_url;
  }

  const onChange = (e: any) => {
    const { value } = e.target;
    if (value) {
      setValue('collectionName', value);
      clearErrors("collectionName")
    }
  }

  const isCheckGroupRef = () => {
    return isEmpty(collectionDetail) || (!isEmpty(collectionDetail) && collectionDetail?.group_ref !== 0)
  }

  return (
    <Modal
      onHide={() => {
        props?.onClose && props.onClose()
      }}
      show={isOpen}
      centered
      fullscreen="sm-down"
      className="modal-collection modal-collection-edit--mobile">
      <Modal.Header >
        <Modal.Title className="text-capitalize">{isEmpty(collectionDetail) ? `New ${title === 'collection' ? t('portfolio.text') : title}` : `Edit ${title === 'collection' ? t('portfolio.text') : title}`}</Modal.Title>
        <button
          onClick={() => props?.onClose && props.onClose()}
          type="button"
          className="close mt-2"
        >
          <svg width="20" height="20" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M9.9999 12.4199L17.6799 20.0999L19.5999 18.1799L11.9199 10.4999L19.5999 2.8199L17.6799 0.899902L9.9999 8.5799L2.3199 0.899902L0.399902 2.8199L8.0799 10.4999L0.399902 18.1799L2.3199 20.0999L9.9999 12.4199Z" fill="#6D7588" />
          </svg>
        </button>
      </Modal.Header>
      <Modal.Body className="customScroll">
        <form className="form-collection" onSubmit={handleSubmit(onClickSubmit)}>
          <div className="col-mar-10">
            {isCheckGroupRef() && <div className="form-check-edit-collection mb-3">
              <label className="form-label text-capitalize">{title === 'collection' ? t('portfolio.text') : title} Name</label>
              <input {...register("collectionName", { required: true })}
                placeholder={`Enter ${renderTextLower(title)} Name`}
                maxLength={50}
                autoFocus
                // ref={inputNameRef}
                onChange={onChange}
                type="text" className="form-control" />
              {errors.collectionName && <span className="invalid-feedback d-inline">{errors.collectionName?.message}</span>}
            </div>}
            {isCheckGroupRef() && <div className={`mb-3 form-check-radio ${isEmpty(collectionDetail) ? 'pb-0' : ''}`}>
              <label className="form-label">Who can see this {title === 'collection' ? t('portfolio.text_normal') : title}</label>
              <div className={`d-flex pe-10 form-collection--checked hover ${!isEmpty(collectionDetail) ? 'edit' : ''}`}>
                <div className="form-check col form-check-inline ">
                  <input className="form-check-input cursor-pointer" {...register("type", { required: true })} type="radio" name="type" id="onlyme" value="2" />
                  <label className="form-check-label cursor-pointer" htmlFor="onlyme">Only me</label>
                </div>
                <div className="form-check col form-check-inline">
                  <input className="form-check-input cursor-pointer" {...register("type", { required: true })} type="radio" name="type" id="everyone" value="1" />
                  <label className="form-check-label cursor-pointer" htmlFor="everyone">Everyone</label>
                </div>
              </div>
            </div>}
            {/* {!isEmpty(collectionDetail) && Boolean(collectionDetail?.claim) && <>
              <div className="mb-3 form-collection-claim">
                <div className="d-flex justify-content-center">
                  <button onClick={claimPhoto} className="shadow-none btn btn-outline--custom w-209 color-124DE3 white-space-nowrap" type="button"> Submit All   {collectionDetail?.claim} Images </button>
                </div>
              </div>
              <div className="mb-3 form-collection-term">
                <p>
                  <span className="text-decoration-underline color-124DE3">Submit your images </span> to the public gallery
                </p>
              </div>
              <hr className="hr--color" />
            </>} */}
            {!isEmpty(collectionDetail) && <> <div className="form-collection-social">
              {isCheckGroupRef() && <label className="form-label text-capitalize form-label-check-box">Share {title === 'collection' ? t('portfolio.text') : title}</label>}
              <div className="d-flex justify-content-between btn-social">
                {isCheckGroupRef() && <div className="d-flex btn-social-content">
                  <div className="text-center col cursor-pointer">
                    <Link href={renderLinkShareTwitter()}>
                      <a className="py-2 btn btn-social-twitter" target='_blank'>
                        <i className="ic-share-twitter" />
                      </a>
                    </Link>
                  </div>
                  <div className="text-center col cursor-pointer">
                    <Link href={renderLinkShareFB()} >
                      <a className="py-2 btn btn-social-facebook" target='_blank'>
                        <i className="ic-share-facebook" />
                      </a>
                    </Link>
                  </div>
                </div>}
                <div className="text-center col cursor-pointer">
                  <button
                    type="button"
                    className="shadow-none btn btn-outline-secondary btn-export"
                    onClick={getDataJson}
                  > <img src={SheetIcon} alt="Export Data" /> Export Data </button>
                  <CSVLink
                    ref={CSVRef}
                    filename={`${collectionDetail?.group_name.split(" ").join("_")}_${moment().format("MMDDYYYY_HHmmss")}.csv`}
                    className="d-none"
                    data={dataJson?.body}
                    headers={dataJson?.head}
                  > <img src={SheetIcon} alt="Export Data" /> Export Data </CSVLink>
                </div>
              </div>
            </div>
              {isCheckGroupRef() && <div className="btn-group-remove--mobile">
                <div className="text-center d-flex justify-content-center mt-3">
                  <a onClick={onRemove} href="javascript:void(0)" className="text-reset btn-remove text-capitalize"> <img src={IconDelete.src} alt="Remove" /> Remove {title === 'collection' ? t('portfolio.text') : title} </a>
                </div>
              </div>}
            </>}
          </div>
        </form>
      </Modal.Body>
      {isCheckGroupRef() && <Modal.Footer>
        <button className="btn btn-outline btn-close-modal m-0" onClick={() => props?.onClose && props.onClose()}>Cancel</button>
        <button onClick={handleSubmit(onClickSubmit)} type="button" className="btn btn-primary btn-wishlist text-truncate bg-124DE3 m-0 ml-24">{isEmpty(collectionDetail) ? `Create ${renderTextLower(title)}` : "Save Changes"}
          {isLoading &&
            <span
              className="spinner-grow spinner-grow-sm"
              role="status"
              aria-hidden="true"
            />
          }
        </button>
      </Modal.Footer>}
    </Modal>);
}

export default Collection;
