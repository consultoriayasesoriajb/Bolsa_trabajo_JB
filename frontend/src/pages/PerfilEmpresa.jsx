import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeftIcon,
  GlobeAltIcon,
  BuildingOfficeIcon,
  UsersIcon,
  CalendarIcon,
  MapPinIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { usePerfilEmpresa } from "../hooks/usePerfilEmpresa";
import ComentarioCard from "../components/empresas/ComentarioCard";
import OfertaEmpresaCard from "../components/empresas/OfertaEmpresaCard";
import FormularioEvaluacion from "../components/empresas/FormularioEvaluacion";

const BASE_URL = import.meta.env.VITE_API_URL.replace("/api", "");

export default function PerfilEmpresa() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const {
    empresa,
    ofertas,
    isLoading,
    yaEvaluo,
    pestana,
    setPestana,
    drawerAbierto,
    abrirDrawer,
    cerrarDrawer,
    form,
    handleChange,
    errors,
    enviando,
    exito,
    handleEnviar,
    irAOferta,
  } = usePerfilEmpresa(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f4f6fb] flex items-center justify-center text-[#9aa3bd] text-sm">
        Cargando...
      </div>
    );
  }

  if (!empresa) {
    return (
      <div className="min-h-screen bg-[#f4f6fb] flex items-center justify-center text-[#9aa3bd] text-sm">
        Empresa no encontrada.
      </div>
    );
  }

  const beneficios = Array.isArray(empresa.beneficios)
    ? empresa.beneficios
    : [];

  return (
    <div className="min-h-screen bg-[#f4f6fb] font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Volver */}
        <button
          onClick={() => navigate("/empresas")}
          className="flex items-center gap-2 text-sm text-[#6b7a9f] hover:text-[#123498] transition-colors mb-6 w-fit"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Volver al directorio
        </button>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* ── PANEL IZQUIERDO — Info corporativa ── */}
          <div className="w-full lg:w-72 shrink-0 flex flex-col gap-4">
            {/* Card principal */}
            <div className="bg-white rounded-2xl border border-[#e8edf5] shadow-sm p-5 flex flex-col gap-4">
              {/* Logo + nombre */}
              <div className="flex items-center gap-3">
                {empresa.logo_url ? (
                  <img
                    src={`${BASE_URL}/${empresa.logo_url}`}
                    alt={empresa.nombre}
                    className="w-14 h-14 rounded-xl object-cover border border-[#e8edf5] shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-[#123498] flex items-center justify-center text-white font-black text-xl shrink-0">
                    {empresa.nombre.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <h1 className="text-base font-black text-[#1c2a52] font-heading leading-snug">
                    {empresa.nombre}
                  </h1>
                  <p className="text-xs text-[#6b7a9f]">{empresa.sector}</p>
                </div>
              </div>

              {/* Promedio */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) =>
                    s <= Math.round(empresa.promedio || 0) ? (
                      <StarSolid key={s} className="w-4 h-4 text-[#FDB907]" />
                    ) : (
                      <StarIcon key={s} className="w-4 h-4 text-[#e8edf5]" />
                    ),
                  )}
                </div>
                <span className="font-black text-[#1c2a52] text-sm">
                  {empresa.promedio ? Number(empresa.promedio).toFixed(1) : "—"}
                </span>
                <span className="text-xs text-[#9aa3bd]">
                  · {empresa.total_evaluaciones}{" "}
                  {empresa.total_evaluaciones === 1 ? "opinión" : "opiniones"}
                </span>
              </div>

              {/* Datos corporativos */}
              <div className="flex flex-col gap-2 text-xs text-[#6b7a9f]">
                {empresa.ubicacion && (
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="w-4 h-4 text-[#123498] shrink-0" />
                    {empresa.ubicacion}
                  </div>
                )}
                {empresa.num_empleados && (
                  <div className="flex items-center gap-2">
                    <UsersIcon className="w-4 h-4 text-[#123498] shrink-0" />
                    {empresa.num_empleados} empleados
                  </div>
                )}
                {empresa.anio_fundacion && (
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-[#123498] shrink-0" />
                    Fundada en {empresa.anio_fundacion}
                  </div>
                )}
                {empresa.sitio_web && (
                  <a
                    href={empresa.sitio_web}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#123498] hover:underline"
                  >
                    <GlobeAltIcon className="w-4 h-4 shrink-0" />
                    Sitio web
                  </a>
                )}
                {empresa.ruc && (
                  <div className="flex items-center gap-2">
                    <BuildingOfficeIcon className="w-4 h-4 text-[#123498] shrink-0" />
                    RUC: {empresa.ruc}
                  </div>
                )}
              </div>

              {/* Descripción */}
              {empresa.descripcion && (
                <p className="text-xs text-[#6b7a9f] leading-relaxed border-t border-[#f4f6fb] pt-3">
                  {empresa.descripcion}
                </p>
              )}
            </div>

            {/* Beneficios */}
            {beneficios.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#e8edf5] shadow-sm p-5">
                <p className="text-xs font-black text-[#1c2a52] uppercase tracking-wider mb-3">
                  Beneficios
                </p>
                <div className="flex flex-wrap gap-2">
                  {beneficios.map((b) => (
                    <span
                      key={b}
                      className="px-3 py-1 bg-[#f2f5fc] text-[#123498] text-xs font-semibold rounded-full"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── PANEL DERECHO — Pestañas ── */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            {/* Tabs + botón calificar */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setPestana("ofertas")}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                  pestana === "ofertas"
                    ? "bg-[#123498] text-white"
                    : "bg-white border border-[#e8edf5] text-[#6b7a9f] hover:border-[#123498] hover:text-[#123498]"
                }`}
              >
                Ofertas
                <span
                  className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full font-black ${
                    pestana === "ofertas" ? "bg-white/20" : "bg-[#f4f6fb]"
                  }`}
                >
                  {ofertas.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPestana("evaluaciones")}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                  pestana === "evaluaciones"
                    ? "bg-[#123498] text-white"
                    : "bg-white border border-[#e8edf5] text-[#6b7a9f] hover:border-[#123498] hover:text-[#123498]"
                }`}
              >
                Evaluaciones
                <span
                  className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full font-black ${
                    pestana === "evaluaciones" ? "bg-white/20" : "bg-[#f4f6fb]"
                  }`}
                >
                  {empresa.total_evaluaciones}
                </span>
              </button>

              {/* Botón calificar */}
              <button
                type="button"
                onClick={abrirDrawer}
                className={`ml-auto flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                  yaEvaluo
                    ? "bg-[#f4f6fb] text-[#9aa3bd] cursor-not-allowed border border-[#e8edf5]"
                    : "bg-[#F46F0B] hover:bg-[#d65f09] text-white shadow-sm"
                }`}
              >
                <StarSolid className="w-4 h-4" />
                {yaEvaluo ? "Ya calificaste" : "Calificar empresa"}
              </button>
            </div>

            {/* Contenido de la pestaña activa */}
            {pestana === "ofertas" && (
              <div className="flex flex-col gap-3">
                {ofertas.length > 0 ? (
                  ofertas.map((oferta) => (
                    <OfertaEmpresaCard
                      key={oferta.id}
                      oferta={oferta}
                      onVerEmpleo={() => irAOferta(oferta.id)}
                    />
                  ))
                ) : (
                  <div className="bg-white rounded-2xl border border-[#e8edf5] px-6 py-12 text-center text-sm text-[#9aa3bd]">
                    Esta empresa no tiene ofertas activas en este momento.
                  </div>
                )}
              </div>
            )}

            {pestana === "evaluaciones" && (
              <div className="flex flex-col gap-3">
                {empresa.evaluaciones?.length > 0 ? (
                  empresa.evaluaciones.map((ev) => (
                    <ComentarioCard key={ev.id} evaluacion={ev} />
                  ))
                ) : (
                  <div className="bg-white rounded-2xl border border-[#e8edf5] px-6 py-12 text-center text-sm text-[#9aa3bd]">
                    Aún no hay evaluaciones. ¡Sé el primero en calificar esta
                    empresa!
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Drawer de calificar */}
      {drawerAbierto && (
        <FormularioEvaluacion
          modo="drawer"
          onCerrar={cerrarDrawer}
          empresa={empresa}
          form={form}
          handleChange={handleChange}
          errors={errors}
          enviando={enviando}
          exito={exito}
          handleEnviar={handleEnviar}
        />
      )}
    </div>
  );
}
