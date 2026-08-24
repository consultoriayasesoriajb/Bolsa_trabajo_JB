import { useState } from "react";

// ── Pregunta Sí/No ────────────────────────────────────────────
function PreguntaSiNo({ id, valor, onChange }) {
  return (
    <div className="flex gap-3">
      {["Sí", "No"].map((opt) => (
        <label
          key={opt}
          className={`flex items-center gap-2 px-5 py-2 rounded-full border text-sm cursor-pointer transition-all ${
            valor === opt
              ? "border-naranja bg-naranja/10 text-naranja font-semibold"
              : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
          }`}
        >
          <input
            type="radio"
            name={`pregunta_${id}`}
            value={opt}
            checked={valor === opt}
            onChange={() => onChange(id, opt)}
            className="sr-only"
          />
          {opt}
        </label>
      ))}
    </div>
  );
}

// ── Pregunta con opciones múltiples ──────────────────────────
function PreguntaOpciones({ id, opciones, valor, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {opciones.map((opt) => (
        <label
          key={opt}
          className={`flex items-center gap-2 px-5 py-2 rounded-full border text-sm cursor-pointer transition-all ${
            valor === opt
              ? "border-naranja bg-naranja/10 text-naranja font-semibold"
              : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
          }`}
        >
          <input
            type="radio"
            name={`pregunta_${id}`}
            value={opt}
            checked={valor === opt}
            onChange={() => onChange(id, opt)}
            className="sr-only"
          />
          {opt}
        </label>
      ))}
    </div>
  );
}

// ── Pregunta de texto libre ───────────────────────────────────
function PreguntaTexto({ id, valor, onChange }) {
  return (
    <textarea
      value={valor || ""}
      onChange={(e) => onChange(id, e.target.value)}
      placeholder="Escribe tu respuesta..."
      rows={3}
      className="w-full bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-naranja/30 focus:border-naranja transition-all px-4 py-3 resize-none"
    />
  );
}

// ── Pregunta numérica ─────────────────────────────────────────
function PreguntaNumero({ id, valor, onChange }) {
  return (
    <input
      type="number"
      min={0}
      value={valor ?? ""}
      onChange={(e) =>
        onChange(id, e.target.value === "" ? "" : Number(e.target.value))
      }
      placeholder="0"
      className="w-32 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-naranja/30 focus:border-naranja transition-all px-4 py-3"
    />
  );
}

// ── Componente principal ──────────────────────────────────────
export default function PreguntasFiltro({
  preguntas,
  respuestas,
  onChange,
  onSiguiente,
  onAtras,
}) {
  const [errores, setErrores] = useState({});

  const ordenadas = [...preguntas].sort((a, b) => (a.orden || 0) - (b.orden || 0));

  const handleSubmit = () => {
    const nuevosErrores = {};
    ordenadas.forEach((p) => {
      if (!p.obligatoria) return;
      const val = respuestas[p.id];
      if (val === undefined || val === null || val === "") {
        nuevosErrores[p.id] = "Esta pregunta es obligatoria";
      }
    });

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setErrores({});
    onSiguiente();
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Cuerpo */}
      <div className="flex-1 px-6 py-6 space-y-7">

        {/* Encabezado */}
        <div className="space-y-1.5">
          <h3 className="font-heading font-black text-[#123498] tracking-tight uppercase text-base">
            Preguntas de filtrado
          </h3>
          <p className="text-sm font-semibold text-gray-500">
            Responde las preguntas obligatorias para continuar con tu postulación
          </p>
        </div>

        {/* Lista de preguntas */}
        {ordenadas.map((p, index) => (
          <div key={p.id} className="space-y-3">
            {/* Número + enunciado */}
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#eef3f9] text-[#123498] text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800 leading-snug">
                  {p.pregunta}
                  {!p.obligatoria && (
                    <span className="ml-2 text-xs font-normal text-gray-400">
                      (opcional)
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Input según tipo */}
            <div className="pl-9">
              {p.tipo === "si_no" && (
                <PreguntaSiNo
                  id={p.id}
                  valor={respuestas[p.id]}
                  onChange={onChange}
                />
              )}
              {p.tipo === "opciones" && (
                <PreguntaOpciones
                  id={p.id}
                  opciones={p.opciones}
                  valor={respuestas[p.id]}
                  onChange={onChange}
                />
              )}
              {p.tipo === "texto" && (
                <PreguntaTexto
                  id={p.id}
                  valor={respuestas[p.id]}
                  onChange={onChange}
                />
              )}
              {p.tipo === "numero" && (
                <PreguntaNumero
                  id={p.id}
                  valor={respuestas[p.id]}
                  onChange={onChange}
                />
              )}
              {errores[p.id] && (
                <p className="text-xs text-red-500 mt-2 font-medium">
                  {errores[p.id]}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pie de página con botones */}
      <div className="shrink-0 px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3">
        {/* Botón Atrás */}
        <button
          type="button"
          onClick={onAtras}
          className="rounded-full px-7 py-2.5 text-gray-600 font-semibold text-sm bg-white border border-gray-200 hover:bg-[#f9f9f9] hover:border-gray-300 active:scale-[0.97] transition-all cursor-pointer"
        >
          Atrás
        </button>

        {/* Botón Siguiente — igual que Postularme */}
        <button
          type="button"
          onClick={handleSubmit}
          className="group relative overflow-hidden rounded-full px-7 py-2.5 text-white font-bold text-base shadow-md hover:shadow-lg active:scale-[0.97] transition-[transform,box-shadow] duration-200 shrink-0 cursor-pointer tracking-wide"
          style={{ background: "linear-gradient(to right, #fb923c, #f97316)" }}
        >
          <span
            className="absolute inset-0 translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out"
            style={{ backgroundColor: "#f97316" }}
            aria-hidden="true"
          />
          <span className="relative z-10">Siguiente</span>
        </button>
      </div>
    </div>
  );
}
