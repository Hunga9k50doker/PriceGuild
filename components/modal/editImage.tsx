import React, { useState } from "react"
import Modal from 'react-bootstrap/Modal';
// @ts-ignore
import ImageEditor from '@toast-ui/react-image-editor';
import 'tui-image-editor/dist/tui-image-editor.css';
import closeImge from "assets/images/clear_modal.png"
import { api } from 'configs/axios';
import { ToastSystem } from 'helper/toast_system';
import dynamic from 'next/dynamic';
// @ts-ignore
import { EditorProps } from '@toast-ui/react-editor';
import CropImage from "./CropImage"

// // @ts-ignore
// const Editor = dynamic<EditorProps>(() => import('@toast-ui//react-image-editor')
//   .then(m => m.Editor), { ssr: false });
  const DynamicComponentWithNoSSR = dynamic<EditorProps>(
    () => import("./EditImageNoSSR/index"),
    { ssr: false }
  );
const icona = require("tui-image-editor/dist/svg/icon-a.svg");
const iconb = require("tui-image-editor/dist/svg/icon-b.svg");
const iconc = require("tui-image-editor/dist/svg/icon-c.svg");
const icond = require("tui-image-editor/dist/svg/icon-d.svg");
const myTheme = {
  "menu.backgroundColor": "#FFFFFF",
  "common.backgroundColor": "#FFFFFF",
  "downloadButton.backgroundColor": "#FFFFFF",
  "downloadButton.borderColor": "#FFFFFF",
  "downloadButton.color": "#FFFFFF",
  "menu.normalIcon.path": icond,
  "menu.activeIcon.path": iconb,
  "menu.disabledIcon.path": icona,
  "menu.hoverIcon.path": iconc,
};

type PropTypes = {
  onSuccessFile: (base64: any, name?: string, path?: string) => void;
  code: string,
  isClaim?: boolean,
  onClose?: () => void;
}

type ImageEditorInstType = {
  toDataURL: (value: any) => void
}
type FilterHandle = {
  imageEditorInst: ImageEditorInstType
}
export type EditImageType = {
  action: (src: string, name: string, current_path: string) => void
}

const EditImage = React.forwardRef<EditImageType, PropTypes>((props, ref) => {
  console.log(props);
  const [isOpen, setIsOpen] = React.useState(false);
  const imageEditorRef = React.useRef<FilterHandle>(null);
  const [imageSrc, setImageSrc] = React.useState("");
  const [nameImage, setNameImage] = React.useState("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [allIns, setAllIns] = React.useState<any>(null);
  const [allCropImage, setAllCropImage] = React.useState<any>(null);
  const [currentPath, setCurrentPath] = React.useState<string | undefined>(null);
  const [link, setLink] = React.useState<any>("");
  React.useImperativeHandle(ref, () => ({
    action(src: string, name: string, current_path?: string) {
      setIsOpen(true);
      setImageSrc(src);
      setNameImage(name)
      setCurrentPath(current_path)
    },
  }));

  const saveImageToDisk = () => {
    if (allCropImage) {
      setIsLoading(true);
      const imageEditorInst = allCropImage?.current?.cropper.getCroppedCanvas();
      const data = imageEditorInst?.toDataURL({ format: "jpeg", quality: 0.7 });
      updateImage(data);
    }
  };

  const updateImage = async (data: any) => {
    try {
      let result: any = null;
      if (props.isClaim) {
        const body = {
          image: data,
          card_code: props.code,
          front_back: nameImage === "Front" ? "F" : "B",
          current_path: currentPath
        }
        result = await api.v1.communal_images.uploadImageCommunalv2(body);
      } else {
        const params = {
          image: data,
          card_code: props.code,
          current_path: currentPath
        }
        result = await api.v1.portfolio.uploadImage(params)
      }

      if (result.success) {
        let { path } = result.data;
        props.onSuccessFile(data, nameImage, path)
        setIsLoading(false);
        return setIsOpen(false);
      }
      ToastSystem.error(result.message);
      setIsLoading(false);
    }
    catch (err) {
      setIsLoading(false);
    }
  }

  const onClose = () => {
    setIsOpen(false);
    props.onClose && props.onClose()
  }

  return (
    <Modal
      onHide={onClose}
      centered show={isOpen} size="lg" className="modal-profile-collection">
      <Modal.Header >
        <Modal.Title>Crop Photo</Modal.Title>
        <button
          onClick={onClose}
          type="button"
          className="close"
          data-dismiss="modal"
          aria-label="Close"
        >
          <img src={closeImge.src} alt="" />
        </button>
      </Modal.Header>
      <Modal.Body>
      <CropImage  src={imageSrc} onGetImage={setAllCropImage}/>
      </Modal.Body>
      <Modal.Footer className="modal-footer-crop">
        <button className="btn btn-secondary btn-bg--secondary btn-color--primary" onClick={onClose}>Cancel</button>
        <button disabled={isLoading} onClick={saveImageToDisk} className="btn btn-secondary btn-bg--primary btn-color--white">  Done {isLoading && <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true" />}
        </button>
      </Modal.Footer>
    </Modal>);
})

export default React.memo(EditImage);