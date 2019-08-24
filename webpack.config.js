const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/js/index.js",
  output: {
    path: __dirname + "/dist",
    filename: "[name]-[hash].js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.css$/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }]
      },
      {
        test: /\.(woff2?|ttf|eot|svg)$/,
        loader: "url-loader"
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(["dist"], {
      verbose: true,
      dry: false
    }),
    new HtmlWebpackPlugin({
      template: "src/index.ejs",
      filename: "index.html",
      inject: true,
      hash: true
    }),
    new CopyWebpackPlugin([{ from: "src/images", to: "images" }])
  ]
};
