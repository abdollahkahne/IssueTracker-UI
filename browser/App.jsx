/* eslint-disable no-underscore-dangle */
import "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import Page from "../src/page.jsx";
import store from "../src/store";

// This should be done at App because if you define it
// in About the first time that it tanspile it got error and
// Also we have the different Server rendered dom from React genrated dom
// At hydrate phase in the Client (Hydrate phase happen in clients)
store.initialData = window.__INITIAL_DATA__;
store.userData = window.__USER_DATA__;

const element = <Router><Page /></Router>;
ReactDOM.render(element, document.getElementById("content"));

if (module.hot) {
  module.hot.accept();
}
