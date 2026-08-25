import { useEffect } from "react";

export default function BottomSheet({
  open,
  titulo,
  opciones,
  valorSeleccionado,
  onSelect,
  onClose,
}) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div
        className="absolute inset-0 bg-black/40 animate-fade-in"
        onClick={onClose}
      />
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[85vh] flex flex-col animate-slide-up">
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h3 className="font-semibold text-sm text-gray-800">{titulo}</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            type="button"
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
        </div>
        <div className="overflow-y-auto py-1">
          {opciones.map((op) => {
            const seleccionado = valorSeleccionado === op.value;
            return (
              <button
                key={op.value}
                type="button"
                onClick={() => {
                  onSelect(op.value);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors cursor-pointer ${
                  seleccionado
                    ? "text-naranja font-semibold bg-orange-50"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span>{op.label}</span>
                {seleccionado && (
                  <svg
                    className="w-4 h-4 text-naranja shrink-0"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
