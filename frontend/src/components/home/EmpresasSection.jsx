import { useNavigate } from "react-router-dom";
import { useEvaluaciones } from "../../hooks/useListadoEmpresas";

const BASE_URL = import.meta.env.VITE_API_URL.replace("/api", "");

export default function EmpresasSection() {
  const { empresas, isLoading } = useEvaluaciones();
  const navigate = useNavigate();

  // Tomamos las primeras empresas como "destacadas" (ej: las primeras 4)
  const empresasDestacadas = empresas.slice(0, 4);

  return (
    <section className="bg-[#F9F9F9] border-b border-slate-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-[#123498] tracking-tight font-heading uppercase">
            Empresas Destacadas
          </h2>
          <div className="w-8 h-1 bg-naranja mt-2 mb-1 rounded-full" />
          <p className="text-slate-400 text-base font-bold mt-1">
            Conoce las organizaciones que publican sus vacantes en nuestra red
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          {isLoading ? (
            <div className="text-center text-slate-400 font-bold py-10">
              Cargando empresas destacadas...
            </div>
          ) : empresasDestacadas.length > 0 ? (
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
              {empresasDestacadas.map((emp) => (
                <div
                  key={emp.id}
                  title={emp.nombre}
                  className="flex justify-center shrink-0"
                  onClick={() => navigate(`/evaluaciones/${emp.id}`)}
                >
                  <div className="bg-white rounded-xl p-4 flex items-center justify-center border border-slate-200/80 shadow-sm w-64 h-40 hover:scale-105 transition-transform duration-200 cursor-pointer">
                    {emp.logo_url ? (
                      <img
                        src={`${BASE_URL}/${emp.logo_url}`}
                        alt={`Logo de ${emp.nombre}`}
                        className="max-h-24 max-w-56 object-contain"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-[#123498] flex items-center justify-center text-white font-black text-4xl shadow-sm">
                        {emp.nombre.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-slate-400 font-bold py-10">
              Aún no hay empresas registradas.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
