import { useState } from "react";
import PropTypes from "prop-types";
import useInput from "../../../hooks/useInput";
import { btnPrimary, inputCls } from "../../../helpers/uiClasses";

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
    <form onSubmit={submit} className="space-y-4">
      <label className="block text-sm font-medium text-slate-700">Judul<input placeholder="Mis. Dompet hitam" id="report-title" name="title" required className={inputCls} value={title} onChange={setTitle} /></label>
      <label className="block text-sm font-medium text-slate-700">Deskripsi<textarea placeholder="Ciri-ciri, lokasi, dan waktu kejadian" id="report-description" name="description" required rows={3} className={inputCls} value={description} onChange={setDescription} /></label>
      <label className="block text-sm font-medium text-slate-700">Jenis laporan <select id="report-status" name="status" aria-label="Jenis laporan" className={inputCls} value={status} onChange={setStatus}><option value="lost">Barang hilang</option><option value="found">Barang ditemukan</option></select></label>
      {withCompleted && <label className="flex items-center gap-2.5 rounded-xl bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-700"><input id="report-done" name="done" type="checkbox" className="h-4 w-4 accent-teal-700" checked={done} onChange={(e) => setDone(e.target.checked)} />Sudah selesai</label>}
      <button disabled={busy} className={`${btnPrimary} w-full`}>{busy ? "Menyimpan..." : submitLabel}</button>
    </form>
  );
}

ReportForm.propTypes = {
  initial: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    status: PropTypes.string,
    is_completed: PropTypes.number,
  }),
  withCompleted: PropTypes.bool,
  submitLabel: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
