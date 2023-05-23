import React, { useEffect} from "react";
import useState from "react-usestateref";
import {Link, useNavigate} from "react-router-dom";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

import "rc-slider/assets/index.css";
import Header from "./Header";
import {Button} from "@material-ui/core";

import apiService from "../core/service/detail";
import {getMethod, postMethod} from "../core/service/common.api";
import {toast} from "react-toastify";
import {setAuthToken, getAuthToken} from "../core/lib/localStorage";
import OTPInput, {ResendOTP} from "otp-input-react";

function Home() {

  const initialFormValue = {
    quantity: "",
    price: "",
    limitFrom: "",
    limitTo: "",
  };

  const [formValue, setFormValue] = useState(initialFormValue);
  const [errquantity, seterrquantity,seterrquantityref] = useState("");
  const [priceError, serpriceError,serpriceErrorref] = useState("");
  const [errLimitFrom, seterrLimitFrom,seterrLimitFromref] = useState("");
  const [errlimitTo, seterrlimitTo,seterrlimitToref] = useState("");
  const [validationnErr, setvalidationnErr] = useState("");
  const [buttonLoader, setbuttonLoader] = useState(false);
  const [kycstatus, setkycstatus] = useState(0);
  const [coinBalance,setcoinBalance,coinBalanceref] = useState("");
  const [p2pData, setp2pData, p2pDataref] = useState("");

  let navigate = useNavigate();
  
  const {quantity, price, limitFrom, limitTo} = formValue;

  const handleChange = async (e) => {
    console.log(e, "-=-=-=-=-");
    e.preventDefault();
    const {name, value} = e.target;
    let formData = {...formValue, ...{[name]: value}};
    console.log(formData, "formData=-=-=-=");
    setFormValue(formData);
  };

  useEffect(() => {
    //getAllcurrency();
   
    let getToken = localStorage.getItem("user_token");
    if (getToken != "" && getToken != undefined && getToken != null) {
      getKycData();
      getp2pOrder();
    } else {
    }
  }, [0]);

  const validate = async (values) => {
    const errors = {};
    if (values.quantity == "") {
      errors.quantity = "Quantity is a required field";
      seterrquantity(true);
    }else if (values.quantity <=0) {
      errors.quantity = "Enter Valid Amount";
      seterrquantity(true);
    }else{
      seterrquantity(false);
    }
    if (values.price == "") {
      errors.price = "Price is a required field";
      serpriceError(true);
    }else if(values.price <=0){
   errors.price = "Enter valid Amount";
    serpriceError(true);
    }else{
      serpriceError(false);
    }
    if (values.limitFrom == "") {
      errors.limitFrom = "Minimum Quantity is a required field";
      seterrLimitFrom(true);
    }else if (values.limitFrom <=0) {
      errors.limitFrom = "Enter valid amount";
      seterrLimitFrom(true);
    }else{
      seterrLimitFrom(false);
    }
   if (values.limitTo == "") {
      // errors.password = 'Password and confirm password does not match';
      errors.limitTo = "Maximum Quantity is a required field";
      seterrlimitTo(true);
    }else if (values.limitTo <=0) {
      // errors.password = 'Password and confirm password does not match';
      errors.limitTo = "Enter valid Amount";
      seterrlimitTo(true);
    }else{
      seterrlimitTo(false);
    }
    setvalidationnErr(errors);
    return errors;
  };

  const submitPost = async (type) => {

    if(kycstatus == 1){

      validate(formValue);
      console.log(seterrLimitFromref,"=-=-=seterrLimitFromref=-=-0=")
      console.log(seterrquantityref,"=-=-=seterrquantityref=-=-0=")
      console.log(serpriceErrorref,"=-=-=serpriceErrorref=-=-0=")
      console.log(seterrlimitToref,"=-=-=seterrlimitToref=-=-0=")

      if (
     
        seterrLimitFromref.current==false&&
        seterrquantityref.current==false&&
        serpriceErrorref.current==false&&
        seterrlimitToref.current==false
      ) {
  
        var data = {
          apiUrl: apiService.p2pOrder,
          payload: formValue,
        };
        setbuttonLoader(true);
        var resp = await postMethod(data);
        setbuttonLoader(false);
        if (resp.status) {
          toast.success(resp.Message);
          navigate("/p2p-Orders");
  
        } else {
          
        }
      } else {
        toast.error("Please give valid fields");
      }
      console.log(formValue, "ererwearewr");
    }else{
      if(kycstatus == 2)
      {
        toast.error("Your kyc verification is pending, please wait for admin approval");
        navigate('/kyc');
      }
      else
      {
        toast.error("Please verify your kyc");
        navigate('/kyc');
      }
      
    }

  };


  const getKycData = async () => {
    try {
      var data = {
        apiUrl: apiService.getKYCDetails,
      };
      var resp = await getMethod(data);
      if (resp.status) {
        var responseData = resp.data.kycstatus;
        setkycstatus(responseData);
      } else {
        var responseData = 0;
        setkycstatus(responseData);
      }
    } catch (error) {
      var responseData = 0;
      setkycstatus(responseData);
    }
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
    if (resp) {
      var data = resp.Message;
      setp2pData(resp.Message);
      formValue.quantity = resp.Message.totalAmount;
      formValue.price = resp.Message.price;
      formValue.limitFrom = resp.Message.fromLimit;
      formValue.limitTo = resp.Message.toLimit;
    }
  };

//   const fiat_price = async () => {
//     var payload = {
//       fromCurrency: fromCurrencyref.current,
//       toCurrency: toCurrencyref.current
//     }
//     // var payload = {
//     //   fromCurrency: "USDT",
//     //   toCurrency: "INR"
//     // }
//     var data = {
//       apiUrl: apiService.fetch_price,
//       payload: payload
//     };

//     var resp = await postMethod(data);
//     console.log(resp.data, "fiat price -=-=-resp=-=-");
//     console.log("cryptoPricesref.current===",cryptoPricesref.current);
//     if (resp) {
//       let index = cryptoPricesref.current.filter(x => x.symbol == fromCurrencyref.current);
//       var high = (resp.data.highprice != 0)?resp.data.highprice:index[0].price;
//       var low = (resp.data.lowprice != 0)?resp.data.lowprice:index[0].price
//       sethighprice(high);
//       setlowprice(low);
//     }
//   }

  return (
    <div className="">
      <main className="main-content tradepage-bg login_body_ bg-cover ">
        {/* <Header /> */}
        <div className="container">
          <div className="">
            <div className="container d-flex justify-content-center padin_zero">
              <div className="col-lg-12 pading-zeero">
                <div className="p2ppost">
                  <div class="tab-content">
                    <div id="wanttobuy" class="tab-pane fade in active show">
                      <div className="buyform_now">
                      <label>{p2pDataref.current.orderType} Order {p2pDataref.current.firstCurrency} / {p2pDataref.current.secondCurrnecy}</label>
                        <form className="row">
                          <div className="col-lg-6">
                            <div class="form-group">
                              <label>Quantity</label>
                              <input
                                type="number"
                                class="form-control"
                                placeholder="Enter Quantity"
                                name="quantity"
                                value={quantity}
                                onChange={handleChange}
                                min = "0"
                              />
                              <div className="text-danger">
                                {errquantity == true ? (
                                  <p className="text-danger">
                                    {" "}
                                    {validationnErr.quantity}{" "}
                                  </p>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div class="form-group">
                              <label>price </label>
                              <input
                                type="number"
                                class="form-control"
                                name="price"
                                value={price}
                                onChange={handleChange}
                                placeholder="Enter Price"
                                min = "0"

                              />
                              <div className="text-danger">
                                {priceError == true ? (
                                  <p className="text-danger">
                                    {" "}
                                    {validationnErr.price}{" "}
                                  </p>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          </div>

                          {/* <div className="col-lg-4">
                            <div class="form-group">
                              <label>Highest order price </label>
                              <input
                                type="number"
                                class="form-control"
                                value={coinPriceref.current}
                                readOnly

                              />
                            </div>
                          </div> */}
                          <div className="col-lg-6">
                            <div class="form-group">
                              <label>Minimum Quantity </label>
                              <input
                                type="number"
                                class="form-control"
                                placeholder="Enter Minimum Quantity"
                                name="limitFrom"
                                value={limitFrom}
                                onChange={handleChange}
                                min = "0"

                              />
                              <div className="text-danger">
                                {errLimitFrom == true ? (
                                  <p className="text-danger">
                                    {" "}
                                    {validationnErr.limitFrom}{" "}
                                  </p>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div class="form-group">
                              <label>Maximum Quantity</label>
                              <input
                                type="number"
                                class="form-control"
                                placeholder="Enter Maximum Quantity"
                                name="limitTo"
                                value={limitTo}
                                onChange={handleChange}
                                min = "0"

                              />
                              <div className="text-danger">
                                {errlimitTo == true ? (
                                  <p className="text-danger">
                                    {" "}
                                    {validationnErr.limitTo}{" "}
                                  </p>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-12">
                            <div className="post_submit">
                              {buttonLoader == false ? (
                                <Button onClick={() => submitPost("buy")}>
                                  Submit Post
                                </Button>
                              ) : (
                                <Button>Loading...</Button>
                              )}
                            </div>
                          </div>
                        </form>
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
