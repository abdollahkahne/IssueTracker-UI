/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
import express from "express";
import cookieParser from "cookie-parser";
import { createProxyMiddleware as httpProxy } from "http-proxy-middleware";
import dotenv from "dotenv";
// import path from "path";
import SourceMapSupport from "source-map-support";
import render from "./render.jsx";

SourceMapSupport.install();
dotenv.config();

const app = express();

const enableHMR = (process.env.ENABLE_HMR || "true") === "true";
if (enableHMR && process.env.NODE_ENV !== "production") {
  console.log("Adding HMR middleware");
  const webpack = require("webpack");
  const devMiddleware = require("webpack-dev-middleware");
  const hotMiddleware = require("webpack-hot-middleware");
  const config = require("../webpack.config")[0];
  config.entry.app.push("webpack-hot-middleware/client");
  config.plugins = config.plugins || [];
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
  const compiler = webpack(config);
  app.use(devMiddleware(compiler));
  app.use(hotMiddleware(compiler));
}

app.use(express.static("public"));
app.use(cookieParser());

const apiProxyTarget = process.env.API_PROXY_TARGET;
if (apiProxyTarget) {
  // using proxy bypass cors setting in API Server
  app.use("/_api", httpProxy({ target: apiProxyTarget, changeOrigin: true }));
}
const authProxyTarget = process.env.AUTH_PROXY_TARGET;
if (authProxyTarget) {
  app.use("/auth", httpProxy({ target: authProxyTarget, changeOrigin: true }));
}

app.get("/env.js", (req, res) => {
  const windowEnv = {
    UI_API_ENDPOINT: process.env.UI_API_ENDPOINT,
    UI_AUTH_ENDPOINT: process.env.UI_AUTH_ENDPOINT,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  };
  res.send(`window.ENV=${JSON.stringify(windowEnv)}`);
});

app.get("*", (req, res, next) => { render(req, res, next); });

// Redirect for Home Page (Apparantly React Static Router Context have a bug);
// app.get("/", (req, res) => { res.redirect(301, "/issues"); });

// // Client Side Rendering
// app.get("/*", (req, res) => {
//   res.sendFile(path.resolve("public/index.html"));
// });

// setting App variable port from env variable
app.set("port", process.env.PORT || 8000);
app.listen(app.get("port"), () => {
  console.log(`server started at http://localhost:${app.get("port")}/`);
});

if (module.hot) {
  module.hot.accept("./render.jsx");
}
