import { Search, Bell, Menu, User } from "lucide-react";
import { useNotifications } from "../../hooks/useNotifications";
import NotificationDropdown from "./NotificationDropdown";

export default function TopbarAdmin({ onToggleSidebar }) {
    const {
        noLeidasCount,
        isOpen,
        notificaciones,
        loading,
        toggle,
        close,
        marcarLeida,
        marcarTodasLeidas,
    } = useNotifications();

    return (
        <header className="h-20 bg-white border-b border-slate-200/80 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20">
            {/* Left side: Menu toggle & Corporate Title */}
            <div className="flex items-center gap-4">
                <button onClick={onToggleSidebar} className="p-1 rounded-lg text-slate-400 hover:text-[#123498] hover:bg-slate-50 transition-colors lg:hidden">
                    <Menu size={20} />
                </button>
                <div className="flex items-center gap-3">
                    <span className="font-heading font-black text-[#123498] text-[15px] tracking-wider uppercase truncate">
                        Control de Reclutamiento
                    </span>
                </div>
            </div>

            {/* Middle: Clean styled search bar */}
            <div className="relative w-full max-w-xs hidden md:block">
                <Search
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                    type="text"
                    placeholder="Buscar postulante, vacante..."
                    className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200/80 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#123498]/10 focus:border-[#123498] transition-all placeholder:text-slate-400"
                />
            </div>

            {/* Right side: Badge, Notification, Profile */}
            <div className="flex items-center gap-5">
                {/* Admin Badge */}
                <span className="px-3.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-full text-[#F46F0B] bg-[#F46F0B]/5 border border-[#F46F0B]/20">
                    Administrador
                </span>

                {/* Notifications Bell */}
                <div className="relative">
                    <button
                        onClick={toggle}
                        className="relative w-9 h-9 flex items-center justify-center rounded-xl border border-slate-100 hover:bg-slate-50 transition-all"
                        aria-label="Notificaciones"
                    >
                        <Bell size={16} className="text-slate-500" />
                        {noLeidasCount > 0 && (
                            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-[#F46F0B] text-white text-[10px] font-bold px-1">
                                {noLeidasCount > 99 ? "99+" : noLeidasCount}
                            </span>
                        )}
                    </button>
                    <NotificationDropdown
                        isOpen={isOpen}
                        notificaciones={notificaciones}
                        loading={loading}
                        onClose={close}
                        onMarcarLeida={marcarLeida}
                        onMarcarTodasLeidas={marcarTodasLeidas}
                        noLeidasCount={noLeidasCount}
                    />
                </div>

                {/* User avatar */}
                <div className="flex items-center gap-3 pl-1.5 border-l border-slate-100">
                    <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 shadow-3xs shrink-0">
                        <User size={15} strokeWidth={2.5} />
                    </div>
                </div>
            </div>
        </header>
    );
}