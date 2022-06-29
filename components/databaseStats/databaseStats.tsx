import React from 'react';

const DatabaseStats: React.FC = () => {

  return (
    <div className="row g-0 statistical">
    <div className="col">
        <div className="text-statistical"> 250M </div>
        <div className="sub-text-statistical"> Recorded Sales Prices </div>
    </div>
    <div className="col">
        <div className="text-statistical"> 10.5M </div>
        <div className="sub-text-statistical"> Cards Featured </div>
    </div>
    <div className="col">
        <div className="text-statistical"> 135K </div>
        <div className="sub-text-statistical"> Active Collectors </div>
    </div>
    <div className="line-bottom"></div>
</div>
  );
}

export default React.memo(DatabaseStats);