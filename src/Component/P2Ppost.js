import React, {useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

import "rc-slider/assets/index.css";
import Header from "./Header";
import {Button} from "@material-ui/core";

import apiService from "../core/service/detail";
import {postMethod} from "../core/service/common.api";
import {getMethod} from "../core/service/common.api";
import {toast} from "react-toastify";
import {setAuthToken, getAuthToken} from "../core/lib/localStorage";
import OTPInput, {ResendOTP} from "otp-input-react";
import useState from "react-usestateref";

const options = ["one", "two", "three"];
const defaultOption = options[0];

function Home() {
  const [getP2POrders, setgetAllp2pOrders, getP2POrdersref] = useState([]);
  const [sendDatas, setSendDatas, sendDatasref] = useState("");
  const [show, setShow, showref] = useState(false);
  const [allCurrency, setallCurrency, allCurrencyref] = useState([]);
  const [allCurrencyFiat, setallCurrencyFiat, allCurrencyFiatref] = useState(
    []
  );
  const [activetab, setActive, activetabref] = useState("BTC");
  const [activetype, setActivetype, activetyperef] = useState("BTC");
  const [fiatCurrency, setfiatCurrency, fiatCurrencyref] = useState("");
  const [profileDatas, setprofileData, profileDatasref] = useState("");
  const [loginTrue, setloginTrue] = useState(true);

  useEffect(() => {
    getAllp2pOrders();
    getAllcurrency();
    let user_token = getAuthToken();
    console.log("user_token===", typeof user_token);
    console.log("user_token.length===", user_token.length);
    if (user_token != "" && user_token != undefined && user_token != null) {
      setloginTrue(true);
      getProfile();
    } else {
      setloginTrue(false);
    }
  }, []);

  const getProfile = async () => {
    try {
      var data = {
        apiUrl: apiService.getUserDetails,
      };
      var resp = await getMethod(data);
      if (resp.status) {
        setprofileData(resp.data);
      }
    } catch (error) {}
  };

  const getAllp2pOrders = async () => {
    var onj = {
      currency:
        fiatCurrencyref.current && fiatCurrencyref.current != "all"
          ? fiatCurrencyref.current
          : "",
    };
    var data = {
      apiUrl: apiService.p2pGetOrder,
      payload: onj,
    };
    var resp = await postMethod(data);
    console.log(resp.Message, "-=-=-resp=-=-");
    if (resp) {
      var data = resp.Message;
      setgetAllp2pOrders(resp.Message);
    }
  };

  const getAllcurrency = async () => {
    var data = {
      apiUrl: apiService.getP2Pcurrency,
    };
    var resp = await getMethod(data);
    if (resp) {
      var currArrayCrypto = [];
      var currArrayFiat = [{value: "all", label: "Select Currency"}];
      var data = resp.data;
      for (var i = 0; i < data.length; i++) {
        if (data[i].coinType == "1") {
          var obj = {
            id: data[i]._id,
            currencySymbol: data[i].currencySymbol,
          };
          currArrayCrypto.push(obj);
        }
        if (data[i].coinType == "2") {
          var obj = {
            value: data[i]._id,
            label: data[i].currencySymbol,
          };
          currArrayFiat.push(obj);
        }
      }
      setallCurrency(currArrayCrypto);
      setallCurrencyFiat(currArrayFiat);
    }
  };

  const defaulatCurrFiat = allCurrencyFiatref.current[0];

  const onSelect = async (option) => {
    console.log(option, "-=-onSelecttop");

    if (option.label == "Select Currency") {
      console.log("call currency all");
      setfiatCurrency(option.value);
      console.log("call currency all", fiatCurrencyref.current);
      getAllp2pOrders();
      setActive(activetabref.current);
      setActivetype("buy");
    } else {
      setfiatCurrency(option.label);
      var onj = {
        currency: option.label,
      };
      var data = {
        apiUrl: apiService.p2pGetOrder,
        payload: onj,
      };
      var resp = await postMethod(data);
      if (resp) {
        var data = resp.Message;
        setgetAllp2pOrders(resp.Message);
      }
    }
  };

  const handleChange = async (e) => {
    const newActiveTab = e.target.getAttribute("data-tab");
    console.log("newActiveTab===", newActiveTab);
    getAllp2pOrders();
    setActive(newActiveTab);
    console.log("activetabref.current===", activetabref.current);
    setActivetype("buy");
  };

  return (
    <div className="">
      <main className="main-content tradepage-bg login_body_ bg-cover ">
        <Header />
        <div className="container pt-5 padin_zero mt-3">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 padin_zero">
            <div className="container d-flex justify-content-center padin_zero">
              <div className="col-lg-10">
                <div className="p2ppost p2plist">
                  {/* <ul class="nav nav-tabs">
                    <li class="active">
                      <a data-toggle="tab" href="#wanttobuy" class="active">
                        BTC
                      </a>
                    </li>
                    <li>
                      <a data-toggle="tab" href="#wanttosell">
                        ETH
                      </a>
                    </li>
                  </ul> */}
                  <ul class="nav nav-tabs">
                    {allCurrencyref.current &&
                      allCurrencyref.current.map((item, i) => {
                        var classactive = "";
                        if (i == 0) {
                          classactive = "active";
                        }
                        return (
                          <li class={`${classactive}`}>
                            <a
                              data-toggle="tab"
                              data-tab={`${item.currencySymbol}`}
                              href={`#${item.currencySymbol}`}
                              class={`${classactive}`}
                              onClick={handleChange}
                            >
                              {item.currencySymbol}
                            </a>
                          </li>
                        );
                      })}
                  </ul>

                  <div class="tab-content">
                    {allCurrencyref.current &&
                      allCurrencyref.current.map((item, j) => {
                        return (
                          <>
                            {activetabref.current == item.currencySymbol ? (
                              <div className="row">
                                <div className="col-lg-8 col-md-6 col-sm-6">
                                  <div className="buy_sell_s ">
                                    <ul class="nav nav-tabs primaryNav">
                                      <li class="active">
                                        <a
                                          data-toggle="tab"
                                          href={`#BuyT${item.currencySymbol}`}
                                          class="nav-link color-green active"
                                        >
                                          Buy
                                        </a>
                                      </li>
                                      <li>
                                        <a
                                          data-toggle="tab"
                                          href={`#SellT${item.currencySymbol}`}
                                          className="nav-link color-red"
                                        >
                                          Sell
                                        </a>
                                      </li>
                                    </ul>
                                  </div>
                                </div>

                                <div className="col-lg-4 col-md-6 col-sm-6 d-flex align-item-center">
                                  <div class="form-group curroncy_blac">
                                    <label>Fiat </label>
                                    <Dropdown
                                      options={allCurrencyFiatref.current}
                                      onChange={(o) => onSelect(o)}
                                      value={defaulatCurrFiat}
                                      placeholder="Select an option"
                                    />
                                  </div>
                                </div>
                                {/* <div className="col-lg-2 d-flex align-item-center">
                        <div class="form-group curroncy_blac">
                          {
                        loginTrue == true ? <Button className="trade-btn green"> <Link to="/p2p/post_ad">Post New Ad</Link> </Button> : <Button > <Link to="/login">Login to continue</Link> </Button>
                      
                        }
                      </div>
                      </div> */}
                              </div>
                            ) : (
                              ""
                            )}
                            <div
                              id={`${item.currencySymbol}`}
                              class={`tab-pane fade in ${
                                activetabref.current == item.currencySymbol
                                  ? "active show"
                                  : ""
                              }`}
                            >
                              <div class="tab-content">
                                <div
                                  id={`BuyT${item.currencySymbol}`}
                                  class="tab-pane fade in active show"
                                >
                                  <div className="buyform_now">
                                    <div class="fixTableHead">
                                      <table>
                                        <thead>
                                          <tr>
                                            <th>Advertisers</th>
                                            <th>Price</th>
                                            <th>Limit/Available</th>
                                            <th>Payment</th>
                                            <th>Trade</th>
                                          </tr>
                                        </thead>

                                        {/* {getP2POrdersref.current && getP2POrdersref.current.length > 0 ? ( */}
                                        <tbody>
                                          {/* <tr>
                                        <td>boom.chawarat</td>
                                        <td>31 BNB</td>
                                        <td>
                                          <p>
                                            <small className="availe_small">
                                              Available
                                            </small>
                                            213 BTC
                                          </p>
                                        </td>
                                        <td>
                                          <p className="paymet-mode">All Payment</p>
                                        </td>
                                        <td>
                                          <Button className="trade-btn green">
                                            Bye
                                          </Button>
                                        </td>
                                      </tr> */}
                                          {getP2POrdersref.current &&
                                            getP2POrdersref.current.map(
                                              (orders, i) => {
                                                var ordertype =
                                                  orders.orderType == "buy"
                                                    ? "sell"
                                                    : "buy";
                                                return orders.firstCurrency ==
                                                  activetabref.current &&
                                                  ordertype == "buy" ? (
                                                  <tr>
                                                    <td>{orders.username}</td>
                                                    <td>
                                                      {orders && orders.price}{" "}
                                                      {orders &&
                                                        orders.secondCurrnecy}
                                                    </td>
                                                    <td>
                                                      <p>
                                                        <small className="availe_small">
                                                          Available
                                                        </small>{" "}
                                                        {orders &&
                                                          orders.totalAmount}{" "}
                                                        {orders &&
                                                          orders.firstCurrency}
                                                      </p>
                                                    </td>
                                                    <td>
                                                      <p className="paymet-mode">
                                                        {orders &&
                                                          orders.paymentMethod}
                                                      </p>
                                                    </td>
                                                    {loginTrue == true ? (
                                                      profileDatasref.current &&
                                                      profileDatasref.current._id.toString() ==
                                                        orders.userId.toString() ? (
                                                        <td>
                                                          <Link
                                                            to={`/p2p/chat/${orders.orderId}`}
                                                          >
                                                            <Button className="trade-btn green">
                                                              {" "}
                                                              View{" "}
                                                            </Button>{" "}
                                                          </Link>
                                                        </td>
                                                      ) : (
                                                        <td>
                                                          <Link
                                                            to={`/p2p/chat/${orders.orderId}`}
                                                          >
                                                            <Button className="trade-btn green">
                                                              {" "}
                                                              {orders &&
                                                              orders.orderType ==
                                                                "buy"
                                                                ? "sell"
                                                                : "buy"}{" "}
                                                            </Button>{" "}
                                                          </Link>
                                                        </td>
                                                      )
                                                    ) : (
                                                      <td>
                                                        <Link to={"/login"}>
                                                          <Button className="trade-btn green">
                                                            {" "}
                                                            {orders &&
                                                            orders.orderType ==
                                                              "buy"
                                                              ? "sell"
                                                              : "buy"}{" "}
                                                          </Button>
                                                        </Link>
                                                      </td>
                                                    )}
                                                  </tr>
                                                ) : (
                                                  ""
                                                );
                                              }
                                            )}
                                        </tbody>
                                        {/* ) : (
                                     <tbody>
                                      <tr>
                                        <td colspan="5">
                                          No Orders Found
                                        </td>
                                      </tr>
                                     </tbody>
                                   )} */}
                                      </table>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  id={`SellT${item.currencySymbol}`}
                                  class="tab-pane fade in"
                                >
                                  <div className="buyform_now">
                                    <div class="fixTableHead">
                                      <table>
                                        <thead>
                                          <tr>
                                            <th>Advertisers</th>
                                            <th>Price</th>
                                            <th>Limit/Available</th>
                                            <th>Payment</th>
                                            <th>Trade</th>
                                          </tr>
                                        </thead>

                                        <tbody>
                                          {/* <tr>
                                        <td>boom.chawarat</td>
                                        <td>31 BNB</td>
                                        <td>
                                          <p>
                                            <small className="availe_small">
                                              Available
                                            </small>
                                            213 BTC
                                          </p>
                                        </td>
                                        <td>
                                          <p className="paymet-mode">All Payment</p>
                                        </td>
                                        <td>
                                          <Button className="trade-btn red">
                                            Bye
                                          </Button>
                                        </td>
                                      </tr> */}

                                          {getP2POrdersref.current &&
                                            getP2POrdersref.current.map(
                                              (orders, i) => {
                                                var ordertype =
                                                  orders.orderType == "buy"
                                                    ? "sell"
                                                    : "buy";
                                                return orders.firstCurrency ==
                                                  activetabref.current &&
                                                  ordertype == "sell" ? (
                                                  <tr>
                                                    <td>{orders.username}</td>
                                                    <td>
                                                      {orders && orders.price}{" "}
                                                      {orders &&
                                                        orders.secondCurrnecy}
                                                    </td>
                                                    <td>
                                                      <p>
                                                        <small className="availe_small">
                                                          Available
                                                        </small>{" "}
                                                        {orders &&
                                                          orders.totalAmount}{" "}
                                                        {orders &&
                                                          orders.firstCurrency}
                                                      </p>
                                                    </td>
                                                    <td>
                                                      <p className="paymet-mode">
                                                        {orders &&
                                                          orders.paymentMethod}
                                                      </p>
                                                    </td>
                                                    {loginTrue == true ? (
                                                      profileDatasref.current &&
                                                      profileDatasref.current._id.toString() ==
                                                        orders.userId.toString() ? (
                                                        <td>
                                                          <Link
                                                            to={`/p2p/chat/${orders.orderId}`}
                                                          >
                                                            <Button className="trade-btn green">
                                                              {" "}
                                                              View{" "}
                                                            </Button>{" "}
                                                          </Link>
                                                        </td>
                                                      ) : (
                                                        <td>
                                                          <Link
                                                            to={`/p2p/chat/${orders.orderId}`}
                                                          >
                                                            <Button className="trade-btn green">
                                                              {" "}
                                                              {orders &&
                                                              orders.orderType ==
                                                                "buy"
                                                                ? "sell"
                                                                : "buy"}{" "}
                                                            </Button>{" "}
                                                          </Link>
                                                        </td>
                                                      )
                                                    ) : (
                                                      <td>
                                                        <Link to={"/login"}>
                                                          <Button className="trade-btn green">
                                                            {" "}
                                                            {orders &&
                                                            orders.orderType ==
                                                              "buy"
                                                              ? "sell"
                                                              : "buy"}{" "}
                                                          </Button>
                                                        </Link>
                                                      </td>
                                                    )}
                                                  </tr>
                                                ) : (
                                                  ""
                                                );
                                              }
                                            )}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      })}
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
