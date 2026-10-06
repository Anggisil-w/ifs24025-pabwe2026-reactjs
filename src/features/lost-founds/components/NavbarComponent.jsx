import { memo } from "react";
import { IconLogout } from "@tabler/icons-react";
import { btnGhost } from "../../../helpers/uiClasses";

function NavbarComponent({ name, onLogout }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200/70 bg-white/80 px-4 backdrop-blur-lg md:px-6">
      <div className="flex items-center gap-2.5 font-bold tracking-tight text-slate-900"><img src="/logo.svg" alt="" width="32" height="32" className="h-8 w-8 rounded-lg shadow-sm" />Lost &amp; Found</div>
      <div className="flex items-center gap-3 text-sm">
        {name && <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-700 text-xs font-bold text-white sm:hidden" aria-hidden="true">{name[0].toUpperCase()}</span>}
        <span className="hidden font-medium text-slate-700 sm:inline">{name}</span>
        <button onClick={onLogout} className={`${btnGhost} !px-3 !py-1.5`}><IconLogout size={16} aria-hidden="true" />Keluar</button>
      </div>
    </header>
  );
}

export default memo(NavbarComponent);
