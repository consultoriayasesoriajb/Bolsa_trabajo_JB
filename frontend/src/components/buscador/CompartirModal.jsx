import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";

// ── Opción de compartir ───────────────────────────────────────
function OpcionCompartir({ icon, label, color, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-2 group cursor-pointer"
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-transform duration-200 group-hover:scale-110 group-active:scale-95"
        style={{ backgroundColor: color }}
      >
        {icon}
      </div>
      <span className="text-[10px] font-semibold text-gray-500 group-hover:text-gray-700 transition-colors leading-tight text-center max-w-[56px]">
        {label}
      </span>
    </button>
  );
}

// ── Componente principal ──────────────────────────────────────
function CompartirModalInner({ vacante, onClose, onCompartido }) {
  const [copiado, setCopiado] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 260);
  };

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const baseUrl = window.location.origin;
  const url = vacante?.slug
    ? `${baseUrl}/buscar-empleo/${vacante.slug}`
    : window.location.href;
  const titulo = vacante?.titulo ?? "Oferta de trabajo";
  const empresa = vacante?.empresa_nombre ?? "";
  const texto = `${titulo}${empresa ? ` en ${empresa}` : ""} — Mira esta oferta de trabajo:\n${url}`;

  const registrarCompartido = () => { onCompartido?.(); };

  const copiarEnlace = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const el = document.createElement("textarea");
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopiado(true);
    registrarCompartido();
    setTimeout(() => setCopiado(false), 2200);
  };
  {/* Share buttons */ }
  {/*WhatsApp*/ }
  const abrirWhatsApp = () => { window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, "_blank"); registrarCompartido(); };
  {/*Twitter*/ }
  const abrirTwitter = () => { window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(texto)}`, "_blank"); registrarCompartido(); };
  {/*Facebook*/ }
  const abrirFacebook = () => { window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank"); registrarCompartido(); };
  {/*LinkedIn*/ }
  const abrirLinkedIn = () => { window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank"); registrarCompartido(); };

  const usarShareNativo = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: titulo, text: texto, url }); registrarCompartido(); } catch { /* cancelado */ }
    }
  };

  const iconoCopy = copiado ? (
    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  ) : (
    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4"
      onClick={handleBackdrop}
      style={{
        background: visible ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0)",
        backdropFilter: visible ? "blur(3px)" : "none",
        transition: "background 0.25s ease, backdrop-filter 0.25s ease",
      }}
    >
      {/* Panel */}
      <div
        className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
        style={{
          transform: visible ? "translateY(0) scale(1)" : "translateY(32px) scale(0.96)",
          opacity: visible ? 1 : 0,
          transition: "transform 0.26s cubic-bezier(.32,1.2,.5,1), opacity 0.2s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pill handle móvil */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="w-8 h-1 rounded-full bg-gray-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-base font-black text-[#123498] tracking-tight uppercase">
              Compartir oferta
            </h3>
            {vacante?.titulo && (
              <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                {vacante.titulo}{vacante.empresa_nombre && ` · ${vacante.empresa_nombre}`}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <XMarkIcon className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Grid de opciones */}
        <div className="px-5 pt-5 pb-3 grid grid-cols-4 gap-4 justify-items-center">
          <OpcionCompartir
            onClick={copiarEnlace}
            color={copiado ? "#22c55e" : "#123498"}
            label={copiado ? "¡Copiado!" : "Copiar link"}
            icon={iconoCopy}
          />
          <OpcionCompartir
            onClick={abrirWhatsApp}
            color="#25D366"
            label="WhatsApp"
            icon={
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            }
          />
          <OpcionCompartir
            onClick={abrirTwitter}
            color="#000000"
            label="X / Twitter"
            icon={
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            }
          />
          <OpcionCompartir
            onClick={abrirFacebook}
            color="#1877F2"
            label="Facebook"
            icon={
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            }
          />
        </div>

        <div className="px-5 pb-5 grid grid-cols-4 gap-4 justify-items-center">
          <OpcionCompartir
            onClick={abrirLinkedIn}
            color="#0A66C2"
            label="LinkedIn"
            icon={
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            }
          />
          {typeof navigator !== "undefined" && navigator.share && (
            <OpcionCompartir
              onClick={usarShareNativo}
              color="#f97316"
              label="Más opciones"
              icon={
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              }
            />
          )}
        </div>

        {/* URL footer */}
        <div className="mx-4 mb-4 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200">
          <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <span className="text-[11px] text-gray-400 truncate flex-1 font-mono">{url}</span>
          <button
            type="button"
            onClick={copiarEnlace}
            className="shrink-0 text-[11px] font-bold text-[#123498] hover:text-naranja transition-colors cursor-pointer"
          >
            {copiado ? "¡Copiado!" : "Copiar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CompartirModal(props) {
  return createPortal(<CompartirModalInner {...props} />, document.body);
}
