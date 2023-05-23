import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import "rc-slider/assets/index.css";
import Header from "./Header";
import { Button } from "@material-ui/core";

import apiService from "../core/service/detail";
import { getMethod, postMethod } from "../core/service/common.api";
import { toast } from "react-toastify";
import { setAuthToken, getAuthToken } from "../core/lib/localStorage";
import OTPInput, { ResendOTP } from "otp-input-react";
var moment = require("moment");

function Home() {
  const [authToken, setauthToken] = useState(false);
  const [upcommingToken, setupcommingToken] = useState([]);
  const [inprogressToken, setinprogressToken] = useState([]);
  const [expiredToken, setexpiredToken] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    getAllLaunchpad();
    let getToken = localStorage.getItem("user_token");
    if (getToken != "" && getToken != undefined && getToken != null) {
      setauthToken(true);
    } else {
      setauthToken(false);
    }
  }, [0]);

  const getAllLaunchpad = async () => {
    try {
      var data = {
        apiUrl: apiService.getAllLaunchpad,
      };
      var resp = await getMethod(data);
      var responseData = resp.data;
      if (resp.status) {
        setupcommingToken(responseData.UpcomingTokens);
        setinprogressToken(responseData.inprogressToken);
        setexpiredToken(responseData.expiredTokens);
        // toast.success(resp.Message);
      } else {
        // toast.error(resp.Message);
      }
    } catch (error) {}
  };

  const getUserBalance = async () => {
    try {
    } catch (error) {}
  };

  const buyToken = async (data) => {
    try {
      navigate("/launchpadNewbuy/" + data._id + "_symbol_" + data.symbol);
    } catch (error) {
      toast.error("Please try later");
    }
  };

  const connect = () => {
    let account;
    window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((accounts) => {
        account = accounts[0];
        let showaddress =
          account.substring(0, 5) + "..." + account.substring(38);
        document.getElementById("connectwallet1").innerText = showaddress;
        sessionStorage.setItem("walletAddress", showaddress);
        document.querySelectorAll(".login-in-continue").forEach((item) => {
          item.innerText = "To The Space";
        });
      });
  };
  useEffect(() => {
    const address = sessionStorage.getItem("walletAddress");
    if (address) {
      document.querySelectorAll(".login-in-continue").forEach((item) => {
        item.innerText = "To The Space";
      });
    }
  }, []);

  return (
    <div className="">
      <main className="main-content tradepage-bg login_body_ bg-cover ">
        {/* <Header /> */}
        <div className="container pt-5">
          <div className="">
            <div className="container d-flex justify-content-center padin_zero p-0">
              <div className="col-lg-12 p-0">
                <div className="staking_title launcpad">
                  <div>
                    <p>Space PEPE Exchange</p>
                    <h1>Launchpad</h1>
                  </div>
                  <Button>
                    <a onClick={connect} className="login-in-continue">
                      Login to continue
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="">
            <div className="container d-flex justify-content-center padin_zero p-0">
              <div className="col-lg-12 p-0">
                <h2 className="title_launce">In Progress</h2>
                <div className="row">
                  {/* <div className="col-lg-4 col-md-6 col-sm-6">
                    <div className="launch_card">
                      <label class="green_ww">
                        <i class="bi bi-check-circle"></i>In Progress
                      </label>
                      <div className="token_img_">
                        <img src="https://res.cloudinary.com/taikonz-com/image/upload/v1674201343/i58w7kwp95ftwwmjrxib.png" />
                        <h3>Adverb </h3>
                      </div>
                      <div class="details">
                        <p>
                          <span>Total Funds</span>
                          <span class="text_uniqwe">
                            {" "}
                            499988709.67741936 ADVB{" "}
                          </span>
                        </p>
                        <p>
                          <span>Network</span>
                          <span class="text_uniqwe">Ethereum</span>
                        </p>
                        <p>
                          <span> Start Date</span>
                          <span class="text_uniqwe">20-01-2023</span>
                        </p>
                        <p>
                          <span> End Date</span>
                          <span class="text_uniqwe">31-01-2023</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-6">
                    <div className="launch_card">
                      <label class="green_ww">
                        <i class="bi bi-check-circle"></i>In Progress
                      </label>
                      <div className="token_img_">
                        <img src="https://res.cloudinary.com/taikonz-com/image/upload/v1674201343/i58w7kwp95ftwwmjrxib.png" />
                        <h3>Adverb </h3>
                      </div>
                      <div class="details">
                        <p>
                          <span>Total Funds</span>
                          <span class="text_uniqwe">
                            {" "}
                            499988709.67741936 ADVB{" "}
                          </span>
                        </p>
                        <p>
                          <span>Network</span>
                          <span class="text_uniqwe">Ethereum</span>
                        </p>
                        <p>
                          <span> Start Date</span>
                          <span class="text_uniqwe">20-01-2023</span>
                        </p>
                        <p>
                          <span> End Date</span>
                          <span class="text_uniqwe">31-01-2023</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-6">
                    <div className="launch_card">
                      <label class="green_ww">
                        <i class="bi bi-check-circle"></i>In Progress
                      </label>
                      <div className="token_img_">
                        <img src="https://res.cloudinary.com/taikonz-com/image/upload/v1674201343/i58w7kwp95ftwwmjrxib.png" />
                        <h3>Adverb </h3>
                      </div>
                      <div class="details">
                        <p>
                          <span>Total Funds</span>
                          <span class="text_uniqwe">
                            {" "}
                            499988709.67741936 ADVB{" "}
                          </span>
                        </p>
                        <p>
                          <span>Network</span>
                          <span class="text_uniqwe">Ethereum</span>
                        </p>
                        <p>
                          <span> Start Date</span>
                          <span class="text_uniqwe">20-01-2023</span>
                        </p>
                        <p>
                          <span> End Date</span>
                          <span class="text_uniqwe">31-01-2023</span>
                        </p>
                      </div>
                    </div>
                  </div> */}
                  {/* {inprogressToken && inprogressToken.length > 0 ? (
                    inprogressToken.map((item, i) => {
                      var startDate = moment(item.startDate).format(
                        "DD-MM-YYYY"
                      );
                      var endtdate = moment(item.endDate).format("DD-MM-YYYY");
                      return (
                        <div className="col-lg-4 col-md-6 col-sm-6">
                          <div className="launch_card">
                            <label>
                              <i class="bi bi-clock"></i>In progress
                            </label>
                            <div className="token_img_">
                              <img src={item.image} />
                              <h3>{item.coinName} </h3>
                            </div>
                            <div className="details">
                              <p>
                                <span>Total Funds</span>
                                <span className="text_uniqwe">
                                  {" "}
                                  {item.totalSupply} {item.symbol}{" "}
                                </span>
                              </p>

                            
                              <p>
                                <span>Network</span>
                                <span className="text_uniqwe">
                                  {" "}
                                  {item.network}
                                </span>
                              </p>
                              <p>
                                <span> Start Date</span>
                                <span className="text_uniqwe">{startDate}</span>
                              </p>
                              <p>
                                <span> End Date</span>
                                <span className="text_uniqwe">{endtdate}</span>
                              </p>
                            </div>
                            {authToken == true ? (
                              <Button onClick={() => buyToken(item)}>
                                {" "}
                                Buy now{" "}
                              </Button>
                            ) : (
                              <Button>
                                {" "}
                                <Link to="/login">
                                  {" "}
                                  Login to continue{" "}
                                </Link>{" "}
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="title_launce erroe_launch">
                      {" "}
                      Currently launchpad tokens are not available!{" "}
                      <label>
                        <i class="bi bi-clock"></i>
                      </label>
                    </div>
                  )} */}
                </div>

                <h2 className="title_launce">Upcoming</h2>
                <div className="row">
                  <div className="col-lg-4 col-md-6 col-sm-6">
                    <div className="launch_card">
                      <label class="green_ww">
                        <i class="bi bi-check-circle"></i>Finished
                      </label>
                      <div className="token_img_">
                        <img src={require("../img/bj/logo.png")} />
                        <h3>Space PEPE Exchange </h3>
                      </div>
                      <div class="details">
                        <p>
                          <span>Total Funds</span>
                          <span class="text_uniqwe"> 30000000 SPE </span>
                        </p>
                        <p>
                          <span>Network</span>
                          <span class="text_uniqwe">BSC Smart Chain</span>
                        </p>
                        <p>
                          <span> Start Date</span>
                          <span class="text_uniqwe">05-28-2023</span>
                        </p>
                        <p>
                          <span> End Date</span>
                          <span class="text_uniqwe">06-03-2023</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* <div className="col-lg-4 col-md-6 col-sm-6">
                    <div className="launch_card">
                      <label class="green_ww">
                        <i class="bi bi-check-circle"></i>Upcoming
                      </label>
                      <div className="token_img_">
                        <img src="https://res.cloudinary.com/taikonz-com/image/upload/v1674201343/i58w7kwp95ftwwmjrxib.png" />
                        <h3>Adverb </h3>
                      </div>
                      <div class="details">
                        <p>
                          <span>Total Funds</span>
                          <span class="text_uniqwe">
                            {" "}
                            499988709.67741936 ADVB{" "}
                          </span>
                        </p>
                        <p>
                          <span>Network</span>
                          <span class="text_uniqwe">Ethereum</span>
                        </p>
                        <p>
                          <span> Start Date</span>
                          <span class="text_uniqwe">20-01-2023</span>
                        </p>
                        <p>
                          <span> End Date</span>
                          <span class="text_uniqwe">31-01-2023</span>
                        </p>
                      </div>
                    </div>
                  </div> */}
                  {/* <div className="col-lg-4 col-md-6 col-sm-6">
                    <div className="launch_card">
                      <label class="green_ww">
                        <i class="bi bi-check-circle"></i>Upcoming
                      </label>
                      <div className="token_img_">
                        <img src="https://res.cloudinary.com/taikonz-com/image/upload/v1674201343/i58w7kwp95ftwwmjrxib.png" />
                        <h3>Adverb </h3>
                      </div>
                      <div class="details">
                        <p>
                          <span>Total Funds</span>
                          <span class="text_uniqwe">
                            {" "}
                            499988709.67741936 ADVB{" "}
                          </span>
                        </p>
                        <p>
                          <span>Network</span>
                          <span class="text_uniqwe">Ethereum</span>
                        </p>
                        <p>
                          <span> Start Date</span>
                          <span class="text_uniqwe">20-01-2023</span>
                        </p>
                        <p>
                          <span> End Date</span>
                          <span class="text_uniqwe">31-01-2023</span>
                        </p>
                      </div>
                    </div>
                  </div> */}
                  {/* {upcommingToken && upcommingToken.length > 0 ? (
                    upcommingToken.map((item, i) => {
                      var startDate = moment(item.startDate).format(
                        "DD-MM-YYYY"
                      );
                      var endtdate = moment(item.endDate).format("DD-MM-YYYY");
                      return (
                        <div className="col-lg-4 col-md-6 col-sm-6">
                          <div className="launch_card">
                            <label className="upcomming ">
                              <i class="bi bi-clock"></i>Upcoming
                            </label>
                            <div className="token_img_">
                              <img src={item.image} />
                              <h3>{item.coinName} </h3>
                            </div>
                            <div className="details">
                              <p>
                                <span>Total Funds</span>
                                <span className="text_uniqwe">
                                  {" "}
                                  {item.totalSupply} {item.symbol}{" "}
                                </span>
                              </p>

                            
                              <p>
                                <span>Network</span>
                                <span className="text_uniqwe">Ethereum</span>
                              </p>
                              <p>
                                <span> Start Date</span>
                                <span className="text_uniqwe">{startDate}</span>
                              </p>
                              <p>
                                <span> End Date</span>
                                <span className="text_uniqwe">{endtdate}</span>
                              </p>
                            </div>
                            <Button>Coming soon </Button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="title_launce erroe_launch ">
                      {" "}
                      Currently not available for upcomming tokens!{" "}
                      <label className="upcomming trens">
                        <i class="bi bi-clock"></i>
                      </label>
                    </div>
                  )} */}
                </div>

                <h2 className="title_launce">Expired Token</h2>
                <div className="row">
                  {/* <div className="col-lg-4 col-md-6 col-sm-6">
                    <div className="launch_card">
                      <label class="green_ww">
                        <i class="bi bi-check-circle"></i>Finished
                      </label>
                      <div className="token_img_">
                      <img src={require('../img/tokeen.png')} />
                        <h3>Space PEPE Exchange </h3>
                      </div>
                      <div class="details">
                        <p>
                          <span>Total Funds</span>
                          <span class="text_uniqwe">
                            {" "}
                            499988709.67741936 FC{" "}
                          </span>
                        </p>
                        <p>
                          <span>Network</span>
                          <span class="text_uniqwe">BSC Smart Chain</span>
                        </p>
                        <p>
                          <span> Start Date</span>
                          <span class="text_uniqwe">20-01-2023</span>
                        </p>
                        <p>
                          <span> End Date</span>
                          <span class="text_uniqwe">31-01-2023</span>
                        </p>
                      </div>
                    </div>
                  </div> */}

                  {/* <div className="col-lg-4 col-md-6 col-sm-6">
                    <div className="launch_card">
                      <label class="green_ww">
                        <i class="bi bi-check-circle"></i>Finished
                      </label>
                      <div className="token_img_">
                        <img src="https://res.cloudinary.com/taikonz-com/image/upload/v1674201343/i58w7kwp95ftwwmjrxib.png" />
                        <h3>Adverb </h3>
                      </div>
                      <div class="details">
                        <p>
                          <span>Total Funds</span>
                          <span class="text_uniqwe">
                            {" "}
                            499988709.67741936 ADVB{" "}
                          </span>
                        </p>
                        <p>
                          <span>Network</span>
                          <span class="text_uniqwe">Ethereum</span>
                        </p>
                        <p>
                          <span> Start Date</span>
                          <span class="text_uniqwe">20-01-2023</span>
                        </p>
                        <p>
                          <span> End Date</span>
                          <span class="text_uniqwe">31-01-2023</span>
                        </p>
                      </div>
                    </div>
                  </div> */}

                  {/* {expiredToken && expiredToken.length > 0 ? (
                    expiredToken.map((item, i) => {
                      var startDate = moment(item.startDate).format(
                        "DD-MM-YYYY"
                      );
                      var endtdate = moment(item.endDate).format("DD-MM-YYYY");
                      return (
                        <div className="col-lg-4 col-md-6 col-sm-6">
                          <div className="launch_card">
                            <label className="green_ww">
                              <i class="bi bi-check-circle"></i>Finished
                            </label>
                            <div className="token_img_">
                              <img src={item.image} />
                              <h3>{item.coinName} </h3>
                            </div>
                            <div className="details">
                              <p>
                                <span>Total Funds</span>
                                <span className="text_uniqwe">
                                  {" "}
                                  {item.totalSupply} {item.symbol}{" "}
                                </span>
                              </p>

                             
                              <p>
                                <span>Network</span>
                                <span className="text_uniqwe">Ethereum</span>
                              </p>
                              <p>
                                <span> Start Date</span>
                                <span className="text_uniqwe">{startDate}</span>
                              </p>
                              <p>
                                <span> End Date</span>
                                <span className="text_uniqwe">{endtdate}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="title_launce erroe_launch">
                      {" "}
                      Not available for Expired token!{" "}
                      <label className="green_ww">
                        <i class="bi bi-check-circle"></i>
                      </label>
                    </div>
                  )} */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
