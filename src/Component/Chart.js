import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
//import { useSelector } from 'react-redux'

// import lib
import { widget } from '../core/lib/chart/charting_library/charting_library.min';
import isEmpty from "../core/lib/isEmpty";
import { env } from "../core/service/envconfig";

const Charts = () => {
    // state

    const [theme, setTheme] = useState("Dark");
    const [pair, setPair] = useState("BTC_USDT");
    const tvWidget = null;

    useEffect(() => {
        if (tvWidget !== null) {
          tvWidget.remove();
          tvWidget = null;
        }

        var urls = window.location.href;
        console.log(urls,'=-=-=-=-=-urls=-=-=-=-urls=-=-urls-==-')
        var fetchPair = urls.split("tradeview/")[1];
        if (fetchPair) {
            var fromcurr = fetchPair.split("_")[0];
            var toCurr = fetchPair.split("_")[1];
            setPair(fromcurr + "_" + toCurr);
            buildchart("Dark",fromcurr + "_" + toCurr);
        }
    })

    // useEffect(() => {
    //     buildchart("Dark",pair);
    //   }, []);

    const getLanguageFromURL = () => {
        const regex = new RegExp("[\\?&]lang=([^&#]*)");
        const results = regex.exec(window.location.search);
        return results === null
          ? null
          : decodeURIComponent(results[1].replace(/\+/g, " "));
      };
    
      const buildchart = (theme, pair) => {
        const widgetOptions = {
          symbol: pair,
          // BEWARE: no trailing slash is expected in feed URL
          datafeed: new window.Datafeeds.UDFCompatibleDatafeed(
            env.apiHost + "chartapi/chart"
          ),
          interval: "5",
          container_id: "tv_chart_container",
          library_path: "/charting_library/",
    
          locale: getLanguageFromURL() || "en",
          disabled_features: ["use_localstorage_for_settings"],
          enabled_features: ["study_templates"],
          charts_storage_url: "",
          charts_storage_api_version: "1.1",
          client_id: "tradingview.com",
          user_id: "public_user_id",
          fullscreen: false,
          //autosize: true,
          width: "100%",
          height: "718",
          studies_overrides: {},
          loading_screen: {backgroundColor: "#0d042c"},
          theme: theme,
          toolbar_bg: "#0d042c",
          pricescale: 100,
          overrides: {
            // "symbolWatermarkProperties.color": "#000657",
            "paneProperties.background": "#0d042c",
            "paneProperties.vertGridProperties.color": "transparent",
            "paneProperties.horzGridProperties.color": "transparent",
          },
        };
    
        if (theme == "White") {
          delete widgetOptions.toolbar_bg;
          delete widgetOptions.overrides;
        }
    
        const tvWidget = new widget(widgetOptions);
    
        tvWidget.onChartReady(() => {
          tvWidget.headerReady().then(() => {
            const button = tvWidget.createButton();
            button.setAttribute("title", "Click to show a notification popup");
            button.classList.add("apply-common-tooltip");
            button.addEventListener("click", () =>
              tvWidget.showNoticeDialog({
                title: "Notification",
                body: "TradingView Charting Library API works correctly",
                callback: () => {
                  console.log("Noticed!");
                },
              })
            );
    
            // button.innerHTML = 'Check API';
          });
        });
      };

      return (
        <div id="tv_chart_container"></div>
      );
   
}

export default Charts;