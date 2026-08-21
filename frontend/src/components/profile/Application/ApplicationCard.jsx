import { useNavigate } from "react-router-dom";
import { BuildingOfficeIcon, MapPinIcon, CalendarIcon } from "@heroicons/react/24/outline";
import ApplicationStatusBadge from "./ApplicationStatusBadge";

const formatearFecha = (fechaStr) => {
  const fecha = new Date(fechaStr + "T00:00:00");
  return fecha.toLocaleDateString("es-PE", { day: "numeric", month: "long" });
};

export default function ApplicationCard({ aplicacion }) {
  const navigate = useNavigate();

  const {
    cargo,
    empresa,
    ubicacion,
    fecha_postulacion,
    estado,
    logo_url,
    oferta_id,
  } = aplicacion;

  return (
    <div className="flex items-center gap-5 rounded-2xl bg-white px-6 py-5 shadow-sm border border-[#e8edf5]">

      {/* Avatar */}
      {logo_url ? (
        <img
          src={`${import.meta.env.VITE_API_URL.replace('/api', '')}/${logo_url}`}
          alt={empresa}
          className="h-12 w-12 rounded-xl object-contain shrink-0 bg-white p-1 border border-slate-200"
        />
      ) : (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#123498] text-sm font-bold text-white">
          {empresa?.charAt(0).toUpperCase()}
        </div>
      )}

      {/* Info principal */}
      <div className="flex flex-1 flex-col gap-1.5 min-w-0">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[15px] font-bold text-[#1c2a52]">{cargo}</span>
          <ApplicationStatusBadge estado={estado} />
        </div>
        <div className="flex items-center gap-4 text-xs text-[#6b7a9f] flex-wrap">
          <span className="flex items-center gap-1">
            <BuildingOfficeIcon className="h-3.5 w-3.5" />
            {empresa}
          </span>
          <span className="flex items-center gap-1">
            <MapPinIcon className="h-3.5 w-3.5" />
            {ubicacion}
          </span>
          <span className="flex items-center gap-1">
            <CalendarIcon className="h-3.5 w-3.5" />
            Postulaste el {formatearFecha(fecha_postulacion)}
          </span>
        </div>
      </div>

      {/* Botón Ver detalles */}
      <button
        type="button"
        onClick={() => navigate(`/buscar-empleo?vacante=${oferta_id}`)}
        className="shrink-0 flex items-center gap-2 rounded-xl border-[1.5px] border-[#cdd6ea] bg-white px-5 py-2.5 text-sm font-semibold text-[#123498] transition hover:bg-[#f2f5fc]"
      >
        Ver detalles
        <span aria-hidden>→</span>
      </button>
    </div>
  );
}