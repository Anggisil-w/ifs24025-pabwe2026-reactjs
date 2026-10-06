import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import Modal from "./Modal";
import { asyncChangeCover } from "../states/action";
import { btnPrimary } from "../../../helpers/uiClasses";

export default function ChangeCoverModal({ id, onClose, onDone }) {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  const submit = async () => { if (await dispatch(asyncChangeCover(id, file))) { onClose(); onDone(); } };
  return (
    <Modal title="Ganti cover" onClose={onClose}>
      <input id="cover-file" name="cover" aria-label="Pilih foto cover" type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0] ?? null)} className="mb-3 block w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-teal-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-teal-700 hover:border-teal-400 hover:file:bg-teal-100" />
      {preview && <img src={preview} alt="Pratinjau cover" className="mb-3 max-h-56 w-full rounded-xl bg-slate-100 object-contain" />}
      <button disabled={!file} onClick={submit} className={`${btnPrimary} w-full`}>Unggah cover</button>
    </Modal>
  );
}