import {
  GlobeAltIcon, BuildingOfficeIcon, UsersIcon, CalendarIcon, MapPinIcon,
} from "@heroicons/react/24/outline";
import EmpresaCalificacionCard from "./EmpresaCalificacionCard";

function InfoItem({ icon: Icon, label, children }) {
  return (
    <div className="flex flex-col gap-1 mb-3">
      {/* Parte Superior: Icono y Label plomo */}
      <div className="flex items-center gap-1.5 text-xs text-[#94a3b8] font-medium">
        <Icon className="w-3 h-3 text-[#94a3b8] shrink-0 mb-0.5" />
        <p>{label}</p>
      </div>
      
      {/* Parte Inferior: Valor en azul oscuro */}
      <div className="text-xs ml-5 font-semibold text-azul">
        {children}
      </div>
    </div>
  );
}

export default function EmpresaInfoPanel({ empresa }) {
  const beneficios = Array.isArray(empresa.beneficios) ? empresa.beneficios : [];

  return (
    <div className="w-full lg:w-80 shrink-0 flex flex-col gap-4">

      {/* Card principal */}
      <div className="bg-white rounded-2xl border border-[#e8edf5] shadow-sm p-5 flex flex-col gap-4">

        {/* Descripción */}
        <div>
          <h5 className="text-sm font-bold text-azul">INFORMACIÓN CORPORATIVA</h5>
          {empresa.descripcion && (
            <p className="text-xs text-[#6b7a9f] leading-relaxed pt-3">
              {empresa.descripcion}
            </p>
          )}
        </div>

        <div className="border-t border-[#e9eaee]"></div>

        {/* Datos corporativos */}
        <div className="grid grid-cols-2 gap-2">
          {empresa.ubicacion && <InfoItem icon={MapPinIcon} label="Ubicación">{empresa.ubicacion}</InfoItem>}
          {empresa.num_empleados && <InfoItem icon={UsersIcon} label="Tamaño">{empresa.num_empleados} empleados</InfoItem>}
          {empresa.anio_fundacion && <InfoItem icon={CalendarIcon} label="Fundada">{empresa.anio_fundacion}</InfoItem>}
          {empresa.ruc && <InfoItem icon={BuildingOfficeIcon} label="RUC">{empresa.ruc}</InfoItem>}
          {empresa.sitio_web && (
            <InfoItem icon={GlobeAltIcon} label="Sitio web">
              <a 
                href={empresa.sitio_web} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#123498] hover:underline"
              >
                {/* Esto limpia el "https://" para que se vea solo el dominio como en tu foto */}
                {empresa.sitio_web.replace(/^https?:\/\//, '')}
              </a>
            </InfoItem>
          )}
        </div>
      </div>

      {/* Beneficios */}
      {beneficios.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#e8edf5] shadow-sm p-5">
          <p className="text-xs font-black text-azul uppercase tracking-wider mb-3">
            Beneficios
          </p>
          <div className="flex flex-wrap gap-2">
            {beneficios.map(b => (
              <span key={b} className="px-3 py-1 bg-[#f2f5fc] text-[#1c2a52] text-xs font-semibold rounded-lg">
                {b}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Calificación general */}
      <EmpresaCalificacionCard empresa={empresa} />
    </div>
  );
}