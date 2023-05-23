import React, {useEffect, useContext} from "react";
import {Link, useNavigate} from "react-router-dom";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import "rc-slider/assets/index.css";
import Header from "./Header";
import {Button} from "@material-ui/core";
import {Card, Grid, Paper} from "@mui/material";
import apiService from "../core/service/detail";
import {postMethod} from "../core/service/common.api";
import {toast} from "react-toastify";
import {setAuthToken, getAuthToken} from "../core/lib/localStorage";
import OTPInput, {ResendOTP} from "otp-input-react";
import useState from "react-usestateref";
import {format} from "date-fns";
import Moment from "moment";
import {getMethod} from "../core/service/common.api";
import {socket} from "./context/socket";

function Home() {
  const initialFormValue = {
    message: "",
    file: "",
    type: "",
    orderId: "",
    p2porderId: "",
  };

  const p2pFormValue = {
    qty: "",
    total: "",
  };

  const [p2pData, setp2pData, p2pDataref] = useState("");
  const [orderType, setorderType, orderTyperef] = useState("");
  const [p2pdate, setp2pDate, p2pdateref] = useState("");
  const [profileData, setprofileData, profileDataref] = useState("");
  const [formValue, setFormValue, formValueref] = useState(initialFormValue);
  const [p2pfile, setp2pfile, p2pfileref] = useState("");
  const [chatloading, setchatloading] = useState(false);
  const {message, file, type, orderId, p2porderId} = formValue;
  const [p2pchat, setp2pchat, p2pchatref] = useState("");
  const [interval, setintervalchat, intervalref] = useState("");
  const [runningTimer, setRunningTimer] = useState(false);
  const [bankData, setbankData, bankDataref] = useState("");
  const [socket_token, set_socket_token, socketref] = useState("");
  const [notifyp2pData, setnotifyp2pData, notifyp2pDataref] = useState("");
  const [p2pformValue, setp2pFormValue, p2pformValueref] =
    useState(p2pFormValue);
  const [notifymessage, setnotifymessage, notifymessageref] = useState("");
  const [confirmp2pcheck, setconfirmp2pcheck, confirmp2pcheckref] = useState(
    []
  );
  const {qty, total} = p2pformValue;
  const [p2pbalance, setp2pbalance, p2pbalanceref] = useState("");
  const [disputefile, setdisputefile, disputefileref] = useState("");
  const [disputequery, setdisputequery, disputequeryref] = useState("");
  const [confirmp2porder, setconfirmp2porder, confirmp2porderref] =
    useState("");
  const [p2pbankcheck, setp2pbankcheck, p2pbankcheckref] = useState(false);
  const [p2pbankData, setp2pbankData, p2pbankDataref] = useState("");
  const [confirmOrders, setconfirmOrders, confirmOrdersref] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getProfile();
    getp2pOrder();
    getconfirmOrder();
  }, [0]);

  const closePopup = async () => {};

  const getProfile = async () => {
    try {
      var data = {
        apiUrl: apiService.getUserDetails,
      };
      var resp = await getMethod(data);
      console.log("get profile---", resp);
      if (resp.status) {
        setprofileData(resp.data);
        //getp2pOrder();
      }
    } catch (error) {}
  };

  const getp2pOrder = async () => {
    var onj = {
      orderId: window.location.href.split("/").pop(),
    };
    var data = {
      apiUrl: apiService.viewp2pOrder,
      payload: onj,
    };
    var resp = await postMethod(data);
    console.log(resp.Message, "-=-=-resp=-=-");
    //console.log("profileDataref.current._id====",profileDataref.current._id.toString());
    //  console.log("resp.Message.userId.toString()====",resp.Message.userId.toString());
    if (resp) {
      var data = resp.Message;
      setp2pData(resp.Message);
      setp2pbalance(resp.p2pbalance);
      setconfirmOrders(resp.getconfirmOrders);
      if (resp.bank) {
        setbankData(resp.bank);
      }

      if (resp.Message.orderType == "buy") {
        if (
          profileDataref.current._id.toString() ==
          resp.Message.userId.toString()
        ) {
          setorderType("Buy");
        } else {
          setorderType("Sell");
        }
      } else {
        if (
          profileDataref.current._id.toString() ==
          resp.Message.userId.toString()
        ) {
          setorderType("Sell");
        } else {
          setorderType("Buy");
        }
      }
      console.log("orderTyperef====", orderTyperef.current);
      var dates = Moment(resp.Message.createdAt).format("DD.MM.YYYY h:m a");
      setp2pDate(dates);
    }
  };

  const getconfirmOrder = async () => {
    var onj = {
      orderId: window.location.href.split("/").pop(),
    };
    var data = {
      apiUrl: apiService.confirmp2porder,
      payload: onj,
    };
    var resp = await postMethod(data);
    console.log(resp, " confirmp2porder -=-=-resp=-=-");
    if (resp) {
      var data = resp.Message;
      setconfirmp2porder(resp.Message);
      setp2pbankData(resp.bank_details);
      setp2pbankcheck(true);
    }
  };

  const handleChange_buycancel = async (e) => {
    console.log("e====", e);
    e.preventDefault();
    console.log("e.target===", e.target.innerText);
    buyer_cancel();
  };

  const handleChange_sellcancel = async (e) => {
    console.log("e====", e);
    e.preventDefault();
    console.log("e.target===", e.target.innerText);
    seller_cancel();
  };
  const buyer_cancel = async (status) => {
    try {
      var obj = {
        orderId: window.location.href.split("/").pop(),
        status: status,
      };
      var data = {
        apiUrl: apiService.buyer_cancel,
        payload: obj,
      };
      var resp = await postMethod(data);
      if (resp.status) {
        toast.success(resp.Message);
        getp2pOrder();
        navigate("/p2phome");
      } else {
        toast.error(resp.Message);
      }
    } catch (error) {}
  };

  const seller_cancel = async (status) => {
    try {
      var obj = {
        orderId: window.location.href.split("/").pop(),
        status: status,
      };
      var data = {
        apiUrl: apiService.seller_cancel,
        payload: obj,
      };
      var resp = await postMethod(data);
      if (resp.status) {
        toast.success(resp.Message);
        getp2pOrder();
        navigate("/p2phome");
      } else {
        toast.error(resp.Message);
      }
    } catch (error) {}
  };

  const copy_to_clipboard = async (type, text) => {
    navigator.clipboard.writeText(text);
    toast.success(type + " copied successfully");
  };

  return (
    <div className="">
      <main className="main-content tradepage-bg login_body_ bg-cover ">
        <div className="container">
          <div className="">
            <div className="container">
              <div className="col-lg-12 pading-zeero ">
                <div className="p2ppost p2plist font_pading_char">
                  <div className="margin_top_s peer2peer_section">
                    <div className="container">
                      <div className="dashboard-card">
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={12} md={6} lg={7}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={12} md={12} lg={12}>
                                <div className="order_type">
                                  <h3>
                                    {orderTyperef.current}{" "}
                                    {p2pDataref.current.firstCurrency}
                                  </h3>
                                  <div className="address_content">
                                    <p>
                                      <span>Created Time : </span>
                                      {p2pdateref.current}
                                    </p>
                                  </div>
                                </div>
                              </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={12} md={12} lg={12}>
                                <div className="order_type_details">
                                  <div>
                                    <label>Quantity</label>
                                    <h4 className="color-green">
                                      {p2pDataref.current.firstCurrency}{" "}
                                      {+p2pDataref.current.totalAmount - +p2pDataref.current.processAmount}
                                    </h4>
                                  </div>
                                  <div>
                                    <label>Price</label>
                                    <p>
                                      {p2pDataref.current.price}{" "}
                                      {p2pDataref.current.secondCurrnecy}
                                    </p>
                                  </div>
                                  {/* <div>
                                    <label>Quantity</label>
                                    <p>13.00 USDT</p>
                                  </div> */}
                                </div>

                                <div className="payment_method_card">
                                  <h5>My Payment Method</h5>

                                  <div className="payment_tab_p2p p-0">
                                    <ul class="nav nav-tabs">
                                      <li class="active">
                                        <a
                                          data-toggle="tab"
                                          href="#home"
                                          className="active show"
                                        >
                                          Bank Transfer
                                        </a>
                                      </li>
                                      <li>
                                        <a data-toggle="tab" href="#menu1">
                                          UPI ID
                                        </a>
                                      </li>
                                      <li>
                                        <a data-toggle="tab" href="#menu2">
                                          Paytm
                                        </a>
                                      </li>
                                    </ul>

                                    <div class="tab-content">
                                      <div
                                        id="home"
                                        class="tab-pane fade in active show"
                                      >
                                        {/* <div>
                                          <label>UPI ID</label>
                                          <p>
                                            test@upi{" "}
                                            <span>
                                              <i className="fas fa-copy"></i>
                                            </span>
                                          </p>
                                        </div>
                                        <div>
                                          <label>UPI ID</label>
                                          <p>
                                            test@upi{" "}
                                            <span>
                                              <i className="fas fa-copy"></i>
                                            </span>
                                          </p>
                                        </div>
                                        <div>
                                          <label>UPI ID</label>
                                          <p>
                                            test@upi{" "}
                                            <span>
                                              <i className="fas fa-copy"></i>
                                            </span>
                                          </p>
                                        </div> */}


                                        <div>
                                        <label>Account Number</label>
                                        <p>
                                          {bankDataref.current.Account_Number}
                                          <span>
                                            <i
                                              class="fas fa-copy"
                                              onClick={() =>
                                                copy_to_clipboard(
                                                  "Account Number",
                                                  bankDataref.current
                                                    .Account_Number
                                                )
                                              }
                                              style={{cursor: "pointer"}}
                                            ></i>
                                          </span>
                                        </p>
                                      </div>

                                      <div>
                                        <label>Account Holder</label>
                                        <p>
                                          {
                                            bankDataref.current
                                              .Accout_HolderName
                                          }
                                          <span>
                                            <i
                                              class="fas fa-copy"
                                              onClick={() =>
                                                copy_to_clipboard(
                                                  "Account Holder",
                                                  bankDataref.current
                                                    .Accout_HolderName
                                                )
                                              }
                                              style={{cursor: "pointer"}}
                                            ></i>
                                          </span>
                                        </p>
                                      </div>

                                      <div>
                                        <label>Bank Name</label>
                                        <p>
                                          {bankDataref.current.Bank_Name}
                                          <span>
                                            <i
                                              class="fas fa-copy"
                                              onClick={() =>
                                                copy_to_clipboard(
                                                  "Bank Name",
                                                  bankDataref.current.Bank_Name
                                                )
                                              }
                                              style={{cursor: "pointer"}}
                                            ></i>
                                          </span>
                                        </p>
                                      </div>

                                      <div>
                                        <label>Branch Name</label>
                                        <p>
                                          {bankDataref.current.Branch_Name}
                                          <span>
                                            <i
                                              class="fas fa-copy"
                                              onClick={() =>
                                                copy_to_clipboard(
                                                  "Branch Name",
                                                  bankDataref.current
                                                    .Branch_Name
                                                )
                                              }
                                              style={{cursor: "pointer"}}
                                            ></i>
                                          </span>
                                        </p>
                                      </div>

                                      <div>
                                        <label>IFSC Code</label>
                                        <p>
                                          {bankDataref.current.IFSC_code}
                                          <span>
                                            <i
                                              class="fas fa-copy"
                                              onClick={() =>
                                                copy_to_clipboard(
                                                  "IFSC Code",
                                                  bankDataref.current.IFSC_code
                                                )
                                              }
                                              style={{cursor: "pointer"}}
                                            ></i>
                                          </span>
                                        </p>
                                      </div>
                                      </div>
                                      <div id="menu1" class="tab-pane fade">
                                        {/* <h3>Menu 1</h3>
                                        <p>Some content in menu 1.</p> */}
                                         {bankDataref.current.Gpay_Number !=
                                        undefined &&
                                      bankDataref.current.Gpay_Number != "" ? (
                                        <div>
                                          {/* <label>UPI ID</label> */}
                                          <p>
                                            {bankDataref.current.Gpay_Number}
                                            <span>
                                              <i
                                                class="fas fa-copy"
                                                onClick={() =>
                                                  copy_to_clipboard(
                                                    "UPI ID",
                                                    bankDataref.current
                                                      .Gpay_Number
                                                  )
                                                }
                                                style={{cursor: "pointer"}}
                                              ></i>
                                            </span>
                                          </p>
                                        </div>
                                      ) : (
                                        ""
                                      )}
                                      </div>
                                      <div id="menu2" class="tab-pane fade">
                                        {/* <h3>Menu 2</h3>
                                        <p>Some content in menu 2.</p> */}

                                     {bankDataref.current.Paytm_Number !=
                                        undefined &&
                                      bankDataref.current.Paytm_Number != "" ? (
                                        <div>
                                          {/* <label>Paytm</label> */}
                                          <p>
                                            {bankDataref.current.Paytm_Number}
                                            <span>
                                              <i
                                                class="fas fa-copy"
                                                onClick={() =>
                                                  copy_to_clipboard(
                                                    "Paytm",
                                                    bankDataref.current
                                                      .Paytm_Number
                                                  )
                                                }
                                                style={{cursor: "pointer"}}
                                              ></i>
                                            </span>
                                          </p>
                                        </div>
                                      ) : (
                                        ""
                                      )}
                                      </div>
                                    </div>
                                  </div>
                                  {/* {p2pDataref.current.paymentMethod ==
                                  "All payments" ? (
                                    <div>
                                      <label>All payments</label>
                                      <p>Bank Transfer</p>
                                      <p>UPI ID</p>
                                      <p>Paytm</p>
                                    </div>
                                  ) : (
                                    <div>
                                      <p>{p2pDataref.current.paymentMethod}</p>
                                    </div>
                                  )} */}
                                  {/* <div>
                                    <label>Name</label>
                                    <p>
                                      UserName
                                      <span>
                                        <i class="fas fa-copy"></i>
                                      </span>
                                    </p>
                                  </div> */}
                                  {/* {bankDataref.current === "" ? (
                                    ""
                                  ) : (
                                    <div>
                                      {bankDataref.current.Gpay_Number !=
                                        undefined &&
                                      bankDataref.current.Gpay_Number != "" ? (
                                        <div>
                                          <label>UPI ID</label>
                                          <p>
                                            {bankDataref.current.Gpay_Number}
                                            <span>
                                              <i
                                                class="fas fa-copy"
                                                onClick={() =>
                                                  copy_to_clipboard(
                                                    "UPI ID",
                                                    bankDataref.current
                                                      .Gpay_Number
                                                  )
                                                }
                                                style={{cursor: "pointer"}}
                                              ></i>
                                            </span>
                                          </p>
                                        </div>
                                      ) : (
                                        ""
                                      )}

                                      {bankDataref.current.Paytm_Number !=
                                        undefined &&
                                      bankDataref.current.Paytm_Number != "" ? (
                                        <div>
                                          <label>Paytm</label>
                                          <p>
                                            {bankDataref.current.Paytm_Number}
                                            <span>
                                              <i
                                                class="fas fa-copy"
                                                onClick={() =>
                                                  copy_to_clipboard(
                                                    "Paytm",
                                                    bankDataref.current
                                                      .Paytm_Number
                                                  )
                                                }
                                                style={{cursor: "pointer"}}
                                              ></i>
                                            </span>
                                          </p>
                                        </div>
                                      ) : (
                                        ""
                                      )}

                                      <div>
                                        <label>Account Number</label>
                                        <p>
                                          {bankDataref.current.Account_Number}
                                          <span>
                                            <i
                                              class="fas fa-copy"
                                              onClick={() =>
                                                copy_to_clipboard(
                                                  "Account Number",
                                                  bankDataref.current
                                                    .Account_Number
                                                )
                                              }
                                              style={{cursor: "pointer"}}
                                            ></i>
                                          </span>
                                        </p>
                                      </div>

                                      <div>
                                        <label>Account Holder</label>
                                        <p>
                                          {
                                            bankDataref.current
                                              .Accout_HolderName
                                          }
                                          <span>
                                            <i
                                              class="fas fa-copy"
                                              onClick={() =>
                                                copy_to_clipboard(
                                                  "Account Holder",
                                                  bankDataref.current
                                                    .Accout_HolderName
                                                )
                                              }
                                              style={{cursor: "pointer"}}
                                            ></i>
                                          </span>
                                        </p>
                                      </div>

                                      <div>
                                        <label>Bank Name</label>
                                        <p>
                                          {bankDataref.current.Bank_Name}
                                          <span>
                                            <i
                                              class="fas fa-copy"
                                              onClick={() =>
                                                copy_to_clipboard(
                                                  "Bank Name",
                                                  bankDataref.current.Bank_Name
                                                )
                                              }
                                              style={{cursor: "pointer"}}
                                            ></i>
                                          </span>
                                        </p>
                                      </div>

                                      <div>
                                        <label>Branch Name</label>
                                        <p>
                                          {bankDataref.current.Branch_Name}
                                          <span>
                                            <i
                                              class="fas fa-copy"
                                              onClick={() =>
                                                copy_to_clipboard(
                                                  "Branch Name",
                                                  bankDataref.current
                                                    .Branch_Name
                                                )
                                              }
                                              style={{cursor: "pointer"}}
                                            ></i>
                                          </span>
                                        </p>
                                      </div>

                                      <div>
                                        <label>IFSC Code</label>
                                        <p>
                                          {bankDataref.current.IFSC_code}
                                          <span>
                                            <i
                                              class="fas fa-copy"
                                              onClick={() =>
                                                copy_to_clipboard(
                                                  "IFSC Code",
                                                  bankDataref.current.IFSC_code
                                                )
                                              }
                                              style={{cursor: "pointer"}}
                                            ></i>
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                  )} */}

                                  {orderTyperef.current == "Sell" &&
                                  profileDataref.current._id.toString() ==
                                    p2pDataref.current.userId.toString() &&
                                  //confirmOrdersref.current.length == 0 &&
                                  (p2pDataref.current.status != "filled" && p2pDataref.current.status != "cancelled")  ? (
                                    <div className="confirm_button_p2p">
                                      <Button
                                        className="confirm_p2p"
                                        onClick={handleChange_sellcancel}
                                      >
                                        Cancel Order
                                      </Button>
                                    </div>
                                  ) : (
                                    ""
                                  )}

                                  {orderTyperef.current == "Buy" &&
                                  profileDataref.current._id.toString() ==
                                    p2pDataref.current.userId.toString() &&
                                 // confirmOrdersref.current.length == 0 &&
                                  (p2pDataref.current.status != "filled" && p2pDataref.current.status != "cancelled")  ? (
                                    <div className="confirm_button_p2p">
                                      <Button
                                        className="confirm_p2p"
                                        onClick={handleChange_buycancel}
                                      >
                                        Cancel Order
                                      </Button>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* <div
        id="confirm_p2p_sell"
        class="modal launchpad_doce fade"
        role="dialog"
      >
        <div class="modal-dialog modal-dialog-centered ">
          <div class="modal-content">
            <div class="modal-body model_confirms">
              <h1> Confirm Order </h1>
              <div class="form-group">
                <label>Enter quantity to sell</label>
                <input
                  type="text"
                  class="form-control"
                  id="exampleInputPassword1"
                  name="qty"
                  value={qty}
                  onChange={confirm_handleChange}
                />
              </div>
              <div class="form-group">
                <label>You Will Receive</label>
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
                onClick={confirm_order_sell}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div> */}

      <div id="success_msg" class="modal launchpad_doce fade" role="dialog">
        <div class="modal-dialog modal-dialog-centered ">
          <div class="modal-content">
            <div class="modal-body model_confirms">
              <h1> {notifymessageref.current}</h1>
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
