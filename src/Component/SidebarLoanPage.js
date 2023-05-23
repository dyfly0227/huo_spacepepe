import React from "react";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import Count from "./Countdown";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import Slider, { Range } from "rc-slider";
import "rc-slider/assets/index.css";
import Header from "./Header";
import Footer from "./Footer";
import Sideheader from "./Sidebarheader";
import LaunchpadNew from "./LaunchpadNew";

import Newsideheader from "./Newsideheader";

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
            <div className="content-wrapper ">
              <div className="content_imga">
                <img src={require("../img/bj/coming.png")} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
