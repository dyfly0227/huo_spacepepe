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
        <div className="rn-activity-area rn-section-gapTop">
          <div className="container">
            <div className="row mb--30 pl-4">
              <h3 className="title">All following Acivity</h3>
            </div>
            <div className="row g-6 activity-direction">
              <div className="col-lg-8 mb_dec--15">
                <div className="single-activity-wrapper">
                  <div className="inner">
                    <div className="read-content">
                      <div className="thumbnail">
                        <a href="">
                          <span>
                            <img src="https://nuron-nextjs.vercel.app/_next/image?url=%2Fimages%2Factivity%2Factivity-01.jpg&w=1080&q=75" />
                          </span>
                        </a>
                      </div>
                      <div className="content">
                        <a href="">
                          <h6 className="title">Preatent</h6>
                        </a>
                        <p>
                          10 editions listed by Bits for <span>2.50 ETH</span>{" "}
                          each
                        </p>
                        <div class="time-maintane">
                          <div class="time data">
                            <i class="bi bi-clock"></i>
                            <span>2:00 PM on 19th June</span>
                          </div>
                          <div class="user-area data">
                            <i class="bi bi-person"></i>
                            <a href="/author">Mark Jordan</a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="icone-area">
                      <i class="bi bi-hand-thumbs-up"></i>
                    </div>
                  </div>
                </div>
                <div className="single-activity-wrapper">
                  <div className="inner">
                    <div className="read-content">
                      <div className="thumbnail">
                        <a href="">
                          <span>
                            <img src="https://nuron-nextjs.vercel.app/_next/image?url=%2Fimages%2Factivity%2Factivity-01.jpg&w=1080&q=75" />
                          </span>
                        </a>
                      </div>
                      <div className="content">
                        <a href="">
                          <h6 className="title">Preatent</h6>
                        </a>
                        <p>
                          10 editions listed by Bits for <span>2.50 ETH</span>{" "}
                          each
                        </p>
                        <div class="time-maintane">
                          <div class="time data">
                            <i class="bi bi-clock"></i>
                            <span>2:00 PM on 19th June</span>
                          </div>
                          <div class="user-area data">
                            <i class="bi bi-person"></i>
                            <a href="/author">Mark Jordan</a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="icone-area">
                      <i class="bi bi-hand-thumbs-up"></i>
                    </div>
                  </div>
                </div>
                <div className="single-activity-wrapper">
                  <div className="inner">
                    <div className="read-content">
                      <div className="thumbnail">
                        <a href="">
                          <span>
                            <img src="https://nuron-nextjs.vercel.app/_next/image?url=%2Fimages%2Factivity%2Factivity-01.jpg&w=1080&q=75" />
                          </span>
                        </a>
                      </div>
                      <div className="content">
                        <a href="">
                          <h6 className="title">Preatent</h6>
                        </a>
                        <p>
                          10 editions listed by Bits for <span>2.50 ETH</span>{" "}
                          each
                        </p>
                        <div class="time-maintane">
                          <div class="time data">
                            <i class="bi bi-clock"></i>
                            <span>2:00 PM on 19th June</span>
                          </div>
                          <div class="user-area data">
                            <i class="bi bi-person"></i>
                            <a href="/author">Mark Jordan</a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="icone-area">
                      <i class="bi bi-hand-thumbs-up"></i>
                    </div>
                  </div>
                </div>
                <div className="single-activity-wrapper">
                  <div className="inner">
                    <div className="read-content">
                      <div className="thumbnail">
                        <a href="">
                          <span>
                            <img src="https://nuron-nextjs.vercel.app/_next/image?url=%2Fimages%2Factivity%2Factivity-01.jpg&w=1080&q=75" />
                          </span>
                        </a>
                      </div>
                      <div className="content">
                        <a href="">
                          <h6 className="title">Preatent</h6>
                        </a>
                        <p>
                          10 editions listed by Bits for <span>2.50 ETH</span>{" "}
                          each
                        </p>
                        <div class="time-maintane">
                          <div class="time data">
                            <i class="bi bi-clock"></i>
                            <span>2:00 PM on 19th June</span>
                          </div>
                          <div class="user-area data">
                            <i class="bi bi-person"></i>
                            <a href="/author">Mark Jordan</a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="icone-area">
                      <i class="bi bi-hand-thumbs-up"></i>
                    </div>
                  </div>
                </div>
                <div className="single-activity-wrapper">
                  <div className="inner">
                    <div className="read-content">
                      <div className="thumbnail">
                        <a href="">
                          <span>
                            <img src="https://nuron-nextjs.vercel.app/_next/image?url=%2Fimages%2Factivity%2Factivity-01.jpg&w=1080&q=75" />
                          </span>
                        </a>
                      </div>
                      <div className="content">
                        <a href="">
                          <h6 className="title">Preatent</h6>
                        </a>
                        <p>
                          10 editions listed by Bits for <span>2.50 ETH</span>{" "}
                          each
                        </p>
                        <div class="time-maintane">
                          <div class="time data">
                            <i class="bi bi-clock"></i>
                            <span>2:00 PM on 19th June</span>
                          </div>
                          <div class="user-area data">
                            <i class="bi bi-person"></i>
                            <a href="/author">Mark Jordan</a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="icone-area">
                      <i class="bi bi-hand-thumbs-up"></i>
                    </div>
                  </div>
                </div>
                <div className="single-activity-wrapper">
                  <div className="inner">
                    <div className="read-content">
                      <div className="thumbnail">
                        <a href="">
                          <span>
                            <img src="https://nuron-nextjs.vercel.app/_next/image?url=%2Fimages%2Factivity%2Factivity-01.jpg&w=1080&q=75" />
                          </span>
                        </a>
                      </div>
                      <div className="content">
                        <a href="">
                          <h6 className="title">Preatent</h6>
                        </a>
                        <p>
                          10 editions listed by Bits for <span>2.50 ETH</span>{" "}
                          each
                        </p>
                        <div class="time-maintane">
                          <div class="time data">
                            <i class="bi bi-clock"></i>
                            <span>2:00 PM on 19th June</span>
                          </div>
                          <div class="user-area data">
                            <i class="bi bi-person"></i>
                            <a href="/author">Mark Jordan</a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="icone-area">
                      <i class="bi bi-hand-thumbs-up"></i>
                    </div>
                  </div>
                </div>
                <div className="single-activity-wrapper">
                  <div className="inner">
                    <div className="read-content">
                      <div className="thumbnail">
                        <a href="">
                          <span>
                            <img src="https://nuron-nextjs.vercel.app/_next/image?url=%2Fimages%2Factivity%2Factivity-01.jpg&w=1080&q=75" />
                          </span>
                        </a>
                      </div>
                      <div className="content">
                        <a href="">
                          <h6 className="title">Preatent</h6>
                        </a>
                        <p>
                          10 editions listed by Bits for <span>2.50 ETH</span>{" "}
                          each
                        </p>
                        <div class="time-maintane">
                          <div class="time data">
                            <i class="bi bi-clock"></i>
                            <span>2:00 PM on 19th June</span>
                          </div>
                          <div class="user-area data">
                            <i class="bi bi-person"></i>
                            <a href="/author">Mark Jordan</a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="icone-area">
                      <i class="bi bi-hand-thumbs-up"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="posiclasss">
                  <div className="filter-wrapper">
                    <div className="widge-wrapper">
                      <div className="widge-wrapper rbt-sticky-top-adjust">
                        <div className="inner">
                          <h3>Market filter</h3>
                          <div className="sing-filter">
                            <button type="button">purchases</button>
                            <button type="button">sales</button>
                            <button type="button">followers</button>
                            <button type="button">following</button>
                            <button type="button">reserved</button>
                            <button type="button">live auction</button>
                          </div>
                        </div>
                        <div className="inner">
                          <h3>Filter by users</h3>
                          <div className="sing-filter">
                            <button type="button">love</button>
                            <button type="button">saved</button>
                            <button type="button">support us</button>
                            <button type="button">report</button>
                            <button type="button">video</button>
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
      <Footer />
    </div>
  );
}

export default Home;
