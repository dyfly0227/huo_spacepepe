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

  useEffect(() => {
    let socket_token = localStorage.getItem("socket_token");
    let socketsplit = socket_token.split("_");
    socket.connect();
    getProfile();

    socket.on("socketResponse" + socketsplit[0], function (res) {
      console.log("chat response====", res);
      if (res.Reason == "p2pchat") {
        getp2pChat();
      }
    });
  }, []);

  const getProfile = async () => {
    try {
      var data = {
        apiUrl: apiService.getUserDetails,
      };
      var resp = await getMethod(data);
      if (resp.status) {
        setprofileData(resp.data);
        getp2pOrder();
        getp2pChat();
      }
    } catch (error) {}
  };

  const getp2pOrder = async () => {
    var onj = {
      orderId: window.location.href.split("/").pop(),
    };
    var data = {
      apiUrl: apiService.getp2pOrder,
      payload: onj,
    };
    var resp = await postMethod(data);
    console.log(resp.Message, "-=-=-resp=-=-");
    //console.log("profileDataref.current._id====",profileDataref.current._id.toString());
    //  console.log("resp.Message.userId.toString()====",resp.Message.userId.toString());
    if (resp) {
      var data = resp.Message;
      setp2pData(resp.Message);
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

      // var payload = {
      //   orderId: window.location.href.split("/").pop(),
      //   type: resp.Message.orderType
      // };
      // var req_data = {
      //   apiUrl: apiService.getnotifyOrder,
      //   payload: payload,
      // };
      // var notify_resp = await postMethod(req_data);
      // console.log(notify_resp, "-=-=-resp=-=-");
      // setnotifyp2pData(notify_resp.Message);
    }
  };

  const handleChange = async (e) => {
    console.log("e====", e);
    e.preventDefault();
    const {name, value} = e.target;
    let formData = {...formValue, ...{[name]: value}};
    console.log("formData====", formData);
    setFormValue(formData);
  };

  const handleChange_confirm = async (e) => {
    console.log("e====", e);
    e.preventDefault();
    console.log("e.target===", e.target.innerText);
    if (e.target.innerText == "Confirm Payment") {
      buyer_confirmation("Completed");
    } else if (e.target.innerText == "Confirm Release") {
      seller_confirmation("Completed");
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
  const imageUpload = (type, val) => {
    console.log("type===", type);
    console.log("val===", val);
    const fileExtension = val.name.split(".").at(-1);
    const fileSize = val.size;
    const fileName = val.name;
    console.log("fileExtension===", fileExtension);
    console.log("fileSize===", fileSize);
    console.log("fileName===", fileName);
    if (
      fileExtension != "png" &&
      fileExtension != "jpg" &&
      fileExtension != "jpeg" &&
      fileExtension != "pdf" &&
      fileExtension != "doc" &&
      fileExtension != "docx"
    ) {
      toast.error(
        "File does not support. You must use .png, .jpg,  .jpeg,  .pdf,  .doc,  .docx "
      );
      return false;
    } else if (fileSize > 1000000) {
      toast.error("Please upload a file smaller than 1 MB");
      return false;
    } else {
      const data = new FormData();
      data.append("file", val);
      data.append("upload_preset", "ivrtbgzq");
      data.append("cloud_name", "dpuwta04a");
      console.log("formdata===", data);
      fetch("  https://api.cloudinary.com/v1_1/dpuwta04a/auto/upload", {
        method: "post",
        body: data,
      })
        .then((resp) => resp.json())
        .then((data) => {
          console.log("cloudinary upload===", data);
          if (type == "file") {
            setp2pfile(data.secure_url);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const submitChat = async () => {
    try {
      formValue.file = p2pfileref.current;
      formValue.orderId = window.location.href.split("/").pop();
      formValue.p2porderId = p2pDataref.current._id;
      formValue.type =
        profileDataref.current._id.toString() ==
        p2pDataref.current.userId.toString()
          ? "advertiser"
          : "user";

      if (formValue.message != "" || formValue.file != "") {
        setchatloading(true);
        var data = {
          apiUrl: apiService.p2pchat,
          payload: formValue,
        };
        var resp = await postMethod(data);
        if (resp.status) {
          setchatloading(false);
          getp2pChat();
          setRunningTimer(true);
          formValue.message = "";
          setp2pfile("");
        } else {
          toast.error(resp.Message);
        }
      } else {
        toast.error("Please enter message or attach file");
      }
    } catch (error) {}
  };

  const getp2pChat = async () => {
    var onj = {
      orderId: window.location.href.split("/").pop(),
    };
    var data = {
      apiUrl: apiService.getp2pchat,
      payload: onj,
    };
    var resp = await postMethod(data);
    console.log(resp.Message, "-=-=-resp=-=-");
    if (resp) {
      var data = resp.Message;
      setp2pchat(data);
    }
  };

  const buyer_confirmation = async (status) => {
    try {
      var obj = {
        orderId: window.location.href.split("/").pop(),
        status: status,
      };
      var data = {
        apiUrl: apiService.buyer_confirm,
        payload: obj,
      };
      var resp = await postMethod(data);
      if (resp.status) {
        toast.success(resp.Message);
        getp2pChat();
      } else {
        toast.error(resp.Message);
      }
    } catch (error) {}
  };

  const seller_confirmation = async (status) => {
    try {
      var obj = {
        orderId: window.location.href.split("/").pop(),
        status: status,
      };
      var data = {
        apiUrl: apiService.seller_confirm,
        payload: obj,
      };
      var resp = await postMethod(data);
      if (resp.status) {
        toast.success(resp.Message);
        getp2pOrder();
        setRunningTimer(false);
        clearInterval(intervalref.current);
      } else {
        toast.error(resp.Message);
      }
    } catch (error) {}
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
        getp2pChat();
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
        <Header />
        <div className="container pt-5 padin_zero">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 padin_zero">
            <div className="container d-flex justify-content-center padin_zero">
              <div className="col-lg-10">
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
                                      {p2pDataref.current.totalAmount}
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
                                  {p2pDataref.current.paymentMethod ==
                                  "All payments" ? (
                                    <div>
                                      <label>All payments</label>
                                      <p>Bank Transfer</p>
                                      <p>Gpay</p>
                                      <p>Paytm</p>
                                    </div>
                                  ) : (
                                    <div>
                                      <p>{p2pDataref.current.paymentMethod}</p>
                                    </div>
                                  )}
                                  {/* <div>
                                    <label>Name</label>
                                    <p>
                                      UserName
                                      <span>
                                        <i class="fas fa-copy"></i>
                                      </span>
                                    </p>
                                  </div> */}
                                  {bankDataref.current === "" ? (
                                    ""
                                  ) : (
                                    <div>
                                      <div>
                                        <label>Account Number</label>
                                        <p>
                                          {bankDataref.current.accountNumber}
                                          <span>
                                            <i
                                              class="fas fa-copy"
                                              onClick={() =>
                                                copy_to_clipboard(
                                                  "Account Number",
                                                  bankDataref.current
                                                    .accountNumber
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
                                              .accountHolderName
                                          }
                                          <span>
                                            <i
                                              class="fas fa-copy"
                                              onClick={() =>
                                                copy_to_clipboard(
                                                  "Account Holder",
                                                  bankDataref.current
                                                    .accountHolderName
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
                                          {bankDataref.current.bankName}
                                          <span>
                                            <i
                                              class="fas fa-copy"
                                              onClick={() =>
                                                copy_to_clipboard(
                                                  "Bank Name",
                                                  bankDataref.current.bankName
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
                                          {bankDataref.current.branchName}
                                          <span>
                                            <i
                                              class="fas fa-copy"
                                              onClick={() =>
                                                copy_to_clipboard(
                                                  "Branch Name",
                                                  bankDataref.current.branchName
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
                                          {bankDataref.current.iFSCCode}
                                          <span>
                                            <i
                                              class="fas fa-copy"
                                              onClick={() =>
                                                copy_to_clipboard(
                                                  "IFSC Code",
                                                  bankDataref.current.iFSCCode
                                                )
                                              }
                                              style={{cursor: "pointer"}}
                                            ></i>
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* <div className="timer">
                                  <h6>
                                    Payment to be made by Buyer{" "}
                                    <span>00:29:00</span>
                                  </h6>
                                  <p>
                                    Buyer has not paid. pleace wait patiently
                                  </p>
                                </div>
                                <div className="confirm_button_p2p">
                                  <Button className="confirm_p2p">
                                    Confirm Release
                                  </Button>
                                  <Button className="confirm_p2p">
                                    Appeal
                                  </Button>
                                </div> */}

                                {orderTyperef.current == "Sell" &&
                                profileDataref.current._id.toString() ==
                                  p2pDataref.current.userId.toString() &&
                                p2pDataref.current.status == "active" ? (
                                  <div className="confirm_button_p2p">
                                    <Button
                                      className="confirm_p2p"
                                      onClick={handleChange_confirm}
                                    >
                                      Confirm Release
                                    </Button>
                                    <Button
                                      className="confirm_p2p"
                                      onClick={handleChange_sellcancel}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                ) : (
                                  ""
                                )}

                                {orderTyperef.current == "Sell" &&
                                profileDataref.current._id.toString() !=
                                  p2pDataref.current.userId.toString() &&
                                p2pDataref.current.status == "active" ? (
                                  <div className="confirm_button_p2p">
                                    <Button
                                      className="confirm_p2p"
                                      onClick={handleChange_confirm}
                                    >
                                      Confirm Release
                                    </Button>
                                    <Button
                                      className="confirm_p2p"
                                      onClick={handleChange_sellcancel}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                ) : (
                                  ""
                                )}

                                {orderTyperef.current == "Buy" &&
                                profileDataref.current._id.toString() ==
                                  p2pDataref.current.userId.toString() &&
                                p2pDataref.current.status == "active" ? (
                                  <div className="confirm_button_p2p">
                                    <Button
                                      className="confirm_p2p"
                                      onClick={handleChange_confirm}
                                    >
                                      Confirm Payment
                                    </Button>
                                    <Button
                                      className="confirm_p2p"
                                      onClick={handleChange_buycancel}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                ) : (
                                  ""
                                )}

                                {orderTyperef.current == "Buy" &&
                                profileDataref.current._id.toString() !=
                                  p2pDataref.current.userId.toString() &&
                                p2pDataref.current.status == "active" ? (
                                  <div className="confirm_button_p2p">
                                    <Button
                                      className="confirm_p2p"
                                      onClick={handleChange_confirm}
                                    >
                                      Confirm Payment
                                    </Button>
                                    <Button
                                      className="confirm_p2p"
                                      onClick={handleChange_buycancel}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                ) : (
                                  ""
                                )}
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={12} sm={12} md={6} lg={5}>
                            <div className="chatbox">
                              <div className="msg_section">
                                {/* <div className="message recived">
                                  <div>
                                    <span>1m ago</span>
                                    <p>I need Payment from you.</p>
                                  </div>
                                </div>
                                <div className="message">
                                  <div>
                                    <span>1m ago</span>
                                    <p>I need Payment from you.</p>
                                  </div>
                                </div>
                                <div className="message recived">
                                  <div>
                                    <span>1m ago</span>
                                    <p>I need Payment from you.</p>
                                  </div>
                                </div>
                                <div className="message ">
                                  <div>
                                    <span>1m ago</span>
                                    <p>I need Payment from you.</p>
                                  </div>
                                </div>
                                <div className="message recived">
                                  <div>
                                    <span>1m ago</span>
                                    <p>I need Payment from you.</p>
                                  </div>
                                </div>
                                <div className="message ">
                                  <div>
                                    <span>1m ago</span>
                                    <img
                                      src={require("../img/qr.png")}
                                      className=""
                                    />
                                  </div>
                                </div> */}

                                {p2pchatref.current &&
                                  p2pchatref.current.map((chat, i) => {
                                    return chat.type == "advertiser" ? (
                                      <div className="message ">
                                        <div>
                                          <span>
                                            {Moment(chat.createdAt).fromNow()}
                                          </span>
                                          {chat.adv_msg != "" &&
                                          chat.adv_msg != undefined ? (
                                            <p>{chat.adv_msg}</p>
                                          ) : (
                                            ""
                                          )}
                                          {chat.adv_file != "" &&
                                          chat.adv_file != undefined ? (
                                            <img
                                              src={chat.adv_file}
                                              className=""
                                            />
                                          ) : (
                                            ""
                                          )}
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="message recived">
                                        <div>
                                          <span>
                                            {Moment(chat.createdAt).fromNow()}
                                          </span>
                                          {chat.user_msg != "" &&
                                          chat.user_msg != undefined ? (
                                            <p>{chat.user_msg}</p>
                                          ) : (
                                            ""
                                          )}
                                          {chat.user_file != "" &&
                                          chat.user_file != undefined ? (
                                            <img
                                              src={chat.user_file}
                                              className=""
                                            />
                                          ) : (
                                            ""
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                              </div>
                              {p2pDataref.current.status == "active" ? (
                                <div className="chat-text">
                                  {/* <input type="text" />
                                <div className="file_upload_send">
                                  <div className="file">
                                    <input type="file" />
                                    <i class="fas fa-paperclip"></i>
                                  </div>
                                  <span>
                                    <i class="fas fa-paper-plane"></i>
                                  </span>
                                </div> */}
                                  <input
                                    type="text"
                                    name="message"
                                    value={message}
                                    placeholder="Enter message"
                                    onChange={handleChange}
                                  />
                                  <div className="file_upload_send">
                                    <div className="file">
                                      <input
                                        type="file"
                                        name="file"
                                        onChange={(e) =>
                                          imageUpload("file", e.target.files[0])
                                        }
                                      />
                                      <i class="fas fa-paperclip"></i>
                                    </div>
                                    <span>
                                      <i
                                        class="fas fa-paper-plane"
                                        onClick={submitChat}
                                      ></i>
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                ""
                              )}
                            </div>
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
    </div>
  );
}

export default Home;
