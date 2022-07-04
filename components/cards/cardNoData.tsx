import React from "react";
import Link from "next/link";

type PropTypes = {
  title: string;
};
const cardNoData = ({ title = "portfolio" }: PropTypes) => {
  return (
    <div className="empty-collection">
      <div className="box-content">
        <p> There are no cards in this {title}</p>
        <Link href="/search">
          <a className="btn btn-primary">Add Cards</a>
        </Link>
      </div>
    </div>
  );
};

export default React.memo(cardNoData);
