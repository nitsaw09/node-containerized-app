require("babel-register")({
  presets: ["env", "stage-2"],
  plugins: ["@babel/plugin-transform-runtime"]
});
require("./server.js");
