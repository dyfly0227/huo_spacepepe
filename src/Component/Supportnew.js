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
import moment from "moment";
import Pagination from "react-js-pagination";

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
  const [buttonLoader, setbuttonLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalpages] = useState(0);
  const [supportCategories, setCategories] = useState(0);

  const {Subject, Category, text} = Formdata;

  const getItem = (e) => {
    var {name, value} = e.target;
    let check = {...Formdata, ...{[name]: value}};
    setFormdata(check);
  };

  const recordPerPage = 5;
  const totalRecords = 15;
  const pageRange = 5;

  const handlePageChange = (pageNumber) => {
    viewData(pageNumber);
    setCurrentPage(pageNumber);
  };
  useEffect(() => {
    viewData();
    getCategory();
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
      setbuttonLoader(true);
      var resp = await postMethod(data);
      setbuttonLoader(false);
      const obj = {
        Subject: "",
        Category: "Choose Category",
        text: "",
      };
      setFormdata(obj);
      viewData();
      
    } else {
    }
  };
  const viewData = async () => {
    try {
      var api = {
        apiUrl: apiService.findedSupport,
      };
      var view = await postMethod(api);
      if (view.status) setuser(view.data.data);
      setTotalpages(view.data.total);
      console.log(view.data.total);
    } catch (error) {}
  };

  const getCategory = async () => {
    try {
      var api = {
        apiUrl: apiService.supportCategories,
      };
      var response = await getMethod(api);
      if (response.status)
      {
        setCategories(response.data);
      }
    } catch (error) {}
  };

  return (
    <div className="">
      <main className="main-content tradepage-bg login_body_ bg-cover height_100">
        {/* <Header /> */}
        <div className="container pt-5 padin_zero">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 padin_zero">
            <div className="container d-flex justify-content-center flexnew_center">
              <div className="col-lg-12 padin_zero">
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
                          {supportCategories.length > 0 ? (
                          supportCategories.map((item, i) => (
                            <option selected>{item.category}</option>
                            ))
                          ) : (
                            <option selected>Choose Category</option>
                          )}
                          
                        </select>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div class="form-group ">
                        <label>Message</label>
                        <textarea
                          name="text"
                          value={text}
                          placeholder="Message"
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
                        {buttonLoader == false ? (
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={submit}
                          >
                            Submit
                          </button>
                        ) : (
                          <button type="button" className="btn btn-primary">
                            loading...
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 padin_zero">
            <div className="container d-flex justify-content-center flexnew_center">
              <div className="col-lg-12 padin_zero">
                <div className="staking_title launcpad d-block fonrm_card_s need_meanissss ">
                  <div class="fixTableHead">
                    <table class="table">
                      <thead>
                        <tr>
                          <th >S.No</th>
                          <th >Subject</th>
                          <th >Message</th>
                          <th >Category</th>
                          <th >Date / Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {user.length > 0 ? (
                          user.map((data, i) => (
                            <tr>
                              <td>{i + 1}</td>
                              <td>
                                {/* <p className="text-width_wrwpp"> */}
                                  {data.subject}
                                {/* </p> */}
                              </td>
                              <td>
                                {/* <p className="text-width_wrwpp text-center"> */}
                                  {data.message}
                                {/* </p> */}
                              </td>
                              <td>{data.category}</td>
                              <td>{moment(data.updated_at).format("lll")}</td>
                            </tr>
                          ))
                        ) : (
                          <td colSpan="5"> No data found </td>
                        )}
                      </tbody>
                    </table>
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
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
