import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

const FILTROS_OFERTAS = {
  modalidad: {
    label: "Modalidad",
    opciones: [
      { value: "presencial", label: "Presencial" },
      { value: "remoto",     label: "Remoto" },
      { value: "Híbrida",    label: "Híbrida" },
    ],
  },
};

const FILTROS_EVALUACIONES = {
  relacion: {
    label: "Relación",
    opciones: [
      { value: "candidato",   label: "Candidato" },
      { value: "empleado",    label: "Empleado" },
      { value: "ex-empleado", label: "Ex-empleado" },
    ],
  },
  estrellas: {
    label: "Estrellas",
    opciones: [
      { value: "5", label: "★★★★★" },
      { value: "4", label: "★★★★" },
      { value: "3", label: "★★★" },
      { value: "2", label: "★★" },
      { value: "1", label: "★" },
    ],
  },
};

export default function EmpresaBarraFiltros({
  pestana,
  busquedaOfertas, setBusquedaOfertas,
  filtroModalidad, setFiltroModalidad,
  filtroRelacion, setFiltroRelacion,
  filtroEstrellas, setFiltroEstrellas,
  limpiarFiltros,
}) {
  const [panelAbierto, setPanelAbierto] = useState(false);

  const esOfertas      = pestana === "ofertas";
  const esEvaluaciones = pestana === "evaluaciones";

  // Chips de filtros activos
  const filtrosActivos = [
    esOfertas && filtroModalidad && {
      label: `Modalidad: ${filtroModalidad}`,
      clear: () => setFiltroModalidad(""),
    },
    esEvaluaciones && filtroRelacion && {
      label: `Relación: ${filtroRelacion}`,
      clear: () => setFiltroRelacion(""),
    },
    esEvaluaciones && filtroEstrellas && {
      label: `${filtroEstrellas} ★`,
      clear: () => setFiltroEstrellas(""),
    },
  ].filter(Boolean);

  return (
    <div className="flex flex-col gap-2">

      {/* Barra principal */}
      <div className="flex items-center gap-2">
        {/* Buscador */}
        {esOfertas && (
          <div className="flex items-center gap-2 flex-1 bg-white rounded-xl border border-[#e8edf5] px-3 py-2 shadow-sm">
            <MagnifyingGlassIcon className="w-4 h-4 text-[#9aa3bd] shrink-0" />
            <input
              type="text"
              placeholder="Buscar en las ofertas"
              value={busquedaOfertas}
              onChange={e => setBusquedaOfertas(e.target.value)}
              className="flex-1 bg-transparent text-sm text-[#1c2a52] placeholder:text-[#9aa3bd] outline-none"
            />
          </div>
        )}

        {/* Botón filtros */}
        <button
          type="button"
          onClick={() => setPanelAbierto(v => !v)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold transition-colors ${
            panelAbierto || filtrosActivos.length > 0
              ? "bg-[#123498] text-white border-[#123498]"
              : "bg-white border-[#e8edf5] text-[#6b7a9f] hover:border-[#123498] hover:text-[#123498]"
          }`}
        >
          <AdjustmentsHorizontalIcon className="w-4 h-4" />
          Filtros
          {filtrosActivos.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-white/20 text-xs font-black flex items-center justify-center">
              {filtrosActivos.length}
            </span>
          )}
        </button>
      </div>

      {/* Panel de filtros */}
      {panelAbierto && (
        <div className="bg-white rounded-2xl border border-[#e8edf5] shadow-sm p-4 flex flex-wrap gap-4">
          {esOfertas && (
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5 block">
                Modalidad
              </label>
              <div className="flex gap-2 flex-wrap">
                {FILTROS_OFERTAS.modalidad.opciones.map(o => (
                  <button key={o.value} type="button"
                    onClick={() => setFiltroModalidad(filtroModalidad === o.value ? "" : o.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                      filtroModalidad === o.value
                        ? "bg-[#123498] text-white border-[#123498]"
                        : "bg-white text-[#6b7a9f] border-[#e8edf5] hover:border-[#123498]"
                    }`}>
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {esEvaluaciones && (
            <>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5 block">
                  Relación
                </label>
                <div className="flex gap-2 flex-wrap">
                  {FILTROS_EVALUACIONES.relacion.opciones.map(o => (
                    <button key={o.value} type="button"
                      onClick={() => setFiltroRelacion(filtroRelacion === o.value ? "" : o.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                        filtroRelacion === o.value
                          ? "bg-[#123498] text-white border-[#123498]"
                          : "bg-white text-[#6b7a9f] border-[#e8edf5] hover:border-[#123498]"
                      }`}>
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5 block">
                  Estrellas
                </label>
                <div className="flex gap-2 flex-wrap">
                  {FILTROS_EVALUACIONES.estrellas.opciones.map(o => (
                    <button key={o.value} type="button"
                      onClick={() => setFiltroEstrellas(filtroEstrellas === o.value ? "" : o.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                        filtroEstrellas === o.value
                          ? "bg-[#FDB907] text-[#1c2a52] border-[#FDB907]"
                          : "bg-white text-[#6b7a9f] border-[#e8edf5] hover:border-[#FDB907]"
                      }`}>
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Chips de filtros activos */}
      {filtrosActivos.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-[#9aa3bd]">Filtros activos:</span>
          {filtrosActivos.map(({ label, clear }) => (
            <span key={label} className="flex items-center gap-1.5 px-3 py-1 bg-[#f2f5fc] text-[#123498] text-xs font-semibold rounded-full">
              {label}
              <button type="button" onClick={clear} className="hover:text-red-500 transition-colors">
                <XMarkIcon className="w-3 h-3" />
              </button>
            </span>
          ))}
          <button type="button" onClick={limpiarFiltros} className="text-xs text-[#9aa3bd] hover:text-red-500 transition-colors font-semibold">
            Limpiar
          </button>
        </div>
      )}
    </div>
  );
}