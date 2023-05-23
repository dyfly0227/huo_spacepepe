import React, {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

import "rc-slider/assets/index.css";
import Header from "./Header";
import {Button} from "@material-ui/core";

import apiService from "../core/service/detail";
import {getMethod,postMethod} from "../core/service/common.api";
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
  const [cryptoCurrency, setcryptoCurrency] = useState("BTC");
  const [crytpoWithCash, setcrytpoWithCash] = useState("INR");
  const [prferPay, setprferPay] = useState("All payments");
  const [Terms, setTerms] = useState(false);
  const [errquantity, seterrquantity] = useState("");
  const [priceError, serpriceError] = useState("");
  const [errLimitFrom, seterrLimitFrom] = useState("");
  const [errlimitTo, seterrlimitTo] = useState("");
  const [errcryptoCurrency, seterrcryptoCurrency] = useState("");
  const [errcrytpoWithCash, seterrcrytpoWithCash] = useState("");
  const [errprferPay, seterrprferPay] = useState("");
  const [validationnErr, setvalidationnErr] = useState("");
  const [termsValidation, setTermsValidation] = useState(false);
  const [buttonLoader, setbuttonLoader] = useState(false);
  const [firstCurrency, setfirstCurrency] = useState("619948553cda890ff0256d3c");
  const [secondCurrency, setsecondCurrency] = useState("62f625b70a05cc3f9e4222bb");
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
    var data = {
      apiUrl: apiService.getP2Pcurrency,
    };
    var resp = await getMethod(data);
    console.log(resp, "-=-=-resp=-=-");
    if (resp) {
      var currArrayCrypto = [];
      var currArrayFiat = [];
      var data = resp.data;
      console.log(data, "][][][][][][");
      for (var i = 0; i < data.length; i++) {
        if (data[i].coinType == "1") {
          var obj = {
            value: data[i]._id,
            label: data[i].currencySymbol,
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
      }
      setallCurrency(currArrayCrypto);
      setallCurrencyFiat(currArrayFiat);
    }
    // console.log(allCurrency,'allCurrencyallCurrencyallCurrency=--=-=-=-==-=')
  };

  const defaulatCurrency = allCurrency[0];
  const defaulatCurrFiat = allCurrencyFiat[0];

  const chooseCrypto = async (option) => {
    console.log(option, "-=-chooseCrypto");
    setcryptoCurrency(option.label);
    setfirstCurrency(option.value);
  };
  const withCash = async (option) => {
    console.log(option, "-=-withCash");
    setcrytpoWithCash(option.label);
    setsecondCurrency(option.value);
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
    {value: "GPay", label: "GPay"},
    {value: "Paytm", label: "Paytm"},
  ];

  const preferPaymentOption = preferPayment[0];

  useEffect(() => {
    getAllcurrency();
  }, []);

  const validate = async (values) => {
    const errors = {};
    if (values.quantity == "") {
      errors.quantity = "Quantity is a required field";
      seterrquantity(true);
    }
    if (values.price == "") {
      errors.price = "Price is a required field";
      serpriceError(true);
    }
    if (values.limitFrom == "") {
      errors.limitFrom = "Limit From is a required field";
      seterrLimitFrom(true);
    }
    if (values.limitTo == "") {
      // errors.password = 'Password and confirm password does not match';
      errors.limitTo = "Limit To is a required field";
      seterrlimitTo(true);
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
    }
    setvalidationnErr(errors);
    return errors;
  };

  const submitPost = async (type) => {
    validate(formValue);
    if (
      formValue.quantity != "" &&
      formValue.price != "" &&
      formValue.limitFrom != "" &&
      formValue.limitTo != "" &&
      formValue.isTerms == true
    ) {
      formValue["fromCurrency"] = cryptoCurrency;
      formValue["toCurrency"] = crytpoWithCash;
      formValue["preferpayment"] = prferPay;
      formValue["orderType"] = type;
      formValue["firstCurrency"] = firstCurrency;
      formValue["secondCurrency"] = secondCurrency;

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
       // navigate("../myOrders", { replace: true });

      } else {
        console.log("error response====",resp )
        toast.error(resp.Message);
      }
    } else {
      toast.error("Please give valid fields");
    }
    console.log(formValue, "ererwearewr");
  };

  
  return (
    <div className="">
      <main className="main-content tradepage-bg login_body_ bg-cover ">
        <div className="container pt-5">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 padin_zero">
            <div className="container d-flex justify-content-center padin_zero">
              <div className="col-lg-10">
                <div className=" p2ppost">
                  <ul class="nav nav-tabs">
                    <li class="active">
                      <a data-toggle="tab" href="#wanttobuy" class="active">
                        I Want to Buy
                      </a>
                    </li>
                    <li>
                      <a data-toggle="tab" href="#wanttosell">
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
                              <label>Cryptocurrency </label>
                              <Dropdown
                               options={allCurrency}
                                onChange={(o) => chooseCrypto(o)}
                                value={cryptoCurrency}
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
                                value={defaulatCurrFiat}
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
                              <label>Price Limit From </label>
                              <input
                                type="number"
                                class="form-control"
                                placeholder="Enter Limit From"
                                name="limitFrom"
                                value={limitFrom}
                                onChange={handleChange}
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
                              <label>To</label>
                              <input
                                type="number"
                                class="form-control"
                                placeholder="Enter To Limimt"
                                name="limitTo"
                                value={limitTo}
                                onChange={handleChange}
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
                              <Button onClick={() => submitPost('buy')}>
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
                              <label>Cryptocurrency </label>
                              <Dropdown
                                options={allCurrency}
                                onChange={(o) => chooseCrypto(o)}
                                value={defaulatCurrency}
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
                              <label>Price Limit From </label>
                              <input
                                type="number"
                                class="form-control"
                                placeholder="Enter Limit From"
                                name="limitFrom"
                                value={limitFrom}
                                onChange={handleChange}
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
                              <label>To</label>
                              <input
                                type="number"
                                class="form-control"
                                placeholder="Enter To Limimt"
                                name="limitTo"
                                value={limitTo}
                                onChange={handleChange}
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
                              <Button onClick={() => submitPost('sell')}>
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
