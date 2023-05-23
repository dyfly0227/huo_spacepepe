import React, {useState, useEffect} from "react";
import {Button} from "@material-ui/core";
import {Link, useNavigate} from "react-router-dom";
import Count from "./Countdown";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import Slider, {Range} from "rc-slider";
import "rc-slider/assets/index.css";
import Header from "./Header";
import Footer from "./Footer";
import Arrow from "../img/ArrowRight.svg";
import glogo from "../img/google_logo.svg";
import {toast} from "react-toastify";
import apiService from "../core/service/detail";
import {postMethod} from "../core/service/common.api";
import {useLocation} from "react-router-dom";
import Alett from "../img/alertmsg.png";

import "rc-slider/assets/index.css";
import Pagination from "react-js-pagination";

function Home() {
  const navigate = useNavigate();
  const options = ["one", "two", "three"];

  const withdrawAction = async (data) => {
    console.log("call here====", data);
    var obj = {
      withdraw_id: data,
    };
    console.log("withdraw confirm obj====", obj);
    var data = {
      apiUrl: apiService.confirmWithdraw,
      payload: obj,
    };
    var resp = await postMethod(data);
    if (resp.status) {
      toast.success(resp.message,{
        toastId: "3"
      });
      //window.location.href = "/transaction";
      navigate("/transaction");
    } else {
      toast.error(resp.message,{
        toastId: "3"
      });
      navigate("/transaction");
    }
  };

  const qry_search = useLocation().search;
  const confirmation = new URLSearchParams(qry_search).get("withdraw");
  if (confirmation != "" && confirmation != null) {
    withdrawAction(confirmation);
  }

  console.log("confirmation====", confirmation);

  const initialFormValue = {
    amount: "",
    withAddress: "",
    tfa: "",
  };

  const initial_depositFormValue = {
    dep_amount: "",
    txn_proof: "",
  };

  const [perpage, setperpage] = useState(5);
  const [page, setpage] = useState(1);
  const [search, setsearch] = useState("");
  const [balanceDetails, setbalanceDetails] = useState([]);
  const [balance_overallusdt, setbalance_overallusde] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [total, settotal] = useState(0);
  const [depositActive, setdepositActive] = useState(false);
  const [withdrawActive, setwithdrawActive] = useState(false);
  const [depositDet, setdepositDet] = useState("");
  const [withdrawDet, setwithdrawDet] = useState("");
  const [addressDet, setAddress] = useState("");
  const [selectCurrency, setSelectCurrency] = useState("");
  const [formValue, setFormValue] = useState(initialFormValue);
  const [amountValidate, setamountValidate] = useState(false);
  const [withAddressValidate, setwithAddress] = useState(false);
  const [tfaValidate, settfaValidate] = useState(false);
  const [validationnErr, setvalidationnErr] = useState("");
  const [network, setNetwork] = useState("");
  const [transaction_proof, settransaction_proof] = useState("");
  const [bankwire, setBankwire] = useState("");
  const [txnProof, settxnProof] = useState(false);
  const [transaction_doc, settransaction_doc] = useState("");
  const [depositformValue, setdepositFormValue] = useState(
    initial_depositFormValue
  );
  const [kycrequired, requiredKyc] = useState(false);

  const {amount, withAddress, tfa} = formValue;
  const {dep_amount, txn_proof} = depositformValue;
  const [buttonLoader, setbuttonLoader] = useState(false);
  const [fiatdepLoader, setfiatdepLoader] = useState(false);
  const [fiatwithLoader, setfiatwithLoader] = useState(false);
  const [withdrawNetwork, setwithdrawNetwork] = useState("");

  const recordPerPage = 5;

  // total number of the records
  const totalRecords = 7;

  // range of pages in paginator
  const pageRange = 5;

  const handlePageChange = (pageNumber) => {
    console.log(
      pageNumber,
      currentPage,
      "-=-=-currentPage==-currentPage=-=-currentPage=-=-currentPage",
      recordPerPage,
      pageRange
    );
    setCurrentPage(pageNumber);
    console.log("-=-=-=-=-pageNumber=-=-=", pageNumber, "=p[p[p[pageNumberp[p");
    // call API to get data based on pageNumber

    getUserbalance(pageNumber);
  };

  const handleChange = async (e) => {
    e.preventDefault();
    const {name, value} = e.target;
    let formData = {...formValue, ...{[name]: value}};
    setFormValue(formData);
    validate(formData);
  };

  const deposit_handleChange = async (e) => {
    e.preventDefault();
    const {name, value} = e.target;
    console.log("e.target====", e.target);
    let formData = {...depositformValue, ...{[name]: value}};
    console.log("formData===", formData);
    setdepositFormValue(formData);
  };

  const setActive = async (menu, depData) => {
    console.log("menu=====", menu);
    if (menu == "deposit") {
      setdepositActive(true);
      setwithdrawActive(false);
      console.log(depData, "-=-=depData=-=-=-");
      setdepositDet(depData);
      if (depData.coinType == "1") {
        var obj = {
          currency: depData.currencysymbol,
          currId: depData.currid,
        };
        var data = {
          apiUrl: apiService.generateAddress,
          payload: obj,
        };

        var resp = await postMethod(data);
        console.log(resp, "=-=-=resp-=-=--");
        if (resp.status) {
          setAddress(resp.Message);
          setSelectCurrency(resp.Message.currencySymbol);
          if (depData.erc20token == "1") {
            setNetwork("ERC20");
          } else if (depData.trc20token == "1") {
            setNetwork("TRC20");
          } else if (depData.bep20token == "1") {
            setNetwork("BEP20");
          }
        } else {
          //toast.error("Something went wrong, please try again later");
        }
      } else {
        var obj = {
          currency: depData.currencysymbol,
        };
        var data = {
          apiUrl: apiService.bankwire,
          payload: obj,
        };

        var resp = await postMethod(data);
        console.log(resp, "=-=-=fiat deposit resp-=-=--");
        if (resp.status) {
          setBankwire(resp.data);
        } else {
          //toast.error("Something went wrong, please try again later");
        }
      }
    } else {
      setwithdrawActive(true);
      setdepositActive(false);
      setwithdrawDet(depData);
      if(depData.currencyType == "2")
      {
        if (depData.erc20token == "1") {
          setwithdrawNetwork("ERC20");
        } else if (depData.trc20token == "1") {
          setwithdrawNetwork("TRC20");
        } else if (depData.bep20token == "1") {
          setwithdrawNetwork("BEP20");
        }
      }
     
    }
  };

  const getUserbalance = async (pages) => {
    var obj = {
      perpage: perpage,
      page: pages,
      search: search,
    };
    var data = {
      apiUrl: apiService.getUserBalance,
      payload: obj,
    };
    var resp = await postMethod(data);
    console.log(resp, "=-=-=-=resp-=-=-=-=");
    if (resp.status) {
      setbalanceDetails(resp.Message);
      setbalance_overallusde(resp.balance);
      settotal(resp.total);
    } else {
    }
  };

  const validate = async (values) => {
    const errors = {};
    if (!values.amount) {
      errors.amount = "Amount is a required field";
      setamountValidate(true);
    }
    if (!values.withAddress) {
      errors.withAddress = "Destination address is a required field";
      setwithAddress(true);
    }
    if (!values.tfa) {
      errors.tfa = "2FA is a required field";
      settfaValidate(true);
    }
    setvalidationnErr(errors);
    return errors;
  };

  const fiatwithdraw_validate = async (values) => {
    const errors = {};
    if (!values.amount) {
      errors.amount = "Amount is a required field";
      setamountValidate(true);
    }
    if (!values.tfa) {
      errors.tfa = "2FA is a required field";
      settfaValidate(true);
    }
    setvalidationnErr(errors);
    return errors;
  };

  const deposit_validate = async (values) => {
    const errors = {};
    if (!values.dep_amount) {
      errors.dep_amount = "Amount is a required field";
      setamountValidate(true);
    }
    if (!values.transaction_doc) {
      errors.txn_proof = "Transaction proof is a required field";
      settxnProof(true);
    }
    setvalidationnErr(errors);
    return errors;
  };

  const depositSubmit = async () => {
    try {
      deposit_validate(depositformValue);
      depositformValue.txn_proof = transaction_doc;
      if (
        depositformValue.dep_amount != "" &&
        depositformValue.txn_proof != ""
      ) {
        if (+depositformValue.dep_amount > 0) {
          var obj = {
            amount: depositformValue.dep_amount,
            txn_proof: depositformValue.txn_proof,
            currency_symbol: depositDet.currencysymbol,
            currId: depositDet.currid,
          };
          var data = {
            apiUrl: apiService.fiatdepositSubmit,
            payload: obj,
          };
          setfiatdepLoader(true);
          var resp = await postMethod(data);
          console.log("resp.message====", resp.message);
          if (resp.status) {
            var obj = {
              dep_amount: "",
              txn_proof: "",
            };
            setdepositFormValue(obj);
            setfiatdepLoader(false);
            toast.success(resp.Message);
            //window.location.reload(false);
          } else {
            toast.error(resp.Message);
            if(resp.redirect != null)
            {
              navigate("/"+resp.redirect+"/");
            }
            //window.location.reload(false);
          }
        } else {
          toast.error("Please give valid deposit amount!");
        }
      } else {
        toast.error("All fields are required!");
      }
    } catch (error) {}
  };

  const withdrawSubmit = async () => {
    try {
      validate(formValue);
      if (
        formValue.amount != "" &&
        formValue.withAddress != "" &&
        formValue.tfa != ""
      ) {
        if (+formValue.amount > 0) {
          if (withdrawDet.minWithdrawLimit > formValue.amount) {
            toast.error(
              "Please enter greater than " +
                withdrawDet.minWithdrawLimit +
                " amount"
            );
          } else if (withdrawDet.maxWithdrawLimit < formValue.amount) {
            toast.error(
              "Please enter less than " +
                withdrawDet.maxWithdrawLimit +
                " amount"
            );
          } else {
            var obj = {
              amount: formValue.amount,
              withdraw_address: formValue.withAddress,
              tfaCode: formValue.tfa,
              currency_symbol: withdrawDet.currencysymbol,
              currId: withdrawDet.currid,
            };
            var data = {
              apiUrl: apiService.submitWithdraw,
              payload: obj,
            };
            setbuttonLoader(true);
            var resp = await postMethod(data);
            console.log("resp.message====", resp.message);
            if (resp.status) {
              toast.success(resp.message);
              setbuttonLoader(false);
              formValue.amount = "";
              formValue.withAddress = "";
              formValue.tfa = "";
              //window.location.reload(false);
            } else {
              toast.error(resp.message);
              setbuttonLoader(false);
              formValue.amount = "";
              formValue.withAddress = "";
              formValue.tfa = "";
              //window.location.reload(false);
            }
          }
        } else {
          toast.error("Please give valid withdraw amount!");
        }
      }
    } catch (error) {}
  };

  const imageUpload = (type, val) => {
    console.log("type===", type);
    console.log("val===", val);
    const fileExtension = val.name.split(".").at(-1);
    const fileSize = val.size;
    const fileName = val.name;
    console.log("fileExtension===", fileExtension);
    console.log("fileSize===", fileSize);
    console.log("fileName===", fileName);
    if (
      fileExtension != "png" &&
      fileExtension != "jpg" &&
      fileExtension != "jpeg" &&
      fileExtension != "docx" &&
      fileExtension != "pdf"
    ) {
      settransaction_proof("");
      toast.error("File does not support. You must use .png or .jpg or .jpeg ");
      return false;
    } else if (fileSize > 1000000) {
      settransaction_proof("");
      toast.error("Please upload a file smaller than 1 MB");
      return false;
    } else {
      const data = new FormData();
      settransaction_proof(data.append("file", val));
      data.append("file", val);
      data.append("upload_preset", "sztbiwly");
      data.append("cloud_name", "taikonz-com");
      console.log("formdata===", data);
      fetch("https://api.cloudinary.com/v1_1/taikonz-com/auto/upload", {
        method: "post",
        body: data,
      })
        .then((resp) => resp.json())
        .then((data) => {
          console.log("cloudinary upload===", data);
          if (type == "txn_proof") {
            settransaction_doc(data.secure_url);
            settxnProof(true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const searchWalletList = async () => {
    getUserbalance(1);
  };
  const fiatwithdrawSubmit = async () => {
    try {
      fiatwithdraw_validate(formValue);
      if (formValue.amount != "" && formValue.tfa != "") {
        if (+formValue.amount > 0) {
          if (withdrawDet.minWithdrawLimit >= formValue.amount) {
            toast.error(
              "Please enter greater than " +
                withdrawDet.minWithdrawLimit +
                " amount"
            );
          } else if (withdrawDet.maxWithdrawLimit < formValue.amount) {
            toast.error(
              "Please enter less than " +
                withdrawDet.maxWithdrawLimit +
                " amount"
            );
          } else {
            var obj = {
              amount: formValue.amount,
              tfaCode: formValue.tfa,
              currency_symbol: withdrawDet.currencysymbol,
              currId: withdrawDet.currid,
            };
            var data = {
              apiUrl: apiService.submitfiatWithdraw,
              payload: obj,
            };
            setfiatwithLoader(true);
            var resp = await postMethod(data);
            console.log("resp.message====", resp.message);
            if (resp.status) {
              setfiatwithLoader(false);
              formValue.amount = "";
              formValue.tfa = "";
              toast.success(resp.message);

              //window.location.reload(false);
            } else {
              setfiatwithLoader(false);
              formValue.amount = "";
              formValue.tfa = "";
              toast.error(resp.message);
              //window.location.reload(false);
            }
          }
        } else {
          toast.error("Please give valid withdraw amount!");
        }
      }
    } catch (error) {}
  };

  useEffect(() => {
    let token_socket = localStorage.getItem("user_token");
    if (!token_socket) {
      navigate("/login");
    } else {
      let token_kyc = localStorage.getItem("eligibleforEarn");
      console.log("token_kyc===", token_kyc);
      if (!token_kyc && token_kyc != 1) {
        console.log("call 111");
        requiredKyc(false);
      } else {
        console.log("call 2222");
        requiredKyc(true);
      }
    }

    getUserbalance(currentPage);
  }, []);
  const copy = async (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Address copied");
  };
  return (
    <div className="">
      <main className="">
        {/* <Header /> */}
        <div class="container p-0">
          <div className="p-0">
            <div class="">
              <div className="row">
                <div className="col-lg-12">
                  <div className="tab_sectio_wallet">
                    <div className="container padin_zero p-0">
                      <div>
                        {/* <ul class="nav nav-tabs">
                          <li class="">
                            <a data-toggle="tab" href="#wallet" class="active">
                              Wallet
                            </a>
                          </li>
                          <li>
                            <a data-toggle="tab" href="#Transaction">
                              Transaction
                            </a>
                          </li>
                        </ul> */}
                      </div>
                      <div className="table_section_ padin_zero p-0">
                        <div class="tab-content">
                          <div id="wallet" class="tab-pane fade in active show">
                            <div className="container padin_zero">
                              <div className="prime_deposit copyicon right search_theme">
                                <input
                                  type="text"
                                  name="searchvallist"
                                  // value={searchvallist}
                                  placeholder="Search by Currency Name,Code"
                                  onChange={(e) => setsearch(e.target.value)}
                                />
                                <span onClick={() => searchWalletList()}>
                                  <i class="bi bi-search"></i>
                                </span>
                              </div>
                              <div class="table-responsive bg_card_section">
                                <table className="table">
                                  <thead>
                                    <tr>
                                      <th scope="col">Asset</th>
                                      <th scope="col">Total Coins</th>
                                      <th scope="col" class="text_222">
                                        Available Balance
                                      </th>
                                      <th scope="col" class="text_222">
                                        In Order
                                      </th>
                                      {/* <th scope="col" class="text_222">24h Market</th> */}
                                      <th scope="col" class="text_222"></th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {balanceDetails &&
                                      balanceDetails.map((item, i) => {
                                        return (
                                          <tr>
                                            <td>
                                              <div class="coin_table_ta">
                                                <img
                                                  src={item.currencyImage}
                                                  className=""
                                                />
                                                <div class="row_eee">
                                                  <h3>{item.currencysymbol}</h3>
                                                  <span>
                                                    {item.currencyName}
                                                  </span>
                                                </div>
                                              </div>
                                            </td>
                                            <td>
                                              <div class="row_oiu_p">
                                                <h5>
                                                  {" "}
                                                  {parseFloat(
                                                    item.currencyBalance +
                                                      parseFloat(
                                                        item.holdAmount
                                                      )
                                                  ).toFixed(8)}{" "}
                                                  {item.currencysymbol}{" "}
                                                </h5>
                                              </div>
                                            </td>
                                            <td>
                                              <div class="row_oiu_p">
                                                <h5>
                                                  {parseFloat(
                                                    item.currencyBalance
                                                  ).toFixed(8)}{" "}
                                                  {item.currencysymbol}
                                                </h5>
                                              </div>
                                            </td>
                                            <td>
                                              <div class="row_oiu_p">
                                                <h5>
                                                  {parseFloat(
                                                    item.holdAmount
                                                  ).toFixed(8)}{" "}
                                                  {item.currencysymbol}{" "}
                                                </h5>
                                              </div>
                                            </td>
                                            <td>
                                              <div className="prime_deposit">
                                                <button
                                                  onClick={() =>
                                                    setActive("withdraw", item)
                                                  }
                                                >
                                                  Withdraw
                                                </button>
                                                <button
                                                  className="deposit_p"
                                                  onClick={() =>
                                                    setActive("deposit", item)
                                                  }
                                                >
                                                  Deposit
                                                </button>
                                              </div>
                                            </td>
                                          </tr>
                                        );
                                      })}
                                  </tbody>
                                </table>
                                <Pagination
                                  itemClass="page-item"
                                  linkClass="page-link"
                                  activePage={currentPage}
                                  itemsCountPerPage={recordPerPage}
                                  totalItemsCount={total}
                                  pageRangeDisplayed={pageRange}
                                  onChange={handlePageChange}
                                />
                              </div>
                              {/* { 
                        kycrequired === false ? (
                        <span> */}
                              {withdrawActive == true &&
                              withdrawDet &&
                              withdrawDet.coinType == "1" ? (
                                <div
                                  className="bg_card_section withdraw"
                                  id="withdraw"
                                >
                                  <div className="row">
                                    <div className="col-lg-4">
                                      <div className="balance_section">
                                        <h3>
                                          <img
                                            src={
                                              withdrawDet &&
                                              withdrawDet.currencyImage
                                            }
                                          />{" "}
                                          {withdrawDet &&
                                            withdrawDet.currencysymbol}{" "}
                                        </h3>
                                        <div className="padin_cls_00">
                                          <span>Available Balance</span>
                                          <h1>
                                            {" "}
                                            {withdrawDet &&
                                              withdrawDet.currencyBalance.toFixed(
                                                8
                                              )}{" "}
                                          </h1>
                                        </div>
                                      </div>
                                    </div>
                                    {localStorage.getItem("tfa_status") == 1 ? (
                                      <div className="col-lg-8">
                                        <div>
                                          <div className="form_">
                                            <form className="form_wiuthdrawl ">
                                              <p>
                                                {" "}
                                                Transfer{" "}
                                                {withdrawDet &&
                                                  withdrawDet.currencysymbol}{" "}
                                                from Taikonz to other wallet
                                                address{" "}
                                              </p>
                                              {withdrawDet &&
                                                  withdrawDet.currencyType == "2" ? (
                                                    <p>Network: {withdrawNetwork} </p>
                                                  ): ("")}
                                              
                                              <label>Destination Address</label>
                                              <div className="prime_deposit">
                                                <input
                                                  type="text"
                                                  placeholder="Enter Address"
                                                  name="withAddress"
                                                  value={withAddress}
                                                  onChange={handleChange}
                                                />
                                              </div>
                                              <div>
                                                {withAddressValidate == true ? (
                                                  <p className="text-danger">
                                                    {" "}
                                                    {
                                                      validationnErr.withAddress
                                                    }{" "}
                                                  </p>
                                                ) : (
                                                  ""
                                                )}
                                              </div>
                                              <div className="clsflex_ss flex-column justify-content-start align-items-start">
                                                <div className="form_position">
                                                  <label>
                                                    {withdrawDet &&
                                                      withdrawDet.currencysymbol}{" "}
                                                    Amount
                                                  </label>
                                                  <div className="prime_deposit">
                                                    <input
                                                      type="number"
                                                      placeholder="Enter Amount"
                                                      name="amount"
                                                      value={amount}
                                                      onChange={handleChange}
                                                    />
                                                  </div>
                                                  <div>
                                                    {amountValidate == true ? (
                                                      <p className="text-danger">
                                                        {" "}
                                                        {
                                                          validationnErr.amount
                                                        }{" "}
                                                      </p>
                                                    ) : (
                                                      ""
                                                    )}
                                                  </div>
                                                </div>

                                                <div className="form_position">
                                                  <label>Enter 2FA Code</label>
                                                  <div className="prime_deposit">
                                                    <input
                                                      type="number"
                                                      placeholder="Enter 2FA"
                                                      name="tfa"
                                                      value={tfa}
                                                      onChange={handleChange}
                                                    />
                                                  </div>
                                                  <div>
                                                    {tfaValidate == true ? (
                                                      <p className="text-danger">
                                                        {" "}
                                                        {
                                                          validationnErr.tfa
                                                        }{" "}
                                                      </p>
                                                    ) : (
                                                      ""
                                                    )}
                                                  </div>
                                                </div>

                                                <div>
                                                  <p>
                                                    {" "}
                                                    Minimum Withdraw :{" "}
                                                    {withdrawDet &&
                                                      withdrawDet.minWithdrawLimit}{" "}
                                                  </p>
                                                </div>
                                                <div>
                                                  <p>
                                                    Maximum Withdraw :{" "}
                                                    {withdrawDet &&
                                                      withdrawDet.maxWithdrawLimit}
                                                  </p>
                                                </div>
                                                <div>
                                                  <div className="prime_deposit">
                                                    <span>
                                                      {buttonLoader == false ? (
                                                        <span
                                                          className="mardg_lss btn btn-primary"
                                                          onClick={() =>
                                                            withdrawSubmit()
                                                          }
                                                        >
                                                          {" "}
                                                          Withdraw
                                                        </span>
                                                      ) : (
                                                        <span className="mardg_lss btn btn-primary">
                                                          {" "}
                                                          loading...
                                                        </span>
                                                      )}
                                                    </span>
                                                  </div>
                                                </div>
                                              </div>
                                            </form>
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="padin_cls_00">
                                        {/* <span>Please Enable 2FA</span> */}
                                        <div className="prime_deposit">
                                          <Link to="/profile">
                                            <button>Please Enable 2FA</button>
                                          </Link>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                ""
                              )}

                              {withdrawActive == true &&
                              withdrawDet &&
                              withdrawDet.coinType == "2" ? (
                                <div
                                  className="bg_card_section withdraw"
                                  id="withdraw"
                                >
                                  <div className="row">
                                    <div className="col-lg-4">
                                      <div className="balance_section">
                                        <h3>
                                          <img
                                            src={
                                              withdrawDet &&
                                              withdrawDet.currencyImage
                                            }
                                          />{" "}
                                          {withdrawDet &&
                                            withdrawDet.currencysymbol}{" "}
                                        </h3>
                                        <div className="padin_cls_00">
                                          <span>Available Balance</span>
                                          <h1>
                                            {" "}
                                            {withdrawDet &&
                                              withdrawDet.currencyBalance.toFixed(
                                                8
                                              )}{" "}
                                          </h1>
                                        </div>
                                      </div>
                                    </div>
                                    {localStorage.getItem("tfa_status") == 1 ? (
                                      <div className="col-lg-8">
                                        <div>
                                          <div className="form_">
                                            <form className="form_wiuthdrawl ">
                                              <div className="clsflex_ss flex-column justify-content-start align-items-start">
                                                <div className="form_position">
                                                  <label>
                                                    {withdrawDet &&
                                                      withdrawDet.currencysymbol}{" "}
                                                    Amount
                                                  </label>
                                                  <div className="prime_deposit">
                                                    <input
                                                      type="number"
                                                      placeholder="Enter Amount"
                                                      name="amount"
                                                      value={amount}
                                                      onChange={handleChange}
                                                    />
                                                  </div>
                                                  <div>
                                                    {amountValidate == true ? (
                                                      <p className="text-danger">
                                                        {" "}
                                                        {
                                                          validationnErr.amount
                                                        }{" "}
                                                      </p>
                                                    ) : (
                                                      ""
                                                    )}
                                                  </div>
                                                </div>

                                                <div className="form_position">
                                                  <label>Enter 2FA Code</label>
                                                  <div className="prime_deposit">
                                                    <input
                                                      type="number"
                                                      placeholder="Enter 2FA"
                                                      name="tfa"
                                                      value={tfa}
                                                      onChange={handleChange}
                                                    />
                                                  </div>
                                                  <div>
                                                    {tfaValidate == true ? (
                                                      <p className="text-danger">
                                                        {" "}
                                                        {
                                                          validationnErr.tfa
                                                        }{" "}
                                                      </p>
                                                    ) : (
                                                      ""
                                                    )}
                                                  </div>
                                                </div>

                                                <div>
                                                  <p>
                                                    {" "}
                                                    Minimum Withdraw :{" "}
                                                    {withdrawDet &&
                                                      withdrawDet.minWithdrawLimit}{" "}
                                                  </p>
                                                </div>
                                                <div>
                                                  <p>
                                                    Maximum Withdraw :{" "}
                                                    {withdrawDet &&
                                                      withdrawDet.maxWithdrawLimit}
                                                  </p>
                                                </div>
                                                <div>
                                                  <div className="prime_deposit">
                                                    <span>
                                                      {fiatwithLoader ==
                                                      false ? (
                                                        <span
                                                          className="mardg_lss btn btn-primary"
                                                          onClick={() =>
                                                            fiatwithdrawSubmit()
                                                          }
                                                        >
                                                          {" "}
                                                          Withdraw
                                                        </span>
                                                      ) : (
                                                        <span className="mardg_lss btn btn-primary">
                                                          {" "}
                                                          Loading...
                                                        </span>
                                                      )}
                                                    </span>
                                                  </div>
                                                </div>
                                              </div>
                                            </form>
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="padin_cls_00">
                                        <div className="prime_deposit">
                                          <Link to="/profile">
                                            <button>Please Enable 2FA</button>
                                          </Link>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                ""
                              )}
                              {depositActive == true &&
                              depositDet &&
                              depositDet.coinType == "1" ? (
                                <div
                                  className="bg_card_section deposit"
                                  id="dep"
                                >
                                  <div className="row">
                                    <div className="col-lg-4">
                                      <div className="balance_section">
                                        <h3>
                                          <img
                                            src={
                                              depositDet &&
                                              depositDet.currencyImage
                                            }
                                          />{" "}
                                          {depositDet &&
                                            depositDet.currencysymbol}{" "}
                                        </h3>
                                        <div className="padin_cls_00">
                                          <span>Available Balance</span>
                                          <h1>
                                            {" "}
                                            {depositDet &&
                                              depositDet.currencyBalance.toFixed(
                                                8
                                              )}{" "}
                                          </h1>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-lg-8">
                                      <div>
                                        <div className="form_">
                                          <form className="form_wiuthdrawl ">
                                            <p>
                                              {" "}
                                              Send to your secure{" "}
                                              {depositDet &&
                                                depositDet.currencysymbol}{" "}
                                              deposit address{" "}
                                            </p>
                                            <label>Address</label>
                                            <div className="prime_deposit copyicon">
                                              <input
                                                type="text"
                                                value={addressDet.address}
                                                disabled
                                              />
                                              <span
                                                onClick={() =>
                                                  copy(addressDet.address)
                                                }
                                              >
                                                <i class="bi bi-clipboard-check"></i>
                                              </span>
                                            </div>

                                            {addressDet && addressDet.tag ? (
                                              <>
                                                <label>Destination Tag</label>
                                                <div className="prime_deposit">
                                                  <input
                                                    type="text"
                                                    value={addressDet.tag}
                                                    disabled
                                                  />
                                                </div>
                                              </>
                                            ) : (
                                              ""
                                            )}

                                            {depositDet &&
                                            depositDet.currencyType == "2" ? (
                                              <>
                                                <label>Network</label>
                                                <div className="prime_deposit">
                                                  <input
                                                    type="text"
                                                    value={network}
                                                    disabled
                                                  />
                                                </div>
                                              </>
                                            ) : (
                                              ""
                                            )}

                                            <p> Scan QR code </p>
                                            <div className="prime_deposit">
                                              {selectCurrency &&
                                              selectCurrency ==
                                                depositDet.currencysymbol ? (
                                                <img
                                                  className="w-30 img-fluid"
                                                  src={addressDet.qrcode}
                                                />
                                              ) : (
                                                ""
                                              )}
                                            </div>
                                          </form>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                ""
                              )}

                              {depositActive == true &&
                              depositDet &&
                              depositDet.coinType == "2" ? (
                                <div
                                  className="bg_card_section deposit fiat_deposit"
                                  id="dep"
                                >
                                  <div className="row">
                                    <div className="col-lg-4">
                                      <div className="balance_section">
                                        <h3>
                                          <img
                                            src={
                                              depositDet &&
                                              depositDet.currencyImage
                                            }
                                          />{" "}
                                          {depositDet &&
                                            depositDet.currencysymbol}{" "}
                                        </h3>
                                        <div className="padin_cls_00">
                                          <span>Available Balance</span>
                                          <h1>
                                            {" "}
                                            {depositDet &&
                                              depositDet.currencyBalance.toFixed(
                                                8
                                              )}{" "}
                                          </h1>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-lg-8">
                                      <div>
                                        <div className="form_">
                                          <form className="form_wiuthdrawl px-4">
                                            <p>
                                              {" "}
                                              Deposit funds to your{" "}
                                              {depositDet &&
                                                depositDet.currencysymbol}{" "}
                                              wallet via wire transfer{" "}
                                            </p>
                                            <p>
                                              {" "}
                                              Note the account details below and
                                              add as a beneficiary to your
                                              registered bank account{" "}
                                            </p>
                                            <div className="row">
                                              <div className="col-lg-6">
                                                <label>Beneficiary Name</label>
                                                <div className="prime_deposit">
                                                  <input
                                                    type="text"
                                                    value={bankwire.Name}
                                                    disabled
                                                    className="w-100"
                                                  />
                                                </div>
                                              </div>
                                              <div className="col-lg-6">
                                                <label>Bank Name</label>
                                                <div className="prime_deposit">
                                                  <input
                                                    type="text"
                                                    value={bankwire.Bank_Name}
                                                    disabled
                                                    className="w-100"
                                                  />
                                                </div>
                                              </div>
                                            </div>

                                            <div className="row">
                                              <div className="col-lg-6">
                                                <label>Account Number</label>
                                                <div className="prime_deposit">
                                                  <input
                                                    type="text"
                                                    value={
                                                      bankwire.Account_Number
                                                    }
                                                    disabled
                                                    className="w-100"
                                                  />
                                                </div>
                                              </div>

                                              <div className="col-lg-6">
                                                <label>IFSC Code</label>
                                                <div className="prime_deposit">
                                                  <input
                                                    type="text"
                                                    value={bankwire.IFSC_code}
                                                    disabled
                                                    className="w-100"
                                                  />
                                                </div>
                                              </div>
                                            </div>

                                            <div className="row">
                                              <div className="col-lg-6">
                                                <label>Account Type</label>
                                                <div className="prime_deposit">
                                                  <input
                                                    type="text"
                                                    value={
                                                      bankwire.Account_type
                                                    }
                                                    disabled
                                                    className="w-100"
                                                  />
                                                </div>
                                              </div>

                                              <div className="col-lg-6">
                                                <label>Branch Name</label>
                                                <div className="prime_deposit">
                                                  <input
                                                    type="text"
                                                    value={bankwire.Branch_Name}
                                                    disabled
                                                    className="w-100"
                                                  />
                                                </div>
                                              </div>
                                            </div>

                                            <div className="clsflex_ss flex-column justify-content-start align-items-start">
                                              <div className="row">
                                                <div className="col-lg-6">
                                                  <div className="form_position">
                                                    <label> Amount</label>
                                                    <div className="prime_deposit">
                                                      <input
                                                        type="number"
                                                        placeholder="Enter Amount"
                                                        name="dep_amount"
                                                        value={dep_amount}
                                                        onChange={
                                                          deposit_handleChange
                                                        }
                                                        className="w-100"
                                                      />
                                                    </div>
                                                    <div>
                                                      {amountValidate ==
                                                      true ? (
                                                        <p className="text-danger">
                                                          {" "}
                                                          {
                                                            validationnErr.dep_amount
                                                          }{" "}
                                                        </p>
                                                      ) : (
                                                        ""
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>

                                                <div className="col-lg-6">
                                                  <div className="form_position">
                                                    <label>
                                                      Transaction Proof
                                                    </label>
                                                    <div className="prime_deposit">
                                                      <input
                                                        type="file"
                                                        name="image"
                                                        value={
                                                          transaction_proof
                                                        }
                                                        onChange={(e) =>
                                                          imageUpload(
                                                            "txn_proof",
                                                            e.target.files[0]
                                                          )
                                                        }
                                                        className="w-100"
                                                      />
                                                    </div>
                                                    <div>
                                                      {txnProof == true ? (
                                                        <p className="text-danger">
                                                          {" "}
                                                          {
                                                            validationnErr.txnProof
                                                          }{" "}
                                                        </p>
                                                      ) : (
                                                        ""
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="prime_deposit">
                                                <span>
                                                  {fiatdepLoader == false ? (
                                                    <span
                                                      className="mardg_lss btn btn-primary button_centerer"
                                                      onClick={() =>
                                                        depositSubmit()
                                                      }
                                                    >
                                                      {" "}
                                                      Deposit
                                                    </span>
                                                  ) : (
                                                    <span className="mardg_lss btn btn-primary button_centerer">
                                                      Loading...
                                                    </span>
                                                  )}
                                                </span>
                                              </div>
                                            </div>
                                          </form>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                ""
                              )}
                              {/* </span>
                         ) : */}
                              {/* //  (
                        //   <span>
                        //   <img src={Alett} />
                        //    </span>
                        //  )
                        //   } */}
                            </div>
                            <div id="Transaction" class="tab-pane fade">
                              <div class="container">
                                <div class="table-responsive bg_card_section">
                                  <table class="table">
                                    <thead>
                                      <tr>
                                        <th scope="col">S.No</th>
                                        <th scope="col">Date</th>
                                        <th scope="col" class="text_222">
                                          Currency
                                        </th>
                                        <th scope="col" class="text_222">
                                          Amount
                                        </th>
                                        <th scope="col" class="text_222">
                                          Transaction Id
                                        </th>
                                        <th scope="col" class="text_222">
                                          Type
                                        </th>
                                        <th scope="col" class="text_222">
                                          Status
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td>1</td>
                                        <td>20.20.22</td>

                                        <td>BTC</td>
                                        <td>INR 200</td>
                                        <td>21324165465</td>
                                        <td>
                                          <div class="prime_deposit">
                                            <button>Deposit</button>
                                          </div>
                                        </td>
                                        <td>
                                          <span className="text-green">
                                            Success
                                          </span>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                  <div class="d-flex justify-content-center prime_deposit">
                                    <button class="deposit_p">View more</button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
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
