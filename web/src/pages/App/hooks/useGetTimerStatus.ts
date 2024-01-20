import { useEffect, useState } from "react";

export const useGetTimerStatus = (host: string) => {
  const [status, setStatus] = useState(false);
  const [timer, setTimer] = useState<ReturnType<typeof setInterval>>();
  useEffect(() => {
    clearInterval(timer);
    const newTimer = setInterval(() => {
      fetch(`${host}/timerStatus`)
        .then((res) => res.json())
        .then((data) => {
          setStatus(data.status);
        });
    }, 1000);
    setTimer(newTimer);
  }, [host]);

  return status;
};
