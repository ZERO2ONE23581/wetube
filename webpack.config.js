const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const BASE_JS = './src/client/js/';

module.exports = {
  //entry means source code (in this case main.js)
  ///entry is the file we'd like to transfrom from new js -> old ugly compressed version of js
  entry: {
    main: BASE_JS + 'main.js',
    videoPlayer: BASE_JS + 'videoPlayer.js',
    recorder: BASE_JS + 'recorder.js',
    commentSection: BASE_JS + 'commentSection.js',
  },
  plugins: [
    new MiniCssExtractPlugin({
      //this separates styles.css from js file
      filename: 'css/styles.css',
    }),
  ],
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'assets'), // this is where the transformed file is saved.
    clean: true, //clean output folder before you build frontEnd
  },
  module: {
    rules: [
      {
        test: /\.js$/, //we're taking all the js files and make transforms
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { targets: 'defaults' }]],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
};
