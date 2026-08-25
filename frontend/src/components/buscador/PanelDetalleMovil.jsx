import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import PanelDetalle from "./PanelDetalle";

/**
 * PanelDetalleMovil
 * Modal bottom-sheet para móvil/tablet (< lg).
 * Soporta:
 *   - Animación de entrada slide-up (desde translateY(100%) → translateY(0))
 *   - Animación de salida slide-down
 *   - Arrastrar la pastilla hacia abajo para cerrar (drag-to-dismiss)
 *   - Cerrar tocando el backdrop
 *   - Cerrar con botón ✕
 *   - Cerrar con tecla Escape
 * La flecha "volver" de PanelDetalle se oculta (onVolver=null).
 */
export default function PanelDetalleMovil({
  abierto,
  onCerrar,
  // Props de PanelDetalle
  estado,
  vacante,
  error,
  onPostular,
  onReintentar,
  postulacionStep,
  respuestasFiltro,
  setRespuestasFiltro,
  onPreguntasCompletadas,
  onPostularConCV,
  onCancelarPostulacion,
  onVolverAPreguntas,
  postulando,
  yaPostulada,
  esGuardada,
  onGuardar,
  onCompartir,
}) {
  const [visible, setVisible] = useState(false);
  const [animando, setAnimando] = useState(false); // true = sheet está en posición visible
  const [cerrando, setCerrando] = useState(false); // true = animando salida
  const [dragY, setDragY] = useState(0); // px desplazados hacia abajo durante el drag

  const sheetRef = useRef(null);
  const dragStartY = useRef(null);
  const scrollYRef = useRef(0); // guarda la posición del scroll antes de bloquear

  // ── Entrada del modal ──────────────────────────────────────────────────────
  useEffect(() => {
    if (abierto) {
      setVisible(true);
      setCerrando(false);
      setDragY(0);

      // Guardar posición actual y bloquear scroll SIN saltar al top
      scrollYRef.current = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.width = "100%";
      document.body.style.overflowY = "scroll"; // evita reflow por scrollbar

      // Dos frames para que el DOM pinte translateY(100%) antes de animar
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimando(true));
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [abierto]);

  // ── Función de cierre ──────────────────────────────────────────────────────
  // Utilidad para restaurar el scroll del body sin saltar
  const restaurarScroll = useCallback(() => {
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    document.body.style.overflowY = "";
    window.scrollTo({ top: scrollYRef.current, behavior: "instant" });
  }, []);

  const cerrar = useCallback(() => {
    setCerrando(true); // activa la animación de salida
    setAnimando(false); // limpia estado
    const t = setTimeout(() => {
      setVisible(false);
      setCerrando(false);
      setDragY(0);
      restaurarScroll();
      onCerrar?.();
    }, 360);
    return () => clearTimeout(t);
  }, [onCerrar, restaurarScroll]);

  // ── Escape ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!visible) return;
    const fn = (e) => {
      if (e.key === "Escape") cerrar();
    };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [visible, cerrar]);

  // Limpiar estilos del body si el componente se desmonta con el modal abierto
  useEffect(
    () => () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflowY = "";
    },
    [],
  );

  // ── Drag-to-dismiss (solo desde la pastilla) ───────────────────────────────
  const handleTouchStart = useCallback((e) => {
    dragStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (dragStartY.current === null) return;
    const delta = e.touches[0].clientY - dragStartY.current;
    if (delta > 0) setDragY(delta);
  }, []);

  const handleTouchEnd = useCallback(() => {
    dragStartY.current = null;
    const threshold = window.innerHeight * 0.28; // 28% de la pantalla
    if (dragY > threshold) {
      cerrar();
    } else {
      setDragY(0); // snap back con animación
    }
  }, [dragY, cerrar]);

  // ── Cálculo de transform y transition ─────────────────────────────────────
  const isActiveDrag = dragStartY.current !== null && dragY > 0;

  const getTransform = () => {
    if (cerrando) return `translateY(${window.innerHeight}px)`; // sale hacia abajo completo
    if (!animando) return "translateY(100%)"; // posición inicial (fuera)
    return `translateY(${dragY}px)`; // posición actual (drag o 0)
  };

  const getTransition = () => {
    if (isActiveDrag) return "none"; // sin transición al arrastrar
    return "transform 360ms cubic-bezier(0.32, 0.72, 0, 1)"; // spring al entrar/salir/snap
  };

  // Opacidad del backdrop: se atenúa al arrastrar
  const overlayOpacity = (() => {
    if (cerrando || !animando) return 0;
    return Math.max(0, 1 - dragY / (window.innerHeight * 0.45));
  })();

  if (!visible) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex flex-col justify-end lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Detalle de vacante"
    >
      {/* Backdrop */}
      <div
        onClick={cerrar}
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        style={{
          opacity: overlayOpacity,
          transition: isActiveDrag ? "none" : "opacity 360ms ease",
        }}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className="relative flex flex-col bg-white rounded-t-2xl shadow-2xl"
        style={{
          height: "92dvh",
          transform: getTransform(),
          transition: getTransition(),
          willChange: "transform",
        }}
      >
        {/* ── Pastilla de arrastre (área de drag-to-dismiss) ── */}
        <div
          className="flex justify-center pt-3 pb-2 shrink-0 touch-none select-none cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          aria-hidden="true"
        >
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* ── Botón ✕ ── */}
        <button
          type="button"
          onClick={cerrar}
          aria-label="Cerrar detalle"
          className="absolute top-2.5 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 active:bg-gray-200 transition-colors cursor-pointer"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* ── Contenido ── */}
        <div className="flex flex-col flex-1 min-h-0">
          <PanelDetalle
            estado={estado}
            vacante={vacante}
            error={error}
            onPostular={onPostular}
            onReintentar={onReintentar}
            onVolver={null}
            postulacionStep={postulacionStep}
            respuestasFiltro={respuestasFiltro}
            setRespuestasFiltro={setRespuestasFiltro}
            onPreguntasCompletadas={onPreguntasCompletadas}
            onPostularConCV={onPostularConCV}
            onCancelarPostulacion={onCancelarPostulacion}
            onVolverAPreguntas={onVolverAPreguntas}
            postulando={postulando}
            yaPostulada={yaPostulada}
            esGuardada={esGuardada}
            onGuardar={onGuardar}
            onCompartir={onCompartir}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
