import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useForm, SubmitHandler } from "react-hook-form";
import { api } from 'configs/axios';
import { ToastSystem } from 'helper/toast_system';
import { ManageCollectionType } from "interfaces"
import { isEmpty } from "lodash"
import closeImge from "assets/images/close.png"
import { CardModel } from "model/data_sport/card_sport";
import { useRouter } from 'next/router'

type PropTypes = {
  isOpen: boolean,
  onClose?: () => void,
  onSuccess?: (item?: number, note?: string) => void,
  cardDetail?: CardModel
  onConfirmRemove?: (id: number) => void
}
type CollectionForm = {
  note: string
};


const EditNote = ({ cardDetail, isOpen = false, ...props }: PropTypes) => {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CollectionForm>();
  const router = useRouter();

  const onClickSubmit: SubmitHandler<CollectionForm> = async data => {
    onUpdate(data)
  }

  const onUpdate = async (data: CollectionForm) => {
    // @ts-ignore
    router.push(`/profile/collections/edit-card?collection=${cardDetail.group_ref}&code=${cardDetail.code}`)
    // try {
    //   const params = {
    //     table: "portfolio",
    //     card_id: cardDetail?.code,
    //     port_id: cardDetail?.portid,
    //     note: data.note
    //   }
    //   const result = await api.v1.portfolio.updateNotePortfolio(params);
    //   if (result.success) {
    //     props.onSuccess && props.onSuccess(cardDetail?.portid, data.note);
    //     return ToastSystem.success("Update successfully");
    //   }
    //   ToastSystem.error(result.message ?? result.error);
    // }
    // catch (err) { }
  }


  useEffect(() => {
    setForm()
  }, [cardDetail])

  const setForm = () => {
    setValue('note', cardDetail?.note ?? "")
  }

  return (
    <Modal
      onHide={() => {
        props?.onClose && props.onClose()
      }}
      show={isOpen}
      centered
      fullscreen="sm-down"
      className="modal-edit-note modal-collection">
      <Modal.Header >
        <Modal.Title>Notes</Modal.Title>
        <button
          onClick={() => props?.onClose && props.onClose()}
          type="button"
          className="close"
        >
          <svg width="20" height="20" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.9999 12.4199L17.6799 20.0999L19.5999 18.1799L11.9199 10.4999L19.5999 2.8199L17.6799 0.899902L9.9999 8.5799L2.3199 0.899902L0.399902 2.8199L8.0799 10.4999L0.399902 18.1799L2.3199 20.0999L9.9999 12.4199Z" fill="#6D7588"></path></svg>
        </button>
      </Modal.Header>
      <Modal.Body className="customScroll">
        <form onSubmit={handleSubmit(onClickSubmit)}>
          <div className="row col-mar-10">
            <div className="mb-3">
              {/* <textarea {...register("note")} className="form-control" rows={4} cols={50}>
              </textarea> */}
              {cardDetail?.note ?? ""}
              {errors.note && <span className="invalid-feedback d-inline">This field is required</span>}
            </div>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer className="btn-group-edit-note">
        <button onClick={handleSubmit(onClickSubmit)} type="button" className="text-center btn btn-close-modal m-0 fs-18 border-none">Edit</button>
        <button className="btn btn-primary bg-124DE3 m-0 ml-24 fs-18 border-none text-center" onClick={() => props?.onClose && props.onClose()}>Close</button>
       
      </Modal.Footer>
    </Modal>);
}

export default EditNote;
