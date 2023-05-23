import React from "react";
import {Button} from "@material-ui/core";
import {Link} from "react-router-dom";
import Count from "./Countdown";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import Slider, {Range} from "rc-slider";
import "rc-slider/assets/index.css";
import Header from "./Header";
import Footer from "./Footer";
import Sideheader from "./Sidebarheader";
import P2PpostNew from "./P2PpostNew";
import Newsideheader from "./Newsideheader";
import Undermaintain from "./Undermaintain";
import P2PhomeNew from "./P2PhomeNew";

function Home() {
  const options = ["one", "two", "three"];

  return (
    <div>
      <div className="container-scroller">
        <div className="container-fluid page-body-wrapper">
          <Sideheader />
          <div className="main-panel">
            <div>
              <Newsideheader />
            </div>
            <div className="content-wrapper">
              {/* <P2PpostNew /> */}
              <P2PhomeNew />
              {/* <Undermaintain /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
