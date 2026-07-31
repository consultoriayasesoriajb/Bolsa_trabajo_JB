import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCheck, Briefcase } from "lucide-react";

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Ahora mismo";
  if (diffMin < 60) return `Hace ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `Hace ${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  return `Hace ${diffD}d`;
}

export default function NotificationDropdown({
  isOpen,
  notificaciones,
  loading,
  onClose,
  onMarcarLeida,
  onMarcarTodasLeidas,
  noLeidasCount,
}) {
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <span className="text-sm font-semibold text-slate-700">
          Notificaciones
        </span>
        {noLeidasCount > 0 && (
          <button
            onClick={onMarcarTodasLeidas}
            className="flex items-center gap-1 text-xs text-[#123498] hover:text-[#0e2a7a] font-medium transition-colors"
          >
            <CheckCheck size={13} />
            Marcar todo leído
          </button>
        )}
      </div>

      {/* Lista */}
      <div className="max-h-80 overflow-y-auto">
        {loading && notificaciones.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-slate-400">
            Cargando...
          </div>
        ) : notificaciones.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-slate-400">
            No hay notificaciones
          </div>
        ) : (
          notificaciones.map((n) => (
            <button
              key={n.id}
              onClick={() => {
                if (!n.leida) onMarcarLeida(n.id);
                onClose();
                navigate("/admin/postulantes");
              }}
              className={`w-full text-left flex items-start gap-3 px-4 py-3 transition-colors hover:bg-slate-50 border-b border-slate-50 last:border-0 ${
                !n.leida ? "bg-[#123498]/[0.03]" : ""
              }`}
            >
              <div className="shrink-0 mt-0.5">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    !n.leida
                      ? "bg-[#123498]/10 text-[#123498]"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  <Briefcase size={14} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 truncate">
                  {n.titulo}
                </p>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  {n.mensaje}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  {timeAgo(n.created_at)}
                </p>
              </div>
              {!n.leida && (
                <span className="shrink-2 mt-1.5 w-2 h-2 rounded-full bg-[#F46F0B]" />
              )}
            </button>
          ))
        )}
      </div>

      {/* Footer */}
      {notificaciones.length > 0 && (
        <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/50">
          <span className="text-xs text-slate-400">
            {noLeidasCount > 0
              ? `${noLeidasCount} nueva${noLeidasCount > 1 ? "s" : ""}`
              : "Todo al día"}
          </span>
        </div>
      )}
    </div>
  );
}
