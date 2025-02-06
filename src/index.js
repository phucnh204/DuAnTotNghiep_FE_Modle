import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
// import { Provider } from "react-redux";
// import store from "./redux/store";
import { BrowserRouter } from "react-router-dom";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import "owl.carousel";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter basename="/">
        <App />
  </BrowserRouter>
);
