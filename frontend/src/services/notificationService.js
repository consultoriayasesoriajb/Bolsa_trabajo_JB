import { apiFetch } from "./api";

const BASE = "/admin/?resource=notificaciones";

export const getNotificaciones = async () => {
  const result = await apiFetch(`${BASE}&action=listar`);
  return result.data || [];
};

export const getNoLeidas = async () => {
  const result = await apiFetch(`${BASE}&action=no_leidas`);
  return result.data?.total || 0;
};

export const marcarLeida = async (id) => {
  return await apiFetch(`${BASE}&action=marcar_leida`, {
    method: "POST",
    body: JSON.stringify({ id }),
  });
};

export const marcarTodasLeidas = async () => {
  return await apiFetch(`${BASE}&action=marcar_todas_leidas`, {
    method: "POST",
  });
};
