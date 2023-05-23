import React, {useState, useEffect} from "react";
import Header from "./Header";
import Arrow from "../img/ArrowRight.svg";
import {Link, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import apiService from "../core/service/detail";
import {postMethod} from "../core/service/common.api";
import {setAuthToken, getAuthToken} from "../core/lib/localStorage";
import {useParams} from "react-router-dom";
import {setAuthorization} from "../core/service/axios";
import Footernew from "./footer_buttom";

function Home() {
  const options = ["one", "two", "three"];

  const initialFormValue = {
    email: "",
  };

  const initialFormValue1 = {
    password: "",
    confirmPassword: "",
  };
  const {token} = useParams();

  const {id} = useParams();

  const navigate = useNavigate();
  // const dispatch = useDispatch();
  const [emailValidate, setemailValidate] = useState(false);
  const [passwordValidate, setpasswordValidate] = useState(false);
  const [validationnErr, setvalidationnErr] = useState("");
  const [formValue, setFormValue] = useState(initialFormValue);
  const [formValue1, setFormValue1] = useState(initialFormValue1);
  const [confirmPasswordValidate, setconfirmPasswordValidate] = useState(false);
  const [buttonLoader, setbuttonLoader] = useState(false);
  const [activeStatus, seractiveStatus] = useState(false);
  const [passconfNotmatch, setpassconfNotmatch] = useState(false);
  const [validationnErr1, setvalidationnErr1] = useState("");
  const [dpliutl, setdpliutl] = useState("");
  const [passHide, setPasshide] = useState(false);
  const [inputType, setinputType] = useState("password");
  const [passHidconf, setPasshideconf] = useState(false);
  const [inputTypeconf, setinputTypeconf] = useState("password");

  const {email} = formValue;
  const {password, confirmPassword} = formValue1;

  const handleChange = async (e) => {
    e.preventDefault();
    const {name, value} = e.target;
    let formData = {...formValue, ...{[name]: value}};
    setFormValue(formData);
    validate(formData);
  };
  const handleChange1 = async (e) => {
    e.preventDefault();
    const {name, value} = e.target;
    let formData1 = {...formValue1, ...{[name]: value}};
    setFormValue1(formData1);
    validate1(formData1);
  };

  useEffect(() => {
    linkverify();
  }, [0]);

  const linkverify = async (values) => {
    var dpliutl = window.location.href.split("_")[1];
    if (dpliutl) {
      setdpliutl(dpliutl);
      var obj = {
        link: dpliutl,
      };
      var data = {
        apiUrl: apiService.verifyForgotpasslink,
        payload: obj,
      };
      setbuttonLoader(true);
      var resp = await postMethod(data);
      setbuttonLoader(false);
      if (resp.status) {
        seractiveStatus(true);
        toast(resp.Message);
      } else {
        toast(resp.Message);
      }
    } else {
    }
  };

  const validate = async (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = "Email is a required field";
      setemailValidate(true);
    }

    setvalidationnErr(errors);
    return errors;
  };

  const validate1 = async (values) => {
    const errors1 = {};

    if (!values.password) {
      errors1.password = "Password is a required field";
      setpasswordValidate(true);
    }

    if (!values.confirmPassword) {
      errors1.confirmPassword = "Confirm password is a required field";
      setconfirmPasswordValidate(true);
    }

    if (
      values.password &&
      values.confirmPassword &&
      values.password !== values.confirmPassword
    ) {
      // errors.password = 'Password and confirm password does not match';
      errors1.confirmPassword = "Password and confirm password does not match";
      setpassconfNotmatch(true);
    }

    setvalidationnErr1(errors1);
    return errors1;
  };

  const formSubmit = async () => {
    validate(formValue);
    console.log(token, "=-=-=");
    if (formValue.email != "") {
      var obj = {
        email: formValue.email,
      };
      var data = {
        apiUrl: apiService.changepswdlink,
        payload: obj,
      };
      setbuttonLoader(true);
      console.log(data, "");
      var resp = await postMethod(data);
      console.log(resp, "==-=-resp");
      setbuttonLoader(false);
      if (resp.status) {
        toast(resp.message);
      } else {
        toast(resp.message);
      }
    }
  };

  const formSubmitchange = async () => {
    validate1(formValue1);
    if (formValue1.password != "" && formValue1.confirmPassword != "") {
      var obj = {
        password: formValue1.password,
        confimPassword: formValue1.confirmPassword,
        id: dpliutl,
      };

      console.log(obj, "=-=-=-=-=-=-=-==-=");
      var data = {
        apiUrl: apiService.resetpassword,
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
    }
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

  const passwordHideconf = (data) => {
    if (data == "hide") {
      setPasshideconf(true);
      setinputTypeconf("text");
    } else {
      setPasshideconf(false);
      setinputTypeconf("password");
    }
  };

  return (
    <div className="">
      <main className="main-content tradepage-bg  bg-cover onlywhitee">
        <Header />
        <div class="container padin_zero">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 padin_zero">
            <div className="header_pading">
              <div class="row row justify-center">
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
                      Try for FREE
                      <img src={Arrow} className="logo" />
                    </button>
                  </div>
                </div>
              </div> */}
                <div class="col-lg-5">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="card_logoki pading_cardd">
                        <div class="form_login_section p-0">
                          <div className="form_content">
                            <h1 className="gradion_text">Reset Password</h1>
                            <p>Enter your email to reset your password</p>
                          </div>

                          {activeStatus == false ? (
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

                                {buttonLoader == false ? (
                                  <button
                                    type="button"
                                    class="btn btn-primary w-100"
                                    onClick={formSubmit}
                                  >
                                    Submit
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
                          ) : (
                            <div class="form register_login">
                              <form>
                                <div class="form-group height_formrr">
                                  <div className="postion_reletitt">
                                    <input
                                      type={inputType}
                                      class="form-control"
                                      id="exampleInputPassword1"
                                      placeholder="Password"
                                      name="password"
                                      value={password}
                                      onChange={handleChange1}
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
                                          {validationnErr1.password}{" "}
                                        </p>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div class="form-group height_formrr">
                                  <div className="postion_reletitt">
                                    <input
                                      type={inputTypeconf}
                                      class="form-control"
                                      id="exampleInputPassword1"
                                      placeholder="Confirm Password"
                                      name="confirmPassword"
                                      value={confirmPassword}
                                      onChange={handleChange1}
                                    />
                                    <div className="input-group-addon">
                                      {passHidconf == false ? (
                                        <i
                                          className="bi bi-eye-slash-fill"
                                          onClick={() =>
                                            passwordHideconf("hide")
                                          }
                                        ></i>
                                      ) : (
                                        <i
                                          className="bi bi-eye-fill"
                                          onClick={() =>
                                            passwordHideconf("show")
                                          }
                                        ></i>
                                      )}
                                    </div>
                                    <div>
                                      {confirmPasswordValidate == true ? (
                                        <p className="text-danger">
                                          {" "}
                                          {validationnErr1.confirmPassword}{" "}
                                        </p>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {buttonLoader == false ? (
                                  <button
                                    type="button"
                                    class="btn btn-primary w-100"
                                    onClick={formSubmitchange}
                                  >
                                    Submit
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
                                  Already have an account?
                                  <Link to="/login">
                                    <a>Login to continue</a>
                                  </Link>
                                </p>
                              </form>
                            </div>
                          )}
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
      </main>
    </div>
  );
}

export default Home;
