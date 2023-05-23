import React, {useState, useEffect} from "react";
import {Button} from "@material-ui/core";
import Count from "./Countdown";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import Slider, {Range} from "rc-slider";
import "rc-slider/assets/index.css";
import Header from "./Header";
import Footer from "./Footer";
import Arrow from "../img/ArrowRight.svg";
import glogo from "../img/google_logo.svg";
import profile_1 from "../img/profile_1.svg";

import profile_4 from "../img/profile_4.svg";
import profile_5 from "../img/profile_5.svg";
import profile_6 from "../img/profile_6.svg";

import {Link, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import apiService from "../core/service/detail";
import {postMethod} from "../core/service/common.api";
import {getMethod} from "../core/service/common.api";

import {
  setAuthToken,
  getAuthToken,
  removeAuthToken,
} from "../core/lib/localStorage";

import {setAuthorization, removeAuthorization} from "../core/service/axios";
import Moment from "moment";

function Home() {
  const options = ["one", "two", "three"];
  Moment.locale("en");

  const initialFormValue = {
    oldpassword: "",
    password: "",
    confirmPassword: "",
  };

  const [profileData, setprofileData] = useState("");
  const [sessionHistory, setsessionHistory] = useState([]);
  const [formValue, setFormValue] = useState(initialFormValue);
  const [passwordValidate, setpasswordValidate] = useState(false);
  const [confirmPasswordValidate, setconfirmPasswordValidate] = useState(false);
  const [oldpassworddValidate, setoldpassworddValidate,] = useState(false);
  const [validationnErr, setvalidationnErr] = useState("");
  const [oldpassvalidate, setoldpassvalidate] = useState(false);
  const [passconfNotmatch, setpassconfNotmatch] = useState(false);
  const [buttonLoader, setbuttonLoader] = useState(false);
  const [tfaDetails, setTfaDetails] = useState({});
  const [tfaCode, setTfaCode] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [addDetails, setaddDetails] = useState({});
  const [withdrawHistory, setwithdrawHistory] = useState([]);
  const [depositHistory, setdepositHistory] = useState([]);
  const [p2pOrders, setp2pOrders] = useState([]);
 
  const navigate = useNavigate();

  // /getUserDetails

  const {oldpassword, password, confirmPassword} = formValue;

  const handleChange = async (e) => {
    e.preventDefault();
    const {name, value} = e.target;
    let formData = {...formValue, ...{[name]: value}};
    setFormValue(formData);
    // validate(formData);
  };

  const getProfile = async () => {
    try {
      var data = {
        apiUrl: apiService.getUserDetails,
      };
      var resp = await getMethod(data);
      if (resp.status) {
        setprofileData(resp.data);
        console.log(resp.data);
        localStorage.setItem("eligibleforEarn", resp.data.kycstatus);
      }

      var data = {
        apiUrl: apiService.getSessionHisotry,
      };

      var resp = await getMethod(data);
      if (resp.status) {
        setsessionHistory(resp.data);
      }
      var data = {
        apiUrl: apiService.withdraw_history,
        payload: {FilPerpage: 5, FilPage: 1},
      };
      var withdraw_history_list = await postMethod(data);
      if (withdraw_history_list) {
        setwithdrawHistory(withdraw_history_list.result);
      }

      var obj = {
        apiUrl: apiService.deposit_history,
        payload: {FilPerpage: 5, FilPage: 1},
      };
      var deposit_history_list = await postMethod(obj);
      if (deposit_history_list) {
        setdepositHistory(deposit_history_list.result);
      }

      var data = {
        apiUrl: apiService.p2pOrders,
        payload: {FilPerpage: 5, FilPage: 1},
      };
      var p2p_orders_list = await postMethod(data);
      console.log("p2p_orders_list===", p2p_orders_list.returnObj.Message);
      if (p2p_orders_list.status) {
        setp2pOrders(p2p_orders_list.returnObj.Message);
      }
    } catch (error) {}
  };
 

  const validate = async (values) => {
    const errors = {};

    if (!values.oldpassword) {
      errors.oldpassword = "Old Password is a required field";
      setoldpassvalidate(true);
    }

    if (!values.password) {
      errors.password = "Password is a required field";
      setpasswordValidate(true);
    }

    if (!values.confirmPassword) {
      errors.confirmPassword = "Confirm password is a required field";
      setconfirmPasswordValidate(true);
    }

    if (
      values.password &&
      values.confirmPassword &&
      values.password !== values.confirmPassword
    ) {
      // errors.password = 'Password and confirm password does not match';
      errors.confirmPassword = "Password and confirm password does not match";
      setpassconfNotmatch(true);
    } else {
      setpassconfNotmatch(false);
    }

    setvalidationnErr(errors);
    return errors;
  };

  useEffect(() => {
    let token_socket = localStorage.getItem("user_token");
    if (!token_socket) {
      navigate("/login");
    }

    getProfile();
    fetchTfaData();
  }, [0]);

  const formSubmit = async (payload) => {
    console.log(formValue, "=-=--=--=-=-=-=-=-=-=-=-=-=-=-=");
    // return
    validate(formValue);
  
    if (

   
      formValue.oldpassword != "" &&
      formValue.password != "" &&
      formValue.confirmPassword != "" &&
      passconfNotmatch == false
    ) {
      // return false
      var obj = {
        oldPass: formValue.oldpassword,
        password: formValue.password,
        cpass: formValue.confirmPassword,
      };

      var data = {
        apiUrl: apiService.changePassword,
        payload: obj,
      };
      setbuttonLoader(true);
      var resp = await postMethod(data);
      console.log(resp.email);
      localStorage.setItem("useremail", resp.email);
      setbuttonLoader(false);
      if (resp.status) {
        toast(resp.Message);
        await removeAuthorization();
        await removeAuthToken();
        localStorage.clear();
        navigate("/");
        window.location.reload(true);
      } else {
        toast(resp.Message);
      }
    } else {
      // console.log("all field requird");
    }
  };

  const handleSubmit = async () => {
    setValidationErrors({});
    // return
    if (!tfaCode || tfaCode === "") {
      setValidationErrors({
        tfaCode: "2FA code is required",
      });
    } else {
      console.log(tfaDetails, "=--=tfaDetails");
      let tfaStatus = tfaDetails;
      // if (tfaDetails?.tfastatus == 0) {
      //   tfaStatus = 1;
      // }

      var data = {
        apiUrl: apiService.changeTfaStatus,
        payload: {
          userToken: tfaCode,
          tfaStatus: tfaStatus,
        },
      };
      var resp = await postMethod(data);
      if (resp.status) {
        toast(resp.Message);
        setTfaCode("");
        fetchTfaData();
        if (typeof resp?.errors !== "undefined") {
          const isErrorEmpty = Object.keys(resp?.errors).length === 0;
          if (!isErrorEmpty) {
            setValidationErrors(resp?.errors);
          }
        } else {
          console.log("hello");
          //  window.location.reload()
        }
      }
    }
  };

  const fetchTfaData = async () => {
    try {
      var data = {
        apiUrl: apiService.getTfaDetials,
      };
      var resp = await getMethod(data);
      console.log(resp.data.tfastatus, "--==-=resp-==-=-resp-=-");
      setTfaDetails(resp?.data.tfastatus);
      console.log(resp?.data);
      setaddDetails(resp?.data);
    } catch (error) {}
  };
 
  return (
    <div className="">
      <main className="main-content tradepage-bg inner_body_bg padin_button wallet_overview bg-covermain-content tradepage-bg login_body_ bg-cover">
        <Header />
        <div className="container">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 padin_zero">
            <div className="">
              <div className="row justify-center">
                <div className="col-lg-9">
                  <div className="">
                    <div className="container profile_section">
                      <div className="row">
                        <div className="col-lg-4">
                          <ul className="nav nav-tabs">
                            <li className="active">
                              <a
                                data-toggle="tab"
                                href="#home"
                                className="active"
                              >
                                <img src={profile_1} />
                                Profile
                              </a>
                            </li>
                            {/* <!-- <li><a data-toggle="tab" href="#menu1"><img src="../../assets/img/profile_2.svg" />Referrals</a></li>
                        <li><a data-toggle="tab" href="#menu2"><img src="../../assets/img/profile_3.svg" />API keys</a></li> --> */}
                            <li>
                              <a data-toggle="tab" href="#home2">
                                <img src={profile_4} />
                                Sessions & login history
                              </a>
                            </li>
                            <li>
                              <a data-toggle="tab" href="#transactiondeposit">
                                <img src={profile_5} />
                                Deposit History
                              </a>
                            </li>
                            <li>
                              <a data-toggle="tab" href="#transactionwith">
                                <img src={profile_5} />
                                Withdraw History
                              </a>
                            </li>
                            <li>
                              <a data-toggle="tab" href="#home1">
                                <img src={profile_5} />
                                2FA
                              </a>
                            </li>
                            <li>
                              <a data-toggle="tab" href="#menu2">
                                <img src={profile_6} />
                                Change password
                              </a>
                            </li>
                            <li>
                              <a data-toggle="tab">
                                <img src={profile_5} />
                                <Link to="/support"> Support </Link>
                              </a>
                            </li>
                            <li>
                              <a data-toggle="tab">
                                <img src={profile_5} />
                                <Link to="/launchnow"> Launchpad History </Link>
                              </a>
                            </li>

                            <li>
                              <a data-toggle="tab" href="#menu3">
                                <img src={profile_5} />
                                P2P Orders
                              </a>
                            </li>
                          </ul>
                        </div>
                        <div className="col-lg-8">
                          <div className="cars_bg_ss">
                            <div className="tab-content">
                              <div
                                id="home"
                                className="tab-pane fade in active show"
                              >
                                <div className="row">
                                  <div className="col-lg-6">
                                    {/* <div className="name_section_profile">
                                      <h1> Developer </h1>
                                      <button className="color_green">
                                        Level 2 verified
                                      </button>
                                    </div> */}
                                  </div>
                                  <div className="col-lg-6">
                                    <div className="select"></div>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-lg-12">
                                    <div className="futer_section">
                                      <h1> Profile Details </h1>
                                      {/* <p className="tilet_head">level 1</p> */}
                                      <div className="flex_container">
                                        <p>Username</p>
                                        <div>
                                          <span>
                                            {" "}
                                            {profileData &&
                                              profileData.firstname}{" "}
                                            {profileData.lastname}{" "}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="flex_container">
                                        <p>Email</p>
                                        <div>
                                          <span>
                                            {" "}
                                            {profileData &&
                                              profileData.email}{" "}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="flex_container">
                                        <p>Mobile</p>
                                        <div>
                                          <span>
                                            {" "}
                                            {profileData &&
                                              profileData.mobileNumber}{" "}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div id="home2" className="tab-pane fade in">
                                <div className="profile__wrapper">
                                  <div className="sessions">
                                    <div className="sessions__section">
                                      <div className="sessions__title">
                                        Login history
                                      </div>
                                      <div className="sessions__table">
                                        <div className="sessions__row">
                                          <div className="sessions__col">
                                            Date / time
                                          </div>
                                          <div className="sessions__col">
                                            IP address
                                          </div>
                                          <div className="sessions__col">
                                            Device
                                          </div>
                                        </div>

                                        {sessionHistory &&
                                          sessionHistory.map((item, i) => {
                                            return (
                                              <div className="sessions__row">
                                                <div className="sessions__col">
                                                  <div className="sessions__content">
                                                    {Moment(
                                                      item.createdDate
                                                    ).format(
                                                      "YYYY-MM-DD HH:mm:ss"
                                                    )}
                                                  </div>
                                                  <div className="sessions__note">
                                                    {/* {item.ipAddress} */}
                                                  </div>
                                                </div>
                                                <div className="sessions__col">
                                                  <div className="sessions__content">
                                                    {item.ipAddress}
                                                  </div>
                                                </div>
                                                <div className="sessions__col">
                                                  <div className="sessions__content">
                                                    {item.platform}
                                                  </div>
                                                </div>
                                              </div>
                                            );
                                          })}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div
                                id="transactiondeposit"
                                className="tab-pane fade in"
                              >
                                <div className="table-responsive transaction">
                                  <table className="table">
                                    <thead>
                                      <tr>
                                        <th scope="col">S.No</th>
                                        <th scope="col">Date</th>
                                        <th scope="col">Time</th>
                                        <th scope="col">Currency</th>
                                        <th scope="col">Amount</th>
                                        <th scope="col">Transaction Id</th>
                                        <th scope="col">Status</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {depositHistory &&
                                      depositHistory.length > 0 ? (
                                        depositHistory.map((item, i) => {
                                          return (
                                            <tr>
                                              <td>{i + 1}</td>
                                              <td>
                                                {Moment(item.date).format(
                                                  "YYYY-MM-DD"
                                                )}
                                              </td>
                                              <td>
                                                {Moment(item.date).format(
                                                  "HH:mm:ss"
                                                )}
                                              </td>
                                              <td>{item.currencySymbol}</td>
                                              <td>{parseFloat(item.amount).toFixed(8)}</td>
                                              <td>
                                                <span className="text_wrapaa">
                                                  {item.txnid}
                                                </span>
                                              </td>
                                              <td>
                                                <span className="text-green">
                                                  Completed
                                                </span>
                                              </td>
                                            </tr>
                                          );
                                        })
                                      ) : (
                                        <td colSpan="7">
                                          <span className="w-100 text-center d-block">
                                            No Deposit History Found!
                                          </span>
                                        </td>
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                              <div
                                id="transactionwith"
                                className="tab-pane fade in"
                              >
                                <div className="table-responsive transaction">
                                  <table className="table">
                                    <thead>
                                      <tr>
                                        <th scope="col">S.No</th>
                                        <th scope="col">Date</th>
                                        <th scope="col">Time</th>
                                        <th scope="col">Currency</th>
                                        <th scope="col">Amount</th>
                                        <th scope="col">Transaction Id</th>
                                        <th scope="col">Status</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {withdrawHistory &&
                                      withdrawHistory.length > 0 ? (
                                        withdrawHistory.map((item, i) => {
                                          return (
                                            <tr>
                                              <td>{i + 1}</td>
                                              <td>
                                                {Moment(item.created_at).format(
                                                  "YYYY-MM-DD"
                                                )}
                                              </td>
                                              <td>
                                                {Moment(item.created_at).format(
                                                  "HH:mm:ss"
                                                )}
                                              </td>
                                              <td>{item.currency}</td>
                                              <td>{parseFloat(item.amount).toFixed(8)}</td>
                                              <td>
                                                <span className="text_wrapaa">
                                                  {item.txn_id}
                                                </span>
                                              </td>
                                              <td>
                                                {item.status == "Completed" ? (
                                                  <span className="text-green">
                                                    {item.status}
                                                  </span>
                                                ) : (
                                                  ""
                                                )}
                                                {item.status !== "Completed" ? (
                                                  <span className="text-red">
                                                    {item.status}
                                                  </span>
                                                ) : (
                                                  ""
                                                )}
                                              </td>
                                            </tr>
                                          );
                                        })
                                      ) : (
                                        <td colSpan="7">
                                          <span className="w-100 text-center d-block">
                                            No Withdraw History Found!
                                          </span>
                                        </td>
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>

                              {/* //----------2FA-----------------------// */}

                              <div id="home1" className="tab-pane fade in">
                                <div className="row">
                                  <div className="col-lg-12">
                                    <div className="security__title h3">
                                      2FA <span>Disabled</span>
                                    </div>
                                    <div className="security__text">
                                      If you want to turn off 2FA, input your
                                      account password and the six-digit code
                                      provided by the Google Authenticator app
                                      below, then click{" "}
                                      <span>"Disable 2FA"</span>.
                                    </div>
                                    <div className="security__subtitle">
                                      {" "}
                                      Enable 2FA{" "}
                                    </div>
                                    <div className="security__info">
                                      Enter the six-digit code provided by the
                                      Google Authenticator app to Disable the
                                      2FA verification{" "}
                                    </div>
                                    <div className="security__email">
                                      <i
                                        className="far fa-envelope icon icon-email"
                                        aria-hidden="true"
                                      ></i>{" "}
                                      {profileData && profileData.email}{" "}
                                    </div>
                                    <div className="security__form">
                                      <form className="sign-up form row flex_form_clas ml-auto mr-auto">
                                        <div className="security__row">
                                          <div className="field field_view">
                                            <div className="field__label">
                                              2FA code
                                            </div>
                                            <div className="field__wrap">
                                              <input
                                                type="number"
                                                id="tfa_code"
                                                aria-describedby="emailHelp"
                                                required=""
                                                placeholder="TFA Code"
                                                className="field__input"
                                                name="tfaCode"
                                                value={tfaCode}
                                                onChange={(e) =>
                                                  setTfaCode(e.target.value)
                                                }
                                              />
                                            </div>
                                            {validationErrors.tfaCode && (
                                              <p className="text-danger">
                                                {" "}
                                                {validationErrors.tfaCode}{" "}
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                        {tfaDetails === 0 ? (
                                          <div className="field field_11">
                                            <div className="field__wrap">
                                              <img
                                                alt=""
                                                src={addDetails?.tfa_url}
                                              />
                                            </div>
                                          </div>
                                        ) : (
                                          ""
                                        )}
                                        <span className="w-100 d-flex">
                                          <button
                                            type="button"
                                            className="button-red security__button button_www button_margud"
                                            onClick={handleSubmit} >
                                            {tfaDetails === 0
                                              ? "Enable 2FA"
                                              : "Disable 2FA"}{" "}
                                          </button>
                                        </span>
                                      </form>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div id="menu2" className="tab-pane fade">
                                <div className="change_password_section">
                                  <h1>New password</h1>
                                  <div className="register_login">
                                    <form>
                                      <div className="form-group">
                                        <label>Old Password</label>
                                        <input
                                         type="password"
                                          name="oldpassword"
                                          required=""
                                          id="exampleInputPassword1"
                                          placeholder="Old password"
                                          className="form-control"
                                          value={oldpassword}
                                          onChange={handleChange}
                                        />
                                         
                                        <div>
                                          {oldpassvalidate == true ? (
                                            <p className="text-danger">
                                              {" "}
                                              {validationnErr.oldpassword}{" "}
                                            </p>
                                          ) : (
                                            ""
                                          )}
                                        </div>
                                      </div>
                                      <div className="form-group">
                                        <label>new password</label>
                                        <input
                                        type="password"
                                          name="password"
                                          required=""
                                          id="exampleInputPassword1"
                                          placeholder="New password"
                                          className="form-control"
                                          value={password}
                                          onChange={handleChange}
                                        />
                                        
                                        <div>
                                          {passwordValidate == true ? (
                                            <p className="text-danger">
                                              {" "}
                                              {validationnErr.password}{" "}
                                            </p>
                                          ) : (
                                            ""
                                          )}
                                        </div>
                                      </div>
                                      <div className="form-group">
                                        <label>confirm password</label>
                                        <input
                                          type="password"
                                          required=""
                                          id="exampleInputPassword1"
                                          placeholder="confirm password"
                                          className="form-control"
                                          name="confirmPassword"
                                          value={confirmPassword}
                                          onChange={handleChange}
                                        />
                                        
                                        <div>
                                          {confirmPasswordValidate == true ? (
                                            <p className="text-danger">
                                              {" "}
                                              {
                                                validationnErr.confirmPassword
                                              }{" "}
                                            </p>
                                          ) : (
                                            ""
                                          )}
                                        </div>
                                      </div>
                                      <span>
                                        {buttonLoader == false ? (
                                          <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={formSubmit}
                                          >
                                            Submit
                                          </button>
                                        ) : (
                                          <button
                                            type="button"
                                            className="btn btn-primary"
                                          >
                                            loading...
                                          </button>
                                        )}
                                        {/* <button className="btn btn-primary w-100">
                                          Submit
                                        </button> */}
                                      </span>
                                    </form>
                                  </div>
                                </div>
                              </div>

                              <div id="menu3" className="tab-pane fade in">
                                <div className="table-responsive transaction">
                                  <table className="table">
                                    <thead>
                                      <tr>
                                        <th scope="col">S.No</th>
                                        <th scope="col">Date</th>
                                        <th scope="col">Time</th>
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
                                          return (
                                            <tr>
                                              <td>{i + 1}</td>
                                              <td>
                                                {Moment(item.created_at).format(
                                                  "YYYY-MM-DD"
                                                )}
                                              </td>
                                              <td>
                                                {Moment(item.created_at).format(
                                                  "HH:mm:ss"
                                                )}
                                              </td>
                                              <td>{item.firstCurrency}</td>
                                              <td>{parseFloat(item.totalAmount).toFixed(8)}</td>
                                              <td>{item.price}</td>
                                              <td>
                                                {item.orderType == "buy" ? (
                                                  <span className="text-green">
                                                    Buy
                                                  </span>
                                                ) : (
                                                  <span className="text-red">
                                                    Sell
                                                  </span>
                                                )}
                                              </td>
                                              <td>
                                                {item.status == "filled" ? (
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
                                                )}
                                              </td>
                                            </tr>
                                          );
                                        })
                                      ) : (
                                        <td colSpan="8">
                                          <span className="w-100 text-center d-block">
                                            No Orders Found!
                                          </span>
                                        </td>
                                      )}
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
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
