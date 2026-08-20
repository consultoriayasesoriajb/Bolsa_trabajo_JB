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
                    className="w-10 h-10 rounded-xl object-cover shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg shrink-0 bg-[#123498]">
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 mx-4 max-h-[90vh] overflow-y-auto border-b-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-black text-[#123498] uppercase tracking-wider">
                {editingCompany ? "Editar Empresa" : "Nueva Empresa"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {/* Nombre */}
                <div>
                  <label className="text-xs font-black text-azul uppercase tracking-wider mb-1 block">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={formNombre}
                    onChange={(e) => setFormNombre(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm text-black/80 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-azul/10 focus:border-azul"
                    placeholder="Nombre de la empresa"
                    required
                  />
                </div>

                {/* RUC */}
                <div>
                  <label className="text-xs font-black text-azul uppercase tracking-wider mb-1 block">
                    RUC *
                  </label>
                  <input
                    type="text"
                    value={formRuc}
                    onChange={(e) => setFormRuc(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm text-black/80 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-azul/10 focus:border-azul"
                    placeholder="Ej: 20546321847"
                    required
                  />
                </div>

                {/* Sector */}
                <div>
                  <label className="text-xs font-black text-azul uppercase tracking-wider mb-1 block">
                    Sector *
                  </label>
                  <input
                    type="text"
                    value={formSector}
                    onChange={(e) => setFormSector(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm text-black/80 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-azul/10 focus:border-azul"
                    placeholder="Ej: Tecnología, Seguridad..."
                    required
                  />
                </div>

                {/* Año de fundación */}
                <div>
                  <label className="text-xs font-black text-azul uppercase tracking-wider mb-1 block">
                    Año de fundación
                  </label>
                  <input
                    type="number"
                    value={formAnio}
                    onChange={(e) => setFormAnio(e.target.value)}
                    min="1900"
                    max={new Date().getFullYear()}
                    className="w-full px-3 py-2.5 text-sm text-black/80 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-azul/10 focus:border-azul"
                    placeholder="Ej: 2005"
                  />
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="text-xs font-black text-azul uppercase tracking-wider mb-1 block">
                  Descripción
                </label>
                <textarea
                  value={formDescripcion}
                  onChange={(e) => setFormDescripcion(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2.5 text-sm text-black/80 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-azul/10 focus:border-azul resize-none"
                  placeholder="Breve descripción de la empresa..."
                />
              </div>

              {/* Ubicación + N° empleados */}
              <div className="grid grid-cols-2 gap-3">
                {/* Ubicación*/}
                <div>
                  <label className="text-xs font-black text-azul uppercase tracking-wider mb-1 block">
                    Ubicación
                  </label>
                  <input
                    type="text"
                    value={formUbicacion}
                    onChange={(e) => setFormUbicacion(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm text-black/80 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-azul/10 focus:border-azul"
                    placeholder="Lima, Perú"
                  />
                </div>
                {/* N° de empleados */}
                <div>
                  <label className="text-xs font-black text-azul uppercase tracking-wider mb-1 block">
                    N° de empleados
                  </label>
                  <select
                    value={formEmpleados}
                    onChange={(e) => setFormEmpleados(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm text-black/80 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-azul/10 focus:border-azul"
                  >
                    <option value="">Sin especificar</option>
                    <option value="1-10">1 - 10</option>
                    <option value="11-50">11 - 50</option>
                    <option value="51-100">51 - 100</option>
                    <option value="101-500">101 - 500</option>
                    <option value="500+">Más de 500</option>
                  </select>
                </div>
              </div>

              {/* Sitio web */}
              <div>
                <label className="text-xs font-black text-azuluppercase tracking-wider mb-1 block">
                  Sitio web
                </label>
                <input
                  type="url"
                  value={formWeb}
                  onChange={(e) => setFormWeb(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm text-black/80 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-azul/10 focus:border-azul"
                  placeholder="https://..."
                />
              </div>

              {/* Beneficios */}
              <div>
                <label className="text-xs font-black text-azul uppercase tracking-wider mb-2 block">
                  Beneficios destacados
                </label>
                <div className="flex flex-wrap gap-2">
                  {BENEFICIOS_OPCIONES.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => toggleBeneficio(b)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-colors ${
                        formBeneficios.includes(b)
                          ? "bg-[#123498] text-white"
                          : "bg-slate-100 text-slate-500 hover:bg-[#123498]/10 hover:text-[#123498]"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Logo */}
              <div>
                <label className="text-xs font-black text-azul uppercase tracking-wider mb-1 block">
                  Logo de la empresa
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/svg+xml"
                  onChange={(e) => setLogoFile(e.target.files[0])}
                  className="w-full text-sm text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-black file:uppercase file:tracking-wider file:bg-amarillo-hansa/10 file:text-amarillo-hansa hover:file:bg-amarillo-hansa/20 file:cursor-pointer"
                />
                <div className="mt-2">
                  {logoFile ? (
                    <img
                      src={URL.createObjectURL(logoFile)}
                      alt="Vista previa"
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                    />
                  ) : editingCompany?.logo_url ? (
                    <img
                      src={UPLOADS_BASE_URL + editingCompany.logo_url}
                      alt="Logo actual"
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                    />
                  ) : null}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-naranja hover:bg-naranja/80 disabled:opacity-50 text-white py-3 rounded-xl text-sm font-black uppercase tracking-wider transition-colors"
              >
                {loading
                  ? "Guardando..."
                  : editingCompany
                    ? "Guardar Cambios"
                    : "Registrar Empresa"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
