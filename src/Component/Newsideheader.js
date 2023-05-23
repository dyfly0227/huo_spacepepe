import React, { useEffect } from "react";
import useState from "react-usestateref";
import { Button } from "@material-ui/core";
import "react-dropdown/style.css";
import "rc-slider/assets/index.css";
import Headernew from "./Header";
import TradePage from "./Tradenew";
import { Link, useNavigate } from "react-router-dom";
import { socket } from "./context/socket";
import apiService from "../core/service/detail";
import { postMethod, getMethod } from "../core/service/common.api";
import { removeAuthToken } from "../core/lib/localStorage";
import { removeAuthorization } from "../core/service/axios";

function Newsideheader() {
  const [loginCheck, setloginCheck] = useState(false);
  const [isOpen, setIsOpen, isOpenref] = useState(false);
  const [themeMode, setthemeMode] = useState("");
  const [notifications, setNotification] = React.useState("");
  let navigate = useNavigate();

  useEffect(() => {
    document.body.classList.toggle("light", isOpenref.current);
    fetchTheme();
    let userToken = localStorage.getItem("user_token");
    if (userToken) {
      setloginCheck(true);
      getNotifications();
    } else {
      setloginCheck(false);
    }

    let token_socket = localStorage.getItem("socket_token");
    if (token_socket) {
      socket.connect();
      let socketToken = token_socket.split("_")[0];
      socket.on("socketResponse" + socketToken, function (res) {
        console.log("notify response====", res);
        if (res.Reason == "notify") {
          getNotifications();
        }
      });
    }
  }, [0]);
  const fetchTheme = async () => {
    var theme = await localStorage.getItem("theme");
    setthemeMode(theme);
    if (theme !== undefined) {
      if (theme === "light") {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    } else {
      localStorage.setItem("theme", "dark");
      setIsOpen(false);
    }
  };
  const changeTheme = (value) => {
    if (value) {
      localStorage.setItem("theme", value);
      var settheme = value === "light" ? true : false;
      setthemeMode(settheme);
      setIsOpen(settheme);
      document.body.classList.toggle("light", isOpenref.current);
    }
  };

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

  const read_notification = async (params) => {
    // var onj = {
    //   _id: params._id
    // };
    // var data = {
    //   apiUrl: apiService.readNotify,
    //   payload: onj,
    // };
    // var resp = await postMethod(data);
    // console.log(resp.Message, "-=-=-resp=-=-");
    // if (resp.status) {
    navigate(params.link);
    // }
    // else
    // {

    // }
  };

  const logout = async () => {
    await removeAuthorization();
    await removeAuthToken();
    localStorage.clear();
    navigate("/");
    window.location.reload(true);
  };

  const connect = () => {
    let account;
    window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((accounts) => {
        account = accounts[0];
        let showaddress =
          account.substring(0, 5) + "..." + account.substring(38);
        document.getElementById("connectwallet1").innerText = showaddress;
        sessionStorage.setItem("walletAddress", showaddress);
      });
  };
  useEffect(() => {
    const address = sessionStorage.getItem("walletAddress");
    if (address) {
      document.getElementById("connectwallet1").innerText = address;
    }
  }, []);

  return (
    <>
      <header className="sideber_header">
        <a
          className=" header-right-btn btn btn-primary-alta connectBtn colo-fff clooee"
          onClick={connect}
          id="connectwallet1"
        >
          Connect Wallet
        </a>
      </header>
      <div className="header-non fixed_header bg-none">
        <Headernew />
      </div>
    </>
  );
}

export default Newsideheader;
