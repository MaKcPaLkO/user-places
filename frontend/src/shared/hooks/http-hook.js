import { useState, useCallback } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const sendRequest = useCallback( async ( url, method = "GET", body = null, headers = {}, cb) => {
    setIsLoading(true);

    try {
      const response = await fetch(url, {
        method,
        body,
        headers
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message)
      }

      setIsLoading(false);
      return responseData;
    } catch (err) {
      setError(err.message || "Something went wrong");
      setIsLoading(false);
      throw err;
    }
  }, []);

  const clearError = () => {
    setError(null);
  }

  return { isLoading, error, sendRequest, clearError }
}
