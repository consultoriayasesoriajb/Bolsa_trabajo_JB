import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { XMarkIcon, FlagIcon } from "@heroicons/react/24/outline";

const MOTIVOS = [
  "Oferta de empleo falsa o fraudulenta",
  "Pide dinero por adelantado o pago de equipo",
  "Salario engañoso o diferente al publicado",
  "Discriminación u ofensa en la descripción",
  "Phishing o intento de robo de datos",
  "Spam o publicidad engañosa",
  "Empresa o reclutador sospechoso",
  "Otro motivo"
];

function ReportarModalInner({ vacante, onClose, onReportado, vacantesService }) {
  const [visible, setVisible] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 260);
  };

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget && !loading) handleClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!motivo) {
      setError("Por favor, selecciona un motivo.");
      return;
    }
    if (descripcion.trim().split(/\s+/).length > 500) {
      setError("La descripción no puede exceder las 500 palabras.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await vacantesService.reportar({
        oferta_id: vacante.id,
        motivo,
        descripcion: descripcion.trim()
      });
      onReportado();
      handleClose();
    } catch (err) {
      setError(err.message || "Error al enviar el reporte.");
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={handleBackdrop}
      style={{
        background: visible ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0)",
        backdropFilter: visible ? "blur(3px)" : "none",
        transition: "background 0.25s ease, backdrop-filter 0.25s ease",
      }}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        style={{
          transform: visible ? "translateY(0) scale(1)" : "translateY(32px) scale(0.96)",
          opacity: visible ? 1 : 0,
          transition: "transform 0.26s cubic-bezier(.32,1.2,.5,1), opacity 0.2s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
              <FlagIcon className="w-5 h-5 text-red-500" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-base font-black text-red-600 tracking-tight uppercase">
                Reportar Oferta
              </h3>
              <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                {vacante?.titulo} · {vacante?.empresa_nombre}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50"
          >
            <XMarkIcon className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-6 pt-6 pb-4 min-h-0 flex flex-col gap-5">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100 shrink-0">
                {error}
              </div>
            )}

            <div className="flex flex-col flex-1 min-h-0">
              <label className="block text-xs font-black text-[#123498] tracking-widest uppercase mb-2 shrink-0">
                Motivo del reporte <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2 overflow-y-auto pr-2 flex-1 min-h-0">
                {MOTIVOS.map((m) => (
                  <label key={m} className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="motivo"
                      value={m}
                      checked={motivo === m}
                      onChange={(e) => setMotivo(e.target.value)}
                      className="mt-0.5 w-4 h-4 text-[#123498] focus:ring-[#123498] shrink-0"
                    />
                    <span className="text-sm font-medium text-gray-700">{m}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="shrink-0">
              <label className="block text-xs font-black text-[#123498] tracking-widest uppercase mb-2">
                Descripción detallada <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Por favor, describe detalladamente por qué estás reportando esta oferta de empleo (máx. 500 palabras)."
                className="w-full h-24 p-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#123498]/20 focus:border-[#123498] resize-none"
              ></textarea>
              <div className="text-right mt-1">
                <span className={`text-[10px] font-medium ${descripcion.trim().split(/\s+/).length > 500 ? 'text-red-500' : 'text-gray-400'}`}>
                  {descripcion.trim() === "" ? 0 : descripcion.trim().split(/\s+/).length} / 500 palabras
                </span>
              </div>
            </div>
          </div>

          <div className="px-6 pb-6 pt-1 shrink-0">
            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
              disabled={loading}
              className="px-5 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              {loading && (
                <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading ? "Enviando..." : "Enviar Reporte"}
            </button>
          </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ReportarModal(props) {
  return createPortal(<ReportarModalInner {...props} />, document.body);
}
