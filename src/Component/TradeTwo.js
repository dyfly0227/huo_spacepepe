import React, { useEffect } from "react";
import useState from "react-usestateref";
import { Button } from "@material-ui/core";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Count from "./Countdown";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import Slider, { Range } from "rc-slider";
import "rc-slider/assets/index.css";
import Header from "./Header";
import Footer from "./Footer";
import { socket } from "./context/socket";
import apiService from "../core/service/detail";
import { getMethod, postMethod } from "../core/service/common.api";
import TradingViewWidget, { Themes } from "react-tradingview-widget";
import { toast } from "react-toastify";
import {
  removeAuthToken,
  getAuthToken,
  getSocketToken,
} from "../core/lib/localStorage";
import Pagination from "react-js-pagination";
import { widget } from "../core/lib/chart/charting_library/charting_library.min";
import isEmpty from "../core/lib/isEmpty";
import { env } from "../core/service/envconfig";
import Moment from "moment";

function Home(props) {
  const options = ["one", "two", "three"];
  const [pairlist, setpairlist] = useState([]);
  const [orderbookask, setorderbookask] = useState([]);
  const [orderbookbid, setorderbookbid] = useState([]);
  const [currentlasprice, setcurrentlasprice] = useState("");
  const [searchInputlist, setsearchInputlist, searchInputlistref] = useState(
    []
  );
  const [chartPair, setchartPair] = useState("ETHUSDT");
  const [curnt_Ordertype_tab, setcurnt_Ordertype_tab, curnt_Ordertype_tabref] =
    useState("Limit");
  const [currentPair, setcurrentPair] = useState("");
  const [fromCurrency, setFromCurrenncy] = useState("");
  const [toCurrency, setToCurrenncy] = useState("");
  const [currentType, setcurrentType] = useState("buy");
  const [frombalance, setFromBalance] = useState(0);
  const [tobalance, settobalance] = useState(0);
  const [checkAuth, setcheckAuth] = useState(false);
  const [pairDetails, setpairDetails] = useState("");
  const [btntrade1, setbtntrade1] = useState("btntrade1");
  const [btntrade2, setbtntrade2] = useState("btntrade2");
  const [btntrade3, setbtntrade3] = useState("btntrade3");
  const [btntrade4, setbtntrade4] = useState("btntrade4");
  const [orderbookLoader, setorderbookLoader] = useState(false);
  const [orderbookLoaderbid, setorderbookLoaderbit] = useState(false);
  const [pairLoader, setPairLoader] = useState(false);

  const [perpage, setperpage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeOrderDatas, setActiveOders] = useState([]);
  const [tradeHistoryData, settradeHistory] = useState([]);
  // const [alltradeHistoryData, setalltradeHistory] = useState([]);
  const [cancelOrders, setcancelOrders] = useState([]);
  const [pairTickerDetails, setpairTickerDetails] = useState("");
  const [marketPrice, setmarketPrice] = useState(0);
  const [marketTrade, setmarketTrade] = useState([]);
  const [totalactive, settotalactive] = useState(0);
  const [currentPagecan, setCurrentPagecan] = useState(1);
  const [totalcan, settotalcan] = useState(0);
  const [currentPageHis, setcurrentPageHis] = useState(1);
  const [totalHist, settotalHist] = useState(0);
  const [authentication, setauthentication] = useState(false);
  const [searchpair, setsearchpair] = useState(null);
  const [currentpairs, setcurrentpairs, currentpairsref] = useState(null);
  const [allpairslist, setallpairslist, allpairslistref] = useState([]);
  const [orderloader, setorderloader, orderloaderref] = useState(false);

  const recordPerPage = 5;
  const pageRange = 5;
  const recordPerPagecan = 5;
  const pageRangecan = 5;

  const recordPerPageHist = 5;
  const pageRangeHis = 5;

  const navigate = useNavigate();

  const [theme, setTheme] = useState("Dark");
  const [afterConnect, setConnect] = useState(false);
  const [pair, setPair] = useState("ETH_USDT");
  const tvWidget = null;

  useEffect(() => {
    if (tvWidget !== null) {
      tvWidget.remove();
      tvWidget = null;
    }
    let tokenVerify = localStorage.getItem("user_token");
    if (tokenVerify != "" && tokenVerify != undefined && tokenVerify != null) {
      setauthentication(true);
    } else {
      setauthentication(false);
    }

    async function check() {
      let mecheck = await getAuthToken();
      // let tokenVerify = await localStorage.getItem("user_token");

      var callapi = false;
      if (mecheck != "" && mecheck != undefined && mecheck != null) {
        await setcheckAuth(true);
        callapi = true;
      } else {
        await setcheckAuth(false);
        callapi = false;
      }

      var urls = window.location.href;
      var fetchPair = urls.split("margin/")[1];
      if (fetchPair) {
        setcurrentPair(fetchPair);
        var fromcurr = fetchPair.split("_")[0];
        var toCurr = fetchPair.split("_")[1];
        setFromCurrenncy(fromcurr);
        setToCurrenncy(toCurr);
        getCurrpairDatas(fetchPair);
        // fetchTickerPrice(fetchPair);
        getMarketTrades(fetchPair);
        selectPair(fetchPair);
        if (callapi == true) {
          await getUserbalance(fetchPair);
          await getActiveOrders(1, fetchPair);
          await tradeHistory(1);
          getCancelOrders(1);
        } else {
        }

        setchartPair(fromcurr + toCurr);
        setPair(fromcurr + "_" + toCurr);
        get24Data(fromcurr);
        getData(fromcurr);
        allpairDatas();
      } else {
        navigate("/");
      }
      socket.connect();
    }
    check();
    // setorderbookLoaderbit(true);
    // setorderbookLoader(true);
    selectPairbyCurrency("USDT");
    socket.off("OrderBook");
    socket.off("TickerPrice");
    socket.off("TradeHistory");
    socket.on("OrderBook", async (response) => {
      var data = await response.data;
      //console.log("OrderBook====",data);
      if (data != null && data != undefined && data != "") {
        if (data.symbol) {
          setorderbookask([]);
          setorderbookbid([]);
          var orderbookbid = [];
          var orderbookask = [];
          orderbookbid = data["bids"].length == 0 ? [] : data["bids"];
          orderbookask = data["asks"].length == 0 ? [] : data["asks"];
          var askcumtotal = 0;
          for (let index = 0; index < orderbookask.length; index++) {
            var element = orderbookask[index];
            var multiply = element[0] * element[1];
            askcumtotal = parseFloat(askcumtotal) + parseFloat(multiply);
            orderbookask[index]["percent"] = (multiply / askcumtotal) * 100;
          }
          var bidcumtotal = 0;
          for (let index = 0; index < orderbookbid.length; index++) {
            var element = orderbookbid[index];
            var multiply = element[0] * element[1];
            bidcumtotal = parseFloat(bidcumtotal) + parseFloat(multiply);
            orderbookbid[index]["percent"] = (multiply / bidcumtotal) * 100;
          }
          //setorderbookLoader(false);
          setorderbookask(
            orderbookask.sort(function (a, b) {
              return b[0] - a[0];
            })
          );
          //setorderbookLoaderbit(false);
          setorderbookbid(
            orderbookbid.sort(function (a, b) {
              return b[0] - a[0];
            })
          );
        }
      }
    });
    socket.on("TickerPrice", async (response) => {
      if (response.data) {
        var tickerdetail = response.data;
        //console.log("tickerdetail====",tickerdetail);
        setpairTickerDetails(tickerdetail);
        setmarketPrice(
          tickerdetail.lastprice.lastprice
            ? parseFloat(tickerdetail.lastprice.lastprice).toFixed(4)
            : 0.0
        );
        if (curnt_Ordertype_tabref.current == "Stop") {
          formValue.price = "";
          formValue.stop_price = tickerdetail.lastprice.lastprice
            ? parseFloat(tickerdetail.lastprice.lastprice).toFixed(4)
            : 0.0;
          //formValue.stop_price = "";
        } else {
          formValue.price = tickerdetail.lastprice.lastprice
            ? parseFloat(tickerdetail.lastprice.lastprice).toFixed(4)
            : 0.0;
        }
      }
    });
    socket.on("TradeHistory", async (response) => {
      var tickerdetail = response.data;
      if (tickerdetail !== null) {
        setmarketTrade(tickerdetail);
      }
    });
    let token_socket = localStorage.getItem("socket_token");
    if (token_socket) {
      let socketToken = token_socket.split("_")[0];
      socket.on("userDetails" + socketToken, async (response) => {
        console.log("emit response pair==", response);
        if (currentPair !== "") {
          console.log("call 1");
          console.log("call currentPair", currentPair);
          getActiveOrders(1, currentPair);
          getUserbalance(currentPair);
          tradeHistory(1);
          getCancelOrders(1);
        } else {
          console.log("call 2");
          var urls = window.location.href;
          var fetchPair = urls.split("trade/")[1];
          console.log("call fetchPair", fetchPair);
          if (fetchPair) {
            setcurrentPair(fetchPair);
            getActiveOrders(1, fetchPair);
            getUserbalance(fetchPair);
            tradeHistory(1);
            getCancelOrders(1);
          }
        }
      });
      socket.on("cancelOrder" + socketToken, async (response) => {
        //toast.success("Your order cancelled by admin, Please try again later");
        if (currentPair !== "") {
          console.log("call 1");
          console.log("call currentPair", currentPair);
          getActiveOrders(1, currentPair);
          getUserbalance(currentPair);
          tradeHistory(1);
          getCancelOrders(1);
        } else {
          console.log("call 2");
          var urls = window.location.href;
          var fetchPair = urls.split("trade/")[1];
          console.log("call fetchPair", fetchPair);
          if (fetchPair) {
            setcurrentPair(fetchPair);
            getActiveOrders(1, fetchPair);
            getUserbalance(fetchPair);
            tradeHistory(1);
            getCancelOrders(1);
          }
        }
      });
    }
  }, [socket]);

  useEffect(() => {
    fetchTheme();
    return () => {
      socket.disconnect();
    };
  }, []);

  const selectPair = async (pair) => {
    var replace_string = pair.replace("_", "");
    var changelower = replace_string.toLowerCase();
    socket.emit("GetOrderBook", { symbol: changelower });
    setchartPair(replace_string);
    setPair(pair);
    var themevalue =
      localStorage.getItem("theme") == "light" ? "White" : "Dark";
    buildchart(themevalue, pair);
  };

  const getCurrpairDatas = async (pair) => {
    var data = {
      apiUrl: apiService.getCurrpairData,
      payload: { pair: pair },
    };
    var fetchticker = await postMethod(data);
    if (fetchticker) {
      setpairDetails(fetchticker.data);
    }
  };

  const selectPairbyCurrency = async (curr) => {
    socket.off("DashTickerPrice");
    socket.emit("GetTickerPrice", "getall");
    var data = {
      apiUrl: apiService.pairbycurrency,
      payload: { currency: curr },
    };
    setPairLoader(true);
    var pairdetail = await postMethod(data);

    if (pairdetail) {
      // setPairLoader(false);
      socket.on("DashTickerPrice", async (response) => {
        var tickarr = await response.data;
        for (let index = 0; index < pairdetail.data.length; index++) {
          const element = pairdetail.data[index];
          var replace_string = element.pair.replace("_", "");
          var changelower = replace_string.toLowerCase();
          if (tickarr[changelower]) {
            var tickobj = JSON.parse(tickarr[changelower]);
            if (tickarr) {
              if (element.pair == tickobj.pair) {
                pairdetail.data[index]["price_change"] =
                  (await tickobj.change_percent)
                    ? parseFloat(tickobj.change_percent).toFixed(4)
                    : 0.0;
                pairdetail.data[index]["lastprice"] = (await tickobj.lastprice
                  .lastprice)
                  ? parseFloat(tickobj.lastprice.lastprice).toFixed(4)
                  : 0.0;
              }
            }
          }
        }
      });

      await setsearchInputlist(pairdetail.data);
      setPairLoader(false);
      if (searchpair != null) {
        setpairlist(
          searchInputlistref.current.filter(function (tag) {
            if (
              tag.liquidity_name
                .toLowerCase()
                .indexOf(searchpair.toLowerCase()) >= 0 ||
              tag.liquidity_name
                .toLowerCase()
                .indexOf(searchpair.toLowerCase()) >= 0
            ) {
              return tag;
            }
          })
        );
      } else {
        await setpairlist(pairdetail.data);
        await setsearchInputlist(pairdetail.data);
        setPairLoader(false);
      }
    }
  };

  async function handleInputChange(event) {}

  //------trade forms--------//

  const type_Ordertab_change = async (orderType) => {};

  const pairChange = async (pair) => {};

  const type_tab_change = async (type) => {};

  const getUserbalance = async (pair) => {};

  const trClick = (val) => {
    navigate("/margin/" + val + "_USDT");
    window.history.go(0);
  };

  const pair_change = async () => {};

  const allpairDatas = async () => {};

  const initialFormValue = {
    price: "",
    amount: "",
    total: "",
    stop_price: "",
  };
  const [formValue, setFormValue] = useState(initialFormValue);
  const [loader, setLoader] = useState();

  const { price, amount, total, stop_price } = formValue;

  const handleChange = (e) => {};

  const orderPlace = async (ordertype, ordertab) => {};

  const buy_sell_percentage = (percentage) => {};

  const getActiveOrders = async (pages, getpair) => {};

  const tradeHistory = async (pages) => {};

  const getCancelOrders = async (pages) => {};

  //========FETCH TICKER PRICE ==========//

  const fetchTickerPrice = async (pair) => {};

  // ================FETCH MARKET =============//

  const getMarketTrades = async (pair) => {};
  const activePageChange = (pageNumber) => {};

  const cancelPageChange = (pageNumber) => {};

  const orderhistoryactive = (pageNumber) => {};

  const orderCancel = async (cancelDatas) => {};

  const callCancelOrder = async () => {};

  const clickMarketTrade = async () => {};

  const callOrdehistory = async () => {};

  const initChart = (val) => {
    new window.TradingView.widget({
      width: "100%",
      height: "100%",
      autosize: true,
      symbol: `BINANCE:${val}USDT`,
      interval: "D",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      toolbar_bg: "#f1f3f6",
      enable_publishing: false,
      allow_symbol_change: true,
      container_id: "tv_chart_container1",
    });
  };
  const buildchart = (theme, pair) => {
    initChart(pair.replace("_USDT", ""));
  };

  const [datas, setDatas] = useState([]);
  const [redWidth, setRedWidth] = useState(0);
  const [greenWidth, setGreenWidth] = useState(0);
  const [curPrice, setPrice] = useState(0);
  const [dynamicClass, setClass] = useState("white");

  const getData = async () => {
    const pathname = window.location.pathname;
    const val = pathname.replace("/margin/", "").replace("_USDT", "");
    const symbol = val + "USDT";
    const response = await fetch(
      "https://api.binance.com/api/v3/depth?limit=50&symbol=" + symbol
    );
    const jsonData = await response.json();
    setDatas(jsonData.asks);
    const price = parseFloat(jsonData["asks"][10][0]);
    if (curPrice !== 0) {
      if (curPrice > price) {
        setClass("green");
      } else if (curPrice === price) {
        setClass("white");
      } else {
        setClass("red");
      }
    }
    setPrice(price);
    setRedWidth(Math.floor(Math.random() * 100));
    setGreenWidth(Math.floor(Math.random() * 100));
    setTimeout(() => {
      getData(pair.replace("_USDT", ""));
    }, 1000);
  };
  const [tweentyData, setTweentyData] = useState({});
  const get24Data = async (val) => {
    const symbol = val + "USDT";
    const response = await fetch(
      "https://api.binance.com/api/v3/ticker/24hr?symbol=" + symbol
    );
    const jsonData = await response.json();
    setTweentyData(jsonData);
  };

  // useEffect(() => {
  //   get24Data(pair.replace("_USDT", ""));
  //   const timer = setInterval(() => {
  //     getData(pair.replace("_USDT", ""));
  //   }, 1500);
  //   return () => {
  //     clearInterval(timer);
  //   };
  // });

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
        setConnect(true);
        document.querySelectorAll(".login-in-continue").forEach((item) => {
          item.innerText = "To The Space";
        });
      });
  };
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
  const fetchTheme = () => {};

  const pairDatas = [
    {
      pair: "BTC",
      price: "26,864.79",
      change: "-1.90",
    },
    {
      pair: "ETH",
      price: "1,806.90",
      change: "-0.8O",
    },
    {
      pair: "PEPE",
      price: "0.00000153",
      change: "-3.80",
    },
    {
      pair: "XRP",
      price: "0.4612",
      change: "+1.82",
    },
    {
      pair: "LTC",
      price: "91.99",
      change: "+2.90",
    },
    {
      pair: "ARB",
      price: "1.1657",
      change: "-0.8O",
    },
    {
      pair: "EDU",
      price: "1.13795",
      change: "-5.22",
    },
    {
      pair: "SUI",
      price: "1.1360",
      change: "+2.38",
    },
    {
      pair: "OP",
      price: "1.702",
      change: "+0.07",
    },
    {
      pair: "DOGE",
      price: "0.07370",
      change: "-0.53",
    },
  ];

  return (
    <div className="">
      <main className="main-content tradepage-bg tradeee">
        {/* <Header /> */}
        <div className="container">
          <div className="row">
            <div className="col-lg-12 trade-colpading trade-colpadingheader">
              <div className="market_palace trade_chart222">
                <div className="price_section">
                  <div className="">
                    <div className="dropdown class_pair_table">
                      <div className="dropdown show">
                        {/* <a
                          class="btn btn-secondary dropdown-toggle"
                          href="#"
                          role="button"
                          id="dropdownMenuLink"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                        </a> */}
                        <button>{currentPair}</button>

                        {/* <div
                          class="dropdown-menu"
                          aria-labelledby="dropdownMenuLink"
                        >
                          <div className="">
                            <div className="search_option">
                              <input
                                type="text"
                                placeholder="Search Pair"
                                onChange={handleInputChange}
                              />
                              <i className="bi bi-search"></i>
                            </div>
                          </div>
                          <div>
                            <div class="fixTableHead w-100">
                              <table>
                                <thead>
                                  <tr>
                                    <th class="text-left">Pair</th>
                                    <th>Last price</th>
                                    <th>Change</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>
                                      <span class="img_pair">BTC_SHIB</span>
                                    </td>
                                    <td>
                                      <span class="text-green">+2%</span>
                                    </td>
                                    <td>
                                      <span class="text-red">+0%</span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div> */}
                      </div>
                    </div>
                  </div>
                  <div className="text_red">
                    {/* {" "}
                    {isNaN(marketPrice)
                      ? ""
                      : parseFloat(marketPrice).toFixed(
                          pairDetails.price_decimal
                        )}{" "} */}
                  </div>
                </div>
                <div className="market_price_secrtiom">
                  <div className="trade_header_11 d-flex justify-between">
                    <div>
                      <div>
                        <span>
                          <i className="bi bi-clock"></i>
                          24h change
                        </span>
                        {parseFloat(tweentyData.priceChange) < 0 ? (
                          <h5 className="pink_text col-red">
                            {parseFloat(tweentyData.priceChange).toFixed(2)}%
                          </h5>
                        ) : (
                          <h5 className="pink_text col-green">
                            {parseFloat(tweentyData.priceChange).toFixed(2)}%
                          </h5>
                        )}
                      </div>
                      <div>
                        <span>
                          <i className="bi bi-arrow-up-short"></i>
                          24h high
                        </span>
                        <h5 className="pink_text">{tweentyData.highPrice}</h5>
                      </div>
                      <div>
                        <span>
                          <i className="bi bi-arrow-down-short"></i>
                          24h low
                        </span>
                        <h5 className="pink_text">{tweentyData.lowPrice}</h5>
                      </div>
                      <div>
                        <span>
                          <i className="bi bi-bar-chart-line"></i>
                          24h volume
                        </span>
                        <h5 className="pink_text">{tweentyData.volume}</h5>
                      </div>
                    </div>
                    <div className="float-right">
                      <div className="search_option">
                        {/* <input type="text" placeholder="search" onChange={()=>search()}/> */}
                        <input
                          type="text"
                          placeholder="Search Pair"
                          onChange={handleInputChange}
                        />
                        <i
                          className="bi bi-search"
                          onClick={() => pair_change()}
                        ></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6 trade-colpading d-flex w-100">
              <div className="chart card_light w-100">
                {/* <TradingViewWidget
              symbol={"BINANCE:"+chartPair}
              theme={Themes.DARK}
              locale="fr"
              width = "630"
              height = "374"
            /> */}
                <div id="tv_chart_container1"></div>
                {/* <img
                  src={require("../img/Chart.png")}
                  className="chartaaa darktheme"
                />
                <img
                  src={require("../img/Chartwhiat.png")}
                  className="chartaaa lighttheme"
                /> */}
              </div>
            </div>
            <div className="col-lg-2 trade-colpading d-flex">
              <div className="order-table card_light">
                <ul className="nav nav-pills">
                  <li className="active">
                    <a>Order Book</a>
                  </li>
                </ul>
                <div className="tab-content">
                  {/* //=================ORDERBOOK START=======================// */}
                  <div class="order-cols">
                    <ul>
                      <li>Price(USDT)</li>
                      <li>Size({pair.replace("_USDT", "")})</li>
                    </ul>
                  </div>
                  {datas.slice(0, 8).map((item) => {
                    return (
                      <div class="order-cols">
                        <div
                          class="back-red"
                          style={{ width: Math.random() * redWidth + "%" }}
                        ></div>
                        <ul>
                          <li style={{ color: "rgb(246, 70, 93)" }}>
                            {item[0]}
                          </li>
                          <li style={{ color: "rgb(183, 189, 198)" }}>
                            {parseFloat(item[1]).toFixed(3)}
                          </li>
                        </ul>
                      </div>
                    );
                  })}
                  <div className={dynamicClass + " current-price"}>
                    {curPrice}
                  </div>
                  {datas.slice(8, 16).map((item) => {
                    return (
                      <div class="order-cols">
                        <div
                          class="back-green"
                          style={{ width: Math.random() * redWidth + "%" }}
                        ></div>
                        <ul>
                          <li style={{ color: "rgb(246, 70, 93)" }}>
                            {item[0]}
                          </li>
                          <li style={{ color: "rgb(183, 189, 198)" }}>
                            {parseFloat(item[1]).toFixed(3)}
                          </li>
                        </ul>
                      </div>
                    );
                  })}
                  <ul className="nav nav-pills">
                    <li className="active">
                      <a>Trades</a>
                    </li>
                  </ul>
                  {/* //=================ORDERBOOK ENDS=======================// */}
                  {/* //=================MARKET TRADES=======================// */}
                  <div>
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col">Price</th>
                          <th scope="col">Size</th>
                          <th scope="col">Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {marketTrade && marketTrade.length > 0 ? (
                          marketTrade.map((item, i) => {
                            return (
                              <tr className="position_rel_over">
                                {item.type == "buy" ? (
                                  <td>
                                    <span className="color-green">
                                      {" "}
                                      {item.price}{" "}
                                    </span>
                                  </td>
                                ) : (
                                  <td>
                                    <span className="red-green">
                                      {" "}
                                      {item.price}{" "}
                                    </span>
                                  </td>
                                )}
                                <td>{item.amount} </td>
                                <td>{item.time} </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            {" "}
                            {checkAuth ? (
                              <td colSpan="3"> No found market trades!</td>
                            ) : (
                              <td colSpan="3">
                                <Button className="btn btn-primary-alta connectBtn">
                                  <a
                                    onClick={connect}
                                    className="login-in-continue"
                                  >
                                    Login to continue
                                  </a>
                                </Button>{" "}
                              </td>
                            )}{" "}
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  {/* //=================MARKET TRADES END=======================// */}
                </div>
              </div>
            </div>
            <div className="col-lg-2 trade-colpading d-flex">
              <div className="formplac card_light card_light-w">
                {/* <ul className="nav nav-tabs cl_odere_ee">
                  <li className="active">
                    <a
                      data-toggle="tab"
                      href="#home"
                      className="active"
                      onClick={() => type_Ordertab_change("Limit")}
                    >
                      Limit
                    </a>
                  </li>
                  <li>
                    <a
                      data-toggle="tab"
                      href="#menu1"
                      onClick={() => type_Ordertab_change("Market")}
                    >
                      Market
                    </a>
                  </li>

                  <li>
                    <a
                      data-toggle="tab"
                      href="#menu2"
                      onClick={() => type_Ordertab_change("Stop")}
                    >
                      Stop Limit
                    </a>
                  </li>
                </ul> */}
                <div className="tab-content">
                  {/* ===========LIMIT=================== */}

                  <div
                    id="home"
                    class={`${
                      curnt_Ordertype_tabref.current == "Limit"
                        ? "tab-pane fade in active show"
                        : "tab-pane fade"
                    }`}
                  >
                    <div className="buysellform">
                      <ul className="nav nav-pills">
                        <li className="active">
                          <a
                            data-toggle="pill"
                            href="#buy"
                            className="active"
                            onClick={() => type_tab_change("buy")}
                          >
                            Long
                          </a>
                        </li>
                        <li>
                          <a
                            data-toggle="pill"
                            href="#sell"
                            onClick={() => type_tab_change("sell")}
                          >
                            Short
                          </a>
                        </li>
                      </ul>

                      <div className="tab-content">
                        <div id="buy" className="tab-pane fade in active show">
                          <div className="foem_section">
                            <div className="foem_group">
                              <p className="text-primary">
                                {" "}
                                Balance : {parseFloat(tobalance).toFixed(
                                  4
                                )}{" "}
                                {toCurrency}{" "}
                              </p>
                              <div className="form-group">
                                <input
                                  type="number"
                                  className="form-control"
                                  placeholder="Price"
                                  name="price"
                                  value={price}
                                  onChange={handleChange}
                                />
                                <span className="currency"> {toCurrency} </span>
                              </div>
                              {/* <p className="text-primary">
                                {" "}
                                Balance : {parseFloat(tobalance).toFixed(
                                  4
                                )}{" "}
                                {toCurrency}{" "}
                              </p> */}
                              <div className="form-group">
                                <input
                                  type="number"
                                  className="form-control"
                                  placeholder="Amount"
                                  name="amount"
                                  value={amount}
                                  onChange={handleChange}
                                />

                                <span className="currency">
                                  {" "}
                                  {fromCurrency}{" "}
                                </span>
                              </div>
                              {checkAuth ? (
                                <div className=" pading-rr">
                                  <div className="range_btn">
                                    <Button
                                      onClick={() => buy_sell_percentage("25")}
                                      className={btntrade1}
                                    >
                                      25%
                                    </Button>
                                    <Button
                                      onClick={() => buy_sell_percentage("50")}
                                      className={btntrade2}
                                    >
                                      50%
                                    </Button>
                                    <Button
                                      onClick={() => buy_sell_percentage("75")}
                                      className={btntrade3}
                                    >
                                      75%
                                    </Button>
                                    <Button
                                      onClick={() => buy_sell_percentage("100")}
                                      className={btntrade4}
                                    >
                                      100%
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                ""
                              )}

                              <div className="form-group">
                                <input
                                  type="number"
                                  className="form-control"
                                  placeholder="Total"
                                  value={total}
                                />
                                <span className="currency"> {toCurrency} </span>
                              </div>
                              <div className="form-group border-none">
                                {!checkAuth ? (
                                  <Button className="btn btn-primary-alta connectBtn ">
                                    <a
                                      onClick={connect}
                                      className="login-in-continue"
                                    >
                                      Login to continue
                                    </a>
                                  </Button>
                                ) : orderloaderref.current ? (
                                  <Button className="btn btn-primary-alta connectBtn">
                                    Loading
                                  </Button>
                                ) : (
                                  <Button
                                    className="btn btn-primary-alta connectBtn"
                                    onClick={() => orderPlace("Limit", "buy")}
                                  >
                                    {currentType}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div id="sell" className="tab-pane fade in">
                          <div className="foem_section">
                            <div className="foem_group">
                              <p className="text-primary">
                                {" "}
                                Balance : {parseFloat(frombalance).toFixed(
                                  4
                                )}{" "}
                                {fromCurrency}{" "}
                              </p>

                              <div className="form-group">
                                <input
                                  type="number"
                                  className="form-control"
                                  placeholder="Price"
                                  name="price"
                                  value={price}
                                  onChange={handleChange}
                                />
                                <span className="currency"> {toCurrency} </span>
                              </div>
                              {/* <p className="text-primary">
                                {" "}
                                Balance : {parseFloat(frombalance).toFixed(
                                  4
                                )}{" "}
                                {fromCurrency}{" "}
                              </p> */}

                              <div className="form-group">
                                <input
                                  type="number"
                                  className="form-control"
                                  placeholder="Amount"
                                  name="amount"
                                  value={amount}
                                  onChange={handleChange}
                                />
                                <span className="currency">
                                  {" "}
                                  {fromCurrency}{" "}
                                </span>
                              </div>

                              {checkAuth ? (
                                <div className="pading-rr">
                                  <div className="range_btn">
                                    <Button
                                      onClick={() => buy_sell_percentage("25")}
                                      className={btntrade1}
                                    >
                                      25%
                                    </Button>
                                    <Button
                                      onClick={() => buy_sell_percentage("50")}
                                      className={btntrade2}
                                    >
                                      50%
                                    </Button>
                                    <Button
                                      onClick={() => buy_sell_percentage("75")}
                                      className={btntrade3}
                                    >
                                      75%
                                    </Button>
                                    <Button
                                      onClick={() => buy_sell_percentage("100")}
                                      className={btntrade4}
                                    >
                                      100%
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                ""
                              )}
                              <div className="form-group">
                                <input
                                  type="number"
                                  className="form-control"
                                  placeholder="Total"
                                  value={total}
                                />
                                <span className="currency"> {toCurrency} </span>
                              </div>
                              <div className="form-group border-none">
                                {!checkAuth ? (
                                  <Button className="btn btn-primary-alta connectBtn">
                                    <a
                                      onClick={connect}
                                      className="login-in-continue"
                                    >
                                      Login to continue
                                    </a>
                                  </Button>
                                ) : orderloaderref.current ? (
                                  <Button className="btn btn-primary-alta connectBtn">
                                    Loading
                                  </Button>
                                ) : (
                                  <Button
                                    className="btn btn-primary-alta connectBtn"
                                    onClick={() => orderPlace("Limit", "sell")}
                                  >
                                    {currentType}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* ============MARKET================== */}

                  <div
                    id="menu1"
                    class={`${
                      curnt_Ordertype_tabref.current == "Market"
                        ? "tab-pane fade in active show"
                        : "tab-pane fade"
                    }`}
                  >
                    <div className="buysellform">
                      <ul className="nav nav-pills">
                        <li className="active">
                          <a
                            data-toggle="pill"
                            href="#buys"
                            className="active"
                            onClick={() => type_tab_change("buy")}
                          >
                            Buy
                          </a>
                        </li>
                        <li>
                          <a
                            data-toggle="pill"
                            href="#sells"
                            onClick={() => type_tab_change("sell")}
                          >
                            Sell
                          </a>
                        </li>
                      </ul>
                      <div className="tab-content">
                        <div id="buys" className="tab-pane fade in active show">
                          <div className="foem_section">
                            <div className="foem_group">
                              <p className="text-primary">
                                {" "}
                                Balance : {parseFloat(tobalance).toFixed(
                                  4
                                )}{" "}
                                {toCurrency}{" "}
                              </p>
                              <div className="form-group">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Price"
                                  value={marketPrice}
                                  name="price"
                                  disabled
                                />
                                <span className="currency"> {toCurrency} </span>
                              </div>
                              {/* 
                              <p className="text-primary">
                                {" "}
                                Balance : {parseFloat(tobalance).toFixed(
                                  4
                                )}{" "}
                                {toCurrency}{" "}
                              </p> */}

                              <div className="form-group">
                                <input
                                  type="number"
                                  className="form-control"
                                  placeholder="Amount"
                                  name="amount"
                                  value={amount}
                                  onChange={handleChange}
                                />
                                <span className="currency">
                                  {" "}
                                  {fromCurrency}{" "}
                                </span>
                              </div>
                              {checkAuth ? (
                                <div className="pading-rr">
                                  <div className="range_btn">
                                    <Button
                                      onClick={() => buy_sell_percentage("25")}
                                      className={btntrade1}
                                    >
                                      25%
                                    </Button>
                                    <Button
                                      onClick={() => buy_sell_percentage("50")}
                                      className={btntrade2}
                                    >
                                      50%
                                    </Button>
                                    <Button
                                      onClick={() => buy_sell_percentage("75")}
                                      className={btntrade3}
                                    >
                                      75%
                                    </Button>
                                    <Button
                                      onClick={() => buy_sell_percentage("100")}
                                      className={btntrade4}
                                    >
                                      100%
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                ""
                              )}
                              <div className="form-group">
                                <input
                                  type="number"
                                  className="form-control"
                                  placeholder="Total"
                                  value={total}
                                />
                                <span className="currency"> {toCurrency} </span>
                              </div>
                              <div className="form-group border-none">
                                {!checkAuth ? (
                                  <Button className="btn btn-primary-alta connectBtn">
                                    <a
                                      onClick={connect}
                                      className="login-in-continue"
                                    >
                                      Login to continue
                                    </a>
                                  </Button>
                                ) : orderloaderref.current ? (
                                  <Button className="btn btn-primary-alta connectBtn">
                                    Loading
                                  </Button>
                                ) : (
                                  <Button
                                    className="btn btn-primary-alta connectBtn"
                                    onClick={() => orderPlace("Market", "buy")}
                                  >
                                    {currentType}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div id="sells" className="tab-pane fade in">
                          <div className="foem_section">
                            <div className="foem_group">
                              <p className="text-primary">
                                {" "}
                                Balance : {parseFloat(frombalance).toFixed(
                                  4
                                )}{" "}
                                {fromCurrency}{" "}
                              </p>

                              <div className="form-group">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Price"
                                  value={marketPrice}
                                  name="price"
                                  disabled
                                />
                                <span className="currency"> {toCurrency} </span>
                              </div>

                              <p className="text-primary">
                                {" "}
                                Balance : {parseFloat(frombalance).toFixed(
                                  4
                                )}{" "}
                                {fromCurrency}{" "}
                              </p>

                              <div className="form-group">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Amount"
                                  name="amount"
                                  value={amount}
                                  onChange={handleChange}
                                />
                                <span className="currency">
                                  {" "}
                                  {fromCurrency}{" "}
                                </span>
                              </div>
                              {checkAuth ? (
                                <div className="pading-rr">
                                  <div className="range_btn">
                                    <Button
                                      onClick={() => buy_sell_percentage("25")}
                                      className={btntrade1}
                                    >
                                      25%
                                    </Button>
                                    <Button
                                      onClick={() => buy_sell_percentage("50")}
                                      className={btntrade2}
                                    >
                                      50%
                                    </Button>
                                    <Button
                                      onClick={() => buy_sell_percentage("75")}
                                      className={btntrade3}
                                    >
                                      75%
                                    </Button>
                                    <Button
                                      onClick={() => buy_sell_percentage("100")}
                                      className={btntrade4}
                                    >
                                      100%
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                ""
                              )}
                              <div className="form-group">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Total"
                                  value={total}
                                />
                                <span className="currency"> {toCurrency} </span>
                              </div>
                              <div className="form-group border-none">
                                {!checkAuth ? (
                                  <Button className="btn btn-primary-alta connectBtn">
                                    <a
                                      onClick={connect}
                                      className="login-in-continue"
                                    >
                                      Login to continue
                                    </a>
                                  </Button>
                                ) : orderloaderref.current ? (
                                  <Button className="btn btn-primary-alta connectBtn">
                                    Loading
                                  </Button>
                                ) : (
                                  <Button
                                    className="btn btn-primary-alta connectBtn"
                                    onClick={() => orderPlace("Market", "sell")}
                                  >
                                    {currentType}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ============STOP================== */}

                  <div
                    id="menu2"
                    className="tab-pane fade"
                    class={`${
                      curnt_Ordertype_tabref.current == "Stop"
                        ? "tab-pane fade in active show"
                        : "tab-pane fade"
                    }`}
                  >
                    <div className="buysellform">
                      <ul className="nav nav-pills">
                        <li className="active">
                          <a
                            data-toggle="pill"
                            href="#stopbuy"
                            className="active"
                            onClick={() => type_tab_change("buy")}
                          >
                            Buy
                          </a>
                        </li>
                        <li>
                          <a
                            data-toggle="pill"
                            href="#stopsell"
                            onClick={() => type_tab_change("sell")}
                          >
                            Sell
                          </a>
                        </li>
                      </ul>
                      <div className="tab-content">
                        <div
                          id="stopbuy"
                          className="tab-pane fade in active show "
                        >
                          <div className="foem_section">
                            <div className="foem_group">
                              <p className="text-primary">
                                {" "}
                                Balance : {parseFloat(tobalance).toFixed(
                                  4
                                )}{" "}
                                {toCurrency}{" "}
                              </p>
                              <div className="form-group">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Limit"
                                  value={stop_price}
                                  name="stop_price"
                                  onChange={handleChange}
                                />
                                <span className="currency"> {toCurrency} </span>
                              </div>

                              <div className="form-group">
                                <input
                                  type="number"
                                  className="form-control"
                                  placeholder="Stop"
                                  value={price}
                                  name="price"
                                  onChange={handleChange}
                                />
                                <span className="currency"> {toCurrency} </span>
                              </div>

                              <div className="form-group">
                                <input
                                  type="number"
                                  className="form-control"
                                  placeholder="Amount"
                                  name="amount"
                                  value={amount}
                                  onChange={handleChange}
                                />
                                <span className="currency">
                                  {" "}
                                  {fromCurrency}{" "}
                                </span>
                              </div>

                              {checkAuth ? (
                                <div className="pading-rr">
                                  <div className="range_btn">
                                    <Button
                                      onClick={() => buy_sell_percentage("25")}
                                      className={btntrade1}
                                    >
                                      25%
                                    </Button>
                                    <Button
                                      onClick={() => buy_sell_percentage("50")}
                                      className={btntrade2}
                                    >
                                      50%
                                    </Button>
                                    <Button
                                      onClick={() => buy_sell_percentage("75")}
                                      className={btntrade3}
                                    >
                                      75%
                                    </Button>
                                    <Button
                                      onClick={() => buy_sell_percentage("100")}
                                      className={btntrade4}
                                    >
                                      100%
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                ""
                              )}

                              <div className="form-group">
                                <input
                                  type="number"
                                  className="form-control"
                                  placeholder="Total"
                                  value={total}
                                />
                                <span className="currency"> {toCurrency} </span>
                              </div>
                              <div className="form-group border-none">
                                {!checkAuth ? (
                                  <Button className="btn btn-primary-alta connectBtn">
                                    <a
                                      onClick={connect}
                                      className="login-in-continue"
                                    >
                                      Login to continue
                                    </a>
                                  </Button>
                                ) : orderloaderref.current ? (
                                  <Button className="btn btn-primary-alta connectBtn">
                                    Loading
                                  </Button>
                                ) : (
                                  <Button
                                    className="btn btn-primary-alta connectBtn"
                                    onClick={() => orderPlace("Stop", "buy")}
                                  >
                                    {currentType}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div id="stopsell" className="tab-pane fade in ">
                          <div className="foem_section">
                            <div className="foem_group">
                              <p className="text-primary">
                                {" "}
                                Balance : {parseFloat(frombalance).toFixed(
                                  4
                                )}{" "}
                                {fromCurrency}{" "}
                              </p>
                              <div className="form-group">
                                <input
                                  type="number"
                                  className="form-control"
                                  placeholder="Limit"
                                  value={stop_price}
                                  name="stop_price"
                                  onChange={handleChange}
                                />
                                <span className="currency"> {toCurrency} </span>
                              </div>

                              <div className="form-group">
                                <input
                                  type="number"
                                  className="form-control"
                                  placeholder="Stop"
                                  value={price}
                                  name="price"
                                  onChange={handleChange}
                                />
                                <span className="currency"> {toCurrency} </span>
                              </div>

                              <div className="form-group">
                                <input
                                  type="number"
                                  className="form-control"
                                  placeholder="Amount"
                                  name="amount"
                                  value={amount}
                                  onChange={handleChange}
                                />
                                <span className="currency">
                                  {" "}
                                  {fromCurrency}{" "}
                                </span>
                              </div>

                              {checkAuth ? (
                                <div className="pading-rr">
                                  <div className="range_btn">
                                    <Button
                                      onClick={() => buy_sell_percentage("25")}
                                      className={btntrade1}
                                    >
                                      25%
                                    </Button>
                                    <Button
                                      onClick={() => buy_sell_percentage("50")}
                                      className={btntrade2}
                                    >
                                      50%
                                    </Button>
                                    <Button
                                      onClick={() => buy_sell_percentage("75")}
                                      className={btntrade3}
                                    >
                                      75%
                                    </Button>
                                    <Button
                                      onClick={() => buy_sell_percentage("100")}
                                      className={btntrade4}
                                    >
                                      100%
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                ""
                              )}

                              <div className="form-group">
                                <input
                                  type="number"
                                  className="form-control"
                                  placeholder="Total"
                                  value={total}
                                />
                                <span className="currency"> {toCurrency} </span>
                              </div>
                              <div className="form-group border-none">
                                {!checkAuth ? (
                                  <Button className="btn btn-primary-alta connectBtn">
                                    <a
                                      onClick={connect}
                                      className="login-in-continue"
                                    >
                                      Login to continue
                                    </a>
                                  </Button>
                                ) : orderloaderref.current ? (
                                  <Button className="btn btn-primary-alta connectBtn">
                                    Loading
                                  </Button>
                                ) : (
                                  <Button
                                    className="btn btn-primary-alta connectBtn"
                                    onClick={() => orderPlace("Stop", "sell")}
                                  >
                                    {currentType}
                                  </Button>
                                )}
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
            <div className="col-lg-2 trade-colpading d-flex">
              <div className="coinpair card_light w-100">
                <div>
                  <ul className="nav nav-tabs">
                    {/* <li>
                      <a
                        data-toggle="tab"
                        href="#INR"
                        className="active"
                        onClick={() => selectPairbyCurrency("INR")}
                      >
                        INR
                      </a>
                    </li> */}
                    <li>
                      <a
                        data-toggle="tab"
                        href="#USDT"
                        onClick={() => selectPairbyCurrency("USDT")}
                        className="active"
                      >
                        USDT
                      </a>
                    </li>
                    {/* <li className="active">
                      <a
                        data-toggle="tab"
                        href="#BNB"
                        onClick={() => selectPairbyCurrency("BNB")}
                      >
                        BNB
                      </a>
                    </li> */}
                    {/* <li>
                      <a
                        data-toggle="tab"
                        href="#BTC"
                        onClick={() => selectPairbyCurrency("BTC")}
                      >
                        BTC
                      </a>
                    </li> */}
                  </ul>
                </div>
                <div className="tab-content">
                  <div id="INR" className="tab-pane fade in active show">
                    <div className="fixTableHead">
                      <table>
                        <thead>
                          <tr>
                            <th className="text-left">Pair</th>
                            {/* <th>
                              <span className="text-green">Vol</span>
                            </th> */}
                            <th className="text-right">Price</th>
                            <th className="text-right">Change</th>
                          </tr>
                        </thead>

                        <tbody>
                          {pairDatas.map((item) => {
                            return (
                              <tr onClick={trClick.bind(this, item.pair)}>
                                <td>{item.pair}</td>
                                <td>{item.price}</td>
                                <td
                                  style={{
                                    color: item.change.includes("+")
                                      ? "red"
                                      : "green",
                                  }}
                                >
                                  {item.change}%
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div id="USDT" className="tab-pane fade">
                    <div className="fixTableHead">
                      <table>
                        <thead>
                          <tr>
                            <th className="text-left">Pair</th>
                            {/* <th>
                              <span className="text-green">Vol</span>
                            </th> */}
                            <th className="text-right">Price</th>
                          </tr>
                        </thead>

                        <tbody>
                          {pairlist &&
                            pairlist.map((obj, i) => {
                              return (
                                <tr>
                                  <td colSpan="3" className="p-0">
                                    {obj.pair === pair ? (
                                      <div
                                        className="pair_section active"
                                        onClick={() => pairChange(obj)}
                                      >
                                        <img
                                          src={obj.Currency_image}
                                          className=""
                                        />
                                        <div
                                          className="first_div_sec"
                                          onClick={() => selectPair(obj.pair)}
                                        >
                                          <h2>
                                            {obj.from_symbol}/
                                            <small>{obj.to_symbol}</small>
                                          </h2>

                                          {obj.price_change <= 0 ? (
                                            <p className="red">
                                              <i class="bi bi-caret-down-fill"></i>{" "}
                                              {obj.price_change}%
                                            </p>
                                          ) : (
                                            <p className="green">
                                              <i class="bi bi-caret-up-fill"></i>{" "}
                                              {obj.price_change}%
                                            </p>
                                          )}
                                        </div>
                                        <div className="price_symbol">
                                          <small>
                                            <span class="material-symbols-outlined">
                                              {/* currency_rupee */}
                                            </span>
                                          </small>
                                          {obj.lastprice <= 0 ? (
                                            <span className="text-red">
                                              {obj.lastprice}
                                            </span>
                                          ) : (
                                            <span className="text-green">
                                              {obj.lastprice}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    ) : (
                                      <div
                                        className="pair_section"
                                        onClick={() => pairChange(obj)}
                                      >
                                        <img
                                          src={obj.Currency_image}
                                          className=""
                                        />
                                        <div
                                          className="first_div_sec"
                                          onClick={() => selectPair(obj.pair)}
                                        >
                                          <h2>
                                            {obj.from_symbol}/
                                            <small>{obj.to_symbol}</small>
                                          </h2>

                                          {obj.price_change <= 0 ? (
                                            <p className="red">
                                              <i class="bi bi-caret-down-fill"></i>{" "}
                                              {obj.price_change}%
                                            </p>
                                          ) : (
                                            <p className="green">
                                              <i class="bi bi-caret-up-fill"></i>{" "}
                                              {obj.price_change}%
                                            </p>
                                          )}
                                        </div>
                                        <div className="price_symbol">
                                          <small>
                                            <span class="material-symbols-outlined">
                                              {/* currency_rupee */}
                                            </span>
                                          </small>
                                          {obj.lastprice <= 0 ? (
                                            <span className="text-red">
                                              {obj.lastprice}
                                            </span>
                                          ) : (
                                            <span className="text-green">
                                              {obj.lastprice}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div id="TKON" className="tab-pane fade">
                    <div className="fixTableHead">
                      <table>
                        <thead>
                          <tr>
                            <th className="text-left">Pair</th>
                            {/* <th>
                              <span className="text-green">Vol</span>
                            </th> */}
                            <th className="text-right">Price</th>
                          </tr>
                        </thead>

                        <tbody>
                          {pairlist &&
                            pairlist.map((obj, i) => {
                              return (
                                <tr>
                                  <td colSpan="3" className="p-0">
                                    {obj.pair === pair ? (
                                      <div
                                        className="pair_section active"
                                        onClick={() => pairChange(obj)}
                                      >
                                        <img
                                          src={obj.Currency_image}
                                          className=""
                                        />
                                        <div
                                          className="first_div_sec"
                                          onClick={() => selectPair(obj.pair)}
                                        >
                                          <h2>
                                            {obj.from_symbol}/
                                            <small>{obj.to_symbol}</small>
                                          </h2>

                                          {obj.price_change <= 0 ? (
                                            <p className="red">
                                              <i class="bi bi-caret-down-fill"></i>{" "}
                                              {obj.price_change}%
                                            </p>
                                          ) : (
                                            <p className="green">
                                              <i class="bi bi-caret-up-fill"></i>{" "}
                                              {obj.price_change}%
                                            </p>
                                          )}
                                        </div>
                                        <div className="price_symbol">
                                          <small>
                                            <span class="material-symbols-outlined">
                                              {/* currency_rupee */}
                                            </span>
                                          </small>
                                          {obj.lastprice <= 0 ? (
                                            <span className="text-red">
                                              {obj.lastprice}
                                            </span>
                                          ) : (
                                            <span className="text-green">
                                              {obj.lastprice}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    ) : (
                                      <div
                                        className="pair_section"
                                        onClick={() => pairChange(obj)}
                                      >
                                        <img
                                          src={obj.Currency_image}
                                          className=""
                                        />
                                        <div
                                          className="first_div_sec"
                                          onClick={() => selectPair(obj.pair)}
                                        >
                                          <h2>
                                            {obj.from_symbol}/
                                            <small>{obj.to_symbol}</small>
                                          </h2>

                                          {obj.price_change <= 0 ? (
                                            <p className="red">
                                              <i class="bi bi-caret-down-fill"></i>{" "}
                                              {obj.price_change}%
                                            </p>
                                          ) : (
                                            <p className="green">
                                              <i class="bi bi-caret-up-fill"></i>{" "}
                                              {obj.price_change}%
                                            </p>
                                          )}
                                        </div>
                                        <div className="price_symbol">
                                          <small>
                                            <span class="material-symbols-outlined">
                                              {/* currency_rupee */}
                                            </span>
                                          </small>
                                          {obj.lastprice <= 0 ? (
                                            <span className="text-red">
                                              {obj.lastprice}
                                            </span>
                                          ) : (
                                            <span className="text-green">
                                              {obj.lastprice}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div id="BTC" className="tab-pane fade">
                    <div className="fixTableHead">
                      <table>
                        <thead>
                          <tr>
                            <th className="text-left">Pair</th>
                            {/* <th>
                              <span className="text-green">Vol</span>
                            </th> */}
                            <th className="text-right">Price</th>
                          </tr>
                        </thead>

                        <tbody>
                          {pairlist &&
                            pairlist.map((obj, i) => {
                              return (
                                <tr>
                                  <td colSpan="3" className="p-0">
                                    {obj.pair === pair ? (
                                      <div
                                        className="pair_section active"
                                        onClick={() => pairChange(obj)}
                                      >
                                        <img
                                          src={obj.Currency_image}
                                          className=""
                                        />
                                        <div
                                          className="first_div_sec"
                                          onClick={() => selectPair(obj.pair)}
                                        >
                                          <h2>
                                            {obj.from_symbol}/
                                            <small>{obj.to_symbol}</small>
                                          </h2>

                                          {obj.price_change <= 0 ? (
                                            <p className="red">
                                              <i class="bi bi-caret-down-fill"></i>{" "}
                                              {obj.price_change}%
                                            </p>
                                          ) : (
                                            <p className="green">
                                              <i class="bi bi-caret-up-fill"></i>{" "}
                                              {obj.price_change}%
                                            </p>
                                          )}
                                        </div>
                                        <div className="price_symbol">
                                          <small>
                                            <span class="material-symbols-outlined">
                                              {/* currency_rupee */}
                                            </span>
                                          </small>
                                          {obj.lastprice <= 0 ? (
                                            <span className="text-red">
                                              {parseFloat(
                                                obj.lastprice
                                              ).toFixed(8)}
                                            </span>
                                          ) : (
                                            <span className="text-green">
                                              {parseFloat(
                                                obj.lastprice
                                              ).toFixed(8)}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    ) : (
                                      <div
                                        className="pair_section"
                                        onClick={() => pairChange(obj)}
                                      >
                                        <img
                                          src={obj.Currency_image}
                                          className=""
                                        />
                                        <div
                                          className="first_div_sec"
                                          onClick={() => selectPair(obj.pair)}
                                        >
                                          <h2>
                                            {obj.from_symbol}/
                                            <small>{obj.to_symbol}</small>
                                          </h2>

                                          {obj.price_change <= 0 ? (
                                            <p className="red">
                                              <i class="bi bi-caret-down-fill"></i>{" "}
                                              {obj.price_change}%
                                            </p>
                                          ) : (
                                            <p className="green">
                                              <i class="bi bi-caret-up-fill"></i>{" "}
                                              {obj.price_change}%
                                            </p>
                                          )}
                                        </div>
                                        <div className="price_symbol">
                                          <small>
                                            <span class="material-symbols-outlined">
                                              {/* currency_rupee */}
                                            </span>
                                          </small>
                                          {obj.lastprice <= 0 ? (
                                            <span className="text-red">
                                              {parseFloat(
                                                obj.lastprice
                                              ).toFixed(8)}
                                            </span>
                                          ) : (
                                            <span className="text-green">
                                              {parseFloat(
                                                obj.lastprice
                                              ).toFixed(8)}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-12 trade-colpading">
              <div className="ordertabel card_light">
                <div className="title-table">
                  <ul className="nav nav-tabs">
                    <li className="active">
                      <a
                        data-toggle="tab"
                        href="#OpenOrders"
                        className="active"
                      >
                        Open Orders
                      </a>
                    </li>
                    <li>
                      <a
                        data-toggle="tab"
                        href="#OrderHistory"
                        onClick={callOrdehistory}
                      >
                        Order History
                      </a>
                    </li>
                    <li>
                      <a
                        data-toggle="tab"
                        href="#OrderBook"
                        onClick={callCancelOrder}
                      >
                        Cancel Orders
                      </a>
                    </li>
                  </ul>
                </div>
                {afterConnect ? (
                  <div className="after-connnect">
                    Available on Jun 30, 2023.
                  </div>
                ) : (
                  ""
                )}
                <div className="tab-content">
                  {/* ==========ACTIVE OREDERS========== */}
                  <div id="OpenOrders" className="tab-pane fade in active show">
                    <div className="fixTableHead">
                      <table>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Pair </th>
                            <th>Price </th>
                            <th>Side </th>
                            <th>Order Type </th>
                            <th> Amount </th>
                            <th>Total </th>
                            <th>Cancel </th>
                          </tr>
                        </thead>
                        <tbody>
                          {activeOrderDatas && activeOrderDatas.length > 0 ? (
                            activeOrderDatas.map((item, i) => {
                              var dates = Moment(item.createddate).format(
                                "DD-MM-YYYY hh:mm:ss"
                              );
                              return (
                                <tr>
                                  <td>{dates} </td>
                                  <td>{item.pairName} </td>
                                  <td>
                                    {item.tradeType == "buy" ? (
                                      <span className="text-green">
                                        {" "}
                                        {item.ordertype == "Stop"
                                          ? parseFloat(
                                              item.stoporderprice
                                            ).toFixed(4)
                                          : parseFloat(item.price).toFixed(
                                              4
                                            )}{" "}
                                      </span>
                                    ) : (
                                      <span className="text-red">
                                        {" "}
                                        {item.ordertype == "Stop"
                                          ? parseFloat(
                                              item.stoporderprice
                                            ).toFixed(4)
                                          : parseFloat(item.price).toFixed(
                                              4
                                            )}{" "}
                                      </span>
                                    )}
                                  </td>
                                  <td> {item.tradeType} </td>
                                  <td> {item.ordertype} </td>
                                  <td>
                                    {" "}
                                    {parseFloat(item.filledAmount).toFixed(
                                      4
                                    )}{" "}
                                  </td>
                                  <td>
                                    {item.ordertype == "Stop"
                                      ? parseFloat(
                                          item.filledAmount *
                                            item.stoporderprice
                                        ).toFixed(4)
                                      : parseFloat(
                                          item.filledAmount * item.price
                                        ).toFixed(4)}
                                  </td>
                                  <td>
                                    <Button
                                      className="btn btn-primary-alta connectBtn"
                                      onClick={() => orderCancel(item)}
                                    >
                                      Cancel
                                    </Button>
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              {" "}
                              {!checkAuth ? (
                                <td colSpan="10">
                                  <Button className="btn btn-primary-alta connectBtn mt-5">
                                    <a
                                      onClick={connect}
                                      className="login-in-continue"
                                    >
                                      Login to continue
                                    </a>
                                  </Button>{" "}
                                </td>
                              ) : (
                                <td colSpan="7"> No found open orders!</td>
                              )}
                            </tr>
                          )}
                        </tbody>
                      </table>
                      {!!activeOrderDatas && activeOrderDatas.length > 0 ? (
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
                  </div>

                  <div id="OrderHistory" className="tab-pane fade">
                    {/* ==========OREDERS HISTORY========== */}

                    <div className="fixTableHead">
                      <table>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Pair </th>
                            <th>Type </th>
                            <th>Price </th>
                            <th>Amount </th>
                            <th>Total </th>
                          </tr>
                        </thead>

                        <tbody>
                          {tradeHistoryData && tradeHistoryData.length > 0 ? (
                            tradeHistoryData.map((item, i) => {
                              var datesHis = Moment(item.created_at).format(
                                "DD-MM-YYYY hh:mm:ss"
                              );
                              return (
                                <tr>
                                  <td>{datesHis} </td>
                                  <td>{item.pair} </td>
                                  <td>{item.type} </td>
                                  <td>
                                    {item.type == "buy" ? (
                                      <span className="text-green">
                                        {" "}
                                        {item.askPrice}{" "}
                                      </span>
                                    ) : (
                                      <span className="text-red">
                                        {" "}
                                        {item.askPrice}{" "}
                                      </span>
                                    )}
                                  </td>
                                  <td> {item.askAmount} </td>
                                  <td>{item.total}</td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              {" "}
                              {!checkAuth ? (
                                <td colSpan="6">
                                  <Button className="btn btn-primary-alta connectBtn mt-5">
                                    <a
                                      onClick={connect}
                                      className="login-in-continue"
                                    >
                                      Login to continue
                                    </a>
                                  </Button>{" "}
                                </td>
                              ) : (
                                <td colSpan="6"> No Order history found!</td>
                              )}{" "}
                            </tr>
                          )}
                        </tbody>
                      </table>
                      {tradeHistoryData && tradeHistoryData.length > 0 ? (
                        <Pagination
                          itemClass="page-item"
                          linkClass="page-link"
                          activePage={currentPageHis}
                          itemsCountPerPage={recordPerPageHist}
                          totalItemsCount={totalHist}
                          pageRangeDisplayed={pageRangeHis}
                          onChange={orderhistoryactive}
                        />
                      ) : (
                        ""
                      )}
                    </div>
                  </div>

                  {/* ==================CANCEL ORDERS============ */}

                  <div id="OrderBook" className="tab-pane fade">
                    <div className="fixTableHead">
                      <table>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Pair</th>
                            <th>Side </th>
                            <th>Type </th>
                            <th>Price </th>
                            <th>Amount </th>
                            <th>Total </th>
                          </tr>
                        </thead>

                        <tbody>
                          {cancelOrders && cancelOrders.length > 0 ? (
                            cancelOrders.map((item, i) => {
                              var total =
                                item.ordertype == "Stop"
                                  ? +item.filledAmount * +item.stoporderprice
                                  : +item.filledAmount * +item.price;
                              return (
                                <tr>
                                  <td>{item.createddate} </td>
                                  <td>{item.pairName} </td>
                                  <td>
                                    {item.tradeType == "buy" ? (
                                      <span className="text-green"> Buy </span>
                                    ) : (
                                      <span className="text-red"> Sell </span>
                                    )}
                                  </td>
                                  <td>{item.ordertype} </td>
                                  <td>
                                    <span className="text-green">
                                      {item.ordertype == "Stop"
                                        ? parseFloat(
                                            item.stoporderprice
                                          ).toFixed(4)
                                        : parseFloat(item.price).toFixed(
                                            4
                                          )}{" "}
                                    </span>
                                  </td>
                                  <td> {item.amount} </td>
                                  <td>{parseFloat(total).toFixed(4)}</td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              {" "}
                              {!checkAuth ? (
                                <td colSpan="6">
                                  <Button className="btn btn-primary-alta connectBtn mt-5">
                                    <a
                                      onClick={connect}
                                      className="login-in-continue"
                                    >
                                      Login to continue
                                    </a>
                                  </Button>{" "}
                                </td>
                              ) : (
                                <td colSpan="6"> No Cancel order found! </td>
                              )}
                            </tr>
                          )}
                        </tbody>
                      </table>
                      {cancelOrders && cancelOrders.length > 0 ? (
                        <Pagination
                          itemClass="page-item"
                          linkClass="page-link"
                          activePage={currentPagecan}
                          itemsCountPerPage={recordPerPagecan}
                          totalItemsCount={totalcan}
                          pageRangeDisplayed={pageRangecan}
                          onChange={cancelPageChange}
                        />
                      ) : (
                        ""
                      )}
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
