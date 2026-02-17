import { useState, useEffect } from "react";
import { getAllContainers } from "../services/api/containers";


export function useContainers() {
  const [containers, setContainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContainers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getAllContainers();
      setContainers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContainers();
  }, []);

  return {
    containers,
    loading,
    error,
    refetch: fetchContainers,
  };
}
