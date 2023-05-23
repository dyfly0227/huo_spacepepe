import React, { useEffect, useState } from "react";
import { Button } from "@material-ui/core";
import Count from "./Countdown";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
// import Slider, {Range} from "rc-slider";
// import "rc-slider/assets/index.css";
import Header from "./Header";
import Footer from "./Footer";
import Chart from "./chart/Chart";
import ReactPlayer from "react-player";
import { Link, useNavigate } from "react-router-dom";
import apiService from "../core/service/detail";
import { postMethod } from "../core/service/common.api";
import { getMethod } from "../core/service/common.api";
import { socket } from "./context/socket";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import SliderNew from "react-slick";
import IconC from "../img/BNB.png";

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
  const [currencylistData, setcurrencylistData] = useState([]);
  const [currencyCount, setcurrencyCount] = useState(0);

  const navpage = async () => {
    if (localStorage.getItem("user_token") !== null) {
      navigate("trade/BTC_USDT");
    } else {
      navigate("register");
    }
  };

  useEffect(() => {
    socket.connect();
    socket.removeListener("homepagemarketprice");
    socket.emit("homepagemarketprice");
    viewMoreCurrency(25);
  }, []);
  const navtradepage = async (symbol) => {
    if (symbol == "USDT") {
      navigate("trade/BTC_USDT");
    } else {
      navigate("trade/" + symbol + "_USDT");
    }
  };
  const viewMoreCurrency = async (limit) => {
    var data = {
      apiUrl: apiService.getCurrency,
      payload: { limit: limit },
    };
    var resp = await postMethod(data);
    if (resp) {
      setcurrencyCount(resp.countDocs);
      socket.on("gethomemarketprice", async (response) => {
        for (let index = 0; index < resp.data.length; index++) {
          const element = resp.data[index];
          resp.data[index]["marketprice"] =
            response.data[resp.data[index]["currencySymbol"]].USDT;
        }
        setcurrencylistData(resp.data);
      });
    } else {
    }
  };
  const [value, setValue] = useState();

  const navigatepage = async (page) => {
    navigate(page);
  };
  return (
    <div className="home">
      <Header />
      <main>
        <div className="five_secton step blue_light_bg">
          <div className="xieti"></div>
          <section className="first_banner">
            <div className="container">
              <div className="row justify-center">
                <div className="col-lg-10">
                  <div className="row">
                    <div
                      className="col-lg-6 "
                      data-aos="fade-up"
                      data-aos-duration="2000"
                    >
                      <div className="main_conten hero-intro">
                        <h1>Begin Trading with Your Favorite Coins</h1>
                        <p>
                          <p>
                            Welcome to Space PEPE Exchange! A next-gen
                            Blockchain and Crypto Exchange platform that offers
                            trader with an endless assets buy and selling
                            feature with real money.
                          </p>
                        </p>
                        <div className="phone_number donwload-form buttondf">
                          {/* <PhoneInput
                            placeholder="Enter phone number"
                            value={value}
                            onChange={setValue}
                          /> */}

                          <Button
                            className="btn--blue "
                            onClick={() => navigatepage("trade/ETH_USDT")}
                          >
                            START TRADING
                          </Button>
                          <Button
                            className="btn--blue "
                            onClick={() => navigatepage("staking")}
                          >
                            INVEST
                          </Button>
                        </div>
                        <ul class="appDownload">
                          <li>
                            <a href="" target="_blank" rel="noopener">
                              <img
                                src="https://zebpay.com/wp-content/uploads/2021/11/playStore.svg"
                                alt=""
                              />
                            </a>
                          </li>
                          <li>
                            <a href="" target="_blank" rel="noopener">
                              <img
                                src="https://zebpay.com/wp-content/uploads/2021/11/appStore.svg"
                                alt=""
                              />
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div
                      className="col-lg-6"
                      data-aos="fade-up"
                      data-aos-duration="2000"
                    >
                      <div className="currency-banner-image">
                        <img
                          src={require("../img/bj/diqiu.png")}
                          className="img_soeurr"
                        />
                        <img
                          className="banner-shape-1"
                          src={require("../img/bj/weixing.png")}
                        />
                        <img
                          className="banner-shape-2"
                          src={require("../img/bj/huojian.png")}
                        />
                        <img
                          className="banner-shape-3"
                          src={require("../img/bj/piaofu.png")}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* <div className="divider large_divider"></div>
          <div className="angle_bottom"></div> */}
        </div>

        <section className="Second_slider">
          <div className="container">
            <div className="row justify-center">
              <div
                className="col-lg-10"
                data-aos="fade-up"
                data-aos-duration="2000"
              >
                <div className="slider_coin coin-slider">
                  <SliderNew {...settings}>
                    {currencylistData &&
                      currencylistData.map((obj, i) => {
                        return (
                          <div className="diveee">
                            <div className="coin-slider-card slick-slide">
                              <a className="coin_container" href="">
                                <span className="cmc_links">
                                  <span className="ccpw_icon">
                                    <img src={obj.Currency_image} />
                                  </span>
                                  <div className="coinnenww">
                                    <span className="coin-title">
                                      <span className="coin name">
                                        {obj.currencyName}
                                      </span>
                                      <span className="coin-shot-name">
                                        {obj.currencySymbol}
                                      </span>
                                    </span>
                                    <span className="price">
                                      {obj.currencySymbol == "SHIB"
                                        ? parseFloat(obj.marketprice).toFixed(8)
                                        : parseFloat(obj.marketprice).toFixed(
                                            2
                                          )}
                                    </span>
                                  </div>
                                  {/* <span className="percentage-change changesup">
                              0.03%
                            </span> */}
                                </span>
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    {/* <div className="diveee">
                      <div className="coin-slider-card slick-slide">
                        <a className="coin_container" href="">
                          <span className="cmc_links">
                            <span className="ccpw_icon">
                              <img src="https://static.zebpay.com/multicoins/ic_coin_usdt.png" />
                            </span>
                            <div className="coinnenww">
                              <span className="coin-title">
                                <span className="coin name">Tether</span>
                                <span className="coin-shot-name">USDT</span>
                              </span>
                              <span className="price">₹79.92</span>
                            </div>
                            <span className="percentage-change changesup">
                              0.03%
                            </span>
                          </span>
                        </a>
                      </div>
                    </div>
                    <div className="diveee">
                      <div className="coin-slider-card slick-slide">
                        <a className="coin_container" href="">
                          <span className="cmc_links">
                            <span className="ccpw_icon">
                              <img src="https://static.zebpay.com/multicoins/ic_coin_usdt.png" />
                            </span>
                            <div className="coinnenww">
                              <span className="coin-title">
                                <span className="coin name">Tether</span>
                                <span className="coin-shot-name">USDT</span>
                              </span>
                              <span className="price">₹79.92</span>
                            </div>
                            <span className="percentage-change changesup">
                              0.03%
                            </span>
                          </span>
                        </a>
                      </div>
                    </div>
                    <div className="diveee">
                      <div className="coin-slider-card slick-slide">
                        <a className="coin_container" href="">
                          <span className="cmc_links">
                            <span className="ccpw_icon">
                              <img src="https://static.zebpay.com/multicoins/ic_coin_usdt.png" />
                            </span>
                            <div className="coinnenww">
                              <span className="coin-title">
                                <span className="coin name">Tether</span>
                                <span className="coin-shot-name">USDT</span>
                              </span>
                              <span className="price">₹79.92</span>
                            </div>
                            <span className="percentage-change changesup">
                              0.03%
                            </span>
                          </span>
                        </a>
                      </div>
                    </div>
                    <div className="diveee">
                      <div className="coin-slider-card slick-slide">
                        <a className="coin_container" href="">
                          <span className="cmc_links">
                            <span className="ccpw_icon">
                              <img src="https://static.zebpay.com/multicoins/ic_coin_usdt.png" />
                            </span>
                            <div className="coinnenww">
                              <span className="coin-title">
                                <span className="coin name">Tether</span>
                                <span className="coin-shot-name">USDT</span>
                              </span>
                              <span className="price">₹79.92</span>
                            </div>
                            <span className="percentage-change changesup">
                              0.03%
                            </span>
                          </span>
                        </a>
                      </div>
                    </div>
                    <div className="diveee">
                      <div className="coin-slider-card slick-slide">
                        <a className="coin_container" href="">
                          <span className="cmc_links">
                            <span className="ccpw_icon">
                              <img src="https://static.zebpay.com/multicoins/ic_coin_usdt.png" />
                            </span>
                            <div className="coinnenww">
                              <span className="coin-title">
                                <span className="coin name">Tether</span>
                                <span className="coin-shot-name">USDT</span>
                              </span>
                              <span className="price">₹79.92</span>
                            </div>
                            <span className="percentage-change changesup">
                              0.03%
                            </span>
                          </span>
                        </a>
                      </div>
                    </div>
                    <div className="diveee">
                      <div className="coin-slider-card slick-slide">
                        <a className="coin_container" href="">
                          <span className="cmc_links">
                            <span className="ccpw_icon">
                              <img src="https://static.zebpay.com/multicoins/ic_coin_usdt.png" />
                            </span>
                            <div className="coinnenww">
                              <span className="coin-title">
                                <span className="coin name">Tether</span>
                                <span className="coin-shot-name">USDT</span>
                              </span>
                              <span className="price">₹79.92</span>
                            </div>
                            <span className="percentage-change changesup">
                              0.03%
                            </span>
                          </span>
                        </a>
                      </div>
                    </div> */}
                  </SliderNew>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="THired_secton">
          <div className="container">
            <div className="row justify-center">
              <div className="col-lg-10">
                <h1 className="gradion_text">Why Space PEPE Exchange ?</h1>
                <p className="text_des">
                  Space PEPE Exchange operates on the ERC-20 network, allowing
                  it to easily integrate with a wide range of tools across
                  multiple blockchains, <br />
                  while maintaining solid security. That’s not all, it also
                  offers features like: It is a long established fact that a
                  reader will be distracted by the readable content of a page
                  when looking at its layout.
                </p>
                <div className="ic__image__sec">
                  <div
                    className="ic__bg "
                    data-aos="fade-up"
                    data-aos-duration="1000"
                  >
                    <img
                      src={require("../img/newimg/do-more-crypto-bg_new.png")}
                      className="attachment-full size-full"
                    />
                  </div>
                  {/* <div
                    className="ic__image "
                    data-aos="fade-up"
                    data-aos-duration="2000"
                  >
                    <img
                      src={require("../img/newimg/features-1.png")}
                      className="attachment-full size-full"
                    />
                  </div> */}
                  <div className="row justify-center">
                    <div
                      className="col-lg-4 mt-5 mb-5"
                      data-aos="fade-up"
                      data-aos-duration="3000"
                    >
                      <div className="ic__item ">
                        <div className="ic__card">
                          <div className="ic__card__img">
                            <div className="ic__card__icon">
                              <img
                                src={require("../img/newimg/rocketnew.png")}
                                className="attachment-full"
                              />
                            </div>
                          </div>
                          <div className="ic__card__copy">
                            <h4 className="ic__card__heading">
                              Fast Transactional
                              <br /> Speeds
                            </h4>
                            <div className="ic__card__description">
                              <p>
                                Space PEPE Exchange has the potential to execute
                                millions of transactions every second, and the
                                system.
                              </p>
                            </div>
                            <div className="ic__card__btn"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="col-lg-4 mt-5 mb-5"
                      data-aos="fade-up"
                      data-aos-duration="3000"
                    >
                      <div className="ic__item ">
                        <div className="ic__card new">
                          <div className="ic__card__img">
                            <div className="ic__card__icon">
                              <img
                                src={require("../img/newimg/lence.png")}
                                className="attachment-full"
                              />
                            </div>
                          </div>
                          <div className="ic__card__copy">
                            <h4 className="ic__card__heading">
                              Super Quick
                              <br />
                              Kyc
                            </h4>
                            <div className="ic__card__description">
                              <p>
                                The top identity verification systems complete
                                your KYC within a few hours.
                              </p>
                            </div>
                            <div className="ic__card__btn"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="col-lg-4 mt-5 mb-5"
                      data-aos="fade-up"
                      data-aos-duration="3000"
                    >
                      <div className="ic__item mb-5">
                        <div className="ic__card">
                          <div className="ic__card__img">
                            <div className="ic__card__icon">
                              <img
                                src={require("../img/newimg/code.png")}
                                className="attachment-full"
                              />
                            </div>
                          </div>
                          <div className="ic__card__copy">
                            <h4 className="ic__card__heading">
                              Exceptional <br /> Security
                            </h4>
                            <div className="ic__card__description">
                              <p>Up to 4% returns for crypto fixed deposits</p>
                            </div>
                            <div className="ic__card__btn"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="col-lg-4 mt-2  mb-5"
                      data-aos="fade-up"
                      data-aos-duration="3000"
                    >
                      <div className="ic__item ">
                        <div className="ic__card">
                          <div className="ic__card__img">
                            <div className="ic__card__icon">
                              <img
                                src={require("../img/newimg/charte.png")}
                                className="attachment-full"
                              />
                            </div>
                          </div>
                          <div className="ic__card__copy">
                            <h4 className="ic__card__heading">
                              Effective & Simple <br /> Theme
                            </h4>
                            <div className="ic__card__description">
                              <p>
                                Space PEPE Exchange has the potential to execute
                                millions of transactions every second, and the
                                system.
                              </p>
                            </div>
                            <div className="ic__card__btn"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="col-lg-4 mt-2"
                      data-aos="fade-up"
                      data-aos-duration="3000"
                    >
                      <div className="ic__item ">
                        <div className="ic__card">
                          <div className="ic__card__img">
                            <div className="ic__card__icon">
                              <img
                                src={require("../img/newimg/pin.png")}
                                className="attachment-full"
                              />
                            </div>
                          </div>
                          <div className="ic__card__copy">
                            <h4 className="ic__card__heading">
                              Built By Adherents <br />
                              To The Blockchain
                            </h4>
                            <div className="ic__card__description">
                              <p>
                                The top identity verification systems complete
                                your KYC within a few hours.
                              </p>
                            </div>
                            <div className="ic__card__btn"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* <section className="four_secton">
          <div className="container">
            <div className="row justify-center">
              <div className="col-lg-10">
                <div
                  className="icon__grid"
                  data-aos="fade-up"
                  data-aos-duration="2000"
                >
                  <div className="row">
                    <div className="col-lg-3">
                      <div class="icon__item">
                        <img
                          src="https://zebpay.com/wp-content/uploads/2021/09/icon-user.svg"
                          class="attachment-full size-full"
                          alt=""
                        />{" "}
                        <h4 class="h6 icon__item__heading">
                          5.5 Million +<br />
                          Users
                        </h4>
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div class="icon__item">
                        <img
                          src="https://zebpay.com/wp-content/uploads/2021/09/icon-support.svg"
                          class="attachment-full size-full"
                          alt=""
                        />{" "}
                        <h4 class="h6 icon__item__heading">24/7 Support</h4>
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div class="icon__item">
                        <img
                          src="https://zebpay.com/wp-content/uploads/2021/09/icon-trade-volume.svg"
                          class="attachment-full size-full"
                          alt=""
                        />{" "}
                        <h4 class="h6 icon__item__heading">
                          $24+ Billion Trade
                          <br />
                          Volume
                        </h4>
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div class="icon__item">
                        <img
                          src="https://zebpay.com/wp-content/uploads/2021/09/icon-glob.svg"
                          class="attachment-full size-full"
                          alt=""
                        />{" "}
                        <h4 class="h6 icon__item__heading">
                          160+
                          <br />
                          Countries
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section> */}
        <section className="six_secton six_sectonnew step paddin_clsss">
          <div className="container">
            <div className="row justify-center">
              <div className="col-lg-10">
                <div className="card_colo">
                  <div className="row">
                    <div
                      className="col-lg-6"
                      data-aos="fade-up"
                      data-aos-duration="2000"
                    >
                      <div className="six_secton_s">
                        <h1>
                          Crypto Exchange <br />
                          Platform
                        </h1>
                        <p>
                          A next-gen Blockchain and Crypto Exchange platform
                          that offers trader with an endless assets buy and
                          selling feature with real money.
                        </p>
                        {/* <div className="wp-container-4 wp-block-buttons">
                          <div className="wp-block-button">
                            <Button className="wp-block-button__link">
                              Know more
                            </Button>
                          </div>
                        </div> */}
                      </div>
                    </div>
                    <div
                      className="col-lg-6"
                      data-aos="fade-up"
                      data-aos-duration="2000"
                    >
                      <div className="img_pic_s img_pic_s_11">
                        <img src={require("../img/bj/diannao.png")} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="five_sectonnew step blue_light_bg">
          <div className="container">
            <div className="row justify-center">
              <div className="col-lg-10">
                <h2 class="h4 step__heading gradion_text ">
                  Investing in crypto will be <br />
                  easier than ever.
                </h2>
                <p className="text_des">
                  Space PEPE Exchange makes it easier to invest and trade in
                  cryptocurrency <br />
                  than any other platform.
                </p>
                <div className="bottom_maa">
                  <div className="row pt-3 justify-center">
                    <div
                      className="col-lg-3"
                      data-aos="fade-up"
                      data-aos-duration="2000"
                    >
                      <div className="step__item ">
                        <div className="step__card">
                          <div className="step__card__img">
                            <div className="step__card__icon">
                              <img
                                src={require("../img/newimg/profileee.png")}
                                class="attachment-large size-large"
                                alt=""
                              />
                            </div>
                          </div>
                          <div class="step__card__copy">
                            <h5 class="step__card__heading"> Create account</h5>{" "}
                            <div class="step__card__description">
                              <p>
                                Space PEPE Exchange has the potential to execute
                                millions of transactions every second, and the
                                system.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-1"></div>
                    <div
                      className="col-lg-3"
                      data-aos="fade-up"
                      data-aos-duration="2000"
                    >
                      <div className="step__item ">
                        <div className="step__card">
                          <div className="step__card__img">
                            <div className="step__card__icon">
                              <img
                                src={require("../img/newimg/bank.png")}
                                class="attachment-large size-large"
                                alt=""
                              />
                            </div>
                          </div>
                          <div class="step__card__copy">
                            <h5 class="step__card__heading">Add funds</h5>
                            <div class="step__card__description">
                              <p>
                                The top identity verification systems complete
                                your KYC within a few hours.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-1"></div>
                    <div
                      className="col-lg-3"
                      data-aos="fade-up"
                      data-aos-duration="2000"
                    >
                      <div className="step__item step__item00">
                        <div className="step__card">
                          <div className="step__card__img">
                            <div className="step__card__icon">
                              <img
                                src={require("../img/newimg/etherene.png")}
                                class="attachment-large size-large"
                                alt=""
                              />
                            </div>
                          </div>
                          <div class="step__card__copy">
                            <h5 class="step__card__heading">Start investing</h5>
                            <div class="step__card__description">
                              <p>
                                The organisation has done all necessary to make
                                Space PEPE Exchange the most secure exchange.
                              </p>
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
        </section>

        {/* <section className="six_secton step gray blue_light_bg">
          <div className="angle_top"></div>
          <div className="divider large_divider"></div>
          <div className="container">
            <div className="row justify-center">
              <div className="col-lg-10">
                <div className="row">
                  <div
                    className="col-lg-6"
                    data-aos="fade-up"
                    data-aos-duration="2000"
                  >
                    <div className="img_pic_s">
                      <img src={require("../img/newimg/sell-1.png")} />
                    </div>
                  </div>
                  <div
                    className="col-lg-6"
                    data-aos="fade-up"
                    data-aos-duration="2000"
                  >
                    <div className="six_secton_s">
                      <h1>
                        Simplified Trading.
                        <br />
                        Pro Features
                      </h1>
                      <div class="wp-block-lazyblock-icon-list lazyblock-icon-list-Z2svB4C">
                        <div class="ics__icon__list">
                          <div class="ics__icon__item">
                            <div class="ics__icon__item__icon">
                              <i class="bi bi-bar-chart"></i>
                            </div>
                            <h4 class="ics__icon__item__heading">
                              Explore Advanced Charting Feature
                            </h4>
                          </div>
                          <div class="ics__icon__item">
                            <div class="ics__icon__item__icon">
                              <i class="bi bi-arrow-left-right"></i>
                            </div>
                            <h4 class="ics__icon__item__heading">
                              Instant Buy & Sell Options
                            </h4>
                          </div>
                          <div class="ics__icon__item">
                            <div class="ics__icon__item__icon">
                              <i class="bi bi-clock"></i>
                            </div>
                            <h4 class="ics__icon__item__heading">
                              24/7 Customer Support
                            </h4>
                          </div>
                        </div>
                      </div>
                      <div className="wp-container-4 wp-block-buttons">
                        <div className="wp-block-button">
                          <Button className="wp-block-button__link">
                            Know more
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="divider large_divider"></div>
          <div className="angle_bottom"></div>
        </section> */}
        {/* <section className="six_secton step">
          <div className="container">
            <h2 className="h2_piopo">Latest Offers For India</h2>
            <div className="row justify-center latest-offer__item">
              <div
                className="col-lg-3"
                data-aos="fade-up"
                data-aos-duration="2000"
              >
                <div className="latest-offer__item__inner light-blue">
                  <div class="latest-offer__item__head">
                    <h3 class="latest-offer__title">
                      Get ₹100 <br />
                      Cashback
                    </h3>
                    <div class="latest-offer__description">
                      <p>
                        <span>
                          Register using code <strong>ZEBPAY100</strong> to get{" "}
                          <strong>₹100</strong> cashback on your first trade.
                        </span>
                      </p>
                    </div>
                  </div>
                  <div class="latest-offer__item__bottom">
                    <div class="latest-offer__image">
                      <img
                        src="https://zebpay.com/wp-content/uploads/2021/11/icon-offer.png"
                        class="attachment-large size-large"
                        alt=""
                      />{" "}
                    </div>
                    <div class="latest-offer__btn">
                      <a class="btn" href="" target="_blank" tabindex="0">
                        AVAIL OFFER
                      </a>
                    </div>
                    <div class="latest-offer__date">1st to 31st July 2022</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="seven_secton step">
          <div className="container">
            <div className="row justify-center latest-offer__item">
              <div
                className="col-lg-7 d-flex justify-center"
                data-aos="fade-up"
                data-aos-duration="2000"
              >
                <div className="cta__row">
                  <h3 class="cta__heading">
                    Register with code ZEBPAY100 <br /> to get ₹100 cashback on
                    your first trade{" "}
                  </h3>
                  <div class="cta__btn">
                    <a class="btn btn--fill" target="_blank" href="">
                      Signup Now
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section> */}
        <section className="eight_secton step patop0ee">
          <div className="container">
            <h2 className="take-your-crypto-gameto-the-next-level gradion_text ">
              Available Currencies
            </h2>
            <p className="text_des">
              There are various crypto currencies available in Space PEPE
              Exchange, and you may easily trade and <br />
              invest in all of them.
            </p>
            <div className="row justify-center latest-offer__item">
              <div
                className="col-lg-10 "
                data-aos="fade-up"
                data-aos-duration="2000"
              >
                <div className="table-responsive coin-list__main">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th className="text-center">Price</th>
                        <th className="text-right">Trade</th>
                      </tr>
                    </thead>
                    {currencylistData &&
                      currencylistData.map((obj, i) => {
                        return (
                          <tbody>
                            <tr>
                              <td>
                                <a href="#" className="butn_flw_section">
                                  <span class="icon-btc">
                                    {" "}
                                    <img src={obj.Currency_image} />
                                  </span>
                                  <span>{obj.currencyName}</span>
                                  <span class="unit">{obj.currencySymbol}</span>
                                </a>
                              </td>
                              <td className="text-center">
                                {obj.marketprice <= 0 ? (
                                  <div className="text-red">
                                    {obj.currencySymbol == "SHIB"
                                      ? parseFloat(obj.marketprice).toFixed(8)
                                      : parseFloat(obj.marketprice).toFixed(2)}
                                  </div>
                                ) : (
                                  <div className="text-green">
                                    {obj.currencySymbol == "SHIB"
                                      ? parseFloat(obj.marketprice).toFixed(8)
                                      : parseFloat(obj.marketprice).toFixed(2)}
                                  </div>
                                )}
                              </td>

                              <td className="text-right">
                                <Button
                                  href=""
                                  className="treiee"
                                  // onClick={navtradepage}
                                  onClick={() =>
                                    navtradepage(obj.currencySymbol)
                                  }
                                >
                                  Buy
                                </Button>
                              </td>
                            </tr>
                          </tbody>
                        );
                      })}
                  </table>
                </div>
                {currencylistData.length == 25 ? (
                  <a
                    href="javascript:void(0)"
                    className="link_more  btn btn-primary-alta connectBtn colo-fff m-auto button_view_modee"
                    onClick={() => viewMoreCurrency(currencyCount)}
                  >
                    More prices <i className="fas fa-arrow-right"></i>
                  </a>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </section>
        <section className="six_secton step gray padieeee_bg">
          <div className="container">
            <div className="row justify-center">
              <div className="col-lg-10">
                <div className="row">
                  <div
                    className="col-lg-4"
                    data-aos="fade-up"
                    data-aos-duration="2000"
                  >
                    <div className="img_pic_s">
                      <img
                        src={require("../img/bj/logo.png")}
                        className="img_wwwwwww"
                      />
                    </div>
                  </div>
                  <div
                    className="col-lg-8"
                    data-aos="fade-up"
                    data-aos-duration="2000"
                  >
                    <div className="six_secton_s pl-0">
                      <h1 className="gradion_text ">
                        About Space PEPE Exchange
                      </h1>

                      <p>
                        Now is your time. With Space PEPE Exchange you can buy,
                        sell and trade crypto assets with amazing ease,
                        confidence and trust. Whether you’re a first time
                        investor or a professional trader - Space PEPE Exchange
                        has got you both covered!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* <section className="nine_secton step">
          <div className="container">
            <h2 className="take-your-crypto-gameto-the-next-level">
              Featured In
            </h2>
            <SliderNew
              {...newsticker}
              data-aos="fade-up"
              data-aos-duration="2000"
            >
              <div className="classss_imgs fl__slide__item">
                <img src="https://zebpay.com/wp-content/uploads/2021/12/logo-tet.png" />
              </div>
              <div className="classss_imgs fl__slide__item">
                <img src="https://zebpay.com/wp-content/uploads/2021/12/logo-mint.png" />
              </div>
              <div className="classss_imgs fl__slide__item">
                <img src="https://zebpay.com/wp-content/uploads/2021/12/logo-et-now.png" />
              </div>
              <div className="classss_imgs fl__slide__item">
                <img src="https://zebpay.com/wp-content/uploads/2021/12/logo-cnbc.png" />
              </div>
              <div className="classss_imgs fl__slide__item">
                <img src="https://zebpay.com/wp-content/uploads/2021/12/logo-bi.png" />
              </div>
              <div className="classss_imgs fl__slide__item">
                <img src="https://zebpay.com/wp-content/uploads/2021/12/logo-enterpreneur.png" />
              </div>
            </SliderNew>
          </div>
        </section> */}
      </main>
      <Footer />
    </div>
  );
}

export default Home;
