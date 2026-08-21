import StarRating from "./StarRating";
import { XMarkIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

const RELACION_OPTS = [
  { value: "candidato", label: "Candidato en proceso de selección" },
  { value: "empleado", label: "Empleado actual" },
  { value: "ex-empleado", label: "Ex-empleado" },
];

const TIEMPO_OPTS = [
  { value: "menos_1_anio", label: "Menos de 1 año" },
  { value: "1_3_anios", label: "Entre 1 y 3 años" },
  { value: "mas_3_anios", label: "Más de 3 años" },
];

const RECOMENDARIA_OPTS = [
  { value: "si", label: "✅ Sí la recomendaría" },
  { value: "no", label: "❌ No la recomendaría" },
  { value: "depende", label: "🤔 Depende del perfil" },
];

const ESTRELLAS_LABEL = {
  1: "Muy malo",
  2: "Malo",
  3: "Regular",
  4: "Bueno",
  5: "Excelente",
};

// ── Contenido del formulario — igual en modal y drawer ───────
function ContenidoFormulario({
  empresa, onCerrar, form, handleChange,
  errors, enviando, exito, handleEnviar,
}) {
  if (exito) {
    return (
      <div className="flex flex-col items-center gap-4 p-10 text-center">
        <CheckCircleIcon className="w-16 h-16 text-green-500" />
        <h3 className="text-xl font-bold text-[#1c2a52] font-heading">
          ¡Gracias por tu evaluación!
        </h3>
        <p className="text-sm text-[#6b7a9f]">
          Tu opinión ayuda a otros candidatos a tomar mejores decisiones.
        </p>
        <button
          onClick={onCerrar}
          className="mt-2 px-6 py-2.5 bg-[#123498] text-white text-sm font-bold rounded-xl hover:bg-[#0f2a80] transition-colors"
        >
          Cerrar
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col gap-5">
      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
          {errors.general}
        </div>
      )}

      {/* Relación */}
      <div>
        <label className="block text-xs font-bold text-azul uppercase tracking-wider mb-1.5">
          ¿Cuál es/fue tu relación con la empresa? *
        </label>
        <select
          value={form.relacion}
          onChange={(e) => handleChange("relacion", e.target.value)}
          className="w-full px-4 py-2.5 text-sm rounded-xl border border-turquesa focus:outline-none focus:border-turquesa text-black/80"
        >
          <option value="">Selecciona una opción</option>
          {RELACION_OPTS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {errors.relacion && (
          <p className="mt-1 text-xs text-red-500">{errors.relacion}</p>
        )}
      </div>

      {/* Tiempo */}
      <div>
        <label className="block text-xs font-bold text-azul uppercase tracking-wider mb-1.5">
          ¿Hace cuánto tiempo? *
        </label>
        <select
          value={form.tiempo_relacion}
          onChange={(e) => handleChange("tiempo_relacion", e.target.value)}
          className="w-full px-4 py-2.5 text-sm text-black/80 rounded-xl border border-turquesa focus:border-turquesa"
        >
          <option value="">Selecciona una opción</option>
          {TIEMPO_OPTS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {errors.tiempo_relacion && (
          <p className="mt-1 text-xs text-red-500">{errors.tiempo_relacion}</p>
        )}
      </div>

      {/* Estrellas */}
      <div>
        <label className="block text-xs font-bold text-azul uppercase tracking-wider mb-1.5">
          Calificación general *
        </label>
        <div className="flex items-center gap-4">
          <StarRating
            value={form.estrellas}
            onChange={(v) => handleChange("estrellas", v)}
            size="lg"
          />
          {form.estrellas > 0 && (
            <span className="text-sm font-semibold text-[#6b7a9f]">
              {ESTRELLAS_LABEL[form.estrellas]}
            </span>
          )}
        </div>
        {errors.estrellas && (
          <p className="mt-1 text-xs text-red-500">{errors.estrellas}</p>
        )}
      </div>

      {/* Calificación por categorías */}
      <div>
        <label className="block text-xs font-bold text-azul uppercase tracking-wider mb-3">
          Calificación por categorías *
        </label>
        <div className="flex flex-col gap-3">
          {[
            { field: "cat_ambiente", label: "Ambiente laboral" },
            { field: "cat_beneficios", label: "Beneficios" },
            { field: "cat_balance", label: "Balance vida/trabajo" },
            { field: "cat_crecimiento", label: "Crecimiento profesional" },
          ].map(({ field, label }) => (
            <div
              key={field}
              className="flex items-center justify-between gap-4"
            >
              <span className="text-xs text-[#6b7a9f] w-36 shrink-0">
                {label}
              </span>
              <StarRating
                value={form[field]}
                onChange={(v) => handleChange(field, v)}
                size="sm"
              />
              {errors[field] && (
                <p className="text-xs text-red-500 shrink-0">{errors[field]}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lo bueno */}
      <div>
        <label className="block text-xs font-bold text-azul uppercase tracking-wider mb-1.5">
          ¿Qué destacarías de esta empresa?
        </label>
        <textarea
          value={form.texto_positivo}
          onChange={(e) => handleChange("texto_positivo", e.target.value)}
          rows={3}
          maxLength={500}
          placeholder="Cuéntanos lo positivo de tu experiencia..."
          className="w-full px-4 py-2.5 text-sm text-black/80 rounded-xl border border-turquesa focus:outline-none focus:border-turquesa resize-none"
        />
      </div>

      {/* Lo malo */}
      <div>
        <label className="block text-xs font-bold text-azul uppercase tracking-wider mb-1.5">
          ¿Qué mejorarías?
        </label>
        <textarea
          value={form.texto_negativo}
          onChange={(e) => handleChange("texto_negativo", e.target.value)}
          rows={3}
          maxLength={500}
          placeholder="Cuéntanos qué se podría mejorar..."
          className="w-full px-4 py-2.5 text-sm text-black/80 rounded-xl border border-turquesa focus:outline-none focus:border-turquesa resize-none"
        />
      </div>

      {/* Recomendaría */}
      <div>
        <label className="block text-xs font-bold text-azul uppercase tracking-wider mb-1.5">
          ¿Recomendarías esta empresa a un amigo? *
        </label>
        <div className="flex flex-col gap-2">
          {RECOMENDARIA_OPTS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => handleChange("recomendaria", o.value)}
              className={`text-left px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                form.recomendaria === o.value
                  ? "border-turquesa bg-turquesa/10 text-black/80 font-bold"
                  : "border-turquesa/30 text-[#6b7a9f] hover:border-turquesa/50"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
        {errors.recomendaria && (
          <p className="mt-1 text-xs text-red-500">{errors.recomendaria}</p>
        )}
      </div>

      {/* Botón enviar */}
      <button
        type="button"
        onClick={handleEnviar}
        disabled={enviando}
        className="w-full py-3 bg-[#F46F0B] hover:bg-[#d65f09] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-colors"
      >
        {enviando ? "Enviando..." : "Enviar evaluación"}
      </button>
    </div>
  );
}

// ── Componente principal — cambia el contenedor según modo ───
export default function FormularioEvaluacion({
  empresa,
  onCerrar,
  form,
  handleChange,
  errors,
  enviando,
  exito,
  handleEnviar,
  modo = "modal", // "modal" | "drawer"
}) {
  const props = {
    empresa,
    onCerrar,
    form,
    handleChange,
    errors,
    enviando,
    exito,
    handleEnviar,
  };

  // ── MODO MODAL (comportamiento original) ─────────────────
  if (modo === "modal") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-[#e8edf5]">
            <div>
              <h2 className="text-lg font-bold text-[#1c2a52] font-heading">
                Evaluar empresa
              </h2>
              <p className="text-sm text-[#6b7a9f] mt-0.5">{empresa?.nombre}</p>
            </div>
            <button
              onClick={onCerrar}
              className="p-2 rounded-xl hover:bg-[#f4f6fb] text-[#6b7a9f] transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          <ContenidoFormulario {...props} />
        </div>
      </div>
    );
  }

  // ── MODO DRAWER (panel lateral desde la derecha) ─────────
  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-60 bg-black/30 backdrop-blur-sm"
        onClick={onCerrar}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 z-70 h-full w-full max-w-md bg-white shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8edf5] shrink-0">
          <div className="flex items-center gap-3">
  {/* Logo */}
  {empresa?.logo_url ? (
    <img
      src={`${import.meta.env.VITE_API_URL.replace("/api", "")}/${empresa.logo_url}`}
      alt={empresa.nombre}
      className="w-10 h-10 rounded-xl object-cover shrink-0 border border-[#e8edf5]"
    />
  ) : (
    <div className="w-10 h-10 rounded-xl bg-[#F46F0B] flex items-center justify-center text-white font-black text-sm shrink-0">
      {empresa?.nombre?.slice(0, 2).toUpperCase()}
    </div>
  )}

  {/* Título + nombre */}
  <div>
    <h2 className="text-base font-bold text-azul font-heading">
      Calificar empresa
    </h2>
    <p className="text-xs text-[#6b7a9f] mt-0.5">{empresa?.nombre}</p>
  </div>
</div>
          <button
            onClick={onCerrar}
            className="p-2 rounded-xl hover:bg-[#f4f6fb] text-[#6b7a9f] transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <ContenidoFormulario {...props} />
        </div>
      </div>
    </>
  );
}
