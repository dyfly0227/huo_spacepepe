import React, {useState, useEffect} from "react";
import Header from "./Header";
import Arrow from "../img/ArrowRight.svg";
import {Link, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import apiService from "../core/service/detail";
import {getMethod, postMethod} from "../core/service/common.api";
import {setAuthToken, getAuthToken} from "../core/lib/localStorage";
import {useParams} from "react-router-dom";
import {setAuthorization} from "../core/service/axios";

import "rc-slider/assets/index.css";
import Pagination from "react-js-pagination";

function Home() {
  const options = ["one", "two", "three"];

  const [perpage, setperpage] = useState(5);
  const [page, setpage] = useState(1);
  const [search, setsearch] = useState(1);
  const [balanceDetails, setbalanceDetails] = useState([]);
  const [balance_overallusdt, setbalance_overallusde] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [total, settotal] = useState(0);
  const [totalINRPrice, setToatalINRPrice] = useState(0);
  const [AvailablePrice, setAvailablePrice] = useState(0);
  const [inorderPrice, setinorderPrice] = useState(0);

  const recordPerPage = 5;

  // total number of the records
  const totalRecords = 7;

  // range of pages in paginator
  const pageRange = 5;
  const navigate = useNavigate();

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber); // call API to get data based on pageNumber
    getUserbalance(pageNumber);
  };

  const getUserbalance = async (pages) => {
    var obj = {
      perpage: perpage,
      page: pages,
      search: search,
    };

    var data = {
      apiUrl: apiService.getUserBalance,
      payload: obj,
    };
    var resp = await postMethod(data);
    if (resp.status) {
      console.log(resp.Message, "=-=-=-resp.Message=-=-=-");
      var balanceData = resp.Message;
      // var totalAmount = 0;
      // var availableAmount = 0;
      // var holdAMount = 0;
      // for(var i=0; i< balanceData.length; i++ ){
      //   totalAmount += balanceData[i].estimatedUSDTtotal;
      //   availableAmount += balanceData[i].estimatedUSDTbalance;
      //   holdAMount += balanceData[i].estimatedUSDThold;
      // }
      // console.log(totalAmount,'=-=-=-=-=totalAmount-=-=-=-totalAmount-=-=');
      // setToatalINRPrice(totalAmount);
      setbalanceDetails(resp.Message);
      setbalance_overallusde(resp.balance);

      settotal(resp.total);
      // setAvailablePrice(availableAmount);
      // setinorderPrice(holdAMount);
    } else {
    }
  };

  const getPortfolio = async () => {
    var data = {
      apiUrl: apiService.portfolioBalance,
    };
    var resp = await getMethod(data);
    if (resp.status) {
      console.log(resp.balance, "=-=-=-resp.Message=-=-=-");
      var balanceData = resp.balance;
      setToatalINRPrice(balanceData.total_balance);
      setAvailablePrice(balanceData.available_balance);
      setinorderPrice(balanceData.inorder_balance);
    } else {
    }
  };

  useEffect(() => {
    let token_socket = localStorage.getItem("user_token");
    if (!token_socket) {
      navigate("/login");
    }
    getPortfolio();
    getUserbalance(currentPage);
  }, []);

  return (
    <div className="">
      <main className="main-content tradepage-bg login_body_ bg-cover">
        <Header />
        <div class="container">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 padin_zero">
            <div class="my_fund_content">
              <div class="container">
                <div class="">
                  <div class="my_fund_sectin_ bg_card_section">
                    <div class="row">
                      <div class="col-lg-6">
                        <h1>My Funds</h1>
                      </div>
                      <div class="col-lg-6">
                        <div class="search_row">
                          {/* <div class="input_rpow">
                            <input type="text" placeholder="Search coin" />
                            <i class="fas fa-search"></i>
                          </div> */}
                          {/* <select>
                            <option value="">USD</option>
                          </select> */}
                          {/* <button class="btn btn-primary">Show Balance</button> */}
                        </div>
                      </div>
                      <div class="col-lg-12">
                        <div class="balance_section">
                          <p>Total balance</p>
                          <h3>
                            {parseFloat(totalINRPrice && totalINRPrice).toFixed(
                              2
                            )}{" "}
                            <span> INR </span>
                          </h3>
                          {/* <small>$10,098.36</small> */}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p class="title_aa">Account Balances</p>

                  <div class="row">
                    <div class="col-lg-6">
                      <div class="bg_card_section">
                        <div class="balanc_avail">
                          <p>
                            <img
                              src={require("../img/box_gray.png")}
                              className=""
                            />
                            Available Balance
                          </p>
                          <div>
                            <h5> {AvailablePrice.toFixed(2)} INR</h5>
                            {/* <span>$10,098.36</span> */}
                          </div>
                        </div>
                        <div class="button_account_bottn">
                          <button>
                            <Link to="/transaction">
                              Deposit <i class="fas fa-star"></i>
                            </Link>
                          </button>
                          {/* <button>Transfer </button> */}
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div class="bg_card_section">
                        <div class="balanc_avail">
                          <p>
                            <img
                              src={require("../img/box_gray.png")}
                              className=""
                            />
                            In Order
                          </p>
                          <div>
                            <h5>{inorderPrice.toFixed(2)} INR</h5>
                            {/* <span>$10,098.36</span> */}
                          </div>
                        </div>
                        <div class="button_account_bottn">
                          <button class="green">
                            <Link to="/transaction">View More</Link>
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* <div class="col-lg-6">
                      <div class="bg_card_section">
                        <div class="balanc_avail">
                          <p>
                            <img
                              src={require("../img/box_gray.png")}
                              className=""
                            />
                            Orders List
                          </p>
                          <div>
                            <h5>0.2785689852 BTC</h5>
                            <span>$10,098.36</span>
                          </div>
                        </div>
                        <div class="button_account_bottn">
                          <button class="green"> View More </button>
                        </div>
                      </div>
                    </div> */}
                    {/* <div class="col-lg-6">
                      <div class="bg_card_section">
                        <div class="balanc_avail">
                          <p>
                            <img
                              src={require("../img/box_gray.png")}
                              className=""
                            />
                            Orders List
                          </p>
                          <div>
                            <h5>0.2785689852 BTC</h5>
                            <span>$10,098.36</span>
                          </div>
                        </div>
                        <div class="button_account_bottn">
                          <button class="green">View More </button>
                        </div>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>

            <div class="table_section_">
              <div class="container">
                <div class="table-responsive bg_card_section">
                  <table class="table">
                    <thead>
                      <tr>
                        <th scope="col">Asset</th>
                        <th scope="col" class="text_222">
                          On orders
                        </th>
                        <th scope="col" class="text_222">
                          Available balance
                        </th>
                        <th scope="col" class="text_222">
                          Total balance
                        </th>
                        <th scope="col" class="text_222">
                          Launchpad balance
                        </th>
                        {/* <th scope="col" class="text_222">
                          P2P balance
                        </th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {balanceDetails &&
                        balanceDetails.map((item, i) => {
                          return (
                            <tr>
                              <td>
                                <div class="coin_table_ta">
                                  <img src={item.currencyImage} className="" />
                                  <div class="row_eee">
                                    <h3>{item.currencysymbol}</h3>
                                    <span>{item.currencyName}</span>
                                  </div>
                                </div>
                              </td>

                              <td>
                                <div class="row_oiu_p">
                                  <h5>
                                    {parseFloat(item.holdAmount).toFixed(8)}{" "}
                                    {item.currencysymbol}{" "}
                                  </h5>
                                  <span>
                                    {parseFloat(item.estimatedUSDThold).toFixed(
                                      2
                                    )}{" "}
                                    ₹{" "}
                                  </span>
                                </div>
                              </td>
                              <td>
                                <div class="row_oiu_p">
                                  <h5>
                                    {parseFloat(item.currencyBalance).toFixed(
                                      8
                                    )}{" "}
                                    {item.currencysymbol}
                                  </h5>
                                  <span>
                                    {parseFloat(
                                      item.estimatedUSDTbalance
                                    ).toFixed(2)}{" "}
                                    ₹{" "}
                                  </span>
                                </div>
                              </td>
                              <td>
                                <div class="row_oiu_p">
                                  <h5>
                                    {" "}
                                    {parseFloat(
                                      item.currencyBalance +
                                        parseFloat(item.holdAmount)
                                    ).toFixed(8)}{" "}
                                    {item.currencysymbol}{" "}
                                  </h5>
                                  <span>
                                    {parseFloat(
                                      item.estimatedUSDTtotal
                                    ).toFixed(2)}{" "}
                                    ₹{" "}
                                  </span>
                                </div>
                              </td>
                              <td>
                                <div class="row_oiu_p">
                                  <h5>
                                    {item.launchPadAmount != undefined &&
                                    item.launchPadAmount != null &&
                                    item.launchPadAmount != ""
                                      ? parseFloat(
                                          item.launchPadAmount
                                        ).toFixed(8)
                                      : (0).toFixed(8)}{" "}
                                    {item.currencysymbol}{" "}
                                  </h5>
                                  {/* <span>
                                    {parseFloat(
                                      item.estimatedUSDTtotal
                                    ).toFixed(2)}{" "}
                                    ₹{" "}
                                  </span> */}
                                </div>
                              </td>

                              {/* <td>
                                <div class="row_oiu_p">
                                  <h5>
                                    {" "}
                                    {parseFloat(
                                        item.p2p
                                    ).toFixed(8)}{" "}
                                    {item.currencysymbol}{" "}
                                  </h5>
                                </div>
                              </td> */}
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>

                  <Pagination
                    itemClass="page-item"
                    linkClass="page-link"
                    activePage={currentPage}
                    itemsCountPerPage={recordPerPage}
                    totalItemsCount={total}
                    pageRangeDisplayed={pageRange}
                    onChange={handlePageChange}
                  />
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
