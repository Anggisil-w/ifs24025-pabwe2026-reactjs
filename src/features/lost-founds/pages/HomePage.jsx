import { memo, useDeferredValue, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IconAlertCircle, IconCircleCheck, IconInbox, IconListDetails, IconPackage, IconPhotoOff, IconPlus, IconSearch } from "@tabler/icons-react";
import clsx from "clsx";
import PropTypes from "prop-types";
import useInput from "../../../hooks/useInput";
import { asyncGetLostFounds } from "../states/action";
import { coverUrl, formatDate } from "../../../helpers/toolsHelper";
import AddModal from "../modals/AddModal";
import { btnPrimary } from "../../../helpers/uiClasses";

export const StatusBadge = ({ status }) => (
  <span className={clsx("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset", status === "lost" ? "bg-rose-50 text-rose-700 ring-rose-200" : "bg-teal-50 text-teal-800 ring-teal-200")}><span aria-hidden="true" className={clsx("h-1.5 w-1.5 rounded-full", status === "lost" ? "bg-rose-500" : "bg-teal-500")} />{status === "lost" ? "Hilang" : "Ditemukan"}</span>
);

const sel = "rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm shadow-sm transition hover:border-slate-300 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15";
const tones = { teal: "bg-teal-50 text-teal-700", rose: "bg-rose-50 text-rose-700", emerald: "bg-emerald-50 text-emerald-700", slate: "bg-slate-100 text-slate-600" };

StatusBadge.propTypes = { status: PropTypes.string.isRequired };

// Kartu dipisah & di-memo agar re-render akibat state lain (mis. profil) tidak menggambar ulang seluruh daftar.
const ReportCard = memo(function ReportCard({ item: i }) {
  const [broken, setBroken] = useState(false);
  const cover = broken ? null : coverUrl(i.cover);
  return (
    <li className="animate-fade-up">
      <Link to={`/lost-founds/${i.id}`} className="group block h-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-teal-300 hover:shadow-xl hover:shadow-teal-900/10">
        {cover ? <div className="overflow-hidden"><img src={cover} alt={`Foto ${i.title}`} width="400" height="160" loading="lazy" decoding="async" onError={() => setBroken(true)} className="h-44 w-full object-cover transition duration-500 group-hover:scale-105" /></div> : <div className="flex h-44 flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-slate-100 to-teal-50 text-slate-600"><IconPhotoOff size={28} aria-hidden="true" className="text-slate-400" />Belum ada foto</div>}
        <div className="space-y-2 p-4">
          <div className="flex items-center gap-2"><StatusBadge status={i.status} />{i.is_completed === 1 && <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700"><IconCircleCheck size={14} aria-hidden="true" />Selesai</span>}</div>
          <h2 className="font-bold leading-snug text-slate-900 transition group-hover:text-teal-800">{i.title}</h2>
          <p className="line-clamp-2 text-sm text-slate-600">{i.description}</p>
          <p className="border-t border-slate-100 pt-2 text-xs text-slate-600">{i.author?.name} · {formatDate(i.created_at)}</p>
        </div>
      </Link>
    </li>
  );
});

ReportCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    status: PropTypes.string,
    is_completed: PropTypes.number,
    cover: PropTypes.string,
    created_at: PropTypes.string,
    author: PropTypes.shape({ name: PropTypes.string }),
  }).isRequired,
};

function HomePage() {
  const dispatch = useDispatch();
  const { lostFounds: rawList, isLostFound: loading } = useSelector((s) => s.lostFounds);
  // Render daftar dipecah (time-sliced) agar tidak ada long task yang memblokir main thread.
  const list = useDeferredValue(rawList);
  const [status, setStatus] = useInput("");
  const [done, setDone] = useInput("");
  const [q, setQ] = useInput("");
  const [mine, setMine] = useState(false);
  const [adding, setAdding] = useState(false);

  const load = () => dispatch(asyncGetLostFounds({ status, is_completed: done, is_me: mine ? 1 : undefined }));
  useEffect(() => { load(); }, [status, done, mine]); // eslint-disable-line react-hooks/exhaustive-deps

  const shown = useMemo(() => {
    const needle = q.toLowerCase();
    return list.filter((i) => `${i.title} ${i.description}`.toLowerCase().includes(needle));
  }, [list, q]);
  const stats = useMemo(() => [["Total", list.length, IconListDetails, "slate"], ["Hilang", list.filter((i) => i.status === "lost").length, IconAlertCircle, "rose"], ["Ditemukan", list.filter((i) => i.status === "found").length, IconPackage, "teal"], ["Selesai", list.filter((i) => i.is_completed === 1).length, IconCircleCheck, "emerald"]], [list]);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">Laporan</h1>
          <p className="mt-0.5 text-sm text-slate-500">Pantau semua barang hilang dan temuan di satu tempat.</p>
        </div>
        <button onClick={() => setAdding(true)} className={btnPrimary}><IconPlus size={16} aria-hidden="true" />Tambah laporan</button>
      </div>
      <dl className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {stats.map(([k, v, Icon, tone]) => <div key={k} className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:shadow-md"><span className={clsx("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", tones[tone])}><Icon size={22} aria-hidden="true" /></span><div><dt className="text-sm text-slate-500">{k}</dt><dd className="text-2xl font-extrabold leading-tight">{v}</dd></div></div>)}
      </dl>
      <div className="flex flex-wrap items-center gap-2.5 rounded-2xl border border-slate-200/80 bg-white/70 p-3 shadow-sm backdrop-blur">
        <div className="relative w-full sm:w-auto sm:min-w-64"><IconSearch size={16} aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" /><input id="search-input" type="search" autoComplete="off" aria-label="Cari judul atau deskripsi" value={q} onChange={setQ} placeholder="Cari judul atau deskripsi" className={clsx(sel, "w-full pl-10 placeholder:text-slate-500")} /></div>
        <select id="filter-jenis" aria-label="Filter jenis laporan" value={status} onChange={setStatus} className={sel}><option value="">Semua jenis</option><option value="lost">Hilang</option><option value="found">Ditemukan</option></select>
        <select id="filter-status" aria-label="Filter status laporan" value={done} onChange={setDone} className={sel}><option value="">Semua status</option><option value="0">Dalam proses</option><option value="1">Selesai</option></select>
        <label className="flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-medium text-slate-700"><input id="filter-mine" name="mine" type="checkbox" className="h-4 w-4 accent-teal-700" checked={mine} onChange={(e) => setMine(e.target.checked)} />Laporan saya</label>
      </div>
      {loading && <p className="animate-pulse text-slate-500">Memuat...</p>}
      {!loading && !shown.length && <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white/60 p-10 text-center"><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700"><IconInbox size={28} aria-hidden="true" /></span><p className="max-w-sm text-slate-500">Belum ada laporan. Tambahkan laporan pertama dengan tombol di kanan atas.</p></div>}
      <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {shown.map((i) => <ReportCard key={i.id} item={i} />)}
      </ul>
      {adding && <AddModal onClose={() => setAdding(false)} onDone={load} />}
    </section>
  );
}

export default memo(HomePage);