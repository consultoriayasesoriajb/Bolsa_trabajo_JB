import { useState, useEffect } from "react";
import { Plus, Search, Edit3, Trash2, Briefcase, X } from "lucide-react";
import {
  getCompanies,
  getOffers,
  saveCompany,
  deleteCompany,
} from "../../services/adminService";
import { UPLOADS_BASE_URL } from "../../services/api";


// Beneficios predefinidos para seleccionar fácilmente
const BENEFICIOS_OPCIONES = [
  "Seguro médico",
  "Trabajo remoto",
  "Horario flexible",
  "Capacitaciones",
  "Bonos por desempeño",
  "Seguro de vida",
  "Vale de alimentación",
  "Transporte",
  "Días libres adicionales",
];

export default function SectionEmpresas() {
  const [companies, setCompanies] = useState([]);
  const [offers, setOffers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [loading, setLoading] = useState(false);

  // Campos del formulario
  const [formNombre, setFormNombre] = useState("");
  const [formRuc, setFormRuc] = useState("");
  const [formSector, setFormSector] = useState("");
  const [formDescripcion, setFormDescripcion] = useState("");
  const [formUbicacion, setFormUbicacion] = useState("");
  const [formAnio, setFormAnio] = useState("");
  const [formEmpleados, setFormEmpleados] = useState("");
  const [formWeb, setFormWeb] = useState("");
  const [formBeneficios, setFormBeneficios] = useState([]);
  const [logoFile, setLogoFile] = useState(null);

  const reload = async () => {
    try {
      setCompanies(await getCompanies());
    } catch {
      setCompanies([]);
    }
    try {
      setOffers(await getOffers());
    } catch {
      setOffers([]);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  const resetForm = () => {
    setFormNombre("");
    setFormRuc("");
    setFormSector("");
    setFormDescripcion("");
    setFormUbicacion("");
    setFormAnio("");
    setFormEmpleados("");
    setFormWeb("");
    setFormBeneficios([]);
    setLogoFile(null);
  };

  const openNew = () => {
    setEditingCompany(null);
    resetForm();
    setModalOpen(true);
  };

  const openEdit = (c) => {
    setEditingCompany(c);
    setFormNombre(c.nombre || "");
    setFormRuc(c.ruc || "");
    setFormSector(c.sector || "");
    setFormDescripcion(c.descripcion || "");
    setFormUbicacion(c.ubicacion || "");
    setFormAnio(c.anio_fundacion || "");
    setFormEmpleados(c.num_empleados || "");
    setFormWeb(c.sitio_web || "");
    // beneficios viene como JSON string o array
    const benef = c.beneficios
      ? typeof c.beneficios === "string"
        ? JSON.parse(c.beneficios)
        : c.beneficios
      : [];
    setFormBeneficios(benef);
    setLogoFile(null);
    setModalOpen(true);
  };

  const toggleBeneficio = (b) => {
    setFormBeneficios((prev) =>
      prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b],
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formNombre || !formSector || !formRuc) return;
    setLoading(true);
    try {
      await saveCompany(
        {
          nombre: formNombre,
          ruc: formRuc,
          sector: formSector,
          descripcion: formDescripcion,
          ubicacion: formUbicacion,
          anio_fundacion: formAnio || null,
          num_empleados: formEmpleados || null,
          sitio_web: formWeb || null,
          beneficios: JSON.stringify(formBeneficios),
          ...(editingCompany ? { id: editingCompany.id } : {}),
        },
        logoFile,
      );
      await reload();
      setModalOpen(false);
    } catch (err) {
      alert(err.message || "Error al guardar empresa");
    }
    setLoading(false);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`¿Eliminar la empresa "${name}"?`)) return;
    try {
      await deleteCompany(id);
      await reload();
    } catch (err) {
      alert(err.message || "Error al eliminar empresa");
    }
  };

  const filteredCompanies = companies.filter(
    (c) =>
      c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.sector.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getOffersCount = (compId) =>
    offers.filter((o) => o.empresa_id === compId && o.estado === "activa")
      .length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-[#123498] uppercase tracking-wide">
            Gestión de Empresas
          </h1>
          <p className="text-sm text-slate-400">
            Administra las empresas clientes
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center justify-center gap-2 bg-[#F46F0B] hover:bg-[#d85f05] text-white px-5 py-3 rounded-xl text-sm font-black uppercase tracking-wider shadow-sm transition-all shrink-0"
        >
          <Plus size={14} strokeWidth={2.8} />
          Registrar Empresa
        </button>
      </div>

      {/* Buscador */}
      <div className="relative max-w-sm">
        <Search
          size={14}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          placeholder="Buscar empresa..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#123498]/10 focus:border-[#123498] transition-all placeholder:text-slate-400"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCompanies.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-3xs hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {c.logo_url ? (
                  <img
                    src={UPLOADS_BASE_URL + c.logo_url}
                    alt={c.nombre}
                    className="w-12 h-12 rounded-xl object-contain shrink-0 bg-white border border-slate-200 p-1"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg shrink-0 bg-[#123498]">
                    {c.nombre.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="text-base font-black text-[#1A1A1A]">
                    {c.nombre}
                  </h3>
                  <p className="text-sm text-slate-400 font-semibold">
                    {c.sector}
                  </p>
                  {c.ubicacion && (
                    <p className="text-sm text-slate-400">{c.ubicacion}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEdit(c)}
                  className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-[#123498] transition-colors"
                >
                  <Edit3 size={13} />
                </button>
                <button
                  onClick={() => handleDelete(c.id, c.nombre)}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed mb-3 line-clamp-2">
              {c.descripcion || "Sin descripción"}
            </p>
            <div className="flex items-center gap-1.5 text-sm font-bold text-[#123498]">
              <Briefcase size={11} />
              <span>{getOffersCount(c.id)} ofertas activas</span>
            </div>
          </div>
        ))}
        {filteredCompanies.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-400 text-sm">
            No se encontraron empresas.
          </div>
        )}
      </div>


      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="flex items-center justify-between px-7 pt-6 pb-4 border-b border-slate-100 shrink-0">
              <div>
                <h2 className="text-base font-black text-[#123498]">
                  {editingCompany ? "Editar empresa" : "Nueva empresa"}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {editingCompany ? "Modifica los datos de la empresa" : "Registra una nueva empresa en la plataforma"}
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* FORMULARIO */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex flex-1 overflow-hidden">

                {/* ── COLUMNA IZQUIERDA ── */}
                <div className="flex-1 overflow-y-auto px-7 py-6 space-y-4">

                  {/* Subtítulo izquierdo */}
                  <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider mb-1">
                    Detalles de la empresa
                  </h3>

                  {/* Nombre + RUC */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-black text-naranja/80 uppercase tracking-wider mb-1.5 block">Nombre *</label>
                      <input type="text" value={formNombre} onChange={(e) => setFormNombre(e.target.value)}
                        className="w-full px-3 py-2.5 text-sm text-black/80 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-azul/10 focus:border-azul"
                        placeholder="Nombre de la empresa" required />
                    </div>
                    <div>
                      <label className="text-xs font-black text-naranja/80 uppercase tracking-wider mb-1.5 block">RUC *</label>
                      <input type="text" value={formRuc} onChange={(e) => setFormRuc(e.target.value)}
                        className="w-full px-3 py-2.5 text-sm text-black/80 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-azul/10 focus:border-azul"
                        placeholder="Ej: 20546321847" required />
                    </div>
                  </div>

                  {/* Sector + Año */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-black text-naranja/80 uppercase tracking-wider mb-1.5 block">Sector *</label>
                      <input type="text" value={formSector} onChange={(e) => setFormSector(e.target.value)}
                        className="w-full px-3 py-2.5 text-sm text-black/80 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-azul/10 focus:border-azul"
                        placeholder="Ej: Tecnología, Seguridad..." required />
                    </div>
                    <div>
                      <label className="text-xs font-black text-naranja/80 uppercase tracking-wider mb-1.5 block">Año de fundación</label>
                      <input type="number" value={formAnio} onChange={(e) => setFormAnio(e.target.value)}
                        min="1900" max={new Date().getFullYear()}
                        className="w-full px-3 py-2.5 text-sm text-black/80 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-azul/10 focus:border-azul"
                        placeholder="Ej: 2005" />
                    </div>
                  </div>

                  {/* Descripción */}
                  <div>
                    <label className="text-xs font-black text-naranja/80 uppercase tracking-wider mb-1.5 block">Descripción</label>
                    <textarea value={formDescripcion} onChange={(e) => setFormDescripcion(e.target.value)}
                      rows={3} className="w-full px-3 py-2.5 text-sm text-black/80 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-azul/10 focus:border-azul resize-none"
                      placeholder="Breve descripción de la empresa..." />
                  </div>

                  {/* Ubicación + N° empleados */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-black text-naranja/80 uppercase tracking-wider mb-1.5 block">Ubicación</label>
                      <input type="text" value={formUbicacion} onChange={(e) => setFormUbicacion(e.target.value)}
                        className="w-full px-3 py-2.5 text-sm text-black/80 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-azul/10 focus:border-azul"
                        placeholder="Lima, Perú" />
                    </div>
                    <div>
                      <label className="text-xs font-black text-naranja/80 uppercase tracking-wider mb-1.5 block">N° de empleados</label>
                      <select value={formEmpleados} onChange={(e) => setFormEmpleados(e.target.value)}
                        className="w-full px-3 py-2.5 text-sm text-black/80 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-azul/10 focus:border-azul bg-white">
                        <option value="">Sin especificar</option>
                        <option value="1-10">1 - 10</option>
                        <option value="11-50">11 - 50</option>
                        <option value="51-100">51 - 100</option>
                        <option value="101-500">101 - 500</option>
                        <option value="500+">Más de 500</option>
                      </select>
                    </div>
                  </div>

                  {/* Beneficios */}
                  <div>
                    <label className="text-xs font-black text-naranja/80 uppercase tracking-wider mb-2 block">Beneficios destacados</label>
                    <div className="flex flex-wrap gap-1.5">
                      {BENEFICIOS_OPCIONES.map((b) => (
                        <button key={b} type="button" onClick={() => toggleBeneficio(b)}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-black uppercase tracking-wide transition-colors ${
                            formBeneficios.includes(b)
                              ? "bg-azul/10 border border-azul text-azul"
                              : "bg-white border border-slate-200 text-slate-500 hover:bg-azul/5 hover:border-azul hover:text-azul"
                          }`}>
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Separador flotante vertical */}
                <div className="flex items-stretch py-6 shrink-0 w-px">
                  <div className="w-px bg-slate-200 rounded-full mx-auto" />
                </div>

                {/* ── COLUMNA DERECHA ── */}
                <div className="w-72 shrink-0 flex flex-col overflow-y-auto px-6 py-6 gap-5">

                  {/* Logo upload */}
                  <div>
                    <label className="text-xs font-black text-naranja/80 uppercase tracking-wider mb-2 block">Logo de la empresa</label>

                    {/* Vista previa */}
                    <div className="w-full aspect-square rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center mb-3 overflow-hidden">
                      {logoFile ? (
                        <img src={URL.createObjectURL(logoFile)} alt="Vista previa" className="w-full h-full object-contain p-4" />
                      ) : editingCompany?.logo_url ? (
                        <img src={UPLOADS_BASE_URL + editingCompany.logo_url} alt="Logo actual" className="w-full h-full object-contain p-4" />
                      ) : (
                        <div className="flex flex-col items-center gap-2 select-none">
                          <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-xs font-semibold text-slate-400">Sin logo</span>
                        </div>
                      )}
                    </div>

                    {/* Botón subir */}
                    <label className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-[#123498] hover:bg-azul/5 hover:border-azul cursor-pointer transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      {logoFile ? "Cambiar imagen" : "Subir logo"}
                      <input type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml"
                        onChange={(e) => setLogoFile(e.target.files[0])} className="hidden" />
                    </label>
                    {logoFile && (
                      <p className="text-[10px] text-slate-400 text-center mt-1 truncate">{logoFile.name}</p>
                    )}
                  </div>

                  {/* Sitio web */}
                  <div>
                    <label className="text-xs font-black text-naranja/80 uppercase tracking-wider mb-1.5 block">Sitio web</label>
                    <input type="url" value={formWeb} onChange={(e) => setFormWeb(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm text-black/80 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-azul/10 focus:border-azul"
                      placeholder="https://..." />
                  </div>

                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* Botón submit */}
                  <button type="submit" disabled={loading}
                    className="w-full bg-[#123498] hover:bg-[#0f2a80] disabled:opacity-50 text-white py-3 rounded-xl text-sm font-black uppercase tracking-wider transition-colors shadow-md">
                    {loading ? "Guardando..." : editingCompany ? "Guardar cambios" : "Registrar empresa"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
