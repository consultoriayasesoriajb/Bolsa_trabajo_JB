import { StarIcon as StarSolid } from "@heroicons/react/24/solid";

export default function EmpresaTabs({ pestana, setPestana, totalOfertas, totalEvaluaciones, yaEvaluo, onCalificar }) {

  const tabs = [
    { id: "ofertas",      label: "Ofertas",      count: totalOfertas },
    { id: "evaluaciones", label: "Evaluaciones", count: totalEvaluaciones },
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {tabs.map(tab => (
        <button
          key={tab.id}
          type="button"
          onClick={() => setPestana(tab.id)}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
            pestana === tab.id
              ? "bg-[#123498] text-white"
              : "bg-white border border-[#e8edf5] text-[#6b7a9f] hover:border-[#123498] hover:text-[#123498]"
          }`}
        >
          {tab.label}
          <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full font-black ${
            pestana === tab.id ? "bg-white/20" : "bg-[#f4f6fb]"
          }`}>
            {tab.count}
          </span>
        </button>
      ))}

      {/* Botón calificar */}
      <button
        type="button"
        onClick={onCalificar}
        disabled={yaEvaluo}
        className={`sm:ml-auto flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
          yaEvaluo
            ? "bg-[#f4f6fb] text-[#9aa3bd] cursor-not-allowed border border-[#e8edf5]"
            : "bg-[#F46F0B] hover:bg-[#d65f09] text-white shadow-sm"
        }`}
      >
        <StarSolid className="w-4 h-4" />
        {yaEvaluo ? "Ya calificaste" : "Calificar empresa"}
      </button>
    </div>
  );
}