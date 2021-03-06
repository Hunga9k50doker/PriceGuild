import React, { useState } from 'react';
import Link from "next/link";
const ISSERVER = typeof window === "undefined";
const UsesCookiesPage = () => {
  const [cookies, setCookie] = useState(!ISSERVER ? localStorage.getItem("isCookie"): 'hide')
  const onUseCookie = () => {
    setCookie("hide");
   !ISSERVER ? localStorage.setItem("isCookie", "hide") : 'hide';
  }

	return (
      <div className={`cookie-agreement ${cookies}`}>
        <div className="d-sm-flex align-items-center">
          <div className="content-cookie">
            <p><strong>This website uses cookies</strong></p>
            <p>This enables us to improve your future user experience on our website and to provide you with interest-based advertising and tailored content on our website as outside our website by partners. By continuing to use this site, you consent to our use of cookies. You may disable cookies in your browser settings at any time. For more information, please see our <Link href="/privacy-policy" ><a title="Privacy Policy">Privacy Policy</a></Link>.</p>
          </div>
          <button onClick={onUseCookie} className="btn save-cookie">Got it</button>
        </div>
      </div>
	);
}

export default UsesCookiesPage;