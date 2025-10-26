import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "../interfaces/users/User";
import { getAllUsers, deleteUserById } from "../services/userService";
import { useAuth } from "../context/AuthContext";
import { confirmDeleteUser } from "../helpers/modals";
import { fullName, normalizeUsers } from "../utils/users/userUtils";

export function useAdminUsers() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // view / edit / delete state
  const [viewId, setViewId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const viewed = useMemo(() => users.find(u => u._id === viewId) || null, [users, viewId]);
  const editingUser = useMemo(() => users.find(u => u._id === editId) || null, [users, editId]);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await getAllUsers();
        const data = normalizeUsers(res?.data);
        if (!ignore) setUsers(data);
      } catch (e: any) {
        const status = e?.response?.status;
        if (status === 401) {
          navigate("/login", { replace: true });
          return;
        }
        if (!ignore) {
          setError(status === 403 ? "forbidden" : "load-failed");
          setUsers([]);
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    if (!isAdmin) {
      setIsLoading(false);
      setError("forbidden");
      setUsers([]);
      return;
    }

    load();
    return () => { ignore = true; };
  }, [isAdmin, navigate]);

  async function handleDelete(user: User) {
    const ok = await confirmDeleteUser(fullName(user));
    if (!ok) return;
    setDeletingId(user._id!);
    try {
      await deleteUserById(user._id!);
      setUsers(prev => prev.filter(u => u._id !== user._id));
      if (viewId === user._id) setViewId(null);
      if (editId === user._id) setEditId(null);
    } catch (e: any) {
      const status = e?.response?.status;
      if (status === 401) {
        navigate("/login", { replace: true });
        return;
      }
      setError("delete-failed");
    } finally {
      setDeletingId(null);
    }
  }

  function replaceUser(updated: User) {
    setUsers(prev => prev.map(u => (u._id === updated._id ? { ...u, ...updated } : u)));
  }

  return { users, isLoading, error,
           viewId, setViewId, viewed,
           editId, setEditId, editingUser,
           deletingId, handleDelete, replaceUser,
  };
}
