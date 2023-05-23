import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import "rc-slider/assets/index.css";
import Header from "./Header";
import { Button } from "@material-ui/core";

import apiService from "../core/service/detail";
import { postMethod } from "../core/service/common.api";
import { toast } from "react-toastify";
import { setAuthToken, getAuthToken } from "../core/lib/localStorage";
import Pagination from "react-js-pagination";
import { getMethod } from "../core/service/common.api";
var moment = require("moment");

function Home() {
  const [perpage, setperpage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [stakeDetails, setstakeDetails] = useState([]);
  const [totalactive, settotalactive] = useState(0);
  const [staking1, setstaking1] = useState("");
  const [staking2, setstaking2] = useState("");
  const [staking3, setstaking3] = useState("");
  const [staking4, setstaking4] = useState("");
  const [userBalance, setuserBalance] = useState([]);
  const [currentPack, setcurrentPack] = useState("");
  const [stakeBalance, setStakeBalance] = useState("");
  const [fromDates, setfromData] = useState("");
  const [toDates, settoDate] = useState("");
  const [apy, setAPY] = useState(0);
  const [apr, setAPR] = useState(0);
  const [FlexibleEarn, setFlexibleEarn] = useState(0);

  const [authToken, setauthToken] = useState(false);
  const [stakeValue, setstakeValue] = useState(0);
  const [currentDuration, setcurrentDuration] = useState(0);
  const [currentDurationFlex, setcurrentDurationFlex] = useState(0);
  const [TotalFlexible, setTotalFlexible] = useState(0);

  const [userTotlaInterest, setuserTotlaInterest] = useState(0);
  const [usetDailyInterest, setusetDailyInterest] = useState(0);
  const [stakeHistory, setstakeHistory] = useState([]);
  const [validation, setValidation] = useState(false);
  const [validationErr, setValidationErr] = useState(false);
  const [buttonLoader, setButtonLoader] = useState(false);
  const [fixedvalue, setFixedValue] = useState(4);
  const [totalStakedValue, settotalStakedValue] = useState(0);
  const [totallockedValue, settotallockedValue] = useState(0);
  const [totalStakedValueUSD, settotalStakedValueUSD] = useState(0);
  const [totallockedValueUSD, settotallockedValueUSD] = useState(0);
  const [stakedcurrency, setStakedCurrency] = useState(0);
  const [interest, setInterest] = useState(0);
  const [stakingType, setstakingType] = useState("fixed");
  const [selectedFlex, setselectedFlex] = useState("");
  const [adminProfit, setAdminprofit] = useState(0);
  const [flexibleStartDate, setflexibleStartDate] = useState("");
  const [flexibleEndDate, setflexibleEndDate] = useState("");

  const recordPerPage = 10;
  const pageRange = 10;
  const navigate = useNavigate();

  useEffect(() => {
    let getToken = localStorage.getItem("user_token");
    if (getToken != "" && getToken != undefined && getToken != null) {
      setauthToken(true);
      getBalance();
      getStakingHistory();
      getStakeTotalDetails();
      getTodayDate();
    } else {
      setauthToken(false);
    }

    getStakeDetails(1);
  }, [0]);

  const getTodayDate = async () => {
    var d = new Date();
    var fromDate =
      (await d.getDate()) +
      "/" +
      (d.getMonth() + 1) +
      "/" +
      d.getFullYear() +
      " " +
      d.getHours() +
      ":" +
      d.getMinutes();
    setfromData(fromDate);
    setflexibleStartDate(fromDate);

    var myDate = new Date(d.getTime() + 365 * 24 * 60 * 60 * 1000);

    var toDate =
      (await myDate.getDate()) +
      "/" +
      (myDate.getMonth() + 1) +
      "/" +
      myDate.getFullYear() +
      " " +
      myDate.getHours() +
      ":" +
      myDate.getMinutes();
    setflexibleEndDate(toDate);
  };

  const getStakeDetails = async (pages) => {
    var obj = {
      FilPerpage: perpage,
      FilPage: pages,
    };
    var data = {
      apiUrl: apiService.getStatkingDetails,
      payload: obj,
    };
    var resp = await postMethod(data);
    if (resp.status) {
      var datas = resp.data.result;
      settotalactive(resp.data.count);
      console.log(datas, "=-=-=-=-data");
      setstakeDetails(datas);
    } else {
      setstakeDetails([]);
    }
  };

  const activePageChange = (pageNumber) => {
    setCurrentPage(pageNumber); // call API to get data based on pageNumber
    getStakeDetails(pageNumber);
  };

  const chooseDuration = async (selectedduration, data, duration) => {
    try {
      console.log(
        selectedduration,
        "=-==-selectedduration-=-= ",
        data,
        duration
      );
      getStakeTotalDetails(data.currencySymbol);
      setcurrentDuration(+duration);
      if (selectedduration == "stake1") {
        setAPY(data.FistDurationAPY);
      } else if (selectedduration == "stake2") {
        setAPY(data.SecondDurationAPY);
      } else if (selectedduration == "stake3") {
        setAPY(data.ThirdDurationAPY);
      } else if (selectedduration == "stake4") {
        setAPY(data.FourthDurationAPY);
      } else {
        setAPY(0);
      }
      var obj = {
        status: selectedduration,
        id: data._id,
      };
      setstaking1(obj);

      dataCalculation(selectedduration, data, duration);
    } catch (error) {}
  };
  const [afterConnect, setConnect] = useState(false);
  useEffect(() => {
    const address = sessionStorage.getItem("walletAddress");
    if (address) {
      document.getElementById("connectwallet1").innerText = address;
      setConnect(true);
      document.querySelectorAll(".login-in-continue").forEach((item) => {
        item.innerText = "To The Space";
      });
    }
  }, []);

  const chooseDurationFlexible = async (selectedduration, data, duration) => {
    try {
      console.log(
        selectedduration,
        "=-==-selectedduration-=-= ",
        data,
        duration
      );
      setselectedFlex(data);
      getStakeTotalDetails(data.currencySymbol);
      setcurrentDurationFlex(+duration);
      if (selectedduration == "stake1") {
        setInterest(data.APRinterest);
        setAPR(data.firstInterest);
        setAdminprofit(data.firstProfit);
      } else if (selectedduration == "stake2") {
        setInterest(data.APRinterest);
        setAPR(data.secondInterest);
        setAdminprofit(data.secondProfit);
      } else if (selectedduration == "stake3") {
        setInterest(data.APRinterest);
        setAPR(data.thirdInterst);
        setAdminprofit(data.thirdProfit);
      } else if (selectedduration == "stake4") {
        setInterest(data.APRinterest);
        setAPR(data.fourthInterest);
        setAdminprofit(data.fourthProfit);
      } else {
        setInterest(0);
        setAPR(0);
      }
      var obj = {
        status: selectedduration,
        id: data._id,
      };
      setstaking2(obj);

      dataCalculation(selectedduration, data, duration);
    } catch (error) {}
  };

  const dataCalculation = async (stakePosition, statkeDetails, duration) => {
    try {
      var plans = parseFloat(duration);
      var d = new Date();
      var fromDate =
        (await d.getDate()) +
        "/" +
        (d.getMonth() + 1) +
        "/" +
        d.getFullYear() +
        " " +
        d.getHours() +
        ":" +
        d.getMinutes();
      setfromData(fromDate);

      var myDate = new Date(new Date().getTime() + plans * 24 * 60 * 60 * 1000);

      var toDate =
        (await myDate.getDate()) +
        "/" +
        (myDate.getMonth() + 1) +
        "/" +
        myDate.getFullYear() +
        " " +
        myDate.getHours() +
        ":" +
        myDate.getMinutes();
      settoDate(toDate);
    } catch (error) {
      toast.error("Please try again later");
    }
  };

  const getBalance = async () => {
    try {
      var data = {
        apiUrl: apiService.getUserBalanceAll,
      };
      var resp = await getMethod(data);
      if (resp.status) {
        setuserBalance(resp.data);
        console.log(resp.data, "=-=-resp-=-=-=resp-=-resp.data");
      }
    } catch (error) {
      // toast.error("Please try again later");
    }
  };

  const getStakingHistory = async () => {
    try {
      var data = {
        apiUrl: apiService.getAllstakingHistory,
      };
      var resp = await getMethod(data);
      if (resp.status) {
        // setuserBalance(resp.data);
        console.log(resp.data, "=-=-resp-=-=-=resp-=-resp.data");
        setstakeHistory(resp.data);
      }
    } catch (error) {
      // toast.error("Please try again later");
    }
  };

  const stakeNow = (currentPack, type) => {
    try {
      setstakeValue(0);
      setuserTotlaInterest(0);
      setFlexibleEarn(0);
      setInterest(currentPack.APRinterest);
      setstakingType(type);
      console.log(currentPack);
      setcurrentPack(currentPack);
      var index = userBalance.findIndex(
        (x) => x.currencySymbol == currentPack.currencySymbol
      );
      if (index != -1) {
        let findCurrency = userBalance[index];
        setStakeBalance(findCurrency);
      }
      var obj = {
        status: "",
        id: currentPack._id,
      };
      setstaking2(obj);
    } catch (error) {
      // toast.error("Please try again later");
    }
  };

  const stakeAmount = (e) => {
    try {
      setstakeValue(e.target.value);
      var amount = parseFloat(e.target.value);
      if (stakingType == "fixed") {
        var dailyinterest = amount * (+apy / 100 / 365);
        var totalInterest = parseFloat(dailyinterest) * currentDuration;
        setuserTotlaInterest(totalInterest);
        setusetDailyInterest(dailyinterest);
      } else if (stakingType == "flexible") {
        console.log("amount::::", amount, "interest:::", interest);
        var dailyinterestDate = amount * (+interest / 100 / 365);
        var totalInterestFlex = parseFloat(dailyinterestDate) * 1;
        setFlexibleEarn(dailyinterestDate);
        setTotalFlexible(totalInterestFlex);
      }
    } catch (error) {
      // toast.error("Please try again later");
    }
  };

  const choosePlan = async () => {
    try {
      toast.error("Please choose staking plan");
    } catch (error) {
      // toast.error("Please try again later");
    }
  };

  const confirmStack = async () => {
    try {
      if (stakeValue > 0) {
        setValidation(false);
        console.log("confirm staking");
        if (stakingType == "fixed") {
          var obj = {
            stakingPlan: currentDuration,
            totalInterest: userTotlaInterest,
            dailyinterest: usetDailyInterest,
            startDate: fromDates,
            endDate: toDates,
            currentAPY: apy,
            stakeMore: staking1,
            stakeAmont: stakeValue,
            type: "fixed",
          };
        } else {
          var obj = {
            //stakingPlan: currentDurationFlex,
            stakingPlan: 0,
            totalInterest: TotalFlexible,
            dailyinterest: FlexibleEarn,
            startDate: fromDates,
            endDate: flexibleEndDate,
            currentAPY: interest,
            stakeMore: staking2,
            stakeAmont: stakeValue,
            type: "flexible",
          };
        }

        var data = {
          apiUrl: apiService.confirmStaking,
          payload: obj,
        };
        setButtonLoader(true);
        // return false;
        var resp = await postMethod(data);
        setButtonLoader(false);
        if (resp.status) {
          await toast.success(resp.Message);
          window.location.reload();
        } else {
          toast.error(resp.Message);
        }
      } else {
        setValidation(true);
        toast.error("Enter stake amount");
      }
    } catch (error) {
      // toast.error("Please try again later");
    }
  };

  const maximum = async () => {
    try {
      setstakeValue(
        parseFloat(stakeBalance.currencyBalance).toFixed(fixedvalue)
      );
      var amount = parseFloat(stakeBalance.currencyBalance);
      console.log(amount, "9090");
      if (amount > 0) {
        var dailyinterest = amount * (+apy / 100 / 365);
        var totalInterest = parseFloat(dailyinterest) * currentDuration;
        setuserTotlaInterest(totalInterest);
        setusetDailyInterest(dailyinterest);
      } else {
        toast.error("Insufficient balance");
      }
    } catch (error) {
      toast.error("Please try again later");
    }
  };

  const getStakeTotalDetails = async (currency) => {
    try {
      var obj = {
        currency: currency,
      };
      var data = {
        apiUrl: apiService.getStakingTotal,
        payload: obj,
      };
      var resp = await postMethod(data);
      if (resp.status) {
        console.log(resp.data);
        settotallockedValue(resp.data.totalLocked);
        settotalStakedValue(resp.data.totalStaked);
        settotalStakedValueUSD(resp.data.totalStakedUSD);
        settotallockedValueUSD(resp.data.totalLockedUSD);
        setStakedCurrency(currency);
      }
    } catch (error) {
      // toast.error("Please try again later");
    }
  };

  const claimNow = async (claimData) => {
    try {
      var obj = {
        _id: claimData._id,
      };
      var data = {
        apiUrl: apiService.claimNowapi,
        payload: obj,
      };
      var resp = await postMethod(data);
      if (resp.status) {
        toast.success(resp.Message);
        getStakingHistory();
      } else {
        toast.error(resp.Message);
      }
    } catch (error) {
      // toast.error("Please try again later");
    }
  };

  const claimNowFlexible = async (claimData) => {
    try {
      var obj = {
        _id: claimData._id,
      };
      var data = {
        apiUrl: apiService.claimNowapiFlexible,
        payload: obj,
      };
      var resp = await postMethod(data);
      if (resp.status) {
        toast.success(resp.Message);
        getStakingHistory();
      } else {
        toast.error(resp.Message);
      }
    } catch (error) {
      // toast.error("Please try again later");
    }
  };

  return (
    <div className="">
      <main className="main-content tradepage-bg login_body_ bg-cover ">
        {/* <Header /> */}
        <div className="container p-0">
          <div className="">
            <div className="container d-flex justify-content-center">
              <div className="col-lg-12 p-0">
                <div className="staking_title">
                  <h1>Staking</h1>

                  <div className="staking_price">
                    <div className="flex-allowww">
                      <div className="clocc">
                        <h3>Total Staked</h3>
                        <p> 0.0000 ETH </p>
                      </div>
                      <div className="clocc">
                        <h3>Total Value Locked</h3>
                        <p> 0.0000 ETH </p>
                      </div>
                    </div>

                    <div className="flex-allowww flecx-ssss">
                      <div className="clocc">
                        <h3>Total Staked USD</h3>
                        <p> 0.0000 USD </p>
                      </div>
                      <div className="clocc">
                        <h3>Total Value Locked USD</h3>
                        <p> 0.0000 USD </p>
                      </div>
                    </div>

                    {/* <div>
                      <h3>Price {currentPack.currencySymbol}</h3>
                      <p>0.0000 </p>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="">
            <div className="container d-flex justify-content-center p-0">
              <div className="col-lg-12 p-0">
                <div className="staking_optoikn">
                  <ul class="nav nav-pills">
                    <li class="active">
                      <a data-toggle="pill" href="#Staking" class="active">
                        Fixed Staking
                      </a>
                    </li>
                    <li class="">
                      <a data-toggle="pill" href="#FlexibleStaking">
                        Flexible Staking
                      </a>
                    </li>
                    <li>
                      <a data-toggle="pill" href="#LockedStaking">
                        Staking History
                      </a>
                    </li>
                  </ul>

                  {/* //======================Staking Details==============// */}

                  <div class="tab-content">
                    <div id="Staking" class="tab-pane fade in active show">
                      <div className="staking_title">
                        <div class="fixTableHead">
                          <table>
                            <thead>
                              <tr>
                                <th> Currency </th>
                                <th> APY </th>
                                <th> Duration </th>
                                <th> Type </th>
                                <th> Minimum Stake </th>
                              </tr>
                            </thead>

                            <tbody>
                              <tr>
                                <td>
                                  <div className="price">
                                    <h1>
                                      <img src="https://res.cloudinary.com/taikonz-com/image/upload/v1664015323/fswpx9cb8ygezbx25edq.png" />
                                      ETH
                                    </h1>
                                  </div>
                                </td>
                                <td>
                                  <div class="aPY">72 % </div>
                                </td>
                                <td>
                                  <div className="duration">
                                    <Button className="duration">
                                      30 Days
                                    </Button>
                                    <Button className="duration">
                                      90 Days
                                    </Button>
                                    <Button className="duration">
                                      180 Days
                                    </Button>
                                    <Button className="duration">
                                      365 Days
                                    </Button>
                                  </div>
                                </td>
                                <td>
                                  <div class="type">
                                    <p>Lock</p>
                                  </div>
                                </td>
                                <td>
                                  <div class="minimum">
                                    <p>0.01 ETH </p>
                                    <Button className="active">
                                      {" "}
                                      Stake Now
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <div className="price">
                                    <h1>
                                      <img src="https://res.cloudinary.com/taikonz-com/image/upload/v1664014614/u3ehd8hzd9b2yjtejxcs.png" />
                                      DOGE
                                    </h1>
                                  </div>
                                </td>
                                <td>
                                  <div class="aPY">72 % </div>
                                </td>
                                <td>
                                  <div className="duration">
                                    <Button className="duration">
                                      30 Days
                                    </Button>
                                    <Button className="duration">
                                      90 Days
                                    </Button>
                                    <Button className="duration">
                                      180 Days
                                    </Button>
                                    <Button className="duration">
                                      365 Days
                                    </Button>
                                  </div>
                                </td>
                                <td>
                                  <div class="type">
                                    <p>Lock</p>
                                  </div>
                                </td>
                                <td>
                                  <div class="minimum">
                                    <p>0.01 ETH </p>
                                    <Button className="active">
                                      {" "}
                                      Stake Now
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <div className="price">
                                    <h1>
                                      <img src="https://res.cloudinary.com/taikonz-com/image/upload/v1664013451/g3blakjx9tscunb7h8ou.png" />
                                      BTC
                                    </h1>
                                  </div>
                                </td>
                                <td>
                                  <div class="aPY">72 % </div>
                                </td>
                                <td>
                                  <div className="duration">
                                    <Button className="duration">
                                      30 Days
                                    </Button>
                                    <Button className="duration">
                                      90 Days
                                    </Button>
                                    <Button className="duration">
                                      180 Days
                                    </Button>
                                    <Button className="duration">
                                      365 Days
                                    </Button>
                                  </div>
                                </td>
                                <td>
                                  <div class="type">
                                    <p>Lock</p>
                                  </div>
                                </td>
                                <td>
                                  <div class="minimum">
                                    <p>0.01 ETH </p>
                                    <Button className="active">
                                      {" "}
                                      Stake Now
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <div className="price">
                                    <h1>
                                      <img src="https://res.cloudinary.com/taikonz-com/image/upload/v1664015302/ajxjk0utmogthxxydimn.png" />
                                      PEPE
                                    </h1>
                                  </div>
                                </td>
                                <td>
                                  <div class="aPY">72 % </div>
                                </td>
                                <td>
                                  <div className="duration">
                                    <Button className="duration">
                                      30 Days
                                    </Button>
                                    <Button className="duration">
                                      90 Days
                                    </Button>
                                    <Button className="duration">
                                      180 Days
                                    </Button>
                                    <Button className="duration">
                                      365 Days
                                    </Button>
                                  </div>
                                </td>
                                <td>
                                  <div class="type">
                                    <p>Lock</p>
                                  </div>
                                </td>
                                <td>
                                  <div class="minimum">
                                    <p>0.01 ETH </p>
                                    <Button className="active">
                                      {" "}
                                      Stake Now
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <div className="price">
                                    <h1>
                                      <img src="https://res.cloudinary.com/taikonz-com/image/upload/v1664014213/tyjkxdtomkitfhn63fkh.png" />
                                      BUSD
                                    </h1>
                                  </div>
                                </td>
                                <td>
                                  <div class="aPY">72 % </div>
                                </td>
                                <td>
                                  <div className="duration">
                                    <Button className="duration">
                                      30 Days
                                    </Button>
                                    <Button className="duration">
                                      90 Days
                                    </Button>
                                    <Button className="duration">
                                      180 Days
                                    </Button>
                                    <Button className="duration">
                                      365 Days
                                    </Button>
                                  </div>
                                </td>
                                <td>
                                  <div class="type">
                                    <p>Lock</p>
                                  </div>
                                </td>
                                <td>
                                  <div class="minimum">
                                    <p>0.01 ZUSD </p>
                                    <Button className="active">
                                      {" "}
                                      Stake Now
                                    </Button>
                                  </div>
                                </td>
                              </tr>

                              <tr>
                                <td>
                                  <div className="price">
                                    <h1>
                                      <img src="https://res.cloudinary.com/taikonz-com/image/upload/v1664015323/fswpx9cb8ygezbx25edq.png" />
                                      ETH
                                    </h1>
                                  </div>
                                </td>
                                <td>
                                  <div class="aPY">72 % </div>
                                </td>
                                <td>
                                  <div className="duration">
                                    <Button className="duration">
                                      30 Days
                                    </Button>
                                    <Button className="duration">
                                      90 Days
                                    </Button>
                                    <Button className="duration">
                                      180 Days
                                    </Button>
                                    <Button className="duration">
                                      365 Days
                                    </Button>
                                  </div>
                                </td>
                                <td>
                                  <div class="type">
                                    <p>Lock</p>
                                  </div>
                                </td>
                                <td>
                                  <div class="minimum">
                                    <p>0.01 ETH </p>
                                    <Button className="active">
                                      {" "}
                                      Stake Now
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      {stakeDetails && stakeDetails.length > 0 ? (
                        <Pagination
                          itemClass="page-item"
                          linkClass="page-link"
                          activePage={currentPage}
                          itemsCountPerPage={recordPerPage}
                          totalItemsCount={totalactive}
                          pageRangeDisplayed={pageRange}
                          onChange={activePageChange}
                        />
                      ) : (
                        ""
                      )}
                    </div>

                    <div id="FlexibleStaking" class="tab-pane fade">
                      <div className="staking_title">
                        <div class="fixTableHead">
                          <table>
                            <thead>
                              <tr>
                                <th> Currency </th>
                                <th> APY </th>
                                <th> Type </th>
                                <th> Minimum Stake </th>
                                <th className="text-right"> Stake Now </th>
                              </tr>
                            </thead>

                            <tbody>
                              <tr>
                                <td>
                                  <div className="price">
                                    <h1>
                                      <img src="https://res.cloudinary.com/taikonz-com/image/upload/v1664015323/fswpx9cb8ygezbx25edq.png" />
                                      ETH
                                    </h1>
                                  </div>
                                </td>
                                <td>
                                  <div class="aPY">72 % </div>
                                </td>
                                <td>
                                  <div class="type">
                                    <p>Flexible</p>
                                  </div>
                                </td>
                                <td>
                                  <div className="minimum justify-content-end">
                                    <div class="minimum">
                                      <p>0.01 ETH </p>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className="minimum justify-content-end">
                                    <div class="minimum">
                                      <Button className="active">
                                        {" "}
                                        Stake Now
                                      </Button>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <div className="price">
                                    <h1>
                                      <img src="https://res.cloudinary.com/taikonz-com/image/upload/v1664015323/fswpx9cb8ygezbx25edq.png" />
                                      ETH
                                    </h1>
                                  </div>
                                </td>
                                <td>
                                  <div class="aPY">72 % </div>
                                </td>
                                <td>
                                  <div class="type">
                                    <p>Flexible</p>
                                  </div>
                                </td>
                                <td>
                                  <div className="minimum justify-content-end">
                                    <div class="minimum">
                                      <p>0.01 ETH </p>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className="minimum justify-content-end">
                                    <div class="minimum">
                                      <Button className="active">
                                        {" "}
                                        Stake Now
                                      </Button>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <div className="price">
                                    <h1>
                                      <img src="https://res.cloudinary.com/taikonz-com/image/upload/v1664015323/fswpx9cb8ygezbx25edq.png" />
                                      ETH
                                    </h1>
                                  </div>
                                </td>
                                <td>
                                  <div class="aPY">72 % </div>
                                </td>
                                <td>
                                  <div class="type">
                                    <p>Flexible</p>
                                  </div>
                                </td>
                                <td>
                                  <div className="minimum justify-content-end">
                                    <div class="minimum">
                                      <p>0.01 ETH </p>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className="minimum justify-content-end">
                                    <div class="minimum">
                                      <Button className="active">
                                        {" "}
                                        Stake Now
                                      </Button>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <div className="price">
                                    <h1>
                                      <img src="https://res.cloudinary.com/taikonz-com/image/upload/v1664015323/fswpx9cb8ygezbx25edq.png" />
                                      ETH
                                    </h1>
                                  </div>
                                </td>
                                <td>
                                  <div class="aPY">72 % </div>
                                </td>
                                <td>
                                  <div class="type">
                                    <p>Flexible</p>
                                  </div>
                                </td>
                                <td>
                                  <div className="minimum justify-content-end">
                                    <div class="minimum">
                                      <p>0.01 ETH </p>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className="minimum justify-content-end">
                                    <div class="minimum">
                                      <Button className="active">
                                        {" "}
                                        Stake Now
                                      </Button>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <div className="price">
                                    <h1>
                                      <img src="https://res.cloudinary.com/taikonz-com/image/upload/v1664015323/fswpx9cb8ygezbx25edq.png" />
                                      ETH
                                    </h1>
                                  </div>
                                </td>
                                <td>
                                  <div class="aPY">72 % </div>
                                </td>
                                <td>
                                  <div class="type">
                                    <p>Flexible</p>
                                  </div>
                                </td>
                                <td>
                                  <div className="minimum justify-content-end">
                                    <div class="minimum">
                                      <p>0.01 ETH </p>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className="minimum justify-content-end">
                                    <div class="minimum">
                                      <Button className="active">
                                        {" "}
                                        Stake Now
                                      </Button>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <div className="price">
                                    <h1>
                                      <img src="https://res.cloudinary.com/taikonz-com/image/upload/v1664015323/fswpx9cb8ygezbx25edq.png" />
                                      ETH
                                    </h1>
                                  </div>
                                </td>
                                <td>
                                  <div class="aPY">72 % </div>
                                </td>
                                <td>
                                  <div class="type">
                                    <p>Flexible</p>
                                  </div>
                                </td>
                                <td>
                                  <div className="minimum justify-content-end">
                                    <div class="minimum">
                                      <p>0.01 ETH </p>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className="minimum justify-content-end">
                                    <div class="minimum">
                                      <Button className="active">
                                        {" "}
                                        Stake Now
                                      </Button>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      {stakeDetails && stakeDetails.length > 0 ? (
                        <Pagination
                          itemClass="page-item"
                          linkClass="page-link"
                          activePage={currentPage}
                          itemsCountPerPage={recordPerPage}
                          totalItemsCount={totalactive}
                          pageRangeDisplayed={pageRange}
                          onChange={activePageChange}
                        />
                      ) : (
                        ""
                      )}
                    </div>

                    <div id="LockedStaking" class="tab-pane fade">
                      <div className="staking_title">
                        <div class="fixTableHead">
                          <table>
                            <thead>
                              {afterConnect ? (
                                <tr className="after-connnect">
                                  <td colSpan={8}>
                                    Available on Jun 30, 2023.
                                  </td>
                                </tr>
                              ) : (
                                ""
                              )}
                              <tr>
                                <th>Package</th>
                                <th>Total Amount</th>

                                <th>APY / APR</th>
                                <th>Stake Date</th>
                                <th>Locked Days</th>
                                <th>Type</th>

                                <th>Interest End Date</th>
                                {/* <th>Accurue Days</th> */}
                                <th>Estimated Interests</th>
                              </tr>
                            </thead>

                            <tbody>
                              <tr>
                                {" "}
                                <td colSpan="8">
                                  {" "}
                                  No Staking History Found!{" "}
                                </td>{" "}
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* //============================Popup Model=================================// */}

        <div class="modal" id="stacknow">
          <div class="modal-dialog modal-lg modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-body">
                <div className="coin_title">
                  <div className="row fixTableHead h-auto">
                    <div className="col-lg-2">
                      <div className="price">
                        {" "}
                        <h1>
                          <img src={currentPack.currencyImage} />
                          {currentPack.currencySymbol}
                        </h1>
                      </div>
                    </div>
                    <div className="col-lg-2">
                      <div className="aPY">
                        {" "}
                        {stakingType == "fixed" ? apy : interest} %{" "}
                      </div>
                    </div>
                    {stakingType == "fixed" ? (
                      <div className="col-lg-5">
                        <div className="duration">
                          {staking1 && staking1.status == "stake1" ? (
                            <Button className="active" value="stake1">
                              {currentPack.firstDuration}
                              <small>Days</small>
                            </Button>
                          ) : (
                            <Button value="stake1">
                              {currentPack.firstDuration}
                              <small>Days</small>
                            </Button>
                          )}
                          {staking1 && staking1.status == "stake2" ? (
                            <Button value="stake2" className="active">
                              {currentPack.secondDuration}
                              <small>Days</small>
                            </Button>
                          ) : (
                            <Button value="stake2" selected>
                              {currentPack.secondDuration}
                              <small>Days</small>
                            </Button>
                          )}
                          {staking1 && staking1.status == "stake3" ? (
                            <Button value="stake3" className="active">
                              {currentPack.thirdDuration}
                              <small>Days</small>
                            </Button>
                          ) : (
                            <Button value="stake3" selected>
                              {currentPack.thirdDuration}
                              <small>Days</small>
                            </Button>
                          )}
                          {staking1 && staking1.status == "stake4" ? (
                            <Button value="stake4" className="active">
                              {currentPack.fourthDuration}
                              <small>Days</small>
                            </Button>
                          ) : (
                            <Button value="stake4" selected>
                              {currentPack.fourthDuration}
                              <small>Days</small>
                            </Button>
                          )}
                        </div>
                      </div>
                    ) : (
                      ""
                    )}

                    <div className="col-lg-3">
                      <div className="stakingtext_new">
                        <div className="type">
                          <p>
                            {" "}
                            {stakingType == "fixed" ? "Lock" : "Flexibile"}{" "}
                          </p>
                        </div>
                        <div className="minimum">
                          <p>
                            {" "}
                            {parseFloat(stakeBalance.currencyBalance).toFixed(
                              4
                            )}{" "}
                            {currentPack.currencySymbol}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className="total_stak_prohress">
                  <div className="row">
                    <div className="col-lg-6 d-flex align-bottom">
                      <div className="stake_count">
                        <p>Total Staked</p>
                        <h1>9,0909,00 BUSD</h1>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="progresss_s">
                        <p>Pool Limit</p>
                        <div className="progre">
                          <h3>
                            <span>15%</span>
                            <span>1,000,000 $KSC </span>
                          </h3>
                          <div className="progress">
                            <div
                              className="progress-bar"
                              role="progressbar"
                              aria-valuenow="70"
                              aria-valuemin="0"
                              aria-valuemax="100"
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
                <div className="data_coin_">
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="input_filed_for_stake">
                        <div className="title_">
                          <h1>Stake</h1>
                          {/* <a href="">
                            Buy KSC <i class="bi bi-box-arrow-up-right"></i>
                          </a> */}
                        </div>
                        <div className="input_obx">
                          <p>
                            <span>Stake Amount</span>{" "}
                            <span>
                              Available Amount{" "}
                              {parseFloat(stakeBalance.currencyBalance).toFixed(
                                4
                              )}{" "}
                              {currentPack.currencySymbol}
                            </span>
                          </p>
                          <div className="inpurrr">
                            <input
                              type="number"
                              value={stakeValue}
                              placeholder="Enter amount"
                              onChange={stakeAmount}
                              min="0"
                            />
                            <div className="instrucion">
                              {/* <small>-100BUSD</small> */}
                              <h5>{currentPack.currencySymbol} </h5>
                              <p onClick={maximum}>MAX</p>
                            </div>
                          </div>
                          <div>
                            {validation == true ? (
                              <p className="text-danger">
                                {" "}
                                Stake amount is required{" "}
                              </p>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="summery">
                        <h1>Summary</h1>
                        <div>
                          <p>
                            Stake Date{" "}
                            <span>
                              {stakingType == "fixed"
                                ? fromDates
                                : flexibleStartDate}{" "}
                            </span>
                          </p>
                          <p>
                            Interest End Date{" "}
                            <span>
                              {stakingType == "fixed" ? toDates : "-"}{" "}
                            </span>
                          </p>
                          {/* <p>
                            Whitdrawal Delay Time <span>None</span>
                          </p> */}
                          <hr />
                          <h4>
                            {stakingType == "fixed" ? (
                              <span>APY</span>
                            ) : (
                              <span>APR</span>
                            )}
                            <span>
                              {stakingType == "fixed" ? apy : interest} %
                            </span>
                          </h4>
                          <h4>
                            <span>Estimated Interest</span>{" "}
                            <span>
                              {" "}
                              {stakingType == "fixed"
                                ? parseFloat(userTotlaInterest).toFixed(8)
                                : parseFloat(FlexibleEarn).toFixed(10)}{" "}
                              {stakeBalance.currencySymbol}{" "}
                            </span>
                          </h4>
                        </div>
                        {authToken && authToken == true ? (
                          buttonLoader == false ? (
                            <Button onClick={confirmStack}>Confirm</Button>
                          ) : (
                            <Button>Loading...</Button>
                          )
                        ) : (
                          <Button>login to continue</Button>
                        )}
                      </div>
                    </div>
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
