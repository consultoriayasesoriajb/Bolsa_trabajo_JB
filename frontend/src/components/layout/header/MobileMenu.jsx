import { Link } from "react-router-dom";
import logoCompleto from "../../../assets/images/logo_completo.webp";
import { HomeIcon, MagnifyingGlassIcon, BuildingOfficeIcon, UserIcon,
  DocumentTextIcon, HeartIcon, ArrowRightOnRectangleIcon,
  ArrowLeftEndOnRectangleIcon, PlusCircleIcon,
  InformationCircleIcon, XMarkIcon, ChevronRightIcon,
} from "@heroicons/react/24/outline";

const cardLinkClasses =
  "flex items-center gap-3 px-4 py-3.5 text-[15px] font-medium text-gray-800 active:bg-gray-50 transition-colors";

function MobileLinkItem({ to, icon: Icon, label, iconBg = "bg-blue-50", iconColor = "text-azul", onClick }) {
  return (
    <li>
      <Link to={to} className={cardLinkClasses} onClick={onClick}>
        <div className={`${iconBg} p-2 rounded-lg ${iconColor} shrink-0`} aria-hidden="true">
          <Icon className="w-5 h-5" />
        </div>
        <span className="flex-1">{label}</span>
        <ChevronRightIcon className="w-4 h-4 text-gray-300 shrink-0" aria-hidden="true" />
      </Link>
    </li>
  );
}

export default function MobileMenu({ isOpen, onClose, user, isActive, handleLogout }) {

  return (
    <div
      className={`fixed inset-0 z-100 bg-white transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menú principal"
      hidden={!isOpen}
    >
      <div className="flex flex-col h-full">

        {/* Header del menú móvil */}
        <div className="flex justify-between items-center h-20 px-4 sm:px-6 bg-white border-b border-gray-100 shadow-sm shrink-0">
          <img className="h-10 w-auto object-contain" src={logoCompleto} width={1052} height={237}alt="Logo de Consultora JB" />
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-naranja p-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-naranja"
            aria-label="Cerrar menú"
          >
            <XMarkIcon className="w-7 h-7" />
          </button>
        </div>

        {/* Contenido scrollable */}
        <div className="flex flex-col flex-1 overflow-y-auto bg-white px-4 sm:px-6 py-6 gap-6">

          {/* Iniciar sesión (solo visitantes) */}
          {!user && (
            <section aria-labelledby="mobile-login-heading">
              <h2 id="mobile-login-heading" className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
                Cuenta
              </h2>
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <ul className="list-none">
                  <MobileLinkItem to="/login" icon={ArrowLeftEndOnRectangleIcon} label="Iniciar sesión" onClick={onClose} />
                </ul>
              </div>
            </section>
          )}

          {/* Navegación principal */}
          <section aria-labelledby="mobile-nav-heading">
            <h2 id="mobile-nav-heading" className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
              Navegación
            </h2>
            <nav aria-label="Navegación principal (móvil)">
              <ul className="list-none bg-white rounded-2xl shadow-sm divide-y divide-gray-100 overflow-hidden">
                <MobileLinkItem to="/" icon={HomeIcon} label="Inicio" onClick={onClose} />
                <MobileLinkItem to="/buscar-empleo" icon={MagnifyingGlassIcon} label="Buscar empleo" onClick={onClose} />
                <MobileLinkItem to="/empresas" icon={BuildingOfficeIcon} label="Listado de Empresas" onClick={onClose} />
              </ul>
            </nav>
          </section>

          {/* Mi cuenta (solo usuarios logueados) */}
          {user && (
            <>
              <section aria-labelledby="mobile-account-heading">
                <h2 id="mobile-account-heading" className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
                  Mi Cuenta
                </h2>
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  {/* Resumen de perfil */}
                  <div className="flex items-center gap-4 p-4 border-b border-gray-100">
                    <span className="bg-naranja text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl uppercase shadow-sm shrink-0" aria-hidden="true">
                      {user.nombre_completo.charAt(0)}
                    </span>
                    <div className="flex-1 overflow-hidden">
                      <p className="font-bold text-gray-800 truncate">{user.nombre_completo}</p>
                      <p className="text-sm text-gray-500 truncate">{user.correo}</p>
                    </div>
                  </div>

                  <nav aria-label="Gestión de cuenta">
                    <ul className="list-none divide-y divide-gray-100">
                      <MobileLinkItem to="/mi-perfil" icon={UserIcon} label="Mi perfil" onClick={onClose} />
                      <MobileLinkItem to="/mi-perfil/postulaciones" icon={DocumentTextIcon} label="Mis postulaciones" onClick={onClose} />
                      <MobileLinkItem to="/mi-perfil/favoritos" icon={HeartIcon} label="Mis favoritos" onClick={onClose} />
                      <li className="border-t border-gray-100">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-3.5 text-[15px] font-medium text-red-600 active:bg-red-50 transition-colors"
                        >
                          <div className="bg-red-50 p-2 rounded-lg text-red-500 shrink-0" aria-hidden="true">
                            <ArrowRightOnRectangleIcon className="w-5 h-5" />
                          </div>
                          <span className="flex-1 text-left">Cerrar sesión</span>
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </section>

              {/* Para empresas — Solo admin */}
              {user?.rol_nombre === "admin" && (
                <section aria-labelledby="mobile-business-heading">
                  <h2 id="mobile-business-heading" className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
                    Para empresas
                  </h2>
                  <nav aria-label="Opciones para empresas">
                    <ul className="list-none bg-white rounded-2xl shadow-sm divide-y divide-gray-100 overflow-hidden">
                      <MobileLinkItem to="/admin/ofertas" icon={PlusCircleIcon} label="Publicar empleo" iconBg="bg-orange-50" iconColor="text-naranja" onClick={onClose} />
                      <MobileLinkItem to="/empresas/solicitar-informacion" icon={InformationCircleIcon} label="Solicitar información" iconBg="bg-orange-50" iconColor="text-naranja" onClick={onClose} />
                    </ul>
                  </nav>
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}