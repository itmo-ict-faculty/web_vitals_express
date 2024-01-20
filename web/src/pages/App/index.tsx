import React, { useRef, useState } from "react";
import "./index.css";
import useGetConfig from "./hooks/useGetConfig";
import useGetRps from "./hooks/useGetRps";
import { useGetAvgDelay } from "./hooks/useGetAvgDelay";
import { useGetTimerStatus } from "./hooks/useGetTimerStatus";
import { useGetTimerControls } from "./hooks/useGetTimerControls";

const App: React.FC = () => {
  const [pingInterval, setPingInterval] = useState<number>(100);
  const [tempPingInterval, setTempPingInterval] = useState<number>(100);
  const pingIntervalInputRef = useRef<HTMLInputElement>(null);

  const [watchTarget, setWatchTarget] = useState<string>(
    "http://localhost:3000"
  );
  const watchTargetInputRef = useRef<HTMLInputElement>(null);

  const [pingTarget, setPingTarget] = useState<string>("http://localhost:3000");
  const pingTargetInputRef = useRef<HTMLInputElement>(null);

  // const [host, setHost] = useState<string>("http://localhost:3000");
  // const hostInputRef = useRef<HTMLInputElement>(null);

  const { config } = useGetConfig({ target: watchTarget });
  const { rps } = useGetRps({ target: pingTarget });

  const { delay: averageDelay } = useGetAvgDelay(watchTarget);
  const timerStatus = useGetTimerStatus(watchTarget);

  const { configurePinger, startTimer, stopTimer } =
    useGetTimerControls(watchTarget);

  return (
    <div className="App">
      <div>Hi there!</div>
      <div>Container name is: {config?.hostname || "(₌ ᵕ̣̣̣̣̣ ᆽ ᵕ̣̣̣̣̣₌)"}</div>
      <div>
        Container was started with IP: {config?.ip_address || "(₌ ᵕ̣̣̣̣̣ ᆽ ᵕ̣̣̣̣̣₌)"}
      </div>
      <div>
        Average response delay is (web {"->"} back {"->"} web):{" "}
        {averageDelay.toFixed(2)}ms
      </div>
      <div>Server overall RPS (excluding 2rps from this request): {rps}</div>
      <div>
        <div>Set new ping interval</div>
        <div className="div-center mt-16">
          <input
            value={tempPingInterval}
            onChange={(e) => setTempPingInterval(Number(e.target.value))}
            ref={pingIntervalInputRef}
          />
          <button
            onClick={() => {
              setPingInterval(tempPingInterval);
            }}
          >
            Apply
          </button>
        </div>
      </div>
      <div>
        <div>Current target is: {watchTarget} (Source container)</div>
        <div className="div-center mt-16">
          <input placeholder={watchTarget} ref={watchTargetInputRef} />
          <button
            onClick={() => {
              if (watchTargetInputRef.current !== null) {
                setWatchTarget(watchTargetInputRef.current.value);
              } else {
                console.log("Incorrect target in input");
              }
            }}
          >
            Set new source target
          </button>
        </div>
      </div>
      <div>
        <div>Backend target is: {pingTarget} (Target container)</div>
        <div className="div-center mt-16">
          <input placeholder={pingTarget} ref={pingTargetInputRef} />
          <button
            onClick={() => {
              if (pingTargetInputRef.current !== null) {
                setPingTarget(pingTargetInputRef.current.value);
              } else {
                console.log("Incorrect target in input");
              }
            }}
          >
            Set new reciever target
          </button>
        </div>
      </div>
      <button onClick={() => configurePinger(pingTarget, pingInterval)}>
        Send reciever target to backend
      </button>
      <div>
        <div>
          Ping controls. Pinger:{" "}
          {timerStatus !== undefined ? "running" : "stopped"}
        </div>
        <div className="div-center mt-16">
          <button onClick={startTimer}>Start pinger</button>
          <button onClick={stopTimer}>Stop pinger</button>
        </div>
      </div>
    </div>
  );
};

export default App;
