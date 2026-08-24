import { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import {
  StarIcon,
  HeartIcon,
  MapPinIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import DetalleVacante from "./DetalleVacante";
import PreguntasFiltro from "./PreguntasFiltro";
import ConfirmacionCV from "./ConfirmacionCV";

const BASE_URL = import.meta.env.VITE_API_URL?.replace("/api", "") ?? "";

// ── Sub-componente: estrellas compactas ──────────────────────
function MiniStars({ promedio, total }) {
  const rounded = Math.round(Number(promedio) || 0);
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((s) =>
          s <= rounded ? (
            <StarSolid key={s} className="w-3 h-3 text-[#FDB907]" />
          ) : (
            <StarIcon key={s} className="w-3 h-3 text-gray-200" />
          ),
        )}
      </div>
      <span className="text-xs font-semibold text-gray-600">
        {Number(promedio).toFixed(1)}
      </span>
      {total > 0 && (
        <span className="text-xs text-gray-400">
          ({total} {total === 1 ? "opinión" : "opiniones"})
        </span>
      )}
    </div>
  );
}

// ── Sub-componente: botón de acción principal ────────────────
function BotonPostular({ expirada, yaPostulada, onPostular }) {
  if (expirada) {
    return (
      <span className="flex items-center gap-1.5 bg-red-50 text-red-400 font-semibold text-sm px-5 py-2.5 rounded-full cursor-default border border-red-100 shrink-0">
        Oferta cerrada
      </span>
    );
  }
  if (yaPostulada) {
    return (
      <span className="flex items-center gap-1.5 bg-gray-100 text-gray-400 font-semibold text-sm px-5 py-2.5 rounded-full cursor-default border border-gray-200 shrink-0">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Ya postulaste
      </span>
    );
  }
  return (
    <button
      type="button"
      onClick={onPostular}
      className="group relative overflow-hidden rounded-full px-7 py-2.5 text-white font-bold text-base shadow-md hover:shadow-lg active:scale-[0.97] transition-[transform,box-shadow] duration-200 shrink-0 cursor-pointer tracking-wide"
      style={{ background: "linear-gradient(to right, #fb923c, #f97316)" }}
    >
      {/* Overlay sólido que desliza desde la derecha al hacer hover */}
      <span
        className="absolute inset-0 translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out"
        style={{ backgroundColor: "#f97316" }}
        aria-hidden="true"
      />
      <span className="relative z-10">Postularme</span>
    </button>
  );
}

// ── Componente principal ─────────────────────────────────────
export default function PanelDetalle({
  estado,
  vacante,
  error,
  onPostular,
  onReintentar,
  onVolver,
  postulacionStep,
  respuestasFiltro,
  setRespuestasFiltro,
  onPreguntasCompletadas,
  onPostularConCV,
  onCancelarPostulacion,
  onVolverAPreguntas,
  postulando,
  yaPostulada = false,
  esGuardada = false,
  onGuardar,
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const bodyRef = useRef(null);

  const handleScroll = useCallback(() => {
    const scrollTop = bodyRef.current?.scrollTop ?? 0;
    setIsScrolled((prev) => {
      if (scrollTop > 50 && !prev) return true;
      if (scrollTop < 10 && prev) return false;
      return prev;
    });
  }, []);

  const tieneVacante = estado === "detail" && vacante;
  const expirada =
    vacante?.fecha_expiracion &&
    new Date(vacante.fecha_expiracion) <= new Date();
  const tieneRating =
    vacante?.promedio != null && Number(vacante?.total_evaluaciones) > 0;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* ── Header siempre estático ── */}
      <div className="shrink-0 bg-white shadow-[0_4px_8px_-2px_rgba(0,0,0,0.06)]">
        {tieneVacante ? (
          /* ── Hero header con info de la vacante ── */
          <div
            className={`px-5 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
              isScrolled ? "pt-3 pb-3 gap-1.5" : "pt-4 pb-4 gap-3"
            }`}
          >
            {/* Botón volver mobile — se oculta al colapsar */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isScrolled ? "max-h-0 opacity-0" : "max-h-10 opacity-100"
              }`}
            >
              {onVolver && (
                <button
                  type="button"
                  onClick={onVolver}
                  className="lg:hidden self-start p-1.5 -ml-1 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                  title="Volver a la lista"
                >
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Título — siempre visible, se achica al colapsar */}
            <h2
              className={`font-heading font-black text-[#123498] tracking-tight uppercase leading-tight transition-all duration-300 ${
                isScrolled ? "text-base line-clamp-1" : "text-base line-clamp-2"
              }`}
            >
              {vacante.titulo}
            </h2>

            {/* Fila expandida: logo + empresa + estrellas — se oculta al colapsar */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isScrolled ? "max-h-0 opacity-0" : "max-h-20 opacity-100"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {vacante.empresa_slug ? (
                  <Link
                    to={`/empresas/${vacante.empresa_slug}`}
                    className="flex shrink-0"
                  >
                    {vacante.logo_url ? (
                      <img
                        src={`${BASE_URL}/${vacante.logo_url}`}
                        alt={vacante.empresa_nombre}
                        className="w-15 h-15 rounded-lg object-contain border border-gray-100 bg-white p-0.5 shadow-sm"
                      />
                    ) : (
                      <div className="w-15 h-15 rounded-lg bg-naranja flex items-center justify-center text-white font-black text-xs shadow-sm">
                        {vacante.empresa_nombre?.slice(0, 2).toUpperCase() ??
                          "EM"}
                      </div>
                    )}
                  </Link>
                ) : vacante.logo_url ? (
                  <img
                    src={`${BASE_URL}/${vacante.logo_url}`}
                    alt={vacante.empresa_nombre}
                    className="w-9 h-9 rounded-lg object-contain border border-gray-100 bg-white p-0.5 shrink-0 shadow-sm"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-lg bg-naranja flex items-center justify-center text-white font-black text-xs shrink-0 shadow-sm">
                    {vacante.empresa_nombre?.slice(0, 2).toUpperCase() ?? "EM"}
                  </div>
                )}

                <div className="flex items-center gap-2 flex-wrap min-w-0">
                  {vacante.empresa_slug ? (
                    <Link
                      to={`/empresas/${vacante.empresa_slug}`}
                      className="text-base font-bold text-naranja truncate hover:underline"
                    >
                      {vacante.empresa_nombre}
                    </Link>
                  ) : (
                    <span className="text-base font-bold text-naranja truncate">
                      {vacante.empresa_nombre}
                    </span>
                  )}

                  {vacante.empresa_slug && (
                    <Link
                      to={`/empresas/${vacante.empresa_slug}`}
                      title="Ver perfil de la empresa"
                      className="p-0.5 rounded hover:bg-orange-50 transition-colors cursor-pointer shrink-0"
                    >
                      <ArrowTopRightOnSquareIcon
                        className="w-4 h-4 text-naranja/60 hover:text-naranja transition-colors"
                        strokeWidth={2}
                      />
                    </Link>
                  )}
                  {tieneRating && (
                    <MiniStars
                      promedio={vacante.promedio}
                      total={vacante.total_evaluaciones}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Ubicación expandida — se oculta al colapsar */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isScrolled ? "max-h-0 opacity-0" : "max-h-8 opacity-100"
              }`}
            >
              {vacante.ubicacion && (
                <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                  <MapPinIcon
                    className="w-3.5 h-3.5 shrink-0 text-gray-400"
                    strokeWidth={2}
                  />
                  {vacante.ubicacion}
                </div>
              )}
            </div>

            {/* Fila compacta: empresa · ubicación — solo visible al colapsar */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isScrolled ? "max-h-8 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs text-gray-500 truncate">
                {vacante.empresa_slug ? (
                  <Link
                    to={`/empresas/${vacante.empresa_slug}`}
                    className="font-semibold text-naranja truncate hover:underline"
                  >
                    {vacante.empresa_nombre}
                  </Link>
                ) : (
                  <span className="font-semibold text-naranja truncate">
                    {vacante.empresa_nombre}
                  </span>
                )}
                {vacante.ubicacion && (
                  <>
                    <span className="text-gray-300">·</span>
                    <MapPinIcon
                      className="w-3 h-3 shrink-0 text-gray-400"
                      strokeWidth={2}
                    />
                    <span className="truncate">{vacante.ubicacion}</span>
                  </>
                )}
              </div>
            </div>

            {/* Acciones: postularme + favorito — siempre visibles */}
            <div className="flex items-center gap-2">
              <BotonPostular
                expirada={expirada}
                yaPostulada={yaPostulada}
                onPostular={onPostular}
              />
              <button
                type="button"
                onClick={() => onGuardar?.(vacante.id)}
                title={esGuardada ? "Quitar de favoritos" : "Guardar vacante"}
                className={`w-10 h-10 rounded-full flex items-center justify-center active:scale-95 transition-all cursor-pointer border ${
                  esGuardada
                    ? "bg-red-50 border-red-200 hover:bg-red-100"
                    : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                }`}
              >
                <HeartIcon
                  className="w-5 h-5 transition-colors"
                  fill={esGuardada ? "#ef4444" : "none"}
                  stroke={esGuardada ? "#ef4444" : "#9ca3af"}
                  strokeWidth={2}
                />
              </button>
            </div>
          </div>
        ) : (
          /* ── Header simple para estados loading / empty / error ── */
          <div className="px-6 py-3 flex items-center gap-2">
            {onVolver && (
              <button
                type="button"
                onClick={onVolver}
                className="lg:hidden p-1.5 rounded-md hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
                title="Volver a la lista"
              >
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}
            <h2 className="font-montserrat font-semibold text-azul text-sm truncate flex-1">
              Detalle de la oferta
            </h2>
          </div>
        )}

        {/* Indicador del paso actual (solo durante el flujo de postulación) */}
        {postulacionStep && tieneVacante && (
          <div className="px-5 pb-3 flex items-center gap-2">
            {["preguntas", "cv", "exito"].map((step, i) => {
              const steps = ["preguntas", "cv", "exito"];
              const currentIdx = steps.indexOf(postulacionStep);
              const stepIdx = i;
              const isActive = step === postulacionStep;
              const isDone = stepIdx < currentIdx;
              const labels = ["Preguntas", "Tu CV", "Listo"];
              return (
                <div key={step} className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                        isDone
                          ? "bg-green-500 text-white"
                          : isActive
                            ? "bg-naranja text-white"
                            : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {isDone ? (
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        i + 1
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        isActive
                          ? "text-naranja"
                          : isDone
                            ? "text-green-500"
                            : "text-gray-300"
                      }`}
                    >
                      {labels[i]}
                    </span>
                  </div>
                  {i < 2 && (
                    <div
                      className={`h-px w-6 transition-colors ${
                        stepIdx < currentIdx ? "bg-green-400" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Cuerpo scrolleable ── */}
      <div
        ref={bodyRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto"
      >
        {/* Paso: preguntas de filtrado */}
        {postulacionStep === "preguntas" && vacante && (
          <PreguntasFiltro
            preguntas={vacante.preguntas_filtro || []}
            respuestas={respuestasFiltro}
            onChange={(id, valor) =>
              setRespuestasFiltro((prev) => ({ ...prev, [id]: valor }))
            }
            onSiguiente={onPreguntasCompletadas}
            onAtras={onCancelarPostulacion}
          />
        )}

        {/* Paso: confirmar CV */}
        {postulacionStep === "cv" && (
          <ConfirmacionCV
            onPostular={onPostularConCV}
            onAtras={onVolverAPreguntas}
            postulando={postulando}
          />
        )}

        {/* Paso: éxito */}
        {postulacionStep === "exito" && (
          <div className="flex flex-col items-center justify-center text-center px-8 py-12 space-y-6 h-full">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center animate-chip-in">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-azul">
                ¡Postulación enviada con éxito!
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Hemos recibido tu postulación para{" "}
                <strong className="text-azul">{vacante?.titulo}</strong>
              </p>
            </div>
            <div className="bg-linear-to-br from-blue-50 to-indigo-50/40 border border-blue-100 rounded-xl p-5 max-w-sm space-y-3 text-left w-full">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">
                  La empresa <strong>{vacante?.empresa_nombre}</strong> revisará
                  tu CV y las respuestas proporcionadas.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">
                  Te sugerimos estar pendiente de tu bandeja de entrada para
                  cualquier actualización.
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              Gracias por tu interés, ¡te deseamos mucho éxito!
            </p>
            <button
              type="button"
              onClick={onVolver}
              className="bg-naranja hover:bg-orange-600 text-white font-semibold text-sm px-8 py-3 rounded-xl transition-colors shadow-sm cursor-pointer"
            >
              Seguir buscando empleos
            </button>
          </div>
        )}

        {/* Estado: sin selección */}
        {!postulacionStep && estado === "empty" && (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <svg
              className="w-10 h-10 text-gray-200 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-gray-400 text-xs">Selecciona una vacante</p>
          </div>
        )}

        {/* Estado: cargando */}
        {!postulacionStep && estado === "loading" && (
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <svg
              className="animate-spin h-5 w-5 text-naranja"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <p className="text-xs text-gray-400">Cargando...</p>
          </div>
        )}

        {/* Estado: detalle de la vacante */}
        {!postulacionStep && estado === "detail" && vacante && (
          <DetalleVacante
            vacante={vacante}
            onPostular={onPostular}
            yaPostulada={yaPostulada}
            expirada={expirada}
            esGuardada={esGuardada}
            onGuardar={onGuardar}
          />
        )}

        {/* Estado: error */}
        {!postulacionStep && estado === "error" && (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <svg
              className="w-8 h-8 text-red-300 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <p className="text-xs text-red-500 font-medium">
              {error || "Error al cargar"}
            </p>
            {onReintentar && (
              <button
                type="button"
                onClick={onReintentar}
                className="mt-2 text-xs text-azul-marino hover:underline font-semibold"
              >
                Reintentar
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
