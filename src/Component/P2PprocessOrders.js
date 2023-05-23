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

  const [notification,Setnotification]=useState([]);
  const [notifyCurrentPage,setnotifyCurrentPage]=useState()
  const[notifytotalpage,Setnotifytotalpage]=useState(0);

  const getp2pOrders = async (page) => {
    var data = {
      apiUrl: apiService.p2pProcessOrders,
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

  const notifyrecordPerPage = 5;
 
  const notifypageRange = 5;
  const notify = async(page)=>{

    var payload = {
      perpage: 5,
      page: page,
    };

    var Notification={
        apiUrl: apiService.getnotification,
        payload: payload,      
    }
    var resp = await postMethod(Notification);
    if(resp.status){
      Setnotification(resp.data.data);
      console.log(resp.data.data,"=-=-resp.data.data-==-=")

      Setnotifytotalpage(resp.data.total)
      console.log(resp.data.total,"=-=resp.data.total=-=-=")
    }else{

    }
  }

  const handlenotifyPageChange = (pageNumber) => {
    notify(pageNumber);
    setnotifyCurrentPage(pageNumber);
  }

  const navchatpage = async (link) => {
    navigate(link);
};


  useEffect(() => {
    let token_socket = localStorage.getItem("user_token");
    if (!token_socket) {
      navigate("/login");
    }
   // getp2pOrders(1);
   notify();

  }, [0]);

  const navpage = async (link) => {
    navigate("/p2p/view/"+link);
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
                                    <th scope="col">S.No</th>
                                    <th scope="col">Date & Time</th>
                                    <th scope="col">From</th>
                                    <th scope="col">Message</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                  {notification && notification.length > 0 ? (
                                        notification.map((item, i) => {
                                        return (
                                          <tr onClick={() => navchatpage(item.link)}>
                                            <td>
                                            <div class="row_oiu_p">
                                                <h5>
                                                {i+1}
                                                </h5>
                                              </div>
                                            </td>
                                            <td>
                                            <div class="row_oiu_p">
                                                <h5>
                                                {Moment(
                                                      item.createdAt
                                                    ).format("lll")}
                                                </h5>
                                              </div>
                                            </td>
                                            <td>
                                              <div class="row_oiu_p">
                                                <h5>
                                                  {" "}
                                                  {item.from_user_name}{" "}
                                                </h5>
                                              </div>
                                            </td>
                                            <td>
                                              <div class="row_oiu_p">
                                                <h5>
                                                {item.message}{" "}
                                                </h5>
                                              </div>
                                            </td>
                                          </tr>
                                        );
                                    })
                                  ) : (
                                    
                                     <td colSpan="8">
                                      {/* <span className="w-100 text-center d-block"> */}
                                      <div className="row_oiu_p">
                                      <h5>No Orders Found!</h5>
                                      </div>
                                        
                                      {/* </span> */}
                                    </td>
                                 
                                  )}
                                  </tbody>
                                </table>
                                <Pagination
                                  itemClass="page-item" // add it for bootstrap 4
                                  linkClass="page-link" // add it for bootstrap 4
                                  activePage={notifyCurrentPage}
                                  itemsCountPerPage={notifyrecordPerPage}
                                  totalItemsCount={notifytotalpage}
                                  pageRangeDisplayed={notifypageRange}
                                  onChange={handlenotifyPageChange}
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
