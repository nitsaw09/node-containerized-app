require("babel-register")({
  presets: ["env", "stage-2"],
  plugins: ["transform-runtime"]
});
require("./server.js");
