import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { evaluacionesService } from "../../services/evaluacionesService";
import StarRating from "./StarRating";
import { TrendingUp } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL.replace("/api", "");

export default function EmpresasDestacadas() {
  const navigate = useNavigate();
  const [empresas, setEmpresas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    evaluacionesService
      .destacadas()
      .then((data) => setEmpresas(data || []))
      .catch(() => setEmpresas([]))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading || empresas.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-5">
        <TrendingUp className="w-5 h-5 text-naranja" />
        <h2 className="text-base font-bold text-azul font-heading uppercase tracking-wide">
          Empresas Destacadas
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {empresas.map((empresa, index) => (
          <button
            key={empresa.id}
            type="button"
            onClick={() => navigate(`/evaluaciones/${empresa.id}`)}
            className="relative rounded-2xl bg-white p-5 pt-7 shadow-sm hover:shadow-md transition-all text-left flex flex-col gap-4 w-full overflow-hidden"
          >
            {/* Borde superior en gradiente (8px / h-2) */}
            <div className="absolute top-0 left-0 h-2 w-full bg-[linear-gradient(90deg,#123498_23%,#096ACC_50%,#F46F0B_83%)]" />

            {/* Logo + Nombre */}
            <div className="flex items-center gap-3">
              {empresa.logo_url ? (
                <img
                  src={`${BASE_URL}/${empresa.logo_url}`}
                  alt={empresa.nombre}
                  className="w-12 h-12 rounded-xl object-cover border border-[#e8edf5] shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-naranja flex items-center justify-center text-white font-black text-lg shrink-0">
                  {empresa.nombre.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="font-bold text-azul text-sm truncate font-heading">
                  {empresa.nombre}
                </p>
                <p className="text-xs text-[#6b7a9f] truncate">
                  {empresa.sector || "Sin sector"}
                </p>
              </div>
            </div>

            {/* Estrellas + promedio */}
            <div className="flex items-center gap-2">
              <StarRating value={Math.round(empresa.promedio || 0)} size="sm" />
              <span className="text-sm font-black text-[#FDB907]">
                {Number(empresa.promedio).toFixed(1)}
              </span>
            </div>

            {/* Métricas */}
            <div className="flex items-center justify-center gap-4 border-t border-[#f4f6fb] pt-3">
              <div className="flex flex-row gap-2 items-center">
                <span className="text-base font-black text-azul-marino">
                  {empresa.total_ofertas}
                </span>
                <span className="text-xs text-gris-oscuro font-medium">
                  Ofertas
                </span>
              </div>
              <div className="w-px h-8 bg-[#e8edf5]" />
              <div className="flex flex-row gap-2 items-center">
                <span className="text-base font-black text-azul-marino">
                  {empresa.total_evaluaciones}
                </span>
                <span className="text-xs text-gris-oscuro font-medium">
                  Evaluaciones
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
