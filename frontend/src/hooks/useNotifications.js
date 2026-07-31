import { useState, useEffect, useCallback, useRef } from "react";
import {
  getNotificaciones,
  getNoLeidas,
  marcarLeida,
  marcarTodasLeidas,
} from "../services/notificationService";

const POLL_INTERVAL = 30000;

export function useNotifications() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [noLeidasCount, setNoLeidasCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef(null);

  const fetchCount = useCallback(async () => {
    try {
      const count = await getNoLeidas();
      setNoLeidasCount(count);
    } catch {
      // silenciar errores de polling
    }
  }, []);

  const fetchNotificaciones = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getNotificaciones();
      setNotificaciones(data);
    } catch {
      // silenciar
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCount();
    intervalRef.current = setInterval(fetchCount, POLL_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [fetchCount]);

  const toggle = useCallback(() => {
    setIsOpen((prev) => {
      if (!prev) {
        fetchNotificaciones();
      }
      return !prev;
    });
  }, [fetchNotificaciones]);

  const close = useCallback(() => setIsOpen(false), []);

  const handleMarcarLeida = useCallback(async (id) => {
    try {
      await marcarLeida(id);
      setNotificaciones((prev) =>
        prev.map((n) => (n.id === id ? { ...n, leida: 1 } : n))
      );
      setNoLeidasCount((prev) => Math.max(0, prev - 1));
    } catch {
      // silenciar
    }
  }, []);

  const handleMarcarTodasLeidas = useCallback(async () => {
    try {
      await marcarTodasLeidas();
      setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: 1 })));
      setNoLeidasCount(0);
    } catch {
      // silenciar
    }
  }, []);

  return {
    notificaciones,
    noLeidasCount,
    isOpen,
    loading,
    toggle,
    close,
    marcarLeida: handleMarcarLeida,
    marcarTodasLeidas: handleMarcarTodasLeidas,
  };
}
