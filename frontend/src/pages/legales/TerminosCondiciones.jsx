import { Link } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";


const TERMINOS = [
  {
    id: 1,
    titulo: "Aceptación de los Términos",
    contenido:
      "Al acceder, registrarse y utilizar la Bolsa de Trabajo de Consultora de Asesoría Empresarial JB (en adelante, \"la Plataforma\"), el usuario acepta estar sujeto a los presentes Términos y Condiciones. Si no está de acuerdo con alguno de estos puntos, le solicitamos abstenerse de utilizar nuestros servicios.",
    lista: null,
  },
  {
    id: 2,
    titulo: "Naturaleza del Servicio y Rol de la Consultora",
    contenido:
      "Consultora de Asesoría Empresarial JB actúa única y exclusivamente como un intermediario entre las empresas que requieren personal (clientes) y los usuarios que buscan oportunidades laborales (postulantes).",
    lista: [
      "No somos los empleadores finales.",
      "No garantizamos la selección, entrevista o contratación final del candidato.",
      "No nos hacemos responsables por los acuerdos, contratos o condiciones laborales que se establezcan posteriormente entre el postulante y la empresa contratante.",
    ],
  },
  {
    id: 3,
    titulo: "Registro y Veracidad de la Información",
    contenido:
      "Para postular a las vacantes, el usuario debe crear un perfil. El usuario declara y garantiza que toda la información proporcionada (datos personales, experiencia laboral, educación y documentos adjuntos como el CV) es veraz, exacta y actual. La suplantación de identidad o la falsificación de documentos está estrictamente prohibida.",
    lista: null,
  },
  {
    id: 4,
    titulo: "Privacidad y Uso de Datos (CVs)",
    contenido:
      "Al postular a una vacante, el usuario autoriza expresamente a Consultora JB a compartir su perfil, currículum vitae y datos de contacto con la empresa cliente que ofrece el puesto, con el único fin de gestionar el proceso de selección. Para más detalles sobre cómo protegemos sus datos, revise nuestra Política de Privacidad.",
    lista: null,
  },
  {
    id: 5,
    titulo: "Uso Correcto de la Plataforma",
    contenido:
      "El usuario se compromete a utilizar la Plataforma de manera ética y legal. Está prohibido utilizar la Bolsa de Trabajo para:",
    lista: [
      "Difundir contenido malicioso, virus o spam.",
      "Extraer información de otros postulantes o de las empresas.",
      "Vender o comercializar los servicios gratuitos de la plataforma.",
    ],
  },
  {
    id: 6,
    titulo: "Suspensión o Cancelación de Cuenta",
    contenido:
      "Consultora JB se reserva el derecho de suspender, bloquear o eliminar permanentemente la cuenta de cualquier usuario que incumpla estos Términos y Condiciones, o si se detecta que ha proporcionado información falsa o fraudulenta en su currículum.",
    lista: null,
  },
  {
    id: 7,
    titulo: "Modificaciones",
    contenido:
      "Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento. Los cambios entrarán en vigencia desde el momento de su publicación en esta Plataforma.",
    lista: null,
  },
];

export default function TerminosCondiciones() {
  return (
    <div className="min-h-screen bg-white">

      {/* Header de la página */}
      <div className="bg-[#123498] text-white py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-semibold mb-6 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Volver al inicio
          </Link>
          <p className="text-xs font-black uppercase tracking-widest text-[#FDB907] mb-2">
            Consultora de Asesoría Empresarial JB
          </p>
          <h1 className="text-3xl sm:text-4xl font-black font-heading uppercase leading-tight">
            Términos y Condiciones de Uso
          </h1>
          <p className="text-white/60 text-sm mt-3">
            Última actualización: julio de 2026
          </p>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 flex flex-col gap-8">
        {TERMINOS.map((seccion) => (
          <div key={seccion.id} className="flex flex-col gap-3">
            {/* Número + Título */}
            <div className="flex items-start gap-4">
              <span className="shrink-0 w-8 h-8 rounded-full bg-[#123498] text-white flex items-center justify-center text-xs font-black">
                {seccion.id}
              </span>
              <h2 className="text-base font-black text-[#1c2a52] font-heading pt-1">
                {seccion.titulo}
              </h2>
            </div>

            {/* Contenido */}
            <div className="pl-12 flex flex-col gap-3">
              <p className="text-sm text-[#6b7a9f] leading-relaxed">
                {seccion.contenido}
              </p>
              {seccion.lista && (
                <ul className="flex flex-col gap-2">
                  {seccion.lista.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-[#6b7a9f]">
                      <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-naranja mt-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Divisor excepto el último */}
            {seccion.id < TERMINOS.length && (
              <div className="pl-12 pt-2">
                <div className="h-px bg-slate-200" />
              </div>
            )}
          </div>
        ))}

        {/* Nota final */}
        <div className="bg-[#123498]/5 border border-[#123498]/10 rounded-2xl p-5 text-sm text-[#6b7a9f] leading-relaxed">
          Si tienes alguna duda sobre estos términos, puedes contactarnos a través del botón{" "}
          <span className="font-bold text-naranja">
            Contáctanos 
          </span>
          {" "}en la página principal o escribirnos directamente por WhatsApp.
        </div>
      </div>


    </div>
  );
}