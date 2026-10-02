import { useSelector } from "react-redux";
import { formatDate } from "../../../helpers/toolsHelper";

export default function ProfilePage() {
  const user = useSelector((s) => s.auth.user);
  if (!user) return (<section aria-busy="true"><h1 className="sr-only">Profil saya</h1><p className="text-slate-600">Memuat profil...</p></section>);
  return (
    <section className="max-w-md rounded-xl border border-slate-200 bg-white p-6">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-700 text-2xl font-bold text-white">{(user.name || user.email || "?")[0].toUpperCase()}</div>
      <h1 className="text-xl font-bold">{user.name}</h1>
      <p className="text-slate-600">{user.email}</p>
      <p className="mt-2 text-sm text-slate-500">Bergabung {formatDate(user.created_at)}</p>
    </section>
  );
}