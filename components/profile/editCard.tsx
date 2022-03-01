import React from 'react';
import AddCard from "components/profile/addCard"

const EditCard = () => {
  return (
    <>
      <AddCard isEdit={true} />
    </>
  );
}

export default React.memo(EditCard);
