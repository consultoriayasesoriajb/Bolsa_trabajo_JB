import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useEvaluaciones } from "../hooks/useListadoEmpresas";
import EmpresaCard from "../components/empresas/EmpresaCard";
import EmpresasDestacadas from "../components/empresas/EmpresasDestacadas";

export default function Evaluaciones() {
  const {
    empresas, total, isLoading,
    busqueda, setBusqueda,
    pagina, setPagina, totalPaginas,
  } = useEvaluaciones();

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const paginaEnUrl = Number(searchParams.get("pagina")) || 1;
    if (paginaEnUrl !== pagina) {
      setPagina(paginaEnUrl);
    }
  }, [searchParams]);

  const cambiarPagina = (nuevaPagina) => {
    setPagina(nuevaPagina); // Cambia el estado de tu hook
    
    // Cambia la URL
    const params = new URLSearchParams(searchParams);
    if (nuevaPagina > 1) {
      params.set("pagina", nuevaPagina); // Agrega ?pagina=2
    } else {
      params.delete("pagina"); // Si vuelve a la pág 1, deja la URL limpia (/empresas)
    }
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-[#123498] tracking-tight font-heading uppercase">
            Evaluaciones de Empresas
          </h1>
          <p className="text-slate-400 text-base font-bold mt-1">
            Descubre la experiencia de candidatos y empleados en cada empresa.
          </p>
        </div>

        {/* Empresas destacadas */}
        <EmpresasDestacadas />

        {/* Buscador */}
        <div className="mb-6 flex items-center gap-3 bg-white rounded-2xl border border-[#e8edf5] px-5 py-3 shadow-sm max-w-md">
          <MagnifyingGlassIcon className="w-5 h-5 text-[#9aa3bd] shrink-0" />
          <input
            type="text"
            placeholder="Buscar empresa o sector..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="flex-1 bg-transparent text-sm text-[#1c2a52] placeholder:text-[#9aa3bd] outline-none"
          />
        </div>

        {/* Contador */}
        {!isLoading && (
          <p className="text-sm text-[#9aa3bd] mb-5">
            {total} {total === 1 ? "empresa encontrada" : "empresas encontradas"}
            {totalPaginas > 1 && ` — Página ${pagina} de ${totalPaginas}`}
          </p>
        )}

        {/* Grid */}
        {isLoading ? (
          <div className="text-center py-20 text-[#9aa3bd] text-sm">
            Cargando empresas...
          </div>
        ) : empresas.length > 0 ? (
          <div className="flex flex-col gap-4">
            {empresas.map(empresa => (
              <EmpresaCard key={empresa.id} empresa={empresa} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-[#9aa3bd] text-sm">
            No se encontraron empresas.
          </div>
        )}

        {/* Paginación */}
        {!isLoading && totalPaginas > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">

            {/* Anterior */}
            <button
              type="button"
              onClick={() => cambiarPagina(p => Math.max(1, p - 1))}
              disabled={pagina === 1}
              className="flex items-center gap-1 px-4 py-2 rounded-xl border border-[#e8edf5] bg-white text-sm font-semibold text-[#6b7a9f] hover:border-[#123498] hover:text-[#123498] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeftIcon className="w-4 h-4" />
              Anterior
            </button>

            {/* Números de página */}
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                type="button"
                onClick={() => cambiarPagina(n)}
                className={`w-9 h-9 rounded-xl text-sm font-bold transition-colors ${
                  n === pagina
                    ? "bg-[#123498] text-white"
                    : "bg-white border border-[#e8edf5] text-[#6b7a9f] hover:border-[#123498] hover:text-[#123498]"
                }`}
              >
                {n}
              </button>
            ))}

            {/* Siguiente */}
            <button
              type="button"
              onClick={() => cambiarPagina(p => Math.min(totalPaginas, p + 1))}
              disabled={pagina === totalPaginas}
              className="flex items-center gap-1 px-4 py-2 rounded-xl border border-[#e8edf5] bg-white text-sm font-semibold text-[#6b7a9f] hover:border-[#123498] hover:text-[#123498] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}