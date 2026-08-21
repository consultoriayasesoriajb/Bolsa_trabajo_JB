import { Link } from "react-router-dom";

const navLinkClasses =
  "relative inline-block py-1 text-gray-700 font-medium transition-colors hover:text-naranja after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-naranja after:transition-all after:duration-300 hover:after:w-full";

export default function NavDesktop({ isActive }) {
  return (
    <nav className="hidden lg:flex" aria-label="Navegación principal">
      <ul className="flex gap-6 list-none">
        <li>
          <Link
            to="/empresas"
            className={navLinkClasses}
            aria-current={isActive("/empresas") ? "page" : undefined}
          >
            Empresas
          </Link>
        </li>
        <li>
          <Link
            to="/evaluaciones"
            className={navLinkClasses}
            aria-current={isActive("/evaluaciones") ? "page" : undefined}
          >
            Evaluaciones de empresa
          </Link>
        </li>
      </ul>
    </nav>
  );
}
