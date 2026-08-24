import {
  MapPinIcon,
  HeartIcon,
  BuildingOffice2Icon,
} from "@heroicons/react/24/outline";

const MAP_TIPO_ETIQUETA = {
  "Tiempo completo": {
    label: "Jornada Completa",
    clase: "bg-blue-50 text-blue-700",
  },
  "Medio tiempo": {
    label: "Medio tiempo",
    clase: "bg-orange-50 text-orange-700",
  },
  Prácticas: { label: "Prácticas", clase: "bg-teal-50 text-teal-700" },
  Temporal: { label: "Temporal", clase: "bg-purple-50 text-purple-700" },
  Permanente: { label: "Permanente", clase: "bg-green-50 text-green-700" },
};

const MAP_MODALIDAD_ETIQUETA = {
  Presencial: { label: "Presencial", clase: "bg-amber-50 text-amber-700" },
  Remoto: { label: "Remoto", clase: "bg-sky-50 text-sky-700" },
  Híbrida: { label: "Híbrida", clase: "bg-indigo-50 text-indigo-700" },
};

function getFechaRelativa(fechaStr) {
  if (!fechaStr) return "No especificada";

  const fecha = new Date(fechaStr.replace(" ", "T"));
  const ahora = new Date();

  // Días de diferencia (en días enteros, sin hora)
  const inicioHoy = new Date(
    ahora.getFullYear(),
    ahora.getMonth(),
    ahora.getDate(),
  );
  const inicioFecha = new Date(
    fecha.getFullYear(),
    fecha.getMonth(),
    fecha.getDate(),
  );
  const diffMs = inicioHoy - inicioFecha;
  const diffDias = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDias === 0) return "Hoy";
  if (diffDias === 1) return "Ayer";
  if (diffDias < 7) return `Hace ${diffDias} días`;
  if (diffDias < 14) return "Hace 1 semana";

  // Más de 2 semanas → fecha formateada
  return fecha.toLocaleDateString("es-PE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function TarjetaVacante({
  vacante,
  seleccionada = false,
  onClick,
  esGuardada = false,
  onGuardar,
}) {
  const fechaPublicacion = getFechaRelativa(vacante.fecha_publicacion);
  const etiqueta = MAP_TIPO_ETIQUETA[vacante.tipo_contrato];
  const modalidadEtiqueta = MAP_MODALIDAD_ETIQUETA[vacante.modalidad];
  const nombreEmpresa = vacante.empresa_nombre || vacante.empresa;

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      className={`w-full text-left p-5 rounded-xl transition-all cursor-pointer relative ${
        seleccionada
          ? "border border-azul bg-white shadow-md"
          : "border border-gray-300/70 bg-white hover:border-gray-400/60 shadow-[0_2px_10px_rgba(0,0,0,0.07)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.11)]"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          {/* Título */}
          <h3 className="font-montserrat font-extrabold text-azul text-base leading-snug mb-2 truncate">
            {vacante.titulo}
          </h3>

          {/* Empresa + logo */}
          <div className="flex items-center gap-2 mb-2.5">
            {vacante.logo_url ? (
              <img
                src={`${import.meta.env.VITE_API_URL.replace("/api", "")}/${vacante.logo_url}`}
                alt={`Logo ${nombreEmpresa}`}
                className="w-10 h-10 rounded-lg object-contain shrink-0 bg-white border border-gray-100 p-0.5"
              />
            ) : (
              <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                <BuildingOffice2Icon
                  className="w-4 h-4 text-gray-400"
                  strokeWidth={2}
                />
              </div>
            )}
            <p className="text-sm text-gray-700 truncate">{nombreEmpresa}</p>
          </div>

          {/* Ubicación | Fecha */}
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <MapPinIcon className="w-4 h-4 shrink-0" strokeWidth={2} />
              {vacante.ubicacion}
            </span>
            <span className="text-gray-300">|</span>
            <span>{fechaPublicacion}</span>
          </div>
        </div>

        {/* Etiquetas + favorito */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          {modalidadEtiqueta && (
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full leading-none ${modalidadEtiqueta.clase}`}
            >
              {modalidadEtiqueta.label}
            </span>
          )}
          {etiqueta && (
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full leading-none ${etiqueta.clase}`}
            >
              {etiqueta.label}
            </span>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onGuardar?.(vacante.id);
            }}
            className="p-1.5 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
            title={esGuardada ? "Quitar de favoritos" : "Agregar a favoritos"}
          >
            <HeartIcon
              className="w-5 h-5"
              fill={esGuardada ? "red" : "none"}
              stroke={esGuardada ? "red" : "currentColor"}
              strokeWidth={2}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
