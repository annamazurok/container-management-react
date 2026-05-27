import { useState, useEffect, useCallback } from "react";
import {
  getAllContainers,
  createContainer,
  updateContainer,
  deleteContainer,
} from "../services/api/containers";

export function useContainers() {
  const [containers, setContainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContainers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAllContainers();
      setContainers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }}, []);

  const handleCreate = async (data) => {
    try {
      const newContainer = await createContainer(data);
      setContainers((prev) => [...prev, newContainer]);
      return { success: true, data: newContainer };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

    const handleUpdate = async (data) => {
    try {
      const updated = await updateContainer(data);
      setContainers((prev) =>
        prev.map((container) =>
          container.id === updated.id ? updated : container
        )
      );
      return { success: true, data: updated };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const handleDelete = async (containerId) => {
    try {
      await deleteContainer(containerId);
      setContainers((prev) =>
        prev.filter((container) => container.id !== containerId)
      );
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchContainers();
  }, [fetchContainers]);

  return {
    containers,
    loading,
    error,
    refetch: fetchContainers,
    createContainer: handleCreate,
    updateContainer: handleUpdate,
    deleteContainer: handleDelete,
  };
}