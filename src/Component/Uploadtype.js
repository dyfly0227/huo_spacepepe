import React from "react";
import {Button} from "@material-ui/core";
import {Link} from "react-router-dom";
import Count from "./Countdown";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import Slider, {Range} from "rc-slider";
import "rc-slider/assets/index.css";
import Header from "./Header";
import Footer from "./Footer";
function Home() {
  const options = ["one", "two", "three"];

  return (
    <div>
      <Header />
      <main className="main-content">
        <div className="rn-breadcrumb-inner ptb--30">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 col-md-6 col-12">
                <h5 className="pageTitle text-center text-md-start">
                  Upload Variants
                </h5>
              </div>
              <div className="col-lg-6 col-md-6 col-12">
                <ul className="breadcrumb-list">
                  <li className="item">
                    <a href="/">Home</a>
                  </li>
                  <li className="separator">
                    <i class="bi bi-chevron-right"></i>
                  </li>
                  <li className="item current">Upload Variants</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="rn-upload-variant-area varient rn-section-gap">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 upload-variant-title-wrapper">
                <h3 className="title text-center">Upload Variants</h3>
                <p className="text-center">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Ducimus inventore, officiis. Alias aspernatur laboriosam
                  ratione! Doloremque ipsa nesciunt sed!
                </p>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-lg-3 col-md-6 col-12">
                <div className="upload-variant-wrapper">
                  <div className="variant-preview">
                    <span>
                      <img src="https://nuron-nextjs.vercel.app/_next/image?url=%2Fimages%2Fupload-variants%2Fsingle.jpg&w=3840&q=75" />
                    </span>
                  </div>
                  <a
                    href=""
                    className="mt--20 btn btn-medium btn-primary w-100 d-block"
                  >
                    Create Single
                  </a>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-12">
                <div className="upload-variant-wrapper">
                  <div className="variant-preview">
                    <span>
                      <img src="https://nuron-nextjs.vercel.app/_next/image?url=%2Fimages%2Fupload-variants%2Fmultiple.jpg&w=3840&q=75" />
                    </span>
                  </div>
                  <a
                    href=""
                    className="mt--20 btn btn-medium btn-primary w-100 d-block"
                  >
                    Create Multiple
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Home;
