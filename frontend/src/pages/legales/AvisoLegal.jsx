import { Link } from "react-router-dom";
import FotoInge from "../../assets/images/foto_inge.webp";
import Emprendedor from "../../assets/images/emprendedor.webp";
import {
  ArrowLeftIcon,
  ScaleIcon,
  ShieldCheckIcon,
  ClipboardDocumentCheckIcon,
  GlobeAltIcon,
  InformationCircleIcon,
  PencilSquareIcon,
  MagnifyingGlassIcon,
  ServerStackIcon,
  BoltIcon,
  NoSymbolIcon,
  UserCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";


// ── Datos ────────────────────────────────────────────────────
const CONDICIONES_IZQUIERDA = [
  "El uso del Sitio Web implica la aceptación total del Aviso Legal y la Política de Privacidad.",
  "Si el usuario no está de acuerdo con estas condiciones, debe abstenerse de utilizar el Sitio Web.",
  "El acceso al Sitio Web no genera ninguna relación comercial con el Titular.",
  "El Sitio Web permite acceder a contenidos publicados por el Titular y/o sus colaboradores.",
];

const CONDICIONES_DERECHA = [
  "El usuario se compromete a no utilizar los contenidos con fines ilícitos, prohibidos o que perjudiquen a terceros.",
  "El Titular se reserva el derecho de eliminar comentarios que infrinjan la ley o resulten inapropiados.",
  "El Titular no se responsabiliza por las opiniones emitidas por los usuarios en comentarios, redes sociales u otros medios de participación.",
];

const SEGURIDAD = [
  "Los datos personales proporcionados pueden almacenarse en bases de datos automatizadas o no.",
  "El Titular aplica medidas técnicas, organizativas y de seguridad para proteger la información.",
  "Se adoptan medidas preventivas para minimizar riesgos en los sistemas y documentos del usuario.",
];

const RESPONSABILIDAD = [
  { icon: InformationCircleIcon, texto: "La información del Sitio Web puede contener errores." },
  { icon: PencilSquareIcon,      texto: "El Titular puede modificar contenidos y servicios en cualquier momento." },
  { icon: MagnifyingGlassIcon,   texto: "Se recomienda verificar la información antes de tomar decisiones." },
  { icon: ServerStackIcon,       texto: "No se garantiza un servicio continuo ni libre de fallos o virus." },
  { icon: BoltIcon,              texto: "El Titular no se responsabiliza por interrupciones o daños indirectos." },
];

const COOKIES = [
  {
    titulo: "Dominio del proveedor y/o dirección IP",
    texto: "Recopilamos esta información para entender el origen de las visitas.",
  },
  {
    titulo: "Enlace de origen desde el que se accede al sitio",
    texto: "Nos ayuda a analizar qué canales traen tráfico y optimizar nuestra estrategia.",
  },
  {
    titulo: "Los datos son anónimos y no permiten identificar al usuario",
    texto: "Tu privacidad es nuestra prioridad. Nunca vinculamos esta información con tu identidad.",
  },
];

const ENLACES = [
  { icon: InformationCircleIcon, texto: "Los enlaces a sitios de terceros se proporcionan solo como referencia informativa." },
  { icon: NoSymbolIcon,          texto: "El acceso a enlaces externos no implica recomendación ni relación con sus propietarios." },
  { icon: ExclamationTriangleIcon, texto: "El Titular no asume responsabilidad por resultados o daños derivados del uso de enlaces externos." },
  { icon: UserCircleIcon,        texto: "Al acceder a sitios externos, el usuario debe revisar su propia política de privacidad." },
];

const CONTENIDOS = [
  "La información puede contener errores u omisiones.",
  "No se garantiza que el contenido sea completo o actualizado.",
  "Está prohibido publicar contenidos ilegales, dañinos o que vulneren derechos.",
  "Los contenidos no constituyen ofertas, ventas ni recomendaciones comerciales.",
];

// ── Componente principal ─────────────────────────────────────
export default function AvisoLegal() {
  return (
    <div className="min-h-screen bg-[#f4f6fb] font-sans">

      {/* ── HERO ─────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[#6b7a9f] hover:text-[#123498] text-sm font-semibold mb-6 transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Volver al inicio
            </Link>
            <p className="text-xs font-black uppercase tracking-widest text-[#F46F0B] mb-2">
              Consultora de Asesoría Empresarial JB
            </p>
            <h1 className="text-4xl sm:text-5xl font-black text-[#123498] font-heading uppercase leading-tight">
              Aviso Legal
            </h1>
            <p className="text-[#6b7a9f] text-sm mt-3 font-medium">
              Transparencia y responsabilidad empresarial
            </p>
          </div>
          <div className="shrink-0 w-32 h-32 bg-[#123498] rounded-3xl flex items-center justify-center shadow-lg">
            <ScaleIcon className="w-16 h-16 text-white" strokeWidth={1.5} />
          </div>
        </div>
      </div>

      {/* ── TITULAR ──────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-8">
          <div className="shrink-0 w-28 h-28 rounded-full bg-[#123498] flex items-center justify-center overflow-hidden border-4 border-[#FDB907]">
            <img
                src={FotoInge}
                alt="Logo de Google"
                width={240}
                height={240}
                className="w-full"
              />
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <p><span className="font-bold text-[#1c2a52]">Titular:</span> <span className="text-[#6b7a9f]">Jose Erick Benites Mamani</span></p>
            <p><span className="font-bold text-[#1c2a52]">RUC:</span> <span className="text-[#6b7a9f]">20613509217</span></p>
            <p><span className="font-bold text-[#1c2a52]">Domicilio:</span> <span className="text-[#6b7a9f]">Calle los amancaes 310 Urb Canto Bello, Municipalidad Metropolitana de Lima – Perú</span></p>
            <p>
              <span className="font-bold text-[#1c2a52]">Correo electrónico:</span>{" "}
              <a href="mailto:consultoriayasesoriajb@gmail.com" className="text-[#123498] hover:underline">
                consultoriayasesoriajb@gmail.com
              </a>
            </p>
            <p>
              <span className="font-bold text-[#1c2a52]">Sitio Web:</span>{" "}
              <a href="https://consultoradeasesoriaempresarialjb.com" target="_blank" rel="noopener noreferrer" className="text-[#123498] hover:underline">
                https://consultoradeasesoriaempresarialjb.com
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* ── CONDICIONES DE USO ───────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
        <h2 className="text-2xl font-black text-[#123498] font-heading text-center mb-8">
          Condiciones de Uso
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Columna izquierda */}
          <div className="flex flex-col gap-3">
            {CONDICIONES_IZQUIERDA.map((texto, i) => (
              <div key={i} className="flex items-start gap-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                <span className="shrink-0 w-8 h-8 rounded-lg bg-[#F46F0B] text-white flex items-center justify-center text-xs font-black">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-sm text-[#6b7a9f] leading-relaxed">{texto}</p>
              </div>
            ))}
          </div>
          {/* Columna derecha */}
          <div className="flex flex-col gap-3">
            {CONDICIONES_DERECHA.map((texto, i) => (
              <div key={i} className="flex items-start gap-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                <span className="shrink-0 w-8 h-8 rounded-lg bg-[#F46F0B] text-white flex items-center justify-center text-xs font-black">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-sm text-[#6b7a9f] leading-relaxed">{texto}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MEDIDAS DE SEGURIDAD ─────────────────────────── */}
      <div className="bg-azul py-12 px-4">
        <div className="max-w-5xl mx-auto flex flex-col items-center sm:flex-row gap-8">
          <div className="shrink-0 flex flex-col gap-4">
            <ShieldCheckIcon className="w-16 h-16 text-white/80" strokeWidth={1.5} />
            <ExclamationTriangleIcon className="w-16 h-16 text-[#FDB907]" strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white font-heading mb-2">
              Medidas de seguridad
            </h2>
            <p className="text-white/70 text-sm mb-5">
              El uso del Sitio Web implica la aceptación total del Aviso Legal y la Política de Privacidad.
            </p>
            <ul className="flex flex-col gap-3">
              {SEGURIDAD.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-white/90">
                  <span className="shrink-0 text-[#F46F0B] font-black mt-0.5">▶</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── TRATAMIENTO DE DATOS ─────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row items-start justify-between gap-6">
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-black text-[#123498] font-heading">
              Tratamiento de Datos Personales
            </h2>
            <p className="text-sm text-[#6b7a9f] leading-relaxed max-w-md">
              Puede consultar toda la información relativa al tratamiento de datos personales.
            </p>
            <Link
              to="/politica-privacidad"
              className="self-start bg-[#123498] hover:bg-[#0f2a80] text-white text-xs font-black uppercase tracking-wider px-5 py-2.5 rounded-xl transition-colors"
            >
              Política de Privacidad
            </Link>
          </div>
          <div className="shrink-0">
            <ClipboardDocumentCheckIcon className="w-32 h-32 text-azul" strokeWidth={2} />
          </div>
        </div>
      </div>

      {/* ── LIMITACIÓN DE RESPONSABILIDAD ────────────────── */}
      <div className="bg-azul py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-black text-white font-heading text-center mb-10">
            Limitación de responsabilidad
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
            {RESPONSABILIDAD.map(({ icon: Icon, texto }, i) => (
              <div key={i} className="flex flex-col items-center gap-3 text-center">
                <div className="w-14 h-14 rounded-full bg-[#F46F0B] flex items-center justify-center shrink-0">
                  <Icon className="w-7 h-7 text-white" strokeWidth={1.8} />
                </div>
                <p className="text-xs text-white/80 leading-relaxed">{texto}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── POLÍTICA DE COOKIES ──────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl font-black text-[#123498] font-heading text-center mb-3">
          Política de cookies
        </h2>
        <p className="text-sm text-[#6b7a9f] text-center max-w-2xl mx-auto mb-10 leading-relaxed">
          Este sitio web recopila información anónima de los visitantes con fines estadísticos y de mejora del servicio, sin identificar personalmente al usuario.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {COOKIES.map(({ titulo, texto }, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-2">
              <h3 className="text-sm font-black text-[#123498] leading-snug">{titulo}</h3>
              <p className="text-xs text-[#6b7a9f] leading-relaxed">{texto}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link
            to="/politica-privacidad"
            className="text-sm font-bold text-[#F46F0B] hover:underline"
          >
            Ver política y privacidad completa
          </Link>
        </div>
      </div>

      {/* ── ENLACES A OTROS SITIOS ───────────────────────── */}
      <div className="bg-azul py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-black text-white font-heading text-center mb-3">
            Enlaces a otros sitios Web
          </h2>
          <p className="text-sm text-white/70 text-center max-w-2xl mx-auto mb-10 leading-relaxed">
            El Sitio Web puede incluir enlaces a páginas externas únicamente con fines informativos, sin responsabilidad sobre su contenido o funcionamiento.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ENLACES.map(({ icon: Icon, texto }, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 flex flex-col items-center gap-3 text-center">
                <Icon className="w-8 h-8 text-[#FDB907]" strokeWidth={2} />
                <p className="text-xs text-azul leading-relaxed">{texto}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONTENIDOS DEL SITIO WEB ─────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col sm:flex-row items-start gap-8">
          <div className="shrink-0 hidden sm:block">
            <div className="w-36 h-36 rounded-2xl bg-[#123498]/10 flex items-center justify-center">
                <img
                src={Emprendedor}
                alt="Emprendedor"
                width={240}
                height={240}
                className="w-full"
              />
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-black text-[#123498] font-heading mb-2">
              Contenidos del Sitio Web
            </h2>
            <p className="text-sm text-[#6b7a9f] leading-relaxed mb-5">
              El contenido del Sitio Web es de carácter informativo y se obtiene de fuentes consideradas fiables, aunque no se garantiza que sea exacto o esté actualizado.
            </p>
            <ul className="flex flex-col gap-3">
              {CONTENIDOS.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[#6b7a9f]">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-[#F46F0B]/10 text-[#F46F0B] flex items-center justify-center mt-0.5">
                    <GlobeAltIcon className="w-3 h-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── CONTACTO ─────────────────────────────────────── */}
      <div className="bg-[#123498] py-10 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-black text-white font-heading mb-2">
              Contacto
            </h2>
            <p className="text-sm text-white/70 max-w-md leading-relaxed">
              ¿Tienes alguna duda sobre este Aviso Legal? ¡Escríbenos y te responderemos lo antes posible!
            </p>
          </div>
          <a
            href="https://api.whatsapp.com/send?phone=51912736437&text=Hola%2C%20tengo%20una%20duda%20sobre%20el%20Aviso%20Legal."
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-2 bg-white hover:bg-slate-50 text-[#123498] font-black text-sm px-6 py-3 rounded-xl transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Enviar mensaje ahora
          </a>
        </div>
      </div>


    </div>
  );
}