import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useForm, SubmitHandler } from "react-hook-form";
import { api } from 'configs/axios';
import { ToastSystem } from 'helper/toast_system';
import { ManageCollectionType } from "interfaces"
import { isEmpty } from "lodash"
import closeImge from "assets/images/close.png"
import { CardModel } from "model/data_sport/card_sport";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

type PropTypes = {
  isOpen: boolean,
  onClose?: () => void,
  onSuccess?: (note: string) => void,
}
type APIForm = {
  api_name: string
};


const RequestAPIModal = ({ isOpen = false, ...props }: PropTypes) => {

  const validationSchema = Yup.object().shape({
    api_name: Yup.string()
      .max(100, 'Bạn đã nhập hơn 100 kí tự')
      .required('Api name is required'),

  });
  const formOptions = { resolver: yupResolver(validationSchema) }
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<APIForm>(formOptions);

  const onSubmit = async (data: APIForm) => {
    if (props.onSuccess) {
      props.onSuccess(data.api_name);
    }
  }


  return (
    <Modal
      onHide={() => {
        props?.onClose && props.onClose()
      }}
      show={isOpen}
      centered
      fullscreen="sm-down"
      className="modal-profile-collection">
      <Modal.Header >
        <Modal.Title>Request API Key</Modal.Title>
        <button
          onClick={() => props?.onClose && props.onClose()}
          type="button"
          className="close"
        >
          <img src={closeImge} alt="" />
        </button>
      </Modal.Header>
      <Modal.Body className="customScroll">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row col-mar-10">
            <div className="mb-3">
              <label className="form-label">API NAME</label>
              <input
                type="text"
                {...register("api_name")}
                className={`form-control ${errors.api_name?.message ? "is-invalid" : ""} `}
              />
              <span className="fs12"> The maximum len of your API name is 100 characters.</span>
              {errors.api_name?.message && <div className="invalid-feedback">{errors.api_name?.message}</div>}
            </div>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={() => props?.onClose && props.onClose()}>Cancel</button>
        <button type="button" onClick={handleSubmit(onSubmit)} className="btn btn-secondary">Submit</button>
      </Modal.Footer>
    </Modal>);
}

export default React.memo(RequestAPIModal);
