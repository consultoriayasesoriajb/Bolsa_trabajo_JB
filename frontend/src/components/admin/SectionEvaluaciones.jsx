import { useState, useEffect } from "react";
import { Star, Eye, EyeOff, Trash2, Search, X, FileText } from "lucide-react";
import { listadoEmpresasService  } from "../../services/listadoEmpresasService";

export default function SectionEvaluaciones() {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [modalEval, setModalEval] = useState(null);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    setLoading(true);
    try {
      setEvaluaciones(await listadoEmpresasService.adminListar());
    } catch {
      setEvaluaciones([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { reload(); }, []);

  const handleEstado = async (id, estadoActual) => {
    const nuevoEstado = estadoActual === "visible" ? "oculto" : "visible";
    try {
      await listadoEmpresasService.adminCambiarEstado(id, nuevoEstado);
      await reload();
      if (modalEval?.id === id) {
        setModalEval(prev => ({ ...prev, estado: nuevoEstado }));
      }
    } catch (err) {
      alert(err.message || "Error al cambiar estado");
    }
  };

  const handleEliminar = async (id, empresa) => {
    if (!window.confirm(`¿Eliminar la evaluación de "${empresa}"?`)) return;
    try {
      await listadoEmpresasService.adminEliminar(id);
      await reload();
      if (modalEval?.id === id) setModalEval(null);
    } catch (err) {
      alert(err.message || "Error al eliminar");
    }
  };

  const filtered = evaluaciones.filter(ev => {
    const matchSearch =
      (ev.empresa_nombre || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ev.iniciales || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchEstado = filterEstado === "todos" || ev.estado === filterEstado;
    return matchSearch && matchEstado;
  });

  const ESTRELLAS_COLOR = { 1: "text-red-500", 2: "text-orange-400", 3: "text-amber-400", 4: "text-yellow-400", 5: "text-green-500" };

  const renderEstrellas = (n) => (
    <span className={`flex items-center gap-0.5 font-black text-xs ${ESTRELLAS_COLOR[n] || "text-slate-400"}`}>
      {"★".repeat(n)}{"☆".repeat(5 - n)}
    </span>
  );

  const RELACION_LABEL = {
    candidato: "Candidato",
    empleado: "Empleado",
    "ex-empleado": "Ex-empleado",
  };

  const RECOMENDARIA_LABEL = {
    si: "✅ Sí",
    no: "❌ No",
    depende: "🤔 Duda",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-[#123498] uppercase tracking-wide">
            Moderación de Evaluaciones
          </h1>
          <p className="text-sm text-slate-400">
            Revisa y modera las evaluaciones de empresas
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black text-slate-500">
          <Star size={14} className="text-[#FDB907]" />
          <span>{evaluaciones.length} evaluaciones registradas</span>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar empresa o usuario..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#123498]/10 focus:border-[#123498] transition-all placeholder:text-slate-400"
          />
        </div>
        <select
          value={filterEstado}
          onChange={e => setFilterEstado(e.target.value)}
          className="px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#123498]/10 focus:border-[#123498]"
        >
          <option value="todos">
            Todos los estados
          </option>
          <option value="visible">
            Visibles
          </option>
          <option value="oculto">
            Ocultos
          </option>
        </select>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-3xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-[9px] text-slate-400 uppercase tracking-widest border-b border-slate-100 bg-slate-50/50">
                <th className="px-2 py-2 md:px-5 md:py-3.5 font-black text-[8px]">Empresa</th>
                <th className="px-2 py-2 md:px-5 md:py-3.5 font-black text-[8px]">Usuario</th>
                <th className="hidden lg:table-cell px-5 py-3.5 font-black">Relación</th>
                <th className="px-2 py-2 md:px-5 md:py-3.5 font-black text-[8px]">Estrellas</th>
                <th className="hidden lg:table-cell px-5 py-3.5 font-black">Comentario</th>
                <th className="hidden lg:table-cell px-5 py-3.5 font-black">Fecha</th>
                <th className="hidden lg:table-cell px-5 py-3.5 font-black text-center">Estado</th>
                <th className="px-2 py-2 md:px-5 md:py-3.5 font-black text-center md:text-right text-[8px]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400 text-sm">
                    Cargando evaluaciones...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400 text-sm">
                    No se encontraron evaluaciones.
                  </td>
                </tr>
              ) : filtered.map(ev => (
                <tr key={ev.id} className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-3 py-2 md:px-5 md:py-3.5 font-bold text-[#1A1A1A]">{ev.empresa_nombre}</td>
                  <td className="px-3 py-2 md:px-5 md:py-3.5">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#123498]/10 text-[#123498] text-[10px] font-black">
                      {ev.iniciales}
                    </span>
                  </td>
                  <td className="hidden lg:table-cell px-5 py-3.5 text-slate-500">
                    {RELACION_LABEL[ev.relacion] || ev.relacion}
                  </td>
                  <td className="px-3 py-2 md:px-5 md:py-3.5">{renderEstrellas(ev.estrellas)}</td>
                  <td className="hidden lg:table-cell px-5 py-3.5 text-slate-500 max-w-[200px]">
                    <p className="truncate">
                      {ev.texto_positivo || ev.texto_negativo || "Sin comentario"}
                    </p>
                  </td>
                  <td className="hidden lg:table-cell px-5 py-3.5 text-slate-400">
                    {new Date(ev.fecha_creacion).toLocaleDateString("es-PE")}
                  </td>
                  <td className="hidden lg:table-cell px-5 py-3.5 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                      ev.estado === "visible"
                        ? "text-green-600 bg-green-50 border border-green-100"
                        : "text-slate-500 bg-slate-100 border border-slate-200"
                    }`}>
                      {ev.estado}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* Ver completo */}
                      <button
                        onClick={() => setModalEval(ev)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-[#123498] transition-colors"
                        title="Ver completo"
                      >
                        <FileText size={13} />
                      </button>
                      {/* Ocultar/Mostrar */}
                      <button
                        onClick={() => handleEstado(ev.id, ev.estado)}
                        className="p-1.5 rounded-lg hover:bg-amber-50 text-slate-400 hover:text-amber-500 transition-colors"
                        title={ev.estado === "visible" ? "Ocultar" : "Mostrar"}
                      >
                        {ev.estado === "visible"
                          ? <EyeOff size={13} />
                          : <Eye size={13} />
                        }
                      </button>
                      {/* Eliminar */}
                      <button
                        onClick={() => handleEliminar(ev.id, ev.empresa_nombre)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal ver completo */}
      {modalEval && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={() => setModalEval(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 mx-4 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-black text-[#123498] uppercase tracking-wider">
                Evaluación completa
              </h2>
              <button
                onClick={() => setModalEval(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-black text-[#1A1A1A]">{modalEval.empresa_nombre}</p>
                  <p className="text-xs text-black/70 mt-0.5">
                    {RELACION_LABEL[modalEval.relacion]} · {new Date(modalEval.fecha_creacion).toLocaleDateString("es-PE")}
                  </p>
                </div>
                {renderEstrellas(modalEval.estrellas)}
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#123498]/10 text-[#123498] text-xs font-black">
                  {modalEval.iniciales}
                </span>
                <span className={`inline-block px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                  modalEval.estado === "visible"
                    ? "text-green-600 bg-green-50 border border-green-100"
                    : "text-slate-500 bg-slate-100 border border-slate-200"
                }`}>
                  {modalEval.estado}
                </span>
              </div>

              {modalEval.texto_positivo && (
                <div className="bg-gris-oscuro/10 border-l-4 border-green-500 rounded-xl p-3">
                  <p className="text-[10px] font-black text-green-600 uppercase tracking-wider mb-1">Lo bueno</p>
                  <p className="text-xs text-slate-600 leading-relaxed">{modalEval.texto_positivo}</p>
                </div>
              )}

              {modalEval.texto_negativo && (
                <div className="bg-gris-oscuro/10 border-l-4 border-red-500 rounded-xl p-3">
                  <p className="text-[10px] font-black text-red-500 uppercase tracking-wider mb-1">Lo que mejoraría</p>
                  <p className="text-xs text-slate-600 leading-relaxed">{modalEval.texto_negativo}</p>
                </div>
              )}

              <div className="flex flex-row bg-slate-50 rounded-xl p-3">
                <p className="font-black text-sm">Recomendaria la empresa: </p>
                <p className="text-xs text-slate-500 font-semibold text-right ml-auto">
                  {RECOMENDARIA_LABEL[modalEval.recomendaria]}
                </p>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleEstado(modalEval.id, modalEval.estado)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-naranja text-naranja text-xs font-black uppercase tracking-wider hover:bg-naranja/10 transition-colors"
                >
                  {modalEval.estado === "visible"
                    ? <><EyeOff size={13} /> Ocultar</>
                    : <><Eye size={13} /> Mostrar</>
                  }
                </button>
                <button
                  onClick={() => handleEliminar(modalEval.id, modalEval.empresa_nombre)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red text-red-600 text-xs font-black uppercase tracking-wider hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={13} /> Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}