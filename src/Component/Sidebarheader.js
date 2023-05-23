//import useState hook to create menu collapse state
import React, { useState, useEffect } from "react";

//import react pro sidebar components
import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from "react-pro-sidebar";

//import icons from react icons
import { FaList, FaRegHeart } from "react-icons/fa";
import {
  FiHome,
  FiLogOut,
  FiArrowLeftCircle,
  FiArrowRightCircle,
} from "react-icons/fi";
import { RiPencilLine } from "react-icons/ri";
import { BiCog } from "react-icons/bi";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { removeAuthorization } from "../core/service/axios";
import {
  removeAuthToken,
  getAuthToken,
  getSocketToken,
} from "../core/lib/localStorage";
//import sidebar css from react-pro-sidebar module and our custom css
import "react-pro-sidebar/dist/css/styles.css";

const Header = () => {
  const navigate = useNavigate();
  //create initial menuCollapse state using useState hook
  const [menuCollapse, setMenuCollapse] = useState(false);
  const [loginCheck, setloginCheck] = useState(false);

  //create a custom function that will change menucollapse state from false to true and true to false
  const menuIconClick = () => {
    //condition checking to change state from true to false and vice versa
    menuCollapse ? setMenuCollapse(false) : setMenuCollapse(true);
  };
  useEffect(() => {
    let userToken = localStorage.getItem("user_token");

    if (userToken) {
      setloginCheck(true);
    } else {
      setloginCheck(false);
    }
  });
  const logout = async () => {
    await removeAuthorization();
    await removeAuthToken();
    localStorage.clear();
    navigate("/");
    window.location.reload(true);
  };
  return (
    <>
      <div id="header">
        {/* collapsed props to change menu size using menucollapse state */}
        <div className="closemenu" onClick={menuIconClick}>
          {/* changing menu collapse icon on click */}
          {menuCollapse ? (
            <i class="bi bi-caret-right-fill"></i>
          ) : (
            <i class="bi bi-caret-left-fill"></i>
          )}
        </div>
        <ProSidebar collapsed={menuCollapse}>
          <SidebarHeader>
            <div className="logotext">
              {/* small and big change using menucollapse state */}

              <p>
                {menuCollapse ? (
                  <a className="navbar-brand w-100" href="/">
                    <img
                      src={require("../img/bj/logo.png")}
                      className="logo  small"
                    />
                  </a>
                ) : (
                  <a className="navbar-brand w-100 navbar-new" href="/">
                    <img
                      src={require("../img/bj/logo.png")}
                      className="logo lighttheme big"
                    />
                    <img
                      src={require("../img/bj/logo.png")}
                      className="logo darktheme big"
                    />
                    <div className="logo-text text-small">
                      Space PEPE Exchange
                    </div>
                  </a>
                )}
              </p>
            </div>
          </SidebarHeader>
          <SidebarContent>
            {loginCheck && loginCheck == true ? (
              <NavLink to="/dashboard">
                <div className="header_icon_meniu">
                  <i class="bi bi-house-door"></i>
                  <span className="text_inn"> Dashboard</span>
                </div>
              </NavLink>
            ) : (
              ""
            )}
            <NavLink to="/trade/ETH_USDT">
              <div className="header_icon_meniu">
                <i class="bi bi-graph-up"></i>
                <span className="text_inn"> Trade</span>
              </div>
            </NavLink>
            <NavLink to="/margin/ETH_USDT">
              <div className="header_icon_meniu">
                <i class="bi bi-graph-up"></i>
                <span className="text_inn"> Margin</span>
              </div>
            </NavLink>
            <NavLink to="/launchpadNew">
              <div className="header_icon_meniu">
                <i class="bi bi-download"></i>
                <span className="text_inn"> Launchpad</span>
              </div>
            </NavLink>
            <NavLink to="/p2phome">
              <div className="header_icon_meniu">
                <i class="bi bi-hdd-rack-fill"></i>
                <span className="text_inn"> Cash</span>
              </div>
            </NavLink>
            {loginCheck && loginCheck == true ? (
              <NavLink to="/kyc">
                <div className="header_icon_meniu">
                  <i class="bi bi-person-check"></i>
                  <span className="text_inn"> KYC</span>
                </div>
              </NavLink>
            ) : (
              ""
            )}
            <NavLink to="/staking">
              <div className="header_icon_meniu">
                <i class="bi bi-unlock"></i>
                <span className="text_inn"> Staking</span>
              </div>
            </NavLink>
            <NavLink to="/loan">
              <div className="header_icon_meniu">
                <i class="fa fa-credit-card" aria-hidden="true"></i>
                <span className="text_inn"> Loan</span>
              </div>
            </NavLink>
            {/* <NavLink to="/sidebarSwap">
              <div className="header_icon_meniu">
                <i class="bi bi-arrow-left-right"></i>
                <span className="text_inn"> Swap</span>
              </div>
            </NavLink> */}
            {/* {loginCheck && loginCheck == true ? (
              <NavLink to="/p2ppost">
                <div className="header_icon_meniu">
                  <i class="bi bi-badge-ad-fill"></i>
                  <span className="text_inn"> Post Ad</span>
                </div>
              </NavLink>
            ) : (
              ""
            )} */}
            {loginCheck && loginCheck == true ? (
              <NavLink to="/profile">
                <div className="header_icon_meniu">
                  <i class="bi bi-person"></i>
                  <span className="text_inn">Profile</span>
                </div>
              </NavLink>
            ) : (
              ""
            )}
            {loginCheck && loginCheck == true ? (
              <NavLink to="/transaction">
                <div className="header_icon_meniu">
                  <i class="bi bi-arrow-left-right"></i>
                  <span className="text_inn">Transaction</span>
                </div>
              </NavLink>
            ) : (
              ""
            )}
            {/* {loginCheck && loginCheck == true ? (
              <NavLink to="/referral">
                <div className="header_icon_meniu">
                  <i class="bi bi-arrow-left-right"></i>
                  <span className="text_inn">Referral</span>
                </div>
              </NavLink>
            ) : (
              ""
            )} */}
            {/* {loginCheck && loginCheck == true ? (
              <NavLink to="/transfer">
                <div className="header_icon_meniu">
                  <i class="bi bi-arrow-left-right"></i>
                  <span className="text_inn">Transfer</span>
                </div>
              </NavLink>
            ) : (
              ""
            )} */}
            {/* <Menu iconShape="square">
              <MenuItem active={true} icon={<FiHome />}></MenuItem>
              <MenuItem icon={<FaList />}>Category</MenuItem>
              <MenuItem icon={<FaRegHeart />}>Favourite</MenuItem>
              <MenuItem icon={<RiPencilLine />}>Author</MenuItem>
              <MenuItem icon={<BiCog />}>Settings</MenuItem>
            </Menu> */}
          </SidebarContent>
          <SidebarFooter>
            {loginCheck && loginCheck == true ? (
              <Menu iconShape="square" onClick={logout}>
                <MenuItem icon={<FiLogOut />}>Logout</MenuItem>
              </Menu>
            ) : (
              ""
            )}
          </SidebarFooter>
        </ProSidebar>
      </div>
    </>
  );
};

export default Header;
