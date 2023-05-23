import React, { useEffect } from "react";
import useState from "react-usestateref";

import { Link, useNavigate } from "react-router-dom";

import "rc-slider/assets/index.css";
import Header from "./Header";
import { Button } from "@material-ui/core";
import { Card, Grid, Paper } from "@mui/material";

import apiService from "../core/service/detail";
import { postMethod } from "../core/service/common.api";
import { getMethod } from "../core/service/common.api";
import { toast } from "react-toastify";
import { setAuthToken, getAuthToken } from "../core/lib/localStorage";
import OTPInput, { ResendOTP } from "otp-input-react";

function Home() {
    const initialFormValue = {
        AccountHolderName: "",
        AccountNumber: "",
        IFSCCode: "",
        BankName: "",
        BranchName: "",
        BranchAddress: "",
        gpay_number: "",
        paytm_number: "",
    };
    const [formValue, setFormValue] = useState(initialFormValue);
    const [AccountHolderNameErr, SetAccountHolderNameErr, AccountHolderNameErrref,] = useState(false);
    const [AccountNumberErr, SetAccountNumberErr, AccountNumberErrref] = useState(false);
    const [IFSCCodeErr, SetIFSCCodeErr, IFSCCodeErrref] = useState(false);
    const [BankNameErr, SetBankNameErr, BankNameErrref] = useState(false);
    const [BranchNameErr, SetBranchNameErr, BranchNameErrref] = useState(false);
    const [gpayNumber, setgpayNumber, gpayNumberref] = useState(false);
    const [paytmNumber, setpaytmNumber, paytmNumberref] = useState(false);
    const [validationnErr, setvalidationnErr] = useState("");
    const [BranchAddressErr, SetBranchAddressErr, BranchAddressErrref] = useState(false);
    const [Bankdetails, SetBankdetails] = useState([]);
    const [loading, setloading] = useState(false);

    const {
        AccountHolderName,
        AccountNumber,
        IFSCCode,
        BankName,
        BranchName,
        BranchAddress,
        gpay_number,
        paytm_number,
    } = formValue;

    const navigate = useNavigate();

    const handleChange = async (e) => {
        console.log("e====", e);
        e.preventDefault();
        const { name, value } = e.target;
        let formData = { ...formValue, ...{ [name]: value } };
        console.log("formData====", formData);
        setFormValue(formData);
    };



    const validate = async (values) => {
        const errors = {};
        if (values.AccountHolderName == "") {
            errors.AccountHolderName = "Account Holder Name is require !";
            SetAccountHolderNameErr(true);
        } 
        // else if (
        //     values.AccountHolderName.length < 5 ||
        //     values.AccountHolderName.length > 25
        // ) {
        //     errors.AccountHolderName =
        //         "Account Holder Name must hava an 5 to 25 characters!";
        //     SetAccountHolderNameErr(true);
        // } 
        else {
            SetAccountHolderNameErr(false);
        }
        if (values.AccountNumber == "") {
            errors.AccountNumber = "Account Number is require !";
            SetAccountNumberErr(true);
        } 
        // else if (
        //     values.AccountNumber.length < 5 ||
        //     values.AccountNumber.length > 25
        // ) {
        //     errors.AccountNumber = "Account Number  must hava an 5 to 25 Digits!";
        //     SetAccountNumberErr(true);
        // } 
        else {
            SetAccountNumberErr(false);
        }
        if (values.IFSCCode == "") {
            errors.IFSCCode = "IFSC Code is require !";
            SetIFSCCodeErr(true);
        } 
        // else if (values.IFSCCode.length < 5 || values.IFSCCode.length > 25) {
        //     errors.IFSCCode = "IFSC Code must have an 5 to 25 characters!";
        //     SetIFSCCodeErr(true);
        // } 
        else {
            SetIFSCCodeErr(false);
        }
        if (values.BankName == "") {
            errors.BankName = "Bank Name is require !";
            SetBankNameErr(true);
        } 
        // else if (values.BankName.length < 5 || values.BankName.length > 25) {
        //     errors.BankName = "Bank Name must have an 5 to 25 characters!";
        //     SetBankNameErr(true);
        // } 
        else {
            SetBankNameErr(false);
        }
        if (values.BranchName == "") {
            errors.BranchName = "Branch Name is require !";
            SetBranchNameErr(true);
        } 
        // else if (values.BranchName.length < 5 || values.BranchName.length > 25) {
        //     errors.BranchName = "Branch Name must have an 5 to 25 !";
        //     SetBranchNameErr(true);
        // } 
        else {
            SetBranchNameErr(false);
        }
        if (values.BranchAddress == "") {
            errors.BranchAddress = "Branch Address is require !";
            SetBranchAddressErr(true);
        } 
        // else if (
        //     values.BranchAddress.length < 5 ||
        //     values.BranchAddress.length > 150
        // ) {
        //     errors.BranchAddress = "Branch Address must have an 5 to 150 characters!";
        //     SetBranchAddressErr(true);
        // }
        else {
            SetBranchAddressErr(false);
        }
        // if (values.gpay_number == "") {
        //     errors.gpay_number = "Gpay Details is require !";
        //     setgpayNumber(true);
        // }

        // if (values.paytm_number == "") {
        //     errors.paytm_number = "Paytm Details is require !";
        //     setpaytmNumber(true);
        // }

        setvalidationnErr(errors);
        return errors;
    };

    useEffect(() => {
        getbankdetails();

    }, [0])

    const submitID = async () => {
        try {
            validate(formValue);

            if (
                formValue.AccountHolderName != "" &&
                // formValue.AccountHolderName.length >= 5 &&
                // formValue.AccountHolderName.length <= 25 &&
                formValue.AccountNumber != "" &&
                // formValue.AccountNumber.length >= 5 &&
                // formValue.AccountNumber.length <= 25 &&
                formValue.IFSCCode != "" &&
                // formValue.IFSCCode.length >= 5 &&
                // formValue.IFSCCode.length <= 25 &&
                formValue.BankName != "" &&
                // formValue.BankName.length >= 5 &&
                // formValue.BankName.length <= 25 &&
                formValue.BranchName != "" &&
                // formValue.BranchName.length >= 5 &&
                // formValue.BranchName.length <= 25 &&
                formValue.BranchAddress != ""
                // formValue.BranchAddress.length >= 5 &&
                // formValue.BranchAddress.length <= 150 &&
                // formValue.gpay_number != "" &&
                // formValue.paytm_number != ""
            ) {

                var data = {
                    apiUrl: apiService.Bankdetails,
                    payload: formValue,
                };

                var resp = await postMethod(data);
                console.log(resp, "=-=-resp=--=-=")
                if (resp.status) {
                    getbankdetails();
                    toast.success(resp.Message);
                    
                } else {
                    toast.error(resp.Message);
                }
            } else {
                toast.error("Please fill all the require  fields");
                console.log("ALL FIELD NEED");
            }
        } catch (error) { }
    };


    const getbankdetails = async () => {
        try {
            var data = {
                apiUrl: apiService.Getbankdetails,
            };
            var resp = await getMethod(data);
            console.log("getbankdetails===", resp);
            SetBankdetails(resp.obj);
            if (resp) {
                console.log(resp.obj, "=-=-respobj-=-=")
                console.log(resp, '-=-=-resp=-=-=-resp==-resp');
            } else {
                console.log(resp, '-=-=-resp=-=-=-resp==-resp');
            }


        } catch (error) {
            console.log(error, "=-=error=-=-=");
        }
    };

    const defaultBank = async (editData) => {
        console.log(editData, '=-=-=-=defaultBank')
        try {
            var data = {
                apiUrl: apiService.defaultBanks,
                payload: editData,
            };
            console.log(data, "=-=datap-0-")
            var resp = await postMethod(data);
            console.log(resp, "=-=resp--=")
            if (resp.status) {
            
                toast(resp.Message);
                getbankdetails();
            } else {
                toast(resp.Message);
            }
        } catch (error) {

        }
    }
    const deletebank = async (deleteData) => {

        alert("Are you sure you want to permanently delete this bank details ?");
        console.log(deleteData, '=-=-=-=deleteData')
        try {
            var data = {
                apiUrl: apiService.deletbank,
                payload: deleteData,
            };
            var resp = await postMethod(data);
            if (resp.status) {
                getbankdetails();
                toast(resp.Message);
            } else {
                toast(resp.Message);
            }
        } catch (error) {

        }
    }
    return (
        <div className="">
            <main className="main-content tradepage-bg login_body_ bg-cover height_100">
                {/* <Header /> */}
                <div className="container pt-5 padin_zero">
                    <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 padin_zero">
                        <div className="container d-flex justify-content-center flexnew_center">
                            <div className="col-lg-10 padin_zero">
                                <h1 className="title_blocc">Bank Details</h1>
                                <div className="staking_title launcpad d-block fonrm_card_s need_meanissss">
                                    <div class="row">
                                        <div className="col-lg-6">
                                            <div class="form-group">
                                                <label>AccountHolderName</label>
                                                <input
                                                    className="form-control"
                                                    placeholder="Account Holder Name"
                                                    name="AccountHolderName"
                                                    value={AccountHolderName}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            {AccountHolderNameErrref.current == true ? (
                                                <p className="text-danger">
                                                    {" "}
                                                    {validationnErr.AccountHolderName}{" "}
                                                </p>
                                            ) : (
                                                ""
                                            )}

                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label>Account Number</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Account Number"
                                                    name="AccountNumber"
                                                    value={AccountNumber}
                                                    onChange={handleChange}

                                                />
                                            </div>
                                            {AccountNumberErrref.current == true ? (
                                                <p className="text-danger">
                                                    {" "}
                                                    {validationnErr.AccountNumber}{" "}
                                                </p>
                                            ) : (
                                                ""
                                            )}
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label>IFSC Code</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="IFSC Code"
                                                    name="IFSCCode"
                                                    value={IFSCCode}
                                                    onChange={handleChange}

                                                />
                                            </div>
                                            {IFSCCodeErrref.current == true ? (
                                                <p className="text-danger">
                                                    {" "}
                                                    {validationnErr.IFSCCode}{" "}
                                                </p>
                                            ) : (
                                                ""
                                            )}


                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label>Bank Name</label>

                                                <input

                                                    className="form-control"
                                                    placeholder="Bank Name"
                                                    name="BankName"
                                                    value={BankName}
                                                    onChange={handleChange}

                                                />
                                                {BankNameErrref.current == true ? (
                                                    <p className="text-danger">
                                                        {" "}
                                                        {validationnErr.BankName}{" "}
                                                    </p>
                                                ) : (
                                                    ""
                                                )}

                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label>Branch Name</label>
                                                <input

                                                    className="form-control"
                                                    placeholder="Branch Name"
                                                    name="BranchName"
                                                    value={BranchName}
                                                    onChange={handleChange}

                                                />
                                                {BranchNameErrref.current == true ? (
                                                    <p className="text-danger">
                                                        {" "}
                                                        {validationnErr.BranchName}{" "}
                                                    </p>
                                                ) : (
                                                    ""
                                                )}

                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label>Branch Address</label>
                                                <input

                                                    className="form-control"
                                                    placeholder="Branch Address"
                                                    name="BranchAddress"
                                                    value={BranchAddress}
                                                    onChange={handleChange}

                                                />
                                                {BranchAddressErrref.current == true ? (
                                                    <p className="text-danger">
                                                        {" "}
                                                        {validationnErr.BranchAddress}{" "}
                                                    </p>
                                                ) : (
                                                    ""
                                                )}

                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label>UPI ID</label>
                                                <input

                                                    className="form-control"
                                                    placeholder="UPI ID"
                                                    name="gpay_number"
                                                    value={gpay_number}
                                                    onChange={handleChange}

                                                />
                                                {gpayNumberref.current == true ? (
                                                    <p className="text-danger">
                                                        {" "}
                                                        {validationnErr.gpay_number}{" "}
                                                    </p>
                                                ) : (
                                                    ""
                                                )}

                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label>Paytm</label>
                                                <input

                                                    className="form-control"
                                                    placeholder="Paytm"
                                                    name="paytm_number"
                                                    value={paytm_number}
                                                    onChange={handleChange}

                                                />
                                                {paytmNumberref.current == true ? (
                                                    <p className="text-danger">
                                                        {" "}
                                                        {validationnErr.paytm_number}{" "}
                                                    </p>
                                                ) : (
                                                    ""
                                                )}

                                            </div>
                                        </div>


                                        <div className="col-lg-12">
                                            <div className="submit_butn_s">
                                                <Button
                                                    onClick={submitID}
                                                >Submit</Button>
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
                                                    <th scope="col">Default</th>
                                                    <th scope="col">AccountNumber</th>
                                                    <th scope="col">IFSCCode</th>
                                                    <th scope="col">BankName</th>
                                                    <th scope="col">BranchName</th>
                                                    <th scopr="col">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                {Bankdetails.map((item, i) => {
                                                    return (
                                                        <tr>

                                                            <td className="form-check">
                                                                <input
                                                                    className=""
                                                                    type="radio"
                                                                    name="flexRadioDefault"
                                                                    id="flexRadioDefault2"
                                                                    checked={item.Status == 1}
                                                                    onClick={() => { defaultBank(item) }}
                                                                />
                                                               

                                                            </td>
                                                            <td> { item.Account_Number}</td>
                                                            <td> { item.IFSC_code}</td>
                                                            <td> { item.Bank_Name} </td>
                                                            <td> { item.Branch_Name}</td>
                                                            <td>
                                                                <div>
                                                                    <span>
                                                                    <a className="text-red"
                                                                    
                                                                            onClick={() => { deletebank(item) }}
                                                                        > <i class="bi bi-trash-fill"></i></a>

                                                                        
                                                                    </span>
                                                                  
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                                }
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
