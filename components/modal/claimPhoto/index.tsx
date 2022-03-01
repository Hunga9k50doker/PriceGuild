import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useForm, SubmitHandler } from "react-hook-form";
import { api } from 'configs/axios';
import { ToastSystem } from 'helper/toast_system';
import { ManageCollectionType } from "interfaces"
import { isEmpty } from "lodash"
import closeImge from "assets/images/close.png"
import { CardModel } from "model/data_sport/card_sport";
import EditImage, { EditImageType } from "components/modal/editImage"
import imageUpload from "assets/images/ImageUpload.png"
import backgroundImage from "assets/images/background.png"

type PropTypes = {
  isOpen?: boolean,
  onClose?: () => void,
  onSuccess?: () => void,
  cardDetail?: CardModel
  onConfirmRemove?: (id: number) => void
  code: string,
  frontBack: string
}

type ImageType = {
  url: string,
  path?: string,
}

const ClaimPhoto = ({ cardDetail, isOpen = false, ...props }: PropTypes) => {
  const [imageFront, setImageFront] = useState<ImageType>({
    url: imageUpload,
    path: "",
  })
  const [imageBack, setImageBack] = useState<ImageType>({
    url: imageUpload,
    path: "",
  })

  useEffect(() => {
    if (isOpen) {
      setImageBack({
        url: imageUpload,
        path: "",
      })
      setImageFront({
        url: imageUpload,
        path: "",
      })
      setIsLoading(false);
    }
  }, [isOpen])

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const EditImageRef = React.useRef<EditImageType>(null);
  const [isActiveSlide, setIsActiveSlide] = useState<boolean>(false);
  const onClickSubmit = async () => {
    try {
      if (!imageFront.path && !imageBack.path) {
        return ToastSystem.error("Please update file image");
      }
      setIsLoading(true)
      let params: any = {
        card_code: props.code,
      }
      if (imageFront.path) {
        params.front = imageFront.path;
      }
      if (imageBack.path) {
        params.back = imageBack.path;
      }

      const result = await api.v1.communal_images.saveImageCommunal(params)

      if (result.success) {
        props.onSuccess && props.onSuccess()
        ToastSystem.success(result.message);
        return setIsLoading(true)
      }
      ToastSystem.error(result.message);
      setIsLoading(false);
    }
    catch (err) {
      setIsLoading(false);
      console.log(err)
    }
  }
  const imageBackRef = React.useRef<HTMLInputElement>(null);
  const imageFrontRef = React.useRef<HTMLInputElement>(null);

  const onUploadFileInput = (e: any, name: string) => {
    var file = e.target.files[0];
    if (file) {
      var url = URL.createObjectURL(file);
      let current_path: string = name === "Front" ? imageFront?.path ?? "" : imageBack?.path ?? ""
      EditImageRef?.current?.action(url, name, current_path)
    }
  }
  const onUpLoadFile = (value: string) => {
    if (value === "Back") {
      imageBackRef?.current?.click();
    }
    else {
      imageFrontRef?.current?.click();
    }
  }

  const onSuccessFile = (base64: any, name?: string, path?: string) => {
    if (name === "Front") {
      // @ts-ignore: Unreachable code error
      document.getElementById("imageFrontRef").value = "";
      return setImageFront({
        url: base64,
        path: path
      })
    }
    // @ts-ignore: Unreachable code error
    document.getElementById("imageBackRef").value = "";
    setImageBack({
      url: base64,
      path: path
    })
  }

  const onCloseEditImage = () => {
    // @ts-ignore: Unreachable code error
    document.getElementById("imageFrontRef").value = "";
    // @ts-ignore: Unreachable code error
    document.getElementById("imageBackRef").value = "";
  }


  return (
    <Modal
      show={isOpen}
      centered
      onHide={() => {
        props?.onClose && props.onClose()
      }}
      size={props.frontBack === "all" ? "lg" : "sm"}
      fullscreen="sm-down"
      className="modal-edit-note-card-detail">
      <Modal.Header >
        <Modal.Title>Claim Photo</Modal.Title>
        <button
          onClick={() => props?.onClose && props.onClose()}
          type="button"
          className="close"
        >
          <svg width="20" height="20" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M9.9999 12.4199L17.6799 20.0999L19.5999 18.1799L11.9199 10.4999L19.5999 2.8199L17.6799 0.899902L9.9999 8.5799L2.3199 0.899902L0.399902 2.8199L8.0799 10.4999L0.399902 18.1799L2.3199 20.0999L9.9999 12.4199Z" fill="#6D7588" />
          </svg>
        </button>
      </Modal.Header>
      <Modal.Body className="customScroll">
        <div className="only-mobile slide-modal">
          <div className="slide-modal-title">
            Slide
          </div>
          <div className="d-flex slide-modal-content">
            <div className={`w-50  slide-modal-text ${!isActiveSlide ? 'active' : ''}`} onClick={() => setIsActiveSlide(false)}>
              Front
            </div>
            <div className={`w-50 slide-modal-text   ${isActiveSlide ? 'active' : ''}`} onClick={() => setIsActiveSlide(true)}>
              Back
            </div>
          </div>
        </div>
        <div className="row image-upload">
          {(props.frontBack === "front" || props.frontBack === "all") &&
            <div onClick={() => onUpLoadFile("Front")} className={`${props.frontBack === "all" ? "col-12 col-md-6 col-sm-6" : ""}  ${!isActiveSlide ? ' active ' : ''}text-center`}>
              <input ref={imageFrontRef} id="imageFrontRef" className="d-none" type='file' onChange={(e) => onUploadFileInput(e, "Front")} accept="image/*" />
              <img height="386" className="cursor-pointer rounded w-100" src={imageFront.url ? imageFront.url : backgroundImage} alt="" />
              <div className="cart-title">Card Front</div>
            </div>}
          {(props.frontBack === "back" || props.frontBack === "all") &&
            <div onClick={() => onUpLoadFile("Back")} className={`${props.frontBack === "all" ? "col-12 col-md-6 col-sm-6" : ""} ${isActiveSlide ? ' active ' : ''} text-center`}>
              <img height="386" className="cursor-pointer rounded w-100" src={imageBack.url ? imageBack.url : backgroundImage} alt="" />
              <input ref={imageBackRef} id="imageBackRef" className="d-none" type='file' onChange={(e) => onUploadFileInput(e, "Back")} accept="image/*" />
              <div className="cart-title">Card Back</div>
            </div>}

        </div>
        <EditImage isClaim={true} onClose={onCloseEditImage} code={props.code} onSuccessFile={onSuccessFile} ref={EditImageRef} />
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-cancel" onClick={() => props?.onClose && props.onClose()}>Cancel</button>
        {(imageFront.path || imageBack.path) && <button disabled={isLoading} onClick={onClickSubmit} type="button" className="btn btn-claim">Claim {`Photo${imageFront.path && imageBack.path ? "s" : ""}`}</button>}
      </Modal.Footer>
    </Modal>);
}

export default ClaimPhoto;
