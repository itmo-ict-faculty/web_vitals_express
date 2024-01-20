import { useCallback } from "react";

export const useGetTimerControls = (host = "http://localhost:3000") => {
  const configurePinger = useCallback(
    (target: string, interval: number) => {
      console.log("Setting target: ", target);
      console.log("interval:", interval);

      fetch(`${host}/setTarget`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          target,
          interval,
          queuSize: 10,
        }),
      });
    },
    [host]
  );

  const startTimer = useCallback(() => {
    fetch(`${host}/startTimer`);
  }, [host]);

  const stopTimer = useCallback(() => {
    fetch(`${host}/stopTimer`);
  }, []);

  return { configurePinger, startTimer, stopTimer };
};
