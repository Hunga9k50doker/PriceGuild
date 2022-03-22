import React, { useEffect, useState } from 'react';

import imgMaintenance from "assets/images/maintenance.svg";
import imgInfo from "assets/images/alert-info.svg";
import imgClose from "assets/images/cross-gray.svg";
import { NextPage } from 'next';
import { useSelector } from 'react-redux';
import Selectors from 'redux/selectors';
import { useRouter } from 'next/router'
import cookies from 'next-cookies'
interface Props {
  status?: string;
  data?: any
}

type PropTypes = {
  location: any,
}

//@ts-ignore
const MaintenancePage: NextPage<Props> = (props) => {
  const router = useRouter();
  React.useEffect(() => {
    if (!props.data?.maintenance) {
      router.push("/")
    }

  }, []);

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
MaintenancePage.getInitialProps = async ({ res }: any) => {
  const config = {
    method: 'get',
    headers: {
      'Accept': 'application/json',
    },
  }
  let data: any = {};
  const result = await fetch(`${process.env.REACT_APP_API_URL}/maintenance/status`, config);
  data = await result.json();
  if (res) res.statusCode = 503;

  return { statusCode: 503, data }

}

export default MaintenancePage;