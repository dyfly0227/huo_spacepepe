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
    isTerms: "",
  };

  const [formValue, setFormValue] = useState(initialFormValue);
  const [allCurrency, setallCurrency] = useState([]);
  const [allCurrencyFiat, setallCurrencyFiat] = useState([]);
  const [cryptoCurrency, setcryptoCurrency,cryptoCurrencyref] = useState("BTC");
  const [crytpoWithCash, setcrytpoWithCash] = useState("INR");
  const [prferPay, setprferPay] = useState("All payments");
  const [Terms, setTerms] = useState(false);
  const [errquantity, seterrquantity,seterrquantityref] = useState("");
  const [priceError, serpriceError,serpriceErrorref] = useState("");
  const [errLimitFrom, seterrLimitFrom,seterrLimitFromref] = useState("");
  const [errlimitTo, seterrlimitTo,seterrlimitToref] = useState("");
  const [errcryptoCurrency, seterrcryptoCurrency] = useState("");
  const [errcrytpoWithCash, seterrcrytpoWithCash] = useState("");
  const [errprferPay, seterrprferPay] = useState("");
  const [validationnErr, setvalidationnErr] = useState("");
  const [termsValidation, setTermsValidation] = useState(false);
  const [buttonLoader, setbuttonLoader] = useState(false);
  const [firstCurrency, setfirstCurrency] = useState("619948553cda890ff0256d3c");
  const [secondCurrency, setsecondCurrency] = useState("62f625b70a05cc3f9e4222bb");
  const [kycstatus, setkycstatus] = useState(0);
  const [cryptoPrices, setcryptoPrices,cryptoPricesref] = useState([]);
  const [coinPrice,setcoinPrice,coinPriceref] = useState("");
  const [coinBalance,setcoinBalance,coinBalanceref] = useState("");
  const [fiat,setfiat,fiatref] = useState("INR");
  const [highprice,sethighprice,highpriceref] = useState(0);
  const [lowprice,setlowprice,lowpriceref] = useState(0);
  const [fromCurrency, setfromCurrency,fromCurrencyref] = useState("BTC");
  const [toCurrency, settoCurrency,toCurrencyref] = useState("INR");
  const [payment_time, setpayment_time,payment_timeref] = useState("15");
  const [errpaymentTime, seterrpaymentTime] = useState("");
  let navigate = useNavigate();
  
  const {quantity, price, limitFrom, limitTo, isTerms} = formValue;

  const handleChange = async (e) => {
    console.log(e, "-=-=-=-=-");
    e.preventDefault();
    const {name, value} = e.target;
    let formData = {...formValue, ...{[name]: value}};
    console.log(formData, "formData=-=-=-=");
    setFormValue(formData);
  };

  const handleCheckBox = async (e) => {
    const {name, checked} = e.target;
    if (checked == false) {
      setTerms(false);
    } else {
      setTerms(true);
    }
    let formData = {...formValue, ...{[name]: checked}};
    setFormValue(formData);
  };

  const getAllcurrency = async () => {
    console.log("fiatref.current===",fiatref.current)
    var payload = {
      fiat: fiatref.current
    }
    var data = {
      apiUrl: apiService.getP2Pbalance,
      payload: payload

    };
    var resp = await postMethod(data);
    console.log(resp, "-=-=-resp=-=-");
    if (resp) {
      var currArrayCrypto = [];
      var currArrayFiat = [];
      var currPrices = [];
      var data = resp.data;
      console.log(data, "][][][][][][");
      for (var i = 0; i < data.length; i++) {
        if (data[i].coinType == "1") {
          var obj = {
            value: data[i]._id,
            label: data[i].currencySymbol,
            price: data[i].estimatedValueInUSDT
          };
          currArrayCrypto.push(obj);
        }
        if (data[i].coinType == "2") {
          var obj = {
            value: data[i]._id,
            label: data[i].currencySymbol,
          };
          currArrayFiat.push(obj);
        }
        var obj1 = {
          symbol: data[i].currencySymbol,
          price: data[i].estimatedValueInUSDT,
          balance: data[i].currencyBalance
        }
        currPrices.push(obj1);
      }
      setallCurrency(currArrayCrypto);
      setallCurrencyFiat(currArrayFiat);
      setcryptoPrices(currPrices);
      let index = currPrices.filter(x => x.symbol == fromCurrencyref.current);
      formValue.price = index[0].price;
      setcoinPrice(index[0].price);
      setcoinBalance(index[0].balance)
    }
    // console.log(allCurrency,'allCurrencyallCurrencyallCurrency=--=-=-=-==-=')
  };

  var defaulatCurrency = "BTC";
  const defaulatCurrFiat = allCurrencyFiat[0];

  const chooseCrypto = async (option) => {
    //console.log(option, "-=-chooseCrypto");
    setcryptoCurrency(option.label);
    setfirstCurrency(option.value);
    getAllcurrency();
    let index = cryptoPricesref.current.filter(x => x.symbol == option.label );
   // console.log("currency index====",index);
    formValue.price = index[0].price;
    console.log("formValue.price====",formValue.price);
    setcoinPrice(index[0].price);
    setcoinBalance(index[0].balance);
    setfromCurrency(option.label);
    fiat_price();
  };
  const withCash = async (option) => {
    // console.log(option, "-=-withCash");
    // console.log("cryptoPricesref==",cryptoPricesref.current)
    setcrytpoWithCash(option.label);
    setsecondCurrency(option.value);
    setfiat(option.label);
    getAllcurrency();
    settoCurrency(option.label);
    console.log("fromCurrencyref.current====",fromCurrencyref.current)
    let index = cryptoPricesref.current.filter(x => x.symbol == option.label);
   // console.log("crypto currency index====",index);
    formValue.price = index[0].price;
    console.log("formValue.price====",formValue.price);
    setcoinPrice(index[0].price);
    fiat_price();

  };

  const prferPayments = async (option) => {
    console.log(option, "-=-prferPayments");
    setprferPay(option.label);
  };

  const preferPayment = [
    {value: "All payments", label: "All payments"},
    {
      value: "Bank Transfer",
      label: "Bank Transfer",
      className: "myOptionClassName",
    },
    {value: "UPI ID", label: "UPI ID"},
    {value: "Paytm", label: "Paytm"},
  ];

  const preferPaymentOption = preferPayment[0];


  const payTime = [
    {value: "15", label: "15 Minutes"},
    {
      value: "30",
      label: "30 Minutes"
    },
    {value: "45", label: "45 Minutes"},
    {value: "60", label: "1 Hour"},
    {value: "120", label: "2 Hours"},
    {value: "180", label: "3 Hours"},
    {value: "240", label: "4 Hours"},
    {value: "300", label: "5 Hours"},
    {value: "360", label: "6 Hours"},
  ];

  const choosePaytime = async (option) => {
     setpayment_time(option.value);
  }

  useEffect(() => {
    getAllcurrency();
   
    let getToken = localStorage.getItem("user_token");
    if (getToken != "" && getToken != undefined && getToken != null) {
      getKycData();
    } else {
    }
    fiat_price();
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

    if (values.cryptoCurrency == "") {
      // errors.password = 'Password and confirm password does not match';
      errors.cryptoCurrency = "Crypto Currency required field";
      seterrcryptoCurrency(true);
    }
    if (values.crytpoWithCash == "") {
      // errors.password = 'Password and confirm password does not match';
      errors.crytpoWithCash = "WithCash is a required field";
      seterrcrytpoWithCash(true);
    }
    if (values.prferPay == "") {
      // errors.password = 'Password and confirm password does not match';
      errors.prferPay = "Prefer payment is a required field";
      seterrprferPay(true);
    }
    if (Terms == false) {
      errors.terms = "Terms is a required field";
      setTermsValidation(true);
    }else{
      setTermsValidation(false);
    }

    if (payment_timeref.current == "") {
      errors.payment_time = "Payment Time required field";
      seterrpaymentTime(true);
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
        seterrlimitToref.current==false &&
        formValue.isTerms == true
      ) {
        formValue["fromCurrency"] = cryptoCurrency;
        formValue["toCurrency"] = crytpoWithCash;
        formValue["preferpayment"] = prferPay;
        formValue["orderType"] = type;
        formValue["firstCurrency"] = firstCurrency;
        formValue["secondCurrency"] = secondCurrency;
        formValue["pay_time"] = payment_timeref.current;
  
        var data = {
          apiUrl: apiService.p2pOrder,
          payload: formValue,
        };
        setbuttonLoader(true);
        var resp = await postMethod(data);
        setbuttonLoader(false);
        if (resp.status) {
          toast.success(resp.Message);
          formValue["quantity"] = "";
          formValue["price"] = "";
          formValue["limitFrom"] = "";
          formValue["limitTo"] = "";
          formValue["isTerms"] = "";
          formValue["firstCurrency"] = "";
          formValue["secondCurrency"] = "";
          //navigate("/p2p/chat/"+resp.orderId);
          navigate("/p2phome");
  
        } else {
          console.log("error response====",resp )
          if(resp.bank)
          {
            toast.error(resp.Message);
            navigate('/Bankdetails');
          }
          else
          {
            toast.error(resp.Message);
          }
          
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

  const tabSelect = async (type) => {
    getAllcurrency();
    if(type=="buy")
    {
      cryptoCurrencyref.current  = fromCurrencyref.current;
    }
    else
    {
      cryptoCurrencyref.current  = fromCurrencyref.current;
    }
    
  }

  const fiat_price = async () => {
    var payload = {
      fromCurrency: fromCurrencyref.current,
      toCurrency: toCurrencyref.current
    }
    // var payload = {
    //   fromCurrency: "USDT",
    //   toCurrency: "INR"
    // }
    var data = {
      apiUrl: apiService.fetch_price,
      payload: payload
    };

    var resp = await postMethod(data);
    console.log(resp.data, "fiat price -=-=-resp=-=-");
    console.log("cryptoPricesref.current===",cryptoPricesref.current);
    if (resp) {
      let index = cryptoPricesref.current.filter(x => x.symbol == fromCurrencyref.current);
      var high = (resp.data.highprice != 0)?resp.data.highprice:index[0].price;
      var low = (resp.data.lowprice != 0)?resp.data.lowprice:index[0].price
      sethighprice(high);
      setlowprice(low);
    }
  }

  return (
    <div className="">
      <main className="main-content tradepage-bg login_body_ bg-cover ">
        {/* <Header /> */}
        <div className="container">
          <div className="">
            <div className="container d-flex justify-content-center padin_zero">
              <div className="col-lg-12 pading-zeero">
                <div className="p2ppost">
                  <ul class="nav nav-tabs">
                    <li class="active">
                      <a data-toggle="tab" href="#wanttobuy" class="active" onClick={() => tabSelect('buy')}>
                        I Want to Buy
                      </a>
                    </li>
                    <li>
                      <a data-toggle="tab" href="#wanttosell" onClick={() => tabSelect('sell')}>
                        I Want to Sell
                      </a>
                    </li>
                  </ul>
                  <div class="tab-content">
                    <div id="wanttobuy" class="tab-pane fade in active show">
                      <div className="buyform_now">
                        <form className="row">
                          <div className="col-lg-4">
                            <div class="form-group">
                              <label>Cryptocurrency {parseFloat(coinBalanceref.current).toFixed(8)} {cryptoCurrencyref.current}</label>
                              <Dropdown
                                options={allCurrency}
                                onChange={(o) => chooseCrypto(o)}
                                value={cryptoCurrencyref.current}
                                placeholder="Select an option"
                              />
                              <div className="text-danger">
                                {errcryptoCurrency == true ? (
                                  <p className="text-danger">
                                    {" "}
                                    {validationnErr.cryptoCurrency}{" "}
                                  </p>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-4">
                            <div class="form-group">
                              <label>With Cash </label>
                              <Dropdown
                                options={allCurrencyFiat}
                                onChange={(o) => withCash(o)}
                                value={crytpoWithCash}
                                placeholder="Select an option"
                              />
                              <div className="text-danger">
                                {errcrytpoWithCash == true ? (
                                  <p className="text-danger">
                                    {" "}
                                    {validationnErr.crytpoWithCash}{" "}
                                  </p>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-4">
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
                          <div className="col-lg-4">
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

                          <div className="col-lg-4">
                            <div class="form-group">
                              <label>Lowest Order Price </label>
                              <input
                                type="number"
                                class="form-control"
                                name="price"
                                value={lowpriceref.current}
                                readOnly

                              />
                            </div>
                          </div>
                          <div className="col-lg-4">
                            <div class="form-group">
                              <label>Prefered Payment </label>
                              <Dropdown
                                options={preferPayment}
                                onChange={(o) => prferPayments(o)}
                                value={prferPay}
                                placeholder="Select Payments"
                              />
                              <div className="text-danger">
                                {errprferPay == true ? (
                                  <p className="text-danger">
                                    {" "}
                                    {validationnErr.prferPay}{" "}
                                  </p>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-4">
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
                          <div className="col-lg-4">
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

                          <div className="col-lg-4">
                            <div class="form-group">
                              <label>Payment Time</label>
                              <Dropdown
                                options={payTime}
                                onChange={(o) => choosePaytime(o)}
                                value={payment_timeref.current}
                                placeholder="Select Payments"
                              />
                              <div className="text-danger">
                                {errpaymentTime == true ? (
                                  <p className="text-danger">
                                    {" "}
                                    {validationnErr.payment_time}{" "}
                                  </p>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-12">
                            <div class="custom-control custom-checkbox text-center">
                              <input
                                type="checkbox"
                                class="custom-control-input"
                                id="customCheck"
                                name="isTerms"
                                value={isTerms}
                                onChange={handleCheckBox}
                                checked={isTerms}
                              />
                              <label
                                class="custom-control-label"
                                for="customCheck"
                              >
                                I agree and accept the term and policy
                              </label>
                              <div className="text-danger">
                                {termsValidation == true ? (
                                  <p className="text-danger text-center">
                                    {" "}
                                    {validationnErr.terms}{" "}
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
                    <div id="wanttosell" class="tab-pane fade ">
                      <div className="buyform_now">
                        <form className="row">
                          <div className="col-lg-4">
                            <div class="form-group">
                              <label>Cryptocurrency {parseFloat(coinBalanceref.current).toFixed(8)} {cryptoCurrencyref.current}</label>
                              <Dropdown
                                options={allCurrency}
                                onChange={(o) => chooseCrypto(o)}
                                value={cryptoCurrencyref.current}
                                placeholder="Select an option"
                              />
                              <div className="text-danger">
                                {errcryptoCurrency == true ? (
                                  <p className="text-danger">
                                    {" "}
                                    {validationnErr.cryptoCurrency}{" "}
                                  </p>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-4">
                            <div class="form-group">
                              <label>With Cash </label>
                              <Dropdown
                                options={allCurrencyFiat}
                                onChange={(o) => withCash(o)}
                                value={crytpoWithCash}
                                placeholder="Select an option"
                              />
                              <div className="text-danger">
                                {errcrytpoWithCash == true ? (
                                  <p className="text-danger">
                                    {" "}
                                    {validationnErr.crytpoWithCash}{" "}
                                  </p>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-4">
                            <div class="form-group">
                              <label>Quantity </label>
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
                          <div className="col-lg-4">
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
                              <label>Lowest order price </label>
                              <input
                                type="number"
                                class="form-control"
                                value={coinPriceref.current}
                                readOnly

                              />
                            </div>
                          </div> */}
                          <div className="col-lg-4">
                            <div class="form-group">
                              <label>Highest Order Price </label>
                              <input
                                type="number"
                                class="form-control"
                                name="price"
                                value={highpriceref.current}
                                readOnly

                              />
                            </div>
                          </div>
                          <div className="col-lg-4">
                            <div class="form-group">
                              <label>Prefered Payment </label>
                              <Dropdown
                                options={preferPayment}
                                onChange={(o) => prferPayments(o)}
                                value={prferPay}
                                placeholder="Select Payments"
                              />
                              <div className="text-danger">
                                {errprferPay == true ? (
                                  <p className="text-danger">
                                    {" "}
                                    {validationnErr.prferPay}{" "}
                                  </p>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-4">
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
                          <div className="col-lg-4">
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
                          <div className="col-lg-4">
                            <div class="form-group">
                              <label>Payment Time</label>
                              <Dropdown
                                options={payTime}
                                onChange={(o) => choosePaytime(o)}
                                value={payment_timeref.current}
                                placeholder="Select Payments"
                              />
                              <div className="text-danger">
                                {errpaymentTime == true ? (
                                  <p className="text-danger">
                                    {" "}
                                    {validationnErr.payment_time}{" "}
                                  </p>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-12">
                            <div class="custom-control custom-checkbox text-center">
                              <input
                                type="checkbox"
                                class="custom-control-input"
                                id="customCheck"
                                name="isTerms"
                                value={isTerms}
                                onChange={handleCheckBox}
                                checked={isTerms}
                              />
                              <label
                                class="custom-control-label"
                                for="customCheck"
                              >
                                I agree and accept the term and policy
                              </label>
                              <div className="text-danger">
                                {termsValidation == true ? (
                                  <p className="text-danger text-center">
                                    {" "}
                                    {validationnErr.terms}{" "}
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
                                <Button onClick={() => submitPost("sell")}>
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
