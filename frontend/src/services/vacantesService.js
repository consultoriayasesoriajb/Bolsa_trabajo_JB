// ─────────────────────────────────────────────────────────────
// vacantesService.js — Servicio de vacantes (API real)
//
// API:
//   GET  /vacantes/?action=listar&cargo=&ubicacion=&modalidad=&tipo_contrato=
//   GET  /vacantes/?action=detalle&id=<int>
//   POST /vacantes/?action=postular (requiere Bearer token, FormData)
// ─────────────────────────────────────────────────────────────

import { apiFetch } from "./api";

function listar(filtros = {}) {
  const params = new URLSearchParams({ action: "listar" });
  if (filtros.cargo) params.set("cargo", filtros.cargo);
  if (filtros.ubicacion) params.set("ubicacion", filtros.ubicacion);
  if (filtros.modalidad) params.set("modalidad", filtros.modalidad);
  if (filtros.tipo_contrato) params.set("tipo_contrato", filtros.tipo_contrato);
  if (filtros.fecha_rango) params.set("fecha_rango", filtros.fecha_rango);
  return apiFetch(`/vacantes/?${params}`).then(r => r.data);
}

function detalle(id) {
  return apiFetch(`/vacantes/?action=detalle&id=${id}`).then(r => r.data);
}

function postular(id, respuestas = {}, cvFile = null) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Debes iniciar sesión para postularte");

  const formData = new FormData();
  formData.append("action", "postular");
  formData.append("vacante_id", id);
  formData.append("respuestas", JSON.stringify(respuestas));
  if (cvFile) formData.append("cv", cvFile);

  return apiFetch("/vacantes/?action=postular", {
    method: "POST",
    body: formData,
  });
}

function sugerencias(termino) {
  return apiFetch(`/vacantes/?action=sugerencias&q=${encodeURIComponent(termino)}`).then(r => r.data);
}

function listarCategorias() {
  return apiFetch("/vacantes/?action=categorias").then(r => r.data);
}

function misPostulaciones() {
  return apiFetch("/vacantes/?action=mis_postulaciones").then(r => r.data);
}

function misPostulacionesDetalle() {
  return apiFetch("/vacantes/?action=mis_postulaciones_detalle").then(r => r.data);
}

function compartir(id) {
  return apiFetch("/vacantes/?action=compartir", {
    method: "POST",
    body: JSON.stringify({ vacante_id: id }),
  });
}

export const vacantesService = { listar, detalle, postular, sugerencias, listarCategorias, misPostulaciones, misPostulacionesDetalle, compartir };
