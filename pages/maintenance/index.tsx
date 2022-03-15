import React, { useEffect, useState } from 'react';

import imgMaintenance from "assets/images/maintenance.svg";
import imgInfo from "assets/images/alert-info.svg";
import imgClose from "assets/images/cross-gray.svg";

type PropTypes = {
	location: any,
}
const MaintenancePage: React.FC<PropTypes> = (props) => {

  const [hideClass, setHideClass] = React.useState<string>("");

	return (

		<section id="maintenance">
			<img className="imgMainIcon" src={imgMaintenance} alt="" title="" />
            <h4>Updating Database - PriceGuide.Cards will be back shortly</h4>
            <div className="alert alert-maintenance" role="alert">
                <img src={imgInfo} alt="" title="" />
                <div className="content">Our database upgrade in <span className="cblue">3:00pm - 4:00pm</span> (CES)</div>
                <span> <img className="close" src={imgClose} alt="" title="" /> </span>
            </div>
		</section>
	);
}

export default MaintenancePage;