import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import Modal from "./Modal";
import ReportForm from "./ReportForm";
import { asyncChangeLostFound } from "../states/action";

export default function ChangeModal({ item, onClose, onDone }) {
  const dispatch = useDispatch();
  const submit = async (form) => { if (await Promise.resolve(dispatch(asyncChangeLostFound(item.id, form)))) { onClose(); onDone(); } };
  return <Modal title="Ubah laporan" onClose={onClose}><ReportForm initial={item} withCompleted submitLabel="Simpan perubahan" onSubmit={submit} /></Modal>;
}

ChangeModal.propTypes = {
  item: PropTypes.shape({ id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired }).isRequired,
  onClose: PropTypes.func.isRequired,
  onDone: PropTypes.func.isRequired,
};
