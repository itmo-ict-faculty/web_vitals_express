import { useEffect, useState } from "react";

const useGetRps = ({
  target = "http://localhost:3000",
}: {
  target: string;
}) => {
  const [rps, setRps] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      fetch(`${target}/rps`)
        .then((res) => res.json())
        .then((data) => {
          if (data.rps !== undefined) {
            setRps(data.rps);
          }
        });
    }, 500);
    return () => {
      clearInterval(timer);
    };
  }, [target]);

  return { rps };
};

export default useGetRps;
