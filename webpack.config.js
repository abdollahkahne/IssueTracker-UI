const path = require("path");
const nodeExternals = require("webpack-node-externals");
const webpack = require("webpack");

const browserConfig = {
  mode: "development",
  entry: {
    app: ["./browser/App.jsx"],
  },
  optimization: {
    splitChunks: {
      name: "venodrs",
      chunks: "all",
    },
  },
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "[name].bundle.js",
    publicPath: "/",
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      use: {
        loader: "babel-loader",
        options: {
          presets: [
            ["@babel/preset-env", {
              targets: {
                ie: 11, edge: 15, safari: 10, firefox: 50, chrome: 49,
              },
            }],
            "@babel/preset-react",
          ],
        },
      },
      exclude: "/node_modules/",
    }],
  },
  plugins: [
    new webpack.DefinePlugin({ __isBrowser__: "true" }),
  ],
  devtool: "source-map",
};

const serverConfig = {
  mode: "development",
  entry: {
    server: ["./server/server.js"],
  },
  target: "node",
  externals: [nodeExternals()],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "server.bundle.js",
    publicPath: "/",
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      use: {
        loader: "babel-loader",
        options: {
          presets: [["@babel/preset-env", { targets: { node: "14" } }], "@babel/preset-react"],
        },
      },
    }],
  },
  plugins: [
    new webpack.DefinePlugin({ __isBrowser__: "false" }),
  ],
  devtool: "source-map",
};

module.exports = [browserConfig, serverConfig];
