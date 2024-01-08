import { useEffect, useMemo, useState } from "react";
import Queue from "../../../clases/queue";

type UseDelayWatcherProps = {
  target: string;
  pingInterval?: number;
};

const useDelayWatcher = ({
  target = "http://localhost:3000",
  pingInterval = 100,
}: UseDelayWatcherProps) => {
  const [averageDelay, setAverageDelay] = useState<number>(0);
  const [watcherTimer, setWatcherTimer] =
    useState<ReturnType<typeof setInterval>>();

  const startWatcher = () => {
    const requests = new Queue({ maxSize: 10 });

    const timer = setInterval(() => {
      const sendTime = Date.now();

      fetch(`${target}/ping`).then(() => {
        const responseTime = Date.now();

        requests.push(responseTime - sendTime);
        setAverageDelay(requests.getAverage());
      });
    }, pingInterval);
    clearInterval(watcherTimer);
    setWatcherTimer(timer);
  };

  const stopWatcher = () => {
    clearInterval(watcherTimer);
    setWatcherTimer(undefined);
  };

  const timerStatus = useMemo(() => watcherTimer !== undefined, [watcherTimer]);

  useEffect(() => {
    if (timerStatus) {
      stopWatcher();
      startWatcher();
    }
  }, [pingInterval]);

  return { averageDelay, startWatcher, stopWatcher, timerStatus };
};

export default useDelayWatcher;
