import { useState } from "react";
import { PlusIcon, XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";

const MAX_PREGUNTAS = 5;

const TIPOS_PREGUNTA = [
  { value: "texto",   label: "Texto libre" },
  { value: "numero",  label: "Número" },
  { value: "si_no",   label: "Sí / No" },
  { value: "opciones",label: "Opciones" },
];

// 1. Añadimos el nuevo componente OpcionesEditor aquí arriba
function OpcionesEditor({ opciones, onChange }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newOptionText, setNewOptionText] = useState("");

  const handleAdd = () => {
    const trimmed = newOptionText.trim();
    if (trimmed && !opciones.includes(trimmed)) {
      onChange([...opciones, trimmed]);
    }
    setNewOptionText("");
    setIsAdding(false);
  };

  const handleRemove = (indexToRemove) => {
    onChange(opciones.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 mt-2">
      {/* Pills de opciones ya agregadas */}
      {opciones.map((opcion, index) => (
        <span
          key={index}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 text-slate-700 rounded-full text-xs font-semibold"
        >
          {opcion}
          <button
            type="button"
            onClick={() => handleRemove(index)}
            className="text-slate-400 hover:text-red-500 rounded-full transition-colors"
          >
            <XMarkIcon className="w-3 h-3" />
          </button>
        </span>
      ))}

      {/* Input inline o botón de agregar */}
      {isAdding ? (
        <div className="inline-flex items-center gap-1 bg-white border border-[#123498] rounded-full px-2 py-0.5 shadow-sm">
          <input
            type="text"
            value={newOptionText}
            onChange={(e) => setNewOptionText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              } else if (e.key === "Escape") {
                setIsAdding(false);
                setNewOptionText("");
              }
            }}
            placeholder="Nueva opción..."
            className="text-xs text-slate-700 bg-transparent outline-none w-28 px-1 py-0.5"
            autoFocus
          />
          <button
            type="button"
            onClick={handleAdd}
            className="p-1 text-green-600 hover:text-green-700"
            title="Añadir"
          >
            <CheckIcon className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              setIsAdding(false);
              setNewOptionText("");
            }}
            className="p-1 text-slate-400 hover:text-slate-600"
            title="Cancelar"
          >
            <XMarkIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center gap-1 px-3 py-1 border border-dashed border-[#123498] text-[#123498] rounded-full text-xs font-semibold hover:bg-[#f2f5fc] transition-colors"
        >
          <PlusIcon className="w-3 h-3" /> Opción
        </button>
      )}
    </div>
  );
}

// 2. Tu componente principal
export default function ModalOfertaPaso3({
  preguntas, addPregunta, updatePregunta, removePregunta,
}) {
  return (
    <div className="flex flex-col gap-4">

      {/* Info */}
      <p className="text-xs text-slate-400 font-medium">
        Opcional · se responden al postular
      </p>

      {/* Lista de preguntas */}
      {preguntas.map((q, idx) => (
        <div key={idx} className="bg-slate-50 rounded-2xl border border-slate-200 p-4 flex flex-col gap-3">
          <div className="flex items-start gap-3">
            {/* Número */}
            <span className="w-6 h-6 rounded-full bg-azul text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
              {idx + 1}
            </span>

            <div className="flex-1 flex flex-col gap-2">
              {/* Input pregunta */}
              <input
                type="text"
                value={q.pregunta}
                onChange={e => updatePregunta(idx, "pregunta", e.target.value)}
                placeholder="Escribe la pregunta..."
                className="w-full px-3 py-2 text-black/80 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#123498]/10 focus:border-[#123498] bg-white"
              />

              {/* Tipo + Obligatoria */}
              <div className="flex items-center gap-3 flex-wrap">
                <select
                  value={q.tipo}
                  onChange={e => {
                    updatePregunta(idx, "tipo", e.target.value);
                    if (e.target.value !== "opciones") updatePregunta(idx, "opciones", []);
                  }}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none text-slate-600 font-semibold"
                >
                  {TIPOS_PREGUNTA.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>

                <label className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={q.obligatoria === 1}
                    onChange={e => updatePregunta(idx, "obligatoria", e.target.checked ? 1 : 0)}
                    className="w-3.5 h-3.5 rounded border-gris-oscuro accent-[#123498]"
                  />
                  Obligatoria
                </label>
              </div>

              {/* 3. AQUÍ REEMPLAZAMOS EL PROMPT POR EL NUEVO COMPONENTE */}
              {q.tipo === "opciones" && (
                <OpcionesEditor 
                  opciones={q.opciones || []} 
                  onChange={(nuevasOpciones) => updatePregunta(idx, "opciones", nuevasOpciones)} 
                />
              )}
            </div>

            {/* Eliminar pregunta */}
            <button
              type="button"
              onClick={() => removePregunta(idx)}
              className="text-gris-oscuro hover:text-red-500 transition-colors shrink-0 mt-1"
            >
              <XMarkIcon className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      ))}

      {/* Agregar pregunta */}
      {preguntas.length < MAX_PREGUNTAS && (
        <button
          type="button"
          onClick={addPregunta}
          className="flex items-center justify-between w-full px-4 py-3 rounded-2xl border border-dashed border-gris-oscuro text-gris-oscuro hover:border-azul hover:text-azul transition-colors"
        >
          <span className="flex items-center gap-2 text-sm font-bold">
            <PlusIcon className="w-4 h-4" strokeWidth={3} />
            Agregar pregunta
          </span>
          <span className="text-xs text-gris-oscuro font-semibold">
            {preguntas.length} de {MAX_PREGUNTAS}
          </span>
        </button>
      )}

      {/* Aviso */}
      <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl px-4 py-3">
        <p className="text-xs text-amber-700 leading-relaxed">
          Las preguntas obligatorias reducen el número de postulaciones. Recomendamos marcar como obligatoria solo el filtro decisivo.
        </p>
      </div>
    </div>
  );
}