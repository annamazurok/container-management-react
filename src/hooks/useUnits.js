import { useState, useEffect } from "react";
import { getAllUnits } from "../services/api/units";


export function useUnits() {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUnits = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getAllUnits();
      setUnits(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  return {
    units,
    loading,
    error,
    refetch: fetchUnits,
  };
}