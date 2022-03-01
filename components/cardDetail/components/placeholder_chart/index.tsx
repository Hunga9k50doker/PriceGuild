import React, { useState }  from 'react'
import IconLock from "assets/images/icon_lock.svg";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'

type PropTypes = {
    src: string,
}

const PlaceholderChart = ({ src = "", ...props }: PropTypes) => {
    return (
        <div className="chart-placeholder">

            <img src={src} alt=""  className="chart-placeholder-img"/>
            <OverlayTrigger
                overlay={<Tooltip>Login to see pricing</Tooltip>}
            >
                {({ ref, ...triggerHandler }) => (
                    <img src={IconLock} alt=""  ref={ref} {...triggerHandler} className="chart-placeholder-icon cursor-pointer" />
                )}
            </OverlayTrigger>
          
        </div>
    
    )
}

export default React.memo(PlaceholderChart)
