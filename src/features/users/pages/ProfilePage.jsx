import { useSelector } from "react-redux";
import { formatDate } from "../../../helpers/toolsHelper";

export default function ProfilePage() {
  const user = useSelector((s) => s.auth.user);
  if (!user) return (<section aria-busy="true"><h1 className="sr-only">Profil saya</h1><p className="animate-pulse text-slate-600">Memuat profil...</p></section>);
  return (
    <section className="max-w-md animate-fade-up overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
      <div aria-hidden="true" className="h-28 bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-500" />
      <div className="px-6 pb-6">
        <div className="-mt-10 mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-700 text-3xl font-bold text-white shadow-lg ring-4 ring-white">{(user.name || user.email || "?")[0].toUpperCase()}</div>
        <h1 className="text-xl font-extrabold tracking-tight">{user.name}</h1>
        <p className="text-slate-600">{user.email}</p>
        <p className="mt-3 inline-block rounded-full bg-teal-50 px-3 py-1 text-sm font-medium text-teal-800">Bergabung {formatDate(user.created_at)}</p>
      </div>
    </section>
  );
}
