import { useState } from "react";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";

const FAQ_CANDIDATOS = [
  {
    id: 1,
    pregunta: "¿Tiene algún costo registrarme o postular a las vacantes?",
    respuesta:
      "No, el registro en nuestra plataforma y la postulación a cualquiera de nuestras ofertas laborales es un servicio 100% gratuito para todos los candidatos.",
  },
  {
    id: 2,
    pregunta: "¿Cómo puedo actualizar mi currículum o mis datos?",
    respuesta:
      'Para actualizar tu información, solo debes iniciar sesión en tu cuenta y dirigirte a la sección de "Mi Perfil". Allí podrás editar tus datos personales, tu experiencia laboral y subir una versión más reciente de tu CV.',
  },
  {
    id: 3,
    pregunta: "¿Consultora JB es quien me contratará directamente?",
    respuesta:
      "No. Consultora de Asesoría Empresarial JB actúa únicamente como un intermediario entre tu talento y las empresas. El proceso de selección final y el contrato de trabajo dependen de manera exclusiva de la empresa que ha publicado la vacante.",
  },
  {
    id: 4,
    pregunta: "¿Qué pasa con mis datos personales al momento de postular?",
    respuesta:
      "Tu información es estrictamente confidencial. Solo se compartirá con la empresa a la cual decidas postular, con el único fin de llevar a cabo el proceso de reclutamiento. Para más detalles, puedes revisar nuestra Política de Privacidad.",
  },
  {
    id: 5,
    pregunta: "Olvidé mi contraseña, ¿cómo puedo recuperarla?",
    respuesta:
      'Si no puedes acceder a tu cuenta, ve a la pantalla de Iniciar Sesión y haz clic en el botón de "Olvidé mi contraseña". Te pediremos el correo electrónico con el que te registraste para enviarte un código de seguridad que te permitirá crear una nueva contraseña.',
  },
  {
    id: 6,
    pregunta: "¿Cómo puedo cambiar mi contraseña actual?",
    respuesta:
      'Si tienes acceso a tu cuenta pero deseas cambiar tu clave por seguridad, dirígete al apartado de "Mi Perfil". Allí encontrarás una sección de Seguridad donde podrás modificarla. Para confirmar el cambio, te llegará un código de seguridad al correo que registraste.',
  },
];

const FAQ_EMPRESAS = [
  {
    id: 7,
    pregunta: "Soy una empresa y quiero publicar una oferta, ¿cómo lo hago?",
    respuesta:
      'Para garantizar la calidad de las publicaciones, nuestro equipo se encarga de gestionar y subir las vacantes a la plataforma por ti. Si deseas sumarte a nuestra red, solo debes hacer clic en el botón "Contáctanos" en la parte inferior de la página para coordinar los detalles vía WhatsApp.',
  },
  {
    id: 8,
    pregunta:
      "¿Tendré un panel de administrador para revisar a los postulantes?",
    respuesta:
      "No, las empresas clientes no necesitan administrar un panel. En Consultora JB facilitamos tu proceso de reclutamiento encargándonos de la gestión de la plataforma y filtrando la información para hacerte llegar directamente los perfiles que mejor se adapten a tu búsqueda.",
  },
];

function ItemFAQ({ item, abierto, onToggle }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={abierto}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-slate-50"
      >
        <span
          className={`text-base font-bold leading-snug transition-colors ${
            abierto ? "text-[#123498]" : "text-[#1c2a52]"
          }`}
        >
          {item.pregunta}
        </span>
        <span className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-[#F46F0B]/10 text-[#F46F0B] transition-transform duration-200">
          {abierto ? (
            <MinusIcon className="w-4 h-4" strokeWidth={2.5} />
          ) : (
            <PlusIcon className="w-4 h-4" strokeWidth={2.5} />
          )}
        </span>
      </button>

      {/* Respuesta con animación CSS */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          abierto ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="px-6 pb-5 border-t border-slate-100">
          <p className="text-base text-[#6b7a9f] leading-relaxed pt-4">
            {item.respuesta}
          </p>
        </div>
      </div>
    </div>
  );
}

function GrupoFAQ({ titulo, items, abiertoId, onToggle }) {
  return (
    <div className="flex flex-col gap-3">
      {/* Etiqueta de grupo */}
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-black uppercase tracking-widest text-[#F46F0B] bg-[#F46F0B]/10 px-3 py-1 rounded-full">
          {titulo}
        </span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      {/* Items */}
      {items.map((item) => (
        <ItemFAQ
          key={item.id}
          item={item}
          abierto={abiertoId === item.id}
          onToggle={() => onToggle(item.id)}
        />
      ))}
    </div>
  );
}

export default function PreguntasFrecuentes() {
  const [abiertoId, setAbiertoId] = useState(null);

  const handleToggle = (id) => {
    setAbiertoId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="preguntas-frecuentes" className="bg-slate-50 py-16 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-[#123498] tracking-tight font-heading uppercase">
            Preguntas Frecuentes
          </h2>
          <div className="w-8 h-1 bg-[#F46F0B] mx-auto mt-3 mb-4 rounded-full" />
          <p className="text-base text-[#6b7a9f] font-medium max-w-md mx-auto leading-relaxed">
            Resuelve tus dudas sobre nuestro proceso de selección y plataforma
          </p>
        </div>

        {/* Acordeón */}
        <div className="flex flex-col gap-8">
          <GrupoFAQ
            titulo="Para Candidatos"
            items={FAQ_CANDIDATOS}
            abiertoId={abiertoId}
            onToggle={handleToggle}
          />
          <GrupoFAQ
            titulo="Para Empresas"
            items={FAQ_EMPRESAS}
            abiertoId={abiertoId}
            onToggle={handleToggle}
          />
        </div>
      </div>
    </section>
  );
}