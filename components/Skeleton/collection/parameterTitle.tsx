import { type } from "os";
import React, { useState } from "react";

import Skeleton from 'react-loading-skeleton';

type PropTypes = {
  type?: string;
}

const ParameterTitle = ({ type }: PropTypes) => {


  return (
    <div className="col-6 ps-4">
      <div><Skeleton width={200} /></div>
      <div className="fs-3 fw-bold mb-3"><Skeleton width={300} /></div>
      <div className="row">
        <label htmlFor="staticEmail" className="col-sm-3 col-form-label">Release Date:</label>
        <div className="col-sm-9">
          <span className="form-control-plaintext"><Skeleton width={200} /></span>
        </div>
      </div>
      <div className="row">
        <label htmlFor="staticEmail" className="col-sm-3 col-form-label">Sport:</label>
        <div className="col-sm-9">
          <span className="form-control-plaintext text-decoration-underline" ><Skeleton width={200} /></span>
        </div>
      </div>
      <div className="row">
        <label htmlFor="staticEmail" className="col-sm-3 col-form-label">Publisher:</label>
        <div className="col-sm-9">
          <span className="form-control-plaintext" ><Skeleton width={200} /></span>
        </div>
      </div>
      <div className="row">
        <label htmlFor="staticEmail" className="col-sm-3 col-form-label">Year:</label>
        <div className="col-sm-9">
          <span className="form-control-plaintext" ><Skeleton width={200} /></span>
        </div>
      </div>
      <div className="row">
        <label htmlFor="staticEmail" className="col-sm-3 col-form-label">Includes:</label>
        <div className="col-sm-9">
          <span className="form-control-plaintext text-decoration-underline" ><Skeleton width={200} /></span>
        </div>
      </div>
      <div className="row">
        <label htmlFor="staticEmail" className="col-sm-3 col-form-label">Cards in Checklist:</label>
        <div className="col-sm-9">
          <span className="form-control-plaintext text-decoration-underline" ><Skeleton width={200} /></span>
        </div>
      </div>
      {Boolean(type !== "base") && <>
        <div className=" row">
          <label htmlFor="staticEmail" className="col-sm-3 col-form-label">Base/Insert:</label>
          <div className="col-sm-9">
            <span className="form-control-plaintext" ><Skeleton width={200} /></span>
          </div>
        </div>
        <div className="row">
          <label htmlFor="staticEmail" className="col-sm-3 col-form-label">Cards in Collection:</label>
          <div className="col-sm-9">
            <span className="form-control-plaintext" ><Skeleton width={200} /></span>
          </div>
        </div>
      </>}
    </div>
  );
}

export default ParameterTitle;
