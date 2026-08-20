import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useEvaluaciones } from "../hooks/useEvaluaciones";
import EmpresaCard from "../components/evaluaciones/EmpresaCard";

export default function Evaluaciones() {
  const { empresas, total, isLoading, busqueda, setBusqueda } = useEvaluaciones();

  return (
    <div className="min-h-screen bg-[#F9F9F9] font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1c2a52] font-heading">
            Evaluaciones de Empresas
          </h1>
          <p className="mt-2 text-[#6b7a9f]">
            Descubre la experiencia de candidatos y empleados en cada empresa.
          </p>
        </div>

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
            {empresas.length} {empresas.length === 1 ? "empresa encontrada" : "empresas encontradas"}
          </p>
        )}

        {/* Grid */}
        {isLoading ? (
          <div className="text-center py-20 text-[#9aa3bd] text-sm">Cargando empresas...</div>
        ) : empresas.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {empresas.map(empresa => (
              <EmpresaCard key={empresa.id} empresa={empresa} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-[#9aa3bd] text-sm">
            No se encontraron empresas.
          </div>
        )}
      </div>
    </div>
  );
}