import { useState, useEffect } from "react";
import { 
  Plus, Search, Edit3, Trash2, X, Lock, ToggleLeft, ToggleRight, ChevronDown, ChevronUp
} from "lucide-react";
import {
  getOffers, getCompanies, saveOffer, deleteOffer,
  toggleOfferStatus, closeOffer, saveCategory,
  getQuestions, saveQuestion, deleteQuestionsByOffer
} from "../../services/adminService";
import { apiFetch } from "../../services/api";
import ModalOferta from "./ModalOferta";

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

      // 1. Si PHP devuelve un JSON con "success: false", capturamos su mensaje real
      if (res && res.success === false) {
        throw new Error("PHP dice: " + (res.message || res.error || "Solicitud rechazada"));
      }

      const offerId = editingOffer 
        ? editingOffer.id 
        : (res?.data?.id || res?.id);

      // 2. Si sigue sin haber ID, imprimimos la respuesta completa para depurar
      if (!offerId) {
        throw new Error("Respuesta cruda del servidor: " + JSON.stringify(res));
      }

      // Guardado de preguntas
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
      // Ahora veremos el error verdadero en pantalla
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
        <button onClick={openNew} className="flex items-center justify-center gap-2 bg-[#F46F0B] hover:bg-[#d85f05] text-white px-5 py-3 rounded-xl text-sm font-black uppercase tracking-wider shadow-sm transition-all shrink-0">
          <Plus size={14} strokeWidth={2.8} />Nueva Oferta
        </button>
      </div>

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
                        {o.titulo}
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

      {/* Modal */}
      <ModalOferta
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        editingOffer={editingOffer}
        form={form}
        setForm={setForm}
        companies={companies}
        categories={categories}
        showNewCategory={showNewCategory}
        setShowNewCategory={setShowNewCategory}
        newCategoryName={newCategoryName}
        setNewCategoryName={setNewCategoryName}
        handleCreateCategory={handleCreateCategory}
        preguntas={preguntas}
        addPregunta={addPregunta}
        updatePregunta={updatePregunta}
        removePregunta={removePregunta}
        handleSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
}