/* eslint-disable import/extensions */
import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter, matchPath } from "react-router-dom";
import Page from "../src/page.jsx";
import template from "./template";
// import graphQLFetch from "../src/graphQLFetch";
import store from "../src/store";
import routes from "../src/routes";

// This is an express middleware and so should be written as middleware
export default async function render(req, res) {
  // console.log("url:", req.originalUrl);
  // console.log("JWT: ", req.headers.cookie);
  // const initialData = await graphQLFetch("query {about}");
  // store.initialData = initialData;
  const activeRoute = routes.find((route) => matchPath(req.path, route));
  let initialData;
  if (activeRoute && activeRoute.component.fetchData) {
    const match = matchPath(req.path, activeRoute);
    const search = req.url.includes("?") ? req.url.substring(req.url.indexOf("?")) : null;
    initialData = await activeRoute.component.fetchData(match, search, req.headers.cookie);
    store.initialData = initialData;
  }

  // You can use `jwt=${req.cookies.jwt}` too
  const userData = await Page.fetchData(req.headers.cookie);

  const context = {};
  const contentElement = (
    <StaticRouter context={context} location={req.url}>
      <Page />
    </StaticRouter>
  );
  const body = ReactDOMServer.renderToString(contentElement);
  if (context.url) {
    res.redirect(301, context.url);
  } else {
    res.send(template(body, initialData, userData));
  }
}
