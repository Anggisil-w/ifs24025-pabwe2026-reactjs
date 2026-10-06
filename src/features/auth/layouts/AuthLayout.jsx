import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { IconCamera, IconSearch, IconShieldCheck } from "@tabler/icons-react";

const perks = [
  [IconSearch, "Catat barang hilang atau temuan dalam hitungan detik"],
  [IconCamera, "Tambahkan foto agar mudah dikenali"],
  [IconShieldCheck, "Pantau status sampai barang kembali ke pemiliknya"],
];

export default function AuthLayout() {
  const token = useSelector((s) => s.auth.token);
  if (token) return <Navigate to="/" replace />;
  return (
    <main className="min-h-screen grid lg:grid-cols-2">
      <section className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-700 p-12 text-teal-50 lg:flex">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 animate-float rounded-full bg-emerald-400/20 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 animate-float rounded-full bg-teal-300/20 blur-3xl [animation-delay:-4s]" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:22px_22px]" />
        <div className="relative flex items-center gap-3 text-lg font-bold"><img src="/logo.svg" alt="" width="40" height="40" className="h-10 w-10 rounded-xl shadow-lg" />Ethe Lost &amp; Found</div>
        <div className="relative">
          <p className="text-5xl font-extrabold leading-tight tracking-tight">Barangmu hilang?<br /><span className="bg-gradient-to-r from-emerald-200 to-teal-100 bg-clip-text text-transparent">Atau kamu menemukannya?</span></p>
          <p className="mt-4 max-w-md text-teal-100">Catat laporan, tambahkan foto, dan pantau sampai barang kembali ke pemiliknya.</p>
          <ul className="mt-8 space-y-3 text-sm">
            {perks.map(([Icon, text]) => (
              <li key={text} className="flex items-center gap-3 text-teal-50/90"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20 backdrop-blur"><Icon size={18} aria-hidden="true" /></span>{text}</li>
            ))}
          </ul>
        </div>
      </section>
      <section className="flex flex-col items-center justify-center gap-6 p-6">
        <div className="flex items-center gap-2 text-lg font-bold text-teal-900 lg:hidden"><img src="/logo.svg" alt="" width="36" height="36" className="h-9 w-9 rounded-xl shadow-md" />Ethe Lost &amp; Found</div>
        <div className="w-full max-w-sm animate-fade-up rounded-3xl border border-slate-200/80 bg-white p-7 shadow-xl shadow-slate-900/5 sm:p-8"><Outlet /></div>
      </section>
    </main>
  );
}
