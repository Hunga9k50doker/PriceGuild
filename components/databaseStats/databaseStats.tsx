import React from 'react';

const DatabaseStats: React.FC = () => {

    return (
        <div className="row g-0 statistical">
            <div className="col">
                <div className="text-statistical"> 270M </div>
                <div className="sub-text-statistical"> Recorded Sales Prices </div>
            </div>
            <div className="col">
                <div className="text-statistical"> 11.5M </div>
                <div className="sub-text-statistical"> Cards Featured </div>
            </div>
            <div className="col">
                <div className="text-statistical"> 155K </div>
                <div className="sub-text-statistical"> Active Collectors </div>
            </div>
            <div className="line-bottom"></div>
        </div>
    );
}

export default React.memo(DatabaseStats);