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
    <div className="center_textxx pt-0 bg-trans">
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
      <footer className="rn-footer-one bg-color--1- rn-section-gap  mt_md--80 mt_sm--80 pt-0">
        <div className="site-footer">
          <div class="site-info brder-non">
            <div class="container">
              <div class="site-info__row">
                <section id="block-4" class="widget widget_block widget_text">
                  <p class="site-info__copyright">
                    Copyright ©2022 Space PEPE Exchange. All rights reserved
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
                          href="https://www.facebook.com/zebpay/"
                          class="nav-link"
                        >
                          <img
                            class="item-icon"
                            src="https://zebpay.com/wp-content/uploads/2022/02/icon_fb_v1.svg"
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
                          href="https://www.instagram.com/zebpayofficial/"
                          class="nav-link"
                        >
                          <img
                            class="item-icon"
                            src="https://zebpay.com/wp-content/uploads/2022/02/icon_insta_v1.svg"
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
                          href="https://www.linkedin.com/company/zebpay/"
                          class="nav-link"
                        >
                          <img
                            class="item-icon"
                            src="https://zebpay.com/wp-content/uploads/2022/02/icon_linkedIn_v1.svg"
                            alt=""
                          />
                          <span class="item-label">LinkedIn</span>
                        </a>
                      </li>
                      <li
                        id="menu-item-754"
                        class="menu-item menu-item-type-custom menu-item-object-custom menu-item-754"
                      >
                        <a
                          target="_blank"
                          rel="noopener"
                          href="https://twitter.com/zebpay"
                          class="nav-link"
                        >
                          <img
                            class="item-icon"
                            src="https://zebpay.com/wp-content/uploads/2022/02/icon_twitter_v1.svg"
                            alt=""
                          />
                          <span class="item-label">Twitter</span>
                        </a>
                      </li>
                      <li
                        id="menu-item-755"
                        class="menu-item menu-item-type-custom menu-item-object-custom menu-item-755"
                      >
                        <a
                          target="_blank"
                          rel="noopener"
                          href="https://www.youtube.com/user/ZebpayTube"
                          class="nav-link"
                        >
                          <img
                            class="item-icon"
                            src="https://zebpay.com/wp-content/uploads/2022/02/icon_youtube_v1.svg"
                            alt=""
                          />
                          <span class="item-label">YouTube</span>
                        </a>
                      </li>
                      <li
                        id="menu-item-756"
                        class="menu-item menu-item-type-custom menu-item-object-custom menu-item-756"
                      >
                        <a
                          target="_blank"
                          rel="noopener"
                          href="https://in.pinterest.com/zebpayofficial/"
                          class="nav-link"
                        >
                          <img
                            class="item-icon"
                            src="https://zebpay.com/wp-content/uploads/2022/02/icon_pint_v1.svg"
                            alt=""
                          />
                          <span class="item-label">Pinterest</span>
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
