import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncGetUsers } from "../states/action";

export default function UsersPage() {
  const dispatch = useDispatch();
  const list = useSelector((s) => s.users.users);
  useEffect(() => { dispatch(asyncGetUsers()); }, [dispatch]);
  return (
    <section>
      <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">Pengguna</h1>
      <p className="mb-5 mt-0.5 text-sm text-slate-500">Orang-orang yang bergabung di komunitas ini.</p>
      <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        {list.map((u) => <li key={u.id} className="flex items-center gap-3.5 px-4 py-3.5 transition hover:bg-teal-50/50"><span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-700 text-sm font-bold text-white">{(u.name || u.email || "?")[0].toUpperCase()}</span><div className="min-w-0"><p className="truncate font-semibold">{u.name}</p><p className="truncate text-sm text-slate-500">{u.email}</p></div></li>)}
        {!list.length && <li className="px-4 py-8 text-center text-slate-500">Belum ada data pengguna.</li>}
      </ul>
    </section>
  );
}
