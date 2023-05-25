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

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const goToPrevPage = () =>
    setPageNumber(pageNumber - 1 <= 1 ? 1 : pageNumber - 1);

  const goToNextPage = () =>
    setPageNumber(pageNumber + 1 >= numPages ? numPages : pageNumber + 1);

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
              <h1>Privacy Policy</h1>

              <div class="mx-auto u-para--readable">
                <span>Last updated: 12 feb 2023</span>
                <p class="u-para--readable mb-6">
                  The categories of personal information we collect depend on
                  whether you are a customer, user, applicant or visitor, and
                  the requirements of applicable law.
                  {/*  */}
                </p>
                <h3 class="text-xl font-bold my-4">
                  1.1Information You Provide to Us
                </h3>
                <h4>i)Account Creation- </h4>
                <p class="u-para--readable mb-6">
                  When you create a user account after you have started using
                  the Services, we may collect your name, email address, date of
                  birth, tax number, username, password or other personal
                  information used to identify you.
                </p>
                <h4>ii)Your Communications with Us- </h4>
                <p class="u-para--readable mb-6">
                  We collect personal information from you such as email
                  address, phone number, or mailing address when you request
                  information about our Services, request customer or technical
                  support, apply for a job or otherwise communicate with us.
                  Surveys. We may contact you to participate in surveys. If you
                  decide to participate, you may be asked to provide certain
                  information which may include personal information.
                </p>
                <h4>iii)Social Media Content- </h4>
                <p class="u-para--readable mb-6">
                  We may offer forums, blogs, or social media pages. Any content
                  you provide on these channels will be considered “public” and
                  is not subject to privacy protections.
                </p>
                <h4>iv)Registration for Sweepstakes or Contests- </h4>
                <p class="u-para--readable mb-6">
                  We may run sweepstakes and contests. Contact information you
                  provide may be used to reach you about the sweepstakes or
                  contest and for other promotional, marketing and business
                  purposes, if permitted by law. In some jurisdictions, we are
                  required to publicly share information of winners.
                </p>
                <h3 class="text-xl font-bold my-4">
                  1.2Information Collected Automatically or From Others
                </h3>
                <h4>i)Automatic Data Collection- </h4>
                <p class="u-para--readable mb-6">
                  We may collect certain information automatically when you use
                  the Services. This information may include your Internet
                  protocol (IP) address, user settings, MAC address, cookie
                  identifiers, mobile carrier, mobile advertising and other
                  unique identifiers, details about your browser, operating
                  system or device, location information, Internet service
                  provider, pages that you visit before, during and after using
                  the Services, information about the links you click, and other
                  information about how you use the Services. Information we
                  collect may be associated with accounts and other devices.In
                  addition, we may automatically collect data regarding your use
                  of our Services, such as the types of content you interact
                  with and the frequency and duration of your activities. We may
                  combine your information with information that other people
                  provide when they use our Services, including information
                  about you when they tag you.
                </p>
                <h4>
                  ii)Cookies, Pixel Tags/Web Beacons, Analytics Information, and
                  Interest-{" "}
                </h4>
                <p class="u-para--readable mb-6">
                  Advertising technologies. We, as well as third parties that
                  provide content, advertising, or other functionality on the
                  Services, may use cookies, pixel tags, local storage, and
                  other technologies (“Technologies”) to automatically collect
                  information through the Services. <br />
                  Technologies are essentially small data files placed on your
                  computer, tablet, mobile phone, or other devices that allow us
                  and our partners to record certain pieces of information
                  whenever you visit or interact with our Services.
                </p>
                <h4>iii)Cookies- </h4>
                <p class="u-para--readable mb-6">
                  Cookies are small text files placed in visitors’ computer
                  browsers to store their preferences. Most browsers allow you
                  to block and delete cookies. However, if you do that, the
                  Services may not work properly.
                </p>
                <h4>iv)Pixel Tags/Web Beacons- </h4>
                <p class="u-para--readable mb-6">
                  A pixel tag (also known as a web beacon) is a piece of code
                  embedded in the Services that collects information about
                  users’ engagement on that web page. The use of a pixel allows
                  us to record, for example, that a user has visited a
                  particular web page or clicked on a particular advertisement.
                </p>
                <h4>v)Information from Other Sources- </h4>
                <p class="u-para--readable mb-6">
                  We may obtain information about you from other sources,
                  including through third party services and organizations to
                  supplement information provided by you. For example, if you
                  access our Services through a third-party application, such as
                  an app store, a third-party login service, or a social
                  networking site, we may collect information about you from
                  that third-party application that you have made public via
                  your privacy settings. Information we collect through these
                  services may include your name, your user identification
                  number, your user name, location, gender, birth date, email,
                  profile picture, and your contacts stored in that service.
                  This supplemental information allows us to verify information
                  that you have provided to us and to enhance our ability to
                  provide you with information about our business, products, and
                  Services.
                </p>
                <h3 class="text-xl font-bold my-4">
                  II. HOW WE USE YOUR INFORMATION
                </h3>
                <p class="u-para--readable mb-6">
                  We use your information for a variety of business purposes,
                  including fulfill our contract with you and provide you with
                  our Services, such as:
                </p>
                <ol class="list-decimal pl-8">
                  <li class="mb-4">Managing your information and accounts;</li>
                  <li class="mb-4">
                    Providing access to certain areas, functionalities, and
                    features of our Services;
                  </li>
                  <li class="mb-4">
                    Communicating with you about your account, activities on our
                    Services and policy changes;
                  </li>
                  <li class="mb-4">
                    Undertaking activities to verify or maintain the quality or
                    safety of a service or device;
                  </li>
                  <li class="mb-4">
                    Processing your financial information and other payment
                    methods for products or Services purchased;
                  </li>
                  <li class="mb-4">
                    Providing advertising, analytics and marketing services;
                  </li>
                  <li class="mb-4">
                    Processing applications and transactions; and
                  </li>
                  <li class="mb-4">Allowing you to register for events.</li>
                  <li class="mb-4">
                    Analyze and improve our Services pursuant to our legitimate
                    interest, such as: Detecting security incidents, protecting
                    against malicious, deceptive, fraudulent or illegal
                    activity, and prosecuting those responsible for that
                    activity;
                  </li>
                  <li class="mb-4">
                    Measuring interest and engagement in our Services and
                    short-term, transient use, such as contextual customization
                    of ads;
                  </li>
                  <li class="mb-4">
                    Undertaking research for technological development and
                    demonstration;
                  </li>
                  <li class="mb-4">
                    Researching and developing products, services, marketing or
                    security procedures to improve their performance,
                    resilience, reliability or efficiency;
                  </li>
                  <li class="mb-4">
                    Improving, upgrading or enhancing our Services or device [or
                    those of our Providers;
                  </li>
                  <li class="mb-4">Developing new products and Services;</li>
                  <li class="mb-4">Ensuring internal quality control;</li>
                  <li class="mb-4">
                    Verifying your identity and preventing fraud;
                  </li>
                  <li class="mb-4">
                    Debugging to identify and repair errors that impair existing
                    intended functionality;
                  </li>
                  <li class="mb-4">Enforcing our terms and policies; and</li>
                  <li class="mb-4">
                    Complying with our legal obligations, protecting your vital
                    interest, or as may be required for the public good.
                  </li>
                  <li class="mb-4">
                    Provide you with additional content and Services, such
                    as:Furnishing you with customized materials about offers,
                    products, and Services that may be of interest, including
                    new content or Services;
                  </li>
                  <li class="mb-4">
                    Auditing relating to interactions, transactions and other
                    compliance activities; and
                  </li>
                  <li class="mb-4">
                    Other purposes you consent to, are notified of, or are
                    disclosed when you provide personal information.
                  </li>
                </ol>
                <h3 class="text-xl font-bold my-4">2.1.Automated profiling</h3>
                <h4>
                  i) We may use technologies considered automated decision
                  making or profiling-
                </h4>
                <p class="u-para--readable mb-6">
                  We will not make automated decisions about you that would
                  significantly affect you, unless such a decision is necessary
                  as part of a contract we have with you, we have your consent,
                  or we are permitted by law to use such technology. You may
                  escalate any concerns you have by contacting us below.
                </p>
                <h4>ii)Use De-identified and Aggregated Information- </h4>
                <p class="u-para--readable mb-6">
                  We may use personal information and other data about you to
                  create de-identified and aggregated information, such as
                  de-identified demographic information, de-identified location
                  information, information about the computer or device from
                  which you access our Services, or other analyses we create.
                </p>
                <h4>iii)Share Content with Friends or Colleagues- </h4>
                <p class="u-para--readable mb-6">
                  Our Services may offer various tools and functionalities. For
                  example, we may allow you to provide information about your
                  friends through our referral services. Our referral services
                  may allow you to forward or share certain content with a
                  friend or colleague, such as an email inviting your friend to
                  use our Services.
                </p>
                <h4>iv)How We Use Automatic Collection Technologies- </h4>
                <p class="u-para--readable mb-6">
                  We, as well as third parties that provide content,
                  advertising, or other functionality on the Services, may use
                  cookies, pixel tags, local storage, and other technologies to
                  automatically collect information through the Services. Our
                  uses of these Technologies fall into the following general
                  categories:
                </p>
                <ol class="list-decimal pl-8">
                  <li class="mb-4">
                    <strong>Operationally Necessary-</strong>This includes
                    Technologies that allow you access to our Services,
                    applications, and tools that are required to identify
                    irregular site behavior, prevent fraudulent activity and
                    improve security or that allow you to make use of our
                    functionality;
                  </li>
                  <li class="mb-4">
                    <strong>Performance Related- </strong>We may use
                    Technologies to assess the performance of our Services,
                    including as part of our analytic practices to help us
                    understand how our visitors use the Services;
                  </li>
                  <li class="mb-4">
                    <strong>Functionality Related-</strong>We may use
                    Technologies that allow us to offer you enhanced
                    functionality when accessing or using our Services. This may
                    include identifying you when you sign into our Services or
                    keeping track of your specific preferences, interests, or
                    past items viewed;
                  </li>
                  <li class="mb-4">
                    <strong>Advertising or Targeting Related- </strong>We may
                    use first party or third-party Technologies to deliver
                    content, including ads relevant to your interests, on our
                    Services or on third party sites.
                  </li>
                  <li class="mb-4">
                    <strong>Cross-Device Tracking- </strong>Your browsing
                    activity may be tracked across different websites and
                    different devices or apps. For example, we may attempt to
                    match your browsing activity on your mobile device with your
                    browsing activity on your laptop. To do this our technology
                    partners may share data, such as your browsing patterns,
                    geo-location and device identifiers, and will match the
                    information of the browser and devices that appear to be
                    used by the same person.
                  </li>
                  <li class="mb-4">
                    <strong>
                      Notice Regarding Third Party Websites, Social Media
                      Platforms and Software Development Kits-{" "}
                    </strong>
                    The Services may contain links to other websites, and other
                    websites may reference or link to our website or other
                    Services. These other websites are not controlled by us. We
                    encourage our users to read the privacy policies of each
                    website and application with which they interact. We do not
                    endorse, screen or approve and are not responsible for the
                    privacy practices or content of such other websites or
                    applications. Visiting these other websites or applications
                    is at your own risk.
                  </li>
                  <li class="mb-4">
                    <strong>
                      Our Services may include publicly accessible blogs,
                      forums, social media pages, and private messaging
                      features-{" "}
                    </strong>
                    By using such Services, you assume the risk that the
                    personal information provided by you may be viewed and used
                    by third parties for any number of purposes. In addition,
                    social media buttons such as Facebook, Linked In, Google,
                    etc. (that might include widgets such as the “share this”
                    button or other interactive mini-programs) may be on our
                    site. These features may collect your IP address, which page
                    you are visiting on our site, and may set a cookie to enable
                    the feature to function properly. These social media
                    features are either hosted by a third party or hosted
                    directly on our site. Your interactions with these features
                    apart from your visit to our site are governed by the
                    privacy policy of the company providing it.
                  </li>
                  <li class="mb-4">
                    We may use third party APIs and software development kits
                    (“SDKs”) as part of the functionality of our Services. APIs
                    and SDKs may allow third parties including analytics and
                    advertising partners to collect your personal information
                    for various purposes including to provide analytics services
                    and content that is more relevant to you. For more
                    information about our use of APIs and SDKs, please contact
                    us as set forth below.
                  </li>
                </ol>

                <h3 class="text-xl font-bold my-4">
                  III. DISCLOSING YOUR INFORMATION TO THIRD PARTIES
                </h3>
                <p class="u-para--readable mb-6">
                  We may share your personal information with the following
                  categories of third parties: Service Providers. We may share
                  any personal information we collect about you with our third-
                  party service providers. The categories of service providers
                  (processors) to whom we entrust personal information include:
                  IT and related services; banks and trust companies;
                  information and services; payment processors; customer service
                  providers; and vendors to support the provision of the
                  Services.
                </p>
                <h4>3.1.Business Partners-</h4>
                <p class="u-para--readable mb-6">
                  We may provide personal information to business partners with
                  whom we jointly offer products or services. In such cases, our
                  business partner’s name will appear along with ours.
                </p>
                <h4>3.1.Business Partners-</h4>
                <p class="u-para--readable mb-6">
                  We may provide personal information to business partners with
                  whom we jointly offer products or services. In such cases, our
                  business partner’s name will appear along with ours.
                </p>
                <h4 class="text-xl font-bold my-4">3.2.Affiliates-</h4>
                <p class="u-para--readable mb-6">
                  We may share personal information with our affiliated
                  companies.
                </p>
                <h4 class="text-xl font-bold my-4">
                  3.3.Advertising Partners-
                </h4>
                <p class="u-para--readable mb-6">
                  Through our Services, we may allow third party advertising
                  partners to set Technologies and other tracking tools to
                  collect information regarding your activities and your device
                  (e.g., your IP address, mobile identifiers, page(s) visited,
                  location, time of day). We may also combine and share such
                  information and other information (such as demographic
                  information and past purchase history) with third party
                  advertising partners.
                  <br />
                  These advertising partners may use this information (and
                  similar information collected from other websites) for
                  purposes of delivering targeted advertisements to you when you
                  visit third party websites within their networks. This
                  practice is commonly referred to as “interest-based
                  advertising” or “online behavioral advertising. We may allow
                  access to other data collected by the Services to share
                  information that may be useful, relevant, valuable or
                  otherwise of interest to you. If you prefer not to share your
                  personal information with third party advertising partners,
                  you may follow the instructions below.
                </p>
                <h4 class="text-xl font-bold my-4">
                  3.4.Disclosures to Protect Us or Others-
                </h4>
                <p class="u-para--readable mb-6">
                  We may access, preserve, and disclose any information we store
                  associated with you to external parties if we, in good faith,
                  believe doing so is required or appropriate to: comply with
                  law enforcement or national security requests and legal
                  process, such as a court order or subpoena; protect your, our
                  or others’ rights, property, or safety; enforce our policies
                  or contracts; collect amounts owed to us; or assist with an
                  investigation or prosecution of suspected or actual illegal
                  activity.
                </p>
                <h4 class="text-xl font-bold my-4">
                  3.5.Disclosure in the Event of Merger, Sale, or Other Asset
                  Transfers-
                </h4>
                <p class="u-para--readable mb-6">
                  If we are involved in a merger, acquisition, financing due
                  diligence, reorganization, bankruptcy, receivership, purchase
                  or sale of assets, or transition of service to another
                  provider, then your information may be sold or transferred as
                  part of such a transaction, as permitted by law and/or
                  contract. You acknowledge that all information processed by us
                  may be transferred, processed, and stored anywhere in the
                  world, including but not limited to, the United States or
                  other countries, which may have data protection laws that are
                  different from the laws where you live. We have taken
                  appropriate safeguards to require that your personal
                  information will remain protected and require our third-party
                  service providers and partners to have appropriate safeguards
                  as well. Further details can be provided upon request.
                </p>
                <h3 class="text-xl font-bold my-4">IV. YOUR CHOICES</h3>
                <h4>4.1.General-</h4>
                <p class="u-para--readable mb-6">
                  You have certain choices about your personal information.
                  Where you have consented to the processing of your personal
                  information, you may withdraw that consent at any time and
                  prevent further processing by contacting us as described
                  below. Even if you opt out, we may still collect and use non-
                  personal information regarding your activities on our Services
                  and for other legal purposes as described above.
                </p>
                <h4 class="text-xl font-bold my-4">
                  i) Email and Telephone Communications
                </h4>
                <ol className="list-decimal pl-8">
                  <li>
                    If you receive an unwanted email from us, you can use the
                    unsubscribe link found at the bottom of the email to opt out
                    of receiving future emails. Note that you will continue to
                    receive transaction-related emails regarding products or
                    Services you have requested. We may also send you certain
                    non-promotional communications regarding us and our
                    Services, and you will not be able to opt out of those
                    communications (e.g., communications regarding the Services
                    or updates to our Terms or this Privacy Policy).
                  </li>
                  <li>
                    We process requests to be placed on do-not-mail,
                    do-not-phone and do-not-contact lists as required by
                    applicable law
                  </li>
                </ol>
                <h4 class="text-xl font-bold my-4">ii) Mobile Devices</h4>
                <p>
                  We may send you push notifications through our mobile
                  application. You may at any time opt- out from receiving these
                  types of communications by changing the settings on your
                  mobile device. We may also collect location-based information
                  if you use our mobile applications. You may opt-out of this
                  collection by changing the settings on your mobile device.
                </p>
                <h4 class="text-xl font-bold my-4">iii) Do Not Track</h4>
                <ol className="list-decimal pl-8">
                  <li class="mb-4">
                    Do Not Track (“DNT”) is a privacy preference that users can
                    set in certain web browsers. Please note that we do not
                    respond to or honor DNT signals or similar mechanisms
                    transmitted by web browsers.
                  </li>
                  <li>Cookies and Interest-Based Advertising</li>
                  <li class="mb-4">
                    You may stop or restrict the placement of Technologies on
                    your device or remove them by adjusting your preferences as
                    your browser or device permits. The online advertising
                    industry also provides websites from which you may opt out
                    of receiving targeted ads from data partners and other
                    advertising partners that participate in self-regulatory
                    programs.
                  </li>
                  <li class="mb-4">
                    Please note you must separately opt out in each browser and
                    on each device. Advertisements on third party websites that
                    contain the AdChoices link may have been directed to you
                    based on information collected by advertising partners over
                    time and across websites. These advertisements provide a
                    mechanism to opt out of the advertising partners’ use of
                    this information for interest-based advertising purposes.
                  </li>
                  <li>Cookies and Interest-Based Advertising</li>
                </ol>

                <h3 class="text-xl font-bold my-4">4.2.Your Privacy Rights</h3>
                <p class="u-para--readable mb-6">
                  In accordance with applicable law, you may have the right to:
                </p>
                <ol class="list-decimal pl-8">
                  <li class="mb-4">
                    Access to/Portability of Personal Data. about you consistent
                    with legal requirements. In addition, you may have the right
                    in some cases to receive or have your electronic Personal
                    Data transferred to another party.
                  </li>
                  <li class="mb-4">
                    Request correction. of your personal information where it is
                    inaccurate or incomplete. In some cases, we may provide
                    self-service tools that enable you to update your personal
                    information or we may refer you to the controller of your
                    personal information who is able to make the correction.
                  </li>
                  <li class="mb-4">
                    Request deletion. of your personal information, subject to
                    certain exceptions prescribed by law.
                  </li>
                  <li class="mb-4">
                    Request restriction of or object to processing of your
                    personal information, including the right to opt in or opt
                    out of the sale of your Personal Data to third parties, if
                    applicable, where such requests are permitted by law.
                  </li>
                  <li class="mb-4">
                    If you would like to exercise any of these rights, please
                    log into your account or contact us as set forth below. We
                    will process such requests in accordance with applicable
                    laws. To protect your privacy, we will take steps to verify
                    your identity before fulfilling your request. For more
                    information on your specific rights under the California
                    Consumer Privacy Act (“CCPA”), see below.
                  </li>
                </ol>
                <h3 class="text-xl font-bold my-4">V. DATA RETENTION</h3>
                <p class="u-para--readable mb-6">
                  We store the personal information we receive as described in
                  this Privacy Policy for as long as you use our Services or as
                  necessary to fulfill the purpose(s) for which it was
                  collected, provide our Services, resolve disputes, establish
                  legal defenses, conduct audits, pursue legitimate business
                  purposes, enforce our agreements, and comply with applicable
                  laws.
                </p>
                <h3 class="text-xl font-bold my-4">
                  VI. SECURITY OF YOUR INFORMATION
                </h3>
                <p class="u-para--readable mb-6">
                  We take steps to ensure that your information is treated
                  securely and in accordance with this Privacy Policy.
                  Unfortunately, no system is 100% secure, and we cannot ensure
                  or warrant the security of any information you provide to us.
                  To the fullest extent permitted by applicable law, we do not
                  accept liability for unintentional disclosure.
                  <br />
                  By using the Services or providing personal information to us,
                  you agree that we may communicate with you electronically
                  regarding security, privacy, and administrative issues
                  relating to your use of the Services. If we learn of a
                  security system’s breach, we may attempt to notify you
                  electronically by posting a notice on the Services, by mail or
                  by sending an email to you.
                </p>
                <h3 class="text-xl font-bold my-4">
                  VII. CHILDREN’S INFORMATION
                </h3>
                <p class="u-para--readable mb-6">
                  The Services are not directed to children under 13 (or other
                  age as required by local law), and we do not knowingly collect
                  personal information from children. If you learn that your
                  child has provided us with personal information without your
                  consent, you may contact us as set forth below. If we learn
                  that we have collected any personal information in violation
                  of applicable law, we will promptly take steps to delete such
                  information and terminate the child’s account.
                </p>
                <h3 class="text-xl font-bold my-4">
                  VIII. SUPERVISORY AUTHORITY
                </h3>
                <p class="u-para--readable mb-6">
                  If you are located in the European Economic Area or the UK,
                  you have the right to lodge a complaint with a supervisory
                  authority if you believe our processing of your personal
                  information violates applicable law.
                </p>
                <h3 class="text-xl font-bold my-4">
                  IX. CHANGES TO OUR PRIVACY POLICY
                </h3>
                <p class="u-para--readable mb-6">
                  We may revise this Privacy Policy from time to time at our
                  sole discretion. If there are any material changes to this
                  Privacy Policy, we will notify you as required by applicable
                  law. You understand and agree that you will be deemed to have
                  accepted the updated Privacy Policy if you continue to use the
                  Services after the new Privacy Policy takes effect.
                </p>
                <h3 class="text-xl font-bold my-4">X. CONTACT US</h3>
                <p class="u-para--readable mb-6">
                  If you have any questions about our privacy practices or this
                  Privacy Policy, or if you wish to submit a request to exercise
                  your rights as detailed in this Privacy Policy, please contact
                  us at:{" "}
                  <a href="SpacePepe Exchange.com" target="_blank">
                    no-reply@SpacePepe Exchange.com
                  </a>
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
