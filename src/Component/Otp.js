import React, {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";

import "rc-slider/assets/index.css";
import Header from "./Header";

import apiService from "../core/service/detail";
import {postMethod} from "../core/service/common.api";
import {toast} from "react-toastify";
import {setAuthToken, getAuthToken} from "../core/lib/localStorage";
import OTPInput, {ResendOTP} from "otp-input-react";
import Footernew from "./footer_buttom";

function Home() {
  const options = ["one", "two", "three"];

  const initialFormValue = {
    otp1: "",
    otp2: "",
    otp3: "",
    otp4: "",
  };

  const [validationnErr, setvalidationnErr] = useState("");
  const [formValue, setFormValue] = useState(initialFormValue);
  const [buttonLoader, setbuttonLoader] = useState(false);
  const [buttonLoader1, setbuttonLoader1] = useState(false);
  const [OTP, setOTP] = useState("");

  const navigate = useNavigate();

  const {otp1, otp2, otp3, otp4} = formValue;

  const formSubmit = async (payload) => {
    // return
    if (OTP != "") {
      // return false

      var obj = {
        emailOtp: OTP,
        email: localStorage.getItem("useremail"),
      };

      var data = {
        apiUrl: apiService.emailotpverify,
        payload: obj,
      };
      setbuttonLoader(true);
      var resp = await postMethod(data);
      setbuttonLoader(false);
      if (resp.status) {
        toast(resp.Message);
        navigate("/login");
      } else {
        toast(resp.Message);
      }
    } else {
      toast("Enter OTP");
    }
  };

  const resendOTP = async (e) => {
    e.preventDefault();
    var obj = {
      email: localStorage.getItem("useremail"),
    };

    var data = {
      apiUrl: apiService.resendCode,
      payload: obj,
    };
    setbuttonLoader1(true);
    var resp = await postMethod(data);
    setbuttonLoader1(false);
    if (resp.status) {
      toast(resp.Message);
    } else {
      toast(resp.Message);
    }
  };

  const handleChange = async (e) => {
    e.preventDefault();
    const {name, value} = e.target;
    let formData = {...formValue, ...{[name]: value}};
    setFormValue(formData);
  };

  return (
    <div className="">
      <main className="main-content tradepage-bg  bg-cover onlywhitee">
        <Header />
        <div className="container">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 padin_zero">
            <div className="header_pading">
              <div class="row justify-center">
                <div class="col-lg-5">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="card_logoki pading_cardd">
                        <div className="form_content">
                          <h1 className="gradion_text">Verify Email</h1>
                          <p>Enter OTP which we send on your register email</p>
                        </div>
                        <div class="form_login_section p-0">
                          <div class="form register_login p-0">
                            <form className="form_pading_s">
                              <div className="otp_content_e">
                                <div className="form-group mb-0">
                                  <OTPInput
                                    value={OTP}
                                    onChange={setOTP}
                                    autoFocus
                                    OTPLength={4}
                                    otpType="number"
                                    disabled={false}
                                    secure
                                  />
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-lg-12">
                                  {buttonLoader == false ? (
                                    <button
                                      type="button"
                                      className="btn btn-primary w-70"
                                      onClick={formSubmit}
                                    >
                                      Continue
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      className="btn btn-primary w-70"
                                    >
                                      loading...
                                    </button>
                                  )}
                                </div>
                                <div className="col-lg-12">
                                  <button
                                    type="submit"
                                    className=" class_buutn_resend"
                                  >
                                    <span>
                                      {buttonLoader1 == false ? (
                                        <span
                                          onClick={resendOTP}
                                          className="gradion_text"
                                        >
                                          Resend Code
                                        </span>
                                      ) : (
                                        <span
                                          onClick={resendOTP}
                                          className="gradion_text"
                                        >
                                          loading...
                                        </span>
                                      )}
                                    </span>
                                  </button>
                                </div>
                              </div>
                              <p class="bottom_linnk">
                                Already have an Account?
                                <Link to="/login">
                                  <a className="gradion_text">LOGIN</a>
                                </Link>
                              </p>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="container d-flex justify-content-center">
              <div className="col-lg-10">
                <div className="register_login padin_otp">
                  <h1>Enter Code To Create Account</h1>
                  <p className="m-0">We send you on mail.</p>
                  <span>We’ve send you code on arun.****@gmail.com</span>
                  <div>
                    <div className="otp_content_e">
                      <div className="form-group">
                        <OTPInput
                          value={OTP}
                          onChange={setOTP}
                          autoFocus
                          OTPLength={4}
                          otpType="number"
                          disabled={false}
                          secure
                        />
                      </div>
                      <div className="form-group">
                        <input type="number" className="form-control"
                             name = "otp1"  
                             value={otp1}
                             onChange={handleChange} />
                      </div>
                      <div className="form-group">
                        <input type="number" className="form-control" 
                             name = "otp2"  
                             value={otp2}
                             onChange={handleChange}/>
                      </div>
                      <div className="form-group">
                        <input type="number" className="form-control"
                             name = "otp3"  
                             value={otp3}
                             onChange={handleChange} />
                      </div>
                      <div className="form-group">
                        <input type="number" className="form-control"
                             name = "otp4"  
                             value={otp4}
                             onChange={handleChange} />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      {buttonLoader == false ? (
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={formSubmit}
                        >
                          Continue
                        </button>
                      ) : (
                        <button type="button" className="btn btn-primary">
                          loading...
                        </button>
                      )}
                    </div>

                    <div className="col-lg-12">
                      <p className="bottom_linnk">
                        Did not receive the email? Check your spam filter, or
                      </p>
                      <button
                        type="submit"
                        className="btn btn-primary class_buutn_resend"
                      >
                        <span>
                          {buttonLoader1 == false ? (
                            <span onClick={resendOTP}>Resend Code</span>
                          ) : (
                            <span onClick={resendOTP}>loading...</span>
                          )}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
        <Footernew />
      </main>
    </div>
  );
}

export default Home;
