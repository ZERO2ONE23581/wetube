const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  //entry means source code (in this case main.js)
  ///entry is the file we'd like to transfrom from new js -> old ugly compressed version of js
  entry: {
    main: "./src/client/js/main.js",
    videoPlayer: "./src/client/js/videoPlayer.js",
    recorder: "./src/client/js/recorder.js",
  },
  mode: "development",
  watch: true, //this prevent "watching client console"(npm run assets) to stop running
  plugins: [
    new MiniCssExtractPlugin({
      //this separates styles.css from js file
      filename: "css/styles.css",
    }),
  ],
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "assets"), // this is where the transformed file is saved.
    clean: true, //clean output folder before you build frontEnd
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
