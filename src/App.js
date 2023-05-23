import "./App.css";
import React, { useEffect, useState } from "react";

import { Routes, Route } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";
import Uploadtype from "./Component/Uploadtype";
import Create from "./Component/Create";
import Login from "./Component/Login";
import Register from "./Component/Register";
import Otp from "./Component/Otp";
import Myfund from "./Component/Myfund";
import Profile from "./Component/Profile";
import VerifyTfa from "./Component/verifyTfa";
import Activity from "./Component/Activity";
import Creators from "./Component/Creators";
import Staking from "./Component/Staking";
import Launchpad from "./Component/Launchpad";
import Launchpadnow from "./Component/Launchpadnow";
import Launchpadbuy from "./Component/Launchpadbuy";
import Launchpadapplay from "./Component/Launchpadapplay";
import Support from "./Component/Support";
import Bankdetails from "./Component/sidebarbankdetails";
import P2Ppost from "./Component/P2Ppost";
import P2home from "./Component/P2home";
import P2Pchat from "./Component/P2Pchat";
import HomeNew from "./Component/HomeNew";
import Sidebarcontent from "./Component/Sidebarcontent";
import TransactionNew from "./Component/Sidebartransaction";
import TradeNew from "./Component/SidebarTrade";
import SidebarTradeTwo from "./Component/SidebarTradeTwo";
import SidebarLaunchpad from "./Component/SidebarLaunchpad";
import SidebarLoanPage from "./Component/SidebarLoanPage";

import SidebarLaunchpadapplay from "./Component/SidebarLaunchpadApplay";
import SidebarLaunchpadbuy from "./Component/SidebarLaunchpadbuy";
import SidebarLaunchpadnow from "./Component/SidebarLaunchpadnow";
import SidebarP2ppost from "./Component/SidebarP2ppost";
import SidebarP2ppostnew from "./Component/SidebarP2ppostnew";
import SidebarP2pChat from "./Component/SidebarP2pChat";
import Stakingnew from "./Component/Sidebarstaking";
import Sidebarprofile from "./Component/Sidebarprofile";
import SidebarKyc from "./Component/SidebarKyc";
import SidebarSupport from "./Component/SidebarSupport";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Chart from "./Component/Chart";
import ForgotPassword from "./Component/ForgotPassword";
import Transfer from "./Component/Transfer";
import Sidebarp2pview from "./Component/Sidebarp2pview";
import IdleTimeOutHandler from "./Component/IdleTimeOutHandler";
import P2PmyOrders from "./Component/P2PmyOrders";
import Sidebarp2pmyOrder from "./Component/Sidebarp2pmyOrder";
import SidebarP2Pedit from "./Component/SidebarP2Pedit";
import Sidebarp2pprocessOrder from "./Component/Sidebarp2pprocessOrder";
import Sidebarp2pconfirmOrder from "./Component/Sidebarp2pconfirmOrder";
import SidebarRefferal from "./Component/SidebarRefferal";
import Contactus from "./Component/Contactus";
import SidebarSwap from "./Component/SidebarSwap";
import Terms from "./Component/Terms";
import Privacy from "./Component/Privacy";
import Helpcenter from "./Component/Helpcenter";

import { removeAuthToken } from "./core/lib/localStorage";

function App() {
  const [isActive, setIsActive] = useState(true);

  function RequireAuth({ children }) {
    var data = localStorage.getItem("user_token");
    return data ? children : removeAuthToken();
  }

  return (
    <>
      <Router>
        <IdleTimeOutHandler
          onActive={() => {
            setIsActive(true);
          }}
          onIdle={() => {
            setIsActive(false);
          }}
        />
        <ToastContainer />
        <Routes>
          <Route path="/" element={<HomeNew />} />
          {/* <Route path="/contactus" element={<Contactus />} /> */}
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                {" "}
                <Sidebarcontent />{" "}
              </RequireAuth>
            }
          />
          <Route
            path="/transaction"
            element={
              <RequireAuth>
                {" "}
                <TransactionNew />{" "}
              </RequireAuth>
            }
          />
          <Route path="/trade" element={<TradeNew />} />
          <Route path="/trade/:pair" element={<TradeNew />} />
          <Route path="/margin" element={<SidebarTradeTwo />} />
          <Route path="/margin/:pair" element={<SidebarTradeTwo />} />
          <Route path="/launchpadNew" element={<SidebarLaunchpad />} />
          <Route path="/loan" element={<SidebarLoanPage />} />
          <Route path="/terms" element={<Terms />} />

          <Route path="/privacy" element={<Privacy />} />
          <Route path="/about" element={<Helpcenter />} />

          <Route
            path="/launchpadNewnow"
            element={
              <RequireAuth>
                {" "}
                <SidebarLaunchpadnow />{" "}
              </RequireAuth>
            }
          />
          <Route
            path="/p2ppost"
            element={
              <RequireAuth>
                {" "}
                <SidebarP2ppost />{" "}
              </RequireAuth>
            }
          />
          <Route path="/p2phome" element={<SidebarP2ppostnew />} />
          <Route
            path="/p2p/chat/:id"
            element={
              <RequireAuth>
                {" "}
                <SidebarP2pChat />{" "}
              </RequireAuth>
            }
          />
          <Route path="/staking" element={<Stakingnew />} />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                {" "}
                <Sidebarprofile />{" "}
              </RequireAuth>
            }
          />
          <Route
            path="/Kyc"
            element={
              <RequireAuth>
                {" "}
                <SidebarKyc />{" "}
              </RequireAuth>
            }
          />
          <Route
            path="/support"
            element={
              <RequireAuth>
                {" "}
                <SidebarSupport />
              </RequireAuth>
            }
          />
          {/* <Route path="/Bankdetails" element={  <RequireAuth> <Bankdetails /> </RequireAuth> } /  > */}
          <Route path="/p2p/view/:id" element={<Sidebarp2pview />} />
          {/* <Route path="/privacy" element={<Privacy />} /> */}
          <Route
            path="/p2ppost-edit/:id"
            element={
              <RequireAuth>
                {" "}
                <SidebarP2Pedit />{" "}
              </RequireAuth>
            }
          />
          {/* <Route path="/Contactus" element={<Contactus />} /> */}
          {/* <Route path="/sidebarSwap" element={<RequireAuth>  <SidebarSwap /> </RequireAuth> } /> */}
          {/* <Route path="/sidebarRefferal" element={<RequireAuth> <SidebarRefferal /> </RequireAuth>} /> */}

          <Route
            path="/launchpadNewbuy/:id"
            element={
              <RequireAuth>
                {" "}
                <SidebarLaunchpadbuy />{" "}
              </RequireAuth>
            }
          />

          <Route
            path="/launchpadapplayNew"
            element={
              <RequireAuth>
                {" "}
                <SidebarLaunchpadapplay />{" "}
              </RequireAuth>
            }
          />

          <Route
            path="/p2p-Orders"
            element={
              <RequireAuth>
                {" "}
                <Sidebarp2pmyOrder />{" "}
              </RequireAuth>
            }
          />
          <Route
            path="/p2p-processOrders"
            element={
              <RequireAuth>
                {" "}
                <Sidebarp2pprocessOrder />{" "}
              </RequireAuth>
            }
          />
          <Route
            path="/p2p-History"
            element={
              <RequireAuth>
                {" "}
                <Sidebarp2pconfirmOrder />{" "}
              </RequireAuth>
            }
          />

          {/* <Route path="/Sidebarcontent" element={<Sidebarcontent />} /> */}

          {/* <Route path="/trade" element={<Trade />} /> */}
          <Route path="/verify-tfa" element={<VerifyTfa />} />
          {/* <Route path="/trade/:pair" element={<Trade />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/otp" element={<Otp />} />
          <Route
            path="/myfund"
            element={
              <RequireAuth>
                <Myfund />
              </RequireAuth>
            }
          />
          {/* <Route path="/kyc" element={<Kyc />} /> */}
          {/* <Route path="/transaction" element={<Transaction />} /> */}
          <Route path="/forgot/:id" element={<ForgotPassword />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          {/* <Route path="/profile" element={<Profile />} /> */}
          <Route path="/tradeview/:pair" element={<Chart />} />
          {/* <Route path="/staking" element={<Staking />} /> */}
          <Route path="/launchpad" element={<Launchpad />} />
          <Route path="/launchnow" element={<Launchpadnow />} />
          <Route path="/launchbuy/:id" element={<Launchpadbuy />} />
          <Route path="/launchpadapplay" element={<Launchpadapplay />} />
          {/* <Route path="/support" element={<Support />} /> */}
          <Route path="/p2p/post_ad" element={<P2home />} />
          <Route path="/p2p" element={<P2Ppost />} />
          <Route path="/transfer" element={<Transfer />} />
          {/* <Route path="/referral" element={  <RequireAuth> <Referral /></RequireAuth>  } /> */}

          {/* <Route path="/p2p/chat/:id" element={<P2Pchat />} /> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
