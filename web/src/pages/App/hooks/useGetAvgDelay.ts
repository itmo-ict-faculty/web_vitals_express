import { useEffect, useState } from "react";

export const useGetAvgDelay = (host = "http://localhost:3000") => {
  const [delay, setDelay] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      fetch(`${host}/avgDelay`)
        .then((res) => res.json())
        .then((data) => {
          setDelay(data.avgDelay);
        });
    }, 500);
    return () => clearInterval(timer);
  });
  return { delay };
};
