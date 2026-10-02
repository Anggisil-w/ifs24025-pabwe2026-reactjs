import { useDispatch } from "react-redux";
import Modal from "./Modal";
import ReportForm from "./ReportForm";
import { asyncAddLostFound } from "../states/action";

export default function AddModal({ onClose, onDone }) {
  const dispatch = useDispatch();
  const submit = async (form) => { if (await dispatch(asyncAddLostFound(form))) { onClose(); onDone(); } };
  return <Modal title="Tambah laporan" onClose={onClose}><ReportForm submitLabel="Simpan laporan" onSubmit={submit} /></Modal>;
}
