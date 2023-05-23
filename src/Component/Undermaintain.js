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

function Home() {
  const options = ["one", "two", "three"];

  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <div className="under_maintaine">
              <h1>Oops!</h1>
              <h3>Under construction</h3>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="server_image">
              <img src={require("../img/newimg/2451222-ai.png")} className="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
