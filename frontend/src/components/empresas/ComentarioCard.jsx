import { ClockIcon } from "@heroicons/react/24/outline";
import StarRating from "./StarRating";

const RELACION_LABEL = {
  candidato: "Candidato en proceso",
  empleado: "Empleado",
  "ex-empleado": "Ex-empleado",
};

const RECOMENDARIA_LABEL = {
  si: "✅ Sí recomendaría",
  no: "❌ No recomendaría",
  depende: "🤔 Depende",
};

const formatearFecha = (fechaStr) =>
  new Date(fechaStr).toLocaleDateString("es-PE", {
    day: "numeric", month: "long", year: "numeric",
  });

export default function ComentarioCard({ evaluacion }) {
  const {
    iniciales, relacion, estrellas,
    texto_positivo, texto_negativo,
    recomendaria, fecha_creacion,
  } = evaluacion;

  return (
    <div className="bg-white rounded-2xl border border-[#e8edf5] p-5 shadow-sm flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#123498]/10 text-[#123498] flex items-center justify-center font-bold text-sm shrink-0">
            {iniciales}
          </div>
          <span className="inline-block text-xs font-semibold text-[#6b7a9f] bg-[#f4f6fb] px-2.5 py-1 rounded-full">
            {RELACION_LABEL[relacion] || relacion}
          </span>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <StarRating value={estrellas} size="sm" />
          <span className="text-xs text-[#9aa3bd] flex items-center gap-1">
            <ClockIcon className="w-3.5 h-3.5" />
            {formatearFecha(fecha_creacion)}
          </span>
        </div>
      </div>

      {texto_positivo && (
        <div>
          <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">Lo bueno</p>
          <p className="text-sm text-[#3a4566] leading-relaxed">{texto_positivo}</p>
        </div>
      )}
      {texto_negativo && (
        <div>
          <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-1">Lo que mejoraría</p>
          <p className="text-sm text-[#3a4566] leading-relaxed">{texto_negativo}</p>
        </div>
      )}

      <p className="text-xs font-semibold text-[#6b7a9f]">
        {RECOMENDARIA_LABEL[recomendaria]}
      </p>
    </div>
  );
}