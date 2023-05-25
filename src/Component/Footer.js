import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "./Header";
import { Button } from "@material-ui/core";

import { socket } from "./context/socket";
import apiService from "../core/service/detail";
import { postMethod } from "../core/service/common.api";
import { getMethod } from "../core/service/common.api";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
function Footer() {
  const [siteData, setSiteData] = useState({});

  useEffect(() => {
    fetchTfaData();
  }, [0]);

  const fetchTfaData = async () => {
    try {
      var data = {
        apiUrl: apiService.getSiteDatas,
      };
      var resp = await getMethod(data);
      console.log(resp.data, "=--=-=-resp-=-=-=-=-=resp=-=-");
      setSiteData(resp.data);
    } catch (error) {}
  };
  const [value, setValue] = useState();

  // /get_sitedata
  return (
    <div className="center_textxx">
      {/* <div className="cta-trading-now">
        <h2 class="has-text-align-center">
          Start <span class="blue">Trading</span> Now
        </h2>
      </div>

      <div className="row justify-center">
        <div className="col-lg-6 d-flex justify-center">
          <div className="phone_number donwload-form">
            <PhoneInput
              placeholder="Enter phone number"
              value={value}
              onChange={setValue}
            />
            <Button className="btn--blue footer_roeund ">
              <span>
                <i class="bi bi-arrow-right"></i>
              </span>
            </Button>
          </div>
        </div>
      </div> */}
      <footer className="rn-footer-one bg-color--1- rn-section-gap  mt_md--80 mt_sm--80">
        <div className="container">
          <div className="row justify-center">
            <div className="col-lg-10">
              <div className="row mb-3">
                <div className="col-lg-4 col-md-6 col-sm-6 col-12">
                  <div className="widget-content-wrapper">
                    <div className="footer-left">
                      {/* <div className="logo-thumbnail logo-custom-css">
                        <a href="" className="logo-light">
                          <img
                            src={require("../img/bj/logo.png")}
                            className="logo darktheme footerlogos"
                          />
                          <img
                            src={require("../img/bj/logo.png")}
                            className="logo lighttheme footerlogos"
                          />
                        </a>
                      </div> */}
                      <ul className="logo-show">
                        <li>
                          <a href="#">
                            <img
                              class="item-icon"
                              src={require("../img/bj/logo1.png")}
                              alt=""
                            />
                          </a>
                        </li>

                        <li>
                          <a href="#">
                            <img
                              class="item-icon"
                              src={require("../img/bj/logo2.png")}
                              alt=""
                            />
                          </a>
                        </li>
                      </ul>
                      <div className="footer_newsform">
                        <p className="dfoodsss">
                          A next-gen Blockchain and Crypto Exchange platform
                          that offers trader with an endless assets buy and
                          selling feature with real money.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 col-sm-6 col-12 mt_mobile--40">
                  <div className="footer-widget widget-quicklink">
                    <h6 className="widget-title">Home</h6>
                    <ul className="footer-list-one">
                      <li className="footer-menu">
                        <a href="/privacy" target="_blank">
                          Privacy Policy
                        </a>
                      </li>
                      <li className="footer-menu">
                        <a href="/terms" target="_blank">
                          Terms Of Use
                        </a>
                      </li>
                      <li className="footer-menu">
                        <a href="/about" target="_blank">
                          About Us
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 col-sm-6 col-12 mt_mobile--40">
                  <div className="footer-widget widget-quicklink">
                    <h6 className="widget-title">Learn</h6>
                    <ul className="footer-list-one">
                      <li className="footer-menu">
                        <a href="">Protocol Explore</a>
                      </li>
                      <li className="footer-menu">
                        <a href="">System Token</a>
                      </li>
                      <li className="footer-menu">
                        <a href="">Otimize Time</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="site-footer">
          <div class="site-info">
            <div class="container">
              <div class="site-info__row">
                <section id="block-4" class="widget widget_block widget_text">
                  <p class="site-info__copyright">
                    Copyright ©2023 SpacePepe Exchange. All rights reserved
                  </p>
                </section>
                <section id="nav_menu-7" class="widget widget_nav_menu">
                  {" "}
                  <div class="menu-social-menu-container">
                    <ul id="menu-social-menu" class="menu">
                      <li
                        id="menu-item-751"
                        class="menu-item menu-item-type-custom menu-item-object-custom menu-item-751"
                      >
                        <a
                          target="_blank"
                          rel="noopener"
                          href="https://twitter.com/spacepeexchange"
                          class="nav-link"
                        >
                          <img
                            class="item-icon"
                            src={require("../img/bj/tuite.png")}
                            alt=""
                          />
                          <span class="item-label">Facebook</span>
                        </a>
                      </li>
                      <li
                        id="menu-item-752"
                        class="menu-item menu-item-type-custom menu-item-object-custom menu-item-752"
                      >
                        <a
                          target="_blank"
                          rel="noopener"
                          href="https://t.me/SpacePepe_Exchange"
                          class="nav-link"
                        >
                          <img
                            class="item-icon"
                            src={require("../img/bj/telegram.png")}
                            alt=""
                          />
                          <span class="item-label">Instagram</span>
                        </a>
                      </li>
                      <li
                        id="menu-item-753"
                        class="menu-item menu-item-type-custom menu-item-object-custom menu-item-753"
                      >
                        <a
                          target="_blank"
                          rel="noopener"
                          href="https://t.me/SpacePepe_Exchange_Announcement"
                          class="nav-link"
                        >
                          <img
                            class="item-icon"
                            src={require("../img/bj/telegram.png")}
                            alt=""
                          />
                          <span class="item-label">LinkedIn</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </section>{" "}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
