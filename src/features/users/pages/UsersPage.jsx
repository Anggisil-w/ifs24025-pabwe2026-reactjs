import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncGetUsers } from "../states/action";

export default function UsersPage() {
  const dispatch = useDispatch();
  const list = useSelector((s) => s.users.users);
  useEffect(() => { dispatch(asyncGetUsers()); }, [dispatch]);
  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold">Pengguna</h1>
      <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
        {list.map((u) => <li key={u.id} className="px-4 py-3"><p className="font-semibold">{u.name}</p><p className="text-sm text-slate-500">{u.email}</p></li>)}
        {!list.length && <li className="px-4 py-6 text-slate-500">Belum ada data pengguna.</li>}
      </ul>
    </section>
  );
}
