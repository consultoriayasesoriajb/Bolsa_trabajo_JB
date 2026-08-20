import { BoltIcon, EyeIcon } from "@heroicons/react/24/outline";

export default function QuienesSomosSection() {
  return (
    <section
      id="quienes-somos"
      className="bg-white border-t border-slate-100 py-14"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="mb-10 flex flex-col items-center text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-[#123498] tracking-tight font-heading uppercase">
            ¿Quiénes Somos?
          </h2>
          <div className="w-15 h-1 bg-[#F46F0B] mt-2 mb-1 rounded-full" />
          <p
            className="text-slate-400 text-lg font-bold mt-1 max-w-2xl leading-relaxed"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            Somos la{" "}
            <span className="text-[#123498] font-bold">
              Consultora de Asesoría Empresarial JB
            </span>
            , un aliado estratégico para estudiantes y empresas, brindando
            servicios personalizados de asesoría, capacitación y consultoría.
          </p>
        </div>

        {/* Grid: Misión + Visión */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Misión */}
          <div className="bg-[#123498] rounded-2xl p-7 text-white hover:shadow-lg transition-all duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 bg-naranja rounded-xl flex items-center justify-center shrink-0 border border-white/20">
                <BoltIcon className="w-5 h-5 text-white" strokeWidth="2.5"/>
              </div>
              <h3 className="font-black text-lg uppercase tracking-wider font-heading">
                Misión
              </h3>
            </div>
            <p className="text-white/85 text-sm leading-relaxed font-sans">
              Ser un aliado estratégico brindando servicios de asesoría,
              capacitación y consultoría de alta calidad, con honestidad e
              innovación, para superar desafíos y alcanzar el éxito.
            </p>
          </div>

          {/* Visión */}
          <div className="bg-[#F46F0B] rounded-2xl p-7 text-white hover:shadow-lg transition-all duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 bg-azul rounded-xl flex items-center justify-center shrink-0 border border-white/20">
                <EyeIcon className="w-5 h-5 text-white" strokeWidth="2.5"/>
              </div>
              <h3 className="font-black text-lg uppercase tracking-wider font-heading">
                Visión
              </h3>
            </div>
            <p className="text-white/85 text-sm leading-relaxed font-sans">
              Ser reconocidos a nivel nacional como referentes en calidad,
              innovación y honestidad, acompañando a nuestros clientes en su
              crecimiento y consolidación.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
