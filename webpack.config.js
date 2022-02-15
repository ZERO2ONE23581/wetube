module.exports = {
  //entry means source code (in this case main.js)
  ///entry is the file we'd like to transfrom from new js -> old ugly js
  entry: "./src/client/js/main.js",
  output: {
    filename: "main.js",
    path: "./assets/js", // this is where the transformed file is saved.
  },
};
