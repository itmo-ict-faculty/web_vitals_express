import React, { useRef, useState } from "react";
import "./index.css";
import useGetConfig from "./hooks/useGetConfig";
import useGetRps from "./hooks/useGetRps";
import useDelayWatcher from "./hooks/useDelayWatcher";

const App: React.FC = () => {
  const [pingInterval, setPingInterval] = useState<number>(100);
  const [tempPingInterval, setTempPingInterval] = useState<number>(100);
  const pingIntervalInputRef = useRef<HTMLInputElement>(null);

  const [host, setHost] = useState<string>("http://localhost:3000");
  const hostInputRef = useRef<HTMLInputElement>(null);

  const { config } = useGetConfig({ target: host });
  const { rps } = useGetRps({ target: host });

  const { averageDelay, stopWatcher, startWatcher, timerStatus } =
    useDelayWatcher({
      target: host,
      pingInterval,
    });

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
        <div>Current target is: {host}</div>
        <div className="div-center mt-16">
          <input placeholder={host} ref={hostInputRef} />
          <button
            onClick={() => {
              if (hostInputRef.current !== null) {
                setHost(hostInputRef.current.value);
                if (timerStatus) {
                  stopWatcher();
                  startWatcher();
                }
              } else {
                console.log("Incorrect target in input");
              }
            }}
          >
            Set new target
          </button>
        </div>
      </div>
      <div>
        <div>
          Ping controls. Pinger:{" "}
          {timerStatus !== undefined ? "running" : "stopped"}
        </div>
        <div className="div-center mt-16">
          <button onClick={startWatcher}>Start pinger</button>
          <button onClick={stopWatcher}>Stop pinger</button>
        </div>
      </div>
    </div>
  );
};

export default App;
