import FooterBrand from "./footer/FooterBrand";
import FooterLinks from "./footer/FooterLinks";
import FooterContact from "./footer/FooterContact";
import { Link } from "react-router-dom";

const ACCESOS = [
  { label: "Inicio", href: "#hero" },
  { label: "Buscar Empleo", href: "/buscar-empleo" },
  { label: "Empresas", href: "/empresas" },
];

const INFORMACION = [
  { label: "¿Cómo funciona?", href: "#como-funciona" },
  { label: "¿Quiénes somos?", href: "#quienes-somos" },
  { label: "Preguntas Frecuentes", href: "#preguntas-frecuentes" },
  { label: "Publica tus vacantes", href: "https://api.whatsapp.com/send?phone=51912736437&text=Hola%2C%20me%20gustar%C3%ADa%20publicar%20vacantes%20con%20Consultora%20JB." },
  { label: "Ir a Consultora JB", href: "https://consultoradeasesoriaempresarialjb.com/" }
];

export default function Footer() {
  return (
    <footer className="bg-[#1E1E1E] text-white pt-16 pb-8 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 
          Estructura de grilla arreglada:
          - grid-cols-1: Móviles (1 columna)
          - md:grid-cols-2: Tablets (2 columnas, grilla simétrica de 2x2)
          - lg:grid-cols-4: Pantallas grandes (4 columnas en línea)
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8 mb-16">
          <FooterBrand />
          <FooterLinks title="Accesos Rápidos" links={ACCESOS} />
          <FooterLinks title="Información" links={INFORMACION} />
          <FooterContact />
        </div>

        <div className="border-t border-neutral-800 pt-8 mt-8 flex flex-col items-center justify-between gap-4 lg:flex-row text-center lg:text-left">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-[#FDB907]">
            <Link to="/terminos-condiciones" className="hover:underline">Términos y condiciones</Link>
            <span className="text-neutral-700">|</span>
            <Link to="/politica-privacidad" className="hover:underline">Política y privacidad</Link>
            <span className="text-neutral-700">|</span>
            <Link to="/aviso-legal" className="hover:underline">Aviso Legal</Link>
            <span className="text-neutral-700">|</span>
            <Link to="/libro-reclamaciones" className="hover:underline">Libro de Reclamaciones</Link>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">
            &copy; 2026 Consultora de Asesoría Empresarial JB. Todos los derechos reservados.
          </p>
        </div>

      </div>
    </footer>
  );
}