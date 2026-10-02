import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { asyncGetLostFound, asyncDeleteLostFound } from "../states/action";
import { coverUrl, formatDate } from "../../../helpers/toolsHelper";
import { StatusBadge } from "./HomePage";
import ChangeModal from "../modals/ChangeModal";
import ChangeCoverModal from "../modals/ChangeCoverModal";

export default function DetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const item = useSelector((s) => s.lostFounds.lostFound);
  const me = useSelector((s) => s.auth.user);
  const [modal, setModal] = useState(null);
  const load = () => dispatch(asyncGetLostFound(id));
  useEffect(() => { load(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!item) return <p className="text-slate-500">Memuat laporan...</p>;
  const owner = me && me.id === item.user_id;
  const remove = async () => { if (await dispatch(asyncDeleteLostFound(item.id))) navigate("/"); };

  return (
    <article className="max-w-2xl space-y-4">
      <Link to="/" className="text-sm font-medium text-teal-700">← Kembali ke daftar</Link>
      {coverUrl(item.cover) ? <img src={coverUrl(item.cover)} alt={item.title} className="max-h-96 w-full rounded-xl object-contain bg-slate-100" /> : <div className="flex h-48 items-center justify-center rounded-xl bg-slate-100 text-slate-600">Belum ada foto</div>}
      <div className="flex items-center gap-2"><StatusBadge status={item.status} /><span className="text-sm text-slate-500">{item.is_completed === 1 ? "Selesai" : "Dalam proses"}</span></div>
      <h1 className="text-3xl font-extrabold">{item.title}</h1>
      <p className="whitespace-pre-line text-slate-700">{item.description}</p>
      <p className="text-sm text-slate-500">Dilaporkan oleh {item.author?.name} pada {formatDate(item.created_at)}</p>
      {owner && (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setModal("cover")} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">Ganti cover</button>
          <button onClick={() => setModal("edit")} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">Ubah laporan</button>
          <button onClick={remove} className="rounded-lg bg-rose-700 px-3 py-2 text-sm font-semibold text-white">Hapus</button>
        </div>
      )}
      {modal === "edit" && <ChangeModal item={item} onClose={() => setModal(null)} onDone={load} />}
      {modal === "cover" && <ChangeCoverModal id={item.id} onClose={() => setModal(null)} onDone={load} />}
    </article>
  );
}
