import { StarIcon as StarSolid } from "@heroicons/react/24/solid";

const CATEGORIAS = [
  { key: "prom_ambiente",    label: "Ambiente laboral" },
  { key: "prom_beneficios",  label: "Beneficios" },
  { key: "prom_balance",     label: "Balance vida" },
  { key: "prom_crecimiento", label: "Crecimiento" },
];

function BarraEstrellas({ estrella, count, total }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-[#6b7a9f] w-4 shrink-0">{estrella}</span>
      <StarSolid className="w-3 h-3 text-[#FDB907] shrink-0" />
      <div className="flex-1 h-2 bg-[#f4f6fb] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-[#FDB907] transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-[#9aa3bd] w-7 text-right shrink-0">{pct}%</span>
    </div>
  );
}

function BarraCategoria({ label, valor }) {
  if (!valor) return null;
  const pct = (Number(valor) / 5) * 100;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-[#6b7a9f] w-28 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-[#f4f6fb] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-[#123498] transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-black text-[#123498] w-7 text-right shrink-0">
        {Number(valor).toFixed(1)}
      </span>
    </div>
  );
}

export default function EmpresaCalificacionCard({ empresa }) {
  const {
    promedio, total_evaluaciones,
    est_5 = 0, est_4 = 0, est_3 = 0, est_2 = 0, est_1 = 0,
    prom_ambiente, prom_beneficios, prom_balance, prom_crecimiento,
  } = empresa;

  const total = Number(total_evaluaciones) || 0;
  const tieneCategorias = prom_ambiente || prom_beneficios || prom_balance || prom_crecimiento;

  if (!total) return null;

  return (
    <div className="bg-white rounded-2xl border border-[#e8edf5] shadow-sm p-5 flex flex-col gap-5">

      {/* Calificación general */}
      <div>
        <p className="text-xs font-black text-azul uppercase tracking-wider mb-3">
          Calificación general
        </p>
        <div className="flex items-center gap-4">
          {/* Número grande */}
          <div className="flex flex-col items-center shrink-0">
            <span className="text-4xl font-black text-[#123498] leading-none">
              {Number(promedio).toFixed(1)}
            </span>
            <div className="flex items-center gap-0.5 mt-1">
              {[1,2,3,4,5].map(s => (
                <StarSolid key={s} className={`w-3 h-3 ${s <= Math.round(promedio) ? "text-[#FDB907]" : "text-[#e8edf5]"}`} />
              ))}
            </div>
            <span className="text-xs text-[#9aa3bd] mt-1">{total} opiniones</span>
          </div>

          {/* Barras de distribución */}
          <div className="flex-1 flex flex-col gap-1.5">
            {[5,4,3,2,1].map(n => (
              <BarraEstrellas
                key={n}
                estrella={n}
                count={Number(empresa[`est_${n}`] || 0)}
                total={total}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Por categoría */}
      {tieneCategorias && (
        <div>
          <p className="text-xs font-black text-azul uppercase tracking-wider mb-3">
            Por categoría
          </p>
          <div className="flex flex-col gap-2.5">
            {CATEGORIAS.map(({ key, label }) => (
              <BarraCategoria key={key} label={label} valor={empresa[key]} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}