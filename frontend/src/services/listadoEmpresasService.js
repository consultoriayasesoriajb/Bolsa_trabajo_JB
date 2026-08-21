import { apiFetch } from "./api";

function listarEmpresas(busqueda = "") {
  const params = new URLSearchParams({ action: "empresas" });
  if (busqueda) params.set("busqueda", busqueda);
  return apiFetch(`/evaluaciones/?${params}`).then(r => r.data);
}

function destacadas() {
  return apiFetch(`/evaluaciones/?action=destacadas`).then(r => r.data);
}

function detalle(slug) {
  return apiFetch(`/evaluaciones/?action=detalle&empresa_id=${slug}`).then(r => r.data);
}

function yaEvaluo(empresa_id) {
  return apiFetch(`/evaluaciones/?action=ya_evaluo&empresa_id=${empresa_id}`).then(r => r.data);
}

function crear(datos) {
  return apiFetch("/evaluaciones/?action=crear", {
    method: "POST",
    body: JSON.stringify(datos),
  });
}

// Admin
function adminListar() {
  return apiFetch("/evaluaciones/?action=admin_listar").then(r => r.data);
}

function adminCambiarEstado(id, estado) {
  return apiFetch("/evaluaciones/?action=admin_estado", {
    method: "POST",
    body: JSON.stringify({ id, estado }),
  });
}

function adminEliminar(id) {
  return apiFetch(`/evaluaciones/?action=admin_eliminar&id=${id}`, {
    method: "DELETE",
  });
}

function ofertasEmpresa(slug) {
  return apiFetch(`/evaluaciones/?action=ofertas_empresa&empresa_id=${slug}`)
    .then(r => r.data);
}

export const listadoEmpresasService = {
  listarEmpresas, detalle, yaEvaluo, crear,
  adminListar, adminCambiarEstado, adminEliminar, destacadas, ofertasEmpresa
};