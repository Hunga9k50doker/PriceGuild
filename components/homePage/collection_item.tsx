import React from "react";
import { useRouter } from 'next/router'

import ImgCard from "assets/images/Collection_Card.png";

import { Collection } from "model/collections/collection";
import ImageBlurHash from "components/imageBlurHash";

type PropTypes = {
  item: Collection,
}

const LatestCollectionItem = (props: PropTypes) => {
  let router = useRouter();

  const onPressCollection = () => {
    router.push(`/${props.item.url}`)
  }

  return (
    <div style={{ width: '100%' }} className="col-lg-2 col-md-2 product__item--latest">
      <div className="product__item product__item   mb-4">
        <div onClick={onPressCollection}  className="product__item__img cursor-pointer" >
        <ImageBlurHash
          height={"100%"}
          width={"100%"}
          imageDefault={ImgCard.src}
          blurHash={props.item?.blurhash ?? "LEHV6nWB2yk8pyo0adR*.7kCMdnj"}
          className="w-100 h-100"
          src={props.item?.url_image ? `${process.env.REACT_APP_IMAGE_COLLECTION_URL}/${props.item?.url_image}` : ImgCard.src}
        />
        </div>
        <div className="sub-title">{props.item.sportName} <i className="dot-margin" />{props.item.setYear} <i className="dot-margin" /> {props.item.publisherName}</div>
        <div onClick={onPressCollection}  className="title-collection">{`${props.item.title}`}</div>
      </div>
    </div>
  );
}

export default React.memo(LatestCollectionItem);
