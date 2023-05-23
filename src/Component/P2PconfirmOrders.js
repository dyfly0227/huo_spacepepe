import React, { useEffect } from "react";
import useState from "react-usestateref";
import Pagination from "react-js-pagination";
import {Button} from "@material-ui/core";
import { Link, useNavigate } from "react-router-dom";
import apiService from "../core/service/detail";
import { postMethod } from "../core/service/common.api";
import Moment from "moment";

function Home() {
  const navigate = useNavigate();

  const [p2pOrders, setp2pOrders] = useState([]);
  const [p2pcurrentpage, setp2pcurrentpage] = useState(1)
  const [p2ptotalpage, setp2pTotalpages] = useState(0);

  const getp2pOrders = async (page) => {
    var data = {
      apiUrl: apiService.p2pHistory,
      payload: { FilPerpage: 5, FilPage: page },
    };
    var p2p_orders_list = await postMethod(data);
    console.log("p2p_orders_list===", p2p_orders_list.returnObj.Message);
    if (p2p_orders_list.status) {
      setp2pOrders(p2p_orders_list.returnObj.Message);
      setp2pTotalpages(p2p_orders_list.returnObj.total);
    }
  }

  const p2precordpage = 5;
  const p2ppagerange = 5;
  const handlepagep2p = (p2ppage) => {
    console.log(p2ppage, "==-=-=-p2ppage==-==-=")
    getp2pOrders(p2ppage);
    setp2pcurrentpage(p2ppage)
  }

  useEffect(() => {
    let token_socket = localStorage.getItem("user_token");
    if (!token_socket) {
      navigate("/login");
    }
   getp2pOrders(1);
  }, [0]);

  const navchatpage = async (link) => {
    navigate("/p2p/chat/"+link);
};

  return (
    <div className="">
      <main className="">
        {/* <Header /> */}
        <div class="container p-0">
          <div className="p-0">
            <div class="">
              <div className="row">
                <div className="col-lg-12">
                  <div className="tab_sectio_wallet">
                    <div className="container padin_zero p-0">
                      <div>
                        {/* <ul class="nav nav-tabs">
                          <li class="">
                            <a data-toggle="tab" href="#wallet" class="active">
                              Wallet
                            </a>
                          </li>
                          <li>
                            <a data-toggle="tab" href="#Transaction">
                              Transaction
                            </a>
                          </li>
                        </ul> */}
                      </div>
                      <div className="table_section_ padin_zero p-0">
                        <div class="tab-content">
                          <div id="wallet" class="tab-pane fade in active show">
                            <div className="container padin_zero">
                              <div class="table-responsive bg_card_section down_ssss">
                                <table className="table">
                                  <thead>
                                    <tr>
                                    <th scope="col">Date & Time</th>
                                    <th scope="col">Currency</th>
                                    <th scope="col">Quantity</th>
                                    <th scope="col">Price</th>
                                    <th scope="col">Order Type</th>
                                    <th scope="col">Status</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                  {p2pOrders && p2pOrders.length > 0 ? (
                                        p2pOrders.map((item, i) => {
                                            var status = "";
                                            if(item.status==0)
                                            {
                                               status = "Confirmed";
                                            }
                                            if(item.status==1)
                                            {
                                               status = "Paid";
                                            }
                                            else if(item.status==2)
                                            {
                                                status = "Completed";
                                            }
                                            else if(item.status == 3)
                                            {
                                                status = "Cancelled";
                                            }
                                        return (
                                          <tr onClick={() => navchatpage(item.orderId)}>
                                            <td>
                                            <div class="row_oiu_p">
                                                <h5>
                                                {Moment(item.datetime).format(
                                                    "lll"
                                                    )}
                                                </h5>
                                              </div>
                                            </td>
                                            <td>
                                              <div class="row_oiu_p">
                                                <h5>
                                                  {" "}
                                                  {item.fromCurrency}{" "}
                                                </h5>
                                              </div>
                                            </td>
                                            <td>
                                              <div class="row_oiu_p">
                                                <h5>
                                                {parseFloat(
                                                  item.askAmount
                                                ).toFixed(8)}{" "}
                                                </h5>
                                              </div>
                                            </td>
                                            <td>
                                              <div class="row_oiu_p">
                                                <h5>
                                                {item.askPrice}{" "}
                                                </h5>
                                              </div>
                                            </td>
                                            <td>
                                              <div className="row_oiu_p">
                                              <h5>{item.type == "buy" ? "Buy" : "Sell"}</h5>
                                              </div>
                                            </td>
                                            <td>
                                              <div className="row_oiu_p">
                                              {/* {item.status == "filled" ? (
                                                  <span className="text-green">
                                                    {item.status}
                                                  </span>
                                                ) : (
                                                  ""
                                                )}
                                                {item.status !== "filled" ? (
                                                  <span className="text-red">
                                                    {item.status}
                                                  </span>
                                                ) : (
                                                  ""
                                                )} */}
                                                 <h5>{status}</h5>
                                              </div>
                                            </td>
                                            {/* <td>
                                              <div className="row_oiu_p">
                                              {item.order_status == "processing" ? (
                                                  <Link to={`/p2p/view/${item.orderId}`}><Button>View</Button></Link>
                                                ) : (
                                                  <Link to={`/p2ppost-edit/${item.orderId}`}><Button>Edit</Button></Link>
                                                )}
                                              </div>
                                            </td> */}
                                          </tr>
                                        );
                                    })
                                  ) : (
                                    <tr>
                                     <td colSpan="8">
                                      <span className="w-100 text-center d-block">
                                        No Orders Found!
                                      </span>
                                    </td>
                                    </tr>
                                  )}
                                  </tbody>
                                </table>
                                <Pagination
                                  itemClass="page-item" // add it for bootstrap 4
                                  linkClass="page-link" // add it for bootstrap 4
                                  activePage={p2pcurrentpage}
                                  itemsCountPerPage={p2precordpage}
                                  totalItemsCount={p2ptotalpage}
                                  pageRangeDisplayed={p2ppagerange}
                                  onChange={handlepagep2p}
                                />
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
        </div>
      </main>
    </div>
  );
}

export default Home;
