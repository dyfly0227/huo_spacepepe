import React, {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";

import "rc-slider/assets/index.css";
import Header from "./Header";
import {Button} from "@material-ui/core";

import apiService from "../core/service/detail";
import {getMethod, postMethod} from "../core/service/common.api";
import {toast} from "react-toastify";
import {setAuthToken, getAuthToken} from "../core/lib/localStorage";
import OTPInput, {ResendOTP} from "otp-input-react";
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
      navigate("/launchbuy/" + data._id + "_symbol_" + data.symbol);
    } catch (error) {
      toast.error("Please try later");
    }
  };

  return (
    <div className="">
      <main className="main-content tradepage-bg login_body_ bg-cover ">
        <Header />
        <div className="container pt-5">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 padin_zero">
            <div className="container d-flex justify-content-center padin_zero">
              <div className="col-lg-10">
                <div className="staking_title launcpad">
                  <div>
                    <h1>Launchpad</h1>
                    <p>A Token Launch Platform For Transfermative project</p>
                  </div>
                  {authToken == true ? (
                    <Button>
                      {" "}
                      <Link to="/">Apply To Launch</Link>{" "}
                    </Button>
                  ) : (
                    <Button>
                      {" "}
                      <Link to="/login">Login to continue</Link>{" "}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 padin_zero">
            <div className="container d-flex justify-content-center padin_zero">
              <div className="col-lg-10">
                <h2 className="title_launce">In Progress</h2>
                <div className="row">
                  {inprogressToken && inprogressToken.length > 0 ? (
                    inprogressToken.map((item, i) => {
                      var startDate = moment(item.startDate).format(
                        "MM-DD-YYYY"
                      );
                      var endtdate = moment(item.endDate).format("MM-DD-YYYY");
                      return (
                        <div className="col-lg-4 col-md-6 col-sm-6">
                          <div className="launch_card">
                            <label>
                              <i class="bi bi-clock"></i>In progress
                            </label>
                            <div className="token_img_">
                              <img src={item.image} />
                              <h3>{item.coinName} </h3>
                              {/* <p>Stack ETH Earn BTC</p> */}
                            </div>
                            <div className="details">
                              <p>
                                <span>Total Funds</span>
                                <span className="text_uniqwe">
                                  {" "}
                                  {item.totalSupply} {item.symbol}{" "}
                                </span>
                              </p>

                              {/* <p>
                              <span>Ratio</span>
                              <span className="text_uniqwe">1 ETH = 15000 PUN</span>
                            </p> */}
                              {/* <p>
                              <span>Access</span>
                              <span className="text_uniqwe">Private</span>
                            </p> */}
                              <p>
                                <span>Networ</span>
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
                  )}
                </div>

                <h2 className="title_launce">Upcoming</h2>
                <div className="row">
                  {upcommingToken && upcommingToken.length > 0 ? (
                    upcommingToken.map((item, i) => {
                      var startDate = moment(item.startDate).format(
                        "MM-DD-YYYY"
                      );
                      var endtdate = moment(item.endDate).format("MM-DD-YYYY");
                      return (
                        <div className="col-lg-4 col-md-6 col-sm-6">
                          <div className="launch_card">
                            <label className="upcomming">
                              <i class="bi bi-clock"></i>Upcoming
                            </label>
                            <div className="token_img_">
                              <img src={item.image} />
                              <h3>{item.coinName} </h3>
                              {/* <p>Stack ETH Earn BTC</p> */}
                            </div>
                            <div className="details">
                              <p>
                                <span>Total Funds</span>
                                <span className="text_uniqwe">
                                  {" "}
                                  {item.totalSupply} {item.symbol}{" "}
                                </span>
                              </p>

                              {/* <p>
                              <span>Ratio</span>
                              <span className="text_uniqwe">1 ETH = 15000 PUN</span>
                            </p> */}
                              {/* <p>
                              <span>Access</span>
                              <span className="text_uniqwe">Private</span>
                            </p> */}
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
                    <div className="title_launce erroe_launch">
                      {" "}
                      Currently not available for upcomming tokens!{" "}
                      <label className="upcomming">
                        <i class="bi bi-clock"></i>
                      </label>
                    </div>
                  )}
                </div>

                <h2 className="title_launce">Expired Token</h2>
                <div className="row">
                  {expiredToken && expiredToken.length > 0 ? (
                    expiredToken.map((item, i) => {
                      var startDate = moment(item.startDate).format(
                        "MM-DD-YYYY"
                      );
                      var endtdate = moment(item.endDate).format("MM-DD-YYYY");
                      return (
                        <div className="col-lg-4 col-md-6 col-sm-6">
                          <div className="launch_card">
                            <label className="green_ww">
                              <i class="bi bi-check-circle"></i>Finished
                            </label>
                            <div className="token_img_">
                              <img src={item.image} />
                              <h3>{item.coinName} </h3>
                              {/* <p>Stack ETH Earn BTC</p> */}
                            </div>
                            <div className="details">
                              <p>
                                <span>Total Funds</span>
                                <span className="text_uniqwe">
                                  {" "}
                                  {item.totalSupply} {item.symbol}{" "}
                                </span>
                              </p>

                              {/* <p>
                              <span>Ratio</span>
                              <span className="text_uniqwe">1 ETH = 15000 PUN</span>
                            </p> */}
                              {/* <p>
                              <span>Access</span>
                              <span className="text_uniqwe">Private</span>
                            </p> */}
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
                            {/* <Button>Buy now</Button> */}
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
                  )}
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
