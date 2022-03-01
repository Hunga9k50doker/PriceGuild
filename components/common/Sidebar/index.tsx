import React from "react";
import { Link } from "react-router-dom";

function SideBar(props: any) {
  return (
    <div className="sidebar md">
      <div className="wrapper">
        <div className="container-sidebar">
          <div className="sidebar-left">
            <figure>
              <img src="" alt="this is logo" />
            </figure>
          </div>
          <div className="sidebar-right">
            <div className="block-top">
              <ul className="list-item">
                <li>
                  <Link className="trans" to={`/blog`}>Blog</Link>
                </li>
                <li><Link className="trans" to={`/faq`}>FAQ</Link></li>
                <li><a className="trans" href="#">About</a></li>
                <li><Link className="trans" to={`/contact`}>Contact</Link></li>
              </ul>
              <select className="language" name="" id="">
                <option value="1">USD</option>
              </select>
              <select className="language-en" name="" id="">
                <option value="1">EN</option>
              </select>
            </div>
            <div className="block-bottom">
              <ul className="list-option">
                <li><a className="trans item-option" href="#">Search</a></li>
                <li>
                  <select name="" id="">
                    <option value="1">Collections</option>
                  </select>
                </li>
                <li><a className="trans item-option" href="#">Box Breaks</a></li>
                <li><a className="trans item-option" href="#">Top 100</a></li>
                <li><a className="trans item-option" href="#">Leaderboard</a></li>
                <li><a className="trans item-option" href="#">Market</a></li>
                <li>
                  <a className="trans item-option login" href="#">Login</a>
                </li>
                <li><a className="trans item-option" href="#">Create Account</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
