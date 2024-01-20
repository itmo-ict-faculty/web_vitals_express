import cors from "cors";
import Timer from "./class/timer";
import express from "express";
import process from "process";
import { debug } from "console";
import os from "os";
import ip from "ip";
import bodyParser from "body-parser";
import Prometheus from "prom-client";

const app = express();

// const buildDirName = "build";
const port = 3000;

let server = undefined;
// Requests response delay. Default - 50ms
let delay = 0;
// Array to store requests timestamps for the last secons
let rpsArray: number[] = [];

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

app.use(cors());

const timer = new Timer();
// @ts-ignore
app.post("/setTarget", jsonParser, (req, res) => {
  const { target, interval, queueSize = 10 } = req.body;
  timer.setInterval(interval);
  timer.setTarget(target);
  timer.setQueueSize(queueSize);
  res.send({ success: true });
});
// @ts-ignore
app.get("/startTimer", (req, res) => {
  timer.start();
  res.send({ success: true });
});

// @ts-ignore
app.get("/stopTimer", (req, res) => {
  timer.stop();
  res.send({ success: true });
});

// @ts-ignore
app.get("/avgDelay", (req, res) => {
  const delay = timer.getAverageDelay();
  res.send({
    avgDelay: delay,
  });
});

app.get("/timerStatus", (req, res) => {
  const timerStatus = timer.getTimerStatus();
  res.send({
    status: timerStatus,
  });
});

// Endpoint for getting main information
// @ts-ignore
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
// @ts-ignore
app.get("/rps", (req, res) => {
  rpsArray = rpsArray.filter((timestamp) => Date.now() - timestamp <= 1000);
  res.send({
    rps: rpsArray.length,
  });
});

// Endpoint for pinging
// @ts-ignore
app.get("/ping", (req, res) => {
  res.send({ success: true });
  // Log current timestamp to rps array
  rpsArray.push(Date.now());
  // Log delay to prometheus
  httpRequestDurationMicroseconds.labels(req.route.path).observe(delay);
});

// Prometheus Metrics endpoint
// @ts-ignore
app.get("/metrics", (req, res) => {
  res.set("Content-Type", Prometheus.register.contentType);
  Prometheus.register.metrics().then((data: unknown) => {
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
  // @ts-ignore
  server.close(() => {
    debug("\n SIGINT. Server shitdown");
  });
});
process.on("SIGTERM", () => {
  // @ts-ignore
  server.close(() => {
    debug("\n SIGTERM. Server shitdown");
  });
});
