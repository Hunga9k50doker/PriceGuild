import React from "react";
import MyCardSlickElement from "components/card-slick/card_slick/MyCardSlickElement";

import { Collection } from "model/collections/collection";

import CollectionItem from './collection_item';

type PropTypes = {
  data: Collection[],
  title?: string,
  routerLink?: string
}

const LatestCollections = ({ title = "Latest Collections", ...props }: PropTypes) => {
  return (
    <MyCardSlickElement<Collection>
      title={title}
      cards={props.data}
      cardElement={
        (item: Collection) => {
          return (
            <CollectionItem key={item.id} item={item} />
          );
        }
      }
      routerLink={props.routerLink}
      routerName="See All Collections"
    />
  );
}

export default React.memo(LatestCollections);
