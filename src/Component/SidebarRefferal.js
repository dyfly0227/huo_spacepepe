import React, {useState, useEffect} from "react";
import {Button} from "@material-ui/core";
import {Link} from "react-router-dom";
import Count from "./Countdown";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import "rc-slider/assets/index.css";
import Sideheader from "./Sidebarheader";

import Pagination from "react-js-pagination";
import Newsideheader from "./Newsideheader";
import {toast} from "react-toastify";
import apiService from "../core/service/detail";
import {postMethod} from "../core/service/common.api";
import {getMethod} from "../core/service/common.api";
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  InstapaperIcon,
  InstapaperShareButton,
} from "react-share";
import moment from "moment";

function Home() {
  const [refferance, setrefferance] = useState("");
  const [totalRef, settotalRef] = useState([]);
  const [Rewardamount, setRewardamount] = useState("");
  const [refferaldata, setrefferaldata] = useState([]);
  const [profileData, setprofileData] = useState("");
  const [sessionHistory, setsessionHistory] = useState([]);
  const [totalPage, setTotalpages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getReferralDetails();
    getReward();
    referralHistory();
  }, [0]);

  const recordPerPage = 5;
  const pageRange = 5;

  const getReferralDetails = async () => {
    try {
      var data = {
        apiUrl: apiService.getUserDetails,
      };
      var resp = await getMethod(data);
      if (resp.status) {
        var currURL = window.location.href.split("referral")[0];
        var link = currURL + "register?/invite/" + resp.data.referralCode;
        setprofileData(resp.data);
        setrefferance(link);
      } else {
        setprofileData("");
      }
    } catch (error) {}
  };

  const copy = (content) => {
    if (window.isSecureContext && navigator.clipboard) {
      navigator.clipboard.writeText(content);
      toast.success("Referral Link copied successfully");
    } else {
      toast.success("Link not copied, please try after sometimes!");
    }
  };

  const getReward = async () => {
    var get = {
      apiUrl: apiService.getReward,
    };
    var response = await getMethod(get);
    setrefferaldata(response.data);
    // setRewardamount(responce.data);
  };

  const referralHistory = async (page) => {
    try {
      var payload = {
        perpage: 5,
        page: page,
      };
      var data = {
        apiUrl: apiService.referralHistory,
        payload: payload,
      };
      var resp = await postMethod(data);
      if (resp.status) {
        setsessionHistory(resp.data.data);
        setTotalpages(resp.data.total);
      }
    } catch (error) {}
  };

  const handlePageChange = (pageNumber) => {
    referralHistory(pageNumber);
    setCurrentPage(pageNumber);
  };
  const title = "Welcome to Taikonz";

  return (
    <div>
      <div className="container-scroller">
        <div className="container-fluid page-body-wrapper">
          <Sideheader />
          <div className="main-panel">
            <div>
              <Newsideheader />
            </div>
            <div className="content-wrapper ">
              <main className="main-content tradepage-bg login_body_ bg-cover ">
                <div className="container pt-5">
                  <div className="row justify-center">
                    <div className="col-lg-12">
                      <div className="refral_contene ">
                        <h1>
                          Invite Friends.
                          <br /> Earn Crypto Together
                        </h1>
                        <p>
                          Refer & earn trading fee paid by your friends as
                          reward. Be your own Boss!.
                        </p>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="row">
                        <div className="col-lg-4">
                          <div className="referal_inner_card referal_card">
                            <h3>Total Referrals</h3>
                            <p>
                              {" "}
                              {refferaldata && refferaldata.totalRefCount}{" "}
                            </p>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div className="referal_inner_card referal_card">
                            <h3>Total Rewards</h3>
                            <p>
                              {" "}
                              {refferaldata && refferaldata.totalRefCount}{" "}
                            </p>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div className="referal_inner_card referal_card">
                            <h3>Your reward rate</h3>
                            <p>
                              {refferaldata && refferaldata.totalRefCount} {""}{" "}
                              %{" "}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="row justify-center">
                        <div className="col-lg-5">
                          <div className="referal_card ">
                            <div class="tilet_refer">
                              <span>Referral Link</span>
                            </div>
                            <div className="refer_linlk_ss">
                              <div className="input_card_refer">
                                <input
                                  type="text"
                                  placeholder="ReferralCode"
                                  value={refferance}
                                />
                                <i
                                  className="fa fa-clone"
                                  onClick={() => copy(refferance)}
                                  style={{cursor: "pointer"}}
                                />
                              </div>
                            </div>
                            {/* <div className="socila_sher_link">
                              <ul>
                                <li>
                                  <a href="">
                                    <i class="bi bi-twitter"></i>
                                  </a>
                                </li>
                                <li>
                                  <a href="">
                                    <i class="bi bi-telegram"></i>
                                  </a>
                                </li>
                                <li>
                                  <a href="">
                                    <i class="bi bi-whatsapp"></i>
                                  </a>
                                </li>
                                <li>
                                  <a href="">
                                    <i class="bi bi-facebook"></i>
                                  </a>
                                </li>
                              </ul>
                            </div> */}

                            <div className="socila_sher_link mt-3">
                              <ul>
                                <div>
                                  <li>
                                    <FacebookShareButton
                                      url={refferance}
                                      title={title}
                                    >
                                      <FacebookIcon size={32} round />
                                    </FacebookShareButton>
                                  </li>
                                </div>
                                <div>
                                  <li>
                                    <TwitterShareButton
                                      url={refferance}
                                      title={title}
                                    >
                                      <TwitterIcon size={32} round />
                                    </TwitterShareButton>
                                  </li>
                                </div>
                                <div>
                                  <li>
                                    <InstapaperShareButton
                                      url={refferance}
                                      title={title}
                                    >
                                      <InstapaperIcon size={32} round />
                                    </InstapaperShareButton>
                                  </li>
                                </div>
                                <div>
                                  <li>
                                    <LinkedinShareButton
                                      url={refferance}
                                      title={title}
                                    >
                                      <LinkedinIcon size={32} round />
                                    </LinkedinShareButton>
                                  </li>
                                </div>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="profile__wrapper">
                    <div className="sessions">
                      <div className="sessions__section">
                        <div className="sessions__title">Referral History</div>
                        <div className="sessions__table">
                          <div className="sessions__row">
                            <div className="sessions__col">S.No</div>
                            <div className="sessions__col">Email</div>
                            <div className="sessions__col">User Name</div>
                            <div className="sessions__col">Date / time</div>
                            {/* <div className="sessions__col">To Currency</div>
                            <div className="sessions__col">totalAmount</div>
                            <div className="sessions__col">fee</div> */}
                          </div>

                          {sessionHistory.length > 0 ? (
                            sessionHistory &&
                            sessionHistory.map((item, i) => {
                              return (
                                <div className="sessions__row">
                                  <div className="sessions__note">
                                    {item.id}
                                  </div>
                                  <div className="sessions__col">
                                    <div className="sessions__content">
                                      {item.email}
                                    </div>
                                  </div>
                                  <div className="sessions__col">
                                    <div className="sessions__content">
                                      {item.username}
                                    </div>
                                  </div>
                                  <div className="sessions__col">
                                    <div className="sessions__content">
                                      {moment(item.createdDate).format("lll")}
                                    </div>
                                  </div>
                                  {/* <div className="sessions__col">
                                    <div className="sessions__content">
                                      {item.toCurrency}
                                    </div>
                                  </div>
                                  <div className="sessions__col">
                                    <div className="sessions__content">
                                      {parseFloat(item.totalAmount).toFixed(8)}
                                    </div>
                                  </div>
                                  <div className="sessions__col">
                                    <div className="sessions__content">
                                      {parseFloat(item.fee).toFixed(8)}
                                    </div>
                                  </div> */}
                                </div>
                              );
                            })
                          ) : (
                            <td colSpan="5">
                              <span className="w-100 text-center d-block nodatat">
                                No Referral History Found!
                              </span>
                            </td>
                            // <p colSpan="5">No data found</p>
                          )}
                        </div>
                        <Pagination
                          itemClass="page-item" // add it for bootstrap 4
                          linkClass="page-link" // add it for bootstrap 4
                          activePage={currentPage}
                          itemsCountPerPage={recordPerPage}
                          totalItemsCount={totalPage}
                          pageRangeDisplayed={pageRange}
                          onChange={handlePageChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
