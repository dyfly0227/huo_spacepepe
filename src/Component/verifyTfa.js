import React, {useState} from "react";
import Header from "./Header";
import  Footernew from "./footer_buttom";
import {toast} from "react-toastify";
import apiService from "../core/service/detail";
import {postMethod} from "../core/service/common.api";
import Arrow from "../img/ArrowRight.svg";
import {useLocation, useNavigate} from "react-router-dom";
import {setAuthorization} from "../core/service/axios";

function VerifyTfa() {
  const initialFormValue = {
    tfa: "",
  };
  const [formValue, setFormValue] = useState(initialFormValue);
  const [tfaValidate, settfaValidate] = useState(false);
  const [validationnErr, setvalidationnErr] = useState("");
  const [buttonLoader, setbuttonLoader] = useState(false);
  const navigate = useNavigate();

  const {tfa} = formValue;
  const {state} = useLocation();

  const handleChange = async (e) => {
    const {name, value} = e.target;
    let formData = {...formValue, ...{[name]: value}};
    setFormValue(formData);
    validate(formData);
  };
  const formSubmit = async () => {
    validate(formValue);
    if (formValue.tfa !== "") {
      var data = {
        apiUrl: apiService.tfaVerify,
        payload: {
          userToken: tfa,
          socketToken: state?.socketToken,
        },
      };
      var resp = await postMethod(data);
      console.log("tfa login===", resp);
      if (resp.status) {
        toast.success(resp.Message);
        await setAuthorization(resp.token);
        localStorage.setItem("user_token", resp.token);
        localStorage.setItem("tfa_status", resp.tfa);
        localStorage.setItem("socket_token", resp.socketToken);
        navigate("/profile");
      } else {
        toast.error(resp.Message);
      }
    }
  };
  const validate = async (values) => {
    const errors = {};
    if (!values.tfa) {
      errors.tfa = "2FA is Required";
      settfaValidate(true);
    }
    setvalidationnErr(errors);
    return errors;
  };
  return (
    <div className="">
      <main className="main-content tradepage-bg  bg-cover onlywhitee tfa-bg">
        <Header />
        <div className="container">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 padin_zero">
            <div className="header_pading">
            <div className="row justify-center">
            <div class="col-lg-5">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="card_logoki pading_cardd">
                        <div className="form_content">
                          <p>Enter your 2FA Code to login</p>
                        </div>
                        <div class="form_login_section p-0">
                          <div class="form register_login p-0">
                            <form className="form_pading_s">
                              <div class="form-group">
                                <input
                                  type="number"
                                  class="form-control"
                                  id="exampleInputPassword1"
                                  placeholder="2FA Code"
                                  name="tfa"
                                  value={tfa}
                                  onChange={handleChange}
                                />
                                <div>
                                  {tfaValidate == true ? (
                                    <p className="text-danger">
                                      {" "}
                                      {validationnErr.tfa}{" "}
                                    </p>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </div>

                              {buttonLoader == false ? (
                                <button
                                  type="button"
                                  className="btn btn-primary w-100"
                                  onClick={formSubmit}
                                >
                                  Login
                                </button>
                              ) : (
                                <button type="button" className="btn btn-primary w-100">
                                  loading...
                                </button>
                              )}

                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
            </div>
          </div>
          <Footernew />
        </div>
      </main>
    </div>
  );
}
export default VerifyTfa;
