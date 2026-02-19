import { useState, useEffect } from "react";
import { getAllProductTypes } from "../services/api/productTypes";


export function useProductTypes() {
  const [productTypes, setProductTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProductTypes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getAllProductTypes();
      setProductTypes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductTypes();
  }, []);

  return {
    productTypes,
    loading,
    error,
    refetch: fetchProductTypes,
  };
}