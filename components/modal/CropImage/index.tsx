import React, { useEffect, useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import IconCropDragModeCrop from "assets/images/crop.svg";
import IconCropDragModeMove from "assets/images/move.svg";
import IconCropArrowLeft from "assets/images/crop-arrow-left.svg";
import IconCropArrowRight from "assets/images/crop-arrow-right.svg";
import IconCropArrowTop from "assets/images/crop-arrow-top.svg";
import IconCropArrowBottom from "assets/images/crop-arrow-bottom.svg";
import IconCropZoomIn from "assets/images/crop-zoom-in.svg";
import IconCropZoomOut from "assets/images/crop-zoom-out.svg";
import IconCropPre from "assets/images/crop-pre.svg";
import IconCropNext from "assets/images/crop-next.svg";
import IconCropLandScape from "assets/images/crop-landscape.svg";
import IconCropPortrait from "assets/images/crop-portrait.svg";
import { constant } from "lodash";
// import "./Demo.css";

const defaultSrc = "https://raw.githubusercontent.com/roadmanfong/react-cropper/master/example/img/child.jpg";

type PropTypes = {
  src: any;
  onGetImage?: (value: any) => void;
};
export const CropImage = ({ src = defaultSrc, ...props }: PropTypes) => {
  const [isLand, setIsLand] = useState<boolean>(false);
  const [btnActive, setBtnActive] = useState<boolean>(false);
  const imageEditorRef = React.useRef<any>(null);
  const [zoom, setZoom] = useState<number>(0);
  const [image, setImage] = useState<any | undefined>(src);
  const [cropData, setCropData] = useState<any>("#");
  const [cropper, setCropper] = useState<any | undefined>(undefined);
  const [box, setBox] = useState<any | undefined>(undefined);
  const [boxLand, setBoxLand] = useState<any | undefined>(undefined);
  // const [move, setMove] = useState<{ horizontal: number; vertical: number }>({ horizontal: 0, vertical: 0 });
  const [imgPro, setimgPro] = useState({
    width: 0,
    height: 0,
  });
  const [cropPro, setcropPro] = useState({
    width: 0,
    height: 0,
  });
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

  const onDragMode = (type: string) => {
    type === "move" ? imageEditorRef.current.cropper.setDragMode("move") : imageEditorRef.current.cropper.setDragMode("crop");
  };
  const onZoom = (value: number) => {
    let newZoom = zoom + value;
    if (newZoom <= 0) {
      return;
    }
    setZoom((prev) => (newZoom >= 0 ? newZoom : 0));
  };
  const onMove = (action: string, value: number) => {
    if (action === "vertical") {
      imageEditorRef.current.cropper.move(value, 0);
      return;
    }
    imageEditorRef.current.cropper.move(0, value);
  };
  const onRotate = (value: number) => {
    imageEditorRef.current.cropper.rotate(value);
  };

  // const updateRatio = (value: boolean) => {
  //   let cropper = imageEditorRef.current.cropper.getCropBoxData();
  //   let imgData = imageEditorRef.current.cropper.getImageData();
  //   // let crop = initialCropSize(imgData.naturalWidth, imgData.naturalHeight);
  //   if (value) {
  //     if (isLand !== value) {
  //       setBoxLand(cropper);
  //     }
  //     imageEditorRef.current.cropper.setAspectRatio(
  //       +imgData.naturalWidth > +imgData.naturalHeight
  //         ? +imgData.naturalWidth / +imgData.naturalHeight
  //         : +imgData.naturalHeight / +imgData.naturalWidth
  //       // isLand ? crop[0] / crop[1] : crop[1] / crop[0]
  //     );
  //     if (box) {
  //       imageEditorRef.current.cropper.setCropBoxData(box);
  //     }
  //   } else {
  //     if (isLand !== value) {
  //       setBoxLand(cropper);
  //     }
  //     imageEditorRef.current.cropper.setAspectRatio(
  //       +imgData.naturalWidth <= +imgData.naturalHeight
  //         ? +imgData.naturalWidth / +imgData.naturalHeight
  //         : +imgData.naturalHeight / +imgData.naturalWidth
  //       // !isLand ? crop[0] / crop[1] : crop[1] / crop[0]
  //     );
  //     if (box) {
  //       imageEditorRef.current.cropper.setCropBoxData(box);
  //     }
  //   }
  //   setIsLand(value);
  // };
  const updateRatio = (value: boolean) => {
    let cropper = imageEditorRef.current.cropper.getCropBoxData();

    if (value) {
      if (isLand !== value) {
        setBoxLand(cropper);
      }
      imageEditorRef.current.cropper.setAspectRatio(3.5 / 2.5);
      if (box) {
        imageEditorRef.current.cropper.setCropBoxData(box);
      }
    } else {
      if (isLand !== value) {
        setBox(cropper);
      }
      imageEditorRef.current.cropper.setAspectRatio(2.5 / 3.5);
      if (boxLand) {
        imageEditorRef.current.cropper.setCropBoxData(boxLand);
      }
    }
    setIsLand(value);
  };
  const cropStartCustom = () => {
    let imgData = imageEditorRef.current.cropper.getImageData();
    // Call Tom's resize Crop Area function
    let crop = initialCropSize(imgData.naturalWidth, imgData.naturalHeight);
    imageEditorRef.current.cropper.initialAspectRatio = crop[0] / crop[1];
  };

  // This is Tom's Python resize Crop Area - begin
  const initialCropSize = (imageWidth = 350, imageHeight = 400) => {
    // let imgData = imageEditorRef.current.cropper.getImageData();
    // # Config the ratios: W, H
    let portraitRatio = { width: 2.5, height: 3.5 };
    let landscapeRatio = { width: 3.5, height: 2.5 };
    let ratio, limitingDimension, cropWidth, cropHeight;
    // # Step 1 Check if image is Portrait or Landscape
    // if(imgData.naturalWidth <imgData.naturalHeight)
    //     ratio = portraitRatio
    // else:
    //     ratio = landscapeRatio
    if (+imageWidth <= +imageHeight) {
      //      portraitRatio
      setIsLand(false);
      ratio = portraitRatio;
    } else {
      //     landscapeRatio
      setIsLand(true);
      ratio = landscapeRatio;
    }

    // # Step 2 Check the limiting dimension
    // if (imageHeight / imageWidth) > (ratio['height'] / ratio['width']):
    //     limitingDimension = 'H'
    // else
    //     limitingDimension = 'W'
    +imageHeight / +imageWidth > ratio["height"] / ratio["width"] ? (limitingDimension = "H") : (limitingDimension = "W");

    // # Step 3 Set the Initial Crop Size
    // # 3.1 - Width
    // if limitingDimension == 'W'
    //     cropWidth = imageWidth
    // else
    //     cropWidth = imageHeight * (ratio['width'] / ratio['height'])
    limitingDimension === "W" ? (cropWidth = imageWidth) : (cropWidth = imageHeight * (ratio["width"] / ratio["height"]));
    // // # 3.2 - Height
    // if limitingDimension == 'H':
    //     cropHeight = imageHeight
    // else
    //     cropHeight = imageWidth * (ratio['height'] / ratio['width'])
    limitingDimension === "H" ? (cropHeight = imageHeight) : (cropHeight = imageWidth * (ratio["height"] / ratio["width"]));
    return [cropWidth, cropHeight];
  };
  // This is Tom's Python resize Crop Area - end
  useEffect(() => {
    props.onGetImage && props.onGetImage(imageEditorRef);
  }, [imageEditorRef]);
  useEffect(() => {
    imageEditorRef.current.cropper.setDragMode("crop");
  }, []);
  return (
    <div>
      <div style={{ width: "100%" }}>
        <Cropper
          style={{ maxHeight: 400, width: "100%" }}
          zoomTo={zoom}
          crop={() => {
            cropStartCustom();
          }}
          preview=".img-preview"
          src={image}
          viewMode={0}
          minCropBoxHeight={20}
          minCropBoxWidth={20}
          background={true}
          responsive={true}
          autoCropArea={1}
          checkOrientation={false}
          onInitialized={(instance) => {
            setCropper(instance);
          }}
          guides={true}
          center={true}
          ref={imageEditorRef}
        />
      </div>
      <div>
        <div className="box"></div>
        <div className="box">
          <div className="box-action d-flex justify-content-center align-item-center">
            <div className="box-action-drag-mode box-action-content d-flex">
              <button
                className={`btn ${btnActive ? "btn-active" : ""}`}
                onClick={() => {
                  onDragMode("move");
                  setBtnActive(true);
                }}
              >
                <img src={IconCropDragModeMove} alt="" />
              </button>
              <button
                className={`btn ${!btnActive ? "btn-active" : ""}`}
                onClick={() => {
                  onDragMode("crop");
                  setBtnActive(false);
                }}
              >
                <img src={IconCropDragModeCrop} alt="" />
              </button>
            </div>
            <div className="box-action-zoom box-action-content d-flex">
              <button
                className="btn box-action-zoom-in"
                onClick={() => {
                  onZoom(0.1);
                }}
              >
                <img src={IconCropZoomIn} alt="" />
              </button>
              <button
                className="btn btn-action-zoom-out"
                onClick={() => {
                  onZoom(-0.1);
                }}
              >
                <img src={IconCropZoomOut} alt="" />
              </button>
            </div>
            <div className="box-action-direction box-action-content d-flex">
              <button
                className="btn"
                onClick={() => {
                  onMove("vertical", -10);
                }}
              >
                <img src={IconCropArrowLeft} alt="" />
              </button>
              <button
                className="btn"
                onClick={() => {
                  onMove("vertical", 10);
                }}
              >
                <img src={IconCropArrowRight} alt="" />
              </button>
              <button
                className="btn"
                onClick={() => {
                  onMove("horizontal", -10);
                }}
              >
                <img src={IconCropArrowTop} alt="" />
              </button>
              <button
                className="btn"
                onClick={() => {
                  onMove("horizontal", 10);
                }}
              >
                <img src={IconCropArrowBottom} alt="" />
              </button>
            </div>
            <div className="box-action-transform box-action-content d-flex">
              <button
                className="btn"
                onClick={() => {
                  onRotate(-45);
                }}
              >
                <img src={IconCropPre} alt="" />
              </button>
              <button
                className="btn"
                onClick={() => {
                  onRotate(-45);
                }}
              >
                <img src={IconCropNext} alt="" />
              </button>
            </div>
            <div className="box-action-transform box-action-content d-flex">
              <button
                className={`btn ${isLand ? "btn-active" : ""}`}
                onClick={() => {
                  updateRatio(true);
                }}
              >
                <img src={IconCropLandScape} alt="" />
              </button>
              <button
                className={`btn ${!isLand ? "btn-active" : ""}`}
                onClick={() => {
                  updateRatio(false);
                }}
              >
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
