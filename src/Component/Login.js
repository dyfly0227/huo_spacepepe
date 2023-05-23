import React, { useState, useEffect } from "react";
import Header from "./Header";
import Arrow from "../img/ArrowRight.svg";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiService from "../core/service/detail";
import { postMethod } from "../core/service/common.api";
import { setAuthToken, getAuthToken } from "../core/lib/localStorage";
import Footernew from "./footer_buttom";

import { setAuthorization } from "../core/service/axios";
function Home() {
  const options = ["one", "two", "three"];

  const initialFormValue = {
    email: "",
    password: "",
  };

  const navigate = useNavigate();
  // const dispatch = useDispatch();
  const [emailValidate, setemailValidate] = useState(false);
  const [passwordValidate, setpasswordValidate] = useState(false);
  const [validationnErr, setvalidationnErr] = useState("");
  const [formValue, setFormValue] = useState(initialFormValue);
  const [buttonLoader, setbuttonLoader] = useState(false);
  const [passHide, setPasshide] = useState(false);
  const [inputType, setinputType] = useState("password");
  const { email, isTerms, password, confirmPassword } = formValue;

  const handleChange = async (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    let formData = { ...formValue, ...{ [name]: value } };
    setFormValue(formData);
    validate(formData);
  };

  const passwordHide = (data) => {
    if (data == "hide") {
      setPasshide(true);
      setinputType("text");
    } else {
      setPasshide(false);
      setinputType("password");
    }
  };

  const validate = async (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = "Email is a required field";
      setemailValidate(true);
    }

    if (!values.password) {
      errors.password = "Password is a required field";
      setpasswordValidate(true);
    }

    setvalidationnErr(errors);
    return errors;
  };

  const formSubmit = async () => {
    validate(formValue);
    if (formValue.email != "" && formValue.password != "") {
      var data = {
        apiUrl: apiService.signin,
        payload: formValue,
      };
      setbuttonLoader(true);
      var resp = await postMethod(data);
      setbuttonLoader(false);
      if (resp?.tfa === 1) {
        navigate("/verify-tfa", {
          state: {
            socketToken: resp?.socketToken,
          },
        });
      } else {
        if (resp.status) {
          toast(resp.Message);
          console.log(resp, "[--=-=resp");
          await setAuthorization(resp.token);
          localStorage.setItem("user_token", resp.token);
          localStorage.setItem("tfa_status", resp.tfa);
          localStorage.setItem("socket_token", resp.socketToken);
          localStorage.setItem("jwNkiKmttscotlox", resp.jwNkiKmttscotlox);
          navigate("/profile");
        } else {
          toast(resp.Message);
        }
      }
    }
  };

  return (
    <div className="">
      <main className="main-content tradepage-bg  bg-cover onlywhitee">
        <Header />
        <div class="container">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 padin_zero">
            <div className="header_pading">
              <div class="row justify-center">
                {/* <div class="col-lg-7">
                <div class="login_content_section">
                  <h1>
                    Fastest & secure <br /> platform to invest <br />
                    in crypto
                  </h1>
                  <p>
                    Buy and sell cryptocurrencies, trusted by 10M wallets <br />
                    with over $30 billion in transactions.
                  </p>
                  <div class="login_btn_n">
                    <button type="submit" class="btn btn-primary">
                      <Link to="/register">Try for FREE</Link>

                      <img src={Arrow} className="logo" />
                    </button>
                  </div>
                </div>
              </div> */}
                <div class="col-lg-5">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="card_logoki pading_cardd">
                        <div className="form_content">
                          <h1 className="gradion_text">
                            Login to Space PEPE Exchange
                          </h1>
                          <p>Enter your email and password to login</p>
                        </div>
                        <div class="form_login_section p-0">
                          <div class="form register_login p-0">
                            <form className="form_pading_s">
                              <div class="form-group">
                                <input
                                  type="email"
                                  class="form-control"
                                  id="exampleInputPassword1"
                                  placeholder="Email address"
                                  name="email"
                                  value={email}
                                  onChange={handleChange}
                                />
                                <div>
                                  {emailValidate == true ? (
                                    <p className="text-danger">
                                      {" "}
                                      {validationnErr.email}{" "}
                                    </p>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </div>
                              <div class="form-group">
                                <div className="postion_reletitt">
                                  <input
                                    type={inputType}
                                    class="form-control"
                                    id="exampleInputPassword1"
                                    placeholder="Password"
                                    name="password"
                                    value={password}
                                    onChange={handleChange}
                                  />
                                  <div className="input-group-addon">
                                    {passHide == false ? (
                                      <i
                                        className="bi bi-eye-slash-fill"
                                        onClick={() => passwordHide("hide")}
                                      ></i>
                                    ) : (
                                      <i
                                        className="bi bi-eye-fill"
                                        onClick={() => passwordHide("show")}
                                      ></i>
                                    )}
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
                              </div>

                              <div class="custem_check">
                                {/* <div>
                          <div class="custom-control custom-checkbox mb-3">
                            <input
                              type="checkbox"
                              class="custom-control-input"
                              id="customCheck"
                              name="example1"
                            />
                            <label
                              class="custom-control-label"
                              for="customCheck"
                            >
                              Custom checkbox
                            </label>
                          </div>
                        </div> */}
                                <div>
                                  <Link to="/forgot">
                                    <a className="forget gradion_text">
                                      Forgot Password?
                                    </a>
                                  </Link>
                                </div>
                              </div>

                              {buttonLoader == false ? (
                                <button
                                  type="button"
                                  class="btn btn-primary w-100"
                                  onClick={formSubmit}
                                >
                                  Login
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  class="btn btn-primary w-100"
                                >
                                  loading...
                                </button>
                              )}

                              <p class="bottom_linnk">
                                Don’t have an Account?
                                <Link to="/register">
                                  <a className="gradion_text">SIGN UP</a>
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
          </div>
          <Footernew />
        </div>
      </main>
    </div>
  );
}

export default Home;
