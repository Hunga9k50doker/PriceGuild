import React, { useState } from "react";
import CardListCollection from "components/profile/collection/cardListCollection"
import { useRouter } from 'next/router'



const CardByCollection = () => {
  const router = useRouter()
  const { sport } = router.query;

  const dataQueries = router.query;
  return (
    <div className="container">
      {Boolean(sport) && <CardListCollection
        defaultSearch={typeof dataQueries?.keyword === "string" ? dataQueries?.keyword : ""}
        userId={typeof dataQueries?.user === "string" ? dataQueries?.user : ""}
        // @ts-ignore
        collection={sport} />}

    </div>
  );
}

export default CardByCollection;