import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import clsx from "clsx";
import useInput from "../../../hooks/useInput";
import { asyncGetLostFounds } from "../states/action";
import { coverUrl, formatDate } from "../../../helpers/toolsHelper";
import AddModal from "../modals/AddModal";

export const StatusBadge = ({ status }) => (
  <span className={clsx("rounded-full px-2 py-0.5 text-xs font-semibold", status === "lost" ? "bg-rose-100 text-rose-700" : "bg-teal-100 text-teal-800")}>{status === "lost" ? "Hilang" : "Ditemukan"}</span>
);

const sel = "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm";

export default function HomePage() {
  const dispatch = useDispatch();
  const { lostFounds: list, isLostFound: loading } = useSelector((s) => s.lostFounds);
  const [status, setStatus] = useInput("");
  const [done, setDone] = useInput("");
  const [q, setQ] = useInput("");
  const [mine, setMine] = useState(false);
  const [adding, setAdding] = useState(false);

  const load = () => dispatch(asyncGetLostFounds({ status, is_completed: done, is_me: mine ? 1 : undefined }));
  useEffect(() => { load(); }, [status, done, mine]); // eslint-disable-line react-hooks/exhaustive-deps

  const shown = list.filter((i) => `${i.title} ${i.description}`.toLowerCase().includes(q.toLowerCase()));
  const stats = [["Total", list.length], ["Hilang", list.filter((i) => i.status === "lost").length], ["Ditemukan", list.filter((i) => i.status === "found").length], ["Selesai", list.filter((i) => i.is_completed === 1).length]];

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Laporan</h1>
        <button onClick={() => setAdding(true)} className="flex items-center gap-1 rounded-lg bg-teal-700 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-800"><IconPlus size={16} />Tambah laporan</button>
      </div>
      <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map(([k, v]) => <div key={k} className="rounded-xl border border-slate-200 bg-white p-3"><dt className="text-sm text-slate-500">{k}</dt><dd className="text-2xl font-bold">{v}</dd></div>)}
      </dl>
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative"><IconSearch size={16} className="absolute left-3 top-3 text-slate-400" /><input value={q} onChange={setQ} placeholder="Cari judul atau deskripsi" className={clsx(sel, "pl-9")} /></div>
        <select value={status} onChange={setStatus} className={sel}><option value="">Semua jenis</option><option value="lost">Hilang</option><option value="found">Ditemukan</option></select>
        <select value={done} onChange={setDone} className={sel}><option value="">Semua status</option><option value="0">Dalam proses</option><option value="1">Selesai</option></select>
        <label className="flex items-center gap-1 text-sm"><input type="checkbox" checked={mine} onChange={(e) => setMine(e.target.checked)} />Laporan saya</label>
      </div>
      {loading && <p className="text-slate-500">Memuat...</p>}
      {!loading && !shown.length && <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">Belum ada laporan. Tambahkan laporan pertama dengan tombol di kanan atas.</p>}
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {shown.map((i) => (
          <li key={i.id}>
            <Link to={`/lost-founds/${i.id}`} className="block overflow-hidden rounded-xl border border-slate-200 bg-white hover:border-teal-600">
              {coverUrl(i.cover) ? <img src={coverUrl(i.cover)} alt="" className="h-40 w-full object-cover" /> : <div className="flex h-40 items-center justify-center bg-slate-100 text-slate-400">Belum ada foto</div>}
              <div className="space-y-1 p-3">
                <div className="flex items-center gap-2"><StatusBadge status={i.status} />{i.is_completed === 1 && <span className="text-xs text-slate-500">Selesai</span>}</div>
                <h2 className="font-semibold">{i.title}</h2>
                <p className="line-clamp-2 text-sm text-slate-600">{i.description}</p>
                <p className="text-xs text-slate-400">{i.author?.name} · {formatDate(i.created_at)}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      {adding && <AddModal onClose={() => setAdding(false)} onDone={load} />}
    </section>
  );
}
