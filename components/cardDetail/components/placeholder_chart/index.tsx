import React, { useState }  from 'react'
import IconLock from "assets/images/icon_lock.svg";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import Link from 'next/link'

type PropTypes = {
    src: string,
    isNoData?: boolean,
    message?: string,
    isNoIcon?: boolean,
}

const PlaceholderChart = ({ src = "", isNoData = false, message, isNoIcon = false, ...props }: PropTypes) => {
    return (
        <div className="chart-placeholder">
            {isNoData ?
                <div className="chart-placeholder-img">
                    <img src={src} alt="" className="chart-placeholder-img" />
                    <span className="chart-placeholder-icon cursor-pointer chart-data-available">No data available</span>
                </div> : 
                <>
                    <img src={src} alt="" className="chart-placeholder-img" />
                    {
                        Boolean(!isNoIcon) && 
                        <OverlayTrigger
                            overlay={<Tooltip>{ message ?? 'Login to see pricing'}</Tooltip>}
                        >
                        {({ ref, ...triggerHandler }) => (
                            <Link href={message==="Activate account to see pricing" ?"/verify-email":"/login"}>
                                <a title="Login" className="range-price-card text-decoration-none">
                                    <img src={IconLock} alt="" ref={ref} {...triggerHandler} className="chart-placeholder-icon cursor-pointer" />
                                </a>
                            </Link>
                        )}
                        </OverlayTrigger>
                    }
                </>}
          
        </div>
    
    )
}

export default React.memo(PlaceholderChart)
