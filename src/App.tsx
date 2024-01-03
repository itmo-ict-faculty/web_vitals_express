import "./App.css";
import { useCallback, useEffect, useRef, useState } from "react";
import Queue from "./queue";

function App() {
  useEffect(() => {
    let counter = 0;
    console.log("---------------------------------------------------------");
    console.info(
      "If you see this '(₌ ᵕ̣̣̣̣̣ ᆽ ᵕ̣̣̣̣̣₌)' somewhere on your page -> this means you did something wrong"
    );
    console.log("---------------------------------------------------------");
    const interval = setInterval(() => {
      console.log(`${counter++}. This app is still working`);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const [config, setConfig] = useState<Record<string, string>>({});

  const [averageDelay, setAverageDelay] = useState<number>(0);
  const [rps, setRps] = useState<number>(0);

  const [pingInterval, setPingInterval] = useState<number>(100);
  const [tempPingInterval, setTempPingInterval] = useState<number>(100);

  // Response delay in ms
  const [delay, setDelay] = useState<number>(50);

  const pingIntervalInputRef = useRef<HTMLInputElement>(null);

  const setNewResponseDelay = useCallback(() => {
    fetch(`${window.origin}/setResponseDelay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ delay }),
    });
  }, [delay]);

  // Start coutner for requests average response time
  useEffect(() => {
    const requests = new Queue({ maxSize: 10 });

    const timer = setInterval(() => {
      const sendTime = Date.now();

      fetch(`${window.origin}/ping`).then(() => {
        const responseTime = Date.now();

        requests.push(responseTime - sendTime);

        setAverageDelay(requests.getAverage());
      });
    }, pingInterval);

    return () => {
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pingInterval]);

  useEffect(() => {
    fetch(`${window.origin}/config`)
      .then((res) => res.json())
      .then((data) => {
        setConfig(data);
      })
      .catch((error) => console.error(error));

    // Query server's current RPS
    const timer = setInterval(() => {
      fetch(`${window.origin}/rps`)
        .then((res) => res.json())
        .then((data) => {
          if (data.rps) {
            setRps(data.rps);
          }
        });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

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
      <div>
        <div>Server response delay</div>
        <input
          value={delay}
          onChange={(e) => setDelay(Number(e.target.value))}
        />
        <button onClick={setNewResponseDelay}>Set new delay</button>
      </div>
    </div>
  );
}

export default App;
