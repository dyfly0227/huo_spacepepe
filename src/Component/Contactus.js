import React, {useEffect} from "react";
import useState from "react-usestateref";
import {Button} from "@material-ui/core";
import Count from "./Countdown";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
// import Slider, {Range} from "rc-slider";
// import "rc-slider/assets/index.css";
import Header from "./Header";
import Footer from "./Footer";
import Chart from "./chart/Chart";
import ReactPlayer from "react-player";
import {Link, useNavigate} from "react-router-dom";
import apiService from "../core/service/detail";
import {postMethod} from "../core/service/common.api";
import {getMethod} from "../core/service/common.api";
import {socket} from "./context/socket";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import SliderNew from "react-slick";
import IconC from "../img/BNB.png";
import { toast } from "react-toastify";

var settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 1000,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 700,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 2,
        infinite: false,
        dots: false,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 2,
        infinite: false,
        dots: false,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: false,
        dots: false,
      },
    },
  ],
};
var newsticker = {
  speed: 4000,
  autoplay: true,
  autoplaySpeed: 0,
  centerMode: true,
  cssEase: "linear",
  slidesToShow: 1,
  slidesToScroll: 1,
  variableWidth: true,
  infinite: true,
  initialSlide: 1,
  arrows: false,
  buttons: false,
};

function Home() {
  const options = ["one", "two", "three"];
  const navigate = useNavigate();
  
  const initialFormValue = {
    name: "",
    email: "",
    mobile: "",
    message: ""
  };

  const [validationnErr, setvalidationnErr] = useState("");
  const [formValue, setFormValue] = useState(initialFormValue);
  const [emailValidate, setemailValidate, emailValidateref] = useState(false);
  const [nameValidate, setnameValidate, nameValidateref] = useState(false);
  const [mobileValidate, setmobileValidate, mobileValidateref] = useState(false);
  const [messageValidate, setmessageValidate, messageValidateref] = useState(false);
  const [buttonLoader, setbuttonLoader] = useState(false);

  useEffect(() => {
  }, []);

  const {
    name,
    email,
    mobile,
    message
  } = formValue;

  const handleChange = async (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    let formData = { ...formValue, ...{ [name]: value } };
    setFormValue(formData);
    validate(formValue);
  };

  const validate = async (values) => {
    const errors = {};
    if (values.email == "") {
      errors.email = "Email is a required field";
      setemailValidate(true);
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = "Invalid email address";
      setemailValidate(true);
    } else {
      setemailValidate(false);
    }

    if (values.name == "") {
      errors.name = "Name is a required field";
      setnameValidate(true);
    }
    else
    {
      setnameValidate(false);
    }

    if (values.mobile == "") {
      errors.mobile = "Phone Number is a required field";
      setmobileValidate(true);
    }
    else
    {
      setmobileValidate(false);
    }

    if (values.message == "") {
      errors.message = "Message is a required field";
      setmessageValidate(true);
    }
    else
    {
      setmessageValidate(false);
    }

    setvalidationnErr(errors);
    return errors;
  };
   
  const formSubmit = async (payload) => {
    validate(formValue);
    if (
      emailValidateref.current == false &&
      nameValidateref.current == false &&
      mobileValidateref.current == false &&
      messageValidateref.current == false 
    ) {
      // return false
      var data = {
        apiUrl: apiService.contact,
        payload: formValue,
      };
      setbuttonLoader(true);
      var resp = await postMethod(data);
      setbuttonLoader(false);
      if (resp.status) {
        toast(resp.Message);
        navigate("/contactus");
        setFormValue(initialFormValue);
      } else {
        toast(resp.Message);
      }
    } else {
      //toast("all field requird");
    }
  };
  return (
    <div className="home contact fixed_header">
      <Header />
      <main>
        <section className="contact_us">
          <div className="container">
            <div className="row justify-center">
              <div className="col-lg-10">
                <div className="row">
                  <div className="col-lg-6">
                    <div className="conatc">
                      <img
                        src={require("../img/newimg/contact.png")}
                        className="img-fluid"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <h2 className="tilte_contact">Contact Us</h2>
                    <div className="card_aa">
                      <form>
                        <div class="form-group">
                          <label>Name</label>
                          <input
                            type="text"
                            class="form-control"
                            id="exampleInputPassword1"
                            placeholder="Name"
                            name="name"
                            value={name}
                            onChange={handleChange}
                          />
                          <div>
                            {nameValidateref.current == true ? (
                              <p className="text-danger">
                                {" "}
                                {validationnErr.name}{" "}
                              </p>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                        <div class="form-group">
                          <label>Email</label>
                          <input
                            type="email"
                            class="form-control"
                            id="exampleInputPassword1"
                            placeholder="Email"
                            name="email"
                            value={email}
                            onChange={handleChange}
                          />
                          <div>
                            {emailValidateref.current == true ? (
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
                          <label>Phone Number</label>
                          <input
                            type="email"
                            class="form-control"
                            id="exampleInputPassword1"
                            placeholder="Phone Number"
                            name="mobile"
                            value={mobile}
                            onChange={handleChange}
                          />
                          <div>
                            {mobileValidateref.current == true ? (
                              <p className="text-danger">
                                {" "}
                                {validationnErr.mobile}{" "}
                              </p>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                        <div class="form-group text_areaaa">
                          <label>Message</label>
                          <textarea rows="5" name="message" value={message}
                            onChange={handleChange}></textarea>
                            <div>
                            {messageValidateref.current == true ? (
                              <p className="text-danger">
                                {" "}
                                {validationnErr.message}{" "}
                              </p>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                        {buttonLoader == false ? (
                        <Button
                          onClick={formSubmit}
                        >
                          Submit
                        </Button>
                      ) : (
                        <Button>
                          loading...
                        </Button>
                      )}
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Home;
