import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Modal from "./Modal";
import { asyncChangeCover } from "../states/action";

export default function ChangeCoverModal({ id, onClose, onDone }) {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  useEffect(() => {
    if (!file) return setPreview(null);
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const submit = async () => { if (await dispatch(asyncChangeCover(id, file))) { onClose(); onDone(); } };
  return (
    <Modal title="Ganti cover" onClose={onClose}>
      <input id="cover-file" name="cover" aria-label="Pilih foto cover" type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0] ?? null)} className="mb-3 block w-full text-sm" />
      {preview && <img src={preview} alt="Pratinjau cover" className="mb-3 max-h-56 w-full rounded-lg object-contain bg-slate-100" />}
      <button disabled={!file} onClick={submit} className="w-full rounded-lg bg-teal-700 py-2 font-semibold text-white disabled:opacity-50">Unggah cover</button>
    </Modal>
  );
}