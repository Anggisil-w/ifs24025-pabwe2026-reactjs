import { useDispatch } from "react-redux";
import Modal from "./Modal";
import ReportForm from "./ReportForm";
import { asyncChangeLostFound } from "../states/action";

export default function ChangeModal({ item, onClose, onDone }) {
  const dispatch = useDispatch();
  const submit = async (form) => { if (await dispatch(asyncChangeLostFound(item.id, form))) { onClose(); onDone(); } };
  return <Modal title="Ubah laporan" onClose={onClose}><ReportForm initial={item} withCompleted submitLabel="Simpan perubahan" onSubmit={submit} /></Modal>;
}