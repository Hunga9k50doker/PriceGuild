import React from "react";
import { useRouter } from "next/router";

import ImgCard from "assets/images/Collection_Card.png"

import ImageBlurHash from "components/imageBlurHash"

import { Collection } from "model/collections/collection";

type PropTypes = {
  item: Collection,
}

const CardCollection = (props: PropTypes) => {
  const router = useRouter();
  const onPressCollection = (id: number) => {
    router.push(`/${props.item.url}`)
  }

  return (<div className="col-6 col-5 col-xl-3 col-lg-4 col-sm-4 product-list-item">
    <div className="product__item mb-4">
      <div onClick={() => onPressCollection(props.item.id)} className="cursor-pointer product__item__img" >
        <ImageBlurHash
          height={"100%"}
          width={"100%"}
          imageDefault={ImgCard}
          blurHash={props.item?.blurhash ?? "LEHV6nWB2yk8pyo0adR*.7kCMdnj"}
          className="w-100 h-100"
          src={props.item?.url_image ? `${process.env.REACT_APP_IMAGE_COLLECTION_URL}/${props.item?.url_image}` : ImgCard.src}
        />
      </div>
      <div className="d-flex align-items-center mt-3 mb-1 product__item__title" style={{ fontSize: 14, color: "#6D7588" }}>{props.item.sportName}
        <i className="dot-margin" />
        {props.item.setYear}
        <i className="dot-margin" />
        {props.item.publisherName}
      </div>
      <div className="fw-500 product__item__description" onClick={() => onPressCollection(props.item.id)} style={{ fontSize: 18, cursor: 'pointer' }}>{`${props.item.title}`}</div>
    </div>
  </div>)

}

export default React.memo(CardCollection);
