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
    const [confirmp2pcheck, setconfirmp2pcheck, confirmp2pcheckref] = useState([]);
  const {qty, total} = p2pformValue;
  const [p2pbalance, setp2pbalance, p2pbalanceref] = useState("");
  const [disputefile, setdisputefile, disputefileref] = useState("");
  const [disputequery, setdisputequery, disputequeryref] = useState("");
  const [confirmp2porder, setconfirmp2porder, confirmp2porderref] = useState("");
  const [p2pbankcheck, setp2pbankcheck, p2pbankcheckref] = useState(false);
  const [p2pbankData, setp2pbankData, p2pbankDataref] = useState("");

  useEffect(() => {
    let socket_token = localStorage.getItem("socket_token");
    let socketsplit = socket_token.split("_");
    socket.connect();
    getProfile();
    getp2pconfirmOrder();
    getconfirmOrder();

    socket.off("socketResponse");
    socket.on("socketResponse" + socketsplit[0], function (res) {
      if (res.Reason == "p2pchat") {
        getp2pChat();
      }
      else if (res.Reason == "notify") {
      
        setnotifymessage(res.Message);
          toast.success(res.Message,{
            toastId: "3"
          });
          getp2pOrder();
          getp2pconfirmOrder();
        }
    });
  }, [0]);

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);
  const closePopup = async () => {};

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
      setp2pbalance(resp.p2pbalance);
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

  const getp2pconfirmOrder = async () => {
    var onj = {
      orderId: window.location.href.split("/").pop(),
    };
    var data = {
      apiUrl: apiService.p2p_confirm_check,
      payload: onj,
    };
    var resp = await postMethod(data);
    if (resp) {
      var data = resp.Message;
      setconfirmp2pcheck(resp.Message);
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
      data.append("upload_preset", "sztbiwly");
      data.append("cloud_name", "taikonz-com");
      console.log("formdata===", data);
      fetch("  https://api.cloudinary.com/v1_1/taikonz-com/auto/upload", {
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
        getp2pOrder();
        getp2pconfirmOrder();
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
        getp2pconfirmOrder();
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
        getp2pOrder();
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

  const confirm_handleChange = async (e) => {
    console.log("e====", e);
    e.preventDefault();
    const {name, value} = e.target;
    let p2pformData = {...formValue, ...{[name]: value}};
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
        p2pformValueref.current.total = order_qty * p2pDataref.current.price;
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
      obj.orderId = window.location.href.split("/").pop();
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
          getp2pOrder();
          getp2pconfirmOrder();
          getconfirmOrder();
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
      obj.orderId = window.location.href.split("/").pop();
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
          getp2pOrder();
          getp2pconfirmOrder();
          getconfirmOrder();
        } else {
          toast.error(resp.Message);
        }
      } else {
        toast.error("Please enter quantity");
      }
    } catch (error) {}
  };


  const maximum_buy = async () => {
    var order_qty = p2pDataref.current.filledAmount;
    console.log("order_qty====",order_qty)
    p2pformValueref.current.qty = order_qty;
    p2pformValueref.current.total = order_qty * p2pDataref.current.price;
    var obj = {
      qty : order_qty,
      total: order_qty * p2pDataref.current.price
    }
    setp2pFormValue(obj);
    console.log("p2pformValueref.current====",p2pformValueref.current)
  };


  const maximum_sell = async () => {
    var order_qty = (p2pDataref.current.filledAmount > p2pbalanceref.current)?p2pbalanceref.current:p2pDataref.current.filledAmount;
    console.log("order_qty====",order_qty)
    p2pformValueref.current.qty = order_qty;
    p2pformValueref.current.total = order_qty * p2pDataref.current.price;
    var obj = {
      qty : order_qty,
      total: order_qty * p2pDataref.current.price
    }
    setp2pFormValue(obj);
    console.log("p2pformValueref.current====",p2pformValueref.current)
  };


  const dispute_handleChange = async (e) => {
    console.log("e====", e);
    e.preventDefault();
    setdisputequery(e.target.value)
  };

  const disputeUpload = (type, val) => {
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
      data.append("upload_preset", "sztbiwly");
      data.append("cloud_name", "taikonz-com");
      console.log("formdata===", data);
      fetch("  https://api.cloudinary.com/v1_1/taikonz-com/auto/upload", {
        method: "post",
        body: data,
      })
        .then((resp) => resp.json())
        .then((data) => {
          console.log("cloudinary upload===", data);
          if (type == "file") {
            setdisputefile(data.secure_url);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const dispute_buy = async () => {
    try {
      console.log("confirmp2porderref.current buy====",confirmp2porderref.current)
      var obj = {};
      obj.type = "buy";
      obj.query = disputequeryref.current;
      obj.attachment = disputefileref.current;
      obj.orderId = confirmp2porderref.current.orderId;
      obj.p2p_orderId = window.location.href.split("/").pop();

      if (obj.query != "") {
        var data = {
          apiUrl: apiService.raise_dispute,
          payload: obj,
        };
        var resp = await postMethod(data);
        if (resp.status) {
          toast.success(resp.Message);
          getp2pOrder();
          getp2pconfirmOrder();
        } else {
          toast.error(resp.Message);
        }
      } else {
        toast.error("Please enter reason for dispute");
      }
    } catch (error) {}
  };


  const dispute_sell = async () => {
    try {
      console.log("confirmp2pcheckref.current sell====",confirmp2porderref.current)
      var obj = {};
      obj.type = "sell";
      obj.query = disputequeryref.current;
      obj.attachment = disputefileref.current;
      obj.orderId = confirmp2porderref.current.orderId;
      obj.p2p_orderId = window.location.href.split("/").pop();

      if (obj.query != "") {
        var data = {
          apiUrl: apiService.raise_dispute,
          payload: obj,
        };
        var resp = await postMethod(data);
        if (resp.status) {
          toast.success(resp.Message);
          getp2pOrder();
          getp2pconfirmOrder();
        } else {
          toast.error(resp.Message);
        }
      } else {
        toast.error("Please enter reason for dispute");
      }
    } catch (error) {}
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
                                      {p2pDataref.current.filledAmount}
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
                                      <p>UPI ID</p>
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
                                      {bankDataref.current.Gpay_Number != undefined && bankDataref.current.Gpay_Number != ""? (
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
                                                    bankDataref.current.Gpay_Number
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
                                      undefined && bankDataref.current.Paytm_Number !=
                                      ""? (
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
                                                    bankDataref.current.Paytm_Number
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
                                                  bankDataref.current.Branch_Name
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
                                  {profileDataref.current._id.toString() !=
                                  p2pDataref.current.userId.toString() && confirmp2pcheckref.current == "Sell" && confirmp2porderref.current != "" ? (
                                    <>
                                    <div>
                                    <label>Need to Release</label>
                                    <h4 className="color-green">
                                      {confirmp2porderref.current.askAmount}{" "}
                                      {p2pDataref.current.firstCurrency}
                                    </h4>
                                  </div>
                                  <div>
                                    <label>You will Get</label>
                                    <p>
                                      {parseFloat(confirmp2porderref.current.askAmount * p2pDataref.current.price).toFixed(2)}{" "}
                                      {p2pDataref.current.secondCurrnecy}
                                    </p>
                                  </div>
                                  {p2pbankDataref.current ? (<h5>Buyer Payment Methods</h5>) : ("")}
                                  {confirmp2porderref.current.length > 0 && p2pbankDataref.current == "" ? (
                                    ""
                                  ) : (
                                    <div>
                                      {p2pbankDataref.current && p2pbankDataref.current.Gpay_Number != undefined && p2pbankDataref.current.Gpay_Number != ""? (
                                        <div>
                                          <label>UPI ID</label>
                                          <p>
                                            {p2pbankDataref.current.Gpay_Number}
                                            <span>
                                              <i
                                                class="fas fa-copy"
                                                onClick={() =>
                                                  copy_to_clipboard(
                                                    "UPI ID",
                                                    p2pbankDataref.current.Gpay_Number
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

                                      {p2pbankDataref.current && p2pbankDataref.current.Paytm_Number !=
                                      undefined && p2pbankDataref.current.Paytm_Number !=
                                      ""? (
                                        <div>
                                          <label>Paytm</label>
                                          <p>
                                            {p2pbankDataref.current.Paytm_Number}
                                            <span>
                                              <i
                                                class="fas fa-copy"
                                                onClick={() =>
                                                  copy_to_clipboard(
                                                    "Paytm",
                                                    p2pbankDataref.current.Paytm_Number
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
                                      
                                      {p2pbankDataref.current ? (
                                           <>
                                            <div>
                                            <label>Account Number</label>
                                            <p>
                                              {p2pbankDataref.current.Account_Number}
                                              <span>
                                                <i
                                                  class="fas fa-copy"
                                                  onClick={() =>
                                                    copy_to_clipboard(
                                                      "Account Number",
                                                      p2pbankDataref.current
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
                                                p2pbankDataref.current
                                                  .Accout_HolderName
                                              }
                                              <span>
                                                <i
                                                  class="fas fa-copy"
                                                  onClick={() =>
                                                    copy_to_clipboard(
                                                      "Account Holder",
                                                      p2pbankDataref.current
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
                                              {p2pbankDataref.current.Bank_Name}
                                              <span>
                                                <i
                                                  class="fas fa-copy"
                                                  onClick={() =>
                                                    copy_to_clipboard(
                                                      "Bank Name",
                                                      p2pbankDataref.current.Bank_Name
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
                                              {p2pbankDataref.current.Branch_Name}
                                              <span>
                                                <i
                                                  class="fas fa-copy"
                                                  onClick={() =>
                                                    copy_to_clipboard(
                                                      "Branch Name",
                                                      p2pbankDataref.current.Branch_Name
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
                                              {p2pbankDataref.current.IFSC_code}
                                              <span>
                                                <i
                                                  class="fas fa-copy"
                                                  onClick={() =>
                                                    copy_to_clipboard(
                                                      "IFSC Code",
                                                      p2pbankDataref.current.IFSC_code
                                                    )
                                                  }
                                                  style={{cursor: "pointer"}}
                                                ></i>
                                              </span>
                                            </p>
                                            </div>
                                            </>

                                      )
                                      :
                                      ("")}
                                      
                                    </div>
                                  )}
                                    </>
                                  ):("")}

                                  {profileDataref.current._id.toString() !=
                                  p2pDataref.current.userId.toString() && orderTyperef.current == "Buy" && confirmp2porderref.current != "" ? (
                                    <>
                                    <div>
                                    <label>Need to Pay</label>
                                    <h4 className="color-green">
                                      {parseFloat(confirmp2porderref.current.askAmount * p2pDataref.current.price).toFixed(2)}{" "}
                                      {p2pDataref.current.secondCurrnecy}
                                    </h4>
                                  </div>
                                  <div>
                                    <label>You will Get</label>
                                    <p>
                                      {confirmp2porderref.current.askAmount}{" "}
                                      {p2pDataref.current.firstCurrency}
                                    </p>
                                  </div>
                                  {p2pbankDataref.current ? (<h5>Seller Payment Methods</h5>) : ("")}
                                  {confirmp2porderref.current.length > 0 && p2pbankDataref.current == "" ? (
                                    ""
                                  ) : (
                                    
                                    <div>
                                      {p2pbankDataref.current && p2pbankDataref.current.Gpay_Number != undefined && p2pbankDataref.current.Gpay_Number != ""? (
                                        <div>
                                          <label>UPI ID</label>
                                          <p>
                                            {p2pbankDataref.current.Gpay_Number}
                                            <span>
                                              <i
                                                class="fas fa-copy"
                                                onClick={() =>
                                                  copy_to_clipboard(
                                                    "UPI ID",
                                                    p2pbankDataref.current.Gpay_Number
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

                                      {p2pbankDataref.current && p2pbankDataref.current.Paytm_Number !=
                                      undefined && p2pbankDataref.current.Paytm_Number !=
                                      ""? (
                                        <div>
                                          <label>Paytm</label>
                                          <p>
                                            {p2pbankDataref.current.Paytm_Number}
                                            <span>
                                              <i
                                                class="fas fa-copy"
                                                onClick={() =>
                                                  copy_to_clipboard(
                                                    "Paytm",
                                                    p2pbankDataref.current.Paytm_Number
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

{p2pbankDataref.current ? (
                                           <>
                                            <div>
                                            <label>Account Number</label>
                                            <p>
                                              {p2pbankDataref.current.Account_Number}
                                              <span>
                                                <i
                                                  class="fas fa-copy"
                                                  onClick={() =>
                                                    copy_to_clipboard(
                                                      "Account Number",
                                                      p2pbankDataref.current
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
                                                p2pbankDataref.current
                                                  .Accout_HolderName
                                              }
                                              <span>
                                                <i
                                                  class="fas fa-copy"
                                                  onClick={() =>
                                                    copy_to_clipboard(
                                                      "Account Holder",
                                                      p2pbankDataref.current
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
                                              {p2pbankDataref.current.Bank_Name}
                                              <span>
                                                <i
                                                  class="fas fa-copy"
                                                  onClick={() =>
                                                    copy_to_clipboard(
                                                      "Bank Name",
                                                      p2pbankDataref.current.Bank_Name
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
                                              {p2pbankDataref.current.Branch_Name}
                                              <span>
                                                <i
                                                  class="fas fa-copy"
                                                  onClick={() =>
                                                    copy_to_clipboard(
                                                      "Branch Name",
                                                      p2pbankDataref.current.Branch_Name
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
                                              {p2pbankDataref.current.IFSC_code}
                                              <span>
                                                <i
                                                  class="fas fa-copy"
                                                  onClick={() =>
                                                    copy_to_clipboard(
                                                      "IFSC Code",
                                                      p2pbankDataref.current.IFSC_code
                                                    )
                                                  }
                                                  style={{cursor: "pointer"}}
                                                ></i>
                                              </span>
                                            </p>
                                            </div>
                                            </>

                                      )
                                      :
                                      ("")}
                                    </div>
                                  )}
                                    </>
                                  ):("")}

                                {profileDataref.current._id.toString() ==
                                  p2pDataref.current.userId.toString() && orderTyperef.current == "Sell" && confirmp2porderref.current != "" ? (
                                    <>
                                    <div>
                                    <label>Need to Release</label>
                                    <h4 className="color-green">
                                      {confirmp2porderref.current.askAmount}{" "}
                                      {p2pDataref.current.firstCurrency}
                                    </h4>
                                  </div>
                                  <div>
                                    <label>You will Get</label>
                                    <p>
                                      {parseFloat(confirmp2porderref.current.askAmount * p2pDataref.current.price).toFixed(2)}{" "}
                                      {p2pDataref.current.secondCurrnecy}
                                    </p>
                                  </div>
                                  {p2pbankDataref.current ? (<h5>Buyer Payment Methods</h5>) : ("")}
                                  {confirmp2porderref.current.length > 0 && p2pbankDataref.current == "" ? (
                                    ""
                                  ) : (
                                    <div>
                                      {p2pbankDataref.current && p2pbankDataref.current.Gpay_Number != undefined && p2pbankDataref.current.Gpay_Number != ""? (
                                        <div>
                                          <label>UPI ID</label>
                                          <p>
                                            {p2pbankDataref.current.Gpay_Number}
                                            <span>
                                              <i
                                                class="fas fa-copy"
                                                onClick={() =>
                                                  copy_to_clipboard(
                                                    "UPI ID",
                                                    p2pbankDataref.current.Gpay_Number
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

                                      {p2pbankDataref.current && p2pbankDataref.current.Paytm_Number !=
                                      undefined && p2pbankDataref.current.Paytm_Number !=
                                      ""? (
                                        <div>
                                          <label>Paytm</label>
                                          <p>
                                            {p2pbankDataref.current.Paytm_Number}
                                            <span>
                                              <i
                                                class="fas fa-copy"
                                                onClick={() =>
                                                  copy_to_clipboard(
                                                    "Paytm",
                                                    p2pbankDataref.current.Paytm_Number
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

{p2pbankDataref.current ? (
                                           <>
                                            <div>
                                            <label>Account Number</label>
                                            <p>
                                              {p2pbankDataref.current.Account_Number}
                                              <span>
                                                <i
                                                  class="fas fa-copy"
                                                  onClick={() =>
                                                    copy_to_clipboard(
                                                      "Account Number",
                                                      p2pbankDataref.current
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
                                                p2pbankDataref.current
                                                  .Accout_HolderName
                                              }
                                              <span>
                                                <i
                                                  class="fas fa-copy"
                                                  onClick={() =>
                                                    copy_to_clipboard(
                                                      "Account Holder",
                                                      p2pbankDataref.current
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
                                              {p2pbankDataref.current.Bank_Name}
                                              <span>
                                                <i
                                                  class="fas fa-copy"
                                                  onClick={() =>
                                                    copy_to_clipboard(
                                                      "Bank Name",
                                                      p2pbankDataref.current.Bank_Name
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
                                              {p2pbankDataref.current.Branch_Name}
                                              <span>
                                                <i
                                                  class="fas fa-copy"
                                                  onClick={() =>
                                                    copy_to_clipboard(
                                                      "Branch Name",
                                                      p2pbankDataref.current.Branch_Name
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
                                              {p2pbankDataref.current.IFSC_code}
                                              <span>
                                                <i
                                                  class="fas fa-copy"
                                                  onClick={() =>
                                                    copy_to_clipboard(
                                                      "IFSC Code",
                                                      p2pbankDataref.current.IFSC_code
                                                    )
                                                  }
                                                  style={{cursor: "pointer"}}
                                                ></i>
                                              </span>
                                            </p>
                                            </div>
                                            </>

                                      )
                                      :
                                      ("")}
                                    </div>
                                  )}
                                    </>
                                  ):("")}

                                  {profileDataref.current._id.toString() ==
                                  p2pDataref.current.userId.toString() && orderTyperef.current == "Buy" && confirmp2porderref.current != "" ? (
                                    <>
                                    <div>
                                    <label>Need to Pay</label>
                                    <h4 className="color-green">
                                      {parseFloat(confirmp2porderref.current.askAmount * p2pDataref.current.price).toFixed(2)}{" "}
                                      {p2pDataref.current.secondCurrnecy}
                                    </h4>
                                  </div>
                                  <div>
                                    <label>You will Get</label>
                                    <p>
                                      {confirmp2porderref.current.askAmount}{" "}
                                      {p2pDataref.current.firstCurrency}
                                    </p>
                                  </div>
                                  {p2pbankDataref.current ? (<h5>Seller Payment Methods</h5>) : ("")}
                                  {confirmp2porderref.current.length > 0 && p2pbankDataref.current == "" ? (
                                    ""
                                  ) : (
                                    <div>
                                      {p2pbankDataref.current && p2pbankDataref.current.Gpay_Number != undefined && p2pbankDataref.current.Gpay_Number != ""? (
                                        <div>
                                          <label>UPI ID</label>
                                          <p>
                                            {p2pbankDataref.current.Gpay_Number}
                                            <span>
                                              <i
                                                class="fas fa-copy"
                                                onClick={() =>
                                                  copy_to_clipboard(
                                                    "UPI ID",
                                                    p2pbankDataref.current.Gpay_Number
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

                                      {p2pbankDataref.current && p2pbankDataref.current.Paytm_Number !=
                                      undefined && p2pbankDataref.current.Paytm_Number !=
                                      ""? (
                                        <div>
                                          <label>Paytm</label>
                                          <p>
                                            {p2pbankDataref.current.Paytm_Number}
                                            <span>
                                              <i
                                                class="fas fa-copy"
                                                onClick={() =>
                                                  copy_to_clipboard(
                                                    "Paytm",
                                                    p2pbankDataref.current.Paytm_Number
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

{p2pbankDataref.current ? (
                                           <>
                                            <div>
                                            <label>Account Number</label>
                                            <p>
                                              {p2pbankDataref.current.Account_Number}
                                              <span>
                                                <i
                                                  class="fas fa-copy"
                                                  onClick={() =>
                                                    copy_to_clipboard(
                                                      "Account Number",
                                                      p2pbankDataref.current
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
                                                p2pbankDataref.current
                                                  .Accout_HolderName
                                              }
                                              <span>
                                                <i
                                                  class="fas fa-copy"
                                                  onClick={() =>
                                                    copy_to_clipboard(
                                                      "Account Holder",
                                                      p2pbankDataref.current
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
                                              {p2pbankDataref.current.Bank_Name}
                                              <span>
                                                <i
                                                  class="fas fa-copy"
                                                  onClick={() =>
                                                    copy_to_clipboard(
                                                      "Bank Name",
                                                      p2pbankDataref.current.Bank_Name
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
                                              {p2pbankDataref.current.Branch_Name}
                                              <span>
                                                <i
                                                  class="fas fa-copy"
                                                  onClick={() =>
                                                    copy_to_clipboard(
                                                      "Branch Name",
                                                      p2pbankDataref.current.Branch_Name
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
                                              {p2pbankDataref.current.IFSC_code}
                                              <span>
                                                <i
                                                  class="fas fa-copy"
                                                  onClick={() =>
                                                    copy_to_clipboard(
                                                      "IFSC Code",
                                                      p2pbankDataref.current.IFSC_code
                                                    )
                                                  }
                                                  style={{cursor: "pointer"}}
                                                ></i>
                                              </span>
                                            </p>
                                            </div>
                                            </>

                                      )
                                      :
                                      ("")}
                                    </div>
                                  )}
                                    </>
                                  ):("")}

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

                                {/* {orderTyperef.current == "Sell" &&
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
                                )} */}

                             {orderTyperef.current == "Sell" &&
                                profileDataref.current._id.toString() ==
                                  p2pDataref.current.userId.toString() &&
                                (p2pDataref.current.order_status == "pending" || p2pDataref.current.order_status == "confirmed" ) ? (
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

                                {orderTyperef.current == "Sell" &&
                                profileDataref.current._id.toString() !=
                                  p2pDataref.current.userId.toString() &&
                                  p2pDataref.current.filledAmount > 0 &&
                                  p2pDataref.current.order_status == "pending" ? (
                                  <div className="confirm_button_p2p">
                                    <Button
                                      className="confirm_p2p"
                                      data-toggle="modal"
                                      data-target="#confirm_p2p_sell"
                                    >
                                      Confirm Order
                                    </Button>
                                  </div>
                                ) : (
                                  ""
                                )}

                                {orderTyperef.current == "Buy" &&
                                profileDataref.current._id.toString() ==
                                  p2pDataref.current.userId.toString() &&
                                 p2pDataref.current.order_status == "pending" ? (
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

                                {orderTyperef.current == "Buy" &&
                                profileDataref.current._id.toString() !=
                                  p2pDataref.current.userId.toString() &&
                                  p2pDataref.current.filledAmount > 0 &&
                                  p2pDataref.current.order_status == "pending" ? (
                                  <div className="confirm_button_p2p">
                                    <Button
                                      className="confirm_p2p"
                                      data-toggle="modal"
                                      data-target="#confirm_p2p_buy"
                                    >
                                      Confirm Order
                                    </Button>
                                    =
                                  </div>
                                ) : (
                                  ""
                                )}

                                {orderTyperef.current == "Sell" &&
                                profileDataref.current._id.toString() ==
                                  p2pDataref.current.userId.toString() &&
                                p2pDataref.current.order_status == "paid" ? (
                                  <div className="confirm_button_p2p">
                                    <Button
                                      className="confirm_p2p"
                                      onClick={handleChange_confirm}
                                    >
                                      Confirm Release
                                    </Button>
                                    <Button
                                      className="confirm_p2p"
                                      data-toggle="modal"
                                      data-target="#raise_dispute_sell"
                                    >
                                      Raise Dispute
                                    </Button>
                                    {/* <Button
                                      className="confirm_p2p"
                                      onClick={handleChange_sellcancel}
                                    >
                                      Cancel
                                    </Button> */}
                                  </div>
                                ) : (
                                  ""
                                )}

                                {orderTyperef.current == "Sell" &&
                                profileDataref.current._id.toString() !=
                                  p2pDataref.current.userId.toString() &&
                                  confirmp2pcheckref.current.length > 0 && 
                                p2pDataref.current.order_status == "paid" ? (
                                  <div className="confirm_button_p2p">
                                    <Button
                                      className="confirm_p2p"
                                      onClick={handleChange_confirm}
                                    >
                                      Confirm Release
                                    </Button>
                                    <Button
                                      className="confirm_p2p"
                                      data-toggle="modal"
                                      data-target="#raise_dispute_sell"
                                    >
                                      Raise Dispute
                                    </Button>
                                    {/* <Button
                                      className="confirm_p2p"
                                      onClick={handleChange_sellcancel}
                                    >
                                      Cancel
                                    </Button> */}
                                  </div>
                                ) : (
                                  ""
                                )}

                                {orderTyperef.current == "Buy" &&
                                profileDataref.current._id.toString() ==
                                  p2pDataref.current.userId.toString() &&
                                p2pDataref.current.order_status ==
                                  "confirmed" ? (
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
                                  confirmp2pcheckref.current.length > 0 &&
                                p2pDataref.current.order_status ==
                                  "confirmed" ? (
                                  <div className="confirm_button_p2p">
                                    <Button
                                      className="confirm_p2p"
                                      onClick={handleChange_confirm}
                                    >
                                      Confirm Payment
                                    </Button>
                                    {/* <Button
                                      className="confirm_p2p"
                                      onClick={handleChange_buycancel}
                                    >
                                      Cancel
                                    </Button> */}
                                  </div>
                                ) : (
                                  ""
                                )}


                               {orderTyperef.current == "Buy" &&
                                profileDataref.current._id.toString() !=
                                  p2pDataref.current.userId.toString() &&
                                  (confirmp2pcheckref.current.length > 0 || confirmp2porderref.current != "")  && 
                                p2pDataref.current.order_status == "paid" ? (
                                  <div className="confirm_button_p2p">
                                    <Button
                                      className="confirm_p2p"
                                      data-toggle="modal"
                                      data-target="#raise_dispute_buy"
                                    >
                                      Raise Dispute
                                    </Button>
                                  </div>
                                ) : (
                                  ""
                                )}


                               {orderTyperef.current == "Buy" &&
                                profileDataref.current._id.toString() ==
                                  p2pDataref.current.userId.toString() &&
                                  (confirmp2pcheckref.current.length > 0 || confirmp2porderref.current != "") && 
                                p2pDataref.current.order_status == "paid" ? (
                                  <div className="confirm_button_p2p">
                                    <Button
                                      className="confirm_p2p"
                                      data-toggle="modal"
                                      data-target="#raise_dispute_buy"
                                    >
                                      Raise Dispute
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
                              {p2pDataref.current.order_status != "completed"? (
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
                                  {p2pfileref.current !="" ? (
                                    <img src={p2pfileref.current} height="30" width="30"/>
                                  ) : ("")}
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
                            <input type="text"  name="total"
                            value={total}
                            onChange={confirm_handleChange} />
                          </div>
                        </div>
                        <div className="submiot">
                            <Button
                              data-toggle="modal"
                              data-target="#launchpad_doce"
                              onClick={confirm_order_buy}
                            >
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

      <div id="confirm_p2p_sell" class="modal launchpad_doce fade" role="dialog">
        <div class="modal-dialog modal-dialog-centered ">
          <div class="modal-content">
            <div class="modal-body model_confirms">
              <h1> Confirm Order </h1>
              <form className="launch_card new_table  pt-5 tranbg">
                        <p className="balance">
                          {" "}
                          Your Wallet Balance: {(+p2pbalanceref.current).toFixed(8)} {p2pDataref.current.firstCurrency}
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
                            <input type="text"  name="total"
                            value={total}
                            onChange={confirm_handleChange} />
                          </div>
                        </div>
                        <div className="submiot">
                            <Button
                              data-toggle="modal"
                              data-target="#launchpad_doce"
                              onClick={confirm_order_sell}
                            >
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


      <div id="raise_dispute_buy" class="modal launchpad_doce fade" role="dialog">
        <div class="modal-dialog modal-dialog-centered ">
          <div class="modal-content">
            <div class="modal-body model_confirms">
              <h1> Raise Dispute </h1>
              <form className="launch_card new_table  pt-5 tranbg">
                        <div className="input_section">
                          <p>
                            <span>Reason for dispute</span>
                          </p>
                          <div className="input_select_s newbtind">
                            <input
                              type="text"
                              name="query"
                              value={disputequeryref.current}
                              onChange={dispute_handleChange}
                            />
                          </div>
                        </div>
                        <div className="input_section">
                          <p>
                            <span>Attachment</span>
                          </p>
                          <div className="input_select_s">
                          <input type="file" name="file" onChange={(e) => disputeUpload("file", e.target.files[0])}/>
                          </div>
                        </div>
                        <div className="submiot">
                            <Button
                              onClick={dispute_buy}
                            >
                              Submit
                            </Button>
                        </div>
                      </form>
          </div>
        </div>
      </div>
      </div>


      <div id="raise_dispute_sell" class="modal launchpad_doce fade" role="dialog">
        <div class="modal-dialog modal-dialog-centered ">
          <div class="modal-content">
            <div class="modal-body model_confirms">
              <h1> Raise Dispute </h1>
              <form className="launch_card new_table  pt-5 tranbg">
                        <div className="input_section">
                          <p>
                            <span>Reason for dispute</span>
                          </p>
                          <div className="input_select_s newbtind">
                            <input
                              type="text"
                              name="query"
                              value={disputequeryref.current}
                              onChange={dispute_handleChange}
                            />
                          </div>
                        </div>
                        <div className="input_section">
                          <p>
                            <span>Attachment</span>
                          </p>
                          <div className="input_select_s">
                          <input type="file" name="file" onChange={(e) => disputeUpload("file", e.target.files[0])}/>
                          </div>
                        </div>
                        <div className="submiot">
                            <Button
                              onClick={dispute_sell}
                            >
                              Submit
                            </Button>
                        </div>
                      </form>
          </div>
        </div>
      </div>
      </div>

    </div>
  );
}

export default Home;
