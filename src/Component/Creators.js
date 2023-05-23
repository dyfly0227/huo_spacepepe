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
        <div className="rn-creator-title-area rn-section-gapTop">
          <div className="container">
            <div className="row align-items-center">
              <div class="col-lg-6 col-md-6 col-sm-6 col-12">
                <h2 class="title mb--0">Our Best Creators</h2>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-6 col-12 mt_mobile--15">
                <div className="shortby-default text-start text-sm-end d-flex justify-end align-middle">
                  <div class="relative">
                    <select
                      class="block nice-select appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none  focus:border-gray-500"
                      id="grid-state"
                    >
                      <option>New Mexico</option>
                      <option>Missouri</option>
                      <option>Texas</option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        class="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row  mt--30 creator-list-wrapper">
              <div className="creator-single col-lg-3 col-md-4 col-sm-6">
                <div className="top-seller-inner-one explore">
                  <div className="top-seller-wrapper">
                    <div className="thumbnail varified">
                      <a className="" href="">
                        <span>
                          <img src="https://nuron-nextjs.vercel.app/_next/image?url=%2Fimages%2Fclient%2Fclient-12.png&w=256&q=75" />
                        </span>
                      </a>
                    </div>
                    <div className="top-seller-content">
                      <a href="">
                        <h6 className="name">Mark Jordan</h6>
                        <span className="count-number">2,500,000</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="creator-single col-lg-3 col-md-4 col-sm-6">
                <div className="top-seller-inner-one explore">
                  <div className="top-seller-wrapper">
                    <div className="thumbnail">
                      <a className="" href="">
                        <span>
                          <img src="https://nuron-nextjs.vercel.app/_next/image?url=%2Fimages%2Fclient%2Fclient-12.png&w=256&q=75" />
                        </span>
                      </a>
                    </div>
                    <div className="top-seller-content">
                      <a href="">
                        <h6 className="name">Mark Jordan</h6>
                        <span className="count-number">2,500,000</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="creator-single col-lg-3 col-md-4 col-sm-6">
                <div className="top-seller-inner-one explore">
                  <div className="top-seller-wrapper">
                    <div className="thumbnail">
                      <a className="" href="">
                        <span>
                          <img src="https://nuron-nextjs.vercel.app/_next/image?url=%2Fimages%2Fclient%2Fclient-12.png&w=256&q=75" />
                        </span>
                      </a>
                    </div>
                    <div className="top-seller-content">
                      <a href="">
                        <h6 className="name">Mark Jordan</h6>
                        <span className="count-number">2,500,000</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="creator-single col-lg-3 col-md-4 col-sm-6">
                <div className="top-seller-inner-one explore">
                  <div className="top-seller-wrapper">
                    <div className="thumbnail">
                      <a className="" href="">
                        <span>
                          <img src="https://nuron-nextjs.vercel.app/_next/image?url=%2Fimages%2Fclient%2Fclient-12.png&w=256&q=75" />
                        </span>
                      </a>
                    </div>
                    <div className="top-seller-content">
                      <a href="">
                        <h6 className="name">Mark Jordan</h6>
                        <span className="count-number">2,500,000</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="creator-single col-lg-3 col-md-4 col-sm-6">
                <div className="top-seller-inner-one explore">
                  <div className="top-seller-wrapper">
                    <div className="thumbnail">
                      <a className="" href="">
                        <span>
                          <img src="https://nuron-nextjs.vercel.app/_next/image?url=%2Fimages%2Fclient%2Fclient-12.png&w=256&q=75" />
                        </span>
                      </a>
                    </div>
                    <div className="top-seller-content">
                      <a href="">
                        <h6 className="name">Mark Jordan</h6>
                        <span className="count-number">2,500,000</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="creator-single col-lg-3 col-md-4 col-sm-6">
                <div className="top-seller-inner-one explore">
                  <div className="top-seller-wrapper">
                    <div className="thumbnail">
                      <a className="" href="">
                        <span>
                          <img src="https://nuron-nextjs.vercel.app/_next/image?url=%2Fimages%2Fclient%2Fclient-12.png&w=256&q=75" />
                        </span>
                      </a>
                    </div>
                    <div className="top-seller-content">
                      <a href="">
                        <h6 className="name">Mark Jordan</h6>
                        <span className="count-number">2,500,000</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="creator-single col-lg-3 col-md-4 col-sm-6">
                <div className="top-seller-inner-one explore">
                  <div className="top-seller-wrapper">
                    <div className="thumbnail">
                      <a className="" href="">
                        <span>
                          <img src="https://nuron-nextjs.vercel.app/_next/image?url=%2Fimages%2Fclient%2Fclient-12.png&w=256&q=75" />
                        </span>
                      </a>
                    </div>
                    <div className="top-seller-content">
                      <a href="">
                        <h6 className="name">Mark Jordan</h6>
                        <span className="count-number">2,500,000</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="creator-single col-lg-3 col-md-4 col-sm-6">
                <div className="top-seller-inner-one explore">
                  <div className="top-seller-wrapper">
                    <div className="thumbnail">
                      <a className="" href="">
                        <span>
                          <img src="https://nuron-nextjs.vercel.app/_next/image?url=%2Fimages%2Fclient%2Fclient-12.png&w=256&q=75" />
                        </span>
                      </a>
                    </div>
                    <div className="top-seller-content">
                      <a href="">
                        <h6 className="name">Mark Jordan</h6>
                        <span className="count-number">2,500,000</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12 sal-animate">
                <nav
                  className="pagination-wrapper"
                  aria-label="Page navigation example"
                >
                  <ul class="pagination">
                    <li class="page-item">
                      <button type="button" className="disabled">
                        Previous
                      </button>
                    </li>
                    <li class="page-item">
                      <button type="button" className="active">
                        1
                      </button>
                    </li>
                    <li className="page-item">
                      <button type="button">2</button>
                    </li>
                    <li className="page-item next">
                      <button type="button">Next</button>
                    </li>
                  </ul>
                </nav>
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
