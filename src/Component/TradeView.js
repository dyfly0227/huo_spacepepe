import TradingViewWidget, { Themes } from 'react-tradingview-widget';

const Chart = () => (
  <TradingViewWidget
    symbol="BINANCE:BTCUSDT"
    theme={Themes.DARK}
    locale="fr"
    autosize
  />
);

export default Chart;