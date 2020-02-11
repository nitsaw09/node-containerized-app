const http = require("http");

require("babel-register")({
  presets: ["env"]
});

const app = require("./app");

const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port);
