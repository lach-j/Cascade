import React from "react";

const getBasePath = () => {
  const path = window.location.pathname;
  const parts = path.split("/");
  return parts[1];
};

const useFetch = <T = unknown>(url: string) => {
  const [data, setData] = React.useState<null | T>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<null | Error | unknown>(null);

  const path = React.useMemo(() => getBasePath(), []);

  const fetchData = React.useCallback(async () => {
    try {
      const response = await fetch(`/${path}/${url}`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [path, url]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
};

export default useFetch;
