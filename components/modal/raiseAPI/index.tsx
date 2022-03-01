import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useForm } from "react-hook-form";
import { api } from 'configs/axios';
import { ToastSystem } from 'helper/toast_system';
import closeImge from "assets/images/close.png"
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

type PropTypes = {
  api_id?: number,
  isOpen: boolean,
  onClose?: () => void,
  onSuccess?: (domain: string) => void,
}
type APIForm = {
  detail: string
};


const RaiseAPIModal = ({ isOpen = false, ...props }: PropTypes) => {
  const [isLoading, setIsLoading] = useState<Boolean>(false);

  const validationSchema = Yup.object().shape({
    detail: Yup.string()
      .max(100, 'Bạn đã nhập hơn 100 kí tự')
      .required('Api name is required'),

  });
  const formOptions = { resolver: yupResolver(validationSchema) }
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<APIForm>(formOptions);

  const onSubmit = async (data: APIForm) => {
    try {
      const params = {
        detail: data.detail,
        api_id: props.api_id,
      }
      const result = await api.v1.embedded.requestRaiseLimit(params)
      if (result.success) {
        if (props.onSuccess) {
          ToastSystem.success(result.message);
          return props.onSuccess(data.detail);
        }
      }
      ToastSystem.error(result.message);
      setIsLoading(false);
    }
    catch (err) {
      setIsLoading(false);
      console.log(err)
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
        <Modal.Title>Raise API Limit</Modal.Title>
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
              <label className="form-label">Please describe how you will use the API.</label>
              <textarea
                rows={4} cols={50}
                {...register("detail")}
                className={`form-control ${errors.detail?.message ? "is-invalid" : ""} `}
              />
              {errors.detail?.message && <div className="invalid-feedback">{errors.detail?.message}</div>}
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

export default React.memo(RaiseAPIModal);
