import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const labelCls = "text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block";
const inputCls = "w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#123498]/10 focus:border-[#123498] bg-white placeholder:text-slate-400";

const TIPOS_CONTRATO = [
  { value: "Permanente",    label: "Permanente" },
  { value: "Medio tiempo",  label: "Medio tiempo" },
  { value: "Freelance",     label: "Freelance" },
  { value: "Prácticas",     label: "Prácticas" },
  { value: "Temporal",      label: "Temporal" },
];

const MODALIDADES = [
  { value: "presencial", label: "Presencial" },
  { value: "Híbrida",    label: "Híbrido" },
  { value: "remoto",     label: "Remoto" },
];

const NIVELES = [
  { value: "",          label: "Sin especificar" },
  { value: "junior",    label: "Junior" },
  { value: "semisenior",label: "Semi-Senior" },
  { value: "senior",    label: "Senior" },
  { value: "gerente",   label: "Gerente" },
];

function ToggleGroup({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
            value === opt.value
              ? "bg-[#123498] text-white border-[#123498]"
              : "bg-white text-slate-600 border-slate-200 hover:border-[#123498] hover:text-[#123498]"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function ModalOfertaPaso2({ form, setForm }) {
  const [requisitoInput, setRequisitoInput] = useState("");

  // Parsear requisitos — los guardamos como array en memoria, string al enviar
  const requisitosArray = form.requisitos
    ? (Array.isArray(form.requisitos) ? form.requisitos : form.requisitos.split("\n").filter(Boolean))
    : [];

  const agregarRequisito = () => {
    if (!requisitoInput.trim()) return;
    const nuevos = [...requisitosArray, requisitoInput.trim()];
    setForm({ ...form, requisitos: nuevos });
    setRequisitoInput("");
  };

  const eliminarRequisito = (i) => {
    const nuevos = requisitosArray.filter((_, idx) => idx !== i);
    setForm({ ...form, requisitos: nuevos });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") { e.preventDefault(); agregarRequisito(); }
  };

  return (
    <div className="flex flex-col gap-5">

      {/* Tipo de contrato */}
      <div>
        <label className={labelCls}>Tipo de contrato</label>
        <ToggleGroup
          options={TIPOS_CONTRATO}
          value={form.tipo_contrato}
          onChange={v => setForm({ ...form, tipo_contrato: v })}
        />
      </div>

      {/* Modalidad + Nivel de experiencia */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className={labelCls}>Modalidad</label>
          <ToggleGroup
            options={MODALIDADES}
            value={form.modalidad}
            onChange={v => setForm({ ...form, modalidad: v })}
          />
        </div>
        <div>
          <label className={labelCls}>Nivel de experiencia</label>
          <select
            value={form.nivel_experiencia}
            onChange={e => setForm({ ...form, nivel_experiencia: e.target.value })}
            className={inputCls}
          >
            {NIVELES.map(n => <option key={n.value} value={n.value}>{n.label}</option>)}
          </select>
        </div>
      </div>

      {/* Vigencia */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className={labelCls}>Vigencia de la publicación</label>
          <span className="text-[10px] text-slate-400 font-medium">
            Vacío: publica hoy y cierra en 90 días
          </span>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="datetime-local"
            value={form.fecha_publicacion}
            onChange={e => setForm({ ...form, fecha_publicacion: e.target.value })}
            className={inputCls}
            placeholder="Publicación · dd/mm/aaaa"
          />
          <span className="text-slate-400 shrink-0">—</span>
          <input
            type="datetime-local"
            value={form.fecha_expiracion}
            onChange={e => setForm({ ...form, fecha_expiracion: e.target.value })}
            className={inputCls}
            placeholder="Cierre · dd/mm/aaaa"
          />
        </div>
      </div>

      {/* Descripción con contador */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className={labelCls}>Descripción *</label>
          <span className="text-xs text-slate-400 font-medium">
            {(form.descripcion || "").length}/2000
          </span>
        </div>
        <textarea
          value={form.descripcion}
          onChange={e => setForm({ ...form, descripcion: e.target.value })}
          rows={5}
          maxLength={2000}
          placeholder="Qué hará la persona en el puesto y con qué equipo trabajará"
          className={`${inputCls} resize-none`}
        />
      </div>

      {/* Requisitos como chips */}
      <div>
        <label className={labelCls}>Requisitos</label>
        <div className="rounded-xl border border-slate-200 overflow-hidden">
          {/* Chips existentes */}
          {requisitosArray.length > 0 && (
            <div className="p-3 flex flex-col gap-1.5 border-b border-slate-100">
              {requisitosArray.map((req, i) => (
                <div key={i} className="flex items-center gap-2 group">
                  <span className="w-2 h-2 rounded-full bg-[#F46F0B] shrink-0" />
                  <span className="flex-1 text-sm text-slate-700">{req}</span>
                  <button
                    type="button"
                    onClick={() => eliminarRequisito(i)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {/* Input para agregar */}
          <div className="flex items-center gap-2 px-3 py-2.5">
            <span className="w-2 h-2 rounded-full bg-slate-200 shrink-0" />
            <input
              type="text"
              value={requisitoInput}
              onChange={e => setRequisitoInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe un requisito y presiona Enter"
              className="flex-1 bg-transparent text-sm text-slate-600 placeholder:text-slate-400 outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}