import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { StarIcon } from "@heroicons/react/24/outline";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";

const BASE_URL = import.meta.env.VITE_API_URL.replace("/api", "");

export default function EmpresaHeader({ empresa, totalOfertas }) {
  const buscaActivamente = Number(totalOfertas) > 0;

  return (
    <div className="bg-white rounded-2xl border border-[#e8edf5] shadow-sm p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

      {/* Izquierda: logo + nombre + promedio */}
      <div className="flex items-center gap-4">
        {empresa.logo_url ? (
          <img
            src={`${BASE_URL}/${empresa.logo_url}`}
            alt={empresa.nombre}
            className="w-16 h-16 rounded-2xl object-cover border border-[#e8edf5] shrink-0"
          />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-[#123498] flex items-center justify-center text-white font-black text-2xl shrink-0">
            {empresa.nombre.slice(0, 2).toUpperCase()}
          </div>
        )}

        <div className="flex flex-col gap-1">
          {/* Nombre + badge verificado */}
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-[#1c2a52] font-heading leading-tight">
              {empresa.nombre}
            </h1>
            <CheckBadgeIcon className="w-5 h-5 text-[#123498] shrink-0" />
          </div>

          {/* Estrellas + opiniones */}
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-base font-black text-[#1c2a52]">
              {empresa.promedio ? Number(empresa.promedio).toFixed(1) : "—"}
            </span>
            <div className="flex items-center gap-0.5">
              {[1,2,3,4,5].map(s =>
                s <= Math.round(empresa.promedio || 0)
                  ? <StarSolid key={s} className="w-4 h-4 text-[#FDB907]" />
                  : <StarIcon  key={s} className="w-4 h-4 text-[#e8edf5]" />
              )}
            </div>
            <span className="text-xs text-[#9aa3bd]">
              {empresa.total_evaluaciones} {empresa.total_evaluaciones === 1 ? "opinión" : "opiniones"}
            </span>

            <div className="hidden sm:block border border-[#dedfe2] h-4 ml-2"></div>

            {/* Badge busca activamente */}
            {buscaActivamente && (
              <span className="ml-2 px-3 py-1 bg-green-50 text-green-600 border border-green-200 text-[10px] font-black uppercase tracking-wider rounded-lg">
                Busca activamente
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Derecha: total empleos */}
      {buscaActivamente && (
        <div className="text-left sm:text-right mt-2 sm:mt-0 shrink-0">
          <span className="text-2xl font-black text-azul">{totalOfertas}</span>
          <p className="text-xs text-[#9aa3bd]">empleos disponibles</p>
        </div>
      )}
    </div>
  );
}