import { useNavigate } from "react-router-dom";
import { MapPinIcon, UsersIcon, StarIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";

const BASE_URL = import.meta.env.VITE_API_URL.replace("/api", "");

export default function EmpresaCard({ empresa }) {
  const navigate = useNavigate();
  const {
    id, nombre, sector, logo_url, promedio, total_evaluaciones,
    total_ofertas, ubicacion, num_empleados, descripcion,
  } = empresa;

  return (
    <div className="bg-white rounded-2xl border border-[#e8edf5] p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-5">
      {/* Izquierda — info principal */}
      <div className="flex-1 flex flex-col gap-3 min-w-0">
        {/* Logo + Nombre */}
        <div className="flex items-center gap-3">
          {logo_url ? (
            <img
              src={`${BASE_URL}/${logo_url}`}
              alt={nombre}
              className="w-12 h-12 rounded-xl object-cover shrink-0 border border-[#e8edf5]"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-[#F46F0B] flex items-center justify-center text-white font-black text-lg shrink-0">
              {nombre.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-bold text-[#1c2a52] text-sm font-heading leading-snug truncate">
              {nombre}
            </p>
            {/* Ubicación + Empleados + Sector */}
            <div className="flex items-center gap-2 flex-wrap mt-0.5">
              {ubicacion && (
                <span className="flex items-center gap-1 text-xs text-[#9aa3bd]">
                  <MapPinIcon className="w-3 h-3 shrink-0" />
                  {ubicacion}
                </span>
              )}
              {num_empleados && (
                <>
                  <span className="text-[#e8edf5]">|</span>
                  <span className="flex items-center gap-1 text-xs text-[#9aa3bd]">
                    <UsersIcon className="w-3 h-3 shrink-0" />
                    {num_empleados} empleados
                  </span>
                </>
              )}
              {sector && (
                <>
                  <span className="text-[#e8edf5]">|</span>
                  <span className="text-xs text-[#9aa3bd] truncate">
                    {sector}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Descripción */}
        {descripcion && (
          <p className="text-sm text-[#6b7a9f] leading-relaxed line-clamp-2">
            {descripcion}
          </p>
        )}

        {/* Badges: ofertas, evaluaciones */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 bg-turquesa/20 text-[#42aaad] text-xs font-bold rounded-full">
            {total_ofertas} {total_ofertas === 1 ? "oferta" : "ofertas"}
          </span>
          <span className="px-3 py-1 bg-[#fcf1e3] text-[#d38215] text-xs font-bold rounded-full">
            {total_evaluaciones}{" "}
            {total_evaluaciones === 1 ? "evaluación" : "evaluaciones"}
          </span>
        </div>
      </div>

      {/* Derecha — promedio + botones */}
      <div className="flex flex-col items-center justify-center gap-3 shrink-0 sm:border-l sm:border-[#e8edf5] sm:pl-5">
        {/* Promedio */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-3xl font-black text-[#1c2a52]">
            {promedio ? Number(promedio).toFixed(1) : "0.0"}
          </span>
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) =>
              star <= Math.round(promedio || 0) ? (
                <StarSolid key={star} className="w-4 h-4 text-[#FDB907]" />
              ) : (
                <StarIcon key={star} className="w-4 h-4 text-[#e8edf5]" />
              ),
            )}
          </div>
        </div>

        {/* Boton */}
        <button
          type="button"
          onClick={() => navigate(`/empresas/${empresa.slug}`)}
          className="w-full px-4 py-2 bg-[#123498] hover:bg-[#0f2a80] text-white text-xs font-bold rounded-xl transition-colors"
        >
          Ver empresa
        </button>
      </div>
    </div>
  );
}
