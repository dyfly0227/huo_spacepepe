import React, { useEffect, useState } from "react";
import { Button } from "@material-ui/core";
import Count from "./Countdown";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import Slider, { Range } from "rc-slider";
import "rc-slider/assets/index.css";
import Header from "./Header";
import Footer from "./Footer";
import Chart from "./chart/Chart";
import ReactPlayer from "react-player";
import { Link, useNavigate } from "react-router-dom";
import apiService from "../core/service/detail";
import { postMethod } from "../core/service/common.api";
import { getMethod } from "../core/service/common.api";
import { socket } from "./context/socket";

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

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const goToPrevPage = () =>
    setPageNumber(pageNumber - 1 <= 1 ? 1 : pageNumber - 1);

  const goToNextPage = () =>
    setPageNumber(pageNumber + 1 >= numPages ? numPages : pageNumber + 1);

  useEffect(() => {
    socket.connect();
    socket.removeListener("homepagemarketprice");
    socket.emit("homepagemarketprice");
    viewMoreCurrency(25);
  }, []);
  const navtradepage = async () => {
    navigate("trade/BTC_USDT");
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
            response.data[resp.data[index]["currencySymbol"]].INR;
        }
        setcurrencylistData(resp.data);
      });
    } else {
    }
  };
  return (
    <div className="home terms_pricaer">
      <Header />
      <div className="terms_contition">
        <div className="container">
          <div className="row justify-center">
            <div className="col-lg-10">
              <h1>About Space PEPE Exchange</h1>

              <div class="mx-auto u-para--readable">
                <span>Last updated: 12 feb 2023</span>
                <p class="u-para--readable mb-6">
                  At Space PEPE Exchange, our mission is to make buying,
                  selling, and holding cryptocurrencies simple, safe, and
                  accessible for everyone. We believe that cryptocurrencies have
                  the potential to revolutionize the financial industry, and
                  we're committed to playing a leading role in this
                  transformation.
                  {/*  */}
                </p>
                <p class="u-para--readable mb-6">
                  We understand that navigating the world of cryptocurrencies
                  can be overwhelming and confusing, especially for those who
                  are new to this space. That's why we've built a platform
                  that's intuitive, user-friendly, and designed to help you make
                  informed decisions.
                  {/*  */}
                </p>
                <p class="u-para--readable mb-6">
                  Our team is comprised of experienced professionals from the
                  financial, technology, and blockchain industries. We're
                  passionate about what we do, and we're dedicated to providing
                  our users with the best possible experience.
                  {/*  */}
                </p>
                <p class="u-para--readable mb-6">
                  Whether you're a seasoned trader or a complete beginner, we're
                  here to help you every step of the way. From creating an
                  account to placing your first trade, our customer support team
                  is available 24/7 to answer your questions and resolve any
                  issues you may encounter.
                  {/*  */}
                </p>
                <p class="u-para--readable mb-6">
                  So join us on this journey, and discover a world of endless
                  possibilities with Space PEPE Exchange.
                  {/*  */}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
