import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Briefcase,
  Users,
  Star,
  LogOut,
  ChevronRight,
  BookOpen,
  Home,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/empresas", label: "Empresas", icon: Building2 },
  { to: "/admin/ofertas", label: "Ofertas", icon: Briefcase },
  { to: "/admin/postulantes", label: "Postulantes", icon: Users },
  { to: "/admin/evaluaciones", label: "Evaluaciones", icon: Star },
  { to: "/admin/reclamaciones", label: "Reclamaciones", icon: BookOpen },
];

export default function SidebarAdmin({ onCloseMobile }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user.nombre_completo || "Administrador";
  const userRole = user.rol_nombre || "Administrador";
  const initials = userName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <aside className="relative left-0 top-0 h-full w-62 bg-white border-r border-slate-200/80 flex flex-col z-30">
      {/* Logo */}
      <Link
        to="/"
        className="flex flex-col justify-center px-6 h-20 border-b border-slate-100"
      >
        <span className="font-black text-[#123498] text-[16px] tracking-wide font-heading uppercase">
          Bolsa Trabajo <span className="text-[#F46F0B]">JB</span>
        </span>
        <span className="text-[8px] font-bold text-slate-400 tracking-[0.2em] mt-0.5 uppercase">
          Sistema Corporativo
        </span>
      </Link>

      {/* Navegación */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onCloseMobile}
            className={({ isActive }) =>
              `flex items-center justify-between gap-2.5 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                isActive
                  ? "bg-[#123498] text-white shadow-md shadow-[#123498]/10"
                  : "text-slate-500 hover:bg-[#123498]/5 hover:text-[#123498]"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className="flex items-center gap-3">
                  <Icon size={16} strokeWidth={2.4} />
                  {label}
                </span>
                {isActive && <ChevronRight size={14} strokeWidth={2.8} />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Acciones Inferiores */}
      <div className="px-4 pb-4 flex flex-col gap-2">
        <Link
          to="/"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all text-slate-500 hover:bg-[#123498]/5 hover:text-[#123498]"
        >
          <Home size={16} strokeWidth={2.4} />
          Volver al Home
        </Link>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/");
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100/40 font-black text-xs uppercase tracking-wider transition-colors"
        >
          <LogOut size={14} strokeWidth={2.5} />
          Cerrar sesión
        </button>
      </div>

      {/* Usuario */}
      <div className="px-4 pb-5 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-3 p-3 bg-white border border-slate-200/80 rounded-xl shadow-2xs">
          <div className="w-9 h-9 rounded-full bg-[#123498]/15 text-[#123498] flex items-center justify-center text-xs font-black shrink-0 border border-[#123498]/10">
            {initials}
          </div>
          <div className="leading-tight min-w-0">
            <p className="text-xs font-extrabold text-[#1A1A1A] truncate">
              {userName}
            </p>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              {userRole}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
