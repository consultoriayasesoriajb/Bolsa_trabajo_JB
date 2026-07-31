// ─────────────────────────────────────────────────────────────
// ListaVacantes — Panel izquierdo: lista scrolleable de tarjetas
//
// Props:
//   vacantes      : array
//   seleccionadaId: string
//   onSelect      : fn(id)
//   loading       : boolean
//   error         : string
// ─────────────────────────────────────────────────────────────

import TarjetaVacante from './TarjetaVacante';

function SkeletonCard() {
  return (
    <div className="p-2.5 rounded-lg border border-gray-100 animate-pulse space-y-2">
      <div className="h-3.5 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-100 rounded w-1/2" />
      <div className="flex gap-2">
        <div className="h-3 bg-gray-100 rounded w-1/4" />
        <div className="h-3 bg-gray-100 rounded w-1/5" />
      </div>
    </div>
  );
}

export default function ListaVacantes({ vacantes, seleccionadaId, onSelect, loading, error, guardados, onGuardar }) {
  return (
    <div className="flex flex-col">
      <div className="shrink-0 px-5 py-3 border-b border-gray-100">
        <p className="text-sm text-gray-500 font-semibold">
          {loading ? 'Buscando...' : `${vacantes.length} vacante${vacantes.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      <div className="p-5 space-y-4">
        {loading && (
          <div className="space-y-2">
            <SkeletonCard /><SkeletonCard /><SkeletonCard />
          </div>
        )}

        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <svg className="w-8 h-8 text-red-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-sm text-red-500 font-medium">{error}</p>
          </div>
        )}

        {!loading && !error && vacantes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <svg className="w-8 h-8 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-sm text-gray-400 font-medium">No se encontraron vacantes</p>
          </div>
        )}

        {!loading && !error && vacantes.map((v) => (
          <TarjetaVacante
            key={v.id}
            vacante={v}
            seleccionada={v.id === seleccionadaId}
            onClick={() => onSelect(v.id)}
            esGuardada={guardados?.has(v.id)}
            onGuardar={onGuardar}
          />
        ))}
      </div>
    </div>
  );
}
