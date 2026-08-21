import { Link } from "react-router-dom";
import {
  UserIcon,
  DocumentTextIcon,
  HeartIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

export default function UserMenuDesktop({ user, isProfileMenuOpen, setIsProfileMenuOpen, profileMenuRef, handleLogout }) {
  if (!user) return null;

  return (
    <div className="relative" ref={profileMenuRef}>
      <button
        type="button"
        id="profile-menu-button"
        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
        aria-expanded={isProfileMenuOpen}
        aria-haspopup="true"
        aria-controls="profile-menu-panel"
        className="flex items-center gap-2 pl-1 pr-3 py-1 bg-slate-50 border border-gray-200 rounded-full text-gray-700 hover:border-naranja hover:text-naranja transition-colors font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-naranja"
      >
        <span className="bg-naranja text-white rounded-full w-8 h-8 flex items-center justify-center font-bold uppercase shadow-sm" aria-hidden="true">
          {user.nombre_completo.charAt(0)}
        </span>
        <span className="truncate max-w-30 text-sm">
          {user.nombre_completo.split(" ")[0]}
        </span>
        <ChevronDownIcon className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isProfileMenuOpen ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>

      {isProfileMenuOpen && (
        <div
          id="profile-menu-panel"
          aria-labelledby="profile-menu-button"
          className="absolute right-0 mt-3 w-56 z-10 bg-white border border-gray-200 shadow-md rounded-lg p-1 space-y-1"
        >
          <nav aria-label="Menú de cuenta">
            <ul className="list-none space-y-1">
              {[
                { to: "/mi-perfil", icon: UserIcon, label: "Mi perfil" },
                { to: "/mi-perfil/postulaciones", icon: DocumentTextIcon, label: "Mis postulaciones" },
                { to: "/mi-perfil/favoritos", icon: HeartIcon, label: "Mis favoritos" },
              ].map(({ to, icon: Icon, label }) => (
                <li key={to}>
                  <Link to={to} className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-100">
                    <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-t border-gray-100 my-1" role="separator" />

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-red-600 hover:bg-red-50"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5 shrink-0" aria-hidden="true" />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}