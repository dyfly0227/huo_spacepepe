import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

import "rc-slider/assets/index.css";
import Header from "./Header";
import { Button } from "@material-ui/core";

import apiService from "../core/service/detail";
import { postMethod } from "../core/service/common.api";
import { getMethod } from "../core/service/common.api";
import { toast } from "react-toastify";
import { setAuthToken, getAuthToken } from "../core/lib/localStorage";
import OTPInput, { ResendOTP } from "otp-input-react";
import useState from "react-usestateref";
import { socket } from "./context/socket";

const options = ["BTC", "ETH", "BNB"];
const defaultOption = options[0];

function Home() {
  const p2pFormValue = {
    qty: "",
    total: "",
  };

  const [getP2POrders, setgetAllp2pOrders, getP2POrdersref] = useState([]);
  const [buyP2POrders, setbuyP2POrders, buyP2POrdersref] = useState([]);
  const [sellP2POrders, setsellP2POrders, sellP2POrdersref] = useState([]);
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
  const [loginTrue, setloginTrue, loginTrueref] = useState(false);

  const [p2pformValue, setp2pFormValue, p2pformValueref] =
    useState(p2pFormValue);

  const { qty, total } = p2pformValue;
  const [p2pbalance, setp2pbalance, p2pbalanceref] = useState("");
  const [p2pData, setp2pData, p2pDataref] = useState("");
  let navigate = useNavigate();

  useEffect(() => {
    getAllp2pOrders();
    getAllcurrency();
    let user_token = getAuthToken();
    console.log("user_token===", typeof user_token);
    console.log("user_token.length===", user_token.length);
    if (user_token != "" && user_token != undefined && user_token != null) {
      setloginTrue(true);
      getProfile();
      // let socket_token = localStorage.getItem("socket_token");
      // let socketsplit = socket_token.split("_");
      // socket.connect();

      // socket.off("socketResponse");
      // socket.on("socketResponse", function (res) {
      //   if (res.Reason == "ordercancel") {
      //     getAllp2pOrders();
      //   }
      // });
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
      var buy = data.filter((data) => data.orderType == "sell");
      buy.sort(function (a, b) {
        return a.price - b.price;
      });
      setbuyP2POrders(buy);
      var sell = data.filter((data) => data.orderType == "buy");
      sell.sort(function (a, b) {
        return b.price - a.price;
      });
      setsellP2POrders(sell);
    }
  };

  const getAllcurrency = async () => {
    var data = {
      apiUrl: apiService.getP2Pcurrency,
    };
    var resp = await getMethod(data);
    if (resp) {
      var currArrayCrypto = [];
      var currArrayFiat = [{ value: "all", label: "Select Currency" }];
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
        console.log("currArrayFiat=====", currArrayFiat);
      }
      var obj1 = {
        id: "All",
        currencySymbol: "All",
      };
      currArrayCrypto.push(obj1);

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

  const getp2pOrder = async (data) => {
    setp2pData(data);
    var onj = {
      fromCurrency: data.fromCurrency,
    };
    var data = {
      apiUrl: apiService.getp2pBalance,
      payload: onj,
    };
    var resp = await postMethod(data);
    console.log(resp.Message, "-=-=-resp=-=-");
    if (resp) {
      var data = resp.Message;
      setp2pbalance(resp.p2pbalance);
    }
  };

  const confirm_handleChange = async (e) => {
    console.log("e====", e);
    e.preventDefault();
    const { name, value } = e.target;
    let p2pformData = { ...p2pformValue, ...{ [name]: value } };
    setp2pFormValue(p2pformData);
    console.log("p2pformValueref.current.qty===", p2pformValueref.current.qty);
    if (p2pformValueref.current.qty > 0) {
      var order_qty = p2pformValueref.current.qty;
      var min_qty = p2pDataref.current.fromLimit;
      var max_qty = p2pDataref.current.toLimit;
      console.log("min_qty===", min_qty);
      console.log("max_qty===", max_qty);
      console.log("order_qty===", order_qty);
      if (
        order_qty < p2pDataref.current.fromLimit ||
        order_qty > p2pDataref.current.toLimit
      ) {
        toast.error(
          "Please enter quantity between " + min_qty + " and " + max_qty + ""
        );
      } else {
        p2pformValueref.current.total = parseFloat(
          order_qty * p2pDataref.current.price
        ).toFixed(2);
        console.log("p2pformData====", p2pformValueref.current);
      }
    } else {
      toast.error("Please enter valid quantity");
    }
  };

  const confirm_order_buy = async () => {
    try {
      var obj = {};
      obj.qty = p2pformValueref.current.qty;
      obj.total = p2pformValueref.current.total;
      obj.orderId = p2pDataref.current.orderId;
      obj.p2porderId = p2pDataref.current._id;
      obj.type = "buy";

      if (obj.qty != "" || obj.total != "") {
        var data = {
          apiUrl: apiService.p2p_confirm_order,
          payload: obj,
        };
        var resp = await postMethod(data);
        if (resp.status) {
          toast.success(resp.Message);
          //navigate(resp.link);
          window.location.href = resp.link;
        } else {
          toast.error(resp.Message);
        }
      } else {
        toast.error("Please enter quantity");
      }
    } catch (error) {}
  };

  const confirm_order_sell = async () => {
    try {
      var obj = {};
      obj.qty = p2pformValueref.current.qty;
      obj.total = p2pformValueref.current.total;
      obj.orderId = p2pDataref.current.orderId;
      obj.p2porderId = p2pDataref.current._id;
      obj.type = "sell";

      if (obj.qty != "" || obj.total != "") {
        var data = {
          apiUrl: apiService.p2p_confirm_sellorder,
          payload: obj,
        };
        var resp = await postMethod(data);
        if (resp.status) {
          toast.success(resp.Message);
          //navigate(resp.link);
          window.location.href = resp.link;
        } else {
          toast.error(resp.Message);
        }
      } else {
        toast.error("Please enter quantity");
      }
    } catch (error) {}
  };

  const maximum_buy = async () => {
    var order_qty =
      +p2pDataref.current.totalAmount - +p2pDataref.current.processAmount;
    console.log("order_qty====", order_qty);
    p2pformValueref.current.qty = order_qty;
    p2pformValueref.current.total = order_qty * p2pDataref.current.price;
    var obj = {
      qty: order_qty,
      total: parseFloat(order_qty * p2pDataref.current.price).toFixed(2),
    };
    setp2pFormValue(obj);
    console.log("p2pformValueref.current====", p2pformValueref.current);
  };

  const maximum_sell = async () => {
    var avail_qty =
      +p2pDataref.current.totalAmount - +p2pDataref.current.processAmount;
    var order_qty =
      avail_qty > p2pbalanceref.current ? p2pbalanceref.current : avail_qty;
    console.log("order_qty====", order_qty);
    p2pformValueref.current.qty = order_qty;
    p2pformValueref.current.total = order_qty * p2pDataref.current.price;
    var obj = {
      qty: order_qty,
      total: parseFloat(order_qty * p2pDataref.current.price).toFixed(2),
    };
    setp2pFormValue(obj);
    console.log("p2pformValueref.current====", p2pformValueref.current);
  };

  return (
    <div className="">
      <main className="main-content tradepage-bg login_body_ bg-cover ">
        {/* <Header /> */}
        <div className="container p-0 pt-0">
          <div className="p-0">
            <div className="container d-flex justify-content-center padin_zero">
              <div className="col-lg-12 pading-zeero">
                <div className="p2ppost p2plist">
                  <div className="option_new_order">
                    <a href="#">
                      <img
                        src={require("../img/newimg/process.png")}
                        className="order_eee"
                      />
                      Process Orders
                    </a>
                    <a href="#">
                      <img
                        src={require("../img/newimg/clipboard.png")}
                        className="order_eee w-22px"
                      />
                      My Orders
                    </a>
                    <a href="#">
                      <i class="fa fa-history" aria-hidden="true"></i>
                      My History
                    </a>
                    <a href="#">
                      <i class="bi bi-newspaper"></i>
                      Post New Ad
                    </a>
                  </div>

                  <ul class="nav nav-tabs">
                    <li class="active">
                      <a data-toggle="tab" href="#wanttobuy" class="active">
                        BTC
                      </a>
                    </li>
                    <li>
                      <a data-toggle="tab" href="#wanttosell">
                        PEPE
                      </a>
                    </li>
                  </ul>
                  {/* <ul class="nav nav-tabs">
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
                    
                  </ul> */}
                  <div class="tab-content">
                    <div id="wanttobuy" class="tab-pane fade in active show">
                      <div className="row">
                        <div className="col-lg-8 col-md-6 col-sm-6">
                          <div className="buy_sell_s ">
                            <ul class="nav nav-tabs primaryNav">
                              <li class="active">
                                <a
                                  data-toggle="tab"
                                  href={`#BuyTall`}
                                  class="nav-link color-green active"
                                >
                                  Buy
                                </a>
                              </li>
                              <li>
                                <a
                                  data-toggle="tab"
                                  href={`#SellTall`}
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
                              options={options}
                              placeholder="Select an option"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="tab-content">
                        <div id="BuyTall" class="tab-pane fade in active show">
                          <div class="buyform_now">
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
                                  <tr>
                                    <td>Chan</td>
                                    <td>88.08 USD</td>
                                    <td>
                                      <p>
                                        <small class="availe_small">
                                          Available
                                        </small>{" "}
                                        364.66848000000005 USDT
                                      </p>
                                    </td>
                                    <td>
                                      <p class="paymet-mode">All payments</p>
                                    </td>
                                    <td>
                                      <Button className="trade-btn green">
                                        {" "}
                                        buy
                                      </Button>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Bruce</td>
                                    <td>88.08 USD</td>
                                    <td>
                                      <p>
                                        <small class="availe_small">
                                          Available
                                        </small>{" "}
                                        364.66848000000005 USDT
                                      </p>
                                    </td>
                                    <td>
                                      <p class="paymet-mode">All payments</p>
                                    </td>
                                    <td>
                                      <Button className="trade-btn green">
                                        {" "}
                                        buy
                                      </Button>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>John</td>
                                    <td>88.08 USD</td>
                                    <td>
                                      <p>
                                        <small class="availe_small">
                                          Available
                                        </small>{" "}
                                        364.66848000000005 USDT
                                      </p>
                                    </td>
                                    <td>
                                      <p class="paymet-mode">All payments</p>
                                    </td>
                                    <td>
                                      <Button className="trade-btn green">
                                        {" "}
                                        buy
                                      </Button>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Benny</td>
                                    <td>88.08 USD</td>
                                    <td>
                                      <p>
                                        <small class="availe_small">
                                          Available
                                        </small>{" "}
                                        364.66848000000005 USDT
                                      </p>
                                    </td>
                                    <td>
                                      <p class="paymet-mode">All payments</p>
                                    </td>
                                    <td>
                                      <Button className="trade-btn green">
                                        {" "}
                                        buy
                                      </Button>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Rakesh</td>
                                    <td>88.08 USD</td>
                                    <td>
                                      <p>
                                        <small class="availe_small">
                                          Available
                                        </small>{" "}
                                        364.66848000000005 USDT
                                      </p>
                                    </td>
                                    <td>
                                      <p class="paymet-mode">All payments</p>
                                    </td>
                                    <td>
                                      <Button className="trade-btn green">
                                        {" "}
                                        buy
                                      </Button>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                        <div id="SellTall" class="tab-pane fade">
                          <div class="buyform_now">
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
                                  <tr>
                                    <td>Bailey</td>
                                    <td>88.08 USD</td>
                                    <td>
                                      <p>
                                        <small class="availe_small">
                                          Available
                                        </small>{" "}
                                        364.66848000000005 USDT
                                      </p>
                                    </td>
                                    <td>
                                      <p class="paymet-mode">All payments</p>
                                    </td>
                                    <td>
                                      <Button className="trade-btn green">
                                        {" "}
                                        buy
                                      </Button>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Forde</td>
                                    <td>88.08 USD</td>
                                    <td>
                                      <p>
                                        <small class="availe_small">
                                          Available
                                        </small>{" "}
                                        364.66848000000005 USDT
                                      </p>
                                    </td>
                                    <td>
                                      <p class="paymet-mode">All payments</p>
                                    </td>
                                    <td>
                                      <Button className="trade-btn green">
                                        {" "}
                                        buy
                                      </Button>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>McGuire</td>
                                    <td>88.08 USD</td>
                                    <td>
                                      <p>
                                        <small class="availe_small">
                                          Available
                                        </small>{" "}
                                        364.66848000000005 USDT
                                      </p>
                                    </td>
                                    <td>
                                      <p class="paymet-mode">All payments</p>
                                    </td>
                                    <td>
                                      <Button className="trade-btn green">
                                        {" "}
                                        buy
                                      </Button>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Vanover</td>
                                    <td>88.08 USD</td>
                                    <td>
                                      <p>
                                        <small class="availe_small">
                                          Available
                                        </small>{" "}
                                        364.66848000000005 USDT
                                      </p>
                                    </td>
                                    <td>
                                      <p class="paymet-mode">All payments</p>
                                    </td>
                                    <td>
                                      <Button className="trade-btn green">
                                        {" "}
                                        buy
                                      </Button>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Pendergrass</td>
                                    <td>88.08 USD</td>
                                    <td>
                                      <p>
                                        <small class="availe_small">
                                          Available
                                        </small>{" "}
                                        364.66848000000005 USDT
                                      </p>
                                    </td>
                                    <td>
                                      <p class="paymet-mode">All payments</p>
                                    </td>
                                    <td>
                                      <Button className="trade-btn green">
                                        {" "}
                                        buy
                                      </Button>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div id="wanttosell" class="tab-pane fade">
                      <div className="row">
                        <div className="col-lg-8 col-md-6 col-sm-6">
                          <div className="buy_sell_s ">
                            <ul class="nav nav-tabs primaryNav">
                              <li class="active">
                                <a
                                  data-toggle="tab"
                                  href={`#BuyTall`}
                                  class="nav-link color-green active"
                                >
                                  Buy
                                </a>
                              </li>
                              <li>
                                <a
                                  data-toggle="tab"
                                  href={`#SellTall`}
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
                              options={options}
                              placeholder="Select an option"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="tab-content">
                        <div id="BuyTall" class="tab-pane fade in active show">
                          <div class="buyform_now">
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
                                  <tr>
                                    <td>Scott</td>
                                    <td>88.08 USD</td>
                                    <td>
                                      <p>
                                        <small class="availe_small">
                                          Available
                                        </small>{" "}
                                        364.66848000000005 USDT
                                      </p>
                                    </td>
                                    <td>
                                      <p class="paymet-mode">All payments</p>
                                    </td>
                                    <td>
                                      <Button className="trade-btn green">
                                        {" "}
                                        buy
                                      </Button>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Pills</td>
                                    <td>88.08 USD</td>
                                    <td>
                                      <p>
                                        <small class="availe_small">
                                          Available
                                        </small>{" "}
                                        364.66848000000005 USDT
                                      </p>
                                    </td>
                                    <td>
                                      <p class="paymet-mode">All payments</p>
                                    </td>
                                    <td>
                                      <Button className="trade-btn green">
                                        {" "}
                                        buy
                                      </Button>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Smith</td>
                                    <td>88.08 USD</td>
                                    <td>
                                      <p>
                                        <small class="availe_small">
                                          Available
                                        </small>{" "}
                                        364.66848000000005 USDT
                                      </p>
                                    </td>
                                    <td>
                                      <p class="paymet-mode">All payments</p>
                                    </td>
                                    <td>
                                      <Button className="trade-btn green">
                                        {" "}
                                        buy
                                      </Button>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Dwayne</td>
                                    <td>88.08 USD</td>
                                    <td>
                                      <p>
                                        <small class="availe_small">
                                          Available
                                        </small>{" "}
                                        364.66848000000005 USDT
                                      </p>
                                    </td>
                                    <td>
                                      <p class="paymet-mode">All payments</p>
                                    </td>
                                    <td>
                                      <Button className="trade-btn green">
                                        {" "}
                                        buy
                                      </Button>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Mong</td>
                                    <td>88.08 USD</td>
                                    <td>
                                      <p>
                                        <small class="availe_small">
                                          Available
                                        </small>{" "}
                                        364.66848000000005 USDT
                                      </p>
                                    </td>
                                    <td>
                                      <p class="paymet-mode">All payments</p>
                                    </td>
                                    <td>
                                      <Button className="trade-btn green">
                                        {" "}
                                        buy
                                      </Button>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                        <div id="SellTall" class="tab-pane fade">
                          <div class="buyform_now">
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
                                  <tr>
                                    <td>Raghavendra</td>
                                    <td>88.08 USD</td>
                                    <td>
                                      <p>
                                        <small class="availe_small">
                                          Available
                                        </small>{" "}
                                        364.66848000000005 USDT
                                      </p>
                                    </td>
                                    <td>
                                      <p class="paymet-mode">All payments</p>
                                    </td>
                                    <td>
                                      <Button className="trade-btn red">
                                        {" "}
                                        Sell
                                      </Button>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Raghavendra</td>
                                    <td>88.08 USD</td>
                                    <td>
                                      <p>
                                        <small class="availe_small">
                                          Available
                                        </small>{" "}
                                        364.66848000000005 USDT
                                      </p>
                                    </td>
                                    <td>
                                      <p class="paymet-mode">All payments</p>
                                    </td>
                                    <td>
                                      <Button className="trade-btn red">
                                        {" "}
                                        Sell
                                      </Button>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Bruce</td>
                                    <td>88.08 USD</td>
                                    <td>
                                      <p>
                                        <small class="availe_small">
                                          Available
                                        </small>{" "}
                                        364.66848000000005 USDT
                                      </p>
                                    </td>
                                    <td>
                                      <p class="paymet-mode">All payments</p>
                                    </td>
                                    <td>
                                      <Button className="trade-btn red">
                                        {" "}
                                        Sell
                                      </Button>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Chan</td>
                                    <td>88.08 USD</td>
                                    <td>
                                      <p>
                                        <small class="availe_small">
                                          Available
                                        </small>{" "}
                                        364.66848000000005 USDT
                                      </p>
                                    </td>
                                    <td>
                                      <p class="paymet-mode">All payments</p>
                                    </td>
                                    <td>
                                      <Button className="trade-btn red">
                                        {" "}
                                        Sell
                                      </Button>
                                    </td>
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
          </div>
        </div>
      </main>

      <div id="confirm_p2p_buy" class="modal launchpad_doce fade" role="dialog">
        <div class="modal-dialog modal-dialog-centered ">
          <div class="modal-content">
            <div class="modal-body model_confirms">
              <h1> Confirm Order </h1>
              <form className="launch_card new_table  pt-5 tranbg">
                {/* <p className="balance">
                          {" "}
                          Your Wallet Balance: {(+currentBalance).toFixed(8)}
                        </p> */}
                <div className="input_section">
                  <p>
                    <span>Enter quantity to buy</span>
                  </p>
                  <div className="input_select_s newbtind">
                    <input
                      type="text"
                      name="qty"
                      value={qty}
                      onChange={confirm_handleChange}
                    />
                    <div className="select_option">
                      <Button onClick={maximum_buy}>Max</Button>
                    </div>
                  </div>
                </div>
                <div className="input_section">
                  <p>
                    <span>You Will Pay</span>
                  </p>
                  <div className="input_select_s">
                    <input
                      type="text"
                      name="total"
                      value={total}
                      onChange={confirm_handleChange}
                    />
                  </div>
                </div>
                <div className="submiot">
                  <Button data-dismiss="modal" onClick={confirm_order_buy}>
                    Confirm
                  </Button>
                </div>
              </form>
              {/* <div class="form-group">
                <label>Enter quantity to buy</label>
                <div className="input_select_s newbtind">
                  <input
                     type="text"
                     class="form-control"
                     id="exampleInputPassword1"
                     name="qty"
                     value={qty}
                     onChange={confirm_handleChange}
                  />
                  <div className="select_option">
                    <Button>Max</Button>
                  </div>
                </div>
              </div>
              <div class="form-group">
                <label>You Will Pay</label>
                <input
                  type="text"
                  class="form-control"
                  id="exampleInputPassword1"
                  name="total"
                  value={total}
                  onChange={confirm_handleChange}
                />
              </div>
            </div>
            <div class="modal-footer">
              <Button
                type="button"
                class="btn btn-default"
                data-dismiss="modal"
                onClick={confirm_order_buy}
              >
                Submit
              </Button>
            </div> */}
            </div>
          </div>
        </div>
      </div>

      <div
        id="confirm_p2p_sell"
        class="modal launchpad_doce fade"
        role="dialog"
      >
        <div class="modal-dialog modal-dialog-centered ">
          <div class="modal-content">
            <div class="modal-body model_confirms">
              <h1> Confirm Order </h1>
              <form className="launch_card new_table  pt-5 tranbg">
                <p className="balance">
                  {" "}
                  Your Wallet Balance: {(+p2pbalanceref.current).toFixed(
                    8
                  )}{" "}
                  {p2pDataref.current.firstCurrency}
                </p>
                <div className="input_section">
                  <p>
                    <span>Enter quantity to sell</span>
                  </p>
                  <div className="input_select_s newbtind">
                    <input
                      type="text"
                      name="qty"
                      value={qty}
                      onChange={confirm_handleChange}
                    />
                    <div className="select_option">
                      <Button onClick={maximum_sell}>Max</Button>
                    </div>
                  </div>
                </div>
                <div className="input_section">
                  <p>
                    <span>You Will Receive</span>
                  </p>
                  <div className="input_select_s">
                    <input
                      type="text"
                      name="total"
                      value={total}
                      onChange={confirm_handleChange}
                    />
                  </div>
                </div>
                <div className="submiot">
                  <Button data-dismiss="modal" onClick={confirm_order_sell}>
                    Confirm
                  </Button>
                </div>
              </form>
              {/* <div class="form-group">
                <label>Enter quantity to buy</label>
                <div className="input_select_s newbtind">
                  <input
                     type="text"
                     class="form-control"
                     id="exampleInputPassword1"
                     name="qty"
                     value={qty}
                     onChange={confirm_handleChange}
                  />
                  <div className="select_option">
                    <Button>Max</Button>
                  </div>
                </div>
              </div>
              <div class="form-group">
                <label>You Will Pay</label>
                <input
                  type="text"
                  class="form-control"
                  id="exampleInputPassword1"
                  name="total"
                  value={total}
                  onChange={confirm_handleChange}
                />
              </div>
            </div>
            <div class="modal-footer">
              <Button
                type="button"
                class="btn btn-default"
                data-dismiss="modal"
                onClick={confirm_order_buy}
              >
                Submit
              </Button>
            </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
