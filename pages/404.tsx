import React, { useState } from "react";
import Link from 'next/link'

import img404 from "assets/images/404.svg";


export default function App() {

  return (

    <div className="notFound">
      <div className="content-404">
        <img src={img404} alt="404" title="404" width="454" height="490" />
        <h4>Looks like you&rsquo;re lost</h4>
        <p>Don&rsquo;t panic we can help you!</p>
        <p> <Link href="/">
          <a title="Back Home" className="btn">Back Home</a>
        </Link> </p>
      </div>
    </div>


  );

}