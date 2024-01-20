import { useEffect, useState } from "react";

export const useGetAvgDelay = (host = "http://localhost:3000") => {
  const [delay, setDelay] = useState(0);
  useEffect(() => {
    fetch(`${host}/avgDelay`)
      .then((res) => res.json())
      .then((data) => {
        setDelay(data.avgDelay);
      });
  });
  return { delay };
};
