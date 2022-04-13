import React from "react";
import AddCard from "components/profile/addCard"

type PropTypes = {
  location: any,
};

const CollectionAddCard = (props: PropTypes) => {
  return (
    <div className="clear-padding-add">
        <AddCard />
    </div>
  
  );
};

export default CollectionAddCard;