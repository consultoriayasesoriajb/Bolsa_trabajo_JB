import { useState } from "react";
import { ChevronDownIcon, CheckIcon, PlusIcon } from "@heroicons/react/24/outline";

const inputCls = "w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#123498]/10 focus:border-[#123498] bg-white placeholder:text-slate-400";
const labelCls = "text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block";

function EmpresaSelector({ companies, value, onChange }) {
  const [open, setOpen] = useState(false);
  const selected = companies.find(c => String(c.id) === String(value));

  const getInitials = (nombre) =>
    nombre.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="relative">
      {/* Pill activo */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-sm font-semibold text-slate-700 hover:border-[#123498] transition-colors"
      >
        {selected ? (
          <>
            <span className="w-6 h-6 rounded-full bg-[#123498] text-white text-[10px] font-black flex items-center justify-center shrink-0">
              {getInitials(selected.nombre)}
            </span>
            <span className="max-w-30 truncate">{selected.nombre}</span>
          </>
        ) : (
          <span className="text-slate-400">Seleccionar empresa</span>
        )}
        <ChevronDownIcon className={`w-3.5 h-3.5 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 top-full mt-2 w-72 bg-white rounded-2xl border border-slate-200 shadow-lg z-10 overflow-hidden">
          <div className="p-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-3 py-2">
              Tus empresas
            </p>
            {companies.map(c => (
              <button
                key={c.id}
                type="button"
                onClick={() => { onChange(c.id); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                  String(c.id) === String(value)
                    ? "bg-[#f2f5fc]"
                    : "hover:bg-slate-50"
                }`}
              >
                <span className="w-9 h-9 rounded-full bg-[#123498] text-white text-xs font-black flex items-center justify-center shrink-0">
                  {getInitials(c.nombre)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">{c.nombre}</p>
                  <p className="text-xs text-slate-400">{c.sector || "Sin sector"}</p>
                </div>
                {String(c.id) === String(value) && (
                  <CheckIcon className="w-4 h-4 text-[#123498] shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
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
    <div className="flex flex-col gap-5">

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
                className="flex-1 min-w-0 px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#123498]/10 focus:border-[#123498]"
                placeholder="Nueva categoría"
                autoFocus
              />
              <button type="button" onClick={handleCreateCategory}
                className="px-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-bold shrink-0">✓</button>
              <button type="button" onClick={() => { setShowNewCategory(false); setNewCategoryName(""); }}
                className="px-2.5 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-xl text-sm font-bold shrink-0">✕</button>
            </div>
          ) : (
            <div className="flex gap-1.5">
              <select
                value={form.categoria_id}
                onChange={e => setForm({ ...form, categoria_id: e.target.value })}
                className="flex-1 min-w-0 px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#123498]/10 focus:border-[#123498] bg-white"
              >
                <option value="">Sin categoría</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
              <button type="button" onClick={() => setShowNewCategory(true)}
                className="px-2.5 py-2.5 bg-[#123498] hover:bg-[#0f2b7a] text-white rounded-xl text-sm font-bold shrink-0"
                title="Nueva categoría">
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Rango salarial */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className={labelCls}>Rango salarial (S/)</label>
          <span className="text-[10px] text-[#123498] font-semibold">
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