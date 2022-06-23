import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Global, css } from "@emotion/react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { BrowserRouter as Router } from "react-router-dom";
import { RestAPI } from "./api/rest";
import Cookies from "universal-cookie";
import { Notification as NotificationComponent } from "./components/Notification";

const GlobalStyles = css`
  .js-focus-visible :focus:not([data-focus-visible-added]) {
    outline: none;
    box-shadow: none;
  }
`;

const theme = extendTheme({
  fonts: {
    heading: "Inter",
    body: "Inter",
  },
});

/* Ξ ₿ $ € ₽ ¥  */
const globalState = {
  mining: {} as any,
  prices: {} as any,
  displayCurrency: { currency: "EUR", sign: "€" },
};

RestAPI.initGlobalState().then((response) => {
  globalState.mining = response.data.mining;
  globalState.prices = response.data.prices;
  updateDisplayCurrency();
});
export function updateDisplayCurrency(currency?: string) {
  if (!currency) {
    RestAPI.me().then((response) => {
      currency = response.data.currency;
      globalState.displayCurrency = {
        currency: currency || "USD",
        sign: getCurrencySign(currency || "USD"),
      };
    });
  } else {
    globalState.displayCurrency = {
      currency: currency || "USD",
      sign: getCurrencySign(currency || "USD"),
    };
  }
}

function getCurrencySign(currency: string) {
  var sign = "$";
  switch (currency?.toUpperCase()) {
    case "EUR":
      sign = "€";
      break;
    case "ETH":
      sign = "Ξ";
      break;
    case "BTC":
      sign = "₿";
      break;
    case "RUB":
      sign = "₽";
      break;
    case "CNY":
      sign = "¥";
      break;
  }
  return sign;
}

Promise.resolve(Notification.requestPermission()).then(function (
  permission
) {});

export const GlobalStateContext = React.createContext(globalState);

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <Global styles={GlobalStyles} />
    <Router>
      <GlobalStateContext.Provider value={globalState}>
        <NotificationComponent />
        <App />
      </GlobalStateContext.Provider>
    </Router>
  </ChakraProvider>,
  document.getElementById("root")
);
