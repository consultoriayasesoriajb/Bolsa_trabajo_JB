import OfertaEmpresaCard from "../OfertaEmpresaCard";

export default function EmpresaTabOfertas({ ofertas, onVerEmpleo }) {
  if (ofertas.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#e8edf5] px-6 py-12 text-center text-sm text-[#9aa3bd]">
        Esta empresa no tiene ofertas activas en este momento.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {ofertas.map(oferta => (
        <OfertaEmpresaCard
          key={oferta.id}
          oferta={oferta}
          onVerEmpleo={() => onVerEmpleo(oferta.id)}
        />
      ))}
    </div>
  );
}