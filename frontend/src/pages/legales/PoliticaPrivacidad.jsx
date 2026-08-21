import { Link } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";


const SECCIONES = [
  {
    id: 1,
    titulo: "Identidad del Responsable",
    contenido: null,
    lista: [
      "Responsable: Jose Benites",
      "RUC: 20613509217",
      "Domicilio: Calle los amancaes – S.J.L. – Lima",
      "Email: consultoriayasesoriajb@gmail.com",
      "Sitio Web: https://consultoradeasesoriaempresarialjb.com",
    ],
  },
  {
    id: 2,
    titulo: "Principios aplicados en el tratamiento de datos",
    contenido:
      "En el tratamiento de sus datos personales, el Titular aplicará los siguientes principios que se ajustan a las exigencias del nuevo reglamento europeo de protección de datos (RGPD):",
    lista: [
      "Principio de licitud, lealtad y transparencia: El Titular siempre requerirá el consentimiento para el tratamiento de los datos personales que puede ser para uno o varios fines específicos sobre los que el Titular informará al Usuario previamente con absoluta transparencia.",
      "Principio de minimización de datos: El Titular solicitará solo los datos estrictamente necesarios para el fin o los fines que los solicita.",
      "Principio de limitación del plazo de conservación: El Titular mantendrá los datos personales recabados durante el tiempo estrictamente necesario para el fin o los fines del tratamiento.",
      "Principio de integridad y confidencialidad: Los datos personales recabados serán tratados de tal manera que su seguridad, confidencialidad e integridad está garantizada. Se toman precauciones para evitar el acceso no autorizado.",
    ],
  },
  {
    id: 3,
    titulo: "Obtención de datos personales",
    contenido:
      "Para navegar por el sitio Web no es necesario que facilite ningún dato personal. Los casos en los que usted sí proporciona sus datos personales son los siguientes:",
    lista: [
      "Al registrarse en la Bolsa de Trabajo, crear un perfil de usuario y subir su Currículum Vitae (CV).",
      "Al contactar a través de los formularios de contacto o enviar un correo electrónico.",
      "Al realizar un comentario en un artículo o en una página.",
      "Al inscribirse en un formulario de suscripción o un boletín.",
    ],
  },
  {
    id: 4,
    titulo: "Sus Derechos",
    contenido:
      "El Titular le informa que sobre sus datos personales tiene derecho a:",
    lista: [
      "Solicitar el acceso a los datos almacenados.",
      "Solicitar una rectificación o la supresión.",
      "Solicitar la limitación de su tratamiento.",
      "Oponerse al tratamiento.",
    ],
    nota: "El ejercicio de estos derechos es personal y debe ser ejercido directamente por el interesado solicitándolo al Titular. Para ejercitar sus derechos tiene que enviar su petición junto con una fotocopia del DNI o equivalente a: jbenitesma@consultoradeasesoriaempresarialjb.com",
  },
  {
    id: 5,
    titulo: "Finalidad del tratamiento de datos personales",
    contenido:
      "Cuando usted se conecta al Sitio Web para crear un perfil profesional, mandar un correo al Titular, escribe un comentario o se suscribe a su boletín, está facilitando información de carácter personal. Al facilitar esta información, da su consentimiento para que sea recopilada, utilizada, gestionada y almacenada.",
    lista: [
      "Plataforma de Bolsa de Trabajo: Gestionar su registro como postulante, almacenar su CV y compartir su perfil profesional exclusivamente con las empresas a las que usted decida postular.",
      "Formularios de contacto: Responder a consultas, dudas, quejas o comentarios.",
      "Formularios de suscripción: Gestionar la lista de suscripciones, enviar boletines y promociones.",
      "Redes Sociales: Administrar la presencia del Titular en redes e informar de actividades.",
    ],
  },
  {
    id: 6,
    titulo: "Seguridad y Destinatarios de datos",
    contenido:
      "El sitio Web está alojado en Hostinger. La seguridad de los datos está garantizada. Los destinatarios con quienes se pueden compartir sus datos son:",
    lista: [
      "Empresas Contratantes: Las empresas clientes de Consultora JB que publican vacantes. Sus datos solo serán compartidos cuando usted aplique a sus ofertas.",
      "ActiveCampaign, LLC (EEUU): Para servicios de email marketing.",
      "MailerLite (UAB) (Lituania): Para servicios de email marketing.",
      "Google Analytics: Servicio de analítica web para analizar el uso del sitio.",
    ],
  },
  {
    id: 7,
    titulo: "Navegación Web y Cookies",
    contenido:
      "Al navegar por el Sitio Web se pueden recoger datos no identificativos (IP, geolocalización, hábitos de navegación) mediante servicios como Google Analytics. El Titular utiliza esta información para analizar tendencias y administrar el sitio. Para que este sitio Web funcione correctamente necesita utilizar cookies, que es una información que se almacena en su navegador web.",
    lista: null,
  },
  {
    id: 8,
    titulo: "Exactitud, Aceptación y Cambios",
    contenido: null,
    lista: [
      "Exactitud: Usted se compromete a que los datos facilitados sean correctos y veraces. Como Usuario es el único responsable de la veracidad de los datos remitidos, incluyendo la información contenida en su Currículum Vitae.",
      "Aceptación: Para postular, contactar con el Titular o suscribirse, debe aceptar esta Política de Privacidad.",
      "Cambios: El Titular se reserva el derecho a modificar la presente Política para adaptarla a novedades legislativas.",
    ],
  },
];

export default function PoliticaPrivacidad() {
  return (
    <div className="min-h-screen bg-white">

      {/* Header */}
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
            Política de Privacidad
          </h1>
          <p className="text-white/60 text-sm mt-3">
            Última actualización: julio de 2026
          </p>
        </div>
      </div>

      {/* Intro */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10">
        <div className="bg-[#123498]/5 border border-[#123498]/10 rounded-2xl p-5 text-sm text-[#6b7a9f] leading-relaxed">
          El Titular le informa sobre su Política de Privacidad respecto del
          tratamiento y protección de los datos de carácter personal de los
          usuarios que puedan ser recabados durante la navegación o registro a
          través del Sitio Web y la Bolsa de Trabajo. El uso del sitio Web
          implica la aceptación de esta Política de Privacidad así como las
          condiciones incluidas en el{" "}
          <Link
            to="/terminos-condiciones"
            className="text-[#123498] font-bold hover:underline"
          >
            Aviso Legal y los Términos y Condiciones de Uso
          </Link>
          .
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-8">
        {SECCIONES.map((seccion) => (
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
              {seccion.contenido && (
                <p className="text-sm text-[#6b7a9f] leading-relaxed">
                  {seccion.contenido}
                </p>
              )}
              {seccion.lista && (
                <ul className="flex flex-col gap-2">
                  {seccion.lista.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-[#6b7a9f]">
                      <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-[#F46F0B] mt-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              {seccion.nota && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-700 leading-relaxed">
                  {seccion.nota}
                </div>
              )}
            </div>

            {seccion.id < SECCIONES.length && (
              <div className="pl-12 pt-2">
                <div className="h-px bg-slate-200" />
              </div>
            )}
          </div>
        ))}

        {/* Nota final */}
        <div className="bg-[#123498]/5 border border-[#123498]/10 rounded-2xl p-5 text-sm text-[#6b7a9f] leading-relaxed">
          Si tienes alguna duda sobre esta política, puedes contactarnos a
          través del botón{" "}
          <span className="font-bold text-[#F46F0B]">Contáctanos</span> en la
          página principal o escribirnos a{" "}
          
            <a href="mailto:consultoriayasesoriajb@gmail.com"
            className="text-[#123498] font-bold hover:underline"
          >
            consultoriayasesoriajb@gmail.com
          </a>
          .
        </div>
      </div>


    </div>
  );
}