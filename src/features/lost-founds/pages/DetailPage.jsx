import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { asyncGetLostFound, asyncDeleteLostFound } from "../states/action";
import { coverUrl, formatDate } from "../../../helpers/toolsHelper";
import { IconCircleCheck, IconClock, IconPencil, IconPhoto, IconPhotoOff, IconTrash } from "@tabler/icons-react";
import { StatusBadge } from "./HomePage";
import { btnDanger, btnGhost } from "../../../helpers/uiClasses";
import ChangeModal from "../modals/ChangeModal";
import ChangeCoverModal from "../modals/ChangeCoverModal";

export default function DetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const item = useSelector((s) => s.lostFounds.lostFound);
  const me = useSelector((s) => s.auth.user);
  const [modal, setModal] = useState(null);
  const [failedId, setFailedId] = useState(null);
  const [brokenId, setBrokenId] = useState(null);
  const failed = failedId === id;
  const load = async () => { const ok = await Promise.resolve(dispatch(asyncGetLostFound(id))); setFailedId(ok ? null : id); };
  useEffect(() => {
    let alive = true;
    dispatch(asyncGetLostFound(id)).then((ok) => { if (alive) setFailedId(ok ? null : id); });
    return () => { alive = false; };
  }, [id, dispatch]);

  if (failed) return (<section className="max-w-2xl space-y-3 rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-sm sm:text-left"><h1 className="text-2xl font-extrabold tracking-tight">Laporan tidak ditemukan</h1><p className="text-slate-600">Laporan ini tidak ada atau tidak bisa dimuat.</p><Link to="/" className="inline-block text-sm font-semibold text-teal-700 hover:underline">← Kembali ke daftar</Link></section>);
  if (!item) return (<section aria-busy="true"><h1 className="sr-only">Detail laporan</h1><p className="animate-pulse text-slate-600">Memuat laporan...</p></section>);
  const owner = me && me.id === item.user_id;
  const remove = async () => { if (await Promise.resolve(dispatch(asyncDeleteLostFound(item.id)))) navigate("/"); };

  return (
    <article className="max-w-3xl animate-fade-up space-y-5">
      <Link to="/" className="inline-block text-sm font-semibold text-teal-700 transition hover:text-teal-900 hover:underline">← Kembali ke daftar</Link>
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
        {coverUrl(item.cover) && brokenId !== item.id ? <img src={coverUrl(item.cover)} alt={item.title} width="800" height="384" decoding="async" fetchPriority="high" onError={() => setBrokenId(item.id)} className="h-64 w-full bg-slate-100 object-contain sm:h-96" /> : <div className="flex h-48 flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-100 to-teal-50 text-slate-600"><IconPhotoOff size={32} aria-hidden="true" className="text-slate-400" />Belum ada foto</div>}
        <div className="space-y-4 p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2.5"><StatusBadge status={item.status} /><span className={`inline-flex items-center gap-1.5 text-sm font-medium ${item.is_completed === 1 ? "text-emerald-700" : "text-amber-700"}`}>{item.is_completed === 1 ? <IconCircleCheck size={16} aria-hidden="true" /> : <IconClock size={16} aria-hidden="true" />}{item.is_completed === 1 ? "Selesai" : "Dalam proses"}</span></div>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight">{item.title}</h1>
          <p className="whitespace-pre-line leading-relaxed text-slate-700">{item.description}</p>
          <p className="border-t border-slate-100 pt-4 text-sm text-slate-500">Dilaporkan oleh <span className="font-semibold text-slate-700">{item.author?.name}</span> pada {formatDate(item.created_at)}</p>
          {owner && (
            <div className="flex flex-wrap gap-2 pt-1">
              <button onClick={() => setModal("cover")} className={btnGhost}><IconPhoto size={16} aria-hidden="true" />Ganti cover</button>
              <button onClick={() => setModal("edit")} className={btnGhost}><IconPencil size={16} aria-hidden="true" />Ubah laporan</button>
              <button onClick={remove} className={btnDanger}><IconTrash size={16} aria-hidden="true" />Hapus</button>
            </div>
          )}
        </div>
      </div>
      {modal === "edit" && <ChangeModal item={item} onClose={() => setModal(null)} onDone={load} />}
      {modal === "cover" && <ChangeCoverModal id={item.id} onClose={() => setModal(null)} onDone={load} />}
    </article>
  );
}