import React, { useEffect, useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { use } from "i18next";
import { number } from "yup";
import IconCropArrowLeft from "assets/images/crop-arrow-left.svg"
import IconCropArrowRight from "assets/images/crop-arrow-right.svg"
import IconCropArrowTop from "assets/images/crop-arrow-top.svg"
import IconCropArrowBottom from "assets/images/crop-arrow-bottom.svg"
import IconCropZoomIn from "assets/images/crop-zoom-in.svg"
import IconCropZoomOut from "assets/images/crop-zoom-out.svg"
import IconCropPre from "assets/images/crop-pre.svg"
import IconCropNext from "assets/images/crop-next.svg"
import IconCropLandScape from "assets/images/crop-landscape.svg"
import IconCropPortrait from "assets/images/crop-portrait.svg"
// import "./Demo.css";

const defaultSrc =
  "https://raw.githubusercontent.com/roadmanfong/react-cropper/master/example/img/child.jpg";

type PropTypes = {
  src: any,
  onGetImage?: (value: any) => void
}
export const CropImage = ({ src = defaultSrc, ...props }: PropTypes) => {
  const [isLand , setIsLand] = useState<boolean>(true);
  const imageEditorRef = React.useRef<any>(null)
  const [zoom, setZoom] = useState<number>(0.5);
  const [image, setImage] = useState<any | undefined>(src);
  const [cropData, setCropData] = useState<any>("#");
  const [cropper, setCropper] = useState<any | undefined>(undefined);
  const [move, setMove] = useState<{ horizontal: number, vertical: number }>({ horizontal: 0, vertical: 0 })
  const onChange = (e: any) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  const getCropData = () => {
    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas().toDataURL());
    }
  };
  const onZoom = (value: number) => {
    let newZoom = zoom + value;
    if (newZoom <= 0) {
      return
    }
    setZoom((prev) => (newZoom >= 0 ? newZoom : 0));
  }
  const onMove = (action: string, value: number) => {
    console.log(imageEditorRef.current.cropper)
    if (action === "vertical") {
      imageEditorRef.current.cropper.move(value, 0);
      return;
    }
    imageEditorRef.current.cropper.move(0, value);

  }
  const onRotate = (value: number) => {
    imageEditorRef.current.cropper.rotate(value)
  }
  useEffect(() => {
    props.onGetImage && props.onGetImage(imageEditorRef)
  }, [imageEditorRef])
  
  return (
    <div>
      <div style={{ width: "100%" }}>
        <Cropper
          style={{ height: 400, width: "100%" }}
          zoomTo={zoom}
          initialAspectRatio={!isLand ? 2.5 / 3.5 : 3.5 / 2.5}
          preview=".img-preview"
          src={image}
          viewMode={1}
          minCropBoxHeight={10}
          minCropBoxWidth={10}
          background={true}
          responsive={true}
          autoCropArea={1}
          checkOrientation={false}
          onInitialized={(instance) => {
            setCropper(instance);
          }}
          guides={true}
          ref={imageEditorRef}
        />
      </div>
      <div>
        <div className="box" >

        </div>
        <div
          className="box "

        >
          <div className="box-action d-flex justify-content-center align-item-center">
            <div className="box-action-zoom box-action-content d-flex">
              <button className="btn box-action-zoom-in" onClick={() => onZoom(0.1)}>
                <img src={IconCropZoomIn} alt="" />
              </button>
              <button className="btn btn-action-zoom-out" onClick={() => onZoom(-0.1)}>
                <img src={IconCropZoomOut} alt="" />
              </button>
            </div>
            <div className="box-action-direction box-action-content d-flex">
              <button className="btn" onClick={() => onMove("vertical", 10)}>
                <img src={IconCropArrowLeft} alt="" />
              </button>
              <button className="btn" onClick={() => onMove("vertical", -10)}>
                <img src={IconCropArrowRight} alt="" />
              </button>
              <button className="btn" onClick={() => onMove("horizontal", -10)}>
                <img src={IconCropArrowTop} alt="" />
              </button>
              <button className="btn" onClick={() => onMove("horizontal", 10)}>
                <img src={IconCropArrowBottom} alt="" />
              </button>

            </div>
            <div className="box-action-transform box-action-content d-flex">
              <button className="btn" onClick={() => onRotate(-45)}>
                <img src={IconCropPre} alt="" />
              </button>
              <button className="btn" onClick={() => onRotate(-45)}>
                <img src={IconCropNext} alt="" />
              </button>
            </div>
            <div className="box-action-transform box-action-content d-flex">
              <button className={`btn ${isLand ? 'btn-active' : ''}`}  onClick={() => {imageEditorRef.current.cropper.setAspectRatio(3.5) / 2.5}}>
                <img src={IconCropLandScape} alt="" />
              </button>
              <button className={`btn ${!isLand ? 'btn-active' : ''}`} onClick={() => {imageEditorRef.current.cropper.setAspectRatio(2.5 / 3.5)}} > 
                <img src={IconCropPortrait} alt="" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropImage;
