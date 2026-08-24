import { useState } from "react";
import { ClockIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { StarIcon } from "@heroicons/react/24/outline";
import StarRating from "./StarRating";

const RELACION_LABEL = {
  candidato: "Candidato en proceso",
  empleado: "Empleado",
  "ex-empleado": "Ex colaborador",
};

const RECOMENDARIA_LABEL = {
  si: "Sí la recomendaría",
  no: "No la recomendaría",
  depende: "Depende del perfil",
};

const RECOMENDARIA_STYLE = {
  si:      "bg-green-50 text-green-700 border-green-200",
  no:      "bg-red-50 text-red-600 border-red-200",
  depende: "bg-amber-50 text-amber-600 border-amber-200",
};

const CATEGORIAS = [
  { key: "cat_ambiente",    label: "Ambiente laboral" },
  { key: "cat_beneficios",  label: "Beneficios" },
  { key: "cat_balance",     label: "Balance vida / trabajo" },
  { key: "cat_crecimiento", label: "Crecimiento" },
];

const formatearFecha = (fechaStr) =>
  new Date(fechaStr.replace(" ", "T")).toLocaleDateString("es-PE", {
    day: "numeric", month: "long", year: "numeric",
  });

function MiniStars({ value }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(s =>
        s <= Math.round(value || 0)
          ? <StarSolid key={s} className="w-3.5 h-3.5 text-[#FDB907]" />
          : <StarIcon  key={s} className="w-3.5 h-3.5 text-[#9aa3bd]" />
      )}
      <span className="ml-1 text-xs font-bold text-[#1c2a52]">
        {Number(value).toFixed(1)}
      </span>
    </div>
  );
}

export default function ComentarioCard({ evaluacion }) {
  const [expandido, setExpandido] = useState(false);

  const {
    iniciales, relacion, estrellas,
    texto_positivo, texto_negativo,
    recomendaria, fecha_creacion,
    cat_ambiente, cat_beneficios, cat_balance, cat_crecimiento,
  } = evaluacion;

  const tieneCategorias = Number(cat_ambiente) > 0 || Number(cat_beneficios) > 0 || Number(cat_balance) > 0  || Number(cat_crecimiento) > 0;

  return (
    <div className="bg-white rounded-2xl border border-[#e8edf5] shadow-sm overflow-hidden">

      {/* Cuerpo principal */}
      <div className="p-5 flex flex-col gap-4">

        {/* Header: iniciales + relación + fecha + estrellas */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#123498]/10 text-[#123498] flex items-center justify-center font-bold text-sm shrink-0">
              {iniciales}
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-bold text-[#1c2a52]">
                {RELACION_LABEL[relacion?.trim()?.toLowerCase()] || relacion}
              </span>
              <span className="text-xs text-[#9aa3bd] flex items-center gap-1">
                <ClockIcon className="w-3.5 h-3.5" />
                {formatearFecha(fecha_creacion)}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <div className="flex flex-row items-center gap-1">
              <StarRating value={estrellas} size="sm" />
              <span className="font-bold text-[#1c2a52] text-xs mr-1">
                {Number(estrellas).toFixed(1)}
              </span>
            </div>
            <span className="text-[10px] text-[#9aa3bd]">Calificación general</span>
          </div>
        </div>

        {/* Textos */}
        {texto_positivo && (
          <div className="border-l-4 border-[#91cdbb] pl-3">
            <p className="text-[10px] font-black text-[#9ca0ba] uppercase tracking-wider mb-1">
              destacable
            </p>
            <p className="text-sm text-[#3a4566] leading-relaxed">{texto_positivo}</p>
          </div>
        )}
        {texto_negativo && (
          <div className="border-l-4 border-[#ced4e3] pl-3">
            <p className="text-[10px] font-black text-[#9ca0ba] uppercase tracking-wider mb-1">
              Lo que mejoraría
            </p>
            <p className="text-sm text-[#3a4566] leading-relaxed">{texto_negativo}</p>
          </div>
        )}

        {/* Footer: recomendaria + botón más detalle */}
        <div className="flex items-center justify-between pt-1">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${RECOMENDARIA_STYLE[recomendaria] || "bg-[#f4f6fb] text-[#6b7a9f] border-[#e8edf5]"}`}>
            {RECOMENDARIA_LABEL[recomendaria]}
          </span>

          {tieneCategorias && (
            <button
              type="button"
              onClick={() => setExpandido(v => !v)}
              className="flex items-center gap-1 text-xs font-semibold text-[#123498] hover:text-[#0f2a80] transition-colors"
            >
              {expandido ? "Ocultar categorías" : "Ver calificación por categoría"}
              {expandido
                ? <ChevronUpIcon   className="w-3.5 h-3.5" />
                : <ChevronDownIcon className="w-3.5 h-3.5" />
              }
            </button>
          )}
        </div>
      </div>

      {/* Panel expandible — categorías */}
      <div className={`bg-[#f8fafd] transition-all duration-300 ease-in-out overflow-hidden ${
        expandido ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
      }`}>
        <div className="border-t border-[#e8edf5] px-5 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CATEGORIAS.map(({ key, label }) => {
            const val = evaluacion[key];
            if (!Number(val)) return null;
            return (
              <div key={key} className="flex flex-col gap-1.5">
                <span className="text-[10px] text-[#9aa3bd] font-semibold">{label}</span>
                <MiniStars value={val} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}