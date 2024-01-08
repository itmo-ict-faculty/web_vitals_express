import { useEffect, useState } from "react";

const useGetConfig = ({
  target = "http://localhost:3000",
}: {
  target: string;
}) => {
  const [config, setConfig] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch(`${target}/config`)
      .then((res) => res.json())
      .then((data) => {
        setConfig(data);
      })
      .catch((error) => console.error(error));
  }, [target]);
  return { config };
};

export default useGetConfig;
