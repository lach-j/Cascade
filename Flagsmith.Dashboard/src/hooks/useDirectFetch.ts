import React from "react";

const getBasePath = () => {
  const path = window.location.pathname;
  const parts = path.split("/");
  return parts[1];
};

const useDirectFetch = <T = unknown, TParams = unknown>(
  url: string | ((params: TParams) => string),
  options?: {
    method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  }
) => {
  const path = React.useMemo(() => getBasePath(), []);

  const fetchData = React.useCallback(
    async (
      params: TParams
    ): Promise<{
      result?: T;
      error?: unknown;
    }> => {
      try {
        const resolvedUrl = typeof url === "string" ? url : url(params);
        const response = await fetch(`/${path}/${resolvedUrl}`, {
          method: options?.method ?? "GET",
        });
        const result = await response.json();
        return { result };
      } catch (error) {
        return { error };
      }
    },
    [options, path, url]
  );

  return fetchData;
};

export default useDirectFetch;
