import { useState } from "react";
import useInput from "../../../hooks/useInput";
import { inputCls } from "../../auth/pages/LoginPage";

export default function ReportForm({ initial = {}, withCompleted, submitLabel, onSubmit }) {
  const [title, setTitle] = useInput(initial.title || "");
  const [description, setDescription] = useInput(initial.description || "");
  const [status, setStatus] = useInput(initial.status || "lost");
  const [done, setDone] = useState(initial.is_completed === 1);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const form = { title, description, status };
    if (withCompleted) form.is_completed = done ? 1 : 0;
    await onSubmit(form);
    setBusy(false);
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <label className="block text-sm font-medium">Judul<input required className={inputCls} value={title} onChange={setTitle} /></label>
      <label className="block text-sm font-medium">Deskripsi<textarea required rows={3} className={inputCls} value={description} onChange={setDescription} /></label>
      <label className="block text-sm font-medium">Jenis laporan
        <select className={inputCls} value={status} onChange={setStatus}><option value="lost">Barang hilang</option><option value="found">Barang ditemukan</option></select>
      </label>
      {withCompleted && <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={done} onChange={(e) => setDone(e.target.checked)} />Sudah selesai</label>}
      <button disabled={busy} className="w-full rounded-lg bg-teal-700 py-2 font-semibold text-white hover:bg-teal-800 disabled:opacity-60">{busy ? "Menyimpan..." : submitLabel}</button>
    </form>
  );
}