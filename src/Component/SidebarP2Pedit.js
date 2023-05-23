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
import P2PeditPost from "./P2PeditPost";
import Newsideheader from "./Newsideheader";
import Undermaintain from "./Undermaintain"

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
              <P2PeditPost />
              {/* <Undermaintain /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
