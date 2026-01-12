import { useEffect, useState } from "react";

const useInitialLoader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");

    if (hasVisited) {
      setLoading(false);
    } else {
      setTimeout(() => {
        localStorage.setItem("hasVisited", "true");
        setLoading(false);
      }, 2000);
    }
  }, []);

  return loading;
};

export default useInitialLoader;
