import React from 'react';
import Skeleton from 'react-loading-skeleton';
const CollectionSkeleton: React.FC = () => {
  const data = Array.from(Array(10).keys());
  return (<>
    {data.map((item) =>
      <div key={item} className="col-6 mb-4">
        <div style={{ backgroundColor: "#DEDEDE" }} className="card">
          <div className="p-3">
            <div className="fw-bold">
              <Skeleton />
            </div>
          </div>
          <div className="card-body">
            <div>
              <Skeleton />
            </div>
            <div>
              <Skeleton />
            </div>
          </div>
        </div>
      </div>)}
  </>
  );
}

export default CollectionSkeleton;
