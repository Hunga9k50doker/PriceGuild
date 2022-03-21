import React, { useEffect, useState } from 'react';

import imgMaintenance from "assets/images/maintenance.svg";
import imgInfo from "assets/images/alert-info.svg";
import imgClose from "assets/images/cross-gray.svg";
import { NextPage } from 'next';

interface Props {
  status?: string;
}

type PropTypes = {
	location: any,
}

//@ts-ignore
const MaintenancePage : NextPage<Props> = ({ status }) => {

  const [hideClass, setHideClass] = React.useState<string>("");

	return (
		<section id="maintenance">
			<img className="imgMainIcon" src={imgMaintenance} alt="" title="" />
      <h4>Updating Database - PriceGuide.Cards will be back shortly</h4>
      {/* <div className="alert alert-maintenance" role="alert">
        <img src={imgInfo} alt="" title="" />
        <div className="content">Our database upgrade in <span className="cblue">3:00pm - 4:00pm</span> (CES)</div>
        <span> <img className="close" src={imgClose} alt="" title="" /> </span>
      </div> */}
		</section>
	);
}

//@ts-ignore
MaintenancePage.getInitialProps = async ({res}:any) => {

  if(res) res.statusCode = 503;

  return { statusCode : 503 }

}

// export async function getServerSideProps() {
//   try {
//     return {
//       props: {}
//     };
//   } catch(e) {
//    return {}
//   }
// }
export default MaintenancePage;