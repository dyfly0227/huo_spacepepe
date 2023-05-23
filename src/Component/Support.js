import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";

import "rc-slider/assets/index.css";
import Header from "./Header";
import {Button} from "@material-ui/core";

import apiService from "../core/service/detail";
import {postMethod} from "../core/service/common.api";
import {getMethod} from "../core/service/common.api";
import {toast} from "react-toastify";
import {setAuthToken, getAuthToken} from "../core/lib/localStorage";
import OTPInput, {ResendOTP} from "otp-input-react";

function Home() {
  const value = {
    Subject: "",
    Category: "Choose Category",
    text: "",
  };

  const [Formdata, setFormdata] = useState(value);

  const [SubjectErr, setSubjectErr] = useState(value);
  const [CategoryErr, setCategoryErr] = useState(value);
  const [textErr, settextErr] = useState(value);

  const [formErr, setformErr] = useState("");

  const [user, setuser] = useState([]);

  const {Subject, Category, text} = Formdata;

  const getItem = (e) => {
    var {name, value} = e.target;
    let check = {...Formdata, ...{[name]: value}};
    setFormdata(check);
  };

  useEffect(() => {
    viewData();
  }, []);

  const validate = async (condition) => {
    var error = {};
    if (condition.Subject == "") {
      error.Subject = "Subject is a required field";
      setSubjectErr(true);
    } else if (condition.Subject.length < 5) {
      error.Subject = "Minimum 5 Characters only allowed ";
      setSubjectErr(true);
    } else if (condition.Subject.length > 50) {
      error.Subject = "Maximum 50 Characters only allowed ";
      setSubjectErr(true);
    } else {
      setSubjectErr(false);
    }

    if (condition.text == "") {
      error.text = "Message is a required field";
      settextErr(true);
    } else if (condition.text.length < 10) {
      error.text = "Minimum 10 Characters only allowed ";
      settextErr(true);
    } else if (condition.text.length > 250) {
      error.text = "Maximum 250 Characters only allowed ";
      settextErr(true);
    } else {
      settextErr(false);
    }
    setformErr(error);
  };

  const submit = async () => {
    validate(Formdata);
    console.log("Formdata====", Formdata);
    // return false;
    if (
      Formdata.Subject != "" &&
      Formdata.Subject.length > 5 &&
      Formdata.Subject.length < 50 &&
      Formdata.Category != "Choose Category" &&
      Formdata.text != "" &&
      Formdata.text.length > 10 &&
      Formdata.text.length < 250
    ) {
      toast.success(
        "Your ticket created successfully, Please wait for admin reply"
      );
      var data = {
        apiUrl: apiService.createdSupport,
        payload: Formdata,
      };
      var resp = await postMethod(data);
      const obj = {
        Subject: "",
        Category: "Choose Category",
        text: "",
      };
      setFormdata(obj);
      viewData();
    } else {
        toast.error("All are required fields");
    }
  };
  const viewData = async () => {
    try {
      var api = {
        apiUrl: apiService.findedSupport,
      };
      var view = await getMethod(api);
      if (view.status) setuser(view.data);
    } catch (error) {}
  };

  return (
    <div className="">
      <main className="main-content tradepage-bg login_body_ bg-cover height_100">
        <Header />
        <div className="container pt-5 padin_zero">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 padin_zero">
            <div className="container d-flex justify-content-center flexnew_center">
              <div className="col-lg-10 padin_zero">
                <h1 className="title_blocc">Support Ticket</h1>
                <div className="staking_title launcpad d-block fonrm_card_s need_meanissss">
                  <div class="row">
                    <div className="col-lg-6">
                      <div class="form-group">
                        <label>Subject</label>
                        <input
                          type="email"
                          class="form-control"
                          placeholder="Subject"
                          name="Subject"
                          value={Subject}
                          onChange={getItem}
                        />
                      </div>
                      {SubjectErr == true ? (
                        <p style={{color: "red"}}>{formErr.Subject} </p>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="col-lg-6">
                      <div class="form-group ">
                        <label>Select Category</label>
                        <select
                          class="form-control"
                          name="Category"
                          value={Category}
                          onChange={getItem}
                        >
                          <option selected>Choose Category</option>
                          <option selected>Spot</option>
                          <option selected>P2p</option>
                          <option selected>Launchpad</option>
                          <option selected>Staking</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div class="form-group ">
                        <label>Message</label>
                        <textarea
                          name="text"
                          value={text}
                          onChange={getItem}
                        ></textarea>
                      </div>
                      {textErr == true ? (
                        <p style={{color: "red"}}>{formErr.text} </p>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="col-lg-12">
                      <div className="submit_butn_s">
                        <Button onClick={submit}>Submit</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 padin_zero">
            <div className="container d-flex justify-content-center flexnew_center">
              <div className="col-lg-10 padin_zero">
                <div className="staking_title launcpad d-block fonrm_card_s need_meanissss ">
                  <div class="fixTableHead">
                    <table class="table">
                      <thead>
                        <tr>
                          <th scope="col">S.No</th>
                          <th scope="col">Subject</th>
                          <th scope="col">Message</th>
                          <th scope="col">Category</th>
                        </tr>
                      </thead>
                      <tbody>
                        {user.map((data, i) => (
                          <tr>
                            <td>{i + 1}</td>
                            <td>{data.subject}</td>
                            <td>{data.message}</td>
                            <td>{data.category}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
