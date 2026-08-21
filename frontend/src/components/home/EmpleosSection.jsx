import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { vacantesService } from "../../services/vacantesService";
import { MapPinIcon, CalendarIcon, BriefcaseIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const MAX_VISIBLE = 3;

const formatearFecha = (fechaStr) => {
  if (!fechaStr) return "Sin fecha límite";
  return new Date(fechaStr.replace(" ", "T")).toLocaleDateString("es-PE", {
    day: "numeric", month: "long", year: "numeric",
  });
};

export default function EmpleosSection() {
  const navigate = useNavigate();
  const [vacantes, setVacantes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      setIsLoading(true);
      try {
        const data = await vacantesService.listar();
        // Solo las 3 más recientes
        setVacantes(data.slice(0, MAX_VISIBLE));
      } catch {
        setVacantes([]);
      } finally {
        setIsLoading(false);
      }
    };
    cargar();
  }, []);

  return (
    <section className="bg-[#F9F9F9] border-b border-slate-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#123498] tracking-tight font-heading uppercase">
            Empleos Recientes
          </h2>
          <div className="w-8 h-1 bg-[#F46F0B] mt-2 mb-1 rounded-full" />
          <p className="text-slate-400 text-base font-bold mt-1">
            Las últimas vacantes publicadas en nuestra red
          </p>
        </div>
        <button
          onClick={() => navigate("/buscar-empleo")}
          className="text-[#F46F0B] hover:text-orange-600 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors group cursor-pointer"
        >
          <span>Ver todos</span>
          <span className="transform group-hover:translate-x-1 transition-transform font-bold">
            &gt;
          </span>
        </button>
      </div>

      {/* Estados */}
      {isLoading ? (
        <div className="text-center py-12 text-slate-400 text-sm">
          Cargando vacantes...
        </div>
      ) : vacantes.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm max-w-xl mx-auto">
          <BriefcaseIcon className="w-10 h-10 text-slate-300 mx-auto mb-4" />
          <h3 className="font-extrabold text-lg text-[#123498] mb-2 font-heading">
            No hay vacantes disponibles
          </h3>
          <p className="text-slate-400 text-base font-medium">
            Pronto publicaremos nuevas oportunidades. ¡Vuelve pronto!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {vacantes.map((vacante) => (
            <div
              key={vacante.id}
              className="bg-white border border-slate-200/80 rounded-2xl p-6 flex flex-col justify-between hover:border-[#096ACC] shadow-sm hover:shadow-md transition-all duration-200 group"
            >
              {/* Ícono + Badge Nuevo */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-[#F9F9F9] rounded-xl flex items-center justify-center border border-slate-100 shrink-0 shadow-inner">
                  <BriefcaseIcon className="w-5 h-5 text-[#123498]" />
                </div>

                {/* Badge "Nuevo" si fue publicado hace menos de 3 días */}
                {(() => {
                  const dias = Math.floor(
                    (new Date() - new Date(vacante.fecha_creacion)) / (1000 * 60 * 60 * 24)
                  );
                  return dias <= 3 ? (
                    <span className="bg-[#E6F8F6] text-[#41C4C0] border border-[#41C4C0]/20 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shrink-0">
                      NUEVO
                    </span>
                  ) : null;
                })()}
              </div>

              {/* Info */}
              <div className="flex flex-col gap-2 flex-1">
                {/* Nombre del puesto */}
                <h3 className="font-extrabold text-base text-[#123498] font-heading leading-snug group-hover:text-[#096ACC] transition-colors line-clamp-2">
                  {vacante.titulo}
                </h3>

                {/* Empresa */}
                <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">
                  {vacante.empresa_nombre}
                </p>

                {/* Ubicación */}
                <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                  <MapPinIcon className="w-4 h-4 text-[#F46F0B] shrink-0" />
                  <span>{vacante.ubicacion || "Sin especificar"}</span>
                </div>

                {/* Fecha de expiración */}
                <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                  <CalendarIcon className="w-4 h-4 text-[#41C4C0] shrink-0" />
                  <span>Disponible hasta: {formatearFecha(vacante.fecha_expiracion)}</span>
                </div>
              </div>

              {/* Botón Detalles */}
              <div className="flex justify-end pt-4 mt-4 border-t border-slate-100">
                <button
                  onClick={() => navigate(`/buscar-empleo?vacante=${vacante.id}`)}
                  className="flex items-center gap-2 text-xs font-black text-[#123498] hover:text-[#096ACC] tracking-wider transition-colors cursor-pointer group/btn"
                >
                  <span>DETALLES</span>
                  <div className="w-6 h-6 rounded-full bg-[#F9F9F9] border border-slate-100 flex items-center justify-center text-[#123498] group-hover/btn:bg-[#123498] group-hover/btn:text-white transition-all">
                    <ChevronRightIcon className="w-3 h-3 transform group-hover/btn:translate-x-0.5 transition-transform" strokeWidth="3.5" />
                  </div>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </section>
  );
}