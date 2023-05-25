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
              <h1>Terms and Conditions (TnC)</h1>

              <div class="mx-auto u-para--readable">
                <span class="u-para--readable mb-6">
                  Last updated: 12 feb 2023
                </span>
                <p class="u-para--readable mb-6">
                  Please read these Terms and Conditions ("Terms", "Terms and
                  Conditions") carefully before using the{" "}
                  <a
                    href="https://SpacePepe Exchange.com/"
                    target="_blank"
                    rel="noopener noreferrer "
                    class="font-bold c-links "
                  >
                    https://SpacePepe Exchange.com
                  </a>{" "}
                  website (the "Service", "us", "we", or "our"). Your access to
                  and use of the Service is conditioned on your acceptance of
                  and compliance with these Terms. These Terms apply to all
                  visitors, users and others who access or use the Service. By
                  accessing or using the Service you agree to be bound by these
                  Terms. If you disagree with any part of the terms then you may
                  not access the Service.
                </p>
                <h3 class="text-xl font-bold my-4">Accounts</h3>
                <ul class="list-circle pl-8">
                  <li class="mb-4">
                    <p class="u-para--readable mb-6">
                      You are responsible for keeping your account secure while
                      you use our Service. We offer tools such as two-factor
                      authentication to help you maintain your account's
                      security, but the content of your account and its security
                      are up to you.
                    </p>
                  </li>
                  <li class="mb-4">
                    <p class="u-para--readable mb-6">
                      You are responsible for all activity that occurs under
                      your account (even when the activity is done by others who
                      have accounts under your account). Activity includes
                      everything but not limited to deposit, withdrawal,
                      trading, buy or sell orders etc.
                    </p>
                  </li>
                  <li class="mb-4">
                    <p class="u-para--readable mb-6">
                      You are responsible for maintaining the security of your
                      account and password. SpacePepe Exchange cannot and will
                      not be liable for any loss or damage from your failure to
                      comply with this security obligation.
                    </p>
                  </li>
                  <li class="mb-4">
                    <p class="u-para--readable mb-6">
                      You will promptly notify SpacePepe Exchange if you become
                      aware of any unauthorized use of, or access to, our
                      Service through your account, including any unauthorized
                      use of your password or account.
                    </p>
                  </li>
                  <li class="mb-4">
                    <p class="u-para--readable mb-6">
                      SpacePepe Exchange reserves all rights to put hold on your
                      account if found any suspicious activity
                    </p>
                  </li>
                  <li class="mb-4">
                    <p class="u-para--readable mb-6">
                      SpacePepe Exchange reserves all rights to ask any
                      necessary details such as source of funds and other
                      details to investigate and avoid any cases related to
                      money laundering or illegal activities.
                    </p>
                  </li>
                </ul>
                <h3 class="text-xl font-bold my-4">Conduct restrictions</h3>
                <p class="u-para--readable mb-6">
                  While using SpacePepe Exchange you agree that under any
                  circumstance you will not resort to:
                </p>
                <ul class="list-circle pl-8">
                  <li class="mb-4">
                    <p class="u-para--readable mb-6">
                      Attempt to disrupt or tamper with SpacePepe Exchange's
                      servers in ways that could harm our Website or Service, to
                      place undue burden on SpacePepe Exchange's servers through
                      automated means, or to access Space PEPE Exchange's
                      Service in ways that exceed your authorization.
                    </p>
                  </li>
                  <li class="mb-4">
                    <p class="u-para--readable mb-6">
                      Violate the privacy of any third party, such as by posting
                      another person's personal information without consent.
                    </p>
                  </li>
                  <li class="mb-4">
                    <p class="u-para--readable mb-6">
                      Impersonate any person or entity, including our employees
                    </p>
                  </li>
                </ul>
                <p class="u-para--readable mb-6">
                  In case of any excess deposit or withdrawal which got
                  conducted from your account. You would be liable to return the
                  excess funds. Excess fund is defined as additional amount of
                  crypto (any coin/token) or INR that you received. You are in
                  this case not the rightful owner of the funds received and are
                  liable to return it back. In case the funds are not returned
                  back in a specified duration legal action would take its
                  course.
                </p>
                <p class="u-para--readable mb-6">
                  In case any sort of a fraudulent or suspicious activity is
                  found within (or linked to) your account(s), your (or linked)
                  account(s) shall be frozen until given a clean chit by an
                  investigation for the same, done with the help of the Space
                  PEPE Exchange team.
                </p>
                <p class="u-para--readable mb-6">
                  The usage of SpacePepe Exchange warrants that consumers don't
                  misuse our Services. For example but not limited to, don't
                  interfere with our Services or try to access them using a
                  method other than the interface and the instructions that we
                  provide. Any misuse may imply legal action and we may suspend
                  or stop providing our Services to you if you do not comply
                  with our terms or policies or if we are investigating
                  suspected misconduct.
                </p>
                <p class="u-para--readable mb-6">
                  We as a merchant shall be under no liability whatsoever in
                  respect of any loss or damage arising directly or indirectly
                  out of the decline of authorization for any Transaction, on
                  Account of the Cardholder having exceeded the preset limit
                  mutually agreed by us with our acquiring bank from time to
                  time.
                </p>
                <p class="u-para--readable mb-6">
                  You when using the platform for any activity ascertain that
                  you do not belong to any FATF sanctioned countries and have
                  previously not been involved with any sort of money laundering
                  or criminal activities in any country in any manner
                </p>
                <p class="u-para--readable mb-6">
                  You understand the technology for decentralised finance is
                  fairly new and there might be fairly high volatility in the
                  projects you are participating in.
                </p>
                <h3 class="text-xl font-bold my-4">
                  Links &amp; Services To Other Web Sites
                </h3>
                <p class="u-para--readable mb-6">
                  Our Service may contain links to third-party web sites or
                  services that are not owned or controlled by us. We have no
                  control over, and assumes no responsibility for, the content,
                  privacy policies, or practices of any third party web sites or
                  services. You further acknowledge and agree that we shall not
                  be responsible or liable, directly or indirectly, for any
                  damage or loss caused or alleged to be caused by or in
                  connection with use of or reliance on any such content, goods
                  or services available on or through any such web sites or
                  services. We strongly advise you to read the terms and
                  conditions and privacy policies of any third-party web sites
                  or services that you visit.
                </p>
                <p class="u-para--readable mb-6">
                  Yo hereby authorise and give consent to us to call you through
                  any third party service providers to inform / alert regarding
                  the update related to SpacePepe Exchange. You further confirm
                  that by sending any of such message / calls, you will not hold
                  SpacePepe Exchange, its thirdy party service provider liable /
                  institute complaint under the Telecom Commercial Communication
                  Customer Preference (TRAI) regulation, 2010 or such other
                  applicable regulations including any amendment thereof, as may
                  be applicable from time to time.
                </p>
                <h3 class="text-xl font-bold my-4">Termination</h3>
                <p class="u-para--readable mb-6">
                  We may terminate or suspend your account immediately, without
                  prior notice or liability, for any reason whatsoever,
                  including without limitation if you breach the Terms. Upon
                  termination, your right to use the Service will immediately
                  cease. If you wish to terminate your account, you may simply
                  discontinue using the Service.
                </p>
                <h3 class="text-xl font-bold my-4">Limitation Of Liability</h3>
                <p class="u-para--readable mb-6">
                  In no event shall we, nor our directors, employees, partners,
                  agents, suppliers, or affiliates, be liable for any indirect,
                  incidental, special, consequential or punitive damages,
                  including without limitation, loss of profits, data, use,
                  goodwill, or other intangible losses, resulting from (i) your
                  access to or use of or inability to access or use the Service;
                  (ii) any conduct or content of any third party on the Service;
                  (iii) any content obtained from the Service; and (iv)
                  unauthorized access, use or alteration of your transmissions
                  or content, whether based on warranty, contract, tort
                  (including negligence) or any other legal theory, whether or
                  not we have been informed of the possibility of such damage,
                  and even if a remedy set forth herein is found to have failed
                  of its essential purpose.
                </p>
                <h3 class="text-xl font-bold my-4">Disclaimer</h3>
                <p class="u-para--readable mb-6">
                  Your use of the Service is at your sole risk. The Service is
                  provided on an "AS IS" and "AS AVAILABLE" basis. The Service
                  is provided without warranties of any kind, whether express or
                  implied, including, but not limited to, implied warranties of
                  merchantability, fitness for a particular purpose,
                  non-infringement or course of performance. We and our
                  subsidiaries, affiliates, and our licensors do not warrant
                  that a) the Service will function uninterrupted, secure or
                  available at any particular time or location; b) any errors or
                  defects will be corrected; c) the Service is free of viruses
                  or other harmful components; or d) the results of using the
                  Service will meet your requirements.
                </p>
                <h3 class="text-xl font-bold my-4">Governing Law</h3>
                <p class="u-para--readable mb-6">
                  These Terms shall be governed and construed in accordance with
                  the laws of Karnataka, India, without regard to its conflict
                  of law provisions. Our failure to enforce any right or
                  provision of these Terms will not be considered a waiver of
                  those rights. If any provision of these Terms is held to be
                  invalid or unenforceable by a court, the remaining provisions
                  of these Terms will remain in effect. These Terms constitute
                  the entire agreement between us regarding our Service, and
                  supersede and replace any prior agreements we might have
                  between us regarding the Service.
                </p>
                <h3 class="text-xl font-bold my-4">Changes</h3>
                <p class="u-para--readable mb-6">
                  We reserve the right, at our sole discretion, to modify or
                  replace these Terms at any time. If a revision is material we
                  will try to provide at least 30 days notice prior to any new
                  terms taking effect. What constitutes a material change will
                  be determined at our sole discretion. By continuing to access
                  or use our Service after those revisions become effective, you
                  agree to be bound by the revised terms. If you do not agree to
                  the new terms, please stop using the Service.
                </p>
                <h3 class="text-xl font-bold my-4">Contact Us</h3>
                <p class="u-para--readable mb-6">
                  If you have any questions about this Privacy Policy, please
                  contact us at{" "}
                  <a
                    href="mailto:hi@SpacePepe Exchange.com"
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    class="font-bold c-links "
                  >
                    hi@SpacePepe Exchange.com
                  </a>{" "}
                  or via the contact form.
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
