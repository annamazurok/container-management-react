import { useState, useEffect } from "react";
import { getAllContainerTypes } from "../services/api/containerTypes";


export function useContainerTypes() {
  const [containerTypes, setContainerTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContainerTypes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getAllContainerTypes();
      setContainerTypes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContainerTypes();
  }, []);

  return {
    containerTypes,
    loading,
    error,
    refetch: fetchContainerTypes,
  };
}
