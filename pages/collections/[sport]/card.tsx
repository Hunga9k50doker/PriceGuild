import React, { useState } from "react";
import { useRouter } from 'next/router'

import CardListCollection from "components/profile/collection/cardListCollection"

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