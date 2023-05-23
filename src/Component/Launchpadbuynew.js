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
import Time from "./Countdown";
import Dropdown from "react-dropdown";
import Countdown from "react-countdown";
import "react-dropdown/style.css";

function Home() {
  const [tokenDetails, setTokenDetails] = useState("");
  const [allCurrencyFiat, setallCurrencyFiat] = useState([]);
  const [records, setrecords] = useState([]);
  const [currentBalance, setcurrentBalance] = useState(0);
  const [amount, setAmount] = useState(0);
  const [CurrentINRValue, setCurrentINRValue] = useState(0);
  const [totalToken, settotalToken] = useState(0);
  const [currentCurrency, setcurrentCurrency] = useState("");
  const [message, setMessage] = useState("");
  const [success, setsuccess] = useState(false);

  const navigate = useNavigate();

  const defaulatCurrFiat = allCurrencyFiat[0];

  useEffect(() => {
    let getToken = localStorage.getItem("user_token");
    if (getToken != "" && getToken != undefined && getToken != null) {
      getBalance();
    } else {
    }

    var urls = window.location.href;
    var fetchPair = urls.split("launchpadNewbuy/")[1];
    if (fetchPair) {
      var split = fetchPair.split("_symbol")[0];
      getTokenDetails(split);
    } else {
      // navigate("/");
    }
  }, [0]);

  const getTokenDetails = async (data) => {
    try {
      var obj = {
        _id: data,
      };
      var data = {
        apiUrl: apiService.getTokenDetails,
        payload: obj,
      };
      var resp = await postMethod(data);
      if (resp) {
        console.log(resp.data);
        setTokenDetails(resp.data);
        var data = new Date(resp.data.endDate).getTime();
        console.log(data);
      }
    } catch (error) {}
  };

  const getBalance = async () => {
    try {
      var data = {
        apiUrl: apiService.launchPadcurrency,
      };
      var resp = await getMethod(data);
      if (resp) {
        console.log(resp.data);
        var currArrayCrypto = [];
        var currArrayFiat = [];
        var data = resp.Message;
        setrecords(data);
        for (var i = 0; i < data.length; i++) {
          var obj = {
            value: data[i].currid,
            label: data[i].currencysymbol,
            balance: data[i].currencyBalance,
          };
          currArrayCrypto.push(obj);
        }
        withCash(currArrayCrypto[0]);
        setallCurrencyFiat(currArrayCrypto);
      }
    } catch (error) {}
  };

  const withCash = async (option) => {
    setcurrentCurrency(option.label);
    let indexing = records.findIndex((x) => x.currid == option.value);
    if (indexing != -1) {
      var getBalanceData = records[indexing].currencyBalance;
      setcurrentBalance(getBalanceData);
    }
    var obj = {
      currency: option.label,
    };
    var data = {
      apiUrl: apiService.getCurrencyConvertion,
      payload: obj,
    };
    var resp = await postMethod(data);
    if (resp) {
      console.log(resp.inr_value,"resp.inr_value");
      setCurrentINRValue(+resp.inr_value);
    }
  };

  const quantityCal = async (e) => {
    setAmount(e.target.value);
    var priceValue = +tokenDetails.price;
    var tokenPrice = 1 / +priceValue;
    var calTotal = CurrentINRValue * tokenPrice;
    var quantity = +calTotal * +e.target.value;
    settotalToken(quantity);
  };
  const maximum = async () => {
    setAmount(currentBalance);
    var priceValue = +tokenDetails.price;
    var tokenPrice = 1 / +priceValue;
    var calTotal = CurrentINRValue * tokenPrice;
    var quantity = +calTotal * +currentBalance;
    settotalToken(quantity);
  };

  const submitCurrency = async () => {
    try {
      var obj = {
        totalAmount: +amount,
        totalToken: +totalToken,
        currency: currentCurrency,
        launchToken: tokenDetails.symbol,
        token_id: tokenDetails._id,
      };
      var data = {
        apiUrl: apiService.tokenPurchase,
        payload: obj,
      };
      var resp = await postMethod(data);
      if (resp.status) {
        toast.success(resp.Message);
        console.log(resp.Message, "-=-=-=-resp=-=--=");
        setMessage(resp.Message);
        setsuccess(true);
      } else {
        setMessage(resp.Message);
        toast.error(resp.Message);
      }
    } catch (error) {}
  };

  const closePopup = async () => {
    navigate("/launchpadNewnow");
  };

  return (
    <div className="">
      <main className="main-content tradepage-bg login_body_ bg-cover ">
        {/* <Header /> */}
        <div className="container pt-5">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 padin_zero">
            <div className="container d-flex justify-content-center padin_zero">
              <div className="col-lg-6">
                <div className="view_now">
                  <div className="title_section">
                    <img src={tokenDetails.image} />
                    <h3>{tokenDetails.symbol} </h3>
                    <p>{tokenDetails.coinName}</p>
                  </div>
                  <div className="row justify-center flex-column align-items-center">
                    <div className="col-lg-12">
                      <div className="title_section">
                        <div className="details_set">
                          <a href={tokenDetails.website} target="_blank">
                            <i class="bi bi-link-45deg"></i>
                            <span>Website</span>
                          </a>
                          <a href={tokenDetails.twitter} target="_blank">
                            <i class="bi bi-twitter"></i>
                            <span>Twitter</span>
                          </a>
                          <a href={tokenDetails.telegram} target="_blank">
                            <i class="bi bi-telegram"></i>
                            <span>Telegram</span>
                          </a>
                          <a href={tokenDetails.whitpaper} target="_blank">
                            <i class="bi bi-newspaper"></i>
                            <span>Whitepaper</span>
                          </a>
                        </div>
                      </div>
                      <div className="price_sectiom_">
                        <p>
                          <span>Your Min Purchase</span>{" "}
                          <span className="priceamt">
                            {parseFloat(tokenDetails.softCap).toFixed(4)}{" "}
                          </span>
                        </p>
                        <p>
                          <span>Your Max Purchase</span>{" "}
                          <span className="priceamt">
                            {parseFloat(tokenDetails.hardcap).toFixed(4)}{" "}
                          </span>
                        </p>
                        <p>
                          <span>Min - Max Allocation</span>{" "}
                          <span className="priceamt">
                            {parseFloat(tokenDetails.allocate).toFixed(4)}{" "}
                          </span>
                        </p>

                        <p>
                          <span>Network</span>{" "}
                          <span className="priceamt">
                            {tokenDetails.network}{" "}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="col-lg-12 p-0">
                      <form className="launch_card new_table  pt-5">
                        <p className="balance">
                          {" "}
                          Your Wallet Balance: {(+currentBalance).toFixed(8)}
                        </p>
                        <div className="input_section">
                          <p>
                            <span>Input</span>
                          </p>
                          <div className="input_select_s newbtind">
                            <input
                              type="number"
                              value={amount}
                              onChange={quantityCal}
                              placeholder="Enter Amount"
                            />
                            <div className="select_option">
                              <Button onClick={maximum}>Max</Button>

                              {/* <div class="flex justify-center">
                                <div class="select_width">
                                  <select
                                    class="form-select 
                                      block
                                      w-full
                                      px-3
                                      py-1.5
                                      text-base
                                      font-normal
                                      text-gray-700
                                      bg-white bg-clip-padding bg-no-repeat
                                      border border-solid border-gray-300
                                      rounded
                                      transition
                                      ease-in-out
                                      m-0
                                      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                    aria-label="Default select example"
                                  >
                                    <option selected>ETH</option>
                                    <option value="1">BTC</option>
                                    <option value="2">SHIPA</option>
                                  </select>
                                </div>
                              </div> */}
                            </div>
                          </div>
                        </div>
                        <div className="input_section">
                          <Dropdown
                            className="input_bg"
                            options={allCurrencyFiat}
                            onChange={(o) => withCash(o)}
                            value={defaulatCurrFiat}
                            placeholder="Choose"
                          />
                        </div>
                        {/* <div className="fonr_icon">
                          <span class="material-symbols-outlined">
                            arrow_downward
                          </span>
                        </div> */}
                        <div className="input_section">
                          <p>
                            <span>Output</span>
                          </p>
                          <div className="input_select_s">
                            <input type="number" value={totalToken} disabled />
                            <div className="select_option">
                              <div class="flex justify-center">
                                <div class="text-primary">
                                  {tokenDetails.symbol}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="submiot">
                          {amount && amount > 0 ? (
                            <Button
                              data-toggle="modal"
                              data-target="#launchpad_doce"
                              onClick={submitCurrency}
                            >
                              Confirm
                            </Button>
                          ) : (
                            <span style={{cursor: "not-allowed"}}>
                              <Button disabled>Confirm</Button>
                            </span>
                          )}
                        </div>
                      </form>
                      {/* <form className="launch_card new_table  pt-5 countdownw pb-5">
                        <p>
                          Reward Token Will be Available to harvest in approx
                          <Time timer={1660928767} />
                          <Countdown date={Date.now() + 1661505710000 } />
                        </p>
                        <div className="input_section">
                          <div className="count_section">
                          <Countdown date={Date.now() + 1211115000}/>
                          
                          </div>
                        </div>

                        <div className="submiot">
                          <Button>Confirm</Button>
                        </div>
                      </form> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <div id="launchpad_doce" class="modal launchpad_doce fade" role="dialog">
        <div class="modal-dialog modal-dialog-centered ">
          <div class="modal-content">
            <div class="modal-body">
              {
                success == true ? (
                  <div className="completed">
                    <i class="bi bi-patch-check-fill"></i>
                  </div>
                ) : (
                  ""
                )
                //    <div className="completed">
                //    <i class="bi bi-patch-check-fill"></i>
                //  </div>
              }

              <h1> {message}</h1>
              <p>
                <span>Amount</span>
                <span>
                  {totalToken} {tokenDetails.symbol}
                </span>
              </p>
            </div>
            <div class="modal-footer">
              <Button
                type="button"
                class="btn btn-default"
                data-dismiss="modal"
                onClick={closePopup}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
