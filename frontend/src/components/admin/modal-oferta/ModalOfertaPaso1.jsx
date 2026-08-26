import { useState } from "react";
import { ChevronDownIcon, CheckIcon, PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const BASE_URL = import.meta.env.VITE_API_URL?.replace("/api", "") ?? "";

const inputCls = "w-full px-4 py-2.5 text-black/80 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-azul/10 focus:border-azul bg-white placeholder:text-slate-400";
const labelCls = "text-sm font-bold text-naranja/80 mb-2 block";

function getInitials(nombre) {
  return (nombre || "").split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
}

function LogoEmpresa({ empresa, size = "md", disabled = false }) {
  const sizeMap = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-11 h-11 text-sm",
  };
  const cls = sizeMap[size] ?? sizeMap.md;
  const fallbackBg = disabled ? "bg-slate-400" : "bg-[#123498]";

  if (empresa?.logo_url) {
    return (
      <img
        src={`${BASE_URL}/${empresa.logo_url}`}
        alt={empresa.nombre}
        className={`${cls} rounded-xl object-contain border border-slate-100 bg-white p-0.5 shrink-0 shadow-sm`}
      />
    );
  }
  return (
    <span className={`${cls} rounded-xl ${fallbackBg} text-white font-black flex items-center justify-center shrink-0`}>
      {getInitials(empresa?.nombre)}
    </span>
  );
}

export function EmpresaSelector({ companies, value, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selected = companies.find(c => String(c.id) === String(value));
  const filtradas = companies.filter(c =>
    c.nombre.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative">
      <button
        type="button"
        // 2. Bloqueamos el click si está disabled (en paso 2 o 3)
        onClick={() => { if (!disabled) { setOpen(v => !v); setQuery(""); } }}
        className={`flex items-center gap-2 px-3 py-2 bg-white border rounded-2xl text-sm font-semibold transition-colors ${
          disabled 
            ? "border-slate-100 text-slate-500 cursor-default shadow-none bg-slate-50/50" 
            : "border-slate-200 text-slate-700 hover:border-[#123498] cursor-pointer shadow-sm"
        }`}
      >
        {selected ? (
          <>
            <LogoEmpresa empresa={selected} size="md" disabled={disabled} />
            <span className="max-w-40 truncate font-bold">{selected.nombre}</span>
          </>
        ) : (
          <span className="text-slate-400">Seleccionar empresa</span>
        )}
        
        {/* 3. Ocultamos la flechita si está disabled */}
        {!disabled && (
          <ChevronDownIcon className={`w-3.5 h-3.5 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
        )}
      </button>

      {/* Dropdown (solo se renderiza si no está disabled y está abierto) */}
      {!disabled && open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full mt-2 w-72 bg-white rounded-2xl border border-slate-200 shadow-lg z-20 overflow-hidden">
            <div className="p-2 border-b border-slate-100">
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl">
                <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Buscar empresa..."
                  className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none"
                  autoFocus
                />
              </div>
            </div>
            <div className="max-h-52 overflow-y-auto p-2">
              <p className="text-xs font-black text-slate-400 uppercase tracking-wider px-3 py-1.5">Tus empresas</p>
              {filtradas.length > 0 ? filtradas.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => { onChange(c.id); setOpen(false); setQuery(""); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                    String(c.id) === String(value) ? "bg-[#f2f5fc]" : "hover:bg-slate-50"
                  }`}
                >
                  <LogoEmpresa empresa={c} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{c.nombre}</p>
                    <p className="text-xs text-slate-400">{c.sector || "Sin sector"}</p>
                  </div>
                  {String(c.id) === String(value) && <CheckIcon className="w-4 h-4 text-[#123498] shrink-0" />}
                </button>
              )) : (
                <p className="text-xs text-slate-400 text-center py-4">No se encontraron empresas</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function ModalOfertaPaso1({
  form, setForm,
  companies, categories,
  showNewCategory, setShowNewCategory,
  newCategoryName, setNewCategoryName,
  handleCreateCategory,
}) {
  return (
    <div className="flex flex-col gap-7">
      {/* Título */}
      <div>
        <label className={labelCls}>Título del puesto *</label>
        <input
          type="text"
          value={form.titulo}
          onChange={e => setForm({ ...form, titulo: e.target.value })}
          className={inputCls}
          placeholder="Ej: Desarrollador Frontend"
        />
      </div>

      {/* Ubicación + Categoría */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Ubicación *</label>
          <input
            type="text"
            value={form.ubicacion}
            onChange={e => setForm({ ...form, ubicacion: e.target.value })}
            className={inputCls}
            placeholder="Lima, Perú"
          />
        </div>
        <div>
          <label className={labelCls}>Categoría</label>
          {showNewCategory ? (
            <div className="flex gap-1.5">
              <input
                type="text"
                value={newCategoryName}
                onChange={e => setNewCategoryName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), handleCreateCategory())}
                className="flex-1 min-w-0 px-3 py-2.5 text-black/80 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-azul/10 focus:border-azul"
                placeholder="Nueva categoría"
                autoFocus
              />
              <button type="button" onClick={handleCreateCategory}
                className="px-2.5 bg-[#4CAF50] hover:bg-[#4CAF50]/80 text-white rounded-xl text-sm font-bold shrink-0">✓</button>
              <button type="button" onClick={() => { setShowNewCategory(false); setNewCategoryName(""); }}
                className="px-2.5 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-xl text-sm font-bold shrink-0">✕</button>
            </div>
          ) : (
            <div className="flex gap-1.5">
              <select
                value={form.categoria_id}
                onChange={e => setForm({ ...form, categoria_id: e.target.value })}
                className="flex-1 min-w-0 px-3 py-2.5 text-black/80 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-azul/10 focus:border-azul bg-white"
              >
                <option value="">Sin categoría</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
              <button type="button" onClick={() => setShowNewCategory(true)}
                className="px-2.5 py-2.5 bg-white border border-slate-200 hover:bg-azul text-white rounded-xl shrink-0"
                title="Nueva categoría">
                <PlusIcon className="w-4 h-4 text-slate-400 hover:text-white" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Rango salarial */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className={labelCls}>Rango salarial (S/)</label>
          <span className="text-[10px] text-gris-oscuro font-semibold">
            Publicarlo aumenta las postulaciones
          </span>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={form.salario_min}
            onChange={e => setForm({ ...form, salario_min: e.target.value })}
            className={inputCls}
            placeholder="Mínimo · 2500"
          />
          <span className="text-slate-400 shrink-0">—</span>
          <input
            type="number"
            value={form.salario_max}
            onChange={e => setForm({ ...form, salario_max: e.target.value })}
            className={inputCls}
            placeholder="Máximo · 4500"
          />
        </div>
      </div>
    </div>
  );
}