import React, {useEffect, useState} from "react";

import "rc-slider/assets/index.css";
import Header from "./Header";
import {Button} from "@material-ui/core";

import apiService from "../core/service/detail";
import {postMethod} from "../core/service/common.api";
import {getMethod} from "../core/service/common.api";
import {toast} from "react-toastify";


function Transfer() {
  const value = {
    Category1: "Choose Category",
    Category: "Choose Category",
    amount: 0,
  };

  const [Formdata, setFormdata] = useState(value);

  const [SubjectErr, setSubjectErr] = useState(value);
  const [CategoryErr, setCategoryErr] = useState(value);
  const [amountErr, setamountErr] = useState(value);

  const [formErr, setformErr] = useState("");

  const [currencylist, setcurrencylist] = useState([]);

  const {Category1, Category, amount,currency} = Formdata;

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
    if (condition.Category1 == "") {
      error.Category1 = "Subject is a required field";
      setSubjectErr(true);
    } else if (condition.Category1.length < 5) {
      error.Category1 = "Minimum 5 Characters only allowed ";
      setSubjectErr(true);
    } else if (condition.Category1.length > 50) {
      error.Category1 = "Maximum 50 Characters only allowed ";
      setSubjectErr(true);
    } else {
      setSubjectErr(false);
    }

    if (condition.amount == "") {
      error.amount = "Message is a required field";
      setamountErr(true);
    } else {
      setamountErr(false);
    }
    setformErr(error);
  };

  const submit = async () => {
    validate(Formdata);
    if (
      Formdata.Category1 != "Choose Category" &&
      Formdata.Category != "Choose Category" &&
      Formdata.amount != "" 
    ) {

      var data = {
        apiUrl: apiService.transfer_balance,
        payload: Formdata,
      };
      var resp = await postMethod(data);
      if (resp.status) {
        const obj = {
          Category1: "Choose Category",
          Category: "Choose Category",
          amount: 0,
        };
        setFormdata(obj);
        viewData();
        toast.success(resp.Message);
      } else {
        toast.success(resp.Message);
      }
    } else {
        toast.error("All are required fields");
    }
  };
  const viewData = async () => {
    try {
      var api = {
        apiUrl: apiService.currency_list,
      };
      var view = await getMethod(api);
      if (view.status) setcurrencylist(view.data);
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
                <h1 className="title_blocc">Internal Transfer</h1>
                <div className="staking_title launcpad d-block fonrm_card_s need_meanissss">
                  <div class="row">
                  <div className="col-lg-6">
                    <div class="form-group ">
                        <label>From Wallet</label>
                        <select
                          class="form-control"
                          name="Category1"
                          value={Category1}
                          onChange={getItem}
                        >
                          <option selected>Choose Category</option>
                          <option selected>Spot</option>
                          <option selected>P2p</option>
                          <option selected>Launchpad</option>
                          <option selected>Staking</option>
                        </select>
                      </div>
                      {SubjectErr == true ? (
                        <p style={{color: "red"}}>{formErr.Subject} </p>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group ">
                        <label>To Wallet</label>
                        <select
                          className="form-control"
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
                    <div className="col-lg-6">
                      <div class="form-group ">
                        <label>Amount</label>
                        <input
                        className="form-control"
                          name="amount"
                          type="number"
                          value={amount}
                          onChange={getItem}
                        ></input>
                      </div>
                      {amountErr == true ? (
                        <p style={{color: "red"}}>{formErr.amount} </p>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="col-lg-6">
                    <div class="form-group ">
                        <label>Currecy</label>
                        <select
                          class="form-control"
                          name="currency"
                          value={currency}
                          onChange={getItem}
                        >
                            {currencylist.map((data, i) => (

                          <option selected>{data.currencySymbol}</option>
                          
                            ))}
                        </select>
                      </div>
                      {SubjectErr == true ? (
                        <p style={{color: "red"}}>{formErr.Subject} </p>
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
                    {/* <table class="table">
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
                    </table> */}
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

export default Transfer;
