import React from 'react'
import PropTypes from 'prop-types';

type PropTypes = {
    isActive?: boolean,
  
  }
const iconDotMoBile = ({isActive= true, ...props}: PropTypes) => {

    return (
        <>
            { isActive ? 
             <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="path-1-inside-1_4300_53300" fill="white">
                <rect x="0.25" width="8" height="8" rx="0.6"/>
                </mask>
                <rect x="0.25" width="8" height="8" rx="0.6" stroke="white" stroke-width="4" mask="url(#path-1-inside-1_4300_53300)"/>
                <mask id="path-2-inside-2_4300_53300" fill="white">
                <rect x="10.25" width="8" height="8" rx="0.6"/>
                </mask>
                <rect x="10.25" width="8" height="8" rx="0.6" stroke="white" stroke-width="4" mask="url(#path-2-inside-2_4300_53300)"/>
                <mask id="path-3-inside-3_4300_53300" fill="white">
                <rect x="10.25" y="10" width="8" height="8" rx="0.6"/>
                </mask>
                <rect x="10.25" y="10" width="8" height="8" rx="0.6" stroke="white" stroke-width="4" mask="url(#path-3-inside-3_4300_53300)"/>
                <mask id="path-4-inside-4_4300_53300" fill="white">
                <rect x="0.25" y="10" width="8" height="8" rx="0.6"/>
                </mask>
                <rect x="0.25" y="10" width="8" height="8" rx="0.6" stroke="white" stroke-width="4" mask="url(#path-4-inside-4_4300_53300)"/>
            </svg>
             :
            <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="path-1-inside-1_4300_55532" fill="white">
                <rect x="0.25" width="8" height="8" rx="0.6"/>
                </mask>
                <rect x="0.25" width="8" height="8" rx="0.6" stroke="#0B0E61" stroke-width="4" mask="url(#path-1-inside-1_4300_55532)"/>
                <mask id="path-2-inside-2_4300_55532" fill="white">
                <rect x="10.25" width="8" height="8" rx="0.6"/>
                </mask>
                <rect x="10.25" width="8" height="8" rx="0.6" stroke="#0B0E61" stroke-width="4" mask="url(#path-2-inside-2_4300_55532)"/>
                <mask id="path-3-inside-3_4300_55532" fill="white">
                <rect x="10.25" y="10" width="8" height="8" rx="0.6"/>
                </mask>
                <rect x="10.25" y="10" width="8" height="8" rx="0.6" stroke="#0B0E61" stroke-width="4" mask="url(#path-3-inside-3_4300_55532)"/>
                <mask id="path-4-inside-4_4300_55532" fill="white">
                <rect x="0.25" y="10" width="8" height="8" rx="0.6"/>
                </mask>
                <rect x="0.25" y="10" width="8" height="8" rx="0.6" stroke="#0B0E61" stroke-width="4" mask="url(#path-4-inside-4_4300_55532)"/>
            </svg>
          }
        </>

        
        
    )
}

export default iconDotMoBile
