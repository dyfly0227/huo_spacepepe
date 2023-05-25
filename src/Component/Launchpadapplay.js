import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "rc-slider/assets/index.css";
import Header from "./Header";
import { Button } from "@material-ui/core";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

import apiService from "../core/service/detail";
import { postMethod } from "../core/service/common.api";
import { toast } from "react-toastify";
import { setAuthToken, getAuthToken } from "../core/lib/localStorage";
import OTPInput, { ResendOTP } from "otp-input-react";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";

function Home() {
  const data = [
    {
      value: 1,
      label: "ETH",
    },
    {
      value: 2,
      label: "BSC",
    },
    {
      value: 3,
      label: "TRON",
    },
  ];
  const formOne = {
    email: "",
    position: "",
    fullName: "",
    service: "",
  };

  const formTwo = {
    projectName: "",
    symbol: "",
    coinName: "",
    contractAddress: "",
    website: "",
    whitpaper: "",
    milestone: "",
    description: "",
    tokenDetails: "",
  };

  const formThree = {
    softCap: "",
    hardcap: "",
    price: "",
    minimum: "",
    BonusStructure: "",
    totalSupply: "",
    allocate: "",
    currency: "",
  };

  const formFour = {
    telegram: "",
    twitter: "",
    facebooklink: "",
    LinkedIn: "",
    reddit: "",
    instagram: "",
    youtube: "",
    youtubevideo: "",
    Medium: "",
    github: "",
  };

  const [startDate, setStartDate] = useState(new Date());
  const [endtDate, setEndDate] = useState(new Date());
  const [tabOne, settabOne] = useState("active");
  const [tabTwo, settabTwo] = useState("");
  const [tabThree, settabThree] = useState("");
  const [tabFour, settabFour] = useState("");
  const [tabFive, settabFive] = useState("");
  const [activeTab, setactiveTab] = useState("personalTab");
  // const [activeTab, setactiveTab] = useState("");

  const [formDataOne, setformDataOne] = useState(formOne);
  const [formDataTwo, setformDataTwo] = useState(formTwo);
  const [formDataThree, setformDataThree] = useState(formThree);
  const [formDataFour, setformDataFour] = useState(formFour);

  const [validationnErr, setvalidationnErr] = useState("");
  const [validationnErrTwo, setvalidationnErrTwo] = useState("");
  const [validationnErrThree, setvvalidationnErrThree] = useState("");

  const [emailValidate, setemailValidate] = useState(false);
  const [positionValidate, setpositionValidate] = useState(false);
  const [nameValidate, setnameValidate] = useState(false);
  const [serviceValidate, setserviceValidate] = useState(false);
  const [projectNameValidate, setsprojectNameValidate] = useState(false);
  const [symbolValidate, setsymbolValidate] = useState(false);
  const [coinNameValidate, setcoinNameValidate] = useState(false);
  const [contractAddressValidate, setcontractAddressValidate] = useState(false);
  const [websiteValidate, setwebsiteValidate] = useState(false);
  const [whitpaperValidate, setwhitpaperValidate] = useState(false);
  const [milestoneValidate, setmilestoneValidate] = useState(false);
  const [descriptionValidate, setdescriptionValidate] = useState(false);
  const [tokenDetValidate, settokenDetValidate] = useState(false);
  const [tokenImage, settokenImage] = useState("");
  const [softCapValidate, setsoftCapValidate] = useState(false);
  const [hardcapValidat, sethardcapValidate] = useState(false);
  const [coinpriceValidate, setcoinpriceValidate] = useState(false);
  const [minimumsValidate, setminimumsValidate] = useState(false);
  const [BonusStructureValidate, setBonusStructureValidate] = useState(false);
  const [totalSupplyValidate, settotalSupplyValidate] = useState(false);
  const [allocateValidate, setallocateValidate] = useState(false);
  const [imageValidate, setimageValidate] = useState(false);
  const [confirmation, setconfirmation] = useState([0]);
  const [authToken, setauthToken] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [agree, setagree] = useState("");
  const navigate = useNavigate();
  const { email, position, fullName, service } = formDataOne;
  const {
    projectName,
    symbol,
    coinName,
    contractAddress,
    website,
    whitpaper,
    milestone,
    description,
    tokenDetails,
  } = formDataTwo;
  const {
    softCap,
    price,
    hardcap,
    minimum,
    BonusStructure,
    totalSupply,
    allocate,
    currency,
  } = formDataThree;
  const {
    telegram,
    twitter,
    facebooklink,
    LinkedIn,
    instagram,
    youtube,
    youtubevideo,
    Medium,
    github,
    reddit,
    Bitcointalk,
  } = formDataFour;

  useEffect(() => {
    let getToken = localStorage.getItem("user_token");
    if (getToken != "" && getToken != undefined && getToken != null) {
      setauthToken(true);
    } else {
      setauthToken(false);
    }
  });

  const steps = async (count) => {
    var arrayData = [];
    if (count == "one") {
      await validationOne();
      if (
        formDataOne.email != "" &&
        formDataOne.position != "" &&
        formDataOne.fullName != "" &&
        formDataOne.service != ""
      ) {
        if (serviceValidate == false && emailValidate == false) {
          arrayData.push("1");
          setconfirmation(arrayData);
          settabTwo("active");
          setactiveTab("paymentTab");
        }
      }
    }
    if (count == "two") {
      await validationTwo();
      if (tokenImage == "") {
        toast.error("Please upload token image");
      }
      if (
        projectName != "" &&
        symbol != "" &&
        coinName != "" &&
        contractAddress != "" &&
        website != "" &&
        whitpaper != "" &&
        milestone != "" &&
        description != "" &&
        tokenImage != "" &&
        tokenDetails != ""
      ) {
        arrayData.push("2");
        setconfirmation(arrayData);
        settabThree("active");
        setactiveTab("confirmTab");
      } else {
      }
    }

    if (count == "three") {
      validatioThree();
      if (
        softCap != "" &&
        hardcap != "" &&
        price != "" &&
        minimum != "" &&
        BonusStructure != "" &&
        totalSupply != "" &&
        allocate != "" &&
        startDate != "" &&
        formDataThree.network != "" &&
        endtDate != ""
      ) {
        var startdate = new Date(startDate).getTime();
        var endtDatess = new Date(endtDate).getTime();

        if (startdate < endtDatess) {
          setconfirmation(arrayData);
          settabFour("active");
          setactiveTab("confirm1Tab");
        } else {
          toast.error("End date should be grater than start date!");
        }
      } else {
      }
    }
    if (count == "four") {
      settabFive("active");
      setactiveTab("confirmForm");
    }
    // if(count == "five"){
    //   settabFive('active')
    //   setactiveTab("confirm1Tab")
    // }
    formDataTwo["image"] = tokenImage;
    formDataTwo["startDate"] = startDate;
    formDataTwo["endDate"] = endtDate;
    let remoteJob = {
      ...formDataOne,
      ...formDataTwo,
      ...formDataThree,
      ...formDataFour,
    };

    // return false;
    if (count == "submit") {
      if (agree == "accept") {
        var data = {
          apiUrl: apiService.submitForm,
          payload: remoteJob,
        };
        var resp = await postMethod(data);
        if (resp.status) {
          navigate("/launchpad");
          toast.success(resp.Message);
        } else {
          toast.error(resp.Message);
        }
      } else {
        toast.error("Accept the terms and condition");
      }
    }
  };

  const handleFormOne = async (e) => {
    try {
      e.preventDefault();
      const { name, value } = e.target;
      let fitstFormData = { ...formDataOne, ...{ [name]: value } };
      setformDataOne(fitstFormData);
    } catch (error) {}
  };

  const validationOne = async () => {
    try {
      const errors = {};
      var values = formDataOne;
      if (!values.email) {
        errors.email = "Email is a required field";
        setemailValidate(true);
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
      ) {
        errors.email = "Invalid email address";
        setemailValidate(true);
      } else {
        setemailValidate(false);
      }
      if (!values.position) {
        errors.position = "This is a required question";
        setpositionValidate(true);
      } else {
        setpositionValidate(false);
      }
      if (!values.fullName) {
        errors.fullName = "This is a required question";
        setnameValidate(true);
      } else {
        setnameValidate(false);
      }
      if (!values.service) {
        errors.service = "Email is a required field";
        setserviceValidate(true);
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.service)
      ) {
        errors.service = "Invalid email address";
        setserviceValidate(true);
      } else {
        setserviceValidate(false);
      }
      setvalidationnErr(errors);
    } catch (error) {}
  };

  const handleFormTwo = async (e) => {
    try {
      const { name, value } = e.target;
      let secondFormData = { ...formDataTwo, ...{ [name]: value } };
      setformDataTwo(secondFormData);
    } catch (error) {}
  };

  const validationTwo = async () => {
    try {
      const errorsOne = {};
      var values = formDataTwo;
      if (!values.projectName) {
        errorsOne.projectName = "This is a required question";
        setsprojectNameValidate(true);
      } else {
        setsprojectNameValidate(false);
      }
      if (!values.symbol) {
        errorsOne.symbol = "This is a required question";
        setsymbolValidate(true);
      } else {
        setsymbolValidate(false);
      }
      if (!values.coinName) {
        errorsOne.coinName = "This is a required question";
        setcoinNameValidate(true);
      } else {
        setcoinNameValidate(false);
      }
      if (!values.contractAddress) {
        errorsOne.contractAddress = "This is a required question";
        setcontractAddressValidate(true);
      } else {
        setcontractAddressValidate(false);
      }
      if (!values.website) {
        errorsOne.website = "This is a required question";
        setwebsiteValidate(true);
      } else {
        const regex = new RegExp(
          "(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?"
        );
        if (regex.test(values.website)) {
          setwebsiteValidate(false);
        } else {
          errorsOne.website = "Invalid url format";
          setwebsiteValidate(true);
        }
      }
      if (!values.whitpaper) {
        errorsOne.whitpaper = "This is a required question";
        setwhitpaperValidate(true);
      } else {
        const regex = new RegExp(
          "(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?"
        );
        if (regex.test(values.whitpaper)) {
          setwhitpaperValidate(false);
        } else {
          errorsOne.website = "Invalid url format";
          setwhitpaperValidate(true);
        }
        setwhitpaperValidate(false);
      }
      if (!values.milestone) {
        errorsOne.milestone = "This is a required question";
        setmilestoneValidate(true);
      } else {
        setmilestoneValidate(false);
      }
      if (!values.description) {
        errorsOne.description = "This is a required question";
        setdescriptionValidate(true);
      } else {
        setdescriptionValidate(false);
      }
      if (!values.tokenDetails) {
        errorsOne.tokenDetails = "This is a required question";
        settokenDetValidate(true);
      } else {
        settokenDetValidate(false);
      }
      setvalidationnErrTwo(errorsOne);
    } catch (error) {}
  };

  const imageUpload = (type, val) => {
    const fileExtension = val.name.split(".").at(-1);
    const fileSize = val.size;
    const fileName = val.name;
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
      data.append("upload_preset", "sztbiwly");
      data.append("cloud_name", "taikonz-com");
      fetch("https://api.cloudinary.com/v1_1/taikonz-com/auto/upload", {
        method: "post",
        body: data,
      })
        .then((resp) => resp.json())
        .then((data) => {
          settokenImage(data.secure_url);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleFormThree = async (e) => {
    try {
      e.preventDefault();
      const { name, value } = e.target;
      let thirdFormData = { ...formDataThree, ...{ [name]: value } };
      setformDataThree(thirdFormData);
    } catch (error) {}
  };

  const handleChange = (e) => {
    setSelectedOption(e);
  };

  const validatioThree = async () => {
    try {
      const errorsTwo = {};
      formDataThree["network"] = "";
      if (selectedOption == null) {
        toast.error("Please choose network");
      } else {
        formDataThree["network"] = selectedOption.label;

        var values = formDataThree;
        if (!values.softCap) {
          errorsTwo.softCap = "This is a required question";
          setsoftCapValidate(true);
        } else {
          setsoftCapValidate(false);
        }
        if (!values.hardcap) {
          errorsTwo.hardcap = "This is a required question";
          sethardcapValidate(true);
        } else {
          sethardcapValidate(false);
        }
        if (!values.price) {
          errorsTwo.price = "This is a required question";
          setcoinpriceValidate(true);
        } else {
          setcoinpriceValidate(false);
        }
        if (!values.minimum) {
          errorsTwo.minimum = "This is a required question";
          setminimumsValidate(true);
        } else {
          setminimumsValidate(false);
        }
        if (!values.BonusStructure) {
          errorsTwo.BonusStructure = "This is a required question";
          setBonusStructureValidate(true);
        } else {
          setBonusStructureValidate(false);
        }

        if (!values.totalSupply) {
          errorsTwo.totalSupply = "This is a required question";
          settotalSupplyValidate(true);
        } else {
          settotalSupplyValidate(false);
        }
        if (!values.allocate) {
          errorsTwo.allocate = "This is a required question";
          setallocateValidate(true);
        } else {
          setallocateValidate(false);
        }
        if (!values.tokenDetails) {
          errorsTwo.tokenDetails = "This is a required question";
          settokenDetValidate(true);
        } else {
          settokenDetValidate(false);
        }
        if (!tokenImage) {
          errorsTwo.tokenImage = "Image is rquired";
          toast.error("Choose image");
          setimageValidate(true);
        } else {
          setimageValidate(false);
        }

        setvvalidationnErrThree(errorsTwo);
      }
    } catch (error) {}
  };

  const handleFormFour = (e) => {
    try {
      e.preventDefault();
      const { name, value } = e.target;
      let fourthFormData = { ...formDataFour, ...{ [name]: value } };
      setformDataFour(fourthFormData);
    } catch (error) {}
  };

  const handleFormFive = async (e) => {
    try {
      setagree(e.target.value);
    } catch (error) {}
  };
  const handleFormSix = async (e) => {
    try {
    } catch (error) {}
  };

  return (
    <div className="login_body_ bg-cover bg-coverneww">
      <main className="main-content ">
        <Header />
        <div className="container pt-5 padin_zero mt-5">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 padin_zero">
            <div className="container ">
              <div className="logo_launchpad">
                <img
                  src={require("../img/keedx-logo.png")}
                  className="logo darktheme"
                />
                <img
                  src={require("../img/keedx-logo-light.png")}
                  className="logo lighttheme"
                />
                <h1>SpacePepe Exchange Launchpad Application Form</h1>
              </div>
            </div>
          </div>
          <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 padin_zero">
            <div className="container d-flex justify-content-center">
              <div className="col-lg-10">
                <form id="msform">
                  <ul id="progressbar">
                    <li class={tabOne} id="account"></li>
                    <li class={tabTwo} id="personal"></li>
                    <li class={tabThree} id="payment"></li>
                    <li class={tabFour} id="confirm"></li>
                    <li class={tabFive} id="confirm1"></li>
                  </ul>

                  {activeTab == "personalTab" ? (
                    <div className="fonrm_card_s">
                      <h2>Step 1</h2>
                      <div class="row">
                        <div className="col-lg-6">
                          <div class="form-group">
                            <label>Email </label>
                            <input
                              type="email"
                              class="form-control"
                              placeholder="Enter Email"
                              value={email}
                              name="email"
                              onChange={handleFormOne}
                            />
                          </div>
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

                          <div class="form-group">
                            <label>Please confirm your Full Name</label>
                            <input
                              type="email"
                              class="form-control"
                              placeholder="Enter Full name"
                              name="position"
                              value={position}
                              onChange={handleFormOne}
                            />
                          </div>
                          <div>
                            {positionValidate == true ? (
                              <p className="text-danger">
                                {" "}
                                {validationnErr.position}{" "}
                              </p>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div class="form-group">
                            <label>
                              Confirm your position with this Project{" "}
                            </label>
                            <input
                              type="email"
                              class="form-control"
                              placeholder="Enter Confirm your position"
                              value={fullName}
                              name="fullName"
                              onChange={handleFormOne}
                            />
                          </div>
                          <div>
                            {nameValidate == true ? (
                              <p className="text-danger">
                                {" "}
                                {validationnErr.fullName}{" "}
                              </p>
                            ) : (
                              ""
                            )}
                          </div>
                          <div class="form-group">
                            <label>
                              If there are someone who introduce you to this
                              service, please provide their email here.
                            </label>
                            <input
                              type="email"
                              class="form-control"
                              placeholder="Enter Email"
                              value={service}
                              name="service"
                              onChange={handleFormOne}
                            />
                          </div>
                          <div>
                            {serviceValidate == true ? (
                              <p className="text-danger">
                                {" "}
                                {validationnErr.service}{" "}
                              </p>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                        {authToken == true ? (
                          <div className="col-lg-12">
                            <div className="submit_butn_s">
                              <Button onClick={() => steps("one")}>Next</Button>
                            </div>
                          </div>
                        ) : (
                          <div className="col-lg-12">
                            <div className="submit_butn_s">
                              <Button>
                                {" "}
                                <Link to="/login"> Login to continue </Link>
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : activeTab == "paymentTab" ? (
                    <div className="fonrm_card_s">
                      <h2>Step 2</h2>
                      <div class="row">
                        <div className="col-lg-6">
                          <div class="form-group">
                            <label>Project Name </label>
                            <input
                              type="email"
                              class="form-control"
                              placeholder="Enter project name"
                              name="projectName"
                              value={projectName}
                              onChange={handleFormTwo}
                            />
                            <div>
                              {projectNameValidate == true ? (
                                <p className="text-danger">
                                  {" "}
                                  {validationnErrTwo.projectName}{" "}
                                </p>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                          <div class="form-group">
                            <label>Token/Coin Symbol</label>
                            <input
                              type="text"
                              class="form-control"
                              placeholder="Currency Symbol"
                              name="symbol"
                              value={symbol}
                              onChange={handleFormTwo}
                            />
                          </div>
                          <div>
                            {symbolValidate == true ? (
                              <p className="text-danger">
                                {" "}
                                {validationnErrTwo.symbol}{" "}
                              </p>
                            ) : (
                              ""
                            )}
                          </div>
                          <div class="form-group">
                            <label>Token/Coin Full Name</label>
                            <input
                              type="text"
                              class="form-control"
                              placeholder="Enter Coin Name"
                              name="coinName"
                              value={coinName}
                              onChange={handleFormTwo}
                            />
                          </div>
                          <div>
                            {coinNameValidate == true ? (
                              <p className="text-danger">
                                {" "}
                                {validationnErrTwo.coinName}{" "}
                              </p>
                            ) : (
                              ""
                            )}
                          </div>
                          <div class="form-group">
                            <label>Token Contract Address</label>
                            <input
                              type="email"
                              class="form-control"
                              placeholder="Contract Address"
                              name="contractAddress"
                              value={contractAddress}
                              onChange={handleFormTwo}
                            />
                          </div>
                          <div>
                            {contractAddressValidate == true ? (
                              <p className="text-danger">
                                {" "}
                                {validationnErrTwo.contractAddress}{" "}
                              </p>
                            ) : (
                              ""
                            )}
                          </div>
                          <div class="form-group">
                            <div class="">
                              <label for="formFile" class="form-label">
                                Token/Coin Logo url
                                <small> ( must finish with .png, .jpg )</small>
                              </label>
                              <input
                                class="form-control"
                                type="file"
                                id="formFile"
                                name="image"
                                onChange={(e) =>
                                  imageUpload("photo_proof", e.target.files[0])
                                }
                              />
                            </div>
                            <div>
                              {imageValidate == true ? (
                                <p className="text-danger">
                                  {" "}
                                  {validationnErrTwo.tokenImage}{" "}
                                </p>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div class="form-group">
                            <label>Official website</label>
                            <input
                              type="email"
                              class="form-control"
                              placeholder="Enter Website"
                              name="website"
                              value={website}
                              onChange={handleFormTwo}
                            />
                          </div>

                          <div>
                            {websiteValidate == true ? (
                              <p className="text-danger">
                                {" "}
                                {validationnErrTwo.website}{" "}
                              </p>
                            ) : (
                              ""
                            )}
                          </div>

                          <div class="form-group">
                            <label>Permanent link to your whitepaper</label>
                            <input
                              type="email"
                              class="form-control"
                              placeholder="Enter whitepaper link"
                              name="whitpaper"
                              value={whitpaper}
                              onChange={handleFormTwo}
                            />
                          </div>
                          <div>
                            {whitpaperValidate == true ? (
                              <p className="text-danger">
                                {" "}
                                {validationnErrTwo.whitpaper}{" "}
                              </p>
                            ) : (
                              ""
                            )}
                          </div>
                          <div class="form-group">
                            <label>Detailed Roadmap and Milestones</label>
                            <input
                              type="email"
                              class="form-control"
                              placeholder="Enter Roadmap and Milestones"
                              name="milestone"
                              value={milestone}
                              onChange={handleFormTwo}
                            />
                          </div>
                          <div>
                            {milestoneValidate == true ? (
                              <p className="text-danger">
                                {" "}
                                {validationnErrTwo.milestone}{" "}
                              </p>
                            ) : (
                              ""
                            )}
                          </div>
                          <div class="form-group">
                            <label>
                              Short Description of Token/Coin
                              {/* <small>(Maximum 100 char.) </small> */}
                            </label>
                            <textarea
                              placeholder="Short Description"
                              name="description"
                              value={description}
                              onChange={handleFormTwo}
                            ></textarea>
                          </div>
                          <div>
                            {descriptionValidate == true ? (
                              <p className="text-danger">
                                {" "}
                                {validationnErrTwo.description}{" "}
                              </p>
                            ) : (
                              ""
                            )}
                          </div>
                          <div class="form-group">
                            <label>Your token is</label>
                            <div className="row pt-3">
                              <div className="col-lg-4 d-flex justify-start">
                                <div class="custom-control custom-radio">
                                  <input
                                    type="radio"
                                    class="custom-control-input"
                                    id="customRadio1"
                                    name="tokenDetails"
                                    value="security"
                                    onChange={handleFormTwo}
                                  />
                                  <label
                                    class="custom-control-label"
                                    for="customRadio1"
                                  >
                                    Security
                                  </label>
                                </div>
                              </div>
                              <div className="col-lg-4 d-flex justify-start">
                                <div class="custom-control custom-radio">
                                  <input
                                    type="radio"
                                    class="custom-control-input"
                                    id="customRadio"
                                    name="tokenDetails"
                                    value="utillity"
                                    onChange={handleFormTwo}
                                  />
                                  <label
                                    class="custom-control-label"
                                    for="customRadio"
                                  >
                                    Utillity
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
                            {tokenDetValidate == true ? (
                              <p className="text-danger">
                                {" "}
                                {validationnErrTwo.tokenDetails}{" "}
                              </p>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>

                        {authToken == true ? (
                          <div className="col-lg-12">
                            <div className="submit_butn_s">
                              <Button onClick={() => steps("two")}>Next</Button>
                            </div>
                          </div>
                        ) : (
                          <div className="col-lg-12">
                            <div className="submit_butn_s">
                              <Button>
                                {" "}
                                <Link to="/login"> Login to continue </Link>
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : activeTab == "confirmTab" ? (
                    <div className="fonrm_card_s">
                      <h2>Step 3</h2>
                      <div class="row">
                        <div className="col-lg-6">
                          <div class="form-group">
                            <label>Start Date</label>
                            <DatePicker
                              selected={startDate}
                              onChange={(date) => setStartDate(date)}
                            />
                          </div>
                          <div class="form-group">
                            <label>Expiry Date</label>
                            <DatePicker
                              selected={endtDate}
                              onChange={(date) => setEndDate(date)}
                            />
                          </div>
                          <div class="form-group">
                            <label>Soft Cap ₹</label>
                            <input
                              type="number"
                              class="form-control"
                              placeholder="Enter Soft Cap"
                              name="softCap"
                              value={softCap}
                              onChange={handleFormThree}
                            />
                          </div>
                          <div>
                            {softCapValidate == true ? (
                              <p className="text-danger">
                                {" "}
                                {validationnErrThree.softCap}{" "}
                              </p>
                            ) : (
                              ""
                            )}
                          </div>
                          <div class="form-group">
                            <label>Hard Cap ₹</label>
                            <input
                              type="number"
                              class="form-control"
                              placeholder="Enter Hard Cap"
                              name="hardcap"
                              value={hardcap}
                              onChange={handleFormThree}
                            />
                          </div>
                          <div>
                            {hardcapValidat == true ? (
                              <p className="text-danger">
                                {" "}
                                {validationnErrThree.hardcap}{" "}
                              </p>
                            ) : (
                              ""
                            )}
                          </div>
                          <div class="form-group">
                            <div class="">
                              <label for="formFile" class="form-label">
                                Public Sale Conversion Price
                                <small> ( e.g. 1 XXX = 0.1 INR)</small>
                              </label>
                              <input
                                type="number"
                                class="form-control"
                                placeholder="Enter price"
                                name="price"
                                value={price}
                                onChange={handleFormThree}
                              />
                            </div>
                          </div>
                          <div>
                            {coinpriceValidate == true ? (
                              <p className="text-danger">
                                {" "}
                                {validationnErrThree.price}{" "}
                              </p>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div class="form-group">
                            <label>Select Network</label>
                            {/* <select
                            id="countries" onChange={handleFormThree}
                            class=" block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          >
                            <option selected >Choose a Network</option>
                            <option  value="ETH" name="currency" >ETH</option>
                            <option value="BNB" name="currency">BNB</option>
                            <option value="TRON"name="currency" >TRON</option>
                          </select> */}
                            <Dropdown
                              value={selectedOption} // set selected value
                              options={data} // set list of the data
                              onChange={handleChange} // assign onChange function
                              className="seclelee"
                            />
                            {/* <Select
                              class=" block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              placeholder="Select Network"
                              value={selectedOption} // set selected value
                              options={data} // set list of the data
                              onChange={handleChange} // assign onChange function
                            /> */}
                          </div>
                          <div class="form-group">
                            <label>Minimum buy amount</label>
                            <input
                              type="number"
                              class="form-control"
                              placeholder="Minimum buy amount"
                              name="minimum"
                              value={minimum}
                              onChange={handleFormThree}
                            />
                          </div>
                          <div>
                            {minimumsValidate == true ? (
                              <p className="text-danger">
                                {" "}
                                {validationnErrThree.minimum}{" "}
                              </p>
                            ) : (
                              ""
                            )}
                          </div>
                          <div>
                            {BonusStructureValidate == true ? (
                              <p className="text-danger">
                                {" "}
                                {validationnErrThree.BonusStructure}{" "}
                              </p>
                            ) : (
                              ""
                            )}
                          </div>
                          <div class="form-group">
                            <label>
                              Total Token Supply
                              {/* <small> (Maximum 100 char.)</small> */}
                            </label>
                            <input
                              type="number"
                              class="form-control"
                              placeholder="Total Token Supply"
                              name="totalSupply"
                              value={totalSupply}
                              onChange={handleFormThree}
                            />
                          </div>
                          <div>
                            {totalSupplyValidate == true ? (
                              <p className="text-danger">
                                {" "}
                                {validationnErrThree.totalSupply}{" "}
                              </p>
                            ) : (
                              ""
                            )}
                          </div>
                          <div class="form-group">
                            <label>
                              How much of the Token Sale would you like to
                              allocate to SpacePepe Exchange Launchpad
                            </label>
                            <input
                              type="number"
                              class="form-control"
                              placeholder="Enter amount"
                              name="allocate"
                              value={allocate}
                              onChange={handleFormThree}
                            />
                          </div>
                          <div>
                            {allocateValidate == true ? (
                              <p className="text-danger">
                                {" "}
                                {validationnErrThree.allocate}{" "}
                              </p>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                        {authToken == true ? (
                          <div className="col-lg-12">
                            <div className="submit_butn_s">
                              <Button onClick={() => steps("three")}>
                                {" "}
                                Next{" "}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="col-lg-12">
                            <div className="submit_butn_s">
                              <Button>
                                {" "}
                                <Link to="/login"> Login to continue </Link>
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : activeTab == "confirm1Tab" ? (
                    <div className="fonrm_card_s">
                      <h2>Step 4</h2>
                      <div class="row">
                        <div className="col-lg-6">
                          <div class="form-group">
                            <label>Telegram Group</label>
                            <input
                              type="text"
                              class="form-control"
                              placeholder="Telegram Group"
                              name="telegram"
                              value={telegram}
                              onChange={handleFormFour}
                            />
                          </div>
                          <div class="form-group">
                            <label>Twitter Link</label>
                            <input
                              type="text"
                              class="form-control"
                              placeholder="Twitter Link"
                              name="twitter"
                              value={twitter}
                              onChange={handleFormFour}
                            />
                          </div>
                          <div class="form-group">
                            <label>Facebook Link</label>
                            <input
                              type="text"
                              class="form-control"
                              placeholder="Facebook Link"
                              name="facebooklink"
                              value={facebooklink}
                              onChange={handleFormFour}
                            />
                          </div>
                          <div class="form-group">
                            <label>LinkedIn Link</label>
                            <input
                              type="text"
                              class="form-control"
                              placeholder="LinkedIn Link"
                              name="LinkedIn"
                              value={LinkedIn}
                              onChange={handleFormFour}
                            />
                          </div>
                          <div class="form-group">
                            <div class="">
                              <label for="formFile" class="form-label">
                                Reddit Link
                              </label>
                              <input
                                type="text"
                                class="form-control"
                                placeholder="Reddit Link"
                                name="reddit"
                                value={reddit}
                                onChange={handleFormFour}
                              />
                            </div>
                          </div>
                          <div class="form-group">
                            <div class="">
                              <label for="formFile" class="form-label">
                                Bitcointalk Link
                              </label>
                              <input
                                type="text"
                                class="form-control"
                                placeholder="Bitcointalk Link"
                                name="Bitcointalk"
                                value={Bitcointalk}
                                onChange={handleFormFour}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div class="form-group">
                            <label>Instagram Link</label>
                            <input
                              type="text"
                              class="form-control"
                              placeholder="Instagram Link"
                              name="instagram"
                              value={instagram}
                              onChange={handleFormFour}
                            />
                          </div>

                          <div class="form-group">
                            <label>Youtube Channel</label>
                            <input
                              type="text"
                              class="form-control"
                              placeholder="Youtube Channel"
                              name="youtube"
                              value={youtube}
                              onChange={handleFormFour}
                            />
                          </div>
                          <div class="form-group">
                            <label>Youtube Video Link</label>
                            <input
                              type="text"
                              class="form-control"
                              placeholder="Youtube Video Link"
                              name="youtubevideo"
                              value={youtubevideo}
                              onChange={handleFormFour}
                            />
                          </div>
                          <div class="form-group">
                            <label>Medium</label>
                            <input
                              type="text"
                              class="form-control"
                              placeholder="Medium"
                              name="Medium"
                              value={Medium}
                              onChange={handleFormFour}
                            />
                          </div>
                          <div class="form-group">
                            <label>Please provide a link to your GitHub</label>
                            <input
                              type="text"
                              class="form-control"
                              placeholder=" GitHub Link"
                              name="github"
                              value={github}
                              onChange={handleFormFour}
                            />
                          </div>
                        </div>

                        {authToken == true ? (
                          <div className="col-lg-12">
                            <div className="submit_butn_s">
                              <Button onClick={() => steps("four")}>
                                Next
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="col-lg-12">
                            <div className="submit_butn_s">
                              <Button>
                                {" "}
                                <Link to="/login"> Login to continue </Link>
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="fonrm_card_s page_dss">
                        <div class="form-group mb-5">
                          <label>
                            SpacePepe Exchange can publish any of the
                            information you provide
                          </label>
                          <div class="custom-control custom-radio mt-3">
                            <input
                              type="radio"
                              class="custom-control-input"
                              id="customRadio1"
                              name="agree"
                              value="accept"
                              onChange={handleFormFive}
                            />
                            <label
                              class="custom-control-label"
                              for="customRadio1"
                            >
                              Yes, I agree
                            </label>
                          </div>
                          <div class="custom-control custom-radio mt-3">
                            <input
                              type="radio"
                              class="custom-control-input"
                              id="customRadio2"
                              name="agree"
                              value="notaccept"
                              onChange={handleFormFive}
                            />
                            <label
                              class="custom-control-label"
                              for="customRadio2"
                            >
                              No, no Need to hit the submit button
                            </label>
                          </div>
                        </div>
                        {/* <div class="form-group  mb-5">
                          <label>
                            Cotlox reserves the right to de-list your coin/token
                            at any time, for any reason, solely at cotlox
                            discretion, without refunds
                          </label>
                          <div class="custom-control custom-radio mt-3">
                            <input
                              type="radio"
                              class="custom-control-input"
                              id="customRadio1"
                              name="submithit"
                              value="hit"
                              onChange={handleFormSix}
                            />
                            <label
                              class="custom-control-label"
                              for="customRadio1"
                            >
                              Yes, I agree
                            </label>
                          </div>
                          <div class="custom-control custom-radio mt-3">
                            <input
                              type="radio"
                              class="custom-control-input"
                              id="customRadio2"
                              name="submithit"
                              value="nothit"
                              onChange={handleFormSix}
                            />
                            <label
                              class="custom-control-label"
                              for="customRadio2"
                            >
                              No, no Need to hit the submit button
                            </label>
                          </div>
                        </div> */}
                        {/* <div class="form-group">
                          <label>Please Provide your name and title.</label>
                          <input
                            type="text"
                            class="form-control"
                            placeholder="Your answer"
                            name="Medium"
                          />
                        </div> */}
                      </div>

                      {authToken == true ? (
                        <div className="submit_butn_s">
                          <Button onClick={() => steps("submit")}>
                            Submit
                          </Button>
                        </div>
                      ) : (
                        <div className="col-lg-12">
                          <div className="submit_butn_s">
                            <Button>
                              {" "}
                              <Link to="/login"> Login to continue </Link>
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
