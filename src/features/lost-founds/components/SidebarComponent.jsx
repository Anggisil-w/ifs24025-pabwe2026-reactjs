import { memo } from "react";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { IconClipboardList, IconUserCircle, IconUsers } from "@tabler/icons-react";

const items = [["/", "Laporan", IconClipboardList], ["/users", "Pengguna", IconUsers], ["/profile", "Profil saya", IconUserCircle]];

function SidebarComponent() {
  return (
    <nav aria-label="Menu utama" className="flex gap-1.5 overflow-x-auto border-b border-slate-200/70 bg-white/70 p-2 backdrop-blur md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:w-60 md:shrink-0 md:flex-col md:gap-1 md:self-start md:border-b-0 md:border-r md:p-4">
      {items.map(([to, label, Icon]) => (
        <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => clsx("flex items-center gap-2.5 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-sm font-medium transition duration-200", isActive ? "bg-gradient-to-r from-teal-700 to-emerald-700 text-white shadow-md shadow-teal-700/25" : "text-slate-600 hover:bg-teal-50 hover:text-teal-800")}><Icon size={18} aria-hidden="true" />{label}</NavLink>
      ))}
    </nav>
  );
}

export default memo(SidebarComponent);
