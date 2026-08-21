import { useState, useEffect } from "react";
import { Search, Eye, X, ChevronDown } from "lucide-react";
import { reclamacionesService } from "../../services/reclamacionesService";

const ESTADOS = ["pendiente", "en_proceso", "resuelto", "cerrado"];

const ESTADO_BADGE = {
  pendiente:   "text-amber-600  bg-amber-50  border-amber-200",
  en_proceso:  "text-blue-600   bg-blue-50   border-blue-200",
  resuelto:    "text-green-600  bg-green-50  border-green-200",
  cerrado:     "text-slate-500  bg-slate-100 border-slate-200",
};

const ESTADO_LABEL = {
  pendiente:  "Pendiente",
  en_proceso: "En proceso",
  resuelto:   "Resuelto",
  cerrado:    "Cerrado",
};

const formatFecha = (f) =>
  new Date(f.replace(" ", "T")).toLocaleDateString("es-PE", {
    day: "numeric", month: "short", year: "numeric",
  });

export default function SectionReclamaciones() {
  const [reclamos,      setReclamos]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [searchTerm,    setSearchTerm]    = useState("");
  const [filterTipo,    setFilterTipo]    = useState("");
  const [filterEstado,  setFilterEstado]  = useState("");
  const [modalReclamo,  setModalReclamo]  = useState(null); // detalle completo
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [respuesta,     setRespuesta]     = useState("");
  const [estadoEdit,    setEstadoEdit]    = useState("");
  const [guardando,     setGuardando]     = useState(false);

  const reload = async () => {
    setLoading(true);
    try { setReclamos(await reclamacionesService.adminListar()); }
    catch { setReclamos([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { reload(); }, []);

  const openDetalle = async (id) => {
    setLoadingDetail(true);
    setModalReclamo(null);
    try {
      const data = await reclamacionesService.adminDetalle(id);
      setModalReclamo(data);
      setRespuesta(data.respuesta_admin || "");
      setEstadoEdit(data.estado);
    } catch (err) {
      alert(err.message || "Error al cargar el detalle");
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleGuardar = async () => {
    if (!modalReclamo) return;
    setGuardando(true);
    try {
      await reclamacionesService.adminActualizar({
        id:              modalReclamo.id,
        estado:          estadoEdit,
        respuesta_admin: respuesta,
      });
      await reload();
      setModalReclamo(null);
    } catch (err) {
      alert(err.message || "Error al guardar");
    } finally {
      setGuardando(false);
    }
  };

  const filtered = reclamos.filter(r => {
    const nombre = `${r.nombre} ${r.primer_apellido} ${r.segundo_apellido}`.toLowerCase();
    const matchSearch = !searchTerm ||
      nombre.includes(searchTerm.toLowerCase()) ||
      r.correo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTipo   = !filterTipo   || r.tipo_reclamo === filterTipo;
    const matchEstado = !filterEstado || r.estado       === filterEstado;
    return matchSearch && matchTipo && matchEstado;
  });

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-[#123498] uppercase tracking-wide">
            Libro de Reclamaciones
          </h1>
          <p className="text-sm text-slate-400">
            Gestiona y responde los reclamos recibidos
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-black text-slate-500">
          <span className={`px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-wider ${ESTADO_BADGE.pendiente}`}>
            {reclamos.filter(r => r.estado === "pendiente").length} pendientes
          </span>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o correo..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#123498]/10 focus:border-[#123498] transition-all placeholder:text-slate-400"
          />
        </div>
        <select
          value={filterTipo}
          onChange={e => setFilterTipo(e.target.value)}
          className="px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#123498]/10 focus:border-[#123498]"
        >
          <option value="">Todos los tipos</option>
          <option value="Reclamacion">Reclamación</option>
          <option value="Queja">Queja</option>
        </select>
        <select
          value={filterEstado}
          onChange={e => setFilterEstado(e.target.value)}
          className="px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#123498]/10 focus:border-[#123498]"
        >
          <option value="">Todos los estados</option>
          {ESTADOS.map(e => <option key={e} value={e}>{ESTADO_LABEL[e]}</option>)}
        </select>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-3xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[9px] text-slate-400 uppercase tracking-widest border-b border-slate-100 bg-slate-50/50">
                <th className="px-5 py-3.5 font-black">N°</th>
                <th className="px-5 py-3.5 font-black">Nombre</th>
                <th className="hidden lg:table-cell px-5 py-3.5 font-black">Correo</th>
                <th className="px-5 py-3.5 font-black">Tipo</th>
                <th className="hidden lg:table-cell px-5 py-3.5 font-black">Fecha</th>
                <th className="px-5 py-3.5 font-black text-center">Estado</th>
                <th className="px-5 py-3.5 font-black text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400 text-sm">
                    Cargando reclamos...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400 text-sm">
                    No se encontraron reclamos.
                  </td>
                </tr>
              ) : filtered.map(r => (
                <tr key={r.id} className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5 font-black text-[#123498]">
                    #{String(r.id).padStart(6, "0")}
                  </td>
                  <td className="px-5 py-3.5 font-bold text-[#1A1A1A]">
                    {r.nombre} {r.primer_apellido}
                  </td>
                  <td className="hidden lg:table-cell px-5 py-3.5 text-slate-500">
                    {r.correo}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-block px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${
                      r.tipo_reclamo === "Reclamacion"
                        ? "text-red-600 bg-red-50 border-red-200"
                        : "text-amber-600 bg-amber-50 border-amber-200"
                    }`}>
                      {r.tipo_reclamo}
                    </span>
                  </td>
                  <td className="hidden lg:table-cell px-5 py-3.5 text-slate-400">
                    {formatFecha(r.fecha_creacion)}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${ESTADO_BADGE[r.estado]}`}>
                      {ESTADO_LABEL[r.estado]}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => openDetalle(r.id)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-[#123498] transition-colors"
                      title="Ver detalle"
                    >
                      <Eye size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal detalle */}
      {(modalReclamo || loadingDetail) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={() => setModalReclamo(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {loadingDetail ? (
              <div className="p-12 text-center text-slate-400 text-sm">Cargando...</div>
            ) : modalReclamo && (
              <>
                {/* Header modal */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-wider">
                      Reclamo #{String(modalReclamo.id).padStart(6, "0")}
                    </p>
                    <h2 className="text-sm font-black text-[#123498]">
                      {modalReclamo.nombre} {modalReclamo.primer_apellido} {modalReclamo.segundo_apellido}
                    </h2>
                  </div>
                  <button onClick={() => setModalReclamo(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                    <X size={16} />
                  </button>
                </div>

                <div className="p-6 flex flex-col gap-6">

                  {/* Datos del consumidor */}
                  <section>
                    <p className="text-xs font-black text-[#F46F0B] uppercase tracking-wider mb-3">
                      Datos del consumidor
                    </p>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                      {[
                        ["Documento",  `${modalReclamo.tipo_documento} - ${modalReclamo.numero_documento}`],
                        ["Celular",    modalReclamo.celular],
                        ["Correo",     modalReclamo.correo],
                        ["Ubicación",  `${modalReclamo.distrito}, ${modalReclamo.provincia}, ${modalReclamo.departamento}`],
                        ["Dirección",  modalReclamo.direccion],
                        ["Referencia", modalReclamo.referencia || "—"],
                        ["Menor de edad", modalReclamo.es_menor_edad ? "Sí" : "No"],
                      ].map(([label, value]) => (
                        <div key={label}>
                          <span className="font-black text-slate-400">{label}: </span>
                          <span className="text-slate-600">{value}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Detalle del reclamo */}
                  <section>
                    <p className="text-xs font-black text-[#F46F0B] uppercase tracking-wider mb-3">
                      Detalle del reclamo
                    </p>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm mb-4">
                      {[
                        ["Tipo",         modalReclamo.tipo_reclamo],
                        ["Consumo",      modalReclamo.tipo_consumo],
                        ["N° Pedido",    modalReclamo.numero_pedido || "—"],
                        ["Proveedor",    modalReclamo.proveedor     || "—"],
                        ["Monto (S/)",   modalReclamo.monto_reclamado ? `S/ ${modalReclamo.monto_reclamado}` : "—"],
                        ["Fecha compra", modalReclamo.fecha_compra  || "—"],
                      ].map(([label, value]) => (
                        <div key={label}>
                          <span className="font-black text-slate-400">{label}: </span>
                          <span className="text-slate-600">{value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col gap-3">
                      {[
                        ["Descripción del producto/servicio", modalReclamo.descripcion_producto],
                        ["Detalle de la reclamación",         modalReclamo.detalle_reclamacion],
                        ["Pedido del cliente",                modalReclamo.pedido_cliente],
                      ].map(([label, value]) => (
                        <div key={label} className="bg-slate-50 rounded-xl p-3">
                          <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">{label}</p>
                          <p className="text-sm text-slate-600 leading-relaxed">{value}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Gestión admin */}
                  <section className="border-t border-slate-100 pt-5 flex flex-col gap-4">
                    <p className="text-xs font-black text-[#123498] uppercase tracking-wider">
                      Gestión del reclamo
                    </p>

                    <div>
                      <label className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1 block">
                        Estado
                      </label>
                      <select
                        value={estadoEdit}
                        onChange={e => setEstadoEdit(e.target.value)}
                        className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#123498]/10 focus:border-[#123498]"
                      >
                        {ESTADOS.map(e => (
                          <option key={e} value={e}>{ESTADO_LABEL[e]}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1 block">
                        Respuesta al cliente
                      </label>
                      <textarea
                        value={respuesta}
                        onChange={e => setRespuesta(e.target.value)}
                        rows={4}
                        placeholder="Escribe la respuesta para el cliente..."
                        className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#123498]/10 focus:border-[#123498] resize-none"
                      />
                    </div>

                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setModalReclamo(null)}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-black text-slate-500 hover:bg-slate-50 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleGuardar}
                        disabled={guardando}
                        className="px-5 py-2.5 rounded-xl bg-[#123498] hover:bg-[#0f2a80] disabled:opacity-60 text-white text-sm font-black uppercase tracking-wider transition-colors"
                      >
                        {guardando ? "Guardando..." : "Guardar cambios"}
                      </button>
                    </div>
                  </section>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}