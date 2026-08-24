import {
  MapPinIcon,
  BriefcaseIcon,
  ClockIcon,
  BanknotesIcon,
  HeartIcon,
  FlagIcon,
} from "@heroicons/react/24/outline";

// ── Fila de info con icono ────────────────────────────────────
function InfoRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-[#eef3f9] flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-[#123498]" strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide leading-none">
          {label}
        </p>
        <p className="text-sm font-medium text-gray-700 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

// ── Botón postularme inline (igual que el de PanelDetalle) ────
function BotonPostularBottom({ expirada, yaPostulada, onPostular }) {
  if (expirada) {
    return (
      <span className="flex items-center gap-1.5 bg-red-50 text-red-400 font-semibold text-sm px-5 py-2.5 rounded-full cursor-default border border-red-100 shrink-0">
        Oferta cerrada
      </span>
    );
  }
  if (yaPostulada) {
    return (
      <span className="flex items-center gap-1.5 bg-gray-100 text-gray-400 font-semibold text-sm px-5 py-2.5 rounded-full cursor-default border border-gray-200 shrink-0">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Ya postulaste
      </span>
    );
  }
  return (
    <button
      type="button"
      onClick={onPostular}
      className="group relative overflow-hidden rounded-full px-7 py-2.5 text-white font-bold text-base shadow-md hover:shadow-lg active:scale-[0.97] transition-[transform,box-shadow] duration-200 shrink-0 cursor-pointer tracking-wide"
      style={{ background: "linear-gradient(to right, #fb923c, #f97316)" }}
    >
      <span
        className="absolute inset-0 translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out"
        style={{ backgroundColor: "#f97316" }}
        aria-hidden="true"
      />
      <span className="relative z-10">Postularme</span>
    </button>
  );
}

// ── Componente principal ──────────────────────────────────────
export default function DetalleVacante({
  vacante,
  onPostular,
  yaPostulada = false,
  expirada = false,
  esGuardada = false,
  onGuardar,
}) {
  // Formatear salario
  const salarioTexto =
    vacante.salario_min && vacante.salario_max
      ? `S/ ${vacante.salario_min?.toLocaleString("es-PE")} - S/ ${vacante.salario_max?.toLocaleString("es-PE")}`
      : vacante.salario_min
        ? `Desde S/ ${vacante.salario_min.toLocaleString("es-PE")}`
        : vacante.salario_max
          ? `Hasta S/ ${vacante.salario_max.toLocaleString("es-PE")}`
          : null;

  // Dividir requisitos por línea
  const requisitosLineas = vacante.requisitos
    ? vacante.requisitos.split("\n").filter((r) => r.trim())
    : [];

  return (
    <div className="p-6 space-y-5">

      {/* ── Información del empleo ── */}
      <div>
        <h3 className="font-heading font-black text-[#123498] tracking-tight uppercase text-base mb-4">
          Información del empleo
        </h3>
        <div className="flex flex-col gap-3">
          <InfoRow icon={MapPinIcon}    label="Ubicación"  value={vacante.ubicacion} />
          <InfoRow icon={BriefcaseIcon} label="Contrato"   value={vacante.tipo_contrato} />
          <InfoRow icon={ClockIcon}     label="Modalidad"  value={vacante.modalidad} />
          {vacante.horario && (
            <InfoRow icon={ClockIcon}   label="Horario"    value={vacante.horario} />
          )}
          {salarioTexto && (
            <InfoRow icon={BanknotesIcon} label="Salario"  value={salarioTexto} />
          )}
        </div>
      </div>

      {/* ── Separador ── */}
      <hr className="border-gray-100" />

      {/* ── Descripción ── */}
      <div>
        <h3 className="font-heading font-black text-[#123498] tracking-tight uppercase text-base mb-3">
          Descripción
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
          {vacante.descripcion}
        </p>
      </div>

      {/* ── Requisitos ── */}
      {requisitosLineas.length > 0 && (
        <>
          <hr className="border-gray-100" />
          <div>
            <h3 className="font-heading font-black text-[#123498] tracking-tight uppercase text-base mb-3">
              Requisitos
            </h3>
            <div className="flex flex-col gap-2">
              {requisitosLineas.map((req, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-naranja mt-2 shrink-0" />
                  <span className="text-sm text-gray-600 leading-relaxed">
                    {req.trim()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Fallback si requisitos es texto corrido (sin saltos) */}
      {vacante.requisitos && requisitosLineas.length === 0 && (
        <>
          <hr className="border-gray-100" />
          <div>
            <h3 className="font-heading font-black text-[#123498] tracking-tight uppercase text-base mb-3">
              Requisitos
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {vacante.requisitos}
            </p>
          </div>
        </>
      )}

      {/* ── Acciones al pie ── */}
      <hr className="border-gray-100" />
      <div className="flex items-center gap-3 flex-wrap pb-2">
        {/* Postularme */}
        <BotonPostularBottom
          expirada={expirada}
          yaPostulada={yaPostulada}
          onPostular={onPostular}
        />

        {/* Favorito circular */}
        <button
          type="button"
          onClick={() => onGuardar?.(vacante.id)}
          title={esGuardada ? "Quitar de favoritos" : "Guardar vacante"}
          className={`w-10 h-10 rounded-full flex items-center justify-center active:scale-95 transition-all cursor-pointer border ${
            esGuardada
              ? "bg-red-50 border-red-200 hover:bg-red-100"
              : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
          }`}
        >
          <HeartIcon
            className="w-5 h-5 transition-colors"
            fill={esGuardada ? "#ef4444" : "none"}
            stroke={esGuardada ? "#ef4444" : "#9ca3af"}
            strokeWidth={2}
          />
        </button>

        {/* Reportar empleo */}
        <button
          type="button"
          className="ml-auto flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
          title="Reportar esta oferta"
        >
          <FlagIcon className="w-3.5 h-3.5" strokeWidth={2} />
          Reportar empleo
        </button>
      </div>
    </div>
  );
}
