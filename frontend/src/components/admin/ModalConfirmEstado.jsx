import { useEffect, useRef } from "react";
import {
  X,
  ArrowRight,
  User,
  Briefcase,
  Building2,
  CalendarDays,
  Mail,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Star,
  MessageSquare,
} from "lucide-react";

const ESTADO_STYLES = {
  recibido: {
    text: "text-[#123498]",
    bg: "bg-blue-50",
    border: "border-blue-200",
    dot: "bg-[#123498]",
  },
  revisado: {
    text: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
    dot: "bg-purple-500",
  },
  entrevista: {
    text: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  aprobado: {
    text: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
    dot: "bg-green-500",
  },
  rechazado: {
    text: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    dot: "bg-red-500",
  },
};

const ESTADO_LABELS = {
  recibido: "Recibido",
  revisado: "Revisado",
  entrevista: "Entrevista",
  aprobado: "Aprobado",
  rechazado: "Rechazado",
};

const ESTADO_ICONS = {
  recibido: <Clock size={12} />,
  revisado: <Star size={12} />,
  entrevista: <MessageSquare size={12} />,
  aprobado: <CheckCircle2 size={12} />,
  rechazado: <XCircle size={12} />,
};

function EstadoBadge({ estado }) {
  const s = ESTADO_STYLES[estado] || {};
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${s.text} ${s.bg} ${s.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {ESTADO_LABELS[estado] || estado}
    </span>
  );
}

function InfoRow({ icon, label, children }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">
          {label}
        </p>
        {children}
      </div>
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-slate-200/80 ml-8" />;
}

/**
 * ModalConfirmEstado
 *
 * Props:
 *   isOpen      — boolean
 *   candidate   — { candidato_nombre, candidato_correo, oferta_titulo, empresa_nombre, fecha_postulacion, estado }
 *   newEstado   — string (nuevo estado)
 *   loading     — boolean
 *   onConfirm   — () => void
 *   onClose     — () => void
 */
export default function ModalConfirmEstado({
  isOpen,
  candidate,
  newEstado,
  loading,
  onConfirm,
  onClose,
}) {
  const confirmBtnRef = useRef(null);

  useEffect(() => {
    if (isOpen && confirmBtnRef.current) {
      setTimeout(() => confirmBtnRef.current?.focus(), 60);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen || !candidate) return null;

  const fechaFormateada = new Date().toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const isNegativo = newEstado === "rechazado";
  const isPositivo = newEstado === "aprobado";

  const accentColor = isNegativo
    ? {
        bar: "bg-red-400",
        icon: "bg-red-50",
        iconColor: "text-red-500",
        btn: "bg-red-500 hover:bg-red-600 shadow-[0_2px_14px_rgba(239,68,68,0.35)]",
      }
    : isPositivo
      ? {
          bar: "bg-green-400",
          icon: "bg-green-50",
          iconColor: "text-green-500",
          btn: "bg-green-500 hover:bg-green-600 shadow-[0_2px_14px_rgba(34,197,94,0.35)]",
        }
      : {
          bar: "bg-[#123498]",
          icon: "bg-[#123498]/10",
          iconColor: "text-[#123498]",
          btn: "bg-[#123498] hover:bg-[#0f2a82] shadow-[0_2px_14px_rgba(18,52,152,0.35)]",
        };

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(6px)",
      }}
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        style={{ animation: "fadeSlideUp 0.2s ease-out" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Barra de color */}
        <div className={`h-1.5 w-full ${accentColor.bar}`} />

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${accentColor.icon}`}
            >
              <AlertTriangle size={17} className={accentColor.iconColor} />
            </div>
            <div>
              <h2 className="text-sm font-black text-[#1A1A1A] uppercase tracking-wide">
                Confirmar cambio de estado
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Revisa los datos antes de continuar
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Cerrar"
          >
            <X size={16} />
          </button>
        </div>

        {/* Cuerpo */}
        <div className="px-6 py-5 space-y-4">
          {/* Datos */}
          <div className="bg-slate-50 rounded-xl p-4 space-y-3">
            <InfoRow
              icon={<User size={14} className="text-[#123498]" />}
              label="Candidato"
            >
              <div>
                <p className="text-sm font-black text-[#1A1A1A]">
                  {candidate.candidato_nombre || "—"}
                </p>
                {candidate.candidato_correo && (
                  <p className="text-xs text-slate-400 mt-0.5">
                    {candidate.candidato_correo}
                  </p>
                )}
              </div>
            </InfoRow>
            <Divider />
            <InfoRow
              icon={<Briefcase size={14} className="text-slate-500" />}
              label="Oferta"
            >
              <p className="text-sm font-semibold text-slate-700">
                {candidate.oferta_titulo || "—"}
              </p>
            </InfoRow>
            <Divider />
            <InfoRow
              icon={<Building2 size={14} className="text-slate-500" />}
              label="Empresa"
            >
              <p className="text-sm font-semibold text-slate-700">
                {candidate.empresa_nombre || "—"}
              </p>
            </InfoRow>
            <Divider />
            <InfoRow
              icon={<CalendarDays size={14} className="text-slate-500" />}
              label="Fecha del cambio"
            >
              <p className="text-sm font-semibold text-slate-700">
                {fechaFormateada}
              </p>
            </InfoRow>
          </div>

          {/* Flecha de transición de estado */}
          <div className="flex items-center justify-center gap-3 py-3 px-4 bg-white border border-slate-200 rounded-xl">
            <EstadoBadge estado={candidate.estado} />
            <div className="flex items-center gap-1.5">
              <div className="h-px w-4 bg-slate-200" />
              <ArrowRight size={14} className="text-slate-400 shrink-0" />
              <div className="h-px w-4 bg-slate-200" />
            </div>
            <EstadoBadge estado={newEstado} />
          </div>

          {/* Aviso de correo */}
          <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
            <Mail size={14} className="text-[#123498] mt-0.5 shrink-0" />
            <p className="text-xs text-[#123498] leading-relaxed">
              Se enviará una <strong>notificación por correo</strong> al
              postulante informando el cambio de estado de su postulación.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/60">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            ref={confirmBtnRef}
            onClick={onConfirm}
            disabled={loading}
            className={`px-5 py-2 text-sm font-black text-white rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 ${accentColor.btn}`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-3.5 w-3.5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Procesando…
              </>
            ) : (
              <>
                {ESTADO_ICONS[newEstado]}
                Confirmar cambio
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(14px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>
    </div>
  );
}
