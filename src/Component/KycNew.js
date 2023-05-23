import React, { useEffect } from "react";
import { Button } from "@material-ui/core";
import { Link, useNavigate } from "react-router-dom";
import Count from "./Countdown";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import Slider, { Range } from "rc-slider";
import "rc-slider/assets/index.css";
import Header from "./Header";
import Footer from "./Footer";
import Arrow from "../img/ArrowRight.svg";
import kyco from "../img/kyc_img_img.svg";
import { toast } from "react-toastify";
import apiService from "../core/service/detail";
import { postMethod } from "../core/service/common.api";
import { getMethod } from "../core/service/common.api";
import useState from "react-usestateref";
import {env} from "../core/service/envconfig";

function Home() {
  const options = ["one", "two", "three"];

  const initialFormValue = {
    address_proof: "",
    id_proof: "",
    photo_proof: "",
    pan_number: "",
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
  const [profileDatas, setprofileData] = useState("");
  const [kycDatas, setkycData] = useState("");
  const [proof1_status, setproof1_status] = useState(0);
  const [proof2_status, setproof2_status] = useState(0);
  const [proof3_status, setproof3_status] = useState(0);
  const [addressProof, setaddressProof, addressProofref] = useState(false);
  const [idProof, setidProof, idProofref] = useState(false);
  const [photoProof, setphotoProof, photoProofref] = useState(false);
  const [panNumber, setpanNumber, panNumberref] = useState(false);
  const [validationnErr, setvalidationnErr] = useState("");
  const [address_doc, setaddress_doc] = useState("");
  const [id_doc, setid_doc] = useState("");
  const [photo_doc, setphoto_doc] = useState("");
  const [pan_no, setpan_no] = useState("");
  const [kycstatus, setkycstatus] = useState(0);
  const [upload_view, setupload_view] = useState(true);
  const [detail_view, setdetail_view] = useState(false);
  const [fileloading, setfileloading] = useState(false);

  const [loading, setloading] = useState(false);
  // const [AccountHolderNameErr,SetAccountHolderNameErr,AccountHolderNameErrref,] = useState(false);
  // const [AccountNumberErr, SetAccountNumberErr, AccountNumberErrref] = useState(false);
  // const [IFSCCodeErr, SetIFSCCodeErr, IFSCCodeErrref] = useState(false);
  // const [BankNameErr, SetBankNameErr, BankNameErrref] = useState(false);
  // const [BranchNameErr, SetBranchNameErr, BranchNameErrref] = useState(false);
  // const [gpayNumber, setgpayNumber, gpayNumberref] = useState(false);
  // const [paytmNumber, setpaytmNumber, paytmNumberref] = useState(false);
  // const [BranchAddressErr, SetBranchAddressErr, BranchAddressErrref] =useState(false);

  const {
    address_proof,
    id_proof,
    photo_proof,
    pan_number,
    // AccountHolderName,
    // AccountNumber,
    // IFSCCode,
    // BankName,
    // BranchName,
    // BranchAddress,
    // gpay_number,
    // paytm_number,
  } = formValue;
  const navigate = useNavigate();

  useEffect(() => {
    let token_socket = localStorage.getItem("user_token");
    if (!token_socket) {
      navigate("/login");
    }
    getKyc();
  }, [0]);

  const getKyc = async () => {
    try {
      var data = {
        apiUrl: apiService.getKYC,
      };
      var resp = await getMethod(data);
      console.log("get kyc resp===", resp);
      console.log(
        "Object.keys(resp.datas).length",
        Object.keys(resp.datas).length
      );
      if (resp.status) {
        if (Object.keys(resp.datas.kycDetails).length > 0) {
          setkycData(resp.datas.kycDetails);
          setkycstatus(resp.datas.kycDetails.kycStatus);
          setaddress_doc(resp.datas.kycDetails.proof1);
          setid_doc(resp.datas.kycDetails.proof2);
          setphoto_doc(resp.datas.kycDetails.proof3);
          //formValue["pan_number"] = resp.datas.kycDetails.pan;
          // formValue["AccountHolderName"] =  resp.datas.kycDetails.accountHolderName;
          // formValue["AccountNumber"] = resp.datas.kycDetails.accountNumber;
          // formValue["IFSCCode"] = resp.datas.kycDetails.iFSCCode;
          // formValue["BankName"] = resp.datas.kycDetails.bankName;
          // formValue["BranchName"] = resp.datas.kycDetails.branchName;
          // formValue["BranchAddress"] = resp.datas.kycDetails.branchAddress;
          // formValue["gpay_number"] = resp.datas.kycDetails.gpay;
          // formValue["paytm_number"] = resp.datas.kycDetails.paytm;
          setproof1_status(resp.datas.kycDetails.prrof1status);
          setproof2_status(resp.datas.kycDetails.prrof2status);
          setproof3_status(resp.datas.kycDetails.prrof3status);
        }
      }
    } catch (error) { }
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
      fileExtension != "jpeg"
    ) {
      toast.error("File does not support. You must use .png or .jpg or .jpeg ");
      return false;
    } else if (fileSize > 1000000) {
      toast.error("Please upload a file smaller than 1 MB");
      return false;
    } else {
      const data = new FormData();
      data.append("file", val);
      data.append("upload_preset", env.preset);
      data.append("cloud_name", env.cloudname);
      console.log("formdata===", data);
      fetch("https://api.cloudinary.com/v1_1/"+env.cloudname+"/auto/upload", {
        method: "post",
        body: data,
      })
        .then((resp) => resp.json())
        .then((data) => {
          console.log("cloudinary upload===", data);
          if (type == "address_proof") {
            setaddressProof(false);
            setaddress_doc(data.secure_url);
          } else if (type == "id_proof") {
            setidProof(false);
            setid_doc(data.secure_url);
          } else if (type == "photo_proof") {
            setphotoProof(false);
            setphoto_doc(data.secure_url);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

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
    // if (values.pan_number == "") {
    //   errors.pan_number = "Pan Card Details is requird!";
    //   setpanNumber(true);
    // }
    if (address_doc == "") {
      errors.address_proof = "Address Proof is required!";
      setaddressProof(true);
    }

    if (id_doc == "") {
      console.log("call here-----");
      errors.id_proof = "ID Proof is required!";
      console.log("validationnErr==", validationnErr);
      setidProof(true);
    }

    if (photo_doc == "") {
      errors.photo_proof = "Photo proof is required!";
      setphotoProof(true);
    }

    // if (values.AccountHolderName == "") {
    //   errors.AccountHolderName = "Account Holder Name is requird!";
    //   SetAccountHolderNameErr(true);
    // } else if (
    //   values.AccountHolderName.length < 5 ||
    //   values.AccountHolderName.length > 25
    // ) {
    //   errors.AccountHolderName =
    //     "Account Holder Name must hava an 5 to 25 characters!";
    //   SetAccountHolderNameErr(true);
    // } else {
    //   SetAccountHolderNameErr(false);
    // }
    // if (values.AccountNumber == "") {
    //   errors.AccountNumber = "Account Number is requird!";
    //   SetAccountNumberErr(true);
    // } else if (
    //   values.AccountNumber.length < 5 ||
    //   values.AccountNumber.length > 25
    // ) {
    //   errors.AccountNumber = "Account Number  must hava an 5 to 25 Digits!";
    //   SetAccountNumberErr(true);
    // } else {
    //   SetAccountNumberErr(false);
    // }
    // if (values.IFSCCode == "") {
    //   errors.IFSCCode = "IFSC Code is requird!";
    //   SetIFSCCodeErr(true);
    // } else if (values.IFSCCode.length < 5 || values.IFSCCode.length > 25) {
    //   errors.IFSCCode = "IFSC Code must have an 5 to 25 characters!";
    //   SetIFSCCodeErr(true);
    // } else {
    //   SetIFSCCodeErr(false);
    // }
    // if (values.BankName == "") {
    //   errors.BankName = "Bank Name is requird!";
    //   SetBankNameErr(true);
    // } else if (values.BankName.length < 5 || values.BankName.length > 25) {
    //   errors.BankName = "Bank Name must have an 5 to 25 characters!";
    //   SetBankNameErr(true);
    // } else {
    //   SetBankNameErr(false);
    // }
    // if (values.BranchName == "") {
    //   errors.BranchName = "Branch Name is requird!";
    //   SetBranchNameErr(true);
    // } else if (values.BranchName.length < 5 || values.BranchName.length > 25) {
    //   errors.BranchName = "Branch Name must have an 5 to 25 !";
    //   SetBranchNameErr(true);
    // } else {
    //   SetBranchNameErr(false);
    // }
    // if (values.BranchAddress == "") {
    //   errors.BranchAddress = "Branch Address is requird!";
    //   SetBranchAddressErr(true);
    // } else if (
    //   values.BranchAddress.length < 5 ||
    //   values.BranchAddress.length > 150
    // ) {
    //   errors.BranchAddress = "Branch Address must have an 5 to 150 characters!";
    //   SetBranchAddressErr(true);
    // } else {
    //   SetBranchAddressErr(false);
    // }
    // if (values.gpay_number == "") {
    //   errors.gpay_number = "Gpay Details is requird!";
    //   setgpayNumber(true);
    // }

    // if (values.paytm_number == "") {
    //   errors.paytm_number = "Paytm Details is requird!";
    //   setpaytmNumber(true);
    // }

    setvalidationnErr(errors);
    return errors;
  };

  const submitID = async () => {
    try {
      validate(formValue);
      formValue.address_proof = address_doc;
      formValue.id_proof = id_doc;
      formValue.photo_proof = photo_doc;
      //formValue.pan_number = pan_number;
      // formValue.AccountNumber = AccountNumber;
      // formValue.AccountHolderName = AccountHolderName;
      // formValue.IFSCCode = IFSCCode;
      // formValue.BankName = BankName;
      // formValue.BranchName = BranchName;
      // formValue.BranchAddress = BranchAddress;
      // formValue.gpay_number = gpay_number;
      // formValue.paytm_number = paytm_number;
      if (
        formValue.address_proof != "" &&
        formValue.id_proof != "" &&
        formValue.photo_proof != ""
        //formValue.pan_number != "" 
      ) {
        setloading(true);
        var data = {
          apiUrl: apiService.savekyc_id,
          payload: formValue,
        };

        var resp = await postMethod(data);
        if (resp.status) {
          setloading(false);
          getKyc();
          toast.success(resp.Message);
        } else {
          toast.error(resp.Message);
        }
      } else {
        toast.error("Please fill all the required fields");
        console.log("ALL FIELD NEED");
      }
    } catch (error) { }
  };


  const form_validate = async (values) => {
    const errors = {};
    // if (values.pan_number == "") {
    //   errors.pan_number = "Pan Card Details is requird!";
    //   setpanNumber(true);
    // }
    // if (values.AccountHolderName == "") {
    //   errors.AccountHolderName = "Account Holder Name is requird!";
    //   SetAccountHolderNameErr(true);
    // } else if (
    //   values.AccountHolderName.length < 5 ||
    //   values.AccountHolderName.length > 25
    // ) {
    //   errors.AccountHolderName =
    //     "Account Holder Name must hava an 5 to 25 characters!";
    //   SetAccountHolderNameErr(true);
    // } else {
    //   SetAccountHolderNameErr(false);
    // }
    // if (values.AccountNumber == "") {
    //   errors.AccountNumber = "Account Number is requird!";
    //   SetAccountNumberErr(true);
    // } else if (
    //   values.AccountNumber.length < 5 ||
    //   values.AccountNumber.length > 25
    // ) {
    //   errors.AccountNumber = "Account Number  must hava an 5 to 25 Digits!";
    //   SetAccountNumberErr(true);
    // } else {
    //   SetAccountNumberErr(false);
    // }
    // if (values.IFSCCode == "") {
    //   errors.IFSCCode = "IFSC Code is requird!";
    //   SetIFSCCodeErr(true);
    // } else if (values.IFSCCode.length < 5 || values.IFSCCode.length > 25) {
    //   errors.IFSCCode = "IFSC Code must have an 5 to 25 characters!";
    //   SetIFSCCodeErr(true);
    // } else {
    //   SetIFSCCodeErr(false);
    // }
    // if (values.BankName == "") {
    //   errors.BankName = "Bank Name is requird!";
    //   SetBankNameErr(true);
    // } else if (values.BankName.length < 5 || values.BankName.length > 25) {
    //   errors.BankName = "Bank Name must have an 5 to 25 characters!";
    //   SetBankNameErr(true);
    // } else {
    //   SetBankNameErr(false);
    // }
    // if (values.BranchName == "") {
    //   errors.BranchName = "Branch Name is requird!";
    //   SetBranchNameErr(true);
    // } else if (values.BranchName.length < 5 || values.BranchName.length > 25) {
    //   errors.BranchName = "Branch Name must have an 5 to 25 !";
    //   SetBranchNameErr(true);
    // } else {
    //   SetBranchNameErr(false);
    // }
    // if (values.BranchAddress == "") {
    //   errors.BranchAddress = "Branch Address is requird!";
    //   SetBranchAddressErr(true);
    // } else if (
    //   values.BranchAddress.length < 5 ||
    //   values.BranchAddress.length > 150
    // ) {
    //   errors.BranchAddress = "Branch Address must have an 5 to 150 characters!";
    //   SetBranchAddressErr(true);
    // } else {
    //   SetBranchAddressErr(false);
    // }
    // if (values.gpay_number == "") {
    //   errors.gpay_number = "Gpay Details is requird!";
    //   setgpayNumber(true);
    // }

    // if (values.paytm_number == "") {
    //   errors.paytm_number = "Paytm Details is requird!";
    //   setpaytmNumber(true);
    // }

    setvalidationnErr(errors);
    return errors;
  };

  const saveBank = async () => {
    try {
      form_validate(formValue);
      formValue.pan_number = pan_number;
      // formValue.AccountNumber = AccountNumber;
      // formValue.AccountHolderName = AccountHolderName;
      // formValue.IFSCCode = IFSCCode;
      // formValue.BankName = BankName;
      // formValue.BranchName = BranchName;
      // formValue.BranchAddress = BranchAddress;
      // formValue.gpay_number = gpay_number;
      // formValue.paytm_number = paytm_number;
      if (
        formValue.pan_number != "" 
        // formValue.AccountHolderName != "" &&
        // formValue.AccountHolderName.length >= 5 &&
        // formValue.AccountHolderName.length <= 25 &&
        // formValue.AccountNumber != "" &&
        // formValue.AccountNumber.length >= 5 &&
        // formValue.AccountNumber.length <= 25 &&
        // formValue.IFSCCode != "" &&
        // formValue.IFSCCode.length >= 5 &&
        // formValue.IFSCCode.length <= 25 &&
        // formValue.BankName != "" &&
        // formValue.BankName.length >= 5 &&
        // formValue.BankName.length <= 25 &&
        // formValue.BranchName != "" &&
        // formValue.BranchName.length >= 5 &&
        // formValue.BranchName.length <= 25 &&
        // formValue.BranchAddress != "" &&
        // formValue.BranchAddress.length >= 5 &&
        // formValue.BranchAddress.length <= 150 &&
        // formValue.gpay_number != "" &&
        // formValue.paytm_number != ""
      ) {
        setloading(true);
        var data = {
          apiUrl: apiService.savebank,
          payload: formValue,
        };

        var resp = await postMethod(data);
        if (resp.status) {
          setloading(false);
          getKyc();
          toast.success(resp.Message);
        } else {
          toast.error(resp.Message);
        }
      } else {
        toast.error("Please fill all the required fields");
        console.log("ALL FIELD NEED", formValue);
      }
    } catch (error) { }
  };

  return (
    <>
      <div className="">
        <main className="main-content tradepage-bg login_body_ bg-cover">
          {/* <Header /> */}
          <div class="container p-0">
            <div className="">
              <div className="container  m-0 p-0">
                <div className="row  justify-center">
                  <div className="col-lg-4">
                    {/* <div className="detaile_foem_kyc m-0">

                    </div> */}
                    <div className="ky_c_contnet">
                      <img src={kyco} className="" />
                      <p>
                        Upload an identity document (Passport, Voters ID, Aadhar
                        Card). and a copy of your PAN card.
                      </p>
                      <p>
                        When cropping your document, please ensure the 4 edges
                        are clearly visible.
                      </p>
                    </div>
                  </div>
                  <div className="col-lg-8">
                    <div className="contet_kyc_section">
                      <p>Personal Verification:</p>
                      <p>Processed promptly with automated verification</p>
                      <p>
                        KYC Status:{" "}
                        {kycstatus == 0 ? (
                          <span className="status_done">Not Uploaded</span>
                        ) : (
                          ""
                        )}
                        {kycstatus == 1 ? (
                          <span className="status_done">Verified</span>
                        ) : (
                          ""
                        )}
                        {kycstatus == 2 ? (
                          <span className="status_pending">Pending</span>
                        ) : (
                          ""
                        )}
                        {kycstatus == 3 ? (
                          <span className="status_rejected">Rejected</span>
                        ) : (
                          ""
                        )}
                      </p>
                      <div className="flex_active_">
                        <div className="select_section active">
                          <p>Upload Documents</p>
                        </div>
                        {/* <div className="select_section">
                              <p>Step 2: Confirm Your Details</p>
                            </div> */}
                      </div>

                      <div className="flex_inpur">
                        <div className="foem_flex_input">
                          <label>Address Proof</label>
                          <div className="input_section_kyc">
                            {address_doc == "" ? (
                              <img
                                src={require("../img/input_sectionimg.png")}
                                className=""
                              />
                            ) : (
                              <img src={address_doc} className="" />
                            )}
                            {proof1_status == 0 || proof1_status == 3 ? (
                              <input
                                type="file"
                                name="image"
                                onChange={(e) =>
                                  imageUpload(
                                    "address_proof",
                                    e.target.files[0]
                                  )
                                }
                              />
                            ) : (
                              ""
                            )}
                            {addressProofref.current == true ? (
                              <p className="text-danger warningicon">
                                {" "}
                                {/* {validationnErr.address_proof}{" "} */}
                                <i class="bi bi-exclamation-diamond"></i>
                              </p>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                        <div className="foem_flex_input">
                          <label>ID Proof</label>
                          <div className="input_section_kyc">
                            {id_doc == "" ? (
                              <img
                                src={require("../img/input_sectionimg.png")}
                                className=""
                              />
                            ) : (
                              <img src={id_doc} className="" />
                            )}
                            {proof2_status == 0 || proof2_status == 3 ? (
                              <input
                                type="file"
                                name="image"
                                onChange={(e) =>
                                  imageUpload("id_proof", e.target.files[0])
                                }
                              />
                            ) : (
                              ""
                            )}
                            {idProofref.current == true ? (
                              <p className="text-danger warningicon">
                                {" "}
                                <i class="bi bi-exclamation-diamond"></i>
                              </p>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                        <div className="foem_flex_input">
                          <label>Photo Upload</label>
                          <div className="input_section_kyc">
                            {photo_doc == "" ? (
                              <img
                                src={require("../img/input_sectionimg.png")}
                                className=""
                              />
                            ) : (
                              <img src={photo_doc} className="" />
                            )}
                            {proof3_status == 0 || proof3_status == 3 ? (
                              <input
                                type="file"
                                name="image"
                                onChange={(e) =>
                                  imageUpload("photo_proof", e.target.files[0])
                                }
                              />
                            ) : (
                              ""
                            )}
                            {photoProofref.current == true ? (
                              <p className="text-danger warningicon">
                                {" "}
                                {/* {validationnErr.photo_proof}{" "} */}
                                <i class="bi bi-exclamation-diamond"></i>
                              </p>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-12">
                    <div className="kyc_card">
                      <div className="row">
                       {/* {kycstatus == 0 || kycstatus == 3 || kycstatus == 1 ? ( */}
                        {proof1_status == 0 || proof1_status == 3 || proof1_status == 1 || proof2_status == 0 || proof2_status == 3 || proof2_status == 1 || proof3_status == 0 || proof3_status == 3 || proof3_status == 1 ? (
                          <div className="col-lg-12">
                            {/* <span className="col-lg-12">
                              <div className="row">
                          {/* //       <div className="col-lg-6">
                          //         <div className="form-group">
                          //           <label>Account Holder Name</label>
                          //           <input
                          //             className="form-control"
                          //             placeholder="Account Holder Name"
                          //             name="AccountHolderName"
                          //             value={AccountHolderName}
                          //             onChange={handleChange}
                          //           />
                          //           {AccountHolderNameErrref.current == true ? (
                          //             <p className="text-danger">
                          //               {" "}
                          //               {validationnErr.AccountHolderName}{" "}
                          //             </p>
                          //           ) : (
                          //             ""
                          //           )}
                          //         </div>
                          //       </div> */}

                                {/* <div className="col-lg-6">
                                  <div className="form-group">
                                    <label>Account Number</label>
                                    <input
                                      type="number"
                                      className="form-control"
                                      placeholder="Account Number"
                                      name="AccountNumber"
                                      value={AccountNumber}
                                      onChange={handleChange}
                                    />
                                    {AccountNumberErrref.current == true ? (
                                      <p className="text-danger">
                                        {" "}
                                        {validationnErr.AccountNumber}{" "}
                                      </p>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </div> */}

                                {/* <div className="col-lg-6">
                                  <div className="form-group">
                                    <label>IFSC Code</label>
                                    <input
                                      className="form-control"
                                      placeholder="IFSC Code"
                                      name="IFSCCode"
                                      value={IFSCCode}
                                      onChange={handleChange}
                                    />

                                    {IFSCCodeErrref.current == true ? (
                                      <p className="text-danger">
                                        {" "}
                                        {validationnErr.IFSCCode}{" "}
                                      </p>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </div> */}

                                {/* <div className="col-lg-6">
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
                                </div> */}

                                {/* <div className="col-lg-6">
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
                                </div> */}

                                {/* <div className="col-lg-6">
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
                                </div> */}

                                {/* <div className="col-lg-6">
                                  <div class="form-group">
                                    <label>PAN Card details</label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      id="inputEmail4"
                                      placeholder="Enter PAN Card"
                                      name="pan_number"
                                      value={pan_number}
                                      onChange={handleChange}
                                    />
                                    {panNumberref.current == true ? (
                                      <p className="text-danger">
                                        {" "}
                                        {validationnErr.pan_number}{" "}
                                      </p>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </div> */}

                                {/* <div className="col-lg-6">
                                  <div class="form-group">
                                    <label>Gpay</label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      id="inputEmail4"
                                      placeholder="Gpay"
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
                                </div> */}

                                {/* <div className="col-lg-6">
                                  <div class="form-group">
                                    <label>Paytm</label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      id="inputEmail4"
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
                              </div>
                            </span> */}
                            <div>
                              <div>
                                
                              {proof1_status == 0 || proof1_status == 3 || proof2_status == 0 || proof2_status == 3 || proof3_status == 0 || proof3_status == 3 ? (
                                  kycstatus == 0 ? (
                                           <div class="form-group text-center">
                                           
                                           {loading == true ? (
                                             
                                             <Button class="button-red security__button button_www button_margud">
                                               Loading
                                             </Button>
                                           ) : (
                                             <Button
                                               class="button-red security__button button_www button_margud"
                                               onClick={submitID}
                                             >
                                               Submit
                                             </Button>
                                           )}
                                           
                                           
                                           </div>
                                  ):(
                                    ""
                                  )
                                  
                                ) : (
                                  // proof1_status == 1 && proof2_status == 1 && proof3_status == 1   ? (
                                  //   <div class="form-group text-center">
                                  //     {loading == true ? (
                                  //       <Button class="button-red security__button button_www button_margud">
                                  //         Loading
                                  //       </Button>
                                  //     ) : (
                                  //       <Button
                                  //         class="button-red security__button button_www button_margud"
                                  //         onClick={saveBank}
                                  //       >
                                  //         Submit
                                  //       </Button>
                                  //     )}
                                  //   </div>
                                  // ) : (
                                  //   ""
                                  // )
                                  ""
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="col-lg-6 kycdetaile">
                            <span className="col-lg-12 justify-content-start pl-0 p-0">
                              <div className="col-lg-12 ">
                                <div className="form-group  pl-0 pr-0">
                                  {/* <p className="m-0">Bank Details</p>
                                  <p className="d-flex justify-content-between align-items-center w-100 mb-1">
                                    Account Holder Name :{" "}
                                    <span className="ml-2">
                                      {AccountHolderName}
                                    </span>
                                  </p>
                                  <p className="d-flex justify-content-between align-items-center w-100 mb-1">
                                    BankName :{" "}
                                    <span className="ml-2">
                                      {AccountNumber}
                                    </span>
                                  </p>
                                  <p className="d-flex justify-content-between align-items-center w-100 mb-1">
                                    Account Holder Name :{" "}
                                    <span className="ml-2">{BankName}</span>
                                  </p>
                                  <p className="d-flex justify-content-between align-items-center w-100 mb-1">
                                    IFSC Code :{" "}
                                    <span className="ml-2">{IFSCCode}</span>
                                  </p>
                                  <p className="d-flex justify-content-between align-items-center w-100 mb-1">
                                    Account Holder Name :{" "}
                                    <span className="ml-2">{BranchName}</span>
                                  </p>
                                  <p className="d-flex justify-content-between align-items-center w-100 mb-1">
                                    Branch Address :{" "}
                                    <span className="ml-2">
                                      {BranchAddress}
                                    </span>
                                  </p> */}
                                  <p className="d-flex justify-content-between align-items-center w-100 mb-1">
                                    Pan Card Details :{" "}
                                    <span className="ml-2">{pan_number}</span>
                                  </p>
                                  {/* <p className="d-flex justify-content-between align-items-center w-100 mb-1">
                                    Gpay Details :{" "}
                                    <span className="ml-2">{gpay_number}</span>
                                  </p>
                                  <p className="d-flex justify-content-between align-items-center w-100 mb-1">
                                    Paytm Details :{" "}
                                    <span className="ml-2">{paytm_number}</span>
                                  </p> */}
                                </div>
                              </div>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default Home;
