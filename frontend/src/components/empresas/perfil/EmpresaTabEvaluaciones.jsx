import ComentarioCard from "../ComentarioCard";

export default function EmpresaTabEvaluaciones({ evaluaciones }) {
  if (!evaluaciones?.length) {
    return (
      <div className="bg-white rounded-2xl border border-[#e8edf5] px-6 py-12 text-center text-sm text-[#9aa3bd]">
        Aún no hay evaluaciones. ¡Sé el primero en calificar esta empresa!
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {evaluaciones.map(ev => (
        <ComentarioCard key={ev.id} evaluacion={ev} />
      ))}
    </div>
  );
}