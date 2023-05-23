import React, { useEffect } from "react";
import useState from "react-usestateref";
import { Button } from "@material-ui/core";
import Count from "./Countdown";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import Slider, { Range } from "rc-slider";
import "rc-slider/assets/index.css";
import Header from "./Header";
import Footer from "./Footer";
import Arrow from "../img/ArrowRight.svg";
import glogo from "../img/google_logo.svg";
import profile_1 from "../img/profile_1.svg";
import Pagination from "react-js-pagination";

import profile_4 from "../img/profile_4.svg";
import profile_5 from "../img/profile_5.svg";
import profile_6 from "../img/profile_6.svg";
import moment from "moment"
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiService from "../core/service/detail";
import { postMethod } from "../core/service/common.api";
import { getMethod } from "../core/service/common.api";

import {
  setAuthToken,
  getAuthToken,
  removeAuthToken,
} from "../core/lib/localStorage";

import { setAuthorization, removeAuthorization } from "../core/service/axios";
import Moment from "moment";

function Home() {
  const options = ["one", "two", "three"];
  Moment.locale("en");

  const initialFormValue = {
    oldpassword: "",
    password: "",
    confirmPassword: "",
  };
  const profileForm = {
    email: "",
    username: "",
    mobileNumber: "",
  };

  const handlePageChange = pageNumber => {
    postProfile(pageNumber);
    setCurrentPage(pageNumber);
  }

  const recordPerPage = 5;
  const totalRecords = 15;
  const pageRange = 5;

  const [profileData, setprofileData] = useState("");
  const [sessionHistory, setsessionHistory] = useState([]);
  const [formValue, setFormValue] = useState(initialFormValue);
  const [oldpassworddValidate, setoldpassworddValidate] = useState(false);
  const [validationnErr, setvalidationnErr] = useState("");
  const [passconfNotmatch, setpassconfNotmatch] = useState(false);
  const [buttonLoader, setbuttonLoader] = useState(false);
  const [loaderButton, setloaderButton] = useState(false);

  const [tfaDetails, setTfaDetails] = useState({});
  const [tfaCode, setTfaCode] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [addDetails, setaddDetails] = useState({});
  const [withdrawHistory, setwithdrawHistory] = useState([]);
  const [depositHistory, setdepositHistory] = useState([]);
  const [p2pOrders, setp2pOrders] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalpages] = useState(0);

  const [records, setrecords] = useState([]);

  const [p2pcurrentpage, setp2pcurrentpage] = useState(1)
  const [p2ptotalpage, setp2pTotalpages] = useState(0);

  const [depositcurrentpage, setdepositcurrentpage] = useState(1)
  const [deposittotalpage, setdepositTotalpages] = useState(0);

  const [withdrawcurrentpage, setwithdrawcurrentpage] = useState(1)
  const [withdrawtotalpage, setwithdrawTotalpages] = useState(0);

  const [launchtotalpage, setlaunchtotalpage] = useState(0);
  const [launchcurrentpage, setlaunchcurrentpage] = useState(1)

  const [p2porderHistory, setp2porderHistory] = useState([]);
  const [p2phistorycurrentpage, setp2phistorycurrentpage] = useState(1)
  const [p2phistorytotalpage, setp2phistoryTotalpages] = useState(0);

  const [passwordValidate, setpasswordValidate, passwordValidateref] = useState(false);
  const [confirmPasswordValidate, setconfirmPasswordValidate, confirmPasswordValidateref] = useState(false);
  const [oldpassvalidate, setoldpassvalidate, oldpassvalidateref] = useState(false);
  const [passHide, setPasshide] = useState(false);
  const [inputType, setinputType] = useState('password');
  const [passHidconf, setPasshideconf] = useState(false);
  const [inputTypeconf, setinputTypeconf] = useState('password');
  const [passHidnew, setPasshidenew] = useState(false);
  const [inputTypenew, setinputTypenew] = useState('password');

  const [profileformValue, setprofileFormValue] = useState(profileForm);

  const { email, username, mobileNumber } = profileformValue;

  const [usernamevalidate, setusernamevalidate, usernamevalidateref] = useState(false);
  const [mobilevalidate, setmobilevalidate, mobilevalidateref] = useState(false);
  const [profileLoader, setprofileLoader] = useState(false);
  const navigate = useNavigate();
  const [notification,Setnotification]=useState([]);
  const [notifyCurrentPage,setnotifyCurrentPage]=useState()
  const[notifytotalpage,Setnotifytotalpage]=useState(0);


  // /getUserDetails

  const { oldpassword, password, confirmPassword } = formValue;




  const handleChange = async (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    let formData = { ...formValue, ...{ [name]: value } };
    setFormValue(formData);
    // validate(formData);
  };
  const handleChange_profile = async (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    let formData = { ...profileformValue, ...{ [name]: value } };
    setprofileFormValue(formData);
    // validate(formData);
  };


  const profile_validate = async (values) => {
    const errors = {};
    if (values.username == "") {
      setusernamevalidate(true)
      errors.username = "username is required"
    }
    else {
      setusernamevalidate(false)
      errors.username = ""
    }

    if (values.mobileNumber == "") {
      errors.mobileNumber = "Mobile Number is a required field";
      setmobilevalidate(true);
    }
    else {
      setmobilevalidate(false);
      errors.mobileNumber = "";
    }
    setvalidationnErr(errors);
    return errors;
  };


  const postProfile = async (page) => {
    try {
      var payload = {
        perpage: 5,
        page: page
      }
      var data = {
        apiUrl: apiService.getUserDetails,
      };
      var resp = await getMethod(data);
      if (resp.status) {
        setprofileData(resp.data);

        profileformValue.username = resp.data.username;
        profileformValue.email = resp.data.email;
        profileformValue.mobileNumber = resp.data.mobileNumber;
        console.log(resp.data);

        localStorage.setItem("eligibleforEarn", resp.data.kycstatus);
        localStorage.setItem("tfa_status", resp.data.tfastatus);
      }

      var data = {
        apiUrl: apiService.getSessionHisotry,
        payload: payload
      };
      var resp = await postMethod(data);
      if (resp.status) {
        setsessionHistory(resp.data.data);
        setTotalpages(resp.data.total);
      }
      // var data = {
      //   apiUrl: apiService.withdraw_history,
      //   payload: { FilPerpage: 5, FilPage: 1 },
      // };
      // var withdraw_history_list = await postMethod(data);
      // if (withdraw_history_list) {
      //   setwithdrawHistory(withdraw_history_list.result);
      // }

      // var obj = {
      //   apiUrl: apiService.deposit_history,
      //   payload: { FilPerpage: 5, FilPage: 1 },
      // };
      // var deposit_history_list = await postMethod(obj);
      // if (deposit_history_list) {
      //   setdepositHistory(deposit_history_list.result);
      // }

      // var data = {
      //   apiUrl: apiService.p2pOrders,
      //   payload: { FilPerpage: 5, FilPage: 1 },
      // };
      // var p2p_orders_list = await postMethod(data);
      // if (p2p_orders_list.status) {
      //   setp2pOrders(p2p_orders_list.returnObj.Message);
      // }
    } catch (error) { }
  };


  const getdepositHistory = async (page) => {
    var obj = {
      apiUrl: apiService.deposit_history,
      payload: { FilPerpage: 5, FilPage: page },
    };
    var deposit_history_list = await postMethod(obj);
    if (deposit_history_list) {
      setdepositHistory(deposit_history_list.result);
      setdepositTotalpages(deposit_history_list.pages);
    }
  }

  const depositrecordpage = 5;
  const depositpagerange = 5;
  const handlepagedeposit = (page) => {
    console.log(page, "==-=-=-p2ppage==-==-=")
    getdepositHistory(page);
    setdepositcurrentpage(page)
  }


  const getwithdrawHistory = async (page) => {
    var data = {
      apiUrl: apiService.withdraw_history,
      payload: { FilPerpage: 5, FilPage: page },
    };
    var withdraw_history_list = await postMethod(data);
    if (withdraw_history_list) {
      setwithdrawHistory(withdraw_history_list.result);
      setwithdrawTotalpages(withdraw_history_list.pages);
    }
  }

  const withdrawrecordpage = 5;
  const withdrawpagerange = 5;
  const handlepagewithdraw = (page) => {
    console.log(page, "==-=-=-p2ppage==-==-=")
    getwithdrawHistory(page);
    setwithdrawcurrentpage(page)
  }


  const getp2pOrders = async (page) => {
    var data = {
      apiUrl: apiService.p2pOrders,
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

  const getp2pHistory = async (page) => {
    var data = {
      apiUrl: apiService.p2pHistory,
      payload: { FilPerpage: 5, FilPage: page },
    };
    var p2p_orders_history = await postMethod(data);
    console.log("p2p_orders_history===", p2p_orders_history.returnObj.Message);
    if (p2p_orders_history.status) {
      setp2porderHistory(p2p_orders_history.returnObj.Message);
      setp2phistoryTotalpages(p2p_orders_history.returnObj.total);
    }
  }

  const p2phistoryrecordpage = 5;
  const p2phistorypagerange = 5;
  const handlepagep2p_history = (p2ppage) => {
    console.log(p2ppage, "==-=-=-p2ppage==-==-=")
    getp2pHistory(p2ppage);
    setp2phistorycurrentpage(p2ppage)
  }



  const getLaunchpadHisoty = async (page) => {
    try {
      var payload = {
        perpage: 5,
        page: page,
      };
      console.log(payload, "-=-=paylaod=-=-=");
      var data = {
        apiUrl: apiService.lauchPadHistory,
        payload: payload,

      };
      console.log(data, "-=-=data-=-=");
      var resp = await postMethod(data);
      console.log(resp, "--=-=--");
      if (resp) {
        console.log(resp, "--=-=--");
        var data = resp.data.data;
        console.log(data, "--===data======-")
        setrecords(data);
        var datas = resp.data.total;
        console.log(datas, "-=-=datas-=-=-");
        setlaunchtotalpage(datas);
        console.log(resp.data.total, "-=-=-=data.total=-=-=");

      }
    } catch (error) {
      console.log(error, "-=-=-=error=-=-=");
    }
  };

  const launchrecordpage = 5;
  const launchpagerange = 5;
  const handlepage = (launchpage) => {
    console.log(launchpage, "==-=-=-launchpage==-==-=")
    getLaunchpadHisoty(launchpage);
    setlaunchcurrentpage(launchpage)
  }


  const validate = async (values) => {
    const errors = {};
    if (values.oldpassword == "") {
      errors.oldpassword = "old Password is required"
      setoldpassvalidate(true);
    } else if (values.oldpassword == values.password) {
      errors.oldpassword = "oldPassword and newpasswords are same"
      setoldpassvalidate(true);
    } else {
      setoldpassvalidate(false);
    }


    if (values.password == "") {
      setpasswordValidate(true)
      errors.password = "password is required"
    } else if (values.password.length < 8 ||
      values.password.length > 45) {
      setpasswordValidate(true)
      errors.password = "newPassword is required and shouldnot below 8 above 45letters"
    } else if (!values.password.match(/[a-z]/g)) {
      setpasswordValidate(true)
      errors.password = "Please enter at least lower character"
    } else if (!values.password.match(/[A-Z]/g)) {
      setpasswordValidate(true)
      errors.password = "Please enter at least upper character"
    } else if (!values.password.match(/[0-9]/g)) {
      setpasswordValidate(true)
      errors.password = "Please enter atone digit character"
    } else {
      setpasswordValidate(false)
    }


    if (values.confirmPassword == "") {
      errors.confirmPassword = "Confirm password is a required field";
      setconfirmPasswordValidate(true);
    } else if (values.confirmPassword != values.password) {
      setconfirmPasswordValidate(true);
      errors.confirmPassword = "Password and confirm password does not match";
    }
    else {
      setconfirmPasswordValidate(false);
    }
    setvalidationnErr(errors);
    return errors;
  };
  useEffect(() => {
    let token_socket = localStorage.getItem("user_token");
    if (!token_socket) {
      navigate("/login");
    }
    postProfile();
    notify();
    fetchTfaData();
    getLaunchpadHisoty();
    getp2pOrders(1)
    getdepositHistory(1)
    getwithdrawHistory(1)
    getp2pHistory(1)
  }, [0]);



  const formSubmit = async () => {
    console.log(formValue, "=-=--=--=-=-=-=-=-=-=-=-=-=-=-=");
    // return
    validate(formValue);
    console.log(confirmPasswordValidateref.current, '==-=-=-=-cpmfirmpasswordValidate=-==-=-==-')
    console.log(passwordValidateref.current, '==-=-=-=-oldpassvalidate=-==-=-==-')
    console.log(passwordValidateref.current, '==-=-=-=-passwordValidateref=-==-=-==-')
    if (
      confirmPasswordValidateref.current == false &&
      passwordValidateref.current == false &&
      oldpassvalidateref.current == false
    ) {
      console.log('==-=-=-=-if=-==-=-==-')
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
      console.log(data, "====data===");
      setbuttonLoader(true);
      var resp = await postMethod(data);
      console.log(resp);
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
      // toast("InvalidDetails")
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
      setloaderButton(true);
      var resp = await postMethod(data);


      if (resp.status) {
        setloaderButton(false);
        toast.success(resp.Message);
        setTfaCode("");
        fetchTfaData();
        postProfile();
        if (typeof resp?.errors !== "undefined") {
          const isErrorEmpty = Object.keys(resp?.errors).length === 0;
          if (!isErrorEmpty) {
            setValidationErrors(resp?.errors);
          }
        } else {
          //  window.location.reload()
        }
      } else {
        setloaderButton(false);
        toast.error(resp.Message);

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
    } catch (error) { }
  };
  const passwordHide = (data) => {
    if (data == "hide") {
      setPasshide(true);
      setinputType("text");
    } else {
      setPasshide(false);
      setinputType("password");
    }
  }

  const passwordHideconf = (data) => {
    if (data == "hide") {
      setPasshideconf(true);
      setinputTypeconf("text");
    } else {
      setPasshideconf(false);
      setinputTypeconf("password");
    }
  }

  const passwordHidenewP = (data) => {
    if (data == "hide") {
      setPasshidenew(true);
      setinputTypenew("text");
    } else {
      setPasshidenew(false);
      setinputTypenew("password");
    }
  }
  // const profileSubmit=async(payload)=>{
  //   console.log(formValue, "=-=--=--=-=-=-=-=-=-=-=-=-=-=-=");
  //   profile_validate(formValue)
  //   if(usernamevalidateref.current==false&&
  //     mobilevalidateref.current==false){
  //       var obj={
  //         username:profileformvalue.username,
  //         mobileNumber:profileformvalue.mobileNumber
  //       };
  //       var data ={
  //         apiurl:apiService.update_profile,
  //         payload:obj
  //       }
  //       setprofileLoader(true);
  //       var resp= await postMethod(data)
  //     if(resp.status){
  //       setprofileLoader(false);
  //       toast.success(resp.Message)
  //     }else{
  //       toast.error(resp.Message)
  //     }

  //     }
  // }
  // const getProfile = async (page) => {
  //   try {
  //     var data = {
  //       apiUrl: apiService.getUserDetails,
  //     };
  //     var resp = await getMethod(data);
  //     if (resp.status) {
  //       setprofileData(resp.data);
  //       profileformValue.username = resp.data.username;
  //       profileformValue.email = resp.data.email;
  //       profileformValue.mobileNumber = resp.data.mobileNumber;
  //        console.log(resp.data);
  //       localStorage.setItem("eligibleforEarn", resp.data.kycstatus);
  //     }

  //     var payload = {
  //       perpage: 5,
  //       page: page,
  //     };
  //     var data = {
  //       apiUrl: apiService.getSessionHisotry,
  //       payload: payload,
  //     };

  //     var resp = await postMethod(data);
  //     //console.log(resp, "|||||||||||||||");
  //     if (resp.status) {
  //       setsessionHistory(resp.data.data);
  //       setTotalpages(resp.data.total);
  //     }



  //   } catch (error) { }
  // };
  const profileSubmit = async (payload) => {
    console.log(formValue, "=-=--=--=-=-=-=-=-=-=-=-=-=-=-=");
    // return
    profile_validate(formValue);
    if (
      usernamevalidateref.current == false &&
      mobilevalidateref.current == false
    ) {
      var obj = {
        username: profileformValue.username,
        mobileNumber: profileformValue.mobileNumber
      };

      var data = {
        apiUrl: apiService.update_profile,
        payload: obj,
      };
      console.log(data, "====data===");
      setprofileLoader(true);
      var resp = await postMethod(data);
      if (resp.status) {
        setprofileLoader(false);
        toast.success(resp.message);
        postProfile();
      } else {
        toast.error(resp.message);
      }
    } else {
      // toast.error("Invalid fields");
    }
  };
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

  const navpage = async (link) => {
      navigate("/p2p/view/"+link);
  };

  const navchatpage = async (link) => {
    navigate(link);
};
  return (
    <div className="">
      <main className="main-content tradepage-bg inner_body_bg padin_button wallet_overview bg-covermain-content tradepage-bg login_body_ bg-cover">
        {/* <Header /> */}
        <div className="container p-0">
          <div className="">
            <div className="">
              <div className="row justify-center">
                <div className="col-lg-12">
                  <div className="">
                    <div className="container profile_section m-0">
                      <div className="row">
                        <div className="col-lg-4">
                          <ul className="nav nav-tabs">
                          <li className="heading_mwmu"><h4>Settings</h4></li>
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
                            <li>
                              <a data-toggle="tab" href="#menu5">
                                <img src={profile_1} />
                                Edit Profile
                              </a>
                            </li>
                            <li>
                              <a data-toggle="tab">
                                <img src={profile_5} />
                                <Link to="/kyc"> KYC </Link>
                              </a>
                            </li>
                      
                            {/* <li>
                              <a data-toggle="tab" >
                                <img src={profile_5} />
                                <Link to="/Bankdetails"> Payment Methods</Link>
                              </a>
                            </li> */}
                            <li className="heading_mwmu"><h4>Account Security</h4></li>
                            <li>
                              <a data-toggle="tab" href="#home1">
                                <img src={profile_5} />
                                2FA
                              </a>
                            </li>
                            {/* <!-- <li><a data-toggle="tab" href="#menu1"><img src="../../assets/img/profile_2.svg" />Referrals</a></li>
                        <li><a data-toggle="tab" href="#menu2"><img src="../../assets/img/profile_3.svg" />API keys</a></li> --> */}
                            <li>
                              <a data-toggle="tab" href="#menu2">
                                <img src={profile_6} />
                                Change password
                              </a>
                            </li>
                            <li className="heading_mwmu"><h4>Help</h4></li>
                            <li>
                              <a data-toggle="tab">
                                <img src={profile_5} />
                                <Link to="/support"> Support </Link>
                              </a>
                            </li>

                            {/* <li>
                              <a data-toggle="tab" href="#menu1">
                                <img src={profile_4} />
                               Notifications
                              </a>
                            </li> */}
                            <li className="heading_mwmu"><h4>History</h4></li>
                            
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
                            {/* <li>
                              <a data-toggle="tab" href="#LaunchpadHistory">
                                <img src={profile_5} />
                                {" "}
                                Launchpad History{" "}
                              </a>
                            </li>

                            <li>
                              <a data-toggle="tab" href="#menu3">
                                <img src={profile_5} />
                                P2P My Orders
                              </a>
                            </li>

                            <li>
                              <a data-toggle="tab" href="#menu4">
                                <img src={profile_5} />
                                P2P History
                              </a>
                            </li> */}

                            <li>
                              <a data-toggle="tab" href="#home2">
                                <img src={profile_4} />
                                Sessions & login history
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
                                              profileData.username}{" "}
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
                                            S.No
                                          </div>
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

                                        {

                                          sessionHistory.length > 0 ?
                                            sessionHistory &&
                                            sessionHistory.map((item, i) => {
                                              return (
                                                <div className="sessions__row">
                                                  <div className="sessions__note">
                                                    {i + 1}
                                                  </div>
                                                  <div className="sessions__col">

                                                    <div className="sessions__content">

                                                      {moment(item.createdDate).format("lll")}
                                                    </div>

                                                  </div>
                                                  <div className="sessions__col">
                                                    <div className="sessions__content">
                                                      {item.ipAddress}
                                                    </div>
                                                  </div>
                                                  <div className="sessions__col">
                                                    <div className="sessions__content">
                                                      {item.device}
                                                    </div>
                                                  </div>
                                                </div>
                                              );
                                            }) :

                                            <p colSpan="5" >No data found</p>

                                        }

                                      </div>
                                      <Pagination
                                        itemClass="page-item" // add it for bootstrap 4
                                        linkClass="page-link" // add it for bootstrap 4
                                        activePage={currentPage}
                                        itemsCountPerPage={recordPerPage}
                                        totalItemsCount={totalPage}
                                        pageRangeDisplayed={pageRange}
                                        onChange={handlePageChange}
                                      />
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
                                              <td>
                                                {parseFloat(
                                                  item.amount
                                                ).toFixed(8)}
                                              </td>
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
                                <Pagination
                                  itemClass="page-item" // add it for bootstrap 4
                                  linkClass="page-link" // add it for bootstrap 4
                                  activePage={depositcurrentpage}
                                  itemsCountPerPage={depositrecordpage}
                                  totalItemsCount={deposittotalpage}
                                  pageRangeDisplayed={depositpagerange}
                                  onChange={handlepagedeposit}
                                />
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
                                              <td>
                                                {parseFloat(
                                                  item.amount
                                                ).toFixed(8)}
                                              </td>
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
                                <Pagination
                                  itemClass="page-item" // add it for bootstrap 4
                                  linkClass="page-link" // add it for bootstrap 4
                                  activePage={withdrawcurrentpage}
                                  itemsCountPerPage={withdrawrecordpage}
                                  totalItemsCount={withdrawtotalpage}
                                  pageRangeDisplayed={withdrawpagerange}
                                  onChange={handlepagewithdraw}
                                />
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
                                          {loaderButton == false ? (
                                            <button
                                              type="button"
                                              className="button-red security__button button_www button_margud"
                                              onClick={handleSubmit}
                                            >
                                              {tfaDetails === 0
                                                ? "Enable 2FA"
                                                : "Disable 2FA"}{" "}
                                            </button>
                                          ) : (
                                            <button
                                              type="button"
                                              className="button-red security__button button_www button_margud"
                                            >
                                              loading...
                                            </button>
                                          )}
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
                                        <div className="postion_reletitt">
                                          <input
                                            type={inputType}
                                            name="oldpassword"
                                            required=""
                                            id="exampleInputPassword1"
                                            placeholder="Old password"
                                            className="form-control"
                                            value={oldpassword}
                                            onChange={handleChange}
                                          />
                                          <div className="input-group-addon"  >
                                            {
                                              passHide == false ?
                                                <i className="bi bi-eye-slash-fill" onClick={() => passwordHide('hide')} ></i>
                                                :
                                                <i className="bi bi-eye-fill" onClick={() => passwordHide('show')} ></i>

                                            }
                                          </div>
                                        </div>
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
                                        <label>New password</label>
                                        <div className="postion_reletitt">
                                          <input
                                            type={inputTypenew}
                                            name="password"
                                            required=""
                                            id="exampleInputPassword1"
                                            placeholder="New password"
                                            className="form-control"
                                            value={password}
                                            onChange={handleChange}
                                          />
                                          <div className="input-group-addon"  >
                                            {
                                              passHidnew == false ?
                                                <i className="bi bi-eye-slash-fill" onClick={() => passwordHidenewP('hide')} ></i>
                                                :
                                                <i className="bi bi-eye-fill" onClick={() => passwordHidenewP('show')} ></i>

                                            }
                                          </div>
                                        </div>

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
                                        <label>Confirm password</label>
                                        <div className="postion_reletitt">
                                          <input
                                            type={inputTypeconf}
                                            required=""
                                            id="exampleInputPassword1"
                                            placeholder="Confirm password"
                                            className="form-control"
                                            name="confirmPassword"
                                            value={confirmPassword}
                                            onChange={handleChange}
                                          />

                                          <div className="input-group-addon"  >
                                            {
                                              passHidconf == false ?
                                                <i className="bi bi-eye-slash-fill" onClick={() => passwordHideconf('hide')} ></i>
                                                :
                                                <i className="bi bi-eye-fill" onClick={() => passwordHideconf('show')} ></i>

                                            }
                                          </div>
                                        </div>
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

                              <div
                                id="LaunchpadHistory"
                                className="tab-pane fade in"
                              >
                                {/* <Launchhistory /> */}
                                <div className="table-responsive transaction">
                                  <table className="table">
                                    <thead>
                                      <tr>
                                        <th scope="col">S.No</th>
                                        <th scope="col">Currency</th>
                                        <th scope="col">Total Amount</th>
                                        <th scope="col">Purchase ID</th>
                                        <th scope="col">Fees</th>
                                        <th scope="col">Sell Currency</th>
                                        <th scope="col">Purchase Date</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {records && records.length > 0 ? (
                                        records.map((item, i) => {
                                          var startdate = Moment(item.createdDate).format(
                                            "lll"
                                          );
                                          return (
                                            <tr>
                                              <td>{i + 1}</td>
                                              <td>{item.tokenSymbol}</td>
                                              <td>
                                                {item.tokenAmount} {item.tokenSymbol}
                                              </td>
                                              <td>
                                                {item.orderid}
                                              </td>
                                              <td>{parseFloat(item.fees).toFixed(8)} </td>
                                              <td>
                                                {item.sellCurrency}
                                              </td>
                                              <td>
                                                {startdate}
                                              </td>
                                            </tr>
                                          );
                                        })
                                      ) : (
                                        <tr>
                                          <td colSpan="7">
                                            <span className="w-100 text-center d-block">
                                              No Launchpad orders found!
                                            </span>
                                          </td>
                                        </tr>
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                                <Pagination
                                  itemClass="page-item" // add it for bootstrap 4
                                  linkClass="page-link" // add it for bootstrap 4
                                  activePage={launchcurrentpage}
                                  itemsCountPerPage={launchrecordpage}
                                  totalItemsCount={launchtotalpage}
                                  pageRangeDisplayed={launchpagerange}
                                  onChange={handlepage}
                                />
                              </div>

                              <div id="menu3" className="tab-pane fade in">
                                <div className="table-responsive transaction down_ssss">
                                  <table className="table">
                                    <thead>
                                      <tr>
                                        <th scope="col">S.No</th>
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
                                          return (
                                            <tr onClick={() => navpage(item.orderId)}>
                                              <td>{i + 1}</td>
                                              <td>
                                                {Moment(item.created_at).format(
                                                  "lll"
                                                )}
                                              </td>
                                              <td>{item.firstCurrency}</td>
                                              <td>
                                                {parseFloat(
                                                  item.totalAmount
                                                ).toFixed(8)}
                                              </td>
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


                              <div id="menu4" className="tab-pane fade in">
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
                                      {p2porderHistory && p2porderHistory.length > 0 ? (
                                        p2porderHistory.map((item, i) => {
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
                                            <tr>
                                              <td>{i + 1}</td>
                                              <td>
                                                {Moment(item.datetime).format(
                                                  "YYYY-MM-DD"
                                                )}
                                              </td>
                                              <td>
                                                {Moment(item.datetime).format(
                                                  "hh:mm a"
                                                )}
                                              </td>
                                              <td>{item.fromCurrency}</td>
                                              <td>
                                                {parseFloat(
                                                  item.askAmount
                                                ).toFixed(8)}
                                              </td>
                                              <td>{item.askPrice}</td>
                                              <td>
                                                {item.type == "buy" ? (
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
                                                {status=="Cancelled" ? (
                                                   <span className="text-red">
                                                   {status}
                                                 </span>
                                                ): 
                                                (
                                                  <span className="text-green">
                                                  {status}
                                                </span>
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
                                <Pagination
                                  itemClass="page-item" // add it for bootstrap 4
                                  linkClass="page-link" // add it for bootstrap 4
                                  activePage={p2phistorycurrentpage}
                                  itemsCountPerPage={p2phistoryrecordpage}
                                  totalItemsCount={p2phistorytotalpage}
                                  pageRangeDisplayed={p2phistorypagerange}
                                  onChange={handlepagep2p_history}
                                />
                              </div>


                              <div id="menu5" className="tab-pane fade">
                                <div className="change_password_section">
                                  <h1>Edit Profile</h1>
                                  <div className="register_login">
                                    <form>
                                      <div className="form-group">
                                        <label>Username</label>
                                        <div className="postion_reletitt">
                                          <input
                                            type="text"
                                            name="username"
                                            required=""
                                            id="exampleInputPassword1"
                                            placeholder="Username"
                                            className="form-control"
                                            value={username}
                                            onChange={handleChange_profile}
                                          />
                                        </div>
                                        <div>

                                          {usernamevalidateref.current == true ? (
                                            <p className="text-danger">
                                              {" "}
                                              {validationnErr.username}{" "}
                                            </p>
                                          ) : (
                                            ""
                                          )}
                                        </div>
                                      </div>
                                      {/* <div className="form-group">
                                        <label>Email</label>
                                        <div className="postion_reletitt">
                                          <input
                                            type="email"
                                            name="email"
                                            required=""
                                            id="exampleInputPassword1"
                                            placeholder="Email"
                                            className="form-control"
                                            value={email}
                                            readonly
                                          />

                                        </div>
                                      </div> */}
                                      <div className="form-group">
                                        <label>Mobile Number</label>
                                        <div className="postion_reletitt">
                                          <input
                                            type="text"
                                            name="mobileNumber"
                                            required=""
                                            id="exampleInputPassword1"
                                            placeholder="Mobile Number"
                                            className="form-control"
                                            value={mobileNumber}
                                            onChange={handleChange_profile}
                                          />
                                        </div>
                                        <div>
                                          {mobilevalidateref.current == true ? (
                                            <p className="text-danger">
                                              {" "}
                                              {validationnErr.mobileNumber}{" "}
                                            </p>
                                          ) : (
                                            ""
                                          )}
                                        </div>
                                      </div>
                                      <span>
                                        {profileLoader == false ? (
                                          <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={profileSubmit}
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
                                      </span>
                                    </form>
                                  </div>
                                </div>
                              </div>

                              <div id="menu1" className="tab-pane fade in">
                                <div className="profile__wrapper">
                                  <div className="sessions">
                                    <div className="sessions__section">
                                      <div className="sessions__title">
                                        Notifications
                                      </div>

                                      <div className="tabel-responsive new_tabele_notit down_ssss">
                                      <div className="sessions__table">
                                        <div className="sessions__row">
                                          <div className="sessions__col">
                                            S.No
                                          </div>
                                          <div className="sessions__col">
                                            Date / time
                                          </div>
                                          <div className="sessions__col">
                                            From
                                          </div>
                                          <div className="sessions__col">
                                           Message
                                          </div>
                                        </div>

                                        {notification &&
                                          notification.map((item, i) => {
                                            return (
                                              <div className="sessions__row" onClick={() => navchatpage(item.link)}>
                                                <div className="sessions__col">
                                                  <div className="sessions__content">
                                                    {i + 1}
                                                  </div>
                                                </div>
                                                <div className="sessions__col">
                                                  <div className="sessions__content">
                                                    {Moment(
                                                      item.createdAt
                                                    ).format("lll")}
                                                  </div>
                                                  {/* <div className="sessions__note">
                                                    {item.from_user_name}
                                                  </div> */}
                                                </div>
                                                <div className="sessions__col">
                                                  <div className="sessions__content">
                                                    {item.from_user_name}
                                                  </div>
                                                </div>
                                                <div className="sessions__col">
                                                  <div className="sessions__content tect_werp">
                                                    {item.message}
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
                                <Pagination
                                  itemClass="page-item" // add it for bootstrap 4
                                  linkClass="page-link" // add it for bootstrap 4
                                  activePage={notifyCurrentPage}
                                  itemsCountPerPage={notifyrecordPerPage}
                                  totalItemsCount={notifytotalpage}
                                  pageRangeDisplayed={notifypageRange}
                                  onChange={handlenotifyPageChange}
                                />
                              {/* <div id="menu1" className="tab-pane fade in">
                                <div className="table-responsive transaction">
                                  <table className="table">
                                    <thead>
                                      <tr>
                                        <th scope="col">S.No</th>
                                        <th scope="col">Date</th>
                                        <th scope="col">from</th>
                                        <th scope="col">message</th>
                                      
                                      </tr>
                                    </thead>
                                    <tbody>
                                    {notification &&
                                          notification.map((item, i) => {
                                            return (
                                              <tr>
                                            <td>  {i + 1}</td>
                                            <td>
                                            {Moment(item.datetime).format(
                                              "YYYY-MM-DD"
                                            )}
                                          </td>
                                            <td>    {item.from_user_name}</td>
                                            <td>    {item.message}</td>
                                         

                                            </tr>
                                            )
                                          })}
                                    </tbody>
                                  
                                  </table>
                                </div>
                                <Pagination
                                  itemClass="page-item" // add it for bootstrap 4
                                  linkClass="page-link" // add it for bootstrap 4
                                  activePage={notifyCurrentPage}
                                  itemsCountPerPage={notifyrecordPerPage}
                                  totalItemsCount={notifytotalpage}
                                  pageRangeDisplayed={notifypageRange}
                                  onChange={handlenotifyPageChange}
                                /> */}
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
