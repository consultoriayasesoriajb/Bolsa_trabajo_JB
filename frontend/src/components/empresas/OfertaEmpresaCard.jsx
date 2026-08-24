import { MapPinIcon, ClockIcon, BriefcaseIcon } from "@heroicons/react/24/outline";

const formatFecha = (f) => {
  if (!f) return null;
  const dias = Math.floor((new Date() - new Date(f.replace(" ", "T"))) / (1000 * 60 * 60 * 24));
  if (dias === 0) return "Publicado hoy";
  if (dias === 1) return "Publicado ayer";
  return `Hace ${dias} días`;
};

const MAP_MODALIDAD = {
  presencial: "Presencial",
  remoto:     "Remoto",
  "Híbrida":  "Híbrida",
};

export default function OfertaEmpresaCard({ oferta, onVerEmpleo }) {
  const {
    titulo, ubicacion, modalidad, tipo_contrato,
    salario_min, salario_max, descripcion, fecha_publicacion,
  } = oferta;

  const esNueva = fecha_publicacion &&
    Math.floor((new Date() - new Date(fecha_publicacion.replace(" ", "T"))) / (1000 * 60 * 60 * 24)) <= 3;

  return (
    <div className="bg-white rounded-2xl border border-[#e8edf5] p-5 shadow-sm hover:shadow-md transition-all flex flex-col gap-3">

      {/* Header */}
      <div className="flex flex-col gap-1 min-w-0">
        <div className="flex flex-row gap-1">
          {fecha_publicacion && (
            <span className="shrink-0 text-[10px] text-[#9aa3bd] whitespace-nowrap">
              {formatFecha(fecha_publicacion)}
            </span>
          )}
          {esNueva && (
            <span className="self-start text-[10px] font-black uppercase tracking-wider text-[#41C4C0] bg-[#41C4C0]/10 px-2.5 py-0.5 rounded-full mb-1">
              NUEVO
            </span>
          )}
        </div>
        <h3 className="font-bold text-[#1c2a52] text-sm font-heading leading-snug">
            {titulo}
        </h3>
        <div className="flex items-center gap-3 flex-wrap text-xs text-[#9aa3bd]">
            {ubicacion && (
              <span className="flex items-center gap-1">
                <MapPinIcon className="w-3.5 h-3.5 shrink-0" />
                {ubicacion}
              </span>
            )}
            {modalidad && (
              <span className="flex items-center gap-1">
                <BriefcaseIcon className="w-3.5 h-3.5 shrink-0" />
                {MAP_MODALIDAD[modalidad] || modalidad}
              </span>
            )}
            {tipo_contrato && (
              <span>{tipo_contrato}</span>
            )}
            {(salario_min || salario_max) && (
              <span className="text-[#123498] font-semibold">
                S/ {salario_min && Number(salario_min).toLocaleString()}
                {salario_max && ` – ${Number(salario_max).toLocaleString()}`}
              </span>
            )}
        </div>
      </div>

      {/* Descripción */}
      {descripcion && (
        <p className="text-xs text-[#6b7a9f] leading-relaxed line-clamp-2">
          {descripcion}
        </p>
      )}

      {/* Botón */}
      <div className="flex justify-end pt-1">
        <button
          type="button"
          onClick={onVerEmpleo}
          className="px-4 py-2 bg-[#123498] hover:bg-[#0f2a80] text-white text-xs font-bold rounded-xl transition-colors"
        >
          Ver empleo
        </button>
      </div>
    </div>
  );
}