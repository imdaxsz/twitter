import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import { app } from "./fBase";
import { BrowserRouter } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import "./styles/global.css";
import { Provider } from "react-redux";
import { store } from "store/store";
import ScrollToTop from "components/ScrollToTop";


console.log(app);
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <Provider store={store}>
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <ScrollToTop />
      <App />
    </BrowserRouter>
  </Provider>
);

reportWebVitals();
