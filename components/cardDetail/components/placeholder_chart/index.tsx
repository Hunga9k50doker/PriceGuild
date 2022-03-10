import React, { useState }  from 'react'
import IconLock from "assets/images/icon_lock.svg";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'

type PropTypes = {
    src: string,
    isNoData?: boolean,
}

const PlaceholderChart = ({ src = "", isNoData = false, ...props }: PropTypes) => {
    return (
        <div className="chart-placeholder">
            {isNoData ?
                <div className="chart-placeholder-img">
                    <img src={src} alt="" className="chart-placeholder-img" />
                    <span className="chart-placeholder-icon cursor-pointer chart-data-available">No data available</span>
                </div> : 
                <>
                    <img src={src} alt="" className="chart-placeholder-img" />
                    <OverlayTrigger
                        overlay={<Tooltip>Login to see pricing</Tooltip>}
                    >
                    {({ ref, ...triggerHandler }) => (
                        <img src={IconLock} alt="" ref={ref} {...triggerHandler} className="chart-placeholder-icon cursor-pointer" />
                    )}
                </OverlayTrigger></>}
          
        </div>
    
    )
}

export default React.memo(PlaceholderChart)
