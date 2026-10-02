import { memo } from "react";
import { NavLink } from "react-router-dom";
import clsx from "clsx";

const items = [["/", "Laporan"], ["/users", "Pengguna"], ["/profile", "Profil saya"]];

function SidebarComponent() {
  return (
    <nav aria-label="Menu utama" className="flex gap-1 overflow-x-auto border-b border-slate-200 bg-white p-2 md:w-48 md:flex-col md:border-b-0 md:border-r">
      {items.map(([to, label]) => (
        <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => clsx("whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium", isActive ? "bg-teal-700 text-white" : "text-slate-700 hover:bg-slate-100")}>{label}</NavLink>
      ))}
    </nav>
  );
}

export default memo(SidebarComponent);