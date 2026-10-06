// Kelas Tailwind yang dipakai bersama agar tampilan konsisten di seluruh aplikasi.
const btn = "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-60";

export const inputCls = "mt-1.5 block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 hover:border-slate-300 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15";
export const btnPrimary = `${btn} bg-gradient-to-r from-teal-700 to-emerald-700 text-white shadow-lg shadow-teal-700/25 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-teal-700/30 focus-visible:ring-teal-500/30 disabled:translate-y-0 disabled:shadow-none`;
export const btnGhost = `${btn} border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50 focus-visible:ring-slate-200`;
export const btnDanger = `${btn} bg-rose-700 text-white shadow-lg shadow-rose-700/20 hover:-translate-y-0.5 hover:bg-rose-800 focus-visible:ring-rose-500/30`;
export const card = "rounded-2xl border border-slate-200/80 bg-white shadow-sm";
