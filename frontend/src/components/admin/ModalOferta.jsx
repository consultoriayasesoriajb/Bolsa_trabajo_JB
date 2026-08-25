import { useState } from "react";
import { X } from "lucide-react";
import ModalOfertaPaso1 from "./modal-oferta/ModalOfertaPaso1";
import ModalOfertaPaso2 from "./modal-oferta/ModalOfertaPaso2";
import ModalOfertaPaso3 from "./modal-oferta/ModalOfertaPaso3";

function getInitials(nombre) {
  return (nombre || "").split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
}

function StepIndicator({ paso }) {
  const steps = [
    { n: 1, label: "Puesto" },
    { n: 2, label: "Detalle" },
    { n: 3, label: "Preguntas" },
  ];
  return (
    <div className="flex items-center gap-2">
      {steps.map((s, i) => {
        const done   = s.n < paso;
        const active = s.n === paso;
        return (
          <div key={s.n} className="flex items-center gap-2">
            <div className={`flex items-center gap-2 ${active ? "text-[#123498]" : done ? "text-green-500" : "text-slate-300"}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-colors ${
                active ? "bg-[#123498] text-white" :
                done   ? "bg-green-500 text-white" :
                         "bg-slate-100 text-slate-400"
              }`}>
                {done ? "✓" : s.n}
              </div>
              <span className={`text-sm font-bold hidden sm:block ${
                active ? "text-[#123498]" : done ? "text-green-500" : "text-slate-400"
              }`}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-px w-8 ${done ? "bg-green-400" : "bg-slate-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function ModalOferta({
  isOpen, onClose,
  editingOffer,
  form, setForm,
  companies, categories,
  showNewCategory, setShowNewCategory,
  newCategoryName, setNewCategoryName,
  handleCreateCategory,
  preguntas,
  addPregunta, updatePregunta, removePregunta,
  handleSubmit,
  loading,
}) {
  const [paso, setPaso] = useState(1);

  const empresaActiva = companies.find(c => String(c.id) === String(form.empresa_id));

  // Validaciones por paso
  const canNext1 = form.titulo.trim() && form.ubicacion.trim() && form.empresa_id;
  const canNext2 = (form.descripcion || "").trim().length > 0;

  const handleClose = () => { setPaso(1); onClose(); };

  // Normalizar requisitos antes de enviar
  const handlePublish = (e) => {
    const requisitosNormalizados = Array.isArray(form.requisitos)
      ? form.requisitos.join("\n")
      : form.requisitos || "";
    setForm(prev => ({ ...prev, requisitos: requisitosNormalizados }));
    handleSubmit(e);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={handleClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-black text-[#1c2a52]">
              {editingOffer ? "Editar oferta" : "Nueva oferta"}
            </h2>
            <button onClick={handleClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
              <X size={16} />
            </button>
          </div>

          {/* Empresa activa */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs text-slate-400">Publicando para</span>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-full">
              {empresaActiva ? (
                <>
                  <span className="w-5 h-5 rounded-full bg-[#123498] text-white text-[9px] font-black flex items-center justify-center shrink-0">
                    {getInitials(empresaActiva.nombre)}
                  </span>
                  <span className="text-xs font-bold text-slate-700">{empresaActiva.nombre}</span>
                </>
              ) : (
                <span className="text-xs text-slate-400">Sin empresa</span>
              )}
            </div>
          </div>

          <StepIndicator paso={paso} />
        </div>

        {/* Contenido scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {paso === 1 && (
            <ModalOfertaPaso1
              form={form} setForm={setForm}
              companies={companies} categories={categories}
              showNewCategory={showNewCategory} setShowNewCategory={setShowNewCategory}
              newCategoryName={newCategoryName} setNewCategoryName={setNewCategoryName}
              handleCreateCategory={handleCreateCategory}
              onChangeEmpresa={(id) => setForm(prev => ({ ...prev, empresa_id: id }))}
            />
          )}
          {paso === 2 && (
            <ModalOfertaPaso2 form={form} setForm={setForm} />
          )}
          {paso === 3 && (
            <ModalOfertaPaso3
              preguntas={preguntas}
              addPregunta={addPregunta}
              updatePregunta={updatePregunta}
              removePregunta={removePregunta}
            />
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            {paso > 1 && (
              <button type="button" onClick={() => setPaso(p => p - 1)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                ← Atrás
              </button>
            )}
            <span className="text-xs text-slate-400">Paso {paso} de 3</span>
          </div>

          {paso < 3 ? (
            <button
              type="button"
              onClick={() => setPaso(p => p + 1)}
              disabled={(paso === 1 && !canNext1) || (paso === 2 && !canNext2)}
              className="px-6 py-2.5 rounded-xl bg-[#123498] hover:bg-[#0f2a80] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold transition-colors"
            >
              Continuar →
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePublish}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-[#F46F0B] hover:bg-[#d65f09] disabled:opacity-60 text-white text-sm font-bold transition-colors"
            >
              {loading ? "Guardando..." : editingOffer ? "Guardar cambios" : "Publicar oferta"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}