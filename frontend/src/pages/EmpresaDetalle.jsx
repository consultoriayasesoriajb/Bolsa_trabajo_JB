import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, GlobeAltIcon, BuildingOfficeIcon, UsersIcon, CalendarIcon, MapPinIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import { useEmpresaDetalle } from "../hooks/useEmpresaDetalle";
import StarRating from "../components/evaluaciones/StarRating";
import ComentarioCard from "../components/evaluaciones/ComentarioCard";
import FormularioEvaluacion from "../components/evaluaciones/FormularioEvaluacion";

const BASE_URL = import.meta.env.VITE_API_URL.replace("/api", "");

export default function EmpresaDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    empresa, isLoading, yaEvaluo,
    modalAbierto, abrirModal, cerrarModal,
    form, handleChange, errors,
    enviando, exito, handleEnviar,
  } = useEmpresaDetalle(id);

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

  const beneficios = Array.isArray(empresa.beneficios) ? empresa.beneficios : [];

  const token = localStorage.getItem("token");

  const handleEvaluar = () => {
    if (!token) {
        navigate("/login");
        return;
    }
    abrirModal();
  };

  return (
    <div className="min-h-screen bg-[#f4f6fb] font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-6">

        {/* Volver */}
        <button
          onClick={() => navigate("/evaluaciones")}
          className="flex items-center gap-2 text-sm text-[#6b7a9f] hover:text-[#123498] transition-colors w-fit"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Volver al directorio
        </button>

        {/* Cabecera */}
        <div className="bg-white rounded-2xl border border-[#e8edf5] p-6 shadow-sm flex flex-col sm:flex-row items-start gap-5">
          {empresa.logo_url ? (
            <img
              src={`${BASE_URL}/${empresa.logo_url}`}
              alt={empresa.nombre}
              className="w-20 h-20 rounded-2xl object-cover border border-[#e8edf5] shrink-0"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-[#123498] flex items-center justify-center text-white font-bold text-2xl shrink-0">
              {empresa.nombre.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-[#1c2a52] font-heading">{empresa.nombre}</h1>
            <p className="text-[#6b7a9f] text-sm mt-1">{empresa.sector}</p>
            <div className="flex items-center gap-3 mt-3">
              <StarRating value={Math.round(empresa.promedio || 0)} size="md" />
              <span className="font-bold text-[#1c2a52]">
                {empresa.promedio ? Number(empresa.promedio).toFixed(1) : "—"}
              </span>
              <span className="text-sm text-[#9aa3bd]">
                ({empresa.total_evaluaciones} {empresa.total_evaluaciones === 1 ? "evaluación" : "evaluaciones"})
              </span>
            </div>
          </div>

          {/* Botón evaluar */}
          <button
            type="button"
            onClick={yaEvaluo ? undefined : handleEvaluar}
            disabled={yaEvaluo}
            className={`shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
              yaEvaluo
                ? "bg-[#f4f6fb] text-[#9aa3bd] cursor-not-allowed border border-[#e8edf5]"
                : "bg-[#F46F0B] hover:bg-[#d65f09] text-white shadow-sm"
            }`}
          >
            {yaEvaluo ? "Ya evaluaste esta empresa" : "Evaluar esta empresa"}
          </button>
        </div>

        {/* Información corporativa */}
        <div className="bg-white rounded-2xl border border-[#e8edf5] p-6 shadow-sm flex flex-col gap-4">
          <h2 className="text-sm font-bold text-[#1c2a52] uppercase tracking-wider font-heading">
            Información corporativa
          </h2>

          {empresa.descripcion && (
            <p className="text-sm text-[#6b7a9f] leading-relaxed">{empresa.descripcion}</p>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {empresa.ubicacion && (
              <div className="flex items-center gap-2 text-sm text-[#6b7a9f]">
                <MapPinIcon className="w-4 h-4 text-[#123498] shrink-0" />
                {empresa.ubicacion}
              </div>
            )}
            {empresa.num_empleados && (
              <div className="flex items-center gap-2 text-sm text-[#6b7a9f]">
                <UsersIcon className="w-4 h-4 text-[#123498] shrink-0" />
                {empresa.num_empleados} empleados
              </div>
            )}
            {empresa.anio_fundacion && (
              <div className="flex items-center gap-2 text-sm text-[#6b7a9f]">
                <CalendarIcon className="w-4 h-4 text-[#123498] shrink-0" />
                Fundada en {empresa.anio_fundacion}
              </div>
            )}
            {empresa.sitio_web && (
              <a
                href={empresa.sitio_web}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-[#123498] hover:underline"
              >
                <GlobeAltIcon className="w-4 h-4 shrink-0" />
                Sitio web
              </a>
            )}
            {empresa.ruc && (
              <div className="flex items-center gap-2 text-sm text-[#6b7a9f]">
                <DocumentTextIcon className="w-4 h-4 text-[#123498] shrink-0" />
                RUC: {empresa.ruc}
              </div>
            )}
          </div>

          {beneficios.length > 0 && (
            <div>
              <p className="text-xs font-bold text-[#1c2a52] uppercase tracking-wider mb-2">
                Beneficios destacados
              </p>
              <div className="flex flex-wrap gap-2">
                {beneficios.map(b => (
                  <span key={b} className="px-3 py-1 bg-[#f2f5fc] text-[#123498] text-xs font-semibold rounded-full">
                    {b}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Muro de comentarios */}
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-bold text-[#1c2a52] uppercase tracking-wider font-heading">
            Evaluaciones ({empresa.total_evaluaciones})
          </h2>
          {empresa.evaluaciones?.length > 0 ? (
            empresa.evaluaciones.map(ev => (
              <ComentarioCard key={ev.id} evaluacion={ev} />
            ))
          ) : (
            <div className="bg-white rounded-2xl border border-[#e8edf5] px-6 py-12 text-center text-sm text-[#9aa3bd]">
              Aún no hay evaluaciones. ¡Sé el primero en evaluar esta empresa!
            </div>
          )}
        </div>
      </div>

      {/* Modal formulario */}
      {modalAbierto && (
        <FormularioEvaluacion
          empresa={empresa}
          onCerrar={cerrarModal}
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