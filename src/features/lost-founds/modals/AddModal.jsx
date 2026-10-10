import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import Modal from "./Modal";
import ReportForm from "./ReportForm";
import { asyncAddLostFound } from "../states/action";

export default function AddModal({ onClose, onDone }) {
  const dispatch = useDispatch();
  const submit = async (form) => { if (await Promise.resolve(dispatch(asyncAddLostFound(form)))) { onClose(); onDone(); } };
  return <Modal title="Tambah laporan" onClose={onClose}><ReportForm submitLabel="Simpan laporan" onSubmit={submit} /></Modal>;
}

AddModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onDone: PropTypes.func.isRequired,
};
