import { useNavigate } from "react-router-dom";
import StarRating from "./StarRating";

const BASE_URL = import.meta.env.VITE_API_URL.replace("/api", "");

export default function EmpresaCard({ empresa }) {
  const navigate = useNavigate();
  const { id, nombre, sector, logo_url, promedio, total_evaluaciones } = empresa;

  return (
    <button
      type="button"
      onClick={() => navigate(`/evaluaciones/${id}`)}
      className="bg-white rounded-2xl border border-[#e8edf5] p-5 shadow-sm hover:shadow-md hover:border-[#123498]/30 transition-all text-left flex flex-col gap-3 w-full"
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        {logo_url ? (
          <img
            src={`${BASE_URL}/${logo_url}`}
            alt={nombre}
            className="w-16 h-16 rounded-xl object-contain shrink-0 border border-[#e8edf5] bg-white p-2"
          />
        ) : (
          <div className="w-16 h-16 rounded-xl bg-[#123498] flex items-center justify-center text-white font-bold text-xl shrink-0">
            {nombre.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p className="font-bold text-[#1c2a52] text-sm truncate font-heading">{nombre}</p>
          <p className="text-xs text-[#6b7a9f] truncate">{sector || "Sin sector"}</p>
        </div>
      </div>

      {/* Promedio */}
      <div className="flex items-center gap-2">
        <StarRating value={Math.round(promedio || 0)} size="sm" />
        <span className="text-sm font-bold text-[#1c2a52]">
          {promedio ? Number(promedio).toFixed(1) : "—"}
        </span>
        <span className="text-xs text-[#9aa3bd]">
          ({total_evaluaciones} {total_evaluaciones === 1 ? "evaluación" : "evaluaciones"})
        </span>
      </div>
    </button>
  );
}