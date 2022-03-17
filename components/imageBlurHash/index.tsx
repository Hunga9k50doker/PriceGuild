import React, { FC, useEffect, useState } from "react";

import { Blurhash } from "react-blurhash";
import ModalZoomImage from "../modal/zoomImage/modalZoomImage"
type PropTypes = {
  src?: string,
  height?: number | string,
  width?: number | string,
  className?: string,
  blurHash?: string,
  imageDefault?: any,
  loadImage?: (e:boolean)=>void,
}

const ImageBlurHash = ({
  width = "100%",
  height = 277,
  className = "w-100",
  ...props
}: PropTypes) => {

  const [isLoaded, setIsloaded] = useState<boolean>(false)
  const [isOpenZoomImage, SetIsOpenZoomImage] = useState<boolean>(false);
  const [strImage, SetStrImage] = useState<string>("");
  const onLoadImage = () => {
    setIsloaded(true)
    props.loadImage && props.loadImage(true)
  }
  
  const openZoomImage = (src : string) => {
    SetIsOpenZoomImage(true);
    SetStrImage(src);
  }

  return (
    <>
      <img height={height}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null; // prevents looping
          if (props.imageDefault) {
            currentTarget.src=props.imageDefault;
          }
        }}
        onLoad={onLoadImage}
        className={`${className} ${!isLoaded ? "d-none" : ""}`}
        src={props.src}
        onClick={() => openZoomImage(props.src ?? "")} />
      {!isLoaded && props?.blurHash && <Blurhash
        hash={props?.blurHash}
        width={width}
        height={height}
        punch={1}
      />}
      {/* <ModalZoomImage 
        isOpen={isOpenZoomImage}
        onClose={() => SetIsOpenZoomImage(false)}
        src={strImage}
        imageDefaultZoom={props.imageDefault}
      
      /> */}
    </>
  );
}

export default React.memo(ImageBlurHash);
