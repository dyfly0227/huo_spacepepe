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
                <h5 className="pageTitle">Create New File</h5>
              </div>
              <div className="col-lg-6 col-md-6 col-12">
                <ul className="breadcrumb-list">
                  <li className="item">
                    <a href="/">Home</a>
                  </li>
                  <li className="separator">
                    <i class="bi bi-chevron-right"></i>
                  </li>
                  <li className="item current">Create New File</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row justify-content-center rn-section-gapTop">
            <div className="col-lg-10">
              <div className="row">
                <div className="col-lg-3">
                  <div className="upload-area">
                    <div className="upload-formate mb--30">
                      <h6 className="Upload file">Upload file</h6>
                      <p className="formate">
                        Drag or choose your file to upload
                      </p>
                    </div>
                    <div className="brows-file-wrapper">
                      <input
                        name="file"
                        id="file"
                        type="file"
                        class="inputfile"
                        multiple=""
                      />
                      <label for="file" title="No File Choosen">
                        <i class="bi bi-upload"></i>
                        <span class="text-center">Choose a File</span>
                        <p class="text-center mt--10">
                          PNG, GIF, WEBP, MP4 or MP3. <br /> Max 1Gb.
                        </p>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col-lg-9">
                  <div className="form-wrapper-one">
                    <div className="row">
                      <div className="col-md-12">
                        <div class="mb-4">
                          <label
                            class="block text-gray-700 text-sm font-bold mb-2"
                            for="username"
                          >
                            Username
                          </label>
                          <input
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="username"
                            type="text"
                            placeholder="Username"
                          />
                        </div>
                        <div class="mb-4">
                          <label
                            class="block text-gray-700 text-sm font-bold mb-2"
                            for="username"
                          >
                            Discription
                          </label>
                          <textarea
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            rows="5"
                          ></textarea>
                        </div>
                        <div class="flex flex-wrap -mx-3  mb-4">
                          <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                            <label
                              class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                              for="grid-city"
                            >
                              Item Price in $
                            </label>
                            <input
                              class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none  focus:border-gray-500"
                              id="grid-city"
                              type="text"
                              placeholder="Albuquerque"
                            />
                          </div>
                          <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                            <label
                              class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                              for="grid-zip"
                            >
                              Size
                            </label>
                            <input
                              class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none  focus:border-gray-500"
                              id="grid-zip"
                              type="text"
                              placeholder="90210"
                            />
                          </div>
                          <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                            <label
                              class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                              for="grid-zip"
                            >
                              Properties
                            </label>
                            <input
                              class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none  focus:border-gray-500"
                              id="grid-zip"
                              type="text"
                              placeholder="90210"
                            />
                          </div>
                        </div>
                        <div class="mb-4">
                          <label
                            class="block text-gray-700 text-sm font-bold mb-2"
                            for="username"
                          >
                            Royality
                          </label>
                          <input
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="username"
                            type="text"
                            placeholder="e. g. `20%`"
                          />
                        </div>
                        <div className="flex flex-wrap -mx-3  mb-4">
                          <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                            <div class="custom-control custom-checkbox">
                              <input
                                type="checkbox"
                                class="custom-control-input"
                                id="customCheck"
                                name="example1"
                              />
                              <label
                                class="custom-control-label"
                                for="customCheck"
                              >
                                Put on Sale
                              </label>
                            </div>
                          </div>
                          <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                            <div class="custom-control custom-checkbox">
                              <input
                                type="checkbox"
                                class="custom-control-input"
                                id="customCheck"
                                name="example1"
                              />
                              <label
                                class="custom-control-label"
                                for="customCheck"
                              >
                                Instant Sale Price
                              </label>
                            </div>
                          </div>
                          <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                            <div class="custom-control custom-checkbox">
                              <input
                                type="checkbox"
                                class="custom-control-input"
                                id="customCheck"
                                name="example1"
                              />
                              <label
                                class="custom-control-label"
                                for="customCheck"
                              >
                                Unlock Purchased
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div class="col-md-12 col-xl-4">
                            <div class="input-box">
                              <button
                                class="btn btn-large btn-primary-alta w-100 d-block"
                                type="submit"
                                data-btn="preview"
                              >
                                <span>Preview</span>
                              </button>
                            </div>
                          </div>
                          <div class="col-md-12 col-xl-8 mt_lg--15 mt_md--15 mt_sm--15">
                            <div class="input-box">
                              <button
                                class="btn btn-large btn-primary w-100 d-block"
                                type="submit"
                                data-btn="preview"
                              >
                                <span>Submit Item</span>
                              </button>
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
      <Footer />
    </div>
  );
}

export default Home;
