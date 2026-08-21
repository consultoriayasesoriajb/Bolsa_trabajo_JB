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
  { value: "si", label: "Sí" },
  { value: "no", label: "No" },
  { value: "depende", label: "Depende del perfil" },
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
  empresa,
  onCerrar,
  form,
  handleChange,
  errors,
  enviando,
  exito,
  handleEnviar,
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
        <label className="block text-sm font-bold text-azul mb-1.5">
          Relación con la empresa <span className="text-red-500">*</span>
        </label>
        <select
          value={form.relacion}
          onChange={(e) => handleChange("relacion", e.target.value)}
          className="w-full px-4 py-2.5 text-sm rounded-xl border border-gris-oscuro focus:outline-none focus:border-turquesa text-black/80"
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
        <label className="block text-sm font-bold text-azul mb-1.5">
          Tiempo <span className="text-red-500">*</span>
        </label>
        <select
          value={form.tiempo_relacion}
          onChange={(e) => handleChange("tiempo_relacion", e.target.value)}
          className="w-full px-4 py-2.5 text-sm text-black/80 rounded-xl border border-gris-oscuro focus:border-turquesa"
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

      {/* Clasificacion de Estrellas */}
      <div className="bg-[#f8fafd] border border-[#e8edf5] rounded-xl p-5 lg:p-6 flex flex-col gap-5">
        {/* Calificación general */}
        <div>
          <div className="flex flex-col justify-between gap-4">
            {/* Textos a la izquierda */}
            <div className="flex flex-col items-start">
              <label className="block text-sm font-bold text-[#123498]">
                Calificación general <span className="text-[#F46F0B]">*</span>
              </label>
              <p className="text-sm text-[#6b7a9f]">
                Tu valoración global de la experiencia
              </p>
            </div>

            {/* Estrellas y número a la derecha */}
            <div className="flex items-center justify-center gap-3">
              <StarRating
                value={form.estrellas}
                onChange={(v) => handleChange("estrellas", v)}
                size="lg"
              />
              {/* Número al costado de las estrellas principales */}
              <span className="text-lg font-bold text-[#123498] w-8 text-right">
                {form.estrellas > 0 ? `${form.estrellas}.0` : "0.0"}
              </span>
            </div>
          </div>

          {errors.estrellas && (
            <p className="mt-2 text-xs text-red-500">{errors.estrellas}</p>
          )}
        </div>

        {/* Línea divisoria principal */}
        <hr className="border-[#e8edf5]" />

        {/* Calificación por categorías */}
        <div>
          <label className="block text-sm font-semibold text-azul mb-3">
            Por categoría <span className="text-[#F46F0B]">*</span>
          </label>

          {/* El contenedor con divide-y crea automáticamente las líneas entre los elementos */}
          <div className="flex flex-col divide-y divide-[#e8edf5]">
            {[
              { field: "cat_ambiente", label: "Ambiente laboral" },
              { field: "cat_beneficios", label: "Beneficios" },
              { field: "cat_balance", label: "Balance vida / trabajo" },
              { field: "cat_crecimiento", label: "Crecimiento profesional" },
            ].map(({ field, label }) => (
              <div
                key={field}
                className="flex items-center justify-between py-3"
              >
                <span className="text-sm text-[#6b7a9f]">{label}</span>
                <div className="flex flex-col items-end">
                  <StarRating
                    value={form[field]}
                    onChange={(v) => handleChange(field, v)}
                    size="sm"
                  />
                  {errors[field] && (
                    <p className="mt-1 text-xs text-red-500">{errors[field]}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lo bueno */}
      <div>
        {/* Contenedor Flex para alinear título y contador */}
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-sm font-bold text-azul mb-1.5">
            Lo que destacarías
          </label>
          {/* Contador dinámico */}
          <span className="text-xs text-[#9aa3bd] font-medium">
            Opcional · {(form.texto_positivo || "").length}/500
          </span>
        </div>

        <textarea
          value={form.texto_positivo}
          onChange={(e) => handleChange("texto_positivo", e.target.value)}
          rows={3}
          maxLength={500}
          placeholder="Cuéntanos lo positivo de tu experiencia"
          className="w-full px-4 py-2.5 text-sm text-black/80 rounded-xl border border-gris-oscuro focus:outline-none focus:border-turquesa resize-none"
        />
      </div>

      {/* Lo malo */}
      <div>
        {/* Contenedor Flex para alinear título y contador */}
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-sm font-bold text-azul mb-1.5">
            Lo que mejorarías
          </label>
          {/* Contador dinámico */}
          <span className="text-xs text-[#9aa3bd] font-medium">
            Opcional · {(form.texto_negativo || "").length}/500
          </span>
        </div>
        <textarea
          value={form.texto_negativo}
          onChange={(e) => handleChange("texto_negativo", e.target.value)}
          rows={3}
          maxLength={500}
          placeholder="Sé especifico y respetuoso - ayuda a otros postulantes."
          className="w-full px-4 py-2.5 text-sm text-black/80 rounded-xl border border-gris-oscuro focus:outline-none focus:border-turquesa resize-none"
        />
      </div>

      {/* Recomendaría */}
      <div>
        {/* Ajustamos el label */}
        <label className="block text-base font-bold text-azul mb-3">
          ¿Recomendarías esta empresa? <span className="text-[#F46F0B]">*</span>
        </label>

        {/* Contenedor principal */}
        <div className="flex w-full border border-[#e8edf5] rounded-xl overflow-hidden divide-x divide-[#e8edf5]">
          {RECOMENDARIA_OPTS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => handleChange("recomendaria", o.value)}
              className={`flex-1 text-center py-2.5 px-2 text-xs transition-colors ${
                form.recomendaria === o.value
                  ? "bg-[#123498] text-white font-bold"
                  : "bg-white text-[#6b7a9f] font-medium hover:bg-[#f4f6fb] hover:text-[#123498]"
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2">
        {/* Texto informativo izquierdo */}
        <p className="text-xs text-[#9aa3bd] leading-tight">
          Se publicará de forma anónima.
        </p>

        {/* Contenedor de botones derecho */}
        <div className="flex items-center gap-2 w-full">
          {/* Botón Cancelar */}
          <button
            type="button"
            // Reemplaza "onClose" o "onCancel" por la función que uses para cerrar tu modal/formulario
            onClick={() => console.log("Cancelar click")}
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg border border-[#e8edf5] text-[#123498] text-xs font-semibold hover:bg-[#f4f6fb] transition-colors"
          >
            Cancelar
          </button>

          {/* Botón Enviar (ahora en azul como la imagen) */}
          <button
            type="button"
            onClick={handleEnviar}
            disabled={enviando}
            className="flex-1 sm:flex-none px-6 py-2.5 bg-[#123498] hover:bg-[#0e2a7a] disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
          >
            {enviando ? "Enviando..." : "Enviar evaluación"}
          </button>
        </div>
      </div>
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
