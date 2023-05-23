import React, {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";

import "rc-slider/assets/index.css";
import Header from "./Header";
import {Button} from "@material-ui/core";

import apiService from "../core/service/detail";
import {toast} from "react-toastify";
import {setAuthToken, getAuthToken} from "../core/lib/localStorage";
import OTPInput, {ResendOTP} from "otp-input-react";
import {getMethod, postMethod} from "../core/service/common.api";
var moment = require("moment");

function Home() {
  const [records, setrecords] = useState([]);
  const [token, settoken] = useState(false);

  useEffect(() => {
    let getToken = localStorage.getItem("user_token");
    if (getToken != "" && getToken != undefined && getToken != null) {
      settoken(true);
      getLaunchpadHisoty();
    } else {
      settoken(false);
    }
  }, [0]);

  const getLaunchpadHisoty = async () => {
    try {
      var data = {
        apiUrl: apiService.lauchPadHistory,
      };
      var resp = await getMethod(data);
      if (resp) {
        console.log(resp.data);
        var data = resp.data;
        setrecords(data);
      }
    } catch (error) {}
  };
  return (
    <div className="">
      <main className="main-content tradepage-bg login_body_ bg-cover ">
        <Header />
        <div className="container pt-5">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 padin_zero">
            <div className="container ">
              <div className="logo_launchpad">
                <img
                  src={require("../img/keedx-logo.png")}
                  className="logo darktheme"
                />
                <img
                  src={require("../img/keedx-logo-light.png")}
                  className="logo lighttheme"
                />
                <h1>Taikonz Launchpad user purchase token history</h1>
              </div>
            </div>
          </div>
          <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 padin_zero">
            <div className="row justify-center">
              <div className="col-lg-10">
                <div className="staking_title">
                  <div class="fixTableHead">
                    <table>
                      <thead>
                        <tr>
                          <th>Currency</th>
                          <th>Total Amount</th>

                          <th>Purchase ID</th>
                          <th>Fees</th>
                          <th>Sell Currency</th>
                          <th>Purchase Date</th>
                        </tr>
                      </thead>

                      <tbody>
                        {records && records.length > 0 ? (
                          records.map((item, i) => {
                            var startdate = moment(item.createdDate).format(
                              "DD-MM-YYYY"
                            );

                            return (
                              <tr>
                                <td>
                                  <div className="price">
                                    {" "}
                                    <h1>
                                      {/* <img src={item.currencyImage} /> */}
                                      {item.tokenSymbol}
                                    </h1>
                                  </div>
                                </td>

                                <td>
                                  {item.tokenAmount} {item.tokenSymbol}
                                </td>
                                <td>
                                  <div>{item.orderid}</div>
                                </td>
                                <td>{parseFloat(item.fees).toFixed(12)} </td>

                                <td>{item.sellCurrency}</td>
                                <td> {startdate}</td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            {" "}
                            {}{" "}
                            {token == false ? (
                              <td colSpan="7">
                                {" "}
                                <Link to="/login">
                                  {" "}
                                  Login to continue!{" "}
                                </Link>{" "}
                              </td>
                            ) : (
                              <td colSpan="7"> No Launchpad orders found! </td>
                            )}
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
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
