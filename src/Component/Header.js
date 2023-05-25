import React, { useEffect, useContextt } from "react";
import useState from "react-usestateref";
import { Button } from "@material-ui/core";
import {
  removeAuthToken,
  getAuthToken,
  getSocketToken,
} from "../core/lib/localStorage";
import { removeAuthorization } from "../core/service/axios";
import { Link, useNavigate } from "react-router-dom";
import { socket } from "./context/socket";
import apiService from "../core/service/detail";
import { getMethod } from "../core/service/common.api";
import Moment from "moment";
import { toast } from "react-toastify";

function Header() {
  const [isOpen, setIsOpen, isOpenref] = useState(false);
  const [loginCheck, setloginCheck] = useState(false);
  const [notifications, setNotification] = React.useState("");
  // const socket = useContext(SocketContext);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.toggle("light", isOpenref.current);
    fetchTheme();

    let token_socket = localStorage.getItem("socket_token");
    if (token_socket) {
      socket.connect();
      let socketToken = token_socket.split("_")[0];
      socket.on("socketResponse" + socketToken, function (res) {
        console.log("notify response====", res);
        if (res.Reason == "notify") {
          getNotifications();
        }

        if (res.Message == "account_deactivate") {
          toast.error("Your account deactivated by admin");
          logout();
        }
      });
    }

    let userToken = localStorage.getItem("user_token");

    if (userToken) {
      setloginCheck(true);
      getNotifications();
    } else {
      setloginCheck(false);
    }
  }, [0]);
  const changeTheme = (value) => {
    localStorage.setItem("theme", value);
    var settheme = value == "light" ? true : false;
    setIsOpen(settheme);
    document.body.classList.toggle("light", isOpenref.current);
  };

  const fetchTheme = () => {
    var theme = localStorage.getItem("theme");
    if (theme != undefined) {
      if (theme == "light") {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    } else {
      localStorage.setItem("theme", "dark");
      setIsOpen(false);
    }
  };
  const logout = async () => {
    await removeAuthorization();
    await removeAuthToken();
    localStorage.clear();
    navigate("/");
    window.location.reload(true);
  };

  const [navbar, setNavbar] = useState(false);

  const changeHeader = () => {
    if (window.scrollY >= 80) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };
  window.addEventListener("scroll", changeHeader);

  const getNotifications = async () => {
    try {
      var data = {
        apiUrl: apiService.notifications,
      };
      var resp = await getMethod(data);
      if (resp.status) {
        setNotification(resp.Message);
      } else {
      }
    } catch (error) {}
  };
  const connect = () => {
    let account;
    window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((accounts) => {
        account = accounts[0];
        let showaddress =
          account.substring(0, 5) + "..." + account.substring(38);
        document.getElementById("connectwallet").innerText = showaddress;
        sessionStorage.setItem("walletAddress", showaddress);
      });
  };
  useEffect(() => {
    const address = sessionStorage.getItem("walletAddress");
    if (address) {
      document.getElementById("connectwallet").innerText = address;
    }
  }, []);
  return (
    <div>
      <header
        className={
          navbar
            ? "navbar-custom sticky sticky-dark  navbar navbar-expand-lg fixed-top fixed_header"
            : "navbar-custom sticky sticky-dark  navbar navbar-expand-lg fixed-top "
        }
      >
        <nav className="container navbar navbar-expand-lg ">
          <a className="navbar-brand" href="/">
            <img
              src={require("../img/bj/logo.png")}
              className="logo darktheme"
            />
            <img
              src={require("../img/bj/logo.png")}
              className="logo lighttheme"
            />
            <div className="logo-text">SpacePepe Exchange </div>
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className="bi bi-list navbar-toggler-icon"></i>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            {/* <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  About
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Create
                </a>
              </li>

              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Dropdown
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <a className="dropdown-item" href="#">
                    Action
                  </a>
                  <a className="dropdown-item" href="#">
                    Another action
                  </a>
                  <div className="dropdown-divider"></div>
                  <a className="dropdown-item" href="#">
                    Something else here
                  </a>
                </div>
              </li>
            </ul> */}
            {/* <form className="form-inline my-2 my-lg-0">
              <div className="search">
                <input
                  className="form-control mr-sm-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                />
                <span>
                  <i className="bi bi-search"></i>
                </span>
              </div>
            </form> */}
            <div className="ml-auto padingrespos ">
              <Link to="/trade/ETH_USDT" className="mr-3">
                <a className="trade111">Spot Trade</a>
              </Link>

              <Link to="/margin/ETH_USDT" className="mr-3">
                <a className="trade111">Perpetual Trade</a>
              </Link>

              {loginCheck == false ? (
                <Link to="/staking" className="mr-3">
                  <a className="trade111">Staking</a>
                </Link>
              ) : (
                ""
              )}
              {/* <Link to="/launchpadNew" className="mr-3">
                <a className="trade111">Launchpad</a>
              </Link>

              <Link to="/p2phome" className="mr-3">
                <a className="trade111">Cash</a>
              </Link> */}
              <a
                className="btn btn-primary-alta connectBtn colo-fff clooee"
                onClick={connect}
                id="connectwallet"
              >
                Connect Wallet
              </a>
              {/* {loginCheck == false ? (
                <Link
                  to="/login"
                  className="btn btn-primary-alta connectBtn colo-fff clooee"
                >
                  Login
                </Link>
              ) : (
                ""
              )}

              {loginCheck == false ? (
                <Link
                  to="/register"
                  className="btn btn-primary-alta connectBtn ml-3 colo-fff clooee"
                >
                  Register
                </Link>
              ) : (
                ""
              )} */}

              {loginCheck && loginCheck == true ? (
                <Link to="/kyc" className="mr-3">
                  <a className="trade111">KYC</a>
                </Link>
              ) : (
                ""
              )}
              {loginCheck && loginCheck == true ? (
                <Link to="/staking" className="mr-3">
                  <a className="trade111">Staking</a>
                </Link>
              ) : (
                ""
              )}
              {loginCheck && loginCheck == true ? (
                <Link to="/loan" className="mr-3">
                  <a className="trade111">Loan</a>
                </Link>
              ) : (
                ""
              )}
              {loginCheck && loginCheck == true ? (
                <Link to="/transaction" className="mr-3">
                  <a className="trade111">Transaction</a>
                </Link>
              ) : (
                ""
              )}

              {/* {loginCheck && loginCheck == true ? (
                <Link to="/p2ppost" className="mr-3">
                  <a className="trade111">Post Ad</a>
                </Link>
              ) : (
                ""
              )} */}

              {/* {loginCheck && loginCheck == true ? (
                <Link to="/dashboard" className="mr-3">
                  <a className="trade111">Portfolio</a>
                </Link>
              ) : (
                ""
              )} */}
              {/* {loginCheck && loginCheck == true ? (
                <Link to="/transaction" className="mr-3">
                  <a className="trade111">Transaction</a>
                </Link>
              ) : (
                ""
              )} */}

              {loginCheck && loginCheck == true ? (
                <Link to="/profile" className="mr-3">
                  <a className="trade111">Profile</a>
                </Link>
              ) : (
                ""
              )}

              {loginCheck && loginCheck == true ? (
                <Button
                  onClick={logout}
                  className="btn btn-primary-alta connectBtn colo-fff"
                >
                  Logout
                </Button>
              ) : (
                ""
              )}

              {/* <button className="btn btn-primary-alta notification">
                <i className="bi bi-bell"></i>
              </button> */}

              {/* {isOpenref.current == true ? (
                <button
                  onClick={() => changeTheme("dark")}
                  className="btn btn-primary-alta notification"
                >
                  <i className="bi bi-moon"></i>
                </button>
              ) : (
                <button
                  onClick={() => changeTheme("light")}
                  className="btn btn-primary-alta notification"
                >
                  <i className="bi bi-brightness-high"></i>
                </button>
              )} */}
            </div>
            {/* {loginCheck && loginCheck == true ? (
              <div className="notification_section  padingrespos ">
                <button
                  className="btn btn-primary-alta notification"
                  data-toggle="collapse"
                  data-target="#notification"
                >
                  <i class="bi bi-bell-fill"></i>
                </button>
                <div id="notification" class="collapse">
                  <div className="content_notification">
                    <h3>
                      Notification <Link to="/profile">View all</Link>
                    </h3>
                    <div className="overflow_seee">
                      {notifications && notifications.length > 0
                        ? notifications.map((item, i) => {
                            return (
                              <>
                                <a href={item.link} className="msg-noti">
                                  <small>
                                    {Moment(item.createdAt).fromNow()}
                                  </small>
                                  <p>{item.message}</p>
                                </a>
                              </>
                            );
                          })
                        : ""}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )} */}
          </div>
        </nav>
      </header>
    </div>
  );
}

export default Header;
