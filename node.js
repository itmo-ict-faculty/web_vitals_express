const path = require("path");
const express = require("express");
const process = require("process");
const { debug } = require("console");
const os = require("os");
const ip = require("ip");
const bodyParser = require("body-parser");
const Prometheus = require("prom-client");

const app = express();

const buildDirName = "build";
const port = 3000;

let server = undefined;
// Requests response delay. Default - 50ms
let delay = 0;
// Array to store requests timestamps for the last secons
let rpsArray = [];

const jsonParser = bodyParser.json();

process.env["REACT_APP_CONTAINER_NAME"] = os.hostname();
process.env["REACT_APP_CONTAINER_IP"] = ip.address();

// Init prometheus histogram
const httpRequestDurationMicroseconds = new Prometheus.Histogram({
  name: "http_request_duration_ms",
  help: "Duration of HTTP requests in ms",
  labelNames: ["route"],
  // buckets for response time from 0.1ms to 500ms
  buckets: [
    0.1, 5, 15, 50, 100, 200, 300, 400, 500, 1000, 2000, 3000, 4000, 5000,
    10000,
  ],
});

app.use(express.static(path.join(__dirname, buildDirName)));

// Static files serving
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, buildDirName, "index.html"));
});

// Endpoint to set additional response delay
app.post("/setResponseDelay", jsonParser, (req, res) => {
  const newDelay = req.body.delay;

  if (newDelay) {
    delay = Number(newDelay);
    res.send({
      succes: true,
      message: `Delay was set to ${delay}ms`,
    });
  } else {
    res.status(400).send({
      success: false,
      message:
        "'delay' field was not provided or incorrect format. Required one is number of milliseconds to delay responses",
    });
  }
  // Log current timestamp to rps array
  rpsArray.push(Date.now());
  // Log delay to prometheus
  httpRequestDurationMicroseconds.labels(req.route.path).observe(delay);
});

// Endpoint for getting main information
app.get("/config", (req, res) => {
  res.send({
    ip_address: ip.address(),
    hostname: os.hostname(),
  });
  // Log current timestamp to rps array
  rpsArray.push(Date.now());
  // Log delay to prometheus
  httpRequestDurationMicroseconds.labels(req.route.path).observe(delay);
});

// Enpdoint to get current server rps
app.get("/rps", (req, res) => {
  rpsArray = rpsArray.filter((timestamp) => Date.now() - timestamp <= 1000);
  res.send({
    rps: rpsArray.length,
  });
});

// Endpoint for testing delay
app.get("/ping", (req, res) => {
  setTimeout(() => {
    res.send({ success: true });
    // Log current timestamp to rps array
    rpsArray.push(Date.now());
    // Log delay to prometheus
    httpRequestDurationMicroseconds.labels(req.route.path).observe(delay);
  }, delay);
});

// Metrics endpoint
app.get("/metrics", (req, res) => {
  res.set("Content-Type", Prometheus.register.contentType);
  Prometheus.register.metrics().then((data) => {
    res.send(data);
    // Log current timestamp to rps array
    rpsArray.push(Date.now());
    // Log delay to prometheus
    httpRequestDurationMicroseconds.labels(req.route.path).observe(delay);
  });
});

// Express server starting
server = app.listen(port);
console.log(`Server started on port ${port}`);

process.on("SIGINT", () => {
  server.close(() => {
    debug("\n SIGINT. Server shitdown");
  });
});
process.on("SIGTERM", () => {
  server.close(() => {
    debug("\n SIGTERM. Server shitdown");
  });
});
