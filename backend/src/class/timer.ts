import Queue from "./queue";
import fetch from "node-fetch";

class Timer {
  // @ts-ignore
  _timer: ReturnType<typeof setInterval> = undefined;
  _interval = 100;
  _target = "http://localhost:3000";
  _queue = new Queue({});
  _queueSize = 10;
  _averageDelay = 0;
  constructor() {}

  setQueueSize(queueSize: number) {
    this._queueSize = queueSize;
  }

  setInterval(interval: number) {
    this._interval = interval;
  }

  setTarget(target: string) {
    this._target = target;
  }
  /**
   * @description Starts new timer after killing previous. Rely on interval and target
   *
   */
  start() {
    if (!this._target) {
      console.log("!ERR target is unset");

      return -1;
    }
    clearInterval(this._timer);
    this._queue = new Queue({ maxSize: this._queueSize });
    console.log("Starting timer");

    const timer = setInterval(() => {
      const reqTime = Date.now();

      fetch(`${this._target}/ping`).then(() => {
        const resTime = Date.now();

        this._queue.push(resTime - reqTime);
        this._averageDelay = this._queue.getAverage();
      });
    }, this._interval);
    this._timer = timer;
  }

  stop() {
    console.log("Stopping timer");

    clearInterval(this._timer);
    // @ts-ignore
    this._timer = undefined;
  }

  getAverageDelay() {
    return this._averageDelay;
  }

  getTimerStatus() {
    return this._timer !== undefined;
  }
}

export default Timer;
