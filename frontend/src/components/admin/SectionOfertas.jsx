import { useState, useEffect } from "react";
import {
  Plus, Search, Edit3, Trash2, X, Lock,
  ToggleLeft, ToggleRight, ChevronDown, ChevronUp, Share2, Flag, CheckCircle, Briefcase, XCircle
} from "lucide-react";
import {
  getOffers, getCompanies, saveOffer, deleteOffer,
  toggleOfferStatus, closeOffer, saveCategory,
  getQuestions, saveQuestion, deleteQuestionsByOffer,
  getReportes, marcarReporteRevisado, marcarReporteDescartado
} from "../../services/adminService";
import { apiFetch } from "../../services/api";

const MAP_MODALIDAD = {
  presencial: "Presencial",
  remoto:     "Remoto",
  "Híbrida":  "Híbrida",
};

const MAP_CONTRATO = {
  "Tiempo completo": "Tiempo completo",
  "Permanente":      "Permanente",
  "Medio tiempo":    "Medio tiempo",
  "Freelance":       "Freelance",
  "Prácticas":       "Prácticas",
  "Temporal":        "Temporal",
};

export default function SectionOfertas() {
  const [offers,         setOffers]         = useState([]);
  const [companies,      setCompanies]      = useState([]);
  const [categories,     setCategories]     = useState([]);
  const [searchTerm,     setSearchTerm]     = useState("");
  const [filterEmpresa,  setFilterEmpresa]  = useState("");
  const [modalOpen,      setModalOpen]      = useState(false);
  const [editingOffer,   setEditingOffer]   = useState(null);
  const [loading,        setLoading]        = useState(false);
  const [expandedRowId,  setExpandedRowId]  = useState(null);
  const [showNewCategory,setShowNewCategory]= useState(false);
  const [newCategoryName,setNewCategoryName]= useState("");
  const [preguntas,      setPreguntas]      = useState([]);
  const [vistaActual,    setVistaActual]    = useState("ofertas"); // 'ofertas' | 'reportes'
  const [reportes,       setReportes]       = useState([]);
  const [filtroReporte,  setFiltroReporte]  = useState("pendientes"); // 'pendientes' | 'revisados'

  const FORM_INICIAL = {
    titulo: "", empresa_id: "", ubicacion: "",
    salario_min: "", salario_max: "",
    tipo_contrato: "Tiempo completo",
    modalidad: "presencial",
    horario: "",
    nivel_experiencia: "",
    categoria_id: "", descripcion: "", requisitos: "",
    fecha_publicacion: "", fecha_expiracion: "",
  };
  const [form, setForm] = useState(FORM_INICIAL);

  const reload = async () => {
    try { setOffers(await getOffers()); }    catch { setOffers([]); }
    try { setCompanies(await getCompanies()); } catch { setCompanies([]); }
    try {
      const res = await apiFetch("/admin/?resource=categorias&action=listar");
      setCategories(res.data || []);
    } catch { setCategories([]); }
    try { setReportes(await getReportes()); } catch { setReportes([]); }
  };

  useEffect(() => { reload(); }, []);

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const res = await saveCategory({ nombre: newCategoryName.trim() });
      setCategories(prev => [...prev, res.data]);
      setForm(prev => ({ ...prev, categoria_id: res.data.id }));
      setNewCategoryName("");
      setShowNewCategory(false);
    } catch (err) {
      alert(err.message || "Error al crear categoría");
    }
  };

  const openNew = () => {
    setEditingOffer(null);
    setForm({ ...FORM_INICIAL, empresa_id: companies[0]?.id || "" });
    setPreguntas([]);
    setShowNewCategory(false);
    setNewCategoryName("");
    setModalOpen(true);
  };

  const openEdit = async (o) => {
    setEditingOffer(o);
    setForm({
      titulo:            o.titulo            || "",
      empresa_id:        o.empresa_id        || "",
      ubicacion:         o.ubicacion         || "",
      salario_min:       o.salario_min       || "",
      salario_max:       o.salario_max       || "",
      tipo_contrato:     o.tipo_contrato     || "Tiempo completo",
      modalidad:         o.modalidad         || "presencial",
      horario:           o.horario           || "",
      nivel_experiencia: o.nivel_experiencia || "",
      categoria_id:      o.categoria_id      || "",
      descripcion:       o.descripcion       || "",
      requisitos:        o.requisitos        || "",
      fecha_publicacion: o.fecha_publicacion ? o.fecha_publicacion.slice(0, 16) : "",
      fecha_expiracion:  o.fecha_expiracion  ? o.fecha_expiracion.slice(0, 16)  : "",
    });
    try {
      const qs = await getQuestions(o.id);
      setPreguntas(qs.map(q => ({
        ...q,
        opciones: q.opciones
          ? (typeof q.opciones === "string" ? JSON.parse(q.opciones) : q.opciones)
          : [],
      })));
    } catch { setPreguntas([]); }
    setShowNewCategory(false);
    setNewCategoryName("");
    setModalOpen(true);
  };

  const addPregunta = () => {
    setPreguntas(prev => [...prev, { pregunta: "", tipo: "texto", obligatoria: 0, opciones: [], _new: true }]);
  };

  const updatePregunta = (index, field, value) => {
    setPreguntas(prev => prev.map((p, i) => i === index ? { ...p, [field]: value } : p));
  };

  const removePregunta = (index) => {
    setPreguntas(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.titulo || !form.empresa_id) return;
    setLoading(true);
    try {
      const offerData = { ...form, ...(editingOffer ? { id: editingOffer.id } : {}) };
      const res = await saveOffer(offerData);
      const offerId = editingOffer ? editingOffer.id : res.data.id;

      if (editingOffer) await deleteQuestionsByOffer(offerId);

      for (const q of preguntas) {
        if (q.pregunta.trim()) {
          await saveQuestion({
            oferta_id: offerId,
            pregunta: q.pregunta,
            tipo: q.tipo,
            obligatoria: q.obligatoria,
            opciones: q.tipo === "opciones" ? q.opciones : null,
          });
        }
      }
      await reload();
      setModalOpen(false);
    } catch (err) {
      alert(err.message || "Error al guardar oferta");
    }
    setLoading(false);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`¿Eliminar la oferta "${name}"?`)) return;
    try { await deleteOffer(id); await reload(); }
    catch (err) { alert(err.message || "Error al eliminar oferta"); }
  };

  const handleToggle = async (id) => {
    try { await toggleOfferStatus(id); await reload(); }
    catch (err) { alert(err.message || "Error al cambiar estado"); }
  };

  const handleCerrar = async (id, name) => {
    if (!window.confirm(`¿Cerrar la oferta "${name}"?`)) return;
    try { await closeOffer(id); await reload(); }
    catch (err) { alert(err.message || "Error al cerrar oferta"); }
  };

  const isExpired = (o) => o.fecha_expiracion && new Date(o.fecha_expiracion) <= new Date();

  const filteredOffers = offers
    .filter(o =>
      (o.titulo || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.empresa_nombre || "").toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(o => !filterEmpresa || o.empresa_nombre === filterEmpresa);

  const inputCls = "w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#123498]/10 focus:border-[#123498]";
  const labelCls = "text-xs font-black text-slate-500 uppercase tracking-wider mb-1 block";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-[#123498] uppercase tracking-wide">Gestión de Ofertas</h1>
          <p className="text-sm text-slate-400">Administra las convocatorias laborales</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setVistaActual(v => v === "ofertas" ? "reportes" : "ofertas")} 
            className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-black uppercase tracking-wider shadow-sm transition-all shrink-0 ${vistaActual === 'reportes' ? 'bg-[#123498] text-white hover:bg-blue-900' : 'bg-red-500 text-white hover:bg-red-600'}`}
          >
            {vistaActual === 'reportes' ? <Briefcase className="w-4 h-4" strokeWidth={2.8} /> : <Flag className="w-4 h-4" strokeWidth={2.8} />}
            {vistaActual === 'reportes' ? 'Ver Ofertas' : 'Ver Reportes'}
          </button>
          {vistaActual === 'ofertas' && (
            <button onClick={openNew} className="flex items-center justify-center gap-2 bg-[#F46F0B] hover:bg-[#d85f05] text-white px-5 py-3 rounded-xl text-sm font-black uppercase tracking-wider shadow-sm transition-all shrink-0">
              <Plus size={14} strokeWidth={2.8} />Nueva Oferta
            </button>
          )}
        </div>
      </div>

      {vistaActual === 'ofertas' && (
        <>
          {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative max-w-sm flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Buscar oferta..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#123498]/10 focus:border-[#123498] transition-all placeholder:text-slate-400" />
        </div>
        <select value={filterEmpresa} onChange={e => setFilterEmpresa(e.target.value)} className="px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#123498]/10 focus:border-[#123498] font-semibold text-slate-600">
          <option value="">Todas las empresas</option>
          {companies.map(c => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
        </select>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-3xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[9px] text-slate-400 uppercase tracking-widest border-b border-slate-100 bg-slate-50/50">
                <th className="px-5 py-3.5 font-black">Título</th>
                <th className="px-5 py-3.5 font-black">Empresa</th>
                <th className="hidden lg:table-cell px-5 py-3.5 font-black">Ubicación</th>
                <th className="hidden lg:table-cell px-5 py-3.5 font-black">Modalidad</th>
                <th className="hidden lg:table-cell px-5 py-3.5 font-black">Contrato</th>
                <th className="hidden lg:table-cell px-5 py-3.5 font-black text-center">Estado</th>
                <th className="px-5 py-3.5 font-black text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredOffers.map(o => {
                const isExpanded = expandedRowId === o.id;
                return (
                  <tr
                    key={o.id}
                    className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer lg:cursor-default"
                    onClick={() => setExpandedRowId(isExpanded ? null : o.id)}
                  >
                    <td className="px-5 py-3.5 font-bold text-[#1A1A1A]">
                      <span className="flex items-center gap-2">
                        <span className="lg:hidden text-slate-300">
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </span>
                        <span className="flex flex-col gap-0.5">
                          <span>{o.titulo}</span>
                          {(o.compartidos_count > 0) && (
                            <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-400">
                              <Share2 size={10} strokeWidth={2} />
                              {o.compartidos_count >= 1000
                                ? `${(o.compartidos_count / 1000).toFixed(1)}k`
                                : o.compartidos_count}{" "}
                              compartido{o.compartidos_count !== 1 ? "s" : ""}
                            </span>
                          )}
                        </span>
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">{o.empresa_nombre}</td>
                    <td className="hidden lg:table-cell px-5 py-3.5 text-slate-400">{o.ubicacion || "—"}</td>
                    <td className="hidden lg:table-cell px-5 py-3.5">
                      <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-600">
                        {MAP_MODALIDAD[o.modalidad] || o.modalidad}
                      </span>
                    </td>
                    <td className="hidden lg:table-cell px-5 py-3.5">
                      <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-600">
                        {MAP_CONTRATO[o.tipo_contrato] || o.tipo_contrato}
                      </span>
                    </td>
                    <td className="hidden lg:table-cell px-5 py-3.5 text-center">
                      {o.estado === "activa" && isExpired(o) ? (
                        <span className="text-[9px] font-black uppercase tracking-wider text-amber-600">Cerrada</span>
                      ) : (
                        <button onClick={(e) => { e.stopPropagation(); handleToggle(o.id); }} className="inline-flex items-center gap-1.5">
                          {o.estado === "activa"
                            ? <ToggleRight size={18} className="text-green-500" />
                            : <ToggleLeft size={18} className="text-slate-400" />}
                          <span className={`text-[9px] font-black uppercase tracking-wider ${o.estado === "activa" ? "text-green-600" : "text-slate-400"}`}>
                            {o.estado === "activa" ? "Activa" : "Pausada"}
                          </span>
                        </button>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        {!isExpired(o) && o.estado === "activa" && (
                          <button onClick={() => handleCerrar(o.id, o.titulo)} className="p-1.5 rounded-lg hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-colors" title="Cerrar oferta">
                            <Lock size={13} />
                          </button>
                        )}
                        <button onClick={() => openEdit(o)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-[#123498] transition-colors"><Edit3 size={13} /></button>
                        <button onClick={() => handleDelete(o.id, o.titulo)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredOffers.length === 0 && (
                <tr><td colSpan="7" className="py-12 text-center text-slate-400 text-sm">No se encontraron ofertas.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      </>
      )}

      {/* --- VISTA DE REPORTES --- */}
      {vistaActual === 'reportes' && (
        <div className="space-y-4">
          <div className="flex gap-2 mb-4">
            <button onClick={() => setFiltroReporte('pendientes')} className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-colors ${filtroReporte === 'pendientes' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-white text-gray-400 border border-gray-200'}`}>Pendientes</button>
            <button onClick={() => setFiltroReporte('revisados')} className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-colors ${filtroReporte === 'revisados' ? 'bg-blue-50 text-[#123498] border border-blue-200' : 'bg-white text-gray-400 border border-gray-200'}`}>Revisados</button>
            <button onClick={() => setFiltroReporte('descartados')} className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-colors ${filtroReporte === 'descartados' ? 'bg-gray-100 text-gray-600 border border-gray-300' : 'bg-white text-gray-400 border border-gray-200'}`}>Descartados</button>
          </div>
          
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-3xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[9px] text-slate-400 uppercase tracking-widest border-b border-slate-100 bg-slate-50/50">
                    <th className="px-5 py-3.5 font-black">Oferta</th>
                    <th className="px-5 py-3.5 font-black">Motivo / Descripción</th>
                    <th className="px-5 py-3.5 font-black">Fecha</th>
                    <th className="px-5 py-3.5 font-black text-center">Estado</th>
                    <th className="px-5 py-3.5 font-black text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {reportes.filter(r => r.estado === (filtroReporte === 'pendientes' ? 'pendiente' : (filtroReporte === 'revisados' ? 'revisado' : 'descartado'))).map(r => (
                    <tr key={r.id} className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-[#1A1A1A]">{r.oferta_titulo}</div>
                        <div className="text-xs text-slate-500">{r.empresa_nombre}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-red-500 text-xs uppercase tracking-wide">{r.motivo}</div>
                        <div className="text-slate-500 mt-1 line-clamp-2 max-w-md">{r.descripcion}</div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-400 whitespace-nowrap">
                        {new Date(r.fecha_reporte).toLocaleDateString('es-PE')}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase ${r.estado === 'pendiente' ? 'bg-red-50 text-red-600' : (r.estado === 'revisado' ? 'bg-blue-50 text-[#123498]' : 'bg-gray-100 text-gray-500')}`}>
                          {r.estado}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                        {r.estado === 'pendiente' && (
                          <>
                            <button 
                              onClick={async () => {
                                try {
                                  await marcarReporteRevisado(r.id);
                                  await reload();
                                } catch (e) {
                                  alert(e.message || "Error al marcar como revisado");
                                }
                              }}
                              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg text-xs font-bold uppercase transition-colors"
                              title="Aprobar / Revisar"
                            >
                              <CheckCircle size={14} /> Revisar
                            </button>
                            <button 
                              onClick={async () => {
                                try {
                                  await marcarReporteDescartado(r.id);
                                  await reload();
                                } catch (e) {
                                  alert(e.message || "Error al descartar");
                                }
                              }}
                              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold uppercase transition-colors"
                              title="Descartar reporte"
                            >
                              <XCircle size={14} /> Descartar
                            </button>
                          </>
                        )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {reportes.filter(r => r.estado === (filtroReporte === 'pendientes' ? 'pendiente' : (filtroReporte === 'revisados' ? 'revisado' : 'descartado'))).length === 0 && (
                    <tr><td colSpan="5" className="py-12 text-center text-slate-400 text-sm">No hay reportes {filtroReporte}.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- MODALES --- */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-black text-[#123498] uppercase tracking-wider">
                {editingOffer ? "Editar Oferta" : "Nueva Oferta"}
              </h2>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"><X size={16} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Título */}
              <div>
                <label className={labelCls}>Título del puesto</label>
                <input type="text" value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} className={inputCls} placeholder="Ej: Desarrollador Frontend" required />
              </div>

              {/* Empresa */}
              <div>
                <label className={labelCls}>Empresa</label>
                <select value={form.empresa_id} onChange={e => setForm({ ...form, empresa_id: e.target.value })} className={inputCls} required>
                  <option value="">Seleccionar empresa</option>
                  {companies.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              </div>

              {/* Ubicación + Categoría */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Ubicación</label>
                  <input type="text" value={form.ubicacion} onChange={e => setForm({ ...form, ubicacion: e.target.value })} className={inputCls} placeholder="Lima, Perú" />
                </div>
                <div>
                  <label className={labelCls}>Categoría</label>
                  {showNewCategory ? (
                    <div className="flex gap-1.5">
                      <input type="text" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), handleCreateCategory())} className="flex-1 min-w-0 px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#123498]/10 focus:border-[#123498]" placeholder="Nombre de categoría" autoFocus />
                      <button type="button" onClick={handleCreateCategory} className="px-2.5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-bold shrink-0">✓</button>
                      <button type="button" onClick={() => { setShowNewCategory(false); setNewCategoryName(""); }} className="px-2.5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-xl text-sm font-bold shrink-0">✕</button>
                    </div>
                  ) : (
                    <div className="flex gap-1.5">
                      <select value={form.categoria_id} onChange={e => setForm({ ...form, categoria_id: e.target.value })} className="flex-1 min-w-0 px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#123498]/10 focus:border-[#123498]">
                        <option value="">Sin categoría</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                      </select>
                      <button type="button" onClick={() => setShowNewCategory(true)} className="px-2.5 py-2.5 bg-[#123498] hover:bg-[#0f2b7a] text-white rounded-xl text-sm font-bold shrink-0" title="Nueva categoría">+</button>
                    </div>
                  )}
                </div>
              </div>

              {/* Salarios */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Salario mínimo (S/)</label>
                  <input type="number" value={form.salario_min} onChange={e => setForm({ ...form, salario_min: e.target.value })} className={inputCls} placeholder="Ej: 2500" />
                </div>
                <div>
                  <label className={labelCls}>Salario máximo (S/)</label>
                  <input type="number" value={form.salario_max} onChange={e => setForm({ ...form, salario_max: e.target.value })} className={inputCls} placeholder="Ej: 4500" />
                </div>
              </div>

              {/* Fechas */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Fecha de publicación</label>
                  <input type="datetime-local" value={form.fecha_publicacion} onChange={e => setForm({ ...form, fecha_publicacion: e.target.value })} className={inputCls} />
                  <p className="text-[9px] text-slate-400 mt-1">Vacío = publicación inmediata</p>
                </div>
                <div>
                  <label className={labelCls}>Fecha de cierre</label>
                  <input type="datetime-local" value={form.fecha_expiracion} onChange={e => setForm({ ...form, fecha_expiracion: e.target.value })} className={inputCls} />
                  <p className="text-[9px] text-slate-400 mt-1">Vacío = 90 días desde hoy</p>
                </div>
              </div>

              {/* Tipo contrato + Modalidad + Horario */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>Tipo contrato</label>
                  <select value={form.tipo_contrato} onChange={e => setForm({ ...form, tipo_contrato: e.target.value })} className={inputCls}>
                    <option value="Tiempo completo">Tiempo completo</option>
                    <option value="Permanente">Permanente</option>
                    <option value="Medio tiempo">Medio tiempo</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Prácticas">Prácticas</option>
                    <option value="Temporal">Temporal</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Modalidad</label>
                  <select value={form.modalidad} onChange={e => setForm({ ...form, modalidad: e.target.value })} className={inputCls}>
                    <option value="presencial">Presencial</option>
                    <option value="remoto">Remoto</option>
                    <option value="Híbrida">Híbrida</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Horario</label>
                  <select value={form.horario} onChange={e => setForm({ ...form, horario: e.target.value })} className={inputCls}>
                    <option value="">No especificar</option>
                    <option value="Tiempo completo">Tiempo completo</option>
                    <option value="Medio tiempo">Medio tiempo</option>
                    <option value="Flexible">Flexible</option>
                    <option value="Por turnos">Por turnos</option>
                    <option value="Nocturno">Nocturno</option>
                  </select>
                </div>
              </div>

              {/* Experiencia */}
              <div>
                <label className={labelCls}>Nivel de experiencia</label>
                <select value={form.nivel_experiencia} onChange={e => setForm({ ...form, nivel_experiencia: e.target.value })} className={inputCls}>
                  <option value="">No especificar</option>
                  <option value="junior">Junior</option>
                  <option value="semisenior">Semi-Senior</option>
                  <option value="senior">Senior</option>
                  <option value="gerente">Gerente</option>
                </select>
              </div>

              {/* Descripción */}
              <div>
                <label className={labelCls}>Descripción</label>
                <textarea value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} rows={3} className={`${inputCls} resize-none`} placeholder="Descripción del puesto..." />
              </div>

              {/* Requisitos */}
              <div>
                <label className={labelCls}>Requisitos</label>
                <textarea value={form.requisitos} onChange={e => setForm({ ...form, requisitos: e.target.value })} rows={3} className={`${inputCls} resize-none`} placeholder="• Requisito 1&#10;• Requisito 2" />
              </div>

              {/* Preguntas de filtro */}
              <div className="border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider">
                    Preguntas de filtro ({preguntas.length})
                  </label>
                  <button type="button" onClick={addPregunta} className="flex items-center gap-1 px-2.5 py-1.5 bg-[#123498] hover:bg-[#0f2b7a] text-white rounded-lg text-xs font-black uppercase tracking-wider transition-colors">
                    <Plus size={11} strokeWidth={2.8} />Agregar
                  </button>
                </div>
                {preguntas.length === 0 && (
                  <p className="text-xs text-slate-400 italic">Sin preguntas.</p>
                )}
                <div className="space-y-3">
                  {preguntas.map((q, idx) => (
                    <div key={idx} className="bg-slate-50 rounded-xl p-3 space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-black text-slate-400 mt-2.5 w-4 shrink-0">{idx + 1}.</span>
                        <div className="flex-1 space-y-2">
                          <input type="text" value={q.pregunta} onChange={e => updatePregunta(idx, "pregunta", e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#123498]/10 focus:border-[#123498] bg-white" placeholder="Escribe la pregunta..." />
                          <div className="flex items-center gap-2">
                            <select value={q.tipo} onChange={e => { updatePregunta(idx, "tipo", e.target.value); if (e.target.value !== "opciones") updatePregunta(idx, "opciones", []); }} className="px-2 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none bg-white">
                              <option value="texto">Texto libre</option>
                              <option value="numero">Número</option>
                              <option value="si_no">Sí / No</option>
                              <option value="opciones">Opciones</option>
                            </select>
                            <label className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold cursor-pointer select-none">
                              <input type="checkbox" checked={q.obligatoria === 1} onChange={e => updatePregunta(idx, "obligatoria", e.target.checked ? 1 : 0)} className="w-3.5 h-3.5 rounded border-slate-300" />
                              Obligatoria
                            </label>
                          </div>
                          {q.tipo === "opciones" && (
                            <div className="space-y-1.5 pl-1">
                              {(q.opciones || []).map((opt, oi) => (
                                <div key={oi} className="flex items-center gap-1.5">
                                  <input type="text" value={opt} onChange={e => { const newOpts = [...q.opciones]; newOpts[oi] = e.target.value; updatePregunta(idx, "opciones", newOpts); }} className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none" placeholder={`Opción ${oi + 1}`} />
                                  <button type="button" onClick={() => updatePregunta(idx, "opciones", q.opciones.filter((_, i) => i !== oi))} className="p-1 text-slate-400 hover:text-red-500"><Trash2 size={10} /></button>
                                </div>
                              ))}
                              <button type="button" onClick={() => updatePregunta(idx, "opciones", [...(q.opciones || []), ""])} className="text-xs font-bold text-[#123498] hover:text-[#0f2b7a]">+ Agregar opción</button>
                            </div>
                          )}
                        </div>
                        <button type="button" onClick={() => removePregunta(idx)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 shrink-0 mt-0.5"><Trash2 size={13} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-[#123498] hover:bg-[#0f2b7a] disabled:opacity-50 text-white py-3 rounded-xl text-sm font-black uppercase tracking-wider transition-colors">
                {loading ? "Guardando..." : editingOffer ? "Guardar Cambios" : "Publicar Oferta"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}