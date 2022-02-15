const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  //entry means source code (in this case main.js)
  ///entry is the file we'd like to transfrom from new js -> old ugly compressed version of js
  entry: "./src/client/js/main.js",
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/styles.css",
    }),
  ],
  mode: "development",
  output: {
    filename: "js/main.js",
    path: path.resolve(__dirname, "assets"), // this is where the transformed file is saved.
  },
  module: {
    rules: [
      {
        test: /\.js$/, //we're taking all the js files and make transforms
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
};
