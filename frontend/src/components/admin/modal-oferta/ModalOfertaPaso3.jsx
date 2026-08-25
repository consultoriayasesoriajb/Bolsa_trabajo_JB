import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";

const MAX_PREGUNTAS = 5;

const TIPOS_PREGUNTA = [
  { value: "texto",   label: "Texto libre" },
  { value: "numero",  label: "Número" },
  { value: "si_no",   label: "Sí / No" },
  { value: "opciones",label: "Opciones" },
];

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
            <span className="w-6 h-6 rounded-full bg-[#123498] text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
              {idx + 1}
            </span>

            <div className="flex-1 flex flex-col gap-2">
              {/* Input pregunta */}
              <input
                type="text"
                value={q.pregunta}
                onChange={e => updatePregunta(idx, "pregunta", e.target.value)}
                placeholder="Escribe la pregunta..."
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#123498]/10 focus:border-[#123498] bg-white"
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
                    className="w-3.5 h-3.5 rounded border-slate-300 accent-[#123498]"
                  />
                  Obligatoria
                </label>
              </div>

              {/* Chips de opciones */}
              {q.tipo === "opciones" && (
                <div className="flex flex-wrap gap-2 items-center mt-1">
                  {(q.opciones || []).map((opt, oi) => (
                    <span key={oi} className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-700">
                      {opt}
                      <button
                        type="button"
                        onClick={() => updatePregunta(idx, "opciones", q.opciones.filter((_, i) => i !== oi))}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <XMarkIcon className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const nueva = prompt("Nueva opción:");
                      if (nueva?.trim()) updatePregunta(idx, "opciones", [...(q.opciones || []), nueva.trim()]);
                    }}
                    className="flex items-center gap-1 px-3 py-1 border border-dashed border-[#123498] text-[#123498] rounded-full text-xs font-bold hover:bg-[#f2f5fc] transition-colors"
                  >
                    <PlusIcon className="w-3 h-3" /> Opción
                  </button>
                </div>
              )}
            </div>

            {/* Eliminar pregunta */}
            <button
              type="button"
              onClick={() => removePregunta(idx)}
              className="text-slate-300 hover:text-red-500 transition-colors shrink-0 mt-1"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}

      {/* Agregar pregunta */}
      {preguntas.length < MAX_PREGUNTAS && (
        <button
          type="button"
          onClick={addPregunta}
          className="flex items-center justify-between w-full px-4 py-3 rounded-2xl border border-dashed border-slate-300 text-slate-500 hover:border-[#123498] hover:text-[#123498] transition-colors"
        >
          <span className="flex items-center gap-2 text-sm font-bold">
            <PlusIcon className="w-4 h-4" />
            Agregar pregunta
          </span>
          <span className="text-xs text-slate-400">
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