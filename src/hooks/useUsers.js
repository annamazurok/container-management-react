import { useState, useEffect, useCallback } from "react";
import {
  getAllUsers,
  createUser,
  updateUser,
  confirmUser,
  deleteUser,
} from "../services/api/users";

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreate = async (data) => {
    try {
      const newUser = await createUser(data);
      setUsers((prev) => [...prev, newUser]);
      return { success: true, data: newUser };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const handleUpdate = async (data) => {
    try {
      const updated = await updateUser(data);
      setUsers((prev) =>
        prev.map((user) => (user.id === updated.id ? updated : user))
      );
      return { success: true, data: updated };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const handleConfirm = async (userId) => {
    try {
      const updated = await confirmUser(userId);
      setUsers((prev) =>
        prev.map((user) => (user.id === updated.id ? updated : user))
      );
      return { success: true, data: updated };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
    createUser: handleCreate,
    updateUser: handleUpdate,
    confirmUser: handleConfirm,
    deleteUser: handleDelete,
  };
}