
import React from 'react';
import Skeleton from 'react-loading-skeleton';

type PropsType = {
  numberLine: number;
};

const SportItem = ({ numberLine = 1 }: PropsType) => {
  const data = Array.from(Array(numberLine).keys());
  return (
    <>
      {data.map((item, key) => {
        return <div key={key} className="col-lg-3 col-md-3">
          <div className="product__item product__item mb-4">
            <Skeleton height={120} />
          </div>
        </div>
      })}
    </>
  );

};

export default React.memo(SportItem);
