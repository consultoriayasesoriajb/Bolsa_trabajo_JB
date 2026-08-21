import { BookmarkIcon, UserIcon, HeartIcon } from "@heroicons/react/24/outline";

export const NAV_ITEMS = [
  {
    id: "information",
    path: "/mi-perfil",
    label: "Mi Perfil",
    icon: UserIcon,
    end: true,
  },
  {
    id: "applications",
    path: "/mi-perfil/postulaciones",
    label: "Mis Postulaciones",
    icon: BookmarkIcon,
  },
  {
    id: "favorites",
    path: "/mi-perfil/favoritos",
    label: "Mis Favoritos",
    icon: HeartIcon,
  }
];