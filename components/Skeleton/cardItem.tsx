import React from 'react';
import Skeleton from 'react-loading-skeleton';

type PropsType = {
  numberLine: number;
  isInline?: boolean;
};

const CardItem = ({isInline= false, numberLine = 1 }: PropsType) => {
  const data = Array.from(Array(numberLine).keys());
  const cardSkeleton = () => {
    return <div className="product__item mb-4">
      <Skeleton height={300} />
      <Skeleton count={3} />
    </div>
  }

  return (
    <>
      {data.map((item, key) => {
        return <div key={key} className={`${isInline ? "col-lg-6 col-md-6" : "col-lg-3 col-md-3"}`}>
          {cardSkeleton()}
        </div>;
      })}
    </>
  );
};

export default React.memo(CardItem);
